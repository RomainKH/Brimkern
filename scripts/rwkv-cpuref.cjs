// Référence CPU du forward RWKV-7 (lit les vrais poids GGUF f16). But : NAILER la sémantique exacte
// (décroissance w, a/b, GroupNorm, bonus r·k) en vérifiant que la génération est COHÉRENTE. Une fois
// validée, on porte sur GPU (WGSL) avec self-consistency. Basé sur la réf BlinkDL RWKV-7 "goose".
const fs = require('fs');
const path = require('path'); const ROOT = path.resolve(__dirname, '..'); // racine du projet (plus de chemin absolu en dur)
const { parseGguf } = require(`${ROOT}/.brik-build/webgpu/ggufParser.js`);
const { RwkvTokenizer } = require(`${ROOT}/.brik-build/rwkvTokenizer.js`);
const { f16BitsToF32 } = require(`${ROOT}/.brik-build/brik/f16.js`);
const PATH = process.env.RWKV_GGUF || `${ROOT}/.brik-build/rwkv7-0.1b-world-f16.gguf`;

let buf, gguf;
const cache = new Map();
function T(name) { // tensor → Float32Array (dequant f16/f32), cached
  if (cache.has(name)) return cache.get(name);
  const t = gguf.tensors[name]; if (!t) throw new Error('tenseur manquant ' + name);
  const dv = new DataView(buf.buffer, buf.byteOffset + t.offset, t.bytes);
  const o = new Float32Array(t.nElems);
  if (t.type === 'F32') for (let i = 0; i < t.nElems; i++) o[i] = dv.getFloat32(i * 4, true);
  else if (t.type === 'F16') for (let i = 0; i < t.nElems; i++) o[i] = f16BitsToF32(dv.getUint16(i * 2, true));
  else throw new Error('type ' + t.type);
  cache.set(name, o); return o;
}
// y[o] = Σ_i W[o*IN+i]*x[i]  (W stocké [OUT,IN], IN innermost = convention GGUF/recMM)
function matvec(W, x, IN, OUT) { const y = new Float32Array(OUT); for (let o = 0; o < OUT; o++) { let s = 0, b = o * IN; for (let i = 0; i < IN; i++) s += W[b + i] * x[i]; y[o] = s; } return y; }
function layernorm(x, w, b, D, eps = 1e-5) { let m = 0; for (let i = 0; i < D; i++) m += x[i]; m /= D; let v = 0; for (let i = 0; i < D; i++) { const d = x[i] - m; v += d * d; } v /= D; const s = 1 / Math.sqrt(v + eps); const o = new Float32Array(D); for (let i = 0; i < D; i++) o[i] = (x[i] - m) * s * w[i] + b[i]; return o; }
const sig = (v) => 1 / (1 + Math.exp(-v));
const lerp = (x, xx, l, D) => { const o = new Float32Array(D); for (let i = 0; i < D; i++) o[i] = x[i] + xx[i] * l[i]; return o; };

let D, H, NH, NL;

