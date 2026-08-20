// LA SURFACE PUBLIQUE DU SDK TIENT-ELLE SES PROMESSES ? — le juge de l'API, pas du modèle.
//
// Ce banc existe parce que le seul harnais navigateur du SDK (sdk-rag.mjs) télécharge 149 Mo de
// poids et mesure la QUALITÉ des réponses : il ne peut pas se lancer à chaque modification d'API, et
// il ne dit rien de ce qui n'a pas besoin du modèle. Or c'est exactement là que le SDK 0.1.3 ajoute
// sa matière : une poignée qui démonte, des événements, un historique injectable, des fiches
// remplaçables à chaud. Tout ça se vérifie dans un vrai navigateur en une seconde, sans un octet de
// modèle — et une régression dessus est silencieuse (un widget qui ne se démonte plus ne « plante »
// pas, il fuit).
//
// Prérequis : le site servi sur le port 3618 (`npx next dev -p 3618` suffit) et `npm run build:sdk`.
// Le cache HTTP est coupé via CDP : sans ça, le profil persistant resserre un /sdk.js périmé et la
// mesure porte sur du code qui n'est plus celui du dépôt.
// Usage : node scripts/e2e/sdk-api.mjs
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile-api', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'] },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
await (await ctx.newCDPSession(page)).send('Network.setCacheDisabled', { cacheDisabled: true });
page.on('pageerror', (e) => console.log('  · page:', String(e).slice(0, 200)));

