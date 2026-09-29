#!/usr/bin/env node
// VÉRIFICATEUR des conversations brutes — un second `claude -p` relit chaque boutique et juge
// CHAQUE réponse assistant contre les fiches, avant tout entraînement.
//
// Pourquoi (pilote du 2026-09-28) : le LoRA entraîné sur les réponses de gen-dialogues.mjs
// converse mieux (juge 14/28 contre 12/28) mais lit PIRE les fiches (faits 1/8 contre 5/8) :
// « three months » pour 30 jours, « 14 days »… Les réponses d'entraînement reformulaient les
// fiches avec aisance (« a month », « two to four working days ») ; un 0.6B apprend l'aisance sans
// la précision. Le filtre numérique de render.mjs ne voit ni une unité changée ni un fait sans
// chiffre (« free returns » quand la fiche dit « returns cost €4.90 »). Ce juge-là, si.
//
// Écrit un fichier .verified.jsonl : chaque tour porte `verdict` ('PASS'|'FAIL') et `why`.
// render.mjs écarte de l'entraînement les tours FAIL (ils restent dans l'historique).
//
//   node scripts/train/verify-dialogues.mjs [--in=~/.cache/brimkern-train/raw.jsonl] [--jobs=2]
//        [--model=claude-sonnet-5]
// ⚠️ --jobs=2 par défaut : à 4 le lot 2 du 2026-09-28 a fini en 385 échecs `claude -p : code 1`,
// et c'est la machine qui a lâché ensuite.
import { spawn } from 'node:child_process';
import { readFileSync, appendFileSync, existsSync, mkdtempSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3).replace(/^~/, homedir());
const IN = arg('in', join(homedir(), '.cache/brimkern-train/raw.jsonl'));
const OUT = IN.replace(/\.jsonl$/, '.verified.jsonl');
const JOBS = Number(arg('jobs', 2));
const MODEL = arg('model', 'claude-sonnet-5');

function promptPour(b) {
  const s = b.store;
  const notes = s.knowledge.map((k) => `## ${k.title}\n${k.text}`).join('\n\n');
  const convs = b.conversations.map((c, ci) => c.turns.map((t, ti) => `[c${ci}.t${ti}] CUSTOMER: ${t.user}\n[c${ci}.t${ti}] ASSISTANT: ${t.assistant}`).join('\n')).join('\n\n');
  return `You audit training data for a SMALL (0.6B) on-website assistant. It will copy the style of these replies, so be strict.
Store notes (the ONLY allowed source of store facts):
"""${notes}"""
Operator prompt: """${s.system}"""

${convs}

For EACH assistant turn, FAIL it if ANY of these holds:
- it states a store fact not in the notes, or changes a number, unit, delay, price or condition (e.g. "a month" for "30 days", "two weeks" for "14 days", "free" when a fee exists);
- it states a fact WITHOUT the exact figure the note gives, when the figure answers the question (a paraphrase like "a few days" for "3 to 5 business days");
- it picks the wrong row of a table or list;
- it answers a factual question the notes do not cover, instead of saying it does not have that information;
- it copies or rephrases the customer's message, ignores the conversation, is in the wrong language, or uses markdown/lists/emojis.
Small talk, identity, refusals and goodbyes PASS when natural and brief.
Answer with JSON only: [{"id":"c0.t0","verdict":"PASS"|"FAIL","why":"<10 words>"}, ...]`;
}

function appeler(prompt) {
  return new Promise((resolve) => {
    const cwd = mkdtempSync(join(tmpdir(), 'verify-dialogues-'));
    const p = spawn('claude', ['-p', prompt, '--model', MODEL, '--tools', '', '--output-format', 'text'], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    const t = setTimeout(() => p.kill('SIGKILL'), 300_000);
    p.on('close', (code) => { clearTimeout(t); resolve({ code, out }); });
  });
}

const boutiques = readFileSync(IN, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const faites = new Set(existsSync(OUT) ? readFileSync(OUT, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l).seed) : []);
const file = boutiques.filter((b) => !faites.has(b.seed));
console.log(`${file.length} boutiques à vérifier (${faites.size} déjà faites) → ${OUT}`);

let pass = 0, fail = 0, ko = 0;
async function ouvrier() {
  while (file.length) {
    const b = file.shift();
    let fait = false;
    for (let essai = 0; essai < 2 && !fait; essai++) {
      const r = await appeler(promptPour(b));
      let v = null;
      try { v = JSON.parse((r.out.match(/\[[\s\S]*\]/) || [])[0]); } catch { /* relu au second essai */ }
      if (!Array.isArray(v)) { console.log(`  ✗ ${b.seed} (essai ${essai + 1}) code ${r.code}, JSON illisible`); continue; }
      const par = new Map(v.map((x) => [x.id, x]));
      let manque = 0;
      b.conversations.forEach((c, ci) => c.turns.forEach((t, ti) => {
        const x = par.get(`c${ci}.t${ti}`);
        // Un tour que le vérificateur a oublié n'est pas un PASS : on l'écarte aussi.
        t.verdict = x?.verdict === 'PASS' ? 'PASS' : 'FAIL';
        t.why = x?.why || 'non vérifié';
        if (!x) manque++;
        if (t.verdict === 'PASS') pass++; else fail++;
      }));
      appendFileSync(OUT, JSON.stringify(b) + '\n');
      fait = true;
      console.log(`  ✓ ${b.seed} ${b.store.name}${manque ? ` (${manque} tours non jugés → FAIL)` : ''}`);
    }
    if (!fait) ko++;
  }
}
await Promise.all(Array.from({ length: JOBS }, ouvrier));
console.log(`fini : ${pass} tours PASS, ${fail} FAIL, ${ko} boutiques non vérifiées`);
