// LFM2/LFM2.5 forward pour le navigateur (moteur v2, hybride conv courte + attention). POC E2E,
// pattern RwkvModel : les GROSSES projections (in/out_proj, q/k/v/output, ffn) tournent sur le GPU
// via les matmuls résidents quantifiés + le kernel lfm2_shortconv (selfValidate) ; la glu (RMSNorm,
// qk-norm, RoPE, softmax d'attention — 6 couches seulement —, SwiGLU) est en JS, byte-identique à la
// réf CPU validée token-exact vs llama-server (scripts/lfm2-cpuref.cjs). Sémantique verrouillée
// là-bas. Le chemin 100 % résident (glu en WGSL) viendra en optimisation.
// Classe PURE (engine + manifest + rawTensor + tokenizer injecté) → réutilisable SDK, zéro DOM.

import type { WebGpuEngine, Lfm2LayerGpu, Lfm2Cfg } from './kernels';
import type { BrikManifest } from '../brik/format';
import { unpackQ4, dequantizeQ4 } from '../brik/q4web';
import { unpackQ8, dequantizeQ8 } from '../brik/q8web';
import { f16BitsToF32 } from '../brik/f16';

type GPUAny = any;
type Raw = (name: string) => Promise<Uint8Array>;
type SampleOpts = { temperature?: number; topK?: number; repeatPenalty?: number };
// Tokenizer injecté (transformers.js AutoTokenizer depuis le tokenizer.json EMBARQUÉ du manifest,
// construit par l'appelant) : encode DOIT inclure le BOS (transformers.js le fait), decode saute les spéciaux.
export interface Lfm2Tokenizer { encode(s: string): number[]; decode(ids: number[]): string }

function decodeF16(b: Uint8Array, n: number): Float32Array { const dv = new DataView(b.buffer, b.byteOffset, b.byteLength); const o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = f16BitsToF32(dv.getUint16(i * 2, true)); return o; }
function decodeF32(b: Uint8Array, n: number): Float32Array { const dv = new DataView(b.buffer, b.byteOffset, b.byteLength); const o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = dv.getFloat32(i * 4, true); return o; }
function rmsnorm(x: Float32Array, w: Float32Array, D: number, eps: number): Float32Array { let ss = 0; for (let i = 0; i < D; i++) ss += x[i] * x[i]; const s = 1 / Math.sqrt(ss / D + eps); const o = new Float32Array(D); for (let i = 0; i < D; i++) o[i] = x[i] * s * w[i]; return o; }
const silu = (v: number) => v / (1 + Math.exp(-v));

interface Q4W { kind: 'q4'; nib: GPUAny; sc: GPUAny; mn: GPUAny; IN: number; OUT: number; }
interface Q8W { kind: 'q8'; codes: GPUAny; sc: GPUAny; IN: number; OUT: number; }

export class Lfm2Model {
	private D!: number; private NH!: number; private NKV!: number; private HD!: number; private NL!: number; private vocab!: number;
	private EPS!: number; private THETA!: number; private LC!: number;
	private convLayer!: boolean[];
	private w = new Map<string, Float32Array>();      // petites matrices (conv, normes) en JS
	private g = new Map<string, Q4W | Q8W>();          // grosses projections résidentes GPU
	private embedBytes!: Uint8Array; private embedDtype!: string;
	private tok!: Lfm2Tokenizer;
	private stops!: Set<number>;
	// État : conv → (LC-1)·D f32 par couche ; attention → listes K/V (6 couches, contexte démo court).
	private state!: ({ conv: Float32Array } | { K: Float32Array[]; V: Float32Array[] })[];
	private pos = 0;
	// Chemin résident : handles de couche (grosses proj GPU + normes/conv f32 GPU) + norme finale + ffn.
	private rLayers: Lfm2LayerGpu[] = [];
	private tokNormGpu: GPUAny = null;
	private normBufs: GPUAny[] = []; // buffers f32 uploadés (normes/conv) — libérés à unload
	private ffn = 0;

	constructor(private engine: WebGpuEngine, private manifest: BrikManifest, private raw: Raw) {}

