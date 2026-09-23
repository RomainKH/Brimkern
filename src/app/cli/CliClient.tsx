"use client";

// Page de promotion et de documentation de la CLI Brimkern — inférence WebGPU en WGSL
// directement dans le terminal.
// Bilingue via useT() et useHref(), intégrée dans DocsShell pour un accès immédiat
// depuis la navigation de documentation.

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Zap, Code2, Play, HardDrive, Shield } from 'lucide-react';
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
    { id: 'quickstart', label: t('Quickstart', 'Démarrage rapide') },
    { id: 'pipes', label: t('Unix Pipes & Code', 'Pipes Unix & Code') },
    { id: 'chat', label: t('Interactive REPL', 'REPL interactif') },
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
      <Section id="quickstart" title={t('Quickstart', 'Démarrage rapide')}>
        <P>
          {t(
            'The CLI requires zero build step and zero prior setup. You can run it instantly using npx without installing anything permanently:',
            'La CLI ne demande aucune étape de compilation ni configuration préalable. Vous pouvez la lancer instantanément avec npx sans rien installer définitivement :'
          )}
        </P>

        <CopySnippet text='npx brimkern "Write a quicksort function in TypeScript"' />

        <P>
          {t(
            'To have brimkern available everywhere as a global command in your terminal:',
            'Pour rendre brimkern disponible partout comme commande globale dans votre terminal :'
          )}
        </P>

        <CopySnippet text="npm install -g brimkern" label={t('Install globally', 'Installer globalement')} />

        <P>
          <strong>{t('Requirements: ', 'Prérequis : ')}</strong>
          {t(
            'Node.js 18+ and a Chromium or Chrome installation. On macOS, Linux, or Windows, Brimkern automatically detects Chromium (Playwright cache or system Chrome) and launches it in headless mode with native GPU flags (--enable-unsafe-webgpu, --use-angle=metal/vulkan).',
            'Node.js 18+ et une installation de Chromium ou Google Chrome. Sur macOS, Linux ou Windows, Brimkern détecte automatiquement Chromium (cache Playwright ou Chrome système) et le lance en mode headless avec les drapeaux GPU natifs (--enable-unsafe-webgpu, --use-angle=metal/vulkan).'
          )}
        </P>
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
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/clear</code> : {t('Resets conversation history and frees the KV cache', 'Réinitialise l’historique de conversation et vide le cache KV')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/help</code> : {t('Displays available commands', 'Affiche les commandes disponibles')}</li>
          <li><code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/exit</code> {t('or', 'ou')} <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Ctrl+C</code> : {t('Exits the REPL session', 'Quitte la session REPL')}</li>
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
              {t('LFM2.5 230M Coder (int4). Tailored specifically for code generation, bug fixing, refactoring, and code review.',
                 'LFM2.5 230M Coder (int4). Spécialisé pour la génération de code, la correction de bugs, le refactoring et la revue technique.')}
            </p>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>brimkern -m coder &quot;...&quot;</code>
          </div>

          <div style={{ background: 'var(--bg-code)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>lfm2</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>149 Mo</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {t('LFM2.5 230M General (int4). Ultra-light general assistant for conversational queries with minimal VRAM footprint.',
                 'LFM2.5 230M Généraliste (int4). Modèle ultra-léger pour requêtes conversationnelles, empreinte VRAM minimale.')}
            </p>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>brimkern -m lfm2 &quot;...&quot;</code>
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
            'Model to run. Can be a preset name (coder, lfm2, rwkv), a direct remote URL to a .brik file, or a local filesystem path. Default: coder.',
            'Modèle à exécuter. Nom de preset (coder, lfm2, rwkv), URL directe vers un fichier .brik, ou chemin de fichier local. Défaut : coder.'
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
