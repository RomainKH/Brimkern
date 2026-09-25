#!/usr/bin/env node

/**
 * BRIMKERN CLI — Exécution de modèles d'IA on-device en WGSL / WebGPU depuis le terminal.
 * Moteur d'inférence WebGPU natif (kernels WGSL) via Chromium headless / GPU matériel.
 *
 * Fonctionnalités avancées style Claude Code / Gemini CLI :
 *   - Injection de contexte fichier (@chemin/vers/fichier[:début-fin])
 *   - Raccourcis Git intégrés (/diff, /commit, /review)
 *   - REPL interactif avec persistance KV-cache, changement de modèle à chaud (/model)
 *   - Commandes shell directes (!cmd ou /exec cmd)
 *   - Copie directe au presse-papier système (/copy)
 *   - Statistiques de session (/stats, tokens, tok/s, coût 0$)
 *   - Identité visuelle "Le Kern" (palette rouge carmin, bordures nettes, typographie soignée)
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, createReadStream, readdirSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir, totalmem } from 'node:os';
import readline, { createInterface } from 'node:readline';
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { format } from 'node:util';
import { chromium } from 'playwright-core';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const SDK_PATH = join(ROOT, 'public', 'sdk.js');
const CLI_VERSION = '0.1.0';

const SDK_MJS_CANDIDATES = [
  join(ROOT, 'packages', 'sdk', 'dist', 'brimkern.mjs'),
  join(ROOT, 'dist', 'brimkern.mjs'),
  join(ROOT, 'public', 'sdk.mjs'),
];

function getSdkMjsPath() {
  for (const p of SDK_MJS_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  return null;
}

// ── Configuration locale persistante (~/.config/brimkern/config.json) ────────────────
function getCliConfigPath() {
  const configBase = process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
  return join(configBase, 'brimkern', 'config.json');
}

function loadCliConfig() {
  try {
    const file = getCliConfigPath();
    if (existsSync(file)) {
      return JSON.parse(readFileSync(file, 'utf8'));
    }
  } catch {}
  return {};
}

function saveCliConfig(updates) {
  try {
    const file = getCliConfigPath();
    const dir = resolve(file, '..');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const current = loadCliConfig();
    const next = { ...current, ...updates, updatedAt: new Date().toISOString() };
    writeFileSync(file, JSON.stringify(next, null, 2) + '\n', 'utf8');
  } catch {}
}

// ── Langue de l'interface ──────────────────────────────────────────────────────────────
// Anglais par défaut (version canonique, règle 3 du dépôt) ; français via --lang=fr ou
// BRIMKERN_LANG=fr. Lu au chargement : les tables figées ci-dessous appellent t() directement.
const argLang = (process.argv.find((a) => a.startsWith('--lang=')) || '').slice(7);
const LANG = (process.env.BRIMKERN_LANG || argLang || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
const t = (en, fr) => (LANG === 'fr' ? fr : en);

// ── Modèles préconfigurés ──────────────────────────────────────────────────────────────
// Liste COURTE et mesurée (banc 2026-09-23, Mac Metal, cache chaud, 3 questions dev : explication
// TS, fonction de dédoublonnage, diagnostic `this` en fonction fléchée). Seuls restent les modèles
// qui répondent juste ; les 230M / RWKV / 0.5B donnaient l'impression d'un outil cassé (réponses
// hors sujet, présentations de soi en boucle). C'est la seule source : aide, sélecteur et /models
// lisent cette table.
const PRESET_CLI_MODELS = {
  'coder': {
    name: 'Qwen 3 4B (BRIK int4)',
    shortName: 'Qwen 3 4B',
    url: 'https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik',
    format: 'brik',
    formatLabel: 'BRIK int4',
    runtime: t('WebGPU (native Dawn)', 'WebGPU (Natif Dawn)'),
    size: t('2.53 GB', '2,53 Go'),
    badge: t('Recommended', 'Recommandé'),
    qwen3Think: true,
    defaultSystem: 'You are Brimkern Code, an expert software engineer. Answer the question asked, with correct code and concise explanations. Format code blocks using markdown.',
    // Chiffres : matrice à cinq suites du 2026-09-25 (scripts/bench-code.mjs, docs/ROADMAP.md § 20).
    desc: t('Light and fast, runs on any machine: 146/202 on our five code suites (35/41 on HumanEval), without reasoning. Reasoning: /think deep.',
      'Léger et rapide, tourne partout : 146/202 sur nos cinq suites de code (35/41 sur HumanEval), sans réflexion. Réflexion : /think deep.'),
  },
  'super-coder': {
    name: 'Qwen 3.5 4B Super Coder (GGUF)',
    shortName: 'Qwen 3.5 4B Super Coder',
    url: 'https://huggingface.co/jica98/qwen3.5-4B-super-coder/resolve/main/qwen3.5-4B-super-coder.Q4_0.gguf',
    format: 'gguf',
    formatLabel: 'GGUF Q4_0',
    // Graphe Qwen 3.5 validé contre llama.cpp dans Dawn natif (docs/ROADMAP.md § 17).
    engine: 'native',
    opensThink: true,
    runtime: t('WebGPU (native Dawn)', 'WebGPU (Natif Dawn)'),
    size: t('2.61 GB', '2,61 Go'),
    badge: t('SSM Hybrid', 'Hybride SSM'),
    defaultSystem: 'You are Brimkern Super Coder, a specialized AI coding engineer. Generate accurate, concise, and clean code.',
    desc: t('Qwen 3.5 hybrid (Gated DeltaNet + attention), always reasons before answering: 145/202 on our five code suites, better than coder at bug fixing (26/41 vs 21/41).',
      'Hybride Qwen 3.5 (Gated DeltaNet + attention), réfléchit toujours avant de répondre : 145/202 sur nos cinq suites de code, meilleur que coder en réparation de bug (26/41 contre 21/41).'),
  },
  'coder-max': {
    name: 'Qwen 3.6 35B-A3B Coder REAP (GGUF)',
    shortName: 'Qwen 3.6 35B-A3B Coder',
    url: 'https://huggingface.co/anik-jha/Qwen3.6-35B-A3B-coding-reap50-GGUF/resolve/main/qwen36-reap50-Q4_K_M-imat.gguf',
    format: 'gguf',
    formatLabel: 'GGUF Q4_K_M',
    // MoE (128 experts, 8 actifs : ~3 B de paramètres calculés par token sur 19 B) validé contre
    // llama.cpp dans Dawn natif (docs/ROADMAP.md § 20). Mesuré SANS réflexion : le gabarit Qwen 3.5
    // ouvre <think> d'office, « /no_think » (chatFormat) le ferme — toujours, /think deep compris.
    engine: 'native',
    noThink: true,
    // ~12 Go en régime : en dessous de 20 Go de mémoire unifiée, la machine swappe (voire plante).
    minMemGB: 20,
    runtime: t('WebGPU (native Dawn)', 'WebGPU (Natif Dawn)'),
    size: t('11.4 GB', '11,4 Go'),
    badge: t('MoE · 20 GB+ RAM', 'MoE · 20 Go+ de RAM'),
    defaultSystem: 'You are Brimkern Code, an expert software engineer. Answer the question asked, with correct code and concise explanations. Format code blocks using markdown.',
    // Chiffres : matrice à cinq suites du 2026-09-25 (scripts/bench-code.mjs, docs/ROADMAP.md § 20).
    desc: t('The strongest preset: 184/202 on our five code suites, 2 short of Claude Sonnet 5 (186). MoE with ~3 B of its 19 B parameters active per token. 12 GB of memory in use: needs a 20 GB+ machine.',
      'Le preset le plus fort : 184/202 sur nos cinq suites de code, à 2 problèmes de Claude Sonnet 5 (186). MoE, ~3 B de ses 19 B de paramètres actifs par token. 12 Go de mémoire en régime : demande une machine de 20 Go ou plus.'),
  },
};

// Anciennes clés : alias vers les nouvelles (redirection transparente) ou raccourcis pratiques
const MODEL_ALIASES = {
  'qwen3-4b': 'coder',
  'qwen3': 'coder',
  'pro': 'coder-max',
  'max': 'coder-max',
  'moe': 'coder-max',
  'super': 'super-coder',
  'qwen35': 'super-coder',
  'qwen-3.5': 'super-coder',
  'deltanet': 'super-coder',
  'coder-7b': 'super-coder',
  'qwen-7b': 'super-coder',
  '7b': 'super-coder',
  'heavy': 'super-coder',
  'coder-3b': 'coder',
  'fast': 'coder',
  'coder-1.5b': 'coder',
  'smol': 'coder',
  'smollm': 'coder',
  '3b': 'coder',
  'opus': 'coder',
  'opus-coder': 'coder',
  'qwen-3b': 'coder',
  'reason': 'coder',
  'deepseek': 'coder',
  'r1': 'coder',
};
const RETIRED_MODELS = new Set([
  'coder-3b', 'opus', 'opus-coder', '3b', 'qwen-3b',
  'reason', 'deepseek', 'r1',
  'fast', 'coder-1.5b', 'smol', 'smollm',
  'coder-0.5b', 'qwen-0.5b', 'lfm2', 'rwkv', 'rwkv-0.4b', 'rwkv-0.1b'
]);

function resolveModelKey(key) {
  if (!key) {
    const cfg = loadCliConfig();
    key = cfg.lastModel || 'coder';
  }
  if (MODEL_ALIASES[key]) return MODEL_ALIASES[key];
  if (RETIRED_MODELS.has(key)) {
    process.stderr.write(`${C.yellow}ℹ ${t(
      `The "${key}" preset was retired (answers too unreliable): using "coder" (${PRESET_CLI_MODELS.coder.shortName}). To force it, pass its URL with --model=.`,
      `Le preset « ${key} » a été retiré (réponses trop peu fiables) : utilisation de « coder » (${PRESET_CLI_MODELS.coder.shortName}). Pour le forcer, passez son URL avec --model=.`,
    )}${C.reset}\n`);
    return 'coder';
  }
  return key;
}

// Suffixe de réflexion selon le modèle. Qwen 3 n'obéit qu'à ses interrupteurs /think et
// /no_think : la consigne en français de « off » était ignorée et il consommait tout son budget
// de tokens à réfléchir (300/300 au banc). Sans réflexion par défaut, /think deep la rend.
function thinkSuffixFor(modelKey, level) {
  // Un Qwen 3 venu du Hub (« Qwen3-0.6B-Q8_0.gguf ») a les mêmes interrupteurs que le preset ;
  // pas Qwen 2.5 ni Qwen 3.5 (autre famille).
  // Presets mesurés sans réflexion et dont le gabarit l'ouvre d'office (Qwen 3.5 / 3.6) : toujours fermée.
  if (PRESET_CLI_MODELS[modelKey]?.noThink) return ' /no_think';
  if (PRESET_CLI_MODELS[modelKey]?.qwen3Think || /qwen3[-_](?!\.)/i.test(String(modelKey).split('/').pop() || '')) {
    return level === 'deep' ? ' /think' : ' /no_think';
  }
  return (THINKING_LEVELS[level] || THINKING_LEVELS.auto).promptSuffix;
}

// ── Palette ANSI "Le Kern" (rouge carmin, papier, encre) ─────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  red: '\x1b[38;2;239;68;68m',        // Rouge Kern (#ef4444)
  boldRed: '\x1b[1;38;2;239;68;68m',
  green: '\x1b[38;2;74;222;128m',     // Vert menthe
  boldGreen: '\x1b[1;38;2;74;222;128m',
  yellow: '\x1b[38;2;234;179;8m',
  sand: '\x1b[38;2;216;185;132m',     // Sable chaud
  blue: '\x1b[38;2;96;165;250m',
  cyan: '\x1b[38;2;56;189;248m',      // Bleu ciel
  gray: '\x1b[38;2;161;161;170m',     // Gris papier
  darkGray: '\x1b[38;2;82;82;91m',
};

// ── Modes d'utilisation de l'IA (Code, Plan, Review, Auto) ───────────────────────────
const CLI_MODES = {
  code: {
    name: 'code',
    label: 'CODE',
    badge: `${C.cyan}[CODE]${C.reset}`,
    color: C.cyan,
    desc: t('Direct code generation, exact syntax, concise', 'Génération directe de code, syntaxe exacte et concision'),
    // Pas de consigne ajoutée : c'est le mode par défaut et le prompt système dit déjà « code juste ».
    // Collée à CHAQUE message, « Fournis du code propre… » faisait répondre `print("Bonjour")` à
    // « dis bonjour » (3/3 sur Qwen 3 4B), et le modèle la récitait (« du code propre et
    // directement utilisable en production »).
    systemSuffix: ''
  },
  plan: {
    name: 'plan',
    label: 'PLAN',
    badge: `${C.yellow}[PLAN]${C.reset}`,
    color: C.yellow,
    desc: t('Architecture design and step-by-step analysis before writing code', 'Conception architecturale et analyse étape par étape avant toute écriture'),
    systemSuffix: t(
      '\n[MODE: PLAN] Do not generate all the code right away. Analyze the requirements, break down the architecture, weigh trade-offs and edge cases, and propose a step-by-step implementation plan.',
      '\n[MODE: PLAN] Ne génère pas tout le code immédiatement. Analyse les besoins, décompose l\'architecture, évalue les compromis, les cas limites et propose un plan d\'implémentation étape par étape.',
    )
  },
  review: {
    name: 'review',
    label: 'REVIEW',
    badge: `${C.boldRed}[REVIEW]${C.reset}`,
    color: C.boldRed,
    desc: t('Security audit, regressions, bugs and bottlenecks', 'Audit de sécurité, détection de régressions, bugs et goulots d’étranglement'),
    systemSuffix: t(
      '\n[MODE: REVIEW] Act as an uncompromising senior reviewer. Actively look for bugs, security flaws, regressions, memory leaks and performance problems in the code provided.',
      '\n[MODE: REVIEW] Agis comme un reviewer senior intraitable. Cherche activement les bugs, failles de sécurité, régressions, fuites de mémoire et problèmes de performance dans le code fourni.',
    )
  },
  auto: {
    name: 'auto',
    label: 'AUTO',
    badge: `${C.boldGreen}[AUTO]${C.reset}`,
    color: C.boldGreen,
    desc: t('Agent mode: unified diffs and atomic changes', 'Mode autonome / agent : propositions de diffs unifiés et actions atomiques'),
    systemSuffix: t(
      '\n[MODE: AUTO] Propose atomic code changes as clear code blocks or unified diffs, explaining the reason for each change and the check to run.',
      '\n[MODE: AUTO] Propose des modifications de code atomiques sous forme de blocs ou diffs unifiés clairs, en expliquant la raison de chaque modification et la validation à exécuter.',
    )
  }
};

// ── Niveaux de réflexion (Thinking / Monologue interne) ──────────────────────────────
const THINKING_LEVELS = {
  off: {
    name: 'off',
    label: 'off',
    color: C.gray,
    desc: t('Direct answers, no reasoning steps shown', 'Réponses directes sans affichage des étapes de réflexion'),
    promptSuffix: t('\nAnswer directly, without internal reasoning or <think> tags.', '\nRéponds directement sans balises de réflexion interne ni <think>.')
  },
  auto: {
    name: 'auto',
    label: 'auto',
    color: C.cyan,
    desc: t('Detects and formats <think>...</think> blocks', 'Détection et mise en page soignée des balises <think>...</think>'),
    promptSuffix: ''
  },
  deep: {
    name: 'deep',
    label: 'deep',
    color: C.sand,
    desc: t('Explicit step-by-step reasoning inside <think> tags', 'Réflexion étape par étape explicite dans des balises <think>'),
    promptSuffix: t(
      '\nThink step by step before answering. Put your detailed analysis and hesitations inside <think>...</think> tags, then give the final solution outside them.',
      '\nRéfléchis étape par étape avant de répondre. Encadre ton analyse détaillée et tes hésitations à l\'intérieur de balises <think>...</think>, puis donne la solution finale en dehors.',
    )
  }
};

// ── Contexte du projet courant ─────────────────────────────────────────────────────────
// Le modèle ne voyait que le message : à « à quoi sert ce projet ? » il répondait qu'il ne
// travaillait sur aucun projet. On lui décrit le dossier courant (paquet, README, branche,
// arborescence de tête) dans le prompt système. Borné (~900 car. ; mesuré +1,45 s de TTFT par tour sur Qwen 3 4B, +1,8 s à 1 500 car.) : il est repréfillé à
// chaque tour.
function buildProjectContext(cwd = process.cwd()) {
  const parts = [];
  const readme = ['README.md', 'README', 'readme.md'].map((f) => join(cwd, f)).find((f) => existsSync(f));
  // Le README d'abord, et le NOM du paquet seulement sans README : un nom interne
  // (« local-llm-interface-ssr » ici) faisait décrire le projet comme « une interface SSR ».
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
    const line = (readme ? [pkg.description] : [pkg.name, pkg.description]).filter(Boolean).join(' — ');
    if (line) parts.push(`package.json: ${line}`);
  } catch {}
  if (readme) {
    const text = readFileSync(readme, 'utf8')
      .replace(/```[\s\S]*?```/g, ' ')          // blocs de code
      .replace(/<[^>]+>/g, ' ')                   // HTML
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')        // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')      // liens → texte
      .replace(/[*_`#>|]/g, '')
      .split('\n').map((l) => l.trim()).filter((l) => l && !/^-{3,}$/.test(l))
      .join(' ').replace(/\s+/g, ' ').trim();
    if (text) parts.unshift(`README: ${text.slice(0, 450)}${text.length > 450 ? '…' : ''}`);
  }
  const git = getGitInfo();
  if (git) parts.push(`git branch: ${git.branch}`);
  try {
    const IGNORED = new Set(['node_modules', '.git', '.next', 'dist', '.cache']);
    const entries = readdirSync(cwd, { withFileTypes: true })
      .filter((e) => !e.name.startsWith('.') && !IGNORED.has(e.name))
      .slice(0, 20)
      .map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
    if (entries.length) parts.push(`top-level files: ${entries.join(', ')}`);
  } catch {}
  if (!parts.length || (!readme && parts.length < 3 && !git)) return '';
  return `\n\n[Project context: ${cwd}]\n${parts.join('\n')}`;
}

// ── Économies estimées vs une API payante ─────────────────────────────────────────────
// Gadget assumé : ce que la même conversation aurait coûté facturée par une API. ESTIMATION,
// affichée comme telle : tokens ≈ caractères / 4, tarif de référence réglable (défaut 3 $ / 15 $
// par million de tokens en entrée / sortie, ordre de grandeur d'un modèle milieu de gamme).
// Une API refacture tout l'historique à chaque tour : il compte dans l'entrée.
const REF_PRICE = {
  in: Number(process.env.BRIMKERN_PRICE_IN) || 3,
  out: Number(process.env.BRIMKERN_PRICE_OUT) || 15,
};
const approxTokens = (chars) => Math.ceil(chars / 4);
function estimateSavings(inChars, outTokens) {
  return (approxTokens(inChars) * REF_PRICE.in + outTokens * REF_PRICE.out) / 1e6;
}
function fmtUsd(x) {
  const n = x.toFixed(x >= 1 ? 2 : x >= 0.01 ? 3 : 4);
  return t(`$${n}`, `${n.replace('.', ',')} $`);
}
function savingsLabel(x) {
  return `${C.green}${t(`≈ ${fmtUsd(x)} saved`, `≈ ${fmtUsd(x)} économisés`)}${C.reset}`;
}

// ── Utilitaires Git ──────────────────────────────────────────────────────────────────
function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD 2>/dev/null', { encoding: 'utf8' }).trim();
    if (!branch) return null;
    const status = execSync('git status --porcelain 2>/dev/null', { encoding: 'utf8' }).trim();
    return { branch, dirty: status.length > 0 };
  } catch {
    return null;
  }
}

function getGitDiff(args = '') {
  try {
    return execSync(`git diff ${args} 2>/dev/null`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getGitStatusSummary() {
  try {
    return execSync('git status -s 2>/dev/null', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

// ── Utilitaires Presse-papier ────────────────────────────────────────────────────────
function copyToClipboard(text) {
  try {
    if (process.platform === 'darwin') {
      spawnSync('pbcopy', { input: text });
      return true;
    } else if (process.platform === 'win32') {
      spawnSync('clip', { input: text });
      return true;
    } else {
      const res = spawnSync('xclip', ['-selection', 'clipboard'], { input: text });
      if (res.status === 0) return true;
      const resWl = spawnSync('wl-copy', { input: text });
      return resWl.status === 0;
    }
  } catch {
    return false;
  }
}

// ── Détection et protection des fichiers sensibles ───────────────────────────────────
const SENSITIVE_PATTERNS = [
  /\.env(\..+)?$/i,
  /id_rsa/i,
  /id_ed25519/i,
  /\.pem$/i,
  /\.key$/i,
  /\.pfx$/i,
  /etc\/shadow/i,
  /etc\/passwd/i,
  /\.git\/config/i,
  /\.npmrc/i,
  /\.dockercfg/i,
  /\.docker\/config\.json/i,
];

function isSensitivePath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return SENSITIVE_PATTERNS.some((pat) => pat.test(normalized));
}

// ── Résolution de fichiers (@chemin/vers/fichier[:début-fin]) ──────────────────────────
function resolveFileReferences(rawPrompt) {
  const fileRegex = /@([a-zA-Z0-9_\-./\\]+(?::\d+(?:-\d+)?)?)/g;
  const matches = [...rawPrompt.matchAll(fileRegex)];
  if (matches.length === 0) {
    return { prompt: rawPrompt, files: [] };
  }

  const loadedFiles = [];
  const additions = [];

  for (const match of matches) {
    const fullRef = match[1];
    let filePath = fullRef;
    let startLine = null;
    let endLine = null;

    if (fullRef.includes(':')) {
      const parts = fullRef.split(':');
      filePath = parts[0];
      const range = parts[1];
      if (range.includes('-')) {
        const [s, e] = range.split('-').map(Number);
        startLine = s;
        endLine = e;
      } else {
        startLine = Number(range);
        endLine = Number(range);
      }
    }

    const resolved = resolve(process.cwd(), filePath);

    // Garde-fou sécurité : blocage des fichiers de clés, secrets ou identifiants
    if (isSensitivePath(resolved)) {
      process.stderr.write(`${C.yellow}⚠ ${t(`Security: sensitive file blocked to protect your secrets: @${filePath}`, `Sécurité : Fichier sensible bloqué pour protéger vos secrets : @${filePath}`)}${C.reset}\n`);
      continue;
    }

    if (existsSync(resolved) && statSync(resolved).isFile()) {
      try {
        const rawContent = readFileSync(resolved, 'utf8');
        const lines = rawContent.split('\n');
        let slice = lines;
        let lineNote = t(`${lines.length} lines`, `${lines.length} lignes`);

        if (startLine !== null) {
          const s = Math.max(1, startLine) - 1;
          const e = endLine !== null ? Math.min(lines.length, endLine) : lines.length;
          slice = lines.slice(s, e);
          lineNote = t(`lines ${startLine}-${endLine || lines.length} of ${lines.length}`, `lignes ${startLine}-${endLine || lines.length} sur ${lines.length}`);
        }

        let truncated = false;
        if (slice.length > 800) {
          slice = slice.slice(0, 800);
          truncated = true;
        }

        const ext = filePath.split('.').pop() || '';
        additions.push(
          `\n\n--- ${t('File', 'Fichier')} : ${filePath} (${lineNote}${truncated ? t(', truncated to 800 lines', ', tronqué à 800 lignes') : ''}) ---\n\`\`\`${ext}\n${slice.join('\n')}\n\`\`\``
        );
        loadedFiles.push({ path: filePath, lineCount: slice.length });
      } catch {}
    }
  }

  const cleanPrompt = rawPrompt + additions.join('\n');
  return { prompt: cleanPrompt, files: loadedFiles };
}

// ── Complétion de fichiers (@chemin/vers/fichier) ────────────────────────────────────
function findFileCompletions(partial) {
  try {
    const cwd = process.cwd();
    const lastSlash = partial.lastIndexOf('/');
    let searchDir = cwd;
    let filePrefix = partial;
    let pathPrefix = '';

    if (lastSlash !== -1) {
      pathPrefix = partial.slice(0, lastSlash + 1);
      const sub = partial.slice(0, lastSlash);
      searchDir = resolve(cwd, sub);
      filePrefix = partial.slice(lastSlash + 1);
    }

    if (!existsSync(searchDir) || !statSync(searchDir).isDirectory()) {
      return [];
    }

    const entries = readdirSync(searchDir, { withFileTypes: true });
    const IGNORED = new Set(['.git', 'node_modules', '.next', 'dist', '.cache']);
    const hits = [];

    const lowerPrefix = filePrefix.toLowerCase();
    for (const ent of entries) {
      if (IGNORED.has(ent.name)) continue;
      if (ent.name.startsWith('.') && !filePrefix.startsWith('.')) continue;
      if (!lowerPrefix || ent.name.toLowerCase().startsWith(lowerPrefix)) {
        const isDir = ent.isDirectory();
        hits.push(pathPrefix + ent.name + (isDir ? '/' : ''));
      }
    }
    return hits;
  } catch {
    return [];
  }
}

// ── Auto-compléteur readline avancé (commandes /, modes, think et fichiers @) ────────
// Commandes slash : une seule table pour la complétion Tab ET les suggestions en direct.
const SLASH_COMMANDS = [
  ['/help', t('List commands', 'Liste des commandes')],
  ['/model', t('Pick the model (↑/↓ selector)', 'Choisir le modèle (sélecteur ↑/↓)')],
  ['/models', t('Pick the model (↑/↓ selector)', 'Choisir le modèle (sélecteur ↑/↓)')],
  ['/mode', t('Mode: code, plan, review, auto', 'Mode : code, plan, review, auto')],
  ['/think', t('Reasoning: off, auto, deep', 'Réflexion : off, auto, deep')],
  ['/status', t('Session status', 'État de la session')],
  ['/stats', t('Tokens, speed, estimated savings', 'Tokens, vitesse, économies estimées')],
  ['/diff', t('Review your git changes', 'Revue de vos modifications git')],
  ['/commit', t('Suggest commit messages', 'Propositions de messages de commit')],
  ['/review', t('Code review of a file', 'Revue de code d’un fichier')],
  ['/copy', t('Copy the last answer', 'Copier la dernière réponse')],
  ['/accept', t('Extract the suggested code blocks', 'Extraire les blocs de code proposés')],
  ['/reset', t('Clear the conversation history', 'Effacer l’historique de la conversation')],
  ['/clear', t('Clear the screen', 'Effacer l’écran')],
  ['/update', t('Check and install CLI updates', 'Vérifier et installer les mises à jour')],
  ['/upgrade', t('Check and install CLI updates', 'Vérifier et installer les mises à jour')],
  ['/exit', t('Quit', 'Quitter')],
];
const SUBCOMMAND_DESCS = () => ({
  '/mode': Object.fromEntries(Object.entries(CLI_MODES).map(([k, m]) => [k, m.desc])),
  '/think': Object.fromEntries(Object.entries(THINKING_LEVELS).map(([k, t]) => [k, t.desc])),
  '/model': Object.fromEntries(Object.entries(PRESET_CLI_MODELS).map(([k, m]) => [k, `${m.shortName} · ${m.size}`])),
});

function createCliCompleter() {
  const slashCommands = SLASH_COMMANDS.map(([cmd]) => cmd);

  return function completer(line) {
    // 1. Completion de fichiers avec @ (ex: @src/app/...)
    const atIdx = line.lastIndexOf('@');
    if (atIdx !== -1) {
      const partial = line.slice(atIdx + 1);
      if (!/\s/.test(partial)) {
        const prefixBeforeAt = line.slice(0, atIdx);
        const fileHits = findFileCompletions(partial);
        if (fileHits.length > 0) {
          return [fileHits.map((f) => prefixBeforeAt + '@' + f), line];
        }
      }
    }

    // 2. Sous-arguments des commandes slash
    if (line.startsWith('/mode ')) {
      const sub = line.slice(6).trim().toLowerCase();
      const modes = Object.keys(CLI_MODES);
      const hits = modes.filter((m) => m.startsWith(sub));
      return [hits.map((m) => `/mode ${m}`), line];
    }

    if (line.startsWith('/think ')) {
      const sub = line.slice(7).trim().toLowerCase();
      const levels = Object.keys(THINKING_LEVELS);
      const hits = levels.filter((l) => l.startsWith(sub));
      return [hits.map((l) => `/think ${l}`), line];
    }

    if (line.startsWith('/model ') || line.startsWith('/models ')) {
      const sub = line.startsWith('/models ') ? line.slice(8).trim().toLowerCase() : line.slice(7).trim().toLowerCase();
      const models = Object.keys(PRESET_CLI_MODELS);
      const hits = models.filter((m) => m.startsWith(sub));
      return [hits.map((m) => `/model ${m}`), line];
    }

    if (line.startsWith('/review ')) {
      const sub = line.slice(8);
      const fileHits = findFileCompletions(sub);
      if (fileHits.length > 0) {
        return [fileHits.map((f) => `/review ${f}`), line];
      }
    }

    // 3. Commandes slash de premier niveau
    if (line.startsWith('/')) {
      const hits = slashCommands.filter((c) => c.startsWith(line));
      return [hits.length ? hits : slashCommands, line];
    }

    return [[], line];
  };
}

// ── Spinner d'activité animé & retour d'état en direct ──────────────────────────────
class ActivitySpinner {
  constructor() {
    this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.frameIdx = 0;
    this.timer = null;
    this.phase = t('Working...', 'Traitement...');
    this.startTime = 0;
    this.active = false;
  }

  start(initialPhase = t('Working...', 'Traitement...')) {
    this.phase = initialPhase;
    this.startTime = Date.now();
    this.active = true;
    if (!process.stderr.isTTY) return;
    this.timer = setInterval(() => {
      this.frameIdx = (this.frameIdx + 1) % this.frames.length;
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      process.stderr.write(`\r\x1b[2K${C.boldRed}${this.frames[this.frameIdx]}${C.reset} ${C.sand}${this.phase}${C.reset} ${C.dim}(${elapsed}s)${C.reset}`);
    }, 80);
  }

  setPhase(newPhase) {
    this.phase = newPhase;
    if (process.stderr.isTTY && this.active) {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      process.stderr.write(`\r\x1b[2K${C.boldRed}${this.frames[this.frameIdx]}${C.reset} ${C.sand}${this.phase}${C.reset} ${C.dim}(${elapsed}s)${C.reset}`);
    }
  }

  stop(clear = true) {
    // Arrêt déjà fait (premier token) : ne RIEN écrire. Le « \r\x1b[2K » effaçait sinon la ligne
    // courante du terminal — la dernière ligne de la réponse, coupée en plein mot.
    if (!this.active) return;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.active = false;
    if (process.stderr.isTTY && clear) {
      process.stderr.write('\r\x1b[2K');
    }
  }
}

// ── Suggestions en direct pendant la frappe ──────────────────────────────────────────
// Dès « / », la fin de la première commande candidate s'affiche en grisé après le curseur (→ ou
// Tab pour l'accepter) et les candidates sont listées dessous avec leur rôle. Tout est dessiné
// APRÈS la fin de la saisie et effacé avant que la ligne soit traitée : la sortie d'une commande
// ne peut pas être recouverte.
function createLiveSuggest(rl) {
  let shown = false;      // quelque chose est dessiné après la saisie
  let ghost = '';
  let drawnEndCol = 0;
  const tailWidth = () => stripAnsi(String(rl.getPrompt()).split('\n').pop()).length;

  function candidates(line) {
    const sp = line.indexOf(' ');
    if (sp === -1) {
      return SLASH_COMMANDS.filter(([cmd]) => cmd.startsWith(line)).map(([cmd, desc]) => [cmd, desc]);
    }
    const head = line.slice(0, sp) === '/models' ? '/model' : line.slice(0, sp);
    const subs = SUBCOMMAND_DESCS()[head];
    if (!subs) return [];
    const partial = line.slice(sp + 1);
    if (partial.includes(' ')) return [];
    return Object.entries(subs).filter(([k]) => k.startsWith(partial)).map(([k, d]) => [`${line.slice(0, sp)} ${k}`, d]);
  }

  function clear() {
    if (!shown) return;
    const endCol = tailWidth() + rl.line.length;
    process.stdout.write(`\x1b7\x1b[${endCol + 1}G\x1b[0J\x1b8`);
    shown = false;
    ghost = '';
  }

  function update() {
    const line = rl.line || '';
    const endCol = tailWidth() + line.length;
    const cols = process.stdout.columns || 80;
    if (!line.startsWith('/') || rl.cursor !== line.length || endCol >= cols - 1) { clear(); return; }
    const hits = candidates(line).slice(0, 6);
    if (!hits.length || (hits.length === 1 && hits[0][0] === line && !SUBCOMMAND_DESCS()[line])) { clear(); return; }
    ghost = hits[0][0].startsWith(line) ? hits[0][0].slice(line.length) : '';
    if (endCol + ghost.length >= cols - 1) ghost = '';
    const rows = hits.map(([cmd, desc]) => {
      const txt = `  ${cmd.padEnd(16)} ${desc}`.slice(0, cols - 1);
      return `${C.cyan}${txt.slice(0, 18)}${C.reset}${C.dim}${txt.slice(18)}${C.reset}`;
    });
    // Réserver les lignes AVANT de sauver le curseur : un défilement en bas d'écran fausserait
    // la position sauvegardée.
    process.stdout.write('\r\n'.repeat(rows.length) + `\x1b[${rows.length}A\x1b[${endCol + 1}G\x1b[0J\x1b7`);
    process.stdout.write(`${C.darkGray}${ghost}${C.reset}\r\n${rows.join('\r\n')}\x1b8`);
    shown = true;
    drawnEndCol = endCol;
  }

  // Entrée : readline est déjà passé à la ligne suivante — on efface le grisé resté sur la ligne
  // validée et la liste dessous, avant tout traitement de la commande.
  function onSubmit() {
    if (!shown) return;
    process.stdout.write(`\x1b[1A\x1b[${drawnEndCol + 1}G\x1b[0J\x1b[1B\r`);
    shown = false;
    ghost = '';
  }

  function accept() {
    if (!ghost || rl.cursor !== rl.line.length) return false;
    const g = ghost;
    clear();
    rl.write(g);
    return true;
  }

  return { update, clear, onSubmit, accept };
}

// ── Filtre de flux de réflexion (<think>...</think>) ────────────────────────────────
// Le modèle actif ouvre-t-il la réflexion dans son gabarit (Qwen 3.5 : « <think>\n » en fin de
// prompt) ? Sa sortie commence alors EN réflexion, sans balise ouvrante : un filtre qui attendrait
// <think> afficherait toute la réflexion comme réponse. Posé par createCliEngine d'après le preset.
let MODEL_OPENS_THINK = false;

class ThinkStreamFilter {
  constructor({ onToken, onThinkStart, onThinkEnd }) {
    this.onToken = onToken;
    this.onThinkStart = onThinkStart;
    this.onThinkEnd = onThinkEnd;
    this.inThink = MODEL_OPENS_THINK;
    this.pendingStart = MODEL_OPENS_THINK;
    this.buffer = '';
  }

  feed(chunk) {
    if (this.pendingStart) { this.pendingStart = false; if (this.onThinkStart) this.onThinkStart(); }
    this.buffer += chunk;
    while (this.buffer.length > 0) {
      if (!this.inThink) {
        const startTag = '<think>';
        const idx = this.buffer.indexOf(startTag);
        if (idx !== -1) {
          const before = this.buffer.slice(0, idx);
          if (before) this.onToken(before, false);
          this.inThink = true;
          this.buffer = this.buffer.slice(idx + startTag.length);
          if (this.onThinkStart) this.onThinkStart();
          continue;
        }
        let potentialMatch = false;
        for (let i = 1; i < startTag.length; i++) {
          if (this.buffer.endsWith(startTag.slice(0, i))) {
            const safe = this.buffer.slice(0, -i);
            if (safe) this.onToken(safe, false);
            this.buffer = this.buffer.slice(-i);
            potentialMatch = true;
            break;
          }
        }
        if (!potentialMatch) {
          this.onToken(this.buffer, false);
          this.buffer = '';
        }
        break;
      } else {
        const endTag = '</think>';
        const idx = this.buffer.indexOf(endTag);
        if (idx !== -1) {
          const thinkText = this.buffer.slice(0, idx);
          if (thinkText) this.onToken(thinkText, true);
          this.inThink = false;
          this.buffer = this.buffer.slice(idx + endTag.length);
          if (this.onThinkEnd) this.onThinkEnd();
          continue;
        }
        let potentialMatch = false;
        for (let i = 1; i < endTag.length; i++) {
          if (this.buffer.endsWith(endTag.slice(0, i))) {
            const safe = this.buffer.slice(0, -i);
            if (safe) this.onToken(safe, true);
            this.buffer = this.buffer.slice(-i);
            potentialMatch = true;
            break;
          }
        }
        if (!potentialMatch) {
          this.onToken(this.buffer, true);
          this.buffer = '';
        }
        break;
      }
    }
  }

  flush() {
    if (this.buffer) {
      this.onToken(this.buffer, this.inThink);
      this.buffer = '';
    }
    if (this.inThink && this.onThinkEnd) {
      this.onThinkEnd();
      this.inThink = false;
    }
  }
}

// Réponse sans le monologue, pour les sorties machine (-q, --json, MCP) : Qwen 3 en /no_think
// émet un <think></think> VIDE en tête, que `content` et stdout rendaient tel quel. Un bloc non
// refermé (budget épuisé en pleine réflexion) part aussi : ce n'est pas une réponse.
function stripThink(text) {
  let s = String(text || '');
  // Qwen 3.5 : le gabarit OUVRE la réflexion (« <think>\n » en fin de prompt), la sortie ne contient
  // donc que la fermeture. Un </think> sans <think> avant lui : tout ce qui précède était réflexion.
  const close = s.indexOf('</think>'), open = s.indexOf('<think>');
  if (close !== -1 && (open === -1 || open > close)) s = s.slice(close + 8);
  return s.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();
}

// Même chose en flux pour -q : n'écrit que la réponse, blancs de tête avalés.
function createAnswerOnlyFilter(write) {
  let started = false;
  return new ThinkStreamFilter({
    onToken: (tok, isThink) => {
      if (isThink) return;
      if (!started) {
        tok = tok.replace(/^\s+/, '');
        if (!tok) return;
        started = true;
      }
      write(tok);
    },
  });
}

// ── Rendu Markdown en flux pour le terminal ────────────────────────────────────────────
// Les réponses arrivaient en Markdown brut (« **Local execution** », « ```ts »). Rendu ANSI au fil
// des tokens : **gras**, `code`, titres, puces, blocs de code colorés et clôtures masquées. On ne
// retient un caractère que tant qu'un marqueur est ambigu (« * » avant un 2e « * », début de
// ligne avant de savoir si c'est « ``` », « # », « - »). Hors TTY (pipe), le texte reste brut.
class MarkdownStream {
  constructor(out) {
    this.out = out;
    this.lineStart = true;
    this.lineBuf = '';
    this.inFence = false;
    this.swallowLine = false; // ligne de clôture ``` (et son langage) : non affichée
    this.bold = false;
    this.code = false;
    this.heading = false;
    this.starRun = 0; // « * » consécutifs en attente
  }
  style() {
    let st = C.reset;
    if (this.heading) st += C.boldRed;
    if (this.bold) st += C.bold;
    if (this.code) st += C.cyan;
    return st;
  }
  write(chunk) {
    for (const ch of chunk) this.push(ch);
  }
  push(ch) {
    if (this.swallowLine) {
      if (ch === '\n') { this.swallowLine = false; this.lineStart = true; this.lineBuf = ''; }
      return;
    }
    if (this.lineStart) {
      this.lineBuf += ch;
      this.decideLine();
      return;
    }
    if (this.inFence) {
      this.out(ch === '\n' ? `${C.reset}\n` : ch);
      if (ch === '\n') { this.lineStart = true; this.lineBuf = ''; }
      return;
    }
    this.inline(ch);
  }
  decideLine() {
    const b = this.lineBuf;
    const ended = b.endsWith('\n');
    const body = ended ? b.slice(0, -1) : b;
    // Clôture de bloc de code, en entrée comme en sortie.
    // (indentée comprise : un bloc sous une puce arrive en « ␣␣```ts ».)
    if (!ended && /^\s{0,8}`{0,2}$/.test(body)) return;
    if (/^\s*```/.test(body)) {
      this.inFence = !this.inFence;
      this.lineStart = false;
      this.lineBuf = '';
      if (ended) this.lineStart = true; else this.swallowLine = true;
      return;
    }
    if (this.inFence) {
      this.lineStart = false; this.lineBuf = '';
      this.out(C.sand);
      for (const c of b) this.push(c);
      return;
    }
    if (!ended) {
      // Encore ambigu : blancs d'indentation, « # », puce, numéro.
      if (/^\s{0,8}$/.test(body) || /^#{1,6}$/.test(body) || /^\s*[-*+]$/.test(body) || /^\s*\d{1,3}\.?$/.test(body) || body === '>') return;
    }
    let rest = b;
    let m;
    if ((m = body.match(/^(#{1,6}) /))) {
      this.heading = true;
      this.out(this.style());
      rest = b.slice(m[0].length);
    } else if ((m = body.match(/^(\s*)[-*+] /)) && !/^\s*\*\*/.test(body)) {
      this.out(`${m[1]}${C.red}•${C.reset} `);
      rest = b.slice(m[0].length);
    } else if ((m = body.match(/^(\s*)(\d{1,3})\. /))) {
      this.out(`${m[1]}${C.red}${m[2]}.${C.reset} `);
      rest = b.slice(m[0].length);
    } else if ((m = body.match(/^> ?/))) {
      this.out(`${C.darkGray}│${C.reset} `);
      rest = b.slice(m[0].length);
    }
    this.lineStart = false;
    this.lineBuf = '';
    for (const c of rest) this.inline(c);
  }
  // Une suite de 2 « * » ou plus = UN basculement du gras. Qwen 3 4B écrit « - ****Titre** » :
  // compté par paires, le gras s'ouvrait et se refermait aussitôt, et tout s'inversait.
  resolveStars() {
    if (!this.starRun) return;
    if (this.starRun === 1) this.out('*');
    else { this.bold = !this.bold; this.out(this.style()); }
    this.starRun = 0;
  }
  inline(ch) {
    if (ch === '*' && !this.code) { this.starRun++; return; }
    this.resolveStars();
    if (ch === '`') { this.code = !this.code; this.out(this.style()); return; }
    if (ch === '\n') {
      this.bold = this.code = this.heading = false;
      this.out(`${C.reset}\n`);
      this.lineStart = true;
      this.lineBuf = '';
      return;
    }
    this.out(ch);
  }
  flush() {
    if (this.lineStart && this.lineBuf) {
      const b = this.lineBuf;
      this.lineBuf = '';
      this.lineStart = false;
      if (!/^\s*```/.test(b)) for (const c of b) this.inline(c);
    }
    this.resolveStars();
    this.out(C.reset);
  }
}

// Affichage d'un flux de génération (REPL et one-shot). Les en-têtes Réflexion/Réponse ne
// s'impriment qu'au premier caractère non blanc : Qwen 3 en /no_think émet un bloc
// <think></think> VIDE, qui laissait « 💭 [Réflexion] » suivi de lignes blanches.
function createStreamPrinter(spinner, onChunk, { markdown = process.stdout.isTTY } = {}) {
  const write = (t) => process.stdout.write(t);
  const md = markdown ? new MarkdownStream(write) : null;
  let started = false;
  let thinkOpen = false;      // <think> vu, en-tête pas encore imprimé
  let thinkPrinted = false;
  let answerStarted = false;  // les blancs en tête de réponse sont avalés
  const firstOutput = () => {
    if (!started) { started = true; spinner.stop(true); }
  };
  const filter = new ThinkStreamFilter({
    onToken: (tok, isThink) => {
      onChunk();
      if (isThink) {
        if (!thinkPrinted) {
          if (!tok.trim()) return;
          firstOutput();
          process.stdout.write(`\n${C.sand}💭 [${t('Reasoning', 'Réflexion')}]${C.reset}\n`);
          thinkPrinted = true;
          tok = tok.replace(/^\s+/, '');
        }
        process.stdout.write(`${C.dim}${C.italic}${tok}${C.reset}`);
        return;
      }
      if (!answerStarted) {
        tok = tok.replace(/^\s+/, '');
        if (!tok) return;
        answerStarted = true;
      }
      firstOutput();
      if (md) md.write(tok); else write(tok);
    },
    onThinkStart: () => { thinkOpen = true; },
    onThinkEnd: () => {
      if (thinkOpen && thinkPrinted) {
        process.stdout.write(`${C.reset}\n\n${C.boldGreen}💡 [${t('Answer', 'Réponse')}]${C.reset}\n`);
      }
      thinkOpen = false;
    },
  });
  return {
    feed: (chunk) => filter.feed(chunk),
    flush: () => { filter.flush(); if (md) md.flush(); },
  };
}

// ── Génération de la ligne d'état dynamique au-dessus du prompt ─────────────────────
function renderPromptStatus(engine, mode, thinkLevel) {
  const modeInfo = CLI_MODES[mode] || CLI_MODES.code;
  const thinkInfo = THINKING_LEVELS[thinkLevel] || THINKING_LEVELS.auto;
  const gpuStr = engine.gpuBackend || (process.platform === 'darwin' ? 'Dawn (Metal)' : 'Dawn (Vulkan)');
  const modelShort = engine.displayName || engine.modelKey;

  return `${C.darkGray}┌─${C.reset} ${C.boldRed}Brimkern${C.reset} ${C.dim}·${C.reset} ${C.yellow}${modelShort}${C.reset} ${C.dim}·${C.reset} ${C.cyan}${gpuStr}${C.reset} ${C.dim}·${C.reset} ${modeInfo.color}${modeInfo.badge}${C.reset} ${C.dim}·${C.reset} ${C.dim}think:${C.reset}${thinkInfo.color}${thinkInfo.label}${C.reset}`;
}

// ── Carte d'état complète de session (/status) ──────────────────────────────────────
function printStatusCard(engine, currentMode, thinkLevel, sessionState) {
  const modeInfo = CLI_MODES[currentMode] || CLI_MODES.code;
  const thinkInfo = THINKING_LEVELS[thinkLevel] || THINKING_LEVELS.auto;
  const git = getGitInfo();
  const gitBranch = git ? `${git.branch}${git.dirty ? t(' (modified *)', ' (modifié *)') : t(' (clean)', ' (propre)')}` : t('Not versioned', 'Non versionné');
  const elapsedSec = (sessionState.totalElapsedMs / 1000).toFixed(1);
  const avgSpeed = sessionState.totalElapsedMs > 0 ? ((sessionState.totalTokens / sessionState.totalElapsedMs) * 1000).toFixed(1) : '0';

  const saved = estimateSavings(sessionState.totalInChars || 0, sessionState.totalTokens);
  const label = (en, fr) => `${C.bold}${t(en, fr).padEnd(12)}${C.reset}`;
  console.log('\n' + drawBox(`${C.boldRed}${t('Brimkern session status', 'État de la session Brimkern')}${C.reset}`, [
    `${label('Active model', 'Modèle actif')} : ${C.yellow}${engine.displayName}${C.reset}`,
    `${label('Engine & GPU', 'Moteur & GPU')} : ${C.cyan}${engine.engineType} · ${engine.gpuBackend}${C.reset}`,
    `${label('AI mode', 'Mode IA')} : ${modeInfo.badge} ${C.gray}${modeInfo.desc}${C.reset}`,
    `${label('Reasoning', 'Réflexion')} : ${thinkInfo.color}${thinkInfo.name}${C.reset} ${C.dim}(${thinkInfo.desc})${C.reset}`,
    `${label('Git repo', 'Dépôt Git')} : ${C.sand}${gitBranch}${C.reset}`,
    `${label('Inference', 'Inférence')} : ${C.green}${t('100% local', '100 % local')}${C.reset} · ${sessionState.totalTokens} tokens · ~${avgSpeed} tok/s (${elapsedSec}s) · ${savingsLabel(saved)}`,
  ], { color: C.boldRed }) + '\n');
}

// ── Résolution de Chromium ───────────────────────────────────────────────────────────
function findChromium() {
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  // 1. Dossier de cache Playwright
  const pwDirs = [
    join(homedir(), 'Library', 'Caches', 'ms-playwright'),
    join(homedir(), '.cache', 'ms-playwright'),
  ];
  for (const base of pwDirs) {
    if (existsSync(base)) {
      try {
        const dirs = readdirSync(base)
          .filter((d) => /^chromium-\d+$/.test(d))
          .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
        for (const dir of dirs) {
          const candidates = [
            join(base, dir, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
            join(base, dir, 'chrome-mac-x64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
            join(base, dir, 'chrome-linux', 'chrome'),
          ];
          for (const cand of candidates) {
            if (existsSync(cand)) return cand;
          }
        }
      } catch {}
    }
  }

  // 2. Chrome installé sur le système
  const sysCandidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const cand of sysCandidates) {
    if (existsSync(cand)) return cand;
  }

  return null;
}

// ── Nettoyage des verrous de profil Chrome ────────────────────────────────────────────
function cleanLocks(profile) {
  for (const f of ['SingletonLock', 'SingletonCookie', 'SingletonSocket']) {
    try { rmSync(join(profile, f), { force: true }); } catch {}
  }
}

// Migration unique : avant le port fixe, chaque lancement avait sa propre origine, donc son
// propre bucket CacheStorage — des copies du même modèle que plus rien ne relira (~2,6 Go ici).
// On vide la CacheStorage une fois (Chromium fermé) ; le prochain téléchargement sera le dernier.
function purgeOrphanCacheBuckets(profile) {
  const marker = join(profile, '.brimkern-stable-origin-v1');
  if (existsSync(marker)) return;
  try {
    rmSync(join(profile, 'Default', 'Service Worker', 'CacheStorage'), { recursive: true, force: true });
    writeFileSync(marker, `${new Date().toISOString()}\n`);
  } catch {}
}

// ── Serveur HTTP local pour le runner WebGPU ─────────────────────────────────────────
const CHROMIUM_HOST_PORTS = [47631, 47632, 47633, 47634];
function startLocalServer(localBrikFile = null) {
  const sdkCode = readFileSync(SDK_PATH, 'utf8');

  const server = createServer((req, res) => {
    // Garde-fou réseau : seules les requêtes provenant strictement de localhost sont admises
    const remote = req.socket.remoteAddress;
    if (remote && remote !== '127.0.0.1' && remote !== '::1' && remote !== '::ffff:127.0.0.1') {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // 1. SDK Brimkern
    if (req.url === '/sdk.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*' });
      res.end(sdkCode);
      return;
    }

    // 2. Modèle local .brik ou .gguf avec support HTTP Range (206 Partial Content)
    if ((req.url === '/local-model.brik' || req.url === '/local-model.gguf') && localBrikFile && existsSync(localBrikFile)) {
      const stat = statSync(localBrikFile);
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunkSize = (end - start) + 1;
        const fileStream = createReadStream(localBrikFile, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
        });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': stat.size,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
        });
        createReadStream(localBrikFile).pipe(res);
      }
      return;
    }

    // 3. Page hôte de l'environnement WebGPU
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="/sdk.js"></script>
</head>
<body>
  <h1>Brimkern WGSL Terminal Host</h1>
</body>
</html>`);
  });

  // Port FIXE : l'origine http://127.0.0.1:<port> est la clé de la CacheStorage de Chromium.
  // Avec un port aléatoire, chaque lancement ouvrait un bucket vide et retéléchargeait le modèle
  // (4 copies de Qwen 0.5B dans le profil). Ports suivants si occupé (autre instance), puis
  // aléatoire en dernier recours — le cache n'est alors pas réutilisé, mais ça démarre.
  const tryListen = (port) => new Promise((ok, fail) => {
    const onError = (e) => { server.removeListener('listening', onListening); fail(e); };
    const onListening = () => { server.removeListener('error', onError); ok(server.address().port); };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, '127.0.0.1');
  });
  return (async () => {
    for (const port of [...CHROMIUM_HOST_PORTS, 0]) {
      try {
        return { server, port: await tryListen(port) };
      } catch (e) {
        if (e.code !== 'EADDRINUSE' || port === 0) throw e;
      }
    }
  })();
}

