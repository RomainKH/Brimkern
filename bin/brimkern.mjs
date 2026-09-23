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

// ── Modèles préconfigurés (spécifiques code & brik) ───────────────────────────────────
const PRESET_CLI_MODELS = {
  'coder': {
    name: 'LFM2.5 230M Coder (BRIK int4)',
    url: 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
    format: 'brik',
    size: '149 Mo',
    defaultSystem: 'You are Brimkern Code, an expert software engineer. Provide high-quality, production-ready, clean and concise code with minimal explanations. Format code blocks using markdown syntax.',
    desc: 'Spécialisé pour le code : génération, refactoring, debug et revue technique.'
  },
  'lfm2': {
    name: 'LFM2.5 230M Généraliste (BRIK int4)',
    url: 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik',
    format: 'brik',
    size: '149 Mo',
    defaultSystem: 'You are Brimkern, a fast and helpful local AI assistant running on WebGPU.',
    desc: 'Ultra-léger, ultra-rapide, consommation VRAM minimale.'
  },
  'qwen-0.5b': {
    name: 'Qwen 2.5 0.5B Instruct (BRIK mixte)',
    url: 'https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik',
    format: 'brik',
    size: '377 Mo',
    defaultSystem: 'You are Brimkern, a helpful and precise coding assistant running on WebGPU.',
    desc: 'Qwen 2.5 en format BRIK streamé : léger, rapide et capable sur petit GPU.'
  },
  'coder-0.5b': {
    name: 'Qwen 2.5 Coder 0.5B Instruct (GGUF)',
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf',
    format: 'gguf',
    size: '491 Mo',
    defaultSystem: 'You are Brimkern Code, an expert software engineer. Provide high-quality code and concise explanations.',
    desc: 'Qwen 2.5 Coder 0.5B spécialisé dev : scripts, fonctions, syntaxe et debug rapide.'
  },
  'coder-1.5b': {
    name: 'Qwen 2.5 Coder 1.5B Instruct (GGUF)',
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf',
    format: 'gguf',
    size: '1,12 Go',
    defaultSystem: 'You are Brimkern Code, an expert software architect and engineer. Provide comprehensive, production-ready code with best practices.',
    desc: 'Qwen 2.5 Coder 1.5B : logique poussée, architecture, tests et refactoring lourd.'
  },
  'rwkv': {
    name: 'RWKV-7 G1a 0.4B (BRIK int4)',
    url: 'https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik',
    format: 'brik',
    size: '304 Mo',
    defaultSystem: 'You are a helpful coding assistant.',
    desc: 'Architecture RNN linéaire RWKV-7 en format BRIK (mémoire constante).'
  },
  'rwkv-0.4b': {
    name: 'RWKV-7 G1a 0.4B (BRIK int4)',
    url: 'https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik',
    format: 'brik',
    size: '304 Mo',
    defaultSystem: 'You are a helpful coding assistant.',
    desc: 'Architecture RNN linéaire RWKV-7 en format BRIK (mémoire constante).'
  },
  'rwkv-0.1b': {
    name: 'RWKV-7 G1 0.1B (BRIK int4)',
    url: 'https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik',
    format: 'brik',
    size: '128 Mo',
    defaultSystem: 'You are a helpful coding assistant.',
    desc: 'Modèle RWKV-7 ultra-compact (128 Mo), état récurrent de ~1 Mo.'
  },
};

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
    systemSuffix: '\n[MODE: CODE] Fournis du code propre, directement utilisable en production, avec des explications minimales et ciblées.'
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
function createCliCompleter() {
  const slashCommands = [
    '/help',
    '/mode',
    '/think',
    '/status',
    '/model',
    '/models',
    '/diff',
    '/commit',
    '/review',
    '/copy',
    '/accept',
    '/reset',
    '/stats',
    '/clear',
    '/exit',
  ];

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

  console.log(`
${C.boldRed}┌─ État de la session Brimkern ──────────────────────────────────────────┐${C.reset}
${C.boldRed}│${C.reset} ${C.bold}Modèle actif${C.reset} : ${C.yellow}${engine.displayName.padEnd(49)}${C.reset} ${C.boldRed}│${C.reset}
${C.boldRed}│${C.reset} ${C.bold}Moteur & GPU${C.reset} : ${C.cyan}${(engine.engineType + ' · ' + engine.gpuBackend).padEnd(49)}${C.reset} ${C.boldRed}│${C.reset}
${C.boldRed}│${C.reset} ${C.bold}Mode IA${C.reset}      : ${modeInfo.badge} — ${C.gray}${modeInfo.desc.slice(0, 36).padEnd(36)}${C.reset} ${C.boldRed}│${C.reset}
${C.boldRed}│${C.reset} ${C.bold}Réflexion${C.reset}    : ${thinkInfo.color}${thinkInfo.name.padEnd(8)}${C.reset} ${C.dim}(${thinkInfo.desc.slice(0, 38).padEnd(38)})${C.reset} ${C.boldRed}│${C.reset}
${C.boldRed}│${C.reset} ${C.bold}Dépôt Git${C.reset}    : ${C.sand}${gitBranch.padEnd(49)}${C.reset} ${C.boldRed}│${C.reset}
${C.boldRed}│${C.reset} ${C.bold}Inférence${C.reset}    : ${C.green}Local ($0.00)${C.reset} · ${sessionState.totalTokens} tokens · ~${avgSpeed} tok/s (${elapsedSec}s)    ${C.boldRed}│${C.reset}
${C.boldRed}└────────────────────────────────────────────────────────────────────────┘${C.reset}
`);
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

// ── Serveur HTTP local pour le runner WebGPU ─────────────────────────────────────────
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

    // 2. Modèle local .brik avec support HTTP Range (206 Partial Content)
    if (req.url === '/local-model.brik' && localBrikFile && existsSync(localBrikFile)) {
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

  return new Promise((resolveServer, rejectServer) => {
    server.listen(0, '127.0.0.1', () => {
      resolveServer({ server, port: server.address().port });
    });
    server.on('error', rejectServer);
  });
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
      targetUrl = `http://127.0.0.1:${port}/local-model.brik`;
    }

    const sdkPath = getSdkMjsPath();
    if (!sdkPath) {
      throw new Error('Bundle ESM du SDK introuvable (packages/sdk/dist/brimkern.mjs). Exécutez npm run build:sdk.');
    }

    const sdk = await import(sdkPath);
    this.session = await sdk.createSession({
      model: targetUrl,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
      system: this.systemPrompt,
    });

    this.isReady = true;
  }

  async ask(prompt, { onToken = null, signal = null } = {}) {
    if (!this.isReady) {
      await this.init();
    }
    const t0 = performance.now();
    let lastLen = 0;
    try {
      const text = await this.session.ask(prompt, {
        signal,
        onToken: (acc) => {
          if (onToken) {
            const delta = acc.slice(lastLen);
            lastLen = acc.length;
            onToken(delta);
          }
        },
      });
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
      this.modelUrl = `http://127.0.0.1:${port}/local-model.brik`;
    }

    // Profil persistant pour mettre en cache les modèles téléchargés (IndexedDB / CacheStorage)
    const cacheBase = process.env.XDG_CACHE_HOME || join(homedir(), '.cache');
    this.profileDir = join(cacheBase, 'brimkern', 'chrome-profile');
    if (!existsSync(this.profileDir)) {
      mkdirSync(this.profileDir, { recursive: true });
    }
    cleanLocks(this.profileDir);

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

    if (onToken) {
      await this.page.exposeFunction('onTokenBridge', (delta) => {
        onToken(delta);
      }).catch(() => {});
    }

    if (onProgress) {
      await this.page.exposeFunction('onProgressBridge', (phase, loaded, total) => {
        onProgress(phase, loaded, total);
      }).catch(() => {});
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
      const t0 = performance.now();
      try {
        const text = await window.session.ask(p, {
          signal: window._currentAbort.signal,
          onToken: (acc) => {
            const delta = acc.slice(lastLen);
            lastLen = acc.length;
            window.onTokenBridge(delta);
          }
        });
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
  const gitStr = git ? ` · Git: ${C.sand}${git.branch}${git.dirty ? '*' : ''}${C.gray}` : '';
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

${C.red}┌─ Brimkern WGSL ────────────────────────────────────────────────────────┐${C.reset}
${C.red}│${C.reset} Modèle : ${C.yellow}${engine.displayName.padEnd(25)}${C.reset} WebGPU : ${C.cyan}${gpuStr.padEnd(14)}${C.reset} ${C.red}│${C.reset}
${C.red}│${C.reset} Moteur : ${C.green}${engineStr.padEnd(25)}${C.reset} Statut : ${C.green}Local ($0.00)${C.reset}${gitStr.padEnd(16)} ${C.red}│${C.reset}
${C.red}│${C.reset} Mode   : ${modeBadge.padEnd(34)}${C.reset} Think  : ${C.sand}${think.padEnd(14)}${C.reset} ${C.red}│${C.reset}
${C.red}└────────────────────────────────────────────────────────────────────────┘${C.reset}
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
  ${C.yellow}-m, --model=<nom|url|fichier>${C.reset}    Modèle (défaut: coder / LFM2.5 230M)
  ${C.yellow}-s, --system=<prompt>${C.reset}            Prompt système
  ${C.yellow}-n, --max-tokens=<n>${C.reset}             Plafond de tokens générés (défaut: 512)
  ${C.yellow}-t, --temperature=<val>${C.reset}          Température (défaut: 0.3)
  ${C.yellow}--mode=<code|plan|review|auto>${C.reset}       Mode d'intervention IA (défaut: code)
  ${C.yellow}--think=<off|auto|deep>${C.reset}              Niveau de réflexion pas à pas (défaut: auto)
  ${C.yellow}--native${C.reset}                              Force l'exécution native Dawn (in-process, 0ms overhead)
  ${C.yellow}--chromium, --headless${C.reset}               Force l'exécution via Chromium headless (repli universel)
  ${C.yellow}--raw${C.reset}                              Sortie brute uniquement (sans en-tête ni stats)
  ${C.yellow}-h, --help${C.reset}                         Affiche cette aide

${C.bold}MODÈLES DE DÉVELOPPEMENT & CODE${C.reset}
  ${C.cyan}coder${C.reset}         LFM2.5 230M Coder (format BRIK, 149 Mo) — ${C.dim}spécialisé code & refactoring${C.reset}
  ${C.cyan}coder-0.5b${C.reset}    Qwen 2.5 Coder 0.5B (format GGUF, 491 Mo) — ${C.dim}développement rapide & scripts${C.reset}
  ${C.cyan}coder-1.5b${C.reset}    Qwen 2.5 Coder 1.5B (format GGUF, 1,12 Go) — ${C.dim}architecture, tests et logique${C.reset}
  ${C.cyan}qwen-0.5b${C.reset}     Qwen 2.5 0.5B Instruct (format BRIK, 377 Mo) — ${C.dim}léger & capable sur tout GPU${C.reset}
  ${C.cyan}rwkv${C.reset}          RWKV-7 G1a 0.4B (format BRIK, 304 Mo) — ${C.dim}RNN linéaire en WGSL (mémoire constante)${C.reset}
  ${C.cyan}rwkv-0.1b${C.reset}     RWKV-7 G1 0.1B (format BRIK, 128 Mo) — ${C.dim}ultra-compact, RNN linéaire WGSL${C.reset}
  ${C.cyan}lfm2${C.reset}          LFM2.5 230M Généraliste (format BRIK, 149 Mo) — ${C.dim}ultra-léger & rapide${C.reset}
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

// ── Sélecteur interactif et scrollable de modèles (Flèches ↑/↓, Entrée, Échap) ───────
async function selectModelInteractive(currentModelKey) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    printModels();
    return null;
  }

  const items = [
    {
      key: 'coder',
      name: 'LFM2.5 230M Coder',
      size: '149 Mo',
      format: 'BRIK int4',
      runtime: 'WebGPU (Natif Dawn)',
      badge: 'Dev · Rapide',
      desc: 'Spécialisé pour le code : génération, refactoring, debug & revue technique.',
    },
    {
      key: 'coder-0.5b',
      name: 'Qwen 2.5 Coder 0.5B Instruct',
      size: '491 Mo',
      format: 'GGUF Q4_K_M',
      runtime: 'WebGPU (GGUF)',
      badge: 'Scripts & Fonctions',
      desc: 'Qwen 2.5 Coder 0.5B spécialisé dev : scripts, fonctions, syntaxe et debug rapide.',
    },
    {
      key: 'coder-1.5b',
      name: 'Qwen 2.5 Coder 1.5B Instruct',
      size: '1,12 Go',
      format: 'GGUF Q4_K_M',
      runtime: 'WebGPU (GGUF)',
      badge: 'Architecture & Logique',
      desc: 'Qwen 2.5 Coder 1.5B : logique poussée, architecture, tests et refactoring lourd.',
    },
    {
      key: 'qwen-0.5b',
      name: 'Qwen 2.5 0.5B Instruct',
      size: '377 Mo',
      format: 'BRIK mixte',
      runtime: 'WebGPU (Natif Dawn)',
      badge: 'Polyvalent léger',
      desc: 'Qwen 2.5 en format BRIK streamé : léger, rapide et capable sur tout GPU.',
    },
    {
      key: 'rwkv',
      name: 'RWKV-7 G1a 0.4B',
      size: '304 Mo',
      format: 'BRIK int4',
      runtime: 'WebGPU (Natif Dawn)',
      badge: 'RNN linéaire',
      desc: 'Architecture RNN linéaire RWKV-7 en format BRIK (état fixe, mémoire constante).',
    },
    {
      key: 'rwkv-0.1b',
      name: 'RWKV-7 G1 0.1B',
      size: '128 Mo',
      format: 'BRIK int4',
      runtime: 'WebGPU (Natif Dawn)',
      badge: 'Ultra-compact (128 Mo)',
      desc: 'Modèle RWKV-7 ultra-compact (128 Mo), état récurrent de ~1 Mo, vitesse maximale.',
    },
    {
      key: 'lfm2',
      name: 'LFM2.5 230M Généraliste',
      size: '149 Mo',
      format: 'BRIK int4',
      runtime: 'WebGPU (Natif Dawn)',
      badge: 'Généraliste rapide',
      desc: 'Ultra-léger, ultra-rapide, consommation VRAM minimale.',
    },
  ];

  if (!items.some((it) => it.key === currentModelKey) && currentModelKey && currentModelKey !== 'rwkv-0.4b') {
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

  let selectedIndex = items.findIndex((it) => it.key === currentModelKey);
  if (selectedIndex === -1) {
    if (currentModelKey === 'rwkv-0.4b') {
      selectedIndex = items.findIndex((it) => it.key === 'rwkv');
    } else {
      selectedIndex = 0;
    }
  }

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
      const isActive = item.key === currentModelKey || (item.key === 'rwkv' && currentModelKey === 'rwkv-0.4b');

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
    const cardTitle = `Fiche technique : ${cur.name} `;
    lines.push('  ' + C.darkGray + '┌─ ' + C.yellow + cardTitle + C.darkGray + '─'.repeat(Math.max(2, innerWidth - stripAnsi(cardTitle).length - 1)) + '┐' + C.reset);
    lines.push(boxLine(`${C.bold}Architecture :${C.reset} ${C.yellow}${cur.name}${C.reset}  ${C.dim}·${C.reset}  ${C.bold}VRAM :${C.reset} ${C.yellow}${cur.size}${C.reset}  ${C.dim}·${C.reset}  ${C.cyan}[${cur.badge}]${C.reset}`));
    lines.push(boxLine(`${C.gray}${cur.desc}${C.reset}`));
    lines.push(boxLine(`${C.bold}Format :${C.reset} ${C.sand}${cur.format}${C.reset}  ${C.dim}·${C.reset}  ${C.bold}Moteur :${C.reset} ${C.green}${cur.runtime}${C.reset}  ${C.dim}·${C.reset}  ${C.dim}Commande : /model ${cur.key}${C.reset}`));
    lines.push('  ' + C.darkGray + '└' + '─'.repeat(innerWidth + 2) + '┘' + C.reset);

    return lines.join('\n') + '\n';
  }

  return new Promise((resolve) => {
    process.stdout.write('\x1b[?25l');

    const initialRender = render();
    process.stdout.write(initialRender);
    const totalLines = initialRender.split('\n').length - 1;

    const wasRaw = process.stdin.isRaw;
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      process.stdin.removeListener('keypress', onKey);
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
        process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
        process.stdout.write(render());
        return;
      }

      if (key.name === 'down' || key.name === 'j') {
        selectedIndex = (selectedIndex + 1) % items.length;
        ensureVisible();
        process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
        process.stdout.write(render());
        return;
      }

      if (key.name === 'pageup') {
        selectedIndex = Math.max(0, selectedIndex - pageSize);
        ensureVisible();
        process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
        process.stdout.write(render());
        return;
      }

      if (key.name === 'pagedown') {
        selectedIndex = Math.min(items.length - 1, selectedIndex + pageSize);
        ensureVisible();
        process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
        process.stdout.write(render());
        return;
      }

      if (key.name === 'home') {
        selectedIndex = 0;
        ensureVisible();
        process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
        process.stdout.write(render());
        return;
      }

      if (key.name === 'end') {
        selectedIndex = items.length - 1;
        ensureVisible();
        process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
        process.stdout.write(render());
        return;
      }

      // Raccourcis numériques 1 à items.length
      if (char && char >= '1' && char <= String(Math.min(9, items.length))) {
        selectedIndex = parseInt(char, 10) - 1;
        ensureVisible();
        process.stdout.write(`\x1b[${totalLines}A\r\x1b[0J`);
        process.stdout.write(render());
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

  process.stdin.on('keypress', (char, key) => {
    if (!key || inInteractiveMenu) return;

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

  rl.on('line', async (line) => {
    rl.pause();
    const resumeAndPrompt = () => {
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
  • Coût d'inférence : ${C.boldGreen}0.00 $${C.reset} ${C.dim}(sur votre GPU physique)${C.reset}
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
          if (choice.key === engine.modelKey || (choice.key === 'rwkv' && engine.modelKey === 'rwkv-0.4b')) {
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
    let firstTokenReceived = false;

    spinner.start('Préparation du prompt & contexte...');
    if (files.length > 0) {
      spinner.setPhase(`Chargement de ${files.length} fichier(s) de contexte...`);
    }

    const thinkFilter = new ThinkStreamFilter({
      onToken: (tok, isThink) => {
        tokenCount++;
        if (!firstTokenReceived) {
          firstTokenReceived = true;
          spinner.stop(true);
        }
        if (isThink) {
          process.stdout.write(`${C.dim}${C.italic}${tok}${C.reset}`);
        } else {
          process.stdout.write(tok);
        }
      },
      onThinkStart: () => {
        if (!firstTokenReceived) {
          firstTokenReceived = true;
          spinner.stop(true);
        }
        process.stdout.write(`\n${C.sand}💭 [Réflexion]${C.reset}\n${C.dim}${C.italic}`);
      },
      onThinkEnd: () => {
        process.stdout.write(`${C.reset}\n\n${C.boldGreen}💡 [Réponse]${C.reset}\n`);
      }
    });

    try {
      spinner.setPhase('Calcul des logits WebGPU (TTFT)...');

      let composedPrompt = finalPrompt;
      const modeConfig = CLI_MODES[currentMode] || CLI_MODES.code;
      if (modeConfig.systemSuffix) {
        composedPrompt += modeConfig.systemSuffix;
      }
      const thinkConfig = THINKING_LEVELS[thinkLevel] || THINKING_LEVELS.auto;
      if (thinkConfig.promptSuffix) {
        composedPrompt += thinkConfig.promptSuffix;
      }

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

        console.log('\n');
        const speed = res.elapsedMs > 0 ? ((tokenCount / res.elapsedMs) * 1000).toFixed(1) : '—';
        console.log(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens · ${C.green}$0.00${C.reset} ${C.dim}(${engine.gpuBackend})${C.reset}\n`);
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
  if (THINKING_LEVELS[think]?.promptSuffix) {
    prompt += THINKING_LEVELS[think].promptSuffix;
  }

  // Mode One-shot
  const spinner = new ActivitySpinner();
  if (!raw) {
    spinner.start(`[Brimkern WGSL] ${engine.displayName} · Calcul des logits...`);
  }

  let tokenCount = 0;
  let firstTokenReceived = false;

  const thinkFilter = new ThinkStreamFilter({
    onToken: (tok, isThink) => {
      tokenCount++;
      if (!firstTokenReceived) {
        firstTokenReceived = true;
        spinner.stop(true);
      }
      if (isThink) {
        process.stdout.write(`${C.dim}${C.italic}${tok}${C.reset}`);
      } else {
        process.stdout.write(tok);
      }
    },
    onThinkStart: () => {
      if (!firstTokenReceived) {
        firstTokenReceived = true;
        spinner.stop(true);
      }
      process.stdout.write(`\n${C.sand}💭 [Réflexion]${C.reset}\n${C.dim}${C.italic}`);
    },
    onThinkEnd: () => {
      process.stdout.write(`${C.reset}\n\n${C.boldGreen}💡 [Réponse]${C.reset}\n`);
    }
  });

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
      process.stderr.write(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens générés · ${C.green}$0.00${C.reset} ${C.dim}(${engine.gpuBackend})${C.reset}\n`);
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
