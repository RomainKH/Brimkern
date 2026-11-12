// Intégrité des poids et cache des presets épinglés (2026-11-12) — le banc du lot A du § 29.
//
// Deux promesses du durcissement, vérifiées dans un vrai Chrome sur un build de production :
//  1. ÉPINGLAGE SANS RETÉLÉCHARGEMENT. Les presets GGUF tiers sont passés de `/resolve/main/` à un SHA
//     de commit ; leurs plages déjà en cache restent rangées sous l'ancienne clé (src/lib/hfCacheKey.ts).
//     On charge le modèle par son URL `main` (= un cache d'avant l'épinglage), on le rouvre par la même
//     URL (bras TÉMOIN), puis par son URL épinglée : celle-ci ne doit rien retélécharger (< 64 Ko reçus).
//  2. EMPREINTES PAR SHARD. Un .brik qui porte `shards[].sha256` se charge et répond ; le même avec un
//     octet altéré dans une couche est REFUSÉ avec un message lisible — pas chargé avec des poids faux.
//
// Prérequis : build de prod servi (PORT, défaut 3618) + les .brik de test, fabriqués à partir du
// 230M publié par `node scripts/e2e/integrity-briks.cjs <dossier>` (après `npm run test:brik`).
//   node scripts/e2e/integrity.mjs --briks=/chemin/vers/dossier
//   SEUL2=1 node scripts/e2e/integrity.mjs --briks=…   # le volet 2 seul (le 1 télécharge 255 Mo)
// Mesuré le 2026-11-12 (Mac M4) : premier chargement 255 Mo, témoin 11,6 Ko, épinglé 8,5 Ko ; .brik
// signé chargé en ~8 s et répond, octet altéré au shard 5 / 14 → refusé « intégrité du shard N ».
import { chromium } from 'playwright-core';
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CHROME as EXE, nettoyerVerrous } from './chrome.mjs';

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=') || d;
const PORT = process.env.PORT || '3618';
const BASE = `http://localhost:${PORT}`;
const BRIKS = arg('briks', '');
const FICHIER = 'gemma-3-270m-it-Q4_K_M.gguf';
const MAIN = `https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/main/${FICHIER}`;
const EPINGLE = `https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/c90975dbd40c0c7b275fefaae758c3415c906238/${FICHIER}`;

const PROFIL = new URL('./chrome-profile-integrity', import.meta.url).pathname;
rmSync(PROFIL, { recursive: true, force: true }); // profil NEUF : le cache doit partir vide
nettoyerVerrous(PROFIL);
const ctx = await chromium.launchPersistentContext(PROFIL, {
  executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1400, height: 900 },
});
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('pageerror', (e) => console.log('  · page:', String(e).slice(0, 200)));

