// INTERPOLATION D'IMAGES — RIFE 4.26 (hzwer/Practical-RIFE, MIT) sur les kernels WGSL du moteur.
//
// Pourquoi : AnimateDiff ne produit que 16 images uniques (1,3 s à 12 im/s) et chaque image de plus
// coûte du débruitage. RIFE invente les images INTERMÉDIAIRES entre deux images générées : ×4 images
// pour un coût marginal, d'où un clip ~4 fois plus long (ou plus fluide) au même temps de débruitage.
// Il ralentit et lisse le mouvement, il n'en invente pas (ROADMAP § 27).
//
// Architecture (IFNet_HDv3, v4.26) — tout en f32, ~5,7 M de paramètres :
//   encode (Head) : conv 3→16 /2, LReLU, conv 16→16, LReLU, conv 16→16, LReLU, convT 16→4 ×2 → [4, H, W]
//   5 IFBlocks (c = 192, 128, 96, 64, 32) aux échelles 16, 8, 4, 2, 1 :
//     x ↓ échelle (+ flot ↓ /échelle), conv0 (deux conv /2 + LReLU), 8 ResConv, convT ×2 + PixelShuffle(2)
//     → ↑ échelle → flot (4 canaux, × échelle), masque (1), caractéristiques (8)
//   entre deux blocs : warp des images et des caractéristiques par le flot courant, flot += correction
//   sortie : σ(masque)·warp(img0) + (1 − σ(masque))·warp(img1)
// Validation : chaque brique contre sa référence CPU (selfValidate → gate rifeOk), et le réseau ENTIER
// contre PyTorch (référence produite par le script d'oracle, ROADMAP § 27).

import type { WebGpuEngine } from '../kernels';
import type { SafeTensor } from '../../safetensors';

type Buf = any;
const SCALES = [16, 8, 4, 2, 1];
const WIDTHS = [192, 128, 96, 64, 32];

export class RifeInterpolator {
	private e: WebGpuEngine;
	private w = new Map<string, Buf>();
	private shapes = new Map<string, number[]>();

	constructor(engine: WebGpuEngine, weights: Map<string, SafeTensor>) {
		this.e = engine;
		for (const [name, t] of weights) {
			this.w.set(name, engine.uploadGpu(t.data as any));
			this.shapes.set(name, t.shape);
		}
		if (!this.w.has('block4.lastconv.0.weight') || !this.w.has('encode.cnn3.weight')) throw new Error('RIFE : poids incomplets (block4 / encode attendus)');
	}

	private g(name: string): Buf {
		const b = this.w.get(name);
		if (!b) throw new Error(`RIFE : poids manquant ${name}`);
		return b;
	}

	// Concaténation par canaux (CHW contigu : chaque morceau est une plage d'octets).
	private cat(s: any, parts: [Buf, number][], HW: number): Buf {
		const C = parts.reduce((a, [, c]) => a + c, 0);
		const out = s.alloc(C * HW * 4);
		let off = 0;
		for (const [b, c] of parts) { s.copy(out, off * HW * 4, b, 0, c * HW * 4); off += c; }
		return out;
	}
	private slice(s: any, b: Buf, c0: number, c: number, HW: number): Buf {
		const out = s.alloc(c * HW * 4);
		s.copy(out, 0, b, c0 * HW * 4, c * HW * 4);
		return out;
	}
	private conv(s: any, x: Buf, name: string, Cin: number, Cout: number, H: number, W: number, st: number): Buf {
		return s.conv2d(x, this.g(`${name}.weight`), this.g(`${name}.bias`), Cin, H, W, Cout, 3, 3, st, 1);
	}

	// Caractéristiques d'une image [3, H, W] → [4, H, W]. Calculées UNE fois par image du clip.
	encode(img: Buf, H: number, W: number): Buf {
		const s = this.e.recordingSession();
		const h2 = H / 2, w2 = W / 2, n = 16 * h2 * w2;
		let x = s.rifeAct(this.conv(s, img, 'encode.cnn0', 3, 16, H, W, 2), n, 1, true);
		x = s.rifeAct(this.conv(s, x, 'encode.cnn1', 16, 16, h2, w2, 1), n, 1, true);
		x = s.rifeAct(this.conv(s, x, 'encode.cnn2', 16, 16, h2, w2, 1), n, 1, true);
		return s.finishKeep(s.convTranspose2d(x, this.g('encode.cnn3.weight'), this.g('encode.cnn3.bias'), 16, h2, w2, 4, 4, 2, 1));
	}

