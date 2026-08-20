// GGUF LFM2/LFM2.5 → BRIK (CPU, moteur v2 hybride). Convertit + vérifie le round-trip des tenseurs.
// chooseDType arch-aware : shortconv.conv + normes en f32, grosses projections au tier, embeddings
// (tête liée) q4/q8. Tokenizer EMBARQUÉ : tokenizer.json + tokenizer_config.json HF (transformers.js
// sait les charger depuis le manifest → BRIK self-contained, zéro fetch HF au runtime).
//
// Tiers MIXTES (2026-08-20) : le tier ne dit plus un seul dtype pour tout le corps.
//   • q3mix — corps 3 bits SAUF ffn_down / attn_output / attn_v qui restent q4. Cette frontière
//     n'est pas une intuition : c'est celle que llama.cpp/unsloth retiennent pour Q3_K_M après
//     calibration par matrice d'importance (voir la carte du GGUF Q3_K_M d'unsloth). Notre q3 « à
//     plat » du 2026-08-19 mettait ffn_down à 3 bits aussi, et échouait la lecture de tableau.
//   • source — rejoue l'allocation du GGUF SOURCE tenseur par tenseur (Q3_K→q3, Q4_K→q4, Q5_K/Q6_K/
//     Q8_0→q8). ⚠️ Depuis un GGUF déjà quantifié c'est un DOUBLE quant : mesuré 20,9 % d'erreur RMS
//     sur ffn_gate contre 16,9 % pour un q3 direct depuis le F16. À réserver au cas où on n'a QUE le
//     GGUF quantifié ; sinon builder q3mix depuis le F16.
//
// Usage : node scripts/build-lfm2-brik.cjs  (ou npm run build:lfm2-brik)
// Env : LFM2_SRC (GGUF F16 ou quantifié), LFM2_TIER (q4|q8|q3|mixed|q3mix|source|f16, défaut q4),
//       LFM2_OUT, LFM2_NAME, LFM2_TOKENIZER_DIR (tokenizer.json + tokenizer_config.json).
const fs = require('fs');
const path = require('path');
const { parseGguf } = require('../.brik-build/webgpu/ggufParser.js');
const { convertModelToBrik } = require('../.brik-build/brik/convert.js');
const { serializeBrik, parseBrik } = require('../.brik-build/brik/container.js');
const { computeShardBases } = require('../.brik-build/brik/loader.js');
const { decodeTensor } = require('../.brik-build/brik/codec.js');
const { f16BitsToF32 } = require('../.brik-build/brik/f16.js');
const { dequantGgml } = require('./lib/ggml-dequant.cjs');

const GGUF = process.env.LFM2_SRC || path.join(__dirname, '..', '.brik-build', 'lfm25-230m-f16.gguf');
const TIER = process.env.LFM2_TIER || 'q4';
const OUT = process.env.LFM2_OUT || path.join(__dirname, '..', 'public', 'models', `lfm25-230m-${TIER}.brik`);
const TOKDIR = process.env.LFM2_TOKENIZER_DIR || path.join(__dirname, '..', '.brik-build', 'lfm25-tokenizer');

// F16/F32 + K-quants (Q3_K/Q4_K/Q5_K/Q6_K/Q8_0/Q4_0/Q5_0) : un GGUF déjà quantifié est une source
// valide. Les formules sont celles de llama.cpp, cf. scripts/lib/ggml-dequant.cjs.
const cpuDequant = async (type, bytes, nElems) => dequantGgml(type, bytes, nElems);

// Le corps 2-D quantifiable ; le reste (normes 1-D, shortconv.conv) est laissé à chooseDType.
const CORPS = /\.(shortconv\.(in|out)_proj|attn_q|attn_k|attn_v|attn_output|ffn_gate|ffn_up|ffn_down)\.weight$/;
// Tenseurs sensibles que Q3_K_M garde AU-DESSUS de 3 bits (mesure imatrix llama.cpp/unsloth).
const SENSIBLES = /\.(ffn_down|attn_output|attn_v)\.weight$/;
const GGML_VERS_TIER = { Q3_K: 'q3', Q4_K: 'q4', Q4_0: 'q4', Q5_K: 'q8', Q6_K: 'q8', Q8_0: 'q8' };

// Carte par tenseur pour les tiers mixtes (undefined = chooseDType tranche : normes f32, conv f32).
// `sonde` : SONDE DE QUALITÉ, pas un tier de livraison. Elle prend les valeurs d'un GGUF déjà
// quantifié et les réencode en q8 (+0,02 point d'erreur RMS, mesuré : 14,67 % contre 14,65 % pour le
// Q3_K d'origine sur ffn_gate). Le .brik pèse ~220 Mo et n'a aucun intérêt produit — il répond à UNE
// question : « les valeurs 3 bits calibrées par imatrix sont-elles assez bonnes pour ce modèle ? »
// Si la sonde échoue, écrire un kernel matmul Q3_K natif pour les livrer à 3,44 bits ne servirait à
// rien. Si elle passe, ce kernel vaut ~123 Mo à qualité tenue.
function carteMixte(tier, gguf) {
  if (tier === 'sonde') return (name, shape, nElems) => {
    if (shape.length < 2 || nElems % 32 !== 0) return undefined;
    if (name === 'token_embd.weight') return 'q4';
    return CORPS.test(name) ? 'q8' : undefined;
  };
  if (tier !== 'q3mix' && tier !== 'source') return undefined;
  return (name, shape, nElems) => {
    if (shape.length < 2 || nElems % 32 !== 0) return undefined;
    // Embeddings = tête liée : le runtime ne sait faire le gather par lignes qu'en q4 → plancher q4.
    if (name === 'token_embd.weight') return 'q4';
    if (!CORPS.test(name)) return undefined;
    if (tier === 'q3mix') return SENSIBLES.test(name) ? 'q4' : 'q3';
    return GGML_VERS_TIER[gguf.tensors[name]?.type] ?? 'q4';
  };
}

