"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Zap, Brain, Code2, Image as ImageIcon, Eye, Database, Check } from 'lucide-react';
import { useT } from '@/lib/i18n';

export interface QuickModelOption {
  id: string;
  name: string;
  shortName: string;
  size: string;
  badge: { en: string; fr: string };
  desc: { en: string; fr: string };
  type: 'brik' | 'gguf' | 'image' | 'vision';
  url?: string;
  icon: typeof Sparkles;
  desktopOnly?: boolean;
}

export const QUICK_MODELS: QuickModelOption[] = [
  {
    id: 'lfm2',
    name: 'LFM2.5 230M',
    shortName: 'LFM2.5 230M',
    size: '149 Mo',
    badge: { en: 'Instant', fr: 'Instantané' },
    desc: { en: 'Light & ultra-fast · Ideal for daily queries', fr: 'Léger & ultra-rapide · Idéal pour le quotidien' },
    type: 'brik',
    url: 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm2.5-230m-q8.brik',
    icon: Zap,
  },
  {
    id: 'qwen05',
    name: 'Qwen 2.5 0.5B',
    shortName: 'Qwen 0.5B',
    size: '378 Mo',
    badge: { en: 'Fluent', fr: 'Polyvalent' },
    desc: { en: 'Strong in French, coding and logic', fr: 'Très à l\'aise en français, code et logique' },
    type: 'brik',
    url: 'https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-q8.brik',
    icon: Sparkles,
  },
  {
    id: 'qwen3',
    name: 'Qwen 3 4B (int4)',
    shortName: 'Qwen 3 4B',
    size: '2.53 Go',
    badge: { en: 'High Intellect', fr: 'Haute capacité' },
    desc: { en: 'Next-gen intelligence, reasoning & coding', fr: 'Intelligence supérieure, raisonnement & code' },
    type: 'brik',
    url: 'https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik',
    icon: Code2,
    desktopOnly: true,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek-R1 Distill 1.5B',
    shortName: 'DeepSeek-R1 1.5B',
    size: '1.12 Go',
    badge: { en: 'Reasoning', fr: 'Raisonnement' },
    desc: { en: 'Step-by-step thinking (<think>) for math & logic', fr: 'Pensée pas à pas (<think>) pour maths & logique' },
    type: 'gguf',
    url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf',
    icon: Brain,
  },
  {
    id: 'coder3b',
    name: 'Qwen 2.5 Coder 3B (Opus)',
    shortName: 'Coder 3B Opus',
    size: '1.93 Go',
    badge: { en: 'Code & Dev', fr: 'Code & Dev' },
    desc: { en: 'Claude Opus 4.6 distilled · High coding power', fr: 'Distillé Claude Opus 4.6 · Haute précision de code' },
    type: 'gguf',
    url: 'https://huggingface.co/ryzdfm/qwen2.5-coder-3b-claude_opus_4.6-distilled/resolve/main/qwen2.5-coder-3b-instruct.Q4_K_M.gguf',
    icon: Code2,
    desktopOnly: true,
  },
  {
    id: 'sdturbo',
    name: 'Stable Diffusion Turbo',
    shortName: 'SD-Turbo (Image)',
    size: '1.2 Go',
    badge: { en: 'Image', fr: 'Image' },
    desc: { en: 'Generate images directly on your GPU', fr: 'Générez des images en local sur votre GPU' },
    type: 'image',
    icon: ImageIcon,
  },
  {
    id: 'qwen2vl',
    name: 'Qwen2-VL 2B (Vision)',
    shortName: 'Qwen2-VL (Vision)',
    size: '2.6 Go',
    badge: { en: 'Vision', fr: 'Vision' },
    desc: { en: 'Understand and analyze attached images', fr: 'Compréhension et analyse d\'images jointes' },
    type: 'vision',
    icon: Eye,
    desktopOnly: true,
  },
];

interface Props {
  activeModelName?: string;
  activeModelUrl?: string;
  imageMode?: boolean;
  videoMode?: boolean;
  visionMode?: boolean;
  onSelectModel: (model: QuickModelOption) => void;
  onOpenBrowser: () => void;
  isMobile?: boolean;
  disabled?: boolean;
}

export function QuickModelPicker({
  activeModelName,
  activeModelUrl,
  imageMode,
  videoMode,
  visionMode,
  onSelectModel,
  onOpenBrowser,
  isMobile,
  disabled,
}: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Determine label of current active model
  let label = activeModelName || t('LFM2.5 230M (Auto)', 'LFM2.5 230M (Auto)');
  if (imageMode) label = 'SD-Turbo (Image)';
  else if (videoMode) label = 'AnimateDiff (Vidéo)';
  else if (visionMode) label = 'Qwen2-VL (Vision)';
  else if (activeModelName) {
    const match = QUICK_MODELS.find((m) => m.url === activeModelUrl || activeModelName.toLowerCase().includes(m.id));
    if (match) label = match.shortName;
    else if (activeModelName.length > 20) label = activeModelName.slice(0, 18) + '…';
  }

  const visibleModels = isMobile
    ? QUICK_MODELS.filter((m) => !m.desktopOnly)
    : QUICK_MODELS;

  return (
    <div className="quick-model-picker-wrap" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="quick-model-pill"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        title={t('Switch model', 'Changer de modèle')}
      >
        <span className="quick-model-pill-indicator"></span>
        <span className="quick-model-pill-label">{label}</span>
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {open && (
        <div className="quick-model-menu">
          <div className="quick-model-menu-header">
            <span>{t('Models & Modalities', 'Modèles & Modalités')}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t('100% WebGPU local', '100% local WebGPU')}</span>
          </div>

          <div className="quick-model-menu-list">
            {visibleModels.map((m) => {
              const Icon = m.icon;
              const isSelected =
                (m.type === 'image' && imageMode) ||
                (m.type === 'vision' && visionMode) ||
                (m.url && activeModelUrl === m.url) ||
                (activeModelName && activeModelName.toLowerCase().includes(m.name.toLowerCase()));

              return (
                <button
                  key={m.id}
                  type="button"
                  className={`quick-model-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setOpen(false);
                    onSelectModel(m);
                  }}
                >
                  <div className="quick-model-item-icon">
                    <Icon size={15} />
                  </div>
                  <div className="quick-model-item-info">
                    <div className="quick-model-item-title-row">
                      <span className="quick-model-item-title">{m.name}</span>
                      <span className="quick-model-item-badge">{t(m.badge.en, m.badge.fr)}</span>
                      <span className="quick-model-item-size">{m.size}</span>
                    </div>
                    <div className="quick-model-item-desc">{t(m.desc.en, m.desc.fr)}</div>
                  </div>
                  {isSelected && <Check size={14} className="quick-model-item-check" />}
                </button>
              );
            })}
          </div>

          <div className="quick-model-menu-footer">
            <button
              type="button"
              className="quick-model-browse-btn"
              onClick={() => {
                setOpen(false);
                onOpenBrowser();
              }}
            >
              <Database size={13} />
              <span>{t('Browse all models (GGUF, Hugging Face…)', 'Parcourir tous les modèles (GGUF, Hugging Face…)')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
