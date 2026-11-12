// Reprise d'un téléchargement LTX-Video coupé — 4,85 Go à télécharger, dont 3,03 Go de T5 en tête :
// une coupure (onglet fermé, réseau perdu) ne doit pas faire repartir de zéro.
//
// Profil NEUF ; clic sur la carte LTX ; on coupe (navigation ailleurs) quand ~COUPE octets du T5
// sont arrivés ; on relance, et on compte ce qui est redemandé pour le T5 jusqu'à ce que le
// transformeur commence. Attendu : ≈ taille du T5 − ce qui était en cache, jamais le T5 entier.
// Les URL sont celles du BUILD servi (LTX_BRIK) : locales tant que le T5 n'est pas sur le Hub.
//
//   PORT=3619 node scripts/e2e/ltx-resume.mjs [--coupe=1500]   # Mo du T5 avant la coupure
import { chromium } from 'playwright-core';
import { rmSync } from 'node:fs';
import { CHROME as EXE, nettoyerVerrous } from './chrome.mjs';

const BASE = `http://localhost:${process.env.PORT || 3618}`;
const COUPE = Number((process.argv.find((a) => a.startsWith('--coupe=')) || '--coupe=1500').split('=')[1]) * 1e6;
const T5 = 'ltx-t5-light.brik', DIT = 'ltx-transformer-light.brik';
const T5_OCTETS = 3_034_331_120;

const PROFIL = new URL('./chrome-profile-ltx-resume', import.meta.url).pathname;
rmSync(PROFIL, { recursive: true, force: true });
nettoyerVerrous(PROFIL);
const ctx = await chromium.launchPersistentContext(PROFIL, {
  executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 },
});
const page = ctx.pages()[0] ?? await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
let t5 = 0, dit = 0;
const kind = new Map();
cdp.on('Network.requestWillBeSent', (e) => { if (e.request.url.includes(T5)) kind.set(e.requestId, 't5'); else if (e.request.url.includes(DIT)) kind.set(e.requestId, 'dit'); });
cdp.on('Network.dataReceived', (e) => { const k = kind.get(e.requestId); if (k === 't5') t5 += e.dataLength; else if (k === 'dit') dit += e.dataLength; });

async function lancer() {
  // ?vengine=ltx : la carte est masquée tant que LTX_HOSTED est faux ; la case des conditions
  // (/terms#ltx-video) conditionne le bouton.
  await page.goto(`${BASE}/chat?vengine=ltx&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Browse \/ load a model/ }).click({ timeout: 60_000 });
  const carte = page.locator('.model-card', { hasText: 'LTX-Video 2B' });
  const cgu = carte.getByRole('checkbox');
  if (await cgu.count() && !(await cgu.isChecked())) await cgu.check();
  await carte.getByRole('button', { name: /Generate in the chat/ }).click({ timeout: 60_000 });
}
const attendre = async (cond, max = 900_000) => { const t0 = Date.now(); while (!cond()) { if (Date.now() - t0 > max) return false; await new Promise((r) => setTimeout(r, 250)); } return true; };
const plagesT5 = () => page.evaluate(async (f) => {
  let n = 0, o = 0;
  for (const name of await caches.keys()) {
    const c = await caches.open(name);
    for (const k of await c.keys()) if (k.url.includes(f)) { n++; const r = await c.match(k); o += Number(r?.headers.get('Content-Length') || 0); }
  }
  return { n, o };
}, T5);

// 1. Premier essai, coupé en plein T5.
await lancer();
const coupe = await attendre(() => t5 >= COUPE);
const avant = t5;
await page.goto('about:blank');
await page.goto(`${BASE}/robots.txt`); // même origine : CacheStorage lisible
const enCache = await plagesT5();
console.log(`1. coupé à ${(avant / 1e6).toFixed(0)} Mo reçus du T5${coupe ? '' : ' (seuil jamais atteint)'} — en cache : ${enCache.n} plages, ${(enCache.o / 1e6).toFixed(0)} Mo`);

// 2. Reprise : ce qui est redemandé pour le T5 jusqu'au premier octet du transformeur.
t5 = 0; dit = 0;
await lancer();
const fini = await attendre(() => dit > 0);
const redemande = t5;
console.log(`2. reprise : ${(redemande / 1e6).toFixed(0)} Mo du T5 redemandés${fini ? '' : ' (transformeur jamais commencé)'} — attendu ≈ ${((T5_OCTETS - enCache.o) / 1e6).toFixed(0)} Mo`);
const ok = coupe && fini && enCache.o > 0 && redemande <= T5_OCTETS - enCache.o + 200e6;
console.log(ok ? '\nok   la reprise ne retélécharge que ce qui manquait' : '\nFAIL la reprise retélécharge ce qui était en cache');
await ctx.close();
rmSync(PROFIL, { recursive: true, force: true }); // plusieurs Go : ne pas les laisser derrière
process.exit(ok ? 0 : 1);
