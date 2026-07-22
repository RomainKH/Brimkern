// Node test for the q3web 3-bit codec (no GPU). Run via `npm run test:brik`.
// Checks round-trip accuracy (within the int3 budget), the bit-plane packing, pack↔unpack byte
// exactness, and that the on-disk size is 4 bits/weight (≈20% under q4's 5 bpw) — the whole point.

import { quantizeQ3, dequantizeQ3, packQ3, unpackQ3, q3ByteLength, Q3_GROUP } from './q3web';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) console.log(`  ok   ${name}`);
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

// Box-Muller normal sample → realistic weight distribution.
function randn(n: number): Float32Array {
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const u = Math.random() || 1e-9, v = Math.random();
		a[i] = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	}
	return a;
}

// 1. Round-trip accuracy on N(0,1) weights (8192 elems = 256 groups). 3-bit is coarser than q4.
{
	const data = randn(8192);
	const back = dequantizeQ3(quantizeQ3(data));
	let maxAbs = 0, sumAbs = 0;
	for (let i = 0; i < data.length; i++) { const e = Math.abs(back[i] - data[i]); maxAbs = Math.max(maxAbs, e); sumAbs += e; }
	const meanAbs = sumAbs / data.length;
	// int3 over 32-wide groups: ~8 levels/group → mean abs error ~0.12 for N(0,1), max ≈ range/14.
	check('q3 mean abs error bounded (< 0.22)', meanAbs < 0.22, `mean=${meanAbs.toFixed(4)}`);
	check('q3 max abs error bounded (< 0.8)', maxAbs < 0.8, `max=${maxAbs.toFixed(4)}`);
}

// 2. Exactness where it must hold: a group with 8 evenly-spaced values round-trips ~exactly.
{
	const data = new Float32Array(Q3_GROUP);
	for (let i = 0; i < Q3_GROUP; i++) data[i] = (i % 8) / 7; // values 0,1/7,...,1 → exactly representable
	const back = dequantizeQ3(quantizeQ3(data));
	let maxAbs = 0;
	for (let i = 0; i < data.length; i++) maxAbs = Math.max(maxAbs, Math.abs(back[i] - data[i]));
	check('q3 exact on 8 evenly-spaced levels', maxAbs < 1e-2, `max=${maxAbs.toFixed(4)}`);
}

// 3. Bit-plane sizes: lo = n/16 words (16 codes/u32), hi = n/32 words (32 codes/u32), 1 scale+min/group.
{
	const t = quantizeQ3(new Float32Array(Q3_GROUP * 3).fill(0));
	check('lo plane = n/16 words', t.lo.length === (Q3_GROUP * 3) / 16);
	check('hi plane = n/32 words', t.hi.length === (Q3_GROUP * 3) / 32);
	check('one scale + min per group', t.scales.length === 3 && t.mins.length === 3);
}

// 4. pack → unpack is byte-exact (the loader relies on this for the resident GPU upload).
{
	const t = quantizeQ3(randn(4096));
	const u = unpackQ3(packQ3(t), t.nElems);
	const eq = (a: ArrayLike<number>, b: ArrayLike<number>) => a.length === b.length && Array.prototype.every.call(a, (v, i) => v === b[i]);
	check('pack/unpack round-trips lo/hi/scales/mins', eq(t.lo, u.lo) && eq(t.hi, u.hi) && eq(t.scales, u.scales) && eq(t.mins, u.mins));
}

// 5. Size = 4 bits/weight (≈20% under q4's 5 bpw), far smaller than f16 (16 bits).
{
	const n = 4096;
	const bytes = q3ByteLength(n);
	const bitsPerWeight = (bytes * 8) / n;
	check('q3 size = 4 bits/weight', bitsPerWeight > 3.5 && bitsPerWeight < 4.5, `${bitsPerWeight.toFixed(2)} bpw`);
	check('q3 is 20% under q4 (5 bpw)', bytes === n / 2);
}

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
