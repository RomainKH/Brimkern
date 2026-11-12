// Accessibilité (axe-core) d'une liste de pages, en vrai Chrome sur un build de production.
// La règle 3 d'AGENTS.md exige 0 violation sur toute page nouvelle ; ce banc vivait en dossier de
// session et s'était perdu — réécrit le 2026-11-12, versionné cette fois.
//
//   node scripts/e2e/axe.mjs /changelog /fr/changelog          # pages telles quelles
//   node scripts/e2e/axe.mjs /chat /fr/chat --browse            # + fenêtre « Browse / load a model » ouverte
//   PORT=3619 node scripts/e2e/axe.mjs …                        # autre port que 3618
//
// Sortie : violations par page (règle, impact, nombre de nœuds, premier sélecteur) ; code 1 s'il y en a.
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { CHROME as EXE } from './chrome.mjs';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = `http://localhost:${process.env.PORT || 3618}`;
const pages = process.argv.slice(2).filter((a) => a.startsWith('/'));
const browse = process.argv.includes('--browse');
if (!pages.length) { console.error('usage : node scripts/e2e/axe.mjs /page [/autre] [--browse]'); process.exit(2); }

const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'] });
let total = 0;
for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  if (browse) {
    await page.getByRole('button', { name: /Browse \/ load a model|Parcourir \/ charger un modèle/ }).click({ timeout: 60_000 });
    await page.waitForTimeout(1500); // sonde GPU et cache : les pastilles arrivent après l'ouverture
  }
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations
    .map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, cible: v.nodes[0]?.target?.join(' ') })));
  total += res.length;
  console.log(`${res.length ? 'FAIL' : 'ok  '} ${path}${browse ? ' (fenêtre des modèles)' : ''} — ${res.length} violation(s)`);
  for (const v of res) console.log(`       ${v.id} [${v.impact}] ×${v.n} — ${String(v.cible).slice(0, 120)}`);
  await page.close();
}
await browser.close();
process.exit(total ? 1 : 0);
