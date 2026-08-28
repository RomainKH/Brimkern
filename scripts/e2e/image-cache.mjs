// « J'ai 1,2 Go de SD-Turbo sur le disque et l'app ne me propose rien » — le banc de ce bug.
//
// Deux surfaces, un seul défaut de fond : l'état du cache du pipeline image n'était lu nulle part
// correctement.
//  1. `imageModelCached` (source.ts) cherchait le décodeur TAESD dans le bucket des PLAGES
//     (`brik-range-v1`), alors que `cachedBuf` de diffusion/sdturbo.ts l'écrit en fichier entier dans
//     `brimkern-model-cache`. Le `match` ne pouvait donc jamais répondre : la fonction sortait sur son
//     premier `return false` et n'examinait même pas les 1,23 Go de UNet + CLIP. Elle a été fausse
//     depuis sa naissance (adba71d, 2026-08-19) — l'auto-reprise d'une conversation image n'a jamais
//     eu lieu une seule fois.
//  2. Les cartes image du navigateur de modèles n'affichaient NI « Téléchargé » NI le poids : un
//     pipeline déjà sur le disque était indistinguable d'un pipeline jamais vu.
//
// Le banc n'a besoin d'AUCUN octet de modèle : il pose des entrées de cache témoins aux clés exactes
// que le code interroge. C'est le test des LECTEURS de cache, pas du chargeur.
//
// Prérequis : build de prod servi sur 3618. Usage : node scripts/e2e/image-cache.mjs
import { chromium } from 'playwright-core';
import { rmSync } from 'node:fs';
import { CHROME as EXE, nettoyerVerrous } from './chrome.mjs';

const PROFIL = new URL('./chrome-profile-imgcache', import.meta.url).pathname;
rmSync(PROFIL, { recursive: true, force: true }); // profil NEUF : le cache doit partir vide
nettoyerVerrous(PROFIL);

const ctx = await chromium.launchPersistentContext(PROFIL, {
  executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'],
});
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('pageerror', (e) => console.log('  · page:', String(e).slice(0, 200)));

const out = [];
const t = (nom, ok, detail = '') => out.push({ nom, ok: !!ok, detail: String(detail) });

await page.goto('http://localhost:3618/chat', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.__imageCache === 'function', null, { timeout: 30000 });

// ── 1. Profil neuf : rien en cache, et les URLs testées sont bien celles du défaut desktop ────────
const vide = await page.evaluate(() => window.__imageCache());
t('profil neuf : rien en cache', !vide.unet && !vide.clip && !vide.taesd && !vide.heavy && !vide.complete, JSON.stringify(vide));
t('URL du UNet = le défaut desktop sdturbo', vide.urls.unet.endsWith('sd-turbo-unet-q8.brik'), vide.urls.unet);
t('URL du TAESD épinglée à une révision', /\/resolve\/[0-9a-f]{40}\//.test(vide.urls.taesd), vide.urls.taesd);

// ── 2. Le TAESD posé dans SON bucket est vu — c'est la régression du bucket ────────────────────────
const apresTaesd = await page.evaluate(async () => {
  const url = (await window.__imageCache()).urls.taesd;
  const full = await caches.open('brimkern-model-cache');   // là où cachedBuf écrit vraiment
  await full.put(url, new Response(new Uint8Array(8)));
  const ranges = await caches.open('brik-range-v1');
  return {
    state: await window.__imageCache(),
    // La preuve du diagnostic : l'ancien code interrogeait CE bucket-là pour cette URL.
    dansLeBucketDesPlages: !!(await ranges.match(url)),
    dansLeBucketPlein: !!(await full.match(url)),
  };
});
t('TAESD vu dans brimkern-model-cache', apresTaesd.state.taesd, JSON.stringify(apresTaesd.state));
t('TAESD absent de brik-range-v1 (ce que l’ancien code lisait)', apresTaesd.dansLeBucketPlein && !apresTaesd.dansLeBucketDesPlages,
  `plein=${apresTaesd.dansLeBucketPlein} plages=${apresTaesd.dansLeBucketDesPlages}`);
t('un TAESD seul ne suffit pas (heavy reste faux)', !apresTaesd.state.heavy && !apresTaesd.state.complete, JSON.stringify(apresTaesd.state));

// ── 3. Un fichier seulement SONDÉ ne compte pas comme téléchargé ───────────────────────────────────
// Régression trouvée par ce banc le 2026-08-28 : lire l'en-tête d'un BRIK laisse deux plages en cache,
// donc le test par PRÉFIXE d'URL (celui des tuiles texte) disait « téléchargé » pour un fichier dont
// pas un octet de poids n'était là — et c'est la vérification elle-même qui écrivait ces plages.
const sonde = await page.evaluate(async () => {
  const s = await window.__imageCache();                       // écrit les en-têtes au passage
  const c = await caches.open('brik-range-v1');
  const clefs = (await c.keys()).map((k) => k.url);
  return { state: s, entreesUnet: clefs.filter((u) => u.startsWith(s.urls.unet)).length };
});
t('l’en-tête sondé laisse bien des plages en cache', sonde.entreesUnet > 0, `${sonde.entreesUnet} entrées`);
t('mais heavy reste FAUX (aucun poids)', !sonde.state.heavy, JSON.stringify({ heavy: sonde.state.heavy, ranges: sonde.state.ranges.unet.present + '/' + sonde.state.ranges.unet.total }));

// ── 4. La carte image annonce son poids quand rien n'est téléchargé ───────────────────────────────
// L'état exact du cache est ASYNCHRONE (deux lectures d'en-tête + 70 interrogations de cache) : la
// carte s'affiche d'abord « non téléchargée » puis se corrige. Un banc qui lit tout de suite mesure
// donc l'état intermédiaire — on attend que le texte se STABILISE, ce qui teste au passage que la
// correction arrive vraiment (un badge qui n'arriverait jamais fait échouer l'assertion, pas expirer
// le banc).
const ouvrirCarte = async () => {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__imageCache === 'function', null, { timeout: 30000 });
  await page.getByRole('button', { name: /Browse \/ load a model/i }).click();
  const carte = page.locator('.model-card', { hasText: 'Stable Diffusion Turbo' }).first();
  await carte.waitFor({ timeout: 10000 });
  let precedent = '';
  for (let i = 0; i < 12; i++) {
    const courant = (await carte.innerText()).replace(/\s+/g, ' ');
    if (i && courant === precedent) return courant;
    precedent = courant;
    await page.waitForTimeout(700);
  }
  return precedent;
};
const avant = await ouvrirCarte();
t('carte non téléchargée : le poids annoncé', avant.includes('1.29 GB'), avant.slice(0, 160));
t('carte non téléchargée : pas de badge « Downloaded »', !avant.includes('Downloaded'), avant.slice(0, 160));

