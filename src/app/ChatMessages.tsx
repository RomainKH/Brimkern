"use client";

// The scrolling list of chat bubbles: avatar, copy button, rendered markdown content (or the typing
// dots while the first token streams), and per-message timing stats. Pure UI — messages and the copy
// state come from the page. The trailing ref is the scroll anchor the page scrolls into view.

import { memo, type RefObject } from 'react';
import { User, Bot, Copy, Cpu, Zap } from 'lucide-react';
import { renderMessageContent } from './ChatMarkdown';
import { useT } from '@/lib/i18n';
import type { Message } from './types';

type ModelState = 'idle' | 'initializing' | 'loading' | 'ready' | 'generating' | 'error';

interface Props {
  messages: Message[];
  modelState: ModelState;
  copiedIndex: number | null;
  copyToClipboard: (text: string, index: number) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  // Image lazy-load: a persisted image bubble shows only its blurred thumb; click regenerates the full
  // PNG from prompt+seed. canReveal = an image model is loaded (otherwise reveal can't run).
  onRevealImage?: (id: string, prompt?: string, seed?: number) => void;
  canReveal?: boolean;
  // « Affiner » : reprend le prompt ET la seed d'une image générée dans le composer — préciser le
  // texte en gardant la même composition (même bruit initial). Absent → bouton masqué.
  onRefineImage?: (prompt: string, seed: number, url?: string) => void;
  // Réponse coupée au plafond de tokens : bouton « Continuer ». Absent → la note s'affiche sans bouton.
  onContinue?: () => void;
  // Vrai quand la génération tourne : on masque le bouton pendant ce temps.
  busy?: boolean;
  // Affiche le bloc de raisonnement des modèles qui en émettent (réglage, faux par défaut).
  showReasoning?: boolean;
}

interface ItemProps {
  msg: Message;
  index: number;
  copied: boolean;
  showTyping: boolean;
  canReveal?: boolean;
  copyToClipboard: (text: string, index: number) => void;
  onRevealImage?: (id: string, prompt?: string, seed?: number) => void;
  onRefineImage?: (prompt: string, seed: number, url?: string) => void;
  onContinue?: () => void;
  busy?: boolean;
  showReasoning?: boolean;
}

