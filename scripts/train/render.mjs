#!/usr/bin/env node
// Conversations brutes (gen-dialogues.mjs) → exemples d'entraînement AU FORMAT EXACT DU SDK.
//
// Chaque tour assistant devient un exemple { prompt, completion } : le prompt est ce que le SDK
// enverrait au modèle à ce tour-là — prompt système + consignes, exemples épinglés, historique
// (accueil du widget compris), fiches retenues par la recherche du SDK, gabarit Qwen 3, réflexion
// coupée — composé par le code du SDK lui-même (src/sdk/prompting.ts, src/lib/chatFormat.ts),
// jamais par une copie : un écart de format apprendrait au modèle une forme qu'il ne verra pas.
//
// ⚠️ Le filtre qui compte : la recherche du SDK ne retient pas toujours la fiche que la réponse
// idéale cite. Une réponse dont un CHIFFRE n'apparaît nulle part dans ce que le modèle voit à ce
// tour lui apprendrait à inventer — exactement le défaut qu'on corrige. Ces tours sont écartés
// de l'entraînement (ils restent dans l'historique des tours suivants, comme dans une vraie
// conversation où le client a lu la réponse). Les exemples épinglés ne comptent PAS comme vus :
// un chiffre qui n'existe que là est un chiffre recopié d'un autre magasin.
// Les tours marqués `verdict: 'FAIL'` par verify-dialogues.mjs sont écartés de la même façon.
//
//   node scripts/train/render.mjs [--in=~/.cache/brimkern-train/raw.jsonl[,autre.jsonl…]] [--out=~/.cache/brimkern-train/sft]
//        [--valid=0.1]
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3).replace(/^~/, homedir());
const IN = arg('in', join(homedir(), '.cache/brimkern-train/raw.jsonl'));
const OUT = arg('out', join(homedir(), '.cache/brimkern-train/sft'));
const VALID = Number(arg('valid', 0.1));
const ARCH = 'qwen3';
// = HISTORY_WINDOW de src/sdk/engineCore.ts (non exporté : le module tire tout le moteur WebGPU).
const HISTORY_WINDOW = 12;

const dir = mkdtempSync(join(tmpdir(), 'render-'));
const entry = join(dir, 'entry.ts');
writeFileSync(entry, `export { makeSystemBuilder } from ${JSON.stringify(join(ROOT, 'src/sdk/prompting.ts'))};
export { formatPrompt, sansReflexion } from ${JSON.stringify(join(ROOT, 'src/lib/chatFormat.ts'))};`);
await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'out.mjs'), logLevel: 'error' });
const { makeSystemBuilder, formatPrompt, sansReflexion } = await import(pathToFileURL(join(dir, 'out.mjs')).href);

// Un chiffre de la réponse doit exister dans ce que le modèle voit. Normalisé : « 4,90 » = « 4.90 ».
const nombres = (s) => (s.match(/\d+(?:[.,]\d+)?/g) || []).map((n) => n.replace(',', '.'));

// Les boutiques du banc multi-domaines (scripts/e2e/boutiques-banc.json) sont RÉSERVÉES : un modèle
// entraîné dessus serait jugé sur sa mémoire.
const reservees = new Set(JSON.parse(readFileSync(join(ROOT, 'scripts/e2e/boutiques-banc.json'), 'utf8')).boutiques.map((b) => b.seed));
const toutes = IN.split(',').flatMap((f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)));
// Une graine écrite deux fois (deux générateurs sur le même fichier, ou un fichier vérifié concaténé
// à sa source) ne compte qu'une fois : la PREMIÈRE — passer les .verified.jsonl en tête de --in.
const vues = new Set();
const boutiques = toutes.filter((b) => !reservees.has(b.seed) && !vues.has(b.seed) && vues.add(b.seed));
if (toutes.length !== boutiques.length) console.log(`${toutes.length - boutiques.length} boutiques réservées au banc, exclues`);
const train = [], valid = [];
let tours = 0, ecartes = 0;
const ecarts = [];
for (const b of boutiques) {
  const s = b.store;
  const builder = makeSystemBuilder({ system: s.system, knowledge: s.knowledge, lang: s.lang });
  // ~1 boutique sur 10 en validation, par boutique entière : jamais la même boutique des deux côtés.
  // Par PAIRE de graines (⌊seed/2⌋) : la langue alterne sur la parité de la graine, et `seed % 10`
  // ne prenait que des graines paires — une validation 100 % anglaise sur 4 domaines (pilote).
  const cible = (Math.floor(b.seed / 2) % Math.round(1 / VALID) === 0) ? valid : train;
  for (const c of b.conversations) {
    // Widget : l'accueil ouvre l'historique (src/sdk/index.ts, mountWidget). Session : historique vide.
    const history = s.greeting ? [{ role: 'assistant', content: s.greeting }] : [];
    for (const t of c.turns) {
      tours++;
      const { text: augmente } = builder.userTurn(t.user);
      const envoye = [...history, { role: 'user', content: augmente }];
      const msgs = sansReflexion([...builder.pinned, ...envoye.slice(-HISTORY_WINDOW)], ARCH);
      const prompt = formatPrompt(msgs, ARCH, builder.system(t.user));
      // Ce que le modèle a le DROIT de citer : prompt système, fiches du tour, conversation — PAS les
      // exemples épinglés. Le pilote du 2026-09-28 comptait tout le prompt : le « 26,0 cm » de
      // l'exemple épinglé des tailles validait une réponse, et le LoRA a appris à le recopier
      // (banc sdk-smalltalk : « Size EU 41 is 26.0cm » à « I wear a 42 », faits 1/8 contre 5/8).
      const autorise = [builder.system(t.user), ...envoye.slice(-HISTORY_WINDOW).map((m) => m.content)].join('\n');
      const vu = nombres(autorise.replace(/,(\d)/g, '.$1'));
      const manquants = nombres(t.assistant).filter((n) => !vu.includes(n));
      if (t.verdict === 'FAIL') {
        ecartes++; // refusé par le vérificateur (verify-dialogues.mjs) : il reste dans l'historique
        if (ecarts.length < 8) ecarts.push(`${s.name} · « ${t.user} » → vérificateur : ${t.why}`);
      } else if (manquants.length) {
        ecartes++;
        if (ecarts.length < 8) ecarts.push(`${s.name} · « ${t.user} » → « ${t.assistant.slice(0, 90)} » (absent : ${manquants.join(', ')})`);
      } else {
        // Qwen 3 sous « /no_think » écrit lui-même le bloc de réflexion vide avant de répondre.
        // `autorises` / `attendus` : lus par eval-facts.py (chiffres inventés, chiffres attendus) ;
        // mlx-lm ne lit que prompt et completion.
        cible.push({ prompt, completion: `<think>\n\n</think>\n\n${t.assistant}<|im_end|>`, autorises: [...new Set(vu)], attendus: nombres(t.assistant) });
      }
      history.push({ role: 'user', content: t.user }, { role: 'assistant', content: t.assistant });
    }
  }
}
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'train.jsonl'), train.map((x) => JSON.stringify(x)).join('\n') + '\n');
writeFileSync(join(OUT, 'valid.jsonl'), valid.map((x) => JSON.stringify(x)).join('\n') + '\n');
console.log(`${boutiques.length} boutiques, ${tours} tours → ${train.length} exemples d'entraînement, ${valid.length} de validation`);
console.log(`${ecartes} tours écartés (refusés par le vérificateur, ou un chiffre absent des fiches/de la conversation) :`);
for (const e of ecarts) console.log(`  - ${e}`);
