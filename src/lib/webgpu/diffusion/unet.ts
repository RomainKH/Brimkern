// UNet building blocks (SD/diffusers UNet2DConditionModel) on our WGSL kernels. The UNet is the
// denoiser at the heart of diffusion: noisy latent + timestep + text embeddings → predicted noise.
// It's assembled from two repeated blocks — ResnetBlock2D (here) and the spatial Transformer2D
// (cross-attention to text, added next) — wired into a down/mid/up topology with skip connections.
//
// Like CLIP, the forward is CPU-orchestrated (engine ops return Float32Arrays, readback between
// steps): correctness first, GPU-resident fusion later. Each block ships a synthetic self-test
// (random weights vs a CPU reference) so the wiring is proven without the real ~860M-param weights.
// See docs/image-gen-feasibility.md.

import type { WebGpuEngine } from '../kernels';

// arr viewed as [rows, cols]: arr[r,c] += bias[c], in place.
function addBias(arr: Float32Array, bias: Float32Array, rows: number, cols: number): Float32Array {
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) arr[r * cols + c] += bias[c];
  return arr;
}

// Sinusoidal timestep embedding (diffusers get_timestep_embedding style): timestep → [dim] vector of
// cos/sin at geometrically-spaced frequencies. Pure CPU (tiny). Fed through timeMLP, then each ResBlock.
export function timeEmbedding(timestep: number, dim: number): Float32Array {
  const half = dim >> 1, out = new Float32Array(dim);
  for (let i = 0; i < half; i++) {
    const a = timestep * Math.exp((-Math.log(10000) * i) / half);
    out[i] = Math.cos(a);
    out[half + i] = Math.sin(a);
  }
  return out;
}

// Shared time MLP: linear(inDim→outDim) → silu → linear(outDim→outDim). Produces the [outDim] temb
// that every ResBlock consumes.
export async function timeMLP(e: WebGpuEngine, emb: Float32Array, w1: Float32Array, b1: Float32Array, w2: Float32Array, b2: Float32Array, inDim: number, outDim: number): Promise<Float32Array> {
  let t = addBias(await e.matmulT(emb, w1, 1, inDim, outDim), b1, 1, outDim);
  t = await e.silu(t);
  return addBias(await e.matmulT(t, w2, 1, outDim, outDim), b2, 1, outDim);
}

// Concatenate two feature maps along the channel axis: [Ca,HW] ++ [Cb,HW] → [Ca+Cb, HW]. The UNet's
// skip connections concat the matching down-path features onto the up path before each ResBlock.
export function concatChannels(a: Float32Array, b: Float32Array, Ca: number, Cb: number, HW: number): Float32Array {
  const o = new Float32Array((Ca + Cb) * HW);
  o.set(a.subarray(0, Ca * HW), 0);
  o.set(b.subarray(0, Cb * HW), Ca * HW);
  return o;
}

// Weight containers are GENERIC over the tensor type: Float32Array on the CPU path (loaders,
// self-tests), or GPU-resident handles on the fast path — a plain f32 GPUBuffer (norms/biases) or a
// q8web {codes,sc} pair (conv/linear weights quantized once at load, dequantized in-kernel). The
// session ops dispatch on the handle shape, so the SAME topology code drives both.
export interface ResBlockWeights<T = Float32Array> {
  norm1g: T; norm1b: T;          // GroupNorm before conv1 ([Cin])
  conv1w: T; conv1b: T;          // 3×3 conv Cin→Cout
  tembw: T; tembb: T;            // time-emb projection [Cout, tembDim]
  norm2g: T; norm2b: T;          // GroupNorm before conv2 ([Cout])
  conv2w: T; conv2b: T;          // 3×3 conv Cout→Cout
  shortcutw?: T; shortcutb?: T;  // 1×1 conv Cin→Cout (only when Cin≠Cout)
}

// ResnetBlock2D: x[Cin,H,W] + temb[tembDim] → [Cout,H,W]. The timestep embedding is projected to
// Cout and added per-channel across all spatial positions (the block's only timestep dependence).
export async function resBlock(
  e: WebGpuEngine, w: ResBlockWeights, x: Float32Array, temb: Float32Array,
  Cin: number, Cout: number, H: number, W: number, groups: number, tembDim: number, eps = 1e-5,
): Promise<Float32Array> {
  const HW = H * W;
  let h = await e.groupNorm(x, w.norm1g, w.norm1b, Cin, HW, groups, eps);
  h = await e.silu(h);
  h = await e.conv2d(h, w.conv1w, w.conv1b, Cin, H, W, Cout, 3, 3, 1, 1);

  // temb → silu → linear(Cout), broadcast-added over every spatial position.
  const ts = await e.silu(temb);
  const tp = addBias(await e.matmulT(ts, w.tembw, 1, tembDim, Cout), w.tembb, 1, Cout); // [Cout]
  for (let c = 0; c < Cout; c++) { const b = tp[c]; for (let i = 0; i < HW; i++) h[c * HW + i] += b; }

  h = await e.groupNorm(h, w.norm2g, w.norm2b, Cout, HW, groups, eps);
  h = await e.silu(h);
  h = await e.conv2d(h, w.conv2w, w.conv2b, Cout, H, W, Cout, 3, 3, 1, 1);

  const skip = (Cin === Cout)
    ? x
    : await e.conv2d(x, w.shortcutw!, w.shortcutb!, Cin, H, W, Cout, 1, 1, 1, 0);
  return e.add(skip, h);
}

// GPU-RESIDENT ResBlock: the exact same computation recorded into ONE command encoder (one submit,
// one readback) instead of ~7 submit+readback round-trips. Same result as resBlock (validated
// against resBlockCpu). Inputs/weights may be CPU Float32Arrays (uploaded on the fly) or GPU
// handles (persistent f32 buffers / q8 pairs). With `keep`, the output STAYS on the GPU (no
// readback) and is returned as a buffer handle the caller owns — the fully-resident forward path.
export async function resBlockResident(
  e: WebGpuEngine, w: ResBlockWeights<any>, x: any, temb: any,
  Cin: number, Cout: number, H: number, W: number, groups: number, tembDim: number, eps = 1e-5, keep = false,
): Promise<any> {
  const HW = H * W;
  const s = e.recordingSession();
  let h = s.groupNorm(x, w.norm1g, w.norm1b, Cin, HW, groups, eps);
  h = s.silu(h, Cin * HW);
  h = s.conv2d(h, w.conv1w, w.conv1b, Cin, H, W, Cout, 3, 3, 1, 1);
  let tp = s.silu(temb, tembDim);
  tp = s.matmulT(tp, w.tembw, 1, tembDim, Cout);
  tp = s.addBias(tp, w.tembb, 1, Cout);
  h = s.addChannelBias(h, tp, Cout, HW);
  h = s.groupNorm(h, w.norm2g, w.norm2b, Cout, HW, groups, eps);
  h = s.silu(h, Cout * HW);
  h = s.conv2d(h, w.conv2w, w.conv2b, Cout, H, W, Cout, 3, 3, 1, 1);
  const skip = (Cin === Cout) ? x : s.conv2d(x, w.shortcutw!, w.shortcutb!, Cin, H, W, Cout, 1, 1, 1, 0);
  const out = s.add(skip, h, Cout * HW);
  return keep ? s.finishKeep(out) : s.finish(out, Cout * HW);
}