// One bubble, MEMOIZED on the message object's identity: during streaming, setMessages only creates
// a new object for the message being generated — every other bubble keeps its reference, so at 8 Hz
// only ONE bubble re-renders/re-parses its markdown instead of the whole list (the mobile jank).
// Function props are deliberately excluded from the comparison (recreated per parent render but
// semantically stable).
const MessageItem = memo(function MessageItem({ msg, index, copied, showTyping, canReveal, copyToClipboard, onRevealImage, onRefineImage, onContinue, busy, showReasoning }: ItemProps) {
  // Locale comes from context, which bypasses the memo comparison — a language switch still re-renders.
  const t = useT();
  return (
    <div className={`message ${msg.role}`}>
      <div className="avatar">
        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className="message-col">
        <div className="message-bubble">
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            gap: '4px',
            opacity: 0.8
          }} className="message-actions">
            <button
              className="circle-btn"
              style={{ width: '24px', height: '24px', padding: 0 }}
              onClick={() => copyToClipboard(msg.content, index)}
              title={t('Copy message', 'Copier le message')}
            >
              {copied ? (
                <span style={{ color: 'var(--success)', fontSize: '10px' }}>{t('Copied!', 'Copié !')}</span>
              ) : <Copy size={12} />}
            </button>
          </div>

          <div className="message-text">
            {msg.image
              ? (msg.image.url
                // Full image available (just generated or revealed). Canvas data URL → no next/image.
                // eslint-disable-next-line @next/next/no-img-element
                ? <img
                    src={msg.image.url}
                    alt={t('generated image', 'image générée')}
                    width={msg.image.w}
                    height={msg.image.h}
                    // Largeur en vw : déterministe sur petit écran — la chaîne fit-content/max-width
                    // des bulles laissait la largeur fixe (384px) déborder à droite sur mobile.
                    style={{ width: `min(${Math.min(384, msg.image.w * 2)}px, 72vw)`, maxWidth: '100%', height: 'auto', borderRadius: 8, imageRendering: msg.image.w < 256 ? 'pixelated' : 'auto', display: 'block' }}
                  />
                // Only the blurred thumb is stored → click regenerates the full image (WhatsApp-style).
                : <button
                    type="button"
                    onClick={() => onRevealImage?.(msg.id, msg.image!.prompt, msg.image!.seed)}
                    disabled={msg.image.revealing || !canReveal}
                    title={canReveal ? t('Click to reveal (regenerates the image)', 'Cliquer pour révéler (régénère l’image)') : t('Load the image model to reveal', 'Charge le modèle image pour révéler')}
                    style={{ position: 'relative', padding: 0, border: 'none', borderRadius: 8, overflow: 'hidden', cursor: canReveal ? 'pointer' : 'not-allowed', width: `min(${Math.min(384, msg.image.w * 2)}px, 72vw)`, maxWidth: '100%', display: 'block', background: 'none' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={msg.image.thumb} alt={t('blurred preview', 'aperçu flouté')} style={{ width: '100%', height: 'auto', display: 'block', filter: 'blur(12px)', transform: 'scale(1.1)' }} />
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.7)', background: 'rgba(0,0,0,0.15)' }}>
                      {msg.image.revealing ? t('Regenerating…', 'Régénération…') : canReveal ? t('↻ Click to reveal', '↻ Cliquer pour révéler') : t('Load the image model', 'Charge le modèle image')}
                    </span>
                  </button>)
              : msg.content
              ? renderMessageContent(msg.content, showReasoning)
              : null}
            {/* « Affiner » : reprend prompt + seed dans le composer — préciser le texte en gardant
                la même composition (même bruit initial). Visible sous toute image générée. */}
            {msg.image && onRefineImage && (
              <button
                type="button"
                onClick={() => onRefineImage(msg.image!.prompt ?? '', msg.image!.seed ?? 0, msg.image!.url)}
                style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid var(--border-color)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                ✎ {t('Refine this image', 'Affiner cette image')}
              </button>
            )}
            {!msg.image && !msg.content && showTyping && (
              // Waiting on the first token → typing dots INSIDE this bubble (only the LAST message,
              // the one being generated — see the parent's showTyping condition).
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
          </div>
        </div>

        {/* Réponse coupée au PLAFOND de tokens (et non sur une fin de phrase du modèle) : on le dit
            et on propose de reprendre. Avant, le texte s'arrêtait au milieu d'une phrase sans aucune
            explication — l'utilisateur en concluait que la génération avait planté. */}
        {msg.truncated && msg.role === 'assistant' && !showTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <span>{t('Reply cut off at the token budget.', 'Réponse coupée au budget de tokens.')}</span>
            {onContinue && (
              <button className="btn" style={{ fontSize: 11, padding: '3px 9px' }} onClick={onContinue} disabled={busy}>
                {t('Continue', 'Continuer')}
              </button>
            )}
          </div>
        )}

        {/* Timing statistics */}
        {msg.timings && msg.role === 'assistant' && (
          <div className="message-stats">
            <span className="stat-item">
              <Cpu size={12} /> {t('Prompt:', 'Prompt :')} {msg.timings.prompt_speed_ts.toFixed(1)} t/s ({msg.timings.prompt_tokens} t {t('in', 'en')} {msg.timings.prompt_time_ms.toFixed(0)}ms)
            </span>
            {msg.timings.decode_speed_ts > 0 && (
              <span className="stat-item">
                <Zap size={12} /> {t('Generation:', 'Génération :')} {msg.timings.decode_speed_ts.toFixed(1)} t/s ({msg.timings.decode_tokens} t)
              </span>
            )}
            <span className="stat-item">
              {t('Total:', 'Total :')} {(msg.timings.total_time_ms / 1000).toFixed(2)}s
            </span>
            {msg.timings.info && (
              // Ce qui a réellement tourné (précision · KV · sampling · préfixe) — diagnostic terrain.
              <span className="stat-item" style={{ fontFamily: 'var(--font-mono)', opacity: 0.85 }}>
                {msg.timings.info}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}, (a, b) =>
  a.msg === b.msg && a.copied === b.copied && a.showTyping === b.showTyping &&
  a.canReveal === b.canReveal && a.index === b.index
);

export function ChatMessages({ messages, modelState, copiedIndex, copyToClipboard, messagesEndRef, onRevealImage, canReveal, onRefineImage, onContinue, busy, showReasoning }: Props) {
  return (
    <>
      {/* List of messages */}
      {messages.map((msg, index) => (
        <MessageItem
          key={msg.id}
          msg={msg}
          index={index}
          copied={copiedIndex === index}
          showTyping={msg.role === 'assistant' && modelState === 'generating' && index === messages.length - 1}
          canReveal={canReveal}
          copyToClipboard={copyToClipboard}
          onRevealImage={onRevealImage}
          onRefineImage={onRefineImage}
          onContinue={onContinue}
          busy={busy}
          showReasoning={showReasoning}
        />
      ))}

      <div ref={messagesEndRef} />
    </>
  );
}
