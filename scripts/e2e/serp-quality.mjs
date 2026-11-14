// Banc QUALITÉ de l'extension : quel modèle répond juste à partir des extraits d'une vraie page
// Google ? Il rejoue la réponse EXACTE de l'extension (packages/extension/src/answer.ts, même
// moteur, même retrait du code distant) sur les pages capturées par serp-capture.mjs.
//
// Ce que le banc juge seul (et ce qu'il ne juge pas) :
//   - fait attendu présent dans la réponse (ATTENDU, une expression par requête) — compté
//     seulement si les extraits le contiennent : sinon la page ne permettait pas de répondre ;
//   - langue de la réponse = langue de la recherche ; fuite du métier « boutique » du LoRA Shop ;
//     refus ; temps de réponse (modèle chargé) et temps de chargement.
//   Un fait présent n'est PAS une réponse juste (« scattering … » peut entourer une explication
//   fausse) : les réponses sont écrites dans le fichier de résultats pour une lecture humaine.
//
// Usage :
//   node scripts/e2e/serp-capture.mjs                  # une fois (vraies pages Google)
//   node scripts/e2e/serp-quality.mjs [--models=a,b] [--passes=2]
// Pas de serveur : la page du banc est servie par interception sur http://localhost:3618 pour
// réutiliser le cache de modèles du profil partagé des bancs. ⚠️ Une seule page WebGPU à la fois.
import { chromium } from 'playwright-core';
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CHROME } from './chrome.mjs';
import { sansCodeDistant } from '../../packages/extension/sans-code-distant.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CAPTURES = process.env.SERP_CAPTURES || fileURLToPath(new URL('./serp-captures', import.meta.url));
const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1] ?? d;

