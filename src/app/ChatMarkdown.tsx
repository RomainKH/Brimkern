"use client";

// Self-contained chat message renderer: fenced code blocks (with copy), DeepSeek-R1 <think> reasoning
// (collapsible), and lightweight inline markdown (**bold**, *italic*, `code`, bullet lists, headings).
// No app state — pure presentation, driven only by the message text. Used by the chat message list.

import { useState, type ReactNode } from 'react';
import { CheckCircle, Copy, Brain, ChevronDown } from 'lucide-react';
import { useT } from '@/lib/i18n';

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ position: 'relative', marginTop: '14px', marginBottom: '12px' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, transform: 'translateY(-50%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px'
      }}>
        <span style={{
          background: language ? 'var(--accent)' : 'var(--text-muted)', color: 'white',
          padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold',
          textTransform: 'uppercase', fontFamily: 'var(--font-mono)'
        }}>
          {language || 'code'}
        </span>
        <button
          onClick={copyCode}
          title="Copier le code"
          style={{
            display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '4px', padding: '2px 8px', fontSize: '11px',
            color: copied ? 'var(--success)' : 'var(--text-secondary)'
          }}
        >
          {copied ? <><CheckCircle size={12} /> Copié</> : <><Copy size={12} /> Copier</>}
        </button>
      </div>
      <pre style={{ margin: 0 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// DeepSeek-R1 reasoning: the <think>…</think> block, shown as a collapsible dimmed box (default
// collapsed) so the actual answer stays readable. Still streams live.
// `interrupted` : la génération s'est POSÉE sans jamais refermer le <think> (stop token en pleine
// réflexion, garde-fou anti-boucle, plafond…) — on l'affiche comme un raisonnement interrompu.
function ReasoningBlock({ text, streaming, interrupted = false }: { text: string; streaming: boolean; interrupted?: boolean }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, margin: '2px 0 10px', background: 'var(--bg-sidebar)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
      >
        <Brain size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left' }}>
          {streaming ? t('Thinking…', 'Réflexion en cours…')
            : interrupted ? t('Reasoning (interrupted)', 'Raisonnement (interrompu)')
            : t('Reasoning', 'Raisonnement')}
        </span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ padding: '0 12px 12px', fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          {text.trim()}
        </div>
      )}
    </div>
  );
}

