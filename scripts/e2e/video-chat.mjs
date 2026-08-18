// Parcours PRODUIT du mode vidéo (§ 3 P2) : navigateur de modèles → carte vidéo « Générer dans le
// chat » → chargement du pipeline AnimateDiff → prompt → clip WebM dans la bulle.
// 8 frames + enrich coupé + duty=1 : le clip le plus COURT possible — on valide le CHEMIN, pas la
// qualité (mesuré : 83 s sur la machine de réf., 2026-08-18). Timeouts longs : ~1,5 Go à
// télécharger au premier passage (cache Chrome ensuite).
//
// Prérequis : build de production sur le port 3618 (npm run build && npx next start -p 3618).
//   node scripts/e2e/video-chat.mjs            # captures dans /tmp (SHOTS_DIR pour changer)
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const S = process.env.SHOTS_DIR || '/tmp';
const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/video|vidéo|COUPÉE|perdu/i.test(t)) console.log('  ·', t.slice(0, 160)); });

await page.goto('http://localhost:3618/chat?vframes=8&enrich=0&duty=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

// 1. Ouvrir le navigateur de modèles (bouton « Parcourir / Browse »).
const opened = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /browse|parcourir/i.test(x.textContent || ''));
  if (!b) return false; b.click(); return true;
});
console.log('modal ouvert :', opened);
await page.waitForTimeout(1000);

// 2. La carte vidéo et son bouton produit.
const btn = page.locator('button', { hasText: /Generate in the chat|Générer dans le chat/ });
console.log('bouton « Générer dans le chat » visible :', await btn.count());
await page.screenshot({ path: S + '/video-card.png' });
await btn.first().click();

// 3. Chargement du pipeline (~1,5 Go au premier passage) → textarea active.
console.log('chargement du pipeline…');
await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 1_800_000, polling: 2000 });
const welcome = await page.evaluate(() => document.querySelector('.message.assistant')?.textContent?.slice(0, 120));
console.log('prêt — accueil :', welcome);
await page.screenshot({ path: S + '/video-mode-ready.png' });

// 4. Générer un clip court.
await page.fill('textarea', 'ocean waves rolling onto a beach at sunset');
await page.keyboard.press('Enter');
console.log('prompt envoyé — génération (compter plusieurs minutes)…');
const t0 = Date.now();
// Progression : on loggue le contenu de la dernière bulle toutes les 30 s.
const tick = setInterval(async () => {
  try {
    const s = await page.evaluate(() => { const m = document.querySelectorAll('.message.assistant'); return m[m.length - 1]?.textContent?.slice(0, 110); });
    console.log(`  [${Math.round((Date.now() - t0) / 1000)}s]`, s);
  } catch { /* page fermée */ }
}, 30000);
try {
  await page.waitForSelector('video', { timeout: 1_500_000 });
  clearInterval(tick);
  console.log(`CLIP RENDU en ${Math.round((Date.now() - t0) / 1000)} s`);
  const meta = await page.evaluate(() => {
    const v = document.querySelector('video');
    return { src: v?.src?.slice(0, 30), poster: !!v?.poster, w: v?.width, h: v?.height };
  });
  console.log('vidéo :', JSON.stringify(meta));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: S + '/video-generated.png' });
} catch (e) {
  clearInterval(tick);
  console.log('ÉCHEC :', e.message?.slice(0, 200));
  await page.screenshot({ path: S + '/video-fail.png' });
}
await ctx.close();