	private isBigProj(name: string): boolean {
		return /\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(name);
	}

	async load(tokenizer: Lfm2Tokenizer): Promise<void> {
		if (!(this.engine as any).lfm2ShortConvOk) throw new Error('kernel shortconv LFM2 invalidé sur ce GPU (selfValidate) — archi lfm2 refusée.');
		const a = this.manifest.arch;
		this.D = a.d; this.NH = a.nHeads; this.NKV = a.nKvHeads; this.HD = a.headDim; this.NL = a.blockCount; this.vocab = a.vocab;
		this.EPS = a.rmsEps; this.THETA = a.ropeTheta;
		if (!a.lfm2) throw new Error('manifest sans profil lfm2');
		this.LC = a.lfm2.lCache;
		this.convLayer = a.lfm2.kvHeadsPerLayer.map((kv) => kv === 0);
		this.tok = tokenizer;
		this.stops = new Set(this.manifest.chat?.stopTokenIds?.length ? this.manifest.chat.stopTokenIds : [7]);
		for (const [name, t] of Object.entries(this.manifest.tensors)) {
			if (name === 'token_embd.weight') { // tête LIÉE : bytes gardés pour le gather de lignes + résident GPU pour les logits
				this.embedBytes = await this.raw(name); this.embedDtype = t.dtype;
				if (t.dtype === 'q4') { const q = unpackQ4(this.embedBytes, t.nElems); this.g.set('head', { kind: 'q4', nib: this.engine.uploadGpuRaw(q.nibbles), sc: this.up(q.scales), mn: this.up(q.mins), IN: this.D, OUT: this.vocab }); }
				else if (t.dtype === 'q8') { const q = unpackQ8(this.embedBytes, t.nElems); this.g.set('head', { kind: 'q8', codes: this.upI8(q.codes), sc: this.up(q.scales), IN: this.D, OUT: this.vocab }); }
				// f16/f32 : repli CPU dans gemm('head')
				continue;
			}
			const bytes = await this.raw(name);
			if (this.isBigProj(name) && (t.dtype === 'q4' || t.dtype === 'q8')) {
				const IN = t.shape[0], OUT = t.nElems / IN; // ne[0]=IN contigu
				if (t.dtype === 'q8') { const q = unpackQ8(bytes, t.nElems); this.g.set(name, { kind: 'q8', codes: this.upI8(q.codes), sc: this.up(q.scales), IN, OUT }); }
				else { const q = unpackQ4(bytes, t.nElems); this.g.set(name, { kind: 'q4', nib: this.engine.uploadGpuRaw(q.nibbles), sc: this.up(q.scales), mn: this.up(q.mins), IN, OUT }); }
			} else { // petites : conv (f32), normes (f32), replis f16/q décodés en JS
				this.w.set(name, t.dtype === 'f32' ? decodeF32(bytes, t.nElems) : t.dtype === 'f16' ? decodeF16(bytes, t.nElems) : t.dtype === 'q8' ? dequantizeQ8(unpackQ8(bytes, t.nElems)) : dequantizeQ4(unpackQ4(bytes, t.nElems)));
			}
		}
		this.buildResidentLayers();
		this.reset();
	}

