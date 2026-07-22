// RWKV-7 forward pour le navigateur (moteur v2). POC E2E : les GROSSES projections (time_mix
// r/k/v/output, channel_mix key/value) tournent sur le GPU via les matmuls résidents quantifiés du
// moteur (matmulQ3/Q4 sur poids q3/q4 chargés une fois) ; la glu RWKV-spécifique (token-shift,
// décroissance w, sigmoïdes, modulation k, WKV, GroupNorm, bonus r·k, sqrelu) est en JS — elle est
// minuscule (768 élts/token) et byte-identique à la réf CPU validée (scripts/rwkv-cpuref.cjs).
// Sémantique verrouillée là-bas. Le chemin 100 % résident (glu en WGSL) viendra en optimisation.

import type { WebGpuEngine } from './kernels';
import type { BrikManifest } from '../brik/format';
import { unpackQ3, dequantizeQ3 } from '../brik/q3web';
import { unpackQ4, dequantizeQ4 } from '../brik/q4web';
import { unpackQ8, dequantizeQ8 } from '../brik/q8web';
import { f16BitsToF32 } from '../brik/f16';
import { RwkvTokenizer } from '../rwkvTokenizer';

type GPUAny = any;
type Raw = (name: string) => Promise<Uint8Array>;
type SampleOpts = { temperature?: number; topK?: number; repeatPenalty?: number };

const sig = (v: number) => 1 / (1 + Math.exp(-v));
function decodeF16(b: Uint8Array, n: number): Float32Array { const dv = new DataView(b.buffer, b.byteOffset, b.byteLength); const o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = f16BitsToF32(dv.getUint16(i * 2, true)); return o; }
function decodeF32(b: Uint8Array, n: number): Float32Array { const dv = new DataView(b.buffer, b.byteOffset, b.byteLength); const o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = dv.getFloat32(i * 4, true); return o; }
// y[o] = Σ_i W[o*IN+i]·x[i] (CPU, pour les petites matrices LoRA)
function mv(W: Float32Array, x: Float32Array, IN: number, OUT: number): Float32Array { const y = new Float32Array(OUT); for (let o = 0; o < OUT; o++) { let s = 0; const b = o * IN; for (let i = 0; i < IN; i++) s += W[b + i] * x[i]; y[o] = s; } return y; }
function layernorm(x: Float32Array, w: Float32Array, b: Float32Array, D: number, eps = 1e-5): Float32Array { let m = 0; for (let i = 0; i < D; i++) m += x[i]; m /= D; let v = 0; for (let i = 0; i < D; i++) { const d = x[i] - m; v += d * d; } v /= D; const s = 1 / Math.sqrt(v + eps); const o = new Float32Array(D); for (let i = 0; i < D; i++) o[i] = (x[i] - m) * s * w[i] + b[i]; return o; }

interface Q3W { kind: 'q3'; lo: GPUAny; hi: GPUAny; sc: GPUAny; mn: GPUAny; IN: number; OUT: number; }
interface Q4W { kind: 'q4'; nib: GPUAny; sc: GPUAny; mn: GPUAny; IN: number; OUT: number; }
interface Q8W { kind: 'q8'; codes: GPUAny; sc: GPUAny; IN: number; OUT: number; }

export class RwkvModel {
	private D!: number; private H!: number; private NH!: number; private NL!: number; private vocab!: number;
	private w = new Map<string, Float32Array>();     // petites matrices (f16/f32) en JS
	private g = new Map<string, Q3W | Q4W | Q8W>();   // grosses projections résidentes GPU
	private embedBytes!: Uint8Array; private embedDtype!: string;
	private tok!: RwkvTokenizer;
	private state!: { S: Float32Array[]; tm: Float32Array; cm: Float32Array }[];

	constructor(private engine: WebGpuEngine, private manifest: BrikManifest, private raw: Raw) {}

	private isBigProj(name: string): boolean {
		return /\.(time_mix_(receptance|key|value|output)|channel_mix_(key|value))\.weight$/.test(name);
	}

