// RE-PROFILAGE du décodage après la RMSNorm parallèle du 2026-08-14.
//
// Pourquoi : le classement de référence (rmsnorm 51,9 %, matmul_t_q4_vec 29,3 %) a été relevé AVANT
// le correctif. La suite du travail de perf — fusion d'opérateurs, subgroups — doit se décider sur
// le classement d'AUJOURD'HUI, pas sur celui d'hier. On refait donc exactement le même relevé.
//
// ⚠️ Deux réserves héritées du profileur (cf. gpuProfile.ts), qui valent toujours : Chrome quantifie
// les horodatages à ~100 µs (seule la moyenne sur des centaines de tirs converge), et poser des
// horodatages autour d'une passe l'ISOLE — les passes courtes et nombreuses voient donc leur part
// SURESTIMÉE. C'est un classement de « ce qui coûte quand on ne peut pas recouvrir », utile pour
// choisir quoi fusionner, inutile pour annoncer un pourcentage absolu.
import { chromium } from 'playwright-core';

import { CHROME as EXE } from './chrome.mjs';
const MODEL = process.argv[2] || 'romainkh14/LFM2.5-230M_BRIK';
const FLAG = process.argv[3] ?? '';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
const q = MODEL.includes('=') ? MODEL : `model=${encodeURIComponent(MODEL)}`;
await page.goto(`http://localhost:3618/chat?${q}&gpuprofile=1${FLAG}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 1_800_000, polling: 2000 });
console.log('modèle prêt — génération pour accumuler des échantillons');

// Trois générations : le profileur exige des centaines de tirs par passe pour converger.
for (const question of [
  'Explain in three sentences why WebGPU matters for the web.',
  'List three uses for a local language model, one line each.',
  'Summarize what a GPU does, in three sentences.',
]) {
  await page.fill('textarea', question);
  await page.keyboard.press('Enter');
  for (let w = 0; w < 150; w++) {
    await page.waitForTimeout(2000);
    const done = await page.evaluate(() => {
      const m = document.querySelectorAll('.message.assistant');
      return /Total\s?:/.test(m[m.length - 1]?.textContent ?? '');
    });
    if (done) break;
  }
}

const report = await page.evaluate(async () => {
  const f = window.__gpuProfile;
  if (typeof f !== 'function') return null;
  return await f();
});
if (!report) { console.log('✗ hook __gpuProfile absent (le drapeau ?gpuprofile=1 a-t-il été pris ?)'); }
else {
  const rows = Array.isArray(report) ? report : (report.passes ?? report.rows ?? []);
  const total = rows.reduce((a, r) => a + (r.totalMs ?? r.ms ?? 0), 0);
  console.log(`\n${rows.length} passes distinctes, ${total.toFixed(1)} ms de GPU cumulés\n`);
  console.log('| kernel'.padEnd(30) + '| tirs   | part   |');
  for (const r of rows.slice(0, 10)) {
    const ms = r.totalMs ?? r.ms ?? 0;
    console.log(('| ' + (r.name ?? r.kernel ?? '?')).padEnd(30) + '| ' + String(r.count ?? r.shots ?? '?').padEnd(6) + ' | ' + (100 * ms / total).toFixed(1).padStart(5) + ' % |');
  }
  console.log('\nJSON brut :', JSON.stringify(rows.slice(0, 8)));
}
await ctx.close();