// ── Cache disque persistant pour l'inférence native (évite les retéléchargements) ───
function initDiskCache() {
  if (globalThis.caches && globalThis.__brimkern_disk_cache) return;
  const cacheBase = process.env.XDG_CACHE_HOME || join(homedir(), '.cache');
  const cacheDir = join(cacheBase, 'brimkern', 'ranges');
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }

  function keyToFilename(key) {
    return createHash('sha256').update(key).digest('hex') + '.bin';
  }

  const diskCache = {
    async match(key) {
      const file = join(cacheDir, keyToFilename(key));
      if (existsSync(file)) {
        const buf = readFileSync(file);
        return new Response(buf, { headers: { 'Content-Length': String(buf.byteLength) } });
      }
      return null;
    },
    async put(key, response) {
      const file = join(cacheDir, keyToFilename(key));
      const buf = await response.arrayBuffer();
      writeFileSync(file, Buffer.from(buf));
    }
  };

  globalThis.caches = {
    async open(_name) {
      return diskCache;
    }
  };
  globalThis.__brimkern_disk_cache = true;
}

// Le SDK trace ses selfValidate en console.log (« [selfValidate] … OK ») au premier ask : en
// moteur natif ils sortaient au milieu de la réponse. On les tait pendant les appels au SDK ;
// warn/error (gate tombé, repli) restent visibles, BRIMKERN_DEBUG=1 rend tout.
async function withQuietSdkLogs(fn) {
  if (process.env.BRIMKERN_DEBUG === '1') return fn();
  const saved = { log: console.log, info: console.info, debug: console.debug };
  console.log = console.info = console.debug = () => {};
  try {
    return await fn();
  } finally {
    Object.assign(console, saved);
  }
}