// ── Self-test: tiny ResBlock (random weights) GPU vs CPU reference. Covers both the no-shortcut
//    (Cin==Cout) and shortcut (Cin≠Cout) paths. Returns null on success or a failing-stage string.

function siluCpu(x: Float32Array): Float32Array { return x.map((v) => v / (1 + Math.exp(-v))); }

function groupNormCpu(x: Float32Array, g: Float32Array, b: Float32Array, C: number, HW: number, groups: number, eps: number): Float32Array {
  const o = new Float32Array(C * HW), cpg = C / groups;
  for (let grp = 0; grp < groups; grp++) {
    const base = grp * cpg * HW, n = cpg * HW;
    let mean = 0; for (let i = 0; i < n; i++) mean += x[base + i]; mean /= n;
    let varr = 0; for (let i = 0; i < n; i++) { const d = x[base + i] - mean; varr += d * d; } varr /= n;
    const inv = 1 / Math.sqrt(varr + eps);
    for (let i = 0; i < n; i++) { const ch = grp * cpg + Math.floor(i / HW); o[base + i] = (x[base + i] - mean) * inv * g[ch] + b[ch]; }
  }
  return o;
}

function conv2dCpu(input: Float32Array, weight: Float32Array, bias: Float32Array, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, stride: number, pad: number): Float32Array {
  const OH = Math.floor((H + 2 * pad - kh) / stride) + 1, OW = Math.floor((W + 2 * pad - kw) / stride) + 1;
  const o = new Float32Array(Cout * OH * OW);
  for (let co = 0; co < Cout; co++) for (let oy = 0; oy < OH; oy++) for (let ox = 0; ox < OW; ox++) {
    let acc = bias[co];
    for (let ci = 0; ci < Cin; ci++) for (let ky = 0; ky < kh; ky++) for (let kx = 0; kx < kw; kx++) {
      const iy = oy * stride + ky - pad, ix = ox * stride + kx - pad;
      if (iy >= 0 && iy < H && ix >= 0 && ix < W) acc += input[ci * H * W + iy * W + ix] * weight[((co * Cin + ci) * kh + ky) * kw + kx];
    }
    o[(co * OH + oy) * OW + ox] = acc;
  }
  return o;
}

function matmulTBiasCpu(a: Float32Array, w: Float32Array, bias: Float32Array, m: number, k: number, n: number): Float32Array {
  const o = new Float32Array(m * n);
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
    let s = 0; for (let i = 0; i < k; i++) s += a[r * k + i] * w[c * k + i];
    o[r * n + c] = s + bias[c];
  }
  return o;
}

function resBlockCpu(w: ResBlockWeights, x: Float32Array, temb: Float32Array, Cin: number, Cout: number, H: number, W: number, groups: number, tembDim: number, eps: number): Float32Array {
  const HW = H * W;
  let h = conv2dCpu(siluCpu(groupNormCpu(x, w.norm1g, w.norm1b, Cin, HW, groups, eps)), w.conv1w, w.conv1b, Cin, H, W, Cout, 3, 3, 1, 1);
  const tp = matmulTBiasCpu(siluCpu(temb), w.tembw, w.tembb, 1, tembDim, Cout);
  for (let c = 0; c < Cout; c++) for (let i = 0; i < HW; i++) h[c * HW + i] += tp[c];
  h = conv2dCpu(siluCpu(groupNormCpu(h, w.norm2g, w.norm2b, Cout, HW, groups, eps)), w.conv2w, w.conv2b, Cout, H, W, Cout, 3, 3, 1, 1);
  const skip = (Cin === Cout) ? x : conv2dCpu(x, w.shortcutw!, w.shortcutb!, Cin, H, W, Cout, 1, 1, 1, 0);
  const o = new Float32Array(Cout * HW);
  for (let i = 0; i < o.length; i++) o[i] = skip[i] + h[i];
  return o;
}

// ── Spatial Transformer (Transformer2DModel + one BasicTransformerBlock), SD2.x linear-projection
//    style. This is where text conditioning enters: spatial self-attention + cross-attention to the
//    CLIP embeddings + a GEGLU feed-forward. x:[C,H,W], context:[seqT, ctxDim] → [C,H,W]. inner =
//    heads·headDim. All projections are linear (q/k/v no bias; out + ff + proj_in/out have bias).

export interface TransformerWeights<T = Float32Array> {
  normg: T; normb: T;            // GroupNorm in ([C])
  projInW: T; projInB: T;        // linear C→inner
  n1g: T; n1b: T;                // LN before self-attn
  q1w: T; k1w: T; v1w: T; o1w: T; o1b: T;
  n2g: T; n2b: T;                // LN before cross-attn
  q2w: T; k2w: T; v2w: T; o2w: T; o2b: T;
  n3g: T; n3b: T;                // LN before FF
  ffProjW: T; ffProjB: T;        // GEGLU: linear inner→2·ffInner
  ffOutW: T; ffOutB: T;          // linear ffInner→inner
  projOutW: T; projOutB: T;      // linear inner→C
}

export interface TransformerCfg { C: number; H: number; W: number; heads: number; headDim: number; ctxDim: number; seqT: number; ffInner: number; groups: number; }

const zeros = (n: number) => new Float32Array(n);

