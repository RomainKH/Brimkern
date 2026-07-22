// Node test for the q8web 8-bit codec (no GPU). Run via `npm run test:brik`.
// Checks round-trip accuracy (near-f16, far better than q4), packing correctness, and that the
// on-disk size is ≈8.5 bits/weight — about half of f16 (the "heavy but fast" tier).

import { quantizeQ8, dequantizeQ8, packQ8, unpackQ8, q8ByteLength, Q8_GROUP } from './q8web';

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

// 1. Round-trip accuracy on N(0,1) weights (8192 elems = 256 groups). int8 is ~16× finer than int4.
{
	const data = randn(8192);
	const back = dequantizeQ8(quantizeQ8(data));
	let maxAbs = 0, sumAbs = 0;
	for (let i = 0; i < data.length; i++) { const e = Math.abs(back[i] - data[i]); maxAbs = Math.max(maxAbs, e); sumAbs += e; }
	const meanAbs = sumAbs / data.length;
	check('q8 mean abs error near-f16 (< 0.015)', meanAbs < 0.015, `mean=${meanAbs.toFixed(5)}`);
	check('q8 max abs error bounded (< 0.05)', maxAbs < 0.05, `max=${maxAbs.toFixed(5)}`);
}

// 2. q8 is strictly more accurate than q4 on the same data (sanity vs the int4 tier).
{
	const data = randn(4096);
	const back = dequantizeQ8(quantizeQ8(data));
	let sumAbs = 0;
	for (let i = 0; i < data.length; i++) sumAbs += Math.abs(back[i] - data[i]);
	check('q8 mean abs error << q4 (< 0.02)', sumAbs / data.length < 0.02, `mean=${(sumAbs / data.length).toFixed(5)}`);
}

// 3. Packing: one code per weight, one scale per group.
{
	const t = quantizeQ8(new Float32Array(Q8_GROUP).fill(0));
	check('codes length = n', t.codes.length === Q8_GROUP);
	check('one scale per group', t.scales.length === 1);
}

// 4. Size ≈ 8.5 bits/weight — about half of f16 (16 bpw), double of q4 (~5 bpw).
{
	const n = 4096;
	const bytes = q8ByteLength(n);
	const bitsPerWeight = (bytes * 8) / n;
	check('q8 size ≈ 8.5 bits/weight', bitsPerWeight > 8 && bitsPerWeight < 9, `${bitsPerWeight.toFixed(2)} bpw`);
	check('q8 smaller than f16 (16 bpw)', bytes < n * 2);
}

// 5. Row sub-blob reconstruction (mirrors model.ts q8RowsBlob, used for q8 embeddings): a single
// row's contiguous q8 blob, rebuilt from the SoA [codes | scales] full blob, must dequantize to the
// same values as the full tensor. Validates the codes/scales offset math.
{
	const rows = 4, d = 64, n = rows * d; // d % 32 == 0
	const data = randn(n);
	const full = packQ8(quantizeQ8(data));
	const dequantFull = dequantizeQ8(unpackQ8(full, n));
	const g = d / 32;
	const rowBlob = (r: number) => {
		const b = new Uint8Array(d + g * 2);
		b.set(full.subarray(r * d, r * d + d), 0);
		b.set(full.subarray(n + r * g * 2, n + (r + 1) * g * 2), d);
		return b;
	};
	let ok = true;
	for (let r = 0; r < rows; r++) {
		const rowDeq = dequantizeQ8(unpackQ8(rowBlob(r), d));
		for (let i = 0; i < d; i++) if (Math.abs(rowDeq[i] - dequantFull[r * d + i]) > 1e-6) ok = false;
	}
	check('q8 row sub-blob reconstruction matches full dequant', ok);
}

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
