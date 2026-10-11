// TRANSFORMEUR VIDÉO LTX (LTXVideoTransformer3DModel, 0.9.8 distillé, 2B) sur les kernels du moteur +
// la boucle d'échantillonnage flow-matching — docs/ltx-video-feasibility.md.
//
// Jetons = positions du latent (t, h, w), 128 canaux chacun. 28 blocs identiques (d = 2048) :
//   x ← x + gate_msa · attn1(RMSNorm(x)·(1+scale_msa)+shift_msa)      attention propre, RoPE 3D, qk-norm
//   x ← x + attn2(x, texte)                                           attention croisée (K/V = texte projeté)
//   x ← x + gate_mlp · FF(RMSNorm(x)·(1+scale_mlp)+shift_mlp)         GELU tanh, 8192
// Les six vecteurs AdaLN d'un bloc = scale_shift_table[6, d] + temb(t) ; temb vient d'un embedder de
// temps (sinusoïde 256 → 2048 → SiLU → 2048 → SiLU → 12288) calculé ICI sur CPU, à chaque pas (≈ 30 M
// MAC, quelques dizaines de ms) — ce qui laisse le calendrier libre. RoPE : tables cos/sin par jeton
// calculées sur CPU (fréquences par axe, coordonnées normalisées comme le pipeline), appliquées par
// paires sur les 2048 dimensions AVANT le découpage en têtes (c'est la convention LTX).
// Texte : plongements T5 [L, 4096] des L jetons VALIDES seulement (équivaut au masque additif −10⁴).

import type { WebGpuEngine } from '../kernels';
import type { SafeTensor } from '../../safetensors';
import { toF32 } from '../../safetensors';

type Buf = any;
const D = 2048, HEADS = 32, HD = 64, FF = 8192, LAT_C = 128, LAYERS = 28;
const ROPE_BASE = { t: 20, h: 2048, w: 2048 };

export interface LtxVideoShape { T: number; H: number; W: number; frameRate?: number }

export class LtxTransformer {
	private e: WebGpuEngine;
	private w: Map<string, SafeTensor>;
	private cpu = new Map<string, Float32Array>(); // embedder de temps, tables AdaLN
	private ones: Buf; private zeros: Buf;

	constructor(engine: WebGpuEngine, weights: Map<string, SafeTensor>) {
		if (!(engine as any).ltxOk) throw new Error('transformeur LTX : briques coupées (?ltx=0 ou selfValidate)');
		this.e = engine; this.w = weights;
		for (const k of ['proj_in.weight', 'transformer_blocks.27.ff.net.2.weight', 'time_embed.linear.weight', 'scale_shift_table', 'proj_out.weight'])
			if (!weights.has(k)) throw new Error(`transformeur LTX : poids manquant ${k}`);
		this.ones = engine.uploadGpu(new Float32Array(D).fill(1));
		this.zeros = engine.uploadGpu(new Float32Array(D));
	}
	static isCpuTensor(name: string): boolean { return name.startsWith('time_embed.') || name.endsWith('scale_shift_table'); }

	private g(name: string): Buf {
		const t = this.w.get(name);
		if (!t) throw new Error(`transformeur LTX : poids manquant ${name}`);
		return t.data;
	}
	private f32(name: string): Float32Array {
		let v = this.cpu.get(name);
		if (!v) { const t = this.w.get(name); if (!t) throw new Error(`transformeur LTX : poids CPU manquant ${name}`); v = toF32(t.data as any); this.cpu.set(name, v); }
		return v;
	}
	private lin(s: any, x: Buf, name: string, rows: number, k: number, n: number): Buf {
		return s.addBias(s.matmulT(x, this.g(`${name}.weight`), rows, k, n), this.g(`${name}.bias`), rows, n);
	}

	// ── Embedder de temps (CPU) : AdaLayerNormSingle → { temb [6·D], embedded [D] } ───────────────────
	timeEmbed(timestep: number): { temb: Float32Array; embedded: Float32Array } {
		const proj = new Float32Array(256); // Timesteps(256, flip_sin_to_cos) : [cos | sin], exposant −ln(1e4)·i/128
		for (let i = 0; i < 128; i++) { const a = timestep * Math.exp(-Math.log(10000) * i / 128); proj[i] = Math.cos(a); proj[128 + i] = Math.sin(a); }
		const silu = (v: Float32Array) => v.map((x) => x / (1 + Math.exp(-x)));
		const mv = (wn: string, x: Float32Array, out: number): Float32Array => {
			const w = this.f32(`${wn}.weight`), b = this.f32(`${wn}.bias`), kk = x.length, o = new Float32Array(out);
			for (let r = 0; r < out; r++) { let acc = b[r]; const base = r * kk; for (let i = 0; i < kk; i++) acc += w[base + i] * x[i]; o[r] = acc; }
			return o;
		};
		const h = silu(mv('time_embed.emb.timestep_embedder.linear_1', proj, D));
		const embedded = mv('time_embed.emb.timestep_embedder.linear_2', h, D);
		const temb = mv('time_embed.linear', silu(embedded), 6 * D);
		return { temb, embedded };
	}

