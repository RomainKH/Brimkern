#!/usr/bin/env node
// Le SDK BUILDÉ suit-il les kernels du source ?
//
// `public/sdk.js` est un artefact VERSIONNÉ : il ne se régénère pas tout seul quand on touche au
// moteur. Le 2026-08-15, la RMSNorm parallèle a été livrée sans que ce fichier soit reconstruit —
// les sites tiers qui embarquent le SDK auraient gardé l'ancien kernel, sans que rien ne le signale
// (ni tsc, ni lint, ni le build Next : le fichier est valide, juste périmé). C'est une classe de
// panne SILENCIEUSE, donc elle mérite un test.
//
// Règle : tout kernel WGSL déclaré dans src/lib/webgpu/shaders.ts doit se retrouver dans le bundle.
// Le test échoue en nommant les manquants et en rappelant la commande — `npm run build:sdk`.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'webgpu', 'shaders.ts'), 'utf8');

// Les kernels sont les clés de l'objet SHADERS : `  nom: ` suivi d'un backtick (source WGSL).
const names = [...src.matchAll(/^\t([a-z0-9_]+):\s*`/gim)].map((m) => m[1]);
if (names.length < 20) {
  console.error(`✗ seulement ${names.length} kernels détectés dans shaders.ts — le motif de lecture a dû changer, ce test ne prouverait plus rien.`);
  process.exit(1);
}

// QUELS bundles doivent suivre le moteur : `sdk.js` (le « latest » de la balise script) et le
// fichier de la version COURANTE. Pas les versions antérieures : `public/sdk-<v>.js` est FIGÉ par
// contrat (cf. l'en-tête de scripts/build-sdk.mjs — « un intégrateur peut épingler une version et
// ne pas voir son widget changer sous ses pieds »), donc il porte les kernels de SA sortie et prend
// forcément du retard. Ce test listait toutes les versions : il exigeait donc de régénérer les
// fichiers épinglés à chaque évolution du moteur, c'est-à-dire exactement de rompre le gel qu'ils
// promettent. Le 0.1.0 publié sur npm et le 0.1.0 servi par le site avaient d'ailleurs déjà divergé.
const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'packages/sdk/package.json'), 'utf8')).version;
const bundles = ['public/sdk.js', `public/sdk-${version}.js`];
const figes = fs.readdirSync(path.join(ROOT, 'public'))
  .filter((f) => /^sdk-\d/.test(f) && f !== `sdk-${version}.js`);
if (figes.length) console.log(`  (figés, non vérifiés : ${figes.join(', ')})`);
let ko = 0;
for (const rel of bundles) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { console.log(`  ⚠ ${rel} absent — ignoré`); continue; }
  const js = fs.readFileSync(p, 'utf8');
  // Un kernel présent dans le bundle y apparaît comme clé (`nom:`) ou dans une chaîne.
  const missing = names.filter((n) => !js.includes(n));
  if (missing.length) {
    ko++;
    console.log(`  FAIL ${rel} — ${missing.length} kernel(s) absent(s) du bundle : ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}`);
  } else {
    console.log(`  ok   ${rel} — les ${names.length} kernels du source y sont`);
  }
}

if (ko) {
  console.log('\n✗ Le SDK buildé est PÉRIMÉ par rapport au moteur. Lancez : npm run build:sdk');
  process.exit(1);
}
console.log(`\n${bundles.length}/${bundles.length} bundles à jour`);
