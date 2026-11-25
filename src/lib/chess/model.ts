// Le modèle d'échecs brimkern dans l'onglet : UN bloc de transformeur bouclé (scripts/chess/model.py).
//
// Chargement : le .brik entier (quelques centaines de Ko) est lu d'un bloc et décodé par le codec du
// dépôt (decodeTensor : f16 / q8 → f32). Les têtes (politique, valeur) et les plongements restent sur
// le CPU — ~30 K paramètres ; le tronc (le bloc, appliqué `loops` fois) tourne sur le GPU avec les
// kernels du chemin T5 de LTX-Video : rmsnorm, matmulT, attentionBias, geglu, add. Aucun kernel neuf.
//
// Les trois garde-fous du dépôt (AGENTS.md § 2), au niveau du MODÈLE :
//   1. référence CPU : forwardCpu, le réseau entier en JS — exécuté au chargement sur des positions
//      réelles et comparé au GPU ; l'écart pose le gate `gpuOk` ;
//   2. repli : gate tombé, ou briques T5 coupées (engine.ltxOk), ou pas de WebGPU → tout sur le CPU
//      (plus lent, jamais une erreur à l'écran) ;
//   3. kill-switch : ?chessgpu=0 → le bras témoin CPU.
// Lot de positions (MCTS) : les opérations ligne à ligne passent sur B×65 lignes d'un coup ; seule
// l'attention se fait position par position, sur des tranches copiées (session.copy).

import type { WebGpuEngine } from '../webgpu/kernels';
import { parseBrik } from '../brik/container';
import { decodeTensor } from '../brik/codec';
import { urlFlag } from '../webgpu/urlFlags';
import type { Encoded } from './encode';

type Buf = any;
const L = 65;

export interface ChessCfg { d: number; heads: number; ff: number; dp: number; loops: number; rms_eps: number; ternary?: boolean; step?: number }
export interface Evaluation { logits: Float32Array; value: number } // value = P(gain) du trait

const BLOCK = ['block.n1', 'block.q', 'block.k', 'block.v', 'block.o', 'block.n2', 'block.wi0', 'block.wi1', 'block.wo', 'norm'] as const;

export class ChessModel {
	readonly cfg: ChessCfg;
	readonly bytes: number;
	private w: Record<string, Float32Array>;
	private bias: Float32Array; // [H, 65, 65], reconstruit du biais relatif compact
	private engine: WebGpuEngine | null = null;
	private gpuW: Record<string, Buf> | null = null;
	private gpuBias: Buf = null;
	gpuOk = false;
	backend: 'webgpu' | 'cpu' = 'cpu';
	loops: number;

	private constructor(cfg: ChessCfg, w: Record<string, Float32Array>, bytes: number) {
		this.cfg = cfg; this.w = w; this.bytes = bytes; this.loops = cfg.loops;
		this.bias = ChessModel.buildBias(w['attn.rel'], w['attn.meta'], cfg.heads);
	}

	// Table [H, 65, 65] depuis rel [H, 225] (décalage (dx, dy) entre cases) et meta [H, 3]
	// (case→roques, roques→case, roques→roques) — même construction que ChessNet.attn_bias.
	static buildBias(rel: Float32Array, meta: Float32Array, H: number): Float32Array {
		const b = new Float32Array(H * L * L);
		for (let h = 0; h < H; h++) {
			const o = h * L * L;
			for (let i = 0; i < 64; i++) {
				const fi = i % 8, ri = i >> 3;
				for (let j = 0; j < 64; j++) {
					const dx = (j % 8) - fi + 7, dy = (j >> 3) - ri + 7;
					b[o + i * L + j] = rel[h * 225 + dx * 15 + dy];
				}
				b[o + i * L + 64] = meta[h * 3];
				b[o + 64 * L + i] = meta[h * 3 + 1];
			}
			b[o + 64 * L + 64] = meta[h * 3 + 2];
		}
		return b;
	}

