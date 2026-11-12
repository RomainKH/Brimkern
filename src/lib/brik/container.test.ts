// Node test for the single-file .brik container (no GPU). Run via `npm run test:brik`.
// Builds a BRIK, serializes it to one file, parses it back, and checks: magic/version, the manifest
// round-trips, the data section is 16-aligned, and every tensor decodes from its absolute file
// offset (dataStart + shardBase + tensorOffset) exactly as the loader will read it.

import { assembleBrik, pickDType, type BrikInputTensor } from './convert';
import { serializeBrik, parseBrik, parseBrikHeader, brikDataStart } from './container';
import { decodeTensor } from './codec';
import { computeShardBases } from './loader';
import { BRIK_ALIGN, BRIK_VERSION, validateBrikManifest, isValidTokenizerId, type BrikArchProfile } from './format';
import { sha256HexPure, sha256HexSync, verifyBrikShards } from './integrity';
import { createHash, randomBytes } from 'node:crypto';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

const rand = (n: number) => Float32Array.from({ length: n }, () => Math.random() * 2 - 1);
const d = 16, ffn = 32, blocks = 2;
const arch: BrikArchProfile = {
	arch: 'qwen2', d, nHeads: 4, nKvHeads: 2, headDim: 4, ffn, blockCount: blocks,
	ropeTheta: 1e6, rmsEps: 1e-6, vocab: 40,
};

const inputs: BrikInputTensor[] = [];
const add = (name: string, shape: number[]) =>
	inputs.push({ name, shape, data: rand(shape.reduce((a, b) => a * b, 1)), dtype: pickDType(shape) });
add('token_embd.weight', [arch.vocab, d]);
add('output_norm.weight', [d]);
for (let i = 0; i < blocks; i++) {
	add(`blk.${i}.attn_norm.weight`, [d]);
	add(`blk.${i}.attn_q.weight`, [d, d]);
	add(`blk.${i}.ffn_down.weight`, [d, ffn]);
}

const { manifest, shards } = assembleBrik({
	model: { name: 'synthetic', quantSource: 'test', uiArch: 'qwen' }, arch,
	chat: { template: '{{x}}', stopTokenIds: [2] },
	tokenizer: { kind: 'hf-hub', id: 'Xenova/qwen-tokenizer' }, tensors: inputs,
});

const file = serializeBrik(manifest, shards);

// 1. Header: magic + version, and the data section is 16-aligned.
{
	const head = parseBrikHeader(file);
	check('magic + version parse', head.version === BRIK_VERSION);
	check('data section is 16-aligned', head.dataStart % BRIK_ALIGN === 0);
	check('manifest round-trips (tensor count)', Object.keys(head.manifest.tensors).length === inputs.length);
	check('manifest round-trips (arch + tokenizer)',
		head.manifest.arch.d === d && head.manifest.tokenizer.id === 'Xenova/qwen-tokenizer');
}

// 2. File size = dataStart + sum(shard byteLengths).
{
	const totalData = manifest.shards.reduce((a, s) => a + s.byteLength, 0);
	const manifestLen = new TextEncoder().encode(JSON.stringify(manifest)).length;
	check('file size = dataStart + data', file.length === brikDataStart(manifestLen) + totalData,
		`${file.length} vs ${brikDataStart(manifestLen) + totalData}`);
}

// 3. Every tensor decodes from its absolute file offset (dataStart + shardBase + tensorOffset).
{
	const parsed = parseBrik(file);
	const bases = computeShardBases(parsed.manifest.shards);
	let allOk = true, allAligned = true;
	for (const t of inputs) {
		const e = parsed.manifest.tensors[t.name];
		const abs = bases[e.shard] + e.offset; // offset within the data section
		if ((parsed.dataStart + abs) % BRIK_ALIGN !== 0) allAligned = false;
		const back = decodeTensor(parsed.data.subarray(abs, abs + e.byteLength), e.nElems, e.dtype);
		const tol = e.dtype === 'f16' ? 1e-2 : 0;
		for (let i = 0; i < e.nElems; i++) {
			if (Math.abs(back[i] - t.data![i]) > tol * (1 + Math.abs(t.data![i]))) { allOk = false; break; }
		}
	}
	check('every tensor 16-aligned in the file', allAligned);
	check('every tensor decodes from its absolute file offset', allOk);
}

// 4. Rejects a corrupt magic, unsupported version, oversized manifestLen (> 64 MiB), or tampered shard weight byte.
{
	const bad = file.slice(0); bad[0] = 0;
	let threw = false;
	try { parseBrikHeader(bad); } catch { threw = true; }
	check('rejects bad magic', threw);

	const badVer = file.slice(0, 12);
	new DataView(badVer.buffer).setUint32(4, 99, true);
	let threwVer = false;
	try { parseBrikHeader(badVer); } catch { threwVer = true; }
	check('rejects unsupported BRIK version', threwVer);

	const hugeLen = file.slice(0, 12);
	new DataView(hugeLen.buffer).setUint32(8, 0xffffffff, true);
	let threwHuge = false;
	try { parseBrikHeader(hugeLen); } catch { threwHuge = true; }
	check('rejects oversized manifestLen (0xffffffff)', threwHuge);

	check('every shard carries a 64-hex SHA-256 matching its bytes',
		manifest.shards.every((sh, i) => typeof sh.sha256 === 'string' && /^[0-9a-f]{64}$/.test(sh.sha256) && sh.sha256 === sha256HexSync(shards[i].bytes)));

}

