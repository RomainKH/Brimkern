// RÉSOLUTION D'ENTRÉE DU ViT — combien coûte, et combien rapporte, une image plus grande.
//
// Pourquoi ce banc existe : le côté maximal de l'image envoyée au ViT (`?vismax=`) était passé de
// 448 à 896 px « pour le texte et les UI », sans mesure. Or le coût est QUADRATIQUE — les tokens
// visuels valent (côté/28)² après fusion, donc ×4 — et ils entrent dans le préfill du LLM comme
// n'importe quel token. Un défaut sur cet axe se décide avec deux chiffres : le temps, et si la
// réponse s'améliore VRAIMENT.
//
// La mire est générée dans la page (canvas) : du texte de tailles décroissantes, dont on sait
// exactement ce qu'il dit. Une transcription se note donc automatiquement, sans juge humain.
//
// Prérequis : build de PRODUCTION sur le port 3618 (npm run build && npx next start -p 3618).
// Usage : node scripts/e2e/vision-res.mjs [448,896,672]
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const BRAS = (process.argv[2] ?? '448,896').split(',').map(Number);
const QUESTION = 'Transcribe every line of text visible in this image, in order.';
// Les lignes de la mire, de la plus grosse à la plus petite. Le score = combien sont retrouvées.
const LIGNES = ['BRIMKERN', 'WEBGPU 2026', 'local inference', 'tiny text 42'];

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1300, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
const journal = [];
page.on('console', (m) => {
  const t = m.text();
  journal.push(t);
  if (/\[vision\] image|grille|tokens/.test(t)) console.log('    ·', t.slice(0, 150));
});

// Mire : 768×768, fond clair, quatre lignes de tailles décroissantes (72 → 13 px).
const MIRE = `(() => {
  const c = document.createElement('canvas'); c.width = 768; c.height = 768;
  const x = c.getContext('2d');
  x.fillStyle = '#f5f2ea'; x.fillRect(0, 0, 768, 768);
  x.fillStyle = '#111'; x.textBaseline = 'top';
  const lignes = ${JSON.stringify(LIGNES)};
  const tailles = [72, 40, 22, 13];
  let y = 90;
  lignes.forEach((l, i) => { x.font = '700 ' + tailles[i] + 'px sans-serif'; x.fillText(l, 70, y); y += tailles[i] + 46; });
  return c.toDataURL('image/png');
})()`;

async function chargerVision(vismax) {
  await page.goto(`http://localhost:3618/chat?vismax=${vismax}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  let ok = false;
  for (let essai = 0; essai < 40 && !ok; essai++) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /browse|parcourir/i.test(x.textContent || ''));
      b?.click();
    });
    await page.waitForTimeout(1000);
    ok = await page.evaluate(() => {
      const carte = [...document.querySelectorAll('.model-card')].find((c) => /Qwen2-VL/.test(c.textContent || ''));
      const b = carte?.querySelector('button');
      if (!b || b.disabled) return false;
      b.click();
      return true;
    });
  }
  if (!ok) throw new Error('pipeline vision non chargeable (carte Qwen2-VL introuvable ou désactivée)');
  await page.waitForFunction(() => { const ta = document.querySelector('textarea'); return ta && !ta.disabled; }, null, { timeout: 1_800_000, polling: 2000 });
}

// Joint la mire via l'input fichier du composer, puis pose la question.
async function demander(question) {
  const dataUrl = await page.evaluate(MIRE);
  const octets = Buffer.from(dataUrl.split(',')[1], 'base64');
  const input = await page.$('input[type="file"][accept*="image"]');
  if (!input) throw new Error('input fichier image introuvable');
  await input.setInputFiles({ name: 'mire.png', mimeType: 'image/png', buffer: octets });
  await page.waitForTimeout(600);
  const avant = await page.evaluate(() => document.querySelectorAll('.message.assistant').length);
  await page.fill('textarea', question);
  await page.keyboard.press('Enter');
  const t0 = Date.now();
  // Fin de génération : le texte ne bouge plus depuis 3 s ET ne ressemble plus à une ligne de
  // progression (« Encoding the image… »). Se fier à un indicateur de frappe donnait 0,5 s et le
  // libellé de progression pour réponse.
  const PROGRES = /Encoding the image|Preparing the image|Pré-traitement|Encodage de l|Prefill|Préfill|patches/i;
  let texte = '', stable = 0;
  for (let w = 0; w < 1800; w++) {
    await page.waitForTimeout(500);
    const txt = await page.evaluate((n) => {
      const msgs = [...document.querySelectorAll('.message.assistant')];
      return msgs.length <= n ? '' : (msgs[msgs.length - 1].textContent ?? '');
    }, avant);
    if (txt === texte && texte.length > 3 && !PROGRES.test(texte)) { if (++stable >= 6) break; }
    else stable = 0;
    texte = txt;
  }
  return { texte, ms: Date.now() - t0 };
}

console.log(`\nmire ${LIGNES.length} lignes (72→13 px) · question : « ${QUESTION} »`);
const resultats = [];
for (const vismax of BRAS) {
  console.log(`\n── vismax=${vismax} ─────────────────────────────`);
  journal.length = 0;
  await chargerVision(vismax);
  const { texte, ms } = await demander(QUESTION);
  const grille = journal.find((l) => /\[vision\] image/.test(l)) ?? '(pas de trace)';
  const tokens = Number(grille.match(/→ (\d+) tokens/)?.[1] ?? 0);
  const trouvees = LIGNES.filter((l) => texte.toLowerCase().includes(l.toLowerCase()));
  resultats.push({ vismax, ms, tokens, trouvees: trouvees.length, texte });
  console.log(`  ${grille.replace('[vision] ', '')}`);
  console.log(`  ${(ms / 1000).toFixed(1)} s · ${trouvees.length}/${LIGNES.length} lignes retrouvées : ${trouvees.join(', ') || '—'}`);
  console.log(`  réponse : ${texte.replace(/\s+/g, ' ').slice(0, 220)}`);
}

console.log('\n── bilan ───────────────────────────────────────');
for (const r of resultats) {
  console.log(`  vismax=${String(r.vismax).padEnd(5)} ${String(r.tokens).padStart(5)} tokens visuels  ${(r.ms / 1000).toFixed(1).padStart(6)} s  ${r.trouvees}/${LIGNES.length} lignes`);
}
if (resultats.length === 2) {
  const [a, b] = resultats;
  const facteurT = b.ms / a.ms, facteurTok = b.tokens / (a.tokens || 1);
  console.log(`\n  ${b.vismax} vs ${a.vismax} : ×${facteurTok.toFixed(1)} tokens, ×${facteurT.toFixed(2)} temps, ${b.trouvees - a.trouvees >= 0 ? '+' : ''}${b.trouvees - a.trouvees} ligne(s) lue(s)`);
  console.log(b.trouvees > a.trouvees ? '  → la résolution supérieure lit plus : elle se paie.' : '  → aucune ligne de plus : le surcoût ne rapporte rien sur cette mire.');
}
await ctx.close();
