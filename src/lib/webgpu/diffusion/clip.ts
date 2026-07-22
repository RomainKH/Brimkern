// CLIP text encoder on our WGSL kernels — the "text" stage of text→image (prompt → embeddings that
// condition the UNet). Architecture: token+position embeddings → N×(LayerNorm → causal MHA → residual;
// LayerNorm → MLP[fc1, gelu, fc2] → residual) → final LayerNorm.
//
// GPU-RESIDENT forward: the whole stack (23 layers ≈ 280 ops) is recorded into ONE session — one
// submit, one readback — instead of a readback + re-upload per op (the old CPU-orchestrated path did
// ~280 round-trips AND re-uploaded ~500 MB of f32 weights per generation). Weights may be persistent
// GPU handles (q8 pairs / f32 buffers — see sdturbo's clipWeightsToGpu) or CPU arrays (self-test:
// uploaded on the fly). Only the embeddings stay CPU-side (a [seq,dim] gather is trivial).
//
// Parameterized by config so it covers both CLIP-L (SD1.5: 768/12/last) and OpenCLIP ViT-H (SD2.1 /
// SD-Turbo: 1024/24/penultimate). See docs/image-gen-feasibility.md.

import type { WebGpuEngine } from '../kernels';

export interface ClipConfig { dim: number; layers: number; heads: number; vocab: number; maxPos: number; hidden: number; eps: number; finalLN?: boolean; act?: 'gelu' | 'quick_gelu'; }

// Generic over the tensor type: Float32Array (loader/self-test) or GPU handles (resident fast path —
// q8 {codes,sc} pairs for the matmul weights, f32 buffers for LN params/biases).
export interface ClipLayerWeights<T = Float32Array> {
  ln1g: T; ln1b: T;
  qw: T; qb: T; kw: T; kb: T; vw: T; vb: T;
  ow: T; ob: T;
  ln2g: T; ln2b: T;
  fc1w: T; fc1b: T; fc2w: T; fc2b: T;
}

export interface ClipWeights<T = Float32Array> {
  tokenEmb: Float32Array; // [vocab, dim] — stays CPU (embedding gather)
  posEmb: Float32Array;   // [maxPos, dim] — stays CPU
  layers: ClipLayerWeights<T>[];
  lnfg: T; lnfb: T;       // final LayerNorm
}

export class ClipTextEncoder {
  constructor(private engine: WebGpuEngine, private w: ClipWeights<any>, private cfg: ClipConfig) {}

  // tokens → hidden states [seq, dim]. (Which layer feeds the UNet — last vs penultimate — is chosen
  // by the caller via the weights/config; here we run the full stack + final LN.)
  async encode(tokens: number[]): Promise<Float32Array> {
    const { dim, heads, hidden, eps } = this.cfg;
    const headDim = dim / heads;
    const seq = tokens.length;

    // Embeddings: token row + learned positional (CPU gather — tiny), uploaded once into the session.
    const x0 = new Float32Array(seq * dim);
    for (let t = 0; t < seq; t++)
      for (let i = 0; i < dim; i++)
        x0[t * dim + i] = this.w.tokenEmb[tokens[t] * dim + i] + this.w.posEmb[t * dim + i];

    const s = this.engine.recordingSession();
    let x: any = x0;
    for (const L of this.w.layers) {
      const n1 = s.layernorm(x, L.ln1g, L.ln1b, seq, dim, eps);
      const q = s.addBias(s.matmulT(n1, L.qw, seq, dim, dim), L.qb, seq, dim);
      const k = s.addBias(s.matmulT(n1, L.kw, seq, dim, dim), L.kb, seq, dim);
      const v = s.addBias(s.matmulT(n1, L.vw, seq, dim, dim), L.vb, seq, dim);
      const attn = s.attention(q, k, v, seq, heads, heads, headDim, seq, 0); // causal, scale 1/√headDim
      const o = s.addBias(s.matmulT(attn, L.ow, seq, dim, dim), L.ob, seq, dim);
      x = s.add(x, o, seq * dim);

      const n2 = s.layernorm(x, L.ln2g, L.ln2b, seq, dim, eps);
      const fc1 = s.addBias(s.matmulT(n2, L.fc1w, seq, dim, hidden), L.fc1b, seq, hidden);
      const h = this.cfg.act === 'quick_gelu' ? s.quickGelu(fc1, seq * hidden) : s.gelu(fc1, seq * hidden); // OpenCLIP-H = gelu
      const m = s.addBias(s.matmulT(h, L.fc2w, seq, hidden, dim), L.fc2b, seq, dim);
      x = s.add(x, m, seq * dim);
    }
    // SD2.x conditions on the penultimate hidden state without ln_final (finalLN:false) — but the
    // sd-turbo checkpoint is ALREADY truncated and diffusers applies its final LN (finalLN:true).
    if (this.cfg.finalLN !== false) x = s.layernorm(x, this.w.lnfg, this.w.lnfb, seq, dim, eps);
    return s.finish(x, seq * dim);
  }
}

