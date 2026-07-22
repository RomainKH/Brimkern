"use client";

// The "Choisir un modèle" modal: two tabs (Modèles = preset grid + your added models + roadmap
// teasers, with search; Importer = local file / GGUF URL / streamed .brik), plus the BRIK-convert
// toggle. Pure presentation — every action/state is injected by the page (props share the page's
// names so the JSX is unchanged). Rendered via createPortal from the page when browseOpen is true.

import { useEffect, useState, type Dispatch, type SetStateAction, type DragEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import { Database, X, Flame, Upload, Search, Info, Play, Download, Package, Wifi, WifiOff, Signal, SignalLow, SignalMedium, Timer, Feather, HardDriveDownload, Cpu, Gauge } from 'lucide-react';
import { PRESET_MODELS, TOKENIZER_PRESETS } from '@/lib/presets';
import { COMING_SOON, MODALITY_PILL, normModelName } from '@/lib/modelCatalog';
import { type WeightDType } from '@/lib/brik/convert';
import { useNetworkStatus, estimateDownloadSeconds, formatDuration, type NetTier } from '@/lib/useNetworkStatus';
import { useGpuCapability, gpuVerdict, type GpuVerdict } from '@/lib/useGpuCapability';
import { isStoragePersisted, requestPersistentStorage } from '@/lib/storage';
import { useT } from '@/lib/i18n';

type UserModel = { url?: string; name: string; kind: 'gguf' | 'brik' | 'local' };
type ModelState = 'idle' | 'initializing' | 'loading' | 'ready' | 'generating' | 'error';

interface Props {
  setBrowseOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: 'models' | 'import';
  setActiveTab: Dispatch<SetStateAction<'models' | 'import'>>;
  modelState: ModelState;
  autoConvert: boolean;
  setAutoConvert: Dispatch<SetStateAction<boolean>>;
  convertTier: WeightDType;
  setConvertTier: Dispatch<SetStateAction<WeightDType>>;
  modelQuery: string;
  setModelQuery: Dispatch<SetStateAction<string>>;
  isMobile: boolean;
  showAllModels: boolean;
  setShowAllModels: Dispatch<SetStateAction<boolean>>;
  loadedModelName: string;
  isCached: (url?: string) => boolean;
  userModels: UserModel[];
  setUserModels: Dispatch<SetStateAction<UserModel[]>>;
  benchRunning: boolean;
  handleUnloadModel: () => void;
  handleLoadModelFromUrl: (url: string) => void | Promise<void>;
  handleStreamBrik: (urlOverride?: string) => void | Promise<void>;
  // Recharge un .brik importé depuis l'IndexedDB (bibliothèque) — false si absent → re-import.
  loadLocalBrikFromCache?: (name: string) => Promise<boolean>;
  handleLoadLocalModel: () => void | Promise<void>;
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: DragEvent) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  customHFUrl: string;
  setCustomHFUrl: Dispatch<SetStateAction<string>>;
  brikUrl: string;
  setBrikUrl: Dispatch<SetStateAction<string>>;
  selectedTokenizerId: string;
  setSelectedTokenizerId: Dispatch<SetStateAction<string>>;
  isDragging: boolean;
  // Load a text→image model (currently the SD-Turbo placeholder). Enables the "Charger (aperçu)"
  // button on the text2img teaser card. Optional — without it the card stays "Bientôt".
  onLoadImageModel?: () => void;
  // Charge le modèle VISION (Qwen2-VL 2B, desktop) — la carte « vision » devient chargeable.
  onLoadVisionModel?: () => void;
}