	// Prépare les handles du chemin résident : grosses projections déjà dans `g` (handles recMM q4/q8),
	// petites normes + conv weight uploadées une fois en buffers f32 GPU. La tête liée est g['head'].
	private buildResidentLayers(): void {
		const upN = (name: string): GPUAny => { const b = this.engine.uploadGpu(this.w.get(name)!); this.normBufs.push(b); return b; };
		this.tokNormGpu = upN('token_embd_norm.weight');
		this.ffn = (this.g.get('blk.0.ffn_gate.weight') as { OUT: number } | undefined)?.OUT ?? 0;
		this.rLayers = [];
		for (let L = 0; L < this.NL; L++) {
			const p = `blk.${L}.`;
			const base = {
				attnNorm: upN(p + 'attn_norm.weight'), ffnNorm: upN(p + 'ffn_norm.weight'),
				wgate: this.g.get(p + 'ffn_gate.weight'), wup: this.g.get(p + 'ffn_up.weight'), wdown: this.g.get(p + 'ffn_down.weight'),
			};
			if (this.convLayer[L]) {
				this.rLayers.push({ conv: true, ...base, convW: upN(p + 'shortconv.conv.weight'), inProj: this.g.get(p + 'shortconv.in_proj.weight'), outProj: this.g.get(p + 'shortconv.out_proj.weight') } as Lfm2LayerGpu);
			} else {
				this.rLayers.push({ conv: false, ...base, qNorm: upN(p + 'attn_q_norm.weight'), kNorm: upN(p + 'attn_k_norm.weight'), wq: this.g.get(p + 'attn_q.weight'), wk: this.g.get(p + 'attn_k.weight'), wv: this.g.get(p + 'attn_v.weight'), wo: this.g.get(p + 'attn_output.weight') } as Lfm2LayerGpu);
			}
		}
	}

	// true si le décodage résident est disponible : gate GPU OK + tête liée quantifiée (q4/q8) + couches prêtes.
	residentAvailable(): boolean {
		return (this.engine as { lfm2ResidentOk?: boolean }).lfm2ResidentOk !== false && !!this.g.get('head') && this.rLayers.length === this.NL && this.ffn > 0;
	}

	private cfg(): Lfm2Cfg { return { D: this.D, nHeads: this.NH, nKvHeads: this.NKV, headDim: this.HD, ffn: this.ffn, eps: this.EPS, theta: this.THETA, lc: this.LC, vocab: this.vocab }; }
	private embedsFor(tokenIds: number[]): Float32Array {
		const D = this.D, e = new Float32Array(tokenIds.length * D);
		for (let t = 0; t < tokenIds.length; t++) e.set(this.embedRow(tokenIds[t]), t * D);
		return e;
	}
	// Logits complets du dernier token, chemin résident (1 submit / 1 readback). pastLen/sessionId
	// pilotent l'état GPU comme le chemin Qwen (reset si session change ou pastLen 0).
	async logitsGpu(tokenIds: number[], pastLen: number, sessionId: string): Promise<Float32Array> {
		this.pos = pastLen + tokenIds.length;
		return this.engine.lfm2LogitsGpu(this.embedsFor(tokenIds), tokenIds.length, this.cfg(), this.rLayers, this.g.get('head'), this.tokNormGpu, pastLen, sessionId);
	}
	// Top-K GPU du dernier token (chat), 1 readback.
	async topKGpu(tokenIds: number[], pastLen: number, sessionId: string, recent: number[], penalty: number, K = 40): Promise<{ ids: Uint32Array; vals: Float32Array }> {
		this.pos = pastLen + tokenIds.length;
		return this.engine.lfm2TopKGpu(this.embedsFor(tokenIds), tokenIds.length, this.cfg(), this.rLayers, this.g.get('head'), this.tokNormGpu, pastLen, sessionId, recent, penalty, K);
	}

	private up(a: Uint16Array): GPUAny { return this.engine.uploadGpuRaw(new Uint8Array(a.buffer, a.byteOffset, a.byteLength)); }
	private upI8(a: Int8Array): GPUAny { return this.engine.uploadGpuRaw(new Uint8Array(a.buffer, a.byteOffset, a.byteLength)); }

	// Libère les buffers GPU résidents (changement de modèle dans le chat).
	unload(): void {
		for (const w of this.g.values()) for (const k of ['nib', 'sc', 'mn', 'codes'] as const) (w as any)[k]?.destroy?.();
		for (const b of this.normBufs) b?.destroy?.();
		this.normBufs = []; this.rLayers = []; this.tokNormGpu = null;
		(this.engine as { clearLfm2State?: () => void }).clearLfm2State?.();
		this.g.clear(); this.w.clear();
	}

	reset(): void {
		this.pos = 0;
		this.state = Array.from({ length: this.NL }, (_, L) => this.convLayer[L]
			? { conv: new Float32Array((this.LC - 1) * this.D) }
			: { K: [] as Float32Array[], V: [] as Float32Array[] });
	}

