// Requantifie un BRIK EXISTANT (corps q4 → q3) SANS re-télécharger le GGUF source. Utile quand on
// a déjà le .brik q4 mais pas le GGUF (ex. gros modèle, connexion lente). Les embeddings/tête (q4)
// et les normes (f32) sont conservés tels quels — comme le tier q3 (le corps 2-D passe en q3).
//
// ⚠️ C'est un DOUBLE quant (q4→q3) : la qualité est un poil inférieure à un q3 direct depuis le GGUF
// f16/Q8. À utiliser pour valider/optimiser sans download ; pour le BRIK final, builder depuis le GGUF.
//
// Usage : node scripts/requant-brik-q3.cjs <in.brik> <out.brik>
// (compiler d'abord : tsc src/lib/brik/*.ts --outDir .brik-build --module commonjs --target es2022
//  --moduleResolution node --skipLibCheck)

const fs = require('fs');
const path = require('path');
const { parseBrikHeader, serializeBrik } = require(path.join(__dirname, '..', '.brik-build', 'container.js'));
const { computeShardBases } = require(path.join(__dirname, '..', '.brik-build', 'loader.js'));
const { packShard } = require(path.join(__dirname, '..', '.brik-build', 'codec.js'));
const { unpackQ4, dequantizeQ4 } = require(path.join(__dirname, '..', '.brik-build', 'q4web.js'));

const IN = process.argv[2];
const OUT = process.argv[3];
if (!IN || !OUT) { console.error('Usage: node requant-brik-q3.cjs <in.brik> <out.brik>'); process.exit(1); }

// Écriture par morceaux (fs.writeSync plafonne à 2 Gio/appel).
function writeFileChunked(file, bytes) {
  const fd = fs.openSync(file, 'w');
  const CHUNK = 1 << 30;
  for (let off = 0; off < bytes.byteLength; off += CHUNK) fs.writeSync(fd, bytes, off, Math.min(CHUNK, bytes.byteLength - off));
  fs.closeSync(fd);
}

const fd = fs.openSync(IN, 'r');
// Header : 12 octets fixes → longueur du manifeste → relire header+manifeste.
const head12 = Buffer.alloc(12);
fs.readSync(fd, head12, 0, 12, 0);
const manifestLen = head12.readUInt32LE(8);
const headerBuf = Buffer.alloc(12 + manifestLen);
fs.readSync(fd, headerBuf, 0, headerBuf.length, 0);
const { manifest, dataStart } = parseBrikHeader(new Uint8Array(headerBuf.buffer, headerBuf.byteOffset, headerBuf.length));
const bases = computeShardBases(manifest.shards);

const isBody2D = (name, shape) => shape.length >= 2 && name !== 'token_embd.weight' && name !== 'output.weight';

const outShards = [], outMeta = [], outTensors = {};
let nQ3 = 0, nKept = 0;
const shardsOrdered = [...manifest.shards].sort((a, b) => a.id - b.id);
for (const sh of shardsOrdered) {
  const names = Object.keys(manifest.tensors).filter((n) => manifest.tensors[n].shard === sh.id);
  const toPack = names.map((name) => {
    const t = manifest.tensors[name];
    const absOff = dataStart + bases[sh.id] + t.offset;
    const buf = Buffer.alloc(t.byteLength);
    fs.readSync(fd, buf, 0, t.byteLength, absOff);
    const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
    if (t.dtype === 'q4' && isBody2D(name, t.shape)) {
      const f32 = dequantizeQ4(unpackQ4(bytes, t.nElems)); // q4 → f32 → (q3 à l'encodage)
      nQ3++;
      return { name, dtype: 'q3', shape: t.shape, data: f32 };
    }
    nKept++;
    return { name, dtype: t.dtype, shape: t.shape, bytes, nElems: t.nElems };
  });
  const { buffer, entries } = packShard(toPack, sh.id);
  Object.assign(outTensors, entries);
  const file = `shard-${String(sh.id).padStart(4, '0')}.brik`;
  outShards.push({ file, bytes: buffer });
  outMeta.push({ id: sh.id, file, byteLength: buffer.length });
  process.stdout.write(`\rShard ${sh.id + 1}/${shardsOrdered.length} — corps→q3: ${nQ3}, conservés: ${nKept}   `);
}
fs.closeSync(fd);
process.stdout.write('\n');

const outManifest = { ...manifest, shards: outMeta, tensors: outTensors };
const out = serializeBrik(outManifest, outShards);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
writeFileChunked(OUT, Buffer.from(out.buffer, out.byteOffset, out.byteLength));
const inMB = fs.statSync(IN).size / 1e6, outMB = fs.statSync(OUT).size / 1e6;
console.log(`✅ ${OUT} — ${(outMB).toFixed(1)} Mo (source q4 ${inMB.toFixed(1)} Mo → ${((1 - outMB / inMB) * 100).toFixed(1)}% de moins)`);
