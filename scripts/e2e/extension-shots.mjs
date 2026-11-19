// Captures de l'extension sur de VRAIES pages de résultats Google, en 1280×800 — le format exigé
// par le Chrome Web Store, et les images de /extension.
//
// Google sert un captcha au Chrome piloté par Playwright : comme serp-capture.mjs, Chrome for
// Testing est lancé en navigateur ordinaire (port de débogage, pas de drapeau d'automatisation),
// extension chargée, puis rejoint par connectOverCDP. Le profil est celui du banc de l'extension
// (chrome-profile-ext) : même chemin de dist/ → même identifiant d'extension → modèle déjà en cache.
// Les résultats du jour changent : c'est la procédure qui se rejoue, pas les octets.
//
// Usage :
//   node scripts/build-extension.mjs
//   node scripts/e2e/extension-shots.mjs --out=DIR [--only=en,fr]
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CHROME, nettoyerVerrous } from './chrome.mjs';

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'packages/extension/dist');
if (!existsSync(path.join(DIST, 'manifest.json'))) throw new Error('lancer d’abord : node scripts/build-extension.mjs');
const OUT = arg('out');
if (!OUT) throw new Error('--out=DIR obligatoire');
mkdirSync(OUT, { recursive: true });
const PROFIL = fileURLToPath(new URL('./chrome-profile-ext', import.meta.url));
const PORT = 9335;
nettoyerVerrous(PROFIL);

const only = arg('only')?.split(',');
const CAS = [
  { id: 'en', host: 'www.google.com', q: 'why is the sky blue' },
  { id: 'fr', host: 'www.google.fr', q: 'pourquoi le ciel est bleu' },
].filter((c) => !only || only.includes(c.id));

const chrome = spawn(CHROME, [`--user-data-dir=${PROFIL}`, `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--no-default-browser-check', `--disable-extensions-except=${DIST}`, `--load-extension=${DIST}`,
  '--enable-unsafe-webgpu', '--use-angle=metal', '--window-size=1280,950', 'about:blank'], { stdio: 'ignore' });
let browser;
for (let i = 0; i < 40 && !browser; i++) {
  browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`).catch(() => null);
  if (!browser) await new Promise((r) => setTimeout(r, 500));
}
if (!browser) throw new Error('Chrome injoignable sur le port ' + PORT);
const page = browser.contexts()[0].pages()[0];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const c of CAS) {
    // Sans udm=14 dans l'URL : c'est la règle de l'extension qui doit l'ajouter.
    await page.goto(`https://${c.host}/search?q=${encodeURIComponent(c.q)}&hl=${c.id}`, { waitUntil: 'domcontentloaded' });
    if (page.url().includes('/sorry/')) throw new Error('captcha Google — arrêter et réessayer plus tard');
    const refus = page.locator('button:has-text("Tout refuser"), button:has-text("Reject all")').first();
    if (await refus.isVisible({ timeout: 1500 }).catch(() => false)) { await refus.click(); await pause(1500); }
    const udm14 = new URL(page.url()).searchParams.get('udm') === '14';
    const panneau = page.locator('#brimkern-answer');
    const repondre = panneau.getByRole('button', { name: /Answer on this device|Répondre sur cet appareil/ });
    await repondre.waitFor({ timeout: 15_000 });
    await pause(800);
    await page.screenshot({ path: path.join(OUT, `extension-google-${c.id}-button.png`) });
    const t0 = Date.now();
    await repondre.click();
    const consent = panneau.getByRole('button', { name: /Download and answer|Télécharger et répondre/ });
    const fini = panneau.locator('.foot').filter({ hasText: /\d[.,]\d s/ });
    const etape = await Promise.race([
      consent.waitFor({ timeout: 60_000 }).then(() => 'consentement'),
      fini.waitFor({ timeout: 600_000 }).then(() => 'réponse'),
    ]);
    if (etape === 'consentement') await consent.click();
    await fini.waitFor({ timeout: 900_000 });
    const ms = Date.now() - t0;
    await pause(500);
    await page.screenshot({ path: path.join(OUT, `extension-google-${c.id}-answer.png`) });
    console.log(JSON.stringify({
      cas: c.id, udm14, url: page.url(), consentement: etape === 'consentement', clicVersReponseMs: ms,
      reponse: await panneau.locator('.answer').innerText(),
      sources: await panneau.locator('ol a').count(),
      pied: await panneau.locator('.foot').innerText(),
    }, null, 1));
    await pause(3000 + Math.random() * 2000);
  }
} finally {
  const s = await browser.newBrowserCDPSession().catch(() => null);
  await s?.send('Browser.close').catch(() => {});
  chrome.kill();
}
