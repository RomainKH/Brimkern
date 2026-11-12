// Fabrique les .brik de test de integrity.mjs à partir du 230M publié (149 Mo, sans empreintes) :
//   lfm-signed.brik          le même fichier, avec `shards[].sha256` (comme les builders depuis le 2026-11-12)
//   lfm-tampered-layer.brik  un octet inversé au milieu du shard 5 (blk.4.*)
//   lfm-tampered.brik        un octet inversé 100 octets avant la fin (dernier shard, blk.13.*)
//
//   npm run test:brik                      # compile src/lib/brik → .brik-build (utilisé ici)
//   node scripts/e2e/integrity-briks.cjs <dossier>
const fs = require('node:fs');
const path = require('node:path');

const out = process.argv[2];
if (!out) { console.error('usage : node scripts/e2e/integrity-briks.cjs <dossier>'); process.exit(2); }
const BUILD = path.join(__dirname, '../../.brik-build');
if (!fs.existsSync(path.join(BUILD, 'container.js'))) { console.error('lancer d’abord : npm run test:brik'); process.exit(2); }
const { parseBrik, parseBrikHeader, serializeBrik } = require(path.join(BUILD, 'container.js'));
const { computeShardBases } = require(path.join(BUILD, 'loader.js'));
const { sha256HexSync } = require(path.join(BUILD, 'integrity.js'));

(async () => {
	fs.mkdirSync(out, { recursive: true });
	const src = path.join(out, 'lfm25-230m-q4.brik');
	if (!fs.existsSync(src)) {
		const r = await fetch('https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik');
		if (!r.ok) throw new Error(`HTTP ${r.status}`);
		fs.writeFileSync(src, Buffer.from(await r.arrayBuffer()));
	}
	const { manifest, data } = parseBrik(new Uint8Array(fs.readFileSync(src)));
	let off = 0;
	const shards = [];
	for (const sh of [...manifest.shards].sort((a, b) => a.id - b.id)) {
		const bytes = data.subarray(off, off + sh.byteLength);
		off += sh.byteLength;
		sh.sha256 = sha256HexSync(bytes);
		shards.push({ file: sh.file, bytes });
	}
	const signed = serializeBrik(manifest, shards);
	fs.writeFileSync(path.join(out, 'lfm-signed.brik'), signed);

	const { dataStart, manifest: m } = parseBrikHeader(signed);
	const bases = computeShardBases(m.shards);
	const sh5 = m.shards.find((s) => s.id === 5);
	const layer = signed.slice(0);
	layer[dataStart + bases[5] + Math.floor(sh5.byteLength / 2)] ^= 0xff;
	fs.writeFileSync(path.join(out, 'lfm-tampered-layer.brik'), layer);

	const end = signed.slice(0);
	end[end.length - 100] ^= 0xff;
	fs.writeFileSync(path.join(out, 'lfm-tampered.brik'), end);
	console.log(`${m.shards.length} shards signés → ${out}`);
})().catch((e) => { console.error(e); process.exit(1); });