export async function spatialTransformer(e: WebGpuEngine, w: TransformerWeights, x: Float32Array, context: Float32Array, cfg: TransformerCfg): Promise<Float32Array> {
  const { C, H, W, heads, headDim, ctxDim, seqT, ffInner, groups } = cfg;
  const inner = heads * headDim, HW = H * W, LN = 1e-5, GN = 1e-6;

  const hn = await e.groupNorm(x, w.normg, w.normb, C, HW, groups, GN); // [C,H,W]
  // reshape [C,H,W] → [HW, C] (tokens = spatial positions)
  let hseq: Float32Array = new Float32Array(HW * C);
  for (let c = 0; c < C; c++) for (let p = 0; p < HW; p++) hseq[p * C + c] = hn[c * HW + p];
  hseq = addBias(await e.matmulT(hseq, w.projInW, HW, C, inner), w.projInB, HW, inner); // [HW, inner]

  // self-attention (non-causal over the HW spatial tokens)
  const n1 = await e.layernorm(hseq, w.n1g, w.n1b, HW, inner, LN);
  const q1 = await e.matmulT(n1, w.q1w, HW, inner, inner);
  const k1 = await e.matmulT(n1, w.k1w, HW, inner, inner);
  const v1 = await e.matmulT(n1, w.v1w, HW, inner, inner);
  const sa = addBias(await e.matmulT(await e.attentionFull(q1, k1, v1, HW, heads, heads, headDim, HW), w.o1w, HW, inner, inner), w.o1b, HW, inner);
  hseq = await e.add(hseq, sa);

  // cross-attention: queries from the latent, keys/values from the text context
  const n2 = await e.layernorm(hseq, w.n2g, w.n2b, HW, inner, LN);
  const q2 = await e.matmulT(n2, w.q2w, HW, inner, inner);
  const k2 = await e.matmulT(context, w.k2w, seqT, ctxDim, inner);
  const v2 = await e.matmulT(context, w.v2w, seqT, ctxDim, inner);
  const ca = addBias(await e.matmulT(await e.attentionFull(q2, k2, v2, HW, heads, heads, headDim, seqT), w.o2w, HW, inner, inner), w.o2b, HW, inner);
  hseq = await e.add(hseq, ca);

  // GEGLU feed-forward
  const n3 = await e.layernorm(hseq, w.n3g, w.n3b, HW, inner, LN);
  const proj = addBias(await e.matmulT(n3, w.ffProjW, HW, inner, ffInner * 2), w.ffProjB, HW, ffInner * 2); // [HW, 2·ffInner]
  const hid = new Float32Array(HW * ffInner), gate = new Float32Array(HW * ffInner);
  for (let p = 0; p < HW; p++) for (let i = 0; i < ffInner; i++) { hid[p * ffInner + i] = proj[p * ffInner * 2 + i]; gate[p * ffInner + i] = proj[p * ffInner * 2 + ffInner + i]; }
  const g = await e.geglu(gate, hid); // gelu(gate)·hid
  const ff = addBias(await e.matmulT(g, w.ffOutW, HW, ffInner, inner), w.ffOutB, HW, inner);
  hseq = await e.add(hseq, ff);

  // proj_out + reshape [HW,C] → [C,H,W] + residual
  hseq = addBias(await e.matmulT(hseq, w.projOutW, HW, inner, C), w.projOutB, HW, C);
  const hout = new Float32Array(C * HW);
  for (let c = 0; c < C; c++) for (let p = 0; p < HW; p++) hout[c * HW + p] = hseq[p * C + c];
  return e.add(x, hout);
}

// GPU-RESIDENT spatial transformer: the same computation recorded into ONE submit (~20 ops) instead
// of ~20 submit+readback round-trips. The reshape (transpose) and the GEGLU split run on the GPU
// (recTranspose / recGegluSplit). Same result as spatialTransformer (validated vs transformerCpu).
// Like resBlockResident: inputs/weights may be CPU arrays or GPU handles, and `keep` returns the
// output as a GPU buffer (no readback).
export async function spatialTransformerResident(e: WebGpuEngine, w: TransformerWeights<any>, x: any, context: any, cfg: TransformerCfg, keep = false): Promise<any> {
  const { C, H, W, heads, headDim, ctxDim, seqT, ffInner, groups } = cfg;
  const inner = heads * headDim, HW = H * W, LN = 1e-5, GN = 1e-6;
  const s = e.recordingSession();
  const hn = s.groupNorm(x, w.normg, w.normb, C, HW, groups, GN);          // [C,HW]
  let hseq = s.transpose(hn, C, HW);                                       // [HW,C]
  hseq = s.addBias(s.matmulT(hseq, w.projInW, HW, C, inner), w.projInB, HW, inner);
  // self-attention
  const n1 = s.layernorm(hseq, w.n1g, w.n1b, HW, inner, LN);
  const q1 = s.matmulT(n1, w.q1w, HW, inner, inner), k1 = s.matmulT(n1, w.k1w, HW, inner, inner), v1 = s.matmulT(n1, w.v1w, HW, inner, inner);
  const sa = s.addBias(s.matmulT(s.attentionFull(q1, k1, v1, HW, heads, heads, headDim, HW), w.o1w, HW, inner, inner), w.o1b, HW, inner);
  hseq = s.add(hseq, sa, HW * inner);
  // cross-attention (k/v from the text context)
  const n2 = s.layernorm(hseq, w.n2g, w.n2b, HW, inner, LN);
  const q2 = s.matmulT(n2, w.q2w, HW, inner, inner), k2 = s.matmulT(context, w.k2w, seqT, ctxDim, inner), v2 = s.matmulT(context, w.v2w, seqT, ctxDim, inner);
  const ca = s.addBias(s.matmulT(s.attentionFull(q2, k2, v2, HW, heads, heads, headDim, seqT), w.o2w, HW, inner, inner), w.o2b, HW, inner);
  hseq = s.add(hseq, ca, HW * inner);
  // GEGLU feed-forward
  const n3 = s.layernorm(hseq, w.n3g, w.n3b, HW, inner, LN);
  const proj = s.addBias(s.matmulT(n3, w.ffProjW, HW, inner, ffInner * 2), w.ffProjB, HW, ffInner * 2);
  const ff = s.addBias(s.matmulT(s.gegluSplit(proj, HW, ffInner), w.ffOutW, HW, ffInner, inner), w.ffOutB, HW, inner);
  hseq = s.add(hseq, ff, HW * inner);
  // proj_out + back to [C,HW] + residual
  hseq = s.addBias(s.matmulT(hseq, w.projOutW, HW, inner, C), w.projOutB, HW, C);
  const out = s.add(x, s.transpose(hseq, HW, C), C * HW);
  return keep ? s.finishKeep(out) : s.finish(out, C * HW);
}

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
function attnFullCpu(q: Float32Array, k: Float32Array, v: Float32Array, nT: number, heads: number, headDim: number, kvLen: number): Float32Array {
  const dim = heads * headDim, scale = 1 / Math.sqrt(headDim), o = new Float32Array(nT * dim);
  for (let h = 0; h < heads; h++) for (let t = 0; t < nT; t++) {
    const s = new Float32Array(kvLen); let mx = -Infinity;
    for (let j = 0; j < kvLen; j++) { let d = 0; for (let e = 0; e < headDim; e++) d += q[t * dim + h * headDim + e] * k[j * dim + h * headDim + e]; s[j] = d * scale; if (s[j] > mx) mx = s[j]; }
    let sum = 0; for (let j = 0; j < kvLen; j++) { s[j] = Math.exp(s[j] - mx); sum += s[j]; }
    for (let e = 0; e < headDim; e++) { let acc = 0; for (let j = 0; j < kvLen; j++) acc += (s[j] / sum) * v[j * dim + h * headDim + e]; o[t * dim + h * headDim + e] = acc; }
  }
  return o;
}
const geluTanhCpu = (v: number) => { const a = Math.max(-20, Math.min(20, 0.7978845608 * (v + 0.044715 * v * v * v))); return 0.5 * v * (1 + Math.tanh(a)); };

