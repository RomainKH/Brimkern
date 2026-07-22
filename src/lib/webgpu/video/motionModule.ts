// Module MOTION AnimateDiff (TransformerTemporalModel) pour le navigateur — étape 3b du chantier
// vidéo (docs/video-gen-feasibility.md). Sémantique VERROUILLÉE par scripts/video-motion-ref.cjs
// (cosine 0,9998 vs l'oracle diffusers sur les poids q8) : GroupNorm(32) → (H·W, F, C) → proj_in →
// [LayerNorm + pos_embed → attn1 temporelle → LayerNorm + pos_embed (les DEUX attentions) → attn2 →
// LayerNorm → GEGLU] → proj_out → + résidu, 8 têtes.
// DEUX chemins : forward() = POC CPU-orchestré (matmulQ8 résidents + glu JS + readback, byte-identique
// à l'oracle, gardé comme repli) ; forwardResident() = 100 % GPU dans UNE recordingSession (zéro
// readback, glu portée sur les kernels video_motion_gather/scatter + video_add_pe + attn_temporal +
// group_norm/layernorm/geglu_split existants), gaté par videoResidentOk. Classe PURE (engine + poids
// injectés) — un module par instance, 21 instances par UNet vidéo.

import type { WebGpuEngine } from '../kernels';

type GPUAny = any;
export interface MotionWeights { get(name: string): { data: Float32Array; shape: number[] } | undefined }

interface Q8Res { codes: GPUAny; sc: GPUAny; IN: number; OUT: number; }

const gelu = (v: number) => 0.5 * v * (1 + Math.tanh(0.7978845608028654 * (v + 0.044715 * v * v * v)));

export class MotionModule {
	private g = new Map<string, Q8Res>();       // grosses projections q8 résidentes GPU
	private w = new Map<string, Float32Array>(); // normes, biais, pos_embed (JS)
	private C!: number; private HEADS = 8; private HD!: number;

	// `raw` : accès aux tenseurs BRIK du module (préfixe déjà retiré) — q8 packés pour les 2D,
	// f32 décodés pour le reste. `upload` : les blobs q8 {codes, scales} montent une fois sur le GPU.
	constructor(private engine: WebGpuEngine) {}

	load(C: number, tensors: { name: string; dtype: string; f32?: Float32Array; q8?: { codes: Uint8Array; scales: Uint8Array } ; shape: number[] }[]): void {
		this.C = C; this.HD = C / this.HEADS;
		for (const t of tensors) {
			if (t.q8) {
				const IN = t.shape[t.shape.length - 1], OUT = t.shape[0];
				this.g.set(t.name, { codes: this.engine.uploadGpuRaw(t.q8.codes), sc: this.engine.uploadGpuRaw(t.q8.scales), IN, OUT });
			} else if (t.f32) this.w.set(t.name, t.f32);
		}
	}
	unload(): void { for (const e of this.g.values()) { e.codes?.destroy?.(); e.sc?.destroy?.(); } this.g.clear(); this.w.clear(); }

	private async mm(name: string, x: Float32Array, rows: number): Promise<Float32Array> {
		const W = this.g.get(name + '.weight');
		if (!W) { // repli CPU (poids resté f32 — ne devrait pas arriver en q8)
			const M = this.w.get(name + '.weight')!;
			const IN = x.length / rows, OUT = M.length / IN, y = new Float32Array(rows * OUT);
			for (let r = 0; r < rows; r++) for (let o = 0; o < OUT; o++) { let s = 0; for (let i = 0; i < IN; i++) s += x[r * IN + i] * M[o * IN + i]; y[r * OUT + o] = s; }
			return this.bias(y, rows, OUT, name);
		}
		const y = await this.engine.matmulQ8(x, W.codes, W.sc, rows, W.IN, W.OUT);
		return this.bias(y, rows, W.OUT, name);
	}
	private bias(y: Float32Array, rows: number, OUT: number, name: string): Float32Array {
		const b = this.w.get(name + '.bias');
		if (b) for (let r = 0; r < rows; r++) for (let o = 0; o < OUT; o++) y[r * OUT + o] += b[o];
		return y;
	}

	private layerNorm(x: Float32Array, rows: number, g: Float32Array, b: Float32Array): Float32Array {
		const C = this.C, out = new Float32Array(x.length);
		for (let r = 0; r < rows; r++) {
			let m = 0; for (let i = 0; i < C; i++) m += x[r * C + i]; m /= C;
			let v = 0; for (let i = 0; i < C; i++) { const d = x[r * C + i] - m; v += d * d; } v /= C;
			const inv = 1 / Math.sqrt(v + 1e-5);
			for (let i = 0; i < C; i++) out[r * C + i] = (x[r * C + i] - m) * inv * g[i] + b[i];
		}
		return out;
	}

