#!/usr/bin/env node
// Sélection des PLAGES REDONDANTES du cache (src/lib/storage.ts) — fonction pure, testée sans
// navigateur. C'est la garde du correctif « 239,4 Mo en cache pour un fichier de 149 Mo » : des
// plages résiduelles d'un ANCIEN plan de découpage, qui ne resserviront jamais mais comptent dans
// le quota. La règle testée ici est volontairement conservatrice — on ne supprime QUE ce qui est
// strictement inclus dans une autre plage du même fichier.
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '.brik-build', 'ranges');
execFileSync('npx', ['tsc', path.join(ROOT, 'src', 'lib', 'storage.ts'),
  '--outDir', OUT, '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node', '--skipLibCheck'],
  { stdio: 'inherit' });
const { parseRangeKey, redundantRangeKeys } = require(path.join(OUT, 'storage.js'));

let ok = 0, ko = 0;
const check = (c, m) => { if (c) ok++; else ko++; console.log(`${c ? '  ok  ' : '  FAIL'} ${m}`); };
const same = (a, b) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

const M = 'https://hf.co/x/lfm25-230m-q4.brik';
const N = 'https://hf.co/x/autre.brik';

// ── parseRangeKey ──────────────────────────────────────────────────────────────────────────────
check(parseRangeKey(`${M}?__brik=0-1023`)?.start === 0, 'parse : début lu');
check(parseRangeKey(`${M}?__brik=0-1023`)?.end === 1023, 'parse : fin lue');
check(parseRangeKey(`${M}?__brik=0-1023`)?.url === M, 'parse : URL du fichier isolée');
check(parseRangeKey(M) === null, 'parse : une entrée plein-fichier n’est pas une plage');
check(parseRangeKey(`${M}?__brik=abc`) === null, 'parse : bornes non numériques rejetées');
check(parseRangeKey(`${M}?__brik=500-100`) === null, 'parse : fin avant début rejetée');
check(parseRangeKey(`${M}?other=1&__brik=10-20`)?.start === 10, 'parse : query préexistante supportée');

// ── redundantRangeKeys ─────────────────────────────────────────────────────────────────────────
// Le cas réel : un span de couche (nouveau plan) englobe des plages par-tenseur (ancien plan).
check(same(
  redundantRangeKeys([`${M}?__brik=1000-1999`, `${M}?__brik=1000-1199`, `${M}?__brik=1500-1999`]),
  [`${M}?__brik=1000-1199`, `${M}?__brik=1500-1999`]),
  'incluses dans un span englobant → supprimées (le cas des 101,8 Mo de chevauchement)');

check(redundantRangeKeys([`${M}?__brik=0-999`, `${M}?__brik=1000-1999`]).length === 0,
  'plages ADJACENTES (le plan normal) → aucune suppression');

check(redundantRangeKeys([`${M}?__brik=0-1499`, `${M}?__brik=1000-2499`]).length === 0,
  'chevauchement PARTIEL → laissé (on ne peut pas prouver qu’il est mort)');

check(redundantRangeKeys([`${M}?__brik=0-999`, `${N}?__brik=0-499`]).length === 0,
  'fichiers DIFFÉRENTS → jamais comparés entre eux');

check(same(redundantRangeKeys([`${N}?__brik=0-4999`, `${M}?__brik=0-999`, `${N}?__brik=100-200`]),
  [`${N}?__brik=100-200`]),
  'plusieurs fichiers mêlés → seule l’incluse du bon fichier part');

check(redundantRangeKeys([M, `${M}?__brik=0-999`]).length === 0,
  'une entrée plein-fichier n’est jamais candidate');

check(same(redundantRangeKeys([`${M}?__brik=0-9999`, `${M}?__brik=0-500`, `${M}?__brik=9000-9999`, `${M}?__brik=5000-5001`]),
  [`${M}?__brik=0-500`, `${M}?__brik=9000-9999`, `${M}?__brik=5000-5001`]),
  'trois incluses dans une grande (dont une qui finit au même octet) → toutes supprimées');

// Bornes identiques d'un côté : `0-999` contient `0-499`, et `500-999` aussi est contenue.
check(same(redundantRangeKeys([`${M}?__brik=0-999`, `${M}?__brik=0-499`, `${M}?__brik=500-999`]),
  [`${M}?__brik=0-499`, `${M}?__brik=500-999`]),
  'bornes partagées (même début, même fin) → incluses quand même');

// Le cas qui doit ABSOLUMENT rester intact : le plan courant, une plage par couche, sans recouvrement.
const plan = Array.from({ length: 16 }, (_, i) => `${M}?__brik=${i * 1000}-${i * 1000 + 999}`);
check(redundantRangeKeys(plan).length === 0, 'un plan par couche complet → zéro suppression (non-régression)');

// Idempotence : après une purge, une seconde passe ne trouve plus rien.
const after = plan.concat([`${M}?__brik=100-200`]);
const first = redundantRangeKeys(after);
const remaining = after.filter((k) => !first.includes(k));
check(first.length === 1 && redundantRangeKeys(remaining).length === 0, 'purge IDEMPOTENTE (2e passe : rien)');

check(redundantRangeKeys([]).length === 0, 'cache vide → rien');

console.log(`\n${ok}/${ok + ko} assertions OK${ko ? ' — ÉCHEC' : ''}`);
process.exit(ko ? 1 : 0);
