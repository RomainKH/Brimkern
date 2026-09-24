#!/usr/bin/env node
// Modèle à graphe propre (Gemma 4, Qwen 3.5) dans le moteur (Dawn natif, comme la CLI) contre
// llama.cpp, sur le MÊME GGUF local.
//
//   node scripts/test-model-vs-llamacpp.mjs <fichier.gguf> [--tokens=48] [--llama] [--long]
//
// 1. prochain token après le prompt : top-10 du moteur vs top-10 de llama-server (n_probs) ;
// 2. génération gloutonne : texte + débit, et premier écart avec llama.cpp (--llama).
// Le moteur requantifie Q4_K → int4 par groupes de 32 : les logits ne sont pas bit à bit ceux de
// llama.cpp, on juge sur le recouvrement du top-10 et l'accord glouton sur les premiers tokens.

import { build } from 'esbuild';
import { spawn, spawnSync } from 'node:child_process';
import { openSync, readSync, closeSync, fstatSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const gguf = process.argv[2];
if (!gguf) { console.error('usage : node scripts/test-model-vs-llamacpp.mjs <fichier.gguf> [--tokens=N] [--llama] [--long]'); process.exit(2); }
const N = Number((process.argv.find((a) => a.startsWith('--tokens=')) || '--tokens=48').slice(9));
const WITH_LLAMA = process.argv.includes('--llama');
// Empreinte physique du processus (GPU compris sur Apple : mémoire unifiée) via footprint(1).
const fp = (label) => {
  const r = spawnSync('footprint', ['-p', String(process.pid)], { encoding: 'utf8' });
  const m = (r.stdout || '').match(/phys_footprint:\s*([\d.]+\s*[KMG]B)/) || (r.stdout || '').match(/Footprint:\s*([\d.]+\s*[KMG]B)/);
  console.log(`  [mémoire] ${label} : ${m ? m[1] : '?'}${m ? '' : ' ' + (r.stdout || r.stderr || '').split('\n').slice(0, 3).join(' | ')}`);
};
const LONG = process.argv.includes('--long');
const LONG_CODE = LONG ? (await import('node:fs')).readFileSync(join(process.cwd(), 'src/lib/webgpu/layerSpans.ts'), 'utf8') : '';
// Gabarit par architecture (gemma4 : <|turn> ; qwen35 : ChatML + <think> ouvert, gabarit officiel).
const fmt = (arch, sys, user) => arch === 'gemma4'
  ? `<|turn>system\n${sys}<turn|>\n<|turn>user\n${user}<turn|>\n<|turn>model\n`
  : `<|im_start|>system\n${sys}<|im_end|>\n<|im_start|>user\n${user}<|im_end|>\n<|im_start|>assistant\n<think>\n`;
// --long : > 1 000 tokens, pour exercer la fenêtre glissante (512) et les positions longues du
// RoPE ; le prefill part alors par tranches de 256 comme dans le SDK (pastLen > 0, T > 1).
const userMsg = LONG ? `Explain what this TypeScript module does, function by function.\n\n\`\`\`ts\n${LONG_CODE}\n\`\`\`` : 'Write a Python function is_prime(n) that returns True if n is prime.';
const CHUNK = process.env.G4_NOCHUNK ? 1e9 : 256;
const prefill = async (m, toks, sid) => { let lg; for (let i = 0; i < toks.length; i += CHUNK) lg = await m.logitsKV(toks.slice(i, i + CHUNK), i, sid); return lg; };

const dir = mkdtempSync(join(tmpdir(), 'g4nat-'));
const entry = join(dir, 'entry.ts');
const src = (p) => JSON.stringify(join(process.cwd(), p));
writeFileSync(entry, `export { WebGpuEngine } from ${src('src/lib/webgpu/kernels.ts')};
export { parseGguf } from ${src('src/lib/webgpu/ggufParser.ts')};
export { Gemma4Model } from ${src('src/lib/webgpu/gemma4Model.ts')};
export { Qwen35Model } from ${src('src/lib/webgpu/qwen35Model.ts')};
export { gemma4TokenizerFromGguf } from ${src('src/lib/gemma4Tokenizer.ts')};
export { tokenizerFromGguf } from ${src('src/lib/ggufTokenizer.ts')};`);
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'out.mjs'), logLevel: 'error' });
// AVANT l'import : certains commutateurs sont lus à l'initialisation statique des classes.
globalThis.location = { search: process.env.BRIMKERN_FLAGS || '' };
const M = await import(pathToFileURL(join(dir, 'out.mjs')).href);

