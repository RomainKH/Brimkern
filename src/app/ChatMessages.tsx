"use client";

// The scrolling list of chat bubbles: avatar, copy button, rendered markdown content (or the typing
// dots while the first token streams), and per-message timing stats. Pure UI — messages and the copy
// state come from the page. The trailing ref is the scroll anchor the page scrolls into view.

import { memo, useEffect, useState, type RefObject } from 'react';
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

// Durée d'un WebM de MediaRecorder : le lecteur affiche 0:00 (retour Romain sur un clip généré
// dans le chat). Ce n'est pas notre encodage qui est faux, c'est le format : MediaRecorder produit
// un flux « live » dont la longueur n'est PAS écrite dans l'en-tête (elle n'est connue qu'à
// l'arrêt de l'enregistrement, et le fichier n'est jamais réécrit). Le navigateur rend donc
// duration = Infinity, la barre de progression est morte et la durée s'affiche à zéro.
//
// Contournement standard, et le seul qui ne demande pas de réécrire le conteneur : demander une
// position absurde, ce qui force le navigateur à parcourir le fichier jusqu'au bout et à en
// déduire la vraie durée, puis revenir à zéro. `dataset` garde la trace pour ne le faire qu'une
// fois par élément (le ref est rappelé à chaque rendu de la bulle).
function fixWebmDuration(v: HTMLVideoElement | null) {
  if (!v || v.dataset.durationFixed === '1') return;
  v.dataset.durationFixed = '1';
  // ⚠️ Chrome ne rend pas seulement Infinity sur ces fichiers : il rend AUSSI 0 (c'est le cas
  // observé, « 0sec/0sec »). Un test qui ne guette qu'Infinity laisse donc le bug intact — il faut
  // traiter toute durée non finie OU nulle.
  const cassee = () => !Number.isFinite(v.duration) || v.duration <= 0;
  const measure = () => {
    if (!cassee()) return;
    // `loop` ramènerait la lecture au début au lieu de laisser le navigateur atteindre la fin :
    // on le suspend le temps de la mesure, et on le rétablit ensuite.
    const boucle = v.loop;
    v.loop = false;
    const fini = () => {
      v.removeEventListener('timeupdate', fini);
      v.removeEventListener('durationchange', fini);
      v.currentTime = 0;
      v.loop = boucle;
    };
    v.addEventListener('timeupdate', fini);
    v.addEventListener('durationchange', fini);
    v.currentTime = 1e7; // très au-delà d'un clip (~115 jours), sans être une valeur refusée
  };
  if (v.readyState >= 1) measure();
  else v.addEventListener('loadedmetadata', measure, { once: true });
}

function SaveLink({ url, name, label }: { url: string; name: string; label: string }) {
  return (
    <a
      href={url}
      download={name}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, marginRight: 8, background: 'none', border: '1px solid var(--border-color)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--text-secondary)', textDecoration: 'none' }}
    >
      ↓ {label}
    </a>
  );
}