	async load(tokens: string[]): Promise<void> {
		const a = this.manifest.arch;
		this.D = a.d; this.H = a.rwkv!.headSize; this.NH = this.D / this.H; this.NL = a.blockCount; this.vocab = a.vocab;
		this.tok = new RwkvTokenizer(tokens, 0);
		for (const [name, t] of Object.entries(this.manifest.tensors)) {
			if (name === 'token_embd.weight') { this.embedBytes = await this.raw(name); this.embedDtype = t.dtype; continue; }
			const bytes = await this.raw(name);
			if (name === 'output.weight') { // tête logits → GPU
				if (t.dtype === 'q4') { const q = unpackQ4(bytes, t.nElems); this.g.set(name, { kind: 'q4', nib: this.engine.uploadGpuRaw(q.nibbles), sc: this.up(q.scales), mn: this.up(q.mins), IN: this.D, OUT: this.vocab }); }
				else if (t.dtype === 'q3') { const q = unpackQ3(bytes, t.nElems); this.g.set(name, { kind: 'q3', lo: this.up32(q.lo), hi: this.up32(q.hi), sc: this.up(q.scales), mn: this.up(q.mins), IN: this.D, OUT: this.vocab }); }
				else if (t.dtype === 'q8') { const q = unpackQ8(bytes, t.nElems); this.g.set(name, { kind: 'q8', codes: this.upI8(q.codes), sc: this.up(q.scales), IN: this.D, OUT: this.vocab }); }
				else this.w.set(name, t.dtype === 'f32' ? decodeF32(bytes, t.nElems) : decodeF16(bytes, t.nElems)); // repli CPU (gemm → mv)
				continue;
			}
			if (this.isBigProj(name) && (t.dtype === 'q3' || t.dtype === 'q4' || t.dtype === 'q8')) {
				const IN = t.shape[0], OUT = t.nElems / IN; // ne[0]=IN contigu
				if (t.dtype === 'q3') { const q = unpackQ3(bytes, t.nElems); this.g.set(name, { kind: 'q3', lo: this.up32(q.lo), hi: this.up32(q.hi), sc: this.up(q.scales), mn: this.up(q.mins), IN, OUT }); }
				else if (t.dtype === 'q8') { const q = unpackQ8(bytes, t.nElems); this.g.set(name, { kind: 'q8', codes: this.upI8(q.codes), sc: this.up(q.scales), IN, OUT }); }
				else { const q = unpackQ4(bytes, t.nElems); this.g.set(name, { kind: 'q4', nib: this.engine.uploadGpuRaw(q.nibbles), sc: this.up(q.scales), mn: this.up(q.mins), IN, OUT }); }
			} else { // petites : f16/f32/q décodées en JS
				this.w.set(name, t.dtype === 'f32' ? decodeF32(bytes, t.nElems) : t.dtype === 'f16' ? decodeF16(bytes, t.nElems) : t.dtype === 'q3' ? dequantizeQ3(unpackQ3(bytes, t.nElems)) : t.dtype === 'q8' ? dequantizeQ8(unpackQ8(bytes, t.nElems)) : dequantizeQ4(unpackQ4(bytes, t.nElems)));
			}
		}
		this.reset();
	}
	private up(a: Uint16Array): GPUAny { return this.engine.uploadGpuRaw(new Uint8Array(a.buffer, a.byteOffset, a.byteLength)); }
	private up32(a: Uint32Array): GPUAny { return this.engine.uploadGpuRaw(new Uint8Array(a.buffer, a.byteOffset, a.byteLength)); }
	private upI8(a: Int8Array): GPUAny { return this.engine.uploadGpuRaw(new Uint8Array(a.buffer, a.byteOffset, a.byteLength)); }

	reset(): void { this.state = Array.from({ length: this.NL }, () => ({ S: Array.from({ length: this.NH }, () => new Float32Array(this.H * this.H)), tm: new Float32Array(this.D), cm: new Float32Array(this.D) })); }

