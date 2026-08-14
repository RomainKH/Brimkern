"use client";

// Settings modal (« Réglages ») : centralizes the user-facing knobs that don't belong in the
// composer — today the GPU power regime (thermal duty cycle of image generation), and an honest
// status section about tools/web/MCP (studied in docs/mcp-feasibility.md, nothing active yet).
// Opened from the sidebar, same modal pattern as StoragePanel.

import { X, Settings, Flame, Globe } from 'lucide-react';
import { useT } from '@/lib/i18n';

export interface GpuRegime { value: number; label: string; desc: string }
// Built through t() so labels/descriptions follow the active locale.
export const GPU_REGIMES = (t: (en: string, fr: string) => string): GpuRegime[] => [
  { value: 0.4, label: t('🌿 Eco', '🌿 Éco'), desc: t('GPU ~40% — cool and quiet machine, image generation ~2.5× slower.', 'GPU ~40 % — machine froide et silencieuse, génération d’images ~2,5× plus lente.') },
  { value: 0.6, label: t('⚖️ Balanced', '⚖️ Équilibré'), desc: t('GPU ~60% — the recommended trade-off: moderate heat, ~1.7× slower than Max.', 'GPU ~60 % — le compromis conseillé : chauffe modérée, ~1,7× plus lent que Max.') },
  { value: 1, label: '🔥 Max', desc: t('Full throttle — the fastest, but the GPU runs non-stop (heat).', 'Plein régime — le plus rapide, mais le GPU tourne en continu (chauffe).') },
];

interface Props {
  onClose: () => void;
  gpuDuty: number;
  setGpuDuty: (d: number) => void;
  webSearchOn: boolean;
  setWebSearchOn: (on: boolean) => void;
  localToolsOn: boolean;
  setLocalToolsOn: (on: boolean) => void;
  urlReadOn: boolean;
  setUrlReadOn: (on: boolean) => void;
  showReasoning: boolean;
  setShowReasoning: (on: boolean) => void;
}

// Une option à cocher, avec le cadre accentué quand elle est active.
function Check({ checked, onChange, title, desc }: { checked: boolean; onChange: (on: boolean) => void; title: string; desc: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10,
        border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-color)'}`,
        background: checked ? 'var(--accent-bg-rgba)' : 'var(--bg-card)',
        cursor: 'pointer',
      }}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--accent)' }} />
      <span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{title}</span>
        <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
      </span>
    </label>
  );
}

export default function OptionsPanel({ onClose, gpuDuty, setGpuDuty, webSearchOn, setWebSearchOn, localToolsOn, setLocalToolsOn, urlReadOn, setUrlReadOn, showReasoning, setShowReasoning }: Props) {
  const t = useT();
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: '100%', maxWidth: 540, maxHeight: '85vh', overflowY: 'auto', padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Settings size={20} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 20, flex: 1 }}>{t('Settings', 'Réglages')}</h2>
          <button onClick={onClose} className="circle-btn" style={{ width: 30, height: 30 }} title={t('Close', 'Fermer')}><X size={16} /></button>
        </div>

        {/* ── Puissance GPU ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Flame size={15} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: 14, fontFamily: 'var(--font-heading)' }}>{t('GPU power', 'Puissance GPU')}</h3>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px' }}>
          {t('Throttles the GPU load during ', 'Régule la charge du GPU pendant la ')}<strong>{t('image generation', 'génération d’images')}</strong>{t(': the engine measures actual compute time and inserts proportional pauses. Text generation is unaffected (it is bound by latency, not by sustained load).', ' : le moteur mesure le temps de calcul réel et intercale des pauses proportionnelles. La génération de texte n’est pas concernée (elle est limitée par la latence, pas par la charge continue).')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {GPU_REGIMES(t).map((r) => (
            <label
              key={r.value}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10,
                border: `1px solid ${gpuDuty === r.value ? 'var(--accent)' : 'var(--border-color)'}`,
                background: gpuDuty === r.value ? 'var(--accent-bg-rgba)' : 'var(--bg-card)',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="gpu-regime"
                checked={gpuDuty === r.value}
                onChange={() => setGpuDuty(r.value)}
                style={{ marginTop: 2, accentColor: 'var(--accent)' }}
              />
              <span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</span>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{r.desc}</span>
              </span>
            </label>
          ))}
        </div>

        {/* ── Web & MCP ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Globe size={15} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: 14, fontFamily: 'var(--font-heading)' }}>{t('Web & tools (MCP)', 'Web & outils (MCP)')}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
          <Check
            checked={localToolsOn}
            onChange={setLocalToolsOn}
            title={t('🧮 Local tools — calculator & date', '🧮 Outils locaux — calculatrice & date')}
            desc={<>{t('Math in your messages is evaluated ', 'Les calculs de vos messages sont évalués ')}<strong>{t('exactly', 'exactement')}</strong>{t(" (small models get arithmetic wrong) and the model knows today's date. ", ' (les petits modèles se trompent en arithmétique) et le modèle connaît la date du jour. ')}<strong>{t('100% local, no network.', '100 % local, aucun réseau.')}</strong></>}
          />
          <Check
            checked={webSearchOn}
            onChange={setWebSearchOn}
            title={t('🌐 Web search (Wikipedia)', '🌐 Recherche web (Wikipédia)')}
            desc={<>{t('The model draws on Wikipedia excerpts and cites its sources. ', 'Le modèle s’appuie sur des extraits Wikipédia et cite ses sources. ')}<strong>{t('Only your question is sent', 'Seule votre question est envoyée')}</strong>{t(' to Wikipedia — never the conversation or your documents. Flagged under each affected reply, and a little slower (longer context).', ' à Wikipédia — jamais la conversation ni vos documents. Signalé sous chaque réponse concernée, et un peu plus lent (contexte plus long).')}</>}
          />
          <Check
            checked={showReasoning}
            onChange={setShowReasoning}
            title={t('🧠 Show the reasoning', '🧠 Afficher le raisonnement')}
            desc={<>{t('Reasoning models (DeepSeek-R1, Qwen3) think before answering. That reasoning is ', 'Les modèles de raisonnement (DeepSeek-R1, Qwen3) réfléchissent avant de répondre. Ce raisonnement est ')}<strong>{t('hidden by default', 'masqué par défaut')}</strong>{t(' — the answer is what you asked for. Enable this to read it.', ' — c’est la réponse qui vous intéresse. Activez ceci pour le lire.')}</>}
          />
          <Check
            checked={urlReadOn}
            onChange={setUrlReadOn}
            title={t('🔗 Read pasted links', '🔗 Lecture des liens collés')}
            desc={<>{t('Paste a URL into the chat and the model reads the page. ', 'Collez une URL dans le chat et le modèle lit la page. ')}<strong>{t('The link is sent to the r.jina.ai reader', 'Le lien est envoyé au lecteur r.jina.ai')}</strong>{t(" (third-party sites can't be fetched directly from a browser) — never the conversation.", ' (les sites tiers sont inaccessibles en direct depuis un navigateur) — jamais la conversation.')}</>}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
          {t('With no network option enabled, Brimkern stays ', 'Sans option réseau active, Brimkern reste ')}<strong>{t('100% local', '100 % local')}</strong>{t(': nothing leaves your machine. Coming soon: connecting to a personal MCP server — off by default and clearly flagged, like everything else.', ' : rien ne quitte votre machine. À venir : connexion à un serveur MCP personnel — désactivé par défaut et signalé clairement, comme le reste.')}
        </p>
      </div>
    </div>
  );
}