// L'ATTENTE, RENDUE LISIBLE. Une génération dure des minutes ; une ligne de texte qui change ne dit
// ni où on en est ni combien de temps il reste. Ce bloc montre les trois choses que l'on veut
// savoir : l'étape en cours, une barre qui avance vraiment (la fraction vient du pipeline, pas
// d'une animation décorative), et un chrono qui compte le temps écoulé avec une estimation du
// restant. L'estimation n'apparaît qu'au-delà de 8 % d'avancement : plus tôt, elle serait fantaisiste.
function GenerationProgress({ step, frac, startedAt }: { step: string; frac?: number; startedAt: number }) {
  const t = useT();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  const ecoule = Math.max(0, (now - startedAt) / 1000);
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const reste = frac && frac > 0.08 ? (ecoule / frac) * (1 - frac) : null;
  const pct = Math.max(0, Math.min(100, (frac ?? 0) * 100));

  // Le TITRE de l'étape, en langage d'utilisateur. Il n'est pas décoratif : il est déduit de
  // l'étape réelle que le pipeline remonte (et de l'avancement pour distinguer l'ébauche de la
  // finition), donc il dit toujours quelque chose de vrai. Un mot qui tourne au hasard pendant
  // qu'on attend, c'est de l'amusement ; un mot qui suit le calcul, c'est de l'information.
  const titre = (() => {
    if (/CLIP|prompt|Tokeni/i.test(step)) return t('Reading your prompt', 'Lecture de votre description');
    if (/WebM|Encoding the video|Compilation/i.test(step)) return t('Assembling the clip', 'Montage du clip');
    if (/frame/i.test(step) && /Decod|Décod/i.test(step)) return t('Developing the frames', 'Développement des frames');
    if (/Decod|Décod|VAE/i.test(step)) return t('Developing the image', 'Développement de l’image');
    if (/Denois|Débruit/i.test(step)) {
      return (frac ?? 0) < 0.45
        ? t('Sketching the scene', 'Esquisse de la scène')
        : t('Refining the details', 'Affinage des détails');
    }
    if (/Enrich/i.test(step)) return t('Expanding your description', 'Développement de votre description');
    return t('Preparing', 'Préparation');
  })();

  const sec = Math.floor(ecoule);
  return (
    <div className="gen-progress">
      <div className="gen-progress-head">
        {/* La clé sur la seconde REMONTE l'élément à chaque tic : c'est ce qui rejoue l'animation.
            Sans elle, le keyframe ne se déclencherait qu'une fois. */}
        <span className="gen-progress-clock" key={sec}>{mmss(ecoule)}</span>
        {reste !== null && (
          <span className="gen-progress-eta">
            {reste < 5 ? t('almost done', 'presque fini') : `${t('about', 'environ')} ${mmss(reste)} ${t('left', 'restantes')}`}
          </span>
        )}
      </div>
      <div className="gen-progress-track">
        <div className="gen-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="gen-progress-phase">
        {titre}<span className="gen-dots" aria-hidden><i>.</i><i>.</i><i>.</i></span>
      </span>
      {/* L'étape brute reste lisible en dessous, en petit : elle est la preuve que le titre au-dessus
          n'est pas une animation qui tourne dans le vide. */}
      <span className="gen-progress-step">{step}</span>
    </div>
  );
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
            {/* Clip vidéo généré (AnimateDiff). Le blob WebM ne vit que la session : après un
                rechargement, seul le POSTER (1re frame) reste — pas de « révéler » comme en image,
                régénérer un clip coûte des minutes. */}
            {msg.video?.url ? (
              <video
                ref={fixWebmDuration}
                src={msg.video.url}
                poster={msg.video.poster}
                controls
                autoPlay
                loop
                muted
                playsInline
                width={msg.video.w}
                height={msg.video.h}
                style={{ width: `min(${Math.min(384, msg.video.w * 2)}px, 72vw)`, maxWidth: '100%', height: 'auto', borderRadius: 8, display: 'block', background: '#000' }}
              />
            ) : msg.video?.poster ? (
              <span style={{ position: 'relative', display: 'block', width: `min(${Math.min(384, msg.video.w * 2)}px, 72vw)`, maxWidth: '100%', borderRadius: 8, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={msg.video.poster} alt={t('clip preview (first frame)', 'aperçu du clip (première frame)')} style={{ width: '100%', height: 'auto', display: 'block', imageRendering: 'pixelated' }} />
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.7)', background: 'rgba(0,0,0,0.25)', textAlign: 'center', padding: 8 }}>
                  {t('Clip not kept after reload: reload the video model and resend the prompt to regenerate.', 'Clip non conservé après rechargement : recharge le modèle vidéo et renvoie le prompt pour régénérer.')}
                </span>
              </span>
            ) : msg.image
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
              : msg.gen
              ? null // l'étape est déjà affichée par GenerationProgress
              : msg.content
              // `settled` = ce message n'est plus en cours de génération : un <think> resté ouvert
              // s'y affiche en « Raisonnement (interrompu) » au lieu d'un « Réflexion… » éternel.
              ? renderMessageContent(msg.content, showReasoning, !showTyping)
              : null}
            {/* « Affiner » : reprend prompt + seed dans le composer — préciser le texte en gardant
                la même composition (même bruit initial). Visible sous toute image générée. */}
            {msg.image?.url && (
              <SaveLink url={msg.image.url} name={`brimkern-${msg.image.seed ?? 'image'}.png`} label={t('Save', 'Enregistrer')} />
            )}
            {msg.image && onRefineImage && (
              <button
                type="button"
                onClick={() => onRefineImage(msg.image!.prompt ?? '', msg.image!.seed ?? 0, msg.image!.url)}
                style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid var(--border-color)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                ✎ {t('Refine this image', 'Affiner cette image')}
              </button>
            )}
            {/* Génération en cours (image ou vidéo) : le bloc animé remplace la ligne de texte —
                étape, barre réelle et chrono avec estimation du restant. */}
            {msg.gen && !msg.image && !msg.video && (
              <GenerationProgress step={msg.content} frac={msg.gen.frac} startedAt={msg.gen.startedAt} />
            )}
            {/* Un message vidéo peut PORTER un texte (ex. « WebM non supporté ») : la chaîne
                ternaire ci-dessus n'affiche le contenu que sans média, on le rend donc ici. */}
            {msg.video && msg.content ? (
              <span style={{ display: 'block', marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>{msg.content}</span>
            ) : null}
            {msg.video?.url && (
              <SaveLink url={msg.video.url} name={`brimkern-${msg.video.seed ?? 'clip'}.webm`} label={t('Save the clip', 'Enregistrer le clip')} />
            )}
            {/* Sous le clip : la trace mesurée (frames uniques + temps de calcul), comme partout. */}
            {msg.video && (msg.video.url || msg.video.poster) && msg.video.frames ? (
              <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                {msg.video.frames} frames{msg.video.ms ? ` · ${(msg.video.ms / 1000).toFixed(0)} s ${t('of GPU compute', 'de calcul GPU')}` : ''}
              </span>
            ) : null}
            {!msg.image && !msg.video && !msg.content && showTyping && (
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