	static async load(url: string, engine?: WebGpuEngine | null): Promise<ChessModel> {
		const resp = await fetch(url);
		if (!resp.ok) throw new Error(`chess model: HTTP ${resp.status}`);
		const bytes = new Uint8Array(await resp.arrayBuffer());
		const { manifest, data } = parseBrik(bytes);
		if (manifest.model.uiArch !== 'chess' || !manifest.chess) throw new Error('chess model: not a chess BRIK');
		const cfg = manifest.chess as unknown as ChessCfg;
		const starts: number[] = [];
		let off = 0;
		for (const sh of [...manifest.shards].sort((a, b) => a.id - b.id)) { starts[sh.id] = off; off += sh.byteLength; }
		const w: Record<string, Float32Array> = {};
		for (const [name, t] of Object.entries(manifest.tensors)) {
			const at = starts[t.shard] + t.offset;
			w[name] = decodeTensor(data.subarray(at, at + t.byteLength), t.nElems, t.dtype);
		}
		const m = new ChessModel(cfg, w, bytes.length);
		if (engine) await m.attachGpu(engine);
		return m;
	}

	// GPU : uploads + validation contre la référence CPU sur des positions réelles. Gate tombé → CPU.
	private async attachGpu(engine: WebGpuEngine): Promise<void> {
		if (urlFlag('chessgpu') === '0') { console.warn('[chess] GPU COUPÉ par ?chessgpu=0 : tronc sur le CPU'); return; }
		if (!(engine as any).ltxOk) { console.warn('[chess] briques T5 coupées (selfValidate ou ?ltx=0) : tronc sur le CPU'); return; }
		this.engine = engine;
		this.gpuW = {};
		for (const n of BLOCK) this.gpuW[n] = engine.uploadGpu(this.w[n]);
		this.gpuBias = engine.uploadGpu(this.bias);
		try {
			const probe = VALIDATION_POSITIONS;
			const gpu = await this.trunkGpu(probe);
			let worst = 0;
			for (let i = 0; i < probe.length; i++) {
				const ref = this.trunkCpu(probe[i]);
				let num = 0, den = 0;
				for (let j = 0; j < ref.length; j++) { const e = gpu[i][j] - ref[j]; num += e * e; den += ref[j] * ref[j]; }
				worst = Math.max(worst, Math.sqrt(num / Math.max(den, 1e-12)));
			}
			this.gpuOk = worst < 2e-3;
			if (this.gpuOk) console.log(`[chess] tronc GPU validé contre le CPU (écart relatif max ${worst.toExponential(1)})`);
			else console.warn(`[chess] tronc GPU KO (écart relatif ${worst.toExponential(1)}) : repli CPU`);
		} catch (e) {
			console.warn('[chess] tronc GPU en échec, repli CPU :', e);
			this.gpuOk = false;
		}
		if (!this.gpuOk) this.releaseGpu();
		this.backend = this.gpuOk ? 'webgpu' : 'cpu';
	}

	private releaseGpu(): void {
		if (!this.engine) return;
		const bufs = [...Object.values(this.gpuW ?? {}), this.gpuBias].filter(Boolean);
		this.engine.releaseGpu(bufs);
		this.gpuW = null; this.gpuBias = null; this.engine = null;
	}

	dispose(): void { this.releaseGpu(); }

	// Plongements (CPU) : [65, d].
	private embed(x: Encoded): Float32Array {
		const { d } = this.cfg, w = this.w, out = new Float32Array(L * d);
		const piece = w['embed.piece'], square = w['embed.square'], ep = w['embed.ep'], castle = w['embed.castle'];
		for (let s = 0; s < 64; s++) {
			const p = x.pieces[s] * d, q = s * d, o = s * d;
			for (let i = 0; i < d; i++) out[o + i] = piece[p + i] + square[q + i];
			if (s === x.ep) for (let i = 0; i < d; i++) out[o + i] += ep[i];
		}
		const c = x.castle * d, o = 64 * d;
		for (let i = 0; i < d; i++) out[o + i] = castle[c + i];
		return out;
	}

