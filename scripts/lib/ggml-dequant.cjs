// Déquantification CPU des types GGML « K-quants » — le chaînon qui manquait pour builder un BRIK
// depuis un GGUF DÉJÀ quantifié (jusqu'ici build-lfm2-brik n'acceptait que F16/F32).
//
// Pourquoi : les GGUF quantifiés d'unsloth sont calibrés par matrice d'importance (imatrix) ET
// allouent les bits par tenseur (Q3_K sur q/k/gate/up, Q4_K sur ffn_down/attn_output, Q5_K sur
// attn_v, Q6_K sur les embeddings). Cette information ne s'invente pas côté RTN : pour l'exploiter
// il faut savoir relire leurs blocs.
//
// Chaque fonction reflète dequantize_row_* de llama.cpp (ggml-quants.c), y compris l'ordre de
// sortie : ce sont les mêmes formules que les références CPU du moteur (kernels.ts), qui sont
// elles-mêmes validées contre les noyaux WGSL par selfValidate.
// f16 → f32 en local : ce module doit rester utilisable sans dépendre de l'emplacement des .js
// compilés (tsc les range à plat ou sous brik/ selon les entrées passées).
function f16BitsToF32(h) {
  const s = (h & 0x8000) ? -1 : 1, e = (h >> 10) & 0x1f, f = h & 0x3ff;
  if (e === 0) return s * Math.pow(2, -14) * (f / 1024);
  if (e === 31) return f ? NaN : s * Infinity;
  return s * Math.pow(2, e - 15) * (1 + f / 1024);
}

const si8 = (b) => (b > 127 ? b - 256 : b);

// Q4_K : super-blocs de 256 (144 o) — d f16, dmin f16, scales[12] (6 bits ×16), qs[128].
function dequantQ4K(bytes, nBlocks, out) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  for (let blk = 0; blk < nBlocks; blk++) {
    const base = blk * 144;
    const d = f16BitsToF32(dv.getUint16(base, true));
    const dmin = f16BitsToF32(dv.getUint16(base + 2, true));
    const s = (k) => bytes[base + 4 + k];
    const sc = (j) => (j < 4
      ? [s(j) & 63, s(j + 4) & 63]
      : [(s(j + 4) & 0xf) | ((s(j - 4) >> 6) << 4), (s(j + 4) >> 4) | ((s(j) >> 6) << 4)]);
    const ob = blk * 256;
    let is = 0, qsOff = 0;
    for (let j = 0; j < 256; j += 64) {
      const [a0, a1] = sc(is), [b0, b1] = sc(is + 1);
      const d1 = d * a0, m1 = dmin * a1, d2 = d * b0, m2 = dmin * b1;
      for (let l = 0; l < 32; l++) {
        const v = bytes[base + 16 + qsOff + l];
        out[ob + j + l] = d1 * (v & 0xf) - m1;
        out[ob + j + 32 + l] = d2 * (v >> 4) - m2;
      }
      qsOff += 32; is += 2;
    }
  }
  return out;
}

// Q5_K : 176 o — mêmes scales/mins que Q4_K + un 5ᵉ bit pris dans qh[32].
function dequantQ5K(bytes, nBlocks, out) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  for (let blk = 0; blk < nBlocks; blk++) {
    const base = blk * 176;
    const d = f16BitsToF32(dv.getUint16(base, true));
    const dmin = f16BitsToF32(dv.getUint16(base + 2, true));
    const s = (k) => bytes[base + 4 + k];
    const sc = (j) => (j < 4
      ? [s(j) & 63, s(j + 4) & 63]
      : [(s(j + 4) & 0xf) | ((s(j - 4) >> 6) << 4), (s(j + 4) >> 4) | ((s(j) >> 6) << 4)]);
    const ob = blk * 256;
    let is = 0, qsOff = 0, u1 = 1, u2 = 2;
    for (let j = 0; j < 256; j += 64) {
      const [a0, a1] = sc(is), [b0, b1] = sc(is + 1);
      const d1 = d * a0, m1 = dmin * a1, d2 = d * b0, m2 = dmin * b1;
      for (let l = 0; l < 32; l++) {
        const ql = bytes[base + 48 + qsOff + l], qhl = bytes[base + 16 + l];
        out[ob + j + l] = d1 * ((ql & 0xf) + ((qhl & u1) ? 16 : 0)) - m1;
        out[ob + j + 32 + l] = d2 * ((ql >> 4) + ((qhl & u2) ? 16 : 0)) - m2;
      }
      qsOff += 32; is += 2; u1 <<= 2; u2 <<= 2;
    }
  }
  return out;
}

