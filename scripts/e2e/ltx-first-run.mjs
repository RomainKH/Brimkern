// LTX-Video de bout en bout sur un profil Chrome NEUF : premier chargement (4,85 Go depuis les URL
// du build servi), puis un clip ; ensuite le même parcours à CHAUD (même profil, page rechargée).
// C'est le « Fini quand » du lot B (ROADMAP § 29) : un navigateur vierge génère un clip, mesuré, et le
// premier chargement est mesuré À PART du chaud (le « 22 s » de la carte est un chiffre de cache chaud).
//
//   PORT=3619 node scripts/e2e/ltx-first-run.mjs [--vengine] [--garder]
//   BASE=https://brimkern.com node scripts/e2e/ltx-first-run.mjs
//
// --vengine : passe ?vengine=ltx (carte masquée tant que LTX_HOSTED est faux).
// --garder  : ne supprime pas le profil à la fin (sinon les 4,85 Go du cache sont rendus au disque).
// Octets : comptés via CDP sur les trois fichiers LTX (une redirection du Hub ne compte pas deux fois :
// seuls les corps reçus sont additionnés).
import { chromium } from 'playwright-core';
import { rmSync } from 'node:fs';
import { CHROME as EXE, nettoyerVerrous } from './chrome.mjs';

const BASE = process.env.BASE || `http://localhost:${process.env.PORT || 3618}`;
const VENGINE = process.argv.includes('--vengine');
const GARDER = process.argv.includes('--garder');
const PROMPT = 'A small orange cat walking on a sunny beach, waves in the background, cinematic';
const FICHIERS = ['ltx-t5-light.brik', 'ltx-transformer-light.brik', 'ltx-vae-decoder-q8-v2.brik'];
const PROFIL = new URL('./chrome-profile-ltx-first', import.meta.url).pathname;

rmSync(PROFIL, { recursive: true, force: true });
nettoyerVerrous(PROFIL);
const ctx = await chromium.launchPersistentContext(PROFIL, {
  executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 },
});
const page = ctx.pages()[0] ?? await ctx.newPage();
const erreurs = [];
page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => erreurs.push(String(e).slice(0, 200)));
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
const quel = new Map();
let octets = Object.fromEntries(FICHIERS.map((f) => [f, 0]));
cdp.on('Network.requestWillBeSent', (e) => { const f = FICHIERS.find((x) => e.request.url.includes(x)); if (f) quel.set(e.requestId, f); });
cdp.on('Network.dataReceived', (e) => { const f = quel.get(e.requestId); if (f) octets[f] += e.dataLength; });

const attendre = async (cond, max) => { const t0 = Date.now(); while (!(await cond())) { if (Date.now() - t0 > max) return false; await new Promise((r) => setTimeout(r, 250)); } return true; };

async function parcours(nom) {
  octets = Object.fromEntries(FICHIERS.map((f) => [f, 0]));
  await page.goto(`${BASE}/chat${VENGINE ? '?vengine=ltx' : ''}`, { waitUntil: 'domcontentloaded' });
  const browse = page.getByRole('button', { name: /Browse \/ load a model/ });
  for (let i = 0; ; i++) {
    await browse.click({ timeout: 60_000 });
    try { await page.locator('.model-card').first().waitFor({ timeout: 5_000 }); break; } catch (e) { if (i >= 8) throw e; }
  }
  const carte = page.locator('.model-card', { hasText: 'LTX-Video 2B' });
  const cgu = carte.getByRole('checkbox');
  if (await cgu.count() && !(await cgu.isChecked())) await cgu.check();
  const t0 = Date.now();
  await carte.getByRole('button', { name: /Generate in the chat/ }).click({ timeout: 30_000 });
  const charge = await attendre(async () => (await page.getByText('Video mode: LTX-Video 2B').count()) > 0
    || (await page.getByText(/Failed to load the video pipeline/).count()) > 0, 3_600_000);
  const tCharge = (Date.now() - t0) / 1000;
  if (!charge || !(await page.getByText('Video mode: LTX-Video 2B').count())) {
    console.log(`${nom} : chargement ÉCHOUÉ après ${tCharge.toFixed(0)} s`);
    return null;
  }
  const recus = { ...octets };
  const zone = page.locator('textarea.claude-chat-textarea').first();
  await zone.fill(PROMPT);
  const t1 = Date.now();
  await zone.press('Enter');
  const fini = await attendre(async () => (await page.locator('video').count()) > 0
    || (await page.getByText(/Generation error/).count()) > 0, 1_800_000);
  const tClip = (Date.now() - t1) / 1000;
  const ok = fini && (await page.locator('video').count()) > 0;
  const dims = ok ? await page.locator('video').first().evaluate((v) => new Promise((r) => {
    const lire = () => r(`${v.videoWidth}×${v.videoHeight}`);
    if (v.readyState >= 1) lire(); else v.addEventListener('loadedmetadata', lire, { once: true });
  })) : '-';
  const mo = (n) => (n / 1e6).toFixed(0);
  console.log(`${nom} : pipeline prêt en ${tCharge.toFixed(1)} s · reçus T5 ${mo(recus[FICHIERS[0]])} Mo, transformeur ${mo(recus[FICHIERS[1]])} Mo, décodeur ${mo(recus[FICHIERS[2]])} Mo`);
  console.log(`${nom} : ${ok ? `clip ${dims} en ${tClip.toFixed(1)} s (de l'envoi du prompt au clip affiché)` : `clip ÉCHOUÉ après ${tClip.toFixed(0)} s`}`);
  return { tCharge, tClip, ok };
}

const froid = await parcours('FROID');
const chaud = froid ? await parcours('CHAUD') : null;
if (erreurs.length) console.log(`erreurs console (${erreurs.length}) :\n  ${[...new Set(erreurs)].slice(0, 8).join('\n  ')}`);
await ctx.close();
if (!GARDER) rmSync(PROFIL, { recursive: true, force: true });
process.exit(froid?.ok && chaud?.ok ? 0 : 1);
