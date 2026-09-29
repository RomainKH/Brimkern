#!/usr/bin/env node
// GARDE-FOU : les exemples épinglés du SDK ne doivent pas souffler la réponse d'un banc.
//
// Pourquoi (2026-09-28) : l'exemple épinglé « I wear a 41, what is that in cm? » sur un guide de
// pointures était la question du banc (« I wear a 42, what is that in cm ? ») à un chiffre près, sur
// une fiche de même gabarit. Un modèle qui recopie l'exemple et un modèle qui lit la fiche devenaient
// indiscernables ; un LoRA a répondu « Size EU 41 is 26.0cm » à « I wear a 42 ». Personne ne l'avait
// vu : rien ne compare les épinglés aux bancs.
//
// Deux formes comparées, chiffres MASQUÉS (« I wear a # » = « I wear a # ») :
//   - les QUESTIONS des épinglés contre celles des bancs (sdk-rag, sdk-smalltalk, sdk-dialogue,
//     boutiques-banc.json) ;
//   - les LIGNES de fiche des épinglés contre celles des boutiques de banc (sdk-demo, boutiques-banc).
// Une contamination CONNUE et mesurée s'inscrit dans CONNUES avec sa raison ; toute autre fait échouer.
//   node scripts/test-contamination.mjs            (npm run test:contamination)
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const lire = (p) => readFileSync(join(ROOT, p), 'utf8');

const dir = mkdtempSync(join(tmpdir(), 'contamination-'));
writeFileSync(join(dir, 'e.ts'), `export { makeSystemBuilder } from ${JSON.stringify(join(ROOT, 'src/sdk/prompting.ts'))};`);
await build({ entryPoints: [join(dir, 'e.ts')], bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'e.mjs'), logLevel: 'error' });
const { makeSystemBuilder } = await import(pathToFileURL(join(dir, 'e.mjs')).href);

// Gabarit : minuscules, chiffres masqués, ponctuation et espaces écrasés.
const gabarit = (s) => s.toLowerCase().replace(/\d+(?:[.,]\d+)?/g, '#').replace(/[^\p{L}#]+/gu, ' ').trim();

// ── Les épinglés, composés par le SDK lui-même ──
const epQuestions = new Map(), epLignes = new Map();
for (const lang of ['en', 'fr']) {
  for (const m of makeSystemBuilder({ lang, knowledge: [{ title: 'x', text: 'x' }] }).pinned) {
    if (m.role !== 'user') continue;
    const q = m.content.match(/Question:\s*(.+)\s*$/);
    if (q) epQuestions.set(gabarit(q[1]), q[1]);
    for (const l of m.content.split('\n')) if (/\d/.test(l) && !/^\s*\[\d+\]/.test(l)) epLignes.set(gabarit(l), l.trim());
  }
}

// ── Les bancs ──
const questions = []; // [source, texte]
for (const f of ['scripts/e2e/sdk-rag.mjs', 'scripts/e2e/sdk-smalltalk.mjs', 'scripts/e2e/sdk-dialogue.mjs']) {
  for (const m of lire(f).matchAll(/\bq:\s*(['"`])((?:(?!\1).)+)\1/g)) questions.push([f, m[2]]);
}
const lignes = [];
const demo = lire('public/sdk-demo.html').match(/const CONFIGS = (\{[\s\S]*?\n {4}\});/);
if (!demo) throw new Error('CONFIGS introuvable dans public/sdk-demo.html');
for (const [lang, cfg] of Object.entries(vm.runInNewContext(`(${demo[1]})`)))
  for (const k of cfg.knowledge || []) for (const l of k.text.split('\n')) lignes.push([`sdk-demo (${lang}) · ${k.title}`, l]);
for (const b of JSON.parse(lire('scripts/e2e/boutiques-banc.json')).boutiques) {
  for (const c of b.cas) questions.push([`boutiques-banc · ${b.name}`, c.q]);
  for (const k of b.knowledge) for (const l of k.text.split('\n')) lignes.push([`boutiques-banc · ${b.name} · ${k.title}`, l]);
}

// Contaminations connues, MESURÉES, laissées en place en connaissance de cause (clé = gabarit).
const CONNUES = {
  'i wear a # what is that in cm': 'boutique de chaussures de sdk-demo : exemples d’origine gardés, mesuré 2026-09-28 (ROADMAP § 22) — à trancher par sdk-multi.mjs',
  'je fais du # quelle taille en cm': 'idem, jeu français',
  'size eu # # cm us #': 'idem : gabarit de ligne du guide des tailles',
  'pointure eu # # cm us #': 'idem, jeu français',
  'how long do i have to return an item': 'idem : exemple « retours sous 14 jours » de même forme que la fiche retours de sdk-demo',
  'combien de temps pour retourner un article': 'idem, jeu français',
  // Trouvé PAR CE TEST à sa première exécution (2026-09-28) : le cas « refus hors fiches » de sdk-rag
  // et de sdk-dialogue pose la question de l'exemple épinglé MOT POUR MOT. Non mesuré ; sdk-multi.mjs
  // a ses propres refus (questions jamais épinglées).
  'who won the # world cup': 'refus hors fiches de sdk-rag/sdk-dialogue = épinglé mot pour mot — NON MESURÉ',
  'qui a gagné la coupe du monde #': 'idem, jeu français — NON MESURÉ',
};

let echecs = 0, connues = 0;
const verifier = (quoi, liste, ref) => {
  for (const [src, txt] of liste) {
    const g = gabarit(txt);
    if (!ref.has(g)) continue;
    if (CONNUES[g]) { connues++; console.log(`  connu   ${quoi} « ${txt} » (${src}) — ${CONNUES[g]}`); }
    else { echecs++; console.log(`  ✗ ${quoi} « ${txt} » (${src}) = épinglé « ${ref.get(g)} »`); }
  }
};
verifier('question', questions, epQuestions);
verifier('ligne', lignes, epLignes);
console.log(`${questions.length} questions et ${lignes.length} lignes de fiche de banc comparées à ${epQuestions.size} questions et ${epLignes.size} lignes épinglées : ${echecs} contamination(s) nouvelle(s), ${connues} connue(s)`);
process.exit(echecs ? 1 : 0);