	// ── Référence CPU : le tronc entier (bloc × loops + norme finale) → [65, d]. ─────────────────────
	trunkCpu(x: Encoded): Float32Array {
		const { d, heads: H, ff, rms_eps: eps } = this.cfg, w = this.w, dk = d / H;
		const h = this.embed(x);
		const rms = (a: Float32Array, g: Float32Array) => {
			const o = new Float32Array(a.length);
			for (let r = 0; r < L; r++) {
				let ss = 0; for (let i = 0; i < d; i++) ss += a[r * d + i] * a[r * d + i];
				const inv = 1 / Math.sqrt(ss / d + eps);
				for (let i = 0; i < d; i++) o[r * d + i] = a[r * d + i] * inv * g[i];
			}
			return o;
		};
		const mm = (a: Float32Array, W: Float32Array, k: number, n: number) => {
			const o = new Float32Array(L * n);
			for (let r = 0; r < L; r++) for (let j = 0; j < n; j++) {
				let acc = 0; const ar = r * k, wr = j * k;
				for (let i = 0; i < k; i++) acc += a[ar + i] * W[wr + i];
				o[r * n + j] = acc;
			}
			return o;
		};
		for (let t = 0; t < this.loops; t++) {
			let a = rms(h, w['block.n1']);
			const q = mm(a, w['block.q'], d, d), k = mm(a, w['block.k'], d, d), v = mm(a, w['block.v'], d, d);
			const att = new Float32Array(L * d), sc = new Float32Array(L);
			for (let hh = 0; hh < H; hh++) for (let i = 0; i < L; i++) {
				let mx = -Infinity;
				for (let j = 0; j < L; j++) {
					let acc = 0;
					for (let e = 0; e < dk; e++) acc += q[i * d + hh * dk + e] * k[j * d + hh * dk + e];
					sc[j] = acc + this.bias[(hh * L + i) * L + j]; if (sc[j] > mx) mx = sc[j];
				}
				let den = 0; for (let j = 0; j < L; j++) { sc[j] = Math.exp(sc[j] - mx); den += sc[j]; }
				for (let e = 0; e < dk; e++) {
					let acc = 0; for (let j = 0; j < L; j++) acc += sc[j] * v[j * d + hh * dk + e];
					att[i * d + hh * dk + e] = acc / den;
				}
			}
			const o = mm(att, w['block.o'], d, d);
			for (let i = 0; i < h.length; i++) h[i] += o[i];
			a = rms(h, w['block.n2']);
			const g = mm(a, w['block.wi0'], d, ff), u = mm(a, w['block.wi1'], d, ff);
			for (let i = 0; i < g.length; i++) {
				const x0 = g[i];
				g[i] = 0.5 * x0 * (1 + Math.tanh(0.7978845608028654 * (x0 + 0.044715 * x0 * x0 * x0))) * u[i];
			}
			const f = mm(g, w['block.wo'], ff, d);
			for (let i = 0; i < h.length; i++) h[i] += f[i];
		}
		return rms(h, w['norm']);
	}

	// ── Tronc GPU, en lot : B positions → B sorties [65, d]. ─────────────────────────────────────────
	private async trunkGpu(xs: Encoded[]): Promise<Float32Array[]> {
		const e = this.engine!, W = this.gpuW!, { d, heads: H, ff, rms_eps: eps } = this.cfg;
		const B = xs.length, R = B * L, seq = L * d * 4;
		const x0 = new Float32Array(R * d);
		xs.forEach((x, b) => x0.set(this.embed(x), b * L * d));
		const x0buf = e.uploadGpu(x0);
		const s = e.recordingSession();
		let h: Buf = x0buf;
		for (let t = 0; t < this.loops; t++) {
			let a = s.rmsnorm(h, W['block.n1'], R, d, eps);
			const q = s.matmulT(a, W['block.q'], R, d, d), k = s.matmulT(a, W['block.k'], R, d, d), v = s.matmulT(a, W['block.v'], R, d, d);
			let att: Buf;
			if (B === 1) att = s.attentionBias(q, k, v, this.gpuBias, L, H, d / H);
			else {
				att = s.alloc(R * d * 4);
				for (let b = 0; b < B; b++) {
					const qb = s.alloc(seq), kb = s.alloc(seq), vb = s.alloc(seq);
					s.copy(qb, 0, q, b * seq, seq); s.copy(kb, 0, k, b * seq, seq); s.copy(vb, 0, v, b * seq, seq);
					s.copy(att, b * seq, s.attentionBias(qb, kb, vb, this.gpuBias, L, H, d / H), 0, seq);
				}
			}
			const h2 = s.add(h, s.matmulT(att, W['block.o'], R, d, d), R * d);
			a = s.rmsnorm(h2, W['block.n2'], R, d, eps);
			const g = s.matmulT(a, W['block.wi0'], R, d, ff), u = s.matmulT(a, W['block.wi1'], R, d, ff);
			h = s.add(h2, s.matmulT(s.geglu(g, u, R * ff), W['block.wo'], R, ff, d), R * d);
		}
		const out = await s.finish(s.rmsnorm(h, W['norm'], R, d, eps), R * d);
		e.releaseGpu([x0buf]);
		return xs.map((_, b) => out.subarray(b * L * d, (b + 1) * L * d));
	}