	private async gemm(name: string, x: Float32Array): Promise<Float32Array> {
		const W = this.g.get(name);
		if (!W) { const M = this.w.get(name)!; return mv(M, x, x.length, M.length / x.length); } // repli CPU (tête f16/f32)
		if (W.kind === 'q3') return this.engine.matmulQ3(x, W.lo, W.hi, W.sc, W.mn, 1, W.IN, W.OUT);
		if (W.kind === 'q8') return this.engine.matmulQ8(x, W.codes, W.sc, 1, W.IN, W.OUT);
		return this.engine.matmulQ4(x, W.nib, W.sc, W.mn, 1, W.IN, W.OUT);
	}

	private embedRow(tok: number): Float32Array {
		const D = this.D;
		if (this.embedDtype === 'f16') return decodeF16(this.embedBytes.subarray(tok * D * 2, tok * D * 2 + D * 2), D);
		if (this.embedDtype === 'f32') return decodeF32(this.embedBytes.subarray(tok * D * 4, tok * D * 4 + D * 4), D);
		if (this.embedDtype === 'q8') { // blob SoA [codes|scales u16/groupe de 32]
			const total = this.vocab * D, gRow = D / 32;
			const codes = new Int8Array(this.embedBytes.buffer, this.embedBytes.byteOffset + tok * D, D);
			const scB = this.embedBytes.subarray(total + tok * gRow * 2, total + tok * gRow * 2 + gRow * 2);
			const dv = new DataView(scB.buffer, scB.byteOffset, scB.byteLength);
			const o = new Float32Array(D);
			for (let g = 0; g < gRow; g++) { const s = f16BitsToF32(dv.getUint16(g * 2, true)); for (let i = 0; i < 32; i++) o[g * 32 + i] = codes[g * 32 + i] * s; }
			return o;
		}
		// q4 : reconstruire la ligne depuis le blob SoA [nibbles|scales|mins]
		const total = this.vocab * D, gRow = D / 32, nibBase = 0, scBase = total / 2, mnBase = total / 2 + (total / 32) * 2;
		const blob = new Uint8Array(D / 2 + gRow * 2 * 2);
		blob.set(this.embedBytes.subarray(nibBase + tok * D / 2, nibBase + tok * D / 2 + D / 2), 0);
		blob.set(this.embedBytes.subarray(scBase + tok * gRow * 2, scBase + tok * gRow * 2 + gRow * 2), D / 2);
		blob.set(this.embedBytes.subarray(mnBase + tok * gRow * 2, mnBase + tok * gRow * 2 + gRow * 2), D / 2 + gRow * 2);
		return dequantizeQ4(unpackQ4(blob, D));
	}