// ── Moteur Natif Dawn (in-process, 0ms de démarrage, aucun navigateur requis) ────────
class BrimkernNativeDawnEngine {
  constructor(options = {}) {
    this.modelKey = options.model || 'coder';
    this.maxTokens = options.maxTokens || 512;
    this.temperature = options.temperature ?? 0.3;
    this.systemPrompt = options.system || PRESET_CLI_MODELS[this.modelKey]?.defaultSystem || 'You are a code assistant.';
    this.raw = !!options.raw;
    this.localBrikFile = null;

    this.resolveModelConfig();
    if (options.displayName) this.displayName = options.displayName;
    this.session = null;
    this.server = null;
    this.isReady = false;
    this.engineType = t('Native Dawn (in-process)', 'Natif Dawn (in-process)');
    this.gpuBackend = process.platform === 'darwin' ? 'Dawn (Metal)' : 'Dawn (Vulkan)';
  }

  static async isAvailable() {
    try {
      const { create } = await import('webgpu');
      const gpu = create([]);
      if (!gpu) return false;
      const adapter = await gpu.requestAdapter();
      return !!adapter;
    } catch {
      return false;
    }
  }

  resolveModelConfig() {
    if (PRESET_CLI_MODELS[this.modelKey]) {
      this.modelUrl = PRESET_CLI_MODELS[this.modelKey].url;
      this.displayName = PRESET_CLI_MODELS[this.modelKey].name;
      this.format = PRESET_CLI_MODELS[this.modelKey].format;
    } else if (existsSync(this.modelKey)) {
      this.localBrikFile = resolve(this.modelKey);
      this.displayName = t(`Local file (${this.modelKey})`, `Fichier local (${this.modelKey})`);
      this.format = this.modelKey.toLowerCase().endsWith('.gguf') ? 'gguf' : 'brik';
    } else {
      this.modelUrl = this.modelKey;
      this.displayName = this.modelKey;
      this.format = this.modelKey.endsWith('.gguf') ? 'gguf' : 'brik';
    }
  }

