// Banc des TROIS familles à RoPE « NORM » (paires adjacentes de ggml) : llama, mistral3, smollm3.
// C'est la validation qui manquait pour passer `?ropenorm=1` par défaut.
//
// Pour chaque modèle : chargement, une question factuelle, et le verdict porte sur la RÉPONSE
// (« Paris ») — plus la corrélation référence CPU ↔ logits GPU quand le hook __refForward est là.
// Un modèle dont le RoPE est mal apparié ne se trompe pas « un peu » : il part en charabia fluide
// (c'est la signature documentée du bug llama de 2026-08-13), donc une réponse juste sur une
// question factuelle est un test discriminant.
//
// Usage : node rope-family.mjs <flagQuery> [modèles...]
//   node rope-family.mjs ''              → le défaut du build courant
//   node rope-family.mjs '&ropenorm=0'   → l'ancien couple (dé-permutation + rotate_half)
import { chromium } from 'playwright-core';

import { CHROME as EXE } from './chrome.mjs';
const FLAG = process.argv[2] ?? '';
const ONLY = process.argv.slice(3);

const MODELS = [
  { key: 'llama3',   label: 'Llama 3.2 1B',  param: 'model=bartowski%2FLlama-3.2-1B-Instruct-GGUF&file=Llama-3.2-1B-Instruct-Q4_K_M.gguf' },
  { key: 'mistral3', label: 'Ministral 3 3B', param: 'model=bartowski%2Fmistralai_Ministral-3-3B-Instruct-2512-GGUF&file=mistralai_Ministral-3-3B-Instruct-2512-Q4_K_M.gguf' },
  { key: 'smollm3',  label: 'SmolLM3 3B',     param: 'model=bartowski%2FHuggingFaceTB_SmolLM3-3B-GGUF&file=HuggingFaceTB_SmolLM3-3B-Q4_K_M.gguf' },
];

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile-rope', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();

let ok = 0, ko = 0;
const check = (c, m) => { if (c) ok++; else ko++; console.log(`${c ? '  ok  ' : '  FAIL'} ${m}`); };

for (const m of MODELS) {
  if (ONLY.length && !ONLY.includes(m.key)) continue;
  const t0 = Date.now();
  console.log(`\n── ${m.label} ${FLAG || '(défaut)'} ──`);
  await page.goto(`http://localhost:3618/chat?${m.param}${FLAG}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  const ready = await page.waitForFunction(
    () => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; },
    null, { timeout: 3_600_000, polling: 2000 },
  ).then(() => true).catch(() => false);
  if (!ready) { check(false, `${m.label} : chargement impossible (timeout)`); continue; }
  console.log(`   chargé en ${((Date.now() - t0) / 1000).toFixed(0)} s`);

  await page.fill('textarea', 'What is the capital of France? Answer in one short sentence.');
  await page.keyboard.press('Enter');
  let done = false, txt = '';
  for (let w = 0; w < 150 && !done; w++) {
    await page.waitForTimeout(2000);
    const s = await page.evaluate(() => {
      const msgs = document.querySelectorAll('.message.assistant');
      const last = msgs[msgs.length - 1];
      return { total: /Total\s?:/.test(last?.textContent ?? ''), text: last?.textContent ?? '' };
    });
    done = s.total; txt = s.text;
  }
  const answer = txt.replace(/Prompt\s?:[\s\S]*$/, '').trim();
  check(done && /paris/i.test(answer), `${m.label} : répond « Paris » (« ${answer.slice(0, 90).replace(/\n/g, ' ')}… »)`);
  // Charabia = beaucoup de tokens sans le mot attendu : on le dit explicitement pour lever le doute.
  if (done && !/paris/i.test(answer)) console.log(`      réponse complète : ${answer.slice(0, 300)}`);

  // Corrélation référence CPU ↔ GPU quand le hook est exposé (5 tokens : exerce Q, K, le RoPE
  // positionnel, le masque causal et la GQA — ce qu'un test à 1 token ne touche pas).
  const corr = await page.evaluate(async () => {
    const f = window.__refForward;
    if (typeof f !== 'function') return null;
    try { const r = await f(5); return typeof r === 'number' ? r : (r?.corr ?? r?.logitsCorr ?? null); } catch { return null; }
  });
  if (corr !== null && corr !== undefined) check(corr > 0.99, `${m.label} : corrélation référence CPU ↔ GPU à 5 tokens = ${Number(corr).toFixed(4)}`);
  else console.log('      (hook __refForward absent sur ce build — verdict porté par la réponse)');
}

await ctx.close();
console.log(`\n${ok}/${ok + ko} assertions OK`);
process.exit(ko ? 1 : 0);
