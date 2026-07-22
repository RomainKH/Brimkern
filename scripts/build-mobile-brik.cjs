// Build a hosted .brik for the mobile-recommended model, CPU-only (no WebGPU), so it can run in CI
// or on any machine. Mirrors the browser convert path: parseGguf for the tensor table, a CPU
// dequantizer (Q8_0/F16/F32 → f32), then convertModelToBrik with NO encodeQuant so the pure-JS
// codec packs q4/q8. The npm script compiles src/lib/brik/*.ts + ggufParser.ts to .brik-build first.
//
//   npm run build:mobile-brik
//
// Output: public/models/<name>.brik (gitignored — too large for GitHub; serve from /public on
// Vercel, or upload to a CDN/HF and point the app's MOBILE_BRIK_URL at it).
const fs = require('fs');
const path = require('path');
const { parseGguf } = require('../.brik-build/webgpu/ggufParser.js');
const { convertModelToBrik } = require('../.brik-build/brik/convert.js');
const { serializeBrik } = require('../.brik-build/brik/container.js');
const { f16BitsToF32 } = require('../.brik-build/brik/f16.js');

// --- Config: the mobile-recommended model by default ---------------------------------------------
// Généralisé (2026-07-18) : BRIK_SRC / BRIK_NAME / BRIK_TOKENIZER / BRIK_UI_ARCH / BRIK_OUT
// permettent de builder n'importe quel GGUF q8_0/f16 (ex. Qwen3-4B) sans toucher au script.
const GGUF_URL = process.env.BRIK_SRC || 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q8_0.gguf';
// 'mixed' (défaut) = corps int4 + attention ENTIÈRE int8 : l'int4 uniforme lobotomise un 0.5B
// (refus absurdes, échos verbatim — constaté desktop ET mobile) et la requantification q4→q8 côté
// moteur ne récupère RIEN, mais l'A/B par tenseur (2026-07-15, ?prec=) montre que le charabia
// exige le TOUT-int4 : ancrer l'attention en q8 suffit (frontière mesurée : attn_v+attn_output ;
// l'attention entière prend une marge). Résultat ~379 Mo au lieu de 508 (q8 plein) pour une
// qualité int8 constatée. BRIK_TIER=q8|q4|f16|mixed pour builder un autre tier.
const TIER = process.env.BRIK_TIER || 'mixed';
const MODEL_NAME = process.env.BRIK_NAME || 'Qwen2.5-0.5B-Instruct';
const TOKENIZER_ID = process.env.BRIK_TOKENIZER || 'Qwen/Qwen2.5-0.5B-Instruct';
const UI_ARCH = process.env.BRIK_UI_ARCH || 'qwen';
const slug = MODEL_NAME.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
const OUT = process.env.BRIK_OUT || path.join(__dirname, '..', 'public', 'models', `${slug}-${TIER}.brik`);
// Cache source par nom de fichier (deux modèles ne s'écrasent plus).
const GGUF_CACHE = path.join(__dirname, '..', '.brik-build', `src-${path.basename(new URL(GGUF_URL).pathname)}`);

// Écriture par morceaux : fs.writeSync plafonne à 2^31-1 octets par appel — un 4B (source 4,3 Go,
// .brik ~2,9 Go) dépasse la limite d'un writeFileSync monolithique.
function writeFileChunked(file, bytes) {
  const fd = fs.openSync(file, 'w');
  const CHUNK = 1 << 30; // 1 Gio
  for (let off = 0; off < bytes.byteLength; off += CHUNK) {
    const len = Math.min(CHUNK, bytes.byteLength - off);
    fs.writeSync(fd, bytes, off, len);
  }
  fs.closeSync(fd);
}

