// Les tests que `brimkern_generate_tests` rend sont-ils vrais ? — le banc du lot D (ROADMAP § 29).
//
// Le § 21 avait relevé un test FAUX livré comme valide (`clamp(5, 2, 8)` attendu « 7 », intitulé
// « mock dependency »). Bras ANCIEN : l'ancienne consigne (« … and mock dependencies if needed »),
// rejouée via brimkern_ask, sa sortie passée au même exécuteur pour COMPTER les cas faux. Bras NOUVEAU :
// l'outil tel qu'il est (consigne revue + exécution + retrait). Bras alternés, même serveur, même modèle.
//
//   node scripts/bench-mcp-tests.mjs [--shots=3] [--model=coder]
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { verifyTests } from '../bin/mcp-tests.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d;
const SHOTS = Number(arg('shots', 3));
const MODEL = arg('model', 'coder');

const SAMPLES = {
  'clamp.ts': { lang: 'js', fw: 'vitest', code: 'export function clamp(x: number, lo: number, hi: number): number {\n  if (lo > hi) throw new RangeError("lo > hi");\n  return Math.min(hi, Math.max(lo, x));\n}\n' },
  'slugify.js': { lang: 'js', fw: 'vitest', code: "export function slugify(s) {\n  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');\n}\n" },
  'palindrome.py': { lang: 'python', fw: 'pytest', code: 'def is_palindrome(s: str) -> bool:\n    t = [c.lower() for c in s if c.isalnum()]\n    return t == t[::-1]\n' },
};

// Serveur MCP (stdio), dans un dossier temporaire qui contient les fichiers (file_path côté serveur).
const work = mkdtempSync(join(tmpdir(), 'bk-mcp-bench-'));
for (const [f, s] of Object.entries(SAMPLES)) writeFileSync(join(work, f), s.code);
const srv = spawn(process.execPath, [join(ROOT, 'bin/brimkern.mjs'), 'mcp', `--model=${MODEL}`], { cwd: work, stdio: ['pipe', 'pipe', 'inherit'] });
let buf = '';
const waiters = new Map();
srv.stdout.on('data', (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i); buf = buf.slice(i + 1);
    try { const m = JSON.parse(line); waiters.get(m.id)?.(m); } catch { /* ligne non JSON : ignorée */ }
  }
});
let nextId = 1;
const rpc = (method, params) => new Promise((res) => { const id = nextId++; waiters.set(id, res); srv.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); });
const tool = async (name, args) => (await rpc('tools/call', { name, arguments: args })).result?.content?.[0]?.text || '';
await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'bench', version: '1' } });

const oldPrompt = (s) => `Generate a complete, production-grade test suite using ${s.fw} for the following code. Include happy path, boundary values, invalid inputs, and mock dependencies if needed:\n\n\`\`\`\n${s.code}\n\`\`\``;
const tot = { ancien: { cas: 0, faux: 0, nonExec: 0 }, nouveau: { rendus: 0, faux: 0, retires: 0, nonExec: 0 } };
for (let shot = 0; shot < SHOTS; shot++) {
  for (const [f, s] of Object.entries(SAMPLES)) {
    for (const bras of shot % 2 ? ['nouveau', 'ancien'] : ['ancien', 'nouveau']) {
      if (bras === 'ancien') {
        const raw = await tool('brimkern_ask', { prompt: oldPrompt(s), max_tokens: 768 });
        const v = verifyTests({ lang: s.lang, code: s.code, testsText: raw });
        if (!v.ran) tot.ancien.nonExec++;
        tot.ancien.cas += v.total; tot.ancien.faux += v.total - v.passed;
        console.log(`${f} · tir ${shot} · ancien  : ${v.ran ? `${v.total - v.passed}/${v.total} cas faux livrés tels quels` : `non exécutable (${(/\(([^)]*)\)\. Review/.exec(v.text.split('\n')[0]) || [])[1] || '?'})`}`);
      } else {
        const out = await tool('brimkern_generate_tests', { file_path: f, test_framework: s.fw, max_tokens: 768 });
        const head = out.split('\n')[0];
        // Ce qui est RENDU, réexécuté : doit passer en entier.
        const re = verifyTests({ lang: s.lang, code: s.code, testsText: out });
        const m = /(\d+)\/(\d+) generated tests pass/.exec(head);
        if (!re.ran || /NOT VERIFIED/.test(head)) tot.nouveau.nonExec++;
        else { tot.nouveau.rendus += re.total; tot.nouveau.faux += re.total - re.passed; if (m) tot.nouveau.retires += Number(m[2]) - Number(m[1]); }
        console.log(`${f} · tir ${shot} · nouveau : ${head.replace(/^(\/\/|#) Brimkern: /, '')} → rendus réexécutés : ${re.passed}/${re.total}`);
      }
    }
  }
}
srv.stdin.end();
rmSync(work, { recursive: true, force: true });
console.log(`\nancien  : ${tot.ancien.faux}/${tot.ancien.cas} cas faux livrés comme valides (${tot.ancien.nonExec} sorties non exécutables)`);
console.log(`nouveau : ${tot.nouveau.faux}/${tot.nouveau.rendus} cas faux rendus, ${tot.nouveau.retires} retirés avant rendu (${tot.nouveau.nonExec} sorties « NOT VERIFIED »)`);
