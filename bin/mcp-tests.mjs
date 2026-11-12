// Outils du serveur MCP qui touchent au disque et à l'exécution — séparés de bin/brimkern.mjs pour
// être testables sans charger de modèle (scripts/test-cli-mcp.mjs).
//
// 1. readSource : `file_path` lu CÔTÉ SERVEUR. L'agent appelant n'a plus à recopier le fichier dans
//    l'appel (des tokens payants, cf. ROADMAP § 21) ; chemin borné au dossier de travail, fichiers
//    sensibles refusés, taille plafonnée (coupure annoncée).
// 2. verifyTests : les tests générés sont EXÉCUTÉS et seuls ceux qui passent sont rendus. Le § 21 avait
//    relevé un test FAUX (`clamp(5, 2, 8)` attendu « 7 ») livré comme valide : un petit modèle écrit
//    des assertions plausibles, pas des assertions vraies. Exécution sans dépendre du framework du
//    projet : mini-shim describe/it/expect (JS/TS, Node ≥ 22.6 efface les types) ou mini-pytest.
import { readFileSync, writeFileSync, statSync, realpathSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve, sep, extname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

export const MAX_SOURCE_CHARS = 16_000; // ~4 k tokens : la place qu'un 4B peut lire ET répondre

export function readSource(args, cwd = process.cwd(), isSensitive = () => false) {
  if (args.code) return { code: String(args.code), label: args.file_path || 'snippet', path: args.file_path || null, note: '' };
  if (!args.file_path) throw new Error('Missing parameter "code" (or "file_path")');
  const root = realpathSync(cwd);
  let real;
  try { real = realpathSync(resolve(cwd, String(args.file_path))); } catch { throw new Error(`File not found: ${args.file_path}`); }
  if (real !== root && !real.startsWith(root + sep)) throw new Error(`file_path must be inside the working directory (${root})`);
  if (isSensitive(real)) throw new Error(`Refused: ${args.file_path} looks like a secret (keys, credentials, .env…)`);
  if (!statSync(real).isFile()) throw new Error(`Not a file: ${args.file_path}`);
  const full = readFileSync(real, 'utf8');
  const code = full.slice(0, MAX_SOURCE_CHARS);
  const note = full.length > MAX_SOURCE_CHARS ? `\n\n[file truncated: first ${MAX_SOURCE_CHARS} of ${full.length} characters]` : '';
  return { code, label: String(args.file_path), path: real, note };
}

export function languageOf(framework, filePath, code) {
  const fw = String(framework || '').toLowerCase();
  if (/pytest|unittest|python/.test(fw)) return 'python';
  if (/vitest|jest|mocha|node|ts|js/.test(fw)) return 'js';
  const ext = extname(filePath || '').toLowerCase();
  if (ext === '.py') return 'python';
  if (['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs', '.tsx', '.jsx'].includes(ext)) return 'js';
  return /^\s*def \w+\(|^\s*import \w+$/m.test(code) ? 'python' : 'js';
}

// Premier bloc de code d'une réponse de modèle (ou la réponse entière s'il n'y en a pas).
export function extractCode(text) {
  const m = /```[\w+-]*\n([\s\S]*?)```/.exec(text);
  return (m ? m[1] : text).trim();
}

// ── JS / TS ─────────────────────────────────────────────────────────────────────────────────────
// Appels `it(` / `test(` de premier niveau dans le source des tests, avec leur étendue exacte
// (parenthèses appariées, chaînes et commentaires sautés) : pour retirer un cas qui échoue du texte.
export function jsCaseSpans(src) {
  const spans = [];
  const re = /(^|[\s;{(])((?:it|test)(?:\.only)?)\s*\(/g;
  let m;
  while ((m = re.exec(src))) {
    const start = m.index + m[1].length;
    let i = re.lastIndex, depth = 1;
    while (i < src.length && depth > 0) {
      const c = src[i];
      if (c === '"' || c === "'" || c === '`') {
        const q = c; i++;
        while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
      } else if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
      else if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2); if (i < 0) break; i++; }
      else if (c === '(') depth++;
      else if (c === ')') depth--;
      i++;
    }
    let end = i;
    if (src[end] === ';') end++;
    // Ligne entière quand le bloc l'occupe seul : son indentation et son saut de ligne partent avec lui.
    let s = start;
    while (s > 0 && (src[s - 1] === ' ' || src[s - 1] === '\t')) s--;
    const full = s === 0 || src[s - 1] === '\n';
    let e = end;
    while (e < src.length && (src[e] === ' ' || src[e] === '\t')) e++;
    if (full && (e === src.length || src[e] === '\n')) spans.push({ start: s, end: Math.min(e + 1, src.length) });
    else spans.push({ start, end });
    re.lastIndex = end;
  }
  return spans;
}

const JS_SHIM = String.raw`
const __cases = [], __prefix = [], __hooks = { beforeEach: [], afterEach: [], beforeAll: [], afterAll: [] };
const describe = (n, fn) => { __prefix.push(n); try { fn(); } finally { __prefix.pop(); } };
describe.skip = () => {}; describe.only = describe; describe.each = () => () => {};
const it = (n, fn) => { __cases.push({ name: [...__prefix, n].join(' › '), fn }); };
it.only = it; it.skip = () => {}; it.todo = () => {}; it.each = () => () => {};
const test = it;
const beforeEach = (f) => __hooks.beforeEach.push(f), afterEach = (f) => __hooks.afterEach.push(f);
const beforeAll = (f) => __hooks.beforeAll.push(f), afterAll = (f) => __hooks.afterAll.push(f);
const __fmt = (v) => { try { return typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v) ?? String(v); } catch { return String(v); } };
const __eq = (a, b) => { if (Object.is(a, b)) return true; if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false; const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => __eq(a[k], b[k])); };
const __fn = (impl = () => undefined) => { const f = (...a) => { f.mock.calls.push(a); return impl(...a); }; f.mock = { calls: [] };
  f.mockReturnValue = (v) => { impl = () => v; return f; }; f.mockImplementation = (i) => { impl = i; return f; }; return f; };
const vi = { fn: __fn, spyOn: (o, k) => { const orig = o[k]; o[k] = __fn((...a) => orig.apply(o, a)); return o[k]; } };
const jest = vi;
function expect(actual) {
  const make = (neg) => {
    const ok = (cond, msg) => { if (neg ? cond : !cond) throw new Error((neg ? 'not: ' : '') + msg); };
    const m = {
      toBe: (e) => ok(Object.is(actual, e), 'expected ' + __fmt(e) + ', received ' + __fmt(actual)),
      toEqual: (e) => ok(__eq(actual, e), 'expected ' + __fmt(e) + ', received ' + __fmt(actual)),
      toStrictEqual: (e) => ok(__eq(actual, e), 'expected ' + __fmt(e) + ', received ' + __fmt(actual)),
      toBeCloseTo: (e, d = 2) => ok(Math.abs(actual - e) < 10 ** -d / 2, 'expected ≈' + e + ', received ' + actual),
      toBeTruthy: () => ok(!!actual, 'expected truthy, received ' + __fmt(actual)),
      toBeFalsy: () => ok(!actual, 'expected falsy, received ' + __fmt(actual)),
      toBeNull: () => ok(actual === null, 'expected null, received ' + __fmt(actual)),
      toBeUndefined: () => ok(actual === undefined, 'expected undefined, received ' + __fmt(actual)),
      toBeDefined: () => ok(actual !== undefined, 'expected defined'),
      toBeNaN: () => ok(Number.isNaN(actual), 'expected NaN, received ' + __fmt(actual)),
      toBeGreaterThan: (e) => ok(actual > e, 'expected > ' + e + ', received ' + actual),
      toBeGreaterThanOrEqual: (e) => ok(actual >= e, 'expected >= ' + e + ', received ' + actual),
      toBeLessThan: (e) => ok(actual < e, 'expected < ' + e + ', received ' + actual),
      toBeLessThanOrEqual: (e) => ok(actual <= e, 'expected <= ' + e + ', received ' + actual),
      toBeInstanceOf: (c) => ok(actual instanceof c, 'expected instance of ' + (c && c.name)),
      toContain: (e) => ok(actual != null && actual.includes(e), 'expected to contain ' + __fmt(e)),
      toHaveLength: (n) => ok(actual != null && actual.length === n, 'expected length ' + n + ', received ' + (actual && actual.length)),
      toMatch: (r) => ok(typeof actual === 'string' && (r instanceof RegExp ? r.test(actual) : actual.includes(r)), 'expected to match ' + r),
      toHaveProperty: (k) => ok(actual != null && k in Object(actual), 'expected property ' + k),
      toHaveBeenCalled: () => ok(actual && actual.mock && actual.mock.calls.length > 0, 'expected a call'),
      toHaveBeenCalledTimes: (n) => ok(actual && actual.mock && actual.mock.calls.length === n, 'expected ' + n + ' calls'),
      toHaveBeenCalledWith: (...a) => ok(actual && actual.mock && actual.mock.calls.some((c) => __eq(c, a)), 'expected a call with ' + __fmt(a)),
      toThrow: (e) => { let threw = false, err; try { actual(); } catch (x) { threw = true; err = x; }
        const match = !e || (typeof e === 'string' ? String(err && err.message).includes(e) : e instanceof RegExp ? e.test(String(err && err.message)) : err instanceof e);
        ok(threw && match, 'expected to throw' + (e ? ' ' + String(e) : '')); },
    };
    m.toThrowError = m.toThrow;
    return m;
  };
  const pos = make(false); pos.not = make(true);
  pos.resolves = new Proxy({}, { get: (_, k) => async (...a) => expect(await actual)[k](...a) });
  pos.rejects = new Proxy({}, { get: (_, k) => async (...a) => { let e; try { await actual; } catch (x) { e = x; } return expect(() => { if (e) throw e; })[k](...a); } });
  return pos;
}
`;

const JS_RUN = String.raw`
const __res = [];
for (const h of __hooks.beforeAll) await h();
for (const c of __cases) {
  try { for (const h of __hooks.beforeEach) await h(); await c.fn(); for (const h of __hooks.afterEach) await h(); __res.push({ name: c.name, pass: true }); }
  catch (e) { __res.push({ name: c.name, pass: false, err: String((e && e.message) || e).slice(0, 200) }); }
}
console.log('__BRIMKERN_RESULTS__' + JSON.stringify(__res));
`;

function stripExports(code) {
  return code
    .replace(/^\s*export\s+default\s+(?=(async\s+)?function|class)/gm, '')
    .replace(/^\s*export\s+default\s+/gm, 'const __default = ')
    .replace(/^\s*export\s+(?=(async\s+)?function|class|const|let|var|interface|type|enum|abstract)/gm, '')
    .replace(/^\s*export\s*\{[^}]*\}\s*(from\s*['"][^'"]+['"])?\s*;?\s*$/gm, '');
}

function runJs(code, tests, timeoutMs) {
  const dir = mkdtempSync(join(tmpdir(), 'brimkern-tests-'));
  try {
    const body = tests.replace(/^\s*import\s[^;\n]*(?:from\s*)?['"][^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^\s*(?:const|let|var)\s+[^=\n]+=\s*require\(['"][^'"]+['"]\)\s*;?\s*$/gm, '');
    const f = join(dir, 'tests.mts');
    writeFileSync(f, `${JS_SHIM}\n// ── code under test ──\n${stripExports(code)}\n// ── tests ──\n${body}\n${JS_RUN}`);
    const r = spawnSync(process.execPath, ['--no-warnings', f], { encoding: 'utf8', timeout: timeoutMs, cwd: dir });
    return parseResults(r, timeoutMs);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// ── Python ──────────────────────────────────────────────────────────────────────────────────────
const PY_SHIM = String.raw`
import sys, types, json, traceback, math
_pt = types.ModuleType('pytest')
class _Raises:
    def __init__(self, exc, match=None): self.exc, self.match = exc, match
    def __enter__(self): return self
    def __exit__(self, t, v, tb):
        if t is None: raise AssertionError('DID NOT RAISE ' + getattr(self.exc, '__name__', str(self.exc)))
        if not issubclass(t, self.exc): return False
        if self.match is not None:
            import re
            if not re.search(self.match, str(v)): raise AssertionError('message does not match ' + repr(self.match))
        return True
class _Approx:
    def __init__(self, v, rel=1e-6, abs=1e-12): self.v, self.rel, self.abs = v, rel, abs
    def __eq__(self, o): return abs(o - self.v) <= max(self.rel * abs(self.v), self.abs)
    def __repr__(self): return 'approx(%r)' % (self.v,)
class _Mark:
    def parametrize(self, names, values, **kw):
        def deco(fn):
            fn._bk_params = ([n.strip() for n in names.split(',')] if isinstance(names, str) else list(names), list(values))
            return fn
        return deco
    def __getattr__(self, _): return lambda *a, **k: (a[0] if a and callable(a[0]) else (lambda f: f))
_pt.raises = _Raises; _pt.approx = _Approx; _pt.mark = _Mark()
_pt.fixture = lambda *a, **k: (a[0] if a and callable(a[0]) else (lambda f: f))
sys.modules['pytest'] = _pt
pytest = _pt
`;

const PY_RUN = String.raw`
def _bk_call(fn, kwargs):
    fn(**kwargs)
_bk_res = []
def _bk_run(name, fn):
    params = getattr(fn, '_bk_params', None)
    try:
        if params:
            names, values = params
            for v in values:
                v = v if isinstance(v, (tuple, list)) else (v,)
                _bk_call(fn, dict(zip(names, v)))
        else:
            fn()
        _bk_res.append({'name': name, 'pass': True})
    except BaseException as e:
        _bk_res.append({'name': name, 'pass': False, 'err': (type(e).__name__ + ': ' + str(e))[:200]})
for _n, _o in list(globals().items()):
    if _n.startswith('test_') and callable(_o): _bk_run(_n, _o)
    elif _n.startswith('Test') and isinstance(_o, type):
        for _m in [m for m in dir(_o) if m.startswith('test_')]:
            _inst = _o()
            _bk_run(_n + '.' + _m, getattr(_inst, _m))
print('__BRIMKERN_RESULTS__' + json.dumps(_bk_res))
`;

const PY_STDLIB = new Set(['pytest', 'unittest', 'math', 're', 'json', 'typing', 'collections', 'itertools', 'functools', 'datetime',
  'decimal', 'fractions', 'random', 'string', 'os', 'sys', 'dataclasses', 'enum', 'copy', 'statistics', 'operator', 'heapq', 'bisect']);

function runPython(code, tests, timeoutMs) {
  // Les imports du MODULE TESTÉ (inconnu ici, son code est inliné) sont retirés ; la bibliothèque
  // standard reste.
  const body = tests.replace(/^\s*(?:from\s+([\w.]+)\s+import\s+[^\n]+|import\s+([\w.]+)[^\n]*)$/gm, (line, a, b) =>
    PY_STDLIB.has(String(a || b).split('.')[0]) ? line : '');
  const r = spawnSync('python3', ['-c', `${PY_SHIM}\n${code}\n${body}\n${PY_RUN}`], { encoding: 'utf8', timeout: timeoutMs });
  return parseResults(r, timeoutMs);
}

// Étendue de chaque fonction / méthode `test_*` dans un source Python (par l'indentation).
export function pyCaseSpans(src) {
  const lines = src.split('\n');
  const out = [];
  let cls = null, clsIndent = -1;
  let off = 0;
  const offsets = lines.map((l) => { const o = off; off += l.length + 1; return o; });
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const ind = l.length - l.trimStart().length;
    const c = /^class\s+(Test\w*)/.exec(l.trimStart());
    if (c && ind === 0) { cls = c[1]; clsIndent = ind; continue; }
    if (ind === 0 && l.trim() && !/^(class|def|@)/.test(l.trimStart())) cls = null;
    const d = /^def\s+(test_\w*)/.exec(l.trimStart());
    if (!d) continue;
    if (ind === 0) cls = null;
    // décorateurs au-dessus
    let s = i;
    while (s > 0 && lines[s - 1].trimStart().startsWith('@') && (lines[s - 1].length - lines[s - 1].trimStart().length) === ind) s--;
    let e = i + 1;
    while (e < lines.length && (!lines[e].trim() || (lines[e].length - lines[e].trimStart().length) > ind)) e++;
    while (e > i + 1 && !lines[e - 1].trim()) e--;
    out.push({ name: cls && ind > clsIndent ? `${cls}.${d[1]}` : d[1], start: offsets[s], end: e < lines.length ? offsets[e] : src.length });
  }
  return out;
}

function parseResults(r, timeoutMs) {
  const line = (r.stdout || '').split('\n').find((l) => l.startsWith('__BRIMKERN_RESULTS__'));
  if (line) return { ran: true, cases: JSON.parse(line.slice('__BRIMKERN_RESULTS__'.length)) };
  const why = r.error?.code === 'ENOENT' ? 'interpreter not found'
    : r.signal ? `timed out after ${timeoutMs / 1000} s`
      : (() => { const l = (r.stderr || '').trim().split('\n').filter(Boolean); return (l.find((x) => /Error|error:/.test(x)) || l.pop() || `exit code ${r.status}`).trim().slice(0, 200); })();
  return { ran: false, why, cases: [] };
}

// Exécute, puis rend le source des tests SANS les cas qui échouent, et un bilan en tête.
export function verifyTests({ lang, code, testsText, timeoutMs = 20_000 }) {
  const tests = extractCode(testsText);
  const res = lang === 'python' ? runPython(code, tests, timeoutMs) : runJs(code, tests, timeoutMs);
  const c = lang === 'python' ? '#' : '//';
  if (!res.ran) {
    return { text: `${c} Brimkern: NOT VERIFIED — the generated tests could not be executed (${res.why}). Review them before use.\n${tests}`, passed: 0, total: 0, ran: false };
  }
  const failed = res.cases.filter((x) => !x.pass);
  const passed = res.cases.length - failed.length;
  let kept = tests;
  let removable = true;
  if (failed.length) {
    const spans = lang === 'python' ? pyCaseSpans(tests) : jsCaseSpans(tests);
    // Les cas s'enregistrent dans l'ordre du source ; si les comptes divergent (it.each, boucles),
    // on ne sait pas quel bloc retirer : on rend tout, avec le bilan.
    if (spans.length !== res.cases.length) removable = false;
    else {
      const drop = res.cases.map((x, i) => (!x.pass ? spans[i] : null)).filter(Boolean).sort((a, b) => b.start - a.start);
      for (const s of drop) kept = kept.slice(0, s.start) + kept.slice(s.end);
    }
  }
  const head = [`${c} Brimkern: ${passed}/${res.cases.length} generated tests pass (executed${lang === 'python' ? ' with python3' : ` with node ${process.versions.node}`}, code under test inlined)`];
  if (failed.length) {
    head.push(`${c} ${removable ? 'Removed' : 'FAILING (could not be removed automatically — delete them)'}:`);
    for (const f of failed) head.push(`${c}  - ${f.name}: ${f.err}`);
  }
  if (!res.cases.length) head.push(`${c} No test case was found in the generated code.`);
  return { text: `${head.join('\n')}\n${kept.trim()}\n`, passed, total: res.cases.length, ran: true };
}

export const _internals = { stripExports, runJs, runPython, basename };