function transformerCpu(w: TransformerWeights, x: Float32Array, context: Float32Array, cfg: TransformerCfg): Float32Array {
  const { C, H, W, heads, headDim, ctxDim, seqT, ffInner, groups } = cfg;
  const inner = heads * headDim, HW = H * W, LN = 1e-5, GN = 1e-6;
  const add = (a: Float32Array, b: Float32Array) => { const o = new Float32Array(a.length); for (let i = 0; i < a.length; i++) o[i] = a[i] + b[i]; return o; };
  const hn = groupNormCpu(x, w.normg, w.normb, C, HW, groups, GN);
  let hseq: Float32Array = new Float32Array(HW * C);
  for (let c = 0; c < C; c++) for (let p = 0; p < HW; p++) hseq[p * C + c] = hn[c * HW + p];
  hseq = matmulTBiasCpu(hseq, w.projInW, w.projInB, HW, C, inner);
  // self-attn
  const n1 = lnCpu(hseq, w.n1g, w.n1b, HW, inner, LN);
  const q1 = matmulTBiasCpu(n1, w.q1w, zeros(inner), HW, inner, inner);
  const k1 = matmulTBiasCpu(n1, w.k1w, zeros(inner), HW, inner, inner);
  const v1 = matmulTBiasCpu(n1, w.v1w, zeros(inner), HW, inner, inner);
  hseq = add(hseq, matmulTBiasCpu(attnFullCpu(q1, k1, v1, HW, heads, headDim, HW), w.o1w, w.o1b, HW, inner, inner));
  // cross-attn
  const n2 = lnCpu(hseq, w.n2g, w.n2b, HW, inner, LN);
  const q2 = matmulTBiasCpu(n2, w.q2w, zeros(inner), HW, inner, inner);
  const k2 = matmulTBiasCpu(context, w.k2w, zeros(inner), seqT, ctxDim, inner);
  const v2 = matmulTBiasCpu(context, w.v2w, zeros(inner), seqT, ctxDim, inner);
  hseq = add(hseq, matmulTBiasCpu(attnFullCpu(q2, k2, v2, HW, heads, headDim, seqT), w.o2w, w.o2b, HW, inner, inner));
  // ff geglu
  const n3 = lnCpu(hseq, w.n3g, w.n3b, HW, inner, LN);
  const proj = matmulTBiasCpu(n3, w.ffProjW, w.ffProjB, HW, inner, ffInner * 2);
  const gfused = new Float32Array(HW * ffInner);
  for (let p = 0; p < HW; p++) for (let i = 0; i < ffInner; i++) gfused[p * ffInner + i] = geluTanhCpu(proj[p * ffInner * 2 + ffInner + i]) * proj[p * ffInner * 2 + i];
  hseq = add(hseq, matmulTBiasCpu(gfused, w.ffOutW, w.ffOutB, HW, ffInner, inner));
  // proj_out + reshape + residual
  hseq = matmulTBiasCpu(hseq, w.projOutW, w.projOutB, HW, inner, C);
  const hout = new Float32Array(C * HW);
  for (let c = 0; c < C; c++) for (let p = 0; p < HW; p++) hout[c * HW + p] = hseq[p * C + c];
  return add(x, hout);
}

// ── Full UNet forward, CONFIG-DRIVEN (diffusers UNet2DConditionModel topology). conv_in → N down
//    levels (each: layersPerBlock ResBlocks [+transformer], then a stride-2 downsample except the last)
//    → mid (res+transformer+res) → N up levels (each: layersPerBlock+1 ResBlocks, each consuming one
//    skip via channel-concat, [+transformer], then upsample except the last) → groupnorm+silu+conv_out.
//    The skip stack is LIFO and empties exactly. A SINGLE `runUnet` is parameterized by an op set (GPU
//    or CPU), so the self-test compares both with byte-identical topology logic — no twin to drift.

function upsampleNearestCpu(x: Float32Array, C: number, H: number, W: number, s: number): Float32Array {
  const OH = H * s, OW = W * s, o = new Float32Array(C * OH * OW);
  for (let c = 0; c < C; c++) for (let oy = 0; oy < OH; oy++) for (let ox = 0; ox < OW; ox++)
    o[c * OH * OW + oy * OW + ox] = x[c * H * W + Math.floor(oy / s) * W + Math.floor(ox / s)];
  return o;
}

export interface UnetLevel<T = Float32Array> {
  resnets: ResBlockWeights<T>[];
  attns: (TransformerWeights<T> | null)[];         // per resnet; null when the level has no cross-attn
  sampleW?: T; sampleB?: T;                        // down: stride-2 conv · up: post-upsample conv
}
export interface UnetWeights<T = Float32Array> {
  tw1: T; tb1: T; tw2: T; tb2: T; // time MLP
  convInW: T; convInB: T;
  down: UnetLevel<T>[];
  // Absents sur les UNets distillés sans mid-block (SDXS : mid_block_type null) — cfg.noMid.
  midRes1?: ResBlockWeights<T>; midAttn?: TransformerWeights<T>; midRes2?: ResBlockWeights<T>;
  up: UnetLevel<T>[];           // up[0] = deepest level
  normOutG: T; normOutB: T; convOutW: T; convOutB: T;
}
export interface UnetCfg {
  baseC: number; mult: number[]; layersPerBlock: number; attn: boolean[];
  // SD uses a FIXED attention head dim (64) → heads = channels/headDim PER level, and a FF inner of
  // channels·ffMult (4) per block. Deriving these per-block (not fixing them) is required for the real
  // weights to line up.
  headDim: number; ffMult: number; ctxDim: number; seqT: number; groups: number;
  tembIn: number; tembDim: number; H: number; W: number;
  // UNets distillés (SDXS) : pas de mid-block, et un NOMBRE de têtes fixe par niveau (le
  // attention_head_dim « 8 » des configs diffusers SD1-style est en réalité un compte de têtes) —
  // headDim devient C/heads par niveau au lieu du headDim fixe de SD2.
  noMid?: boolean; fixedHeads?: number;
}

