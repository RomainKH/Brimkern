#!/usr/bin/env node
// Décodage spéculatif (MTP, Qwen 3.5) : vitesse et EXACTITUDE contre le décodage classique.
//   node scripts/bench-spec.mjs <qwen35.gguf> [--tokens=160] [--flags=?mtp=0]
// Glouton, sans pénalité : les deux bras doivent rendre le MÊME texte (seul le nombre de passes
// change). Lancer une fois avec, une fois avec --flags=?mtp=0, et comparer les empreintes.
import { build } from 'esbuild';
import { openSync, readSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path'; import { tmpdir } from 'node:os'; import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const gguf = process.argv[2];
const arg = (k, dflt) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${dflt}`).slice(k.length + 3);
const N = Number(arg('tokens', 160));
const dir = mkdtempSync(join(tmpdir(), 'spec-')); const e = join(dir, 'e.ts');
const s = (p) => JSON.stringify(join(process.cwd(), p));
writeFileSync(e, `export { WebGpuEngine } from ${s('src/lib/webgpu/kernels.ts')}; export { parseGguf } from ${s('src/lib/webgpu/ggufParser.ts')}; export { Qwen35Model } from ${s('src/lib/webgpu/qwen35Model.ts')}; export { tokenizerFromGguf } from ${s('src/lib/ggufTokenizer.ts')}; export { TransformerWebModel } from ${s('src/sdk/engineCore.ts')}; export { formatPrompt, declaredStopIds } from ${s('src/lib/chatFormat.ts')};`);
await build({ entryPoints: [e], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'o.mjs'), logLevel: 'error', external: ['https://*'] });
globalThis.location = { search: arg('flags', '') };
const M = await import(pathToFileURL(join(dir, 'o.mjs')).href);
const { create, globals } = await import('webgpu'); Object.assign(globalThis, globals);
const gpu = create([]); try { Object.defineProperty(globalThis.navigator, 'gpu', { value: gpu, configurable: true }); } catch { globalThis.navigator = { gpu }; }
const fd = openSync(gguf, 'r'); const head = Buffer.alloc(64 << 20); readSync(fd, head, 0, head.length, 0);
const man = await M.parseGguf(new Blob([head]));
const src = { bytes: async (o, l) => { const b = Buffer.alloc(l); readSync(fd, b, 0, l, o); return new Uint8Array(b.buffer, b.byteOffset, l); } };
const eng = new M.WebGpuEngine(); await eng.init(); const q = console.log; console.log = () => {}; await eng.selfValidate(); console.log = q;
const model = new M.Qwen35Model(eng, src, man); await model.prewarmGpu();
const tk = M.tokenizerFromGguf(man);
const core = new M.TransformerWebModel(eng, model, tk.tokenizer, 'qwen35', [...M.declaredStopIds(man.metadata), ...(tk.controlIds || [])]);
console.log(`MTP ${model.speculativeReady() ? 'actif' : 'INACTIF'} · flags « ${arg('flags', '')} »`);
const PROMPTS = [
  'Write a Python function that returns the n-th Fibonacci number iteratively, with a docstring.',
  'Explain in three sentences what a binary search does, then give its time complexity.',
  'Write a TypeScript function debounce(fn, ms) and show one usage example.',
];
let totTok = 0, totMs = 0;
for (const p of PROMPTS) {
  const prompt = M.formatPrompt([{ role: 'user', content: p }], 'qwen35', 'You are a concise coding assistant.');
  let n = 0, tFirst = 0; const t0 = performance.now();
  const text = await core.generateResident(prompt, N, () => { if (n++ === 0) tFirst = performance.now(); }, undefined, { sample: false, repeatPenalty: 1.0 });
  const ms = performance.now() - tFirst;
  totTok += n - 1; totMs += ms;
  const st = core.lastSpecStats;
  console.log(`${String(n).padStart(4)} tok · ${((n - 1) / (ms / 1000)).toFixed(1)} tok/s${st ? ` · acceptées ${st.accepted}/${st.drafts} (${(100 * st.accepted / Math.max(1, st.drafts)).toFixed(0)} %)` : ''} · empreinte ${createHash('sha1').update(text).digest('hex').slice(0, 10)} · ${JSON.stringify(text.slice(-50))}`);
}
console.log(`MOYENNE ${(totTok / (totMs / 1000)).toFixed(1)} tok/s (décodage, hors premier token)`);
process.exit(0);
