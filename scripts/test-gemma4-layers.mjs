#!/usr/bin/env node
// Gemma 4 : sortie de chaque couche (moteur) contre le dump de llama-eval-callback (l_out-N).
//   node scripts/test-gemma4-layers.mjs <gemma4.gguf> <prompt.txt> <dump llama-eval-callback>
// Compare, par couche, la somme sur tous les tokens et les 3 premières / 3 dernières valeurs des
// premières et dernières lignes — ce que le dump affiche. La première couche qui décroche est la cause.
import { build } from 'esbuild';
import { openSync, readSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const [gguf, promptFile, dumpFile] = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), 'g4lay-'));
const entry = join(dir, 'entry.ts');
const src = (p) => JSON.stringify(join(process.cwd(), p));
writeFileSync(entry, `export { WebGpuEngine } from ${src('src/lib/webgpu/kernels.ts')};
export { parseGguf } from ${src('src/lib/webgpu/ggufParser.ts')};
export { Gemma4Model } from ${src('src/lib/webgpu/gemma4Model.ts')};
export { gemma4TokenizerFromGguf } from ${src('src/lib/gemma4Tokenizer.ts')};`);
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'out.mjs'), logLevel: 'error' });
// AVANT l'import : certains commutateurs sont lus à l'initialisation statique des classes.
globalThis.location = { search: process.env.BRIMKERN_FLAGS || '' };
const M = await import(pathToFileURL(join(dir, 'out.mjs')).href);
const { create, globals } = await import('webgpu');
Object.assign(globalThis, globals);
const gpu = create([]);
try { Object.defineProperty(globalThis.navigator, 'gpu', { value: gpu, configurable: true }); } catch { globalThis.navigator = { gpu }; }

// Dump llama.cpp : blocs « l_out-N = … » suivis des lignes de valeurs puis « sum = ».
const dump = readFileSync(dumpFile, 'utf8').split('\n');
// Tous les blocs 2D nommés (première occurrence), pour la descente par étape (--layer=N).
const named = new Map();
for (let i = 0; i < dump.length; i++) {
  const m = dump[i].match(/common_debug_cb_eval:\s+(.+?) = \(f32\)/);
  if (!m || named.has(m[1])) continue;
  const rows = []; let j = i + 1;
  for (; j < dump.length && !dump[j].includes('sum =') && !dump[j].includes('common_debug_cb_eval'); j++) {
    const r = dump[j].match(/\[\s*([-\d.e+]+),\s*([-\d.e+]+),\s*([-\d.e+]+),\s*\.\.\.,\s*([-\d.e+]+),\s*([-\d.e+]+),\s*([-\d.e+]+)\s*\]/);
    if (r) rows.push(r.slice(1).map(Number));
  }
  if (dump[j]?.includes('sum =')) named.set(m[1], { rows, sum: Number(dump[j].split('=')[1]) });
}
const ref = new Map();
for (let i = 0; i < dump.length; i++) {
  const m = dump[i].match(/\s(l_out-(\d+)) = \(f32\)/);
  if (!m || ref.has(Number(m[2]))) continue;
  const rows = [];
  let j = i + 1;
  for (; j < dump.length && !dump[j].includes('sum ='); j++) {
    const r = dump[j].match(/\[\s*([-\d.e+]+),\s*([-\d.e+]+),\s*([-\d.e+]+),\s*\.\.\.,\s*([-\d.e+]+),\s*([-\d.e+]+),\s*([-\d.e+]+)\s*\]/);
    if (r) rows.push(r.slice(1).map(Number));
  }
  ref.set(Number(m[2]), { rows, sum: Number(dump[j].split('=')[1]) });
}

const fd = openSync(gguf, 'r');
const head = Buffer.alloc(64 << 20); readSync(fd, head, 0, head.length, 0);
const manifest = await M.parseGguf(new Blob([head]));
const source = { bytes: async (off, len) => { const b = Buffer.alloc(len); readSync(fd, b, 0, len, off); return new Uint8Array(b.buffer, b.byteOffset, len); } };
const tok = M.gemma4TokenizerFromGguf(manifest).tokenizer;
const engine = new M.WebGpuEngine(); await engine.init();
const q = console.log; console.log = () => {}; await engine.selfValidate(); console.log = q;
const model = new M.Gemma4Model(engine, source, manifest);
await model.prewarmGpu();
const text = readFileSync(promptFile, 'utf8').replace(/\n$/, ''); // llama.cpp retire le \n final de -f
const ids = tok.encode(text);
const LAYER = process.argv.find((a) => a.startsWith('--layer='));
if (LAYER) {
  const L = Number(LAYER.slice(8));
  const steps = await model.debugLayerSteps(ids, L);
  const T = ids.length;
  console.log(`${T} tokens · couche ${L}, étape par étape (dernière ligne : 3 premières + 3 dernières valeurs)`);
  for (const [name, { data, cols }] of steps) {
    const r = named.get(name);
    let sum = 0; for (const v of data) sum += v;
    const last = data.subarray((T - 1) * cols, T * cols);
    const mine = [last[0], last[1], last[2], last[cols - 3], last[cols - 2], last[cols - 1]];
    const first = data.subarray(0, cols);
    const mineF = [first[0], first[1], first[2], first[cols - 3], first[cols - 2], first[cols - 1]];
    if (!r) { console.log(`  ${name.padEnd(42)} (absent du dump)`); continue; }
    const theirs = r.rows[r.rows.length - 1], theirsF = r.rows[0];
    const err = Math.max(...mine.map((v, i) => Math.abs(v - theirs[i])));
    const errF = Math.max(...mineF.map((v, i) => Math.abs(v - theirsF[i])));
    console.log(`  ${name.padEnd(42)} somme ${sum.toFixed(1).padStart(11)} / ${r.sum.toFixed(1).padStart(11)} · 1re ligne écart ${errF.toFixed(4)} · dernière ${err.toFixed(4)}`);
    if (process.env.VERBOSE) console.log(`      nous  1re ${mineF.map((v) => v.toFixed(4)).join(' ')} | dern ${mine.map((v) => v.toFixed(4)).join(' ')}\n      llama 1re ${theirsF.map((v) => v.toFixed(4)).join(' ')} | dern ${theirs.map((v) => v.toFixed(4)).join(' ')}`);
  }
  process.exit(0);
}
const outs = await model.debugLayerOutputs(ids);
const d = manifest.config.d, T = ids.length;
console.log(`${T} tokens · colonne « écart » = max |nous − llama.cpp| sur les 12 valeurs affichées de la dernière ligne`);
for (let l = 0; l < outs.length; l++) {
  const r = ref.get(l); if (!r) continue;
  const x = outs[l];
  let sum = 0; for (const v of x) sum += v;
  const lastRow = x.subarray((T - 1) * d, T * d);
  const mine = [lastRow[0], lastRow[1], lastRow[2], lastRow[d - 3], lastRow[d - 2], lastRow[d - 1]];
  const theirs = r.rows[r.rows.length - 1];
  const err = Math.max(...mine.map((v, i) => Math.abs(v - theirs[i])));
  const scale = Math.max(...theirs.map(Math.abs));
  console.log(`couche ${String(l).padStart(2)} : somme nous ${sum.toFixed(1).padStart(12)} / llama ${r.sum.toFixed(1).padStart(12)} · dernière ligne écart ${err.toFixed(4)} (échelle ${scale.toFixed(3)}) ${err > 0.05 * (1 + scale) ? '◀' : ''}`);
}
process.exit(0);