// 4b. Empreintes par shard : vérifiées en ASYNCHRONE par verifyBrikShards (frontières de confiance),
// pas par parseBrik — qui les hachait en synchrone et gelait l'onglet sur un gros fichier.
const asyncChecks = (async () => {
	const parsed = parseBrik(file);
	let intactOk = true;
	try { await verifyBrikShards(parsed.manifest, parsed.data); } catch { intactOk = false; }
	check('verifyBrikShards accepts intact shards', intactOk);

	const tamperedWeights = file.slice(0);
	tamperedWeights[tamperedWeights.length - 1] ^= 0xff;
	const t = parseBrik(tamperedWeights); // le parse seul ne hache pas
	let threwTampered = false;
	try { await verifyBrikShards(t.manifest, t.data); } catch { threwTampered = true; }
	check('rejects tampered shard weight byte (per-shard SHA-256)', threwTampered);

	let threwTrunc = false;
	try { parseBrik(file.subarray(0, file.length - 1)); } catch { threwTrunc = true; }
	check('parseBrik rejects a truncated data section', threwTrunc);
})();

// 4c. Le SHA-256 en TypeScript pur (repli navigateur sans crypto.subtle) contre node:crypto, sur les
// tailles qui changent le bourrage (55/56/63/64/119/120) et sur une vue décalée dans un tampon.
{
	let same = 0;
	const sizes = [0, 1, 55, 56, 63, 64, 65, 119, 120, 127, 128, 1000, 65543];
	for (const n of sizes) {
		const b = randomBytes(n);
		if (sha256HexPure(new Uint8Array(b.buffer, b.byteOffset, n)) === createHash('sha256').update(b).digest('hex')) same++;
	}
	check(`sha256HexPure matches node:crypto (${same}/${sizes.length} sizes)`, same === sizes.length);
	const big = randomBytes(5000);
	check('sha256HexPure hashes only the view, not the whole buffer',
		sha256HexPure(new Uint8Array(big.buffer, big.byteOffset + 13, 3000)) === createHash('sha256').update(big.subarray(13, 3013)).digest('hex'));
	check('sha256HexSync (natif sous Node) = sha256HexPure', sha256HexSync(new Uint8Array(big)) === sha256HexPure(new Uint8Array(big)));
}

// 5. Un manifeste distant est une entrée NON FIABLE : validateBrikManifest doit refuser les
//    valeurs absurdes avant qu'elles dimensionnent des tampons GPU ou des plages HTTP. Le cas qui
//    compte est le dernier : un tenseur qui dépasse son shard = une lecture hors de la zone annoncée.
{
	const bon = parseBrikHeader(file).manifest;
	const clone = () => JSON.parse(JSON.stringify(bon)) as typeof bon;
	const refuse = (nom: string, casse: (m: ReturnType<typeof clone>) => void) => {
		const m = clone();
		casse(m);
		let threw = false;
		try { validateBrikManifest(m); } catch { threw = true; }
		check(`refuse ${nom}`, threw);
	};
	check('accepte un manifeste sain', (() => { try { validateBrikManifest(clone()); return true; } catch { return false; } })());
	refuse('un format inconnu', (m) => { (m as { format: string }).format = 'gguf'; });
	refuse('un blockCount délirant', (m) => { m.arch.blockCount = 1e9; });
	refuse('un vocab non entier', (m) => { m.arch.vocab = 1.5; });
	refuse('un dtype inconnu', (m) => { Object.values(m.tensors)[0].dtype = 'f8' as never; });
	refuse('un tenseur qui dépasse son shard', (m) => {
		const t = Object.values(m.tensors)[0];
		t.byteLength = m.shards.find((sh) => sh.id === t.shard)!.byteLength + 16;
	});
	refuse('un tenseur qui pointe un shard absent', (m) => { Object.values(m.tensors)[0].shard = 999; });
	refuse('deux shards de même id', (m) => { m.shards.push({ ...m.shards[0] }); });
	refuse('un shard.sha256 malformé', (m) => { m.shards[0].sha256 = 'not-a-sha256'; });
	refuse('un tokenizer.id en URL', (m) => { m.tokenizer = { kind: 'hf-hub', id: 'https://evil.tld/x' }; });
	refuse('un tokenizer.id qui remonte des chemins', (m) => { m.tokenizer = { kind: 'hf-hub', id: '../../secret' }; });
	refuse('un tokenizer.kind inconnu', (m) => { m.tokenizer = { kind: 'eval' as never }; });
	// Formes légitimes : dépôt HF, et la sentinelle sans barre oblique des BRIK RWKV en ligne.
	check('accepte « Xenova/qwen-tokenizer »', isValidTokenizerId('Xenova/qwen-tokenizer'));
	check('accepte la sentinelle « rwkv-world »', isValidTokenizerId('rwkv-world'));
	check('refuse « a/b/c »', !isValidTokenizerId('a/b/c'));
}

asyncChecks.then(() => {
	console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
	process.exit(failures === 0 ? 0 : 1);
});
