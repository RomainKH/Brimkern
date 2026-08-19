"use client";

// The chat input bar: collapsed-paste attachment chips, the reasoning-budget selector (reasoning
// models only), the skills button, the textarea, send/stop, and the context-size notice + counter.
// Pure UI — all state/handlers come from the page (props keep the page's names so the JSX is verbatim).

import { useRef, type Dispatch, type SetStateAction, type RefObject, type ClipboardEvent as ReactClipboardEvent } from 'react';
import { Brain, Sparkles, Square, Send, X, Copy, AlertTriangle, Image as ImageIcon, Paperclip, Film } from 'lucide-react';
import { THINK_BUDGETS, type ReflectionLevel } from '@/lib/chatFormat';
import type { ArchType } from '@/lib/presets';
import type { Skill } from '@/lib/skillStore';
import { useT } from '@/lib/i18n';
import { CONTEXT_SOFT_CAP, type PastedAttachment } from './composer-shared';

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
  imageSize: number;                                  // latent side fallback (16/32/64/128)
  setImageSize: Dispatch<SetStateAction<number>>;
  imageRatio?: ImageRatio;
  setImageRatio?: Dispatch<SetStateAction<ImageRatio>>;
  imageQuality?: ImageQuality;
  setImageQuality?: Dispatch<SetStateAction<ImageQuality>>;
  // Le modèle chargé sait-il composer nativement au-delà de 512 ? Non pour SD-Turbo/SDXS : hd est
  // alors servi par un agrandissement ×2, ce que les libellés doivent dire.
  nativeHighRes?: boolean;
  // Plafond de résolution de la machine : rien au-dessus n'est proposé (cf. ChatApp.imageCeiling).
  imageCeiling?: ImageQuality;
  // Mode vidéo (AnimateDiff) : le placeholder décrit une SCÈNE, pas un message — et rappelle le coût.
  videoMode?: boolean;
  // Nombre de frames UNIQUES du clip : il fixe à la fois la longueur du mouvement et le temps de
  // calcul (l'un ne va pas sans l'autre), d'où un seul réglage plutôt que deux.
  videoFrames?: number;
  setVideoFrames?: Dispatch<SetStateAction<number>>;
  webSearchOn: boolean;                               // la ligne de confidentialité doit dire la vérité
  // Mode vision (Qwen2-VL) : bouton 📎 pour joindre une image + vignette de la pièce jointe.
  visionMode?: boolean;
  pendingImage?: { dataUrl: string; preview: string; w: number; h: number; previewW: number; previewH: number } | null;
  setPendingImage?: Dispatch<SetStateAction<{ dataUrl: string; preview: string; w: number; h: number; previewW: number; previewH: number } | null>>;
}

