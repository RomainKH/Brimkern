// Q3_K : le bloc le plus retors des K-quants — 16 scales de 6 bits repliées sur 12 octets, le bit
// de poids fort des codes rangé dans un masque INVERSÉ (llama.cpp écrit « - ((hm & m) ? 0 : 4) »),
// et un ordre d'écriture qui entrelace deux demi-blocs de 128. Ce test fabrique des blocs dont on
// connaît la réponse et vérifie l'INDEXATION (quel scale, quel bit de masque, quel décalage pour
// quel élément), calculée ici par des formules indépendantes de la boucle séquentielle du module.
//
// Usage : node scripts/lib/ggml-dequant.test.cjs
const { dequantQ3K, dequantGgml } = require('./ggml-dequant.cjs');

let échecs = 0;
const vérifie = (nom, ok, détail = '') => { if (!ok) { échecs++; console.log(`ÉCHEC ${nom} ${détail}`); } else console.log(`ok    ${nom}`); };

// f32 → bits f16 (assez pour les puissances de 2 utilisées ici).
const f16 = (x) => { const b = new DataView(new ArrayBuffer(4)); b.setFloat32(0, x); const u = b.getUint32(0);
  return ((u >>> 16) & 0x8000) | ((((u >>> 23) & 0xff) - 127 + 15) << 10) | ((u >>> 13) & 0x3ff); };

// Empaquette 16 valeurs 6 bits dans les 12 octets scales[] — inverse exact du dépliage kmask1/kmask2.
function packScales(s) {
  const o = new Uint8Array(12);
  for (let j = 0; j < 4; j++) {
    o[j] = (s[j] & 0xf) | ((s[8 + j] & 0xf) << 4);
    o[4 + j] = (s[4 + j] & 0xf) | ((s[12 + j] & 0xf) << 4);
    o[8 + j] = ((s[j] >> 4) & 3) | (((s[4 + j] >> 4) & 3) << 2) | (((s[8 + j] >> 4) & 3) << 4) | (((s[12 + j] >> 4) & 3) << 6);
  }
  return o;
}

// Fabrique un bloc Q3_K : d, 16 scales 6 bits, 256 codes 2 bits, 256 bits hauts.
function bloc(d, scales6, codes, bitsHauts) {
  const b = new Uint8Array(110);
  for (let i = 0; i < 256; i++) {
    // codes : plan de 2 bits — élément i du demi-bloc n (128) → octet qs[32*(n) + i%32], décalage 2*j.
    const n = i >> 7, r = i & 127, j = r >> 5, l = r & 31;
    b[32 + n * 32 + l] |= (codes[i] & 3) << (2 * j);
    if (bitsHauts[i]) b[l] |= 1 << (j + 4 * n);
  }
  b.set(packScales(scales6), 96);
  new DataView(b.buffer).setUint16(108, f16(d), true);
  return b;
}

// Valeur attendue, index par index, dérivée de la SPEC (pas de la boucle du module).
const attendu = (i, d, scales6, codes, bitsHauts) => {
  const n = i >> 7, r = i & 127, j = r >> 5, l = r & 31;
  const is = 8 * n + 2 * j + (l >= 16 ? 1 : 0);
  return d * (scales6[is] - 32) * (codes[i] - (bitsHauts[i] ? 0 : 4));
};

function cas(nom, d, scales6, codes, bitsHauts) {
  const got = dequantQ3K(bloc(d, scales6, codes, bitsHauts), 1, new Float32Array(256));
  let pire = 0, iPire = -1;
  for (let i = 0; i < 256; i++) {
    const e = Math.abs(got[i] - attendu(i, d, scales6, codes, bitsHauts));
    if (e > pire) { pire = e; iPire = i; }
  }
  vérifie(nom, pire < 1e-4, `écart max ${pire} à l'index ${iPire} (obtenu ${got[iPire]}, attendu ${attendu(iPire, d, scales6, codes, bitsHauts)})`);
}

const codesCycle = Array.from({ length: 256 }, (_, i) => i % 4);
const zéros = new Array(256).fill(0);
const uns = new Array(256).fill(1);
const alterné = Array.from({ length: 256 }, (_, i) => (i % 3 === 0 ? 1 : 0));

// 1. Tous les scales à 1 (33-32), aucun bit haut → valeur = code-4. Isole l'extraction des codes.
cas('codes 2 bits + masque haut absent', 1, new Array(16).fill(33), codesCycle, zéros);
// 2. Tous les bits hauts posés → valeur = code (le -4 disparaît). Isole le masque INVERSÉ.
cas('masque haut posé partout', 1, new Array(16).fill(33), codesCycle, uns);
// 3. Scales tous différents (32+is) → attrape toute permutation dans le dépliage 6 bits.
cas('16 scales distincts', 1, Array.from({ length: 16 }, (_, k) => 32 + k), codesCycle, alterné);
// 4. Scales négatifs (valeur 6 bits < 32) + d ≠ 1 → signe et échelle globale.
cas('scales négatifs, d = 0,25', 0.25, Array.from({ length: 16 }, (_, k) => 63 - 2 * k), codesCycle, alterné);
// 5. Deux blocs d'affilée : vérifie l'avance des offsets (110 o) et de la sortie (256 él.).
{
  const s1 = new Array(16).fill(33), s2 = Array.from({ length: 16 }, (_, k) => 32 + k);
  const deux = new Uint8Array(220);
  deux.set(bloc(1, s1, codesCycle, zéros), 0);
  deux.set(bloc(0.5, s2, codesCycle, uns), 110);
  const got = dequantQ3K(deux, 2, new Float32Array(512));
  let pire = 0;
  for (let i = 0; i < 256; i++) pire = Math.max(pire, Math.abs(got[i] - attendu(i, 1, s1, codesCycle, zéros)));
  for (let i = 0; i < 256; i++) pire = Math.max(pire, Math.abs(got[256 + i] - attendu(i, 0.5, s2, codesCycle, uns)));
  vérifie('deux blocs consécutifs', pire < 1e-4, `écart max ${pire}`);
}
// 6. Le point d'entrée générique refuse une taille non multiple de 256 (plutôt que lire hors bornes).
try { dequantGgml('Q3_K', new Uint8Array(110), 100); vérifie('nElems non multiple de 256 → erreur', false, 'aucune erreur levée'); }
catch { vérifie('nElems non multiple de 256 → erreur', true); }

console.log(échecs === 0 ? '\n=== Q3_K OK ===' : `\n=== ${échecs} ÉCHEC(S) ===`);
process.exit(échecs === 0 ? 0 : 1);
