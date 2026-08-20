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
// DEUX JEUX depuis le 2026-08-20 : la démo est bilingue (anglais canonique, français en /fr) et
// seul le français était mesuré. Or les deux langues ne se comportent PAS pareil — en anglais le
// modèle arrive avec une opinion arrêtée sur les pointures qui concurrence les fiches (c'est ce qui
// a fait retirer la colonne US du tableau anglais). Un jeu par langue, ou une régression sur une
// moitié de la démo passe inaperçue.
//
// ET LES SOURCES. Le banc lisait la réponse et rien d'autre : quand un cas échouait, il ne disait
// pas si la SÉLECTION avait pris la mauvaise fiche ou si le modèle avait mal lu la bonne — les deux
// pannes se ressemblent de l'extérieur, et c'est exactement la confusion du 2026-08-19. La
// traçabilité du SDK 0.1.3 (événement `message`, champ `sources`) permet de trancher : chaque cas
// peut déclarer la fiche ATTENDUE, et un échec dit maintenant lequel des deux maillons a lâché.
//
// Prérequis : build de PRODUCTION sur le port 3618 (npm run build && npx next start -p 3618).
// Le widget charge /sdk.js, donc `npm run build:sdk` suffit entre deux essais de prompt.
// Usage : node scripts/e2e/sdk-rag.mjs [nombre-de-tours] [--lang=fr|en|both] [--model=<url .brik>]
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const TOURS = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 1);
// `--model=<url .brik>` remplace le modèle de la page de démo SANS la modifier : on intercepte
// l'affectation de window.Brimkern avant que le script en ligne appelle embed(). C'est ce qui permet
// de comparer deux modèles sur exactement les mêmes six cas, la même base de fiches et le même prompt.
const MODELE = (process.argv.find((a) => a.startsWith('--model=')) || '').slice(8) || null;
// Le défaut RESTE le français : c'est le jeu de référence historique (6/6), et `node
// scripts/e2e/sdk-rag.mjs 2` doit continuer à mesurer exactement ce qu'il mesurait.
const LANG_ARG = (process.argv.find((a) => a.startsWith('--lang=')) || '').slice(7) || 'fr';
const LANGUES = LANG_ARG === 'both' ? ['fr', 'en'] : [LANG_ARG === 'en' ? 'en' : 'fr'];

