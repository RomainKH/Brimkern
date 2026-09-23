"use client";

// Référence de la CLI Brimkern (/docs/cli) — la page produit immersive vit sur /cli. Direction
// artistique reprise du terminal : bannière en blocs, cadres, chasse fixe, et une VRAIE session
// capturée (cf. cli/captures.ts) plutôt qu'une réponse inventée. Aucun effet de fond : les écrans sombres sont du
// contenu (ils représentent le terminal), la page reste sur le papier du site.
//
// Tout chiffre ici vient d'un banc rejouable (ROADMAP §16) — ne pas en ajouter sans mesure.

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Code2, Terminal } from 'lucide-react';
import { useT, useHref } from '@/lib/i18n';
import DocsShell, { Code, P } from '../DocsShell';
import s from '../../cli/cli.module.css';
import { SESSION, type Seg } from '../../cli/captures';

const BANNER = `██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗███████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║████╗ ████║██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██╔████╔██║█████═╝ █████╗  ██████╔╝██╔██╗ ██║
██╔══██╗██╔══██╗██║██║╚██╔╝██║██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██████╔╝██║  ██║██║██║ ╚═╝ ██║██║ ╚██╗███████╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝`;

const REPO = 'https://github.com/RomainKH/Brimkern';

function CopySnippet({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const t = useT();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* presse-papier refusé : sans effet */ }
  };
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        background: 'var(--bg-code)', border: '1px solid var(--border-color)', borderRadius: 8,
        padding: '8px 10px 8px 14px', fontFamily: 'var(--font-mono)', fontSize: 13,
      }}
    >
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', minWidth: 0 }} tabIndex={0}>
        <span style={{ color: 'var(--accent-text)', userSelect: 'none' }} aria-hidden="true">$</span>
        <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{text}</span>
      </div>
      <button
        onClick={copy}
        type="button"
        aria-label={label || t('Copy command', 'Copier la commande')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer',
          background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 6, padding: '4px 8px', fontSize: 11, fontFamily: 'var(--font-mono)',
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        <span>{copied ? t('Copied', 'Copié') : t('Copy', 'Copier')}</span>
      </button>
    </div>
  );
}

function Screen({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`${s.screen} ${className || ''}`}>
      <div className={s.bar}>
        <span><span className={s.barDot} aria-hidden="true" />{title}</span>
      </div>
      {/* tabIndex : sur téléphone le contenu défile horizontalement, il doit rester atteignable au clavier (axe scrollable-region-focusable). */}
      <div className={s.body} tabIndex={0}>{children}</div>
    </div>
  );
}

function H2({ id, n, children }: { id: string; n: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className={s.h2} style={{ scrollMarginTop: 24 }}>
      <span className={s.h2Num} aria-hidden="true">{n}</span>
      {children}
    </h2>
  );
}

function Seg({ seg }: { seg: Seg }) {
  const [text, cls] = seg;
  if (!cls) return <>{text}</>;
  return <span className={cls.split(' ').map((c) => s[c]).join(' ')}>{text}</span>;
}

function Param({ name, type, children }: { name: string; type: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '9px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</code>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-muted)' }}>{type}</span>
      </div>
      <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{children}</span>
    </div>
  );
}