// Candidats : tous déjà chargés par le moteur ailleurs (site, SDK). Octets = taille du fichier.
const MODELES = {
  'lfm2.5-230m': { url: 'lfm2.5-230m', label: 'LFM2.5 230M' },
  'qwen3-0.6b-shop': { url: 'qwen3-0.6b-shop', label: 'Qwen3 0.6B Shop (LoRA)' },
  'qwen3-0.6b': { url: 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/23749fefcc72300e3a2ad315e1317431b06b590a/Qwen3-0.6B-Q8_0.gguf', label: 'Qwen3 0.6B (base, Q8)' },
  'llama-3.2-1b': { url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/067b946cf014b7c697f3654f621d577a3e3afd1c/Llama-3.2-1B-Instruct-Q4_K_M.gguf', label: 'Llama 3.2 1B' },
  'qwen2.5-1.5b': { url: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/91cad51170dc346986eccefdc2dd33a9da36ead9/qwen2.5-1.5b-instruct-q4_k_m.gguf', label: 'Qwen2.5 1.5B' },
  'gemma-2-2b': { url: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/855f67caed130e1befc571b52bd181be2e858883/gemma-2-2b-it-Q4_K_M.gguf', label: 'Gemma 2 2B' },
};

// Le fait clé attendu, écrit AVANT de lire les réponses. Il ne compte que si les extraits de la
// page capturée le contiennent (sinon le modèle ne pouvait pas le donner).
const ATTENDU = {
  'fr-eiffel': /330/,
  'fr-lyon': /5[0-3]\d[\s  .,]?\d{3}/,
  'fr-miserables': /hugo/i,
  'fr-australie': /canberra/i,
  'fr-chat': /\b(1[2-9]|20)\b/,
  'fr-ebullition': /\b9[2-4]\b/,
  'fr-mont-blanc': /4[\s  .]?80\d/,
  'fr-lune': /38[0-5][\s  .,]?\d{3}/,
  'fr-bouilloire': /vinaigre|acide citrique|citron|bicarbonate/i,
  'fr-vin': /\bsel\b|bicarbonate|eau gazeuse|vinaigre|savon|lait|vin blanc|percarbonate/i,
  'fr-oeuf': /\b(9|10|11|12)\b ?(à \d+ ?)?min/i,
  'fr-passeport': /mairie|ANTS|pré-demande|rendez-vous|timbre fiscal/i,
  'fr-ciel': /diffus|rayleigh|longueur d.onde/i,
  'fr-feuilles': /chlorophylle/i,
  'en-everest': /8,?84[89]|29,0[0-3]\d/,
  'en-telephone': /\bbell\b/i,
  'en-bones': /\b206\b/,
  'en-boiling': /\b212\b/,
  'en-berlin': /1989/,
  'en-rust': /vinegar|wd-?40|degreaser|baking soda|lemon|steel wool|citric|brush/i,
  'en-egg': /\b(9|1[0-5])\b ?(to|-|–)? ?(\d+ )?min/i,
  'en-sky': /scatter|rayleigh|wavelength/i,
  'en-vaccines': /immun|antibod/i,
  'en-seasons': /tilt|axis/i,
};
const FUITE_BOUTIQUE = /aider pour autre chose|autre question|help (you )?with anything else|anything else I can|notre boutique|our (shop|store)|votre commande|your order/i;
const REFUS = /pas cette information|ne (sais|dispose) pas|do not have (that|this) information|don.t have (that|this) information|cannot (answer|help)/i;
const langue = (s) => {
  const fr = (s.match(/\b(le|la|les|des|est|une|et|du|pour|dans|qui|avec|sont)\b/gi) || []).length;
  const en = (s.match(/\b(the|is|and|of|to|in|for|that|with|are|it)\b/gi) || []).length;
  return fr === en ? '?' : fr > en ? 'fr' : 'en';
};

const queries = JSON.parse(readFileSync(new URL('./serp-queries.json', import.meta.url), 'utf8'));
const pages = queries.filter((q) => existsSync(path.join(CAPTURES, `${q.id}.json`)))
  .map((q) => JSON.parse(readFileSync(path.join(CAPTURES, `${q.id}.json`), 'utf8')))
  .filter((p) => p.results.length);
if (!pages.length) throw new Error('aucune capture : lancer d’abord node scripts/e2e/serp-capture.mjs');
const modeles = arg('models', Object.keys(MODELES).join(',')).split(',');
const passes = Number(arg('passes', '2'));

// Format du prompt : celui que l'extension livre (ANSWER_FORMAT) sauf --prompt=sdk|web.
const format = arg('prompt', '');
const entry = `
import { createSession, preload } from ${JSON.stringify(path.join(ROOT, 'src/sdk/index.ts'))};
import { buildAnswer, ANSWER_FORMAT } from ${JSON.stringify(path.join(ROOT, 'packages/extension/src/answer.ts'))};
const FORMAT = ${JSON.stringify(format)} || ANSWER_FORMAT;
window.__bk = {
  format: FORMAT,
  async load(model) { const t0 = performance.now(); const ok = await preload({ model, worker: false }); return { ok, ms: performance.now() - t0 }; },
  async run(model, results, query, lang) {
    const a = buildAnswer(model, query, results, lang, FORMAT);
    const s = createSession(a.config);
    let sources = a.docs || [];
    const t0 = performance.now();
    try {
      const text = await s.ask(a.text, { onSources: a.docs ? undefined : (x) => { sources = x.map((y) => y.doc); } });
      return { text, ms: performance.now() - t0, sources };
    } catch (e) { return { error: String(e && e.message || e), ms: performance.now() - t0, sources }; }
    finally { s.destroy(); }
  },
};`;
const bundle = (await esbuild.build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'js' }, bundle: true, format: 'iife', write: false,
  target: ['chrome116'], logLevel: 'error', plugins: [sansCodeDistant], tsconfig: path.join(ROOT, 'tsconfig.json'),
  define: { 'process.env.NODE_ENV': '"production"', '__BRIMKERN_VERSION__': '"bench"' },
})).outputFiles[0].text;
const HTML = `<!doctype html><meta charset="utf-8"><title>serp-quality</title><script>${bundle.replace(/<\/script/g, '<\\/script')}</script>`;

const ctx = await chromium.launchPersistentContext(fileURLToPath(new URL('./chrome-profile', import.meta.url)), {
  executablePath: CHROME, headless: true, args: ['--enable-unsafe-webgpu', '--use-angle=metal'],
});
await ctx.route('http://localhost:3618/__serp-bench', (r) => r.fulfill({ contentType: 'text/html; charset=utf-8', body: HTML }));
const sortie = { date: new Date().toISOString(), passes, format: format || 'défaut', pages: pages.map((p) => p.id), modeles: {} };
const fichier = path.join(CAPTURES, `resultats-${sortie.date.slice(0, 16).replace(/[:T]/g, '-')}${format ? '-' + format : ''}.json`);
try {
  for (const m of modeles) {
    const def = MODELES[m];
    if (!def) throw new Error(`modèle inconnu : ${m}`);
    // Page NEUVE par modèle : le device WebGPU de la précédente (et ses poids) est rendu.
    const page = await ctx.newPage();
    await page.goto('http://localhost:3618/__serp-bench');
    const charge = await page.evaluate((u) => window.__bk.load(u), def.url);
    const res = { label: def.label, chargementMs: Math.round(charge.ms), reponses: [] };
    sortie.modeles[m] = res;
    if (!charge.ok) {
      const e = await page.evaluate(({ u, p }) => window.__bk.run(u, p.results, p.q, p.lang), { u: def.url, p: pages[0] });
      res.erreur = e.error || 'chargement impossible';
      console.log(`${def.label.padEnd(26)} ÉCHEC : ${res.erreur}`);
      await page.close();
      continue;
    }
    for (let pass = 0; pass < passes; pass++) {
      for (const p of pages) {
        const r = await page.evaluate(({ u, p }) => window.__bk.run(u, p.results, p.q, p.lang), { u: def.url, p });
        const texte = r.text || '';
        const extraits = p.results.map((x) => `${x.title} ${x.snippet}`).join(' ');
        const attendu = ATTENDU[p.id];
        res.reponses.push({
          id: p.id, kind: p.kind, lang: p.lang, pass, ms: Math.round(r.ms), texte, erreur: r.error,
          sources: r.sources.map((d) => p.results[d]?.site),
          jugeable: !!attendu && attendu.test(extraits),
          fait: !!attendu && attendu.test(texte),
          langueOk: langue(texte) === p.lang,
          fuite: FUITE_BOUTIQUE.test(texte),
          refus: REFUS.test(texte),
        });
      }
    }
    const R = res.reponses;
    const jug = R.filter((x) => x.jugeable);
    const ms = R.map((x) => x.ms).sort((a, b) => a - b);
    res.resume = {
      fait: `${jug.filter((x) => x.fait).length}/${jug.length}`,
      langue: `${R.filter((x) => x.langueOk).length}/${R.length}`,
      fuites: R.filter((x) => x.fuite).length,
      refus: R.filter((x) => x.refus).length,
      erreurs: R.filter((x) => x.erreur).length,
      medianeMs: ms[Math.floor(ms.length / 2)],
    };
    console.log(`${def.label.padEnd(26)} fait ${res.resume.fait.padEnd(6)} langue ${res.resume.langue.padEnd(6)} fuites ${res.resume.fuites}  refus ${res.resume.refus}  erreurs ${res.resume.erreurs}  médiane ${(res.resume.medianeMs / 1000).toFixed(1)} s  chargement ${(res.chargementMs / 1000).toFixed(1)} s`);
    writeFileSync(fichier, JSON.stringify(sortie, null, 2));
    await page.close();
  }
} finally {
  await ctx.close();
}
console.log(`\nRéponses complètes : ${fichier}`);
