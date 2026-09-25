#!/usr/bin/env node
// Banc de CODE des modèles de la CLI : HumanEval, pass@1, décodage glouton — la méthode des
// évaluations publiées (Claude, Qwen, Gemma…), sur un sous-ensemble FIXE de 41 problèmes (un sur
// quatre, HumanEval/0 → /160 ; scripts/bench/humaneval-41.jsonl, MIT © OpenAI). Chaque réponse est
// EXÉCUTÉE contre les tests officiels (python3, 10 s max) : on juge le code, pas le texte.
//
//   node scripts/bench-code.mjs --model=<clé>=<.gguf local | URL .gguf/.brik | claude:<modèle>> [--model=…] [--n=41]
//        [--max-tokens=2048] [--out=scripts/bench/results.json]
//
// Même moteur que la CLI (Dawn natif, SDK compilé depuis src/) mais appelé SANS la couche session :
// glouton (température 0) et SANS pénalité de répétition (la session du SDK en applique une de
// 1,3, défavorable au code, qui mesurerait le réglage plutôt que le modèle). Chaque modèle tourne
// dans son PROPRE processus : sa mémoire GPU est rendue au système avant le suivant.
// Réflexion : réglage par défaut de chaque modèle dans la CLI (Qwen 3 : /no_think ; Qwen 3.5 :
// <think> ouvert par son gabarit ; Gemma 4 : sans). Une réponse coupée au budget sans code = échec.
// Le temps de réflexion compte dans les secondes par problème — c'est le coût réel à l'usage.

