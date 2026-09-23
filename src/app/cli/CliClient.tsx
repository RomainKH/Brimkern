"use client";

// Page de promotion et de documentation de la CLI Brimkern — inférence WebGPU en WGSL
// directement dans le terminal.
// Bilingue via useT() et useHref(), intégrée dans DocsShell pour un accès immédiat
// depuis la navigation de documentation.

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Zap, Code2, Play, HardDrive, Shield, Cpu } from 'lucide-react';
import { useT, useHref } from '@/lib/i18n';
import DocsShell, { Code, P, Section } from '../docs/DocsShell';

// Bouton de copie avec confirmation temporaire
function CopySnippet({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const t = useT();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // repli silencieux
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: 'var(--bg-code)',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        padding: '10px 14px',
        margin: '10px 0',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', minWidth: 0 }}>
        <span style={{ color: 'var(--accent)', userSelect: 'none' }}>$</span>
        <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{text}</span>
      </div>
      <button
        onClick={handleCopy}
        type="button"
        aria-label={label || t('Copy command', 'Copier la commande')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: copied ? 'var(--accent)' : 'transparent',
          color: copied ? '#fff' : 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        <span>{copied ? t('Copied', 'Copié') : t('Copy', 'Copier')}</span>
      </button>
    </div>
  );
}

// Paramètre de documentation CLI
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

export default function CliClient() {
  const t = useT();
  const href = useHref();

  const toc: { id: string; label: string }[] = [
    { id: 'quickstart', label: t('Quickstart & Install', 'Démarrage rapide & Install') },
    { id: 'context', label: t('File Context & Git', 'Contexte @fichier & Git') },
    { id: 'chat', label: t('Interactive REPL', 'REPL interactif') },
    { id: 'pipes', label: t('Unix Pipes & Code', 'Pipes Unix & Code') },
    { id: 'presets', label: t('Models & .brik Format', 'Modèles & format .brik') },
    { id: 'options', label: t('Options Reference', 'Référence des options') },
    { id: 'architecture', label: t('WGSL Architecture', 'Architecture WGSL') },
  ];

  return (
    <DocsShell toc={toc}>
      {/* ── EN-TÊTE HERO ──────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '2px solid var(--accent)', paddingTop: 18, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--accent-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('Terminal Inference · WebGPU WGSL', 'Inférence Terminal · WebGPU WGSL')}
          </span>
          <span style={{ fontSize: 11, background: 'var(--accent-bg, rgba(239,68,68,0.1))', color: 'var(--accent)', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>
            v0.4.0
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: '6px 0 14px', color: 'var(--text-primary)' }}>
          {t('WebGPU LLMs in your terminal, written in WGSL', 'Des LLMs WebGPU dans votre terminal, écrits en WGSL')}
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 720 }}>
          {t(
            'Run lightweight coding models on your hardware GPU directly from the command line. No Python, no CUDA drivers, no server: hand-written WGSL compute shaders, Unix pipe integration, and instant streaming of .brik files.',
            'Exécutez des modèles de code légers sur votre GPU matériel directement depuis la ligne de commande. Sans Python, sans pilotes CUDA, sans serveur : kernels WGSL écrits à la main, intégration des pipes Unix et streaming instantané de fichiers .brik.'
          )}
        </p>

        {/* Boutons d'action rapide */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 28 }}>
          <Link href={`${href('/chat')}?start=1`} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
            <Play size={14} /> {t('Try in browser first', 'Tester d’abord dans le navigateur')}
          </Link>
          <a
            href="https://github.com/RomainKH/Brimkern/blob/main/bin/brimkern.mjs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}
          >
            <Code2 size={14} /> {t('View CLI source', 'Voir le code source')}
          </a>
        </div>
      </div>

      {/* ── PREVIEW CONSOLE RÉALISTE ─────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-code)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 36,
          boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 14px',
            borderBottom: '1px solid var(--border-color)',
            background: 'color-mix(in srgb, var(--bg-code) 90%, black 10%)',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
            brimkern — bash
          </span>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.65 }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>
            <span style={{ color: 'var(--accent)' }}>$ </span>
            <span style={{ color: 'var(--text-primary)' }}>cat src/kernel.wgsl | npx brimkern &quot;Check for memory race conditions&quot;</span>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: 11.5, margin: '6px 0' }}>
            [Brimkern WGSL] {t('Model: LFM2.5 230M Coder (BRIK int4) • WebGPU inference...', 'Modèle : LFM2.5 230M Coder (BRIK int4) • Inférence WebGPU...')}
          </div>

          <div style={{ color: 'var(--text-primary)', marginTop: 8 }}>
            {t(
              'No race condition detected. The `workgroupBarrier()` at line 42 properly synchronizes shared memory before reading tile coordinates. Recommendation: align `vec4<f32>` accesses to avoid uncoalesced memory fetches.',
              'Aucune race condition détectée. Le `workgroupBarrier()` à la ligne 42 synchronise correctement la mémoire partagée avant la lecture des tuiles. Recommandation : aligner les accès `vec4<f32>` pour maximiser le coalescing mémoire.'
            )}
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 12, borderTop: '1px dashed var(--border-color)', paddingTop: 8 }}>
            ⏱ 1.38s · ~59.2 tok/s · 76 tokens {t('generated on Apple Metal', 'générés sur Apple Metal')}
          </div>
        </div>
      </div>

      {/* ── SECTION DÉMARRAGE RAPIDE ────────────────────────────────────────── */}
      <Section id="quickstart" title={t('Quickstart & Universal Install', 'Démarrage rapide & Installation universelle')}>
        <P>
          {t(
            'Install Brimkern on any device (macOS Apple Silicon & Intel, Linux, WSL) in a single command. The installer configures Node, global bins, and the hardware WebGPU environment automatically:',
            'Installez Brimkern sur n’importe quel appareil (macOS Apple Silicon & Intel, Linux, WSL) en une seule commande. Le script configure Node, les binaires globaux et l’environnement WebGPU matériel automatiquement :'
          )}
        </P>

        <CopySnippet text="curl -fsSL https://brimkern.com/install.sh | bash" label={t('Universal installer', 'Installateur universel')} />

        <P>
          {t('Or run it on demand without permanent installation using npx:', 'Ou lancez-le à la demande sans installation permanente avec npx :')}
        </P>

        <CopySnippet text='npx brimkern "Write a quicksort function in TypeScript"' />

        <P>
          {t('Or via npm global install:', 'Ou via npm global :')}
        </P>

        <CopySnippet text="npm install -g brimkern" label={t('Install globally via npm', 'Installer globalement via npm')} />

        <P>
          <strong>{t('Hardware GPU Acceleration: ', 'Accélération matérielle GPU : ')}</strong>
          {t(
            'Brimkern runs directly on your physical GPU hardware (Apple Metal on macOS, Vulkan on Linux, D3D12/Vulkan on Windows). No CUDA toolkit, no Python, and no heavy background daemons are required.',
            'Brimkern s’exécute directement sur votre GPU physique (Apple Metal sur macOS, Vulkan sur Linux, D3D12/Vulkan sur Windows). Aucun toolkit CUDA, aucun environnement Python ni démon d’arrière-plan n’est requis.'
          )}
        </P>
      </Section>

      {/* ── SECTION CONTEXTE FICHIER & GIT ──────────────────────────────────── */}
      <Section id="context" title={t('File Context & Git Integration (@file, /diff, /commit)', 'Contexte fichier & Intégration Git (@fichier, /diff, /commit')}>
        <P>
          {t(
            'Like Claude Code or Gemini CLI, Brimkern brings direct awareness of your project files and git repository right to your terminal:',
            'À la manière de Claude Code ou de Gemini CLI, Brimkern apporte une conscience directe de vos fichiers de projet et de votre dépôt git dans votre terminal :'
          )}
        </P>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('1. Inline file context with @filepath', '1. Injection de contexte avec @fichier')}
        </h3>
        <P>
          {t(
            'Mention any file with @path/to/file or specify line ranges with @path/to/file:start-end. Brimkern automatically reads the file from disk, counts lines, and embeds it into the prompt with language-tagged markdown fences:',
            'Mentionnez n’importe quel fichier avec @chemin/vers/fichier ou spécifiez des lignes avec @chemin/vers/fichier:début-fin. Brimkern charge automatiquement le fichier depuis le disque, compte les lignes et l’injecte dans le prompt avec la coloration syntaxique :'
          )}
        </P>
        <Code lang="sh">{'brimkern "Explique la logique de ce composant @src/app/Composer.tsx:10-60"'}</Code>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('2. Instant Git code reviews (/diff)', '2. Revue de code Git instantanée (/diff)')}
        </h3>
        <P>
          {t(
            'In chat mode or via pipe, ask for a review of your current branch changes. In REPL, simply type /diff:',
            'En mode chat ou via pipe, demandez une relecture de vos modifications git en cours. Dans le REPL, tapez simplement /diff :'
          )}
        </P>
        <Code lang="sh">{'kern › /diff'}</Code>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('3. Conventional commit message generator (/commit)', '3. Générateur de messages de commit (/commit)')}
        </h3>
        <P>
          {t(
            'Inspects git status and uncommitted diffs to generate 3 conventional commit proposals in French and English with diagnostic context:',
            'Inspecte git status et les diffs non commités pour générer 3 propositions de messages de commit conventionnels en français et anglais avec leur diagnostic :'
          )}
        </P>
        <Code lang="sh">{'kern › /commit'}</Code>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('4. Direct clipboard copying (/copy)', '4. Copie directe dans le presse-papier (/copy)')}
        </h3>
        <P>
          {t(
            'Never select terminal text manually again: /copy sends the assistant’s latest response directly to your system clipboard (macOS pbcopy, Linux xclip/wl-copy, Windows clip):',
            'Plus besoin de sélectionner du texte dans la console : /copy envoie la dernière réponse de l’assistant directement dans votre presse-papier système (macOS pbcopy, Linux xclip/wl-copy, Windows clip) :'
          )}
        </P>
        <Code lang="sh">{'kern › /copy'}</Code>
      </Section>

      {/* ── SECTION PIPES UNIX & CODE ────────────────────────────────────────── */}
      <Section id="pipes" title={t('Unix Pipes & Code Automation', 'Pipes Unix & Automatisation de code')}>
        <P>
          {t(
            'Brimkern reads standard input (stdin) automatically. You can chain it with your favorite Unix tools (cat, git diff, curl, pbpaste) to analyze code, explain stack traces, or generate documentation directly from your shell scripts.',
            'Brimkern lit l’entrée standard (stdin) automatiquement. Vous pouvez l’enchaîner avec vos outils Unix habituels (cat, git diff, curl, pbpaste) pour analyser du code, expliquer des stack traces ou générer de la documentation directement depuis vos scripts shell.'
          )}
        </P>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('1. Reviewing git changes', '1. Relire les modifications git')}
        </h3>
        <Code lang="sh">{'git diff | brimkern "Draft a concise French commit title following conventional commits"'}</Code>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('2. Debugging a file or stack trace', '2. Déboguer un fichier ou une stack trace')}
        </h3>
        <Code lang="sh">{'cat crash.log | brimkern "Identify the root cause and propose a fix"'}</Code>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('3. Scripting with clean output (--raw)', '3. Scripts automatisés avec sortie brute (--raw)')}
        </h3>
        <P>
          {t(
            'The --raw flag suppresses progress bars, headers, and performance statistics on stderr. Only the model’s generated output is emitted to stdout, perfect for piping into files or other tools:',
            'Le drapeau --raw supprime la barre de progression, les en-têtes et les statistiques de performance sur stderr. Seul le texte généré par le modèle sort sur stdout, idéal pour rediriger vers un fichier ou un autre outil :'
          )}
        </P>
        <Code lang="sh">{'brimkern --raw "Generate a .gitignore for a Next.js project with Turborepo" > .gitignore'}</Code>
      </Section>

      {/* ── SECTION REPL INTERACTIF ─────────────────────────────────────────── */}
      <Section id="chat" title={t('Interactive REPL (Chat Mode)', 'REPL interactif (Mode Chat)')}>
        <P>
          {t(
            'To talk to the model with multi-turn conversation memory, simply start the chat mode or run brimkern without arguments in an interactive terminal:',
            'Pour dialoguer avec le modèle avec mémoire conversationnelle multi-tours, lancez simplement le mode chat ou exécutez brimkern sans argument dans un terminal interactif :'
          )}
        </P>

        <CopySnippet text="brimkern chat" />

        <P>
          {t(
            'The KV cache stays resident on your GPU across turns: follow-up questions evaluate only new tokens, yielding instant answers. In chat mode, the following slash commands are available:',
            'Le cache KV reste résident sur votre GPU d’un tour à l’autre : les questions suivantes n’évaluent que les nouveaux tokens, garantissant des réponses immédiates. En mode chat, les commandes suivantes sont disponibles :'
          )}
        </P>

        <ul style={{ paddingLeft: 20, margin: '10px 0', fontSize: 13.5, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>@chemin/fichier</code> : {t('Injects source code or specific line ranges into prompt (supports Tab completion)', 'Injecte du code source ou des plages de lignes dans le prompt (avec complétion Tab)')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/mode [code|plan|review|auto]</code> : {t('Switches operating mode (direct code, architecture planning, strict review, or autonomous edits)', 'Bascule le mode d’intervention (code direct, planification, audit strict ou mode auto/agent)')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/think [off|auto|deep]</code> : {t('Adjusts chain-of-thought and streaming reasoning blocks with <think>', 'Ajuste la réflexion pas à pas et le flux de raisonnement stylisé <think>')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/status</code> : {t('Displays active model, physical WebGPU adapter, operating mode, and KV cache', 'Affiche l’état complet : modèle actif, GPU physique, mode actif et cache KV')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/diff [args]</code> : {t('Analyzes git diff and provides an automated code review', 'Analyse le diff git et génère une revue de code automatique')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/commit</code> : {t('Drafts 3 conventional commit message proposals with rationale', 'Rédige 3 propositions de messages de commit conventionnels')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/accept, /apply</code> : {t('Extracts proposed code blocks or diffs and copies them for seamless integration', 'Extrait les blocs de code ou diffs proposés et les copie pour intégration')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/copy</code> : {t('Copies the latest assistant response directly to system clipboard', 'Copie la dernière réponse de l’assistant dans le presse-papier')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/model [nom]</code> : {t('Displays or live-switches active model without restarting', 'Affiche ou change le modèle actif à la volée')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/stats</code> : {t('Displays session statistics, token velocity and $0 on-device cost', 'Affiche les statistiques de session, le débit en tok/s et le coût nul')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>!commande</code> : {t('Executes a local shell command directly from REPL (e.g. !git status)', 'Exécute une commande shell locale depuis le REPL (ex: !git status)')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Tab</code> : {t('Smart autocompletion for slash commands, mode names, and filesystem paths', 'Auto-complétion intelligente des commandes (/), des modes et des chemins de fichiers (@)')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Escape</code> : {t('Instantly cancels in-flight GPU generation via AbortController, or clears input draft', 'Interrompt immédiatement la génération GPU via AbortController, ou efface la saisie')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/clear</code> : {t('Clears terminal screen', 'Efface l’écran du terminal')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/reset</code> : {t('Resets conversation history and frees GPU KV cache', 'Réinitialise l’historique et vide le cache KV GPU')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/exit</code> {t('or', 'ou')} <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Ctrl+D</code> : {t('Exits the REPL session', 'Quitte la session REPL')}</li>
        </ul>
      </Section>

      {/* ── SECTION MODÈLES & FORMAT BRIK ────────────────────────────────────── */}
      <Section id="presets" title={t('Models & the .brik Format', 'Modèles & format .brik')}>
        <P>
          {t(
            'The CLI is pre-configured with curated, lightweight models packaged in the .brik format. Weights stream once over HTTP Range requests and are cached permanently in ~/.cache/brimkern/chrome-profile for instant offline reuse.',
            'La CLI est pré-configurée avec des modèles sélectionnés, légers et empaquetés au format .brik. Les poids streamment une seule fois par plages HTTP et restent mis en cache dans ~/.cache/brimkern/chrome-profile pour un démarrage hors-ligne instantané.'
          )}
        </P>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, margin: '18px 0' }}>
          <div style={{ background: 'var(--bg-code)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--accent-text)' }}>coder (défaut)</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>149 Mo</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {t('LFM2.5 230M Coder (BRIK int4). Tailored specifically for code generation, bug fixing, refactoring, and code review.',
                 'LFM2.5 230M Coder (BRIK int4). Spécialisé pour la génération de code, la correction de bugs, le refactoring et la revue technique.')}
            </p>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>brimkern -m coder &quot;...&quot;</code>
          </div>

          <div style={{ background: 'var(--bg-code)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>coder-0.5b</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>491 Mo</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {t('Qwen 2.5 Coder 0.5B (GGUF int4). Ultra-compact coder fine-tuned for scripting, quick fixes, and syntactic correctness.',
                 'Qwen 2.5 Coder 0.5B (GGUF int4). Modèle compact spécialisé dev : scripts, petits correctifs et exactitude syntaxique.')}
            </p>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>brimkern -m coder-0.5b &quot;...&quot;</code>
          </div>

          <div style={{ background: 'var(--bg-code)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>coder-1.5b</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>1,12 Go</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {t('Qwen 2.5 Coder 1.5B (GGUF int4). Advanced architectural reasoning, deeper refactoring, and test suite generation.',
                 'Qwen 2.5 Coder 1.5B (GGUF int4). Raisonnement d’architecture avancé, refactoring profond et génération de suites de tests.')}
            </p>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>brimkern -m coder-1.5b &quot;...&quot;</code>
          </div>

          <div style={{ background: 'var(--bg-code)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>rwkv</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>1,5 Go</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {t('RWKV-7 World 1.5B (BRIK). Linear attention recurrent architecture, strong multilingual and code proficiency.',
                 'RWKV-7 World 1.5B (BRIK). Architecture RNN à attention linéaire, grande compétence multilingue et logique de code.')}
            </p>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>brimkern -m rwkv &quot;...&quot;</code>
          </div>
        </div>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--text-primary)' }}>
          {t('Using local or custom .brik files', 'Utiliser un fichier .brik local ou personnalisé')}
        </h3>
        <P>
          {t(
            'You can pass a local file path directly. The CLI automatically spawns an ephemeral loopback HTTP server with RFC 7233 byte-range support so your weights stream to the GPU without loading the entire file in RAM:',
            'Vous pouvez passer directement le chemin d’un fichier local. La CLI démarre automatiquement un serveur HTTP local éphémère gérant les requêtes de plages d’octets (RFC 7233) pour streamer les poids vers le GPU sans saturer la RAM :'
          )}
        </P>
        <Code lang="sh">{'brimkern --model=./models/custom-model.brik "Explain this code"'}</Code>
      </Section>

      {/* ── SECTION RÉFÉRENCE DES OPTIONS ───────────────────────────────────── */}
      <Section id="options" title={t('Options Reference', 'Référence des options')}>
        <P>
          {t('Full syntax and command-line flags accepted by brimkern:', 'Syntaxe complète et drapeaux acceptés par brimkern :')}
        </P>

        <Param name="-m, --model=<preset|url|path>" type="string">
          {t(
            'Model to run. Preset name (coder, coder-0.5b, coder-1.5b, qwen-0.5b, rwkv, lfm2), remote URL to a .brik or .gguf file, or local path. Default: coder.',
            'Modèle à exécuter. Nom de preset (coder, coder-0.5b, coder-1.5b, qwen-0.5b, rwkv, lfm2), URL vers un fichier .brik/.gguf, ou chemin local. Défaut : coder.'
          )}
        </Param>

        <Param name="-s, --system=<prompt>" type="string">
          {t(
            'System instructions given to the model. Defaults to an expert coding persona for coder.',
            'Consignes système données au modèle. Défaut : profil d’ingénieur logiciel expert pour coder.'
          )}
        </Param>

        <Param name="-n, --max-tokens=<count>" type="number">
          {t(
            'Maximum number of generated tokens in the response. Default: 512.',
            'Nombre maximal de tokens générés dans la réponse. Défaut : 512.'
          )}
        </Param>

        <Param name="-t, --temperature=<value>" type="number">
          {t(
            'Sampling temperature between 0.0 (deterministic) and 1.0. Default: 0.3 for coding accuracy.',
            'Température d’échantillonnage entre 0.0 (déterministe) et 1.0. Défaut : 0.3 pour la précision de code.'
          )}
        </Param>

        <Param name="--native" type="flag">
          {t(
            'Forces in-process native WebGPU execution via Google Dawn bindings. Boots in <1s with 0-browser overhead.',
            'Force l’exécution native WebGPU in-process via les bindings Google Dawn. Démarre en moins d’une seconde sans ouvrir de navigateur.'
          )}
        </Param>

        <Param name="--chromium, --headless" type="flag">
          {t(
            'Forces the universal headless Chromium runtime (used as automatic fallback for full GGUF dequantization or environments without native bindings).',
            'Force l’exécution via le runtime universel Chromium headless (utilisé comme repli automatique pour les GGUF complets ou les OS sans binaire natif).'
          )}
        </Param>

        <Param name="--raw" type="boolean">
          {t(
            'Outputs only the model tokens to stdout. Suppresses all progress bars, headers, and timing statistics.',
            'Sort uniquement les tokens générés sur stdout. Supprime la barre de progression, les en-têtes et les statistiques de vitesse.'
          )}
        </Param>

        <Param name="chat" type="command">
          {t(
            'Launches the multi-turn interactive REPL session.',
            'Lance la session REPL interactive multi-tours.'
          )}
        </Param>

        <Param name="models" type="command">
          {t(
            'Lists the preconfigured models with their sizes and descriptions.',
            'Liste les modèles pré-configurés avec leur taille et description.'
          )}
        </Param>

        <Param name="-h, --help" type="flag">
          {t(
            'Displays the command-line help message.',
            'Affiche l’aide de la ligne de commande.'
          )}
        </Param>
      </Section>

      {/* ── SECTION ARCHITECTURE WGSL ────────────────────────────────────────── */}
      <Section id="architecture" title={t('WGSL Architecture & Performance', 'Architecture WGSL & Performance')}>
        <P>
          {t(
            'Most local LLM tools require heavy Python dependencies, gigabytes of CUDA packages, or specialized daemons. Brimkern takes a fundamentally different path:',
            'La plupart des outils de LLM locaux exigent de lourdes dépendances Python, des gigaoctets de packages CUDA ou des démons en tâche de fond. Brimkern adopte une approche radicalement différente :'
          )}
        </P>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14, margin: '20px 0' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 14, background: 'var(--bg-code)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent)' }}>
              <Zap size={18} />
              <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{t('Zero Compilation', 'Zéro compilation')}</strong>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              {t(
                'Hand-written WGSL compute shaders compile on the fly in milliseconds via the platform WebGPU driver (Metal on macOS, Vulkan on Linux).',
                'Les compute shaders WGSL écrits à la main compilent à la volée en quelques millisecondes via le pilote WebGPU de la plateforme (Metal sur macOS, Vulkan sur Linux).'
              )}
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 14, background: 'var(--bg-code)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent)' }}>
              <HardDrive size={18} />
              <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{t('.brik HTTP Streaming', 'Streaming HTTP .brik')}</strong>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              {t(
                'One layer = one contiguous byte range. The model streams directly into GPU memory buffers without inflating system RAM.',
                'Une couche = une plage d’octets contiguë. Le modèle streame directement dans les buffers de la mémoire GPU sans saturer la RAM système.'
              )}
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 14, background: 'var(--bg-code)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent)' }}>
              <Shield size={18} />
              <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{t('Self-Validating Kernels', 'Kernels auto-validés')}</strong>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              {t(
                'Every kernel validates against a CPU reference at launch. If a GPU miscompiles a subgroup shader, it safely falls back to a portable path.',
                'Chaque kernel se valide contre une référence CPU au démarrage. Si un GPU compile mal un shader de sous-groupe, il retombe en toute sécurité sur un chemin portable.'
              )}
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 14, background: 'var(--bg-code)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent)' }}>
              <Cpu size={18} />
              <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{t('Native Dawn Runtime', 'Moteur Natif Dawn')}</strong>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              {t(
                'Direct Node.js N-API bindings to Google Dawn run WebGPU shaders in-process. <1s startup latency, zero Chromium overhead, and native Metal/Vulkan GPU performance.',
                'Bindings N-API Node.js directs vers Google Dawn pour exécuter les shaders WebGPU in-process. Démarrage en <1s, 0 surcharge navigateur, et performances Metal/Vulkan natives.'
              )}
            </p>
          </div>
        </div>

        <P>
          {t('To learn more about the WebGPU engine internals and comparisons with other engines: ', 'Pour en savoir plus sur les entrailles du moteur WebGPU et les comparaisons avec d’autres moteurs : ')}
          <Link href={href('/vs-webllm')} style={{ color: 'var(--accent-text)' }}>{t('Brimkern vs WebLLM measured benchmarks', 'Mesures comparatives Brimkern vs WebLLM')}</Link>
          {t(' or ', ' ou ')}
          <Link href={href('/docs/models')} style={{ color: 'var(--accent-text)' }}>{t('how the .brik container works', 'le fonctionnement du conteneur .brik')}</Link>.
        </P>
      </Section>
    </DocsShell>
  );
}
