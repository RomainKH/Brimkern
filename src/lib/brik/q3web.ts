// BRIK "q3web" — a compact, WGSL-friendly 3-bit weight quant. The "extra-light" tier: ~20% smaller
// download/VRAM than q4 (4 effective bits/weight vs 5) for the biggest models, with a layout that
// stays branchless and byte-aligned to dequantize in a shader (weights kept 3-bit in VRAM,
// dequantized on-the-fly inside the matmul).
//
// Scheme: asymmetric per-group quant, group = 32 contiguous weights along the contraction axis.
// Per group: an f16 scale + f16 min, and 32 codes q ∈ [0,7]; value ≈ q*scale+min.
//
// Packing (the crux — 3 bits don't tile a byte). We SPLIT each code into bit planes so every plane
// stays u32/bit aligned (no code straddles a u32 boundary, unlike a naive contiguous 3-bit stream):
//   • "lo" plane: the 2 low bits of each code, 16 codes per u32 (code i at bits (i&15)*2).
//   • "hi" plane: the 1 high bit of each code, 32 codes per u32 (code i at bit (i&31)).
// So 32 codes = 2 lo-words + 1 hi-word = 96 bits = 3 bits/weight. With the f16 scale+min that's
// 16 bytes / 32 weights = 4 bits/weight effective. Structure-of-arrays: [lo | hi | scales | mins].

import { f32ToF16Bits, f16BitsToF32 } from './f16';

export const Q3_GROUP = 32;

export interface Q3Tensor {
	lo: Uint32Array;      // 2 low bits per code, 16 codes / u32 → nElems/16 words
	hi: Uint32Array;      // 1 high bit per code, 32 codes / u32 → nElems/32 words
	scales: Uint16Array;  // one f16 scale per group
	mins: Uint16Array;    // one f16 min per group
	nElems: number;
}

// Total on-disk bytes for an n-element q3web tensor (lo + hi + scales + mins) = n/2 bytes exactly.
export function q3ByteLength(n: number): number {
	const groups = n / Q3_GROUP;
	return (n / 16) * 4 + (n / 32) * 4 + groups * 2 + groups * 2;
}

export function quantizeQ3(data: Float32Array): Q3Tensor {
	const n = data.length;
	if (n % Q3_GROUP !== 0) throw new Error(`q3web: length ${n} not a multiple of ${Q3_GROUP}`);
	const groups = n / Q3_GROUP;
	const lo = new Uint32Array(n / 16);
	const hi = new Uint32Array(n / 32);
	const scales = new Uint16Array(groups);
	const mins = new Uint16Array(groups);
	for (let g = 0; g < groups; g++) {
		const base = g * Q3_GROUP;
		let mn = Infinity, mx = -Infinity;
		for (let i = 0; i < Q3_GROUP; i++) { const v = data[base + i]; if (v < mn) mn = v; if (v > mx) mx = v; }
		const scale = (mx - mn) / 7 || 1e-8;
		// Round-trip scale/min through f16 so we quantize against the values the GPU will actually read.
		const sH = f32ToF16Bits(scale), mH = f32ToF16Bits(mn);
		scales[g] = sH; mins[g] = mH;
		const s = f16BitsToF32(sH) || 1e-8, m = f16BitsToF32(mH);
		for (let i = 0; i < Q3_GROUP; i++) {
			let q = Math.round((data[base + i] - m) / s);
			q = q < 0 ? 0 : q > 7 ? 7 : q;
			const idx = base + i;
			lo[idx >> 4] |= (q & 3) << ((idx & 15) * 2);  // 2 low bits, 16 codes/word
			hi[idx >> 5] |= (q >> 2) << (idx & 31);        // 1 high bit, 32 codes/word
		}
	}
	return { lo, hi, scales, mins, nElems: n };
}

// On-disk layout: [lo | hi | scales | mins], each sub-array contiguous. Sub-offsets derive from
// nElems alone, so the manifest stores ONE (offset, byteLength) per tensor and the loader splits
// with unpackQ3. Returns the concatenated bytes.
export function packQ3(t: Q3Tensor): Uint8Array {
	const loB = new Uint8Array(t.lo.buffer, t.lo.byteOffset, t.lo.byteLength);
	const hiB = new Uint8Array(t.hi.buffer, t.hi.byteOffset, t.hi.byteLength);
	const scB = new Uint8Array(t.scales.buffer, t.scales.byteOffset, t.scales.byteLength);
	const mnB = new Uint8Array(t.mins.buffer, t.mins.byteOffset, t.mins.byteLength);
	const out = new Uint8Array(loB.length + hiB.length + scB.length + mnB.length);
	out.set(loB, 0);
	out.set(hiB, loB.length);
	out.set(scB, loB.length + hiB.length);
	out.set(mnB, loB.length + hiB.length + scB.length);
	return out;
}

// Split a packed q3web blob back into its lo/hi/scales/mins sub-arrays (the inverse of packQ3).
// Reads via DataView so it works regardless of the blob's byte alignment.
export function unpackQ3(bytes: Uint8Array, nElems: number): Q3Tensor {
	const groups = nElems / Q3_GROUP;
	const loWords = nElems / 16, hiWords = nElems / 32;
	const loBytes = loWords * 4, hiBytes = hiWords * 4;
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	const lo = new Uint32Array(loWords);
	const hi = new Uint32Array(hiWords);
	const scales = new Uint16Array(groups);
	const mins = new Uint16Array(groups);
	for (let i = 0; i < loWords; i++) lo[i] = dv.getUint32(i * 4, true);
	for (let i = 0; i < hiWords; i++) hi[i] = dv.getUint32(loBytes + i * 4, true);
	const scBase = loBytes + hiBytes, mnBase = scBase + groups * 2;
	for (let g = 0; g < groups; g++) scales[g] = dv.getUint16(scBase + g * 2, true);
	for (let g = 0; g < groups; g++) mins[g] = dv.getUint16(mnBase + g * 2, true);
	return { lo, hi, scales, mins, nElems };
}

export function dequantizeQ3(t: Q3Tensor): Float32Array {
	const out = new Float32Array(t.nElems);
	const groups = t.nElems / Q3_GROUP;
	for (let g = 0; g < groups; g++) {
		const s = f16BitsToF32(t.scales[g]), m = f16BitsToF32(t.mins[g]);
		const base = g * Q3_GROUP;
		for (let i = 0; i < Q3_GROUP; i++) {
			const idx = base + i;
			const q = ((t.lo[idx >> 4] >> ((idx & 15) * 2)) & 3) | (((t.hi[idx >> 5] >> (idx & 31)) & 1) << 2);
			out[idx] = q * s + m;
		}
	}
	return out;
}