// `attendu` : la réponse doit matcher. `interdit` : elle ne doit PAS matcher (confusion typique).
// `fiche` : le titre de la fiche qui DOIT avoir été sélectionnée (facultatif — inutile sur une
// salutation ou un hors-sujet, où la bonne sélection est l'absence de sélection).
const CAS_FR = [
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
CAS_FR[0].fiche = /Tailles/i;
CAS_FR[1].fiche = /Retour/i;
CAS_FR[2].fiche = /Retour/i;
CAS_FR[3].fiche = /Livraison/i;

// Les MÊMES six opérations sur la boutique anglaise. Les formulations ne sont pas des traductions
// mot à mot : « from what amount is shipping free » est retenu parce que « what is the minimum
// order for free shipping » échouait là où celle-ci passait (mesuré, 2026-08-20). Un banc mesure ce
// qu'un visiteur écrit, et on n'a pas le luxe de choisir ses tournures sur un modèle de 230 M.
const CAS_EN = [
  { q: 'I wear a 42, what is that in cm?', attendu: /\b27([.,]0)?\b/, interdit: /25[.,]5|26[.,]0|27[.,]5|28[.,]5/, fiche: /Size/i, note: 'lecture d’une ligne de tableau' },
  // Même piège qu'en français : le délai de REMBOURSEMENT (5 jours) attribué au retour (30 jours).
  { q: 'How long do I have to return an item?', attendu: /30\s*days/i, interdit: /(?:return|send\s*back)[^.]{0,60}\b5\s*days|\b5\s*days[^.]{0,30}(?:return|send\s*back)/i, fiche: /Returns/i, note: 'deux nombres dans la même fiche' },
  { q: 'Are returns free?', attendu: /free/i, interdit: /do\s*not\s*have|don’t\s*have|don't\s*have/i, fiche: /Returns/i, note: 'fait simple' },
  { q: 'From what amount is shipping free?', attendu: /(?:€|EUR)\s*50|50\s*(?:€|EUR|euros)/i, interdit: /7[.,]90/, fiche: /Shipping/i, note: 'deux montants dans la même fiche' },
  { q: 'Hello!', attendu: /\S/, interdit: /do\s*not\s*have|don’t\s*have|don't\s*have|no\s*information/i, note: 'salutation, ne doit pas refuser' },
  { q: 'Who won the 1998 World Cup?', attendu: /do\s*not\s*have|don’t\s*have|don't\s*have|no\s*information/i, note: 'hors fiches, doit refuser' },
];

const JEUX = { fr: CAS_FR, en: CAS_EN };

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1280, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/Erreur|error/i.test(t) && !/favicon|insights/.test(t)) console.log('    ·', t.slice(0, 140)); });

// Un SEUL script d'initialisation, toujours posé, qui fait deux choses en interceptant
// l'affectation de window.Brimkern avant que le script en ligne de la démo appelle embed() :
//   1. remplacer le modèle si --model est passé (la page n'est pas modifiée) ;
//   2. s'abonner aux événements du widget — c'est la poignée rendue par embed() (SDK 0.1.3) qui
//      rend ça possible, et le banc devient ainsi le premier client de sa propre traçabilité.
// Si le SDK servi est antérieur à 0.1.3, embed() rend `undefined` : on n'appelle `.on` que s'il
// existe, et le banc retombe simplement sur son ancien comportement (réponse seule).
await page.addInitScript((url) => {
  let vrai;
  Object.defineProperty(window, 'Brimkern', {
    configurable: true,
    get: () => vrai,
    set: (api) => {
      if (!api || typeof api.embed !== 'function') { vrai = api; return; }
      vrai = {
        ...api,
        embed: (cfg) => {
          const w = api.embed(url ? { ...cfg, model: url } : cfg);
          if (w && typeof w.on === 'function') {
            w.on('message', (m) => {
              if (m.role !== 'assistant') return;
              window.__BK_SOURCES = (m.sources || []).map((s) => ({ title: s.title, score: s.score }));
            });
          }
          return w;
        },
      };
    },
  });
}, MODELE);
console.log(MODELE ? `modèle forcé : ${MODELE}` : 'modèle : celui de la page (défaut hébergé)');

async function ouvrirLaDemo(lang) {
  // La langue est EXPLICITE dans l'URL : la démo est passée à l'anglais par défaut le 2026-08-20
  // (/sdk-demo = anglais canonique, /fr/sdk-demo = français). Sans ce paramètre, le jeu français
  // mesurerait la boutique anglaise avec des regex françaises.
  await page.goto(`http://localhost:3618/sdk-demo?lang=${lang}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  // Ouvrir le widget déclenche le chargement du modèle (partagé, ~149 Mo, servi du cache ensuite).
  await page.click('.bk-fab');
  // Attendre la DISPARITION de la bulle de statut… ou son passage en erreur. Sans le second cas, un
  // modèle qui refuse de charger faisait patienter le banc jusqu'au bout du délai (900 s) au lieu de
  // dire pourquoi — la bulle reste affichée, elle contient juste « Erreur : … ».
  const issue = await page.waitForFunction(() => {
    const s = document.querySelector('.bk-status');
    if (s && /erreur|error/i.test(s.textContent || '')) return { erreur: s.textContent.slice(0, 300) };
    return (!s && !!document.querySelector('.bk-in')) ? { pret: true } : null;
  }, null, { timeout: 900_000, polling: 1000 }).then((h) => h.jsonValue());
  if (issue.erreur) {
    console.log(`ÉCHEC de chargement : ${issue.erreur}`);
    await ctx.close();
    process.exit(2);
  }
}

async function demander(q) {
  const avant = await page.evaluate(() => (window.__BK_SOURCES = null, document.querySelectorAll('.bk-a').length));
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
  // `undefined` (SDK sans traçabilité) et `[]` (aucune fiche retenue) sont deux choses différentes :
  // le second est une information, le premier une absence de mesure. On les distingue.
  const sources = await page.evaluate(() => window.__BK_SOURCES);
  return { texte: texte.trim(), ms: Date.now() - t0, sources };
}

let total = 0, reussis = 0;
for (const lang of LANGUES) {
  const CAS = JEUX[lang];
  if (LANGUES.length > 1) console.log(`\n════ ${lang.toUpperCase()} ════`);
  await ouvrirLaDemo(lang);
  console.log('modèle prêt.\n');
  for (let tour = 0; tour < TOURS; tour++) {
    if (TOURS > 1) console.log(`── tour ${tour + 1} ──`);
    for (const cas of CAS) {
      const { texte, ms, sources } = await demander(cas.q);
      const titres = sources ? sources.map((s) => s.title || '(sans titre)') : null;
      // La fiche attendue est vérifiée SÉPARÉMENT de la réponse : les deux maillons peuvent lâcher
      // indépendamment, et un banc qui les confond envoie chercher le défaut au mauvais endroit.
      const bonneFiche = !cas.fiche || !titres || titres.some((t) => cas.fiche.test(t));
      const bonTexte = cas.attendu.test(texte) && !(cas.interdit && cas.interdit.test(texte));
      const ok = bonTexte && bonneFiche;
      total++; if (ok) reussis++;
      const pourquoi = !bonneFiche ? `mauvaise fiche sélectionnée` : !cas.attendu.test(texte) ? 'attendu absent' : 'contient un élément interdit';
      console.log(`  ${ok ? 'ok   ' : 'ÉCHEC'} ${cas.note.padEnd(34)} ${(ms / 1000).toFixed(1)}s`);
      console.log(`        Q: ${cas.q}`);
      if (titres) console.log(`        F: ${titres.length ? titres.join(' · ') : '(aucune fiche)'}`);
      console.log(`        R: ${texte.replace(/\s+/g, ' ').slice(0, 200)}${ok ? '' : `   ← ${pourquoi}`}`);
    }
  }
}
console.log(`\n${reussis}/${total} cas passés`);
await ctx.close();
process.exit(reussis === total ? 0 : 1);
