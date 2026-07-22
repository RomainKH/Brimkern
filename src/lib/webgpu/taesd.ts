// TAESD decoder (Tiny AutoEncoder for Stable Diffusion, madebyollin/taesd) running on our WGSL
// kernels. It's the lightweight VAE decoder: latent [4,h,w] → RGB image [3, 8h, 8w] in ~[0,1].
//
// Architecture (nn.Sequential, decoder side) — purely conv + ReLU + residual + nearest-upsample, no
// groupnorm/attention, which is exactly why it's the right jalon-2 target:
//   Clamp, conv(4→64), ReLU,
//   3×Block, Upsample×2, conv(64→64, no bias),
//   3×Block, Upsample×2, conv(64→64, no bias),
//   3×Block, Upsample×2, conv(64→64, no bias),
//   1×Block, conv(64→3)
// Block(x) = ReLU( conv(ReLU(conv(ReLU(conv(x))))) + x )   (skip is identity at 64→64)
//
// GPU-RESIDENT decode: weights are uploaded to persistent GPU buffers on first use, each block runs
// as ONE recorded submit (conv2d_direct — no im2col buffer, memory-safe at 512²), and activations
// chain between blocks as GPU buffers with NO readback until the final RGB. The consumed activation
// is released eagerly after each block, so peak extra VRAM stays ~2-3 feature maps.

import type { WebGpuEngine } from './kernels';
import type { SafeTensor } from '../safetensors';
import { paceSleep } from './diffusion/unet';

interface FMap { data: Float32Array; C: number; H: number; W: number; }
type GpuBuf = any;

export class TaesdDecoder {
  private engine: WebGpuEngine;
  private w: Map<string, SafeTensor>;
  private prefix: string;
  private gpuW = new Map<string, GpuBuf>();   // persistent weight buffers, uploaded on first decode
  private zeroBias: GpuBuf | null = null;     // shared [64] zeros for the no-bias convs

  constructor(engine: WebGpuEngine, weights: Map<string, SafeTensor>) {
    this.engine = engine;
    this.w = weights;
    // Some exports prefix every key with "decoder." — detect and strip so our index-based lookups work.
    const keys = [...weights.keys()];
    this.prefix = keys.length && keys.every((k) => k.startsWith('decoder.')) ? 'decoder.' : '';
  }

  private tensor(name: string): SafeTensor {
    const t = this.w.get(this.prefix + name);
    if (!t) throw new Error(`TAESD: poids manquant "${this.prefix + name}". Clés dispo: ${[...this.w.keys()].slice(0, 8).join(', ')}…`);
    return t;
  }

  // Persistent GPU buffer for a weight tensor (uploaded once, ~9.6 MB total for all of TAESD).
  private gpu(name: string): GpuBuf {
    let b = this.gpuW.get(name);
    if (!b) { b = this.engine.uploadGpu(this.tensor(name).data); this.gpuW.set(name, b); }
    return b;
  }
  private bias(idx: string, withBias: boolean): GpuBuf {
    if (withBias) return this.gpu(`${idx}.bias`);
    if (!this.zeroBias) this.zeroBias = this.engine.uploadGpu(new Float32Array(64));
    return this.zeroBias;
  }

  // conv 3×3 pad 1 recorded into session `s` (resolution-preserving).
  private conv(s: any, x: GpuBuf, idx: string, Cin: number, Cout: number, H: number, W: number, withBias: boolean): GpuBuf {
    return s.conv2d(x, this.gpu(`${idx}.weight`), this.bias(idx, withBias), Cin, H, W, Cout, 3, 3, 1, 1);
  }

  // Block: ReLU( conv4(ReLU(conv2(ReLU(conv0(x))))) + x ) — one submit, output kept on the GPU.
  private block(x: GpuBuf, idx: number, H: number, W: number): GpuBuf {
    const e = this.engine, n = 64 * H * W;
    const s = e.recordingSession();
    let y = s.relu(this.conv(s, x, `${idx}.conv.0`, 64, 64, H, W, true), n);
    y = s.relu(this.conv(s, y, `${idx}.conv.2`, 64, 64, H, W, true), n);
    y = this.conv(s, y, `${idx}.conv.4`, 64, 64, H, W, true);
    return s.finishKeep(s.relu(s.add(y, x, n), n));
  }

