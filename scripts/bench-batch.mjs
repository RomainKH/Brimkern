#!/usr/bin/env node
// Appels PAR LOTS (TransformerWebModel.generateBatch) contre les mêmes prompts un par un.
//   node scripts/bench-batch.mjs [URL .brik/.gguf] [--n=4] [--tokens=128]
// Glouton, sans pénalité. Mesure le débit TOTAL (tokens de toutes les séquences / temps) et la
// concordance des textes (les kernels multi-lignes n'additionnent pas dans le même ordre que le
// GEMV à une ligne : un écart sur une quasi-égalité est possible, pas une dérive).
import { build } from 'esbuild';
import { writeFileSync, mkdtempSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path'; import { tmpdir, homedir } from 'node:os'; import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik';
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3);
const N = Number(arg('n', 4)), TOK = Number(arg('tokens', 128));
const dir = mkdtempSync(join(tmpdir(), 'batch-')); const e = join(dir, 'e.ts');
const s = (p) => JSON.stringify(join(process.cwd(), p));
writeFileSync(e, `export { getModel } from ${s('src/sdk/engineCore.ts')}; export { formatPrompt } from ${s('src/lib/chatFormat.ts')};`);
await build({ entryPoints: [e], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'o.mjs'), logLevel: 'error', external: ['https://*'] });
globalThis.location = { search: arg('flags', '') };
const base = process.env.XDG_CACHE_HOME || join(homedir(), '.cache');
const cacheDir = join(base, 'brimkern', 'ranges'); if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
const file = (k) => join(cacheDir, createHash('sha256').update(k).digest('hex') + '.bin');
globalThis.caches = { async open() { return { async match(k) { const f = file(k); return existsSync(f) ? new Response(readFileSync(f)) : null; }, async put(k, r) { writeFileSync(file(k), Buffer.from(await r.arrayBuffer())); } }; } };
const M = await import(pathToFileURL(join(dir, 'o.mjs')).href);
const { create, globals } = await import('webgpu'); Object.assign(globalThis, globals);
const gpu = create([]); try { Object.defineProperty(globalThis.navigator, 'gpu', { value: gpu, configurable: true }); } catch { globalThis.navigator = { gpu }; }
const q = console.log; console.log = () => {};
const { core } = await M.getModel(URL_);
console.log = q;
console.log(`modèle ${URL_.split('/').pop()} · arch ${core.arch} · lots ${core.batchAvailable() ? 'disponibles' : 'INDISPONIBLES'}`);
const QS = ['Write a Python function that reverses a linked list.', 'What does the JavaScript "use strict" directive do?', 'Write a SQL query that returns the 5 most recent orders per customer.', 'Explain the difference between a process and a thread in two sentences.', 'Write a bash one-liner that counts lines in all .ts files.', 'What is a closure in JavaScript? Give a tiny example.', 'Write a Rust function that returns the maximum of a slice of i32.', 'Explain what a mutex is in one sentence.'].slice(0, N);
const prompts = QS.map((x) => M.formatPrompt([{ role: 'user', content: x + (core.arch === 'qwen3' ? ' /no_think' : '') }], core.arch, 'You are a concise coding assistant.'));
const opts = { sample: false, repeatPenalty: 1.0 };
await core.generateResident(prompts[0], 8, undefined, undefined, opts); // chauffe
let t0 = performance.now(); const seq = [];
for (const p of prompts) seq.push(await core.generateResident(p, TOK, undefined, undefined, opts));
const tSeq = (performance.now() - t0) / 1000;
t0 = performance.now();
const bat = await core.generateBatch(prompts, TOK, opts);
const tBat = (performance.now() - t0) / 1000;
const ntok = (arr) => arr.reduce((a, x) => a + x.length, 0);
let same = 0; seq.forEach((x, i) => { if (x === bat[i]) same++; else console.log(`  écart #${i} : premier caractère différent à ${[...x].findIndex((c, j) => c !== bat[i][j])} / ${x.length}`); });
console.log(`un par un : ${tSeq.toFixed(1)} s · en lot : ${tBat.toFixed(1)} s · accélération ×${(tSeq / tBat).toFixed(2)} (préremplissages compris) · textes identiques ${same}/${N} · ${ntok(seq)} / ${ntok(bat)} caractères`);
process.exit(0);