type F = Float32Array;
// Activations flow through the ops as an OPAQUE value: Float32Array on the CPU path, a GPU buffer
// handle on the resident path. runUnet never inspects them — it only threads them between ops.
type V = any;
type Maybe = V | Promise<V>;
interface UnetOps {
  conv2d(x: V, w: V, b: V, Cin: number, H: number, W: number, Cout: number, kh: number, kw: number, stride: number, pad: number): Maybe;
  groupNorm(x: V, g: V, b: V, C: number, HW: number, groups: number, eps: number): Maybe;
  silu(x: V, len: number): Maybe;
  upsample(x: V, C: number, H: number, W: number, s: number): Maybe;
  resBlock(w: ResBlockWeights<any>, x: V, temb: V, Cin: number, Cout: number, H: number, W: number, groups: number, tembDim: number, eps: number): Maybe;
  transformer(w: TransformerWeights<any>, x: V, ctx: V, cfg: TransformerCfg): Maybe;
  matmulTBias(a: V, w: V, b: V, m: number, k: number, n: number): Maybe;
  concat(a: V, b: V, Ca: number, Cb: number, HW: number): Maybe;
  // Called after each block (resnet / transformer / down- or up-sample) — the resident path uses it
  // for thermal pacing (drain the queue + optional pause) and per-block progress.
  blockDone?(): Promise<void> | void;
}

async function runUnet(ops: UnetOps, w: UnetWeights<any>, latent: V, timestep: number, ctx: V, cfg: UnetCfg): Promise<V> {
  const { baseC, mult, layersPerBlock, attn, headDim, ffMult, ctxDim, seqT, groups, tembIn, tembDim } = cfg;
  const L = mult.length, eps = 1e-5;
  // heads + ff inner are derived per channel-count: SD's fixed head dim (64) and ff mult (4).
  // fixedHeads (SDXS) inverse la dérivation : têtes constantes, headDim = C/têtes par niveau.
  const tc = (cc: number, hh: number, ww: number): TransformerCfg => {
    const heads = cfg.fixedHeads ?? cc / headDim;
    return { C: cc, H: hh, W: ww, heads, headDim: cc / heads, ctxDim, seqT, ffInner: cc * ffMult, groups };
  };
  const tick = async () => { if (ops.blockDone) await ops.blockDone(); };

  let temb = await ops.matmulTBias(timeEmbedding(timestep, tembIn), w.tw1, w.tb1, 1, tembIn, tembDim);
  temb = await ops.silu(temb, tembDim);
  temb = await ops.matmulTBias(temb, w.tw2, w.tb2, 1, tembDim, tembDim);

  let H = cfg.H, W = cfg.W, curC = baseC * mult[0];
  let h = await ops.conv2d(latent, w.convInW, w.convInB, 4, H, W, curC, 3, 3, 1, 1);
  const skips: { data: V; C: number }[] = [{ data: h, C: curC }];

  for (let i = 0; i < L; i++) {
    const Cout = baseC * mult[i];
    for (let j = 0; j < layersPerBlock; j++) {
      h = await ops.resBlock(w.down[i].resnets[j], h, temb, curC, Cout, H, W, groups, tembDim, eps); curC = Cout;
      if (attn[i]) h = await ops.transformer(w.down[i].attns[j]!, h, ctx, tc(curC, H, W));
      skips.push({ data: h, C: curC });
      await tick();
    }
    if (i < L - 1) {
      h = await ops.conv2d(h, w.down[i].sampleW!, w.down[i].sampleB!, curC, H, W, curC, 3, 3, 2, 1);
      H = Math.floor((H + 2 - 3) / 2) + 1; W = Math.floor((W + 2 - 3) / 2) + 1;
      skips.push({ data: h, C: curC });
      await tick();
    }
  }

  if (!cfg.noMid) {
    h = await ops.resBlock(w.midRes1!, h, temb, curC, curC, H, W, groups, tembDim, eps);
    await tick();
    h = await ops.transformer(w.midAttn!, h, ctx, tc(curC, H, W));
    await tick();
    h = await ops.resBlock(w.midRes2!, h, temb, curC, curC, H, W, groups, tembDim, eps);
    await tick();
  }

  for (let i = L - 1; i >= 0; i--) {
    const Cout = baseC * mult[i];
    const lvl = w.up[L - 1 - i];
    for (let j = 0; j < layersPerBlock + 1; j++) {
      const sk = skips.pop()!;
      h = await ops.concat(h, sk.data, curC, sk.C, H * W);
      h = await ops.resBlock(lvl.resnets[j], h, temb, curC + sk.C, Cout, H, W, groups, tembDim, eps); curC = Cout;
      if (attn[i]) h = await ops.transformer(lvl.attns[j]!, h, ctx, tc(curC, H, W));
      await tick();
    }
    if (i > 0) {
      h = await ops.upsample(h, curC, H, W, 2); H *= 2; W *= 2;
      h = await ops.conv2d(h, lvl.sampleW!, lvl.sampleB!, curC, H, W, curC, 3, 3, 1, 1);
      await tick();
    }
  }

  h = await ops.groupNorm(h, w.normOutG, w.normOutB, curC, H * W, groups, eps);
  h = await ops.silu(h, curC * H * W);
  return ops.conv2d(h, w.convOutW, w.convOutB, curC, H, W, 4, 3, 3, 1, 1);
}

// Number of blockDone ticks a forward emits (per-block progress denominators).
export function unetBlockCount(cfg: UnetCfg): number {
  const L = cfg.mult.length;
  let n = 0;
  for (let i = 0; i < L; i++) n += cfg.layersPerBlock + (i < L - 1 ? 1 : 0); // down
  n += cfg.noMid ? 0 : 3;                                                    // mid
  for (let i = L - 1; i >= 0; i--) n += cfg.layersPerBlock + 1 + (i > 0 ? 1 : 0); // up
  return n;
}

// Thermal/progress pacing for the resident forward. Every `waitEvery` blocks the queue is DRAINED
// (waitGpu), then we sleep. `duty` is the real thermal knob: target GPU duty cycle in (0,1] — the
// sleep is PROPORTIONAL to the measured busy time since the last pause (busy·(1−duty)/duty), so a
// duty of 0.5 halves the average GPU power whatever the resolution/hardware. A fixed `pauseMs` acts
// as a floor. waitEvery also bounds queued work — without draining, all ~29 block submits queue
// instantly and buffer pressure peaks. 0 disables draining (full throttle).
export interface UnetPace { waitEvery?: number; pauseMs?: number; duty?: number; onBlock?: (done: number) => void }

