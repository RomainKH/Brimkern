// LE WIDGET SAIT-IL ENCORE PARLER QUAND SES FICHES NE RÉPONDENT PAS ? — le juge du dialogue.
//
// Signalé par Romain, transcription réelle sur /sdk-demo : après une bonne réponse sourcée, TOUT le
// reste de la conversation est devenu un mur.
//
//   « are you for real ? » → I do not have that information.
//   « are you ok ? »       → I do not have that information.
//   « ALLO ? »             → I do not have that information.
//   « HELP ME »            → I do not have that information.
//   « I DIE »              → I do not have that information.
//
// Cause : dès que la sélection ne retient aucun passage, le bloc injecté porte une consigne de REFUS
// (« Say that you do not have this information: do not guess »). Elle est juste pour une question de
// fait hors fiches — c'est même le cas 6 du banc RAG, qu'il faut préserver — et absurde pour « are
// you ok ? ». Le détecteur de salutations ne rattrape qu'une liste blanche (hi, hello, thanks…), donc
// tout le reste tombait dans le refus. Et un modèle de 230 M recopie ce qu'il vient d'écrire : trois
// refus dans l'historique et la conversation ne s'en relève plus, même sur « hello ».
//
// Ce banc rejoue la transcription DANS L'ORDRE, sur une seule conversation : l'effet de disque rayé
// ne se voit qu'en séquence. Il vérifie deux choses opposées, et c'est tout l'intérêt :
//   • un message conversationnel ne doit PAS recevoir le refus type ;
//   • une question de fait hors fiches doit TOUJOURS le recevoir.
//
// ⚠️ PLUSIEURS TOURS, et ce n'est pas du zèle : à 0,25 de température sur un 230 M, deux passes du
// MÊME code ont donné 10/11 puis 6/11. Une passe ne prouve rien ici, ni dans un sens ni dans l'autre.
// Chaque tour recharge la page pour repartir d'une conversation vierge (le modèle reste en cache).
//
// Prérequis : le site sur le port 3618 et `npm run build:sdk`.
// Usage : node scripts/e2e/sdk-dialogue.mjs [tours] [--lang=en|fr] [--model=<url .brik>]
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const LANG = (process.argv.find((a) => a.startsWith('--lang=')) || '').slice(7) === 'fr' ? 'fr' : 'en';
const TOURS = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 3);
// `--model=<url .brik>` : même mécanique que sdk-rag.mjs — on intercepte l'affectation de
// window.Brimkern pour surcharger le modèle du embed() de la page, sans modifier la page. C'est ce
// qui permet de juger le DIALOGUE d'un autre modèle (candidat widget) sur exactement les mêmes cas.
const MODELE = (process.argv.find((a) => a.startsWith('--model=')) || '').slice(8) || null;

// `refus` : la réponse ne doit PAS être un refus type. `exigeRefus` : elle doit l'être.
// Le motif inclut les PARAPHRASES DE LA CONSIGNE, pas seulement le refus canonique. Sans elles, le
// banc se félicitait de « I am not able to provide information about the store. » — le modèle
// recrachait la consigne qu'on venait de lui écrire, ce qui reste un mur pour le visiteur.
// Le motif décrit un refus DE RENSEIGNER, pas toute tournure négative : « I am not able to stop. »
// est une réponse conversationnelle acceptable à un « stop » sec, et un motif qui l'attrapait
// faisait échouer le banc sur une réponse correcte. Ce sont les verbes d'information qui comptent.
const REFUS_EN = /do\s*not\s*have|don.t\s*have|no\s*information|(?:can.t|cannot|not\s*able\s*to|unable\s*to)\s*(?:assist|provide|help\s*you\s*with\s*that|answer|access)|about\s*the\s*store/i;
const REFUS_FR = /pas cette information|n.ai pas cette|ne (?:sais|dispose)|pas en mesure|ne peux pas (?:vous )?(?:aider|fournir|renseigner)|sur la boutique/i;

// La phrase de repli du SDK, à l'identique (cf. LIBELLES.aide dans src/sdk/index.ts). Le produit
// remplace un refus injustifié par elle : le banc doit donc pouvoir la RECONNAÎTRE, sinon il se
// féliciterait de sa propre garantie. Un cas rattrapé par le filet compte comme un cas passé pour le
// VISITEUR — il ne voit plus de mur — mais il est signalé à part, parce que c'est la mesure honnête
// de ce que le modèle sait faire seul.
const REPLI = { en: 'I’m here to help — what would you like to know?', fr: 'Je suis là pour vous aider — que voulez-vous savoir ?' };

