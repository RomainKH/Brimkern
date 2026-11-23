// Tests sans navigateur de l'extension : choix du modèle (tier.ts) et règle udm=14 (rules.mjs).
// La lecture de la page Google et le panneau, eux, se testent dans Chrome :
// scripts/e2e/extension-google.mjs.
// Usage : npm run test:extension
import * as esbuild from 'esbuild';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { udm14Rules, SEARCH_REGEX, EXPLICIT_TAB_REGEX } from '../packages/extension/rules.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(path.join(tmpdir(), 'bk-ext-'));
const out = path.join(tmp, 'tier.mjs');
await esbuild.build({ entryPoints: [path.join(ROOT, 'packages/extension/src/tier.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const { chooseTier, TIER_MODELS } = await import(pathToFileURL(out).href);
const outA = path.join(tmp, 'answer.mjs');
await esbuild.build({ entryPoints: [path.join(ROOT, 'packages/extension/src/answer.ts')], bundle: true, format: 'esm', platform: 'node', outfile: outA, logLevel: 'error' });
const { cleanAnswer, buildAnswer, buildFollowUp } = await import(pathToFileURL(outA).href);
rmSync(tmp, { recursive: true, force: true });

let n = 0;
const test = (name, fn) => { fn(); n++; console.log(`  ✓ ${name}`); };

console.log('tier.ts');
test('sans WebGPU : aucun modèle', () => assert.deepEqual(chooseTier({ webgpu: false }), { tier: null, reason: 'no-webgpu' }));
test('adaptateur logiciel : refusé', () => assert.equal(chooseTier({ webgpu: true, fallbackAdapter: true }).reason, 'software-gpu'));
test('machine ordinaire : standard', () => assert.equal(chooseTier({ webgpu: true, deviceMemoryGB: 8, downlinkMbps: 10 }).tier, 'standard'));
test('économiseur de données : léger', () => assert.deepEqual(chooseTier({ webgpu: true, saveData: true, downlinkMbps: 10 }), { tier: 'light', reason: 'save-data' }));
test('débit < 1,5 Mbit/s : léger', () => assert.equal(chooseTier({ webgpu: true, downlinkMbps: 1.2 }).reason, 'slow-network'));
test('le débit prime sur effectiveType', () => assert.equal(chooseTier({ webgpu: true, downlinkMbps: 8, effectiveType: '2g' }).tier, 'standard'));
test('2g sans débit : léger', () => assert.equal(chooseTier({ webgpu: true, effectiveType: '2g' }).tier, 'light'));
test('≤ 2 Go de mémoire : léger', () => assert.equal(chooseTier({ webgpu: true, deviceMemoryGB: 2 }).reason, 'low-memory'));
test('4 Go de mémoire : léger (le 2B ne tiendrait pas à côté de Chrome)', () => assert.equal(chooseTier({ webgpu: true, deviceMemoryGB: 4 }).tier, 'light'));
test('les modèles distants sont épinglés à une révision, et nommés', () => {
  for (const { model, label } of Object.values(TIER_MODELS)) {
    assert.ok(label, model);
    if (model.startsWith('https://')) assert.match(model, /\/resolve\/[0-9a-f]{40}\//);
  }
});
test('aucune info réseau ni mémoire (Firefox/Safari) : standard', () => assert.equal(chooseTier({ webgpu: true }).tier, 'standard'));
test('le léger est plus petit que le standard', () => assert.ok(TIER_MODELS.light.bytes < TIER_MODELS.standard.bytes));

console.log('answer.ts');
// Les phrases réelles relevées au banc qualité du 2026-11-14.
test('formule de boutique retirée (FR)', () => assert.equal(cleanAnswer('L’eau bout à environ 93°. Puis-je vous aider pour autre chose ?'), 'L’eau bout à environ 93°.'));
test('formule de boutique retirée (variante)', () => assert.equal(cleanAnswer('Un œuf dur : 10 min. Je peux vous aider pour autre chose ?'), 'Un œuf dur : 10 min.'));
test('« Je ne peux pas vous aider pour autre chose… » retiré', () => assert.equal(cleanAnswer('Il faut un compte ANTS. Je ne peux pas vous aider pour autre chose que ce sujet précisément.'), 'Il faut un compte ANTS.'));
test('formule anglaise retirée', () => assert.equal(cleanAnswer('It is 212°F. Is there anything else I can help you with?'), 'It is 212°F.'));
test('/no_think retiré', () => assert.equal(cleanAnswer('Environ 384 400 km /no_think.'), 'Environ 384 400 km.'));
test('réponse normale intacte', () => assert.equal(cleanAnswer('Victor Hugo, en 1862 [1].'), 'Victor Hugo, en 1862 [1].'));
test('« aider » dans le sens courant intact', () => assert.equal(cleanAnswer('Le vinaigre peut aider à détartrer.'), 'Le vinaigre peut aider à détartrer.'));
const res = [{ title: 'T', url: 'https://a.fr', site: 'a.fr', snippet: 'x' }];
test('format livré : search', () => { const a = buildAnswer('m', 'q', res, 'fr'); assert.ok(a.config.examples && !a.config.knowledge && a.config.repeatPenalty === 1); });
test('format sdk (banc) : knowledge du SDK', () => { const a = buildAnswer('m', 'q', res, 'fr', 'sdk'); assert.ok(a.config.knowledge && a.docs === null && a.text === 'q'); });
test('format web : résultats numérotés dans l’ordre', () => { const a = buildAnswer('m', 'q', [...res, { ...res[0], title: 'U' }], 'en', 'web'); assert.match(a.text, /^Search: q\n\nResults:\n\[1\] T — a\.fr\nx\n\n\[2\] U/); assert.deepEqual(a.docs, [0, 1]); });
// Format 'search' (2026-11-15) : la pénalité de répétition du SDK (1,3) déformait les mots de la
// recherche (« boilig », « bouillière ») — elle doit rester à 1 sauf demande explicite.
const six = Array.from({ length: 6 }, (_, i) => ({ ...res[0], title: `T${i + 1}` }));
test('format search : pas de pénalité de répétition par défaut', () => assert.equal(buildAnswer('m', 'q', res, 'fr', 'search').config.repeatPenalty, 1));
test('format search : pénalité imposée par le banc', () => assert.equal(buildAnswer('m', 'q', res, 'fr', 'search', { repeatPenalty: 1.3 }).config.repeatPenalty, 1.3));
test('format search : 5 résultats, la recherche en dernier', () => { const a = buildAnswer('m', 'ma recherche', six, 'fr', 'search'); assert.match(a.text, /^Résultats :\n\[1\] T1 — a\.fr\nx\n\n[\s\S]*\[5\] T5[\s\S]*\n\nRecherche : ma recherche$/); assert.ok(!a.text.includes('T6')); assert.deepEqual(a.docs, [0, 1, 2, 3, 4]); });
test('format search : démonstrations au format exact des vrais tours', () => {
  for (const lang of ['fr', 'en']) {
    const a = buildAnswer('m', 'q', res, lang, 'search');
    const vrai = a.text.split('\n')[0];
    assert.ok(a.config.examples.length >= 2 && a.config.examples.every((e) => e.user.split('\n')[0] === vrai && /\[\d\]\.?$/.test(e.assistant)));
    assert.ok(!('knowledge' in a.config), 'aucun exemple de boutique (mode knowledge)');
  }
});
test('format search : aucune démonstration ne recoupe une requête du banc', () => {
  const banc = JSON.parse(readFileSync(path.join(ROOT, 'scripts/e2e/serp-queries.json'), 'utf8')).map((q) => q.q);
  const demos = ['fr', 'en'].flatMap((l) => buildAnswer('m', 'q', res, l, 'search').config.examples.map((e) => e.user.split('\n').at(-1)));
  for (const d of demos) assert.ok(!banc.some((q) => d.endsWith(q)), d);
});
test('suivi de conversation : premier tour (résultats + réponse) épinglé, échanges suivants dans history', () => {
  const f = buildFollowUp(
    'm',
    'hauteur tour eiffel',
    six,
    [
      { role: 'assistant', content: 'Elle mesure 330 m [1].' },
      { role: 'user', content: 'Et sans antenne ?' },
      { role: 'assistant', content: '300 m [2].' },
    ],
    'Quand a-t-elle été construite ?',
    'fr',
  );
  assert.equal(f.text, 'Quand a-t-elle été construite ?');
  assert.equal(f.docs, null);
  assert.equal(f.config.examples.length, 1);
  assert.match(f.config.examples[0].user, /^Résultats :\n\[1\] T1[\s\S]*\[5\] T5[\s\S]*\n\nRecherche : hauteur tour eiffel$/);
  assert.ok(!f.config.examples[0].user.includes('T6'));
  assert.equal(f.config.examples[0].assistant, 'Elle mesure 330 m [1].');
  assert.deepEqual(f.config.history, [
    { role: 'user', content: 'Et sans antenne ?' },
    { role: 'assistant', content: '300 m [2].' },
  ]);
  assert.equal(f.config.repeatPenalty, 1);
});
test('suivi de conversation (EN) : libellés anglais', () => {
  const f = buildFollowUp('m', 'eiffel tower height', res, [{ role: 'assistant', content: '330 m [1].' }], 'When was it built?', 'en');
  assert.match(f.config.examples[0].user, /^Results:\n\[1\] T[\s\S]*\n\nSearch: eiffel tower height$/);
  assert.match(f.config.system, /in English/);
});

console.log('rules.mjs (udm=14)');
// Simulation de declarativeNetRequest pour CES deux règles : la règle d'autorisation (priorité 2)
// gagne sur la redirection (priorité 1). Les expressions sont du RE2, sous-ensemble de RegExp ici.
const domaines = JSON.parse(readFileSync(path.join(ROOT, 'packages/extension/google-domains.json'), 'utf8'));
const rules = udm14Rules(domaines);
const domaineCouvert = (u) => domaines.some((d) => u.hostname === d || u.hostname.endsWith('.' + d));
function apply(url) {
  const u = new URL(url);
  if (!domaineCouvert(u)) return url;
  if (new RegExp(EXPLICIT_TAB_REGEX).test(url)) return url;
  if (!new RegExp(SEARCH_REGEX).test(url)) return url;
  u.searchParams.set('udm', '14');
  return u.toString();
}
test('recherche simple : udm=14 ajouté', () => assert.equal(new URL(apply('https://www.google.fr/search?q=tour+eiffel')).searchParams.get('udm'), '14'));
test('google.co.uk couvert', () => assert.match(apply('https://www.google.co.uk/search?q=x&hl=en'), /udm=14/));
test('déjà en udm=14 : inchangé (pas de boucle)', () => assert.equal(apply('https://www.google.com/search?q=x&udm=14'), 'https://www.google.com/search?q=x&udm=14'));
test('onglet Images (udm=2) : inchangé', () => assert.equal(apply('https://www.google.com/search?q=x&udm=2'), 'https://www.google.com/search?q=x&udm=2'));
test('Mode IA choisi (udm=50) : inchangé', () => assert.equal(apply('https://www.google.com/search?udm=50&q=x'), 'https://www.google.com/search?udm=50&q=x'));
test('Actualités (tbm=nws) : inchangé', () => assert.equal(apply('https://www.google.com/search?q=x&tbm=nws'), 'https://www.google.com/search?q=x&tbm=nws'));
test('« udm » dans la requête encodée : redirigé quand même', () => assert.match(apply('https://www.google.com/search?q=udm%3D2'), /udm=14/));
test('page d’accueil : inchangée', () => assert.equal(apply('https://www.google.com/?hl=fr'), 'https://www.google.com/?hl=fr'));
test('autre domaine : inchangé', () => assert.equal(apply('https://www.bing.com/search?q=x'), 'https://www.bing.com/search?q=x'));
test('priorités : autorisation au-dessus de la redirection', () => assert.ok(rules[0].action.type === 'allow' && rules[0].priority > rules[1].priority));
test('les deux règles ne visent que la page principale', () => assert.ok(rules.every((r) => r.condition.resourceTypes.join() === 'main_frame')));

console.log(`\n${n} tests OK`);
