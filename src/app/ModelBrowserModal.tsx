"use client";

// The "Choisir un modèle" modal: two tabs (Modèles = preset grid + your added models + roadmap
// teasers, with search, plus the any-model field which also takes .gguf/.brik URLs; Importer =
// LOCAL file only — the by-URL blocks were removed 2026-08-18, the any-model field covers them and
// reads the tokenizer from the file), plus the BRIK-convert toggle. Pure presentation — every
// action/state is injected by the page (props share the page's names so the JSX is unchanged).
// Rendered via createPortal from the page when browseOpen is true.

import { useEffect, useState, type Dispatch, type SetStateAction, type DragEvent, type ChangeEvent } from 'react';
import { Database, X, Upload, Search, Info, Play, Wifi, WifiOff, Signal, SignalLow, SignalMedium, Feather, HardDriveDownload, DownloadCloud, Cpu, Gauge, AlertCircle, Film } from 'lucide-react';
import { PRESET_MODELS, TOKENIZER_PRESETS } from '@/lib/presets';
import { COMING_SOON, MODALITY_PILL, fmtModelSize, normModelName } from '@/lib/modelCatalog';
import { type WeightDType } from '@/lib/brik/convert';
import { useNetworkStatus, estimateDownloadSeconds, formatDuration, type NetTier } from '@/lib/useNetworkStatus';
import { useGpuCapability, gpuVerdict, type GpuVerdict } from '@/lib/useGpuCapability';
import { isStoragePersisted, requestPersistentStorage, storageEstimate } from '@/lib/storage';
import { useT } from '@/lib/i18n';
import HfModelInput from './HfModelInput';

// Exemples cliquables du champ « n'importe quel modèle » : des dépôts VÉRIFIÉS en ligne (un exemple
// mort ferait une première impression désastreuse à un visiteur venu de Hugging Face).
const HF_INPUT_EXAMPLES = [
  { label: 'LFM2.5 230M (.brik)', value: 'romainkh14/LFM2.5-230M_BRIK' },
  { label: 'Qwen3 0.6B (GGUF)', value: 'Qwen/Qwen3-0.6B-GGUF' },
  { label: 'Gemma 3 270M (GGUF)', value: 'unsloth/gemma-3-270m-it-GGUF' },
];

type UserModel = { url?: string; name: string; kind: 'gguf' | 'brik' | 'local' };
type ModelState = 'idle' | 'initializing' | 'loading' | 'ready' | 'generating' | 'error';

interface Props {
  setBrowseOpen: Dispatch<SetStateAction<boolean>>;
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
  handleStreamBrik: (url: string) => void | Promise<void>;
  // Recharge un .brik importé depuis l'IndexedDB (bibliothèque) — false si absent → re-import.
  loadLocalBrikFromCache?: (name: string) => Promise<boolean>;
  // Saisie libre « n'importe quel modèle du Hub » : rend un message d'erreur à afficher, ou null.
  onLoadFromInput?: (raw: string) => Promise<string | null>;
  handleLoadLocalModel: () => void | Promise<void>;
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: DragEvent) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  selectedTokenizerId: string;
  setSelectedTokenizerId: Dispatch<SetStateAction<string>>;
  isDragging: boolean;
  // Charge le modèle IMAGE (SD-Turbo ou SDXS-512) dans le chat — active le mode image. Ce sont les
  // deux seules topologies que le moteur exécute (cf. ChatApp.ImgModel).
  onLoadImageModel?: (choice?: 'sdturbo' | 'sdxs') => void;
  // Charge le modèle VISION (Qwen2-VL 2B, desktop) — la carte « vision » devient chargeable.
  onLoadVisionModel?: () => void;
  // Charge le pipeline VIDÉO (AnimateDiff, desktop) dans le chat — la carte vidéo devient un vrai
  // mode produit (§ 3 P2). Le labo /video-test a été retiré le 2026-08-19 : il faisait doublon.
  onLoadVideoModel?: () => void;
}

