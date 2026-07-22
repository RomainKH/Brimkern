// Node test for the BRIK codec (no GPU needed): run with
//   node --experimental-strip-types src/lib/brik/codec.test.ts
// Proves f16 round-trips within f16 precision, f32 round-trips exactly, and shard packing keeps
// every tensor on a 16-byte boundary and decodes back to the original values.

import { f32ToF16Bits, f16BitsToF32, encodeTensor, decodeTensor, packShard } from './codec';
import { BRIK_ALIGN, alignUp } from './format';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
	if (cond) { console.log(`  ok   ${name}`); }
	else { console.log(`  FAIL ${name} ${detail}`); failures++; }
}

const rand = (n: number) => Float32Array.from({ length: n }, () => (Math.random() * 2 - 1) * 3);

// 1. f16 round-trip within binary16 relative precision (~2⁻¹⁰).
{
	const xs = rand(4096);
	// f16 has ~10 mantissa bits (rel ~1e-3) AND flushes subnormals (|v|<~6e-5) to zero, so use a
	// combined abs+rel bound — a pure relative metric is flaky for the occasional near-zero value.
	let worst = 0;
	for (const v of xs) {
		const back = f16BitsToF32(f32ToF16Bits(v));
		worst = Math.max(worst, Math.abs(back - v) - (1e-3 * Math.abs(v) + 1e-4));
	}
	check('f16 round-trip within 1e-3·|v| + 1e-4', worst <= 0, `overshoot=${worst.toExponential(2)}`);
}

// 2. Known f16 values decode exactly.
{
	check('f16(1.0) === 0x3c00', f32ToF16Bits(1.0) === 0x3c00, `got ${f32ToF16Bits(1.0).toString(16)}`);
	check('f16(-2.0) === 0xc000', f32ToF16Bits(-2.0) === 0xc000, `got ${f32ToF16Bits(-2.0).toString(16)}`);
	check('f16(0) === 0', f32ToF16Bits(0) === 0);
	check('decode(encode(0.5)) === 0.5', f16BitsToF32(f32ToF16Bits(0.5)) === 0.5);
}

// 3. f32 tensor encode/decode is exact.
{
	const data = rand(257); // odd length, non-aligned tail
	const back = decodeTensor(encodeTensor(data, 'f32'), data.length, 'f32');
	let exact = true;
	for (let i = 0; i < data.length; i++) if (back[i] !== data[i]) exact = false;
	check('f32 tensor round-trip exact', exact);
}

// 4. Shard packing: alignment + multi-tensor decode.
{
	const tensors = [
		{ name: 'a', dtype: 'f16' as const, shape: [3, 5], data: rand(15) },
		{ name: 'b', dtype: 'f32' as const, shape: [7], data: rand(7) },     // norm-like, stays f32
		{ name: 'c', dtype: 'f16' as const, shape: [2, 64], data: rand(128) }
	];
	const { buffer, entries } = packShard(tensors, 1);

	check('shard length is 16-aligned', buffer.length % BRIK_ALIGN === 0, `len=${buffer.length}`);

	let allAligned = true, allDecoded = true;
	for (const t of tensors) {
		const e = entries[t.name];
		if (e.offset % BRIK_ALIGN !== 0) allAligned = false;
		const slice = buffer.subarray(e.offset, e.offset + e.byteLength);
		const back = decodeTensor(slice, e.nElems, e.dtype);
		const tol = e.dtype === 'f16' ? 1e-2 : 0;
		for (let i = 0; i < e.nElems; i++) {
			if (Math.abs(back[i] - t.data[i]) > tol * (1 + Math.abs(t.data[i]))) allDecoded = false;
		}
		check(`tensor '${t.name}' shard=${e.shard} offset=${e.offset} aligned`, e.offset % BRIK_ALIGN === 0);
	}
	check('all tensor offsets 16-aligned', allAligned);
	check('all tensors decode back to source (within dtype precision)', allDecoded);
	check('entries reference shard 1', Object.values(entries).every((e) => e.shard === 1));
}

// 5. alignUp helper.
check('alignUp(1)=16', alignUp(1) === 16);
check('alignUp(16)=16', alignUp(16) === 16);
check('alignUp(17)=32', alignUp(17) === 32);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
