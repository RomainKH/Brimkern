// LE THREAD PRINCIPAL DE L'APP BLOQUE-T-IL PENDANT UNE GÉNÉRATION ? — la mesure qui instruit le
// chantier « moteur en Web Worker » (ROADMAP §1, P2) AVANT de déplacer quoi que ce soit.
//
// Pourquoi ce banc existe : côté SDK, la même question a déjà été tranchée par la mesure
// (backend.ts — worker 411 car/s vs main 396, 0 frame perdue dans les DEUX bras : la boucle attend
// un readback GPU par token et rend la main au navigateur). Mais la boucle de l'app n'est PAS celle
// du SDK : elle décode par token sur le thread principal, détokenise, applique le garde-fou
// anti-boucle (décodage COMPLET du texte tous les 24 tokens) et rend via React à ~8 Hz. Si elle ne
// bloque pas non plus, le chantier worker se ferme comme silu ou top_k : par la mesure, sans code.
//
// Deux instruments, pas un : PerformanceObserver('longtask') (les tâches > 50 ms, la définition du
// blocage) et les écarts entre requestAnimationFrame (les frames perdues, ce que l'œil voit).
// Trois phases séparées : CHARGEMENT du modèle, PREFILL d'un long prompt (~500 tokens), DÉCODAGE.
//
// Prérequis : build de PRODUCTION sur le port 3618 (npm run build && npx next start -p 3618).
// Usage : node scripts/e2e/jank-chat.mjs [--model=<id HF>] (défaut : le preset LFM2.5 230M)
import { chromium } from 'playwright-core';
import { appendFileSync } from 'node:fs';
import { CHROME as EXE } from './chrome.mjs';

const LOG = process.env.BENCHLOG;
const say = (m) => { console.log(m); if (LOG) { try { appendFileSync(LOG, m + '\n'); } catch {} } };
const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) ?? `=${d}`).split('=').slice(1).join('=');
// Le DÉFAUT du site : c'est lui que la quasi-totalité des visiteurs exécute, et son décodage rapide
// (>150 t/s) est justement le cas qui sollicite le plus la boucle UI (détokenisations fréquentes).
const MODEL = arg('model', '');

// Le prompt long de bench-decode.mjs : le prefill tuilé (128 tokens par tranche) est la phase la
// plus susceptible de bloquer — chaque tranche enchaîne tokenisation, soumission et readback.
const PAVE = (
  'Here is a long technical brief that must be read in full before answering. '
  + 'WebGPU exposes compute shaders to the browser, which makes it possible to run neural network '
  + 'inference locally without any server round trip. The engine loads quantized weights, uploads '
  + 'them once to GPU memory, and keeps them resident across generations so that only the KV cache '
  + 'grows over time. Attention dominates the prefill phase on small models because every query '
  + 'token must be scored against every preceding key, which is quadratic in the prompt length, '
  + 'while the matrix multiplications stay linear. Memory bandwidth, not arithmetic, is the binding '
  + 'constraint on most consumer hardware, so the winning optimizations are the ones that read less '
  + 'rather than the ones that compute less. '
).repeat(3);
// Deux prompts alternés : le pavé stresse le PREFILL (tuilé par 128, tokenisation longue), la
// consigne de liste stresse le DÉCODAGE (réponse longue → détokenisations, garde-fou tous les
// 24 tokens, rendu React ~8 Hz). Un seul tir de 40 tokens ne fenêtre qu'une demi-seconde — trop
// court pour surprendre un blocage intermittent, d'où plusieurs tirs.
const PROMPTS = [
  // La question EXACTE de bench-decode.mjs : mesurée, elle produit une vraie réponse là où des
  // variantes proches font décrocher le 230M au 2e token.
  PAVE + '\n\nGiven all of the above, answer in two short sentences: why does prompt length matter?',
  'Write a numbered list of fifteen short facts about web browsers, one per line.',
  'Tell me the story of a lighthouse keeper, in ten sentences.',
];

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();