// Drain + proportional sleep, shared by the UNet driver and TAESD. Returns the new "idle end" stamp.
export async function paceSleep(e: WebGpuEngine, lastIdleEnd: number, pace?: UnetPace): Promise<number> {
  await e.waitGpu();
  const busy = performance.now() - lastIdleEnd;
  const duty = pace?.duty;
  let sleep = pace?.pauseMs ?? 0;
  if (duty !== undefined && duty > 0 && duty < 1) sleep = Math.max(sleep, Math.min(1000, busy * (1 - duty) / duty));
  if (sleep > 0) await new Promise((r) => setTimeout(r, sleep));
  return performance.now();
}

// FULLY GPU-RESIDENT ops: activations stay on the GPU across the whole forward (block outputs are
// finishKeep'd buffers, chained as inputs to the next block). No readback until conv_out. Weights
// may be persistent GPU handles (f32 buffer or q8 pair — see sdturbo's unetWeightsToGpu) or CPU
// arrays (self-test path: uploaded on the fly). Every kept buffer is pushed onto `alive`; the
// caller (unetForward) releases them all after the final readback (peak extra VRAM ~100-200 MB at
// 512px — the block outputs; intra-block scratch is pooled/reused at each submit).
function gpuOps(e: WebGpuEngine, alive: any[], pace?: UnetPace): UnetOps {
  const keep = (buf: any) => { alive.push(buf); return buf; };
  const one = (rec: (s: any) => any): any => { const s = e.recordingSession(); return keep(s.finishKeep(rec(s))); };
  let blocks = 0, lastIdleEnd = performance.now();
  return {
    conv2d: (x, w, b, Ci, H, W, Co, kh, kw, st, pd) => one((s) => s.conv2d(x, w, b, Ci, H, W, Co, kh, kw, st, pd)),
    groupNorm: (x, g, b, C, HW, gr, eps) => one((s) => s.groupNorm(x, g, b, C, HW, gr, eps)),
    silu: (x, len) => one((s) => s.silu(x, len)),
    upsample: (x, C, H, W, sc) => one((s) => s.upsample(x, C, H, W, sc)),
    concat: (a, b, Ca, Cb, HW) => one((s) => s.concat(a, b, Ca, Cb, HW)),
    matmulTBias: (a, w, b, m, k, n) => one((s) => s.addBias(s.matmulT(a, w, m, k, n), b, m, n)),
    resBlock: async (w, x, t, Ci, Co, H, W, g, td, eps) => keep(await resBlockResident(e, w, x, t, Ci, Co, H, W, g, td, eps, true)),
    transformer: async (w, x, ctx, cfg) => keep(await spatialTransformerResident(e, w, x, ctx, cfg, true)),
    blockDone: async () => {
      blocks++;
      pace?.onBlock?.(blocks);
      const every = pace?.waitEvery ?? 1;
      if (every > 0 && blocks % every === 0) lastIdleEnd = await paceSleep(e, lastIdleEnd, pace);
    },
  };
}
function cpuOps(): UnetOps {
  return {
    conv2d: (x, w, b, Ci, H, W, Co, kh, kw, st, pd) => conv2dCpu(x, w, b, Ci, H, W, Co, kh, kw, st, pd),
    groupNorm: (x, g, b, C, HW, gr, eps) => groupNormCpu(x, g, b, C, HW, gr, eps),
    silu: (x) => siluCpu(x),
    upsample: (x, C, H, W, s) => upsampleNearestCpu(x, C, H, W, s),
    concat: (a, b, Ca, Cb, HW) => concatChannels(a, b, Ca, Cb, HW),
    resBlock: (w, x, t, Ci, Co, H, W, g, td, eps) => resBlockCpu(w, x, t, Ci, Co, H, W, g, td, eps),
    transformer: (w, x, ctx, cfg) => transformerCpu(w, x, ctx, cfg),
    matmulTBias: (a, w, b, m, k, n) => matmulTBiasCpu(a, w, b, m, k, n),
  };
}

// GPU forward: fully resident (activations + weights on the GPU, ONE readback at the end).
export async function unetForward(e: WebGpuEngine, w: UnetWeights<any>, latent: F, timestep: number, ctx: F, cfg: UnetCfg, pace?: UnetPace): Promise<F> {
  const alive: any[] = [];
  const ctxBuf = e.uploadGpu(ctx); // upload the CLIP context ONCE per forward (16 transformers read it)
  try {
    const outBuf = await runUnet(gpuOps(e, alive, pace), w, latent, timestep, ctxBuf, cfg);
    return await e.readGpu(outBuf, 4 * cfg.H * cfg.W);
  } finally {
    e.releaseGpu(alive);
    ctxBuf.destroy?.();
  }
}
const unetForwardCpu = (w: UnetWeights, latent: F, timestep: number, ctx: F, cfg: UnetCfg): Promise<F> => runUnet(cpuOps(), w, latent, timestep, ctx, cfg);

// ── Forward VIDÉO (AnimateDiff) : N frames traitées bloc par bloc, modules MOTION injectés ─────
// Même graphe spatial que runUnet, mais h devient UN LATENT PAR FRAME et, aux sites AnimateDiff
// (après chaque couche down/up, après l'attention du mid), le hook `motion` voit les N frames.
// DEUX régimes selon e.videoResidentOk : RÉSIDENT (défaut) → on passe les buffers GPU directement au
// hook, qui rend des buffers GPU (zéro readback) ; REPLI → readback CPU des N frames puis ré-injection
// (les ops résidents suivants les remontent). Le hook (videoGen) dispatche selon le type reçu. Sites :
// down_blocks.i.motion_modules.j (2/niveau) · mid_block.motion_modules.0 · up_blocks.k.motion_modules.j (3/niveau).
export type MotionHook = (site: string, frames: V[], C: number, H: number, W: number) => Promise<V[]>;

