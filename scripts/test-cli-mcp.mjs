#!/usr/bin/env node
// Checkup de la CLI, du serveur MCP et du skill agent.
//
//   npm run test:cli            protocole MCP + commandes + skill, sans charger de modèle (~5 s)
//   npm run test:cli -- --live  + vraies générations (modèle `coder`, ~2,5 Go en cache au 1er tir)
//
// Le serveur MCP est piloté comme le ferait Claude Code : JSON-RPC ligne à ligne sur stdin, et
// TOUTE ligne non JSON sur stdout est une erreur (le client couperait la connexion).

import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'bin', 'brimkern.mjs');
const LIVE = process.argv.includes('--live');
const MODEL = (process.argv.find((a) => a.startsWith('--model=')) || '--model=coder').slice(8);

let failures = 0;
const check = (ok, label, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}${!ok && detail ? `\n      ${detail}` : ''}`);
};

// Lance `brimkern mcp`, envoie les requêtes, attend autant de réponses que de requêtes avec id,
// puis ferme stdin et vérifie que le processus sort de lui-même.
function mcpSession(requests, { args = [], timeoutMs = 30_000 } = {}) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [CLI, 'mcp', ...args], { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
    const responses = new Map();
    const garbage = [];
    let stderr = '';
    let buf = '';
    let eofAt = null;
    const endStdin = () => { if (eofAt === null) { eofAt = Date.now(); p.stdin.end(); } };
    const want = requests.filter((r) => r.id != null).length;
    const timer = setTimeout(() => { p.kill('SIGKILL'); }, timeoutMs);
    p.stderr.on('data', (d) => { stderr += d; });
    p.stdout.on('data', (d) => {
      buf += d;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 1);
        try {
          const m = JSON.parse(line);
          responses.set(m.id, m);
        } catch {
          garbage.push(line);
        }
      }
      if (responses.size >= want) endStdin();
    });
    p.on('exit', (code) => {
      clearTimeout(timer);
      const exitedAfterEof = eofAt !== null && Date.now() - eofAt < 15_000;
      resolve({ responses, garbage, stderr, exitCode: code, exitedAfterEof });
    });
    for (const r of requests) p.stdin.write((typeof r === 'string' ? r : JSON.stringify({ jsonrpc: '2.0', ...r })) + '\n');
    if (want === 0) endStdin();
  });
}

const call = (id, name, args = {}) => ({ id, method: 'tools/call', params: { name, arguments: args } });
const textOf = (res) => res?.result?.content?.[0]?.text ?? '';

function run(args, input) {
  return spawnSync(process.execPath, [CLI, ...args], { cwd: ROOT, encoding: 'utf8', input, timeout: 300_000 });
}

// ── 1. Commandes sans modèle ──────────────────────────────────────────────────────────
console.log('\nCLI');
{
  const v = run(['--version']);
  check(v.status === 0 && /Brimkern CLI v\d/.test(v.stdout), '--version');
  const h = run(['--help']);
  check(h.status === 0 && h.stdout.includes('mcp'), '--help mentionne mcp');
  const m = run(['models']);
  check(m.status === 0 && m.stdout.includes('coder') && m.stdout.includes('super-coder'), 'models liste coder et super-coder');
  const bad = run(['--nope']);
  check(bad.status === 1, 'option inconnue → code 1 (jamais envoyée au modèle)');
  check(existsSync(join(ROOT, 'packages', 'sdk', 'dist', 'brimkern.mjs')), 'bundle SDK présent (sinon : npm run build:sdk)');
}

// ── 2. Protocole MCP sans modèle ──────────────────────────────────────────────────────
console.log('\nMCP · protocole');
let toolNames = [];
{
  const s = await mcpSession([
    { id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } } },
    { method: 'notifications/initialized' },
    { id: 2, method: 'tools/list' },
    { id: 3, method: 'ping' },
    { id: 4, method: 'resources/list' },
    'pas du json',
    call(5, 'nope'),
    call(6, 'brimkern_ask', {}),
    call(7, 'brimkern_stats'),
    { id: 8, method: 'initialize', params: { protocolVersion: '1999-01-01' } },
  ]);
  const r = s.responses;
  check(r.get(1)?.result?.protocolVersion === '2025-06-18', 'initialize reprend la version demandée si connue');
  check(r.get(8)?.result?.protocolVersion === '2024-11-05', 'initialize retombe sur 2024-11-05 sinon');
  toolNames = (r.get(2)?.result?.tools || []).map((x) => x.name);
  check(toolNames.join() === 'brimkern_ask,brimkern_review,brimkern_generate_tests,brimkern_stats', 'tools/list : 4 outils', toolNames.join());
  check(r.get(3)?.result && !r.get(3).error, 'ping');
  check(r.get(4)?.error?.code === -32601, 'méthode inconnue → -32601');
  check(r.get(null)?.error?.code === -32700, 'ligne non JSON → -32700');
  check(r.get(5)?.result?.isError === true, 'outil inconnu → isError');
  check(r.get(6)?.result?.isError === true && /prompt/.test(textOf(r.get(6))), 'paramètre manquant → isError');
  const stats = JSON.parse(textOf(r.get(7)) || '{}');
  check(stats.loaded === false, 'brimkern_stats ne charge pas de modèle');
  check(!/Loading model/.test(s.stderr), 'aucun modèle chargé pendant ces appels');
  check(s.garbage.length === 0, 'stdout ne contient que du JSON-RPC', s.garbage.slice(0, 3).join(' | '));
  check(s.exitCode === 0 && s.exitedAfterEof, 'sortie propre à la fin de stdin');
}

// ── 3. Skill ──────────────────────────────────────────────────────────────────────────
console.log('\nSkill');
{
  const pub = join(ROOT, 'skills', 'brimkern-worker', 'SKILL.md');
  const local = join(ROOT, '.claude', 'skills', 'brimkern-worker', 'SKILL.md');
  const text = readFileSync(pub, 'utf8');
  check(/^---\nname: brimkern-worker\ndescription: .+\n---/.test(text), 'frontmatter name + description');
  check(existsSync(local) && readFileSync(local, 'utf8') === text, '.claude/skills/ identique à skills/ (copie chargée par Claude Code)');
  const documented = [...text.matchAll(/`(brimkern_[a-z_]+)`/g)].map((m) => m[1]);
  const unknown = documented.filter((n) => !toolNames.includes(n));
  check(documented.length > 0 && unknown.length === 0, 'les outils cités existent', unknown.join());
  check(!/^\s*(?:cat .*\| )?npx brimkern|"npx"/m.test(text), 'pas de `npx brimkern` (le paquet npm est le SDK, sans commande)');
  const presets = [...text.matchAll(/`-m ([a-z0-9-]+)`/g)].map((m) => m[1]);
  const models = run(['models']).stdout;
  const missing = presets.filter((p) => !new RegExp(`\\b${p}\\s`).test(models.replace(/\x1b\[[0-9;]*m/g, '')));
  check(missing.length === 0, 'les presets cités existent', missing.join());
}

// ── 4. Générations réelles ────────────────────────────────────────────────────────────
if (LIVE) {
  console.log(`\nMCP · génération (${MODEL})`);
  const s = await mcpSession([
    { id: 1, method: 'initialize', params: {} },
    // Deux appels envoyés d'affilée : ils doivent passer en file, sur UN moteur.
    call(2, 'brimkern_ask', { prompt: 'My name is Zorglub. Reply with just: OK', max_tokens: 16 }),
    call(3, 'brimkern_ask', { prompt: 'What is my name? If you do not know, reply exactly: UNKNOWN' }),
    call(4, 'brimkern_ask', { prompt: 'Count from 1 to 200, numbers separated by spaces.', max_tokens: 8 }),
    call(5, 'brimkern_review', { code: 'function div(a, b) { return a / b }', max_tokens: 200 }),
    call(6, 'brimkern_stats'),
  ], { args: [`--model=${MODEL}`], timeoutMs: 600_000 });
  const r = s.responses;
  const texts = [2, 3, 4, 5].map((i) => textOf(r.get(i)));
  check([2, 3, 4, 5].every((i) => r.get(i)?.result && !r.get(i).result.isError), 'appels groupés : tous réussis', texts.map((x) => x.slice(0, 80)).join(' | '));
  check((s.stderr.match(/Loading model/g) || []).length === 1, 'un seul chargement de moteur', `${(s.stderr.match(/Loading model/g) || []).length} chargements`);
  check(!/zorglub/i.test(texts[1]), 'appels indépendants (pas d\'historique partagé)', texts[1].slice(0, 120));
  check(/\[truncated at max_tokens\]/.test(texts[2]) && texts[2].split(/\s+/).length < 40, 'max_tokens respecté', texts[2].slice(0, 120));
  check(texts.every((x) => !/<\/?think>/.test(x)), 'aucune balise <think> dans les réponses');
  const stats = JSON.parse(textOf(r.get(6)) || '{}');
  check(stats.loaded === true && stats.callsServed === 4 && stats.totalTokensServed > 0, 'brimkern_stats compte les appels', JSON.stringify(stats));
  check(s.garbage.length === 0, 'stdout ne contient que du JSON-RPC', s.garbage.slice(0, 3).join(' | '));
  check(s.exitCode === 0 && s.exitedAfterEof, 'sortie propre à la fin de stdin');

  console.log(`\nCLI · one-shot (${MODEL})`);
  const q = run(['-q', `--model=${MODEL}`, 'Reply with exactly: PONG']);
  check(q.status === 0 && q.stdout.trim().length > 0 && !/<\/?think>/.test(q.stdout), '-q : réponse seule, sans <think>', JSON.stringify(q.stdout.slice(0, 120)));
  const j = run(['--json', `--model=${MODEL}`, 'Reply with exactly: PONG']);
  let parsed = null;
  try { parsed = JSON.parse(j.stdout); } catch {}
  check(parsed?.ok === true && parsed.content && !/<\/?think>/.test(parsed.content), '--json : JSON valide, content sans <think>', j.stdout.slice(0, 200));
  const pipe = run(['-q', `--model=${MODEL}`, 'What is the name of this function? One word.'], 'function computeTotal(a, b) { return a + b }');
  check(pipe.status === 0 && /computeTotal/i.test(pipe.stdout), 'stdin redirigé ajouté au prompt', JSON.stringify(pipe.stdout.slice(0, 120)));
} else {
  console.log('\n(générations réelles non lancées : ajouter --live)');
}

console.log(failures ? `\n✗ ${failures} échec(s)\n` : '\n✓ tout passe\n');
process.exit(failures ? 1 : 0);