// ── Self-test: run a tiny synthetic config (random weights) through the GPU encoder and a CPU
//    reference; they must match. Validates the WIRING (embeddings + LN + causal MHA + MLP + residuals)
//    independently of any real model/tokenizer. Returns null on success or a failing-stage string.

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
// out[r,c] = sum_i a[r,i]·w[c,i] + bias[c]  (matmulT layout: w is [n, k])
function matmulTBiasCpu(a: Float32Array, w: Float32Array, bias: Float32Array, m: number, k: number, n: number): Float32Array {
  const o = new Float32Array(m * n);
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
    let s = 0; for (let i = 0; i < k; i++) s += a[r * k + i] * w[c * k + i];
    o[r * n + c] = s + bias[c];
  }
  return o;
}
function causalAttnCpu(q: Float32Array, k: Float32Array, v: Float32Array, seq: number, heads: number, headDim: number): Float32Array {
  const dim = heads * headDim, scale = 1 / Math.sqrt(headDim);
  const o = new Float32Array(seq * dim);
  for (let h = 0; h < heads; h++) for (let t = 0; t < seq; t++) {
    const sc = new Float32Array(t + 1);
    let mx = -Infinity;
    for (let j = 0; j <= t; j++) {
      let s = 0; for (let d = 0; d < headDim; d++) s += q[t * dim + h * headDim + d] * k[j * dim + h * headDim + d];
      s *= scale; sc[j] = s; if (s > mx) mx = s;
    }
    let sum = 0; for (let j = 0; j <= t; j++) { sc[j] = Math.exp(sc[j] - mx); sum += sc[j]; }
    for (let d = 0; d < headDim; d++) {
      let acc = 0; for (let j = 0; j <= t; j++) acc += (sc[j] / sum) * v[j * dim + h * headDim + d];
      o[t * dim + h * headDim + d] = acc;
    }
  }
  return o;
}

export async function validateClip(engine: WebGpuEngine): Promise<string | null> {
  const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1) * 0.3);
  const closeRel = (x: Float32Array, y: Float32Array, tol = 6e-3) =>
    x.length === y.length && x.every((vv, i) => Math.abs(vv - y[i]) <= tol * (1 + Math.abs(y[i])));

  const cfg: ClipConfig = { dim: 8, layers: 2, heads: 2, vocab: 10, maxPos: 6, hidden: 16, eps: 1e-5 };
  const { dim, layers, hidden, vocab, maxPos, heads } = cfg;
  const headDim = dim / heads;
  const mkLayer = (): ClipLayerWeights => ({
    ln1g: rand(dim), ln1b: rand(dim),
    qw: rand(dim * dim), qb: rand(dim), kw: rand(dim * dim), kb: rand(dim), vw: rand(dim * dim), vb: rand(dim),
    ow: rand(dim * dim), ob: rand(dim),
    ln2g: rand(dim), ln2b: rand(dim),
    fc1w: rand(hidden * dim), fc1b: rand(hidden), fc2w: rand(dim * hidden), fc2b: rand(dim),
  });
  const w: ClipWeights = {
    tokenEmb: rand(vocab * dim), posEmb: rand(maxPos * dim),
    layers: Array.from({ length: layers }, mkLayer),
    lnfg: rand(dim), lnfb: rand(dim),
  };
  const tokens = [1, 4, 2, 0]; // seq 4
  const seq = tokens.length;

  // GPU path
  const got = await new ClipTextEncoder(engine, w, cfg).encode(tokens);

  // CPU reference (mirrors encode exactly)
  let x = new Float32Array(seq * dim);
  for (let t = 0; t < seq; t++) for (let i = 0; i < dim; i++) x[t * dim + i] = w.tokenEmb[tokens[t] * dim + i] + w.posEmb[t * dim + i];
  for (const L of w.layers) {
    const n1 = lnCpu(x, L.ln1g, L.ln1b, seq, dim, cfg.eps);
    const q = matmulTBiasCpu(n1, L.qw, L.qb, seq, dim, dim);
    const k = matmulTBiasCpu(n1, L.kw, L.kb, seq, dim, dim);
    const v = matmulTBiasCpu(n1, L.vw, L.vb, seq, dim, dim);
    const attn = causalAttnCpu(q, k, v, seq, heads, headDim);
    const o = matmulTBiasCpu(attn, L.ow, L.ob, seq, dim, dim);
    const x1 = new Float32Array(seq * dim); for (let i = 0; i < x1.length; i++) x1[i] = x[i] + o[i];
    const n2 = lnCpu(x1, L.ln2g, L.ln2b, seq, dim, cfg.eps);
    const hh = matmulTBiasCpu(n2, L.fc1w, L.fc1b, seq, dim, hidden);
    for (let i = 0; i < hh.length; i++) { const v = hh[i]; const a = Math.max(-20, Math.min(20, 0.7978845608 * (v + 0.044715 * v * v * v))); hh[i] = 0.5 * v * (1 + Math.tanh(a)); } // gelu (default act)
    const m = matmulTBiasCpu(hh, L.fc2w, L.fc2b, seq, hidden, dim);
    x = new Float32Array(seq * dim); for (let i = 0; i < x.length; i++) x[i] = x1[i] + m[i];
  }
  const ref = lnCpu(x, w.lnfg, w.lnfb, seq, dim, cfg.eps);

  return closeRel(got, ref) ? null : 'clip_encoder';
}
