// LE WIDGET RÉPOND-IL DEPUIS SES FICHES ? — le juge du chemin RAG du SDK.
//
// Pourquoi ce banc existe : la sélection des passages est testée hors navigateur (test:knowledge),
// et elle marche. Ce qui manquait, c'est la mesure de ce que le MODÈLE fait du bloc qu'on lui
// donne. Le 2026-08-19, le widget de /sdk-demo recevait bien « Pointure EU 42 : 27.0 cm » et
// répondait « Le 42 est une taille en cm » : la recherche était bonne, le prompt ne l'était pas.
// Un prompt pour un modèle de 230 M ne se raisonne pas, il se mesure — d'où ce harnais.
//
// Chaque cas porte un motif de VALIDATION (ce que la réponse doit contenir) et, souvent, un motif
// d'ÉCHEC (ce qu'elle ne doit pas contenir : un nombre pris dans la mauvaise phrase de la fiche).
//
// Prérequis : build de PRODUCTION sur le port 3618 (npm run build && npx next start -p 3618).
// Le widget charge /sdk.js, donc `npm run build:sdk` suffit entre deux essais de prompt.
// Usage : node scripts/e2e/sdk-rag.mjs [nombre-de-tours]
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const TOURS = Number(process.argv[2] ?? 1);

// `attendu` : la réponse doit matcher. `interdit` : elle ne doit PAS matcher (confusion typique).
const CAS = [
  { q: 'Je fais du 42, quelle taille en cm ?', attendu: /\b27([.,]0)?\b/, interdit: /25[.,]5|26[.,]0|27[.,]5|28[.,]5/, note: 'lecture d’une ligne de tableau' },
  // L'erreur à attraper est d'attribuer le délai de REMBOURSEMENT au retour. Citer en plus « le
  // remboursement est effectué sous 5 jours ouvrés » est juste, donc l'interdit ne porte que sur les
  // 5 jours rattachés au retour dans la MÊME phrase (le point ferme la classe de caractères).
  { q: 'Combien de temps pour retourner un article ?', attendu: /30\s*jours/i, interdit: /(?:retourn|renvoy)[^.]{0,60}\b5\s*jours|\b5\s*jours[^.]{0,30}(?:retourner|renvoyer)/i, note: 'deux nombres dans la même fiche' },
  { q: 'Les retours sont-ils gratuits ?', attendu: /gratuit/i, note: 'fait simple' },
  { q: 'La livraison est gratuite à partir de combien ?', attendu: /50\s*€|50\s*euros/i, interdit: /7[.,]90/, note: 'deux montants dans la même fiche' },
  // Sur une salutation, l'exigence est de NE PAS refuser — pas de produire une formule précise :
  // le bavardage d'un modèle de 230 M varie d'un tir à l'autre (« Merci de votre réception » vu une
  // fois sur quatre). Exiger un « bonjour » ferait échouer le banc sur une réponse acceptable.
  { q: 'Bonjour !', attendu: /\S/, interdit: /pas cette information|n’ai pas|n'ai pas|ne (?:sais|dispose)/i, note: 'salutation, ne doit pas refuser' },
  { q: 'Qui a gagné la Coupe du monde 1998 ?', attendu: /pas cette information|n’ai pas|n'ai pas|ne (?:sais|dispose)/i, note: 'hors fiches, doit refuser' },
];

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1280, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/Erreur|error/i.test(t) && !/favicon|insights/.test(t)) console.log('    ·', t.slice(0, 140)); });

await page.goto(`http://localhost:3618/sdk-demo?v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
// Ouvrir le widget déclenche le chargement du modèle (partagé, ~149 Mo, servi du cache ensuite).
await page.click('.bk-fab');
await page.waitForFunction(() => {
  const s = document.querySelector('.bk-status');
  return !s && !!document.querySelector('.bk-in');
}, null, { timeout: 900_000, polling: 1000 });
console.log('modèle prêt.\n');

async function demander(q) {
  const avant = await page.evaluate(() => document.querySelectorAll('.bk-a').length);
  await page.fill('.bk-in', q);
  await page.click('.bk-send');
  const t0 = Date.now();
  let texte = '', stable = 0;
  for (let w = 0; w < 600; w++) {
    await page.waitForTimeout(400);
    const txt = await page.evaluate((n) => {
      const b = [...document.querySelectorAll('.bk-a')];
      return b.length <= n ? '' : (b[b.length - 1].textContent ?? '');
    }, avant);
    if (txt === texte && texte && texte !== '…') { if (++stable >= 5) break; } else stable = 0;
    texte = txt;
  }
  return { texte: texte.trim(), ms: Date.now() - t0 };
}

let total = 0, reussis = 0;
for (let tour = 0; tour < TOURS; tour++) {
  if (TOURS > 1) console.log(`── tour ${tour + 1} ──`);
  for (const cas of CAS) {
    const { texte, ms } = await demander(cas.q);
    const ok = cas.attendu.test(texte) && !(cas.interdit && cas.interdit.test(texte));
    total++; if (ok) reussis++;
    const pourquoi = !cas.attendu.test(texte) ? 'attendu absent' : 'contient un élément interdit';
    console.log(`  ${ok ? 'ok   ' : 'ÉCHEC'} ${cas.note.padEnd(34)} ${(ms / 1000).toFixed(1)}s`);
    console.log(`        Q: ${cas.q}`);
    console.log(`        R: ${texte.replace(/\s+/g, ' ').slice(0, 200)}${ok ? '' : `   ← ${pourquoi}`}`);
  }
}
console.log(`\n${reussis}/${total} cas passés`);
await ctx.close();
process.exit(reussis === total ? 0 : 1);
