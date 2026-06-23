// Node test for the store-only ZIP writer/reader. Run via `npm run test:bwp`.
// Round-trips a JSON manifest + a couple of binary shards and checks names/bytes survive exactly.

import { makeZip, readZip, concatParts } from './zip';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

const manifestJson = JSON.stringify({ format: 'bwp', version: 1, hello: 'wörld €' });
const shard0 = Uint8Array.from({ length: 5000 }, (_, i) => (i * 31 + 7) & 0xff);
const shard1 = new Uint8Array(0); // empty shard edge case

const entries = [
	{ name: 'manifest.json', data: new TextEncoder().encode(manifestJson) },
	{ name: 'shard-0000.bwp', data: shard0 },
	{ name: 'shard-0001.bwp', data: shard1 },
];

const zipped = concatParts(makeZip(entries));
const out = readZip(zipped);

check('entry count round-trips', out.length === entries.length, `got ${out.length}`);

const byName = new Map(out.map((e) => [e.name, e.data]));
check('manifest.json content matches',
	new TextDecoder().decode(byName.get('manifest.json')!) === manifestJson);

const eq = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((v, i) => v === b[i]);
check('binary shard matches byte-for-byte', eq(byName.get('shard-0000.bwp')!, shard0));
check('empty shard round-trips', eq(byName.get('shard-0001.bwp')!, shard1));

// Signatures sanity: starts with a local file header, ends with EOCD.
const dv = new DataView(zipped.buffer, zipped.byteOffset, zipped.byteLength);
check('starts with local file header', dv.getUint32(0, true) === 0x04034b50);
check('ends with end-of-central-directory', dv.getUint32(zipped.length - 22, true) === 0x06054b50);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
