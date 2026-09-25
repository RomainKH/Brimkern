#!/usr/bin/env node
// Banc de CODE des modèles de la CLI : pass@1, décodage glouton — la méthode des évaluations publiées
// (Claude, Qwen, Gemma…) — sur CINQ suites à sous-ensembles FIXES (détail plus bas : HumanEval,
// HumanEval+, MBPP+, TypeScript, réparation de bug). Chaque réponse est EXÉCUTÉE contre les tests
// (python3 / node) : on juge le code, pas le texte.
//
//   node scripts/bench-code.mjs --model=<clé>=<.gguf local | URL .gguf/.brik | claude:<modèle>> [--model=…]
//        [--suite=humaneval,heplus,mbppplus,ts,fix] [--n=41] [--max-tokens=2048] [--out=scripts/bench/results.json]
//   node scripts/bench-code.mjs --suite=… --selftest    # le harnais seul : références ✓, réponses fausses ✗
//
// Même moteur que la CLI (Dawn natif, SDK compilé depuis src/) mais appelé SANS la couche session :
// glouton (température 0) et SANS pénalité de répétition (la session du SDK en applique une de
// 1,3, défavorable au code, qui mesurerait le réglage plutôt que le modèle). Chaque modèle tourne
// dans son PROPRE processus : sa mémoire GPU est rendue au système avant le suivant.
// Réflexion : réglage par défaut de chaque modèle dans la CLI (Qwen 3 : /no_think ; Qwen 3.5 :
// <think> ouvert par son gabarit ; Gemma 4 : sans). Une réponse coupée au budget sans code = échec.
// On ne mesure QUE la réussite : le temps dépend de l'état de la machine (swap, autres applis) et
// ne se compare pas d'un tir à l'autre ; la vitesse se mesure à part, au calme (test-model-vs-llamacpp).

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
const SUITE_NAMES = arg('suite', 'humaneval').split(',');
const load = (f) => readFileSync(join(ROOT, 'scripts/bench', f), 'utf8').trim().split('\n').map((l) => JSON.parse(l));