	private async gemm(name: string, x: Float32Array): Promise<Float32Array> {
		const W = this.g.get(name);
		if (!W) { // repli CPU (tête f16/f32 uniquement)
			const M = this.w.get(name === 'head' ? 'token_embd.weight' : name)!;
			const OUT = M.length / x.length, y = new Float32Array(OUT);
			for (let o = 0; o < OUT; o++) { let s = 0; const b = o * x.length; for (let i = 0; i < x.length; i++) s += M[b + i] * x[i]; y[o] = s; }
			return y;
		}
		if (W.kind === 'q8') return this.engine.matmulQ8(x, W.codes, W.sc, 1, W.IN, W.OUT);
		return this.engine.matmulQ4(x, W.nib, W.sc, W.mn, 1, W.IN, W.OUT);
	}

	private embedRow(tokId: number): Float32Array {
		const D = this.D;
		if (this.embedDtype === 'f16') return decodeF16(this.embedBytes.subarray(tokId * D * 2, tokId * D * 2 + D * 2), D);
		if (this.embedDtype === 'f32') return decodeF32(this.embedBytes.subarray(tokId * D * 4, tokId * D * 4 + D * 4), D);
		if (this.embedDtype === 'q8') { // blob SoA [codes|scales u16/groupe de 32]
			const total = this.vocab * D, gRow = D / 32;
			const codes = new Int8Array(this.embedBytes.buffer, this.embedBytes.byteOffset + tokId * D, D);
			const scB = this.embedBytes.subarray(total + tokId * gRow * 2, total + tokId * gRow * 2 + gRow * 2);
			const dv = new DataView(scB.buffer, scB.byteOffset, scB.byteLength);
			const o = new Float32Array(D);
			for (let g = 0; g < gRow; g++) { const s = f16BitsToF32(dv.getUint16(g * 2, true)); for (let i = 0; i < 32; i++) o[g * 32 + i] = codes[g * 32 + i] * s; }
			return o;
		}
		// q4 : reconstruire la ligne depuis le blob SoA [nibbles|scales|mins] (même layout que RwkvModel)
		const total = this.vocab * D, gRow = D / 32, scBase = total / 2, mnBase = total / 2 + (total / 32) * 2;
		const blob = new Uint8Array(D / 2 + gRow * 2 * 2);
		blob.set(this.embedBytes.subarray(tokId * D / 2, tokId * D / 2 + D / 2), 0);
		blob.set(this.embedBytes.subarray(scBase + tokId * gRow * 2, scBase + tokId * gRow * 2 + gRow * 2), D / 2);
		blob.set(this.embedBytes.subarray(mnBase + tokId * gRow * 2, mnBase + tokId * gRow * 2 + gRow * 2), D / 2 + gRow * 2);
		return dequantizeQ4(unpackQ4(blob, D));
	}

	// RoPE neox (paires (i, i+HD/2)) sur un vecteur multi-têtes, position p — même maths que la réf CPU.
	private rope(v: Float32Array, nh: number, p: number): Float32Array {
		const HD = this.HD, o = v.slice();
		for (let h = 0; h < nh; h++) {
			const b = h * HD;
			for (let i = 0; i < HD / 2; i++) {
				const freq = Math.pow(this.THETA, -2 * i / HD);
				const cos = Math.cos(p * freq), sin = Math.sin(p * freq);
				const x = v[b + i], y = v[b + i + HD / 2];
				o[b + i] = x * cos - y * sin; o[b + i + HD / 2] = x * sin + y * cos;
			}
		}
		return o;
	}

