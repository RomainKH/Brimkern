// Réf CPU du MODULE MOTION AnimateDiff (TransformerTemporalModel) sur les poids q8 du BRIK,
// comparée au dump de l'oracle diffusers (étape 3 vidéo). Variantes commutables par env :
//   EPS=1e-6|1e-5 (GroupNorm), PE2=1|0 (pos_embed aussi avant attn2), HEADS=8|...
const fs = require('fs');
const path = require('path'); const ROOT = path.resolve(__dirname, '..'); // racine du projet (plus de chemin absolu en dur)
const { parseBrik } = require(`${ROOT}/.brik-build/brik/container.js`);
const { computeShardBases } = require(`${ROOT}/.brik-build/brik/loader.js`);
const { decodeTensor } = require(`${ROOT}/.brik-build/brik/codec.js`);

const EPS = parseFloat(process.env.EPS || '1e-6');
const PE2 = process.env.PE2 !== '0';
const HEADS = parseInt(process.env.HEADS || '8', 10);
const PREFIX = 'down_blocks.0.motion_modules.0.';

const buf = new Uint8Array(fs.readFileSync(`${ROOT}/public/models/video-motion-q8.brik`));
const parsed = parseBrik(buf);
const bases = computeShardBases(parsed.manifest.shards);
const W = new Map();
for (const [name, t] of Object.entries(parsed.manifest.tensors)) {
  if (!name.startsWith(PREFIX)) continue;
  const bytes = parsed.data.subarray(bases[t.shard] + t.offset, bases[t.shard] + t.offset + t.byteLength);
  W.set(name.slice(PREFIX.length), { data: decodeTensor(bytes, t.nElems, t.dtype), shape: t.shape });
}
const w = (n) => { const e = W.get(n); if (!e) throw new Error('poids manquant ' + n); return e.data; };

const F = 16, C = 320, H = 32, Wd = 32, S = H * Wd, HD = C / HEADS;
const IN = new Float32Array(fs.readFileSync(`${ROOT}/.brik-build/video-oracle/io_in.bin`).buffer);
const REF = new Float32Array(fs.readFileSync(`${ROOT}/.brik-build/video-oracle/io_out.bin`).buffer);

// GroupNorm(32, C) sur (F, C, H·W)
function groupNorm(x, gamma, beta, groups) {
  const out = new Float32Array(x.length), cpg = C / groups;
  for (let f = 0; f < F; f++) for (let g = 0; g < groups; g++) {
    let m = 0, n = cpg * S;
    for (let c = g * cpg; c < (g + 1) * cpg; c++) for (let s = 0; s < S; s++) m += x[(f * C + c) * S + s];
    m /= n;
    let v = 0;
    for (let c = g * cpg; c < (g + 1) * cpg; c++) for (let s = 0; s < S; s++) { const d = x[(f * C + c) * S + s] - m; v += d * d; }
    v /= n;
    const inv = 1 / Math.sqrt(v + EPS);
    for (let c = g * cpg; c < (g + 1) * cpg; c++) for (let s = 0; s < S; s++) {
      const i = (f * C + c) * S + s;
      out[i] = (x[i] - m) * inv * gamma[c] + beta[c];
    }
  }
  return out;
}
function layerNorm(x, rows, dim, gamma, beta) {
  const out = new Float32Array(x.length);
  for (let r = 0; r < rows; r++) {
    let m = 0; for (let i = 0; i < dim; i++) m += x[r * dim + i]; m /= dim;
    let v = 0; for (let i = 0; i < dim; i++) { const d = x[r * dim + i] - m; v += d * d; } v /= dim;
    const inv = 1 / Math.sqrt(v + 1e-5);
    for (let i = 0; i < dim; i++) out[r * dim + i] = (x[r * dim + i] - m) * inv * gamma[i] + beta[i];
  }
  return out;
}
// y = x·Wᵀ + b — W [out, in] ne[0]=in contigu
function linear(x, rows, inD, Wt, outD, b) {
  const y = new Float32Array(rows * outD);
  for (let r = 0; r < rows; r++) for (let o = 0; o < outD; o++) {
    let s = b ? b[o] : 0; const xb = r * inD, wb = o * inD;
    for (let i = 0; i < inD; i++) s += x[xb + i] * Wt[wb + i];
    y[r * outD + o] = s;
  }
  return y;
}
// self-attention temporelle : x (S rows de F tokens × C), par tête
function attention(x, q_w, k_w, v_w, o_w, o_b) {
  const rows = S * F;
  const q = linear(x, rows, C, q_w, C), k = linear(x, rows, C, k_w, C), v = linear(x, rows, C, v_w, C);
  const y = new Float32Array(rows * C), scale = 1 / Math.sqrt(HD);
  for (let s = 0; s < S; s++) for (let h = 0; h < HEADS; h++) {
    const hb = h * HD;
    for (let ti = 0; ti < F; ti++) {
      const qb = (s * F + ti) * C + hb;
      const sc = new Float32Array(F); let mx = -1e30;
      for (let tj = 0; tj < F; tj++) {
        let d = 0; const kb = (s * F + tj) * C + hb;
        for (let i = 0; i < HD; i++) d += q[qb + i] * k[kb + i];
        sc[tj] = d * scale; if (sc[tj] > mx) mx = sc[tj];
      }
      let sum = 0; for (let tj = 0; tj < F; tj++) { sc[tj] = Math.exp(sc[tj] - mx); sum += sc[tj]; }
      for (let tj = 0; tj < F; tj++) {
        const p = sc[tj] / sum, vb = (s * F + tj) * C + hb;
        for (let i = 0; i < HD; i++) y[qb + i] += p * v[vb + i];
      }
    }
  }
  return linear(y, rows, C, o_w, C, o_b);
}
const gelu = (v) => 0.5 * v * (1 + Math.tanh(0.7978845608028654 * (v + 0.044715 * v * v * v)));