// Ferme proprement les balises inline laissées ouvertes en bout de flux (streaming / coupure)
function completeUnclosedMarkdown(s: string): string {
  let res = s;
  const backtickCount = (res.match(/`/g) || []).length;
  if (backtickCount % 2 !== 0) res += '`';
  const doubleStarCount = (res.match(/\*\*/g) || []).length;
  if (doubleStarCount % 2 !== 0) res += '**';
  return res;
}

// Inline markdown within a line: links [title](url), **bold**, *italic*, `code`.
function renderInline(rawText: string, keyBase: string) {
  const text = completeUnclosedMarkdown(rawText);
  const out: ReactNode[] = [];
  const re = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*[\s\S]+?\*\*|`[^`]+?`|\*[^*\s][\s\S]*?\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith('[')) {
      const linkLabel = m[2];
      const linkUrl = m[3];
      out.push(
        <a
          key={`${keyBase}-${k++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '2px', wordBreak: 'break-all' }}
        >
          {linkLabel}
        </a>
      );
    } else if (token.startsWith('**')) {
      out.push(<strong key={`${keyBase}-${k++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      out.push(<code key={`${keyBase}-${k++}`}>{token.slice(1, -1)}</code>);
    } else {
      out.push(<em key={`${keyBase}-${k++}`}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// A non-code markdown segment: handles line breaks, lists (bullet `- ` and numbered `1. `),
// horizontal rules (`---`), quotes (`> `), and `#` headings, with inline formatting per line.
function renderRichText(text: string, keyBase: string) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let bullets: ReactNode[] = [];
  let numItems: { num: string; content: string }[] = [];

  const flush = () => {
    if (bullets.length) {
      blocks.push(<ul key={`${keyBase}-ul-${blocks.length}`} style={{ margin: '4px 0', paddingLeft: '22px' }}>{bullets}</ul>);
      bullets = [];
    }
    if (numItems.length) {
      blocks.push(
        <ol key={`${keyBase}-ol-${blocks.length}`} style={{ margin: '4px 0', paddingLeft: '22px' }}>
          {numItems.map((item, idx) => (
            <li key={`${keyBase}-oli-${idx}`} value={parseInt(item.num, 10) || undefined} style={{ margin: '2px 0', lineHeight: 1.55 }}>
              {renderInline(item.content, `${keyBase}-ol-${idx}`)}
            </li>
          ))}
        </ol>
      );
      numItems = [];
    }
  };

  lines.forEach((line, i) => {
    // Séparateur horizontal (--- ou *** ou ___)
    if (/^\s*([-*_]\s*){3,}$/.test(line)) {
      flush();
      blocks.push(<hr key={`${keyBase}-hr-${i}`} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />);
      return;
    }

    // Liste à puces (- ou *)
    const bullet = line.match(/^\s*[-*]\s+(.*)/);
    if (bullet) {
      if (numItems.length) flush();
      bullets.push(<li key={`${keyBase}-li-${i}`} style={{ margin: '2px 0', lineHeight: 1.55 }}>{renderInline(bullet[1], `${keyBase}-${i}`)}</li>);
      return;
    }

    // Liste ordonnée (1. ou 2.)
    const numList = line.match(/^\s*(\d+)\.\s+(.*)/);
    if (numList) {
      if (bullets.length) flush();
      numItems.push({ num: numList[1], content: numList[2] });
      return;
    }

    flush();

    // Titres #, ##, ###
    const heading = line.match(/^(#{1,4})\s+(.*)/);
    if (heading) {
      blocks.push(<div key={`${keyBase}-h-${i}`} style={{ fontWeight: 700, fontSize: heading[1].length <= 2 ? '16px' : '14px', margin: '10px 0 4px' }}>{renderInline(heading[2], `${keyBase}-${i}`)}</div>);
      return;
    }

    // Citation >
    const quote = line.match(/^\s*>\s*(.*)/);
    if (quote) {
      blocks.push(
        <blockquote key={`${keyBase}-q-${i}`} style={{ borderLeft: '3px solid var(--accent)', margin: '6px 0', paddingLeft: '10px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          {renderInline(quote[1], `${keyBase}-${i}`)}
        </blockquote>
      );
      return;
    }

    // Ligne vide
    if (line.trim() === '') {
      blocks.push(<div key={`${keyBase}-sp-${i}`} style={{ height: '6px' }} />);
      return;
    }

    blocks.push(<div key={`${keyBase}-p-${i}`} style={{ lineHeight: 1.6 }}>{renderInline(line, `${keyBase}-${i}`)}</div>);
  });

  flush();
  return blocks;
}

// Render markdown segments (fenced code blocks + rich text).
function renderBlocks(t: string, keyPrefix: string) {
  const parts = t.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : '';
      const code = match ? match[2] : part.slice(3, -3);
      return <CodeBlock key={`${keyPrefix}-${index}`} code={code.trim()} language={language} />;
    }
    return <div key={`${keyPrefix}-${index}`} style={{ margin: '0 0 4px 0' }}>{renderRichText(part, `${keyPrefix}${index}`)}</div>;
  });
}

// Ligne minimale « Réflexion… » pendant que le modèle est encore dans son <think> (raisonnement
// masqué) : sinon la bulle reste vide de longues secondes et l'interface paraît figée.
function ThinkingLine() {
  const t = useT();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)', fontSize: 13, margin: '2px 0 6px' }}>
      <Brain size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
      <span>{t('Thinking…', 'Réflexion…')}</span>
    </div>
  );
}

// Full message body: splits out a DeepSeek-R1 <think>…</think> block from the answer.
// `showReasoning` (false par défaut, réglage « Afficher le raisonnement ») : sans lui, le
// raisonnement n'est plus affiché du tout — sur un modèle de raisonnement il occupait le haut de
// chaque réponse alors que ce qui intéresse, c'est la réponse.
// `settled` : la génération de CE message est TERMINÉE. Un <think> jamais refermé sur un message
// posé (stop token émis en pleine réflexion, garde-fou anti-boucle, plafond) laissait la ligne
// « Réflexion… » affichée POUR TOUJOURS — l'utilisateur voyait une réponse figée sans aucune issue
// (constaté le 2026-08-14, « gros bug général »). Désormais : le raisonnement interrompu s'affiche
// en bloc repliable, même quand le réglage le masque — c'est la SEULE trace de ce que le modèle a
// produit, et le message est par ailleurs marqué « coupé » par l'appelant (note + Continuer).
export function renderMessageContent(text: string, showReasoning = false, settled = false): ReactNode {
  if (!text) return null;
  const open = text.indexOf('<think>');
  if (open !== -1) {
    const before = text.slice(0, open);
    const after = text.slice(open + 7);
    const close = after.indexOf('</think>');
    const thinking = close === -1 ? after : after.slice(0, close);
    const answer = close === -1 ? '' : after.slice(close + 8);
    const unclosedSettled = close === -1 && settled;
    return (
      <>
        {/* `.trim()` sur ce qu'on REND, pas seulement sur ce qu'on teste : le texte qui suit
            </think> commence par « \n\n » (les templates de raisonnement en écrivent deux), et
            renderRichText fabrique un <div height:6px> par ligne vide — deux cales de 6 px
            poussaient donc la réponse vers le bas quand le raisonnement est masqué. */}
        {before.trim() && renderBlocks(before.trim(), 'pre')}
        {showReasoning || unclosedSettled ? (
          <ReasoningBlock text={thinking} streaming={close === -1 && !settled} interrupted={unclosedSettled} />
        ) : close === -1 ? (
          <ThinkingLine />
        ) : null}
        {answer.trim() && renderBlocks(answer.trim(), 'ans')}
      </>
    );
  }
  return renderBlocks(text, 'm');
}