// L'instrumentation est posée AVANT tout script de la page : un longtask raté n'est pas un
// longtask absent. `buffered: true` rattrape même ceux d'avant l'abonnement.
await page.addInitScript(() => {
  const J = (window.__jank = { longtasks: [], rafGaps: [], rafOn: false, frames: 0 });
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) J.longtasks.push({ t: e.startTime, d: e.duration }); })
      .observe({ type: 'longtask', buffered: true });
  } catch { /* longtask non supporté : les rAF restent */ }
  let last = 0;
  const boucle = (ts) => {
    if (last && J.rafOn) {
      J.frames++; // preuve de VIE de l'instrument : zéro écart sur zéro frame ne prouverait rien
      const gap = ts - last;
      if (gap > 33.4) J.rafGaps.push({ t: ts, d: gap });
    }
    last = ts;
    requestAnimationFrame(boucle);
  };
  requestAnimationFrame(boucle);
});

const fenetre = async (nom, fn) => {
  // Fenêtre de mesure : on vide les compteurs, on exécute la phase, on relève.
  const t0 = await page.evaluate(() => {
    window.__jank.longtasks.length = 0; window.__jank.rafGaps.length = 0; window.__jank.frames = 0; window.__jank.rafOn = true;
    return performance.now();
  });
  await fn();
  const r = await page.evaluate((t0) => {
    const J = window.__jank; J.rafOn = false;
    const lt = J.longtasks.filter((e) => e.t >= t0);
    const rg = J.rafGaps.filter((e) => e.t >= t0);
    const somme = lt.reduce((s, e) => s + e.d, 0);
    return {
      duree: performance.now() - t0, frames: J.frames,
      lt: lt.length, ltMs: Math.round(somme), ltMax: Math.round(Math.max(0, ...lt.map((e) => e.d))),
      f33: rg.length, f100: rg.filter((e) => e.d > 100).length, gapMax: Math.round(Math.max(0, ...rg.map((e) => e.d))),
    };
  }, t0);
  // Preuve de vie : une fenêtre qui n'a observé AUCUNE frame n'a rien mesuré (rAF gelé, onglet
  // masqué…) — la dire propre serait un faux verdict.
  const vivant = r.frames > r.duree / 100; // au moins ~10 fps observés
  say(`  ${nom.padEnd(34)} ${String(Math.round(r.duree)).padStart(6)} ms · ${String(r.frames).padStart(4)} frames · longtasks: ${r.lt} (${r.ltMs} ms bloqués, max ${r.ltMax}) · frames >33ms: ${r.f33} (>100ms: ${r.f100}, max ${r.gapMax})${vivant ? '' : '   ⚠️ INSTRUMENT MORT (trop peu de frames)'}`);
  return { ...r, vivant };
};

const q = MODEL ? `model=${encodeURIComponent(MODEL)}` : 'start=1';
say(`Jank du thread principal — ${MODEL || 'preset par défaut (LFM2.5 230M)'}\n`);