const fmtBytes = (bytes: number, dm = 2) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const parseParamsB = (name: string): number => {
  const mB = name.match(/(\d+(?:\.\d+)?)\s*B/i);
  if (mB) return parseFloat(mB[1]);
  const mM = name.match(/(\d+(?:\.\d+)?)\s*M/i);
  if (mM) return parseFloat(mM[1]) / 1000;
  return 0;
};

export function ModelBrowserModal({
  setBrowseOpen, modelState, autoConvert, setAutoConvert, convertTier, setConvertTier,
  modelQuery, setModelQuery, isMobile, showAllModels, setShowAllModels, loadedModelName, isCached,
  userModels, setUserModels, benchRunning, handleUnloadModel, handleLoadModelFromUrl, handleStreamBrik, loadLocalBrikFromCache, onLoadFromInput,
  handleLoadLocalModel, handleDragOver, handleDragLeave, handleDrop, handleFileChange,
  selectedFile, setSelectedFile,
  selectedTokenizerId, setSelectedTokenizerId, isDragging, onLoadImageModel, onLoadVisionModel, onLoadVideoModel,
}: Props) {
  const t = useT();
  // Les tailles et badges du catalogue sont des DONNÉES : elles se formatent selon la locale
  // active (elles étaient figées en français, y compris dans l'interface anglaise).
  const isFr = t('en', 'fr') === 'fr';
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
  // Persistance du cache : demandée une fois en SILENCE (Chrome décide seul, aucun dialogue) puis
  // seulement AFFICHÉE quand elle est accordée. L'ancien « Garder sur mon appareil » était un bouton
  // qui ne faisait rien de visible — cf. requestPersistentStorage.
  // Espace de stockage réellement disponible pour ce site. Chrome accorde une fraction de l'espace
  // disque (≈ 300 Go sur une machine avec 150 Go libres… mais ≈ 1,5 Go seulement en navigation privée
  // ou sur un profil éphémère). Un modèle plus gros que l'espace libre se télécharge, échoue à se
  // mettre en cache, et se re-télécharge à chaque visite : autant le dire AVANT le clic, puisqu'on
  // propose des modèles de plusieurs Go.
  const [freeBytes, setFreeBytes] = useState<number | null>(null);
  useEffect(() => {
    storageEstimate()
      .then((e) => { if (e && e.quota > 0) setFreeBytes(Math.max(0, e.quota - e.usage)); })
      .catch(() => { /* API absente → aucun avertissement, comme avant */ });
  }, []);
  const wontFit = (sizeBytes: number) => freeBytes !== null && sizeBytes > freeBytes;

  const [persisted, setPersisted] = useState<boolean | null>(null);
  useEffect(() => {
    isStoragePersisted()
      .then((p) => (p ? p : requestPersistentStorage()))
      .then(setPersisted)
      .catch(() => setPersisted(null));
  }, []);
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
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'text' | 'image' | 'video' | 'vision'>('all');

  const shownModels = modelQ
    ? visibleModels.filter((m) => {
        const tagStr = m.tags.map((tg) => `${tg.en} ${tg.fr}`).join(' ');
        return `${m.name} ${m.desc.en} ${m.desc.fr} ${m.useCase.en} ${m.useCase.fr} ${tagStr}`.toLowerCase().includes(modelQ);
      })
    : visibleModels;
  const shownComingSoon = modelQ
    ? COMING_SOON.filter((m) => {
        const descStr = `${m.desc.en} ${m.desc.fr}`;
        const tagStr = m.tags.map((tg) => `${tg.en} ${tg.fr}`).join(' ');
        // `params` reste une union (chaîne pour les modèles texte, {en,fr} pour les autres).
        const paramsStr = typeof m.params === 'object' ? `${m.params.en} ${m.params.fr}` : m.params;
        const badgeStr = m.badge ? `${m.badge.en} ${m.badge.fr}` : '';
        const ucStr = m.useCase ? `${m.useCase.en} ${m.useCase.fr}` : '';
        return `${m.vendor} ${m.name} ${descStr} ${MODALITY_PILL[m.modality].label.en} ${MODALITY_PILL[m.modality].label.fr} ${paramsStr} ${badgeStr} ${ucStr} ${tagStr}`.toLowerCase().includes(modelQ);
      })
    : COMING_SOON;
  const shownUserModels = modelQ
    ? userModels.filter((m) => `${m.name} ${m.url ?? ''} ${m.kind}`.toLowerCase().includes(modelQ))
    : userModels;

  // CE QUI EST DÉJÀ TÉLÉCHARGÉ PASSE DEVANT. Le catalogue s'affichait dans son ordre de rédaction,
  // donc un modèle qu'on a déjà sur son disque — le seul qui démarre sans réseau et sans attente —
  // pouvait se trouver en bas de grille, sous une demi-douzaine de modèles à télécharger. Le tri est
  // STABLE (Array.prototype.sort l'est depuis ES2019) : à l'intérieur de chaque groupe, l'ordre du
  // catalogue est conservé au lieu d'être remplacé par un ordre arbitraire. Et il ne se voit que
  // s'il y a au moins un modèle en cache — sinon la fonction de comparaison rend 0 partout et la
  // grille est identique à avant.
  const enCacheDabord = <T extends { url?: string }>(liste: T[]): T[] =>
    [...liste].sort((a, b) => Number(isCached(b.url)) - Number(isCached(a.url)));

  const filteredModels = (categoryFilter === 'all' || categoryFilter === 'text') ? enCacheDabord(shownModels) : [];
  const filteredUserModels = (categoryFilter === 'all' || categoryFilter === 'text') ? enCacheDabord(shownUserModels) : [];
  const filteredComingSoon = categoryFilter === 'all'
    ? shownComingSoon
    : categoryFilter === 'text'
      ? shownComingSoon.filter((m) => m.modality === 'text')
      : categoryFilter === 'image'
        ? shownComingSoon.filter((m) => m.modality === 'text2img')
        : categoryFilter === 'vision'
          ? shownComingSoon.filter((m) => m.modality === 'vision')
          : [];
  const showVideoLab = (!isMobile && (categoryFilter === 'all' || categoryFilter === 'video') && (!modelQ || 'video vidéo clip animation labo'.includes(modelQ)));
  const totalCount = filteredModels.length + filteredUserModels.length + filteredComingSoon.length + (showVideoLab ? 1 : 0);

  return (
            <div onClick={() => setBrowseOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {/* Glisser-déposer d'un .gguf/.brik sur la modale. Les gestionnaires existaient et
                n'étaient plus câblés depuis la refonte des onglets : déposer un fichier ne faisait
                plus rien, en silence. La bordure d'accent est le seul retour que l'utilisateur a
                pour savoir que la zone accepte le fichier. */}
            <div
              onClick={(e) => e.stopPropagation()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="card"
              style={{
                width: '100%', maxWidth: 880, height: '85vh', display: 'flex', flexDirection: 'column', padding: 22,
                border: isDragging ? '2px dashed var(--accent)' : undefined,
                background: isDragging ? 'color-mix(in srgb, var(--accent) 6%, var(--bg-card))' : undefined,
              }}
            >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexShrink: 0, flexWrap: 'wrap' }}>
              <Database size={18} style={{ color: 'var(--accent)' }} />
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 18 }}>{t('Choose a model', 'Choisir un modèle')}</h2>
              {loadedModelName && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--success, #22c55e)',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    maxWidth: '100%',
                  }}
                  title={t('Currently active model in memory', 'Modèle actuellement actif en mémoire')}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success, #22c55e)', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t('Active:', 'Actif :')} <strong>{loadedModelName.split(' (')[0]}</strong>
                  </span>
                </div>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '11.5px', padding: '5px 10px', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => document.getElementById('local-model-file-picker')?.click()}
                  title={t('Load a local .gguf or .brik file from your computer', 'Charger un fichier .gguf ou .brik local depuis votre ordinateur')}
                >
                  <Upload size={13} style={{ color: 'var(--accent)' }} />
                  <span>{t('Local file (.gguf/.brik)', 'Fichier local (.gguf/.brik)')}</span>
                </button>
                <input
                  type="file"
                  id="local-model-file-picker"
                  accept=".gguf,.brik"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button onClick={() => setBrowseOpen(false)} className="circle-btn" style={{ width: 30, height: 30 }} title={t('Close', 'Fermer')}><X size={16} /></button>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', margin: '0 -4px', padding: '0 4px' }}>
            <div className="card" style={{ padding: '12px' }}>
              {selectedFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1.5px solid var(--accent)', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <Upload size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontWeight: 600, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{formatBytes(selectedFile.size)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <select
                      className="input-control"
                      style={{ fontSize: '11px', padding: '3px 6px', width: 'auto' }}
                      value={selectedTokenizerId}
                      onChange={(e) => setSelectedTokenizerId(e.target.value)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                      title={t('Tokenizer architecture', 'Architecture du tokenizer')}
                    >
                      {TOKENIZER_PRESETS.map((tk, idx) => (<option key={idx} value={tk.id}>{tk.name}</option>))}
                    </select>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                      onClick={handleLoadLocalModel}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      <Play size={12} /> {t('Load', 'Charger')}
                    </button>
                    <button className="circle-btn" style={{ width: 24, height: 24 }} onClick={() => setSelectedFile(null)} title={t('Cancel', 'Annuler')}>
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Auto-convert GGUF → BRIK at load (cached). Applies to GGUF loads (presets + import). */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingBottom: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Barre d'état : qualité de connexion (débit) + persistance locale (« au plus sur la
                      machine »). Non bloquant — sur Firefox/Safari, sans API réseau, seul l'état
                      en ligne/hors ligne s'affiche. */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <span
                      title={net.saveData ? t('Data Saver is on: light models suggested.', 'Économiseur de données actif : modèles légers suggérés.') : net.hasInfo ? t('Connection quality detected from the browser.', 'Qualité de connexion détectée par le navigateur.') : t('Connection speed unavailable in this browser.', 'Vitesse de connexion indisponible dans ce navigateur.')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', color: tm.color, background: `color-mix(in srgb, ${tm.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${tm.color} 35%, transparent)` }}
                    >
                      <tm.Icon size={12} /> {tm.label}
                      {net.downlinkMbps != null && <span style={{ opacity: 0.8, fontWeight: 500 }}>· ~{net.downlinkMbps} Mbps</span>}
                      {net.saveData && <span style={{ opacity: 0.8, fontWeight: 500 }}>· {t('data saver', 'éco. données')}</span>}
                    </span>
                    {gpu.probed && gpu.supported && (
                      <span
                        title={t('Model accessibility below is estimated from your GPU (WebGPU has no VRAM API: approximate).', 'L’accessibilité des modèles ci-dessous est estimée depuis ton GPU (WebGPU n’expose pas la VRAM : approximatif).') + (gpu.adapterInfo ? `\n${gpu.adapterInfo}` : '')}
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
                    ) : null}
                  </div>
                  {onLoadFromInput && (
                    <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg-card-hover, rgba(127,127,127,0.07))', border: '1px solid var(--border-color)' }}>
                      <HfModelInput
                        onLoad={onLoadFromInput}
                        disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                        compact
                        examples={HF_INPUT_EXAMPLES}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      padding: '4px',
                      borderRadius: '8px',
                      background: 'var(--bg-sidebar, rgba(127,127,127,0.08))',
                      border: '1px solid var(--border-color)',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    {[
                      { id: 'all', icon: '✨', label: { en: 'All', fr: 'Tous' } },
                      { id: 'text', icon: '💬', label: { en: 'Text & Chat (LLM)', fr: 'Texte & Chat (LLM)' } },
                      { id: 'image', icon: '🎨', label: { en: 'Image Generation', fr: 'Génération Image' } },
                      ...(!isMobile ? [{ id: 'video', icon: '🎬', label: { en: 'Video Generation', fr: 'Génération Vidéo' } }] : []),
                      { id: 'vision', icon: '👁️', label: { en: 'Vision / Analysis', fr: 'Vision / Analyse' } },
                    ].map((cat) => {
                      const active = categoryFilter === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategoryFilter(cat.id as any)}
                          disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                          style={{
                            fontSize: '11.5px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: active ? '1px solid var(--accent)' : '1px solid transparent',
                            background: active ? 'var(--accent)' : 'transparent',
                            color: active ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 500,
                            boxShadow: active ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                          }}
                        >
                          <span>{cat.icon}</span>
                          <span>{t(cat.label.en, cat.label.fr)}</span>
                        </button>
                      );
                    })}
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
                      ? `${totalCount} ${totalCount > 1 ? t('results', 'résultats') : t('result', 'résultat')}`
                      : (isMobile && !showAllModels ? t('Lightweight models suited to mobile:', 'Modèles légers adaptés au mobile :') : `${totalCount} ${t('models', 'modèles')}`)}
                  </div>
                  {net.preferLight && !modelQ && categoryFilter !== 'image' && categoryFilter !== 'video' && (
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
                          : t('The smallest models download faster: check the size on each card.', 'Les plus petits modèles se téléchargent plus vite : regardez la taille sur chaque carte.')}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
                  {filteredModels.map((model) => {
                    const isCurrentlyLoaded = !!loadedModelName && modelState !== 'initializing' && normModelName(loadedModelName) === normModelName(model.url.split('/').pop() || '');
                    const paramsB = parseParamsB(model.name);
                    const cached = isCached(model.url);
                    const eta = !cached ? etaFor(model.sizeBytes) : null;
                    const gv = verdictFor(paramsB, model.name);
                    const tooBig = !cached && wontFit(model.sizeBytes);
                    const gvMeta = gv ? gpuMeta[gv] : { label: t('Unknown GPU compatibility', 'Compatibilité GPU inconnue'), color: 'var(--text-muted)' };
                    return (
                      // Ni description ni tags EN TEXTE sur les cartes (décision 2026-08-13) : « mobile »,
                      // « récurrent v2 », « apache » ne servent pas à CHOISIR, et un paragraphe par carte
                      // remplissait l'écran (588 mots mesurés). Restent les trois signaux qui décident
                      // vraiment : déjà téléchargé, est-ce que ça tournera sur ce GPU, et la modalité.
                      // La description reste utile pour deux choses, sans occuper un pixel : elle
                      // alimente la RECHERCHE (`shownModels`) et sert d'infobulle native ici — avant,
                      // le champ n'était plus lu par rien après avoir été traduit.
                      <div
                        key={model.url}
                        className="model-card"
                        title={t(model.desc.en, model.desc.fr)}
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
                        {tooBig && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: '10px', lineHeight: 1.35, color: 'var(--warning, #a86a0c)' }}>
                            <AlertCircle size={11} style={{ flexShrink: 0, marginTop: 1 }} />
                            <span>{t(`Larger than the ${fmtBytes(freeBytes || 0, 0)} your browser allows here: it won't stay cached.`,
                                     `Plus gros que les ${fmtBytes(freeBytes || 0, 0)} que le navigateur accorde ici : il ne restera pas en cache.`)}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', width: '100%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{model.vendor} · </span>{model.name.split(' (')[0]}
                          </span>
                          <span
                            style={{ fontSize: '9.5px', padding: '2px 7px', borderRadius: '999px', fontWeight: 700, whiteSpace: 'nowrap', background: 'var(--accent-bg-rgba)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {t(model.useCase.en, model.useCase.fr)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {cached && (
                            <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', border: '1px solid rgba(34, 197, 94, 0.3)', fontWeight: 600 }}>
                              {t('Downloaded', 'Téléchargé')}
                            </span>
                          )}
                          {!cached && eta && (
                            <span
                              title={t('Estimated download time based on current connection speed', 'Temps de téléchargement estimé selon votre connexion')}
                              style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            >
                              <DownloadCloud size={10} /> ~{eta}
                            </span>
                          )}
                          <span
                            title={t('Estimated fit on your GPU (approximate: WebGPU exposes no VRAM).', 'Adéquation estimée à ton GPU (approximatif : WebGPU n’expose pas la VRAM).')}
                            style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: `color-mix(in srgb, ${gvMeta.color} 15%, transparent)`, color: gvMeta.color, border: `1px solid ${gvMeta.color}40`, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                          >
                            <Gauge size={10} /> {gvMeta.label}
                          </span>
                          <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: MODALITY_PILL.text.bg, color: MODALITY_PILL.text.fg, border: `1px solid ${MODALITY_PILL.text.fg}33`, fontWeight: 600 }}>
                            {t(MODALITY_PILL.text.label.en, MODALITY_PILL.text.label.fr)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {fmtModelSize(model.sizeBytes, isFr)}
                          </span>
                          {isCurrentlyLoaded ? (
                            // Libérer la VRAM depuis l'endroit où on choisit un modèle : l'état « Actif »
                            // en texte mort obligeait à fermer la modale pour trouver le déchargement.
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
                  {filteredUserModels.map((m, umIdx) => {
                    const isCurrentlyLoaded = !!loadedModelName && normModelName(loadedModelName) === normModelName(m.name);
                    const busy = modelState === 'initializing' || modelState === 'loading' || modelState === 'generating';
                    return (
                      <div
                        key={`um-${m.url ?? m.name}-${umIdx}`}
                        className="model-card"
                        style={{
                          background: isCurrentlyLoaded ? 'rgba(34, 197, 94, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                          border: isCurrentlyLoaded ? '1px solid rgba(34, 197, 94, 0.45)' : '1px solid var(--border-color)',
                          borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.url ?? m.name}>
                            {m.name}
                          </span>
                          <button onClick={() => setUserModels((prev) => prev.filter((x) => !(x.kind === m.kind && x.name === m.name && x.url === m.url)))} title={t('Remove from the library', 'Retirer de la librairie')} style={{ flexShrink: 0, display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}><X size={14} /></button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', color: 'var(--text-muted)' }}>
                            {m.kind === 'brik' ? 'BRIK (stream)' : m.kind === 'local' ? t('Local file', 'Fichier local') : 'GGUF'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                          {isCurrentlyLoaded ? (
                            <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled={modelState === 'generating' || benchRunning} onClick={handleUnloadModel} title={t('Unload the active model', 'Décharger le modèle actif')}>{t('Unload', 'Décharger')}</button>
                          ) : m.kind === 'local' ? (
                            <button className="btn" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled={busy} onClick={async () => {
                              // Un .brik importé est persisté en IndexedDB au premier chargement →
                              // « Recharger » le sert depuis le cache ; absent (GGUF local, quota,
                              // purge) → on ouvre le sélecteur de fichier. L'ancien repli appelait
                              // setActiveTab('import'), un onglet supprimé depuis : le bouton ne
                              // faisait alors plus rien du tout.
                              if (!(await loadLocalBrikFromCache?.(m.name))) document.getElementById('local-model-file-picker')?.click();
                            }} title={t('Reload from the local cache (falls back to re-selecting the file)', 'Recharger depuis le cache local (sinon re-sélection du fichier)')}>{t('Reload', 'Recharger')}</button>
                          ) : (
                            <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled={busy} onClick={() => m.kind === 'brik' ? handleStreamBrik(m.url!) : handleLoadModelFromUrl(m.url!)}>{t('Load', 'Charger')}</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredComingSoon.map((m, idx) => {
                    const pill = MODALITY_PILL[m.modality];
                    // CHARGEABLE = le moteur sait vraiment l'exécuter et ses poids sont hébergés. Les
                    // fiches SDXL/DiT (RealVisXL, FLUX…) restent des annonces : le pipeline n'a qu'un
                    // encodeur CLIP et pas de conditionnement additionnel. Une carte « Realistic Vision »
                    // qui chargeait en fait SD-Turbo sous un autre nom, c'est un mensonge d'interface.
                    const isAvailableImage = m.name.includes('SDXS') || m.name.includes('Stable Diffusion Turbo');
                    const previewable = (m.modality === 'text2img' && isAvailableImage && !!onLoadImageModel) || (m.modality === 'vision' && !!onLoadVisionModel);
                    const isCurrentlyLoaded = !!loadedModelName && (
                      normModelName(loadedModelName) === normModelName(m.name) ||
                      (m.modality === 'vision' && loadedModelName.includes('Qwen2-VL')) ||
                      (m.modality === 'text2img' && (
                        (m.name.includes('SDXS') && loadedModelName.includes('SDXS')) ||
                        (m.name.includes('Stable Diffusion Turbo') && loadedModelName.includes('Stable Diffusion Turbo'))
                      ))
                    );
                    const loadPreview = m.modality === 'vision'
                      ? onLoadVisionModel
                      : () => onLoadImageModel?.(m.name.includes('SDXS') ? 'sdxs' : 'sdturbo');
                    return (
                      <div
                        key={`cs-${idx}`}
                        className="model-card"
                        title={t(m.desc.en, m.desc.fr)}
                        style={{ background: isCurrentlyLoaded ? 'rgba(34, 197, 94, 0.06)' : previewable ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'rgba(255,255,255,0.015)', border: isCurrentlyLoaded ? '1px solid rgba(34, 197, 94, 0.45)' : previewable ? '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' : '1px dashed var(--border-color)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', opacity: (previewable || isCurrentlyLoaded) ? 1 : 0.62 }}
                        aria-disabled={!previewable && !isCurrentlyLoaded}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', width: '100%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{m.vendor} · </span>{m.name}
                          </span>
                          {m.badge ? (
                            <span
                              style={{
                                fontSize: '9.5px', padding: '2px 7px', borderRadius: '999px', fontWeight: 700, whiteSpace: 'nowrap',
                                background: m.badge.bg ?? 'var(--accent-bg-rgba)', color: m.badge.color ?? 'var(--accent)',
                                border: `1px solid ${m.badge.color ?? 'var(--accent)'}40`, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis'
                              }}
                            >
                              {t(m.badge.en, m.badge.fr)}
                            </span>
                          ) : m.useCase ? (
                            <span
                              style={{
                                fontSize: '9.5px', padding: '2px 7px', borderRadius: '999px', fontWeight: 700, whiteSpace: 'nowrap',
                                background: 'var(--accent-bg-rgba)', color: 'var(--accent)',
                                border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis'
                              }}
                            >
                              {t(m.useCase.en, m.useCase.fr)}
                            </span>
                          ) : null}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: pill.bg, color: pill.fg, border: `1px solid ${pill.fg}33`, fontWeight: 700 }}>{t(pill.label.en, pill.label.fr)}</span>
                          {m.tags.map((tg, ti) => (
                            <span key={ti} style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', color: 'var(--text-muted)' }}>
                              {typeof tg === 'object' ? t(tg.en, tg.fr) : tg}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {typeof m.params === 'object' ? t(m.params.en, m.params.fr) : m.params}
                          </span>
                          {isCurrentlyLoaded ? (
                            // Image, vidéo et vision se chargent depuis CES cartes : c'est donc ici, et
                            // pas seulement sur les cartes texte, qu'il faut pouvoir rendre la VRAM —
                            // un pipeline image en occupe ~1 Go.
                            <button
                              className="btn btn-danger"
                              style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }}
                              disabled={modelState === 'generating' || benchRunning}
                              onClick={handleUnloadModel}
                              title={t('Unload the active model', 'Décharger le modèle actif')}
                            >
                              {t('Unload', 'Décharger')}
                            </button>
                          ) : previewable ? (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }}
                              disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                              onClick={loadPreview}
                            >
                              {t('Load', 'Charger')}
                            </button>
                          ) : (
                            <button className="btn" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px', flexShrink: 0 }} disabled>{t('Soon', 'Bientôt')}</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {showVideoLab && (() => {
                    const isVideoActive = !!loadedModelName && loadedModelName.includes('AnimateDiff');
                    return (
                    <div
                      className="model-card"
                      style={{ background: isVideoActive ? 'rgba(34, 197, 94, 0.06)' : 'rgba(255,255,255,0.015)', border: isVideoActive ? '1px solid rgba(34, 197, 94, 0.45)' : '1px dashed var(--border-color)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>AnimateDiff · </span>{t('Video lab', 'Labo vidéo')}
                        </span>
                        <span
                          style={{
                            fontSize: '9.5px', padding: '2px 7px', borderRadius: '999px', fontWeight: 700, whiteSpace: 'nowrap',
                            background: 'rgba(236,72,153,0.12)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.3)',
                          }}
                        >
                          🎬 {t('16-32 frames motion', 'Mouvement 16-32 frames')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: MODALITY_PILL.text2img.bg, color: MODALITY_PILL.text2img.fg, border: `1px solid ${MODALITY_PILL.text2img.fg}33`, fontWeight: 700 }}>{t('Video', 'Vidéo')}</span>
                        <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-card-hover, rgba(127,127,127,0.12))', color: 'var(--text-muted)' }}>{t('beta', 'bêta')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: '10px', lineHeight: 1.35, color: 'var(--warning, #a86a0c)' }}>
                        <AlertCircle size={11} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{t('~1.5 GB to download, then several minutes of GPU work for a few seconds of video.',
                                 '~1,5 Go à télécharger, puis plusieurs minutes de calcul GPU pour quelques secondes de vidéo.')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 'auto', flexWrap: 'wrap' }}>
                        {isVideoActive ? (
                          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                            {t('Active', 'Actif')}
                          </span>
                        ) : onLoadVideoModel && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                            disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                            onClick={() => onLoadVideoModel()}
                          >
                            <Film size={12} /> {t('Generate in the chat', 'Générer dans le chat')}
                          </button>
                        )}
                      </div>
                    </div>
                  ); })()}
                  </div>
                  {modelQ && totalCount === 0 && (
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
                      <strong style={{ color: 'var(--text-primary)' }}>{t('Convert to BRIK?', 'Convertir en BRIK ?')}</strong> {t('Mostly worth it from ', 'Intéressant surtout dès ')}<strong>~1.5B</strong>{t(' (“BRIK recommended” badge): the weights are kept ', ' (badge « BRIK conseillé ») : les poids sont gardés en ')}<strong>{t('int4/int8 resident', 'int4/int8 résident')}</strong>{t(' (÷2–4 VRAM → the model fits and loads faster) and the converted file is cached for instant reopenings. For a 0.5B the gain is marginal: the raw GGUF is enough.', ' (÷2–4 la VRAM → le modèle tient et charge plus vite) et le fichier converti est mis en cache pour des réouvertures instantanées. Pour un 0.5B, le gain est marginal : le GGUF brut suffit.')}
                    </div>
                  </div>
                </div>
            </div>
            </div>
            </div>
            </div>
  );
}