import { build } from 'esbuild';
import { spawn, spawnSync } from 'node:child_process';
import { openSync, readSync, fstatSync, readFileSync, writeFileSync, mkdtempSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3);
const N = Number(arg('n', 41));
const MAX_TOKENS = Number(arg('max-tokens', 2048));
const OUT = arg('out', join(ROOT, 'scripts/bench/results.json'));
const WORKER = process.argv.find((a) => a.startsWith('--worker='));
const PROBLEMS = readFileSync(join(ROOT, 'scripts/bench/humaneval-41.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l)).slice(0, N);

const SYSTEM = 'You are an expert Python programmer.';
const userPrompt = (p) => `Complete the following Python function. Reply with the complete function, including its signature and any imports it needs, in a single \`\`\`python code block.\n\n\`\`\`python\n${p.prompt}\`\`\``;

// Code de la réponse : la réflexion retirée, puis le DERNIER bloc ```python (sinon le dernier bloc
// ```), sinon le texte brut. Si la fonction attendue n'y est pas définie, on la préfixe du prompt.
function extractCode(text, p) {
  let t = text;
  const endThink = t.lastIndexOf('</think>');
  if (endThink >= 0) t = t.slice(endThink + 8);
  t = t.replace(/<\|channel>[\s\S]*?<channel\|>/g, '');
  const blocks = [...t.matchAll(/```(?:python|py)?\s*\n([\s\S]*?)```/g)].map((m) => m[1]);
  let code = blocks.length ? blocks[blocks.length - 1] : t;
  if (!new RegExp(`def\\s+${p.entry_point}\\s*\\(`).test(code)) code = p.prompt + code;
  return code;
}

function runTests(code, p) {
  const prog = `${code}\n\n${p.test}\ncheck(${p.entry_point})\n`;
  const r = spawnSync('python3', ['-c', prog], { timeout: 10_000, encoding: 'utf8' });
  return { pass: r.status === 0, err: r.status === 0 ? '' : (r.stderr || r.error?.message || '').trim().split('\n').slice(-1)[0] };
}

// ── Référence cloud : un modèle Claude via la CLI `claude -p` (le compte de l'utilisateur) ─────
// MÊME prompt système, MÊME énoncé, MÊME extraction et MÊMES tests que les modèles locaux ; aucun
// outil (--tools ""), dossier de travail vide. Réglage par défaut du service (pas de glouton
// forcé : la CLI n'expose pas la température). Le temps mesuré inclut le réseau.
async function workerClaude(key, model) {
  const cwd = mkdtempSync(join(tmpdir(), 'bench-claude-'));
  const results = [];
  for (const p of PROBLEMS) {
    const ts = performance.now();
    const r = spawnSync('claude', ['-p', userPrompt(p), '--model', model, '--system-prompt', SYSTEM, '--tools', '', '--output-format', 'text'], { cwd, encoding: 'utf8', timeout: 300_000, input: '' });
    const sec = (performance.now() - ts) / 1000;
    const text = r.stdout || '';
    const { pass, err } = runTests(extractCode(text, p), p);
    results.push({ task: p.task_id, pass, tokens: 0, seconds: Number(sec.toFixed(2)), err: r.status === 0 ? err : `claude -p : code ${r.status} ${(r.stderr || '').slice(0, 80)}`, truncated: false });
    process.stderr.write(`[${key}] ${p.task_id.padEnd(14)} ${pass ? '✓' : '✗'} ${sec.toFixed(1).padStart(6)} s${pass ? '' : '  ' + results.at(-1).err.slice(0, 80)}\n`);
  }
  process.stdout.write(JSON.stringify({ key, name: `${model} (claude -p)`, arch: 'cloud', loadS: 0, results, tokPerSec: 0 }) + '\n');
  process.exit(0);
}

// ── Processus de travail : UN modèle, tous les problèmes ─────────────────────────────────────────
async function worker(spec) {
  const [key, src] = [spec.slice(0, spec.indexOf('=')), spec.slice(spec.indexOf('=') + 1)];
  if (src.startsWith('claude:')) return workerClaude(key, src.slice(7));
  const dir = mkdtempSync(join(tmpdir(), 'bench-code-'));
  const entry = join(dir, 'entry.ts');
  const s = (p) => JSON.stringify(join(ROOT, p));
  writeFileSync(entry, `export { WebGpuEngine } from ${s('src/lib/webgpu/kernels.ts')};
export { parseGguf } from ${s('src/lib/webgpu/ggufParser.ts')};
export { CustomWebModel } from ${s('src/lib/webgpu/model.ts')};
export { Gemma4Model } from ${s('src/lib/webgpu/gemma4Model.ts')};
export { SparkModel } from ${s('src/lib/webgpu/sparkModel.ts')};
export { Qwen35Model } from ${s('src/lib/webgpu/qwen35Model.ts')};
export { gemma4TokenizerFromGguf } from ${s('src/lib/gemma4Tokenizer.ts')};
export { tokenizerFromGguf } from ${s('src/lib/ggufTokenizer.ts')};
export { TransformerWebModel, getModel } from ${s('src/sdk/engineCore.ts')};
export { formatPrompt, declaredStopIds } from ${s('src/lib/chatFormat.ts')};`);
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'out.mjs'), logLevel: 'error', external: ['https://*'] });
  globalThis.location = { search: process.env.BRIMKERN_FLAGS || '' };
  const M = await import(pathToFileURL(join(dir, 'out.mjs')).href);
  const { create, globals } = await import('webgpu');
  Object.assign(globalThis, globals);
  const gpu = create([]);
  try { Object.defineProperty(globalThis.navigator, 'gpu', { value: gpu, configurable: true }); } catch { globalThis.navigator = { gpu }; }
  const quiet = console.log; console.log = () => {};

  let core, arch, name;
  const t0 = performance.now();
  if (!/^https?:\/\//.test(src)) {
    // GGUF LOCAL : construit comme buildModel (engineCore) mais lu directement sur le disque.
    const fd = openSync(src, 'r');
    const head = Buffer.alloc(64 << 20); readSync(fd, head, 0, head.length, 0);
    const manifest = await M.parseGguf(new Blob([head]));
    const source = { bytes: async (off, len) => { const b = Buffer.alloc(len); readSync(fd, b, 0, len, off); return new Uint8Array(b.buffer, b.byteOffset, len); } };
    const engine = new M.WebGpuEngine(); await engine.init(); await engine.selfValidate();
    arch = manifest.arch === 'gemma4' ? 'gemma4' : manifest.arch === 'qwen35' ? 'qwen35' : manifest.arch === 'spark2_5' ? 'spark' : manifest.arch;
    const tk = arch === 'gemma4' ? M.gemma4TokenizerFromGguf(manifest) : M.tokenizerFromGguf(manifest);
    const stops = [...M.declaredStopIds(manifest.metadata), ...(tk.eosId != null ? [tk.eosId] : []), ...(tk.controlIds || []), ...(arch === 'gemma4' ? [106, 1, 50] : [])];
    const model = arch === 'gemma4' ? new M.Gemma4Model(engine, source, manifest) : arch === 'qwen35' ? new M.Qwen35Model(engine, source, manifest) : arch === 'spark' ? new M.SparkModel(engine, source, manifest) : new M.CustomWebModel(engine, source, manifest);
    await model.prewarmGpu();
    core = new M.TransformerWebModel(engine, model, tk.tokenizer, arch, stops);
    name = `${manifest.metadata['general.name'] || key} (${(fstatSync(fd).size / 1e9).toFixed(2)} Go, GGUF)`;
  } else {
    // URL (preset BRIK/GGUF) : chemin du SDK, plages HTTP en cache disque (même cache que la CLI).
    installDiskCache();
    ({ core } = await M.getModel(src));
    arch = core.arch;
    name = `${key} (${src.split('/').pop()})`;
  }
  const loadS = (performance.now() - t0) / 1000;
  console.log = quiet;
  process.stderr.write(`[${key}] chargé en ${loadS.toFixed(1)} s · arch ${arch}\n`);

  const results = [];
  let genTokens = 0, genSeconds = 0;
  for (const p of PROBLEMS) {
    let user = userPrompt(p);
    // Réglage « auto » de la CLI pour Qwen 3 : sans réflexion. Clé suffixée « +think » : avec (modèles
    // de raisonnement comme X-Coder, dont c'est toute la force).
    if ((arch === 'qwen3' || arch === 'spark') && !key.endsWith('+think')) user += ' /no_think'; // Spark : même convention (chatFormat)
    const prompt = M.formatPrompt([{ role: 'user', content: user }], arch, SYSTEM);
    let n = 0;
    const ts = performance.now();
    const text = await core.generateResident(prompt, MAX_TOKENS, () => { n++; }, undefined, { sample: false, repeatPenalty: 1.0 });
    const sec = (performance.now() - ts) / 1000;
    genTokens += n; genSeconds += sec;
    const code = extractCode(text, p);
    const { pass, err } = runTests(code, p);
    results.push({ task: p.task_id, pass, tokens: n, seconds: Number(sec.toFixed(2)), err, truncated: n >= MAX_TOKENS });
    process.stderr.write(`[${key}] ${p.task_id.padEnd(14)} ${pass ? '✓' : '✗'} ${String(n).padStart(5)} tok ${sec.toFixed(1).padStart(6)} s${pass ? '' : '  ' + (n >= MAX_TOKENS ? '(budget épuisé) ' : '') + err.slice(0, 80)}\n`);
  }
  process.stdout.write(JSON.stringify({ key, name, arch, loadS, results, tokPerSec: genTokens / genSeconds }) + '\n');
  process.exit(0);
}

