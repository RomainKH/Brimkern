// LE SOMMAIRE DE LA DOC SUIT-IL LA LECTURE, SANS FAIRE DÉFILER DU VIDE ? — deux exigences qui
// s'opposent, et c'est pour ça que ce banc existe.
//
// Historique, parce qu'il explique la forme du test. (1) Les dernières sections d'une page ne
// devenaient JAMAIS actives : la règle veut que le titre franchisse une ligne de lecture au tiers
// haut de l'écran, et en fin de document il n'y a plus de défilement à leur donner. (2) Le correctif
// a été une CALE — réserver en bas exactement l'espace manquant — qui marchait et coûtait 583 px de
// vide à défiler après la fin du contenu sur /docs/sdk. Un défaut plus visible que celui qu'elle
// réparait. (3) La fin de document se traite maintenant dans la RÈGLE, et le filet « arrivé en bas,
// prendre la dernière section visible » est gardé par « le document défile-t-il vraiment ? » — sans
// ce garde-fou, une page trop courte pour défiler est en permanence « au bout » et surligne sa
// dernière section alors qu'on regarde la première.
//
// Les quatre assertions ci-dessous sont exactement ces trois pannes plus le cas nominal. Aucune ne
// se voit à l'œil sur une seule page : il faut le haut, le bas, le milieu, et une page courte.
//
// Prérequis : le site servi sur le port 3618 (`npx next dev -p 3618` suffit).
// Usage : node scripts/e2e/docs-toc.mjs
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const PORT = process.env.PORT || 3618;
const PAGES = ['/docs', '/docs/models', '/docs/sdk', '/docs/cli', '/docs/diagnostics', '/agents', '/extension', '/vs-webllm', '/changelog'];

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile-docs', import.meta.url).pathname,
  { executablePath: EXE, headless: true, viewport: { width: 1280, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
await (await ctx.newCDPSession(page)).send('Network.setCacheDisabled', { cacheDisabled: true });

// Le sommaire des SECTIONS, pas le menu des pages : ses liens sont des ancres.
const ACTIF = 'nav a.docs-side-link.active[href^="#"]';
const lireActif = () => page.evaluate((sel) => document.querySelector(sel)?.getAttribute('href') ?? null, ACTIF);
const ancres = () => page.evaluate(() => [...document.querySelectorAll('nav a.docs-side-link[href^="#"]')].map((a) => a.getAttribute('href')));

let ko = 0;
const t = (nom, ok, detail = '') => { if (!ok) ko++; console.log(`  ${ok ? 'ok   ' : 'ÉCHEC'} ${nom}${ok ? '' : `   ← ${detail}`}`); };

for (const u of PAGES) {
  console.log(`── ${u}`);
  await page.goto(`http://localhost:${PORT}${u}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const ids = await ancres();
  if (ids.length < 2) { console.log('  (pas de sommaire de sections)'); continue; }

  const defilable = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight > 4);

  // 1. En haut de page : la PREMIÈRE section. C'est le cas qu'un filet « en bas → la dernière »
  //    sans garde-fou casse sur une page courte.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  t('en haut → première section', (await lireActif()) === ids[0], `${await lireActif()} au lieu de ${ids[0]}`);

  if (!defilable) { console.log('  (page plus courte que la fenêtre : rien d’autre à mesurer)'); continue; }

  // 2. Un CLIC de sommaire surligne ce qu'on a cliqué — y compris quand la section visée ne peut
  //    pas atteindre la ligne de lecture faute de défilement restant (cas /docs/models).
  const cible = ids[Math.floor(ids.length / 2)];
  await page.click(`nav a.docs-side-link[href="${cible}"]`);
  await page.waitForTimeout(250);
  t(`clic sur ${cible} → surligné`, (await lireActif()) === cible, `${await lireActif()}`);
  const cibleVis = await page.evaluate((hash) => {
    const el = document.getElementById(hash.slice(1));
    const hdr = document.querySelector('.docs-header');
    return {
      top: Math.round(el?.getBoundingClientRect().top ?? -9999),
      hdrBottom: Math.round(hdr?.getBoundingClientRect().bottom ?? 0),
    };
  }, cible);
  t(`section ${cible} visible sous l’en-tête (${cibleVis.top} >= ${cibleVis.hdrBottom})`,
    cibleVis.top >= cibleVis.hdrBottom, `top=${cibleVis.top} px sous header=${cibleVis.hdrBottom} px`);

  // 3. Tout en bas : la DERNIÈRE section. C'est la panne d'origine.
  //    On laisse d'abord expirer l'épinglage du clic ci-dessus (700 ms), sinon on mesure encore le
  //    chapitre épinglé et non la position de lecture. Et on REMONTE avant de redescendre : sur une
  //    page qui défile peu, le clic précédent nous a déjà mis en bas, donc un scrollTo(bas) ne
  //    déclenche aucun événement — on mesurerait un surlignage que rien n'a réévalué.
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  t('tout en bas → dernière section', (await lireActif()) === ids[ids.length - 1], `${await lireActif()} au lieu de ${ids[ids.length - 1]}`);

  // 4. Le menu latéral (.docs-side) et l'en-tête (.docs-header) restent bien collés au défilement
  //    (une règle `overflow-x: hidden` sur .docs-page ou un ancêtre casse silencieusement sticky).
  const sticky = await page.evaluate(() => ({
    scrollY: window.scrollY,
    sideTop: Math.round(document.querySelector('.docs-side')?.getBoundingClientRect().top ?? -9999),
    headerTop: Math.round(document.querySelector('.docs-header')?.getBoundingClientRect().top ?? -9999),
  }));
  if (sticky.scrollY > 120) {
    t(`menu latéral sticky (top=${sticky.sideTop} px à scrollY=${Math.round(sticky.scrollY)})`,
      Math.abs(sticky.sideTop - 76) <= 2, `top=${sticky.sideTop} px au lieu de ~76 px`);
    t(`en-tête sticky (top=${sticky.headerTop} px)`,
      Math.abs(sticky.headerTop) <= 2, `top=${sticky.headerTop} px au lieu de 0 px`);
  }

  // 5. Aucun vide à défiler après la fin du contenu — au-delà de la marge du gabarit (80 px).
  const vide = await page.evaluate(() => {
    const dernier = document.querySelector('.docs-content > *:last-child');
    return Math.round(document.documentElement.scrollHeight - (dernier.getBoundingClientRect().bottom + window.scrollY));
  });
  t(`pas de vide après le contenu (${vide} px)`, vide <= 90, `${vide} px de vide, la cale est-elle revenue ?`);
}

console.log(`\n${ko ? `${ko} ÉCHEC(S)` : 'tout passe'}`);
await ctx.close();
process.exit(ko ? 1 : 0);