export async function unetForwardVideo(e: WebGpuEngine, w: UnetWeights<any>, latents: F[], timestep: number, ctx: F, cfg: UnetCfg, motion: MotionHook, pace?: UnetPace): Promise<F[]> {
  const alive: any[] = [];
  const ctxBuf = e.uploadGpu(ctx);
  const ops = gpuOps(e, alive, pace);
  const NF = latents.length;
  try {
    const { baseC, mult, layersPerBlock, attn, headDim, ffMult, ctxDim, seqT, groups, tembIn, tembDim } = cfg;
    const L = mult.length, eps = 1e-5;
    const tc = (cc: number, hh: number, ww: number): TransformerCfg => {
      const heads = cfg.fixedHeads ?? cc / headDim;
      return { C: cc, H: hh, W: ww, heads, headDim: cc / heads, ctxDim, seqT, ffInner: cc * ffMult, groups };
    };
    let temb = await ops.matmulTBias(timeEmbedding(timestep, tembIn), w.tw1, w.tb1, 1, tembIn, tembDim);
    temb = await ops.silu(temb, tembDim);
    temb = await ops.matmulTBias(temb, w.tw2, w.tb2, 1, tembDim, tembDim);

    let H = cfg.H, W = cfg.W, curC = baseC * mult[0];
    const applyMotion = async (site: string, hs: V[], C: number): Promise<V[]> => {
      // RÉSIDENT : les frames sont déjà des buffers GPU → on les passe telles quelles ; le hook rend des
      // buffers GPU qu'on suit dans `alive` (libérés en fin de forward, comme les autres kept buffers).
      if (e.videoResidentOk && hs.every((v) => !(v instanceof Float32Array))) {
        const out = await motion(site, hs, C, H, W);
        for (const b of out) alive.push(b);
        return out;
      }
      // REPLI : readback CPU des N frames, ré-injection (remontées par les ops suivants).
      const frames: F[] = [];
      for (const v of hs) frames.push(v instanceof Float32Array ? v : await e.readGpu(v, C * H * W));
      return motion(site, frames, C, H, W);
    };

    let h: V[] = [];
    for (let f = 0; f < NF; f++) h.push(await ops.conv2d(latents[f], w.convInW, w.convInB, 4, H, W, curC, 3, 3, 1, 1));
    const skips: { data: V; C: number }[][] = h.map((d) => [{ data: d, C: curC }]);

    for (let i = 0; i < L; i++) {
      const Cout = baseC * mult[i];
      for (let j = 0; j < layersPerBlock; j++) {
        for (let f = 0; f < NF; f++) {
          h[f] = await ops.resBlock(w.down[i].resnets[j], h[f], temb, curC, Cout, H, W, groups, tembDim, eps);
          if (attn[i]) h[f] = await ops.transformer(w.down[i].attns[j]!, h[f], ctx, tc(Cout, H, W));
        }
        curC = Cout;
        h = await applyMotion(`down_blocks.${i}.motion_modules.${j}`, h, curC);
        for (let f = 0; f < NF; f++) skips[f].push({ data: h[f], C: curC });
        if (ops.blockDone) await ops.blockDone();
      }
      if (i < L - 1) {
        for (let f = 0; f < NF; f++) {
          h[f] = await ops.conv2d(h[f], w.down[i].sampleW!, w.down[i].sampleB!, curC, H, W, curC, 3, 3, 2, 1);
          skips[f].push({ data: h[f], C: curC });
        }
        H = Math.floor((H + 2 - 3) / 2) + 1; W = Math.floor((W + 2 - 3) / 2) + 1;
        if (ops.blockDone) await ops.blockDone();
      }
    }

    if (!cfg.noMid) {
      for (let f = 0; f < NF; f++) h[f] = await ops.resBlock(w.midRes1!, h[f], temb, curC, curC, H, W, groups, tembDim, eps);
      for (let f = 0; f < NF; f++) h[f] = await ops.transformer(w.midAttn!, h[f], ctx, tc(curC, H, W));
      h = await applyMotion('mid_block.motion_modules.0', h, curC);
      for (let f = 0; f < NF; f++) h[f] = await ops.resBlock(w.midRes2!, h[f], temb, curC, curC, H, W, groups, tembDim, eps);
      if (ops.blockDone) await ops.blockDone();
    }

    for (let i = L - 1; i >= 0; i--) {
      const Cout = baseC * mult[i];
      const lvl = w.up[L - 1 - i];
      for (let j = 0; j < layersPerBlock + 1; j++) {
        for (let f = 0; f < NF; f++) {
          const sk = skips[f].pop()!;
          h[f] = await ops.concat(h[f], sk.data, curC, sk.C, H * W);
          h[f] = await ops.resBlock(lvl.resnets[j], h[f], temb, curC + sk.C, Cout, H, W, groups, tembDim, eps);
          if (attn[i]) h[f] = await ops.transformer(lvl.attns[j]!, h[f], ctx, tc(Cout, H, W));
        }
        curC = Cout;
        h = await applyMotion(`up_blocks.${L - 1 - i}.motion_modules.${j}`, h, curC);
        if (ops.blockDone) await ops.blockDone();
      }
      if (i > 0) {
        for (let f = 0; f < NF; f++) {
          h[f] = await ops.upsample(h[f], curC, H, W, 2);
        }
        H *= 2; W *= 2;
        for (let f = 0; f < NF; f++) h[f] = await ops.conv2d(h[f], lvl.sampleW!, lvl.sampleB!, curC, H, W, curC, 3, 3, 1, 1);
        if (ops.blockDone) await ops.blockDone();
      }
    }

    const out: F[] = [];
    for (let f = 0; f < NF; f++) {
      let o = await ops.groupNorm(h[f], w.normOutG, w.normOutB, curC, H * W, groups, eps);
      o = await ops.silu(o, curC * H * W);
      o = await ops.conv2d(o, w.convOutW, w.convOutB, curC, H, W, 4, 3, 3, 1, 1);
      out.push(o instanceof Float32Array ? o : await e.readGpu(o, 4 * H * W));
    }
    return out;
  } finally {
    e.releaseGpu(alive);
    ctxBuf.destroy?.();
  }
}

