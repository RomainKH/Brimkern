// La carte LTX-Video et ses conditions (/terms#ltx-video), en vrai Chrome sur un build de production.
// Licence LTXV § 3.1 : l'Annexe A doit être une clause opposable — la carte exige donc une
// acceptation explicite avant de charger quoi que ce soit. Tant que LTX_HOSTED est faux (poids pas
// servis), la carte est masquée sauf ?vengine=ltx : lancer alors avec --masquee.
//
//   PORT=3619 node scripts/e2e/ltx-terms.mjs [--masquee]
//   BASE=https://brimkern.com node scripts/e2e/ltx-terms.mjs   # la production, après déploiement
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { CHROME as EXE } from './chrome.mjs';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.env.BASE || `http://localhost:${process.env.PORT || 3618}`;
const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();
let ko = 0;
const verdict = (ok, msg) => { if (!ok) ko++; console.log(`${ok ? 'ok ' : 'KO '} ${msg}`); };

const ouvrir = async (path) => {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
  // Sur le réseau (BASE distant), le bouton est cliquable AVANT l'hydratation : un clic trop tôt ne
  // fait rien. On reclique jusqu'à ce que la fenêtre s'ouvre.
  const browse = page.getByRole('button', { name: /Browse \/ load a model|Parcourir \/ charger un modèle/ });
  for (let i = 0; ; i++) {
    await browse.click({ timeout: 60_000 });
    try { await page.locator('.model-card').first().waitFor({ timeout: 5_000 }); break; } catch (e) { if (i >= 8) throw e; }
  }
  return page.locator('.model-card', { hasText: 'LTX-Video 2B' });
};

const MASQUEE = process.argv.includes('--masquee');
const Q = MASQUEE ? '?vengine=ltx' : '';
let carte = await ouvrir('/chat');
verdict(await carte.count() === (MASQUEE ? 0 : 1), MASQUEE ? 'sans ?vengine=ltx, la carte LTX est masquée (LTX_HOSTED faux)' : 'la carte LTX est visible (LTX_HOSTED)');

if (MASQUEE) {
  carte = await ouvrir('/chat?vengine=ltx');
  verdict(await carte.count() === 1, 'avec ?vengine=ltx, la carte LTX est visible');
}
const bouton = carte.getByRole('button', { name: /Generate in the chat/ });
const cgu = carte.getByRole('checkbox');
verdict(await bouton.isDisabled(), 'bouton « Generate in the chat » désactivé avant acceptation');
verdict(await cgu.getAttribute('checked') === null && !(await cgu.isChecked()), 'case des conditions décochée par défaut');
const lien = await carte.getByRole('link', { name: /terms of use/ }).getAttribute('href');
verdict(lien === '/terms#ltx-video', `lien des conditions → ${lien}`);
await cgu.check();
verdict(await bouton.isEnabled(), 'case cochée → bouton actif');

// L'acceptation est mémorisée par navigateur.
carte = await ouvrir(`/chat${Q}`);
verdict(await carte.getByRole('checkbox').isChecked(), 'acceptation retrouvée au rechargement');

// Accessibilité de la carte seule (la fenêtre entière a une dette antérieure, cf. ROADMAP § 29 B).
await page.addScriptTag({ content: AXE });
const v = await page.evaluate(async () => {
  const el = [...document.querySelectorAll('.model-card')].find((c) => c.textContent.includes('LTX-Video 2B'));
  return (await window.axe.run(el, { resultTypes: ['violations'] })).violations.map((x) => `${x.id} (${x.nodes.length})`);
});
verdict(v.length === 0, `axe sur la carte LTX : ${v.length ? v.join(', ') : '0 violation'}`);

// Version française : libellé et lien localisés.
await page.evaluate(() => localStorage.clear());
carte = await ouvrir(`/fr/chat${Q}`);
const lienFr = await carte.getByRole('link', { name: /conditions d’utilisation/ }).getAttribute('href');
verdict(lienFr === '/fr/terms#ltx-video', `lien FR → ${lienFr}`);
verdict(await carte.getByRole('button', { name: /Générer dans le chat/ }).isDisabled(), 'FR : bouton désactivé avant acceptation');

// Métadonnées des deux pages : canonical + hreflang répétés (la page écrase le layout).
for (const p of ['/terms', '/fr/terms']) {
  await page.goto(`${BASE}${p}`, { waitUntil: 'domcontentloaded' });
  const m = await page.evaluate(() => ({
    canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href'),
    langs: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.getAttribute('hreflang')).sort().join(','),
    title: document.title,
    restrictions: document.querySelectorAll('#ltx-video li').length,
  }));
  verdict(m.canonical?.endsWith(p) && m.langs === 'en,fr,x-default' && m.restrictions === 16, `${p} : « ${m.title} », canonical ${m.canonical}, hreflang ${m.langs}, ${m.restrictions} restrictions`);
}

await browser.close();
console.log(ko ? `\n${ko} échec(s)` : '\ntout passe');
process.exit(ko ? 1 : 0);