const { create, globals } = await import('webgpu');
Object.assign(globalThis, globals);
const gpu = create([]);
try { Object.defineProperty(globalThis.navigator, 'gpu', { value: gpu, configurable: true }); } catch { globalThis.navigator = { gpu }; }

const fd = openSync(gguf, 'r');
const size = fstatSync(fd).size;
const head = Buffer.alloc(64 << 20);
readSync(fd, head, 0, head.length, 0);
const manifest = await M.parseGguf(new Blob([head]));
if (process.env.G4_WINDOW && manifest.config.gemma4) manifest.config.gemma4.window = Number(process.env.G4_WINDOW);
const source = { bytes: async (off, len) => { const b = Buffer.alloc(len); readSync(fd, b, 0, len, off); return new Uint8Array(b.buffer, b.byteOffset, len); } };
const ARCH = manifest.arch;
const tok = (M.gemma4TokenizerFromGguf(manifest) ?? M.tokenizerFromGguf(manifest)).tokenizer;
const PROMPT = fmt(ARCH, 'You are a concise coding assistant.', userMsg);
const STOPS = ARCH === 'gemma4' ? [106, 1] : [Number(manifest.metadata['tokenizer.ggml.eos_token_id'])];

const engine = new M.WebGpuEngine();
if (!(await engine.init())) throw new Error('WebGPU indisponible');
const quiet = console.log; console.log = () => {};
await engine.selfValidate();
console.log = quiet;
if (ARCH === 'gemma4' && !engine.gemma4Ok) throw new Error('gate gemma4Ok tombé');
if (ARCH === 'qwen35' && !engine.qwen35SsmOk) throw new Error('gate qwen35SsmOk tombé');
if (!engine.attnWideOk) console.log('⚠️ attention large KO : repli un-thread-par-tête');
fp('après selfValidate');
console.log(`GGUF ${(size / 1e9).toFixed(2)} Go · ${manifest.config.blockCount} couches · selfValidate OK`);

const model = ARCH === 'gemma4' ? new M.Gemma4Model(engine, source, manifest) : new M.Qwen35Model(engine, source, manifest);
let t0 = performance.now();
await model.prewarmGpu();
console.log(`poids en VRAM : ${((performance.now() - t0) / 1000).toFixed(1)} s`);
fp('après chargement');
for (let i = 0; i < 3; i++) { engine.device.queue.submit([engine.device.createCommandEncoder().finish()]); await engine.device.queue.onSubmittedWorkDone(); await new Promise((r) => setTimeout(r, 300)); }
fp('après chargement + 1 s de répit');

const ids = tok.encode(PROMPT);
const softmaxTop = (logits, k) => {
  let mx = -Infinity; for (const v of logits) if (v > mx) mx = v;
  let s = 0; const p = new Float32Array(logits.length); for (let i = 0; i < logits.length; i++) { p[i] = Math.exp(logits[i] - mx); s += p[i]; }
  return [...p.keys()].sort((a, b) => p[b] - p[a]).slice(0, k).map((i) => ({ id: i, p: p[i] / s }));
};
t0 = performance.now();
let logits = await prefill(model, ids, 'test');
const tPrefill = performance.now() - t0;
const top = softmaxTop(logits, 10);
console.log(`prefill ${ids.length} tokens : ${(tPrefill / 1000).toFixed(2)} s`);
console.log('top-10 moteur :', top.map((t) => `${JSON.stringify(tok.decode([t.id]))} ${(t.p * 100).toFixed(1)}%`).join(' · '));