function timeMix(L, x, st, sh) {
  const p = `blk.${L}.`;
  const xx = new Float32Array(D); for (let i = 0; i < D; i++) xx[i] = st.tmPrev[i] - x[i];
  st.tmPrev = x.slice();
  const lf = T(p + 'time_mix_lerp_fused.weight'); // [D,1,1,6] → 6 vecteurs de D (ordre r,w,k,v,a,g)
  const lget = (k) => { const o = new Float32Array(D); for (let i = 0; i < D; i++) o[i] = lf[k * D + i]; return o; }; // ne[0]=D contigu → 6 blocs de D
  const xr = lerp(x, xx, lget(0), D), xw = lerp(x, xx, lget(1), D), xk = lerp(x, xx, lget(2), D), xv = lerp(x, xx, lget(3), D), xa = lerp(x, xx, lget(4), D), xg = lerp(x, xx, lget(5), D);
  const r = matvec(T(p + 'time_mix_receptance.weight'), xr, D, D);
  let k = matvec(T(p + 'time_mix_key.weight'), xk, D, D);
  let v = matvec(T(p + 'time_mix_value.weight'), xv, D, D);
  // décroissance w = exp(-exp(0.5) * sigmoid(w0 + tanh(xw@w1)@w2))  (0.606531 = exp(-0.5))
  const w1 = T(p + 'time_mix_w1.weight'), w2 = T(p + 'time_mix_w2.weight'), RW = w1.length / D;
  const wt = matvec(w1, xw, D, RW); for (let rr = 0; rr < RW; rr++) wt[rr] = Math.tanh(wt[rr]);
  const wpre = matvec(w2, wt, RW, D); const w0 = T(p + 'time_mix_w0.weight'); const w = new Float32Array(D);
  for (let o = 0; o < D; o++) w[o] = Math.exp(-0.606531 * sig(w0[o] + wpre[o]));
  // a (iclr) = sigmoid(a0 + (xa@a1)@a2)
  const a1 = T(p + 'time_mix_a1.weight'), a2 = T(p + 'time_mix_a2.weight'), RA = a1.length / D, a0 = T(p + 'time_mix_a0.weight');
  const apre = matvec(a2, matvec(a1, xa, D, RA), RA, D);
  const a = new Float32Array(D); for (let o = 0; o < D; o++) a[o] = sig(a0[o] + apre[o]);
  // g = sigmoid(xg@g1)@g2
  const g1 = T(p + 'time_mix_g1.weight'), g2 = T(p + 'time_mix_g2.weight'), RG = g1.length / D;
  const gt = matvec(g1, xg, D, RG); for (let rr = 0; rr < RG; rr++) gt[rr] = sig(gt[rr]);
  const g = matvec(g2, gt, RG, D);
  // résidu de valeur (couches > 0)
  if (L === 0) sh.vFirst = v.slice();
  else { const v1 = T(p + 'time_mix_v1.weight'), v2 = T(p + 'time_mix_v2.weight'), RV = v1.length / D, v0 = T(p + 'time_mix_v0.weight'); const vpre = matvec(v2, matvec(v1, xv, D, RV), RV, D); for (let o = 0; o < D; o++) v[o] = v[o] + (sh.vFirst[o] - v[o]) * sig(v0[o] + vpre[o]); }
  // kk = k*k_k, normalisé L2 par tête ; k = k*(1+(a-1)*k_a)
  const k_k = T(p + 'time_mix_k_k.weight'), k_a = T(p + 'time_mix_k_a.weight');
  const kk = new Float32Array(D); for (let i = 0; i < D; i++) kk[i] = k[i] * k_k[i];
  for (let h = 0; h < NH; h++) { let n = 0; for (let j = 0; j < H; j++) { const val = kk[h * H + j]; n += val * val; } n = Math.sqrt(n) || 1e-12; for (let j = 0; j < H; j++) kk[h * H + j] /= n; }
  for (let i = 0; i < D; i++) k[i] = k[i] * (1 + (a[i] - 1) * k_a[i]);
  // WKV : par tête, a_=-kk, b_=kk*a ; S[i][j]=w[j]*S[i][j]+v[i]*k[j]+b_[j]*sa_i ; sa_i=Σ a_[j]*S[i][j] ; y[i]=Σ r[j]*S[i][j]
  const y = new Float32Array(D);
  for (let h = 0; h < NH; h++) {
    const hb = h * H, S = st.S[h];
    for (let i = 0; i < H; i++) {
      let sa = 0; for (let j = 0; j < H; j++) sa += (-kk[hb + j]) * S[i * H + j];
      let yi = 0; const vi = v[hb + i];
      for (let j = 0; j < H; j++) { const s = w[hb + j] * S[i * H + j] + vi * k[hb + j] + (kk[hb + j] * a[hb + j]) * sa; S[i * H + j] = s; yi += r[hb + j] * s; }
      y[hb + i] = yi;
    }
  }
  // GroupNorm par tête (affine [D]) + bonus r·k
  const lnw = T(p + 'time_mix_ln.weight'), lnb = T(p + 'time_mix_ln.bias'), rk = T(p + 'time_mix_r_k.weight');
  const out = new Float32Array(D);
  for (let h = 0; h < NH; h++) { const hb = h * H; let m = 0; for (let j = 0; j < H; j++) m += y[hb + j]; m /= H; let vv = 0; for (let j = 0; j < H; j++) { const d = y[hb + j] - m; vv += d * d; } vv /= H; const sc = 1 / Math.sqrt(vv + 64e-5); for (let j = 0; j < H; j++) out[hb + j] = (y[hb + j] - m) * sc * lnw[hb + j] + lnb[hb + j]; }
  for (let h = 0; h < NH; h++) { const hb = h * H; let bonus = 0; for (let j = 0; j < H; j++) bonus += r[hb + j] * k[hb + j] * rk[hb + j]; for (let j = 0; j < H; j++) out[hb + j] += bonus * v[hb + j]; }
  // sortie = Woutput · (out * g)
  const og = new Float32Array(D); for (let i = 0; i < D; i++) og[i] = out[i] * g[i];
  return matvec(T(p + 'time_mix_output.weight'), og, D, D);
}

