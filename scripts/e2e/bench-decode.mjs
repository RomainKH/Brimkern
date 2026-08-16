// A/B BOUT EN BOUT d'un kill-switch du moteur — le juge du gain, selon la règle du repo : ce qui
// compte n'est pas le plafond d'un kernel isolé, c'est ce que l'utilisateur voit.
//
// Quatre bras ALTERNÉS (avant / après / avant / après) : sans l'alternance, le premier bras profite
// d'un GPU froid et le second d'un cache chaud, et l'écart mesuré est celui de la machine, pas du
// code. On relève la MÉDIANE des débits que l'application affiche elle-même sous chaque réponse.
//
// Prérequis : un build de PRODUCTION servi sur le port 3618 (jamais le dev server), et
// playwright-core installé quelque part (`npm i -g playwright-core`, ou dans un dossier de travail).
//   npm run build && npx next start -p 3618
//   BENCHLOG=res.log node scripts/e2e/bench-decode.mjs --flag=rmsvec --model=Qwen/Qwen3-0.6B-GGUF
//
// Options :
//   --flag=<nom>     le kill-switch à comparer (rmsvec, topkpar, gemv, qshared…) — REQUIS
//   --model=<id>     id de dépôt HF, ou une query complète « model=…&file=… » pour imposer un fichier
//   --shots=<n>      générations par bras (défaut 3 ; monter à 4-6 si la variance domine)
//   --think=<niv>    off|low|medium|high sur un modèle « thinking » (défaut : ne touche à rien)
//
// ⚠️ Lire la variance AVANT de conclure : sur un petit modèle les tirs s'étalent facilement de ±15 %,
// et un écart de 2 % entre les bras ne veut alors rien dire. Le banc affiche tous les tirs pour ça.
import { chromium } from 'playwright-core';
import { appendFileSync } from 'node:fs';
// Écriture AU FIL DE L'EAU : la sortie standard de Node vers un fichier est bufferisée par blocs,
// donc un banc de 20 minutes ne montrait rien avant la fin — impossible de voir s'il avance.
const LOG = process.env.BENCHLOG;
const say = (m) => { console.log(m); if (LOG) { try { appendFileSync(LOG, m + '\n'); } catch {} } };

import { CHROME as EXE } from './chrome.mjs';
const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) ?? `=${d}`).split('=').slice(1).join('=');
const FLAG = arg('flag', '');
const MODEL = arg('model', 'Qwen/Qwen3-0.6B-GGUF');
const SHOTS = Number(arg('shots', 3));
const THINK = arg('think', '');
if (!FLAG) { console.error('manque --flag=<nom du kill-switch> (ex. --flag=rmsvec)'); process.exit(2); }
// --long=1 : prompt d'environ 500 tokens au lieu d'une phrase. INDISPENSABLE pour juger un
// kill-switch qui touche le PREFILL — l'attention y croît en O(n²) quand le reste croît en O(n),
// donc sur une question courte la ligne « PREFILL » ci-dessous bouge à peine, quel que soit le
// kernel. Un banc court aurait classé « sans gain » un kernel qui divise le prefill par dix.
const LONG = arg('long', '') === '1';
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
const QUESTION = LONG
  ? PAVE + '\n\nGiven all of the above, answer in two short sentences: why does prompt length matter?'
  : 'Explain in three sentences why WebGPU matters for the web.';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);

// Une SEULE page réutilisée (la page du contexte persistant) : ouvrir une seconde page en parallèle
// fait cohabiter deux devices WebGPU sur le même GPU — la génération s'y enlisait sans erreur.
const page = ctx.pages()[0] ?? await ctx.newPage();