const JEUX = {
  en: {
    refus: REFUS_EN,
    cas: [
      { q: 'i need to know how the shoes fit', attendu: /true to size|half a size|fit/i, note: 'la vraie question, depuis les fiches' },
      { q: 'are you for real ?', note: 'méta : « es-tu réel ? »' },
      { q: 'are you ok ?', note: 'méta : « ça va ? »' },
      { q: 'hello', note: 'salutation APRÈS des refus (effet disque rayé)' },
      { q: 'ALLO ?', note: 'interpellation en majuscules' },
      { q: 'stop', note: 'ordre d’un mot' },
      { q: 'PLEASE', note: 'supplication' },
      { q: 'HELP ME', note: 'appel à l’aide' },
      { q: 'I DIE', note: 'détresse (hyperbole)' },
      { q: 'Who won the 1998 World Cup?', exigeRefus: true, note: 'question de FAIT hors fiches → doit refuser' },
      { q: 'are you ok ?', note: 'méta, après le refus légitime : la conversation se relève-t-elle ?' },
    ],
  },
  fr: {
    refus: REFUS_FR,
    cas: [
      { q: 'Comment taillent les chaussures ?', attendu: /normalement|demi-pointure|taille/i, note: 'la vraie question, depuis les fiches' },
      { q: 'tu es sérieux ?', note: 'méta' },
      { q: 'ça va ?', note: 'méta' },
      { q: 'bonjour', note: 'salutation APRÈS des refus' },
      { q: 'ALLO ?', note: 'interpellation en majuscules' },
      { q: 'stop', note: 'ordre d’un mot' },
      { q: 'S’IL VOUS PLAÎT', note: 'supplication' },
      { q: 'AIDEZ-MOI', note: 'appel à l’aide' },
      { q: 'JE MEURS', note: 'détresse (hyperbole)' },
      { q: 'Qui a gagné la Coupe du monde 1998 ?', exigeRefus: true, note: 'question de FAIT hors fiches → doit refuser' },
      { q: 'ça va ?', note: 'méta, après le refus légitime' },
    ],
  },
};

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1280, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();

// Surcharge du modèle AVANT que le script en ligne de la démo appelle embed() (cf. sdk-rag.mjs).
if (MODELE) {
  await page.addInitScript((url) => {
    let vrai;
    Object.defineProperty(window, 'Brimkern', {
      configurable: true,
      get: () => vrai,
      set: (api) => {
        vrai = (!api || typeof api.embed !== 'function') ? api : { ...api, embed: (cfg) => api.embed({ ...cfg, model: url }) };
      },
    });
  }, MODELE);
  console.log(`modèle forcé : ${MODELE}`);
}

async function ouvrir() {
  await page.goto(`http://localhost:3618/sdk-demo?lang=${LANG}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.click('.bk-fab');
  const issue = await page.waitForFunction(() => {
    const s = document.querySelector('.bk-status');
    if (s && /erreur|error/i.test(s.textContent || '')) return { erreur: s.textContent.slice(0, 300) };
    return (!s && !!document.querySelector('.bk-in')) ? { pret: true } : null;
  }, null, { timeout: 900_000, polling: 1000 }).then((h) => h.jsonValue());
  if (issue.erreur) { console.log(`ÉCHEC de chargement : ${issue.erreur}`); await ctx.close(); process.exit(2); }
}

async function demander(q) {
  const avant = await page.evaluate(() => document.querySelectorAll('.bk-a').length);
  await page.fill('.bk-in', q);
  await page.click('.bk-send');
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
  return texte.trim();
}

const { cas, refus } = JEUX[LANG];
// Par CAS et pas seulement en total : un cas qui échoue 3 fois sur 3 est un défaut, un cas qui
// échoue 1 fois sur 3 est la variance du modèle. Confondre les deux fait corriger le mauvais.
const bilan = cas.map(() => 0);
const filets = cas.map(() => 0);
let ok = 0, total = 0;
for (let tour = 0; tour < TOURS; tour++) {
  await ouvrir();
  console.log(`── tour ${tour + 1}/${TOURS} (jeu ${LANG.toUpperCase()}, transcription rejouée dans l'ordre) ──`);
  for (const [i, c] of cas.entries()) {
    const r = await demander(c.q);
    const estRefus = refus.test(r);
    const rattrape = r.trim() === REPLI[LANG];
    const bon = c.exigeRefus ? estRefus : (!estRefus && (!c.attendu || c.attendu.test(r)));
    total++; if (bon) { ok++; bilan[i]++; if (rattrape) filets[i]++; }
    const pourquoi = c.exigeRefus ? 'devait refuser et ne l’a pas fait'
      : estRefus ? 'REFUS TYPE sur un message conversationnel'
        : 'la réponse attendue n’y est pas';
    console.log(`  ${bon ? (rattrape ? 'ok(f)' : 'ok   ') : 'ÉCHEC'} ${c.note}`);
    console.log(`        Q: ${c.q}`);
    console.log(`        R: ${r.replace(/\s+/g, ' ').slice(0, 150)}${bon ? '' : `   ← ${pourquoi}`}`);
  }
}
console.log(`\n── par cas sur ${TOURS} tours (f = rattrapé par le filet du SDK) ──`);
for (const [i, c] of cas.entries()) {
  console.log(`  ${bilan[i]}/${TOURS}${filets[i] ? ` (dont ${filets[i]} f)` : '       '}  ${c.note}`);
}
const totalFilets = filets.reduce((a, b) => a + b, 0);
console.log(`\n${ok}/${total} cas passés — dont ${totalFilets} rattrapés par le filet, ${ok - totalFilets} obtenus par le modèle seul`);
await ctx.close();
process.exit(ok === total ? 0 : 1);
