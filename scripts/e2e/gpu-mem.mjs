// Mémoire GPU allouée par le moteur pour un modèle, bras alternés d'un kill-switch (__gpuMem, cf.
// WebGpuEngine.gpuMem) — l'instrument des chiffres de VRAM (l'empreinte du processus GPU de Chrome
// cumule d'un rechargement à l'autre, ROADMAP § 26). Une question courte par bras : la vérification
// que le modèle répond encore, pas une mesure de débit (c'est bench-decode).
//
//   PORT=3619 node scripts/e2e/gpu-mem.mjs --flag=pq2head --model=gguf=<url> [--question="…"]
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=') || d;
const FLAG = arg('flag', ''), MODEL = arg('model', 'Qwen/Qwen3-0.6B-GGUF');
const QUESTION = arg('question', 'What is the capital of France? Answer in one word.');
const BASE = `http://localhost:${process.env.PORT || 3618}`;
if (!FLAG) { console.error('manque --flag=<kill-switch>'); process.exit(2); }

const ctx = await chromium.launchPersistentContext(new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } });
const page = ctx.pages()[0] ?? await ctx.newPage();
const q = MODEL.includes('=') ? MODEL : `model=${encodeURIComponent(MODEL)}`;
for (const [label, extra] of [['AVANT', `&${FLAG}=0`], ['APRÈS', ''], ['AVANT', `&${FLAG}=0`], ['APRÈS', '']]) {
  const logs = [];
  const onLog = (m) => { const t = m.text(); if (/KO|COUPÉ|repli|selfValidate.*PQ2|pq2/i.test(t)) logs.push(t.slice(0, 160)); };
  page.on('console', onLog);
  await page.goto(`${BASE}/chat?${q}${extra}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => /Loaded:|Chargé\s?:|Hardware or file error/.test(document.body.innerText), null, { timeout: 600_000, polling: 1000 });
  await page.fill('textarea', QUESTION);
  await page.keyboard.press('Enter');
  const rep = await page.waitForFunction(() => { const m = document.querySelectorAll('.message.assistant'); const l = m[m.length - 1]; return l && /t\/s/.test(l.textContent || '') ? l.textContent : null; },
    null, { timeout: 300_000, polling: 1000 }).then((h) => h.jsonValue()).catch(() => '(pas de réponse)');
  const mem = await page.evaluate(() => (window).__gpuMem?.());
  page.off('console', onLog);
  console.log(`${label.padEnd(6)} vivant ${mem?.llm?.liveMB} Mo · pic ${mem?.llm?.peakMB} Mo · ${mem?.llm?.buffers} tampons · « ${String(rep).replace(/\s+/g, ' ').slice(0, 70)} »`);
  for (const l of logs) console.log(`       ${l}`);
}
await ctx.close();
