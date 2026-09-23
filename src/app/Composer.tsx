"use client";

// The chat input bar: Claude-inspired clean card container with integrated toolbar,
// model switcher, reflection budget, skills, image attachments, auto-growing textarea and send button.
// Works seamlessly in both hero mode (centered empty-state on /chat) and docked mode (bottom of conversation).

import { useRef, type Dispatch, type SetStateAction, type RefObject, type ClipboardEvent as ReactClipboardEvent } from 'react';
import {
  Brain, Sparkles, Square, ArrowUp, Send, X, Copy, AlertTriangle,
  Image as ImageIcon, Paperclip, Film, Clock, Edit2, Plus, Settings
} from 'lucide-react';
import { THINK_BUDGETS, type ReflectionLevel } from '@/lib/chatFormat';
import type { ArchType } from '@/lib/presets';
import type { Skill } from '@/lib/skillStore';
import { useT } from '@/lib/i18n';
import { CONTEXT_SOFT_CAP, type PastedAttachment, type QueuedMessage } from './composer-shared';
import { QuickModelPicker, type QuickModelOption } from './QuickModelPicker';

import { planImage, type ImageRatio, type ImageQuality } from '@/lib/webgpu/diffusion/imageGen';

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
  // Image mode (SD-Turbo loaded): show the quality & ratio selectors instead of the reflection one.
  imageMode: boolean;
  imageSize: number;
  setImageSize: Dispatch<SetStateAction<number>>;
  imageRatio?: ImageRatio;
  setImageRatio?: Dispatch<SetStateAction<ImageRatio>>;
  imageQuality?: ImageQuality;
  setImageQuality?: Dispatch<SetStateAction<ImageQuality>>;
  nativeHighRes?: boolean;
  imageCeiling?: ImageQuality;
  videoMode?: boolean;
  videoFrames?: number;
  setVideoFrames?: Dispatch<SetStateAction<number>>;
  webSearchOn: boolean;
  visionMode?: boolean;
  pendingImage?: { dataUrl: string; preview: string; w: number; h: number; previewW: number; previewH: number } | null;
  setPendingImage?: Dispatch<SetStateAction<{ dataUrl: string; preview: string; w: number; h: number; previewW: number; previewH: number } | null>>;
  messageQueue?: QueuedMessage[];
  onRemoveQueued?: (id: string) => void;
  onEditQueued?: (id: string) => void;
  onClearQueue?: () => void;
  // Claude layout & settings integration
  variant?: 'hero' | 'docked';
  activeModelName?: string;
  activeModelUrl?: string;
  onSelectQuickModel?: (model: QuickModelOption) => void;
  onOpenModelBrowser?: () => void;
  onOpenOptions?: () => void;
}

