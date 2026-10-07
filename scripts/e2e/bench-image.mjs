// A/B DE LA GÉNÉRATION D'IMAGE — le juge d'une optimisation du chemin diffusion.
//
// Pourquoi il existe : profile-image.mjs dit OÙ va le temps, jamais si un changement fait gagner.
// Ses chiffres absolus dérivent d'un run à l'autre (thermique : entre deux séries de ce soir, un
// kernel NON MODIFIÉ est passé de 19 à 30 ms le tir). Un « avant/après » lu sur deux profils
// séparés ne prouve donc rien. Ici on ALTERNE les deux bras dans la même session, comme
// bench-decode.mjs le fait pour le décodage, et on lit la médiane par bras.
//
// Chaque bras recharge la page avec (ou sans) son drapeau, recharge le pipeline depuis le cache,
// et génère N images. On mesure le TEMPS MURAL d'une génération : c'est ce que l'utilisateur voit,
// et c'est insensible à l'effet d'observation du profileur (qui sérialise les passes courtes).
//
//   node scripts/e2e/bench-image.mjs '&gnsilu=0'      ← le bras témoin de la fusion group_norm+silu
//   node scripts/e2e/bench-image.mjs '&convtq=0'      ← le bras témoin du conv 3×3 tuilé quantifié
//
// Prérequis : build de PRODUCTION sur le port 3618 (npm run build && npx next start -p 3618).
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const FLAG = process.argv[2] ?? '&gnsilu=0';
const GENS = Number(process.env.GENS || 3);   // générations par bras
const TOURS = Number(process.env.TOURS || 2); // allers-retours entre les deux bras
const PROMPT = 'a cozy wooden cabin by a lake at sunset, warm golden light, highly detailed';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1200, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/COUPÉE|KO|perdu/.test(t)) console.log('  ·', t.slice(0, 180)); });

// ⚠️ « textarea active » ne dit PAS quel modèle est chargé : au second bras, le chat restaurait son
// dernier modèle TEXTE (LFM2.5 230M) pendant que le banc cliquait la carte image, et c'est lui qui
// finissait en dernier — le banc envoyait alors le prompt à un LLM, n'attendait jamais d'image et
// rendait NaN (constaté le 2026-10-07, même avec un drapeau sans effet). On vérifie donc le MODE
// image (pilule du composer « SD-Turbo ») et on recharge la carte tant qu'il n'y est pas.
async function chargerImage(flag) {
  for (let essai = 0; essai < 3; essai++) {
    await chargerImageUneFois(flag);
    await page.waitForTimeout(3000); // laisser une restauration concurrente finir, s'il y en a une
    const label = await page.evaluate(() => document.querySelector('.quick-model-pill-label')?.textContent ?? '');
    if (/SD-Turbo/.test(label)) return;
    console.log(`   · modèle actif « ${label} » au lieu du pipeline image — nouvelle tentative`);
    if (process.env.SHOTS_DIR) await page.screenshot({ path: `${process.env.SHOTS_DIR}/bench-image-essai${essai}.png` });
  }
  throw new Error('le pipeline image ne reste pas chargé');
}

async function chargerImageUneFois(flag) {
  await page.goto(`http://localhost:3618/chat?duty=1${flag}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  // Laisser une RESTAURATION finir avant de choisir : sinon son modèle texte se charge après le
  // pipeline image et le remplace (la course décrite au-dessus de chargerImage).
  await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 120_000, polling: 1000 }).catch(() => {});
  // Par le SÉLECTEUR RAPIDE du composer : la carte du navigateur de modèles ne prenait plus le clic
  // (fenêtre restée ouverte, aucun modèle), et « textarea active » est vrai même SANS modèle — le
  // banc concluait au chargement fini. On attend donc la pilule « SD-Turbo » ET la saisie active.
  for (let essai = 0; essai < 20; essai++) {
    const ok = await page.evaluate(() => {
      document.querySelector('.quick-model-pill')?.click();
      const it = [...document.querySelectorAll('.quick-model-item')].find((b) => /Stable Diffusion Turbo/.test(b.textContent || ''));
      if (!it) return false;
      it.click();
      return true;
    });
    if (ok) break;
    await page.waitForTimeout(1000);
  }
  await page.waitForFunction(() => {
    const ta = document.querySelector('textarea');
    return ta && !ta.disabled && /SD-Turbo/.test(document.querySelector('.quick-model-pill-label')?.textContent ?? '');
  }, null, { timeout: 900_000, polling: 2000 });
}

async function generer(texte) {
  const avant = await page.evaluate(() => document.querySelectorAll('.message.assistant img').length);
  await page.fill('textarea', texte);
  // Focus EXPLICITE avant Entrée, puis relecture : au second bras (rechargement + carte reclignée),
  // Entrée partait hors de la zone de saisie, le message ne partait jamais et le bras rendait NaN —
  // même avec un drapeau sans effet (`&noop=1`), donc le banc, pas le code mesuré.
  await page.focus('textarea');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  if (await page.evaluate(() => (document.querySelector('textarea')?.value ?? '').length > 0)) {
    await page.focus('textarea');
    await page.keyboard.press('Enter');
  }
  const t0 = Date.now();
  for (let w = 0; w < 300; w++) {
    await page.waitForTimeout(250);
    const fini = await page.evaluate((n) => document.querySelectorAll('.message.assistant img').length > n, avant);
    if (fini) return Date.now() - t0;
  }
  // Tir abandonné : garder l'écran et la dernière bulle, sinon « NaN » ne dit pas où ça a coincé.
  if (process.env.SHOTS_DIR) await page.screenshot({ path: `${process.env.SHOTS_DIR}/bench-image-nan.png` });
  console.log('   ✗ aucune image — dernière bulle :', (await page.evaluate(() => { const m = document.querySelectorAll('.message.assistant'); return m[m.length - 1]?.textContent?.slice(0, 160); })) ?? '—');
  return NaN;
}

const mesures = { v2: [], temoin: [] };
for (let tour = 0; tour < TOURS; tour++) {
  for (const [nom, flag] of [['v2', ''], ['temoin', FLAG]]) {
    await chargerImage(flag);
    await generer(PROMPT + ' (chauffe)'); // la 1re génération paye la compilation des pipelines
    for (let g = 0; g < GENS; g++) {
      const ms = await generer(`${PROMPT} (t${tour} g${g})`);
      mesures[nom].push(ms);
      console.log(`  tour ${tour + 1} · ${nom.padEnd(6)} · ${(ms / 1000).toFixed(2)} s`);
    }
  }
}

const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const mv = med(mesures.v2), mt = med(mesures.temoin);
console.log(`\nOPTIMISÉ  médiane ${(mv / 1000).toFixed(2)} s   (${mesures.v2.map((m) => (m / 1000).toFixed(2)).join(', ')})`);
console.log(`TÉMOIN ${FLAG}  médiane ${(mt / 1000).toFixed(2)} s   (${mesures.temoin.map((m) => (m / 1000).toFixed(2)).join(', ')})`);
console.log(`\nGAIN : ×${(mt / mv).toFixed(3)}`);

await ctx.close();
