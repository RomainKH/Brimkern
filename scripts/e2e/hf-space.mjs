// LE SPACE VITRINE TIENT-IL SA PROMESSE ? — le banc de `npm run build:hf-space`.
//
// Ce Space est la « preuve vivante » que les deux PR huggingface.js citeront : c'est la première
// chose qu'un mainteneur du Hub ouvrira. Le publier cassé coûte plus cher que ne pas le publier —
// et il ne passe par AUCUN chemin du site, donc aucun banc existant ne le couvre : le SDK y est
// servi en fichier statique, sans Next, sans même origine que le modèle.
//
// Le banc sert `.hf-space/` sur un port éphémère (comme flops.mjs sert sa propre page), pilote un
// vrai Chrome, charge les 149 Mo depuis le Hub et exige une VRAIE réponse. C'est long (~1 min de
// réseau la première fois) et c'est le but : c'est exactement ce que vivra le visiteur.
//
// Usage : npm run build:hf-space && node scripts/e2e/hf-space.mjs
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, rmSync } from 'node:fs';
import { extname } from 'node:path';
import { CHROME as EXE, nettoyerVerrous } from './chrome.mjs';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
const server = createServer((req, res) => {
  const nom = (req.url === '/' || !req.url) ? '/index.html' : req.url.split('?')[0];
  try {
    const buf = readFileSync(new URL(`../../.hf-space${nom}`, import.meta.url));
    res.writeHead(200, { 'Content-Type': TYPES[extname(nom)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404).end('absent'); }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const port = server.address().port;

const PROFIL = new URL('./chrome-profile-space', import.meta.url).pathname;
if (process.argv.includes('--froid')) rmSync(PROFIL, { recursive: true, force: true }); // re-télécharge les 149 Mo
nettoyerVerrous(PROFIL);
const ctx = await chromium.launchPersistentContext(PROFIL, {
  executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'],
});
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('pageerror', (e) => console.log('  · page:', String(e).slice(0, 200)));
// Une requête hors du Space ou du Hub = une dépendance CDN, et la CSP d'un Space statique la
// bloquerait. C'est le piège que le bundling du tokenizer a fermé le 2026-08-12 : on le garde fermé.
const horsSpace = [];
page.on('request', (r) => {
  const u = r.url();
  // Le Hub sert ses fichiers depuis son propre CDN (cdn.hf.co / cdn-lfs) : c'est l'hébergement des
  // poids, pas une dépendance tierce. Ce qu'on traque, c'est un jsdelivr/unpkg qui reviendrait dans
  // le bundle — la CSP d'un Space statique le bloquerait, et c'est ce que le tokenizer bundlé a fermé.
  const permis = [`http://127.0.0.1:${port}`, 'https://huggingface.co', 'https://cdn-lfs', 'https://cas-bridge', 'data:', 'blob:'];
  if (!permis.some((p) => u.startsWith(p)) && !/^https:\/\/[a-z0-9.-]+\.hf\.co\//.test(u)) horsSpace.push(u);
});

const out = [];
const t = (nom, ok, detail = '') => out.push({ nom, ok: !!ok, detail: String(detail) });

await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.Brimkern === 'object' || typeof window.Brimkern === 'function', null, { timeout: 20000 });

// ── La page, avant tout téléchargement ────────────────────────────────────────────────────────────
const html = await page.content();
// ⚠️ Une fonction ne traverse pas page.evaluate (elle revient `undefined`) : le typeof se fait DANS
// la page, sinon le test échoue toujours — y compris quand tout va bien.
t('SDK servi en local (aucun CDN tiers)', await page.evaluate(() => typeof window.Brimkern?.preload === 'function' && typeof window.Brimkern?.createSession === 'function'));
t('page en anglais', (await page.getAttribute('html', 'lang')) === 'en', await page.getAttribute('html', 'lang'));
t('nom du projet à jour', html.includes('Brimkern') && !html.includes('Le Kern'), html.includes('Le Kern') ? 'contient encore « Le Kern »' : '');
t('WebGPU disponible dans ce Chrome', await page.evaluate(() => 'gpu' in navigator));
t('avertissement WebGPU masqué', await page.evaluate(() => getComputedStyle(document.getElementById('nogpu')).display === 'none'));
t('le chiffre affiché est celui qu’on mesure', html.includes('~158 tok/s'), 'attendu ~158 tok/s (banc LFM2.5-230M)');

// ── Le chemin réel : charger, puis répondre ───────────────────────────────────────────────────────
const t0 = Date.now();
await page.click('#load');
await page.waitForSelector('#row', { state: 'visible', timeout: 15 * 60 * 1000 });
const secondes = Math.round((Date.now() - t0) / 1000);
t('modèle chargé et champ de saisie ouvert', true, `${secondes} s`);
t('le statut annonce le cache et le hors-ligne', (await page.innerText('#status')).toLowerCase().includes('offline'), await page.innerText('#status'));

await page.fill('#q', 'What is the capital of France? Answer in one short sentence.');
await page.click('#send');
// La génération est STREAMÉE : attendre un texte non vide attrape le premier token (« The capital »)
// et juge une phrase inachevée. Le vrai signal de fin est le bouton qui se réactive.
await page.waitForFunction(() => !document.getElementById('send').disabled, null, { timeout: 180000 });
const reponse = (await page.evaluate(() => [...document.querySelectorAll('.m.a')].pop().textContent)).trim();
t('vraie réponse générée', /paris/i.test(reponse), reponse.slice(0, 140));
t('aucune requête hors Space/Hub (CSP d’un Space statique)', horsSpace.length === 0, horsSpace.slice(0, 3).join(' '));

await ctx.close();
server.close();
for (const r of out) console.log(`${r.ok ? '✅' : '❌'} ${r.nom}${r.detail ? `  — ${r.detail}` : ''}`);
const ko = out.filter((r) => !r.ok);
console.log(`\n${out.length - ko.length}/${out.length}`);
process.exit(ko.length ? 1 : 0);
