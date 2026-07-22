// IEEE-754 binary16 ⇄ f32 bit conversions. Extracted into their own module so both the tensor
// codec and the quant codecs (q4web/q8web) can share them without a circular import (codec needs
// to call the quant packers, and the quant packers need these f16 helpers).

// f32 → IEEE-754 binary16 bits (round-to-nearest-even). Mirrors the engine's existing f16 helper:
// subnormals (|x| < 2⁻¹⁴) flush to zero, out-of-range clamps to max-normal. Negligible for
// transformer weights, and keeps GPU/CPU decode identical.
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