// Cache disque des plages HTTP pour le chemin SDK (copie de initDiskCache de bin/brimkern.mjs).
function installDiskCache() {
  const base = process.env.XDG_CACHE_HOME || join(homedir(), '.cache');
  const cacheDir = join(base, 'brimkern', 'ranges');
  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
  const file = (key) => join(cacheDir, createHash('sha256').update(key).digest('hex') + '.bin');
  const disk = {
    async match(key) { const f = file(key); if (!existsSync(f)) return null; const b = readFileSync(f); return new Response(b, { headers: { 'Content-Length': String(b.byteLength) } }); },
    async put(key, resp) { writeFileSync(file(key), Buffer.from(await resp.arrayBuffer())); },
  };
  globalThis.caches = { async open() { return disk; } };
}

if (WORKER) {
  await worker(WORKER.slice(9));
} else {
  const specs = process.argv.filter((a) => a.startsWith('--model=')).map((a) => a.slice(8));
  if (!specs.length) { console.error('usage : node scripts/bench-code.mjs --model=<clé>=<chemin|URL> [--model=…]'); process.exit(2); }
  const all = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { problems: N, maxTokens: MAX_TOKENS, runs: [] };
  for (const spec of specs) {
    const out = await new Promise((resolve, reject) => {
      const p = spawn(process.execPath, [fileURLToPath(import.meta.url), `--worker=${spec}`, `--n=${N}`, `--max-tokens=${MAX_TOKENS}`], { stdio: ['ignore', 'pipe', 'inherit'], env: process.env });
      let buf = '';
      p.stdout.on('data', (d) => { buf += d; });
      p.on('exit', (code) => (code === 0 ? resolve(buf.trim().split('\n').pop()) : reject(new Error(`processus ${spec} : code ${code}`))));
    });
    const run = { ...JSON.parse(out), date: new Date().toISOString() };
    all.runs.push(run);
    writeFileSync(OUT, JSON.stringify(all, null, 2));
    const passN = run.results.filter((r) => r.pass).length;
    const secs = run.results.map((r) => r.seconds).sort((a, b) => a - b);
    console.log(`${run.key.padEnd(14)} pass@1 ${passN}/${run.results.length} (${(100 * passN / run.results.length).toFixed(1)} %) · médiane ${secs[secs.length >> 1].toFixed(1)} s/problème${run.tokPerSec ? ` · ${run.tokPerSec.toFixed(1)} tok/s · chargement ${run.loadS.toFixed(1)} s` : ''}`);
  }
}