// La démo sert de porteuse : elle charge /sdk.js et monte DÉJÀ un widget — ce qui permet en prime de
// vérifier qu'un second embed() cohabite avec le premier sans lui voler sa couleur.
await page.goto(`http://localhost:3618/sdk-demo?lang=en&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !!window.Brimkern && !!document.querySelector('.bk-fab'));

const res = await page.evaluate(async () => {
  const out = [];
  const t = (nom, cond, detail = '') => out.push({ nom, ok: !!cond, detail: String(detail) });

  // ── La poignée : ce que embed() ne rendait pas ─────────────────────────────────────────────────
  const w = Brimkern.embed({ title: 'T2', accent: '#0000ff', lang: 'en', greeting: 'G2' });
  t('embed() rend un objet', w && typeof w === 'object', typeof w);
  for (const m of ['open', 'close', 'toggle', 'ask', 'destroy', 'setKnowledge', 'setHistory', 'on'])
    t(`poignée.${m}()`, typeof w[m] === 'function', typeof w[m]);
  t('poignée.el est le panneau', w.el && w.el.classList.contains('bk-panel'), w.el && w.el.className);
  t('poignée.history reflète le greeting', w.history.length === 1 && w.history[0].content === 'G2', JSON.stringify(w.history));

  // ── Deux widgets, deux accents. La feuille de style est partagée (un seul #bk-style pour la
  // page) : quand l'accent y était interpolé, le second widget héritait en silence du premier.
  const fabs = [...document.querySelectorAll('.bk-fab')];
  t('2 widgets montés côte à côte', fabs.length === 2, fabs.length);
  const couleurs = fabs.map((f) => getComputedStyle(f).backgroundColor);
  t('accents DISTINCTS', couleurs[0] !== couleurs[1], couleurs.join(' / '));
  t('accent du 2e widget = celui demandé', couleurs[1] === 'rgb(0, 0, 255)', couleurs[1]);
  // La propriété est posée sur le panneau : elle doit DESCENDRE sur ses enfants (pastille du titre,
  // bulles du visiteur, bouton d'envoi). C'est ce que la feuille partagée ne pouvait pas faire.
  const pastille = getComputedStyle(w.el.querySelector('.bk-dot')).backgroundColor;
  t('l’accent descend dans le panneau', pastille === 'rgb(0, 0, 255)', pastille);

  // ── Événements et désabonnement ────────────────────────────────────────────────────────────────
  const vus = [];
  w.on('open', () => vus.push('open'));
  const desabo = w.on('close', () => vus.push('close'));
  w.open(); w.close();
  t('événements open/close émis', vus.join(',') === 'open,close', vus.join(','));
  t('open() puis close() laissent le panneau fermé', !w.el.classList.contains('bk-open'));
  desabo(); w.open(); w.close();
  t('la fonction rendue par on() désabonne', vus.filter((v) => v === 'close').length === 1, vus.join(','));

  // ── Reprise de conversation ────────────────────────────────────────────────────────────────────
  w.setHistory([
    { role: 'user', content: 'Q1' },
    { role: 'assistant', content: 'R1' },
    { role: 'inconnu', content: 'jetable' },   // rôle invalide
    { role: 'user', content: '   ' },          // contenu vide
  ]);
  const bulles = [...w.el.querySelectorAll('.bk-m')].map((b) => b.textContent);
  t('setHistory rend le fil, jette les tours invalides', bulles.join('|') === 'Q1|R1', bulles.join('|'));
  t('history() suit setHistory', w.history.length === 2, JSON.stringify(w.history));

  // ── Démontage ──────────────────────────────────────────────────────────────────────────────────
  w.destroy();
  t('destroy() retire le DOM du widget', document.querySelectorAll('.bk-fab').length === 1 && !document.body.contains(w.el));
  t('destroy() est idempotent', (() => { try { w.destroy(); return true; } catch { return false; } })());
  let rejet = null;
  await w.ask('hello').catch((e) => { rejet = e.message; });
  t('ask() après destroy() rejette au lieu de rester en attente', /démonté/.test(rejet || ''), rejet);

  // ── L'accueil ne se superpose PAS à une conversation reprise ───────────────────────────────────
  const w3 = Brimkern.embed({ lang: 'en', greeting: 'IGNORE-MOI', history: [{ role: 'user', content: 'H1' }] });
  const b3 = [...w3.el.querySelectorAll('.bk-m')].map((b) => b.textContent);
  t('history fourni → greeting ignoré', b3.join('|') === 'H1', b3.join('|'));
  w3.destroy();

  // ── La session programmatique ──────────────────────────────────────────────────────────────────
  const s = Brimkern.createSession({
    system: 'You are a bot.',
    knowledge: 'Shipping is free from 50 euros.',
    history: [{ role: 'user', content: 'hello' }],
  });
  for (const m of ['ask', 'reset', 'destroy', 'setHistory', 'setKnowledge', 'on'])
    t(`session.${m}()`, typeof s[m] === 'function', typeof s[m]);
  t('session.history injecté à la création', s.history.length === 1, JSON.stringify(s.history));
  t('session.lastSources vide avant tout tour', Array.isArray(s.lastSources) && s.lastSources.length === 0);
  s.setKnowledge([{ title: 'Autre', text: 'Returns within 30 days.' }]);
  s.setHistory([]);
  t('setKnowledge/setHistory ne lèvent pas hors génération', s.history.length === 0);
  s.destroy();

  // ── Le code de l'hôte n'est pas notre code : un écouteur qui lève ne casse rien ────────────────
  const w4 = Brimkern.embed({ lang: 'en' });
  const ordre = [];
  w4.on('open', () => { throw new Error('boum'); });
  w4.on('open', () => ordre.push('second'));
  w4.open();
  t('un écouteur qui lève n’interrompt pas les suivants', ordre.join(',') === 'second', ordre.join(','));
  w4.destroy();

  return out;
});

let ko = 0;
for (const r of res) {
  if (!r.ok) ko++;
  console.log(`  ${r.ok ? 'ok   ' : 'ÉCHEC'} ${r.nom}${r.ok ? '' : `   ← ${r.detail}`}`);
}
console.log(`\n${res.length - ko}/${res.length} vérifications`);
await ctx.close();
process.exit(ko ? 1 : 0);
