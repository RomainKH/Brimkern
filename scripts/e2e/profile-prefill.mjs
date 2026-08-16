// PROFILAGE DU PREFILL — le coût GPU de la phase « lecture du prompt », par kernel.
//
// Pourquoi un banc distinct de profile-decode.mjs : le profileur accumule TOUT depuis le chargement,
// or un chat passe l'essentiel de son temps à décoder. Un rapport brut noie donc le prefill dans le
// décodage, et la ligne `attention` qu'on y lit mélange deux régimes qui n'ont rien à voir (des
// milliers de requêtes d'un coup contre une seule). Deux précautions séparent les phases :
//   1. compteurs remis à ZÉRO après un échange de chauffe (__gpuProfile(true)) — la compilation des
//      pipelines et le premier upload des poids sont facturés au premier prefill, sinon ;
//   2. lecture PAR NOM DE KERNEL — prefill et décodage ne dispatchent pas les mêmes (attention_prefill
//      vs attention_decode, matmul tuilé vs GEMV). C'est la séparation, pas une fenêtre de temps.
//
// Chaque message re-préfille tout l'historique : N longs prompts donnent N × nLayers tirs, ce qu'il
// faut pour passer MIN_SAMPLES (50) — en dessous, la ligne est marquée non fiable et ne vaut rien.
//
// Prérequis : un build de PRODUCTION servi sur le port 3618.
//   npm run build && npx next start -p 3618
//   node scripts/e2e/profile-prefill.mjs [modèle] [&drapeau]
//   node scripts/e2e/profile-prefill.mjs Qwen/Qwen3-0.6B-GGUF '&attnprefill=0'   ← le bras témoin
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const MODEL = process.argv[2] || 'Qwen/Qwen3-0.6B-GGUF';
const FLAG = process.argv[3] ?? '';
const TOURS = Number(process.env.TOURS || 4);

// ~470 tokens : la longueur du prefill de référence du 16/08. Un prompt court ne mesure rien —
// l'attention croît en O(n²) quand le reste croît en O(n), donc c'est la LONGUEUR qui fait la part.
const PAVE = (
  'Here is a long technical brief that must be read in full before answering. '
  + 'WebGPU exposes compute shaders to the browser, which makes it possible to run neural network '
  + 'inference locally without any server round trip. The engine loads quantized weights, uploads '
  + 'them once to GPU memory, and keeps them resident across generations so that only the KV cache '
  + 'grows over time. Attention dominates the prefill phase on small models because every query '
  + 'token must be scored against every preceding key, which is quadratic in the prompt length, '
  + 'while the matrix multiplications stay linear. Memory bandwidth, not arithmetic, is the binding '
  + 'constraint on most consumer hardware, so the winning optimizations are the ones that read less '
  + 'rather than the ones that compute less. Tiling the queries lets a single workgroup amortize one '
  + 'sweep of the key and value tensors over several query rows at once. '
).repeat(3);
const QUESTION = PAVE + '\n\nGiven all of the above, answer in exactly two short sentences: why does prompt length matter?';

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/COUPÉE|HS sur ce GPU|timestamp-query/.test(t)) console.log('  ·', t); });

