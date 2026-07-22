// Encodeur vision Qwen2-VL (jalon V2) : patches image → tokens dans la dimension du LLM.
// Architecture : patch-embed (matmul, sans biais) → 32×(LN → MHA pleine + RoPE 2D → résiduel ;
// LN → MLP quick_gelu → résiduel) → merger (ln_q → reshape 2×2 → mm.0 → GELU → mm.2).
//
// GPU-résident : tout le forward est enregistré en UNE session (un submit, un readback), même
// patron que le CLIP text encoder (clip.ts). Les poids sont des handles GPU (q8 pour les matmuls,
// f32 pour LN/biais — cf. mmproj.ts) ou des Float32Array (self-test).
//
// ORDRE DES PATCHES (critique) : le pré-traitement HF (image_processing_qwen2_vl) range les
// patches par BLOCS de fusion (bloc_h, bloc_w, mh, mw) — pas en raster — si bien que le reshape
// [nPatch, dim] → [nPatch/merge², dim·merge²] du merger est un simple ré-étiquetage du buffer.
// imageToPatches produit cet ordre, et les positions (h, w) du RoPE 2D suivent le même ordre.

import type { WebGpuEngine } from '../kernels';
import type { VitConfig, VitWeights } from './mmproj';

export class VitEncoder {
	constructor(private engine: WebGpuEngine, private w: VitWeights<any>, private cfg: VitConfig) {}

	// patches : [nPatch, featLen] (ordre blocs de fusion), pos : paires u32 (h, w) par patch.
	// Retourne [nPatch/merge², outDim] — les tokens image à insérer dans le prompt du LLM.
	async encode(patches: Float32Array, pos: Uint32Array, nPatch: number): Promise<Float32Array> {
		const { dim, heads, headDim, hidden, eps, merge, outDim, theta } = this.cfg;
		const featLen = patches.length / nPatch;
		const s = this.engine.recordingSession();
		let x: any = s.matmulT(patches, this.w.patchW, nPatch, featLen, dim); // patch-embed (sans biais)
		for (const L of this.w.layers) {
			const n1 = s.layernorm(x, L.ln1g, L.ln1b, nPatch, dim, eps);
			let q = s.addBias(s.matmulT(n1, L.qw, nPatch, dim, dim), L.qb, nPatch, dim);
			let k = s.addBias(s.matmulT(n1, L.kw, nPatch, dim, dim), L.kb, nPatch, dim);
			const v = s.addBias(s.matmulT(n1, L.vw, nPatch, dim, dim), L.vb, nPatch, dim);
			q = s.rope2d(q, pos, nPatch * heads, headDim, heads, theta);
			k = s.rope2d(k, pos, nPatch * heads, headDim, heads, theta);
			const attn = s.attentionFull(q, k, v, nPatch, heads, heads, headDim, nPatch);
			const o = s.addBias(s.matmulT(attn, L.ow, nPatch, dim, dim), L.ob, nPatch, dim);
			x = s.add(x, o, nPatch * dim);

			const n2 = s.layernorm(x, L.ln2g, L.ln2b, nPatch, dim, eps);
			const fc1 = s.addBias(s.matmulT(n2, L.fc1w, nPatch, dim, hidden), L.fc1b, nPatch, hidden);
			const h = s.quickGelu(fc1, nPatch * hidden);
			const m = s.addBias(s.matmulT(h, L.fc2w, nPatch, hidden, dim), L.fc2b, nPatch, dim);
			x = s.add(x, m, nPatch * dim);
		}
		// Merger : ln_q sur [nPatch, dim], puis le MÊME buffer relu comme [nPatch/merge², dim·merge²]
		// (l'ordre des patches rend le reshape gratuit), MLP mm.0 → GELU → mm.2.
		const mergeDim = dim * merge * merge;
		const rows = nPatch / (merge * merge);
		const lq = s.layernorm(x, this.w.lnqG, this.w.lnqB, nPatch, dim, eps);
		const m0 = s.addBias(s.matmulT(lq, this.w.mm0w, rows, mergeDim, mergeDim), this.w.mm0b, rows, mergeDim);
		const g = s.gelu(m0, rows * mergeDim);
		const out = s.addBias(s.matmulT(g, this.w.mm2w, rows, mergeDim, outDim), this.w.mm2b, rows, outDim);
		return s.finish(out, rows * outDim);
	}
}