// Bloc de code de la réponse : la réflexion retirée, puis le DERNIER bloc ``` du langage demandé
// (sinon le dernier bloc ```), sinon le texte brut.
function lastBlock(text, langs) {
  let t = text;
  // Fin de réflexion : </think> (Qwen, Spark…) ou </ifm|think…> (K2-Horizon).
  const ends = [...t.matchAll(/<\/(?:ifm\|)?think(?:_fast|_faster)?>/g)];
  if (ends.length) { const m = ends.at(-1); t = t.slice(m.index + m[0].length); }
  t = t.replace(/<\|channel>[\s\S]*?<channel\|>/g, '');
  const tagged = [...t.matchAll(new RegExp('```(?:' + langs + ')\\s*\\n([\\s\\S]*?)```', 'g'))].map((m) => m[1]);
  const any = [...t.matchAll(/```[\w+-]*\s*\n([\s\S]*?)```/g)].map((m) => m[1]);
  return tagged.at(-1) ?? any.at(-1) ?? t;
}
const hasDef = (code, name) => new RegExp(`def\\s+${name}\\s*\\(`).test(code);
// Ligne d'erreur utile : la première qui nomme une erreur (Node finit par « Node.js v24… », Python
// par la ligne d'exception), sinon la dernière.
const lastLine = (r) => { const ls = (r.stderr || r.error?.message || '').trim().split('\n'); return (ls.find((l) => /^\w*Error\b|^\w+Error \[/.test(l.trim())) ?? ls.at(-1)).trim(); };
function runPython(prog, timeout = 30_000) {
  const r = spawnSync('python3', ['-c', prog], { timeout, encoding: 'utf8', maxBuffer: 64 << 20 });
  return { pass: r.status === 0, err: r.status === 0 ? '' : (r.signal ? `délai dépassé (${timeout / 1000} s)` : lastLine(r)) };
}
function runNodeTs(prog, timeout = 15_000) {
  const f = join(mkdtempSync(join(tmpdir(), 'bench-ts-')), 'prog.ts');
  writeFileSync(f, prog);
  const r = spawnSync(process.execPath, ['--no-warnings', f], { timeout, encoding: 'utf8' });
  return { pass: r.status === 0, err: r.status === 0 ? '' : (r.signal ? `délai dépassé (${timeout / 1000} s)` : lastLine(r)) };
}
const PY_REPLY = 'in a single ```python code block';

// ── Suites ──────────────────────────────────────────────────────────────────────────────────────
// Chacune : sous-ensemble FIXE (scripts/bench/*.jsonl), prompt, extraction, exécution des tests.
// Aucune ne juge le texte : le code est EXÉCUTÉ (python3 / node), un échec d'exécution est un échec.
//   humaneval — HumanEval (MIT © OpenAI), 41 problèmes (un sur quatre). Le repère d'origine.
//   heplus    — HumanEval+ (EvalPlus, Apache-2.0) : MÊMES énoncés, ~80× plus de tests (cas limites,
//               grandes entrées) — démasque le code « presque juste » que HumanEval laisse passer.
//               40 problèmes : HumanEval/32 (find_zero) retiré, son test générique du jeu HF rejette
//               la référence elle-même (EvalPlus le juge à part, par poly(xs, x) ≈ 0).
//   mbppplus  — MBPP+ (EvalPlus, Apache-2.0 ; MBPP CC-BY-4.0), 40 problèmes (un sur neuf) : énoncé
//               en une phrase + un exemple d'assert, AUCUNE signature donnée.
//   ts        — MultiPL-E HumanEval-TypeScript (BSD-3), 40 problèmes : le langage des intégrateurs du
//               SDK, exécuté par node (types effacés nativement, Node ≥ 23.6).
//   fix       — HumanEvalFix (HumanEvalPack, MIT), 41 problèmes : une fonction BOGUÉE et ses tests,
//               il faut la réparer — la tâche d'un agent piloté en MCP, pas un exercice d'écriture.
const SUITES = {
  humaneval: {
    file: 'humaneval-41.jsonl', system: 'You are an expert Python programmer.',
    prompt: (p) => `Complete the following Python function. Reply with the complete function, including its signature and any imports it needs, ${PY_REPLY}.\n\n\`\`\`python\n${p.prompt}\`\`\``,
    run: (text, p) => { let c = lastBlock(text, 'python|py'); if (!hasDef(c, p.entry_point)) c = p.prompt + c; return runPython(`${c}\n\n${p.test}\ncheck(${p.entry_point})\n`, 10_000); },
  },
  heplus: {
    file: 'heplus-40.jsonl', system: 'You are an expert Python programmer.',
    prompt: (p) => SUITES.humaneval.prompt(p),
    run: (text, p) => { let c = lastBlock(text, 'python|py'); if (!hasDef(c, p.entry_point)) c = p.prompt + c; return runPython(`${c}\n\n${p.test}\ncheck(${p.entry_point})\n`); },
  },
  mbppplus: {
    file: 'mbppplus-40.jsonl', system: 'You are an expert Python programmer.',
    prompt: (p) => `${p.prompt}\nYour code should pass this test:\n${p.example}\n\nReply with the complete Python code (the function and any imports it needs) ${PY_REPLY}.`,
    run: (text, p) => runPython(`${p.imports.join('\n')}\n${lastBlock(text, 'python|py')}\n\n${p.test}\n`),
  },
  ts: {
    file: 'ts-40.jsonl', system: 'You are an expert TypeScript programmer.',
    prompt: (p) => `Complete the following TypeScript function. Reply with the complete function, including its signature, in a single \`\`\`typescript code block.\n\n\`\`\`typescript\n${p.prompt}\n\`\`\``,
    run: (text, p) => {
      let c = lastBlock(text, 'typescript|ts');
      if (!new RegExp(`function\\s+${p.entry_point}\\s*\\(`).test(c)) c = p.prompt + c;
      return runNodeTs(`${c}\n\n${p.tests}\n`);
    },
  },
  fix: {
    file: 'fix-41.jsonl', system: 'You are an expert Python programmer.',
    prompt: (p) => `The function \`${p.entry_point}\` below is buggy: it fails its tests. Fix the bug. Reply with the complete corrected function, including its signature and any imports it needs, ${PY_REPLY}.\n\n\`\`\`python\n${p.declaration}${p.buggy_solution}\`\`\`\n\nTests:\n\`\`\`python\n${p.test}\n\`\`\``,
    run: (text, p) => { let c = lastBlock(text, 'python|py'); if (!hasDef(c, p.entry_point)) c = p.declaration + c; return runPython(`${c}\n\n${p.test}\n`); },
  },
};
for (const n of SUITE_NAMES) if (!SUITES[n]) { console.error(`suite inconnue : ${n} (${Object.keys(SUITES).join(', ')})`); process.exit(2); }
const problemsOf = (name) => load(SUITES[name].file).slice(0, N);

// --selftest : le harnais contre lui-même, sans modèle. La solution de référence (quand le jeu en
// fournit une) DOIT passer ; une réponse fausse DOIT échouer (fix : la version boguée telle quelle ;
// ts, sans référence : une fonction qui rend undefined). Un harnais qui laisse tout passer ou tout
// échouer mesurerait l'extraction, pas le modèle.
if (process.argv.includes('--selftest')) {
  const wrap = (lang, c) => `Voici le code :\n\`\`\`${lang}\n${c}\n\`\`\``;
  let bad = 0;
  for (const suite of SUITE_NAMES) {
    const S = SUITES[suite];
    let ok = 0, rejected = 0, n = 0;
    for (const p of problemsOf(suite)) {
      n++;
      const good = suite === 'humaneval' ? p.prompt + p.canonical_solution : p.canonical;
      if (good !== undefined) { const r = S.run(wrap('python', good), p); if (r.pass) ok++; else console.log(`  ✗ ${suite} ${p.task_id} : la référence échoue — ${r.err}`); }
      const wrong = suite === 'fix' ? wrap('python', p.declaration + p.buggy_solution)
        : suite === 'ts' ? wrap('typescript', `${p.prompt}\n  return undefined as any;\n}`)
        : suite === 'mbppplus' ? wrap('python', `def ${p.entry_point}(*a, **k):\n    return None`)
        : wrap('python', `${p.prompt}    return None\n`);
      if (!S.run(wrong, p).pass) rejected++; else console.log(`  ⚠ ${suite} ${p.task_id} : une réponse fausse passe`);
    }
    const hasRef = suite !== 'ts';
    console.log(`${suite.padEnd(9)} ${hasRef ? `références ${ok}/${n} ✓ · ` : ''}réponses fausses rejetées ${rejected}/${n}`);
    if ((hasRef && ok !== n) || rejected !== n) bad++;
  }
  process.exit(bad ? 1 : 0);
}

// ── Référence cloud : un modèle Claude via la CLI `claude -p` (le compte de l'utilisateur) ─────
// MÊME prompt système, MÊME énoncé, MÊME extraction et MÊMES tests que les modèles locaux ; aucun
// outil (--tools ""), dossier de travail vide. Réglage par défaut du service (pas de glouton
// forcé : la CLI n'expose pas la température). Le temps mesuré inclut le réseau.
async function workerClaude(key, model) {
  const cwd = mkdtempSync(join(tmpdir(), 'bench-claude-'));
  for (const suite of SUITE_NAMES) {
    const S = SUITES[suite];
    const results = [];
    for (const p of problemsOf(suite)) {
      const r = spawnSync('claude', ['-p', S.prompt(p), '--model', model, '--system-prompt', S.system, '--tools', '', '--output-format', 'text'], { cwd, encoding: 'utf8', timeout: 300_000, input: '' });
      const { pass, err } = S.run(r.stdout || '', p);
      results.push({ task: p.task_id, pass, tokens: 0, err: r.status === 0 ? err : `claude -p : code ${r.status} ${(r.stderr || '').slice(0, 80)}`, truncated: false });
      process.stderr.write(`[${key}/${suite}] ${p.task_id.padEnd(22)} ${pass ? '✓' : '✗'}${pass ? '' : '  ' + results.at(-1).err.slice(0, 80)}\n`);
    }
    process.stdout.write(JSON.stringify({ key, suite, name: `${model} (claude -p)`, arch: 'cloud', results }) + '\n');
  }
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
export { K2hModel } from ${s('src/lib/webgpu/k2hModel.ts')};
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
  if (!/^https?:\/\//.test(src)) {
    // GGUF LOCAL : construit comme buildModel (engineCore) mais lu directement sur le disque.
    const fd = openSync(src, 'r');
    const head = Buffer.alloc(64 << 20); readSync(fd, head, 0, head.length, 0);
    const manifest = await M.parseGguf(new Blob([head]));
    const source = { bytes: async (off, len) => { const b = Buffer.alloc(len); readSync(fd, b, 0, len, off); return new Uint8Array(b.buffer, b.byteOffset, len); } };
    const engine = new M.WebGpuEngine(); await engine.init(); await engine.selfValidate();
    arch = manifest.arch === 'gemma4' ? 'gemma4' : (manifest.arch === 'qwen35' || manifest.arch === 'qwen35moe') ? 'qwen35' : manifest.arch === 'spark2_5' ? 'spark' : manifest.arch === 'k2-horizon' ? 'k2h' : manifest.arch;
    const tk = arch === 'gemma4' ? M.gemma4TokenizerFromGguf(manifest) : M.tokenizerFromGguf(manifest);
    const stops = [...M.declaredStopIds(manifest.metadata), ...(tk.eosId != null ? [tk.eosId] : []), ...(tk.controlIds || []), ...(arch === 'gemma4' ? [106, 1, 50] : [])];
    const model = arch === 'gemma4' ? new M.Gemma4Model(engine, source, manifest) : arch === 'qwen35' ? new M.Qwen35Model(engine, source, manifest) : arch === 'spark' ? new M.SparkModel(engine, source, manifest) : arch === 'k2h' ? new M.K2hModel(engine, source, manifest) : new M.CustomWebModel(engine, source, manifest);
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
  console.log = quiet;
  process.stderr.write(`[${key}] chargé · arch ${arch}\n`);

  for (const suite of SUITE_NAMES) {
    const S = SUITES[suite];
    const results = [];
    for (const p of problemsOf(suite)) {
      let user = S.prompt(p);
      // Réglage « auto » de la CLI pour Qwen 3 : sans réflexion. Clé suffixée « +think » : avec (modèles
      // de raisonnement comme X-Coder, dont c'est toute la force).
      if (((arch === 'qwen3' || arch === 'spark') && !key.endsWith('+think')) || key.endsWith('+nothink')) user += ' /no_think'; // Spark, Qwen 3.5 (+nothink) : même convention (chatFormat)
      const prompt = M.formatPrompt([{ role: 'user', content: user }], arch, S.system);
      let n = 0;
      const text = await core.generateResident(prompt, MAX_TOKENS, () => { n++; }, undefined, { sample: false, repeatPenalty: 1.0 });
      const { pass, err } = S.run(text, p);
      results.push({ task: p.task_id, pass, tokens: n, err, truncated: n >= MAX_TOKENS });
      process.stderr.write(`[${key}/${suite}] ${p.task_id.padEnd(22)} ${pass ? '✓' : '✗'} ${String(n).padStart(5)} tok${pass ? '' : '  ' + (n >= MAX_TOKENS ? '(budget épuisé) ' : '') + err.slice(0, 80)}\n`);
    }
    process.stdout.write(JSON.stringify({ key, suite, name, arch, results }) + '\n');
  }
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
    await new Promise((resolve, reject) => {
      const p = spawn(process.execPath, [fileURLToPath(import.meta.url), `--worker=${spec}`, `--n=${N}`, `--max-tokens=${MAX_TOKENS}`, `--suite=${SUITE_NAMES.join(',')}`], { stdio: ['ignore', 'pipe', 'inherit'], env: process.env });
      // Une ligne JSON par suite, écrite dès qu'elle est finie : on la sauve aussitôt (un plantage en
      // cours de route ne perd que la suite en cours).
      let buf = '';
      const flush = () => { let i; while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (line.startsWith('{')) save(JSON.parse(line)); } };
      p.stdout.on('data', (d) => { buf += d; flush(); });
      p.on('exit', (code) => { flush(); code === 0 ? resolve() : reject(new Error(`processus ${spec} : code ${code}`)); });
    });
  }
  function save(r) {
    const run = { suite: 'humaneval', ...r, date: new Date().toISOString() };
    all.runs.push(run);
    writeFileSync(OUT, JSON.stringify(all, null, 2));
    const passN = run.results.filter((x) => x.pass).length;
    const cut = run.results.filter((x) => x.truncated).length;
    console.log(`${run.key.padEnd(14)} ${run.suite.padEnd(9)} pass@1 ${passN}/${run.results.length} (${(100 * passN / run.results.length).toFixed(1)} %)${cut ? ` · ${cut} coupée(s) au budget` : ''}`);
  }
}