const q = MODEL.includes('=') ? MODEL : `model=${encodeURIComponent(MODEL)}`;
await page.goto(`http://localhost:3618/chat?${q}&gpuprofile=1${FLAG}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 1_800_000, polling: 2000 });
console.log(`modèle prêt${FLAG ? ` (drapeau ${FLAG})` : ''} — chauffe`);

// Attendre un NOUVEAU message terminé, pas « un message terminé » : le tour précédent en laisse
// déjà un avec son « Total : » en pied, et guetter ce motif seul rend la main IMMÉDIATEMENT après
// l'envoi. Le banc filait alors avant même le prefill — d'où un rapport sans la moindre passe de
// prefill, qu'on aurait pu lire comme « le kernel n'est jamais dispatché ». On compte donc les
// messages avant l'envoi et on attend que le (n+1)-ième soit fini.
async function envoyer(texte) {
  const avant = await page.evaluate(() => document.querySelectorAll('.message.assistant').length);
  await page.fill('textarea', texte);
  await page.keyboard.press('Enter');
  for (let w = 0; w < 300; w++) {
    await page.waitForTimeout(1000);
    const done = await page.evaluate((n) => {
      const m = document.querySelectorAll('.message.assistant');
      return m.length > n && /Total\s?:/.test(m[m.length - 1]?.textContent ?? '');
    }, avant);
    if (done) return true;
  }
  return false;
}

// Le pied du dernier message porte la longueur RÉELLE du prompt vue par le moteur — la seule preuve
// que le prefill mesuré est bien celui qu'on croit mesurer.
async function longueurPrompt() {
  return await page.evaluate(() => {
    const m = document.querySelectorAll('.message.assistant');
    const txt = m[m.length - 1]?.textContent ?? '';
    return (txt.match(/Prompt:[^(]*\((\d+)\s*t/) ?? [])[1] ?? '?';
  });
}

// KVQ8=1 : bascule le cache attention en int8 (chemin des contextes longs, kernels *_q8kv). Il
// n'est PAS activable par l'URL — c'est un réglage d'interface — donc on clique le bouton, puis on
// VÉRIFIE dans le pied du message que le moteur l'a bien pris. Sans cette vérification on mesurerait
// le chemin f32 en croyant mesurer l'int8 : le piège du commutateur qui ne commute rien.
if (process.env.KVQ8 === '1') {
  // Le réglage vit dans le panneau « Advanced options (dev) », REPLIÉ par défaut : ses boutons ne
  // sont pas dans le DOM tant qu'on ne l'a pas ouvert. Chercher « KV q8 » d'emblée ne rend donc pas
  // « désactivé » mais « introuvable » — deux diagnostics très différents, d'où les deux messages.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /advanced option|options avanc/i.test(x.textContent || ''));
    b?.click();
  });
  await page.waitForTimeout(500);
  const clique = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /KV q8/i.test(x.textContent || ''));
    if (!b) return 'bouton introuvable (panneau avancé non ouvert ?)';
    if (b.disabled) return 'bouton désactivé';
    b.click();
    return 'ok';
  });
  console.log(`  cache KV int8 : ${clique}`);
  if (clique !== 'ok') { console.log('✗ impossible de basculer en KV int8 — mesure abandonnée'); await ctx.close(); process.exit(1); }
  await page.waitForTimeout(3000);
}

// Chauffe : compilation des pipelines + premier upload des poids. Facturés au prefill sinon.
await envoyer('Say hi in three words.');
if (process.env.KVQ8 === '1') {
  const pied = await page.evaluate(() => {
    const m = document.querySelectorAll('.message.assistant');
    return (m[m.length - 1]?.textContent ?? '').slice(-120);
  });
  if (!/KV int8/.test(pied)) { console.log(`✗ le moteur n'annonce PAS « KV int8 » (pied : ${pied}) — mesure abandonnée`); await ctx.close(); process.exit(1); }
  console.log('  confirmé par le moteur : KV int8 actif');
}
await page.evaluate(async () => await window.__gpuProfile(true)); // remise à zéro, valeur jetée

for (let i = 0; i < TOURS; i++) {
  const ok = await envoyer(QUESTION + ` (tour ${i})`);
  console.log(`  tour ${i + 1}/${TOURS} — prompt ${await longueurPrompt()} tokens${ok ? '' : ' — ⚠️ pas de fin détectée'}`);
  // Historique remis à zéro entre les tours : sinon le tour N préfille N × le pavé, et on
  // comparerait des longueurs de prompt différentes d'un bras à l'autre.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /nouvelle|new chat|effacer|clear/i.test(x.textContent || '' ) || /nouvelle/i.test(x.getAttribute('aria-label') || ''));
    b?.click();
  });
  await page.waitForTimeout(500);
}

const rapport = await page.evaluate(async () => await window.__gpuProfile());
if (!rapport || rapport.error) { console.log('✗', rapport?.error ?? 'hook __gpuProfile absent'); await ctx.close(); process.exit(1); }

const passes = rapport.passes ?? [];
const total = rapport.totalMs ?? passes.reduce((a, r) => a + r.totalMs, 0);
console.log(`\n${passes.length} passes distinctes · ${total.toFixed(1)} ms GPU cumulés · ${rapport.samples} tirs · ${rapport.dropped} non horodatés (quantum ${rapport.quantumUs} µs)\n`);
console.log('| kernel'.padEnd(34) + '| tirs  | part   | µs/tir  | fiable |');
console.log('|' + '-'.repeat(33) + '|-------|--------|---------|--------|');
for (const r of passes.slice(0, 12)) {
  console.log(('| ' + r.name).padEnd(34) + '| ' + String(r.calls).padEnd(6) + '| '
    + (100 * r.totalMs / total).toFixed(1).padStart(5) + ' % | ' + r.meanUs.toFixed(0).padStart(7) + ' | '
    + (r.reliable ? '  oui ' : '  NON ') + ' |');
}

// La ligne qui décide : quel qu'ait été le kernel dispatché, c'est le coût de l'attention de prefill.
// Les quatre noms possibles — f32 ou int8, ancien kernel ou tuilé. `_decode` est exclu à dessein :
// c'est l'autre phase. Un filtre trop étroit (oubli des variantes q8) rendait « aucune ligne
// d'attention de prefill » sur une mesure pourtant réussie.
const attn = passes.filter((r) => /^attention(_prefill)?(_q8kv)?$/.test(r.name));
if (!attn.length) console.log('\n⚠️ aucune ligne d\'attention de prefill — le prompt était-il assez long ?');
else for (const r of attn) {
  console.log(`\n➤ ${r.name} : ${r.meanUs.toFixed(0)} µs/tir · ${(100 * r.totalMs / total).toFixed(1)} % du GPU mesuré · ${r.calls} tirs${r.reliable ? '' : ' ⚠️ SOUS le seuil de fiabilité (50)'}`);
}

await ctx.close();
