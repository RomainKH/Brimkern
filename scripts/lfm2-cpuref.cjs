// Référence CPU du forward LFM2/LFM2.5 (lit les vrais poids GGUF F16). But : NAILER la sémantique
// exacte (shortconv gaté B/C/X, attention GQA + qk-norm + RoPE neox, SwiGLU, tête liée) en vérifiant
// la continuation greedy token à token contre llama-cli (même GGUF, --temp 0). Une fois validée,
// cette réf devient l'oracle du port GPU (glu JS byte-identique puis kernels WGSL selfValidate),
// comme scripts/rwkv-cpuref.cjs l'a été pour RWKV-7.
//
// Usage : node scripts/lfm2-cpuref.cjs "prompt" [nTokens]
// Env : LFM2_GGUF (défaut .brik-build/lfm25-230m-f16.gguf) ;
//       variantes d'itération : SPLIT=bcx|xbc (ordre des vues in_proj), ROPE=neox|norm,
//       FINALNORM=tok|none (token_embd_norm en norme finale ou pas).
const fs = require('fs');
const path = require('path'); const ROOT = path.resolve(__dirname, '..'); // racine du projet (plus de chemin absolu en dur)
const { parseGguf } = require(`${ROOT}/.brik-build/webgpu/ggufParser.js`);
const { f16BitsToF32 } = require(`${ROOT}/.brik-build/brik/f16.js`);
const PATH = process.env.LFM2_GGUF || `${ROOT}/.brik-build/lfm25-230m-f16.gguf`;
const SPLIT = process.env.SPLIT || 'bcx';
const ROPE = process.env.ROPE || 'neox';
const FINALNORM = process.env.FINALNORM || 'tok';

let buf, gguf;
const cache = new Map();
function T(name) {
  if (cache.has(name)) return cache.get(name);
  const t = gguf.tensors[name]; if (!t) throw new Error('tenseur manquant ' + name);
  const dv = new DataView(buf.buffer, buf.byteOffset + t.offset, t.bytes);
  const o = new Float32Array(t.nElems);
  if (t.type === 'F32') for (let i = 0; i < t.nElems; i++) o[i] = dv.getFloat32(i * 4, true);
  else if (t.type === 'F16') for (let i = 0; i < t.nElems; i++) o[i] = f16BitsToF32(dv.getUint16(i * 2, true));
  else throw new Error('type ' + t.type + ' (GGUF F16 attendu) pour ' + name);
  cache.set(name, o); return o;
}
// y[o] = Σ_i W[o*IN+i]·x[i] (convention GGUF : ne[0]=IN contigu)
function matvec(W, x, IN, OUT) { const y = new Float32Array(OUT); for (let o = 0; o < OUT; o++) { let s = 0; const b = o * IN; for (let i = 0; i < IN; i++) s += W[b + i] * x[i]; y[o] = s; } return y; }
function rmsnorm(x, w, D, eps) { let ss = 0; for (let i = 0; i < D; i++) ss += x[i] * x[i]; const s = 1 / Math.sqrt(ss / D + eps); const o = new Float32Array(D); for (let i = 0; i < D; i++) o[i] = x[i] * s * w[i]; return o; }
const silu = (v) => v / (1 + Math.exp(-v));

let D, NH, NKV, HD, NL, EPS, THETA, LCACHE;

// RoPE sur un vecteur multi-têtes [nh*HD], position p.
function rope(v, nh, p) {
  const o = v.slice();
  for (let h = 0; h < nh; h++) {
    const b = h * HD;
    for (let i = 0; i < HD / 2; i++) {
      const freq = Math.pow(THETA, -2 * i / HD);
      const cos = Math.cos(p * freq), sin = Math.sin(p * freq);
      if (ROPE === 'neox') { // paires (i, i+HD/2)
        const a = v[b + i], bb = v[b + i + HD / 2];
        o[b + i] = a * cos - bb * sin; o[b + i + HD / 2] = a * sin + bb * cos;
      } else { // paires adjacentes (2i, 2i+1)
        const a = v[b + 2 * i], bb = v[b + 2 * i + 1];
        o[b + 2 * i] = a * cos - bb * sin; o[b + 2 * i + 1] = a * sin + bb * cos;
      }
    }
  }
  return o;
}