await page.goto(`http://localhost:3618/chat?${q}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
const chargement = await fenetre('CHARGEMENT (jusqu’au prêt)', async () => {
  await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 900_000, polling: 500 });
});

// Chaque tour ENTIER (prefill + décodage) dans une seule fenêtre : séparer les deux sur le DOM
// est piégeux (la bulle de statut « Lecture du contexte » ressemble à du texte de réponse — la
// première version de ce banc a refermé sa fenêtre prefill en 19 ms dessus), et le verdict du
// chantier ne dépend pas de la phase fautive, seulement de l'existence d'un blocage.
const tirs = [];
for (let i = 0; i < PROMPTS.length; i++) {
  // Le champ se réactive un instant APRÈS l'apparition du « Total : », puis React remonte le
  // composer : un fill+Enter collé à la réactivation perd son focus entre les deux et l'Enter part
  // dans le vide (constaté : la valeur reste dans le champ, aucun message n'est créé). La pause de
  // stabilisation est la règle de bench-decode ; le clic ré-ancre le focus sur le nœud COURANT.
  await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 60_000, polling: 200 });
  await page.waitForTimeout(1000);
  const before = await page.evaluate(() => document.querySelectorAll('.message.assistant').length);
  await page.click('textarea');
  await page.fill('textarea', PROMPTS[i]);
  const r = await fenetre(`INFÉRENCE tir ${i + 1}`, async () => {
    // Soumission AUTO-VÉRIFIÉE : l'app vide le champ quand l'envoi part. Tant qu'il ne se vide
    // pas, l'Enter a été avalé (recréation du composer par React) — on ré-ancre et on réessaie.
    // Jusqu'à ~30 s de re-tentatives : après le « Total : », l'app peut rester occupée plusieurs
    // secondes (post-traitement, modèles « thinking ») et son submit ignore les Enter pendant ce
    // temps — sans jamais le dire au DOM.
    for (let essai = 0; essai < 20; essai++) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);
      const vide = await page.evaluate(() => !(document.querySelector('textarea')?.value ?? '').trim());
      if (vide) break;
      await page.click('textarea');
      if (essai === 19) throw new Error(`tir ${i + 1} : la soumission n'est jamais partie`);
    }
    // Polling MANUEL (règle bench-decode) : il tient un diagnostic quand rien n'arrive, là où
    // waitForFunction rend un TimeoutError nu à 300 s.
    let done = false;
    for (let w = 0; w < 600 && !done; w++) {
      await page.waitForTimeout(500);
      const s = await page.evaluate((n) => {
        const msgs = document.querySelectorAll('.message.assistant');
        const last = msgs[msgs.length - 1];
        const ta = document.querySelector('textarea');
        return {
          grew: msgs.length > n, total: /Total\s?:/.test(last?.textContent ?? ''),
          tail: (last?.textContent ?? '').slice(-80), taDisabled: !!ta?.disabled, taValue: (ta?.value ?? '').slice(0, 40),
        };
      }, before);
      done = s.grew && s.total;
      if (!done && w > 0 && w % 60 === 0) say(`     … tir ${i + 1} lent (${w / 2}s) : ${JSON.stringify(s)}`);
    }
    if (!done) throw new Error(`tir ${i + 1} : aucune réponse complète en 300 s`);
  });
  // Les débits affichés par l'app, pour SITUER la mesure : un tir de 2 tokens ne fenêtre rien.
  const stat = await page.evaluate(() => {
    const msgs = document.querySelectorAll('.message.assistant');
    const txt = msgs[msgs.length - 1]?.textContent ?? '';
    const gen = /(?:Generation|Génération)\s?:\s?([\d.,]+)\s?t\/s\s?\(([\d]+) t\)/.exec(txt);
    const pre = /Prompt\s?:\s?([\d.,]+)\s?t\/s/.exec(txt);
    return { decode: gen ? gen[1] : '?', tokens: gen ? Number(gen[2]) : 0, prefill: pre ? pre[1] : '?' };
  });
  say(`        prefill ${stat.prefill} t/s · décodage ${stat.decode} t/s (${stat.tokens} t)`);
  tirs.push({ ...r, tokens: stat.tokens });
}

// Verdict, avec le seuil du banc SDK : des frames > 33 ms pendant l'inférence = le thread
// principal bloque et le worker a quelque chose à débloquer ; zéro = le chantier se ferme.
if (!chargement.vivant || tirs.some((t) => !t.vivant)) {
  say('\n✗ instrument mort sur une fenêtre — pas de verdict.');
  await ctx.close();
  process.exit(1);
}
const tokens = tirs.reduce((s, t) => s + t.tokens, 0);
if (tokens < 100) {
  say(`\n✗ seulement ${tokens} tokens décodés au total — fenêtre trop courte pour un verdict, changer les prompts.`);
  await ctx.close();
  process.exit(1);
}
const f33 = tirs.reduce((s, t) => s + t.f33, 0);
const frames = tirs.reduce((s, t) => s + t.frames, 0);
const ltMs = tirs.reduce((s, t) => s + t.ltMs, 0);
say(f33 === 0
  ? `\nVERDICT : 0 frame perdue pendant l'inférence sur ${frames} observées et ${tokens} tokens décodés (${ltMs} ms de longtasks) — le thread principal ne bloque pas, le worker n'a rien à débloquer.`
  : `\nVERDICT : ${f33} frame(s) > 33 ms pendant l'inférence (sur ${frames}, ${tokens} tokens), ${ltMs} ms de longtasks — il y a quelque chose à déplacer ou à lisser.`);
say('  (le CHARGEMENT est mesuré à part : il ne se produit qu’une fois et a son écran dédié.)');
await ctx.close();
