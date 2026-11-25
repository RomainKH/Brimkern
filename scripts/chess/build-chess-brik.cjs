#!/usr/bin/env node
// safetensors du modèle d'échecs (scripts/chess/export.py) → .brik servi par le site.
//
//   npm run build:chess-brik -- <export>/brimkern-chess.safetensors [q8|f16]
//
// Tier q8 : matrices du bloc en q8 (codec q8web du dépôt, comme les BRIK image), tout le reste en
// f16 (plongements, biais relatif, normes, têtes — ~30 K paramètres lus par le CPU). Tier f16 : tout
// en f16 (bras témoin pour mesurer ce que coûte le q8).
// Un seul shard : le fichier pèse quelques centaines de Ko, la page le lit d'un bloc.
// manifest.model.uiArch = 'chess' (le chargeur LLM refuse) ; manifest.chess = la config du modèle,
// lue dans les métadonnées du safetensors (une seule vérité : export.py).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const B = path.join(__dirname, '..', '..', '.brik-build');
const { quantizeQ8, packQ8 } = require(path.join(B, 'brik/q8web.js'));
const { packShard } = require(path.join(B, 'brik/codec.js'));
const { serializeBrik } = require(path.join(B, 'brik/container.js'));
const { parseSafetensors } = require(path.join(B, 'safetensors.js'));
const { f32ToF16Bits } = require(path.join(B, 'brik/f16.js'));

const MATRICES = new Set(['block.q', 'block.k', 'block.v', 'block.o', 'block.wi0', 'block.wi1', 'block.wo']);

const src = process.argv[2];
const tier = process.argv[3] || 'q8';
if (!src || !['q8', 'f16'].includes(tier)) {
	console.error('Usage: npm run build:chess-brik -- <brimkern-chess.safetensors> [q8|f16]');
	process.exit(1);
}
const buf = fs.readFileSync(src);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
// Métadonnées : l'en-tête JSON du safetensors (8 octets de longueur, puis le JSON).
const hlen = Number(buf.readBigUInt64LE(0));
const meta = JSON.parse(buf.subarray(8, 8 + hlen).toString('utf8')).__metadata__ || {};
const cfg = JSON.parse(meta.brimkern_chess || '{}');
if (!cfg.d) throw new Error('métadonnées brimkern_chess absentes : exporter avec scripts/chess/export.py');
const st = parseSafetensors(ab);

const entries = [];
let q8 = 0, f16 = 0;
for (const [name, t] of st) {
	const f32 = t.data;
	const nElems = f32.length;
	if (tier === 'q8' && MATRICES.has(name) && nElems % 32 === 0) {
		const bytes = packQ8(quantizeQ8(f32));
		entries.push({ name, dtype: 'q8', shape: t.shape, bytes, nElems });
		q8 += bytes.length;
	} else {
		const u16 = new Uint16Array(nElems);
		for (let i = 0; i < nElems; i++) u16[i] = f32ToF16Bits(f32[i]);
		const bytes = new Uint8Array(u16.buffer);
		entries.push({ name, dtype: 'f16', shape: t.shape, bytes, nElems });
		f16 += bytes.length;
	}
}
const { buffer, entries: tensors } = packShard(entries, 0);
const manifest = {
	format: 'brik',
	version: 1,
	model: { name: 'brimkern chess', uiArch: 'chess', quantSource: `${tier} (scripts/chess, codec q8web)` },
	// Champs LLM : placeholders inertes (comme les BRIK image) — seul `chess` est lu.
	arch: { arch: 'brimkern-chess', d: cfg.d, nHeads: cfg.heads, nKvHeads: cfg.heads, headDim: cfg.d / cfg.heads, ffn: cfg.ff, blockCount: 1, ropeTheta: 0, rmsEps: cfg.rms_eps, vocab: 4096 },
	chat: { template: '', stopTokenIds: [] },
	tokenizer: { kind: 'hf-hub' },
	shards: [{ id: 0, file: 'chess.bin', byteLength: buffer.length, sha256: crypto.createHash('sha256').update(buffer).digest('hex') }],
	tensors,
	chess: cfg,
};
const out = serializeBrik(manifest, [{ file: 'chess.bin', bytes: buffer }]);
const outDir = path.join(__dirname, '..', '..', 'public', 'models', 'chess');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `brimkern-chess-${tier}.brik`);
fs.writeFileSync(outPath, out);
console.log(`${outPath}\n  ${(out.length / 1024).toFixed(0)} Ko (q8 ${(q8 / 1024).toFixed(0)} Ko · f16 ${(f16 / 1024).toFixed(0)} Ko) · config ${JSON.stringify(cfg)}`);