// Q6_K : 210 o — ql[128], qh[64], scales int8[16], d f16 (en DERNIER, offset 208).
function dequantQ6K(bytes, nBlocks, out) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  for (let blk = 0; blk < nBlocks; blk++) {
    const base = blk * 210;
    const d = f16BitsToF32(dv.getUint16(base + 208, true));
    const ob = blk * 256;
    for (let half = 0; half < 2; half++) {
      const qlB = base + half * 64, qhB = base + 128 + half * 32, scB = base + 192 + half * 8, outB = ob + half * 128;
      for (let l = 0; l < 32; l++) {
        const is = (l / 16) | 0;
        const qll = bytes[qlB + l], qll32 = bytes[qlB + l + 32], qhl = bytes[qhB + l];
        out[outB + l] = d * si8(bytes[scB + is]) * (((qll & 0xf) | (((qhl >> 0) & 3) << 4)) - 32);
        out[outB + l + 32] = d * si8(bytes[scB + is + 2]) * (((qll32 & 0xf) | (((qhl >> 2) & 3) << 4)) - 32);
        out[outB + l + 64] = d * si8(bytes[scB + is + 4]) * (((qll >> 4) | (((qhl >> 4) & 3) << 4)) - 32);
        out[outB + l + 96] = d * si8(bytes[scB + is + 6]) * (((qll32 >> 4) | (((qhl >> 6) & 3) << 4)) - 32);
      }
    }
  }
  return out;
}

// Q3_K : 110 o — hmask[32] (bit de poids fort), qs[64] (2 bits bas), scales[12] (6 bits ×16), d f16.
// Symétrique : la valeur est d * scale * (q - 4) où le -4 vient du bit haut ABSENT dans hmask
// (llama.cpp écrit « - ((hm & m) ? 0 : 4) », c'est-à-dire un masque INVERSÉ — piège classique).
// Les 16 scales 6 bits sont repliés sur 12 octets : on rejoue exactement le dépliage kmask1/kmask2.
function dequantQ3K(bytes, nBlocks, out) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  const auxBuf = new ArrayBuffer(16);
  const auxDv = new DataView(auxBuf);
  const scales = new Int8Array(auxBuf); // vue octet : 16 scales, non signés en pratique (0..63)
  const KM1 = 0x03030303, KM2 = 0x0f0f0f0f;
  for (let blk = 0; blk < nBlocks; blk++) {
    const base = blk * 110;
    const dAll = f16BitsToF32(dv.getUint16(base + 108, true));
    const a0 = dv.getUint32(base + 96, true), a1 = dv.getUint32(base + 100, true), tmp = dv.getUint32(base + 104, true);
    auxDv.setUint32(0, ((a0 & KM2) | (((tmp >>> 0) & KM1) << 4)) >>> 0, true);
    auxDv.setUint32(4, ((a1 & KM2) | (((tmp >>> 2) & KM1) << 4)) >>> 0, true);
    auxDv.setUint32(8, (((a0 >>> 4) & KM2) | (((tmp >>> 4) & KM1) << 4)) >>> 0, true);
    auxDv.setUint32(12, (((a1 >>> 4) & KM2) | (((tmp >>> 6) & KM1) << 4)) >>> 0, true);
    const ob = blk * 256;
    let is = 0, m = 1, qOff = base + 32, y = ob;
    for (let n = 0; n < 256; n += 128) {
      let shift = 0;
      for (let j = 0; j < 4; j++) {
        let dl = dAll * (scales[is++] - 32);
        for (let l = 0; l < 16; l++) {
          const q = (bytes[qOff + l] >> shift) & 3;
          out[y++] = dl * (q - ((bytes[base + l] & m) ? 0 : 4));
        }
        dl = dAll * (scales[is++] - 32);
        for (let l = 0; l < 16; l++) {
          const q = (bytes[qOff + l + 16] >> shift) & 3;
          out[y++] = dl * (q - ((bytes[base + l + 16] & m) ? 0 : 4));
        }
        shift += 2; m <<= 1;
      }
      qOff += 32;
    }
  }
  return out;
}