	async forwardToken(tokId: number): Promise<Float32Array> {
		const D = this.D, p0 = this.pos++;
		let x = this.embedRow(tokId);
		for (let L = 0; L < this.NL; L++) {
			const p = `blk.${L}.`, st = this.state[L] as any;
			const h = rmsnorm(x, this.w.get(p + 'attn_norm.weight')!, D, this.EPS);
			let out: Float32Array;
			if (this.convLayer[L]) {
				const bcx = await this.gemm(p + 'shortconv.in_proj.weight', h);
				const r = await this.engine.lfm2ShortConv(bcx, st.conv, this.w.get(p + 'shortconv.conv.weight')!, D, this.LC);
				st.conv = r.state;
				out = await this.gemm(p + 'shortconv.out_proj.weight', r.out);
			} else {
				const kvD = this.NKV * this.HD;
				let q = await this.gemm(p + 'attn_q.weight', h);
				let k = await this.gemm(p + 'attn_k.weight', h);
				const v = await this.gemm(p + 'attn_v.weight', h);
				const qn = this.w.get(p + 'attn_q_norm.weight')!, kn = this.w.get(p + 'attn_k_norm.weight')!;
				for (let hh = 0; hh < this.NH; hh++) q.set(rmsnorm(q.slice(hh * this.HD, (hh + 1) * this.HD), qn, this.HD, this.EPS), hh * this.HD);
				for (let hh = 0; hh < this.NKV; hh++) k.set(rmsnorm(k.slice(hh * this.HD, (hh + 1) * this.HD), kn, this.HD, this.EPS), hh * this.HD);
				q = this.rope(q, this.NH, p0); k = this.rope(k, this.NKV, p0);
				st.K.push(k); st.V.push(v);
				const y = new Float32Array(this.NH * this.HD), Tn = st.K.length, scale = 1 / Math.sqrt(this.HD), grp = this.NH / this.NKV;
				for (let hh = 0; hh < this.NH; hh++) {
					const kvh = Math.floor(hh / grp), qb = hh * this.HD, kb = kvh * this.HD;
					const sc = new Float32Array(Tn); let mx = -1e30;
					for (let t = 0; t < Tn; t++) { let s = 0; for (let i = 0; i < this.HD; i++) s += q[qb + i] * st.K[t][kb + i]; sc[t] = s * scale; if (sc[t] > mx) mx = sc[t]; }
					let sum = 0; for (let t = 0; t < Tn; t++) { sc[t] = Math.exp(sc[t] - mx); sum += sc[t]; }
					for (let t = 0; t < Tn; t++) { const w2 = sc[t] / sum; for (let i = 0; i < this.HD; i++) y[qb + i] += w2 * st.V[t][kb + i]; }
				}
				out = await this.gemm(p + 'attn_output.weight', y);
			}
			for (let i = 0; i < D; i++) x[i] += out[i];
			const h2 = rmsnorm(x, this.w.get(p + 'ffn_norm.weight')!, D, this.EPS);
			const g = await this.gemm(p + 'ffn_gate.weight', h2), u = await this.gemm(p + 'ffn_up.weight', h2);
			for (let i = 0; i < g.length; i++) g[i] = silu(g[i]) * u[i];
			const dwn = await this.gemm(p + 'ffn_down.weight', g);
			for (let i = 0; i < D; i++) x[i] += dwn[i];
		}
		x = rmsnorm(x, this.w.get('token_embd_norm.weight')!, D, this.EPS);
		return this.gemm('head', x);
	}

	// Classification CONTRAINTE (SDK) : un forward du prompt, argmax restreint aux logits des
	// étiquettes candidates. Recette LFM2.5 (bancs q4 2026-07-21, sentiment 12/12) : prompt = few-shot
	// MULTI-TOURS ChatML (des tours user/assistant d'exemple — la forme instruct-native) terminé par
	// `assistant\n`, étiquette SANS espace de tête (début de réponse), 1er token comparé.
	async classify(prompt: string, labels: string[]): Promise<{ label: string; scores: { label: string; logit: number }[] }> {
		this.reset();
		let logits!: Float32Array;
		for (const id of this.tok.encode(prompt)) logits = await this.forwardToken(id);
		const scores = labels
			.map((l) => { const ids = this.tok.encode(l); return { label: l, logit: logits[ids[1] ?? ids[0]] }; }) // ids[0] = BOS
			.sort((a, b) => b.logit - a.logit);
		return { label: scores[0].label, scores };
	}