export function Composer({
  attachments, setAttachments, modelArchType, modelState, reflectionLevel, setReflectionLevel,
  benchRunning, activeSkills, setSkillsOpen, textareaRef, handlePaste, isMobile,
  userInput, setUserInput, handleSendMessage, handleStopGeneration, contextOver, contextTokens,
  imageMode, imageSize, setImageSize, imageRatio, setImageRatio, imageQuality, setImageQuality,
  nativeHighRes, imageCeiling,
  webSearchOn, videoMode, videoFrames, setVideoFrames,
  visionMode, pendingImage, setPendingImage,
  messageQueue = [], onRemoveQueued, onEditQueued, onClearQueue,
  variant = 'docked',
  activeModelName,
  activeModelUrl,
  onSelectQuickModel,
  onOpenModelBrowser,
  onOpenOptions,
}: Props) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const APERCU_MAX = 448;
  const pickImage = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, APERCU_MAX / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * scale));
        c.height = Math.max(1, Math.round(img.naturalHeight * scale));
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        setPendingImage?.({
          dataUrl,
          preview: c.toDataURL('image/jpeg', 0.85),
          w: img.naturalWidth, h: img.naturalHeight,
          previewW: c.width, previewH: c.height,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  };

  const ratio = imageRatio ?? '1:1';
  const quality: ImageQuality = imageQuality
    ?? (imageSize <= 32 ? 'draft' : imageSize <= 48 ? 'fast' : imageSize >= 120 ? 'fhd' : imageSize >= 96 ? 'hd' : imageSize >= 72 ? 'plus' : 'standard');
  const planOf = (q: ImageQuality) => planImage(ratio, q, { nativeHighRes });
  const activeDim = planOf(quality);
  const ORDER: ImageQuality[] = ['draft', 'fast', 'standard', 'plus', 'hd', 'fhd'];
  const RES_LABEL: Record<ImageQuality, string> = {
    draft: t('Fast', 'Rapide'),
    fast: t('Balanced', 'Équilibré'),
    standard: nativeHighRes ? t('Standard', 'Standard') : t('Standard (native)', 'Standard (natif)'),
    plus: t('Large', 'Grand format'),
    hd: nativeHighRes ? `✨ ${t('HD (native)', 'HD (natif)')}` : `✨ ${t('HD (2× upscaled)', 'HD (agrandi ×2)')}`,
    fhd: `🚀 ${t('Very high res', 'Très haute déf')}`,
  };
  const resOptions = ORDER
    .filter((q) => ORDER.indexOf(q) <= ORDER.indexOf(imageCeiling ?? 'fhd'))
    .filter((q) => nativeHighRes || q !== 'fhd');

  const canSend = (modelState === 'ready' || modelState === 'idle') &&
    (userInput.trim().length > 0 || attachments.length > 0 || pendingImage || messageQueue.length > 0);

  return (
    <div className={`chat-input-container ${variant === 'hero' ? 'composer-hero-container' : 'composer-docked-container'}`}>
      {messageQueue.length > 0 && (
        <div className="composer-queue-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Clock size={13} style={{ color: 'var(--accent)' }} />
              <span>{t('Message queue', "File d'attente")}</span>
              <span className="composer-queue-badge">
                {messageQueue.length}
              </span>
            </div>
            {onClearQueue && (
              <button
                onClick={onClearQueue}
                title={t('Clear the queue', "Vider la file d'attente")}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', padding: '2px 4px' }}
              >
                {t('Clear all', 'Tout effacer')}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
            {messageQueue.map((item, index) => (
              <div key={item.id} className="composer-queue-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>
                    #{index + 1}
                  </span>
                  <span
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}
                    title={item.text}
                  >
                    {item.text || (item.pendingImage ? t('[Image attachment]', '[Pièce jointe image]') : t('[Attachment]', '[Pièce jointe]'))}
                  </span>
                  {item.attachments && item.attachments.length > 0 && (
                    <span style={{ fontSize: '10px', color: 'var(--accent)', flexShrink: 0 }}>
                      📎 {item.attachments.length}
                    </span>
                  )}
                  {item.pendingImage && (
                    <span style={{ fontSize: '10px', color: 'var(--accent)', flexShrink: 0 }}>🖼️</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  {onEditQueued && (
                    <button
                      onClick={() => onEditQueued(item.id)}
                      title={t('Edit this message', 'Modifier ce message')}
                      className="composer-queue-action"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                  {onRemoveQueued && (
                    <button
                      onClick={() => onRemoveQueued(item.id)}
                      title={t('Remove from queue', "Retirer de la file d'attente")}
                      className="composer-queue-action"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main card box (Claude-style unified card) */}
      <div className={`claude-composer-card ${variant === 'hero' ? 'hero' : 'docked'}`}>
        {/* Top attachments area */}
        {attachments.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '10px 14px 0' }}>
            {attachments.map((a) => (
              <span key={a.id} className="composer-attachment-chip">
                <Copy size={12} style={{ flexShrink: 0 }} />
                <span>{a.label}</span>
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

        {/* Vision image pending preview */}
        {visionMode && pendingImage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px 0' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pendingImage.preview} alt={t('attached image', 'image jointe')} style={{ height: 42, borderRadius: 6, border: '1px solid var(--border-color)' }} />
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

        {/* Textarea */}
        <div className="composer-textarea-wrap">
          <textarea
            ref={textareaRef}
            className={`claude-chat-textarea ${variant === 'hero' ? 'hero' : ''}`}
            onPaste={handlePaste}
            placeholder={
              modelState === 'ready'
                ? (videoMode
                  ? t('Describe a scene to animate (a few minutes per clip)…', 'Décrivez une scène à animer (quelques minutes par clip)…')
                  : imageMode
                    ? t('Describe an image to generate…', 'Décrivez une image à générer…')
                    : t('Type your message, ask a question, paste code…', 'Saisissez votre message, posez une question, collez du code…'))
                : modelState === 'generating'
                  ? (isMobile ? t('Generating… (Enter to queue)', 'Génération… (Entrée pour empiler)') : t('Generating… Type your message to queue it', 'Inférence en cours… Tapez votre message pour le mettre en file'))
                  : modelState === 'idle'
                    ? t('Ask anything (starts the local model automatically)…', 'Posez votre question (le modèle local démarre automatiquement)…')
                    : (isMobile ? t('Loading model…', 'Chargement du modèle…') : t('Initializing local model…', 'Initialisation du modèle local…'))
            }
            rows={variant === 'hero' ? 3 : 1}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'error'}
          />
        </div>

        {/* Bottom integrated toolbar (Claude style) */}
        <div className="claude-composer-toolbar">
          <div className="composer-toolbar-left">
            {/* Quick Model Selector Pill */}
            {onSelectQuickModel && onOpenModelBrowser && (
              <QuickModelPicker
                activeModelName={activeModelName}
                activeModelUrl={activeModelUrl}
                imageMode={imageMode}
                videoMode={videoMode}
                visionMode={visionMode}
                onSelectModel={onSelectQuickModel}
                onOpenBrowser={onOpenModelBrowser}
                isMobile={isMobile}
                disabled={modelState === 'generating' || benchRunning}
              />
            )}

            {/* Vision Mode Image Picker Button */}
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
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="composer-tool-btn"
                  disabled={modelState !== 'ready'}
                  title={t('Attach an image', 'Joindre une image')}
                >
                  <Paperclip size={15} />
                  {!isMobile && <span>{t('Image', 'Image')}</span>}
                </button>
              </>
            )}

            {/* Skills button */}
            <button
              type="button"
              onClick={() => setSkillsOpen(true)}
              className={`composer-tool-btn ${activeSkills.length ? 'active' : ''}`}
              title={activeSkills.length ? `${t('Active skills:', 'Skills actifs :')} ${activeSkills.map((s) => s.name).join(', ')}` : t('Skills (instructions)', 'Skills (consignes)')}
            >
              <Sparkles size={14} />
              {!isMobile && <span>Skills</span>}
              {activeSkills.length > 0 && (
                <span className="composer-tool-badge">{activeSkills.length}</span>
              )}
            </button>

            {/* Reflection selector (reasoning models: Qwen3, DeepSeek) */}
            {!imageMode && !videoMode && (modelArchType === 'deepseek' || modelArchType === 'qwen3') && (modelState === 'ready' || modelState === 'generating') && (
              <div className="composer-tool-select-wrap" title={t('<think> reasoning budget before answering', 'Budget de réflexion <think> avant de répondre')}>
                <Brain size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <select
                  value={reflectionLevel}
                  onChange={(e) => setReflectionLevel(e.target.value as ReflectionLevel)}
                  disabled={modelState === 'generating' || benchRunning}
                  className="composer-inline-select"
                >
                  <option value="off">{t('No think', 'Direct')}</option>
                  <option value="low">~{THINK_BUDGETS.low} tok</option>
                  <option value="medium">~{THINK_BUDGETS.medium} tok</option>
                  <option value="high">~{THINK_BUDGETS.high} tok</option>
                </select>
              </div>
            )}

            {/* Image mode options (Ratio & Quality) */}
            {imageMode && (modelState === 'ready' || modelState === 'generating') && (
              <div className="composer-tool-select-wrap">
                <ImageIcon size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <select
                  value={ratio}
                  onChange={(e) => setImageRatio?.(e.target.value as ImageRatio)}
                  disabled={modelState === 'generating' || benchRunning}
                  aria-label={t('Aspect ratio', 'Format d\'image')}
                  className="composer-inline-select"
                >
                  <option value="1:1">1:1</option>
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="4:3">4:3</option>
                  <option value="3:4">3:4</option>
                </select>
                <select
                  value={quality}
                  onChange={(e) => {
                    const q = e.target.value as ImageQuality;
                    setImageQuality?.(q);
                    setImageSize(planOf(q).latentH);
                  }}
                  disabled={modelState === 'generating' || benchRunning}
                  aria-label={t('Resolution', 'Résolution')}
                  className="composer-inline-select"
                >
                  {resOptions.map((q) => (
                    <option key={q} value={q}>{RES_LABEL[q]}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Video mode frames */}
            {videoMode && setVideoFrames && (modelState === 'ready' || modelState === 'generating') && (
              <div className="composer-tool-select-wrap">
                <Film size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <select
                  value={videoFrames}
                  onChange={(e) => setVideoFrames(Number(e.target.value))}
                  disabled={modelState === 'generating' || benchRunning}
                  className="composer-inline-select"
                >
                  <option value={8}>8f (~0.7s)</option>
                  <option value={16}>16f (~1.3s)</option>
                  <option value={24}>24f (~2.0s)</option>
                </select>
              </div>
            )}

            {/* Quick settings button */}
            {onOpenOptions && (
              <button
                type="button"
                onClick={onOpenOptions}
                className="composer-tool-btn"
                title={t('Settings & parameters', 'Réglages & paramètres')}
              >
                <Settings size={14} />
              </button>
            )}
          </div>

          <div className="composer-toolbar-right">
            {/* Tokens counter */}
            {modelState === 'ready' && contextTokens > 0 && (
              <span
                className="composer-token-pill"
                title={t('Estimated prompt tokens', 'Tokens estimés du prompt')}
                style={{ color: contextOver ? 'var(--warning, #f59e0b)' : 'var(--text-muted)' }}
              >
                ~{contextTokens.toLocaleString()} tok
              </span>
            )}

            {/* Actions: Send / Stop / Queue */}
            {modelState === 'generating' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {(userInput.trim() || attachments.length > 0 || pendingImage) && (
                  <button
                    type="button"
                    className="claude-send-btn queue"
                    onClick={() => handleSendMessage()}
                    title={t('Add to queue (Enter)', "Ajouter à la file d'attente (Entrée)")}
                  >
                    <Plus size={15} />
                  </button>
                )}
                <button
                  type="button"
                  className="claude-send-btn stop"
                  onClick={handleStopGeneration}
                  title={t('Stop generation', 'Arrêter la génération')}
                >
                  <Square size={13} fill="currentColor" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`claude-send-btn ${canSend ? 'active' : ''}`}
                onClick={() => handleSendMessage()}
                disabled={!canSend}
                title={messageQueue.length > 0 && !userInput.trim() ? t('Run queue', 'Lancer la file') : t('Send message', 'Envoyer le message')}
              >
                <ArrowUp size={16} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Long context alert */}
      {contextOver && (
        <div className="composer-context-warning">
          <AlertTriangle size={14} style={{ color: 'var(--warning, #f59e0b)', flexShrink: 0, marginTop: '1px' }} />
          <span>
            {t(
              `Long context (~${contextTokens.toLocaleString()} tokens). Beyond ~${CONTEXT_SOFT_CAP.toLocaleString()}, a small local model loses coherence and prefill gets slow.`,
              `Contexte long (~${contextTokens.toLocaleString()} tokens). Au-delà de ~${CONTEXT_SOFT_CAP.toLocaleString()}, le modèle perd en cohérence et le prefill ralentit.`,
            )}
          </span>
        </div>
      )}

      {/* Subtle privacy & security reassurance */}
      <div className="composer-privacy-line">
        <span>
          {webSearchOn
            ? t('🌐 Web search active: queries are sent to external services (configurable in ⚙️ Settings).', '🌐 Recherche web active : les requêtes partent vers des services externes (réglable dans ⚙️).')
            : t('100% on-device WebGPU · Zero server transmissions · Private & offline', '100% WebGPU local dans le navigateur · Zéro transmission serveur · Privé & hors-ligne')}
        </span>
      </div>
    </div>
  );
}