async function ensureGguf() {
  if (fs.existsSync(GGUF_CACHE) && fs.statSync(GGUF_CACHE).size > 1024 * 1024) return GGUF_CACHE;
  console.log('⬇️  Téléchargement du GGUF source…', GGUF_URL);
  const res = await fetch(GGUF_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} en téléchargeant le GGUF`);
  // STREAMÉ vers le disque (pas de buffer intégral : un 4B fait 4,3 Go, et l'écriture d'un coup
  // casse la limite 2 Gio de Node). Fichier temporaire renommé à la fin → un run interrompu ne
  // laisse pas un cache tronqué que le run suivant prendrait pour bon.
  const tmp = GGUF_CACHE + '.part';
  const out = fs.createWriteStream(tmp);
  let done = 0, lastMB = -1;
  const total = parseInt(res.headers.get('content-length') || '0', 10);
  for await (const chunk of res.body) {
    if (!out.write(chunk)) await new Promise((r) => out.once('drain', r));
    done += chunk.byteLength;
    const mb = Math.floor(done / (256 * 1024 * 1024));
    if (mb !== lastMB) { lastMB = mb; process.stdout.write(`\r   ${(done / 1e9).toFixed(2)}/${(total / 1e9).toFixed(2)} Go`); }
  }
  await new Promise((r) => out.end(r));
  fs.renameSync(tmp, GGUF_CACHE);
  console.log(`\n   ${(done / 1024 / 1024).toFixed(0)} Mo écrits dans ${GGUF_CACHE}`);
  return GGUF_CACHE;
}

// CPU dequant → f32. Handles the types a q8_0/fp16 GGUF actually contains.
function makeDequantizer() {
  return async (type, bytes, nElems) => {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const out = new Float32Array(nElems);
    if (type === 'F32') {
      for (let i = 0; i < nElems; i++) out[i] = dv.getFloat32(i * 4, true);
    } else if (type === 'F16') {
      for (let i = 0; i < nElems; i++) out[i] = f16BitsToF32(dv.getUint16(i * 2, true));
    } else if (type === 'Q8_0') {
      const QK = 32, BS = 34; // block: f16 scale (2B) + 32 int8. x = q * scale.
      const nb = nElems / QK;
      for (let b = 0; b < nb; b++) {
        const base = b * BS;
        const d = f16BitsToF32(dv.getUint16(base, true));
        for (let j = 0; j < QK; j++) out[b * QK + j] = dv.getInt8(base + 2 + j) * d;
      }
    } else {
      throw new Error(`Type GGUF non géré en CPU: ${type} (utilise un GGUF q8_0 ou fp16)`);
    }
    return out;
  };
}

async function main() {
  const ggufPath = await ensureGguf();
  const size = fs.statSync(ggufPath).size;
  const headLen = Math.min(size, 100 * 1024 * 1024); // parseGguf only reads the header chunk
  const headFd = fs.openSync(ggufPath, 'r');
  const headBuf = Buffer.allocUnsafe(headLen);
  fs.readSync(headFd, headBuf, 0, headLen, 0);
  fs.closeSync(headFd);
  const manifest = await parseGguf(new Blob([headBuf]));
  console.log('arch:', manifest.arch, '| config:', JSON.stringify(manifest.config));

  const fd = fs.openSync(ggufPath, 'r');
  const readRaw = async (offset, byteLength) => {
    const b = Buffer.allocUnsafe(byteLength);
    fs.readSync(fd, b, 0, byteLength, offset);
    return new Uint8Array(b.buffer, b.byteOffset, byteLength);
  };

  // Size opt: tied embeddings (output.weight == token_embd.weight). If byte-identical, drop output —
  // ~⅓ smaller, zero quality loss (runtime reuses token_embd for the logit head when output absent).
  const te = manifest.tensors['token_embd.weight'], ow = manifest.tensors['output.weight'];
  if (te && ow && te.bytes === ow.bytes) {
    const a = await readRaw(te.offset, te.bytes), b = await readRaw(ow.offset, ow.bytes);
    let same = true; for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) { same = false; break; } }
    if (same) { delete manifest.tensors['output.weight']; console.log(`✂︎  output.weight == token_embd → droppé (-${(ow.bytes / 1048576).toFixed(0)} Mo, tied)`); }
    else console.log('output.weight ≠ token_embd → conservé');
  }

  // Embed the tokenizer (offline runtime load, no HF fetch, no manual pick).
  const tokBase = `https://huggingface.co/${TOKENIZER_ID}/resolve/main`;
  const fetchText = async (f) => { const r = await fetch(`${tokBase}/${f}`); if (!r.ok) throw new Error(`${f} HTTP ${r.status}`); return r.text(); };
  const [tokJson, tokConfig] = await Promise.all([fetchText('tokenizer.json'), fetchText('tokenizer_config.json')]);
  console.log(`tokenizer embarqué: tokenizer.json ${(tokJson.length / 1048576).toFixed(1)} Mo + config`);

  let lastPct = -1;
  const out = await convertModelToBrik(
    manifest, readRaw, makeDequantizer(),
    {
      modelName: MODEL_NAME, quantSource: 'Q8_0', uiArch: UI_ARCH,
      tokenizer: { kind: 'embedded', id: TOKENIZER_ID, json: tokJson, config: tokConfig },
      chat: { template: '', stopTokenIds: [] },
      weightDType: TIER,
    },
    (done, total) => {
      const pct = Math.floor((done / total) * 100);
      if (pct !== lastPct) { lastPct = pct; process.stdout.write(`\rConversion ${pct}%`); }
    },
  );
  fs.closeSync(fd);
  process.stdout.write('\n');

  const briked = serializeBrik(out.manifest, out.shards);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileChunked(OUT, Buffer.from(briked.buffer, briked.byteOffset, briked.byteLength));
  console.log(`✅ ${OUT} — ${(briked.byteLength / 1024 / 1024).toFixed(1)} Mo (tier ${TIER})`);
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
