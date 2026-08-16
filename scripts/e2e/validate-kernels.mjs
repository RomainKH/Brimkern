// GATE DES KERNELS dans un vrai Chrome, SANS télécharger de modèle.
//
// C'est la boucle de correction courte quand on écrit un kernel : `window.__selfValidate()` fait
// tourner exactement la validation que subit tout chargement de modèle (chaque kernel contre sa
// référence CPU), mais en quelques secondes au lieu du temps de téléchargement d'un modèle.
//
// Il rend l'étape en échec ET l'état des gates NON BLOQUANTS — ceux dont l'échec ne casse rien mais
// fait silencieusement replier le moteur sur un kernel plus lent. C'est le piège à surveiller : un
// kernel faux ne fait PAS échouer le chargement, il disparaît. Un gate à false ici est donc un
// échec du kernel, même quand la ligne de sortie dit « OK ».
//
// Prérequis : un build de PRODUCTION servi sur le port 3618.
//   npm run build && npx next start -p 3618
//   node scripts/e2e/validate-kernels.mjs
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
// Les [selfValidate] partent dans la console de la page : sans ce relais, un gate qui tombe
// n'expliquerait jamais POURQUOI (l'étape en échec n'est imprimée que là).
page.on('console', (m) => { const t = m.text(); if (/selfValidate|webgpu|KO|HS/.test(t)) console.log('  ·', t); });

await page.goto(`http://localhost:3618/chat?v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.__selfValidate === 'function', null, { timeout: 60_000, polling: 200 });

const r = await page.evaluate(async () => await window.__selfValidate());
console.log('\nrésultat :', JSON.stringify(r, null, 2));

const gates = r?.gates ?? {};
const tombes = Object.entries(gates).filter(([k, v]) => v === false && k !== 'hasF16' && k !== 'f16SharedOk');
if (!r?.ok) console.log(`\n❌ validation KO à l'étape : ${r?.stage}`);
else if (tombes.length) console.log(`\n❌ gates non bloquants TOMBÉS (repli silencieux) : ${tombes.map(([k]) => k).join(', ')}`);
else console.log('\n✅ tous les kernels valides, aucun repli');

await ctx.close();
process.exit(!r?.ok || tombes.length ? 1 : 0);
