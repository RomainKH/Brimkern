// BRIK tensor codec: f32 ⇄ f16 conversion, tensor encode/decode, and shard packing with
// 16-byte alignment. Pure functions (no DOM / no GPU) so they run identically in the browser
// converter, a Node build script, and unit tests.

import { BRIK_ALIGN, alignUp, type BrikDType, type BrikTensorEntry } from './format';
import { f32ToF16Bits, f16BitsToF32 } from './f16';
import { quantizeQ4, dequantizeQ4, packQ4, unpackQ4 } from './q4web';
import { quantizeQ8, dequantizeQ8, packQ8, unpackQ8 } from './q8web';
import { quantizeQ3, dequantizeQ3, packQ3, unpackQ3 } from './q3web';

// Re-exported for callers that historically imported the f16 helpers from the codec.
export { f32ToF16Bits, f16BitsToF32 };

// Encode one tensor's f32 values to its on-disk bytes for the given dtype. f16/f32 store the
// values directly; q4/q8 quantize (per-32-group int4/int8) and pack to the compact SoA blob the
// fused GPU matmuls consume — same download size as GGUF Q4/Q8 but a WGSL-native layout.
export function encodeTensor(data: Float32Array, dtype: BrikDType): Uint8Array {
	if (dtype === 'f32') {
		return new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
	}
	if (dtype === 'q4') return packQ4(quantizeQ4(data));
	if (dtype === 'q8') return packQ8(quantizeQ8(data));
	if (dtype === 'q3') return packQ3(quantizeQ3(data));
	const u16 = new Uint16Array(data.length);
	for (let i = 0; i < data.length; i++) u16[i] = f32ToF16Bits(data[i]);
	return new Uint8Array(u16.buffer);
}

// Decode `nElems` values of `dtype` from raw bytes back to f32 (loader verification / Node tests).
// For q4/q8 this dequantizes — lossy by design, used to check round-trip accuracy, not to feed the
// GPU (the runtime uploads the packed bytes straight to the fused matmul, no f32 round-trip).
export function decodeTensor(bytes: Uint8Array, nElems: number, dtype: BrikDType): Float32Array {
	if (dtype === 'f32') {
		// Copy (the slice may not be 4-byte aligned for a direct Float32Array view).
		const out = new Float32Array(nElems);
		const dv = new DataView(bytes.buffer, bytes.byteOffset);
		for (let i = 0; i < nElems; i++) out[i] = dv.getFloat32(i * 4, true);
		return out;
	}
	if (dtype === 'q4') return dequantizeQ4(unpackQ4(bytes, nElems));
	if (dtype === 'q8') return dequantizeQ8(unpackQ8(bytes, nElems));
	if (dtype === 'q3') return dequantizeQ3(unpackQ3(bytes, nElems));
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	const out = new Float32Array(nElems);
	for (let i = 0; i < nElems; i++) out[i] = f16BitsToF32(dv.getUint16(i * 2, true));
	return out;
}

export interface TensorToPack {
	name: string;
	dtype: BrikDType;
	shape: number[];
	// Either the f32 values to encode here, OR pre-encoded `bytes` (e.g. produced by a GPU quantizer)
	// to write as-is. `nElems` is needed when only bytes are given (no data to count).
	data?: Float32Array;
	bytes?: Uint8Array;
	nElems?: number;
}

// Pack a set of tensors into ONE shard buffer, each starting on a 16-byte boundary. Returns the
// shard bytes plus the manifest entries (offset/byteLength/shard) for each tensor.
export function packShard(
	tensors: TensorToPack[],
	shardId: number
): { buffer: Uint8Array; entries: Record<string, BrikTensorEntry> } {
	const encoded = tensors.map((t) => ({
		t,
		bytes: t.bytes ?? encodeTensor(t.data!, t.dtype),
		nElems: t.nElems ?? t.data?.length ?? t.shape.reduce((a, b) => a * b, 1),
	}));
	let total = 0;
	for (const { bytes } of encoded) total = alignUp(total) + bytes.length;
	const buffer = new Uint8Array(alignUp(total)); // pad the tail too, so the shard length is aligned
	const entries: Record<string, BrikTensorEntry> = {};
	let cursor = 0;
	for (const { t, bytes, nElems } of encoded) {
		cursor = alignUp(cursor);
		buffer.set(bytes, cursor);
		entries[t.name] = {
			dtype: t.dtype,
			shape: t.shape,
			nElems,
			shard: shardId,
			offset: cursor,
			byteLength: bytes.length
		};
		cursor += bytes.length;
	}
	return { buffer, entries };
}

export { BRIK_ALIGN };
