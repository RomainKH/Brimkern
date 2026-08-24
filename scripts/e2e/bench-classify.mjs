// LE PREMIER BANC DE PERF DU CHEMIN « CLASSE PURE » (Lfm2Model) — classify() et generate() sur
// /local-ai, A/B résident contre forward JS.
//
// Pourquoi ce banc existe : le portage résident de classify()/generate() (2026-08-24) promettait
// « le plus gros gain relatif du moteur » (classify = 100 % prefill, or le forward JS paye ~10
// submits + readbacks × NL PAR token de prompt). Aucun banc ne mesurait ces deux API — tous les
// bancs de débit visent /chat. Celui-ci mesure ET la vitesse ET la correction (la sortie doit
// rester la même : « Positive » au sentiment, l'email exact à l'extraction).
//
// Protocole : bras ALTERNÉS par rechargement de page (la leçon de bench-image.mjs : les chiffres
// absolus dérivent d'une série à l'autre, on ne compare que des bras entrelacés). Le bras témoin
// coupe le résident par ?lfm2resident=0 — même page, même modèle, même prompt. Sur chaque bras :
// un tir de chauffe NON compté (compilation des pipelines + mise en VRAM), puis TIRS tirs mesurés
// par cas. On rapporte les médianes et le ratio.
//
// Prérequis : build de PRODUCTION sur le port 3618 (npm run build && npx next start -p 3618).
// Usage : node scripts/e2e/bench-classify.mjs [tirs-par-bras] [--rounds=N]
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const TIRS = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 3);
const ROUNDS = Number((process.argv.find((a) => a.startsWith('--rounds=')) || '').slice(9) || 2);

// Les deux cas mesurés, avec leur oracle de CORRECTION (un gain de vitesse qui change la réponse
// n'est pas un gain). Entrées = les exemples par défaut de la page anglaise (/local-ai canonique).
const CAS = [
  { pill: /^Sentiment/, key: 'classify', attendu: /^Positive$/ },
  { pill: /^Extract email/, key: 'generate', attendu: /sales@brimkern\.dev/ },
];

const BRAS = [
  { nom: 'résident', url: 'http://localhost:3618/local-ai' },
  { nom: 'témoin JS', url: 'http://localhost:3618/local-ai?lfm2resident=0' },
];

const ctx = await chromium.launchPersistentContext(
  new URL('./chrome-profile', import.meta.url).pathname,
  { executablePath: EXE, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'], viewport: { width: 1280, height: 900 } },
);
const page = ctx.pages()[0] ?? await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (/erreur|error/i.test(t) && !/favicon|insights|résident COUPÉ/i.test(t)) console.log('    ·', t.slice(0, 140)); });

// Un tir : clique « Generate », attend la fin (bouton réactivé + sortie non vide), rend { ms, texte }.
// Le 1er clic d'une page charge aussi le modèle (téléchargement en cache navigateur après la 1re
// fois) — c'est pour ça que la chauffe n'est jamais comptée.
async function tirer(timeoutMs) {
  await page.click('#demo .btn-primary');
  const t0 = Date.now();
  // Fin de tir = bouton réactivé + sortie non vide… OU erreur affichée. Sans le second cas, un
  // échec de chargement ferait patienter le banc jusqu'au timeout au lieu de dire pourquoi (la
  // même leçon que sdk-rag.mjs le 2026-08-20).
  const issue = await page.waitForFunction(() => {
    const err = document.querySelector('#demo p[style*="--error"]');
    if (err && (err.textContent || '').trim()) return { erreur: err.textContent.trim().slice(0, 300) };
    const b = document.querySelector('#demo .btn-primary');
    const out = document.querySelector('[data-testid="demo-out"]');
    const txt = out ? (out.textContent || '').trim() : '';
    return (b && !b.disabled && txt && txt !== '…') ? { texte: txt } : null;
  }, null, { timeout: timeoutMs, polling: 200 }).then((h) => h.jsonValue());
  if (issue.erreur) throw new Error(`la démo affiche une erreur : ${issue.erreur}`);
  return { ms: Date.now() - t0, texte: issue.texte };
}

async function choisirCas(pill) {
  const boutons = await page.$$('#demo button');
  for (const b of boutons) { const t = (await b.textContent() || '').trim(); if (pill.test(t)) { await b.click(); return; } }
  throw new Error(`cas introuvable : ${pill}`);
}

// mesures[bras][cas] = [ms, …] ; correction[bras][cas] = true tant que toutes les sorties matchent.
const mesures = {}, sorties = {};
for (const b of BRAS) { mesures[b.nom] = {}; sorties[b.nom] = {}; for (const c of CAS) { mesures[b.nom][c.key] = []; sorties[b.nom][c.key] = []; } }

for (let round = 0; round < ROUNDS; round++) {
  for (const bras of BRAS) {
    console.log(`\n── round ${round + 1}/${ROUNDS} · bras ${bras.nom} ──`);
    await page.goto(`${bras.url}${bras.url.includes('?') ? '&' : '?'}v=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#demo textarea', { timeout: 30_000 });
    // Chauffe : le 1er tir paye le chargement du modèle (± téléchargement) + pipelines + VRAM.
    const chauffe = await tirer(900_000);
    console.log(`  chauffe (chargement + 1er tir) : ${(chauffe.ms / 1000).toFixed(1)}s`);
    for (const cas of CAS) {
      await choisirCas(cas.pill);
      // La sélection d'un cas remet l'exemple par défaut et vide la sortie — 1 tir de chauffe du cas
      // (les pipelines du chemin generate/classify diffèrent), puis TIRS tirs comptés.
      await tirer(600_000);
      for (let i = 0; i < TIRS; i++) {
        const { ms, texte } = await tirer(600_000);
        mesures[bras.nom][cas.key].push(ms);
        sorties[bras.nom][cas.key].push(texte);
        const ok = cas.attendu.test(texte);
        console.log(`  ${cas.key.padEnd(9)} ${(ms / 1000).toFixed(2)}s  ${ok ? 'ok' : `SORTIE INATTENDUE : ${texte.slice(0, 80)}`}`);
      }
    }
  }
}

const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
console.log('\n════ bilan ════');
let correct = true;
for (const cas of CAS) {
  const r = med(mesures['résident'][cas.key]), t = med(mesures['témoin JS'][cas.key]);
  const okR = sorties['résident'][cas.key].every((s) => cas.attendu.test(s));
  const okT = sorties['témoin JS'][cas.key].every((s) => cas.attendu.test(s));
  if (!okR || !okT) correct = false;
  console.log(`${cas.key.padEnd(9)} résident ${(r / 1000).toFixed(2)}s · JS ${(t / 1000).toFixed(2)}s · ×${(t / r).toFixed(2)}  ` +
    `(sorties : résident ${okR ? 'ok' : 'KO'}, témoin ${okT ? 'ok' : 'KO'})`);
}
await ctx.close();
// Le banc échoue si une SORTIE est fausse (la vitesse est un rapport, pas un verdict).
process.exit(correct ? 0 : 1);
