// BWP tensor codec: f32 ⇄ f16 conversion, tensor encode/decode, and shard packing with
// 16-byte alignment. Pure functions (no DOM / no GPU) so they run identically in the browser
// converter, a Node build script, and unit tests.

import { BWP_ALIGN, alignUp, type BwpDType, type BwpTensorEntry } from './format';

// f32 → IEEE-754 binary16 bits (round-to-nearest-even). Mirrors the engine's existing f16
// helper: subnormals (|x| < 2⁻¹⁴) flush to zero, out-of-range clamps to max-normal. Negligible
// for transformer weights, and keeps GPU/CPU decode identical.
export function f32ToF16Bits(val: number): number {
	const f = new Float32Array(1);
	const i = new Uint32Array(f.buffer);
	f[0] = val;
	const x = i[0];
	const sign = (x >> 16) & 0x8000;
	let exp = ((x >> 23) & 0xff) - 127 + 15;
	let mant = x & 0x7fffff;
	if (exp <= 0) return sign;             // too small → ±0
	if (exp >= 31) return sign | 0x7bff;   // too large → ±max-normal
	const round = (mant >> 13) + ((mant >> 12) & 1); // round-to-nearest-even on 10-bit mantissa
	mant = round;
	if (mant === 0x400) { mant = 0; exp += 1; }
	return sign | (exp << 10) | (mant & 0x3ff);
}

// IEEE binary16 bits → f32 (full subnormal/inf handling; standard hardware f16 decode).
export function f16BitsToF32(h: number): number {
	const s = (h >> 15) & 1;
	const e = (h >> 10) & 0x1f;
	const m = h & 0x3ff;
	let val: number;
	if (e === 0) val = m * 5.9604645e-8;             // 2⁻²⁴ · m (subnormal)
	else if (e === 31) val = m ? NaN : Infinity;
	else val = (1 + m / 1024) * 2 ** (e - 15);
	return s === 1 ? -val : val;
}

// Encode one tensor's f32 values to its on-disk bytes for the given dtype.
export function encodeTensor(data: Float32Array, dtype: BwpDType): Uint8Array {
	if (dtype === 'f32') {
		return new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
	}
	const u16 = new Uint16Array(data.length);
	for (let i = 0; i < data.length; i++) u16[i] = f32ToF16Bits(data[i]);
	return new Uint8Array(u16.buffer);
}

// Decode `nElems` values of `dtype` from raw bytes back to f32 (loader + verification).
export function decodeTensor(bytes: Uint8Array, nElems: number, dtype: BwpDType): Float32Array {
	if (dtype === 'f32') {
		// Copy (the slice may not be 4-byte aligned for a direct Float32Array view).
		const out = new Float32Array(nElems);
		const dv = new DataView(bytes.buffer, bytes.byteOffset);
		for (let i = 0; i < nElems; i++) out[i] = dv.getFloat32(i * 4, true);
		return out;
	}
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	const out = new Float32Array(nElems);
	for (let i = 0; i < nElems; i++) out[i] = f16BitsToF32(dv.getUint16(i * 2, true));
	return out;
}

export interface TensorToPack {
	name: string;
	dtype: BwpDType;
	shape: number[];
	data: Float32Array;
}

// Pack a set of tensors into ONE shard buffer, each starting on a 16-byte boundary. Returns the
// shard bytes plus the manifest entries (offset/byteLength/shard) for each tensor.
export function packShard(
	tensors: TensorToPack[],
	shardId: number
): { buffer: Uint8Array; entries: Record<string, BwpTensorEntry> } {
	const encoded = tensors.map((t) => ({ t, bytes: encodeTensor(t.data, t.dtype) }));
	let total = 0;
	for (const { bytes } of encoded) total = alignUp(total) + bytes.length;
	const buffer = new Uint8Array(alignUp(total)); // pad the tail too, so the shard length is aligned
	const entries: Record<string, BwpTensorEntry> = {};
	let cursor = 0;
	for (const { t, bytes } of encoded) {
		cursor = alignUp(cursor);
		buffer.set(bytes, cursor);
		entries[t.name] = {
			dtype: t.dtype,
			shape: t.shape,
			nElems: t.data.length,
			shard: shardId,
			offset: cursor,
			byteLength: bytes.length
		};
		cursor += bytes.length;
	}
	return { buffer, entries };
}

export { BWP_ALIGN };
