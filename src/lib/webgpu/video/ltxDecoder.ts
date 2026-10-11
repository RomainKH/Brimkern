// DÉCODEUR VIDÉO LTX (CausalVideoAutoencoder de LTX-Video 0.9.8, côté décodeur) sur les kernels du
// moteur — docs/ltx-video-feasibility.md. Latent [128, T, H, W] → vidéo [3, 8T − 7, 32H, 32W] en ~[−1, 1].
//
// Structure (diffusers autoencoder_kl_ltx.py, config 0.9.5+, 45 convolutions 3×3×3 toutes de même forme) :
//   conv_in 128→1024 ; mid : 5 resnets (1024) ;
//   3 up-blocks : upsampler (conv C→4C, depth-to-space ×2 en t/h/w avec résidu, première image rejetée)
//     puis 5 resnets, à 512, 256, 128 canaux ;
//   norm_out + AdaLN + SiLU, conv_out 128→48, dépatchification 4×4 → 3 canaux.
//   resnet(x) = x + conv2(normAct2(conv1(normAct1(x)))), normAct = RMSNorm(canaux) · (1 + scale) + shift, SiLU.
// Le conditionnement temporel (decode_timestep = 0,05, constante du pipeline officiel) est PRÉCALCULÉ
// dans le BRIK : un vecteur `.ada` par resnet ([4, C] = shift1, scale1, shift2, scale2) et pour la
// sortie ([2, C] = shift, scale) — l'embedder de temps (50 M paramètres) n'est pas porté.
// Validation : briques contre références CPU (selfValidate → ltxOk) ; réseau entier contre PyTorch sur
// une petite forme (hook __ltxDecoderOracle, oracle du dossier de session).

import type { WebGpuEngine } from '../kernels';
import type { SafeTensor } from '../../safetensors';

type Buf = any;
const LAT_C = 128, MID_C = 1024, UP_C = [512, 256, 128];

export class LtxDecoder {
	private e: WebGpuEngine;
	private w: Map<string, SafeTensor>;

	constructor(engine: WebGpuEngine, weights: Map<string, SafeTensor>) {
		if (!(engine as any).ltxOk) throw new Error('décodeur LTX : briques coupées (?ltx=0 ou selfValidate)');
		this.e = engine;
		this.w = weights;
		for (const k of ['conv_in.conv.weight', 'mid_block.resnets.4.ada', 'up_blocks.2.resnets.4.conv2.conv.weight', 'norm_out.ada', 'conv_out.conv.weight'])
			if (!weights.has(k)) throw new Error(`décodeur LTX : poids manquant ${k}`);
	}

	private g(name: string): Buf {
		const t = this.w.get(name);
		if (!t) throw new Error(`décodeur LTX : poids manquant ${name}`);
		return t.data;
	}
	private conv(s: any, x: Buf, name: string, Cin: number, T: number, H: number, W: number, Cout: number): Buf {
		return s.conv3d(x, this.g(`${name}.conv.weight`), this.g(`${name}.conv.bias`), Cin, T, H, W, Cout);
	}

	// Un resnet = une session : normAct → conv1 → normAct → conv2 → + x. L'entrée est libérée par
	// l'appelant une fois la sortie gardée.
	private resnet(x: Buf, name: string, C: number, T: number, H: number, W: number): Buf {
		const s = this.e.recordingSession(), S = T * H * W, ada = this.g(`${name}.ada`);
		let h = s.ltxNormAct(x, ada, C, S, 0, C);
		h = this.conv(s, h, `${name}.conv1`, C, T, H, W, C);
		h = s.ltxNormAct(h, ada, C, S, 2 * C, 3 * C);
		h = this.conv(s, h, `${name}.conv2`, C, T, H, W, C);
		return s.finishKeep(s.add(h, x, C * S));
	}

	// `onBlock` : avancement (un resnet ou un upsampler = une unité, 21 au total) pour la barre du chat.
	// `tap` (validation) : relecture des activations nommées comme les modules diffusers, pour localiser
	// un écart contre l'oracle — jamais appelé en production.
	async decode(latent: Float32Array, T: number, H: number, W: number, onBlock?: (done: number, total: number) => Promise<void> | void, tap?: (name: string, data: Float32Array) => void): Promise<{ data: Float32Array; T: number; H: number; W: number }> {
		if (latent.length !== LAT_C * T * H * W) throw new Error(`décodeur LTX : latent ${latent.length} ≠ 128×${T}×${H}×${W}`);
		const e = this.e;
		let done = 0; const total = 1 + 5 + 3 * 6 + 1;
		const tick = async () => { done++; if (onBlock) await onBlock(done, total); };
		const swap = async (next: Buf, prev: Buf) => { e.releaseGpu([prev]); await tick(); return next; };
		const probe = async (name: string, buf: Buf, n: number) => { if (tap) tap(name, await e.readGpu(buf, n)); };

		let s = e.recordingSession();
		let x: Buf = s.finishKeep(this.conv(s, latent, 'conv_in', LAT_C, T, H, W, MID_C));
		await tick();
		let C = MID_C, t = T, h = H, w = W;
		await probe('conv_in', x, C * t * h * w);
		for (let i = 0; i < 5; i++) x = await swap(this.resnet(x, `mid_block.resnets.${i}`, C, t, h, w), x);
		await probe('mid_block', x, C * t * h * w);
		for (let u = 0; u < 3; u++) {
			const Cout = UP_C[u];
			s = e.recordingSession();
			// LTXVideoUpsampler3d enveloppe sa LTXVideoCausalConv3d : `upsamplers.0.conv.conv.weight`.
			const cv = this.conv(s, x, `up_blocks.${u}.upsamplers.0.conv`, C, t, h, w, 8 * Cout);
			const up = s.finishKeep(s.ltxD2s(cv, x, Cout, t, h, w, C));
			x = await swap(up, x);
			C = Cout; t = 2 * t - 1; h *= 2; w *= 2;
			await probe(`up_blocks.${u}.upsamplers.0`, x, C * t * h * w);
			for (let i = 0; i < 5; i++) x = await swap(this.resnet(x, `up_blocks.${u}.resnets.${i}`, C, t, h, w), x);
			await probe(`up_blocks.${u}`, x, C * t * h * w);
		}
		s = e.recordingSession();
		const S = t * h * w;
		let y = s.ltxNormAct(x, this.g('norm_out.ada'), C, S, 0, C);
		y = this.conv(s, y, 'conv_out', C, t, h, w, 48);
		const out = await s.finish(s.ltxUnpatchify(y, 3, t, h, w), 3 * S * 16);
		e.releaseGpu([x]);
		await tick();
		return { data: out, T: t, H: 4 * h, W: 4 * w };
	}

	dispose(): void {
		const bufs: Buf[] = [];
		for (const t of this.w.values()) { const d = t.data as any; if (d?.codes) bufs.push(d.codes, d.sc); else if (d?.destroy) bufs.push(d); }
		this.e.releaseGpu(bufs);
		this.w.clear();
	}
}
