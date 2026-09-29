// LE MODÈLE LIT-IL LES FICHES D'UNE BOUTIQUE QU'IL N'A JAMAIS VUE ? — banc multi-domaines.
//
// Pourquoi (2026-09-28) : sdk-rag et sdk-smalltalk ne jouent QU'UNE boutique, celle de
// public/sdk-demo.html (des chaussures), et les exemples épinglés du SDK sont un guide de pointures
// dont la question est celle du banc à un chiffre près. Remplacés par des exemples de même forme
// dans un autre domaine, sdk-rag passait de 12/12 à 10/12 · 9/12 — aide réelle ou réponse soufflée,
// un banc à une boutique ne peut pas le dire. Et un LoRA qui recopiait l'exemple (« Size EU 41 is
// 26.0cm ») passait à côté d'un modèle qui lit.
// Ici : 5 boutiques de 5 domaines (scripts/e2e/boutiques-banc.json, 3 EN + 2 FR), jamais
// entraînées, 30 questions AUTONOMES — une session neuve par question (API createSession, même
// composition du tour que le widget), donc aucun cas ne dépend d'un autre.
//
// Notation automatique, sans juge (reproductible, gratuite) :
//   fait / tableau : TOUS les chiffres attendus présents, AUCUN chiffre inventé ;
//   refus / hors-tableau : aucun chiffre inventé ET une formule de « je n'ai pas cette information ».
// « Inventé » = absent des fiches de la boutique ET de la question. Un chiffre qui n'existe que dans
// les exemples épinglés est signalé à part : COPIE D'ÉPINGLÉ.
//
// Prérequis : le site sur le port 3618 (build de prod) et `npm run build:sdk`.
// Usage : node scripts/e2e/sdk-multi.mjs [tours] [--model=<url .brik|.gguf>] [--only=<seed>]
import { chromium } from 'playwright-core';
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CHROME as EXE } from './chrome.mjs';

const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').slice(k.length + 3);
const TOURS = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 1);
const MODELE = arg('model') || null;
const SEUL = arg('only') ? Number(arg('only')) : null;
const { boutiques } = JSON.parse(readFileSync(new URL('./boutiques-banc.json', import.meta.url), 'utf8'));

const nombres = (s) => (s.replace(/,(\d)/g, '.$1').match(/\d+(?:\.\d+)?/g) || []);
// Les chiffres des exemples épinglés, composés par le code du SDK lui-même (src/sdk/prompting.ts,
// comme scripts/train/render.mjs) — une copie ici dériverait le jour où ils changent. ⚠️ C'est le
// SOURCE : `npm run build:sdk` avant le banc, sinon le bundle servi peut en porter d'autres.
const dir = mkdtempSync(join(tmpdir(), 'sdk-multi-'));
writeFileSync(join(dir, 'e.ts'), `export { makeSystemBuilder } from ${JSON.stringify(new URL('../../src/sdk/prompting.ts', import.meta.url).pathname)};`);
await build({ entryPoints: [join(dir, 'e.ts')], bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'e.mjs'), logLevel: 'error' });
const { makeSystemBuilder } = await import(pathToFileURL(join(dir, 'e.mjs')).href);
const epingles = new Set(['en', 'fr'].flatMap((lang) => makeSystemBuilder({ lang, knowledge: [{ title: 'x', text: 'x' }] }).pinned
  .flatMap((m) => nombres(m.content))));
// « Je ne suis pas capable de vous fournir… » est un refus (faux négatif du premier passage).
const REFUS = /\b(?:don['’]?t|do not|doesn['’]?t|not (?:sure|able)|unable|can['’]?t|cannot|no information|not have|n['’]?ai pas|pas cette information|ne dispose|je ne sais pas|aucune information|pas (?:capable|en mesure)|ne peux pas)\b/i;

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1280, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
await page.goto(`http://localhost:3618/sdk-demo?v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.Brimkern?.createSession === 'function', null, { timeout: 60_000 });

console.log(`modèle : ${MODELE || 'défaut du SDK'} · ${boutiques.length} boutiques · chiffres épinglés repérés : ${[...epingles].join(' ') || 'aucun'}`);

async function demander(b, q) {
  return page.evaluate(async ({ b, q, modele }) => {
    const s = window.Brimkern.createSession({
      system: b.system, knowledge: b.knowledge, lang: b.lang,
      history: b.greeting ? [{ role: 'assistant', content: b.greeting }] : [],
      ...(modele ? { model: modele } : {}),
    });
    try { return await s.ask(q); } finally { s.destroy(); }
  }, { b, q, modele: MODELE });
}

const parType = {}, parBoutique = {};
let ok = 0, total = 0, copies = 0;
for (let tour = 0; tour < TOURS; tour++) {
  for (const b of boutiques) {
    if (SEUL !== null && b.seed !== SEUL) continue;
    console.log(`── tour ${tour + 1}/${TOURS} · ${b.name} (${b.domain}, ${b.lang}) ──`);
    const vus = new Set(nombres(b.knowledge.map((k) => `${k.title} ${k.text}`).join('\n') + '\n' + b.system));
    for (const c of b.cas) {
      const t0 = Date.now();
      const r = (await demander(b, c.q)).trim();
      const ns = nombres(r).filter((n) => !nombres(c.q).includes(n));
      const inventes = ns.filter((n) => !vus.has(n));
      const copie = inventes.filter((n) => epingles.has(n));
      const manquants = c.attendus.filter((n) => !nombres(r).includes(n));
      const passe = (c.type === 'fait' || c.type === 'tableau')
        ? !manquants.length && !inventes.length
        : !inventes.length && REFUS.test(r);
      total++; if (passe) ok++; if (copie.length) copies++;
      (parType[c.type] ??= [0, 0])[1]++; if (passe) parType[c.type][0]++;
      (parBoutique[b.name] ??= [0, 0])[1]++; if (passe) parBoutique[b.name][0]++;
      const pourquoi = passe ? '' : [
        manquants.length && `manque ${manquants.join(',')}`,
        inventes.length && `inventé ${inventes.join(',')}`,
        copie.length && 'COPIE D’ÉPINGLÉ',
        !(c.type === 'fait' || c.type === 'tableau') && !REFUS.test(r) && 'pas de refus',
      ].filter(Boolean).join(' · ');
      console.log(`  ${passe ? 'OK   ' : 'ÉCHEC'} ${c.type.padEnd(12)} ${((Date.now() - t0) / 1000).toFixed(1)}s  Q: ${c.q}`);
      console.log(`        R: ${r.replace(/\s+/g, ' ').slice(0, 170)}${pourquoi ? `   ← ${pourquoi}` : ''}`);
    }
  }
}
const fmt = (o) => Object.entries(o).map(([k, [a, n]]) => `${k} ${a}/${n}`).join(' · ');
console.log(`\npar type : ${fmt(parType)}`);
console.log(`par boutique : ${fmt(parBoutique)}`);
console.log(`BILAN ${MODELE || 'défaut'} : ${ok}/${total} · copies d'épinglé ${copies}`);
await ctx.close();