  async init({ onProgress = null } = {}) {
    if (this.isReady) return;
    initDiskCache();

    const { create, globals } = await import('webgpu');
    Object.assign(globalThis, globals);
    const gpu = create([]);
    try {
      Object.defineProperty(globalThis.navigator, 'gpu', { value: gpu, configurable: true, writable: true });
    } catch {
      globalThis.navigator = { gpu };
    }
    globalThis.location = globalThis.location || { search: '' };

    let targetUrl = this.modelUrl;
    if (this.localBrikFile) {
      const { server, port } = await startLocalServer(this.localBrikFile);
      this.server = server;
      const ext = this.format === 'gguf' ? 'gguf' : 'brik';
      targetUrl = `http://127.0.0.1:${port}/local-model.${ext}`;
    }

    const sdkPath = getSdkMjsPath();
    if (!sdkPath) {
      throw new Error(t('SDK ESM bundle not found (packages/sdk/dist/brimkern.mjs). Run npm run build:sdk.', 'Bundle ESM du SDK introuvable (packages/sdk/dist/brimkern.mjs). Exécutez npm run build:sdk.'));
    }

    const sdk = await import(sdkPath);
    if (typeof sdk.preload === 'function') {
      await withQuietSdkLogs(() => sdk.preload({
        model: targetUrl,
        onProgress: (status, p) => {
          if (onProgress) onProgress(status, p?.loaded, p?.total);
        },
      }));
    }
    this.session = await withQuietSdkLogs(() => sdk.createSession({
      model: targetUrl,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
      system: this.systemPrompt,
    }));

    this.isReady = true;
  }

  async ask(prompt, { onToken = null, signal = null } = {}) {
    if (!this.isReady) {
      await this.init();
    }
    const t0 = performance.now();
    let lastLen = 0;
    try {
      const text = await withQuietSdkLogs(() => this.session.ask(prompt, {
        signal,
        onToken: (acc) => {
          if (onToken) {
            // Un emoji découpé en plusieurs tokens arrive d'abord en « \uFFFD » que le SDK remplace
            // au token suivant : on retient la queue non résolue, sinon « �� » restait à l'écran.
            const stable = acc.replace(/\uFFFD+$/, '');
            if (stable.length > lastLen) {
              onToken(stable.slice(lastLen));
              lastLen = stable.length;
            }
          }
        },
      }));
      const t1 = performance.now();
      return { text: text || '', elapsedMs: t1 - t0, aborted: !!signal?.aborted };
    } catch (err) {
      if (signal?.aborted) {
        return { text: '', elapsedMs: performance.now() - t0, aborted: true };
      }
      throw err;
    }
  }

  async reset() {
    if (this.session) {
      this.session.reset();
    }
  }

  // Questions indépendantes servies ENSEMBLE (SDK session.askBatch, ≥ 0.5.0) : une passe pour toutes
  // quand le modèle le permet. null si le SDK chargé ne sait pas le faire (l'appelant enchaîne).
  async askBatch(prompts, { maxTokens } = {}) {
    if (!this.isReady) await this.init();
    if (typeof this.session.askBatch !== 'function') return null;
    return withQuietSdkLogs(() => this.session.askBatch(prompts, { maxTokens }));
  }

  async close() {
    try {
      if (this.session) {
        this.session.destroy();
      }
      if (this.server) {
        this.server.close();
      }
    } catch {}
  }
}

// ── Moteur Chromium Headless (repli universel pour GGUF ou sans bindings natifs) ─────
class BrimkernChromiumEngine {
  constructor(options = {}) {
    this.modelKey = options.model || 'coder';
    this.maxTokens = options.maxTokens || 512;
    this.temperature = options.temperature ?? 0.3;
    this.systemPrompt = options.system || PRESET_CLI_MODELS[this.modelKey]?.defaultSystem || 'You are a code assistant.';
    this.raw = !!options.raw;
    this.localBrikFile = null;

    this.resolveModelConfig();
    if (options.displayName) this.displayName = options.displayName;

    this.server = null;
    this.browserCtx = null;
    this.page = null;
    this.isReady = false;
    this.bridgesExposed = false;
    this.currentOnToken = null;
    this.currentOnProgress = null;
    this.engineType = 'Chromium headless';
    this.gpuBackend = process.platform === 'darwin' ? 'Chromium (Metal)' : 'Chromium (Vulkan)';
  }

  resolveModelConfig() {
    if (PRESET_CLI_MODELS[this.modelKey]) {
      this.modelUrl = PRESET_CLI_MODELS[this.modelKey].url;
      this.displayName = PRESET_CLI_MODELS[this.modelKey].name;
      this.format = PRESET_CLI_MODELS[this.modelKey].format;
    } else if (existsSync(this.modelKey)) {
      this.localBrikFile = resolve(this.modelKey);
      this.displayName = t(`Local file (${this.modelKey})`, `Fichier local (${this.modelKey})`);
      this.format = this.modelKey.toLowerCase().endsWith('.gguf') ? 'gguf' : 'brik';
    } else {
      this.modelUrl = this.modelKey;
      this.displayName = this.modelKey;
      this.format = this.modelKey.endsWith('.gguf') ? 'gguf' : 'brik';
    }
  }

  async ensureBridges() {
    if (!this.bridgesExposed && this.page) {
      await this.page.exposeFunction('onTokenBridge', (delta) => {
        if (this.currentOnToken) this.currentOnToken(delta);
      });
      await this.page.exposeFunction('onProgressBridge', (phase, loaded, total) => {
        if (this.currentOnProgress) this.currentOnProgress(phase, loaded, total);
      });
      this.bridgesExposed = true;
    }
  }

