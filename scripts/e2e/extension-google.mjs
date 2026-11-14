// Banc de l'extension Chrome, de bout en bout, dans un vrai Chrome (WebGPU) :
//   1. la règle udm=14 redirige une recherche Google (declarativeNetRequest réel, pas simulé) ;
//   2. la lecture des résultats sur une page à la structure de Google (fixtures/google-serp-fr.html) ;
//   3. le panneau : bouton, consentement au premier usage, téléchargement, réponse, sources ;
//   4. le second clic (moteur chaud) ; 5. les libellés anglais.
// Google sert un captcha aux navigateurs pilotés : la page de résultats est servie par le banc
// (interception Playwright) — le reste (extension, règle, moteur, modèle du Hub) est réel.
//
// Usage :
//   node scripts/build-extension.mjs
//   node scripts/e2e/extension-google.mjs [--fresh] [--headful] [--shots=DIR]
// --fresh : profil vierge — mesure le PREMIER usage (consentement + téléchargement du modèle).
import { chromium } from 'playwright-core';
import * as esbuild from 'esbuild';
import { readFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'node:assert/strict';
import { CHROME, nettoyerVerrous } from './chrome.mjs';

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}`));
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'packages/extension/dist');
if (!existsSync(path.join(DIST, 'manifest.json'))) throw new Error('lancer d’abord : node scripts/build-extension.mjs');
const PROFIL = fileURLToPath(new URL('./chrome-profile-ext', import.meta.url));
if (arg('fresh')) rmSync(PROFIL, { recursive: true, force: true });
nettoyerVerrous(PROFIL);
const SHOTS = arg('shots')?.split('=')[1];
const FIXTURE = readFileSync(fileURLToPath(new URL('./fixtures/google-serp-fr.html', import.meta.url)), 'utf8');

const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
// Violations axe-core dans le panneau SEUL (la page autour est une page de banc, pas notre code).
async function axe(page) {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => (await window.axe.run({ include: [['#brimkern-answer']] }, { resultTypes: ['violations'] }))
    .violations.map((v) => `${v.id}×${v.nodes.length}`));
}

const serpIife = (await esbuild.build({
  entryPoints: [path.join(ROOT, 'packages/extension/src/serp.ts')], bundle: true, format: 'iife',
  globalName: '__bkSerp', write: false, target: ['chrome116'], logLevel: 'error',
})).outputFiles[0].text;

const ctx = await chromium.launchPersistentContext(PROFIL, {
  executablePath: CHROME,
  headless: !arg('headful'),
  args: [`--disable-extensions-except=${DIST}`, `--load-extension=${DIST}`, '--enable-unsafe-webgpu', '--use-angle=metal'],
  viewport: { width: 1280, height: 900 },
});
const resultat = {};
try {
  const servies = [];
  let lang = 'fr';
  let sombre = false;
  await ctx.route(/^https:\/\/www\.google\.[a-z.]+\/search/, (route) => {
    servies.push(route.request().url());
    let body = FIXTURE.replace('lang="fr"', `lang="${lang}"`);
    if (sombre) body = body.replace('background: #fff; color: #1f1f1f', 'background: #1f1f1f; color: #e8eaed');
    route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') console.log('  [console]', m.text().slice(0, 200)); });

  // 1. udm=14
  await page.goto('https://www.google.fr/search?q=quelle+est+la+hauteur+de+la+tour+eiffel&hl=fr');
  resultat.udm14 = new URL(page.url()).searchParams.get('udm') === '14';
  resultat.urlsServies = servies.slice();
  console.log(`1. règle udm=14 : ${resultat.udm14 ? 'appliquée' : 'NON appliquée'} → ${page.url()}`);

  // 2. lecture des résultats (le code du content script, injecté dans la page pour l'observer)
  await page.addScriptTag({ content: serpIife });
  const lus = await page.evaluate(() => (window).__bkSerp.extractResults(document));
  console.log(`2. ${lus.length} résultats lus :`);
  for (const r of lus) console.log(`   - ${r.site} | ${r.title} | ${r.snippet.slice(0, 70)}…`);
  assert.deepEqual(lus.map((r) => r.site), ['toureiffel.paris', 'fr.wikipedia.org', 'paris.fr', 'exemple-actu.fr']);
  assert.match(lus[2].snippet, /^14 mars 2024 — Haute de 330 m/); // repli sans classe connue
  assert.equal(lus[3].url, 'https://www.exemple-actu.fr/sciences/tour-eiffel-six-metres'); // /url?q= déballé
  assert.ok(lus.every((r) => !/Cite|›/.test(r.snippet)), 'l’URL affichée ne doit pas entrer dans l’extrait');

  // 3. le panneau, premier clic
  const panneau = page.locator('#brimkern-answer');
  const bouton = (nom) => panneau.getByRole('button', { name: nom });
  await bouton('Répondre sur cet appareil').waitFor({ timeout: 10_000 });
  if (SHOTS) await panneau.screenshot({ path: `${SHOTS}/panneau-repos.png` });
  const t0 = Date.now();
  await bouton('Répondre sur cet appareil').click();
  const consent = bouton('Télécharger et répondre');
  const note = panneau.locator('.note').first();
  const foot = panneau.locator('.foot');
  const etape = await Promise.race([
    consent.waitFor({ timeout: 60_000 }).then(() => 'consentement'),
    foot.filter({ hasText: 'Calculée sur cet appareil' }).waitFor({ timeout: 600_000 }).then(() => 'réponse'),
  ]);
  resultat.consentementDemande = etape === 'consentement';
  if (etape === 'consentement') {
    resultat.texteConsentement = await note.innerText();
    console.log(`3. consentement : « ${resultat.texteConsentement} »`);
    if (SHOTS) await panneau.screenshot({ path: `${SHOTS}/panneau-consentement.png` });
    await consent.click();
  }
  await foot.filter({ hasText: 'Calculée sur cet appareil' }).waitFor({ timeout: 900_000 });
  resultat.premierClicMs = Date.now() - t0;
  resultat.reponse = await panneau.locator('.answer').innerText();
  resultat.sources = await panneau.locator('ol a').evaluateAll((as) => as.map((a) => a.href));
  resultat.notePremier = await foot.innerText();
  if (SHOTS) await panneau.screenshot({ path: `${SHOTS}/panneau-reponse.png` });
  console.log(`   réponse en ${(resultat.premierClicMs / 1000).toFixed(1)} s (clic → fin, téléchargement compris s’il a eu lieu)`);
  console.log(`   « ${resultat.reponse} »`);
  console.log(`   sources : ${resultat.sources.join(', ')}`);
  assert.ok(resultat.sources.length > 0, 'aucune source affichée');
  assert.ok(resultat.sources.every((u) => lus.some((r) => r.url === u)), 'une source n’est pas un résultat de la page');
  resultat.axeClair = await axe(page);
  console.log(`   axe-core (panneau, thème clair) : ${resultat.axeClair.length} violation(s) ${resultat.axeClair.join(' ')}`);

  // 4. second clic, moteur chaud (document offscreen toujours ouvert, poids sur le GPU)
  await page.reload();
  await bouton('Répondre sur cet appareil').waitFor({ timeout: 10_000 });
  const t1 = Date.now();
  await bouton('Répondre sur cet appareil').click();
  await foot.filter({ hasText: 'Calculée sur cet appareil' }).waitFor({ timeout: 120_000 });
  resultat.secondClicMs = Date.now() - t1;
  resultat.noteSecond = await foot.innerText();
  resultat.reponse2 = await panneau.locator('.answer').innerText();
  console.log(`4. second clic : ${(resultat.secondClicMs / 1000).toFixed(1)} s — « ${resultat.reponse2} »`);

  // 5. libellés anglais, sur une page Google en thème sombre
  lang = 'en';
  sombre = true;
  await page.goto('https://www.google.com/search?q=how+tall+is+the+eiffel+tower&hl=en');
  await bouton('Answer on this device').waitFor({ timeout: 10_000 });
  resultat.anglais = await note.innerText();
  resultat.themeSombre = await panneau.getAttribute('data-theme');
  resultat.axeSombre = await axe(page);
  if (SHOTS) await panneau.screenshot({ path: `${SHOTS}/panneau-sombre-en.png` });
  console.log(`5. anglais : « ${resultat.anglais} » — thème ${resultat.themeSombre}, axe-core ${resultat.axeSombre.length} violation(s) ${resultat.axeSombre.join(' ')}`);
  resultat.reponseCite330 = /330/.test(resultat.reponse);
} finally {
  await ctx.close();
}
console.log('\n' + JSON.stringify(resultat, null, 2));