export function Composer({
  attachments, setAttachments, modelArchType, modelState, reflectionLevel, setReflectionLevel,
  benchRunning, activeSkills, setSkillsOpen, textareaRef, handlePaste, isMobile,
  userInput, setUserInput, handleSendMessage, handleStopGeneration, contextOver, contextTokens,
  imageMode, imageSize, setImageSize, imageRatio, setImageRatio, imageQuality, setImageQuality,
  nativeHighRes, imageCeiling,
  webSearchOn, videoMode, videoFrames, setVideoFrames,
  visionMode, pendingImage, setPendingImage,
}: Props) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Pièce jointe image (mode vision) : lue en data URL PLEINE (c'est elle qui part au ViT) + un
  // aperçu qui, lui, est affiché ET persisté avec la conversation. L'aperçu est donc dimensionné pour
  // son seul usage : la bulle l'affiche au plus à 384 px de large (cf. ChatMessages), d'où 448 px sur
  // le grand côté — net à l'écran, ~40 Ko en base64. À 640 px et qualité 0,88 il pesait ~250 Ko, et
  // il était recopié trois fois dans le message : ~750 Ko d'IndexedDB par image jointe.
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

  // `imageSize` (côté du latent) reste le repli quand la conversation restaurée n'a pas encore de
  // qualité : on en déduit la marche la plus proche.
  const ratio = imageRatio ?? '1:1';
  const quality: ImageQuality = imageQuality
    ?? (imageSize <= 32 ? 'draft' : imageSize <= 48 ? 'fast' : imageSize >= 120 ? 'fhd' : imageSize >= 96 ? 'hd' : imageSize >= 72 ? 'plus' : 'standard');
  // Chaque libellé annonce la taille de sortie RÉELLE (planImage), agrandissement compris — lire la
  // table brute faisait promettre 1920×1088 à un rendu qui sortait en 1280×768.
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
  // Résolutions proposées : sous le plafond machine, et sans doublon — sur un modèle natif 512,
  // « fhd » rendrait EXACTEMENT la même image que « hd » (standard puis ×2), donc on ne l'offre pas.
  const resOptions = ORDER
    .filter((q) => ORDER.indexOf(q) <= ORDER.indexOf(imageCeiling ?? 'fhd'))
    .filter((q) => nativeHighRes || q !== 'fhd');

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
          {/* Format & Qualité de l'image (mode image uniquement) */}
          {imageMode && (modelState === 'ready' || modelState === 'generating') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{t('Ratio:', 'Format :')}</span>
                <select
                  value={ratio}
                  onChange={(e) => setImageRatio?.(e.target.value as ImageRatio)}
                  disabled={modelState === 'generating' || benchRunning}
                  aria-label={t('Aspect ratio', 'Format d\'image')}
                  style={{
                    fontSize: '12px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                    background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                  }}
                >
                  <option value="1:1">{t('1:1 (Square)', '1:1 (Carré)')}</option>
                  <option value="16:9">{t('16:9 (Landscape)', '16:9 (Paysage)')}</option>
                  <option value="9:16">{t('9:16 (Story/Reel)', '9:16 (Story/Portrait)')}</option>
                  <option value="4:3">{t('4:3 (Photo)', '4:3 (Photo)')}</option>
                  <option value="3:4">{t('3:4 (Portrait)', '3:4 (Portrait)')}</option>
                  <option value="3:2">{t('3:2 (Classic 3:2)', '3:2 (Cinéma 3:2)')}</option>
                  <option value="2:3">{t('2:3 (Classic 2:3)', '2:3 (Affiche 2:3)')}</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{t('Resolution:', 'Résolution :')}</span>
                <select
                  value={quality}
                  onChange={(e) => {
                    const q = e.target.value as ImageQuality;
                    setImageQuality?.(q);
                    setImageSize(planOf(q).latentH);
                  }}
                  disabled={modelState === 'generating' || benchRunning}
                  aria-label={t('Resolution', 'Résolution')}
                  title={nativeHighRes
                    ? t('The model composes natively at every size offered here.',
                        'Le modèle compose nativement à toutes les tailles proposées ici.')
                    : t('The model is trained at 512: below that it stops composing properly (tight crops, cut-off subjects), so smaller sizes are drafts. Above it, the image is rendered at 512 then upscaled 2× on the GPU — sharp, but not a native high-res render.',
                        'Le modèle est entraîné en 512 : en dessous il ne compose plus correctement (cadrages serrés, sujets coupés), les tailles inférieures sont donc des brouillons. Au-dessus, l’image est rendue en 512 puis agrandie ×2 sur le GPU — net, mais ce n’est pas un rendu haute résolution natif.')}
                  style={{
                    fontSize: '12px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                    background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                  }}
                >
                  {resOptions.map((q) => {
                    const d = planOf(q);
                    return <option key={q} value={q}>{RES_LABEL[q]} ({d.w}×{d.h})</option>;
                  })}
                </select>
              </div>

              <span style={{
                fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
                background: 'var(--bg-card-hover, rgba(127,127,127,0.1))',
                color: 'var(--text-secondary)', fontWeight: 500,
              }}>
                {activeDim.w} × {activeDim.h} px
              </span>
            </div>
          )}
          {/* Durée du clip (mode vidéo) : même emplacement que la qualité en mode image. Les libellés
              annoncent le COÛT, parce que c'est la vraie décision ici — 32 frames, c'est deux fois le
              calcul de 16. */}
          {videoMode && setVideoFrames && (modelState === 'ready' || modelState === 'generating') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Film size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>{t('Clip:', 'Clip :')}</span>
              <select
                value={videoFrames}
                onChange={(e) => setVideoFrames(Number(e.target.value))}
                disabled={modelState === 'generating' || benchRunning}
                title={t('Every clip plays as a ~10 s loop; what changes here is how much unique motion happens before it repeats. More frames also means proportionally more compute.',
                         'Tout clip est joué en boucle sur ~10 s ; ce qui change ici, c’est la quantité de mouvement unique avant que la boucle ne reprenne. Plus de frames demande aussi proportionnellement plus de calcul.')}
                style={{
                  fontSize: '12px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                  background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                }}
              >
                <option value={8}>{t('8 frames · 0.7 s of motion', '8 frames · 0,7 s de mouvement')}</option>
                <option value={16}>{t('16 frames · 1.3 s of motion', '16 frames · 1,3 s de mouvement')}</option>
                <option value={24}>{t('24 frames · 2 s of motion', '24 frames · 2 s de mouvement')}</option>
                <option value={32}>{t('32 frames · 2.7 s of motion', '32 frames · 2,7 s de mouvement')}</option>
              </select>
            </div>
          )}
          {/* Reflection level (reasoning models only) — a compact dropdown right above the composer. */}
          {/* !videoMode : modelArchType est un résidu du DERNIER LLM chargé — en mode vidéo le
              sélecteur de réflexion s'affichait au-dessus d'un pipeline qui ne raisonne pas. */}
          {!imageMode && !videoMode && (modelArchType === 'deepseek' || modelArchType === 'qwen3') && (modelState === 'ready' || modelState === 'generating') && (
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
                <option value="off">{t('off: direct answer', 'off : réponse directe')}</option>
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
                  ? (videoMode
                    ? t('Describe a scene to animate (a few minutes per clip)…', 'Décrivez une scène à animer (quelques minutes par clip)…')
                    : imageMode
                      ? t('Describe an image to generate…', 'Décrivez une image à générer…')
                      : t('Type your message…', 'Saisissez votre message…'))
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
                  ? t('🌐 Web access on: your questions (or pasted links) are sent to an external service. Configurable in ⚙️ Settings.', '🌐 Accès web actif : vos questions (ou liens collés) partent vers un service externe. Réglable dans ⚙️ Réglages.')
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