function isConvLayer(L) { return !!gguf.tensors[`blk.${L}.shortconv.in_proj.weight`]; }

// st par couche : conv → {hist: [Float32Array(D) × (LCACHE-1)]} ; attn → {K: [], V: []}
function forward(tok, pos, st) {
  let x = T('token_embd.weight').slice(tok * D, tok * D + D);
  for (let L = 0; L < NL; L++) {
    const p = `blk.${L}.`;
    const h = rmsnorm(x, T(p + 'attn_norm.weight'), D, EPS);
    let out;
    if (isConvLayer(L)) {
      const bcx = matvec(T(p + 'shortconv.in_proj.weight'), h, D, 3 * D);
      const off = { b: 0, c: D, x: 2 * D }; // ordre BCX (llama.cpp build_shortconv)
      if (SPLIT === 'xbc') { off.x = 0; off.b = D; off.c = 2 * D; }
      const bx = new Float32Array(D); for (let i = 0; i < D; i++) bx[i] = bcx[off.b + i] * bcx[off.x + i];
      // conv causale depthwise fenêtre LCACHE : y[i] = Σ_k w[i*LC+k] · hist[k] (hist chronologique, dernier = courant)
      const w = T(p + 'shortconv.conv.weight'); // [LCACHE, D] → ne[0]=LCACHE contigu : w[ch*LC+k]
      st[L].hist.push(bx); if (st[L].hist.length > LCACHE) st[L].hist.shift();
      const y = new Float32Array(D);
      const H0 = LCACHE - st[L].hist.length; // padding zéro au début
      for (let i = 0; i < D; i++) { let s = 0; for (let k = H0; k < LCACHE; k++) s += w[i * LCACHE + k] * st[L].hist[k - H0][i]; y[i] = s * bcx[off.c + i]; }
      out = matvec(T(p + 'shortconv.out_proj.weight'), y, D, D);
    } else {
      const kvD = NKV * HD;
      let q = matvec(T(p + 'attn_q.weight'), h, D, NH * HD);
      let k = matvec(T(p + 'attn_k.weight'), h, D, kvD);
      const v = matvec(T(p + 'attn_v.weight'), h, D, kvD);
      // qk-norm par tête (RMSNorm affine [HD]) puis RoPE
      const qn = T(p + 'attn_q_norm.weight'), kn = T(p + 'attn_k_norm.weight');
      for (let hh = 0; hh < NH; hh++) q.set(rmsnorm(q.slice(hh * HD, hh * HD + HD), qn, HD, EPS), hh * HD);
      for (let hh = 0; hh < NKV; hh++) k.set(rmsnorm(k.slice(hh * HD, hh * HD + HD), kn, HD, EPS), hh * HD);
      q = rope(q, NH, pos); k = rope(k, NKV, pos);
      st[L].K.push(k); st[L].V.push(v);
      const y = new Float32Array(NH * HD), Tn = st[L].K.length, scale = 1 / Math.sqrt(HD), grp = NH / NKV;
      for (let hh = 0; hh < NH; hh++) {
        const kvh = Math.floor(hh / grp), qb = hh * HD, kb = kvh * HD;
        const sc = new Float32Array(Tn); let mx = -1e30;
        for (let t = 0; t < Tn; t++) { let s = 0; for (let i = 0; i < HD; i++) s += q[qb + i] * st[L].K[t][kb + i]; sc[t] = s * scale; if (sc[t] > mx) mx = sc[t]; }
        let sum = 0; for (let t = 0; t < Tn; t++) { sc[t] = Math.exp(sc[t] - mx); sum += sc[t]; }
        for (let t = 0; t < Tn; t++) { const w2 = sc[t] / sum; for (let i = 0; i < HD; i++) y[qb + i] += w2 * st[L].V[t][kb + i]; }
      }
      out = matvec(T(p + 'attn_output.weight'), y, NH * HD, D);
    }
    for (let i = 0; i < D; i++) x[i] += out[i];
    const h2 = rmsnorm(x, T(p + 'ffn_norm.weight'), D, EPS);
    const FFN = T(p + 'ffn_gate.weight').length / D;
    const g = matvec(T(p + 'ffn_gate.weight'), h2, D, FFN), u = matvec(T(p + 'ffn_up.weight'), h2, D, FFN);
    for (let i = 0; i < FFN; i++) g[i] = silu(g[i]) * u[i];
    const dwn = matvec(T(p + 'ffn_down.weight'), g, FFN, D);
    for (let i = 0; i < D; i++) x[i] += dwn[i];
  }
  if (FINALNORM === 'tok') x = rmsnorm(x, T('token_embd_norm.weight'), D, EPS);
  // tête liée : logits[v] = emb_row(v)·x
  const emb = T('token_embd.weight'), V = emb.length / D, logits = new Float32Array(V);
  for (let vv = 0; vv < V; vv++) { let s = 0; const b = vv * D; for (let i = 0; i < D; i++) s += emb[b + i] * x[i]; logits[vv] = s; }
  return logits;
}

