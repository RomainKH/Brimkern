"use client";

// The chat input bar: collapsed-paste attachment chips, the reasoning-budget selector (reasoning
// models only), the skills button, the textarea, send/stop, and the context-size notice + counter.
// Pure UI — all state/handlers come from the page (props keep the page's names so the JSX is verbatim).

import { useRef, type Dispatch, type SetStateAction, type RefObject, type ClipboardEvent as ReactClipboardEvent } from 'react';
import { Brain, Sparkles, Square, Send, X, Copy, AlertTriangle, Image as ImageIcon, Paperclip } from 'lucide-react';
import { THINK_BUDGETS, type ReflectionLevel } from '@/lib/chatFormat';
import type { ArchType } from '@/lib/presets';
import type { Skill } from '@/lib/skillStore';
import { useT } from '@/lib/i18n';
import { CONTEXT_SOFT_CAP, type PastedAttachment } from './composer-shared';

type ModelState = 'idle' | 'initializing' | 'loading' | 'ready' | 'generating' | 'error';

interface Props {
  attachments: PastedAttachment[];
  setAttachments: Dispatch<SetStateAction<PastedAttachment[]>>;
  modelArchType: ArchType;
  modelState: ModelState;
  reflectionLevel: ReflectionLevel;
  setReflectionLevel: Dispatch<SetStateAction<ReflectionLevel>>;
  benchRunning: boolean;
  activeSkills: Skill[];
  setSkillsOpen: Dispatch<SetStateAction<boolean>>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  handlePaste: (e: ReactClipboardEvent<HTMLTextAreaElement>) => void;
  isMobile: boolean;
  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;
  handleSendMessage: (textToSend?: string) => void | Promise<void>;
  handleStopGeneration: () => void;
  contextOver: boolean;
  contextTokens: number;
  // Image mode (SD-Turbo loaded): show the quality selector instead of the reflection one.
  imageMode: boolean;
  imageSize: number;                                  // latent side: 16/32/64 → 128/256/512px
  setImageSize: Dispatch<SetStateAction<number>>;
  webSearchOn: boolean;                               // la ligne de confidentialité doit dire la vérité
  // Mode vision (Qwen2-VL) : bouton 📎 pour joindre une image + vignette de la pièce jointe.
  visionMode?: boolean;
  pendingImage?: { dataUrl: string; preview: string; w: number; h: number } | null;
  setPendingImage?: Dispatch<SetStateAction<{ dataUrl: string; preview: string; w: number; h: number } | null>>;
}