// Q8_0 / Q4_0 / Q5_0 : blocs de 32.
function dequantQ8_0(bytes, nBlocks, out) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  for (let blk = 0; blk < nBlocks; blk++) {
    const base = blk * 34, d = f16BitsToF32(dv.getUint16(base, true));
    for (let l = 0; l < 32; l++) out[blk * 32 + l] = d * si8(bytes[base + 2 + l]);
  }
  return out;
}
function dequantQ4_0(bytes, nBlocks, out) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  for (let blk = 0; blk < nBlocks; blk++) {
    const base = blk * 18, d = f16BitsToF32(dv.getUint16(base, true));
    for (let j = 0; j < 16; j++) {
      const q = bytes[base + 2 + j];
      out[blk * 32 + j] = d * ((q & 0xf) - 8);
      out[blk * 32 + j + 16] = d * ((q >> 4) - 8);
    }
  }
  return out;
}
function dequantQ5_0(bytes, nBlocks, out) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  for (let blk = 0; blk < nBlocks; blk++) {
    const base = blk * 22, d = f16BitsToF32(dv.getUint16(base, true)), qh = dv.getUint32(base + 2, true);
    for (let j = 0; j < 16; j++) {
      const q = bytes[base + 6 + j];
      out[blk * 32 + j] = d * (((q & 0xf) | (((qh >>> j) << 4) & 0x10)) - 16);
      out[blk * 32 + j + 16] = d * (((q >> 4) | ((qh >>> (j + 12)) & 0x10)) - 16);
    }
  }
  return out;
}

const BLOCK = { Q4_K: 256, Q5_K: 256, Q6_K: 256, Q3_K: 256, Q8_0: 32, Q4_0: 32, Q5_0: 32 };
const IMPL = { Q4_K: dequantQ4K, Q5_K: dequantQ5K, Q6_K: dequantQ6K, Q3_K: dequantQ3K, Q8_0: dequantQ8_0, Q4_0: dequantQ4_0, Q5_0: dequantQ5_0 };

// Point d'entrée unique : type GGML + octets bruts → Float32Array de nElems.
function dequantGgml(type, bytes, nElems) {
  const out = new Float32Array(nElems);
  if (type === 'F32') {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let i = 0; i < nElems; i++) out[i] = dv.getFloat32(i * 4, true);
    return out;
  }
  if (type === 'F16') {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let i = 0; i < nElems; i++) out[i] = f16BitsToF32(dv.getUint16(i * 2, true));
    return out;
  }
  const impl = IMPL[type];
  if (!impl) throw new Error(`type GGML non géré côté CPU : ${type}`);
  const blk = BLOCK[type];
  if (nElems % blk !== 0) throw new Error(`${type} : ${nElems} éléments non multiple de ${blk}`);
  return impl(bytes, nElems / blk, out);
}

module.exports = { dequantGgml, dequantQ3K, dequantQ4K, dequantQ5K, dequantQ6K, dequantQ8_0, dequantQ4_0, dequantQ5_0, BLOCK };