(async () => {
  buf = fs.readFileSync(PATH);
  gguf = await parseGguf(new Blob([buf.subarray(0, Math.min(buf.length, 100 * 1024 * 1024))]));
  D = gguf.config.d; NH = gguf.config.nHeads; HD = gguf.config.headDim || 64; NL = gguf.config.blockCount;
  EPS = gguf.config.rmsEps; THETA = gguf.config.ropeTheta;
  NKV = gguf.metadata['lfm2.attention.head_count_kv'] ? Math.max(...gguf.metadata['lfm2.attention.head_count_kv']) : 8;
  LCACHE = gguf.metadata['lfm2.shortconv.l_cache'] ?? 3;
  console.log(`D=${D} NH=${NH} NKV=${NKV} HD=${HD} NL=${NL} LCACHE=${LCACHE} θ=${THETA} | SPLIT=${SPLIT} ROPE=${ROPE} FINALNORM=${FINALNORM}`);
  console.log('couches conv:', Array.from({ length: NL }, (_, L) => isConvLayer(L) ? 'C' : 'A').join(''));

  // Tokenisation via llama-tokenize (réf externe — le port navigateur utilisera transformers.js).
  const { execSync } = require('child_process');
  const prompt = process.argv[2] || 'The Eiffel Tower is located in the city of';
  const nGen = parseInt(process.argv[3] || '12', 10);
  const tokOut = execSync(`llama-tokenize -m ${JSON.stringify(PATH)} -p ${JSON.stringify(prompt)} 2>/dev/null`).toString();
  const ids = [...tokOut.matchAll(/^\s*(\d+) ->/gm)].map((m) => parseInt(m[1], 10));
  console.log('prompt:', JSON.stringify(prompt), '→', ids.length, 'tokens:', ids.join(','));

  const st = Array.from({ length: NL }, (_, L) => isConvLayer(L) ? { hist: [] } : { K: [], V: [] });
  let logits, pos = 0;
  for (const id of ids) logits = forward(id, pos++, st);
  const outIds = [];
  for (let s = 0; s < nGen; s++) {
    let best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i;
    outIds.push(best);
    if (best === 7) break; // <|im_end|> possible eos — on log de toute façon
    logits = forward(best, pos++, st);
  }
  console.log('ids générés :', outIds.join(','));
  // Décodage lisible via llama-tokenize inversé ? Pas dispo — on affiche les morceaux du vocab GGUF.
  const vocab = gguf.metadata['tokenizer.ggml.tokens'];
  console.log('texte ≈', outIds.map((i) => (Array.isArray(vocab) ? vocab[i] : `[${i}]`)).join(''));
})().catch((e) => { console.error('ERR', e.stack); process.exit(1); });