// ── Pré-traitement : RGB [0,1] (channels-first [3,H,W]) → patches + positions RoPE 2D. ──
// H, W doivent être multiples de patch·merge (28). Normalisation CLIP (mean/std par canal),
// duplication temporelle (temporal=2, frames identiques pour une image fixe), ordre des features
// par patch = (canal, temporel, py, px) — l'ordre du patchW reconstruit dans mmproj.ts.
export function imageToPatches(rgb: Float32Array, H: number, W: number, cfg: Pick<VitConfig, 'patch' | 'merge' | 'temporal' | 'imageMean' | 'imageStd'>): { patches: Float32Array; pos: Uint32Array; gridH: number; gridW: number } {
	const { patch, merge, temporal } = cfg;
	if (H % (patch * merge) || W % (patch * merge)) throw new Error(`image ${W}×${H} non multiple de ${patch * merge}`);
	const gridH = H / patch, gridW = W / patch;
	const nPatch = gridH * gridW;
	const pxl = patch * patch;
	const featLen = 3 * temporal * pxl;
	const patches = new Float32Array(nPatch * featLen);
	const pos = new Uint32Array(nPatch * 2);
	let idx = 0;
	for (let bh = 0; bh < gridH / merge; bh++)
		for (let bw = 0; bw < gridW / merge; bw++)
			for (let mh = 0; mh < merge; mh++)
				for (let mw = 0; mw < merge; mw++) {
					const ph = bh * merge + mh, pw = bw * merge + mw;
					pos[idx * 2] = ph; pos[idx * 2 + 1] = pw;
					const base = idx * featLen;
					for (let c = 0; c < 3; c++) {
						const mean = cfg.imageMean[c], std = cfg.imageStd[c];
						for (let py = 0; py < patch; py++)
							for (let px = 0; px < patch; px++) {
								const v = (rgb[c * H * W + (ph * patch + py) * W + (pw * patch + px)] - mean) / std;
								for (let t = 0; t < temporal; t++)
									patches[base + (c * temporal + t) * pxl + py * patch + px] = v;
							}
					}
					idx++;
				}
	return { patches, pos, gridH, gridW };
}

// ── Self-test : mini-config synthétique, encodeur GPU vs référence CPU (même patron que
//    validateClip). Valide le CÂBLAGE complet : patch-embed, RoPE 2D, attention pleine, MLP
//    quick_gelu, résiduels, merger (reshape + GELU). Retourne null si OK, sinon l'étape fautive. ──

function lnCpu(x: Float32Array, g: Float32Array, b: Float32Array, rows: number, dim: number, eps: number): Float32Array {
	const o = new Float32Array(rows * dim);
	for (let r = 0; r < rows; r++) {
		const base = r * dim;
		let mean = 0; for (let i = 0; i < dim; i++) mean += x[base + i]; mean /= dim;
		let v = 0; for (let i = 0; i < dim; i++) { const d = x[base + i] - mean; v += d * d; } v /= dim;
		const inv = 1 / Math.sqrt(v + eps);
		for (let i = 0; i < dim; i++) o[base + i] = (x[base + i] - mean) * inv * g[i] + b[i];
	}
	return o;
}
function mmTCpu(a: Float32Array, w: Float32Array, m: number, k: number, n: number, bias?: Float32Array): Float32Array {
	const o = new Float32Array(m * n);
	for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
		let s = 0; for (let i = 0; i < k; i++) s += a[r * k + i] * w[c * k + i];
		o[r * n + c] = s + (bias ? bias[c] : 0);
	}
	return o;
}
export function rope2dCpu(x: Float32Array, pos: Uint32Array, rows: number, headDim: number, nHeads: number, base = 10000): Float32Array {
	const o = new Float32Array(x.length);
	const half = headDim / 2, quarter = half / 2;
	for (let r = 0; r < rows; r++) {
		const patch = Math.floor(r / nHeads);
		const hP = pos[patch * 2], wP = pos[patch * 2 + 1];
		for (let i = 0; i < half; i++) {
			const isH = i < quarter;
			const j = isH ? i : i - quarter;
			const p = isH ? hP : wP;
			const freq = p / Math.pow(base, j / quarter);
			const c = Math.cos(freq), s = Math.sin(freq);
			const x0 = x[r * headDim + i], x1 = x[r * headDim + i + half];
			o[r * headDim + i] = x0 * c - x1 * s;
			o[r * headDim + i + half] = x1 * c + x0 * s;
		}
	}
	return o;
}
function fullAttnCpu(q: Float32Array, k: Float32Array, v: Float32Array, n: number, heads: number, headDim: number): Float32Array {
	const dim = heads * headDim, scale = 1 / Math.sqrt(headDim);
	const o = new Float32Array(n * dim);
	for (let h = 0; h < heads; h++) for (let t = 0; t < n; t++) {
		const sc = new Float32Array(n);
		let mx = -Infinity;
		for (let j = 0; j < n; j++) {
			let s = 0; for (let d = 0; d < headDim; d++) s += q[t * dim + h * headDim + d] * k[j * dim + h * headDim + d];
			s *= scale; sc[j] = s; if (s > mx) mx = s;
		}
		let sum = 0; for (let j = 0; j < n; j++) { sc[j] = Math.exp(sc[j] - mx); sum += sc[j]; }
		for (let d = 0; d < headDim; d++) {
			let acc = 0; for (let j = 0; j < n; j++) acc += (sc[j] / sum) * v[j * dim + h * headDim + d];
			o[t * dim + h * headDim + d] = acc;
		}
	}
	return o;
}
const quickGeluCpu = (x: Float32Array) => x.map((v) => v / (1 + Math.exp(-1.702 * v)));
const geluCpu = (x: Float32Array) => x.map((v) => { const a = Math.max(-20, Math.min(20, 0.7978845608 * (v + 0.044715 * v * v * v))); return 0.5 * v * (1 + Math.tanh(a)); });

