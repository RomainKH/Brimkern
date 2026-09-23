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
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import readline, { createInterface } from 'node:readline';
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright-core';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const SDK_PATH = join(ROOT, 'public', 'sdk.js');

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
    runtime: 'WebGPU (Natif Dawn)',
    size: '2,53 Go',
    badge: 'Recommandé',
    qwen3Think: true,
    defaultSystem: 'You are Brimkern Code, an expert software engineer. Answer the question asked, with correct code and concise explanations. Format code blocks using markdown.',
    desc: 'Le plus fiable des modèles testés : explications et code justes, ~13-16 tok/s. Réflexion : /think deep.',
  },
  'fast': {
    name: 'Qwen 2.5 Coder 1.5B Instruct (GGUF)',
    shortName: 'Qwen 2.5 Coder 1.5B',
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf',
    format: 'gguf',
    formatLabel: 'GGUF Q4_K_M',
    runtime: 'WebGPU (Chromium)',
    size: '1,12 Go',
    badge: 'Rapide',
    defaultSystem: 'You are Brimkern Code, an expert software engineer. Answer the question asked, with correct code and concise explanations. Format code blocks using markdown.',
    desc: 'Deux fois plus rapide (~25 tok/s), plus léger ; relire le code proposé, il se trompe plus souvent.',
  },
};

// Anciennes clés : alias vers les nouvelles (qwen3-4b, coder-1.5b) ou retrait annoncé — jamais
// un modèle différent chargé en silence sous un nom connu.
const MODEL_ALIASES = { 'qwen3-4b': 'coder', 'coder-1.5b': 'fast' };
const RETIRED_MODELS = new Set(['coder-0.5b', 'qwen-0.5b', 'lfm2', 'rwkv', 'rwkv-0.4b', 'rwkv-0.1b']);

function resolveModelKey(key) {
  if (!key) return 'coder';
  if (MODEL_ALIASES[key]) return MODEL_ALIASES[key];
  if (RETIRED_MODELS.has(key)) {
    process.stderr.write(`${C.yellow}ℹ Le preset « ${key} » a été retiré (réponses trop peu fiables) : utilisation de « coder » (${PRESET_CLI_MODELS.coder.shortName}). Pour le forcer, passez son URL avec --model=.${C.reset}\n`);
    return 'coder';
  }
  return key;
}

// Suffixe de réflexion selon le modèle. Qwen 3 n'obéit qu'à ses interrupteurs /think et
// /no_think : la consigne en français de « off » était ignorée et il consommait tout son budget
// de tokens à réfléchir (300/300 au banc). Sans réflexion par défaut, /think deep la rend.
function thinkSuffixFor(modelKey, level) {
  if (PRESET_CLI_MODELS[modelKey]?.qwen3Think) {
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
    desc: 'Génération directe de code, syntaxe exacte et concision',
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
    desc: 'Conception architecturale et analyse étape par étape avant toute écriture',
    systemSuffix: '\n[MODE: PLAN] Ne génère pas tout le code immédiatement. Analyse les besoins, décompose l\'architecture, évalue les compromis, les cas limites et propose un plan d\'implémentation étape par étape.'
  },
  review: {
    name: 'review',
    label: 'REVIEW',
    badge: `${C.boldRed}[REVIEW]${C.reset}`,
    color: C.boldRed,
    desc: 'Audit de sécurité, détection de régressions, bugs et goulots d’étranglement',
    systemSuffix: '\n[MODE: REVIEW] Agis comme un reviewer senior intraitable. Cherche activement les bugs, failles de sécurité, régressions, fuites de mémoire et problèmes de performance dans le code fourni.'
  },
  auto: {
    name: 'auto',
    label: 'AUTO',
    badge: `${C.boldGreen}[AUTO]${C.reset}`,
    color: C.boldGreen,
    desc: 'Mode autonome / agent : propositions de diffs unifiés et actions atomiques',
    systemSuffix: '\n[MODE: AUTO] Propose des modifications de code atomiques sous forme de blocs ou diffs unifiés clairs, en expliquant la raison de chaque modification et la validation à exécuter.'
  }
};