	private async attn(prefix: string, x: Float32Array, S: number, F: number): Promise<Float32Array> {
		const C = this.C, HD = this.HD, rows = S * F;
		const q = await this.mm(prefix + '.to_q', x, rows);
		const k = await this.mm(prefix + '.to_k', x, rows);
		const v = await this.mm(prefix + '.to_v', x, rows);
		const y = new Float32Array(rows * C), scale = 1 / Math.sqrt(HD);
		for (let s = 0; s < S; s++) for (let h = 0; h < this.HEADS; h++) {
			const hb = h * HD;
			for (let ti = 0; ti < F; ti++) {
				const qb = (s * F + ti) * C + hb;
				const sc = new Float32Array(F); let mx = -1e30;
				for (let tj = 0; tj < F; tj++) { let d = 0; const kb = (s * F + tj) * C + hb; for (let i = 0; i < HD; i++) d += q[qb + i] * k[kb + i]; sc[tj] = d * scale; if (sc[tj] > mx) mx = sc[tj]; }
				let sum = 0; for (let tj = 0; tj < F; tj++) { sc[tj] = Math.exp(sc[tj] - mx); sum += sc[tj]; }
				for (let tj = 0; tj < F; tj++) { const p = sc[tj] / sum, vb = (s * F + tj) * C + hb; for (let i = 0; i < HD; i++) y[qb + i] += p * v[vb + i]; }
			}
		}
		return this.mm(prefix + '.to_out.0', y, rows);
	}

	// x : latents (F, C, H, W) aplatis — retourne la même forme, résidu inclus.
	async forward(x: Float32Array, F: number, H: number, W: number): Promise<Float32Array> {
		if (!(this.engine as { videoOk?: boolean }).videoOk) throw new Error('chemin vidéo coupé (?video=0 ou selfValidate)');
		const C = this.C, S = H * W;
		// GroupNorm(32) sur (F, C, S)
		const gN = this.w.get('norm.weight')!, bN = this.w.get('norm.bias')!;
		const gn = new Float32Array(x.length), groups = 32, cpg = C / groups;
		for (let f = 0; f < F; f++) for (let g = 0; g < groups; g++) {
			let m = 0; const n = cpg * S;
			for (let c = g * cpg; c < (g + 1) * cpg; c++) for (let s = 0; s < S; s++) m += x[(f * C + c) * S + s];
			m /= n;
			let vv = 0;
			for (let c = g * cpg; c < (g + 1) * cpg; c++) for (let s = 0; s < S; s++) { const d = x[(f * C + c) * S + s] - m; vv += d * d; }
			vv /= n;
			const inv = 1 / Math.sqrt(vv + 1e-6);
			for (let c = g * cpg; c < (g + 1) * cpg; c++) for (let s = 0; s < S; s++) { const i = (f * C + c) * S + s; gn[i] = (x[i] - m) * inv * gN[c] + bN[c]; }
		}
		// (F,C,S) → (S·F, C)
		const seq = new Float32Array(S * F * C);
		for (let f = 0; f < F; f++) for (let c = 0; c < C; c++) for (let s = 0; s < S; s++) seq[(s * F + f) * C + c] = gn[(f * C + c) * S + s];
		let h = await this.mm('proj_in', seq, S * F);
		const pe = this.w.get('transformer_blocks.0.pos_embed.pe')!;
		const addPe = (t: Float32Array) => { const o = t.slice(); for (let s = 0; s < S; s++) for (let f = 0; f < F; f++) for (let c = 0; c < C; c++) o[(s * F + f) * C + c] += pe[f * C + c]; return o; };
		// attn1 puis attn2 — pos_embed sur LES DEUX (discriminant mesuré : sans, cosine 0,88)
		for (const a of ['attn1', 'attn2'] as const) {
			const nIdx = a === 'attn1' ? '1' : '2';
			let nh = this.layerNorm(h, S * F, this.w.get(`transformer_blocks.0.norm${nIdx}.weight`)!, this.w.get(`transformer_blocks.0.norm${nIdx}.bias`)!);
			nh = addPe(nh);
			const out = await this.attn(`transformer_blocks.0.${a}`, nh, S, F);
			for (let i = 0; i < h.length; i++) h[i] += out[i];
		}
		// FFN GEGLU
		const nh = this.layerNorm(h, S * F, this.w.get('transformer_blocks.0.norm3.weight')!, this.w.get('transformer_blocks.0.norm3.bias')!);
		const proj = await this.mm('transformer_blocks.0.ff.net.0.proj', nh, S * F);
		const half = (proj.length / (S * F)) / 2;
		const gg = new Float32Array(S * F * half);
		for (let r = 0; r < S * F; r++) for (let i = 0; i < half; i++) gg[r * half + i] = proj[r * 2 * half + i] * gelu(proj[r * 2 * half + half + i]);
		const ffo = await this.mm('transformer_blocks.0.ff.net.2', gg, S * F);
		for (let i = 0; i < h.length; i++) h[i] += ffo[i];
		// proj_out + retour (F,C,S) + résidu
		h = await this.mm('proj_out', h, S * F);
		const out = new Float32Array(F * C * S);
		for (let f = 0; f < F; f++) for (let c = 0; c < C; c++) for (let s = 0; s < S; s++) out[(f * C + c) * S + s] = h[(s * F + f) * C + c] + x[(f * C + c) * S + s];
		return out;
	}