  async init({ onProgress = null } = {}) {
    if (this.isReady) return;
    const chromeExe = findChromium();
    if (!chromeExe) {
      throw new Error(t(
        'Chromium with WebGPU support not found.\nInstall it with: npx playwright install chromium\nOr install Google Chrome on your system.',
        'Chromium avec support WebGPU introuvable.\nInstallez-le avec : npx playwright install chromium\nOu installez Google Chrome sur votre système.',
      ));
    }

    // Démarrage du serveur local
    const { server, port } = await startLocalServer(this.localBrikFile);
    this.server = server;
    this.port = port;

    if (this.localBrikFile) {
      const ext = this.format === 'gguf' ? 'gguf' : 'brik';
      this.modelUrl = `http://127.0.0.1:${port}/local-model.${ext}`;
    }

    // Profil persistant pour mettre en cache les modèles téléchargés (IndexedDB / CacheStorage)
    const cacheBase = process.env.XDG_CACHE_HOME || join(homedir(), '.cache');
    this.profileDir = join(cacheBase, 'brimkern', 'chrome-profile');
    if (!existsSync(this.profileDir)) {
      mkdirSync(this.profileDir, { recursive: true });
    }
    cleanLocks(this.profileDir);
    purgeOrphanCacheBuckets(this.profileDir);

    // Lancement de Chromium headless avec WebGPU + Metal / Vulkan
    this.browserCtx = await chromium.launchPersistentContext(this.profileDir, {
      executablePath: chromeExe,
      headless: true,
      args: [
        '--enable-unsafe-webgpu',
        '--use-webgpu-adapter=default',
        process.platform === 'darwin' ? '--use-angle=metal' : '--use-angle=vulkan',
        '--enable-features=Vulkan,DefaultANGLEVulkan',
        '--disable-gpu-watchdog',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    this.page = await this.browserCtx.newPage();
    this.currentOnProgress = onProgress;
    await this.ensureBridges();

    await this.page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });

    // Initialisation de la session Brimkern dans le contexte WebGPU et préchauffage en VRAM
    await this.page.evaluate(async ({ modelUrl, maxTokens, temperature, systemPrompt }) => {
      window.session = await window.Brimkern.createSession({
        model: modelUrl,
        maxTokens,
        temperature,
        system: systemPrompt,
      });

      if (window.session && typeof window.session.on === 'function') {
        window.session.on('progress', (phase, p) => {
          if (window.onProgressBridge) {
            window.onProgressBridge(phase, p?.loaded || 0, p?.total || 0);
          }
        });
      }

      // Préchargement explicite en VRAM (évite le freeze au premier prompt)
      if (window.Brimkern && typeof window.Brimkern.preload === 'function') {
        let lastReport = 0;
        await window.Brimkern.preload({
          model: modelUrl,
          onProgress: (status, p) => {
            const now = performance.now();
            if (now - lastReport > 80 || status !== 'download') {
              lastReport = now;
              if (window.onProgressBridge) {
                window.onProgressBridge(status, p?.loaded || 0, p?.total || 0);
              }
            }
          },
        });
      }
    }, {
      modelUrl: this.modelUrl,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
      systemPrompt: this.systemPrompt,
    });

    this.isReady = true;
  }

  async ask(prompt, { onToken = null, onProgress = null, signal = null } = {}) {
    if (!this.isReady) {
      await this.init({ onProgress });
    }

    // exposeFunction ne s'enregistre qu'une fois par page : les ponts sont posés au premier
    // appel et redirigent vers les callbacks du tour courant. Les ré-enregistrer à chaque tour
    // échouait en silence et livrait les tokens aux closures du PREMIER tour (spinner jamais
    // arrêté, compteur à 0).
    this.currentOnToken = onToken;
    this.currentOnProgress = onProgress;
    await this.ensureBridges();

    if (signal) {
      signal.addEventListener('abort', () => {
        this.page?.evaluate(() => {
          if (window._currentAbort) window._currentAbort.abort();
        }).catch(() => {});
      }, { once: true });
    }

    const result = await this.page.evaluate(async (p) => {
      window._currentAbort = new AbortController();
      let lastLen = 0;
      // Chaque appel de pont est asynchrone : on attend qu'ils soient tous livrés avant de
      // rendre la main, sinon les derniers tokens s'impriment après la ligne de stats.
      let pending = Promise.resolve();
      const t0 = performance.now();
      try {
        const text = await window.session.ask(p, {
          signal: window._currentAbort.signal,
          onToken: (acc) => {
            // Queue « \uFFFD » retenue jusqu'à résolution (emoji sur plusieurs tokens).
            const stable = acc.replace(/\uFFFD+$/, '');
            if (stable.length > lastLen) {
              pending = window.onTokenBridge(stable.slice(lastLen));
              lastLen = stable.length;
            }
          }
        });
        await pending;
        const t1 = performance.now();
        return { text: text || '', elapsedMs: t1 - t0, aborted: window._currentAbort.signal.aborted };
      } catch (err) {
        if (window._currentAbort && window._currentAbort.signal.aborted) {
          return { text: '', elapsedMs: performance.now() - t0, aborted: true };
        }
        throw err;
      }
    }, prompt);

    return result;
  }

  async reset() {
    if (!this.page) return;
    await this.page.evaluate(() => {
      if (window.session) window.session.reset();
    });
  }

  async close() {
    try {
      if (this.browserCtx) await this.browserCtx.close();
      if (this.server) this.server.close();
      if (this.profileDir && existsSync(this.profileDir)) {
        cleanLocks(this.profileDir);
      }
    } catch {}
  }
}

// ── Modèles du Hub : même résolution que le site ─────────────────────────────────────────
// `--model=Qwen/Qwen3-0.6B-GGUF`, l'URL de la page du dépôt ou celle d'un fichier : le résolveur
// du site (src/lib/deeplink.ts, compilé par `npm run build:sdk`) choisit le même fichier que
// `?model=` sur brimkern.com (BRIK d'abord, sinon le meilleur quant GGUF mono-fichier).
async function resolveHubModel(input) {
  const modPath = join(ROOT, 'bin', 'generated', 'deeplink.mjs');
  if (!existsSync(modPath)) {
    throw new Error(t('Hugging Face resolver missing: run `npm run build:sdk` first.', 'Résolveur Hugging Face absent : lancez d\'abord `npm run build:sdk`.'));
  }
  const { parseModelInput, resolveHfModel } = await import(pathToFileURL(modPath).href);
  const parsed = parseModelInput(input);
  if (!parsed) {
    throw new Error(t(
      `Unknown model « ${input} ». Use a preset (${Object.keys(PRESET_CLI_MODELS).join(', ')}), a Hugging Face repo (owner/repo), a .gguf/.brik URL or a local file.`,
      `Modèle inconnu « ${input} ». Utilisez un preset (${Object.keys(PRESET_CLI_MODELS).join(', ')}), un dépôt Hugging Face (auteur/modèle), une URL .gguf/.brik ou un fichier local.`,
    ));
  }
  if ('url' in parsed) {
    return { url: parsed.url, displayName: decodeURIComponent(parsed.url.split('/').slice(-1)[0]) };
  }
  process.stderr.write(`${C.dim}${t(`Looking up ${parsed.id} on Hugging Face...`, `Recherche de ${parsed.id} sur Hugging Face...`)}${C.reset}\n`);
  let target;
  try {
    target = await resolveHfModel(parsed.id, parsed.file);
  } catch (e) {
    // Les messages du résolveur sont ceux du site, en français : traduits ici pour l'anglais.
    const m = String(e?.message || e);
    const id = parsed.id;
    throw new Error(LANG === 'fr' ? m
      : /Aucun fichier chargeable/.test(m) ? `No loadable file in « ${id} »: Brimkern reads .brik and single-file .gguf, and this repo has neither. Look for a GGUF version of this model.`
      : /privé|licence/.test(m) ? `The repo « ${id} » is private or requires accepting its license on Hugging Face.`
      : /introuvable/.test(m) ? `Repo not found on Hugging Face: « ${id} ».`
      : /Fichier non chargeable/.test(m) ? `Not a loadable file: « ${parsed.file} » (expected .brik or a single-file .gguf).`
      : /HTTP \d+/.test(m) ? `Hugging Face answered ${m.match(/HTTP \d+/)[0]} for « ${id} ».`
      : `Could not reach Hugging Face for « ${id} » (network?).`);
  }
  process.stderr.write(`${C.dim}→ ${target.path}${C.reset}\n`);
  return { url: target.url, displayName: `${parsed.id} · ${target.path}` };
}

// ── Fabrique unifiée de moteur CLI ───────────────────────────────────────────────────
async function createCliEngine(options = {}) {
  options = { ...options, model: resolveModelKey(options.model) };
  if (!PRESET_CLI_MODELS[options.model] && !existsSync(options.model)) {
    const hub = await resolveHubModel(options.model);
    options.model = hub.url;
    options.displayName = hub.displayName;
  }
  if (!options.system) {
    // Modèle du Hub ou fichier local : même consigne que les presets de code.
    const base = PRESET_CLI_MODELS[options.model]?.defaultSystem || PRESET_CLI_MODELS.coder.defaultSystem;
    options.system = base + buildProjectContext();
  }
  MODEL_OPENS_THINK = !!PRESET_CLI_MODELS[options.model]?.opensThink;
  // Garde mémoire : un modèle trop gros pour la machine la fait swapper jusqu'au blocage (un 7B a
  // déjà planté un Mac de test). BRIMKERN_IGNORE_RAM=1 passe outre, à ses risques.
  const minMem = PRESET_CLI_MODELS[options.model]?.minMemGB;
  if (minMem && totalmem() / 2 ** 30 < minMem && process.env.BRIMKERN_IGNORE_RAM !== '1') {
    throw new Error(t(`"${options.model}" needs ${minMem} GB of memory or more (this machine: ${(totalmem() / 2 ** 30).toFixed(0)} GB). Use "coder" instead, or BRIMKERN_IGNORE_RAM=1 to force it.`,
      `« ${options.model} » demande ${minMem} Go de mémoire ou plus (cette machine : ${(totalmem() / 2 ** 30).toFixed(0)} Go). Prenez « coder », ou BRIMKERN_IGNORE_RAM=1 pour forcer.`));
  }
  const forceChromium = !!options.chromium || !!options.headless || process.env.BRIMKERN_FORCE_CHROMIUM === '1';
  const forceNative = !!options.native || process.env.BRIMKERN_FORCE_NATIVE === '1';
  const modelKey = options.model || 'coder';
  const isGguf = modelKey.endsWith('.gguf') || PRESET_CLI_MODELS[modelKey]?.format === 'gguf';

  if (forceChromium) {
    return new BrimkernChromiumEngine(options);
  }

  // GGUF → Chromium par défaut (choix historique, bb0b756), SAUF les presets marqués `engine: 'native'` :
  // Gemma 4 et Qwen 3.5 ont été validés contre llama.cpp dans le moteur Dawn natif (graphes propres,
  // tokenizers tirés du GGUF, aucune dépendance navigateur) et y démarrent sans lancer de navigateur.
  if (isGguf && !forceNative && PRESET_CLI_MODELS[modelKey]?.engine !== 'native') {
    return new BrimkernChromiumEngine(options);
  }

  // Tenter le moteur natif Dawn
  const hasSdk = !!getSdkMjsPath();
  const dawnAvailable = hasSdk && await BrimkernNativeDawnEngine.isAvailable();

  if (dawnAvailable) {
    try {
      return new BrimkernNativeDawnEngine(options);
    } catch {
      // Repli en cas d'erreur
    }
  }

  if (forceNative) {
    throw new Error(t('Native Dawn engine requested (--native) but unavailable on this system.', 'Moteur natif Dawn demandé (--native) mais indisponible sur ce système.'));
  }

  if (!options.raw) {
    process.stderr.write(`${C.dim}[Notice] ${t('Falling back to headless Chromium (universal WebGPU support)...', 'Repli sur Chromium headless (support WebGPU universel)...')}${C.reset}\n`);
  }
  return new BrimkernChromiumEngine(options);
}

// ── Détection et notification de mise à jour ───────────────────────────────────────────
const UPDATE_CHECK_INTERVAL_MS = 4 * 3600 * 1000; // 4 heures

function getLocalGitCommit() {
  if (existsSync(join(ROOT, '.git'))) {
    try {
      return execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {}
  }
  return null;
}

function fetchRemoteHeadCommit() {
  try {
    const out = execSync('git ls-remote --heads https://github.com/RomainKH/Brimkern.git main', {
      timeout: 3500,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const match = out.match(/^([a-f0-9]{7,40})/);
    return match ? match[1].slice(0, 7) : null;
  } catch {
    return null;
  }
}

function scheduleBackgroundUpdateCheck() {
  const cfg = loadCliConfig();
  const now = Date.now();
  if (cfg.lastUpdateCheck && (now - cfg.lastUpdateCheck) < UPDATE_CHECK_INTERVAL_MS) {
    return;
  }

  // Ne jamais bloquer le démarrage de la CLI : s'exécute en arrière-plan sans await
  const timer = setTimeout(() => {
    try {
      const currentCommit = getLocalGitCommit();
      if (!currentCommit) return;

      const remoteCommit = fetchRemoteHeadCommit();
      if (!remoteCommit) return;

      let hasUpdate = false;
      try {
        execSync(`git merge-base --is-ancestor ${remoteCommit} HEAD`, {
          cwd: ROOT,
          stdio: ['ignore', 'ignore', 'ignore'],
        });
        hasUpdate = false;
      } catch {
        hasUpdate = (currentCommit !== remoteCommit);
      }

      saveCliConfig({
        lastUpdateCheck: Date.now(),
        updateInfo: {
          available: hasUpdate,
          current: currentCommit,
          latest: remoteCommit,
          checkedAt: new Date().toISOString(),
        },
      });
    } catch {}
  }, 1000);
  if (timer.unref) timer.unref();
}

function printUpdateNoticeIfAvailable() {
  try {
    const cfg = loadCliConfig();
    const info = cfg.updateInfo;
    if (!info || !info.available) return;

    const boxContent = [
      `${C.bold}${t(`A new version of Brimkern is available (${info.current} → ${info.latest})`, `Une nouvelle version de Brimkern est disponible (${info.current} → ${info.latest})`)}${C.reset}`,
      `${C.dim}${t('Run `brimkern update` or `/update` to upgrade.', 'Lancez `brimkern update` ou `/update` pour mettre à jour.')}${C.reset}`,
    ];

    console.log(drawBox(`${C.yellow}▲ ${t('UPDATE AVAILABLE', 'MISE À JOUR DISPONIBLE')}${C.reset}`, boxContent, { color: C.yellow }) + '\n');
  } catch {}
}

// ── Mise à jour de la CLI (brimkern update / /update) ─────────────────────────────────
async function runCliUpdate() {
  console.log(`\n${C.boldRed}Brimkern CLI${C.reset} — ${t('Update & Upgrade', 'Mise à jour')}\n`);

  const isGitRepo = existsSync(join(ROOT, '.git'));
  if (isGitRepo) {
    try {
      const currentCommit = execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
      const isClean = !execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim();

      process.stdout.write(`${C.dim}▸ ${t('Checking for updates...', 'Vérification des mises à jour...')}${C.reset}\n`);
      execSync('git fetch --quiet origin', { cwd: ROOT });

      const targetRef = currentBranch === 'HEAD' ? 'origin/main' : `origin/${currentBranch}`;
      let remoteCommit = '';
      try {
        remoteCommit = execSync(`git rev-parse --short ${targetRef}`, { cwd: ROOT, encoding: 'utf8' }).trim();
      } catch {
        remoteCommit = execSync('git rev-parse --short origin/main', { cwd: ROOT, encoding: 'utf8' }).trim();
      }

      if (currentCommit === remoteCommit) {
        console.log(`${C.green}✓ ${t('Brimkern is already up to date', 'Brimkern est déjà à jour')} (${currentCommit}).${C.reset}\n`);
        saveCliConfig({
          updateInfo: { available: false, current: currentCommit, latest: remoteCommit, checkedAt: new Date().toISOString() },
          lastUpdateCheck: Date.now(),
        });
        return false;
      }

      if (!isClean && ROOT !== join(homedir(), '.brimkern')) {
        console.log(`${C.yellow}⚠ ${t(
          `Local repository has uncommitted modifications. Please stash or commit them before updating:\n  git -C "${ROOT}" stash`,
          `Le dépôt local a des modifications non commitées. Mettez-les de côté (stash) avant de mettre à jour :\n  git -C "${ROOT}" stash`
        )}${C.reset}\n`);
        return false;
      }

      console.log(`${C.cyan}▸ ${t(`Updating: ${currentCommit} → ${remoteCommit}...`, `Mise à jour : ${currentCommit} → ${remoteCommit}...`)}${C.reset}`);

      if (ROOT === join(homedir(), '.brimkern')) {
        execSync(`git checkout --quiet --force ${remoteCommit}`, { cwd: ROOT });
      } else {
        execSync('git pull --ff-only', { cwd: ROOT });
      }

      process.stdout.write(`${C.dim}▸ ${t('Updating dependencies...', 'Mise à jour des dépendances...')}${C.reset}\n`);
      execSync('npm install --no-audit --no-fund --loglevel=error', { cwd: ROOT, stdio: 'inherit' });

      process.stdout.write(`${C.dim}▸ ${t('Rebuilding engine & SDK...', 'Recompilation du moteur et SDK...')}${C.reset}\n`);
      execSync('npm run build:sdk', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, BRIMKERN_REGEN_FIGE: '1' } });

      const newCommit = execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
      console.log(`\n${C.boldGreen}✓ ${t('Brimkern CLI updated successfully to', 'Brimkern CLI mis à jour avec succès vers')} ${newCommit} !${C.reset}\n`);
      saveCliConfig({
        updateInfo: { available: false, current: newCommit, latest: newCommit, checkedAt: new Date().toISOString() },
        lastUpdateCheck: Date.now(),
      });
      return true;
    } catch (err) {
      console.error(`\n${C.red}✗ ${t('Update failed:', 'Échec de la mise à jour :')} ${err.message}${C.reset}\n`);
      return false;
    }
  }

  // Cas installation hors git : réexécution du script officiel
  try {
    process.stdout.write(`${C.dim}▸ ${t('Running official installer...', 'Exécution du script d’installation officiel...')}${C.reset}\n`);
    execSync('curl -fsSL https://brimkern.com/install.sh | bash', { stdio: 'inherit' });
    console.log(`\n${C.boldGreen}✓ ${t('Brimkern CLI updated successfully!', 'Brimkern CLI mis à jour avec succès !')}${C.reset}\n`);
    saveCliConfig({
      updateInfo: { available: false, checkedAt: new Date().toISOString() },
      lastUpdateCheck: Date.now(),
    });
    return true;
  } catch (err) {
    console.error(`\n${C.red}✗ ${t('Update failed:', 'Échec de la mise à jour :')} ${err.message}${C.reset}\n`);
    return false;
  }
}

// ── Bannière de marque "Le Kern" ─────────────────────────────────────────────────────
function printBrandBanner(engine, mode = 'code', think = 'auto') {
  const git = getGitInfo();
  const gitStr = git ? `  ${C.dim}·${C.reset}  Git${t(':', ' :')} ${C.sand}${git.branch}${git.dirty ? '*' : ''}${C.reset}` : '';
  const gpuStr = engine.gpuBackend || (process.platform === 'darwin' ? 'Dawn (Metal)' : 'Dawn (Vulkan)');
  const engineStr = engine.engineType || t('Native Dawn (in-process)', 'Natif Dawn (in-process)');
  const modeBadge = CLI_MODES[mode]?.badge || '[CODE]';
  const cfg = loadCliConfig();
  const isDefault = cfg.lastModel === engine.modelKey || (!cfg.lastModel && engine.modelKey === 'coder');
  const defaultSuffix = isDefault ? ` ${C.dim}(${t('default', 'défaut')})${C.reset}` : '';

  console.log(`
${C.boldRed}██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗███████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║████╗ ████║██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██╔████╔██║█████═╝ █████╗  ██████╔╝██╔██╗ ██║
██╔══██╗██╔══██╗██║██║╚██╔╝██║██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██████╔╝██║  ██║██║██║ ╚═╝ ██║██║ ╚██╗███████╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝${C.reset}
${C.dim}${t('On-device WebGPU & WGSL inference engine', "Moteur d'inférence WebGPU & WGSL on-device")}${C.reset}

${drawBox(`${C.boldRed}Brimkern WGSL${C.reset}`, [
  `${t('Model:', 'Modèle :')} ${C.yellow}${engine.displayName}${C.reset}${defaultSuffix}`,
  `${t('Engine:', 'Moteur :')} ${C.green}${engineStr}${C.reset}  ${C.dim}·${C.reset}  WebGPU${t(':', ' :')} ${C.cyan}${gpuStr}${C.reset}`,
  `Mode${t(':', ' :')} ${modeBadge}  ${C.dim}·${C.reset}  Think${t(':', ' :')} ${C.sand}${think}${C.reset}  ${C.dim}·${C.reset}  ${C.green}${t('100% local', '100 % local')}${C.reset}${gitStr}`,
], { color: C.red })}
${C.dim}${t('Type', 'Tapez')} ${C.boldRed}/help${C.reset}${C.dim} ${t('for commands', 'pour les commandes')} · ${C.yellow}Tab${C.reset}${C.dim} ${t('to complete', 'pour compléter')} · ${C.yellow}Esc${C.reset}${C.dim} ${t('to cancel', 'pour annuler')}${C.reset}
`);

  printUpdateNoticeIfAvailable();
}

// ── Aide REPL complète ────────────────────────────────────────────────────────────────
function printReplHelp() {
  const row = (cmd, desc, color = C.cyan) => `  ${C.bold}${color}${cmd.padEnd(21)}${C.reset}${desc}`;
  const head = (txt) => `${C.boldRed}${txt}${C.reset}`;
  console.log(`
${C.bold}${t('Brimkern interactive commands:', 'Commandes interactives Brimkern :')}${C.reset}

${head(t('ASSISTANT & CONTEXT', 'ASSISTANT & CONTEXTE'))}
${row(t('@path/file', '@chemin/fichier'), t(`Injects the file into the prompt (e.g. ${C.dim}@src/app.ts:1-50${C.reset})`, `Injecte le fichier dans le prompt (ex: ${C.dim}@src/app.ts:1-50${C.reset})`))}
${row('/diff [args]', t('Reviews your git changes', 'Analyse vos modifications git et propose une revue'))}
${row('/commit', t('Suggests 3 conventional commit messages', 'Génère 3 propositions de messages de commit conventionnels'))}
${row(t('/review <file>', '/review <fichier>'), t('In-depth code review (bugs, security, perf)', 'Revue de code approfondie (bugs, sécurité, perf)'))}
${row('/copy', t('Copies the last answer to the clipboard', 'Copie la dernière réponse dans le presse-papier'))}
${row('/accept, /apply', t('Extracts and copies the suggested code blocks', 'Extrait et copie/affiche les blocs de code proposés'))}

${head(t('AI MODES & CONTROL', "MODES & CONTRÔLE DE L'IA"))}
${row(t('/mode [name]', '/mode [nom]'), t(`Switches mode (${C.yellow}code, plan, review, auto${C.reset})`, `Bascule le mode (${C.yellow}code, plan, review, auto${C.reset})`))}
${row(t('/think [level]', '/think [niveau]'), t(`Step-by-step reasoning level (${C.sand}off, auto, deep${C.reset})`, `Niveau de réflexion pas à pas (${C.sand}off, auto, deep${C.reset})`))}
${row('/status', t('Full status (model, GPU, mode, git)', 'État complet (modèle, GPU, mode, git)'))}

${head(t('CONVERSATION & SESSION', 'CONVERSATION & SESSION'))}
${row('/model, /models', t('Interactive model selector (↑/↓ arrows) or hot switch', 'Sélecteur interactif de modèles (flèches ↑/↓) ou changement à chaud'))}
${row('/reset', t('Clears the history and frees the GPU KV cache', "Efface l'historique et libère le cache KV GPU"))}
${row('/stats', t('Session stats (tokens, tok/s, estimated savings)', 'Statistiques de session (tokens, tok/s, économies estimées)'))}
${row('/clear', t('Clears the terminal screen', "Efface l'écran du terminal"))}

${head(t('KEYBOARD SHORTCUTS', 'RACCOURCIS CLAVIER'))}
${row('Tab, →', t('Accepts the suggestion: commands (/), modes, files (@)', 'Accepte la suggestion : commandes (/), modes, fichiers (@)'), C.yellow)}
${row('Escape', t('Stops the running inference / clears the input', "Interrompt l'inférence en cours / efface la saisie"), C.yellow)}
${row('Ctrl+C', t('Cancels generation without killing the REPL session', 'Annule la génération sans tuer la session REPL'), C.yellow)}

${head(t('SYSTEM & UPDATES', 'SYSTÈME & MISES À JOUR'))}
${row('/update, /upgrade', t('Checks and installs CLI updates', 'Vérifie et installe les mises à jour de la CLI'))}
${row(t('!command', '!commande'), t(`Runs a local shell command (e.g. ${C.dim}!git status${C.reset})`, `Exécute une commande shell locale (ex: ${C.dim}!git status${C.reset})`))}
${row('/exit, /quit', t('Quits the session', 'Quitte la session'))}
`);
}

// ── Aide CLI One-shot ─────────────────────────────────────────────────────────────────
function printHelp() {
  const opt = (flag, desc) => `  ${C.yellow}${flag.padEnd(33)}${C.reset}${desc}`;
  const use = (cmd, note = '') => `  ${C.green}${cmd}${C.reset}${note ? ` ${C.gray}# ${note}${C.reset}` : ''}`;
  const cfg = loadCliConfig();
  const defaultModel = resolveModelKey(cfg.lastModel || 'coder');
  console.log(`
${C.boldRed}BRIMKERN CLI${C.reset} — ${t('Local AI inference on WebGPU (WGSL) from your terminal', 'Inférence IA locale en WebGPU (WGSL) depuis le terminal')}

${C.bold}${t('USAGE', 'UTILISATION')}${C.reset}
${use('brimkern [options] [prompt]')}
${use('brimkern chat                   ', t('Interactive REPL', 'Mode REPL interactif'))}
${use('brimkern mcp                    ', t('Model Context Protocol (MCP) stdio server for AI agents', 'Serveur stdio MCP (Model Context Protocol) pour agents IA'))}
${use('brimkern models                 ', t('Lists the preset models', 'Liste les modèles pré-configurés'))}
${use('brimkern update                 ', t('Updates the CLI to the latest version', 'Met à jour la CLI vers la dernière version'))}
${use(`cat file.ts | brimkern "${t('Find the bugs', 'Trouve les bugs')}"`)}
${use(`brimkern "${t('Explain', 'Explique')} @src/app/Composer.tsx:10-40"`)}

${C.bold}OPTIONS${C.reset}
${opt(t('-m, --model=<name|url|file>', '-m, --model=<nom|url|fichier>'), t(`Model (default: ${defaultModel})`, `Modèle (défaut : ${defaultModel})`))}
${opt('-s, --system=<prompt>', t('System prompt', 'Prompt système'))}
${opt('-n, --max-tokens=<n>', t('Max generated tokens (default: 512)', 'Plafond de tokens générés (défaut : 512)'))}
${opt('-t, --temperature=<val>', t('Temperature (default: 0.3)', 'Température (défaut : 0.3)'))}
${opt('--mode=<code|plan|review|auto>', t('AI mode (default: code)', "Mode d'intervention IA (défaut : code)"))}
${opt('--think=<off|auto|deep>', t('Step-by-step reasoning level (default: auto)', 'Niveau de réflexion pas à pas (défaut : auto)'))}
${opt('--lang=<en|fr>', t('Interface language (default: en; also BRIMKERN_LANG)', 'Langue de l’interface (défaut : en ; aussi BRIMKERN_LANG)'))}
${opt('--native', t('Forces the native Dawn engine (in-process)', "Force l'exécution native Dawn (in-process)"))}
${opt('--chromium, --headless', t('Forces headless Chromium (universal fallback)', "Force l'exécution via Chromium headless (repli universel)"))}
${opt('-q, --quiet', t('Quiet output only (raw model output, no banners or stats)', 'Sortie brute silencieuse (sans bannière ni stats)'))}
${opt('--json', t('Output execution results as structured JSON', 'Sortie au format JSON structuré pour agents et scripts'))}
${opt('--raw', t('Raw output only (no header or stats)', 'Sortie brute uniquement (sans en-tête ni stats)'))}
${opt('-h, --help', t('Shows this help', 'Affiche cette aide'))}

${C.bold}${t('MODELS', 'MODÈLES')}${C.reset}
${Object.entries(PRESET_CLI_MODELS).map(([key, m]) => `  ${C.cyan}${key.padEnd(8)}${C.reset} ${m.shortName} (${m.formatLabel}, ${m.size}) — ${C.dim}${m.desc}${C.reset}`).join('\n')}
`);
}

function printModels() {
  console.log(`\n${C.boldRed}${t('Models available in the Brimkern CLI:', 'Modèles disponibles pour la CLI Brimkern :')}${C.reset}\n`);
  for (const [key, m] of Object.entries(PRESET_CLI_MODELS)) {
    console.log(`  ${C.bold}${C.cyan}${key.padEnd(12)}${C.reset} ${C.bold}${m.name}${C.reset} [${C.yellow}${m.size}${C.reset}]`);
    console.log(`               ${C.gray}${m.desc}${C.reset}`);
    console.log(`               ${C.dim}URL${t(':', ' :')} ${m.url}${C.reset}\n`);
  }
  console.log(`${C.gray}${t('You can also pass a local file: --model=/path/to/model.brik', 'Vous pouvez aussi spécifier un fichier local : --model=/chemin/vers/modele.brik')}${C.reset}\n`);
}

const KNOWN_COMMANDS = ['chat', 'models', 'list', 'update', 'upgrade', 'help', 'version', 'config', 'status', 'mcp', 'serve-mcp'];
const COMMON_ALIASES = {
  'run': 'chat',
  'start': 'chat',
  'repl': 'chat',
  'interactive': 'chat',
  'up': 'update',
  'check': 'status',
  'doctor': 'status',
  'model': 'models',
  'install': 'update',
  'mcp-server': 'mcp',
  'server': 'mcp',
};

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, () => new Uint8Array(n + 1));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

function findClosestCommand(word) {
  const w = word.toLowerCase().trim();
  if (COMMON_ALIASES[w]) return COMMON_ALIASES[w];
  let closest = null;
  let minDistance = 3;
  for (const cmd of KNOWN_COMMANDS) {
    const dist = levenshtein(w, cmd);
    if (dist < minDistance) {
      minDistance = dist;
      closest = cmd;
    }
  }
  return closest;
}

function stripAnsi(str) {
  return typeof str === 'string' ? str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '') : '';
}

