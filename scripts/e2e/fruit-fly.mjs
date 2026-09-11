// BANC DE LA PAGE /fruit-fly — elle publie un chiffre, donc elle se vérifie.
//
// Ce que ce banc protège, dans l'ordre d'importance :
//   1. LE GATE. La page n'a le droit d'afficher un débit que si le kernel a retrouvé sa référence
//      CPU. Un kernel WGSL mal compilé ne lève pas d'erreur, il rend un DÉBIT — faux, publié, et
//      crédible. On vérifie donc qu'un chiffre sort ET qu'il est dans un ordre de grandeur tenable.
//   2. LE BRAS TÉMOIN. `?flybench=0` doit produire une page SANS chiffre et qui le dit. Un
//      commutateur qui ne commute rien est pire que pas de commutateur (cf. urlFlags.ts).
//   3. LE BILINGUISME. L'anglais est canonique sur /fruit-fly, le français sous /fr/fruit-fly, et
//      les nombres doivent être formatés dans la langue de la page — « 1,040 » dans l'UI française
//      est un bug au même titre qu'un libellé non traduit (règle 3).
//
// ⚠️ Le garde-fou d'ordre de grandeur est LARGE à dessein (5 à 4000 GFLOP/s). Ce banc tourne sur
// des machines qui vont du téléphone au GPU discret, et un seuil serré calé sur le Mac de
// développement transformerait ce test en détecteur de matériel plutôt qu'en détecteur de bug. Ce
// qu'on cherche à attraper est un kernel qui rend 0, l'infini, ou un nombre absurde — pas un GPU lent.
//
// Prérequis : build de PRODUCTION sur le port 3618 (npm run build && npx next start -p 3618).
//   node scripts/e2e/fruit-fly.mjs
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const BASE = 'http://localhost:3618';
const browser = await chromium.launch({
  executablePath: EXE, headless: true,
  args: ['--enable-unsafe-webgpu', '--use-angle=metal'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

const echecs = [];
const verifier = (nom, ok, detail = '') => {
  console.log(`${ok ? '  ok  ' : ' ÉCHEC'} ${nom}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs.push(nom);
};

/** Charge une page, clique « mesurer », rend le texte du panneau une fois la mesure retombée. */
async function mesurer(url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const bouton = page.locator('button', { hasText: /Measure my GPU|Mesurer mon GPU/ });
  if (!(await bouton.count())) return { texte: await page.locator('[data-flybench="result"]').innerText(), clique: false };
  await bouton.click();
  // La mesure est bornée (chauffe + calibrage + 3 tirs de ~250 ms) : 60 s couvrent large, y compris
  // un GPU lent, sans jamais laisser le banc pendre si la page reste muette.
  await page.locator('[data-flybench="result"]').filter({ hasText: /\S/ }).first().waitFor({ timeout: 60_000 });
  await page.waitForTimeout(300); // laisse le rendu se stabiliser avant de lire
  return { texte: await page.locator('[data-flybench="result"]').innerText(), clique: true };
}

// ── 1. Anglais : la mesure doit passer le gate et rendre un chiffre tenable ──────────────────────
console.log('\n/fruit-fly (anglais)');
const en = await mesurer(`${BASE}/fruit-fly?v=${Date.now()}`);
const mGflops = en.texte.match(/([\d,]+)\s*GFLOP\/s/);
verifier('un débit est affiché', !!mGflops, en.texte.split('\n')[0] || '(panneau vide)');

let gflops = null;
if (mGflops) {
  gflops = Number(mGflops[1].replace(/,/g, ''));
  verifier('le débit est dans un ordre de grandeur tenable', gflops > 5 && gflops < 4000, `${gflops} GFLOP/s`);
}

const mBalayages = en.texte.match(/([\d,]+)\s+fly brains per second/);
verifier('les balayages/s sont affichés', !!mBalayages, mBalayages ? mBalayages[1] : '');

// LA VÉRIFICATION QUI COMPTE : les deux chiffres de la page doivent être le MÊME chiffre, vu deux
// fois. 1 balayage = 250 MFLOP (2 × 125 M synapses) ; si la conversion dérive, la page raconte
// deux histoires différentes dans le même encadré.
if (gflops && mBalayages) {
  const balayages = Number(mBalayages[1].replace(/,/g, ''));
  const attendu = (gflops * 1e9) / (2 * 125e6);
  const ecart = Math.abs(balayages - attendu) / attendu;
  verifier('débit et balayages/s sont cohérents', ecart < 0.01, `${balayages} vs ${attendu.toFixed(0)} attendus`);
}

verifier('le GPU mesuré est nommé', /·/.test(en.texte), (en.texte.split('\n')[2] || '').slice(0, 70));
verifier('la dispersion des 3 tirs est affichée', /3 runs,/.test(en.texte));

// ── 2. Le bras témoin ────────────────────────────────────────────────────────────────────────────
console.log('\n/fruit-fly?flybench=0 (bras témoin)');
const off = await mesurer(`${BASE}/fruit-fly?flybench=0&v=${Date.now()}`);
verifier('aucun débit n’est affiché', !/GFLOP\/s/.test(off.texte));
verifier('la page dit pourquoi', /disabled by \?flybench=0/.test(off.texte), off.texte.trim().slice(0, 80));

// ── 3. Bilinguisme ───────────────────────────────────────────────────────────────────────────────
console.log('\n/fr/fruit-fly (français)');
const fr = await mesurer(`${BASE}/fr/fruit-fly?v=${Date.now()}`);
verifier('la page est en français', /cerveaux de mouche par seconde/.test(fr.texte), fr.texte.split('\n')[3] || '');
// Formatage localisé : le français sépare les milliers par une espace insécable, pas par une virgule.
const mFr = fr.texte.match(/([\d\s  ]+)\s*GFLOP\/s/);
verifier('les nombres sont formatés en français', !!mFr && !/,\d{3}/.test(mFr[1]), mFr ? mFr[1].trim() : '(aucun)');
verifier('aucun libellé anglais résiduel', !/fly brains per second|3 runs/.test(fr.texte));

const html = await page.content();
verifier('l’attribut lang suit la page', /<html[^>]*lang="fr"/.test(html));

await browser.close();
console.log(`\n${echecs.length ? `${echecs.length} ÉCHEC(S) : ${echecs.join(', ')}` : 'tout passe'}`);
process.exit(echecs.length ? 1 : 0);
