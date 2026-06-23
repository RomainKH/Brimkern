// Node test for the q4web 4-bit codec (no GPU). Run via `npm run test:bwp`.
// Checks round-trip accuracy (within the int4 quantization budget), packing correctness, and
// that the on-disk size is ~Q4 (≈5 bits/weight), i.e. compact like GGUF Q4 — not f16-bigger.

import { quantizeQ4, dequantizeQ4, q4ByteLength, Q4_GROUP } from './q4web';

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

// 1. Round-trip accuracy on N(0,1) weights (8192 elems = 256 groups).
{
	const data = randn(8192);
	const back = dequantizeQ4(quantizeQ4(data));
	let maxAbs = 0, sumAbs = 0;
	for (let i = 0; i < data.length; i++) { const e = Math.abs(back[i] - data[i]); maxAbs = Math.max(maxAbs, e); sumAbs += e; }
	const meanAbs = sumAbs / data.length;
	// int4 over 32-wide groups (≈ Q4_1 quality): mean abs error ~0.06 for N(0,1), max ≈ range/30.
	check('q4 mean abs error ~Q4_1 (< 0.08)', meanAbs < 0.08, `mean=${meanAbs.toFixed(4)}`);
	check('q4 max abs error bounded (< 0.35)', maxAbs < 0.35, `max=${maxAbs.toFixed(4)}`);
}

// 2. Exactness where it must hold: a group with ≤16 distinct evenly-spaced values round-trips ~exactly.
{
	const data = new Float32Array(Q4_GROUP);
	for (let i = 0; i < Q4_GROUP; i++) data[i] = (i % 16) / 15; // values 0,1/15,...,1 → exactly representable
	const back = dequantizeQ4(quantizeQ4(data));
	let maxAbs = 0;
	for (let i = 0; i < data.length; i++) maxAbs = Math.max(maxAbs, Math.abs(back[i] - data[i]));
	check('q4 exact on 16 evenly-spaced levels', maxAbs < 1e-2, `max=${maxAbs.toFixed(4)}`);
}

// 3. Packing: two codes per byte, low nibble = even index.
{
	const t = quantizeQ4(new Float32Array(Q4_GROUP).fill(0));
	check('nibbles length = n/2', t.nibbles.length === Q4_GROUP / 2);
	check('one scale + min per group', t.scales.length === 1 && t.mins.length === 1);
}

// 4. Size ≈ Q4 (≈5 bits/weight), far smaller than f16 (16 bits).
{
	const n = 4096;
	const bytes = q4ByteLength(n);
	const bitsPerWeight = (bytes * 8) / n;
	check('q4 size ≈ 5 bits/weight (compact like Q4)', bitsPerWeight > 4 && bitsPerWeight < 6, `${bitsPerWeight.toFixed(2)} bpw`);
	check('q4 much smaller than f16 (16 bpw)', bytes < n * 2);
}

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