// ── 5. Les deux BRIK INTÉGRALEMENT en cache → la carte le dit ─────────────────────────────────────
// On pose une entrée témoin à CHACUNE des clés du plan (46 shards pour le UNet, 25 pour le CLIP) —
// les clés viennent de imageBrikRangeStatus, donc du même code que le lecteur : le banc ne peut pas
// se tromper de convention de nommage, et il ne télécharge pas un octet de poids.
const seme = await page.evaluate(async () => {
  const s = await window.__imageCache();
  const c = await caches.open('brik-range-v1');
  for (const k of [...s.ranges.unet.keys, ...s.ranges.clip.keys]) await c.put(k, new Response(new Uint8Array(4)));
  return await window.__imageCache();
});
t('plan semé → heavy et complete deviennent vrais', seme.heavy && seme.complete,
  JSON.stringify({ unet: `${seme.ranges.unet.present}/${seme.ranges.unet.total}`, clip: `${seme.ranges.clip.present}/${seme.ranges.clip.total}`, heavy: seme.heavy }));
const apres = await ouvrirCarte();
t('carte téléchargée : badge « Downloaded »', apres.includes('Downloaded'), apres.slice(0, 160));
t('carte téléchargée : le poids cède la place', !apres.includes('1.29 GB'), apres.slice(0, 160));

// ── 6. La carte VIDÉO : même motif, même correctif ────────────────────────────────────────────────
const carteVideo = async () => {
  const c = page.locator('.model-card', { hasText: /Video lab|Labo vid/ }).first();
  await c.waitFor({ timeout: 10000 });
  let precedent = '';
  for (let i = 0; i < 12; i++) {
    const courant = (await c.innerText()).replace(/\s+/g, ' ');
    if (i && courant === precedent) return courant;
    precedent = courant;
    await page.waitForTimeout(700);
  }
  return precedent;
};
const vidAvant = await carteVideo();
t('carte vidéo : le poids exact annoncé', vidAvant.includes('1.53 GB'), vidAvant.slice(0, 200));
t('carte vidéo : pas de badge « Downloaded »', !vidAvant.includes('Downloaded'), vidAvant.slice(0, 200));

const vidSeme = await page.evaluate(async () => {
  const v = await window.__videoCache();
  const c = await caches.open('brik-range-v1');
  for (const k of [...v.ranges.unet.keys, ...v.ranges.motion.keys, ...v.ranges.clip.keys]) await c.put(k, new Response(new Uint8Array(4)));
  return await window.__videoCache();
});
t('vidéo : plan semé → heavy vrai', vidSeme.heavy, JSON.stringify({ unet: `${vidSeme.ranges.unet.present}/${vidSeme.ranges.unet.total}`, motion: `${vidSeme.ranges.motion.present}/${vidSeme.ranges.motion.total}`, clip: `${vidSeme.ranges.clip.present}/${vidSeme.ranges.clip.total}` }));
t('vidéo : le TAESD mis en cache par videoGen compte', vidSeme.taesd && vidSeme.complete, JSON.stringify({ taesd: vidSeme.taesd, complete: vidSeme.complete }));

await ouvrirCarte();
const vidApres = await carteVideo();
t('carte vidéo téléchargée : badge « Downloaded »', vidApres.includes('Downloaded'), vidApres.slice(0, 200));
t('carte vidéo téléchargée : l’avertissement ne réclame plus le téléchargement', vidApres.includes('Already downloaded') && !vidApres.includes('1.53 GB'), vidApres.slice(0, 200));

// ── 7. La carte VISION annonce son poids (2,98 Go), sans badge ────────────────────────────────────
const vision = (await page.locator('.model-card', { hasText: 'Qwen2-VL 2B' }).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
t('carte vision : poids annoncé', vision.includes('2.98 GB'), vision.slice(0, 200));
t('carte vision : aucun badge de cache (mmproj sans notion de complet)', !vision.includes('Downloaded'), vision.slice(0, 200));

// ── 8. La carte SDXS a son propre état (CLIP différent) ───────────────────────────────────────────
const sdxs = await page.locator('.model-card', { hasText: 'SDXS' }).first().innerText().catch(() => '');
t('SDXS reste non téléchargé et annonce 446 MB', sdxs.replace(/\s+/g, ' ').includes('446 MB'), sdxs.replace(/\s+/g, ' ').slice(0, 160));

await ctx.close();
const ko = out.filter((r) => !r.ok);
for (const r of out) console.log(`${r.ok ? '✅' : '❌'} ${r.nom}${r.ok ? '' : `  ← ${r.detail}`}`);
console.log(`\n${out.length - ko.length}/${out.length}`);
process.exit(ko.length ? 1 : 0);