const out = [];
const t = (nom, ok, detail = '') => { out.push({ nom, ok: !!ok }); console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${nom}${detail ? `  — ${detail}` : ''}`); };

// Octets REÇUS pendant un chargement (CDP, redirections et CDN compris) : compter les requêtes ne
// prouve rien — le Hub redirige vers un CDN, et chaque réouverture redemande ~4 Ko de toute façon
// (sonde 0-11 + une plage de 2,5 Ko, relevé du 2026-11-12, indépendant de l'épinglage).
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
let octetsHub = 0;
const versHub = new Set();
cdp.on('Network.requestWillBeSent', (e) => { if (/huggingface\.co|hf\.co|xet/.test(e.request.url) && !/tokenizer|config\.json|resolve-cache/.test(e.request.url)) versHub.add(e.requestId); });
cdp.on('Network.loadingFinished', (e) => { if (versHub.has(e.requestId)) octetsHub += e.encodedDataLength; });

// Fin de chargement = « Loaded: » / « Chargé : » dans la barre, ou un message d'erreur. PAS la zone
// de saisie : elle n'existe pas encore pendant la sonde WebGPU, puis s'active avant tout chargement.
async function pret(timeout = 600_000) {
  return page.waitForFunction(() => {
    const txt = document.body.innerText;
    return /Loaded:|Chargé\s?:/.test(txt) || /Hardware or file error|Erreur matérielle ou de fichier/.test(txt);
  }, null, { timeout, polling: 1000 });
}
const etat = () => page.evaluate(() => {
  const txt = document.body.innerText.replace(/\s+/g, ' ');
  const i = txt.search(/Hardware or file error|Erreur matérielle ou de fichier/);
  return i >= 0 ? txt.slice(i, i + 300) : (txt.match(/(Loaded|Chargé)\s?:[^|]{0,80}/) || [''])[0];
});
const texteErreur = () => page.evaluate(() => (document.body.innerText.match(/.*(?:intégrité|integrity|compromise).*/i) || [''])[0].slice(0, 220));
const chatPret = () => page.evaluate(() => /Loaded:|Chargé\s?:/.test(document.body.innerText) && !/Hardware or file error|Erreur matérielle ou de fichier/.test(document.body.innerText));

if (!process.env.SEUL2) {
  // ── 1. Préset épinglé : le cache d'avant l'épinglage resert tel quel ─────────────────────────────────
  console.log('\n1. Épinglage sans retéléchargement');
  await page.goto(`${BASE}/chat?gguf=${encodeURIComponent(MAIN)}`, { waitUntil: 'domcontentloaded' });
  await pret();
  t('chargé par l’URL /resolve/main/ (cache « d’avant »)', await chatPret(), `${(octetsHub / 1e6).toFixed(1)} Mo reçus du Hub`);
  const cles = await page.evaluate(async (f) => (await (await caches.open('brik-range-v1')).keys()).map((k) => k.url).filter((u) => u.includes(f)), FICHIER);
  t('plages rangées sous la clé /resolve/main/', cles.length > 0 && cles.every((u) => u.includes('/resolve/main/')), `${cles.length} plages`);

  // Bras TÉMOIN : la même URL `main` rouverte. Ce qu'elle reçoit encore du Hub (sondes non mises en
  // cache) n'a rien à voir avec l'épinglage ; l'URL épinglée doit rester dans le même ordre de grandeur.
  octetsHub = 0;
  await page.goto(`${BASE}/chat?gguf=${encodeURIComponent(MAIN)}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await pret();
  const temoin = octetsHub;
  t('témoin : rouvert par la même URL /resolve/main/', await chatPret(), `${(temoin / 1024).toFixed(1)} Ko reçus du Hub`);
  octetsHub = 0;
  await page.goto(`${BASE}/chat?gguf=${encodeURIComponent(EPINGLE)}&v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await pret();
  t('rechargé par l’URL épinglée', await chatPret(), await etat());
  t('… sans retéléchargement (< 64 Ko reçus, comme le témoin)', octetsHub < 64 * 1024, `${(octetsHub / 1024).toFixed(1)} Ko (témoin ${(temoin / 1024).toFixed(1)} Ko)`);
  const cles2 = await page.evaluate(async (f) => (await (await caches.open('brik-range-v1')).keys()).map((k) => k.url).filter((u) => u.includes(f)), FICHIER);
  t('… et sans doublon sous une clé épinglée', cles2.every((u) => u.includes('/resolve/main/')), `${cles2.length} plages`);
}
// ── 2. Empreintes par shard d'un .brik local ─────────────────────────────────────────────────────────
console.log('\n2. Empreintes par shard (.brik local)');
if (!BRIKS || !existsSync(join(BRIKS, 'lfm-signed.brik'))) {
  console.log('  (sauté : --briks=<dossier> manquant ou sans lfm-signed.brik)');
} else {
  for (const [fichier, doitPasser] of [['lfm-signed.brik', true], ['lfm-tampered-layer.brik', false], ['lfm-tampered.brik', false]]) {
    await page.goto(`${BASE}/chat?v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    // Le sélecteur de fichier vit dans la fenêtre « Browse / load a model ».
    await page.getByRole('button', { name: /Browse \/ load a model/ }).click({ timeout: 60_000 });
    await page.waitForSelector('#local-model-file-picker', { state: 'attached', timeout: 60_000 });
    const t0 = Date.now();
    await page.setInputFiles('#local-model-file-picker', join(BRIKS, fichier));
    // Choisir le fichier ne fait que le SÉLECTIONNER : le chargement part du bouton « Load ».
    // Chaque carte de preset a aussi son « Load » : on prend celui de la carte du fichier, voisin de « Cancel ».
    await page.locator('button[title="Cancel"]').locator('xpath=preceding-sibling::button[1]').click({ timeout: 30_000 });
    await pret(300_000);
    const ok = await chatPret();
    const err = await texteErreur();
    if (doitPasser) {
      t(`${fichier} : chargé (${((Date.now() - t0) / 1000).toFixed(1)} s)`, ok && !err, err);
      if (ok) {
        await page.fill('textarea', 'What is the capital of France? Answer in one word.');
        await page.keyboard.press('Enter');
        const rep = await page.waitForFunction(() => {
          const m = document.querySelectorAll('.message.assistant'); const l = m[m.length - 1];
          return l && /t\/s/.test(l.textContent || '') ? l.textContent : null; // ligne de stats = fin de génération
        }, null, { timeout: 120_000, polling: 1000 }).then((h) => h.jsonValue()).catch(() => '');
        const vu = rep || await page.evaluate(() => { const m = document.querySelectorAll('.message.assistant'); return `[${m.length} messages] ` + (m[m.length - 1]?.textContent || '').slice(-160); });
        t(`${fichier} : répond`, /paris/i.test(rep), String(vu).replace(/\s+/g, ' ').slice(0, 160));
      }
    } else {
      t(`${fichier} : refusé avec un message d’intégrité`, !ok && /compromise|intégrité|integrity/i.test(err), err || `état : ${await etat()}`);
    }
  }
}

await ctx.close();
const ko = out.filter((r) => !r.ok).length;
console.log(`\n${out.length - ko}/${out.length} vérifications OK`);
process.exit(ko ? 1 : 0);