	// Forward 100 % RÉSIDENT : entrée/sortie = F buffers GPU par frame (C,S), TOUT enchaîné dans une
	// seule recordingSession (zéro readback, zéro glu JS). Même graphe que forward() : groupnorm par
	// frame → gather (F,C,S)→(S·F,C) → proj_in → [LN + PE + attn_temporal]×2 → LN + GEGLU → proj_out →
	// scatter+résidu → split en F frames. Réservé au chemin résident (gaté par videoResidentOk côté
	// unetForwardVideo) ; forward() reste le repli byte-identique.
	async forwardResident(frames: GPUAny[], F: number, H: number, W: number): Promise<GPUAny[]> {
		if (!(this.engine as { videoOk?: boolean }).videoOk) throw new Error('chemin vidéo coupé (?video=0 ou selfValidate)');
		const C = this.C, S = H * W, CS = C * S, rows = S * F;
		const s = this.engine.recordingSession();
		// matmul q8 résident + bias optionnel, enregistré dans la session.
		const mmR = (name: string, x: GPUAny, r: number): { buf: GPUAny; OUT: number } => {
			const Wq = this.g.get(name + '.weight')!;
			let y = s.matmulT(x, Wq, r, Wq.IN, Wq.OUT);
			const b = this.w.get(name + '.bias');
			if (b) y = s.addBias(y, b, r, Wq.OUT);
			return { buf: y, OUT: Wq.OUT };
		};
		const attnR = (prefix: string, x: GPUAny): GPUAny => {
			const q = mmR(prefix + '.to_q', x, rows).buf;
			const k = mmR(prefix + '.to_k', x, rows).buf;
			const v = mmR(prefix + '.to_v', x, rows).buf;
			const y = s.attnTemporal(q, k, v, S, F, this.HEADS, this.HD);
			return mmR(prefix + '.to_out.0', y, rows).buf;
		};
		// GroupNorm par frame + concat des originaux (résidu) et des normés (entrée gather).
		const gN = this.w.get('norm.weight')!, bN = this.w.get('norm.bias')!;
		const xCat = s.alloc(F * CS * 4), gnCat = s.alloc(F * CS * 4);
		for (let f = 0; f < F; f++) {
			s.copy(xCat, f * CS * 4, frames[f], 0, CS * 4);
			s.copy(gnCat, f * CS * 4, s.groupNorm(frames[f], gN, bN, C, S, 32, 1e-6), 0, CS * 4);
		}
		const seq = s.videoGather(gnCat, F, C, S);        // (S·F, C)
		let h = mmR('proj_in', seq, rows).buf;
		const pe = this.w.get('transformer_blocks.0.pos_embed.pe')!;
		for (const a of ['attn1', 'attn2'] as const) {
			const nIdx = a === 'attn1' ? '1' : '2';
			let nh = s.layernorm(h, this.w.get(`transformer_blocks.0.norm${nIdx}.weight`)!, this.w.get(`transformer_blocks.0.norm${nIdx}.bias`)!, rows, C, 1e-5);
			nh = s.videoAddPe(nh, pe, F, C, S);
			h = s.add(h, attnR(`transformer_blocks.0.${a}`, nh), rows * C);
		}
		// FFN GEGLU (net.0.proj → geglu_split → net.2)
		const nh3 = s.layernorm(h, this.w.get('transformer_blocks.0.norm3.weight')!, this.w.get('transformer_blocks.0.norm3.bias')!, rows, C, 1e-5);
		const proj = mmR('transformer_blocks.0.ff.net.0.proj', nh3, rows);
		const gg = s.gegluSplit(proj.buf, rows, proj.OUT / 2);
		h = s.add(h, mmR('transformer_blocks.0.ff.net.2', gg, rows).buf, rows * C);
		h = mmR('proj_out', h, rows).buf;
		// scatter (S·F,C)+résidu → (F,C,S), puis split en F buffers par frame que le caller possède.
		const outCat = s.videoScatter(h, xCat, F, C, S);
		const outFrames: GPUAny[] = [];
		for (let f = 0; f < F; f++) { const fb = s.alloc(CS * 4); s.copy(fb, 0, outCat, f * CS * 4, CS * 4); outFrames.push(fb); }
		return s.finishKeepMany(outFrames);
	}
}
