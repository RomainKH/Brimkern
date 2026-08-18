// PROFILAGE DE LA GÉNÉRATION D'IMAGE — où passe le GPU pendant une diffusion, par kernel.
//
// C'est le banc qui MANQUAIT au chemin image/vidéo : `profile-prefill.mjs` instrumente le texte,
// `flops.mjs` donne les plafonds de calcul, mais aucun ne disait quelle part d'une génération va
// dans les convolutions, dans les matmuls des blocs transformer, ou dans l'attention. Sans lui,
// « optimiser conv2d » serait une intuition — la méthode du dépôt (§ 12) veut le profil D'ABORD.
//
// Deux précautions, les mêmes qu'au prefill :
//   1. une génération de CHAUFFE puis remise à zéro des compteurs (__gpuProfile(true)) — sinon la
//      compilation des pipelines et le premier upload des poids sont facturés à la mesure ;
//   2. lecture PAR NOM DE KERNEL — c'est la seule séparation fiable entre les familles d'ops.
//
// Le chemin mesuré est celui de la PRODUCTION : BRIK q8 (donc conv2d_direct_q8), 256px par défaut.
//
// Prérequis : un build de PRODUCTION servi sur le port 3618.
//   npm run build && npx next start -p 3618
//   node scripts/e2e/profile-image.mjs [nbGénérations] [&drapeau]
//   node scripts/e2e/profile-image.mjs 2 '&imgtier=light'   ← le chemin int4
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const TOURS = Number(process.argv[2] || 2);
const FLAG = process.argv[3] ?? '';
const PROMPT = 'a cozy wooden cabin by a lake at sunset, warm golden light, highly detailed';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/COUPÉE|HS sur ce GPU|timestamp-query|perdu|selfValidate|KO/.test(t)) console.log('  ·', t.slice(0, 220)); });

// duty=1 : régime GPU plein. Un duty-cycle < 1 insère des pauses entre les blocs — utile en
// production (thermique), mais il fausserait des PARTS de temps GPU mesurées par passe.
await page.goto(`http://localhost:3618/chat?gpuprofile=1&duty=1${FLAG}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);

// Ouvrir le navigateur de modèles, puis charger le pipeline image (carte text2img).
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /browse|parcourir/i.test(x.textContent || ''));
  b?.click();
});
await page.waitForTimeout(800);
const clique = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /Load \(preview\)|Charger \(aperçu\)/i.test(x.textContent || ''));
  if (!b) return 'bouton introuvable';
  b.click();
  return 'ok';
});
if (clique !== 'ok') { console.log(`✗ ${clique} — le pipeline image n'a pas pu être chargé`); await ctx.close(); process.exit(1); }
console.log('chargement du pipeline image…');
await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 900_000, polling: 2000 });
console.log(`pipeline prêt${FLAG ? ` (drapeau ${FLAG})` : ''} — chauffe`);

// Attendre une NOUVELLE image (pas « une image ») : le tour précédent en laisse déjà une dans le
// DOM, guetter `img` seul rendrait la main immédiatement. On compte avant, on attend n+1.
async function generer(texte) {
  const avant = await page.evaluate(() => document.querySelectorAll('.message.assistant img').length);
  await page.fill('textarea', texte);
  await page.keyboard.press('Enter');
  for (let w = 0; w < 300; w++) {
    await page.waitForTimeout(1000);
    const done = await page.evaluate((n) => document.querySelectorAll('.message.assistant img').length > n, avant);
    if (done) return true;
  }
  return false;
}

await generer(PROMPT + ' (chauffe)');
await page.evaluate(async () => await window.__gpuProfile(true)); // remise à zéro, valeur jetée

for (let i = 0; i < TOURS; i++) {
  const t0 = Date.now();
  const ok = await generer(`${PROMPT} (tour ${i})`);
  console.log(`  tour ${i + 1}/${TOURS} — ${((Date.now() - t0) / 1000).toFixed(1)} s${ok ? '' : ' — ⚠️ pas d’image détectée'}`);
}

const rapport = await page.evaluate(async () => await window.__gpuProfile());
if (!rapport || rapport.error) { console.log('✗', rapport?.error ?? 'hook __gpuProfile absent'); await ctx.close(); process.exit(1); }

const passes = rapport.passes ?? [];
const total = rapport.totalMs ?? passes.reduce((a, r) => a + r.totalMs, 0);
console.log(`\n${passes.length} passes distinctes · ${total.toFixed(1)} ms GPU cumulés · ${rapport.samples} tirs · ${rapport.dropped} non horodatés (quantum ${rapport.quantumUs} µs)\n`);
console.log('| kernel'.padEnd(34) + '| tirs  | part   | µs/tir  | fiable |');
console.log('|' + '-'.repeat(33) + '|-------|--------|---------|--------|');
for (const r of passes.slice(0, 14)) {
  console.log(('| ' + r.name).padEnd(34) + '| ' + String(r.calls).padEnd(6) + '| '
    + (100 * r.totalMs / total).toFixed(1).padStart(5) + ' % | ' + r.meanUs.toFixed(0).padStart(7) + ' | '
    + (r.reliable ? '  oui ' : '  NON ') + ' |');
}

// Le regroupement qui DÉCIDE du prochain kernel : convolutions contre multiplications contre le
// reste. C'est la question posée au § 13 — « le temps d'une génération est-il dans conv2d ? ».
const part = (re) => passes.filter((r) => re.test(r.name)).reduce((a, r) => a + r.totalMs, 0);
const conv = part(/^conv2d/), mm = part(/^matmul/), attn = part(/^attention/), norm = part(/^(group_norm|layernorm|silu|swiglu|quick_gelu|geglu)/);
console.log('\n── familles ────────────────────────────────');
for (const [nom, ms] of [['convolutions', conv], ['matmuls', mm], ['attention', attn], ['normes/activations', norm], ['autres', total - conv - mm - attn - norm]]) {
  console.log(`${nom.padEnd(20)} ${(100 * ms / total).toFixed(1).padStart(5)} %  (${(ms / 1000).toFixed(2)} s)`);
}

await ctx.close();