	// ── Tables RoPE (CPU) : cos/sin [S, D/2] par paire ; paire 0 = identité (padding dim % 6 = 2) ──────
	ropeTables(sh: LtxVideoShape): { cs: Float32Array; sn: Float32Array } {
		const { T, H, W } = sh, S = T * H * W, half = D / 2, nf = Math.floor(D / 6); // 341 fréquences
		// Arrondis f32 à chaque étape, comme torch : les hautes fréquences (jusqu'à 10⁴·π/2) amplifient la
		// moindre différence de fréquence en radians — en f64 l'écart aux tables de référence était 10× plus
		// grand (1,4·10⁻⁴ moyen contre 1,5·10⁻⁵).
		const fr = Math.fround, freqs = new Float32Array(nf);
		for (let i = 0; i < nf; i++) freqs[i] = fr(fr(Math.pow(10000, nf === 1 ? 0 : fr(i / (nf - 1)))) * fr(Math.PI / 2));
		const st = (8 / (sh.frameRate ?? 25)) / ROPE_BASE.t, sy = 32 / ROPE_BASE.h, sx = 32 / ROPE_BASE.w;
		const cs = new Float32Array(S * half), sn = new Float32Array(S * half);
		let tok = 0;
		for (let t = 0; t < T; t++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++, tok++) {
			const g = [fr(t * st * 2 - 1), fr(y * sy * 2 - 1), fr(x * sx * 2 - 1)], base = tok * half;
			cs[base] = 1; sn[base] = 0;
			for (let i = 0; i < nf; i++) for (let a = 0; a < 3; a++) { const ang = fr(freqs[i] * g[a]), p = 1 + 3 * i + a; cs[base + p] = Math.cos(ang); sn[base + p] = Math.sin(ang); }
		}
		return { cs, sn };
	}

	// ── Un forward : latent [S, 128] (jetons t,h,w) → vitesse [S, 128] ───────────────────────────────
	// `ctx` : texte projeté [L, D] (voir encodeText) ; `rope` : tables de ropeTables ; `tap` : relecture
	// d'activations nommées comme les modules diffusers (validation).
	async forward(latent: Float32Array, S: number, ctx: { buf: Buf; L: number }, rope: { cs: Buf; sn: Buf }, timestep: number, tap?: (name: string, data: Float32Array) => void): Promise<Float32Array> {
		const e = this.e;
		const { temb, embedded } = this.timeEmbed(timestep);
		const probe = async (name: string, buf: Buf, n: number) => { if (tap) tap(name, await e.readGpu(buf, n)); };
		let s = e.recordingSession();
		let x: Buf = s.finishKeep(this.lin(s, latent, 'proj_in', S, LAT_C, D));
		await probe('proj_in', x, S * D);
		for (let l = 0; l < LAYERS; l++) {
			const p = `transformer_blocks.${l}`;
			const table = this.f32(`${p}.scale_shift_table`);
			const ada = new Float32Array(6 * D);
			for (let i = 0; i < 6 * D; i++) ada[i] = table[i] + temb[i];
			s = e.recordingSession();
			// attention propre
			let h = s.ltxModulate(s.rmsnorm(x, this.ones, S, D, 1e-6), ada, S, D, 0, D);
			let q = s.ropeLtx(s.rmsnorm(this.lin(s, h, `${p}.attn1.to_q`, S, D, D), this.g(`${p}.attn1.norm_q.weight`), S, D, 1e-6), rope.cs, rope.sn, S, D);
			let k = s.ropeLtx(s.rmsnorm(this.lin(s, h, `${p}.attn1.to_k`, S, D, D), this.g(`${p}.attn1.norm_k.weight`), S, D, 1e-6), rope.cs, rope.sn, S, D);
			let v = this.lin(s, h, `${p}.attn1.to_v`, S, D, D);
			let a = this.lin(s, s.attentionFull(q, k, v, S, HEADS, HEADS, HD, S), `${p}.attn1.to_out.0`, S, D, D);
			x = s.ltxGatedAdd(x, a, ada, S, D, 2 * D);
			// attention croisée (pas de norme sur x, pas de RoPE)
			q = s.rmsnorm(this.lin(s, x, `${p}.attn2.to_q`, S, D, D), this.g(`${p}.attn2.norm_q.weight`), S, D, 1e-6);
			k = s.rmsnorm(this.lin(s, ctx.buf, `${p}.attn2.to_k`, ctx.L, D, D), this.g(`${p}.attn2.norm_k.weight`), ctx.L, D, 1e-6);
			v = this.lin(s, ctx.buf, `${p}.attn2.to_v`, ctx.L, D, D);
			a = this.lin(s, s.attentionFull(q, k, v, S, HEADS, HEADS, HD, ctx.L), `${p}.attn2.to_out.0`, S, D, D);
			x = s.add(x, a, S * D);
			// FFN
			h = s.ltxModulate(s.rmsnorm(x, this.ones, S, D, 1e-6), ada, S, D, 3 * D, 4 * D);
			h = this.lin(s, s.gelu(this.lin(s, h, `${p}.ff.net.0.proj`, S, D, FF), S * FF), `${p}.ff.net.2`, S, FF, D);
			const next = s.finishKeep(s.ltxGatedAdd(x, h, ada, S, D, 5 * D));
			x = next;
			if (tap && (l === 0 || l === 13 || l === 27)) await probe(p, x, S * D);
		}
		const table = this.f32('scale_shift_table'), ada = new Float32Array(2 * D);
		for (let i = 0; i < 2 * D; i++) ada[i] = table[i] + embedded[i % D];
		s = e.recordingSession();
		let y = s.layernorm(x, this.ones, this.zeros, S, D, 1e-6);
		if (tap) { const yy = s.finishKeep(y); await probe('norm_out', yy, S * D); s = e.recordingSession(); y = yy; }
		y = s.ltxModulate(y, ada, S, D, 0, D);
		const out = await s.finish(this.lin(s, y, 'proj_out', S, D, LAT_C), S * LAT_C);
		e.releaseGpu([x]);
		return out;
	}

