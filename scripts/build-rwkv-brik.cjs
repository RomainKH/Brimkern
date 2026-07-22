// GGUF RWKV-7 → BRIK (CPU, moteur v2). Étape 1 de la Phase 1b : convertit + vérifie le round-trip
// des tenseurs (le format/convert/loader gèrent l'archi RWKV : LoRA, LN, lerp 4-D). chooseDType
// arch-aware garde les petites matrices LoRA/normes en f16/f32 et ne quantifie que les grosses
// projections. Voir docs/engine-v2-linear-attention.md.
//
// ⚠️ Tokenizer : STUB pour l'instant (round-trip only). Le vrai World tokenizer (trie 65536) est
// l'étape 2 — il embarquera le vocab GGUF (tokenizer.ggml.tokens) à la place de ce stub.
//
// Usage : GGUF source dans .brik-build/, puis `npm run build:rwkv-brik`.
// Env : RWKV_SRC (chemin GGUF), RWKV_TIER (q4|q3|q8|f16, défaut q4), RWKV_OUT.

const fs = require('fs');
const path = require('path');
const { parseGguf } = require('../.brik-build/webgpu/ggufParser.js');
const { convertModelToBrik } = require('../.brik-build/brik/convert.js');
const { serializeBrik, parseBrik } = require('../.brik-build/brik/container.js');
const { computeShardBases } = require('../.brik-build/brik/loader.js');
const { decodeTensor } = require('../.brik-build/brik/codec.js');
const { f16BitsToF32 } = require('../.brik-build/brik/f16.js');

const GGUF = process.env.RWKV_SRC || path.join(__dirname, '..', '.brik-build', 'rwkv7-0.1b-world-f16.gguf');
const TIER = process.env.RWKV_TIER || 'q4';
const OUT = process.env.RWKV_OUT || path.join(__dirname, '..', 'public', 'models', `rwkv7-0.1b-${TIER}.brik`);

const cpuDequant = async (type, bytes, nElems) => {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out = new Float32Array(nElems);
  if (type === 'F32') for (let i = 0; i < nElems; i++) out[i] = dv.getFloat32(i * 4, true);
  else if (type === 'F16') for (let i = 0; i < nElems; i++) out[i] = f16BitsToF32(dv.getUint16(i * 2, true));
  else throw new Error(`type CPU non géré: ${type} (RWKV GGUF attendu en F16/F32)`);
  return out;
};

function writeChunked(file, bytes) {
  const fd = fs.openSync(file, 'w'), CH = 1 << 30;
  for (let o = 0; o < bytes.byteLength; o += CH) fs.writeSync(fd, bytes, o, Math.min(CH, bytes.byteLength - o));
  fs.closeSync(fd);
}

async function main() {
  if (!fs.existsSync(GGUF)) throw new Error(`GGUF introuvable : ${GGUF}`);
  const size = fs.statSync(GGUF).size;
  const headLen = Math.min(size, 100 * 1024 * 1024);
  const hfd = fs.openSync(GGUF, 'r'); const hb = Buffer.allocUnsafe(headLen);
  fs.readSync(hfd, hb, 0, headLen, 0); fs.closeSync(hfd);
  const gguf = await parseGguf(new Blob([hb]));
  console.log('arch', gguf.arch, '| config', JSON.stringify(gguf.config));
  if (gguf.arch !== 'rwkv7' && gguf.arch !== 'rwkv6') throw new Error(`arch ${gguf.arch} inattendue (RWKV attendu)`);

  const fd = fs.openSync(GGUF, 'r');
  const readRaw = async (offset, byteLength) => { const b = Buffer.allocUnsafe(byteLength); fs.readSync(fd, b, 0, byteLength, offset); return new Uint8Array(b.buffer, b.byteOffset, byteLength); };

  // Tokenizer World embarqué : le vocab GGUF (65536 chaînes échappées) va dans le manifest → BRIK
  // self-contained (le SDK n'a rien d'autre à charger). Le runtime reconstruit le trie via RwkvTokenizer.
  const worldTokens = gguf.metadata['tokenizer.ggml.tokens'];
  if (!Array.isArray(worldTokens)) throw new Error('vocab tokenizer.ggml.tokens absent du GGUF');
  const eosId = gguf.metadata['tokenizer.ggml.eos_token_id'] ?? 0;
  console.log(`vocab World embarqué : ${worldTokens.length} tokens, eos=${eosId}`);
  const out = await convertModelToBrik(gguf, readRaw, cpuDequant, {
    modelName: process.env.RWKV_NAME || 'RWKV-7 0.1B', quantSource: 'F16', uiArch: 'rwkv7',
    tokenizer: { kind: 'embedded', id: 'rwkv-world', json: JSON.stringify({ tokens: worldTokens, eosId }), config: '{}' },
    chat: { template: '', stopTokenIds: [eosId] },
    weightDType: TIER,
  });
  const dcount = {}; for (const t of Object.values(out.manifest.tensors)) dcount[t.dtype] = (dcount[t.dtype] || 0) + 1;
  console.log('dtypes émis:', JSON.stringify(dcount));

  const briked = serializeBrik(out.manifest, out.shards);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  writeChunked(OUT, Buffer.from(briked.buffer, briked.byteOffset, briked.byteLength));
  console.log(`✅ ${OUT} — ${(fs.statSync(OUT).size / 1e6).toFixed(1)} Mo (tier ${TIER}, source ${(size / 1e6).toFixed(1)} Mo)`);

  // Round-trip : décoder quelques tenseurs depuis le BRIK et comparer à la source GGUF.
  const parsed = parseBrik(new Uint8Array(fs.readFileSync(OUT)));
  const bases = computeShardBases(parsed.manifest.shards);
  const sample = ['token_embd.weight', 'blk.0.time_mix_key.weight', 'blk.0.time_mix_w1.weight', 'blk.0.time_mix_lerp_fused.weight', 'blk.0.attn_norm.weight', 'blk.5.channel_mix_value.weight'];
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