  // latent: Float32Array length 4·h·w (channels-first). Returns [3, 8h, 8w] in ~[0,1].
  // `duty` (0,1] = thermal duty cycle: drain + proportional sleep after each block (same knob as the
  // UNet's UnetPace.duty) — the decode at 512² is a real burst too.
  async decode(latent: Float32Array, h: number, w: number, duty?: number): Promise<FMap> {
    const e = this.engine;
    // Clamp: tanh(x/3)·3 (CPU — the latent is tiny).
    const clamped = latent.map((v) => Math.tanh(v / 3) * 3);
    let H = h, W = w;

    // Swap-chain: `cur` is the live GPU activation; each step consumes it, releases the old one,
    // and applies the thermal pacing.
    let lastIdle = performance.now();
    const paced = duty !== undefined && duty > 0 && duty < 1;
    const step = async (next: GpuBuf, prev: GpuBuf | null): Promise<GpuBuf> => {
      if (prev) e.releaseGpu([prev]);
      if (paced) lastIdle = await paceSleep(e, lastIdle, { duty });
      return next;
    };

    let s = e.recordingSession();
    let cur: GpuBuf = s.finishKeep(s.relu(this.conv(s, clamped, '1', 4, 64, H, W, true), 64 * H * W));

    for (const stage of [[3, 4, 5, 7], [8, 9, 10, 12], [13, 14, 15, 17]]) {
      for (const b of stage.slice(0, 3)) cur = await step(this.block(cur, b, H, W), cur);
      // upsample 2× + post-upsample conv (no bias), one submit
      s = e.recordingSession();
      const upd = s.upsample(cur, 64, H, W, 2);
      H *= 2; W *= 2;
      cur = await step(s.finishKeep(this.conv(s, upd, String(stage[3]), 64, 64, H, W, false)), cur);
    }

    cur = await step(this.block(cur, 18, H, W), cur);
    s = e.recordingSession();
    const rgb = this.conv(s, cur, '19', 64, 3, H, W, true);       // → RGB
    const data = await s.finish(rgb, 3 * H * W);
    e.releaseGpu([cur]);
    return { data, C: 3, H, W };
  }
}

// TAESD ENCODER (img2img) : RGB [3,H,W] en [0,1] → latent [4, H/8, W/8] dans le MÊME espace brut
// que ce que consomme le décodeur ci-dessus (pas de VAE_SCALE). ~4,8 Mo de poids
// (taesd_encoder.safetensors), chargés à la première utilisation seulement.
//
// Architecture (nn.Sequential, taesd.py) — mêmes Block que le décodeur, downsample par conv stride 2 :
//   conv(3→64), Block,
//   conv(64→64, stride 2, sans biais), 3×Block,
//   conv(64→64, stride 2, sans biais), 3×Block,
//   conv(64→64, stride 2, sans biais), 3×Block,
//   conv(64→4)
// Pas de ReLU entre les convs nues (la non-linéarité vit dans les Block), pas de Clamp d'entrée.
export class TaesdEncoder {
  private engine: WebGpuEngine;
  private w: Map<string, SafeTensor>;
  private prefix: string;
  private gpuW = new Map<string, GpuBuf>();
  private zeroBias: GpuBuf | null = null;

  constructor(engine: WebGpuEngine, weights: Map<string, SafeTensor>) {
    this.engine = engine;
    this.w = weights;
    const keys = [...weights.keys()];
    this.prefix = keys.length && keys.every((k) => k.startsWith('encoder.')) ? 'encoder.' : '';
  }

