#!/usr/bin/env node
// Sélection des modèles à purger (src/lib/modelUsage.ts) — partie PURE, sans navigateur.
// Ce qui doit tenir : ne jamais toucher au modèle chargé, ne jamais supprimer un modèle dont on
// n'a pas d'historique d'usage (sinon la première purge après mise à jour efface tout), et
// respecter « jamais » (0 jour).
const path = require('path');
const { buildSync } = require('esbuild');
const out = path.join(__dirname, '..', '.brik-build', 'evict-test.cjs');
buildSync({ entryPoints: [path.join(__dirname, '..', 'src', 'lib', 'modelUsage.ts')], bundle: true, format: 'cjs', platform: 'node', outfile: out, logLevel: 'silent' });
const { pickStaleModels, modelKey, DEFAULT_EVICT_DAYS } = require(out);

let pass = 0, fail = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++; else { fail++; console.log(`✗ ${label}\n   attendu ${JSON.stringify(want)}\n   obtenu  ${JSON.stringify(got)}`); }
};

const DAY = 86400000;
const NOW = 1_700_000_000_000;
const names = (r) => r.map((m) => m.key);

const models = [
  { key: 'https://h/old.brik', bytes: 1e9, lastUsed: NOW - 40 * DAY },   // vieux
  { key: 'https://h/recent.brik', bytes: 2e8, lastUsed: NOW - 3 * DAY }, // récent
  { key: 'https://h/loaded.brik', bytes: 5e8, lastUsed: NOW - 90 * DAY },// vieux MAIS chargé
  { key: 'https://h/unknown.brik', bytes: 3e8 },                          // sans historique
];

eq('purge à 30 j', names(pickStaleModels(models, 30, NOW, ['https://h/loaded.brik'])), ['https://h/old.brik']);
eq('modèle chargé épargné', pickStaleModels(models, 30, NOW, ['https://h/loaded.brik']).some((m) => m.key.includes('loaded')), false);
eq('sans historique épargné', pickStaleModels(models, 30, NOW, []).some((m) => m.key.includes('unknown')), false);
eq('« jamais » (0) ne purge rien', names(pickStaleModels(models, 0, NOW, [])), []);
eq('7 j purge aussi le récent ? non (3 j)', names(pickStaleModels(models, 7, NOW, ['https://h/loaded.brik'])), ['https://h/old.brik']);
eq('2 j purge le récent', names(pickStaleModels(models, 2, NOW, ['https://h/loaded.brik'])), ['https://h/old.brik', 'https://h/recent.brik']);
eq('90 j ne purge plus rien', names(pickStaleModels(models, 90, NOW, ['https://h/loaded.brik'])), []);
eq('liste vide', names(pickStaleModels([], 30, NOW, [])), []);
// La clé ignore la query de plage : les centaines d'entrées d'un même .brik = un seul modèle.
eq('clé sans plage', modelKey('https://h/m.brik?__brik=100-200'), 'https://h/m.brik');
eq('clé inchangée sans plage', modelKey('https://h/m.gguf'), 'https://h/m.gguf');
eq('défaut 30 j', DEFAULT_EVICT_DAYS, 30);

console.log(`\n${pass}/${pass + fail} assertions OK${fail ? ' — ÉCHEC' : ''}`);
process.exit(fail ? 1 : 0);