// Retour à la ligne d'une chaîne colorée sur une largeur VISIBLE (les codes ANSI ne comptent
// pas). Les styles actifs sont refermés en fin de ligne et rouverts sur la suivante.
function wrapAnsi(str, width) {
  const tokens = str.match(/\x1b\[[0-9;]*m|\s+|[^\s\x1b]+/g) || [];
  const lines = [];
  let cur = '';
  let curLen = 0;
  let active = '';
  const pushLine = () => { lines.push(cur + (active ? C.reset : '')); cur = active; curLen = 0; };
  for (let tok of tokens) {
    if (tok.startsWith('\x1b[')) {
      cur += tok;
      active = tok === C.reset ? '' : active + tok;
      continue;
    }
    if (/^\s+$/.test(tok)) {
      if (curLen === 0) continue;
      if (curLen + tok.length > width) { pushLine(); continue; }
      cur += tok; curLen += tok.length;
      continue;
    }
    while (tok.length > width) {           // mot plus long que la boîte : coupé net
      if (curLen > 0) pushLine();
      cur += tok.slice(0, width); curLen = width; tok = tok.slice(width);
      pushLine();
    }
    if (curLen + tok.length > width && curLen > 0) {
      cur = cur.replace(/\s+$/, ''); pushLine();
    }
    cur += tok; curLen += tok.length;
  }
  if (curLen > 0 || !lines.length) lines.push(cur + (active ? C.reset : ''));
  return lines.map((l) => {
    const vis = stripAnsi(l).replace(/\s+$/, '');
    return vis.length === stripAnsi(l).length ? l : l.replace(/\s+(\x1b\[0m)?$/, '$1');
  });
}

// Suffixe d'une chaîne colorée à partir du n-ième caractère VISIBLE (styles actifs conservés).
function sliceVisible(str, n) {
  let vis = 0;
  let styles = '';
  for (let i = 0; i < str.length;) {
    const m = str.slice(i).match(/^\x1b\[[0-9;]*m/);
    if (m) { styles = m[0] === C.reset ? '' : styles + m[0]; i += m[0].length; continue; }
    if (vis === n) return styles + str.slice(i);
    vis++; i++;
  }
  return '';
}

// Boîte à bordure calculée sur la largeur visible : les boîtes étaient montées à la main avec
// padEnd sur des chaînes colorées, donc tout contenu plus long que prévu (nom de modèle,
// description) débordait du cadre et décalait le bord droit.
function drawBox(title, rows, { color = C.darkGray, titleColor = C.yellow, indent = '', width } = {}) {
  const cols = process.stdout.columns || 80;
  const outer = Math.max(40, Math.min(width || 78, cols - indent.length - 1));
  const inner = outer - 4;
  const out = [];
  const t = title ? ` ${title} ` : '';
  out.push(`${indent}${color}┌─${C.reset}${titleColor}${t}${C.reset}${color}${'─'.repeat(Math.max(1, outer - 3 - stripAnsi(t).length))}┐${C.reset}`);
  const put = (line) => {
    const pad = Math.max(0, inner - stripAnsi(line).length);
    out.push(`${indent}${color}│${C.reset} ${line}${' '.repeat(pad)} ${color}│${C.reset}`);
  };
  for (const row of rows) {
    // « Libellé : valeur » : les lignes repliées s'alignent sous la valeur.
    const colon = stripAnsi(row).indexOf(' : ');
    const hang = colon > 0 && colon < inner / 2 ? colon + 3 : 0;
    const [first, ...rest] = wrapAnsi(row, inner);
    put(first);
    if (rest.length) {
      const restText = row.slice(0); // re-replier le reste sur la largeur diminuée
      const consumed = stripAnsi(first).length;
      const remaining = wrapAnsi(sliceVisible(restText, consumed).replace(/^\s+/, ''), inner - hang);
      for (const l of remaining) put(' '.repeat(hang) + l);
    }
  }
  out.push(`${indent}${color}└${'─'.repeat(outer - 2)}┘${C.reset}`);
  return out.join('\n');
}

// ── Sélecteur interactif et scrollable de modèles (Flèches ↑/↓, Entrée, Échap) ───────
async function selectModelInteractive(currentModelKey) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    printModels();
    return null;
  }

  const items = Object.entries(PRESET_CLI_MODELS).map(([key, m]) => ({
    key,
    name: m.shortName,
    size: m.size,
    format: m.formatLabel,
    runtime: m.runtime,
    badge: m.badge,
    desc: m.desc,
  }));

  if (!items.some((it) => it.key === currentModelKey) && currentModelKey) {
    items.unshift({
      key: currentModelKey,
      name: t('Active custom model', 'Modèle personnalisé actif'),
      size: 'Local',
      format: 'brik/gguf',
      runtime: 'WebGPU',
      badge: t('Local file', 'Fichier local'),
      desc: t(`Custom file or URL in use: ${currentModelKey}`, `Fichier ou URL personnalisé en cours d'utilisation : ${currentModelKey}`),
    });
  }

  const selectedIndex0 = items.findIndex((it) => it.key === currentModelKey);
  let selectedIndex = selectedIndex0 === -1 ? 0 : selectedIndex0;

  const terminalRows = process.stdout.rows || 24;
  const pageSize = Math.min(items.length, Math.max(4, terminalRows - 11));
  let scrollOffset = 0;

  function ensureVisible() {
    if (selectedIndex < scrollOffset) {
      scrollOffset = selectedIndex;
    } else if (selectedIndex >= scrollOffset + pageSize) {
      scrollOffset = selectedIndex - pageSize + 1;
    }
  }
  ensureVisible();

  const terminalCols = Math.min(80, Math.max(64, (process.stdout.columns || 80) - 4));
  const innerWidth = terminalCols - 6;

  function render() {
    const lines = [];
    const header = `${C.darkGray}┌─${C.reset} ${C.boldRed}Brimkern${C.reset} ${C.dim}·${C.reset} ${C.bold}${t('On-device model selector', 'Sélecteur de modèles on-device')}${C.reset} `;
    lines.push(`${header}${C.darkGray}${'─'.repeat(Math.max(2, terminalCols - stripAnsi(header).length - 1))}┐${C.reset}`);
    lines.push(`${C.dim}  ${t('Use ↑/↓ to scroll · Enter to activate · Esc to cancel', 'Utilisez les flèches ↑/↓ pour faire défiler · Entrée pour activer · Échap pour annuler')}${C.reset}`);
    lines.push('');

    if (scrollOffset > 0) {
      lines.push(`${C.dim}    ▲ ... (${t(`${scrollOffset} model(s) above`, `${scrollOffset} modèle(s) au-dessus`)})${C.reset}`);
    } else {
      lines.push(`${C.darkGray}    ┄${C.reset}`);
    }

    const visibleItems = items.slice(scrollOffset, scrollOffset + pageSize);
    visibleItems.forEach((item, relIdx) => {
      const idx = scrollOffset + relIdx;
      const isSelected = idx === selectedIndex;
      const isActive = item.key === currentModelKey;

      const pointer = isSelected ? `${C.boldRed}❯${C.reset}` : ' ';
      const keyFormatted = isSelected ? `${C.bold}${C.cyan}${item.key.padEnd(11)}${C.reset}` : `${C.cyan}${item.key.padEnd(11)}${C.reset}`;
      const nameFormatted = isSelected ? `${C.bold}${item.name.padEnd(30)}${C.reset}` : `${C.gray}${item.name.padEnd(30)}${C.reset}`;
      const sizeFormatted = `${C.yellow}${item.size.padStart(7)}${C.reset}`;
      const formatBadge = `${C.darkGray}[${C.reset}${C.sand}${item.format.padEnd(10)}${C.reset}${C.darkGray}]${C.reset}`;
      const activeBadge = isActive ? ` ${C.boldGreen}● ${t('active', 'actif')}${C.reset}` : '';

      lines.push(`  ${pointer} ${keyFormatted} ${nameFormatted} ${formatBadge} ${sizeFormatted}${activeBadge}`);
    });

    const remainingBelow = items.length - (scrollOffset + pageSize);
    if (remainingBelow > 0) {
      lines.push(`${C.dim}    ▼ ... (${t(`${remainingBelow} model(s) below`, `${remainingBelow} modèle(s) en-dessous`)})${C.reset}`);
    } else {
      lines.push(`${C.darkGray}    ┄${C.reset}`);
    }

    const cur = items[selectedIndex];
    lines.push('');
    lines.push(drawBox(t(`Spec sheet: ${cur.name}`, `Fiche technique : ${cur.name}`), [
      `${C.bold}${t('Architecture:', 'Architecture :')}${C.reset} ${C.yellow}${cur.name}${C.reset}  ${C.dim}·${C.reset}  ${C.bold}${t('Size:', 'Taille :')}${C.reset} ${C.yellow}${cur.size}${C.reset}  ${C.dim}·${C.reset}  ${C.cyan}[${cur.badge}]${C.reset}`,
      `${C.gray}${cur.desc}${C.reset}`,
      `${C.bold}${t('Format:', 'Format :')}${C.reset} ${C.sand}${cur.format}${C.reset}  ${C.dim}·${C.reset}  ${C.bold}${t('Engine:', 'Moteur :')}${C.reset} ${C.green}${cur.runtime}${C.reset}`,
      `${C.dim}${t('Command:', 'Commande :')} /model ${cur.key}${C.reset}`,
    ], { indent: '  ', width: terminalCols }));

    return lines.join('\n') + '\n';
  }

  return new Promise((resolve) => {
    process.stdout.write('\x1b[?25l');

    // Hauteur du DERNIER rendu : la fiche technique se replie sur un nombre de lignes variable
    // selon la description, donc remonter d'une hauteur fixe laissait des restes à l'écran.
    const initialRender = render();
    process.stdout.write(initialRender);
    let totalLines = initialRender.split('\n').length - 1;
    const redraw = () => {
      process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
      const out = render();
      process.stdout.write(out);
      totalLines = out.split('\n').length - 1;
    };

    const wasRaw = process.stdin.isRaw;
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
    // Le menu reprend stdin alors que readline est en pause : sans détacher ses écouteurs,
    // readline recevait aussi les touches (↑/↓ = historique, Entrée = envoi de la ligne
    // rappelée) et lançait une génération en parallèle du changement de modèle.
    const foreignKeypress = process.stdin.listeners('keypress');
    process.stdin.removeAllListeners('keypress');
    process.stdin.resume();

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      process.stdin.removeListener('keypress', onKey);
      for (const l of foreignKeypress) process.stdin.on('keypress', l);
      process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
      process.stdout.write('\x1b[?25h');
      if (process.stdin.setRawMode) {
        process.stdin.setRawMode(wasRaw);
      }
    };

    const onKey = (char, key) => {
      if (!key) return;

      if (key.name === 'up' || key.name === 'k') {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        ensureVisible();
        redraw();
        return;
      }

      if (key.name === 'down' || key.name === 'j') {
        selectedIndex = (selectedIndex + 1) % items.length;
        ensureVisible();
        redraw();
        return;
      }

      if (key.name === 'pageup') {
        selectedIndex = Math.max(0, selectedIndex - pageSize);
        ensureVisible();
        redraw();
        return;
      }

      if (key.name === 'pagedown') {
        selectedIndex = Math.min(items.length - 1, selectedIndex + pageSize);
        ensureVisible();
        redraw();
        return;
      }

      if (key.name === 'home') {
        selectedIndex = 0;
        ensureVisible();
        redraw();
        return;
      }

      if (key.name === 'end') {
        selectedIndex = items.length - 1;
        ensureVisible();
        redraw();
        return;
      }

      // Raccourcis numériques 1 à items.length
      if (char && char >= '1' && char <= String(Math.min(9, items.length))) {
        selectedIndex = parseInt(char, 10) - 1;
        ensureVisible();
        redraw();
        return;
      }

      // Validation
      if (key.name === 'return' || key.name === 'enter') {
        cleanup();
        resolve(items[selectedIndex]);
        return;
      }

      // Annulation
      if (key.name === 'escape' || char === 'q' || (key.ctrl && key.name === 'c')) {
        cleanup();
        resolve(null);
        return;
      }
    };

    process.stdin.on('keypress', onKey);
  });
}