  private tensor(name: string): SafeTensor {
    const t = this.w.get(this.prefix + name);
    if (!t) throw new Error(`TAESD encodeur : poids manquant "${this.prefix + name}". Clés dispo: ${[...this.w.keys()].slice(0, 8).join(', ')}…`);
    return t;
  }
  private gpu(name: string): GpuBuf {
    let b = this.gpuW.get(name);
    if (!b) { b = this.engine.uploadGpu(this.tensor(name).data); this.gpuW.set(name, b); }
    return b;
  }
  private bias(idx: string, withBias: boolean, n = 64): GpuBuf {
    if (withBias) return this.gpu(`${idx}.bias`);
    if (!this.zeroBias) this.zeroBias = this.engine.uploadGpu(new Float32Array(n));
    return this.zeroBias;
  }
  private conv(s: any, x: GpuBuf, idx: string, Cin: number, Cout: number, H: number, W: number, stride: number, withBias: boolean): GpuBuf {
    return s.conv2d(x, this.gpu(`${idx}.weight`), this.bias(idx, withBias), Cin, H, W, Cout, 3, 3, stride, 1);
  }
  // Même Block que le décodeur : ReLU( conv4(ReLU(conv2(ReLU(conv0(x))))) + x ), un submit.
  private block(x: GpuBuf, idx: number, H: number, W: number): GpuBuf {
    const e = this.engine, n = 64 * H * W;
    const s = e.recordingSession();
    let y = s.relu(this.conv(s, x, `${idx}.conv.0`, 64, 64, H, W, 1, true), n);
    y = s.relu(this.conv(s, y, `${idx}.conv.2`, 64, 64, H, W, 1, true), n);
    y = this.conv(s, y, `${idx}.conv.4`, 64, 64, H, W, 1, true);
    return s.finishKeep(s.relu(s.add(y, x, n), n));
  }

  // rgb : Float32Array [3,H,W] en [0,1] (H, W multiples de 8). Retourne le latent [4, H/8, W/8].
  async encode(rgb: Float32Array, h: number, w: number, duty?: number): Promise<Float32Array> {
    const e = this.engine;
    let H = h, W = w;
    let lastIdle = performance.now();
    const paced = duty !== undefined && duty > 0 && duty < 1;
    const step = async (next: GpuBuf, prev: GpuBuf | null): Promise<GpuBuf> => {
      if (prev) e.releaseGpu([prev]);
      if (paced) lastIdle = await paceSleep(e, lastIdle, { duty });
      return next;
    };

    let s = e.recordingSession();
    let cur: GpuBuf = s.finishKeep(this.conv(s, rgb, '0', 3, 64, H, W, 1, true));
    cur = await step(this.block(cur, 1, H, W), cur);

    for (const [down, blocks] of [[2, [3, 4, 5]], [6, [7, 8, 9]], [10, [11, 12, 13]]] as [number, number[]][]) {
      s = e.recordingSession();
      const y = this.conv(s, cur, String(down), 64, 64, H, W, 2, false);
      H = Math.floor(H / 2); W = Math.floor(W / 2);
      cur = await step(s.finishKeep(y), cur);
      for (const b of blocks) cur = await step(this.block(cur, b, H, W), cur);
    }

    s = e.recordingSession();
    const latent = this.conv(s, cur, '14', 64, 4, H, W, 1, true);
    const data = await s.finish(latent, 4 * H * W);
    e.releaseGpu([cur]);
    return data;
  }
}

// [3,H,W] floats (~[0,1], channels-first) → RGBA8 ImageData-ready bytes [H·W·4].
export function chwToRGBA(img: { data: Float32Array; C: number; H: number; W: number }): Uint8ClampedArray {
  const { data, H, W } = img;
  const HW = H * W;
  const out = new Uint8ClampedArray(HW * 4);
  for (let p = 0; p < HW; p++) {
    out[p * 4 + 0] = data[p] * 255;            // R = channel 0
    out[p * 4 + 1] = data[HW + p] * 255;       // G = channel 1
    out[p * 4 + 2] = data[2 * HW + p] * 255;   // B = channel 2
    out[p * 4 + 3] = 255;
  }
  return out;
}