export default function CliDocsClient() {
  const t = useT();
  const href = useHref();

  const toc = [
    { id: 'session', label: t('A real session', 'Une vraie session') },
    { id: 'install', label: t('Install', 'Installation') },
    { id: 'repl', label: t('The REPL', 'Le REPL') },
    { id: 'context', label: t('Files, git & shell', 'Fichiers, git & shell') },
    { id: 'pipes', label: t('Pipes & scripts', 'Pipes & scripts') },
    { id: 'models', label: t('Models', 'Modèles') },
    { id: 'options', label: t('Options', 'Options') },
    { id: 'engine', label: t('Under the hood', 'Sous le capot') },
  ];

  const commands: [string, string][] = [
    ['@path/file:10-40', t('Injects a file (or a line range) into the prompt. Tab completes paths.', 'Injecte un fichier (ou une plage de lignes) dans le prompt. Tab complète les chemins.')],
    ['/model', t('Interactive picker (↑/↓, Enter) to hot-swap the model.', 'Sélecteur interactif (↑/↓, Entrée) pour changer de modèle à chaud.')],
    ['/mode code|plan|review|auto', t('Changes how the assistant intervenes.', 'Change la manière dont l’assistant intervient.')],
    ['/think off|auto|deep', t('Step-by-step reasoning, shown in its own block.', 'Raisonnement pas à pas, affiché dans son propre bloc.')],
    ['/diff · /commit', t('Review of your git changes · commit message proposals.', 'Revue de vos modifications git · propositions de messages de commit.')],
    ['/review <file>', t('Deep review of one file.', 'Revue approfondie d’un fichier.')],
    ['/copy · /accept', t('Copies the last answer · extracts its code blocks.', 'Copie la dernière réponse · extrait ses blocs de code.')],
    ['/status · /stats', t('Session state · tokens, speed, estimated savings.', 'État de la session · tokens, vitesse, économies estimées.')],
    ['/reset · /clear', t('Forgets the conversation · clears the screen.', 'Oublie la conversation · efface l’écran.')],
    ['!git status', t('Runs a shell command without leaving the REPL.', 'Exécute une commande shell sans quitter le REPL.')],
    ['Esc · Ctrl+C', t('Stops the generation in progress (the session survives).', 'Arrête la génération en cours (la session survit).')],
  ];

  return (
    <DocsShell toc={toc}>
      {/* ── EN-TÊTE : la bannière du terminal ─────────────────────────────────────────────── */}
      <div style={{ marginTop: 12 }}>
        <p className={s.eyebrow}>$ brimkern chat</p>
        <Screen title="brimkern · zsh">
          <pre className={s.banner} aria-hidden="true">{BANNER}</pre>
          <p className={s.tagline}>{t('On-device WebGPU & WGSL inference engine', 'Moteur d’inférence WebGPU & WGSL on-device')}</p>
          <div className={s.box}>
            <span className={s.boxTitle}>Brimkern WGSL</span>
            <div className={s.kv}>
              <span className={s.kvKey}>{t('Model', 'Modèle')}</span><span className={s.sand}>Qwen 3 4B (BRIK int4)</span>
              <span className={s.kvKey}>{t('Engine', 'Moteur')}</span><span className={s.green}>{t('Native Dawn (in-process)', 'Natif Dawn (in-process)')}</span>
              <span className={s.kvKey}>WebGPU</span><span className={s.cyan}>Dawn (Metal)</span>
              <span className={s.kvKey}>{t('Status', 'Statut')}</span><span className={s.green}>{t('100% local', '100 % local')}</span>
            </div>
          </div>
        </Screen>

        <h1 className={s.h1}>
          {t('A coding assistant in your terminal, running on your own GPU', 'Un assistant de code dans votre terminal, sur votre propre GPU')}
        </h1>
        <p className={s.lede}>
          {t(
            'The same hand-written WGSL kernels as the browser engine, driven from your shell. Qwen 3 4B by default, no Python, no CUDA, no server, no API key: your code never leaves the machine.',
            'Les mêmes kernels WGSL écrits à la main que le moteur du navigateur, pilotés depuis votre shell. Qwen 3 4B par défaut, sans Python, sans CUDA, sans serveur, sans clé d’API : votre code ne quitte jamais la machine.'
          )}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#install" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
            <Terminal size={14} /> {t('Install', 'Installer')}
          </a>
          <a href={`${REPO}/blob/main/bin/brimkern.mjs`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
            <Code2 size={14} /> {t('Read the source', 'Lire le code source')}
          </a>
        </div>
      </div>

      {/* ── UNE VRAIE SESSION ─────────────────────────────────────────────────────────────── */}
      <H2 id="session" n="01">{t('A real session', 'Une vraie session')}</H2>
      <P>
        {t(
          'Captured as is from the terminal, colours included: Markdown is rendered while it streams (bold, code, lists), and every answer ends with its timing and an estimate of what a paid API would have charged.',
          'Capturée telle quelle depuis le terminal, couleurs comprises : le Markdown est rendu pendant le flux (gras, code, listes), et chaque réponse se termine par son temps et une estimation de ce qu’une API payante aurait facturé.'
        )}
      </P>
      <Screen title="brimkern chat">
        <pre className={`${s.pre} ${s.wrap}`}>
          {SESSION.map((line, i) => (
            <span key={i}>
              {line.map((seg, j) => <Seg key={j} seg={seg} />)}
              {'\n'}
            </span>
          ))}
        </pre>
      </Screen>
      <p className={s.caption}>{t('Recorded on 2026-09-23 on an M-series Mac, Qwen 3 4B (native Dawn), warm cache. Output untouched.', 'Enregistrée le 23/09/2026 sur un Mac série M, Qwen 3 4B (Dawn natif), cache chaud. Sortie non retouchée.')}</p>

      {/* ── INSTALLATION ──────────────────────────────────────────────────────────────────── */}
      <H2 id="install" n="02">{t('Install', 'Installation')}</H2>
      <P>
        {t(
          'On macOS or Linux, with Node.js 20+ and git. The script clones the repository into ~/.brimkern, installs the dependencies, builds the engine and adds a brimkern command to ~/.local/bin. Run it again to update.',
          'Sur macOS ou Linux, avec Node.js 20+ et git. Le script clone le dépôt dans ~/.brimkern, installe les dépendances, construit le moteur et ajoute une commande brimkern dans ~/.local/bin. Relancez-le pour mettre à jour.'
        )}
      </P>
      <CopySnippet text="curl -fsSL https://brimkern.com/install.sh | bash" label={t('Copy the install command', 'Copier la commande d’installation')} />
      <P>
        {t(
          'Then run brimkern chat in any project folder. The GPU is used directly: Metal on macOS, Vulkan on Linux. The first launch downloads the default model once (2.53 GB); the next launches read it from ~/.cache/brimkern (measured on the 491 MB model: 35.4 s the first time, 3.4 s the second).',
          'Lancez ensuite brimkern chat dans n’importe quel dossier de projet. Le GPU est utilisé directement : Metal sur macOS, Vulkan sur Linux. Le premier lancement télécharge le modèle par défaut une fois (2,53 Go) ; les suivants le relisent depuis ~/.cache/brimkern (mesuré sur le modèle de 491 Mo : 35,4 s la première fois, 3,4 s la seconde).'
        )}
      </P>
      <P>
        {t('Uninstall: ', 'Désinstaller : ')}<code>rm -rf ~/.brimkern ~/.local/bin/brimkern</code>
      </P>

      {/* ── LE REPL ───────────────────────────────────────────────────────────────────────── */}
      <H2 id="repl" n="03">{t('The REPL', 'Le REPL')}</H2>
      <P>
        {t(
          'Type / and the matching commands appear under the prompt as you type, the rest of the first one greyed out: → or Tab accepts it. The assistant knows which project you are in (it reads the README, the package description and the git branch), so “what is this project for?” gets a real answer.',
          'Tapez / et les commandes correspondantes s’affichent sous le prompt pendant la frappe, la fin de la première en grisé : → ou Tab l’accepte. L’assistant sait dans quel projet vous êtes (il lit le README, la description du paquet et la branche git) : « à quoi sert ce projet ? » obtient une vraie réponse.'
        )}
      </P>
      <div className={s.cmds}>
        {commands.map(([cmd, desc]) => (
          <div key={cmd} style={{ display: 'contents' }}>
            <code className={s.cmd}>{cmd}</code>
            <span className={s.cmdDesc}>{desc}</span>
          </div>
        ))}
      </div>
      <P>
        {t(
          'The savings figure is an estimate, and presented as one: tokens ≈ characters / 4, the conversation history counted on every turn as an API would bill it, at a reference price of $3 / $15 per million input / output tokens; set BRIMKERN_PRICE_IN and BRIMKERN_PRICE_OUT to use your own.',
          'Le chiffre d’économies est une estimation, présentée comme telle : tokens ≈ caractères / 4, l’historique compté à chaque tour comme le facturerait une API, à un tarif de référence de 3 $ / 15 $ par million de tokens en entrée / sortie ; BRIMKERN_PRICE_IN et BRIMKERN_PRICE_OUT pour mettre le vôtre.'
        )}
      </P>

      {/* ── FICHIERS, GIT & SHELL ─────────────────────────────────────────────────────────── */}
      <H2 id="context" n="04">{t('Files, git & shell', 'Fichiers, git & shell')}</H2>
      <h3 className={s.h3}>@file</h3>
      <P>{t('Mention a file, optionally with a line range: it is read from disk and inserted in the prompt.', 'Mentionnez un fichier, éventuellement avec une plage de lignes : il est lu sur le disque et inséré dans le prompt.')}</P>
      <Code lang="sh">{'kern › explain the state handling in @src/app/Composer.tsx:10-60'}</Code>
      <h3 className={s.h3}>/diff · /commit · /review</h3>
      <P>{t('Reads your uncommitted changes to review them or propose three conventional commit messages; /review takes one file.', 'Lit vos modifications non commitées pour les relire ou proposer trois messages de commit conventionnels ; /review prend un fichier.')}</P>
      <Code lang="sh">{'kern › /diff\nkern › /commit\nkern › /review src/lib/storage.ts'}</Code>

      {/* ── PIPES & SCRIPTS ───────────────────────────────────────────────────────────────── */}
      <H2 id="pipes" n="05">{t('Pipes & scripts', 'Pipes & scripts')}</H2>
      <P>
        {t(
          'Standard input is read automatically, so Brimkern chains with the usual tools. --raw keeps only the model’s text on stdout (no header, no timing, no colours), ready to redirect.',
          'L’entrée standard est lue automatiquement : Brimkern s’enchaîne avec les outils habituels. --raw ne garde que le texte du modèle sur stdout (ni en-tête, ni temps, ni couleurs), prêt à rediriger.'
        )}
      </P>
      <Code lang="sh">{'git diff | brimkern "Write a conventional commit title"\ncat crash.log | brimkern "Find the root cause"\nbrimkern --raw "Write a .gitignore for a Next.js app" > .gitignore'}</Code>

      {/* ── MODÈLES ───────────────────────────────────────────────────────────────────────── */}
      <H2 id="models" n="06">{t('Models', 'Modèles')}</H2>
      <P>
        {t(
          'Two presets, kept because they answered correctly on a bench of developer questions (explaining TypeScript, deduplicating an array by key, diagnosing `this` in an arrow function; M-series Mac, warm cache). Smaller models were faster but drifted off-topic, so they were removed.',
          'Deux presets, retenus parce qu’ils ont répondu juste sur un banc de questions de développeur (expliquer TypeScript, dédoublonner un tableau par clé, diagnostiquer `this` dans une fonction fléchée ; Mac série M, cache chaud). Les modèles plus petits allaient plus vite mais partaient hors sujet : ils ont été retirés.'
        )}
      </P>
      <div className={s.models}>
        <Screen title="coder · default" className={s.modelCard}>
          <div className={s.modelHead}>
            <span className={s.boldRed}>Qwen 3 4B</span>
            <span className={s.dim}>{t('2.53 GB', '2,53 Go')}</span>
          </div>
          <div className={s.kv}>
            <span className={s.kvKey}>{t('format', 'format')}</span><span className={s.sand}>BRIK int4</span>
            <span className={s.kvKey}>{t('engine', 'moteur')}</span><span className={s.green}>{t('native Dawn', 'Dawn natif')}</span>
            <span className={s.kvKey}>{t('speed', 'vitesse')}</span><span>13–16 tok/s</span>
            <span className={s.kvKey}>{t('bench', 'banc')}</span><span>{t('correct code and diagnosis', 'code et diagnostic justes')}</span>
          </div>
          <p className={s.tagline}>{t('Reasoning on demand: /think deep.', 'Raisonnement à la demande : /think deep.')}</p>
        </Screen>
        <Screen title="fast" className={s.modelCard}>
          <div className={s.modelHead}>
            <span className={s.boldRed}>Qwen 2.5 Coder 1.5B</span>
            <span className={s.dim}>{t('1.12 GB', '1,12 Go')}</span>
          </div>
          <div className={s.kv}>
            <span className={s.kvKey}>{t('format', 'format')}</span><span className={s.sand}>GGUF Q4_K_M</span>
            <span className={s.kvKey}>{t('engine', 'moteur')}</span><span className={s.green}>Chromium</span>
            <span className={s.kvKey}>{t('speed', 'vitesse')}</span><span>~25 tok/s</span>
            <span className={s.kvKey}>{t('bench', 'banc')}</span><span>{t('on topic, more mistakes', 'dans le sujet, plus d’erreurs')}</span>
          </div>
          <p className={s.tagline}>{t('Review the code it proposes.', 'Relisez le code proposé.')}</p>
        </Screen>
      </div>
      <P>
        {t('Any single-file .gguf or .brik also works, by URL or local path (served to the engine with HTTP range requests, never loaded whole in RAM):', 'Tout .gguf mono-fichier ou .brik fonctionne aussi, par URL ou chemin local (servi au moteur par plages HTTP, jamais chargé entier en RAM) :')}
      </P>
      <Code lang="sh">{'brimkern --model=./models/custom.brik "Explain this code"'}</Code>

      {/* ── OPTIONS ───────────────────────────────────────────────────────────────────────── */}
      <H2 id="options" n="07">{t('Options', 'Options')}</H2>
      <Param name="-m, --model=<coder|fast|url|path>" type="string">{t('Model to run. Default: coder (Qwen 3 4B).', 'Modèle à exécuter. Défaut : coder (Qwen 3 4B).')}</Param>
      <Param name="--mode=<code|plan|review|auto>" type="string">{t('How the assistant intervenes. Default: code.', 'Manière d’intervenir de l’assistant. Défaut : code.')}</Param>
      <Param name="--think=<off|auto|deep>" type="string">{t('Step-by-step reasoning. Default: auto (direct answers; deep turns reasoning on).', 'Raisonnement pas à pas. Défaut : auto (réponses directes ; deep l’active).')}</Param>
      <Param name="--lang=<en|fr>" type="string">{t('Interface language. Default: en (or BRIMKERN_LANG).', 'Langue de l’interface. Défaut : en (ou BRIMKERN_LANG).')}</Param>
      <Param name="-s, --system=<prompt>" type="string">{t('Replaces the default system prompt (the project context is then not added).', 'Remplace le prompt système par défaut (le contexte du projet n’est alors pas ajouté).')}</Param>
      <Param name="-n, --max-tokens=<n>" type="number">{t('Cap on generated tokens. Default: 512.', 'Plafond de tokens générés. Défaut : 512.')}</Param>
      <Param name="-t, --temperature=<value>" type="number">{t('Sampling temperature. Default: 0.3.', 'Température d’échantillonnage. Défaut : 0.3.')}</Param>
      <Param name="--raw" type="flag">{t('Model text only on stdout: no header, timing or colours.', 'Seulement le texte du modèle sur stdout : ni en-tête, ni temps, ni couleurs.')}</Param>
      <Param name="--native · --chromium" type="flag">{t('Forces the in-process Dawn engine, or the headless Chromium one (used automatically for GGUF).', 'Force le moteur Dawn in-process, ou Chromium headless (utilisé automatiquement pour les GGUF).')}</Param>
      <Param name="chat" type="command">{t('Starts the multi-turn REPL.', 'Lance le REPL multi-tours.')}</Param>

      {/* ── SOUS LE CAPOT ─────────────────────────────────────────────────────────────────── */}
      <H2 id="engine" n="08">{t('Under the hood', 'Sous le capot')}</H2>
      <div className={s.points}>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Hand-written WGSL', 'WGSL écrit à la main')}</p>
          <p className={s.pointText}>{t('The compute shaders of the browser engine, compiled by the platform WebGPU driver: Metal on macOS, Vulkan on Linux.', 'Les compute shaders du moteur navigateur, compilés par le pilote WebGPU de la plateforme : Metal sur macOS, Vulkan sur Linux.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Native Dawn', 'Dawn natif')}</p>
          <p className={s.pointText}>{t('.brik models run in-process through Node bindings to Google Dawn, without starting a browser.', 'Les modèles .brik tournent in-process via des bindings Node vers Google Dawn, sans lancer de navigateur.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Self-validating kernels', 'Kernels auto-validés')}</p>
          <p className={s.pointText}>{t('Every kernel is checked against a CPU reference at startup; if a GPU gets it wrong, the engine falls back to a portable path.', 'Chaque kernel est comparé à une référence CPU au démarrage ; si un GPU se trompe, le moteur retombe sur un chemin portable.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Streamed once, cached', 'Streamé une fois, en cache')}</p>
          <p className={s.pointText}>{t('Weights arrive by HTTP byte ranges and stay on disk: the next launch reads them locally.', 'Les poids arrivent par plages d’octets HTTP et restent sur le disque : le lancement suivant les relit en local.')}</p>
        </div>
      </div>
      <P>
        {t('More on the engine: ', 'Plus sur le moteur : ')}
        <Link href={href('/vs-webllm')} style={{ color: 'var(--accent-text)' }}>{t('measured comparison with WebLLM', 'comparaison mesurée avec WebLLM')}</Link>
        {t(' · ', ' · ')}
        <Link href={href('/docs/models')} style={{ color: 'var(--accent-text)' }}>{t('the .brik container', 'le conteneur .brik')}</Link>.
      </P>
    </DocsShell>
  );
}