// ── Forward TransformerTemporalModel ──
// (F, C, H, W) → GroupNorm → (S, F, C) → proj_in → bloc → proj_out → back → + résidu
let x = groupNorm(IN, w('norm.weight'), w('norm.bias'), 32);
// permute (F,C,S) → (S,F,C)
const seq = new Float32Array(S * F * C);
for (let f = 0; f < F; f++) for (let c = 0; c < C; c++) for (let s = 0; s < S; s++) seq[(s * F + f) * C + c] = x[(f * C + c) * S + s];
let h = linear(seq, S * F, C, w('proj_in.weight'), C, w('proj_in.bias'));
const pe = w('transformer_blocks.0.pos_embed.pe'); // [1, 32, C] → F premières positions
const addPe = (t) => { const o = t.slice(); for (let s = 0; s < S; s++) for (let f = 0; f < F; f++) for (let c = 0; c < C; c++) o[(s * F + f) * C + c] += pe[f * C + c]; return o; };
// attn1
let nh = layerNorm(h, S * F, C, w('transformer_blocks.0.norm1.weight'), w('transformer_blocks.0.norm1.bias'));
nh = addPe(nh);
let a = attention(nh, w('transformer_blocks.0.attn1.to_q.weight'), w('transformer_blocks.0.attn1.to_k.weight'), w('transformer_blocks.0.attn1.to_v.weight'), w('transformer_blocks.0.attn1.to_out.0.weight'), w('transformer_blocks.0.attn1.to_out.0.bias'));
for (let i = 0; i < h.length; i++) h[i] += a[i];
// attn2 (temporelle aussi)
nh = layerNorm(h, S * F, C, w('transformer_blocks.0.norm2.weight'), w('transformer_blocks.0.norm2.bias'));
if (PE2) nh = addPe(nh);
a = attention(nh, w('transformer_blocks.0.attn2.to_q.weight'), w('transformer_blocks.0.attn2.to_k.weight'), w('transformer_blocks.0.attn2.to_v.weight'), w('transformer_blocks.0.attn2.to_out.0.weight'), w('transformer_blocks.0.attn2.to_out.0.bias'));
for (let i = 0; i < h.length; i++) h[i] += a[i];
// FFN GEGLU
nh = layerNorm(h, S * F, C, w('transformer_blocks.0.norm3.weight'), w('transformer_blocks.0.norm3.bias'));
const projd = linear(nh, S * F, C, w('transformer_blocks.0.ff.net.0.proj.weight'), 2560, w('transformer_blocks.0.ff.net.0.proj.bias'));
const gg = new Float32Array(S * F * 1280);
for (let r = 0; r < S * F; r++) for (let i = 0; i < 1280; i++) gg[r * 1280 + i] = projd[r * 2560 + i] * gelu(projd[r * 2560 + 1280 + i]);
const ffo = linear(gg, S * F, 1280, w('transformer_blocks.0.ff.net.2.weight'), C, w('transformer_blocks.0.ff.net.2.bias'));
for (let i = 0; i < h.length; i++) h[i] += ffo[i];
// proj_out + reshape retour + résidu
h = linear(h, S * F, C, w('proj_out.weight'), C, w('proj_out.bias'));
const OUT = new Float32Array(F * C * S);
for (let f = 0; f < F; f++) for (let c = 0; c < C; c++) for (let s = 0; s < S; s++) OUT[(f * C + c) * S + s] = h[(s * F + f) * C + c] + IN[(f * C + c) * S + s];

// Comparaison
let dot = 0, na = 0, nb = 0, mae = 0, mref = 0;
for (let i = 0; i < OUT.length; i++) { dot += OUT[i] * REF[i]; na += OUT[i] ** 2; nb += REF[i] ** 2; mae += Math.abs(OUT[i] - REF[i]); mref += Math.abs(REF[i]); }
console.log(`EPS=${EPS} PE2=${PE2} HEADS=${HEADS} → cosine=${(dot / Math.sqrt(na * nb)).toFixed(6)} relMAE=${(mae / mref).toFixed(4)}`);
