// BRIK "q4web" — a compact, WGSL-friendly 4-bit weight quant. Goal: same download size as GGUF
// Q4 (4-bit) but a layout that's trivial and branchless to dequantize in a shader (unlike GGUF's
// CPU-oriented k-quant super-blocks), so weights can stay 4-bit in VRAM and be dequantized
// on-the-fly inside the matmul → ~4× less VRAM than the current f32 expansion (bigger models fit).
//
// Scheme: asymmetric per-group quant, group = 32 contiguous weights along the contraction axis.
// Per group: an f16 scale + f16 min, and 32 packed 4-bit codes (q ∈ [0,15]); value ≈ q*scale+min.
// Structure-of-arrays (nibbles / scales / mins kept separate) so the kernel loads one scale+min
// per group then streams the nibbles.

import { f32ToF16Bits, f16BitsToF32 } from './f16';

export const Q4_GROUP = 32;

export interface Q4Tensor {
	nibbles: Uint8Array;   // n/2 bytes, two 4-bit codes per byte (low nibble = even index)
	scales: Uint16Array;   // one f16 scale per group
	mins: Uint16Array;     // one f16 min per group
	nElems: number;
}

// Total on-disk bytes for an n-element q4web tensor (nibbles + scales + mins).
export function q4ByteLength(n: number): number {
	const groups = n / Q4_GROUP;
	return n / 2 + groups * 2 + groups * 2;
}

export function quantizeQ4(data: Float32Array): Q4Tensor {
	const n = data.length;
	if (n % Q4_GROUP !== 0) throw new Error(`q4web: length ${n} not a multiple of ${Q4_GROUP}`);
	const groups = n / Q4_GROUP;
	const nibbles = new Uint8Array(n / 2);
	const scales = new Uint16Array(groups);
	const mins = new Uint16Array(groups);
	for (let g = 0; g < groups; g++) {
		const base = g * Q4_GROUP;
		let mn = Infinity, mx = -Infinity;
		for (let i = 0; i < Q4_GROUP; i++) { const v = data[base + i]; if (v < mn) mn = v; if (v > mx) mx = v; }
		const scale = (mx - mn) / 15 || 1e-8;
		// Round-trip scale/min through f16 so we quantize against the values the GPU will actually read.
		const sH = f32ToF16Bits(scale), mH = f32ToF16Bits(mn);
		scales[g] = sH; mins[g] = mH;
		const s = f16BitsToF32(sH) || 1e-8, m = f16BitsToF32(mH);
		for (let i = 0; i < Q4_GROUP; i++) {
			let q = Math.round((data[base + i] - m) / s);
			q = q < 0 ? 0 : q > 15 ? 15 : q;
			const idx = base + i;
			if ((i & 1) === 0) nibbles[idx >> 1] = q;          // low nibble
			else nibbles[idx >> 1] |= q << 4;                  // high nibble
		}
	}
	return { nibbles, scales, mins, nElems: n };
}

// On-disk layout of a q4web tensor: [nibbles | scales | mins], each sub-array contiguous. The
// sub-offsets are derivable from nElems alone, so the manifest stores ONE (offset, byteLength) per
// tensor and the loader splits with unpackQ4 — no extra metadata. Returns the concatenated bytes.
export function packQ4(t: Q4Tensor): Uint8Array {
	const scB = new Uint8Array(t.scales.buffer, t.scales.byteOffset, t.scales.byteLength);
	const mnB = new Uint8Array(t.mins.buffer, t.mins.byteOffset, t.mins.byteLength);
	const out = new Uint8Array(t.nibbles.length + scB.length + mnB.length);
	out.set(t.nibbles, 0);
	out.set(scB, t.nibbles.length);
	out.set(mnB, t.nibbles.length + scB.length);
	return out;
}

// Split a packed q4web blob back into its nibbles/scales/mins sub-arrays (the inverse of packQ4).
// Reads scales/mins via DataView so it works regardless of the blob's byte alignment.
export function unpackQ4(bytes: Uint8Array, nElems: number): Q4Tensor {
	const groups = nElems / Q4_GROUP;
	const nibLen = nElems / 2;
	const nibbles = bytes.slice(0, nibLen);
	const scales = new Uint16Array(groups);
	const mins = new Uint16Array(groups);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let g = 0; g < groups; g++) scales[g] = dv.getUint16(nibLen + g * 2, true);
	for (let g = 0; g < groups; g++) mins[g] = dv.getUint16(nibLen + groups * 2 + g * 2, true);
	return { nibbles, scales, mins, nElems };
}

export function dequantizeQ4(t: Q4Tensor): Float32Array {
	const out = new Float32Array(t.nElems);
	const groups = t.nElems / Q4_GROUP;
	for (let g = 0; g < groups; g++) {
		const s = f16BitsToF32(t.scales[g]), m = f16BitsToF32(t.mins[g]);
		const base = g * Q4_GROUP;
		for (let i = 0; i < Q4_GROUP; i++) {
			const idx = base + i;
			const byte = t.nibbles[idx >> 1];
			const q = (i & 1) === 0 ? (byte & 0xf) : (byte >> 4);
			out[idx] = q * s + m;
		}
	}
	return out;
}