	// LFM2.5 est entraîné au tool-calling et tente des appels d'outil sur les demandes d'action
	// (<|tool_list/call/response_start|> = 8/10/12 — et 10 est special=false → il s'afficherait BRUT).
	// Ici il n'y a AUCUN outil : on BANNIT ces tokens (logit -∞, le modèle continue en texte) plutôt
	// que d'en faire des stops — un stop en 1er token donnerait une réponse vide.
	private static readonly TOOL_BAN = [8, 10, 12];
	private banTools(logits: Float32Array): Float32Array {
		for (const id of Lfm2Model.TOOL_BAN) if (id < logits.length) logits[id] = -1e30;
		return logits;
	}

	// Échantillonnage (texte libre) : pénalité de répétition fenêtre 64, top-k, softmax température.
	private sampleTok(logits: Float32Array, recent: number[], opts: SampleOpts): number {
		const { temperature = 0.8, topK = 40, repeatPenalty = 1.3 } = opts;
		const seen = new Set(recent);
		const cand: { i: number; v: number; p?: number }[] = [];
		for (let i = 0; i < logits.length; i++) {
			let v = logits[i];
			if (seen.has(i)) v = v > 0 ? v / repeatPenalty : v * repeatPenalty;
			cand.push({ i, v });
		}
		cand.sort((a, b) => b.v - a.v); cand.length = topK;
		const mx = cand[0].v; let sum = 0;
		for (const c of cand) { c.p = Math.exp((c.v - mx) / temperature); sum += c.p; }
		let r = Math.random() * sum;
		for (const c of cand) { r -= c.p!; if (r <= 0) return c.i; }
		return cand[0].i;
	}

	// Génère jusqu'à `n` tokens après `prompt` — greedy par défaut, échantillonné si opts.sample.
	// S'arrête sur les stopTokenIds du manifest (<|im_end|>).
	async generate(prompt: string, n: number, onToken?: (text: string) => void, stop?: () => boolean, opts?: SampleOpts & { sample?: boolean }): Promise<string> {
		this.reset();
		const ids = this.tok.encode(prompt);
		let logits!: Float32Array;
		for (const id of ids) logits = await this.forwardToken(id);
		const out: number[] = [];
		for (let s = 0; s < n; s++) {
			if (stop?.()) break;
			this.banTools(logits);
			let best: number;
			if (opts?.sample) best = this.sampleTok(logits, out.slice(-64), opts);
			else { best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i; }
			if (this.stops.has(best)) break;
			out.push(best);
			if (onToken) onToken(this.tok.decode(out));
			logits = await this.forwardToken(best);
		}
		return out.length ? this.tok.decode(out) : ''; // decode([]) jette dans transformers.js
	}

	// Comme generate() mais sur le chemin RÉSIDENT (logitsGpu) : prefill du prompt en UNE soumission
	// (au lieu de N×~100 readbacks) + décodage 1 submit/token → nettement plus rapide. Repli sur
	// generate() (forwardToken JS) si le résident n'est pas dispo. Session neuve (pastLen 0) → reset.
	async generateResident(prompt: string, n: number, onToken?: (text: string) => void, stop?: () => boolean, opts?: SampleOpts & { sample?: boolean }): Promise<string> {
		if (!this.residentAvailable()) return this.generate(prompt, n, onToken, stop, opts);
		const sid = 'gen';
		const ids = this.tok.encode(prompt);
		let logits = await this.logitsGpu(ids, 0, sid); // prefill (reset via pastLen 0), 1 submit
		let pos = ids.length;
		const out: number[] = [];
		for (let s = 0; s < n; s++) {
			if (stop?.()) break;
			this.banTools(logits);
			let best: number;
			if (opts?.sample) best = this.sampleTok(logits, out.slice(-64), opts);
			else { best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i; }
			if (this.stops.has(best)) break;
			out.push(best);
			if (onToken) onToken(this.tok.decode(out));
			logits = await this.logitsGpu([best], pos, sid);
			pos++;
		}
		return out.length ? this.tok.decode(out) : ''; // decode([]) jette dans transformers.js
	}
}