export function Composer({
  attachments, setAttachments, modelArchType, modelState, reflectionLevel, setReflectionLevel,
  benchRunning, activeSkills, setSkillsOpen, textareaRef, handlePaste, isMobile,
  userInput, setUserInput, handleSendMessage, handleStopGeneration, contextOver, contextTokens,
  imageMode, imageSize, setImageSize, webSearchOn,
  visionMode, pendingImage, setPendingImage,
}: Props) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Pièce jointe image (mode vision) : lue en data URL pleine (envoyée au ViT) + un aperçu ≤160px
  // (affiché dans la bulle et persisté avec la conversation — les pixels pleins ne le sont pas).
  const pickImage = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 160 / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * scale));
        c.height = Math.max(1, Math.round(img.naturalHeight * scale));
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        setPendingImage?.({ dataUrl, preview: c.toDataURL('image/jpeg', 0.8), w: c.width, h: c.height });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  };

  return (
        <div className="chat-input-container">
          {attachments.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {attachments.map((a) => (
                <span key={a.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 8px', borderRadius: '8px', fontSize: '11px',
                  background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', border: '1px solid var(--border-color, #dfdfdf)',
                  color: 'var(--text-secondary)',
                }}>
                  <Copy size={12} style={{ flexShrink: 0 }} />
                  {a.label}
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== a.id))}
                    title={t('Remove', 'Retirer')}
                    style={{ display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {/* Image quality (image mode only) — same slot as the reflection selector. Latent side per
              generation; 512 is SD-Turbo's native training size but f32 makes it slow and GPU-hungry,
              so it's opt-in and labeled as such. */}
          {imageMode && (modelState === 'ready' || modelState === 'generating') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <ImageIcon size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>{t('Quality:', 'Qualité :')}</span>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(Number(e.target.value))}
                disabled={modelState === 'generating' || benchRunning}
                title={t('Generation resolution — bigger = more faithful but slower and more GPU-hungry', 'Résolution de génération — plus grand = plus fidèle mais plus lent et plus gourmand en GPU')}
                style={{
                  fontSize: '12px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                  background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                }}
              >
                <option value={16}>{t('128px — fast', '128px — rapide')}</option>
                <option value={32}>{t('256px — recommended', '256px — recommandé')}</option>
                {/* 512² sur téléphone = pic VRAM (activations + TAESD) qui fait reprendre le GPU
                    par l'OS en pleine génération (blocage silencieux constaté) → desktop only. */}
                {!isMobile && <option value={64}>{t('512px — native, slower', '512px — natif, plus lent')}</option>}
              </select>
            </div>
          )}
          {/* Reflection level (reasoning models only) — a compact dropdown right above the composer. */}
          {!imageMode && (modelArchType === 'deepseek' || modelArchType === 'qwen3') && (modelState === 'ready' || modelState === 'generating') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Brain size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>{t('Reasoning:', 'Réflexion :')}</span>
              <select
                value={reflectionLevel}
                onChange={(e) => setReflectionLevel(e.target.value as ReflectionLevel)}
                disabled={modelState === 'generating' || benchRunning}
                title={t('<think> reasoning budget before answering', 'Budget de réflexion <think> avant de répondre')}
                style={{
                  fontSize: '12px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                  background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                }}
              >
                <option value="off">{t('off — direct answer', 'off — réponse directe')}</option>
                <option value="low">low — ~{THINK_BUDGETS.low} tok</option>
                <option value="medium">medium — ~{THINK_BUDGETS.medium} tok</option>
                <option value="high">high — ~{THINK_BUDGETS.high} tok</option>
              </select>
            </div>
          )}
          {/* Vignette de l'image jointe (mode vision) */}
          {visionMode && pendingImage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingImage.preview} alt={t('attached image', 'image jointe')} style={{ height: 40, borderRadius: 6, border: '1px solid var(--border-color)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('Image attached to the next message', 'Image jointe au prochain message')}</span>
              <button
                onClick={() => setPendingImage?.(null)}
                title={t('Remove', 'Retirer')}
                style={{ display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
              >
                <X size={13} />
              </button>
            </div>
          )}
          <div className="chat-input-wrapper">
            {/* Pièce jointe image (mode vision uniquement) */}
            {visionMode && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) pickImage(f); e.target.value = ''; }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="circle-btn"
                  disabled={modelState !== 'ready'}
                  title={t('Attach an image', 'Joindre une image')}
                  style={{ flexShrink: 0 }}
                >
                  <Paperclip size={18} />
                </button>
              </>
            )}
            {/* Skills button (left of the chat bar): opens the popup to pick/compose/import skills. */}
            <button
              onClick={() => setSkillsOpen(true)}
              className="circle-btn"
              title={activeSkills.length ? `${t('Active skills:', 'Skills actifs :')} ${activeSkills.map((s) => s.name).join(', ')}` : t('Skills (instructions)', 'Skills (consignes)')}
              style={{ flexShrink: 0, position: 'relative' }}
            >
              <Sparkles size={18} />
              {activeSkills.length > 0 && (
                <span style={{ position: 'absolute', top: -3, right: -3, background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '999px', minWidth: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{activeSkills.length}</span>
              )}
            </button>
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              onPaste={handlePaste}
              placeholder={
                modelState === 'ready'
                  ? t('Type your message…', 'Saisissez votre message…')
                  : modelState === 'generating'
                    ? (isMobile ? t('Generating…', 'Génération…') : t('WebGPU matrix inference in progress…', 'Inférence matricielle WebGPU en cours…'))
                    : (isMobile ? t('Load a model to begin', 'Chargez un modèle pour commencer') : t('Select and load a model from the sidebar to begin.', 'Sélectionnez et chargez un modèle dans le menu latéral pour commencer.'))
              }
              rows={1}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={modelState !== 'ready' && modelState !== 'generating'}
            />

            <div className="chat-actions">
              {modelState === 'generating' ? (
                <button
                  className="circle-btn"
                  onClick={handleStopGeneration}
                  title={t('Stop the computation', 'Interrompre les calculs')}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                >
                  <Square size={16} fill="currentColor" />
                </button>
              ) : (
                <button
                  className="circle-btn send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={modelState !== 'ready' || (!userInput.trim() && attachments.length === 0)}
                  title={t('Send', 'Calculer')}
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
          {contextOver && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px',
              padding: '8px 12px', borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.10)', border: '1px solid var(--warning, #f59e0b)',
              fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45,
            }}>
              <AlertTriangle size={14} style={{ color: 'var(--warning, #f59e0b)', flexShrink: 0, marginTop: '1px' }} />
              <span>
                {t(
                  `Long context (~${contextTokens.toLocaleString()} tokens). Beyond ~${CONTEXT_SOFT_CAP.toLocaleString()}, a small local model loses coherence and prefill gets slow (O(n²) attention). For big chunks of code, prefer a targeted excerpt.`,
                  `Contexte long (~${contextTokens.toLocaleString()} tokens). Au-delà de ~${CONTEXT_SOFT_CAP.toLocaleString()}, un petit modèle local perd en cohérence et le prefill devient lent (attention en O(n²)). Pour du code volumineux, privilégiez un extrait ciblé.`,
                )}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            {!isMobile && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', flex: 1, textAlign: 'center' }}>
                {webSearchOn
                  ? t('🌐 Web access on: your questions (or pasted links) are sent to an external service — configurable in ⚙️ Settings.', '🌐 Accès web actif : vos questions (ou liens collés) partent vers un service externe — réglable dans ⚙️ Réglages.')
                  : t('Brimkern runs in isolation and never sends your data anywhere.', "Brimkern s'exécute de manière isolée sans transférer vos données à l'extérieur.")}
              </span>
            )}
            {modelState === 'ready' && (contextTokens > 0) && (
              <span
                title={t('Estimated token count of the next prompt (history + draft)', 'Estimation du nombre de tokens du prochain prompt (historique + brouillon)')}
                style={{ fontSize: '11px', color: contextOver ? 'var(--warning, #f59e0b)' : 'var(--text-muted)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
              >
                ~{contextTokens.toLocaleString()} tok
              </span>
            )}
          </div>
        </div>
  );
}
