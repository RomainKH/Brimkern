"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Bot, Terminal, Cpu, Zap, Copy, Check, ArrowRight, Layers, ShieldCheck, Sparkles, ServerOff } from 'lucide-react';
import { useT, useLocale, useHref } from '@/lib/i18n';
import BrandMark from '../BrandMark';
import ByLine from '../ByLine';

function CodeSnippet({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-code-wrap" style={{ margin: '14px 0' }}>
      <pre className="docs-code" style={{ fontSize: 13, lineHeight: 1.6, padding: '16px 18px' }}>
        <code>{code}</code>
      </pre>
      <button
        type="button"
        className="docs-code-copy"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  );
}

export default function AgentsClient() {
  const t = useT();
  const href = useHref();
  const { locale, setLocale } = useLocale();

  const mcpConfigJson = `{
  "mcpServers": {
    "brimkern": {
      "command": "brimkern",
      "args": ["mcp", "--model=coder"]
    }
  }
}`;

  const jsonExampleCmd = `git diff | brimkern --json "Draft a conventional commit title"`;

  const jsonExampleOutput = `{
  "success": true,
  "output": "feat(auth): add webauthn biometric passkey support",
  "model": "coder",
  "stats": {
    "tokens": 28,
    "tokPerSec": 22.4,
    "durationMs": 1250,
    "costUsd": 0.0
  }
}`;

  const skillPromptExample = `# .claude/skills/brimkern-worker/SKILL.md
name: brimkern-worker
description: Delegate simple code reviews, diff summaries, or lint fixes to local GPU to save tokens.
prompt: |
  Before calling expensive cloud LLMs for repetitive or basic coding tasks:
  1. Pipe the file or diff to: brimkern --json "<task>"
  2. Parse the local response and integrate it directly.
  3. Cost is $0.00 and execution runs 100% on local GPU.`;

  return (
    <div className="docs-page">
      <div className="docs-shell" style={{ maxWidth: 880 }}>
        {/* Navigation */}
        <header className="docs-header">
          <Link href={href('/')} className="docs-brand" aria-label="Brimkern">
            <BrandMark size={24} />
            <span>Brimkern</span>
            <span className="docs-brand-badge">agents & mcp</span>
          </Link>
          <div className="docs-header-actions">
            <Link href={href('/cli')} className="docs-header-link">CLI</Link>
            <Link href={href('/docs')} className="docs-header-link">{t('Docs', 'Doc')}</Link>
            <Link href={href('/local-ai')} className="docs-header-link">SDK</Link>
            <Link href={href('/chat')} className="docs-header-link">{t('Chat', 'Chat')}</Link>
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
              className="docs-header-lang"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </header>

        <main style={{ marginTop: 28 }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 999, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', marginBottom: 16 }}>
            <Bot size={13} style={{ color: '#f87171' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('Sub-agent Delegation · MCP Server', 'Délégation Sous-agents · Serveur MCP')}
            </span>
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 4.5vw, 44px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px', color: '#fbfaf7' }}>
            {t(
              'Offload small coding tasks to local GPU. Save your API tokens.',
              'Déléguez les tâches courantes à votre GPU local. Économisez vos tokens d’API.'
            )}
          </h1>

          <p style={{ color: '#dcd8cf', fontSize: 17, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 760 }}>
            {t(
              'Let your primary cloud agent (Claude Code, Cursor, Windsurf, Antigravity) orchestrate architecture and high-level reasoning, while spawning lightweight Brimkern sub-agents on your local machine to test code, check syntax, summarize diffs, and draft commit messages. 100% free, private, and running entirely on your GPU.',
              'Laissez votre agent principal (Claude Code, Cursor, Windsurf, Antigravity) concevoir l’architecture et le raisonnement de haut niveau, et déléguez l’exécution des tâches basiques (linting, tests, relecture de diffs, messages de commit) à des sous-agents Brimkern en local. 100 % gratuit, privé, et exécuté sur votre carte graphique.'
            )}
          </p>

          {/* Key Value Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, margin: '0 0 44px' }}>
            <div className="card" style={{ padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Zap size={18} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{t('Zero Token Cost', 'Zéro Coût de Token')}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                {t('Every token generated by Brimkern runs on your hardware. Eliminate repetitive costs on trivial checks.', 'Chaque token généré par Brimkern tourne sur votre matériel. Fini de payer pour des vérifications basiques.')}
              </p>
            </div>

            <div className="card" style={{ padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Terminal size={18} style={{ color: 'var(--cyan)' }} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{t('Native Stdio MCP', 'Serveur MCP Stdio')}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                {t('Built-in JSON-RPC 2.0 stdio server ready for Claude Desktop, Cursor, Antigravity, and custom agent loops.', 'Serveur JSON-RPC 2.0 stdio intégré, prêt pour Claude Desktop, Cursor, Antigravity et scripts agents.')}
              </p>
            </div>

            <div className="card" style={{ padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <ShieldCheck size={18} style={{ color: 'var(--green)' }} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{t('Offline & Private', 'Privé & Hors-ligne')}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                {t('Source code and proprietary logs never transit through external APIs. Perfect for sensitive codebases.', 'Votre code source et vos logs ne transitent jamais sur des APIs tierces. Confidentialité totale.')}
              </p>
            </div>
          </div>

          {/* Section 1: MCP Server */}
          <section style={{ margin: '48px 0', borderTop: '1px solid var(--border-color)', paddingTop: 32 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              01 · {t('Model Context Protocol', 'Protocole MCP')}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, margin: '8px 0 12px', color: 'var(--text-primary)' }}>
              {t('Plug Brimkern as an MCP Tool Server', 'Connectez Brimkern comme serveur d’outils MCP')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 16px' }}>
              {t(
                'Launch the stdio MCP server with a single command. It exposes local WebGPU inference tools directly to Claude Desktop, Cursor, or any agent compliant with the Model Context Protocol.',
                'Démarrez le serveur stdio MCP en une commande. Il expose des outils d’inférence WebGPU locale directement à Claude Desktop, Cursor ou tout agent compatible MCP.'
              )}
            </p>

            <CodeSnippet code="brimkern mcp --model=coder" />

            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '14px 0 8px', fontWeight: 600 }}>
              {t('Add to your Claude Desktop or Cursor MCP config (claude_desktop_config.json):', 'Ajoutez à votre configuration MCP Claude Desktop ou Cursor (claude_desktop_config.json) :')}
            </p>
            <CodeSnippet code={mcpConfigJson} lang="json" />

            <div style={{ background: 'var(--bg-code)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '14px 18px', marginTop: 14 }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{t('Exposed MCP Tools:', 'Outils MCP exposés :')}</p>
              <ul style={{ margin: '8px 0 0', paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
                <li><code>brimkern_generate</code> : {t('Fast on-device text generation with custom system prompt', 'Génération de texte rapide sur GPU avec prompt système')}</li>
                <li><code>brimkern_code_review</code> : {t('Local static & logic review of code snippets or git diffs', 'Relecture logique et statique en local de snippets ou diffs git')}</li>
                <li><code>brimkern_explain</code> : {t('Detailed technical explanation of code files or algorithms', 'Explication technique détaillée de fichiers de code ou d’algorithmes')}</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Structured JSON & CLI Pipes */}
          <section style={{ margin: '48px 0', borderTop: '1px solid var(--border-color)', paddingTop: 32 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              02 · {t('Automated Workflows & Sub-agents', 'Pipelines & Sous-agents')}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, margin: '8px 0 12px', color: 'var(--text-primary)' }}>
              {t('Structured JSON Output via --json', 'Sortie structurée JSON via --json')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 16px' }}>
              {t(
                'When called from a script or an agent workflow, pass `--json` (or `-q` / `--quiet`) to retrieve machine-readable payloads with token counts, throughput (tok/s), execution latency, and clean output.',
                'Appelé depuis un script ou un agent, passez le flag `--json` (ou `-q` / `--quiet`) pour obtenir une charge utile exploitable en JSON avec le nombre de tokens, le débit (tok/s), la latence et le texte brut.'
              )}
            </p>

            <CodeSnippet code={jsonExampleCmd} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '14px 0 8px', fontWeight: 600 }}>
              {t('Machine-readable JSON payload:', 'Résultat JSON exploitable :')}
            </p>
            <CodeSnippet code={jsonExampleOutput} lang="json" />
          </section>

          {/* Section 3: Agent Skill definition */}
          <section style={{ margin: '48px 0', borderTop: '1px solid var(--border-color)', paddingTop: 32 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              03 · {t('Claude Code & Cursor Skill', 'Skill Claude Code & Cursor')}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, margin: '8px 0 12px', color: 'var(--text-primary)' }}>
              {t('Drop-in Skill for AI Coding Assistants', 'Skill prêt à l’emploi pour assistants de code')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 16px' }}>
              {t(
                'Save your team thousands of tokens by teaching your AI assistants to automatically delegate mechanical edits, diff checks, and commit summaries to Brimkern.',
                'Épargnez des milliers de tokens à votre équipe en enseignant à vos assistants IA de déléguer les modifications mécaniques, les relectures de diffs et les résumés à Brimkern.'
              )}
            </p>

            <CodeSnippet code={skillPromptExample} lang="yaml" />

            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <Link href={href('/docs/cli')} className="btn btn-primary" style={{ padding: '10px 18px', textDecoration: 'none' }}>
                <Terminal size={15} /> {t('Read CLI documentation', 'Consulter la documentation CLI')}
              </Link>
              <Link href={href('/chat')} className="btn btn-secondary" style={{ padding: '10px 18px', textDecoration: 'none' }}>
                {t('Test in Browser Chat', 'Tester le Chat Web')} <ArrowRight size={14} />
              </Link>
            </div>
          </section>

          <ByLine />
        </main>
      </div>
    </div>
  );
}
