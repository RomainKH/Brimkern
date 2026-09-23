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
import { readFileSync, existsSync, statSync, createReadStream, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';
import { execSync, spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const SDK_PATH = join(ROOT, 'public', 'sdk.js');

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
  'rwkv': {
    name: 'RWKV-7 World 1.5B (BRIK)',
    url: 'https://huggingface.co/romainkh14/RWKV-7-World_BRIK/resolve/main/rwkv7-1.5b-world.brik',
    format: 'brik',
    size: '1,5 Go',
    defaultSystem: 'You are a helpful coding assistant.',
    desc: 'Architecture RNN linéaire RWKV-7 en format BRIK.'
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

// ── Classe de session CLI ─────────────────────────────────────────────────────────────
class BrimkernCliEngine {
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
  }

  resolveModelConfig() {
    if (PRESET_CLI_MODELS[this.modelKey]) {
      this.modelUrl = PRESET_CLI_MODELS[this.modelKey].url;
      this.displayName = PRESET_CLI_MODELS[this.modelKey].name;
    } else if (existsSync(this.modelKey)) {
      this.localBrikFile = resolve(this.modelKey);
      this.displayName = `Fichier local (${this.modelKey})`;
    } else {
      this.modelUrl = this.modelKey;
      this.displayName = this.modelKey;
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

  async ask(prompt, { onToken = null, onProgress = null } = {}) {
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

    const result = await this.page.evaluate(async (p) => {
      let lastLen = 0;
      const t0 = performance.now();
      const text = await window.session.ask(p, {
        onToken: (acc) => {
          const delta = acc.slice(lastLen);
          lastLen = acc.length;
          window.onTokenBridge(delta);
        }
      });
      const t1 = performance.now();
      return { text, elapsedMs: t1 - t0 };
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

// ── Bannière de marque "Le Kern" ─────────────────────────────────────────────────────
function printBrandBanner(engine) {
  const git = getGitInfo();
  const gitStr = git ? ` · Git: ${C.sand}${git.branch}${git.dirty ? '*' : ''}${C.gray}` : '';
  const gpuStr = process.platform === 'darwin' ? 'Metal' : 'Vulkan';

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
${C.red}│${C.reset} Statut : ${C.green}Local ($0.00)${C.reset}${gitStr.padEnd(38)} ${C.red}│${C.reset}
${C.red}└────────────────────────────────────────────────────────────────────────┘${C.reset}
${C.dim}Tapez ${C.boldRed}/help${C.reset}${C.dim} pour les commandes · ${C.cyan}@fichier${C.reset}${C.dim} pour injecter du code${C.reset}
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

${C.boldRed}CONVERSATION & SESSION${C.reset}
  ${C.bold}${C.cyan}/model [nom|chemin]${C.reset}  Affiche ou change de modèle actif à chaud
  ${C.bold}${C.cyan}/reset${C.reset}               Efface l'historique et libère le cache KV GPU
  ${C.bold}${C.cyan}/stats${C.reset}               Statistiques de session (tokens, tok/s, coût 0$)
  ${C.bold}${C.cyan}/clear${C.reset}               Efface l'écran du terminal

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
  ${C.yellow}--raw${C.reset}                              Sortie brute uniquement (sans en-tête ni stats)
  ${C.yellow}-h, --help${C.reset}                         Affiche cette aide

${C.bold}MODÈLES PRÉCONFIGURÉS${C.reset}
  ${C.cyan}coder${C.reset}     LFM2.5 230M Coder (format BRIK, 149 Mo) — ${C.dim}spécialisé code & dev${C.reset}
  ${C.cyan}lfm2${C.reset}      LFM2.5 230M Généraliste (format BRIK, 149 Mo) — ${C.dim}ultra-léger & rapide${C.reset}
  ${C.cyan}rwkv${C.reset}      RWKV-7 World 1.5B (format BRIK, 1,5 Go) — ${C.dim}RNN linéaire en WGSL${C.reset}
`);
}

function printModels() {
  console.log(`\n${C.boldRed}Modèles disponibles pour la CLI Brimkern :${C.reset}\n`);
  for (const [key, m] of Object.entries(PRESET_CLI_MODELS)) {
    console.log(`  ${C.bold}${C.cyan}${key.padEnd(8)}${C.reset} ${C.bold}${m.name}${C.reset} [${C.yellow}${m.size}${C.reset}]`);
    console.log(`           ${C.gray}${m.desc}${C.reset}`);
    console.log(`           ${C.dim}URL : ${m.url}${C.reset}\n`);
  }
  console.log(`${C.gray}Vous pouvez aussi spécifier un fichier local : --model=/chemin/vers/modele.brik${C.reset}\n`);
}

// ── Mode REPL interactif ──────────────────────────────────────────────────────────────
async function runInteractiveChat(engine) {
  printBrandBanner(engine);

  process.stderr.write(`${C.dim}Initialisation du GPU et chargement du modèle...${C.reset}`);
  await engine.init();
  process.stderr.write(`\r${C.green}✓ Moteur WebGPU prêt et connecté.${C.reset}                                 \n\n`);

  // État de session (stats, lastResponse)
  const sessionState = {
    totalTokens: 0,
    totalElapsedMs: 0,
    lastResponse: '',
  };

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${C.boldRed}kern ›${C.reset} `,
  });

  rl.prompt();

  rl.on('line', async (line) => {
    let input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    // 1. Commandes shell directes (!cmd)
    if (input.startsWith('!') || input.startsWith('/exec ')) {
      const cmd = input.startsWith('!') ? input.slice(1).trim() : input.slice(6).trim();
      if (!cmd) { rl.prompt(); return; }
      console.log(`${C.dim}$ ${cmd}${C.reset}`);
      try {
        execSync(cmd, { stdio: 'inherit' });
      } catch (e) {
        console.error(`${C.red}Erreur d'exécution : ${e.message}${C.reset}`);
      }
      console.log('');
      rl.prompt();
      return;
    }

    // 2. Commandes slash
    if (input === '/exit' || input === '/quit') {
      await engine.close();
      process.exit(0);
    }
    if (input === '/help') {
      printReplHelp();
      rl.prompt();
      return;
    }
    if (input === '/clear') {
      console.clear();
      printBrandBanner(engine);
      rl.prompt();
      return;
    }
    if (input === '/reset') {
      await engine.reset();
      console.log(`${C.yellow}✓ Historique conversationnel et cache KV réinitialisés.${C.reset}\n`);
      rl.prompt();
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
      rl.prompt();
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
      rl.prompt();
      return;
    }
    if (input.startsWith('/model')) {
      const targetModel = input.slice(6).trim();
      if (!targetModel) {
        printModels();
        console.log(`${C.gray}Modèle actif : ${C.yellow}${engine.displayName}${C.reset}\n`);
        rl.prompt();
        return;
      }
      process.stderr.write(`${C.dim}Changement de modèle vers ${targetModel}...${C.reset}`);
      await engine.close();
      engine.modelKey = targetModel;
      engine.resolveModelConfig();
      await engine.init();
      process.stderr.write(`\r${C.green}✓ Modèle actif : ${engine.displayName}${C.reset}                \n\n`);
      rl.prompt();
      return;
    }

    // 3. Raccourcis Git intégrés
    if (input.startsWith('/diff')) {
      const diffArgs = input.slice(5).trim();
      const diff = getGitDiff(diffArgs);
      if (!diff) {
        console.log(`${C.dim}Aucune modification git détectée.${C.reset}\n`);
        rl.prompt();
        return;
      }
      console.log(`${C.dim}Analyse du diff git (${diff.split('\n').length} lignes)...${C.reset}\n`);
      input = `Fais une revue technique concise de ces changements git : bugs potentiels, régressions, sécurité et style.\n\n\`\`\`diff\n${diff}\n\`\`\``;
    } else if (input === '/commit') {
      const status = getGitStatusSummary();
      const diff = getGitDiff();
      if (!status && !diff) {
        console.log(`${C.dim}L'arbre de travail git est propre, aucun commit à proposer.${C.reset}\n`);
        rl.prompt();
        return;
      }
      console.log(`${C.dim}Génération des messages de commit pour les modifications en cours...${C.reset}\n`);
      input = `Voici l'état actuel de mon dépôt git :\n\nStatus :\n${status}\n\nDiff :\n\`\`\`diff\n${diff.slice(0, 4000)}\n\`\`\`\n\nRédige 3 propositions de messages de commit conventionnels concis (type: titre explicite) en français et en anglais avec un court diagnostic de 1 phrase.`;
    } else if (input.startsWith('/review ')) {
      const targetFile = input.slice(8).trim();
      const resolved = resolve(process.cwd(), targetFile);
      if (!existsSync(resolved)) {
        console.log(`${C.red}Fichier introuvable : ${targetFile}${C.reset}\n`);
        rl.prompt();
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

    // 5. Exécution de l'inférence WebGPU
    let tokenCount = 0;
    try {
      const res = await engine.ask(finalPrompt, {
        onToken: (tok) => {
          tokenCount++;
          process.stdout.write(tok);
        },
        onProgress: (phase, loaded, total) => {
          if (total) {
            process.stderr.write(`\r${C.dim}[Téléchargement] ${Math.round(loaded / 1048576)} / ${Math.round(total / 1048576)} Mo${C.reset}`);
          }
        },
      });

      sessionState.lastResponse = res.text;
      sessionState.totalTokens += tokenCount;
      sessionState.totalElapsedMs += res.elapsedMs;

      console.log('\n');
      const speed = res.elapsedMs > 0 ? ((tokenCount / res.elapsedMs) * 1000).toFixed(1) : '—';
      console.log(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens · ${C.green}$0.00${C.reset}\n`);
    } catch (e) {
      console.error(`\n${C.red}Erreur : ${e.message}${C.reset}\n`);
    }

    rl.prompt();
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
  let raw = false;
  let promptParts = [];

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
    } else if (a === '--raw') {
      raw = true;
    } else {
      promptParts.push(a);
    }
  }

  // Lecture de stdin si redirigé (pipe unix)
  let stdinContent = '';
  if (!process.stdin.isTTY) {
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

  const engine = new BrimkernCliEngine({
    model,
    system,
    maxTokens,
    temperature,
    raw,
  });

  const cleanup = async () => {
    await engine.close();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Si aucun prompt et terminal interactif -> REPL chat
  if (!prompt && process.stdin.isTTY) {
    await runInteractiveChat(engine);
    return;
  }

  if (!prompt) {
    printHelp();
    return;
  }

  // Mode One-shot
  if (!raw) {
    process.stderr.write(`${C.dim}[Brimkern WGSL] Modèle: ${engine.displayName} • Inférence WebGPU...${C.reset}\n`);
  }

  let tokenCount = 0;
  try {
    const res = await engine.ask(prompt, {
      onToken: (tok) => {
        tokenCount++;
        process.stdout.write(tok);
      },
      onProgress: (phase, loaded, total) => {
        if (!raw && total) {
          process.stderr.write(`\r${C.dim}[Téléchargement] ${Math.round(loaded / 1048576)} / ${Math.round(total / 1048576)} Mo${C.reset}`);
        }
      },
    });

    if (!raw) {
      console.log('\n');
      const speed = res.elapsedMs > 0 ? ((tokenCount / res.elapsedMs) * 1000).toFixed(1) : '—';
      process.stderr.write(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens générés · ${C.green}$0.00${C.reset}\n`);
    } else {
      process.stdout.write('\n');
    }
  } catch (e) {
    console.error(`\n${C.red}Erreur d'exécution WebGPU : ${e.message}${C.reset}`);
    process.exit(1);
  } finally {
    await engine.close();
  }
}

main().catch((err) => {
  console.error(`${C.red}Erreur fatale : ${err.message}${C.reset}`);
  process.exit(1);
});
