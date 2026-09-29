#!/usr/bin/env node
// CORPUS EN/FR pour choisir le vocabulaire à garder (prune-vocab.py) — Wikipédia, par l'API « rows »
// de Hugging Face : des pages de 100 articles tirées à des positions RÉPARTIES dans tout le jeu (pas
// les N premiers : ils sont triés par identifiant, donc par ancienneté et par thème).
// Pourquoi pas les parquet : 420 Mo (en) + 769 Mo (fr) à télécharger et à tenir en mémoire, pour
// n'en lire qu'un pour cent. Le Mac est tombé une fois aujourd'hui.
//
//   node scripts/train/fetch-corpus.mjs [--pages=40] [--out=~/.cache/brimkern-train/corpus]
import { mkdirSync, appendFileSync, existsSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3).replace(/^~/, homedir());
const PAGES = Number(arg('pages', 40));
const OUT = arg('out', join(homedir(), '.cache/brimkern-train/corpus'));
mkdirSync(OUT, { recursive: true });

for (const lang of ['en', 'fr']) {
  const f = join(OUT, `wiki-${lang}.txt`);
  if (existsSync(f) && statSync(f).size > 0) { console.log(`${f} déjà là`); continue; }
  const base = `https://datasets-server.huggingface.co/rows?dataset=wikimedia/wikipedia&config=20231101.${lang}&split=train`;
  const total = (await (await fetch(`${base}&offset=0&length=1`)).json()).num_rows_total;
  let articles = 0;
  for (let p = 0; p < PAGES; p++) {
    const offset = Math.floor((p + 0.5) * (total - 100) / PAGES);
    for (let essai = 0; essai < 3; essai++) {
      const r = await fetch(`${base}&offset=${offset}&length=100`);
      if (r.ok) {
        const rows = (await r.json()).rows || [];
        appendFileSync(f, rows.map((x) => x.row.text).join('\n\n') + '\n\n');
        articles += rows.length;
        break;
      }
      await new Promise((ok) => setTimeout(ok, 2000 * (essai + 1)));
    }
  }
  console.log(`${lang} : ${articles} articles → ${f} (${(statSync(f).size / 1e6).toFixed(1)} Mo)`);
}