const gen = [];
let next = top[0].id;
t0 = performance.now();
for (let s = 0; s < N; s++) {
  gen.push(next);
  if (STOPS.includes(next)) break;
  logits = await model.logitsKV([next], ids.length + s, 'test');
  let best = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[best]) best = i;
  next = best;
}
const tDec = performance.now() - t0;
console.log(`décodage : ${gen.length} tokens en ${(tDec / 1000).toFixed(2)} s → ${(gen.length / (tDec / 1000)).toFixed(1)} tok/s`);
fp('après génération');
if (engine.profiler) {
  const rep = await engine.profiler.report();
  const rows = (rep.rows || rep.passes || rep.entries || []);
  console.log('--- profil GPU par kernel (surestime les passes courtes : sert à choisir quoi regarder) ---');
  for (const r of rows.slice(0, 14)) console.log('  ' + JSON.stringify(r));
}
console.log('--- sortie moteur ---\n' + tok.decode(gen) + '\n---');

if (WITH_LLAMA) {
  const port = 18000 + Math.floor(Math.random() * 1000);
  const srv = spawn('llama-server', ['-m', gguf, '--port', String(port), '-ngl', '99', '-c', '4096', '--log-disable', ...(process.env.LLAMA_ARGS || '').split(' ').filter(Boolean)], { stdio: 'ignore' });
  try {
    for (let i = 0; i < 120; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/health`); if (r.ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
    const r = await fetch(`http://127.0.0.1:${port}/completion`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt: ids, n_predict: gen.length, temperature: 0, top_k: 1, n_probs: 10, cache_prompt: false }) });
    const j = await r.json();
    const ref = j.completion_probabilities || [];
    const refTop = (ref[0]?.top_logprobs || ref[0]?.probs || []).map((t) => ({ id: t.id, p: t.logprob !== undefined ? Math.exp(t.logprob) : t.prob }));
    console.log('top-10 llama.cpp :', refTop.map((t) => `${JSON.stringify(tok.decode([t.id]))} ${(t.p * 100).toFixed(1)}%`).join(' · '));
    const ov = top.filter((t) => refTop.some((r) => r.id === t.id)).length;
    const refIds = ref.map((c) => c.id);
    let agree = 0; while (agree < Math.min(refIds.length, gen.length) && refIds[agree] === gen[agree]) agree++;
    console.log(`recouvrement top-10 : ${ov}/10 · accord glouton : ${agree}/${Math.min(refIds.length, gen.length)} premiers tokens`);
    console.log('--- sortie llama.cpp ---\n' + (j.content || '') + '\n---');
    // Forçage : on rejoue la séquence de llama.cpp dans le moteur. À chaque pas, notre 1er choix
    // est-il le sien ? Un écart isolé entre deux candidats proches = requantification ; des écarts
    // qui s'accumulent avec la position = un défaut du graphe (fenêtre, RoPE, cache partagé…).
    const probsOf = (lg) => { let mx = -Infinity; for (const v of lg) if (v > mx) mx = v; let s = 0; for (const v of lg) s += Math.exp(v - mx); return (id) => Math.exp(lg[id] - mx) / s; };
    let hits = 0; const misses = [];
    let lg = await prefill(model, ids, 'force');
    for (let s = 0; s < refIds.length; s++) {
      let best = 0; for (let i = 1; i < lg.length; i++) if (lg[i] > lg[best]) best = i;
      const P = probsOf(lg);
      if (best === refIds[s]) hits++; else misses.push(`pas ${s} : nous ${JSON.stringify(tok.decode([best]))} ${(P(best) * 100).toFixed(1)}% / llama.cpp ${JSON.stringify(tok.decode([refIds[s]]))} ${(P(refIds[s]) * 100).toFixed(1)}% chez nous`);
      if (s + 1 < refIds.length) lg = await model.logitsKV([refIds[s]], ids.length + s, 'force');
    }
    console.log(`forçage sur la séquence llama.cpp : ${hits}/${refIds.length} premiers choix identiques`);
    for (const m of misses) console.log('   ' + m);
  } finally { srv.kill('SIGKILL'); }
}
closeSync(fd);
model.unload();
process.exit(0);
