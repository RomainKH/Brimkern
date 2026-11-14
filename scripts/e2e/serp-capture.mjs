// Capture de VRAIES pages de résultats Google pour le banc qualité (serp-quality.mjs).
//
// Google sert un captcha au Chrome piloté par Playwright (--enable-automation) : Chrome for
// Testing est donc lancé comme un navigateur ordinaire (port de débogage, sans drapeau
// d'automatisation), puis rejoint par connectOverCDP. Rythme humain : quelques secondes entre deux
// recherches. Ce qui est gardé : la sortie de serp.ts (titre, site, extrait) — exactement ce que
// le modèle lira dans l'extension —, pas la page.
//
// Les captures (scripts/e2e/serp-captures/, ignoré par git) contiennent des extraits de Google et
// des sites : elles restent locales. Le banc est rejouable en recapturant (les résultats du jour
// changent : c'est la procédure qui se rejoue, pas les octets).
//
// Usage : node scripts/e2e/serp-capture.mjs [--only=fr-eiffel,en-sky]
import { chromium } from 'playwright-core';
import * as esbuild from 'esbuild';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CHROME, nettoyerVerrous } from './chrome.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = fileURLToPath(new URL('./serp-captures', import.meta.url));
const PROFIL = fileURLToPath(new URL('./chrome-profile-serp-capture', import.meta.url));
const PORT = 9334;
mkdirSync(OUT, { recursive: true });
nettoyerVerrous(PROFIL);

const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const queries = JSON.parse(readFileSync(new URL('./serp-queries.json', import.meta.url), 'utf8'))
  .filter((q) => !only || only.includes(q.id));

const serpIife = (await esbuild.build({
  entryPoints: [path.join(ROOT, 'packages/extension/src/serp.ts')], bundle: true, format: 'iife',
  globalName: '__bkSerp', write: false, target: ['chrome116'], logLevel: 'error',
})).outputFiles[0].text;

const chrome = spawn(CHROME, [`--user-data-dir=${PROFIL}`, `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--no-default-browser-check', '--window-size=1280,950', 'about:blank'], { stdio: 'ignore' });
let browser;
for (let i = 0; i < 40 && !browser; i++) {
  browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`).catch(() => null);
  if (!browser) await new Promise((r) => setTimeout(r, 500));
}
if (!browser) throw new Error('Chrome injoignable sur le port ' + PORT);
const page = browser.contexts()[0].pages()[0];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0;
try {
  for (const q of queries) {
    const host = q.lang === 'fr' ? 'www.google.fr' : 'www.google.com';
    await page.goto(`https://${host}/search?q=${encodeURIComponent(q.q)}&hl=${q.lang}&udm=14`, { waitUntil: 'domcontentloaded' });
    if (page.url().includes('/sorry/')) throw new Error('captcha Google — arrêter et réessayer plus tard');
    const refus = page.locator('button:has-text("Tout refuser"), button:has-text("Reject all")').first();
    if (await refus.isVisible({ timeout: 1500 }).catch(() => false)) { await refus.click(); await pause(1500); }
    await page.addScriptTag({ content: serpIife });
    const results = await page.evaluate(() => window.__bkSerp.extractResults(document));
    writeFileSync(path.join(OUT, `${q.id}.json`), JSON.stringify({ ...q, capturedAt: new Date().toISOString(), results }, null, 2));
    console.log(`${q.id.padEnd(16)} ${results.length} résultats  ${results.map((r) => r.site).join(', ').slice(0, 90)}`);
    if (results.length) ok++;
    await pause(4000 + Math.random() * 3000);
  }
} finally {
  const s = await browser.newBrowserCDPSession().catch(() => null);
  await s?.send('Browser.close').catch(() => {});
  chrome.kill();
}
console.log(`\n${ok}/${queries.length} pages capturées avec des résultats → ${OUT}`);