	private async timeMix(L: number, x: Float32Array, st: any, sh: any): Promise<Float32Array> {
		const D = this.D, H = this.H, NH = this.NH, p = `blk.${L}.`, W = (n: string) => this.w.get(p + n)!;
		const xx = new Float32Array(D); for (let i = 0; i < D; i++) xx[i] = st.tm[i] - x[i]; st.tm = x.slice();
		const lf = W('time_mix_lerp_fused.weight');
		const L6 = (k: number) => { const o = new Float32Array(D); for (let i = 0; i < D; i++) o[i] = x[i] + xx[i] * lf[k * D + i]; return o; };
		const [xr, xw, xk, xv, xa, xg] = [L6(0), L6(1), L6(2), L6(3), L6(4), L6(5)];
		const r = await this.gemm(p + 'time_mix_receptance.weight', xr);
		const k = await this.gemm(p + 'time_mix_key.weight', xk);
		const v = await this.gemm(p + 'time_mix_value.weight', xv);
		// décroissance w
		const wt = mv(W('time_mix_w1.weight'), xw, D, W('time_mix_w1.weight').length / D); for (let i = 0; i < wt.length; i++) wt[i] = Math.tanh(wt[i]);
		const wpre = mv(W('time_mix_w2.weight'), wt, wt.length, D), w0 = W('time_mix_w0.weight'), w = new Float32Array(D);
		for (let o = 0; o < D; o++) w[o] = Math.exp(-0.606531 * sig(w0[o] + wpre[o]));
		// a (iclr)
		const a1 = W('time_mix_a1.weight'), apre = mv(W('time_mix_a2.weight'), mv(a1, xa, D, a1.length / D), a1.length / D, D), a0 = W('time_mix_a0.weight'), a = new Float32Array(D);
		for (let o = 0; o < D; o++) a[o] = sig(a0[o] + apre[o]);
		// gate
		const g1 = W('time_mix_g1.weight'), gt = mv(g1, xg, D, g1.length / D); for (let i = 0; i < gt.length; i++) gt[i] = sig(gt[i]);
		const g = mv(W('time_mix_g2.weight'), gt, gt.length, D);
		// résidu de valeur
		if (L === 0) sh.vFirst = v.slice();
		else { const v1 = W('time_mix_v1.weight'), vpre = mv(W('time_mix_v2.weight'), mv(v1, xv, D, v1.length / D), v1.length / D, D), v0 = W('time_mix_v0.weight'); for (let o = 0; o < D; o++) v[o] = v[o] + (sh.vFirst[o] - v[o]) * sig(v0[o] + vpre[o]); }
		// kk (L2/tête) + modulation k
		const k_k = W('time_mix_k_k.weight'), k_a = W('time_mix_k_a.weight'), kk = new Float32Array(D);
		for (let i = 0; i < D; i++) kk[i] = k[i] * k_k[i];
		for (let h = 0; h < NH; h++) { let n = 0; for (let j = 0; j < H; j++) { const val = kk[h * H + j]; n += val * val; } n = Math.sqrt(n) || 1e-12; for (let j = 0; j < H; j++) kk[h * H + j] /= n; }
		const kmod = new Float32Array(D); for (let i = 0; i < D; i++) kmod[i] = k[i] * (1 + (a[i] - 1) * k_a[i]);
		// WKV (état fixe)
		const y = new Float32Array(D);
		for (let h = 0; h < NH; h++) { const hb = h * H, S = st.S[h]; for (let i = 0; i < H; i++) { let sa = 0; for (let j = 0; j < H; j++) sa += (-kk[hb + j]) * S[i * H + j]; let yi = 0; const vi = v[hb + i]; for (let j = 0; j < H; j++) { const s = w[hb + j] * S[i * H + j] + vi * kmod[hb + j] + (kk[hb + j] * a[hb + j]) * sa; S[i * H + j] = s; yi += r[hb + j] * s; } y[hb + i] = yi; } }
		// GroupNorm/tête + bonus r·k
		const lnw = W('time_mix_ln.weight'), lnb = W('time_mix_ln.bias'), rk = W('time_mix_r_k.weight'), out = new Float32Array(D);
		for (let h = 0; h < NH; h++) { const hb = h * H; let m = 0; for (let j = 0; j < H; j++) m += y[hb + j]; m /= H; let vv = 0; for (let j = 0; j < H; j++) { const d = y[hb + j] - m; vv += d * d; } vv /= H; const sc = 1 / Math.sqrt(vv + 64e-5); for (let j = 0; j < H; j++) out[hb + j] = (y[hb + j] - m) * sc * lnw[hb + j] + lnb[hb + j]; }
		for (let h = 0; h < NH; h++) { const hb = h * H; let bonus = 0; for (let j = 0; j < H; j++) bonus += r[hb + j] * kmod[hb + j] * rk[hb + j]; for (let j = 0; j < H; j++) out[hb + j] += bonus * v[hb + j]; }
		const og = new Float32Array(D); for (let i = 0; i < D; i++) og[i] = out[i] * g[i];
		return this.gemm(p + 'time_mix_output.weight', og);
	}