	// ── Têtes (CPU) : politique [4096] et valeur. ────────────────────────────────────────────────────
	heads(hidden: Float32Array): Evaluation {
		const { d, dp } = this.cfg, w = this.w, pq = w['policy.q'], pk = w['policy.k'];
		const q = new Float32Array(64 * dp), k = new Float32Array(64 * dp);
		for (let s = 0; s < 64; s++) for (let j = 0; j < dp; j++) {
			let aq = 0, ak = 0; const hs = s * d, wr = j * d;
			for (let i = 0; i < d; i++) { aq += hidden[hs + i] * pq[wr + i]; ak += hidden[hs + i] * pk[wr + i]; }
			q[s * dp + j] = aq; k[s * dp + j] = ak;
		}
		const logits = new Float32Array(4096), sc = 1 / Math.sqrt(dp);
		for (let f = 0; f < 64; f++) for (let t = 0; t < 64; t++) {
			let acc = 0; for (let j = 0; j < dp; j++) acc += q[f * dp + j] * k[t * dp + j];
			logits[f * 64 + t] = acc * sc;
		}
		let v = w['value.b'][0];
		const vw = w['value.w'];
		for (let i = 0; i < d; i++) { let m = 0; for (let r = 0; r < L; r++) m += hidden[r * d + i]; v += (m / L) * vw[i]; }
		return { logits, value: 1 / (1 + Math.exp(-v)) };
	}

	async evaluate(xs: Encoded[]): Promise<Evaluation[]> {
		if (this.gpuOk) {
			try { return (await this.trunkGpu(xs)).map((h) => this.heads(h)); }
			catch (e) { console.warn('[chess] tronc GPU en échec en cours de partie, repli CPU :', e); this.gpuOk = false; this.backend = 'cpu'; this.releaseGpu(); }
		}
		return xs.map((x) => this.heads(this.trunkCpu(x)));
	}
}

// Positions de validation : départ, milieu de partie avec roques et prise en passant possible, finale.
// Encodées à la main pour ne pas dépendre de chess.js au chargement du modèle.
const VALIDATION_POSITIONS: Encoded[] = (() => {
	const fromRows = (rows: string[], castle: number, ep: number): Encoded => {
		const map: Record<string, number> = { P: 1, N: 2, B: 3, R: 4, Q: 5, K: 6, p: 7, n: 8, b: 9, r: 10, q: 11, k: 12 };
		const pieces = new Int32Array(64);
		rows.forEach((row, r) => [...row].forEach((c, f) => { if (c !== '.') pieces[(7 - r) * 8 + f] = map[c]; }));
		return { pieces, castle, ep, flip: 0 };
	};
	return [
		fromRows(['rnbqkbnr', 'pppppppp', '........', '........', '........', '........', 'PPPPPPPP', 'RNBQKBNR'], 15, 64),
		fromRows(['r...k..r', 'ppp..ppp', '..n.bn..', '...pP...', '..B.....', '..N..N..', 'PPP..PPP', 'R..QK..R'], 15, 43),
		fromRows(['........', '....k...', '........', '...p....', '........', '....K...', '....R...', '........'], 0, 64),
	];
})();