// ── Mode REPL interactif ──────────────────────────────────────────────────────────────
async function runInteractiveChat(initialEngine) {
  let engine = initialEngine;
  let currentMode = 'code';
  let thinkLevel = 'auto';

  printBrandBanner(engine, currentMode, thinkLevel);

  const formatProgress = (phase, loaded, total) => {
    if (total && total > 0) {
      const mbLoaded = Math.round(loaded / 1048576);
      const mbTotal = Math.round(total / 1048576);
      const pct = Math.min(100, Math.round((loaded / total) * 100));
      return `${mbLoaded} / ${mbTotal} Mo (${pct}%)`;
    }
    if (phase === 'init') return t('Initializing...', 'Initialisation...');
    if (phase === 'download') return t('Downloading weights...', 'Téléchargement des poids...');
    if (phase === 'gpu') return t('Loading tensors into VRAM & compiling shaders...', 'Chargement VRAM & compilation shaders...');
    if (phase === 'tokenizer') return t('Loading tokenizer...', 'Chargement du tokenizer...');
    return phase ? `Phase: ${phase}` : '';
  };

  process.stderr.write(`${C.dim}▸ ${t('Initializing GPU and preloading model...', 'Initialisation du GPU et préchargement du modèle...')}${C.reset}`);
  let lastProgressStr = '';
  await engine.init({
    onProgress: (phase, loaded, total) => {
      const detail = formatProgress(phase, loaded, total);
      if (detail && detail !== lastProgressStr) {
        lastProgressStr = detail;
        process.stderr.write(`\r\x1b[2K${C.dim}▸ ${t('Loading model into GPU VRAM...', 'Chargement du modèle dans la mémoire VRAM GPU...')} ${C.yellow}${detail}${C.reset}`);
      }
    }
  });
  process.stderr.write(`\r\x1b[2K${C.green}✓ ${t('WebGPU engine ready', 'Moteur WebGPU prêt et connecté')} [${engine.engineType}].${C.reset}\n\n`);

  // État de session (stats, lastResponse)
  const sessionState = {
    totalTokens: 0,
    totalElapsedMs: 0,
    totalInChars: 0,   // entrée cumulée qu'une API aurait facturée (estimation des économies)
    historyChars: 0,   // historique de la conversation en cours, renvoyé à chaque tour
    lastResponse: '',
  };

  const completer = createCliCompleter();
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    completer,
  });

  function updatePrompt() {
    rl.setPrompt(`${renderPromptStatus(engine, currentMode, thinkLevel)}\n${C.boldRed}kern ›${C.reset} `);
  }

  updatePrompt();
  rl.prompt();

  let isGenerating = false;
  let inInteractiveMenu = false;
  let currentAbortController = null;
  const spinner = new ActivitySpinner();

  readline.emitKeypressEvents(process.stdin);

  const liveSuggest = createLiveSuggest(rl);
  rl.prependListener('line', () => liveSuggest.onSubmit());

  process.stdin.on('keypress', (char, key) => {
    if (!key || inInteractiveMenu) return;
    if (!isGenerating) {
      if (key.name === 'return' || key.name === 'enter') return;
      if (key.name === 'escape') liveSuggest.clear();
      else if (key.name === 'right' && liveSuggest.accept()) { /* suggestion acceptée */ }
      // Laisser readline finir de redessiner la ligne avant de dessiner par-dessus.
      setImmediate(() => { if (!isGenerating && !inInteractiveMenu) liveSuggest.update(); });
    }

    // 1. Pendant la génération : Escape ou Ctrl+C interrompt immédiatement l'inférence
    if (isGenerating) {
      if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
        if (currentAbortController) {
          currentAbortController.abort();
        }
        spinner.stop(true);
        process.stdout.write(`\n${C.yellow}⚠ ${t('Interrupted', 'Interrompu')} (${key.name === 'escape' ? 'Escape' : 'Ctrl+C'})${C.reset}\n`);
      }
      return;
    }

    // 2. Hors génération : Escape efface la ligne en cours de saisie
    if (key.name === 'escape') {
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
      rl.line = '';
      rl.cursor = 0;
      updatePrompt();
      rl.prompt();
    }
  });

  rl.on('SIGINT', () => {
    if (inInteractiveMenu) return;
    if (isGenerating) {
      if (currentAbortController) {
        currentAbortController.abort();
      }
      spinner.stop(true);
      process.stdout.write(`\n${C.yellow}⚠ ${t('Interrupted', 'Interrompu')} (Ctrl+C)${C.reset}\n`);
      return;
    }
    if (rl.line.length > 0) {
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
      rl.line = '';
      rl.cursor = 0;
      updatePrompt();
      rl.prompt();
      return;
    }
    console.log(`\n${C.dim}${t('(To quit, type /exit or Ctrl+D)', '(Pour quitter, tapez /exit ou Ctrl+D)')}${C.reset}`);
    updatePrompt();
    rl.prompt();
  });

  // Un seul tour à la fois : une ligne arrivée pendant un tour (génération, changement de
  // modèle, menu) est ignorée plutôt que lancée sur un moteur en cours de fermeture.
  let turnInProgress = false;
  rl.on('line', async (line) => {
    if (turnInProgress) return;
    turnInProgress = true;
    rl.pause();
    const resumeAndPrompt = () => {
      turnInProgress = false;
      updatePrompt();
      rl.resume();
      rl.prompt();
    };

    let input = line.trim();
    if (!input) {
      resumeAndPrompt();
      return;
    }

    // 1. Commandes shell directes (!cmd ou /exec cmd)
    if (input.startsWith('!') || input.startsWith('/exec ')) {
      const cmd = input.startsWith('!') ? input.slice(1).trim() : input.slice(6).trim();
      if (!cmd) { resumeAndPrompt(); return; }
      console.log(`${C.dim}$ ${cmd}${C.reset}`);
      try {
        execSync(cmd, { stdio: 'inherit' });
      } catch (e) {
        console.error(`${C.red}${t('Execution error:', "Erreur d'exécution :")} ${e.message}${C.reset}`);
      }
      console.log('');
      resumeAndPrompt();
      return;
    }

    // 2. Commandes slash
    if (input === '/exit' || input === '/quit') {
      await engine.close();
      process.exit(0);
    }
    if (input === '/help') {
      printReplHelp();
      resumeAndPrompt();
      return;
    }
    if (input === '/clear') {
      console.clear();
      printBrandBanner(engine, currentMode, thinkLevel);
      resumeAndPrompt();
      return;
    }
    if (input === '/reset') {
      await engine.reset();
      sessionState.historyChars = 0;
      console.log(`${C.yellow}✓ ${t('Conversation history and KV cache reset.', 'Historique conversationnel et cache KV réinitialisés.')}${C.reset}\n`);
      resumeAndPrompt();
      return;
    }
    if (input === '/status') {
      printStatusCard(engine, currentMode, thinkLevel, sessionState);
      resumeAndPrompt();
      return;
    }
    if (input === '/mode' || input.startsWith('/mode ')) {
      const targetMode = input.slice(5).trim().toLowerCase();
      if (!targetMode) {
        console.log(`\n${C.bold}${t('Available modes:', "Modes d'utilisation disponibles :")}${C.reset}\n`);
        for (const [key, m] of Object.entries(CLI_MODES)) {
          const isActive = key === currentMode;
          console.log(`  ${m.badge} ${C.bold}${m.name.padEnd(8)}${C.reset} ${m.desc}${isActive ? ` ${C.boldGreen}◀ (${t('Active', 'Actif')})${C.reset}` : ''}`);
        }
        console.log(`\n${C.dim}Usage${t(':', ' :')} /mode <code|plan|review|auto>${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      if (CLI_MODES[targetMode]) {
        currentMode = targetMode;
        console.log(`${C.green}✓ ${t('Mode switched to', 'Mode basculé vers')} ${CLI_MODES[targetMode].badge}${t(':', ' :')} ${CLI_MODES[targetMode].desc}${C.reset}\n`);
      } else {
        console.log(`${C.red}${t(`Unknown mode: "${targetMode}". Choices: code, plan, review, auto`, `Mode inconnu : "${targetMode}". Choix : code, plan, review, auto`)}${C.reset}\n`);
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/think' || input.startsWith('/think ')) {
      const targetThink = input.slice(6).trim().toLowerCase();
      if (!targetThink) {
        console.log(`\n${C.bold}${t('Available reasoning levels:', 'Niveaux de réflexion disponibles :')}${C.reset}\n`);
        for (const [key, lvl] of Object.entries(THINKING_LEVELS)) {
          const isActive = key === thinkLevel;
          console.log(`  ${C.bold}${lvl.color}${key.padEnd(8)}${C.reset} : ${lvl.desc}${isActive ? ` ${C.boldGreen}◀ (${t('Active', 'Actif')})${C.reset}` : ''}`);
        }
        console.log(`\n${C.dim}Usage${t(':', ' :')} /think <off|auto|deep>${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      if (THINKING_LEVELS[targetThink]) {
        thinkLevel = targetThink;
        console.log(`${C.green}✓ ${t('Reasoning level set to', 'Niveau de réflexion défini sur')} [${targetThink}]${t(':', ' :')} ${THINKING_LEVELS[targetThink].desc}${C.reset}\n`);
      } else {
        console.log(`${C.red}${t(`Unknown level: "${targetThink}". Choices: off, auto, deep`, `Niveau inconnu : "${targetThink}". Choix : off, auto, deep`)}${C.reset}\n`);
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/copy') {
      if (!sessionState.lastResponse) {
        console.log(`${C.dim}${t('No previous answer to copy.', 'Aucune réponse précédente à copier.')}${C.reset}\n`);
      } else {
        const ok = copyToClipboard(sessionState.lastResponse);
        if (ok) {
          console.log(`${C.green}✓ ${t('Last answer copied to the system clipboard.', 'Dernière réponse copiée dans le presse-papier système.')}${C.reset}\n`);
        } else {
          console.log(`${C.yellow}${t('Could not copy to the clipboard.', 'Impossible de copier dans le presse-papier.')}${C.reset}\n`);
        }
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/accept' || input === '/apply') {
      if (!sessionState.lastResponse) {
        console.log(`${C.dim}${t('No recent edit suggestion to apply.', "Aucune proposition d'édition récente à appliquer.")}${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      const codeBlockRegex = /```(?:[a-zA-Z0-9_\-]+)?\n([\s\S]*?)```/g;
      const matches = [...sessionState.lastResponse.matchAll(codeBlockRegex)];
      if (matches.length === 0) {
        console.log(`${C.yellow}${t('No code block found in the last answer.', 'Aucun bloc de code détecté dans la dernière réponse.')}${C.reset}\n`);
      } else {
        console.log(`\n${C.bold}${t('Code blocks found in the last answer:', 'Blocs de code détectés dans la dernière réponse :')}${C.reset}`);
        matches.forEach((m, idx) => {
          const snippet = m[1].trim();
          const firstLine = snippet.split('\n')[0] || '';
          console.log(`  ${C.cyan}#${idx + 1}${C.reset} (${snippet.split('\n').length} ${t('lines', 'lignes')}) — ${C.dim}${firstLine.slice(0, 50)}${C.reset}`);
        });
        const copied = copyToClipboard(sessionState.lastResponse);
        if (copied) {
          console.log(`\n${C.green}✓ ${t('Code extracted and copied to the system clipboard.', 'Code extrait et copié dans le presse-papier système pour intégration.')}${C.reset}\n`);
        }
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/stats' || input === '/cost' || input === '/tokens') {
      const elapsedSec = (sessionState.totalElapsedMs / 1000).toFixed(1);
      const avgSpeed = sessionState.totalElapsedMs > 0 ? ((sessionState.totalTokens / sessionState.totalElapsedMs) * 1000).toFixed(1) : '—';
      console.log(`
${C.bold}${t('Brimkern session stats:', 'Statistiques de session Brimkern :')}${C.reset}
  • ${t('Generated tokens', 'Tokens générés').padEnd(16)} : ${C.yellow}${sessionState.totalTokens}${C.reset} tokens
  • ${t('Compute time', 'Temps de calcul').padEnd(16)} : ${C.cyan}${elapsedSec} s${C.reset}
  • ${t('Average speed', 'Vitesse moyenne').padEnd(16)} : ${C.green}~${avgSpeed} tok/s${C.reset}
  • ${t('Saved (est.)', 'Économisé (est.)').padEnd(16)} : ${C.boldGreen}${fmtUsd(estimateSavings(sessionState.totalInChars, sessionState.totalTokens))}${C.reset} ${C.dim}${t(
    `vs an API at $${REF_PRICE.in} / $${REF_PRICE.out} per M tokens (input / output) — change with BRIMKERN_PRICE_IN / _OUT`,
    `vs une API à ${REF_PRICE.in} $ / ${REF_PRICE.out} $ par M tokens (entrée / sortie) — BRIMKERN_PRICE_IN / _OUT pour changer`,
  )}${C.reset}
  • ${t('Privacy', 'Confidentialité').padEnd(16)} : ${C.green}100% on-device${C.reset} ${C.dim}${t('(not a single byte leaves your machine)', '(aucun octet envoyé hors de la machine)')}${C.reset}
`);
      resumeAndPrompt();
      return;
    }
    if (input === '/update' || input === '/upgrade') {
      const updated = await runCliUpdate();
      if (updated) {
        console.log(`${C.yellow}ℹ ${t('Please restart brimkern to use the new version.', 'Veuillez redémarrer brimkern pour appliquer la nouvelle version.')}${C.reset}\n`);
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/model' || input.startsWith('/model ') || input === '/models' || input.startsWith('/models ')) {
      let targetModel = input.startsWith('/models') ? input.slice(7).trim() : input.slice(6).trim();
      if (!targetModel) {
        if (process.stdin.isTTY && process.stdout.isTTY) {
          inInteractiveMenu = true;
          const choice = await selectModelInteractive(engine.modelKey);
          inInteractiveMenu = false;
          if (!choice) {
            console.log(`${C.dim}${t('Selection cancelled.', 'Sélection annulée.')}${C.reset}\n`);
            resumeAndPrompt();
            return;
          }
          if (choice.key === engine.modelKey) {
            console.log(`${C.yellow}ℹ ${t(`${choice.name} is already active.`, `Le modèle ${choice.name} est déjà actif.`)}${C.reset}\n`);
            resumeAndPrompt();
            return;
          }
          targetModel = choice.key;
        } else {
          printModels();
          console.log(`${C.gray}${t('Active model:', 'Modèle actif :')} ${C.yellow}${engine.displayName}${C.reset} [${C.green}${engine.engineType}${C.reset}]\n`);
          resumeAndPrompt();
          return;
        }
      }
      process.stderr.write(`${C.dim}▸ ${t(`Switching model to ${targetModel}...`, `Changement de modèle vers ${targetModel}...`)}${C.reset}`);
      await engine.close();
      try {
        engine = await createCliEngine({
          model: targetModel,
          system: engine.systemPrompt,
          maxTokens: engine.maxTokens,
          temperature: engine.temperature,
        });
        let lastSwitchProgress = '';
        await engine.init({
          onProgress: (phase, loaded, total) => {
            const detail = formatProgress(phase, loaded, total);
            if (detail && detail !== lastSwitchProgress) {
              lastSwitchProgress = detail;
              process.stderr.write(`\r\x1b[2K${C.dim}▸ ${t('Loading model into GPU VRAM...', 'Chargement du modèle dans la mémoire VRAM GPU...')} ${C.yellow}${detail}${C.reset}`);
            }
          }
        });
        saveCliConfig({ lastModel: engine.modelKey });
        sessionState.historyChars = 0; // nouveau moteur = nouvelle conversation
        process.stderr.write(`\r\x1b[2K${C.green}✓ ${t('Active model:', 'Modèle actif :')} ${engine.displayName} [${engine.engineType}] ${C.dim}(${t('saved as default', 'mémorisé par défaut')})${C.reset}\n\n`);
      } catch (err) {
        process.stderr.write(`\r\x1b[2K${C.red}✗ ${t('Model switch failed:', 'Échec du changement de modèle :')} ${err.message}${C.reset}\n\n`);
      }
      resumeAndPrompt();
      return;
    }

    // 3. Raccourcis Git intégrés
    if (input === '/diff' || input.startsWith('/diff ')) {
      const diffArgs = input.slice(5).trim();
      const diff = getGitDiff(diffArgs);
      if (!diff) {
        console.log(`${C.dim}${t('No git changes found.', 'Aucune modification git détectée.')}${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      console.log(`${C.dim}${t(`Analyzing the git diff (${diff.split('\n').length} lines)...`, `Analyse du diff git (${diff.split('\n').length} lignes)...`)}${C.reset}\n`);
      input = `${t('Give a concise technical review of these git changes: potential bugs, regressions, security and style.', 'Fais une revue technique concise de ces changements git : bugs potentiels, régressions, sécurité et style.')}\n\n\`\`\`diff\n${diff}\n\`\`\``;
    } else if (input === '/commit') {
      const status = getGitStatusSummary();
      const diff = getGitDiff();
      if (!status && !diff) {
        console.log(`${C.dim}${t('The git working tree is clean, no commit to suggest.', "L'arbre de travail git est propre, aucun commit à proposer.")}${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      console.log(`${C.dim}${t('Generating commit messages for the current changes...', 'Génération des messages de commit pour les modifications en cours...')}${C.reset}\n`);
      input = t(
        `Here is the current state of my git repository:\n\nStatus:\n${status}\n\nDiff:\n\`\`\`diff\n${diff.slice(0, 4000)}\n\`\`\`\n\nWrite 3 concise conventional commit message suggestions (type: explicit title), each with a short one-sentence diagnosis.`,
        `Voici l'état actuel de mon dépôt git :\n\nStatus :\n${status}\n\nDiff :\n\`\`\`diff\n${diff.slice(0, 4000)}\n\`\`\`\n\nRédige 3 propositions de messages de commit conventionnels concis (type: titre explicite) en français et en anglais avec un court diagnostic de 1 phrase.`,
      );
    } else if (input.startsWith('/review ')) {
      const targetFile = input.slice(8).trim();
      const resolved = resolve(process.cwd(), targetFile);
      if (!existsSync(resolved)) {
        console.log(`${C.red}${t('File not found:', 'Fichier introuvable :')} ${targetFile}${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      const code = readFileSync(resolved, 'utf8');
      console.log(`${C.dim}${t(`Reviewing ${targetFile} (${code.split('\n').length} lines)...`, `Revue de code de ${targetFile} (${code.split('\n').length} lignes)...`)}${C.reset}\n`);
      input = `${t(`In-depth code review of ${targetFile}: analyze potential bugs, robustness, performance and edge cases.`, `Revue de code approfondie pour le fichier ${targetFile} : analyse les bugs potentiels, la robustesse, les performances et les cas limites.`)}\n\n\`\`\`\n${code.slice(0, 4000)}\n\`\`\``;
    }

    // 4. Résolution des références de fichiers @chemin/vers/fichier
    const { prompt: finalPrompt, files } = resolveFileReferences(input);
    if (files.length > 0) {
      for (const f of files) {
        console.log(`${C.dim}📎 ${t('Context loaded:', 'Contexte chargé :')} @${f.path} (${f.lineCount} ${t('lines', 'lignes')})${C.reset}`);
      }
      console.log('');
    }

    // 5. Exécution de l'inférence WebGPU avec feedback visuel & annulation
    isGenerating = true;
    currentAbortController = new AbortController();
    let tokenCount = 0;

    spinner.start(t('Preparing the prompt & context...', 'Préparation du prompt & contexte...'));
    if (files.length > 0) {
      spinner.setPhase(t(`Loading ${files.length} context file(s)...`, `Chargement de ${files.length} fichier(s) de contexte...`));
    }

    const thinkFilter = createStreamPrinter(spinner, () => { tokenCount++; });

    try {
      spinner.setPhase(t('Computing WebGPU logits (TTFT)...', 'Calcul des logits WebGPU (TTFT)...'));

      let composedPrompt = finalPrompt;
      const modeConfig = CLI_MODES[currentMode] || CLI_MODES.code;
      if (modeConfig.systemSuffix) {
        composedPrompt += modeConfig.systemSuffix;
      }
      composedPrompt += thinkSuffixFor(engine.modelKey, thinkLevel);

      const res = await engine.ask(composedPrompt, {
        signal: currentAbortController.signal,
        onToken: (tok) => {
          thinkFilter.feed(tok);
        },
        onProgress: (phase, loaded, total) => {
          if (total) {
            const loadedMb = Math.round(loaded / 1048576);
            const totalMb = Math.round(total / 1048576);
            if (phase === 'gpu') {
              spinner.setPhase(t(`Loading to VRAM: ${loadedMb} / ${totalMb} MB`, `Chargement en VRAM : ${loadedMb} / ${totalMb} Mo`));
            } else {
              spinner.setPhase(t(`Downloading: ${loadedMb} / ${totalMb} MB`, `Téléchargement : ${loadedMb} / ${totalMb} Mo`));
            }
          } else {
            spinner.setPhase(`Phase${t(':', ' :')} ${phase}`);
          }
        },
      });

      thinkFilter.flush();
      spinner.stop(true);

      if (!res.aborted) {
        sessionState.lastResponse = res.text;
        sessionState.totalTokens += tokenCount;
        sessionState.totalElapsedMs += res.elapsedMs;
        const turnInChars = engine.systemPrompt.length + sessionState.historyChars + composedPrompt.length;
        sessionState.totalInChars += turnInChars;
        sessionState.historyChars += composedPrompt.length + res.text.length;
        const turnSaved = estimateSavings(turnInChars, tokenCount);
        const sessionSaved = estimateSavings(sessionState.totalInChars, sessionState.totalTokens);

        console.log('\n');
        const speed = res.elapsedMs > 0 ? ((tokenCount / res.elapsedMs) * 1000).toFixed(1) : '—';
        console.log(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens · ${savingsLabel(turnSaved)}${C.gray} (session${t(':', ' :')} ${fmtUsd(sessionSaved)})${C.reset} ${C.dim}(${engine.gpuBackend})${C.reset}\n`);
      }
    } catch (e) {
      spinner.stop(true);
      if (!currentAbortController.signal.aborted) {
        console.error(`\n${C.red}${t('Error:', 'Erreur :')} ${e.message}${C.reset}\n`);
      }
    } finally {
      isGenerating = false;
      currentAbortController = null;
    }

    resumeAndPrompt();
  });

  rl.on('close', async () => {
    await engine.close();
    process.exit(0);
  });
}

// ── Serveur MCP (stdio, JSON-RPC 2.0) ─────────────────────────────────────────────────
// stdout est le canal du protocole : une seule ligne non JSON dessus et le client coupe la
// connexion. Tout le reste (journal, notices, logs du SDK) part sur stderr.
const MCP_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const MCP_DEFAULT_MAX_TOKENS = 512;
const MCP_MAX_TOKENS_CEILING = 2048;

const MCP_TOOLS = [
  {
    name: 'brimkern_ask',
    description: 'Execute a fast, local WebGPU AI query at $0.00 cost (0 API tokens consumed). Perfect for routine questions, boilerplate generation, explanations, regex crafting, or fast subagent experiments. Each call is independent (no memory of previous calls).',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The instruction, prompt, or question for the WebGPU model' },
        model: { type: 'string', description: 'Model preset: "coder" (default, Qwen 3 4B, light), "coder-max" (Qwen 3.6 35B-A3B MoE, strongest, needs 20 GB+ of memory), "super-coder" (Qwen 3.5 4B SSM), a Hugging Face repo or a .gguf/.brik URL' },
        mode: { type: 'string', enum: ['code', 'plan', 'review', 'auto'], description: 'Behavior mode (default: code)' },
        max_tokens: { type: 'integer', description: `Maximum tokens to generate (default: ${MCP_DEFAULT_MAX_TOKENS}, max: ${MCP_MAX_TOKENS_CEILING})` },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'brimkern_review',
    description: 'Run a code review on a file or code snippet using local WebGPU inference. Looks for bugs, edge cases, vulnerabilities, and perf issues without spending API credits.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'The source code content to review' },
        file_path: { type: 'string', description: 'Optional file path or name for context' },
        max_tokens: { type: 'integer', description: `Maximum tokens to generate (default: ${MCP_DEFAULT_MAX_TOKENS})` },
      },
      required: ['code'],
    },
  },
  {
    name: 'brimkern_generate_tests',
    description: 'Generate unit tests for a code snippet locally on WebGPU with zero API cost.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'The source code to write unit tests for' },
        test_framework: { type: 'string', description: 'Test framework: vitest (default), jest, pytest, bats, etc.' },
        max_tokens: { type: 'integer', description: `Maximum tokens to generate (default: ${MCP_DEFAULT_MAX_TOKENS})` },
      },
      required: ['code'],
    },
  },
  {
    name: 'brimkern_stats',
    description: 'Get local WebGPU engine telemetry: active model, tokens served, and estimated savings ($). Does not load a model.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function runMcpServer(initialOptions = {}) {
  // Le SDK et ses dépendances tracent en console.log : redirigé vers stderr pour toute la durée
  // du serveur (withQuietSdkLogs restaure CETTE version, pas l'originale).
  console.log = console.info = console.debug = (...a) => process.stderr.write(format(...a) + '\n');

  let engine = null;
  let currentModelKey = resolveModelKey(initialOptions.model || 'coder');
  let totalTokensServed = 0;
  let totalInCharsServed = 0;
  let callsServed = 0;

  // Une seule génération à la fois sur le moteur : la session du SDK refuse un 2e ask concurrent
  // (« génération déjà en cours »), et deux appels simultanés chargeaient chacun LEUR moteur (3 × 2,5
  // Go en VRAM pour 3 appels groupés, deux jamais refermés). Les appels passent donc par une file
  // (pump, plus bas), qui sert ensemble ceux qui attendent.

  async function getEngine(modelKey) {
    const resolved = resolveModelKey(modelKey);
    if (engine && engine.requestedModel === resolved) return engine;
    if (engine) {
      try { await engine.close(); } catch {}
      engine = null;
    }
    process.stderr.write(`[Brimkern MCP] Loading model "${resolved}" on WebGPU...\n`);
    const eng = await createCliEngine({
      model: resolved,
      maxTokens: MCP_MAX_TOKENS_CEILING,
      raw: true,
      native: initialOptions.native,
      chromium: initialOptions.chromium,
    });
    await eng.init();
    eng.requestedModel = resolved;
    engine = eng;
    currentModelKey = resolved;
    process.stderr.write(`[Brimkern MCP] Model "${resolved}" ready (${eng.gpuBackend || 'WebGPU'}).\n`);
    return eng;
  }

  // Chaque appel d'outil est indépendant : la session gardait l'historique, si bien qu'une revue
  // de code voyait les questions des appels précédents (et le contexte finissait par déborder).
  async function generate({ prompt, model, maxTokens }) {
    const eng = await getEngine(model || currentModelKey);
    await eng.reset();
    const limit = Math.min(Math.max(1, Number.parseInt(maxTokens, 10) || MCP_DEFAULT_MAX_TOKENS), MCP_MAX_TOKENS_CEILING);
    const composed = prompt + thinkSuffixFor(eng.modelKey, 'auto');
    const ac = new AbortController();
    let acc = '';
    let tokens = 0;
    const res = await eng.ask(composed, {
      signal: ac.signal,
      onToken: (delta) => {
        acc += delta;
        tokens++;
        if (tokens >= limit && !ac.signal.aborted) ac.abort();
      },
    });
    totalTokensServed += tokens;
    totalInCharsServed += eng.systemPrompt.length + composed.length;
    callsServed++;
    // Coupé par max_tokens, le SDK rend '' : le texte reçu jusque-là fait foi.
    return { text: stripThink(res.text || acc), truncated: res.aborted };
  }

  const TOOL_PROMPTS = {
    brimkern_ask: (a) => {
      if (!a.prompt) throw new Error('Missing parameter "prompt"');
      return a.prompt + (CLI_MODES[a.mode]?.systemSuffix || '');
    },
    brimkern_review: (a) => {
      if (!a.code) throw new Error('Missing parameter "code"');
      return `Perform an in-depth, rigorous code review of ${a.file_path || 'snippet'}. Focus on:
1. Potential bugs, off-by-one errors, null/undefined crashes
2. Performance bottlenecks and memory leaks
3. Edge cases and error handling robustness
4. Security vulnerabilities
Provide concise, actionable findings and corrected code blocks where applicable.\n\n\`\`\`\n${a.code}\n\`\`\`${CLI_MODES.review.systemSuffix}`;
    },
    brimkern_generate_tests: (a) => {
      if (!a.code) throw new Error('Missing parameter "code"');
      return `Generate a complete, production-grade test suite using ${a.test_framework || 'vitest'} for the following code. Include happy path, boundary values, invalid inputs, and mock dependencies if needed:\n\n\`\`\`\n${a.code}\n\`\`\``;
    },
  };

  function statsText() {
    const preset = PRESET_CLI_MODELS[currentModelKey];
    return JSON.stringify({
      model: engine ? (engine.displayName || engine.modelKey) : (preset?.name || currentModelKey),
      loaded: !!engine,
      backend: engine ? (engine.gpuBackend || 'WebGPU') : null,
      callsServed,
      totalTokensServed,
      estimatedSavingsUsd: Number(estimateSavings(totalInCharsServed, totalTokensServed).toFixed(5)),
      privacy: '100% on-device WebGPU (0 bytes sent to external cloud)',
    }, null, 2);
  }

  // APPELS PAR LOTS. Un agent envoie souvent plusieurs appels d'outils d'un coup : au lieu de les
  // servir l'un après l'autre, les générations qui attendent quand le moteur se libère partent
  // ENSEMBLE (jusqu'à MCP_BATCH_MAX, même modèle et même plafond de tokens), en une passe par token
  // pour toutes (session.askBatch). Les stats gardent leur place dans la file : elles comptent les
  // appels envoyés AVANT elles. Un moteur sans lots (Chromium, SDK < 0.5) les enchaîne comme avant.
  const MCP_BATCH_MAX = 4;
  const pending = [];
  let pumping = false;
  const limitOf = (maxTokens) => Math.min(Math.max(1, Number.parseInt(maxTokens, 10) || MCP_DEFAULT_MAX_TOKENS), MCP_MAX_TOKENS_CEILING);
  const batchKey = (it) => `${resolveModelKey(it.args.model || currentModelKey)}|${limitOf(it.args.maxTokens)}`;

  async function generateGroup(argsList) {
    const eng = await getEngine(argsList[0].model || currentModelKey);
    const limit = limitOf(argsList[0].maxTokens);
    const composed = argsList.map((a) => a.prompt + thinkSuffixFor(eng.modelKey, 'auto'));
    const outs = eng.askBatch ? await eng.askBatch(composed, { maxTokens: limit }) : null;
    if (!outs) {
      const res = [];
      for (const a of argsList) res.push(await generate(a));
      return res;
    }
    callsServed += outs.length;
    outs.forEach((t, i) => {
      totalTokensServed += Math.round(t.length / 4); // estimation (la génération groupée ne rend pas de compte exact)
      totalInCharsServed += eng.systemPrompt.length + composed[i].length;
    });
    process.stderr.write(`[Brimkern MCP] ${outs.length} appels servis ensemble.\n`);
    return outs.map((t) => ({ text: stripThink(t), truncated: false }));
  }

  async function pump() {
    if (pumping) return;
    pumping = true;
    try {
      while (pending.length) {
        const first = pending.shift();
        if (first.kind === 'stats') { first.resolve(statsText()); continue; }
        const group = [first];
        const key = batchKey(first);
        while (group.length < MCP_BATCH_MAX && pending.length && pending[0].kind === 'gen' && batchKey(pending[0]) === key) group.push(pending.shift());
        try {
          const res = group.length === 1 ? [await generate(first.args)] : await generateGroup(group.map((g) => g.args));
          group.forEach((g, i) => g.resolve(res[i]));
        } catch (e) {
          group.forEach((g) => g.reject(e));
        }
      }
    } finally {
      pumping = false;
    }
  }

  // Un court délai avant de démarrer : des appels parallèles arrivent sur des lignes stdin
  // successives, pas dans le même événement — sans lui, le premier partirait seul.
  const enqueue = (item) => new Promise((resolve, reject) => {
    pending.push({ ...item, resolve, reject });
    setTimeout(pump, 15);
  });

  async function callTool(name, args) {
    if (name === 'brimkern_stats') return enqueue({ kind: 'stats' });
    const build = TOOL_PROMPTS[name];
    if (!build) throw new Error(`Unknown tool "${name}"`);
    const prompt = build(args);
    const { text, truncated } = await enqueue({ kind: 'gen', args: {
      prompt,
      model: name === 'brimkern_ask' ? args.model : undefined,
      maxTokens: args.max_tokens,
    } });
    return truncated ? `${text}\n\n[truncated at max_tokens]` : text;
  }

  const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
  const reply = (id, result) => send({ jsonrpc: '2.0', id, result });

  async function handle(req) {
    const { id, method, params } = req;
    // Notification (sans id) : jamais de réponse.
    if (id === undefined || id === null) {
      if (method === 'notifications/initialized') process.stderr.write('[Brimkern MCP] Client initialized.\n');
      return;
    }
    switch (method) {
      case 'initialize': {
        const asked = params?.protocolVersion;
        return reply(id, {
          protocolVersion: MCP_PROTOCOL_VERSIONS.includes(asked) ? asked : MCP_PROTOCOL_VERSIONS.at(-1),
          capabilities: { tools: {} },
          serverInfo: { name: 'brimkern', version: CLI_VERSION },
        });
      }
      case 'ping':
        return reply(id, {});
      case 'tools/list':
        return reply(id, { tools: MCP_TOOLS });
      case 'tools/call': {
        try {
          const text = await callTool(params?.name, params?.arguments || {});
          return reply(id, { content: [{ type: 'text', text }] });
        } catch (err) {
          process.stderr.write(`[Brimkern MCP] Error in ${params?.name}: ${err.message}\n`);
          return reply(id, { content: [{ type: 'text', text: `[Brimkern Error] ${err.message}` }], isError: true });
        }
      }
      default:
        return send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  }

  const rl = createInterface({ input: process.stdin, terminal: false });
  process.stderr.write(`[Brimkern MCP] Stdio server running (pid ${process.pid}). Listening on stdin...\n`);

  rl.on('line', (line) => {
    line = line.trim();
    if (!line) return;
    let req;
    try {
      req = JSON.parse(line);
    } catch (e) {
      process.stderr.write(`[Brimkern MCP] JSON-RPC parse error: ${e.message}\n`);
      send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
      return;
    }
    handle(req).catch((err) => {
      process.stderr.write(`[Brimkern MCP] Internal error: ${err.message}\n`);
      if (req.id != null) send({ jsonrpc: '2.0', id: req.id, error: { code: -32603, message: err.message } });
    });
  });

  let closing = false;
  const cleanup = async () => {
    if (closing) return;
    closing = true;
    if (engine) {
      try { await engine.close(); } catch {}
    }
    process.exit(0);
  };
  // Fin de stdin (client parti, ou `printf … | brimkern mcp`) : on finit les appels en file, puis
  // on referme le moteur. Sans ça, un moteur Chromium gardait le processus en vie.
  // Fin de stdin : on laisse finir les appels en cours ET en attente (file de pump), puis on quitte.
  const drained = () => new Promise((resolve) => {
    const tick = () => (pumping || pending.length ? setTimeout(tick, 20) : resolve());
    setTimeout(tick, 20); // après le délai de regroupement d'enqueue
  });
  rl.on('close', () => { drained().then(cleanup); });
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

// ── Point d'entrée principal ──────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const cfg = loadCliConfig();

  let model = resolveModelKey(cfg.lastModel || 'coder');
  let system = null;
  let maxTokens = 512;
  let temperature = 0.3;
  let mode = 'code';
  let think = 'auto';
  let raw = false;
  let isJson = false;
  let isQuiet = false;
  let native = false;
  let chromium = false;
  let promptParts = [];

  let isChat = false;
  let isMcp = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-h' || a === '--help' || a === 'help') {
      printHelp();
      return;
    }
    if (a === '-v' || a === '--version' || a === 'version') {
      console.log(`Brimkern CLI v${CLI_VERSION} · WebGPU WGSL engine (https://brimkern.com)`);
      return;
    }
    if (a === 'models' || a === 'list') {
      printModels();
      return;
    }
    if (a === 'update' || a === 'upgrade') {
      await runCliUpdate();
      return;
    }
    if (a === 'status' || a === 'config') {
      const cfg = loadCliConfig();
      console.log(`\n${C.boldRed}Brimkern CLI${C.reset} — ${t('Status & Configuration', 'Statut & Configuration')}\n`);
      console.log(`  • ${t('Config file', 'Fichier config').padEnd(18)}: ${join(homedir(), '.config', 'brimkern', 'config.json')}`);
      const effectiveModel = resolveModelKey(cfg.lastModel || 'coder');
      console.log(`  • ${t('Default model', 'Modèle par défaut').padEnd(18)}: ${effectiveModel} (${PRESET_CLI_MODELS[effectiveModel]?.shortName || 'custom'})`);
      console.log(`  • ${t('WebGPU runtime', 'Runtime WebGPU').padEnd(18)}: Dawn (native) & Chromium headless`);
      console.log(`  • ${t('Install location', 'Emplacement install').padEnd(18)}: ${ROOT}\n`);
      return;
    }
    if (a === 'chat') {
      isChat = true;
      continue;
    }
    // Serveur MCP lancé APRÈS la lecture de toutes les options : `brimkern mcp --model=super-coder`
    // ignorait le modèle (le serveur partait dès le mot « mcp »).
    if (a === 'mcp' || a === 'serve-mcp') {
      isMcp = true;
      continue;
    }
    if (a === '--json') {
      isJson = true;
      raw = true;
      continue;
    }
    if (a === '-q' || a === '--quiet') {
      isQuiet = true;
      raw = true;
      continue;
    }
    if (a.startsWith('--model=')) {
      model = a.split('=').slice(1).join('=');
    } else if (a === '-m' && args[i + 1]) {
      model = args[++i];
    } else if (a.startsWith('--system=')) {
      system = a.split('=').slice(1).join('=');
    } else if (a === '-s' && args[i + 1]) {
      system = args[++i];
    } else if (a.startsWith('--max-tokens=')) {
      maxTokens = parseInt(a.split('=')[1], 10);
    } else if (a === '-n' && args[i + 1]) {
      maxTokens = parseInt(args[++i], 10);
    } else if (a.startsWith('--temperature=')) {
      temperature = parseFloat(a.split('=')[1]);
    } else if (a === '-t' && args[i + 1]) {
      temperature = parseFloat(args[++i]);
    } else if (a.startsWith('--mode=')) {
      mode = a.split('=')[1].toLowerCase();
    } else if (a.startsWith('--think=')) {
      think = a.split('=')[1].toLowerCase();
    } else if (a === '--native') {
      native = true;
    } else if (a === '--chromium' || a === '--headless') {
      chromium = true;
    } else if (a === '--raw') {
      raw = true;
    } else if (a.startsWith('--lang=')) {
      // Lu au chargement (LANG, en tête de fichier) : rien à faire ici.
    } else if (a.startsWith('-')) {
      // Option inconnue : ne JAMAIS l'envoyer au LLM comme prompt
      const clean = a.replace(/^-+/, '').split('=')[0];
      const suggestion = findClosestCommand(clean);
      const hint = suggestion ? ` ${t(`Did you mean '--${suggestion}' or 'brimkern ${suggestion}'?`, `Vouliez-vous dire '--${suggestion}' ou 'brimkern ${suggestion}' ?`)}` : '';
      console.error(`\n${C.boldRed}brimkern:${C.reset} ${t(`unrecognized option '${a}'.${hint}`, `option non reconnue '${a}'.${hint}`)}`);
      console.error(`${C.dim}${t(`Run 'brimkern --help' for available options.`, `Lancez 'brimkern --help' pour les options disponibles.`)}${C.reset}\n`);
      process.exit(1);
    } else {
      promptParts.push(a);
    }
  }

  if (isMcp) {
    await runMcpServer({ model, native, chromium });
    return;
  }

  // Si l'utilisateur tape un mot unique qui ressemble à une commande ou alias CLI manqué (sans pipe stdin)
  if (!isChat && promptParts.length === 1 && process.stdin.isTTY) {
    const singleWord = promptParts[0];
    // Si c'est un mot de commande sans ponctuation et pas une phrase
    if (!/[?.!,;:()"]/.test(singleWord) && singleWord.length <= 16) {
      const suggestion = findClosestCommand(singleWord);
      if (suggestion && suggestion !== singleWord.toLowerCase()) {
        console.error(`\n${C.boldRed}brimkern:${C.reset} ${t(`'${singleWord}' is not a brimkern command. Did you mean 'brimkern ${suggestion}'?`, `'${singleWord}' n'est pas une commande brimkern. Vouliez-vous dire 'brimkern ${suggestion}' ?`)}`);
        console.error(`${C.dim}${t(`Run 'brimkern --help' for available commands. If you meant to send this as a prompt, add quotes: brimkern "${singleWord}"`, `Lancez 'brimkern --help' pour les commandes disponibles. Si vous vouliez envoyer ce prompt, ajoutez des guillemets : brimkern "${singleWord}"`)}${C.reset}\n`);
        process.exit(1);
      }
    }
  }

  // Lecture de stdin si redirigé (pipe unix) sauf si commande explicite 'chat'
  let stdinContent = '';
  if (!isChat && !process.stdin.isTTY) {
    stdinContent = await new Promise((resolvePipe) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => { data += chunk; });
      process.stdin.on('end', () => resolvePipe(data.trim()));
    });
  }

  let prompt = promptParts.join(' ').trim();
  if (stdinContent) {
    if (prompt) {
      prompt = `${prompt}\n\n\`\`\`\n${stdinContent}\n\`\`\``;
    } else {
      prompt = stdinContent;
    }
  }

  // Résolution des références de fichiers @fichier en mode one-shot
  if (prompt) {
    const { prompt: resolvedPrompt, files } = resolveFileReferences(prompt);
    prompt = resolvedPrompt;
    if (!raw && !isQuiet && !isJson && files.length > 0) {
      for (const f of files) {
        process.stderr.write(`${C.dim}📎 ${t('Context loaded:', 'Contexte chargé :')} @${f.path} (${f.lineCount} ${t('lines', 'lignes')})${C.reset}\n`);
      }
    }
  }

  const engine = await createCliEngine({
    model,
    system,
    maxTokens,
    temperature,
    raw,
    native,
    chromium,
  });

  // Sauvegarde du modèle sélectionné pour les prochaines sessions
  saveCliConfig({ lastModel: engine.modelKey });

  const abortController = new AbortController();
  const cleanup = async () => {
    abortController.abort();
    await engine.close();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Si chat explicite ou aucun prompt en terminal interactif -> REPL chat
  if (isChat || (!prompt && process.stdin.isTTY)) {
    scheduleBackgroundUpdateCheck();
    await runInteractiveChat(engine);
    return;
  }

  if (!raw && !isQuiet && !isJson && process.stdout.isTTY) {
    scheduleBackgroundUpdateCheck();
    printUpdateNoticeIfAvailable();
  }

  if (!prompt) {
    printHelp();
    return;
  }

  // Application des modes & réflexion
  if (CLI_MODES[mode]?.systemSuffix) {
    prompt += CLI_MODES[mode].systemSuffix;
  }
  prompt += thinkSuffixFor(engine.modelKey, think);

  // Mode One-shot
  const spinner = new ActivitySpinner();
  if (!raw && !isQuiet && !isJson) {
    spinner.start(`[Brimkern WGSL] ${engine.displayName} · ${t('Computing logits...', 'Calcul des logits...')}`);
  }

  let tokenCount = 0;

  const thinkFilter = (!isJson && !isQuiet)
    ? createStreamPrinter(spinner, () => { tokenCount++; }, { markdown: process.stdout.isTTY && !raw })
    : null;
  const quietFilter = isQuiet ? createAnswerOnlyFilter((s) => process.stdout.write(s)) : null;

  try {
    const res = await engine.ask(prompt, {
      signal: abortController.signal,
      onToken: (tok) => {
        if (isJson) {
          tokenCount++;
        } else if (isQuiet) {
          tokenCount++;
          quietFilter.feed(tok);
        } else if (thinkFilter) {
          thinkFilter.feed(tok);
        }
      },
      onProgress: (phase, loaded, total) => {
        if (!raw && !isQuiet && !isJson && total) {
          const loadedMb = Math.round(loaded / 1048576);
          const totalMb = Math.round(total / 1048576);
          if (phase === 'gpu') {
            spinner.setPhase(t(`Loading to VRAM: ${loadedMb} / ${totalMb} MB`, `Chargement en VRAM : ${loadedMb} / ${totalMb} Mo`));
          } else {
            spinner.setPhase(t(`Downloading: ${loadedMb} / ${totalMb} MB`, `Téléchargement : ${loadedMb} / ${totalMb} Mo`));
          }
        }
      },
    });

    if (thinkFilter) thinkFilter.flush();
    if (quietFilter) quietFilter.flush();
    if (!raw && !isQuiet && !isJson) spinner.stop(true);

    if (isJson) {
      const speed = res.elapsedMs > 0 ? Number(((tokenCount / res.elapsedMs) * 1000).toFixed(1)) : 0;
      const saved = estimateSavings(engine.systemPrompt.length + prompt.length, tokenCount);
      const jsonOutput = {
        ok: !res.aborted,
        content: stripThink(res.text),
        tokens: tokenCount,
        elapsedMs: Math.round(res.elapsedMs || 0),
        tokPerSec: speed,
        model: engine.displayName || engine.modelKey,
        backend: engine.gpuBackend || 'WebGPU',
        savedUsd: Number(saved.toFixed(5)),
      };
      process.stdout.write(JSON.stringify(jsonOutput, null, 2) + '\n');
    } else if (isQuiet) {
      if (!tokenCount && res.text) {
        process.stdout.write(stripThink(res.text));
      }
      process.stdout.write('\n');
    } else if (!raw && !res.aborted) {
      console.log('\n');
      const speed = res.elapsedMs > 0 ? ((tokenCount / res.elapsedMs) * 1000).toFixed(1) : '—';
      const saved = estimateSavings(engine.systemPrompt.length + prompt.length, tokenCount);
      process.stderr.write(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} ${t('tokens generated', 'tokens générés')} · ${savingsLabel(saved)} ${C.dim}(${engine.gpuBackend})${C.reset}\n`);
    } else {
      process.stdout.write('\n');
    }
  } catch (e) {
    if (!raw && !isQuiet && !isJson) spinner.stop(true);
    if (isJson) {
      process.stdout.write(JSON.stringify({ ok: false, error: e.message }) + '\n');
      process.exit(1);
    }
    if (!abortController.signal.aborted) {
      console.error(`\n${C.red}${t('WebGPU execution error:', "Erreur d'exécution WebGPU :")} ${e.message}${C.reset}`);
    }
    process.exit(1);
  } finally {
    await engine.close();
  }
}

main().catch((err) => {
  console.error(`${C.red}${t('Fatal error:', 'Erreur fatale :')} ${err.message}${C.reset}`);
  process.exit(1);
});