function channelMix(L, x, st) {
  const p = `blk.${L}.`;
  const xx = new Float32Array(D); for (let i = 0; i < D; i++) xx[i] = st.cmPrev[i] - x[i];
  st.cmPrev = x.slice();
  const xk = lerp(x, xx, T(p + 'channel_mix_lerp_k.weight'), D);
  const Wk = T(p + 'channel_mix_key.weight'), FFN = Wk.length / D;
  const k = new Float32Array(FFN); for (let o = 0; o < FFN; o++) { let s = 0, b = o * D; for (let i = 0; i < D; i++) s += Wk[b + i] * xk[i]; k[o] = s > 0 ? s * s : 0; }
  return matvec(T(p + 'channel_mix_value.weight'), k, FFN, D);
}

function forward(tok, states) {
  const sh = { vFirst: null };
  let x = T('token_embd.weight').slice(tok * D, tok * D + D); // ligne tok
  x = layernorm(x, T('token_embd_norm.weight'), T('token_embd_norm.bias'), D);
  for (let L = 0; L < NL; L++) {
    const st = states[L];
    const tm = timeMix(L, layernorm(x, T(`blk.${L}.attn_norm.weight`), T(`blk.${L}.attn_norm.bias`), D), st, sh);
    for (let i = 0; i < D; i++) x[i] += tm[i];
    const cm = channelMix(L, layernorm(x, T(`blk.${L}.attn_norm_2.weight`), T(`blk.${L}.attn_norm_2.bias`), D), st);
    for (let i = 0; i < D; i++) x[i] += cm[i];
  }
  x = layernorm(x, T('output_norm.weight'), T('output_norm.bias'), D);
  return matvec(T('output.weight'), x, D, gguf.tensors['output.weight'].nElems / D);
}

(async () => {
  buf = fs.readFileSync(PATH);
  const headLen = Math.min(buf.length, 100 * 1024 * 1024);
  gguf = await parseGguf(new Blob([buf.subarray(0, headLen)]));
  // t.offset du parser est relatif à la SECTION data ; rendons-le absolu (data commence après le header aligné).
  // parseGguf donne des offsets relatifs au début de la section tensors → il faut ajouter tensorDataOffset.
  D = gguf.config.d; H = gguf.config.rwkv.headSize; NH = D / H; NL = gguf.config.blockCount;
  console.log(`D=${D} H=${H} NH=${NH} NL=${NL}`);
  const tk = new RwkvTokenizer(gguf.metadata['tokenizer.ggml.tokens'], gguf.metadata['tokenizer.ggml.eos_token_id'] ?? 0);
  const states = Array.from({ length: NL }, () => ({ S: Array.from({ length: NH }, () => new Float32Array(H * H)), tmPrev: new Float32Array(D), cmPrev: new Float32Array(D), vFirst: null }));
  const prompt = process.argv[2] || 'The Eiffel Tower is located in the city of';
  const ids = tk.encode(prompt);
  console.log('prompt:', JSON.stringify(prompt), '→', ids.length, 'tokens');
  let logits;
  for (const id of ids) logits = forward(id, states);
  let outIds = [];
  for (let step = 0; step < 20; step++) {
    let best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i;
    if (best === (gguf.metadata['tokenizer.ggml.eos_token_id'] ?? 0)) break;
    outIds.push(best);
    logits = forward(best, states);
  }
  console.log('\n=== CONTINUATION (greedy) ===');
  console.log(prompt + '\x1b[1m' + tk.decode(outIds) + '\x1b[0m');
})().catch(e => { console.error('ERR', e.stack); process.exit(1); });
