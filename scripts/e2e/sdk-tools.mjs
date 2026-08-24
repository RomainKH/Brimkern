// LE MODÈLE SE SERT-IL DES RÉSULTATS D'OUTILS ? — le juge du chemin outils du SDK (0.2.0).
//
// La mécanique est testée hors navigateur (test:tools) : détection, exécution, garde-fous. Ce qui
// manque, c'est la mesure de ce que le MODÈLE fait du bloc injecté — la même distinction que
// test:knowledge / sdk-rag.mjs. Un 230M est notoirement mauvais en arithmétique : ce banc vérifie
// qu'avec l'outil 'calc' il rend le chiffre EXACT, et que déclarer des outils ne casse pas le
// contrat RAG (refus hors fiches) quand aucun outil ne se déclenche.
//
// Prérequis : build de PRODUCTION sur le port 3618 + npm run build:sdk.
// Usage : node scripts/e2e/sdk-tools.mjs [tours]
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const TOURS = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 1);
// Le modèle de la démo : déjà en cache dans ce profil (partagé avec sdk-rag.mjs), donc le banc ne
// retélécharge rien.
const MODELE = 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1280, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/Erreur|error/i.test(t) && !/favicon|insights/.test(t)) console.log('    ·', t.slice(0, 140)); });

await page.goto(`http://localhost:3618/sdk-demo?lang=en&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !!window.Brimkern);

// Chaque cas crée SA session (une config d'outils différente à chaque fois) : le moteur, lui, est
// un singleton par URL de modèle — seul le premier tour paie le chargement (cache local).
// `attendu` : la réponse doit matcher. `interdit` : elle ne doit pas.
const annee = String(new Date().getFullYear());
const CAS = [
  {
    note: 'calc : le chiffre exact, pas une hallucination',
    cfg: { tools: ['calc'] },
    q: 'What is 127*9?',
    attendu: /1[\s  ]?143/, // un 230M sans outil ne trouve pas 1143 ; avec le bloc, il le recopie
  },
  {
    note: 'date : le modèle connaît l’année en cours',
    cfg: { tools: ['date'] },
    q: 'What year is it?',
    attendu: new RegExp(annee),
  },
  {
    note: 'outil custom : le fait fourni par la page arrive dans la réponse',
    // 'custom-stock' est un MARQUEUR : une fonction ne traverse pas evaluate(), l'outil réel est
    // reconstruit côté page (voir plus bas).
    cfg: { tools: ['custom-stock'] },
    q: 'How many units do you have in stock?',
    attendu: /\b7\b/,
  },
  {
    note: 'outils déclarés + fiches : le refus hors fiches TIENT quand aucun outil ne se déclenche',
    cfg: { tools: ['calc'], knowledge: [{ title: 'Shipping', text: 'Free shipping in France from 50 euros.' }] },
    q: 'Who won the 1998 World Cup?',
    attendu: /do\s*not\s*have|don’t\s*have|don't\s*have|no\s*information/i,
  },
  {
    note: 'outil + fiches sans rapport : le calcul GAGNE sur la consigne de refus',
    cfg: { tools: ['calc'], knowledge: [{ title: 'Shipping', text: 'Free shipping in France from 50 euros.' }] },
    q: 'What is 127*9?',
    attendu: /1[\s  ]?143/,
    interdit: /do\s*not\s*have|don’t\s*have|don't\s*have/i,
  },
];

let total = 0, reussis = 0;
for (let tour = 1; tour <= TOURS; tour++) {
  if (TOURS > 1) console.log(`\n──── tour ${tour}/${TOURS} ────`);
  for (const cas of CAS) {
    total++;
    const t0 = Date.now();
    const r = await page.evaluate(async ({ cfg, q, model }) => {
      // Les fonctions ne traversent pas evaluate() : le marqueur 'custom-stock' est remplacé ICI,
      // côté page, par le vrai ToolSpec.
      const tools = (cfg.tools || []).map((t) =>
        t === 'custom-stock' ? { name: 'stock', match: /stock/i, run: () => '7 units in stock' } : t);
      const outils = [];
      const s = window.Brimkern.createSession({ ...cfg, tools, model, lang: 'en' });
      s.on('tool', (n) => outils.push(`${n.name}=${n.result}`));
      try {
        const texte = await s.ask(q);
        return { texte, outils };
      } catch (e) {
        return { texte: `ERREUR : ${e && e.message}`, outils };
      } finally { s.destroy(); }
    }, { cfg: cas.cfg, q: cas.q, model: MODELE });
    const ok = cas.attendu.test(r.texte) && !(cas.interdit && cas.interdit.test(r.texte));
    if (ok) reussis++;
    console.log(`  ${ok ? 'ok   ' : 'ÉCHEC'} ${cas.note}   ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    console.log(`        Q: ${cas.q}`);
    if (r.outils.length) console.log(`        T: ${r.outils.join(' · ')}`);
    console.log(`        R: ${r.texte.slice(0, 200)}`);
  }
}

console.log(`\n${reussis}/${total} cas passés`);
await ctx.close();
process.exit(reussis === total ? 0 : 1);