async function arm(label, extraQuery) {
  const gpuLines = [];
  page.on('console', (m) => { const t = m.text(); if (/COUPÉE|COUPÉ/.test(t) || t.includes(FLAG)) gpuLines.push(t); });
  // MODEL peut être un id de dépôt OU une query complète (« model=…&file=… ») quand il faut
  // imposer le fichier — sur un dépôt qui publie plusieurs quantifications, laisser le résolveur
  // choisir ferait comparer deux bras sur deux fichiers différents.
  const q = MODEL.includes('=') ? MODEL : `model=${encodeURIComponent(MODEL)}`;
  await page.goto(`http://localhost:3618/chat?${q}${extraQuery}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 900_000, polling: 1000 });
  // Modèles « thinking » (arch deepseek / qwen3) : le budget <think> par défaut (medium = 700
  // tokens) s'AJOUTE à maxTokens. Sur un 7B à ~10 t/s le tir frôle puis dépasse les 300 s d'attente
  // ci-dessous, et le banc rend « tir abandonné (aucune réponse) » — un échec de PATIENCE que rien
  // ne distingue d'un moteur en panne. `--think=off` préremplit un <think></think> vide : le modèle
  // répond directement, le tir retombe à quelques secondes, et le PREFILL — la seule chose que ce
  // banc juge quand on compare un kernel de prefill — est rigoureusement inchangé.
  // À refaire à CHAQUE bras : chaque bras recharge la page, et le réglage repart à `medium`.
  if (THINK) {
    // Le sélecteur n'est monté que pour ces archs ET une fois le modèle prêt — d'où le placement
    // après l'attente ci-dessus. On le reconnaît à ses options plutôt qu'à une classe : c'est le
    // seul <select> de la page qui propose à la fois « off » et « medium ».
    const sel = page.locator('select').filter({ has: page.locator('option[value="off"]') })
                    .filter({ has: page.locator('option[value="medium"]') });
    if (await sel.count() === 0) { say(`   ✗ sélecteur de réflexion absent — modèle non « thinking » ? bras ${label} abandonné`); return null; }
    await sel.selectOption(THINK);
    // Vérifier la RELECTURE, jamais le clic : un commutateur qui ne commute rien ferait mesurer
    // l'inverse de ce qu'on croit mesurer, sans rien dire.
    const got = await sel.inputValue();
    if (got !== THINK) { say(`   ✗ réflexion « ${THINK} » non appliquée (lue : ${got}) — bras ${label} abandonné`); return null; }
    say(`   réflexion : ${got}`);
  }
  const rates = [];
  for (let i = 0; i < SHOTS; i++) {
    const before = await page.evaluate(() => document.querySelectorAll('.message.assistant').length);
    await page.fill('textarea', QUESTION + ' (' + i + ')');
    await page.keyboard.press('Enter');
    // Polling MANUEL (et non waitForFunction) : il tient un diagnostic quand rien n'arrive, là où
    // waitForFunction rendait un TimeoutError nu au bout de 5 minutes.
    let done = false;
    for (let w = 0; w < 150 && !done; w++) {
      await page.waitForTimeout(2000);
      const s = await page.evaluate((n) => {
        const msgs = document.querySelectorAll('.message.assistant');
        const last = msgs[msgs.length - 1];
        return { n: msgs.length, grew: msgs.length > n, total: /Total\s?:/.test(last?.textContent ?? ''), tail: (last?.textContent ?? '').slice(-60) };
      }, before);
      done = s.grew && s.total;
      if (w === 14) console.log(`   … tir ${i} lent : ${JSON.stringify(s)}`);
    }
    if (!done) { console.log(`   ✗ tir ${i} abandonné (aucune réponse)`); continue; }
    await page.waitForTimeout(800);
    const stat = await page.evaluate(() => {
      const msgs = document.querySelectorAll('.message.assistant');
      const txt = msgs[msgs.length - 1].textContent ?? '';
      const gen = /(?:Generation|Génération)\s?:\s?([\d.,]+)\s?t\/s\s?\(([\d]+) t\)/.exec(txt);
      const pre = /Prompt\s?:\s?([\d.,]+)\s?t\/s/.exec(txt);
      return gen ? { decode: parseFloat(gen[1].replace(',', '.')), tokens: Number(gen[2]), prefill: pre ? parseFloat(pre[1].replace(',', '.')) : null } : null;
    });
    if (stat) rates.push(stat);
  }
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const out = {
    label,
    decodeMed: med(rates.map((r) => r.decode)),
    decodeAll: rates.map((r) => r.decode),
    prefillMed: med(rates.map((r) => r.prefill).filter(Boolean)),
    tokens: rates.map((r) => r.tokens),
    switches: gpuLines,
  };
  say(`${label.padEnd(28)} décodage médian ${out.decodeMed?.toFixed(1)} t/s  (tirs: ${out.decodeAll.map((v) => v.toFixed(1)).join(', ')})  · prefill médian ${out.prefillMed?.toFixed(0)} t/s`);
  if (gpuLines.length) console.log('   switches: ' + gpuLines.join(' | '));
  return out;
}

console.log(`Modèle ${MODEL} — ${SHOTS} tirs par bras\n`);
// Ordre alterné pour ne pas donner l'avantage thermique au premier bras.
const off1 = await arm(`AVANT (?${FLAG}=0)`, `&${FLAG}=0`);
const on1 = await arm('APRÈS (défaut)', '');
const off2 = await arm('AVANT (2e passage)', `&${FLAG}=0`);
const on2 = await arm('APRÈS (2e passage)', '');

// Un bras rendu `null` (réglage de réflexion impossible) ou sans une seule médiane rendrait ici un
// TypeError nu, à trente lignes de la vraie cause. On le dit, et on sort.
const bras = { 'AVANT 1': off1, 'APRÈS 1': on1, 'AVANT 2': off2, 'APRÈS 2': on2 };
const morts = Object.entries(bras).filter(([, b]) => !b || b.decodeMed === undefined).map(([n]) => n);
if (morts.length) { say(`\n✗ bras sans mesure : ${morts.join(', ')} — pas de verdict`); await ctx.close(); process.exit(1); }

const offMed = (off1.decodeMed + off2.decodeMed) / 2;
const onMed = (on1.decodeMed + on2.decodeMed) / 2;
say(`\nDÉCODAGE : ${offMed.toFixed(1)} → ${onMed.toFixed(1)} t/s  ×${(onMed / offMed).toFixed(2)}`);
const offP = (off1.prefillMed + off2.prefillMed) / 2, onP = (on1.prefillMed + on2.prefillMed) / 2;
say(`PREFILL  : ${offP.toFixed(0)} → ${onP.toFixed(0)} t/s  ×${(onP / offP).toFixed(2)}`);
await ctx.close();
