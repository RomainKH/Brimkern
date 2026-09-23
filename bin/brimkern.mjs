#!/usr/bin/env node

/**
 * BRIMKERN CLI — Exécution de modèles d'IA on-device en WGSL / WebGPU depuis le terminal.
 * Moteur d'inférence WebGPU natif (kernels WGSL) via Chromium headless / GPU matériel.
 *
 * Utilisation :
 *   brimkern "Écris une fonction de tri rapide en TypeScript"
 *   cat script.py | brimkern "Trouve les bugs dans ce code"
 *   brimkern chat                       # Mode REPL interactif
 *   brimkern models                     # Liste les modèles pré-configurés
 *
 * Options :
 *   -m, --model=<nom|url|fichier>      Modèle à utiliser (défaut : coder / lfm2.5-230m)
 *   -s, --system=<prompt>              Prompt système (défaut : expert dev orienté code)
 *   -n, --max-tokens=<n>               Nombre maximal de tokens générés (défaut : 512)
 *   -t, --temperature=<val>            Température d'échantillonnage (défaut : 0.3)
 *   --raw                              Sortie brute uniquement (sans en-tête ni stats)
 *   -h, --help                         Affiche cette aide
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, createReadStream, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';
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

// ── Couleurs ANSI pour la console ────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

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

    // Résolution URL du modèle
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

    this.server = null;
    this.browserCtx = null;
    this.page = null;
    this.isReady = false;
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
        '--use-angle=metal',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
      ],
      viewport: { width: 800, height: 600 },
    });

    this.page = this.browserCtx.pages()[0] || await this.browserCtx.newPage();
    await this.page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'domcontentloaded' });

    // Initialisation session WebGPU
    await this.page.evaluate(({ modelUrl, systemPrompt, maxTokens, temperature }) => {
      window.session = Brimkern.createSession({
        model: modelUrl,
        system: systemPrompt,
        maxTokens,
        temperature,
      });
      window.session.on('progress', (phase, pr) => {
        if (window.onProgressBridge) window.onProgressBridge(phase, pr?.loaded, pr?.total);
      });
    }, {
      modelUrl: this.modelUrl,
      systemPrompt: this.systemPrompt,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
    });

    this.isReady = true;
  }

  async ask(prompt, { onToken, onProgress } = {}) {
    if (!this.isReady) await this.init();

    // Pont pour le streaming des tokens
    await this.page.exposeFunction('onTokenBridge', (tokenDelta) => {
      if (onToken) onToken(tokenDelta);
    });

    // Pont pour la progression du téléchargement
    await this.page.exposeFunction('onProgressBridge', (phase, loaded, total) => {
      if (onProgress) onProgress(phase, loaded, total);
    });

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

// ── Aide CLI ──────────────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(`
${C.bold}${C.red}BRIMKERN CLI${C.reset} — Inférence IA locale en WebGPU (WGSL) depuis le terminal

${C.bold}USAGE${C.reset}
  ${C.green}brimkern${C.reset} [options] [prompt]
  ${C.green}brimkern${C.reset} chat                     ${C.gray}# Mode REPL interactif${C.reset}
  ${C.green}brimkern${C.reset} models                   ${C.gray}# Liste les modèles pré-configurés${C.reset}
  ${C.green}cat file.ts | brimkern${C.reset} "Trouve les bugs"

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
  console.log(`\n${C.bold}${C.red}Modèles disponibles pour la CLI Brimkern :${C.reset}\n`);
  for (const [key, m] of Object.entries(PRESET_CLI_MODELS)) {
    console.log(`  ${C.bold}${C.cyan}${key.padEnd(8)}${C.reset} ${C.bold}${m.name}${C.reset} [${C.yellow}${m.size}${C.reset}]`);
    console.log(`           ${C.gray}${m.desc}${C.reset}`);
    console.log(`           ${C.dim}URL : ${m.url}${C.reset}\n`);
  }
  console.log(`${C.gray}Vous pouvez aussi spécifier un fichier local : --model=/chemin/vers/modele.brik${C.reset}\n`);
}

// ── Mode REPL interactif ──────────────────────────────────────────────────────────────
async function runInteractiveChat(engine) {
  console.log(`
${C.bold}${C.red}██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗███████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║████╗ ████║██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██╔████╔██║█████═╝ █████╗  ██████╔╝██╔██╗ ██║
██╔══██╗██╔══██╗██║██║╚██╔╝██║██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██████╔╝██║  ██║██║██║ ╚═╝ ██║██║ ╚██╗███████╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝${C.reset}
${C.gray}Moteur WebGPU (WGSL) on-device • Modèle : ${C.yellow}${engine.displayName}${C.gray} • Tapez ${C.cyan}/help${C.gray} pour les commandes.${C.reset}
`);

  process.stderr.write(`${C.dim}Initialisation du GPU et chargement du modèle...${C.reset}`);
  await engine.init();
  process.stderr.write(`\r${C.green}✓ Moteur WebGPU prêt et connecté.${C.reset}                                 \n\n`);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${C.bold}${C.cyan}brimkern>${C.reset} `,
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    if (input === '/exit' || input === '/quit') {
      await engine.close();
      process.exit(0);
    }
    if (input === '/help') {
      console.log(`
Commandes :
  /reset    Réinitialise l'historique de la conversation
  /clear    Efface l'écran de la console
  /exit     Quitte la session
`);
      rl.prompt();
      return;
    }
    if (input === '/reset') {
      await engine.reset();
      console.log(`${C.yellow}Historique réinitialisé.${C.reset}\n`);
      rl.prompt();
      return;
    }
    if (input === '/clear') {
      console.clear();
      rl.prompt();
      return;
    }

    let tokenCount = 0;
    try {
      const res = await engine.ask(input, {
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

      console.log('\n');
      const speed = res.elapsedMs > 0 ? ((tokenCount / res.elapsedMs) * 1000).toFixed(1) : '—';
      console.log(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens${C.reset}\n`);
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

  // Parsing des arguments
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

  // Lecture de stdin si redirigé (pipe)
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

  const engine = new BrimkernCliEngine({
    model,
    system,
    maxTokens,
    temperature,
    raw,
  });

  // Nettoyage à l'interruption
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
      process.stderr.write(`${C.gray}⏱ ${(res.elapsedMs / 1000).toFixed(2)}s · ~${speed} tok/s · ${tokenCount} tokens générés${C.reset}\n`);
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