export async function validateVit(engine: WebGpuEngine): Promise<string | null> {
	const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1) * 0.3);
	const closeRel = (x: Float32Array, y: Float32Array, tol = 6e-3) =>
		x.length === y.length && x.every((vv, i) => Math.abs(vv - y[i]) <= tol * (1 + Math.abs(y[i])));

	// Kernel rope_2d seul d'abord (headDim 80 réel — quarter 20, positions non triviales).
	{
		const nP = 5, nH = 2, hd = 80;
		const x = rand(nP * nH * hd);
		const pos = new Uint32Array([0, 0, 0, 1, 3, 2, 7, 7, 12, 5]);
		if (!closeRel(await engine.rope2d(x, pos, nP * nH, hd, nH), rope2dCpu(x, pos, nP * nH, hd, nH))) return 'rope_2d';
	}

	// Encodeur complet, mini-config : grid 4×4 (16 patches → 4 tokens), dim 8, heads 2 (headDim 4,
	// quarter 1), hidden 16, 2 blocs, merge 2, outDim 6.
	const cfg: VitConfig = {
		dim: 8, layers: 2, heads: 2, headDim: 4, hidden: 16, patch: 2, merge: 2, temporal: 2,
		eps: 1e-5, outDim: 6, theta: 10000,
		imageMean: [0.5, 0.5, 0.5], imageStd: [0.3, 0.3, 0.3],
	};
	const { dim, heads, headDim, hidden, eps, merge, outDim } = cfg;
	const H = 8, W = 8; // grid 4×4 en patch 2
	const rgb = rand(3 * H * W).map((v) => v * 0.5 + 0.5);
	const { patches, pos } = imageToPatches(rgb as Float32Array, H, W, cfg);
	const nPatch = patches.length / (3 * cfg.temporal * cfg.patch * cfg.patch);
	const featLen = 3 * cfg.temporal * cfg.patch * cfg.patch;
	const mergeDim = dim * merge * merge;
	const mkLayer = () => ({
		ln1g: rand(dim), ln1b: rand(dim),
		qw: rand(dim * dim), qb: rand(dim), kw: rand(dim * dim), kb: rand(dim), vw: rand(dim * dim), vb: rand(dim),
		ow: rand(dim * dim), ob: rand(dim),
		ln2g: rand(dim), ln2b: rand(dim),
		fc1w: rand(hidden * dim), fc1b: rand(hidden), fc2w: rand(dim * hidden), fc2b: rand(dim),
	});
	const w: VitWeights = {
		patchW: rand(dim * featLen),
		layers: [mkLayer(), mkLayer()],
		lnqG: rand(dim), lnqB: rand(dim),
		mm0w: rand(mergeDim * mergeDim), mm0b: rand(mergeDim),
		mm2w: rand(outDim * mergeDim), mm2b: rand(outDim),
	};

	const got = await new VitEncoder(engine, w, cfg).encode(patches, pos, nPatch);

	// Référence CPU (miroir exact de encode()).
	const x = mmTCpu(patches, w.patchW, nPatch, featLen, dim);
	for (const L of w.layers) {
		const n1 = lnCpu(x, L.ln1g, L.ln1b, nPatch, dim, eps);
		let q = mmTCpu(n1, L.qw, nPatch, dim, dim, L.qb);
		let k = mmTCpu(n1, L.kw, nPatch, dim, dim, L.kb);
		const v = mmTCpu(n1, L.vw, nPatch, dim, dim, L.vb);
		q = rope2dCpu(q, pos, nPatch * heads, headDim, heads, cfg.theta);
		k = rope2dCpu(k, pos, nPatch * heads, headDim, heads, cfg.theta);
		const attn = fullAttnCpu(q, k, v, nPatch, heads, headDim);
		const o = mmTCpu(attn, L.ow, nPatch, dim, dim, L.ob);
		for (let i = 0; i < x.length; i++) x[i] += o[i];
		const n2 = lnCpu(x, L.ln2g, L.ln2b, nPatch, dim, eps);
		const h = quickGeluCpu(mmTCpu(n2, L.fc1w, nPatch, dim, hidden, L.fc1b));
		const m = mmTCpu(h as Float32Array, L.fc2w, nPatch, hidden, dim, L.fc2b);
		for (let i = 0; i < x.length; i++) x[i] += m[i];
	}
	const rows = nPatch / (merge * merge);
	const lq = lnCpu(x, w.lnqG as Float32Array, w.lnqB as Float32Array, nPatch, dim, eps);
	const m0 = geluCpu(mmTCpu(lq, w.mm0w as Float32Array, rows, mergeDim, mergeDim, w.mm0b as Float32Array));
	const ref = mmTCpu(m0 as Float32Array, w.mm2w as Float32Array, rows, mergeDim, outDim, w.mm2b as Float32Array);

	return closeRel(got, ref) ? null : 'vit_encoder';
}