export async function validateUnet(engine: WebGpuEngine): Promise<string | null> {
  const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1) * 0.3);
  const closeRel = (x: Float32Array, y: Float32Array, tol = 6e-3) =>
    x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) <= tol * (1 + Math.abs(y[i])));

  const H = 3, W = 3, groups = 2, tembDim = 6, eps = 1e-5;
  const mkW = (Cin: number, Cout: number): ResBlockWeights => ({
    norm1g: rand(Cin), norm1b: rand(Cin),
    conv1w: rand(Cout * Cin * 9), conv1b: rand(Cout),
    tembw: rand(Cout * tembDim), tembb: rand(Cout),
    norm2g: rand(Cout), norm2b: rand(Cout),
    conv2w: rand(Cout * Cout * 9), conv2b: rand(Cout),
    shortcutw: Cin === Cout ? undefined : rand(Cout * Cin), shortcutb: Cin === Cout ? undefined : rand(Cout),
  });

  for (const [Cin, Cout] of [[4, 4], [2, 4]] as [number, number][]) {
    const w = mkW(Cin, Cout);
    const x = rand(Cin * H * W), temb = rand(tembDim);
    const got = await resBlock(engine, w, x, temb, Cin, Cout, H, W, groups, tembDim, eps);
    const ref = resBlockCpu(w, x, temb, Cin, Cout, H, W, groups, tembDim, eps);
    if (!closeRel(got, ref)) return `resblock(${Cin}→${Cout})`;
    // GPU-resident ResBlock (1 submit) must match the same CPU reference.
    const gotR = await resBlockResident(engine, w, x, temb, Cin, Cout, H, W, groups, tembDim, eps);
    if (!closeRel(gotR, ref)) return `resblock_resident(${Cin}→${Cout})`;
  }

  // Spatial transformer: C=4, 2×2 spatial, 2 heads × 2 = inner 4, context 3 tokens × 6 dims.
  {
    const cfg: TransformerCfg = { C: 4, H: 2, W: 2, heads: 2, headDim: 2, ctxDim: 6, seqT: 3, ffInner: 8, groups: 2 };
    const inner = cfg.heads * cfg.headDim;
    const tw: TransformerWeights = {
      normg: rand(cfg.C), normb: rand(cfg.C),
      projInW: rand(inner * cfg.C), projInB: rand(inner),
      n1g: rand(inner), n1b: rand(inner),
      q1w: rand(inner * inner), k1w: rand(inner * inner), v1w: rand(inner * inner), o1w: rand(inner * inner), o1b: rand(inner),
      n2g: rand(inner), n2b: rand(inner),
      q2w: rand(inner * inner), k2w: rand(inner * cfg.ctxDim), v2w: rand(inner * cfg.ctxDim), o2w: rand(inner * inner), o2b: rand(inner),
      n3g: rand(inner), n3b: rand(inner),
      ffProjW: rand(cfg.ffInner * 2 * inner), ffProjB: rand(cfg.ffInner * 2),
      ffOutW: rand(inner * cfg.ffInner), ffOutB: rand(inner),
      projOutW: rand(cfg.C * inner), projOutB: rand(cfg.C),
    };
    const x = rand(cfg.C * cfg.H * cfg.W), ctx = rand(cfg.seqT * cfg.ctxDim);
    const got = await spatialTransformer(engine, tw, x, ctx, cfg);
    const ref = transformerCpu(tw, x, ctx, cfg);
    if (!closeRel(got, ref)) return 'transformer';
    // GPU-resident transformer (1 submit) must match the same CPU reference.
    const gotR = await spatialTransformerResident(engine, tw, x, ctx, cfg);
    if (!closeRel(gotR, ref)) return 'transformer_resident';
  }

  // time MLP: linear → silu → linear (the shared timestep projection)
  {
    const inD = 6, outD = 8;
    const emb = timeEmbedding(7, inD);
    const w1 = rand(outD * inD), b1 = rand(outD), w2 = rand(outD * outD), b2 = rand(outD);
    const got = await timeMLP(engine, emb, w1, b1, w2, b2, inD, outD);
    let t = matmulTBiasCpu(emb, w1, b1, 1, inD, outD);
    t = siluCpu(t);
    const ref = matmulTBiasCpu(t, w2, b2, 1, outD, outD);
    if (!closeRel(got, ref)) return 'time_mlp';
  }

  // Full config-driven UNet: 2 levels (mult [1,2]), 1 ResBlock/block, both levels with cross-attn.
  {
    const ucfg: UnetCfg = { baseC: 4, mult: [1, 2], layersPerBlock: 1, attn: [true, true], headDim: 2, ffMult: 2, ctxDim: 6, seqT: 3, groups: 2, tembIn: 6, tembDim: 8, H: 4, W: 4 };
    const { baseC, ctxDim, ffMult, tembDim } = ucfg;
    const mkRes = (Cin: number, Cout: number): ResBlockWeights => ({
      norm1g: rand(Cin), norm1b: rand(Cin), conv1w: rand(Cout * Cin * 9), conv1b: rand(Cout),
      tembw: rand(Cout * tembDim), tembb: rand(Cout), norm2g: rand(Cout), norm2b: rand(Cout),
      conv2w: rand(Cout * Cout * 9), conv2b: rand(Cout),
      shortcutw: Cin === Cout ? undefined : rand(Cout * Cin), shortcutb: Cin === Cout ? undefined : rand(Cout),
    });
    const mkTrans = (cc: number): TransformerWeights => {
      const ffI = cc * ffMult;
      return {
        normg: rand(cc), normb: rand(cc), projInW: rand(cc * cc), projInB: rand(cc),
        n1g: rand(cc), n1b: rand(cc), q1w: rand(cc * cc), k1w: rand(cc * cc), v1w: rand(cc * cc), o1w: rand(cc * cc), o1b: rand(cc),
        n2g: rand(cc), n2b: rand(cc), q2w: rand(cc * cc), k2w: rand(cc * ctxDim), v2w: rand(cc * ctxDim), o2w: rand(cc * cc), o2b: rand(cc),
        n3g: rand(cc), n3b: rand(cc), ffProjW: rand(ffI * 2 * cc), ffProjB: rand(ffI * 2), ffOutW: rand(cc * ffI), ffOutB: rand(cc),
        projOutW: rand(cc * cc), projOutB: rand(cc),
      };
    };
    const C0 = baseC * 1, C1 = baseC * 2; // 4, 8
    const uw: UnetWeights = {
      tw1: rand(tembDim * ucfg.tembIn), tb1: rand(tembDim), tw2: rand(tembDim * tembDim), tb2: rand(tembDim),
      convInW: rand(C0 * 4 * 9), convInB: rand(C0),
      down: [
        { resnets: [mkRes(C0, C0)], attns: [mkTrans(C0)], sampleW: rand(C0 * C0 * 9), sampleB: rand(C0) },
        { resnets: [mkRes(C0, C1)], attns: [mkTrans(C1)] },
      ],
      midRes1: mkRes(C1, C1), midAttn: mkTrans(C1), midRes2: mkRes(C1, C1),
      up: [
        // deepest first: 2 resnets consuming skips {C1}, {C0} → Cin = C1+C1, C1+C0
        { resnets: [mkRes(C1 + C1, C1), mkRes(C1 + C0, C1)], attns: [mkTrans(C1), mkTrans(C1)], sampleW: rand(C1 * C1 * 9), sampleB: rand(C1) },
        // shallow: 2 resnets consuming skips {C0}, {C0} → Cin = C1+C0, C0+C0
        { resnets: [mkRes(C1 + C0, C0), mkRes(C0 + C0, C0)], attns: [mkTrans(C0), mkTrans(C0)] },
      ],
      normOutG: rand(C0), normOutB: rand(C0), convOutW: rand(4 * C0 * 9), convOutB: rand(4),
    };
    const latent = rand(4 * ucfg.H * ucfg.W), ctx = rand(ucfg.seqT * ctxDim);
    const got = await unetForward(engine, uw, latent, 7, ctx, ucfg);
    const ref = await unetForwardCpu(uw, latent, 7, ctx, ucfg);
    if (!closeRel(got, ref, 1e-2)) return 'unet_forward';
  }
  return null;
}