	// Projection du texte (PixArtAlphaTextProjection : 4096 → 2048, GELU tanh, 2048 → 2048), gardée sur
	// le GPU pour toute la génération. `embeds` : [L, 4096] des L jetons valides.
	encodeText(embeds: Float32Array, L: number): { buf: Buf; L: number } {
		const s = this.e.recordingSession();
		const h = s.gelu(this.lin(s, embeds, 'caption_projection.linear_1', L, 4096, D), L * D);
		return { buf: s.finishKeep(this.lin(s, h, 'caption_projection.linear_2', L, D, D)), L };
	}

	// ── Échantillonnage flow-matching (Euler) sur le calendrier distillé ──────────────────────────────
	// sigmas décroissants (1,0 → …), dernier pas vers 0 ; x ← x + (σ_{i+1} − σ_i)·v. Rend les jetons
	// NORMALISÉS [S, 128] (dénormalisation par canal à faire avant le décodeur).
	async sample(noise: Float32Array, sh: LtxVideoShape, text: { buf: Buf; L: number }, sigmas: number[], onStep?: (i: number, n: number) => Promise<void> | void): Promise<Float32Array> {
		const S = sh.T * sh.H * sh.W;
		const t = this.ropeTables(sh);
		const rope = { cs: this.e.uploadGpu(t.cs), sn: this.e.uploadGpu(t.sn) };
		let x = noise.slice();
		for (let i = 0; i < sigmas.length; i++) {
			const v = await this.forward(x, S, text, rope, sigmas[i] * 1000);
			const dt = (i + 1 < sigmas.length ? sigmas[i + 1] : 0) - sigmas[i];
			for (let j = 0; j < x.length; j++) x[j] += dt * v[j];
			if (onStep) await onStep(i + 1, sigmas.length);
		}
		this.e.releaseGpu([rope.cs, rope.sn]);
		return x;
	}

	dispose(): void {
		const bufs: Buf[] = [this.ones, this.zeros];
		for (const t of this.w.values()) { const d = t.data as any; if (d?.codes) bufs.push(d.codes, d.sc); else if (d?.nib) bufs.push(d.nib, d.sc, d.mn); else if (d?.destroy) bufs.push(d); }
		this.e.releaseGpu(bufs);
		this.w.clear(); this.cpu.clear();
	}
}

// Jetons (t, h, w, c) ↔ latent [C, T, H, W] du décodeur, avec la (dé)normalisation par canal du VAE.
export function tokensToLatent(tokens: Float32Array, sh: LtxVideoShape, mean: ArrayLike<number>, std: ArrayLike<number>): Float32Array {
	const S = sh.T * sh.H * sh.W, out = new Float32Array(LAT_C * S);
	for (let s = 0; s < S; s++) for (let c = 0; c < LAT_C; c++) out[c * S + s] = tokens[s * LAT_C + c] * std[c] + mean[c];
	return out;
}
