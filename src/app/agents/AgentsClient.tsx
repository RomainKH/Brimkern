"use client";

// Agents IA & MCP (/agents) — page de DOCUMENTATION : elle vit dans DocsShell (menu latéral, « Sur
// cette page »), avec la direction artistique de /docs/cli (écrans de terminal, sections
// numérotées). Hors de la coquille, la page perdait le menu de la doc et n'y était plus atteignable.
//
// Tout ce qui ressemble à une sortie est une VRAIE sortie : l'échange MCP est capturé depuis
// `brimkern mcp` (initialize, tools/list, brimkern_stats), le JSON depuis `brimkern --json`
// (coder, Dawn Metal). Aucun chiffre sans mesure (règle 4 du dépôt).

import Link from 'next/link';
import { Terminal, ArrowRight } from 'lucide-react';
import { useT, useHref } from '@/lib/i18n';
import DocsShell, { Code, P } from '../docs/DocsShell';
import s from '../cli/cli.module.css';

function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={s.screen}>
      <div className={s.bar}>
        <span><span className={s.barDot} aria-hidden="true" />{title}</span>
      </div>
      {/* tabIndex : sur téléphone le contenu défile horizontalement (axe scrollable-region-focusable). */}
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

// Une ligne d'outil MCP : nom, paramètres, rôle.
function Tool({ name, args, children }: { name: string; args: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '11px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</code>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{args}</span>
      </div>
      <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{children}</span>
    </div>
  );
}