	// Un IFBlock : x [Cx, H, W] (+ flot [4, H, W] sauf au premier) → { flot, masque, caractéristiques } à H×W.
	private block(s: any, i: number, x: Buf, Cx: number, flow: Buf | null, H: number, W: number): { flow: Buf; mask: Buf; feat: Buf } {
		const sc = SCALES[i], c = WIDTHS[i], p = `block${i}`;
		const Hs = H / sc, Ws = W / sc;
		let xin = sc === 1 ? x : s.resizeBilinear(x, Cx, H, W, Hs, Ws);
		let Cin = Cx;
		if (flow) {
			const f = sc === 1 ? flow : s.rifeAct(s.resizeBilinear(flow, 4, H, W, Hs, Ws), 4 * Hs * Ws, 1 / sc, false);
			xin = this.cat(s, [[xin, Cx], [f, 4]], Hs * Ws);
			Cin = Cx + 4;
		}
		const h1 = Hs / 2, w1 = Ws / 2, h2 = Hs / 4, w2 = Ws / 4;
		let f = s.rifeAct(this.conv(s, xin, `${p}.conv0.0.0`, Cin, c / 2, Hs, Ws, 2), (c / 2) * h1 * w1, 1, true);
		f = s.rifeAct(this.conv(s, f, `${p}.conv0.1.0`, c / 2, c, h1, w1, 2), c * h2 * w2, 1, true);
		for (let j = 0; j < 8; j++) {
			const cv = this.conv(s, f, `${p}.convblock.${j}.conv`, c, c, h2, w2, 1);
			f = s.rifeResconv(cv, f, this.g(`${p}.convblock.${j}.beta`), c, h2 * w2);
		}
		let tmp = s.convTranspose2d(f, this.g(`${p}.lastconv.0.weight`), this.g(`${p}.lastconv.0.bias`), c, h2, w2, 52, 4, 2, 1);
		tmp = s.pixelShuffle2(tmp, 13, h1, w1);                       // [13, Hs, Ws]
		if (sc !== 1) tmp = s.resizeBilinear(tmp, 13, Hs, Ws, H, W);
		const HW = H * W;
		return {
			flow: s.rifeAct(this.slice(s, tmp, 0, 4, HW), 4 * HW, sc, false),
			mask: this.slice(s, tmp, 4, 1, HW),
			feat: this.slice(s, tmp, 5, 8, HW),
		};
	}

	// Image au temps t ∈ ]0, 1[ entre img0 et img1 ([3, H, W], valeurs ~[0, 1]), caractéristiques
	// f0/f1 issues d'encode(). H et W multiples de 64 (les deux conv /2 à l'échelle 16).
	async interpolate(img0: Buf, img1: Buf, f0: Buf, f1: Buf, H: number, W: number, t: number): Promise<Float32Array> {
		if (H % 64 || W % 64) throw new Error(`RIFE : ${W}×${H} doit être multiple de 64`);
		const s = this.e.recordingSession();
		const HW = H * W;
		const tPlane = new Float32Array(HW).fill(t);
		let { flow, mask, feat } = this.block(s, 0, this.cat(s, [[img0, 3], [img1, 3], [f0, 4], [f1, 4], [s.rifeAct(tPlane, HW, 1, false), 1]], HW), 15, null, H, W);
		let w0 = s.warp(img0, flow, 3, H, W, 0), w1 = s.warp(img1, flow, 3, H, W, 2);
		const tBuf = s.rifeAct(tPlane, HW, 1, false);
		for (let i = 1; i < 5; i++) {
			const wf0 = s.warp(f0, flow, 4, H, W, 0), wf1 = s.warp(f1, flow, 4, H, W, 2);
			const x = this.cat(s, [[w0, 3], [w1, 3], [wf0, 4], [wf1, 4], [tBuf, 1], [mask, 1], [feat, 8]], HW);
			const r = this.block(s, i, x, 24, flow, H, W);
			flow = s.add(flow, r.flow, 4 * HW);
			mask = r.mask; feat = r.feat;
			w0 = s.warp(img0, flow, 3, H, W, 0); w1 = s.warp(img1, flow, 3, H, W, 2);
		}
		return s.finish(s.rifeBlend(w0, w1, mask, 3, HW), 3 * HW);
	}

	dispose(): void {
		this.e.releaseGpu([...this.w.values()]);
		this.w.clear();
	}
}
