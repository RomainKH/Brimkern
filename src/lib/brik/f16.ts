// IEEE-754 binary16 ⇄ f32 bit conversions. Extracted into their own module so both the tensor
// codec and the quant codecs (q4web/q8web) can share them without a circular import (codec needs
// to call the quant packers, and the quant packers need these f16 helpers).

// f32 → IEEE-754 binary16 bits (round-to-nearest-even), SOUS-NORMAUX COMPRIS. Out-of-range clamps
// to max-normal.
// ⚠️ Jusqu'au 2026-10-11, |x| < 2⁻¹⁴ était ramené à ±0 (« négligeable pour des poids de transformeur »).
// Faux pour les ÉCHELLES de quantification : q8web/q4web stockent amax/127 (ou (max − min)/15) en f16,
// et un groupe de 32 poids dont le maximum est sous 0,0078 avait une échelle nulle → le groupe entier
// déquantifié à ZÉRO. Les UNet SD n'y tombaient jamais ; le décodeur vidéo LTX (|w| ≈ 5·10⁻³) perdait
// ainsi des centaines de milliers de poids par convolution. Le décodeur CPU (f16BitsToF32) et le GPU
// (f16d des shaders) lisaient déjà les sous-normaux : seul l'encodeur manquait.
export function f32ToF16Bits(val: number): number {
	const f = new Float32Array(1);
	const i = new Uint32Array(f.buffer);
	f[0] = val;
	const x = i[0];
	const sign = (x >> 16) & 0x8000;
	let exp = ((x >> 23) & 0xff) - 127 + 15;
	let mant = x & 0x7fffff;
	if (exp <= 0) {
		// Sous-normal f16 : valeur = m · 2⁻²⁴. m = round(|x| / 2⁻²⁴), arrondi pair ; 1024 déborde sur le
		// plus petit normal (bits 0x0400), ce qui est la bonne réponse.
		if (exp < -10) return sign;
		const full = (mant | 0x800000) >>> 0;          // mantisse avec le 1 implicite, 24 bits
		const shift = 14 - exp;                        // 14 … 24
		let m = full >>> shift;
		const rem = full & ((1 << shift) - 1), half = 1 << (shift - 1);
		if (rem > half || (rem === half && (m & 1))) m++;
		return sign | m;
	}
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