// ── Niveaux de réflexion (Thinking / Monologue interne) ──────────────────────────────
const THINKING_LEVELS = {
  off: {
    name: 'off',
    label: 'off',
    color: C.gray,
    desc: 'Réponses directes sans affichage des étapes de réflexion',
    promptSuffix: '\nRéponds directement sans balises de réflexion interne ni <think>.'
  },
  auto: {
    name: 'auto',
    label: 'auto',
    color: C.cyan,
    desc: 'Détection et mise en page soignée des balises <think>...</think>',
    promptSuffix: ''
  },
  deep: {
    name: 'deep',
    label: 'deep',
    color: C.sand,
    desc: 'Réflexion étape par étape explicite dans des balises <think>',
    promptSuffix: '\nRéfléchis étape par étape avant de répondre. Encadre ton analyse détaillée et tes hésitations à l\'intérieur de balises <think>...</think>, puis donne la solution finale en dehors.'
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
  return `\n\nThe user is working in the directory ${cwd}. When they say "this project", "ce projet" or "le repo", they mean this one:\n${parts.join('\n')}`;
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
  if (x >= 1) return `${x.toFixed(2)} $`;
  if (x >= 0.01) return `${x.toFixed(3)} $`;
  return `${x.toFixed(4)} $`;
}
function savingsLabel(x) {
  return `${C.green}≈ ${fmtUsd(x)} économisés${C.reset}`;
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
      process.stderr.write(`${C.yellow}⚠ Sécurité : Fichier sensible bloqué pour protéger vos secrets : @${filePath}${C.reset}\n`);
      continue;
    }

    if (existsSync(resolved) && statSync(resolved).isFile()) {
      try {
        const rawContent = readFileSync(resolved, 'utf8');
        const lines = rawContent.split('\n');
        let slice = lines;
        let lineNote = `${lines.length} lignes`;

        if (startLine !== null) {
          const s = Math.max(1, startLine) - 1;
          const e = endLine !== null ? Math.min(lines.length, endLine) : lines.length;
          slice = lines.slice(s, e);
          lineNote = `lignes ${startLine}-${endLine || lines.length} sur ${lines.length}`;
        }

        let truncated = false;
        if (slice.length > 800) {
          slice = slice.slice(0, 800);
          truncated = true;
        }

        const ext = filePath.split('.').pop() || '';
        additions.push(
          `\n\n--- Fichier : ${filePath} (${lineNote}${truncated ? ', tronqué à 800 lignes' : ''}) ---\n\`\`\`${ext}\n${slice.join('\n')}\n\`\`\``
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
  ['/help', 'Liste des commandes'],
  ['/model', 'Choisir le modèle (sélecteur ↑/↓)'],
  ['/models', 'Choisir le modèle (sélecteur ↑/↓)'],
  ['/mode', 'Mode : code, plan, review, auto'],
  ['/think', 'Réflexion : off, auto, deep'],
  ['/status', 'État de la session'],
  ['/stats', 'Tokens, vitesse, économies estimées'],
  ['/diff', 'Revue de vos modifications git'],
  ['/commit', 'Propositions de messages de commit'],
  ['/review', 'Revue de code d’un fichier'],
  ['/copy', 'Copier la dernière réponse'],
  ['/accept', 'Extraire les blocs de code proposés'],
  ['/reset', 'Effacer l’historique de la conversation'],
  ['/clear', 'Effacer l’écran'],
  ['/exit', 'Quitter'],
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
    this.phase = 'Traitement...';
    this.startTime = 0;
    this.active = false;
  }

  start(initialPhase = 'Traitement...') {
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
class ThinkStreamFilter {
  constructor({ onToken, onThinkStart, onThinkEnd }) {
    this.onToken = onToken;
    this.onThinkStart = onThinkStart;
    this.onThinkEnd = onThinkEnd;
    this.inThink = false;
    this.buffer = '';
  }

  feed(chunk) {
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
    this.pendStar = false;
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
  inline(ch) {
    if (this.pendStar) {
      this.pendStar = false;
      if (ch === '*') { this.bold = !this.bold; this.out(this.style()); return; }
      this.out('*');
    }
    if (ch === '*' && !this.code) { this.pendStar = true; return; }
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
    if (this.pendStar) { this.pendStar = false; this.out('*'); }
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
          process.stdout.write(`\n${C.sand}💭 [Réflexion]${C.reset}\n`);
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
        process.stdout.write(`${C.reset}\n\n${C.boldGreen}💡 [Réponse]${C.reset}\n`);
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
  const gitBranch = git ? `${git.branch}${git.dirty ? ' (modifié *)' : ' (propre)'}` : 'Non versionné';
  const elapsedSec = (sessionState.totalElapsedMs / 1000).toFixed(1);
  const avgSpeed = sessionState.totalElapsedMs > 0 ? ((sessionState.totalTokens / sessionState.totalElapsedMs) * 1000).toFixed(1) : '0';

  const saved = estimateSavings(sessionState.totalInChars || 0, sessionState.totalTokens);
  console.log('\n' + drawBox(`${C.boldRed}État de la session Brimkern${C.reset}`, [
    `${C.bold}Modèle actif${C.reset} : ${C.yellow}${engine.displayName}${C.reset}`,
    `${C.bold}Moteur & GPU${C.reset} : ${C.cyan}${engine.engineType} · ${engine.gpuBackend}${C.reset}`,
    `${C.bold}Mode IA${C.reset}      : ${modeInfo.badge} ${C.gray}${modeInfo.desc}${C.reset}`,
    `${C.bold}Réflexion${C.reset}    : ${thinkInfo.color}${thinkInfo.name}${C.reset} ${C.dim}(${thinkInfo.desc})${C.reset}`,
    `${C.bold}Dépôt Git${C.reset}    : ${C.sand}${gitBranch}${C.reset}`,
    `${C.bold}Inférence${C.reset}    : ${C.green}100 % local${C.reset} · ${sessionState.totalTokens} tokens · ~${avgSpeed} tok/s (${elapsedSec}s) · ${savingsLabel(saved)}`,
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
    this.session = null;
    this.server = null;
    this.isReady = false;
    this.engineType = 'Natif Dawn (in-process)';
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
      this.displayName = `Fichier local (${this.modelKey})`;
      this.format = 'brik';
    } else {
      this.modelUrl = this.modelKey;
      this.displayName = this.modelKey;
      this.format = this.modelKey.endsWith('.gguf') ? 'gguf' : 'brik';
    }
  }

  async init() {
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
      throw new Error('Bundle ESM du SDK introuvable (packages/sdk/dist/brimkern.mjs). Exécutez npm run build:sdk.');
    }

    const sdk = await import(sdkPath);
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

    this.server = null;
    this.browserCtx = null;
    this.page = null;
    this.isReady = false;
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
      this.displayName = `Fichier local (${this.modelKey})`;
      this.format = 'brik';
    } else {
      this.modelUrl = this.modelKey;
      this.displayName = this.modelKey;
      this.format = this.modelKey.endsWith('.gguf') ? 'gguf' : 'brik';
    }
  }

  async init() {
    const chromeExe = findChromium();
    if (!chromeExe) {
      throw new Error(
        'Chromium avec support WebGPU introuvable.\n' +
        'Installez-le avec : npx playwright install chromium\n' +
        'Ou installez Google Chrome sur votre système.'
      );
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
    await this.page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });

    // Initialisation de la session Brimkern dans le contexte WebGPU
    await this.page.evaluate(async ({ modelUrl, maxTokens, temperature, systemPrompt }) => {
      window.session = await window.Brimkern.createSession({
        model: modelUrl,
        maxTokens,
        temperature,
        system: systemPrompt,
      });
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
      await this.init();
    }

    // exposeFunction ne s'enregistre qu'une fois par page : les ponts sont posés au premier
    // appel et redirigent vers les callbacks du tour courant. Les ré-enregistrer à chaque tour
    // échouait en silence et livrait les tokens aux closures du PREMIER tour (spinner jamais
    // arrêté, compteur à 0).
    this.currentOnToken = onToken;
    this.currentOnProgress = onProgress;
    if (!this.bridgesExposed) {
      await this.page.exposeFunction('onTokenBridge', (delta) => {
        if (this.currentOnToken) this.currentOnToken(delta);
      });
      await this.page.exposeFunction('onProgressBridge', (phase, loaded, total) => {
        if (this.currentOnProgress) this.currentOnProgress(phase, loaded, total);
      });
      this.bridgesExposed = true;
    }

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

// ── Fabrique unifiée de moteur CLI ───────────────────────────────────────────────────
async function createCliEngine(options = {}) {
  options = { ...options, model: resolveModelKey(options.model) };
  if (!options.system && PRESET_CLI_MODELS[options.model]) {
    options.system = PRESET_CLI_MODELS[options.model].defaultSystem + buildProjectContext();
  }
  const forceChromium = !!options.chromium || !!options.headless || process.env.BRIMKERN_FORCE_CHROMIUM === '1';
  const forceNative = !!options.native || process.env.BRIMKERN_FORCE_NATIVE === '1';
  const modelKey = options.model || 'coder';
  const isGguf = modelKey.endsWith('.gguf') || PRESET_CLI_MODELS[modelKey]?.format === 'gguf';

  if (forceChromium) {
    return new BrimkernChromiumEngine(options);
  }

  if (isGguf && !forceNative) {
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
    throw new Error('Moteur natif Dawn demandé (--native) mais indisponible sur ce système.');
  }

  if (!options.raw) {
    process.stderr.write(`${C.dim}[Notice] Repli sur Chromium headless (support WebGPU universel)...${C.reset}\n`);
  }
  return new BrimkernChromiumEngine(options);
}

// ── Bannière de marque "Le Kern" ─────────────────────────────────────────────────────
function printBrandBanner(engine, mode = 'code', think = 'auto') {
  const git = getGitInfo();
  const gitStr = git ? `  ${C.dim}·${C.reset}  Git : ${C.sand}${git.branch}${git.dirty ? '*' : ''}${C.reset}` : '';
  const gpuStr = engine.gpuBackend || (process.platform === 'darwin' ? 'Dawn (Metal)' : 'Dawn (Vulkan)');
  const engineStr = engine.engineType || 'Natif Dawn (in-process)';
  const modeBadge = CLI_MODES[mode]?.badge || '[CODE]';

  console.log(`
${C.boldRed}██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗███████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║████╗ ████║██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██╔████╔██║█████═╝ █████╗  ██████╔╝██╔██╗ ██║
██╔══██╗██╔══██╗██║██║╚██╔╝██║██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██████╔╝██║  ██║██║██║ ╚═╝ ██║██║ ╚██╗███████╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝${C.reset}
${C.dim}Moteur d'inférence WebGPU & WGSL on-device${C.reset}

${drawBox(`${C.boldRed}Brimkern WGSL${C.reset}`, [
  `Modèle : ${C.yellow}${engine.displayName}${C.reset}`,
  `Moteur : ${C.green}${engineStr}${C.reset}  ${C.dim}·${C.reset}  WebGPU : ${C.cyan}${gpuStr}${C.reset}`,
  `Mode : ${modeBadge}  ${C.dim}·${C.reset}  Think : ${C.sand}${think}${C.reset}  ${C.dim}·${C.reset}  ${C.green}100 % local${C.reset}${gitStr}`,
], { color: C.red })}
${C.dim}Tapez ${C.boldRed}/help${C.reset}${C.dim} pour les commandes · ${C.yellow}Tab${C.reset}${C.dim} pour compléter · ${C.yellow}Esc${C.reset}${C.dim} pour annuler${C.reset}
`);
}

// ── Aide REPL complète ────────────────────────────────────────────────────────────────
function printReplHelp() {
  console.log(`
${C.bold}Commandes interactives Brimkern (style Claude Code / Gemini CLI) :${C.reset}

${C.boldRed}ASSISTANT & CONTEXTE${C.reset}
  ${C.bold}${C.cyan}@chemin/fichier${C.reset}      Injecte le fichier dans le prompt (ex: ${C.dim}@src/app.ts:1-50${C.reset})
  ${C.bold}${C.cyan}/diff [args]${C.reset}         Analyse vos modifications git et propose une revue
  ${C.bold}${C.cyan}/commit${C.reset}              Génère 3 propositions de messages de commit conventionnels
  ${C.bold}${C.cyan}/review <fichier>${C.reset}    Revue de code approfondie (bugs, sécurité, perf)
  ${C.bold}${C.cyan}/copy${C.reset}                Copie la dernière réponse dans le presse-papier
  ${C.bold}${C.cyan}/accept, /apply${C.reset}      Extrait et copie/affiche les blocs de code proposés

${C.boldRed}MODES & CONTRÔLE DE L'IA${C.reset}
  ${C.bold}${C.cyan}/mode [nom]${C.reset}          Bascule le mode (${C.yellow}code, plan, review, auto${C.reset})
  ${C.bold}${C.cyan}/think [niveau]${C.reset}      Niveau de réflexion pas à pas (${C.sand}off, auto, deep${C.reset})
  ${C.bold}${C.cyan}/status${C.reset}              État complet (modèle, GPU, mode, cache, git)

${C.boldRed}CONVERSATION & SESSION${C.reset}
  ${C.bold}${C.cyan}/model, /models${C.reset}       Sélecteur interactif scrollable (flèches ↑/↓) ou changement à chaud
  ${C.bold}${C.cyan}/reset${C.reset}               Efface l'historique et libère le cache KV GPU
  ${C.bold}${C.cyan}/stats${C.reset}               Statistiques de session (tokens, tok/s, coût 0$)
  ${C.bold}${C.cyan}/clear${C.reset}               Efface l'écran du terminal

${C.boldRed}RACCOURCIS CLAVIER${C.reset}
  ${C.bold}${C.yellow}Tab${C.reset}                  Auto-complétion des commandes (/), modes et fichiers (@)
  ${C.bold}${C.yellow}Escape${C.reset}               Interrompt l'inférence en cours / efface la saisie
  ${C.bold}${C.yellow}Ctrl+C${C.reset}               Annule la génération sans tuer la session REPL

${C.boldRed}COMMANDES SYSTÈME${C.reset}
  ${C.bold}${C.cyan}!commande${C.reset}            Exécute une commande shell locale (ex: ${C.dim}!git status${C.reset})
  ${C.bold}${C.cyan}/exit${C.reset}                Quitte la session
`);
}

// ── Aide CLI One-shot ─────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(`
${C.boldRed}BRIMKERN CLI${C.reset} — Inférence IA locale en WebGPU (WGSL) depuis le terminal

${C.bold}UTILISATION${C.reset}
  ${C.green}brimkern${C.reset} [options] [prompt]
  ${C.green}brimkern${C.reset} chat                     ${C.gray}# Mode REPL interactif${C.reset}
  ${C.green}brimkern${C.reset} models                   ${C.gray}# Liste les modèles pré-configurés${C.reset}
  ${C.green}cat file.ts | brimkern${C.reset} "Trouve les bugs"
  ${C.green}brimkern${C.reset} "Explique @src/app/Composer.tsx:10-40"

${C.bold}OPTIONS${C.reset}
  ${C.yellow}-m, --model=<nom|url|fichier>${C.reset}    Modèle (défaut: coder / ${PRESET_CLI_MODELS.coder.shortName})
  ${C.yellow}-s, --system=<prompt>${C.reset}            Prompt système
  ${C.yellow}-n, --max-tokens=<n>${C.reset}             Plafond de tokens générés (défaut: 512)
  ${C.yellow}-t, --temperature=<val>${C.reset}          Température (défaut: 0.3)
  ${C.yellow}--mode=<code|plan|review|auto>${C.reset}       Mode d'intervention IA (défaut: code)
  ${C.yellow}--think=<off|auto|deep>${C.reset}              Niveau de réflexion pas à pas (défaut: auto)
  ${C.yellow}--native${C.reset}                              Force l'exécution native Dawn (in-process, 0ms overhead)
  ${C.yellow}--chromium, --headless${C.reset}               Force l'exécution via Chromium headless (repli universel)
  ${C.yellow}--raw${C.reset}                              Sortie brute uniquement (sans en-tête ni stats)
  ${C.yellow}-h, --help${C.reset}                         Affiche cette aide

${C.bold}MODÈLES${C.reset}
${Object.entries(PRESET_CLI_MODELS).map(([key, m]) => `  ${C.cyan}${key.padEnd(8)}${C.reset} ${m.shortName} (${m.formatLabel}, ${m.size}) — ${C.dim}${m.desc}${C.reset}`).join('\n')}
`);
}

function printModels() {
  console.log(`\n${C.boldRed}Modèles disponibles pour la CLI Brimkern :${C.reset}\n`);
  for (const [key, m] of Object.entries(PRESET_CLI_MODELS)) {
    console.log(`  ${C.bold}${C.cyan}${key.padEnd(12)}${C.reset} ${C.bold}${m.name}${C.reset} [${C.yellow}${m.size}${C.reset}]`);
    console.log(`               ${C.gray}${m.desc}${C.reset}`);
    console.log(`               ${C.dim}URL : ${m.url}${C.reset}\n`);
  }
  console.log(`${C.gray}Vous pouvez aussi spécifier un fichier local : --model=/chemin/vers/modele.brik${C.reset}\n`);
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
      name: 'Modèle personnalisé actif',
      size: 'Local',
      format: 'brik/gguf',
      runtime: 'WebGPU',
      badge: 'Fichier local',
      desc: `Fichier ou URL personnalisé en cours d'utilisation : ${currentModelKey}`,
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

  function boxLine(content) {
    const visLen = stripAnsi(content).length;
    const pad = Math.max(0, innerWidth - visLen);
    return `  ${C.darkGray}│${C.reset} ${content}${' '.repeat(pad)} ${C.darkGray}│${C.reset}`;
  }

  function render() {
    const lines = [];
    lines.push(`${C.darkGray}┌─${C.reset} ${C.boldRed}Brimkern${C.reset} ${C.dim}·${C.reset} ${C.bold}Sélecteur de modèles on-device${C.reset} ${C.darkGray}${'─'.repeat(Math.max(2, innerWidth - 30))}┐${C.reset}`);
    lines.push(`${C.dim}  Utilisez les flèches ↑/↓ pour faire défiler · Entrée pour activer · Échap pour annuler${C.reset}`);
    lines.push('');

    if (scrollOffset > 0) {
      lines.push(`${C.dim}    ▲ ... (${scrollOffset} modèle(s) au-dessus)${C.reset}`);
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
      const activeBadge = isActive ? ` ${C.boldGreen}● actif${C.reset}` : '';

      lines.push(`  ${pointer} ${keyFormatted} ${nameFormatted} ${formatBadge} ${sizeFormatted}${activeBadge}`);
    });

    const remainingBelow = items.length - (scrollOffset + pageSize);
    if (remainingBelow > 0) {
      lines.push(`${C.dim}    ▼ ... (${remainingBelow} modèle(s) en-dessous)${C.reset}`);
    } else {
      lines.push(`${C.darkGray}    ┄${C.reset}`);
    }

    const cur = items[selectedIndex];
    lines.push('');
    lines.push(drawBox(`Fiche technique : ${cur.name}`, [
      `${C.bold}Architecture :${C.reset} ${C.yellow}${cur.name}${C.reset}  ${C.dim}·${C.reset}  ${C.bold}Taille :${C.reset} ${C.yellow}${cur.size}${C.reset}  ${C.dim}·${C.reset}  ${C.cyan}[${cur.badge}]${C.reset}`,
      `${C.gray}${cur.desc}${C.reset}`,
      `${C.bold}Format :${C.reset} ${C.sand}${cur.format}${C.reset}  ${C.dim}·${C.reset}  ${C.bold}Moteur :${C.reset} ${C.green}${cur.runtime}${C.reset}`,
      `${C.dim}Commande : /model ${cur.key}${C.reset}`,
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

  process.stderr.write(`${C.dim}Initialisation du GPU et chargement du modèle...${C.reset}`);
  await engine.init();
  process.stderr.write(`\r${C.green}✓ Moteur WebGPU prêt et connecté [${engine.engineType}].${C.reset}                                 \n\n`);

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
        process.stdout.write(`\n${C.yellow}⚠ Interrompu (${key.name === 'escape' ? 'Escape' : 'Ctrl+C'})${C.reset}\n`);
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
      process.stdout.write(`\n${C.yellow}⚠ Interrompu (Ctrl+C)${C.reset}\n`);
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
    console.log(`\n${C.dim}(Pour quitter, tapez /exit ou Ctrl+D)${C.reset}`);
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
        console.error(`${C.red}Erreur d'exécution : ${e.message}${C.reset}`);
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
      console.log(`${C.yellow}✓ Historique conversationnel et cache KV réinitialisés.${C.reset}\n`);
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
        console.log(`\n${C.bold}Modes d'utilisation disponibles :${C.reset}\n`);
        for (const [key, m] of Object.entries(CLI_MODES)) {
          const isActive = key === currentMode;
          console.log(`  ${m.badge} ${C.bold}${m.name.padEnd(8)}${C.reset} ${m.desc}${isActive ? ` ${C.boldGreen}◀ (Actif)${C.reset}` : ''}`);
        }
        console.log(`\n${C.dim}Usage : /mode <code|plan|review|auto>${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      if (CLI_MODES[targetMode]) {
        currentMode = targetMode;
        console.log(`${C.green}✓ Mode basculé vers ${CLI_MODES[targetMode].badge} : ${CLI_MODES[targetMode].desc}${C.reset}\n`);
      } else {
        console.log(`${C.red}Mode inconnu : "${targetMode}". Choix : code, plan, review, auto${C.reset}\n`);
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/think' || input.startsWith('/think ')) {
      const targetThink = input.slice(6).trim().toLowerCase();
      if (!targetThink) {
        console.log(`\n${C.bold}Niveaux de réflexion disponibles :${C.reset}\n`);
        for (const [key, t] of Object.entries(THINKING_LEVELS)) {
          const isActive = key === thinkLevel;
          console.log(`  ${C.bold}${t.color}${key.padEnd(8)}${C.reset} : ${t.desc}${isActive ? ` ${C.boldGreen}◀ (Actif)${C.reset}` : ''}`);
        }
        console.log(`\n${C.dim}Usage : /think <off|auto|deep>${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      if (THINKING_LEVELS[targetThink]) {
        thinkLevel = targetThink;
        console.log(`${C.green}✓ Niveau de réflexion défini sur [${targetThink}] : ${THINKING_LEVELS[targetThink].desc}${C.reset}\n`);
      } else {
        console.log(`${C.red}Niveau inconnu : "${targetThink}". Choix : off, auto, deep${C.reset}\n`);
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/copy') {
      if (!sessionState.lastResponse) {
        console.log(`${C.dim}Aucune réponse précédente à copier.${C.reset}\n`);
      } else {
        const ok = copyToClipboard(sessionState.lastResponse);
        if (ok) {
          console.log(`${C.green}✓ Dernière réponse copiée dans le presse-papier système.${C.reset}\n`);
        } else {
          console.log(`${C.yellow}Impossible de copier dans le presse-papier.${C.reset}\n`);
        }
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/accept' || input === '/apply') {
      if (!sessionState.lastResponse) {
        console.log(`${C.dim}Aucune proposition d'édition récente à appliquer.${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      const codeBlockRegex = /```(?:[a-zA-Z0-9_\-]+)?\n([\s\S]*?)```/g;
      const matches = [...sessionState.lastResponse.matchAll(codeBlockRegex)];
      if (matches.length === 0) {
        console.log(`${C.yellow}Aucun bloc de code détecté dans la dernière réponse.${C.reset}\n`);
      } else {
        console.log(`\n${C.bold}Blocs de code détectés dans la dernière réponse :${C.reset}`);
        matches.forEach((m, idx) => {
          const snippet = m[1].trim();
          const firstLine = snippet.split('\n')[0] || '';
          console.log(`  ${C.cyan}#${idx + 1}${C.reset} (${snippet.split('\n').length} lignes) — ${C.dim}${firstLine.slice(0, 50)}${C.reset}`);
        });
        const copied = copyToClipboard(sessionState.lastResponse);
        if (copied) {
          console.log(`\n${C.green}✓ Code extrait et copié dans le presse-papier système pour intégration.${C.reset}\n`);
        }
      }
      resumeAndPrompt();
      return;
    }
    if (input === '/stats' || input === '/cost' || input === '/tokens') {
      const elapsedSec = (sessionState.totalElapsedMs / 1000).toFixed(1);
      const avgSpeed = sessionState.totalElapsedMs > 0 ? ((sessionState.totalTokens / sessionState.totalElapsedMs) * 1000).toFixed(1) : '—';
      console.log(`
${C.bold}Statistiques de session Brimkern :${C.reset}
  • Tokens générés   : ${C.yellow}${sessionState.totalTokens}${C.reset} tokens
  • Temps de calcul  : ${C.cyan}${elapsedSec} s${C.reset}
  • Vitesse moyenne  : ${C.green}~${avgSpeed} tok/s${C.reset}
  • Économisé (est.) : ${C.boldGreen}${fmtUsd(estimateSavings(sessionState.totalInChars, sessionState.totalTokens))}${C.reset} ${C.dim}vs une API à ${REF_PRICE.in} $ / ${REF_PRICE.out} $ par M tokens (entrée / sortie) — BRIMKERN_PRICE_IN / _OUT pour changer${C.reset}
  • Confidentialité  : ${C.green}100% on-device${C.reset} ${C.dim}(aucun octet envoyé hors de la machine)${C.reset}
`);
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
            console.log(`${C.dim}Sélection annulée.${C.reset}\n`);
            resumeAndPrompt();
            return;
          }
          if (choice.key === engine.modelKey) {
            console.log(`${C.yellow}ℹ Le modèle ${choice.name} est déjà actif.${C.reset}\n`);
            resumeAndPrompt();
            return;
          }
          targetModel = choice.key;
        } else {
          printModels();
          console.log(`${C.gray}Modèle actif : ${C.yellow}${engine.displayName}${C.reset} [${C.green}${engine.engineType}${C.reset}]\n`);
          resumeAndPrompt();
          return;
        }
      }
      process.stderr.write(`${C.dim}Changement de modèle vers ${targetModel}...${C.reset}`);
      await engine.close();
      try {
        engine = await createCliEngine({
          model: targetModel,
          system: engine.systemPrompt,
          maxTokens: engine.maxTokens,
          temperature: engine.temperature,
        });
        await engine.init();
        sessionState.historyChars = 0; // nouveau moteur = nouvelle conversation
        process.stderr.write(`\r${C.green}✓ Modèle actif : ${engine.displayName} [${engine.engineType}]${C.reset}                \n\n`);
      } catch (err) {
        process.stderr.write(`\r${C.red}✗ Échec du changement de modèle : ${err.message}${C.reset}\n\n`);
      }
      resumeAndPrompt();
      return;
    }

    // 3. Raccourcis Git intégrés
    if (input === '/diff' || input.startsWith('/diff ')) {
      const diffArgs = input.slice(5).trim();
      const diff = getGitDiff(diffArgs);
      if (!diff) {
        console.log(`${C.dim}Aucune modification git détectée.${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      console.log(`${C.dim}Analyse du diff git (${diff.split('\n').length} lignes)...${C.reset}\n`);
      input = `Fais une revue technique concise de ces changements git : bugs potentiels, régressions, sécurité et style.\n\n\`\`\`diff\n${diff}\n\`\`\``;
    } else if (input === '/commit') {
      const status = getGitStatusSummary();
      const diff = getGitDiff();
      if (!status && !diff) {
        console.log(`${C.dim}L'arbre de travail git est propre, aucun commit à proposer.${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      console.log(`${C.dim}Génération des messages de commit pour les modifications en cours...${C.reset}\n`);
      input = `Voici l'état actuel de mon dépôt git :\n\nStatus :\n${status}\n\nDiff :\n\`\`\`diff\n${diff.slice(0, 4000)}\n\`\`\`\n\nRédige 3 propositions de messages de commit conventionnels concis (type: titre explicite) en français et en anglais avec un court diagnostic de 1 phrase.`;
    } else if (input.startsWith('/review ')) {
      const targetFile = input.slice(8).trim();
      const resolved = resolve(process.cwd(), targetFile);
      if (!existsSync(resolved)) {
        console.log(`${C.red}Fichier introuvable : ${targetFile}${C.reset}\n`);
        resumeAndPrompt();
        return;
      }
      const code = readFileSync(resolved, 'utf8');
      console.log(`${C.dim}Revue de code de ${targetFile} (${code.split('\n').length} lignes)...${C.reset}\n`);
      input = `Revue de code approfondie pour le fichier ${targetFile} : analyse les bugs potentiels, la robustesse, les performances et les cas limites.\n\n\`\`\`\n${code.slice(0, 4000)}\n\`\`\``;
    }

    // 4. Résolution des références de fichiers @chemin/vers/fichier
    const { prompt: finalPrompt, files } = resolveFileReferences(input);
    if (files.length > 0) {
      for (const f of files) {
        console.log(`${C.dim}📎 Contexte chargé : @${f.path} (${f.lineCount} lignes)${C.reset}`);
      }
      console.log('');
    }

    // 5. Exécution de l'inférence WebGPU avec feedback visuel & annulation
    isGenerating = true;
    currentAbortController = new AbortController();
    let tokenCount = 0;

    spinner.start('Préparation du prompt & contexte...');
    if (files.length > 0) {
      spinner.setPhase(`Chargement de ${files.length} fichier(s) de contexte...`);
    }

    const thinkFilter = createStreamPrinter(spinner, () => { tokenCount++; });

    try {
      spinner.setPhase('Calcul des logits WebGPU (TTFT)...');

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
            spinner.setPhase(`Téléchargement : ${Math.round(loaded / 1048576)} / ${Math.round(total / 1048576)} Mo`);
          } else {
            spinner.setPhase(`Phase : ${phase}`);
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
        console.log(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens · ${savingsLabel(turnSaved)}${C.gray} (session : ${fmtUsd(sessionSaved)})${C.reset} ${C.dim}(${engine.gpuBackend})${C.reset}\n`);
      }
    } catch (e) {
      spinner.stop(true);
      if (!currentAbortController.signal.aborted) {
        console.error(`\n${C.red}Erreur : ${e.message}${C.reset}\n`);
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

// ── Point d'entrée principal ──────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  let model = 'coder';
  let system = null;
  let maxTokens = 512;
  let temperature = 0.3;
  let mode = 'code';
  let think = 'auto';
  let raw = false;
  let native = false;
  let chromium = false;
  let promptParts = [];

  let isChat = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-h' || a === '--help' || a === 'help') {
      printHelp();
      return;
    }
    if (a === 'models' || a === 'list') {
      printModels();
      return;
    }
    if (a === 'chat') {
      isChat = true;
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
    } else {
      promptParts.push(a);
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
    if (!raw && files.length > 0) {
      for (const f of files) {
        process.stderr.write(`${C.dim}📎 Contexte chargé : @${f.path} (${f.lineCount} lignes)${C.reset}\n`);
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
    await runInteractiveChat(engine);
    return;
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
  if (!raw) {
    spinner.start(`[Brimkern WGSL] ${engine.displayName} · Calcul des logits...`);
  }

  let tokenCount = 0;

  const thinkFilter = createStreamPrinter(spinner, () => { tokenCount++; }, { markdown: process.stdout.isTTY && !raw });

  try {
    const res = await engine.ask(prompt, {
      signal: abortController.signal,
      onToken: (tok) => {
        thinkFilter.feed(tok);
      },
      onProgress: (phase, loaded, total) => {
        if (!raw && total) {
          spinner.setPhase(`Téléchargement : ${Math.round(loaded / 1048576)} / ${Math.round(total / 1048576)} Mo`);
        }
      },
    });

    thinkFilter.flush();
    spinner.stop(true);

    if (!raw && !res.aborted) {
      console.log('\n');
      const speed = res.elapsedMs > 0 ? ((tokenCount / res.elapsedMs) * 1000).toFixed(1) : '—';
      const saved = estimateSavings(engine.systemPrompt.length + prompt.length, tokenCount);
      process.stderr.write(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens générés · ${savingsLabel(saved)} ${C.dim}(${engine.gpuBackend})${C.reset}\n`);
    } else {
      process.stdout.write('\n');
    }
  } catch (e) {
    spinner.stop(true);
    if (!abortController.signal.aborted) {
      console.error(`\n${C.red}Erreur d'exécution WebGPU : ${e.message}${C.reset}`);
    }
    process.exit(1);
  } finally {
    await engine.close();
  }
}

main().catch((err) => {
  console.error(`${C.red}Erreur fatale : ${err.message}${C.reset}`);
  process.exit(1);
});