export default function AgentsClient() {
  const t = useT();
  const href = useHref();

  const toc = [
    { id: 'how', label: t('How delegation works', 'Comment la délégation marche') },
    { id: 'mcp', label: t('MCP server', 'Serveur MCP') },
    { id: 'tools', label: t('The four tools', 'Les quatre outils') },
    { id: 'skill', label: t('The skill', 'Le skill') },
    { id: 'scripts', label: t('Scripts & JSON', 'Scripts & JSON') },
    { id: 'limits', label: t('Limits', 'Limites') },
  ];

  const mcpConfigJson = `{
  "mcpServers": {
    "brimkern": {
      "command": "brimkern",
      "args": ["mcp", "--model=coder"]
    }
  }
}`;

  const jsonOutput = `{
  "ok": true,
  "content": "The conventional commit title for the provided diff could be:\\n\\n\`feat(auth): add passkey registration support\`\\n\\n…",
  "tokens": 48,
  "elapsedMs": 4735,
  "tokPerSec": 10.1,
  "model": "Qwen 3 4B (BRIK int4)",
  "backend": "Dawn (Metal)",
  "savedUsd": 0.00158
}`;

  return (
    <DocsShell toc={toc}>
      {/* ── EN-TÊTE ─────────────────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 12 }}>
        <p className={s.eyebrow}>$ claude mcp add brimkern -- brimkern mcp</p>
        <h1 className={s.h1}>
          {t('A local GPU worker for your coding agent', 'Un worker GPU local pour votre agent de code')}
        </h1>
        <p className={s.lede}>
          {t(
            'Your main agent (Claude Code, Cursor, Windsurf…) keeps the design and the decisions. The mechanical sub-tasks, a first-pass review, a test draft, a commit title, go to a model running on your own GPU through MCP, the CLI or a skill. Nothing leaves the machine and nothing is billed.',
            'Votre agent principal (Claude Code, Cursor, Windsurf…) garde la conception et les décisions. Les sous-tâches mécaniques, une première relecture, un brouillon de tests, un titre de commit, partent vers un modèle qui tourne sur votre propre GPU, par MCP, par la CLI ou par un skill. Rien ne quitte la machine, rien n’est facturé.'
          )}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#mcp" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
            <Terminal size={14} /> {t('Connect the MCP server', 'Brancher le serveur MCP')}
          </a>
          <Link href={href('/docs/cli')} className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '8px 16px' }}>
            {t('Install the CLI first', 'Installer d’abord la CLI')} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────────────────────────────────────── */}
      <H2 id="how" n="01">{t('How delegation works', 'Comment la délégation marche')}</H2>
      <P>
        {t(
          'The agent sees Brimkern as a set of tools. When it decides a sub-task is routine, it calls one; the MCP server runs the model on the GPU and returns plain text, which the agent reads, checks and uses.',
          'L’agent voit Brimkern comme une liste d’outils. Quand il juge une sous-tâche routinière, il en appelle un ; le serveur MCP fait tourner le modèle sur le GPU et rend du texte, que l’agent lit, vérifie et utilise.'
        )}
      </P>
      <Screen title={t('delegation', 'délégation')}>
        <pre className={s.pre}>
          <span className={s.bold}>Claude Code</span>{t('  (cloud: plans, decides, edits)', '  (cloud : planifie, décide, édite)')}{'\n'}
          <span className={s.dim}>{'   │'}</span>{'\n'}
          <span className={s.dim}>{'   │ '}</span><span className={s.cyan}>tools/call</span> <span className={s.sand}>brimkern_review</span> <span className={s.dim}>{'{ code, file_path }'}</span>{'\n'}
          <span className={s.dim}>{'   ▼'}</span>{'\n'}
          <span className={s.boldRed}>brimkern mcp</span>{'  (stdio, JSON-RPC 2.0)'}{'\n'}
          <span className={s.dim}>{'   │ '}</span>{t('model loaded once, calls queued one at a time', 'modèle chargé une fois, appels en file un par un')}{'\n'}
          <span className={s.dim}>{'   ▼'}</span>{'\n'}
          <span className={s.green}>{t('your GPU', 'votre GPU')}</span>{t('  (WebGPU, hand-written WGSL kernels)', '  (WebGPU, kernels WGSL écrits à la main)')}{'\n'}
          <span className={s.dim}>{'   │'}</span>{'\n'}
          <span className={s.dim}>{'   └─▶ '}</span>{t('text back to the agent, which checks it', 'texte rendu à l’agent, qui le vérifie')}
        </pre>
      </Screen>
      <div className={s.points} style={{ marginTop: 18 }}>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Good fits', 'Ce qui s’y prête')}</p>
          <p className={s.pointText}>{t('First-pass reviews, unit-test drafts, commit titles, regexes, renames and other mechanical rewrites.', 'Premières relectures, brouillons de tests, titres de commit, regex, renommages et autres réécritures mécaniques.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Keep on the main agent', 'À garder sur l’agent principal')}</p>
          <p className={s.pointText}>{t('Architecture, security-critical code, anything that needs the whole repository in context. A 4B model helps; it does not decide.', 'L’architecture, le code critique pour la sécurité, tout ce qui demande le dépôt entier en contexte. Un modèle de 4B aide ; il ne tranche pas.')}</p>
        </div>
      </div>

      {/* ── SERVEUR MCP ─────────────────────────────────────────────────────────────────── */}
      <H2 id="mcp" n="02">{t('MCP server', 'Serveur MCP')}</H2>
      <P>{t('With the CLI installed, one command registers it in Claude Code:', 'La CLI installée, une commande l’enregistre dans Claude Code :')}</P>
      <Code lang="sh">{'claude mcp add brimkern -- brimkern mcp --model=coder'}</Code>
      <P>{t('For Claude Desktop, Cursor and other clients, the same server in their JSON config:', 'Pour Claude Desktop, Cursor et les autres clients, le même serveur dans leur config JSON :')}</P>
      <Code lang="js">{mcpConfigJson}</Code>
      <P>
        {t(
          'Below, a real exchange with the server: the handshake, the tool list, and a stats call (which does not load the model, so it answers instantly).',
          'Ci-dessous, un vrai échange avec le serveur : la poignée de main, la liste des outils, puis un appel de statistiques (qui ne charge pas le modèle, d’où la réponse immédiate).'
        )}
      </P>
      <Screen title="brimkern mcp · stdio">
        <pre className={`${s.pre} ${s.wrap}`}>
          <span className={s.dim}>→ </span><span className={s.cyan}>initialize</span> <span className={s.dim}>{'{ protocolVersion: "2025-06-18" }'}</span>{'\n'}
          <span className={s.dim}>← </span>{'{ "protocolVersion": "2025-06-18", "capabilities": { "tools": {} },'}{'\n'}
          {'    "serverInfo": { "name": "brimkern", "version": "0.1.0" } }'}{'\n\n'}
          <span className={s.dim}>→ </span><span className={s.cyan}>tools/list</span>{'\n'}
          <span className={s.dim}>← </span><span className={s.sand}>brimkern_ask</span>{' · '}<span className={s.sand}>brimkern_review</span>{' · '}<span className={s.sand}>brimkern_generate_tests</span>{' · '}<span className={s.sand}>brimkern_stats</span>{'\n\n'}
          <span className={s.dim}>→ </span><span className={s.cyan}>tools/call</span> <span className={s.sand}>brimkern_stats</span>{'\n'}
          <span className={s.dim}>← </span>{'{ "model": "Qwen 3 4B (BRIK int4)", "loaded": false, "callsServed": 0,'}{'\n'}
          {'    "totalTokensServed": 0, "estimatedSavingsUsd": 0 }'}
        </pre>
      </Screen>
      <p className={s.caption}>{t('Captured on 2026-09-24 from brimkern mcp; the tool list is shown by name only.', 'Capturé le 24/09/2026 depuis brimkern mcp ; la liste des outils n’est montrée que par leurs noms.')}</p>

      {/* ── LES OUTILS ──────────────────────────────────────────────────────────────────── */}
      <H2 id="tools" n="03">{t('The four tools', 'Les quatre outils')}</H2>
      <P>{t('Each call is independent: no memory of the previous ones, so a review never sees an earlier question.', 'Chaque appel est indépendant : aucune mémoire des précédents, une revue ne voit donc jamais une question antérieure.')}</P>
      <div style={{ margin: '4px 0 8px' }}>
        <Tool name="brimkern_ask" args="prompt, model?, mode?, max_tokens?">
          {t('Free-form query. mode = code (default), plan, review or auto; max_tokens up to 2048.', 'Requête libre. mode = code (défaut), plan, review ou auto ; max_tokens jusqu’à 2048.')}
        </Tool>
        <Tool name="brimkern_review" args="code, file_path?, max_tokens?">
          {t('Review of a snippet or file: bugs, edge cases, error handling, security, performance.', 'Relecture d’un extrait ou d’un fichier : bugs, cas limites, gestion d’erreurs, sécurité, performance.')}
        </Tool>
        <Tool name="brimkern_generate_tests" args="code, test_framework?, max_tokens?">
          {t('Unit-test draft in the framework of your choice (vitest by default).', 'Brouillon de tests unitaires dans le framework choisi (vitest par défaut).')}
        </Tool>
        <Tool name="brimkern_stats" args="—">
          {t('Active model, calls and tokens served, estimated savings. Does not load a model.', 'Modèle actif, appels et tokens servis, économies estimées. Ne charge pas de modèle.')}
        </Tool>
      </div>
      <P>{t('Reasoning blocks (<think>…</think>) are stripped from every answer: the agent only receives the result.', 'Les blocs de réflexion (<think>…</think>) sont retirés de chaque réponse : l’agent ne reçoit que le résultat.')}</P>

      {/* ── LE SKILL ────────────────────────────────────────────────────────────────────── */}
      <H2 id="skill" n="04">{t('The skill', 'Le skill')}</H2>
      <P>
        {t(
          'A skill is a Markdown file that tells Claude Code when to hand work to Brimkern and how (which commands, which flags). It ships with the CLI; copy it into a project to enable it there.',
          'Un skill est un fichier Markdown qui dit à Claude Code quand confier du travail à Brimkern et comment (quelles commandes, quelles options). Il est livré avec la CLI ; copiez-le dans un projet pour l’y activer.'
        )}
      </P>
      <Code lang="sh">{'mkdir -p .claude/skills\ncp -r ~/.brimkern/skills/brimkern-worker .claude/skills/'}</Code>
      <Screen title=".claude/skills/brimkern-worker/SKILL.md">
        <pre className={`${s.pre} ${s.wrap}`}>
          <span className={s.dim}>---</span>{'\n'}
          <span className={s.sand}>name</span>: brimkern-worker{'\n'}
          <span className={s.sand}>description</span>: Offload routine sub-tasks (exploratory tests, syntax transformations, code reviews, repetitive drafting) to local WebGPU Brimkern workers…{'\n'}
          <span className={s.dim}>---</span>{'\n\n'}
          <span className={s.bold}># Brimkern Worker</span>{'\n'}
          <span className={s.dim}>…</span>{'\n'}
          {'brimkern -q '}<span className={s.green}>{'"…"'}</span>{'          '}<span className={s.dim}># {t('answer only, for scripts', 'réponse seule, pour les scripts')}</span>{'\n'}
          {'brimkern --json '}<span className={s.green}>{'"…"'}</span>{'      '}<span className={s.dim}># {t('structured payload', 'charge utile structurée')}</span>{'\n'}
          {'claude mcp add brimkern -- brimkern mcp'}
        </pre>
      </Screen>

      {/* ── SCRIPTS & JSON ──────────────────────────────────────────────────────────────── */}
      <H2 id="scripts" n="05">{t('Scripts & JSON', 'Scripts & JSON')}</H2>
      <P>
        {t(
          'Without MCP, any agent that can run a shell command can delegate: -q prints the answer alone, --json a structured payload with the token count, speed and duration.',
          'Sans MCP, tout agent capable de lancer une commande shell peut déléguer : -q imprime la réponse seule, --json une charge utile structurée avec le nombre de tokens, la vitesse et la durée.'
        )}
      </P>
      <Code lang="sh">{'git diff | brimkern --json "Draft a conventional commit title"'}</Code>
      <Screen title="brimkern --json">
        <pre className={`${s.pre} ${s.wrap}`}>{jsonOutput}</pre>
      </Screen>
      <p className={s.caption}>{t('Real output, coder (Qwen 3 4B), native Dawn on an M-series Mac. savedUsd is an estimate of what a paid API would have charged, not a measurement.', 'Sortie réelle, coder (Qwen 3 4B), Dawn natif sur Mac série M. savedUsd est une estimation de ce qu’une API payante aurait facturé, pas une mesure.')}</p>

      {/* ── LIMITES ─────────────────────────────────────────────────────────────────────── */}
      <H2 id="limits" n="06">{t('Limits', 'Limites')}</H2>
      <div className={s.points}>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('One generation at a time', 'Une génération à la fois')}</p>
          <p className={s.pointText}>{t('Parallel tool calls are queued: the model is loaded once and serves them in turn.', 'Les appels d’outils parallèles sont mis en file : le modèle est chargé une fois et les sert à tour de rôle.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('Memory', 'Mémoire')}</p>
          <p className={s.pointText}>{t('The default model takes about 2.5 GB of GPU memory while the server runs.', 'Le modèle par défaut occupe environ 2,5 Go de mémoire GPU tant que le serveur tourne.')}</p>
        </div>
        <div className={s.point}>
          <p className={s.pointTitle}>{t('First call', 'Premier appel')}</p>
          <p className={s.pointText}>{t('The first call downloads and loads the model; the following ones reuse it.', 'Le premier appel télécharge puis charge le modèle ; les suivants le réutilisent.')}</p>
        </div>
      </div>
    </DocsShell>
  );
}