	private async channelMix(L: number, x: Float32Array, st: any): Promise<Float32Array> {
		const D = this.D, p = `blk.${L}.`, lk = this.w.get(p + 'channel_mix_lerp_k.weight')!;
		const xx = new Float32Array(D); for (let i = 0; i < D; i++) xx[i] = st.cm[i] - x[i]; st.cm = x.slice();
		const xk = new Float32Array(D); for (let i = 0; i < D; i++) xk[i] = x[i] + xx[i] * lk[i];
		const k = await this.gemm(p + 'channel_mix_key.weight', xk);
		for (let i = 0; i < k.length; i++) k[i] = k[i] > 0 ? k[i] * k[i] : 0; // sqrelu
		return this.gemm(p + 'channel_mix_value.weight', k);
	}

	async forwardToken(tokId: number): Promise<Float32Array> {
		const D = this.D, sh: any = { vFirst: null };
		let x = this.embedRow(tokId);
		x = layernorm(x, this.w.get('token_embd_norm.weight')!, this.w.get('token_embd_norm.bias')!, D);
		for (let L = 0; L < this.NL; L++) {
			const st = this.state[L], p = `blk.${L}.`;
			const tm = await this.timeMix(L, layernorm(x, this.w.get(p + 'attn_norm.weight')!, this.w.get(p + 'attn_norm.bias')!, D), st, sh);
			for (let i = 0; i < D; i++) x[i] += tm[i];
			const cm = await this.channelMix(L, layernorm(x, this.w.get(p + 'attn_norm_2.weight')!, this.w.get(p + 'attn_norm_2.bias')!, D), st);
			for (let i = 0; i < D; i++) x[i] += cm[i];
		}
		x = layernorm(x, this.w.get('output_norm.weight')!, this.w.get('output_norm.bias')!, D);
		return this.gemm('output.weight', x);
	}

	// Classification CONTRAINTE (SDK) : un seul forward du prompt, puis argmax restreint aux logits
	// des étiquettes candidates (1er token World de « ␣label » — chacun doit être distinct, vrai pour
	// les noms de langues / positive/negative). Pourquoi : en génération LIBRE un 0.1B recrache une
	// étiquette du prompt (biais de récence) — contraint, il devient fiable (bancs CPU q4 2026-07-20 :
	// langue zéro-shot 10/10, sentiment few-shot 12/12, contre 8/10 et 4/6 en libre).
	async classify(prompt: string, labels: string[]): Promise<{ label: string; scores: { label: string; logit: number }[] }> {
		this.reset();
		let logits!: Float32Array;
		for (const id of this.tok.encode(prompt)) logits = await this.forwardToken(id);
		const scores = labels
			.map((l) => ({ label: l, logit: logits[this.tok.encode(' ' + l)[0]] }))
			.sort((a, b) => b.logit - a.logit);
		return { label: scores[0].label, scores };
	}

	// Échantillonne un token : pénalité de répétition (fenêtre des 64 derniers tokens générés, logits
	// positifs divisés / négatifs multipliés — sémantique llama.cpp), top-k, softmax température.
	// Nécessaire en génération LIBRE : le greedy boucle (« des livres, des livres, des livres… »).
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

	// Génère jusqu'à `n` tokens après `prompt` — greedy par défaut (déterministe : extraction,
	// étiquettes), échantillonné si `opts.sample` (texte libre). `onToken` (optionnel) reçoit le texte
	// cumulé à chaque token (streaming UX). `stop` (optionnel) permet d'arrêter. Retourne le texte.
	async generate(prompt: string, n: number, onToken?: (text: string) => void, stop?: () => boolean, opts?: SampleOpts & { sample?: boolean }): Promise<string> {
		this.reset();
		const ids = this.tok.encode(prompt);
		let logits!: Float32Array;
		for (const id of ids) logits = await this.forwardToken(id);
		const out: number[] = [];
		for (let s = 0; s < n; s++) {
			if (stop?.()) break;
			let best: number;
			if (opts?.sample) best = this.sampleTok(logits, out.slice(-64), opts);
			else { best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i; }
			if (best === 0) break; // eos
			out.push(best);
			if (onToken) onToken(this.tok.decode(out));
			logits = await this.forwardToken(best);
		}
		return this.tok.decode(out);
	}
}