function writeChunked(file, bytes) {
  const fd = fs.openSync(file, 'w'), CH = 1 << 30;
  for (let o = 0; o < bytes.byteLength; o += CH) fs.writeSync(fd, bytes, o, Math.min(CH, bytes.byteLength - o));
  fs.closeSync(fd);
}

async function main() {
  if (!fs.existsSync(GGUF)) throw new Error(`GGUF introuvable : ${GGUF}`);
  const tokJson = path.join(TOKDIR, 'tokenizer.json'), tokCfg = path.join(TOKDIR, 'tokenizer_config.json');
  if (!fs.existsSync(tokJson) || !fs.existsSync(tokCfg)) throw new Error(`tokenizer.json/_config.json manquants dans ${TOKDIR} (télécharger depuis LiquidAI/LFM2.5-230M)`);
  const size = fs.statSync(GGUF).size;
  const headLen = Math.min(size, 100 * 1024 * 1024);
  const hfd = fs.openSync(GGUF, 'r'); const hb = Buffer.allocUnsafe(headLen);
  fs.readSync(hfd, hb, 0, headLen, 0); fs.closeSync(hfd);
  const gguf = await parseGguf(new Blob([hb]));
  console.log('arch', gguf.arch, '| config', JSON.stringify(gguf.config));
  if (gguf.arch !== 'lfm2') throw new Error(`arch ${gguf.arch} inattendue (lfm2 attendu)`);

  const fd = fs.openSync(GGUF, 'r');
  const readRaw = async (offset, byteLength) => { const b = Buffer.allocUnsafe(byteLength); fs.readSync(fd, b, 0, byteLength, offset); return new Uint8Array(b.buffer, b.byteOffset, byteLength); };

  const eosId = gguf.metadata['tokenizer.ggml.eos_token_id'] ?? 7; // <|im_end|>
  const out = await convertModelToBrik(gguf, readRaw, cpuDequant, {
    modelName: process.env.LFM2_NAME || 'LFM2.5 230M', quantSource: 'F16', uiArch: 'lfm2',
    tokenizer: { kind: 'embedded', id: 'LiquidAI/LFM2.5-230M', json: fs.readFileSync(tokJson, 'utf8'), config: fs.readFileSync(tokCfg, 'utf8') },
    chat: { template: 'chatml', stopTokenIds: [eosId] },
    weightDType: TIER === 'q3mix' || TIER === 'source' || TIER === 'sonde' ? 'q3' : TIER,
    dtypeFor: carteMixte(TIER, gguf),
  });
  const dcount = {}; for (const t of Object.values(out.manifest.tensors)) dcount[t.dtype] = (dcount[t.dtype] || 0) + 1;
  console.log('dtypes émis:', JSON.stringify(dcount));

  const briked = serializeBrik(out.manifest, out.shards);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  writeChunked(OUT, Buffer.from(briked.buffer, briked.byteOffset, briked.byteLength));
  console.log(`✅ ${OUT} — ${(fs.statSync(OUT).size / 1e6).toFixed(1)} Mo (tier ${TIER}, source ${(size / 1e6).toFixed(1)} Mo)`);

  // Round-trip : décoder quelques tenseurs représentatifs et comparer à la source GGUF.
  const parsed = parseBrik(new Uint8Array(fs.readFileSync(OUT)));
  const bases = computeShardBases(parsed.manifest.shards);
  const sample = ['token_embd.weight', 'blk.0.shortconv.in_proj.weight', 'blk.0.shortconv.conv.weight', 'blk.2.attn_q.weight', 'blk.2.attn_q_norm.weight', 'blk.5.ffn_down.weight'];
  let fails = 0;
  for (const name of sample) {
    const bt = parsed.manifest.tensors[name], gt = gguf.tensors[name];
    if (!bt) { console.log(`  MANQUE ${name}`); fails++; continue; }
    const brikBytes = parsed.data.subarray(bases[bt.shard] + bt.offset, bases[bt.shard] + bt.offset + bt.byteLength);
    const back = decodeTensor(brikBytes, bt.nElems, bt.dtype);
    const src = await cpuDequant(gt.type, await readRaw(gt.offset, gt.bytes), gt.nElems);
    let maxErr = 0, sumAbs = 0; for (let i = 0; i < src.length; i++) { const e = Math.abs(back[i] - src[i]); if (e > maxErr) maxErr = e; sumAbs += Math.abs(src[i]); }
    const mean = sumAbs / src.length;
    const okF = (bt.dtype === 'f16' || bt.dtype === 'f32') ? maxErr < 0.01 : maxErr < 0.5 * (mean * 8 + 1e-3) + 0.2;
    console.log(`  ${okF ? 'OK  ' : 'FAIL'} ${name}  dtype=${bt.dtype}  maxErr=${maxErr.toFixed(4)} mean|x|=${mean.toFixed(4)}`);
    if (!okF) fails++;
  }
  fs.closeSync(fd);
  console.log(fails === 0 ? '\n=== ROUND-TRIP OK ===' : `\n=== ${fails} ÉCHEC(S) ===`);
  process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error('ERREUR:', e.stack); process.exit(1); });