const fmtBytes = (bytes: number, dm = 2) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function ModelBrowserModal({
  setBrowseOpen, activeTab, setActiveTab, modelState, autoConvert, setAutoConvert, convertTier, setConvertTier,
  modelQuery, setModelQuery, isMobile, showAllModels, setShowAllModels, loadedModelName, isCached,
  userModels, setUserModels, benchRunning, handleUnloadModel, handleLoadModelFromUrl, handleStreamBrik, loadLocalBrikFromCache,
  handleLoadLocalModel, handleDragOver, handleDragLeave, handleDrop, handleFileChange,
  selectedFile, setSelectedFile, customHFUrl, setCustomHFUrl, brikUrl, setBrikUrl,
  selectedTokenizerId, setSelectedTokenizerId, isDragging, onLoadImageModel, onLoadVisionModel,
}: Props) {
  const t = useT();
  const formatBytes = fmtBytes;

  // Connexion + persistance — surfacés au moment où l'utilisateur choisit un modèle (potentiellement
  // plusieurs Go). Lecture propre à la modale (aucun état à câbler depuis la page), à l'image de
  // StoragePanel qui lit son propre stockage.
  const net = useNetworkStatus();
  const gpu = useGpuCapability(isMobile);
  // Verdict d'accessibilité par modèle selon le GPU détecté (estimation VRAM — jamais bloquant).
  const gpuMeta: Record<GpuVerdict, { label: string; color: string }> = {
    good: { label: t('Runs well', 'Tourne bien'), color: 'var(--success)' },
    tight: { label: t('Tight', 'Limite'), color: '#f59e0b' },
    heavy: { label: t('Heavy for this GPU', 'Lourd pour ce GPU'), color: 'var(--accent)' },
  };
  const verdictFor = (paramsB: number, name: string): GpuVerdict | null =>
    gpu.probed && gpu.supported && paramsB > 0 ? gpuVerdict(paramsB, name, gpu, isMobile) : null;
  const [persisted, setPersisted] = useState<boolean | null>(null);
  useEffect(() => { isStoragePersisted().then(setPersisted).catch(() => setPersisted(null)); }, []);
  const askPersist = async () => { try { setPersisted(await requestPersistentStorage()); } catch { /* ignore */ } };
  // Un modèle est « léger » s'il est marqué mobile ou pèse ≤ 1 Go — les candidats mis en avant sur
  // une connexion faible.
  const isLight = (sizeBytes: number, mobile: boolean) => mobile || sizeBytes <= 1e9;
  // Temps de téléchargement estimé pour un modèle non mis en cache (null si pas de débit connu).
  const etaFor = (sizeBytes: number): string | null => {
    const s = estimateDownloadSeconds(sizeBytes, net.downlinkMbps);
    return s == null ? null : formatDuration(s);
  };
  const tierMeta: Record<NetTier, { label: string; color: string; Icon: typeof Wifi }> = {
    fast: { label: t('Fast connection', 'Connexion rapide'), color: 'var(--success)', Icon: Wifi },
    moderate: { label: t('Moderate connection', 'Connexion moyenne'), color: '#f59e0b', Icon: SignalMedium },
    slow: { label: t('Slow connection', 'Connexion lente'), color: 'var(--accent)', Icon: SignalLow },
    offline: { label: t('Offline', 'Hors ligne'), color: 'var(--accent)', Icon: WifiOff },
    unknown: { label: t('Connection', 'Connexion'), color: 'var(--text-muted)', Icon: Signal },
  };
  const tm = tierMeta[net.tier];

  const hiddenOnMobile = isMobile && !showAllModels && PRESET_MODELS.some((m) => !m.mobile);
  const visibleModels = isMobile && !showAllModels ? PRESET_MODELS.filter((m) => m.mobile) : PRESET_MODELS;
  const modelQ = modelQuery.trim().toLowerCase();
  const shownModels = modelQ
    ? visibleModels.filter((m) => `${m.name} ${m.desc} ${m.useCase} ${m.tags.join(' ')}`.toLowerCase().includes(modelQ))
    : visibleModels;
  const shownComingSoon = modelQ
    ? COMING_SOON.filter((m) => `${m.vendor} ${m.name} ${m.desc} ${MODALITY_PILL[m.modality].label} ${m.tags.join(' ')}`.toLowerCase().includes(modelQ))
    : COMING_SOON;
  const shownUserModels = modelQ
    ? userModels.filter((m) => `${m.name} ${m.url ?? ''} ${m.kind}`.toLowerCase().includes(modelQ))
    : userModels;

  return (
            <div onClick={() => setBrowseOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: '100%', maxWidth: 880, height: '85vh', display: 'flex', flexDirection: 'column', padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexShrink: 0 }}>
              <Database size={18} style={{ color: 'var(--accent)' }} />
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 18, flex: 1 }}>{t('Choose a model', 'Choisir un modèle')}</h2>
              <button onClick={() => setBrowseOpen(false)} className="circle-btn" style={{ width: 30, height: 30 }} title={t('Close', 'Fermer')}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', margin: '0 -4px', padding: '0 4px' }}>
            <div className="card" style={{ padding: '12px' }}>
              <div className="tabs-container" style={{ gap: '2px' }}>
                <button
                  className={`tab-btn ${activeTab === 'models' ? 'active' : ''}`}
                  onClick={() => setActiveTab('models')}
                  disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                  style={{ fontSize: '12px', padding: '8px 4px' }}
                >
                  <Flame size={13} /> {t('Models', 'Modèles')}
                </button>
                <button
                  className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
                  onClick={() => setActiveTab('import')}
                  disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                  style={{ fontSize: '12px', padding: '8px 4px' }}
                >
                  <Upload size={13} /> {t('Import / URL', 'Importer / URL')}
                </button>
              </div>

              {/* Auto-convert GGUF → BRIK at load (cached). Applies to GGUF loads (presets + import). */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', padding: '8px 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={autoConvert}
                      onChange={(e) => setAutoConvert(e.target.checked)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    />
                    <span>⚡ {t('Convert to ', 'Convertir en ')}<strong>BRIK</strong>{t(' at load time', ' au chargement')} <span style={{ color: 'var(--text-muted)' }}>{t('(cached, done once)', '(mis en cache, 1 seule fois)')}</span></span>
                  </label>
                  {autoConvert && (
                    <select
                      className="input-control"
                      style={{ fontSize: '11px', padding: '4px 6px', width: 'auto' }}
                      value={convertTier}
                      onChange={(e) => setConvertTier(e.target.value as WeightDType)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                      title={t('Precision stored in the converted BRIK', 'Précision stockée dans le BRIK converti')}
                    >
                      <option value="q8">{t('Balanced ★ (int8)', 'Équilibré ★ (int8)')}</option>
                      <option value="mixed">{t('Mixed (int4 + int8 attention)', 'Mixte (int4 + attention int8)')}</option>
                      <option value="q4">{t('Light (int4, big models)', 'Léger (int4, gros modèles)')}</option>
                      <option value="q3">{t('Extra-light (int3, big models)', 'Extra-léger (int3, gros modèles)')}</option>
                      <option value="f16">{t('Quality (f16)', 'Qualité (f16)')}</option>
                    </select>
                  )}
                </div>

              {activeTab === 'models' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Barre d'état : qualité de connexion (débit) + persistance locale (« au plus sur la
                      machine »). Non bloquant — sur Firefox/Safari, sans API réseau, seul l'état
                      en ligne/hors ligne s'affiche. */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <span
                      title={net.saveData ? t('Data Saver is on — light models suggested.', 'Économiseur de données actif — modèles légers suggérés.') : net.hasInfo ? t('Connection quality detected from the browser.', 'Qualité de connexion détectée par le navigateur.') : t('Connection speed unavailable in this browser.', 'Vitesse de connexion indisponible dans ce navigateur.')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', color: tm.color, background: `color-mix(in srgb, ${tm.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${tm.color} 35%, transparent)` }}
                    >
                      <tm.Icon size={12} /> {tm.label}
                      {net.downlinkMbps != null && <span style={{ opacity: 0.8, fontWeight: 500 }}>· ~{net.downlinkMbps} Mbps</span>}
                      {net.saveData && <span style={{ opacity: 0.8, fontWeight: 500 }}>· {t('data saver', 'éco. données')}</span>}
                    </span>
                    {gpu.probed && gpu.supported && (
                      <span
                        title={t('Model accessibility below is estimated from your GPU (WebGPU has no VRAM API — approximate).', 'L’accessibilité des modèles ci-dessous est estimée depuis ton GPU (WebGPU n’expose pas la VRAM — approximatif).') + (gpu.adapterInfo ? `\n${gpu.adapterInfo}` : '')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', color: gpu.tier === 'high' ? 'var(--success)' : 'var(--text-secondary)', background: gpu.tier === 'high' ? 'color-mix(in srgb, var(--success) 12%, transparent)' : 'var(--bg-card-hover, rgba(127,127,127,0.12))', border: `1px solid ${gpu.tier === 'high' ? 'color-mix(in srgb, var(--success) 35%, transparent)' : 'var(--border-color)'}` }}
                      >
                        <Cpu size={12} /> {gpu.tier === 'high' ? t('Capable GPU', 'GPU costaud') : t('Modest GPU', 'GPU modeste')}
                        <span style={{ opacity: 0.8, fontWeight: 500 }}>· ~{gpu.budgetGB} {t('GB', 'Go')}</span>
                      </span>
                    )}
                    {persisted === true ? (
                      <span
                        title={t('Downloaded models are kept on this device and protected from automatic eviction.', 'Les modèles téléchargés sont gardés sur cet appareil et protégés de l’éviction automatique.')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', color: 'var(--success)', background: 'color-mix(in srgb, var(--success) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--success) 40%, transparent)' }}
                      >
                        <HardDriveDownload size={12} /> {t('Kept on device', 'Gardé sur l’appareil')}
                      </span>
                    ) : persisted === false ? (
                      <button
                        onClick={askPersist}
                        title={t('Ask the browser to keep downloaded models on this device (protects the multi-GB cache from automatic eviction).', 'Demander au navigateur de garder les modèles téléchargés sur cet appareil (protège le cache multi-Go de l’éviction automatique).')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', cursor: 'pointer', color: 'var(--text-secondary)', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', border: '1px dashed var(--border-color)' }}
                      >
                        <HardDriveDownload size={12} /> {t('Keep on my device', 'Garder sur mon appareil')}
                      </button>
                    ) : null}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      className="input-control"
                      type="text"
                      value={modelQuery}
                      onChange={(e) => setModelQuery(e.target.value)}
                      placeholder={t('Search models (name, use case, tag…)', 'Rechercher un modèle (nom, usage, tag…)')}
                      style={{ width: '100%', fontSize: '12px', padding: '7px 9px 7px 28px' }}
                    />
                    {modelQuery && (
                      <button onClick={() => setModelQuery('')} className="circle-btn" style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', width: 22, height: 22 }} title={t('Clear', 'Effacer')}>
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {modelQ
                      ? `${shownModels.length + shownUserModels.length + shownComingSoon.length} ${(shownModels.length + shownUserModels.length + shownComingSoon.length) > 1 ? t('results', 'résultats') : t('result', 'résultat')}`
                      : (isMobile && !showAllModels ? t('Lightweight models suited to mobile:', 'Modèles légers adaptés au mobile :') : `${shownModels.length + userModels.length} ${t('models ready', 'modèles prêts')} · ${COMING_SOON.length} ${t('coming soon', 'à venir')}`)}
                  </div>
                  {/* Reco non intrusive sur connexion faible : on met en avant les modèles légers sans
                      masquer ni réordonner les autres (ils restent choisissables). */}
                  {net.preferLight && !modelQ && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: `color-mix(in srgb, ${tm.color} 8%, transparent)`, border: `1px dashed color-mix(in srgb, ${tm.color} 35%, transparent)`, borderRadius: '10px', padding: '9px 11px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      <Feather size={13} style={{ color: tm.color, flexShrink: 0, marginTop: 1 }} />
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {net.tier === 'offline'
                            ? t('You appear to be offline.', 'Vous semblez hors ligne.')
                            : net.saveData
                              ? t('Data Saver is on.', 'Économiseur de données actif.')
                              : t('Slow connection detected.', 'Connexion lente détectée.')}
                        </strong>{' '}
                        {net.tier === 'offline'
                          ? t('Only already-downloaded models (marked “Downloaded”) will load without network.', 'Seuls les modèles déjà téléchargés (badge « Téléchargé ») se chargeront sans réseau.')
                          : t('Lightweight models (marked ', 'Les modèles légers (marqués ')}
                        {net.tier !== 'offline' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'middle', color: 'var(--success)', fontWeight: 700 }}><Feather size={10} /> {t('Light', 'Léger')}</span>
                        )}
                        {net.tier !== 'offline' && t(') download faster and are recommended here.', ') se téléchargent plus vite et sont conseillés ici.')}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
                  {shownModels.map((model, idx) => {
                    const isCurrentlyLoaded = !!loadedModelName && modelState !== 'initializing' && normModelName(loadedModelName) === normModelName(model.url.split('/').pop() || '');
                    const paramsB = parseFloat(model.name.match(/(\d+(?:\.\d+)?)\s*B/i)?.[1] || '0');
                    const brikWorth = paramsB >= 1.5;
                    const cached = isCached(model.url);
                    const light = isLight(model.sizeBytes, model.mobile);
                    const eta = !cached ? etaFor(model.sizeBytes) : null;
                    const gv = verdictFor(paramsB, model.name);
                    return (
                      <div
                        key={idx}
                        className="model-card"
                        style={{
                          background: isCurrentlyLoaded ? 'rgba(34, 197, 94, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                          border: isCurrentlyLoaded ? '1px solid rgba(34, 197, 94, 0.45)' : '1px solid var(--border-color)',
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          position: 'relative',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{model.vendor} · </span>{model.name.split(' (')[0]}
                          </span>
                          <span
                            style={{ fontSize: '9.5px', padding: '2px 7px', borderRadius: '999px', fontWeight: 700, whiteSpace: 'nowrap', background: 'var(--accent-bg-rgba)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', flexShrink: 0, maxWidth: '46%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {model.useCase}
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                          {model.desc}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {cached && (
                            // Pastille PLEINE (état acquis) vs verdicts estimés en contour teinté (« Tourne bien »…) — sinon deux pastilles vertes identiques qui se confondent.
                            <span title={t('Already downloaded locally → loads without network.', 'Déjà téléchargé localement → chargement sans réseau.')} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--success)', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><HardDriveDownload size={10} /> {t('Downloaded', 'Téléchargé')}</span>
                          )}
                          {net.preferLight && light && !cached && (
                            <span title={t('Lightweight model — a good pick on a slow connection.', 'Modèle léger — un bon choix sur une connexion lente.')} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'color-mix(in srgb, var(--success) 14%, transparent)', color: 'var(--success)', border: '1px solid color-mix(in srgb, var(--success) 45%, transparent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Feather size={10} /> {t('Light', 'Léger')}</span>
                          )}
                          {eta && (
                            <span title={t('Estimated download time on your connection (one time — then it’s cached).', 'Temps de téléchargement estimé sur ta connexion (une seule fois — ensuite c’est en cache).')} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', color: 'var(--text-muted)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Timer size={10} /> ~{eta}</span>
                          )}
                          {gv && (
                            <span title={t('Estimated fit on your GPU (approximate — WebGPU exposes no VRAM).', 'Adéquation estimée à ton GPU (approximatif — WebGPU n’expose pas la VRAM).')} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: `color-mix(in srgb, ${gpuMeta[gv].color} 14%, transparent)`, color: gpuMeta[gv].color, border: `1px solid color-mix(in srgb, ${gpuMeta[gv].color} 45%, transparent)`, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Gauge size={10} /> {gpuMeta[gv].label}</span>
                          )}
                          <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: MODALITY_PILL.text.bg, color: MODALITY_PILL.text.fg, border: `1px solid ${MODALITY_PILL.text.fg}33`, fontWeight: 700 }}>{MODALITY_PILL.text.label}</span>
                          {model.tags.map((t, ti) => (
                            <span key={ti} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', color: 'var(--text-muted)' }}>{t}</span>
                          ))}
                          {brikWorth && (
                            <span
                              title={t('BRIK conversion recommended: int4/int8 resident → ÷2–4 VRAM (the model fits + loads faster), and the converted file is cached for instant reopenings. Enable "Convert to BRIK" before loading.', 'Conversion BRIK conseillée : int4/int8 résident → ÷2–4 la VRAM (le modèle tient + charge plus vite), et le fichier converti est mis en cache pour des réouvertures instantanées. Active « Convertir en BRIK » avant de charger.')}
                              style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--accent-bg-rgba)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', fontWeight: 700 }}
                            >
                              {t('↓ BRIK recommended', '↓ BRIK conseillé')}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }} title={t('Runs on our own WGSL kernels (not a generic runtime).', 'Tourne sur nos kernels WGSL maison (pas un runtime générique).')}>
                            {paramsB > 0 ? `~${paramsB}B · ` : ''}{model.size} · {model.name.match(/\(([^)]+)\)/)?.[1] || 'GGUF'}
                          </span>
                          {isCurrentlyLoaded ? (
                            <button
                              className="btn btn-danger"
                              style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }}
                              disabled={modelState === 'generating' || benchRunning}
                              onClick={handleUnloadModel}
                              title={t('Unload the active model', 'Décharger le modèle actif')}
                            >
                              {t('Unload', 'Décharger')}
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }}
                              disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                              onClick={() => handleLoadModelFromUrl(model.url)}
                            >
                              {t('Load', 'Charger')}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {shownUserModels.map((m, umIdx) => {
                    const active = m.kind !== 'local' && !!loadedModelName && modelState !== 'initializing' && normModelName(loadedModelName) === normModelName(m.url?.split('/').pop() || '');
                    const busy = modelState === 'initializing' || modelState === 'loading' || modelState === 'generating';
                    const kindLabel = m.kind === 'brik' ? 'BRIK (stream)' : m.kind === 'local' ? t('Local file', 'Fichier local') : 'GGUF (URL)';
                    return (
                      <div
                        key={`um-${m.url ?? m.name}-${umIdx}`}
                        className="model-card"
                        style={{
                          background: active ? 'rgba(34, 197, 94, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                          border: active ? '1px solid rgba(34, 197, 94, 0.45)' : '1px solid var(--border-color)',
                          borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.url ?? m.name}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{t('Added', 'Ajouté')} · </span>{m.name}
                          </span>
                          <button onClick={() => setUserModels((prev) => prev.filter((x) => !(x.kind === m.kind && x.name === m.name && x.url === m.url)))} title={t('Remove from the library', 'Retirer de la librairie')} style={{ flexShrink: 0, display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}><X size={14} /></button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {isCached(m.url) && (
                            // Pastille PLEINE (état acquis) vs verdicts estimés en contour teinté (« Tourne bien »…) — sinon deux pastilles vertes identiques qui se confondent.
                            <span title={t('Already downloaded locally → loads without network.', 'Déjà téléchargé localement → chargement sans réseau.')} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--success)', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><HardDriveDownload size={10} /> {t('Downloaded', 'Téléchargé')}</span>
                          )}
                          <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', color: 'var(--text-muted)' }}>{kindLabel}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                          {active ? (
                            <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled={modelState === 'generating' || benchRunning} onClick={handleUnloadModel} title={t('Unload the active model', 'Décharger le modèle actif')}>{t('Unload', 'Décharger')}</button>
                          ) : m.kind === 'local' ? (
                            // Un .brik importé est persisté en IndexedDB au premier chargement →
                            // « Recharger » le sert depuis le cache ; absent (GGUF local, quota,
                            // purge) → repli sur le sélecteur de fichier comme avant.
                            <button className="btn" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled={busy} onClick={async () => { if (!(await loadLocalBrikFromCache?.(m.name))) setActiveTab('import'); }} title={t('Reload from the local cache (falls back to re-selecting the file)', 'Recharger depuis le cache local (sinon re-sélection du fichier)')}>{t('Reload', 'Recharger')}</button>
                          ) : (
                            <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled={busy} onClick={() => m.kind === 'brik' ? handleStreamBrik(m.url) : handleLoadModelFromUrl(m.url!)}>{t('Load', 'Charger')}</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {shownComingSoon.map((m, idx) => {
                    const pill = MODALITY_PILL[m.modality];
                    // The text→image teaser is loadable (placeholder pipeline) when the page wires it.
                    const previewable = (m.modality === 'text2img' && !!onLoadImageModel) || (m.modality === 'vision' && !!onLoadVisionModel);
                    const loadPreview = m.modality === 'vision' ? onLoadVisionModel : onLoadImageModel;
                    return (
                      <div
                        key={`cs-${idx}`}
                        className="model-card"
                        style={{ background: previewable ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'rgba(255,255,255,0.015)', border: previewable ? '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' : '1px dashed var(--border-color)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', opacity: previewable ? 1 : 0.62 }}
                        aria-disabled={!previewable}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{m.vendor} · </span>{m.name}
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{m.desc}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: pill.bg, color: pill.fg, border: `1px solid ${pill.fg}33`, fontWeight: 700 }}>{pill.label}</span>
                          {m.tags.map((t, ti) => (
                            <span key={ti} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', color: 'var(--text-muted)' }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{m.params}</span>
                          {previewable ? (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }}
                              disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                              onClick={loadPreview}
                              title={t('Preview: real image decoder + placeholder generator (SD-Turbo pipeline in progress)', 'Aperçu : décodeur image réel + générateur placeholder (pipeline SD-Turbo en cours)')}
                            >
                              {t('Load (preview)', 'Charger (aperçu)')}
                            </button>
                          ) : (
                            <button className="btn" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled>{t('Soon', 'Bientôt')}</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                  {modelQ && shownModels.length === 0 && shownUserModels.length === 0 && shownComingSoon.length === 0 && (
                    <div style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {t('No model matches “', 'Aucun modèle ne correspond à « ')}{modelQuery}{t('”. You can also import a GGUF via the ', ' ». Tu peux aussi importer un GGUF via l’onglet ')}<strong>Local</strong>{t(' tab or a Hugging Face URL.', ' ou une URL Hugging Face.')}
                    </div>
                  )}

                  {isMobile && (hiddenOnMobile || showAllModels) && (
                    <button
                      className="btn"
                      style={{ fontSize: '11px', padding: '6px 10px', alignSelf: 'center' }}
                      onClick={() => setShowAllModels((v) => !v)}
                    >
                      {showAllModels ? t('Hide the heavy models', 'Masquer les modèles lourds') : t('Show all models (heavy ones included)', 'Afficher tous les modèles (lourds inclus)')}
                    </button>
                  )}

                  <div
                    style={{
                      background: 'color-mix(in srgb, var(--accent) 5%, transparent)',
                      border: '1px dashed color-mix(in srgb, var(--accent) 20%, transparent)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      marginTop: '6px'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Info size={12} style={{ color: 'var(--accent)' }} />
                      {t('Architectures & BRIK conversion', 'Architectures & conversion BRIK')}
                    </div>
                    {t('Our own WGSL kernels run ', 'Nos kernels WGSL maison exécutent ')}<strong>Qwen (2/2.5)</strong>, <strong>Gemma 2</strong> {t('and', 'et')} <strong>DeepSeek-R1 (distill Qwen)</strong>. {t('Any other GGUF imported via the ', "Tout autre GGUF importé via l'onglet ")}<strong>{t('Import', 'Importer')}</strong>{t(' tab runs too, as long as its architecture is supported.', ' tourne aussi, tant que son architecture est gérée.')}
                    <div style={{ marginTop: '6px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{t('Convert to BRIK?', 'Convertir en BRIK ?')}</strong> {t('Mostly worth it from ', 'Intéressant surtout dès ')}<strong>~1.5B</strong>{t(' (“BRIK recommended” badge): the weights are kept ', ' (badge « BRIK conseillé ») : les poids sont gardés en ')}<strong>{t('int4/int8 resident', 'int4/int8 résident')}</strong>{t(' (÷2–4 VRAM → the model fits and loads faster) and the converted file is cached for instant reopenings. For a 0.5B the gain is marginal — the raw GGUF is enough.', ' (÷2–4 la VRAM → le modèle tient et charge plus vite) et le fichier converti est mis en cache pour des réouvertures instantanées. Pour un 0.5B, le gain est marginal — le GGUF brut suffit.')}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'import' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* 1) Local file (.gguf / .brik) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>{t('Local file (.gguf / .brik)', 'Fichier local (.gguf / .brik)')}</div>
                    <div
                      className={`file-dropzone ${isDragging ? 'dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-picker')?.click()}
                    >
                      <Upload className="file-dropzone-icon" size={24} />
                      <span className="file-dropzone-text">{t('Drop a GGUF or BRIK model here', 'Glissez un modèle GGUF ou BRIK ici')}</span>
                      <span className="file-dropzone-subtext">{t('or click to open (.gguf / .brik)', 'ou cliquez pour ouvrir (.gguf / .brik)')}</span>
                      <input type="file" id="file-picker" accept=".gguf,.brik" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>
                    {selectedFile && (
                      <div className="selected-files-list">
                        <div className="file-item">
                          <div className="file-item-info">
                            <Upload size={12} style={{ color: 'var(--accent)' }} />
                            <span className="file-item-name" title={selectedFile.name}>{selectedFile.name}</span>
                            <span className="file-item-size">({formatBytes(selectedFile.size)})</span>
                          </div>
                          <button className="file-remove-btn" onClick={() => setSelectedFile(null)}><X size={14} /></button>
                        </div>
                      </div>
                    )}
                    <div className="input-group">
                      <span className="input-label">Tokenizer / architecture <span style={{ color: 'var(--text-muted)' }}>{t('(GGUF — a .brik embeds its own)', '(GGUF — un .brik embarque le sien)')}</span>{t(':', ' :')}</span>
                      <select className="input-control" value={selectedTokenizerId} onChange={(e) => setSelectedTokenizerId(e.target.value)} disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}>
                        {TOKENIZER_PRESETS.map((tk, idx) => (<option key={idx} value={tk.id}>{tk.name}</option>))}
                      </select>
                    </div>
                    <button className="btn btn-primary btn-block" onClick={handleLoadLocalModel} disabled={!selectedFile || modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}>
                      <Play size={14} /> {t('Load the local file', 'Charger le fichier local')}
                    </button>
                  </div>

                  {/* 2) GGUF by URL (Hugging Face direct) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>{t('GGUF URL (Hugging Face)', 'URL GGUF (Hugging Face)')}</div>
                    <input type="text" className="input-control" style={{ fontSize: '12px' }} placeholder="https://huggingface.co/…/model.gguf" value={customHFUrl} onChange={(e) => setCustomHFUrl(e.target.value)} disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'} />
                    <div className="input-group">
                      <span className="input-label">{t('Tokenizer:', 'Tokenizer :')}</span>
                      <select className="input-control" value={selectedTokenizerId} onChange={(e) => setSelectedTokenizerId(e.target.value)} disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}>
                        {TOKENIZER_PRESETS.map((tk, idx) => (<option key={idx} value={tk.id}>{tk.name}</option>))}
                      </select>
                    </div>
                    <button className="btn btn-primary btn-block" onClick={() => handleLoadModelFromUrl(customHFUrl.trim())} disabled={!customHFUrl.trim() || modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}>
                      <Download size={14} /> {t('Download & load', 'Télécharger & charger')}
                    </button>
                  </div>

                  {/* 3) Stream a hosted .brik by URL */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>{t('Stream a hosted .brik', 'Streamer un .brik hébergé')}</div>
                    <input className="input-control" style={{ fontSize: '12px' }} placeholder="https://…/model.brik" value={brikUrl} onChange={(e) => setBrikUrl(e.target.value)} disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'} />
                    <button className="btn btn-primary btn-block" onClick={() => handleStreamBrik()} disabled={!brikUrl.trim() || modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}>
                      <Download size={14} /> {t('Load via streaming', 'Charger en streaming')}
                    </button>
                    <Link href="/convert" className="btn btn-secondary btn-block" style={{ fontSize: '12px', textDecoration: 'none' }}>
                      <Package size={14} /> {t('Convert a GGUF → BRIK (dedicated page)', 'Convertir un GGUF → BRIK (page dédiée)')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            </div>
            </div>
            </div>
  );
}
