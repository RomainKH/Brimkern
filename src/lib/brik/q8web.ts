// BRIK "q8web" — a compact, WGSL-friendly 8-bit weight quant. The "heavy but fast" tier: ~half the
// download/VRAM of f16 with near-f16 quality, and a layout that's trivial + branchless to
// dequantize in a shader so weights can stay 8-bit in VRAM and be dequantized on-the-fly inside the
// matmul (no f32 expansion → ~2× less VRAM than f16, ~4× less than the f32 the engine used to hold).
//
// Scheme: SYMMETRIC per-group quant, group = 32 contiguous weights along the contraction axis.
// Per group: one f16 scale, and 32 signed int8 codes (q ∈ [-127,127]); value ≈ q*scale. Symmetric
// (no min) — int8's range is wide enough that an offset buys almost nothing, and it halves the
// per-group metadata vs q4web. Structure-of-arrays (codes / scales kept separate) so the kernel
// loads one scale per group then streams the codes (read 4 int8 per u32 word).

import { f32ToF16Bits, f16BitsToF32 } from './f16';

export const Q8_GROUP = 32;

export interface Q8Tensor {
	codes: Int8Array;     // n signed int8 codes, one per weight
	scales: Uint16Array;  // one f16 scale per group
	nElems: number;
}

// Total on-disk bytes for an n-element q8web tensor (codes + scales) ≈ 8.5 bits/weight.
export function q8ByteLength(n: number): number {
	const groups = n / Q8_GROUP;
	return n + groups * 2;
}

export function quantizeQ8(data: Float32Array): Q8Tensor {
	const n = data.length;
	if (n % Q8_GROUP !== 0) throw new Error(`q8web: length ${n} not a multiple of ${Q8_GROUP}`);
	const groups = n / Q8_GROUP;
	const codes = new Int8Array(n);
	const scales = new Uint16Array(groups);
	for (let g = 0; g < groups; g++) {
		const base = g * Q8_GROUP;
		let amax = 0;
		for (let i = 0; i < Q8_GROUP; i++) { const a = Math.abs(data[base + i]); if (a > amax) amax = a; }
		const scale = amax / 127 || 1e-8;
		// Round-trip the scale through f16 so we quantize against the value the GPU will actually read.
		const sH = f32ToF16Bits(scale);
		scales[g] = sH;
		const s = f16BitsToF32(sH) || 1e-8;
		for (let i = 0; i < Q8_GROUP; i++) {
			let q = Math.round(data[base + i] / s);
			q = q < -127 ? -127 : q > 127 ? 127 : q;
			codes[base + i] = q;
		}
	}
	return { codes, scales, nElems: n };
}

// On-disk layout of a q8web tensor: [codes | scales], contiguous. Sub-offsets derive from nElems
// alone, so the manifest stores ONE (offset, byteLength) per tensor and the loader splits with
// unpackQ8. Returns the concatenated bytes.
export function packQ8(t: Q8Tensor): Uint8Array {
	const codesB = new Uint8Array(t.codes.buffer, t.codes.byteOffset, t.codes.byteLength);
	const scB = new Uint8Array(t.scales.buffer, t.scales.byteOffset, t.scales.byteLength);
	const out = new Uint8Array(codesB.length + scB.length);
	out.set(codesB, 0);
	out.set(scB, codesB.length);
	return out;
}

// Split a packed q8web blob back into its codes/scales sub-arrays (the inverse of packQ8).
export function unpackQ8(bytes: Uint8Array, nElems: number): Q8Tensor {
	const groups = nElems / Q8_GROUP;
	const codes = new Int8Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + nElems));
	const scales = new Uint16Array(groups);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let g = 0; g < groups; g++) scales[g] = dv.getUint16(nElems + g * 2, true);
	return { codes, scales, nElems };
}

export function dequantizeQ8(t: Q8Tensor): Float32Array {
	const out = new Float32Array(t.nElems);
	const groups = t.nElems / Q8_GROUP;
	for (let g = 0; g < groups; g++) {
		const s = f16BitsToF32(t.scales[g]);
		const base = g * Q8_GROUP;
		for (let i = 0; i < Q8_GROUP; i++) out[base + i] = t.codes[base + i] * s;
	}
	return out;
}
