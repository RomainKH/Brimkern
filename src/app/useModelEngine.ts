"use client";

// Model engine + loading lifecycle, extracted from the page component. Owns the WebGPU engine, the
// loaded model/tokenizer, loading/progress state, weight-precision/KV-cache state, and the import-form
// state — plus every loader path (preset/HF URL GGUF, local file, streamed .brik, GGUF→BRIK convert).
// Cross-cutting UI concerns (sidebar/modal, messages, conversation id, tokenizer/arch, library, cache
// badges) are injected via `deps`. Returned values keep the SAME names the page used, so call sites
// (render + chat loop) are unchanged. Precision/benchmark handlers stay in the page and consume this.

import { useState, useEffect, useRef, type Dispatch, type SetStateAction, type DragEvent, type ChangeEvent } from 'react';
// transformers.js is a heavy dependency only needed once a model is loaded (for its tokenizer). It's
// imported DYNAMICALLY at load time (see `await import('@huggingface/transformers')` below) so it
// stays out of the main bundle — the landing page doesn't pay for it.
import { WebGpuEngine } from '@/lib/webgpu/kernels';
import { CustomWebModel, type TensorSource } from '@/lib/webgpu/model';
import { parseGguf, type Manifest } from '@/lib/webgpu/ggufParser';
import { brikFileToLoadable, brikToGgufManifest, type BrikLoadable } from '@/lib/brik/loader';
import { convertModelToBrik, type WeightDType } from '@/lib/brik/convert';
import { serializeBrik, parseBrik, parseBrikHeader } from '@/lib/brik/container';
import { brikCacheKey, getBrik, putBrik } from '@/lib/brikCache';
import { cachedModelUrls } from '@/lib/storage';
import { loadBrikStream } from '@/lib/webgpu/source';
import { PRESET_MODELS, type ArchType } from '@/lib/presets';
import { MOBILE_BRIK_URL, pickAutoPrecision, GGUF_ARCH_FAMILY } from '@/lib/modelCatalog';
import { useT } from '@/lib/i18n';
import { metric, metricOnce } from '@/lib/metrics';
import type { Message } from './types';

export interface ModelEngineDeps {
  isMobile: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setBrowseOpen: Dispatch<SetStateAction<boolean>>;
  currentConvId: string | null;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  rememberUserModel: (url: string, kind: 'gguf' | 'brik') => void;
  rememberLocalModel: (name: string) => void;
  setCachedUrls: Dispatch<SetStateAction<Set<string>>>;
  selectedTokenizerId: string;
  setSelectedTokenizerId: Dispatch<SetStateAction<string>>;
  modelArchType: ArchType;
  setModelArchType: Dispatch<SetStateAction<ArchType>>;
}

export function useModelEngine(deps: ModelEngineDeps) {
  // useModelEngine is a hook, so useT() is usable directly — loading steps and error messages follow
  // the locale of the render that triggered the load.
  const t = useT();
  const {
    isMobile, setIsSidebarOpen, setBrowseOpen, currentConvId, setMessages,
    rememberUserModel, rememberLocalModel, setCachedUrls, selectedTokenizerId, setSelectedTokenizerId,
    modelArchType, setModelArchType,
  } = deps;

  const [modelState, setModelState] = useState<'idle' | 'initializing' | 'loading' | 'ready' | 'generating' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [webGpuSupported, setWebGpuSupported] = useState<boolean | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<{ loaded: number; total: number; percentage: number } | null>(null);
  const [activeEngine, setActiveEngine] = useState<WebGpuEngine | null>(null);
  // CustomWebModel (transformers, moteur v1) OU Lfm2ChatAdapter (arch lfm2, moteur v2) — même
  // surface d'API côté chat (topKKV/logitsKV/reset/unload + getters de précision).
  const [activeModel, setActiveModel] = useState<CustomWebModel | import('@/lib/webgpu/lfm2ChatAdapter').Lfm2ChatAdapter | null>(null);
  const [activeTokenizer, setActiveTokenizer] = useState<any>(null);
  const [loadedModelName, setLoadedModelName] = useState<string>('');
  const [loadedModelUrl, setLoadedModelUrl] = useState<string>('');
  const [modelMetadata, setModelMetadata] = useState<any>(null);
  const [weightPrec, setWeightPrec] = useState<'f32' | 'f16' | 'q8' | 'q4' | 'q3'>('f32');
  const [kvQuantOn, setKvQuantOn] = useState<boolean>(false);
  const [modelIsBrik, setModelIsBrik] = useState<boolean>(false);
  const [autoPrec, setAutoPrec] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customHFUrl, setCustomHFUrl] = useState<string>('');
  const [brikUrl, setBrikUrl] = useState<string>(MOBILE_BRIK_URL);
  const [autoConvert, setAutoConvert] = useState<boolean>(false);
  const [convertTier, setConvertTier] = useState<WeightDType>('q8');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Detect WebGPU on mount. requestAdapter() peut renvoyer null TRANSITOIREMENT (process GPU en
  // cours de redémarrage après un crash — nos tests device-lost en produisent) ou durablement
  // (Chrome coupe l'accélération matérielle pour la session après plusieurs crashs GPU) : on
  // réessaie 3× espacés avant de déclarer « non supporté », et chaque motif est loggé pour que
  // le « Non supporté » sur une machine qui marchait la veille soit diagnosticable (chrome://gpu).
  useEffect(() => {
    let cancelled = false;
    const detect = async () => {
      // ?webgpu=0 : force « non supporté » (test de l'accueil dédié sans dénicher un navigateur
      // sans WebGPU) — même famille de kill-switchs URL que ?attnfullwg= / ?duty=.
      if (new URLSearchParams(window.location.search).get('webgpu') === '0') {
        setWebGpuSupported(false);
        return;
      }
      const gpu = (navigator as any).gpu;
      if (!gpu) {
        console.warn('[webgpu] navigator.gpu absent — contexte non sécurisé (page en http ?) ou navigateur sans WebGPU');
        metricOnce('webgpu_unsupported', { reason: 'no-api' });
        setWebGpuSupported(false);
        return;
      }
      for (let i = 0; i < 3; i++) {
        try {
          const adapter = await gpu.requestAdapter();
          if (cancelled) return;
          if (adapter) { setWebGpuSupported(true); return; }
          console.warn(`[webgpu] requestAdapter() → null (essai ${i + 1}/3) — accélération matérielle coupée ? Vérifier chrome://gpu ; un redémarrage du navigateur suffit souvent après un crash GPU`);
        } catch (e) {
          console.error('Erreur détection WebGPU:', e);
        }
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;
      }
      metricOnce('webgpu_unsupported', { reason: 'no-adapter' });
      setWebGpuSupported(false);
    };
    detect();
    return () => { cancelled = true; };
  }, []);

  // Chrono du funnel : armé à CHAQUE point d'entrée de chargement (URL GGUF, stream BRIK, fichier,
  // bibliothèque), lu quand activateModel passe « ready » → durée réelle téléchargement compris.
  const loadStartRef = useRef<number>(0);
  const markLoadStart = (model: string, source: string) => {
    loadStartRef.current = performance.now();
    metric('model_load_started', { model, source });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Cache API helper to download and cache files locally
  const fetchWithCacheAndProgress = async (url: string, onProgress: (loaded: number, total: number) => void): Promise<Blob> => {
    const cache = await caches.open('brimkern-model-cache');
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      setLoadingStep(t('Loading the pre-downloaded model from the browser cache...', 'Chargement du modèle pré-téléchargé depuis le cache du navigateur...'));
      return await cachedResponse.blob();
    }

    setLoadingStep(t('Downloading the GGUF model from Hugging Face (cached locally)...', 'Téléchargement du modèle GGUF depuis Hugging Face (mis en cache locale)...'));

    const response = await fetch(url);
    if (!response.ok) throw new Error(t(`HTTP error: ${response.status} ${response.statusText}`, `Erreur HTTP: ${response.status} ${response.statusText}`));

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    const reader = response.body?.getReader();
    if (!reader) throw new Error(t("Couldn't get a readable stream.", "Impossible d'obtenir le flux de lecture."));

    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.byteLength;
      onProgress(loaded, total);
    }

    const blob = new Blob(chunks as any);

    try {
      await cache.put(url, new Response(blob, {
        headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': blob.size.toString() }
      }));
    } catch (e) {
      console.warn("Échec de la mise en cache (quota dépassé ?) :", e);
    }

    return blob;
  };

  // Core activation shared by the GGUF and BRIK paths: spin up the engine, validate kernels, build
  // the model from an already-parsed (GGUF-shaped) manifest + its byte source, and wire UI state.
  const activateModel = async (
    manifest: Manifest,
    fileBlob: Blob | TensorSource,
    modelName: string,
    tokenizerId: string,
    archType: ArchType,
    sourceLabel = 'GGUF',
    embeddedTok?: { json?: string; config?: string },
  ) => {
    // isMobile (prop) est un state posé APRÈS le montage : un chargement automatique lancé au mount
    // (reprise de conversation) capture la closure du premier rendu où il vaut encore false → sur
    // téléphone, l'auto-précision prenait le profil DESKTOP (f16 : « f16 (source mixte) », 2× la
    // VRAM d'un mixte natif). Mesure vivante au moment de l'appel, pas le state.
    const mobileNow = typeof window !== 'undefined' && window.innerWidth <= 1000;
    if (mobileNow) setIsSidebarOpen(false);
    setModelState('initializing');
    setErrorMsg(null);
    setLoadingProgress(null);

    try {
      setLoadingStep(t('Compiling the WebGPU kernels (WGSL)...', 'Compilation des kernels WebGPU (WGSL)...'));
      const engine = new WebGpuEngine();
      const initialized = await engine.init();
      if (!initialized) {
        throw new Error(t("Your browser doesn't support WebGPU. Please enable hardware acceleration or use Google Chrome.", "Votre navigateur ne supporte pas WebGPU. Veuillez activer l'accélération matérielle ou utiliser Google Chrome."));
      }

      // Perte du device GPU en cours de vie (TDR / mémoire reprise par l'OS — fréquent sur mobile
      // avec une longue conversation ou un onglet en arrière-plan) : sans ce hook, l'app continuait
      // sur un device fantôme — affichée « Actif », envois permis, et chaque calcul replantait en
      // « erreur matricielle GPU ». Ici on décharge le moteur mort et on bascule en erreur
      // récupérable : la conversation est conservée, l'écran d'erreur propose de recharger.
      engine.onLost = (info) => {
        if (info?.reason === 'destroyed') return; // destruction volontaire (déchargement) — pas une panne
        setActiveEngine(null);
        setActiveModel(null);
        setActiveTokenizer(null);
        setLoadedModelName('');
        setModelMetadata(null);
        setModelState('error');
        setErrorMsg(t(
          "The GPU disconnected (device lost): the system reclaimed graphics memory — common on mobile with a long conversation, a backgrounded tab, or thermal pressure. The model was unloaded; your conversation is safe. Reload the model to continue.",
          "Le GPU s'est déconnecté (device lost) : le système a repris la mémoire graphique — fréquent sur mobile avec une longue conversation, un onglet passé en arrière-plan, ou la chauffe. Le modèle a été déchargé ; votre conversation est intacte. Rechargez le modèle pour continuer.",
        ));
      };

      setLoadingStep(t('Internally validating GPU matrix computations...', 'Validation interne des calculs matriciels du GPU...'));
      const validated = await engine.selfValidate();
      if (!validated) {
        throw new Error(
          t("WebGPU kernel validation failed. The WGSL shaders aren't executing correctly.", "Échec de la validation des kernels WebGPU. Les shaders WGSL ne s'exécutent pas correctement.") +
          (engine.validationFailure ? t(` (step: ${engine.validationFailure})`, ` (étape : ${engine.validationFailure})`) : '')
        );
      }

      setLoadingStep(t('Initializing the model...', 'Initialisation du modèle...'));
      // Arch lfm2 (moteur v2 hybride) : classe dédiée Lfm2Model derrière l'adaptateur chat
      // (topKKV/logitsKV sur état récurrent) — CustomWebModel ne connaît pas les blocs shortconv.
      // Ici le manifeste est GGUF-shaped (loadBrikStream l'a aplati : offsets absolus, arch = chaîne,
      // profil lfm2 porté dans config par brikToGgufManifest). On reconstruit le profil BRIK attendu
      // par Lfm2Model. BRIK uniquement (les dtypes GGUF F16/K-quants n'ont pas de chemin ici).
      const isLfm2 = manifest.arch === 'lfm2';
      let model: any;
      if (isLfm2) {
        if (fileBlob instanceof Blob || !('bytes' in (fileBlob as object))) throw new Error(t('LFM2 loads from a streamed .brik (convert the GGUF first).', 'LFM2 se charge depuis un .brik streamé (convertissez le GGUF d’abord).'));
        if (!manifest.config.lfm2) throw new Error(t('lfm2 profile missing from the manifest (rebuild the BRIK).', 'profil lfm2 absent du manifeste (rebuilder le BRIK).'));
        const { Lfm2Model } = await import('@/lib/webgpu/lfm2Model');
        const { Lfm2ChatAdapter } = await import('@/lib/webgpu/lfm2ChatAdapter');
        const source = fileBlob as { bytes: (offset: number, length: number) => Promise<Uint8Array> };
        const GGUF_TO_DTYPE: Record<string, string> = { F16: 'f16', F32: 'f32', Q4W: 'q4', Q8W: 'q8', Q3W: 'q3' };
        const emb = manifest.tensors['token_embd.weight'];
        const bm = {
          arch: { ...manifest.config, arch: 'lfm2', vocab: emb ? emb.nElems / manifest.config.d : 0 },
          tensors: Object.fromEntries(Object.entries(manifest.tensors).map(([n, tt]) => [n, {
            dtype: GGUF_TO_DTYPE[tt.type] ?? tt.type, shape: tt.shape, nElems: tt.nElems, shard: 0, offset: tt.offset, byteLength: tt.bytes,
          }])),
          shards: [{ id: 0, file: '', byteLength: 0 }],
          chat: { template: 'chatml', stopTokenIds: [7, 2, 8, 10, 12] }, // <|im_end|>, <|endoftext|> + blocs outil (hallucination tool-call, cf. isStopToken lfm2)
        } as unknown as import('@/lib/brik/format').BrikManifest;
        const rawTensor = async (name: string) => { const tt = manifest.tensors[name]; if (!tt) throw new Error(`tenseur absent : ${name}`); return source.bytes(tt.offset, tt.bytes); };
        const core = new Lfm2Model(engine, bm, rawTensor);
        setLoadingStep(t('Loading the weights onto the GPU…', 'Chargement des poids sur le GPU…'));
        // Le chat tokenise à l'extérieur (transformers.js) : generate()/classify() de la classe pure
        // ne sont jamais appelés ici → stub suffisant.
        await core.load({ encode: () => [], decode: () => '' });
        model = new Lfm2ChatAdapter(core);
        (globalThis as unknown as { __lfm2Adapter?: unknown }).__lfm2Adapter = model; // hook diagnostic (harnais Playwright)
      } else if (manifest.arch === 'rwkv7') {
        // Arch rwkv7 (moteur v2, 100 % récurrent) : RwkvModel derrière son adaptateur chat —
        // même montage que lfm2 (BRIK streamé uniquement, profil rwkv porté par le manifeste).
        if (fileBlob instanceof Blob || !('bytes' in (fileBlob as object))) throw new Error(t('RWKV loads from a streamed .brik (convert the GGUF first).', 'RWKV se charge depuis un .brik streamé (convertissez le GGUF d’abord).'));
        if (!manifest.config.rwkv) throw new Error(t('rwkv profile missing from the manifest (rebuild the BRIK).', 'profil rwkv absent du manifeste (rebuilder le BRIK).'));
        const world = embeddedTok?.json ? JSON.parse(embeddedTok.json) as { tokens?: string[]; eosId?: number } : null;
        if (!world?.tokens) throw new Error(t('World vocab missing from the BRIK.', 'vocab World absent du BRIK.'));
        const { RwkvModel } = await import('@/lib/webgpu/rwkvModel');
        const { RwkvChatAdapter } = await import('@/lib/webgpu/rwkvChatAdapter');
        const source = fileBlob as { bytes: (offset: number, length: number) => Promise<Uint8Array> };
        const GGUF_TO_DTYPE: Record<string, string> = { F16: 'f16', F32: 'f32', Q4W: 'q4', Q8W: 'q8', Q3W: 'q3' };
        const emb = manifest.tensors['token_embd.weight'];
        const bm = {
          arch: { ...manifest.config, arch: 'rwkv7', vocab: emb ? emb.nElems / manifest.config.d : 0 },
          tensors: Object.fromEntries(Object.entries(manifest.tensors).map(([n, tt]) => [n, {
            dtype: GGUF_TO_DTYPE[tt.type] ?? tt.type, shape: tt.shape, nElems: tt.nElems, shard: 0, offset: tt.offset, byteLength: tt.bytes,
          }])),
          shards: [{ id: 0, file: '', byteLength: 0 }],
          chat: { template: 'rwkv', stopTokenIds: [0] }, // eos World
        } as unknown as import('@/lib/brik/format').BrikManifest;
        const rawTensor = async (name: string) => { const tt = manifest.tensors[name]; if (!tt) throw new Error(`tenseur absent : ${name}`); return source.bytes(tt.offset, tt.bytes); };
        const core = new RwkvModel(engine, bm, rawTensor);
        setLoadingStep(t('Loading the weights onto the GPU…', 'Chargement des poids sur le GPU…'));
        await core.load(world.tokens);
        model = new RwkvChatAdapter(core);
        (globalThis as unknown as { __rwkvAdapter?: unknown }).__rwkvAdapter = model; // hook diagnostic (harnais Playwright)
      } else {
        model = new CustomWebModel(engine, fileBlob, manifest);
      }

      // Diagnostic quantification (dev, desktop) : ?prec=base:q4,attn:q8 — `base:` force la
      // précision de départ (au lieu de l'auto), les autres paires forcent ces matrices au tier
      // indiqué (substring-match sur le nom GGUF). Sert à isoler les familles de tenseurs
      // int4-sensibles (cf. charabia int4 sur 0.5B) et dimensionner un futur BRIK mixte q4/q8.
      let forcedBase: 'q4' | 'q8' | null = null;
      const precParam = new URLSearchParams(window.location.search).get('prec');
      if (precParam) {
        const pairs = precParam.split(',')
          .map((s) => s.split(':') as [string, string])
          .filter((kv): kv is [string, 'q4' | 'q8'] => !!kv[0] && (kv[1] === 'q4' || kv[1] === 'q8'));
        const overrides = pairs.filter(([k]) => k !== 'base');
        forcedBase = pairs.find(([k]) => k === 'base')?.[1] ?? null;
        if (overrides.length) {
          model.precOverrides = overrides;
          console.warn('[prec] overrides de précision par tenseur ACTIFS (diagnostic) :', overrides.map(([a, b]) => `${a}→${b}`).join(', '));
        }
      }

      let tokenizer: any;
      if (manifest.arch === 'rwkv7') {
        // Vocab World embarqué (trie byte-level maison, PAS un tokenizer.json HF) : shim qui expose
        // la surface transformers.js utilisée par le chat — appelable (→ input_ids) + decode().
        setLoadingStep(t('Loading the embedded tokenizer (offline)…', 'Chargement du tokenizer embarqué (hors-ligne)…'));
        const { RwkvTokenizer } = await import('@/lib/rwkvTokenizer');
        const world = JSON.parse(embeddedTok!.json!) as { tokens: string[]; eosId?: number };
        const wt = new RwkvTokenizer(world.tokens, world.eosId ?? 0);
        const shim: any = (text: string) => ({ input_ids: { data: wt.encode(text) } });
        shim.decode = (ids: ArrayLike<number | bigint>) => wt.decode(Array.from(ids, Number).filter((i) => i > 0)); // 0 = eos, jamais affiché
        tokenizer = shim;
      }
      // Pull transformers.js on demand (kept out of the main bundle). Both the embedded-tokenizer and
      // the HF-download paths need it, so load the module once here.
      const { AutoTokenizer, PreTrainedTokenizer } = await import('@huggingface/transformers');
      if (!tokenizer && embeddedTok?.json && embeddedTok?.config) {
        setLoadingStep(t('Loading the embedded tokenizer (offline)…', 'Chargement du tokenizer embarqué (hors-ligne)…'));
        try {
          tokenizer = new PreTrainedTokenizer(JSON.parse(embeddedTok.json), JSON.parse(embeddedTok.config));
        } catch (te) {
          console.warn('Tokenizer embarqué illisible, repli sur le réseau :', te);
        }
      }
      if (!tokenizer) {
        setLoadingStep(t('Loading the tokenizer (Hugging Face)...', 'Chargement du Tokenizer (Hugging Face)...'));
        try {
          tokenizer = await AutoTokenizer.from_pretrained(tokenizerId);
        } catch (te: any) {
          throw new Error(t(
            `Couldn't load the tokenizer "${tokenizerId}": ${te?.message || te}. ` +
            `Check that this Hugging Face repo is public and contains tokenizer.json + tokenizer_config.json.`,
            `Impossible de charger le tokenizer « ${tokenizerId} » : ${te?.message || te}. ` +
            `Vérifiez que ce dépôt Hugging Face est public et contient tokenizer.json + tokenizer_config.json.`,
          ));
        }
      }

      if (activeModel) {
        activeModel.unload();
      }

      setActiveEngine(engine);
      setActiveModel(model);
      // The transformers tokenizer is a CALLABLE object; setState(fn) would treat it as a state
      // updater. Store it via a functional updater so React keeps the tokenizer itself.
      setActiveTokenizer(() => tokenizer);
      setSelectedTokenizerId(tokenizerId);
      setModelArchType(archType);
      setLoadedModelName(modelName);
      setModelMetadata(manifest);
      let startPrec = model.precision;
      let startKv = model.kvQuant;
      if (autoPrec) {
        const totalParams = Object.values(manifest.tensors as Record<string, { nElems?: number }>).reduce((a, t) => a + (t.nElems || 0), 0);
        const native = model.nativePrecision;
        if (native === 'q4' || native === 'q8' || native === 'q3') {
          // BRIK pré-quantifié : la précision native EST le contrat du fichier — zéro conversion.
          // La « regonfler » (q3/q4→f16/q8) doublerait/triplerait la VRAM et ralentirait le décodage
          // pour une qualité strictement identique (un quant requantifié RESTE au même nombre de bits) ;
          // la resserrer détruirait la qualité que le fichier paye. Constaté en vrai : le 4B q4 chargé
          // « int8 (source int4) » par l'auto → VRAM ×2. L'utilisateur peut toujours forcer à la main.
          const autoKv = native === 'q4' || native === 'q3' || totalParams > 1.2e9;
          try { model.setKvQuant(autoKv); startKv = autoKv; } catch { /* keep native */ }
        } else {
          const auto = pickAutoPrecision(totalParams, model.supportsQ8, !!engine.hasF16, mobileNow, engine.maxStorageBufferBindingSize || 0);
          // KV int8 = ÷4 la VRAM du cache mais du travail en plus PAR token (quantif + déquant fusionnée).
          // Sur un petit modèle la VRAM du cache est négligeable → KV f32, plus rapide. On ne quantifie
          // le cache que quand ça compte : gros modèle ou poids déjà en q4 (appareil contraint).
          const autoKv = auto === 'q4' || totalParams > 1.2e9;
          try { model.setWeightPrecision(auto); startPrec = auto; } catch { startPrec = model.precision; }
          try { model.setKvQuant(autoKv); startKv = autoKv; } catch { /* keep native */ }
        }
      }
      if (forcedBase) {
        // Diagnostic ?prec=base:… — prime l'auto ET le choix utilisateur persisté.
        try { model.setWeightPrecision(forcedBase); startPrec = forcedBase; console.warn(`[prec] précision de base FORCÉE (diagnostic) : ${forcedBase}`); } catch { /* q4/q8 non supporté → auto */ }
      }
      setWeightPrec(startPrec);
      setKvQuantOn(startKv);
      setModelIsBrik(sourceLabel.startsWith('BRIK'));
      if (loadStartRef.current) {
        metric('model_loaded', { model: modelName, seconds: Math.round((performance.now() - loadStartRef.current) / 1000) });
        loadStartRef.current = 0;
      }
      setModelState('ready');
      cachedModelUrls().then(setCachedUrls).catch(() => { /* ignore */ });

      if (!currentConvId) setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t(
                   `Hello! The **${modelName}** model loaded successfully (source **${sourceLabel}**) on our custom WebGPU kernels.\n\n` +
                   `**Model characteristics:**\n` +
                   `- Architecture: \`${manifest.arch}\`\n` +
                   `- Blocks (layers): \`${manifest.config.blockCount}\`\n` +
                   `- Embd dimension: \`${manifest.config.d}\` (Heads: \`${manifest.config.nHeads}\`)\n` +
                   `- Tokenizer: \`${tokenizerId}\` (\`${archType}\`)\n\n` +
                   `You can send it your questions — every matrix computation will run locally in this browser.`,
                   `Bonjour ! Le modèle **${modelName}** a été chargé avec succès (source **${sourceLabel}**) grâce à nos kernels WebGPU custom.\n\n` +
                   `**Caractéristiques du modèle :**\n` +
                   `- Architecture : \`${manifest.arch}\`\n` +
                   `- Blocs (couches) : \`${manifest.config.blockCount}\`\n` +
                   `- Dimension d'embd : \`${manifest.config.d}\` (Têtes : \`${manifest.config.nHeads}\`)\n` +
                   `- Tokenizer : \`${tokenizerId}\` (\`${archType}\`)\n\n` +
                   `Vous pouvez lui envoyer vos questions, tous les calculs matriciels s'exécuteront localement dans ce navigateur.`,
          )
        }
      ]);
    } catch (e: any) {
      console.error("Erreur initialisation modèle custom:", e);
      const raw = e?.message || String(e);
      const prefix = e?.name && e.name !== 'Error' ? `${e.name}: ` : '';
      const lc = raw.toLowerCase();
      const looksOom = /out of memory|oom|exceed|too large|allocation|buffer size|device.*lost|lost.*device|createbuffer/.test(lc);
      let msg = `${prefix}${raw}`;
      if (loadingStep) msg += t(`\n\n(Step: ${loadingStep})`, `\n\n(Étape : ${loadingStep})`);
      if (looksOom) {
        msg += isMobile
          ? t('\n\nGPU memory probably insufficient on mobile. Try the 0.5B model and enable "Convert to BRIK" at int4 precision (¼ VRAM), or use a computer.', "\n\nMémoire GPU probablement insuffisante sur mobile. Essayez le modèle 0.5B et activez « Convertir en BRIK » en précision int4 (¼ de VRAM), ou utilisez un ordinateur.")
          : t('\n\nGPU memory probably insufficient. Try a smaller model, or the int4 precision (BRIK).', "\n\nMémoire GPU probablement insuffisante. Essayez un modèle plus petit, ou la précision int4 (BRIK).");
      }
      setErrorMsg(msg);
      setModelState('error');
    }
  };

  // Convert a parsed GGUF to a single-file BRIK, persisted in IndexedDB so it's done ONCE per
  // (file, tier). Returns a loadable; subsequent loads of the same file+tier hit the cache.
  const ggufToBrikCached = async (fileBlob: Blob, modelName: string, gguf: Manifest, tier: WeightDType, uiArch: ArchType, tokenizerId: string): Promise<BrikLoadable> => {
    const f = fileBlob as File;
    const sig = f.name ? `${f.name}:${f.size}:${f.lastModified}` : `${modelName}:${fileBlob.size}`;
    const key = brikCacheKey(sig, tier);
    let bytes = await getBrik(key).catch(() => null);
    if (bytes) {
      setLoadingStep(t('Loading the cached BRIK (no reconversion)…', 'Chargement du BRIK en cache (pas de reconversion)…'));
    } else {
      setLoadingStep(t('Converting GGUF → BRIK (once only, then cached)…', 'Conversion GGUF → BRIK (une seule fois, puis mise en cache)…'));
      const convEngine = new WebGpuEngine();
      if (!(await convEngine.init())) throw new Error(t('WebGPU unavailable for the conversion.', 'WebGPU indisponible pour la conversion.'));
      try {
        const readRaw = async (offset: number, byteLength: number) =>
          new Uint8Array(await fileBlob.slice(offset, offset + byteLength).arrayBuffer());
        const name = modelName.replace(/\.gguf$/i, '');
        const out = await convertModelToBrik(
          gguf,
          readRaw,
          (type, b, n) => convEngine.dequantizeByType(type, b, n),
          {
            modelName: name,
            quantSource: name.match(/(Q\d[\w]*|F16|F32|BF16)/i)?.[0]?.toUpperCase(),
            uiArch,
            tokenizer: { kind: 'hf-hub', id: tokenizerId },
            chat: { template: '', stopTokenIds: [] },
            weightDType: tier,
          },
          (done, total) => setLoadingProgress({ loaded: done, total, percentage: Math.round((done / total) * 100) }),
          (type, b, n, dt) => convEngine.quantizeToBytes(type, b, n, dt),
        );
        bytes = serializeBrik(out.manifest, out.shards);
        await putBrik(key, bytes, { modelName: name, tier }).catch(() => { /* quota — skip cache */ });
      } finally {
        convEngine.device?.destroy?.();
        setLoadingProgress(null);
      }
    }
    const { manifest, data } = parseBrik(bytes);
    return brikFileToLoadable(manifest, data);
  };

  // `tokOverride`/`archOverride` carry the freshly-selected preset values DIRECTLY (not via state):
  // handleLoadModelFromUrl calls setSelectedTokenizerId() then this in the same tick, so reading the
  // state here would see the STALE previous value (e.g. Gemma's tokenizer when loading Qwen → garbage).
  const loadModelEngine = async (fileBlob: Blob, modelName: string, tokOverride?: string, archOverride?: ArchType) => {
    setModelState('initializing');
    setErrorMsg(null);
    setLoadingStep(t('Parsing the GGUF structure...', 'Analyse de la structure GGUF en cours...'));
    let manifest: Manifest;
    try {
      manifest = await parseGguf(fileBlob);
    } catch (e: any) {
      console.error("Erreur d'analyse GGUF:", e);
      setErrorMsg(e.message || String(e));
      setModelState('error');
      return;
    }
    // Force the tokenizer/arch to match the model's own vocabulary family (from the GGUF), overriding a
    // stale UI selection — otherwise e.g. a Gemma model tokenized with the Qwen tokenizer gets garbage.
    let tokId = tokOverride ?? selectedTokenizerId, archT = archOverride ?? modelArchType;
    const forced = GGUF_ARCH_FAMILY[manifest.arch];
    if (forced && (forced.tokenizerId !== selectedTokenizerId || forced.archType !== modelArchType)) {
      console.warn(`[brimkern] GGUF arch="${manifest.arch}" → tokenizer/arch forcés sur « ${forced.tokenizerId} » / « ${forced.archType} » (sélection: « ${selectedTokenizerId} » / « ${modelArchType} ») pour éviter un mismatch de vocabulaire.`);
      tokId = forced.tokenizerId; archT = forced.archType;
      setSelectedTokenizerId(forced.tokenizerId);
      setModelArchType(forced.archType);
    }

    if (autoConvert) {
      try {
        const loadable = await ggufToBrikCached(fileBlob, modelName, manifest, convertTier, archT, tokId);
        await activateModel(loadable.manifest as Manifest, loadable.blob, loadable.modelName || modelName, loadable.tokenizerId ?? tokId, (loadable.uiArch as ArchType) ?? archT, 'BRIK ✦ (auto)', { json: loadable.tokenizer?.json, config: loadable.tokenizer?.config });
        return;
      } catch (e: any) {
        console.warn('Auto-conversion BRIK échouée, chargement GGUF brut :', e);
        setLoadingStep(t('Conversion failed — loading the raw GGUF…', 'Conversion échouée — chargement du GGUF brut…'));
      }
    }
    await activateModel(manifest, fileBlob, modelName, tokId, archT, 'GGUF');
  };

  // Streaming BRIK-by-URL: header first, then range-fetch each tensor (Cache-API backed), pre-warmed.
  const loadBrikUrl = async (url: string) => {
    const loadable = await loadBrikStream(url);
    const tensors = Object.values(loadable.manifest.tensors) as { offset: number; bytes: number }[];
    const total = tensors.reduce((a, t) => a + t.bytes, 0);
    const BATCH = 6;
    setLoadingStep(t('Downloading the model (streamed, cached then available offline)…', 'Téléchargement du modèle (streaming, mis en cache puis hors-ligne)…'));
    setLoadingProgress({ loaded: 0, total, percentage: 0 });
    const waitForResume = () => new Promise<void>((resolve) => {
      if (navigator.onLine) { setTimeout(resolve, 1500); return; }
      const on = () => { window.removeEventListener('online', on); resolve(); };
      window.addEventListener('online', on);
      setTimeout(() => { window.removeEventListener('online', on); resolve(); }, 8000);
    });
    let i = 0, pauses = 0;
    while (i < tensors.length) {
      try {
        await Promise.all(tensors.slice(i, i + BATCH).map((t) => loadable.source.bytes(t.offset, t.bytes)));
        i += BATCH;
        const done = Math.min(tensors.slice(0, i).reduce((a, t) => a + t.bytes, 0), total);
        setLoadingProgress({ loaded: done, total, percentage: Math.round((done / total) * 100) });
      } catch (e) {
        const msg = String((e as Error)?.message || e);
        const isNetwork = !navigator.onLine || e instanceof TypeError || /failed to fetch|load failed|network/i.test(msg);
        if (!isNetwork || ++pauses > 60) throw e;
        if (isMobile) setIsSidebarOpen(false);
        setLoadingStep(t('Download paused (network interrupted) — resumes automatically once the connection returns…', 'Chargement en pause (réseau interrompu) — reprise automatique dès le retour de la connexion…'));
        await waitForResume();
        setLoadingStep(t('Resuming the download…', 'Reprise du téléchargement…'));
      }
    }
    await activateModel(
      loadable.manifest as Manifest,
      loadable.source,
      loadable.modelName,
      loadable.tokenizerId ?? selectedTokenizerId,
      (loadable.uiArch as ArchType) ?? modelArchType,
      'BRIK ✦ (stream)',
      { json: loadable.tokenizer?.json, config: loadable.tokenizer?.config },
    );
  };

  const handleLoadModelFromUrl = async (url: string) => {
    if (!url) return;
    if (isMobile) setIsSidebarOpen(false);
    setBrowseOpen(false);
    setLoadedModelUrl(url);
    rememberUserModel(url, 'gguf');

    const preset = PRESET_MODELS.find(m => m.url === url);
    if (preset) {
      setSelectedTokenizerId(preset.tokenizer);
      setModelArchType(preset.type);
    }

    setModelState('initializing');
    setErrorMsg(null);
    setLoadingProgress(null);

    const parts = url.split('/');
    const name = parts[parts.length - 1];
    markLoadStart(name, 'gguf-url');

    try {
      const blob = await fetchWithCacheAndProgress(url, (loaded, total) => {
        const percentage = Math.round((loaded / total) * 100);
        setLoadingProgress({ loaded, total, percentage });
      });
      // Pass the preset's tokenizer/arch directly — state set above isn't visible in this same tick.
      await loadModelEngine(blob, name, preset?.tokenizer, preset?.type);
    } catch (e: any) {
      console.error("Erreur de téléchargement du modèle:", e);
      setErrorMsg(t(`Download error: ${e.message || String(e)}`, `Erreur de téléchargement : ${e.message || String(e)}`));
      setModelState('error');
    }
  };

  // Load a local single-file .brik lazily: read just the header, then slice the File on demand.
  // Retourne true si le chargement a abouti (sert à décider la persistance du fichier importé).
  const loadBrikFile = async (file: Blob, modelName: string): Promise<boolean> => {
    setModelState('initializing');
    setErrorMsg(null);
    setLoadingStep(t('Reading the BRIK header…', 'Lecture de l’en-tête BRIK…'));
    try {
      const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      const manifestLen = new DataView(head.buffer).getUint32(8, true);
      const headerBytes = new Uint8Array(await file.slice(0, 12 + manifestLen).arrayBuffer());
      const { manifest, dataStart } = parseBrikHeader(headerBytes);
      const source = { bytes: async (o: number, l: number) => new Uint8Array(await file.slice(dataStart + o, dataStart + o + l).arrayBuffer()) };
      await activateModel(
        brikToGgufManifest(manifest) as unknown as Manifest,
        source,
        manifest.model?.name || modelName,
        manifest.tokenizer?.id ?? selectedTokenizerId,
        (manifest.model?.uiArch as ArchType) ?? modelArchType,
        'BRIK ✦',
        { json: manifest.tokenizer?.json, config: manifest.tokenizer?.config },
      );
      return true;
    } catch (e: any) {
      setErrorMsg(t(`Unreadable BRIK file: ${e?.message || e}`, `Fichier BRIK illisible : ${e?.message || e}`));
      setModelState('error');
      return false;
    }
  };

  // Clé IndexedDB d'un .brik importé localement (store `brimkern-brik`, le même que les conversions).
  const localBrikKey = (name: string) => brikCacheKey(`local:${name}`, 'imported');

  // Recharge un .brik importé depuis l'IndexedDB (bibliothèque → « Recharger ») : true si trouvé et
  // chargé, false si absent (l'appelant retombe sur le sélecteur de fichier).
  const loadLocalBrikFromCache = async (name: string): Promise<boolean> => {
    const bytes = await getBrik(localBrikKey(name)).catch(() => null);
    if (!bytes) return false;
    setLoadedModelUrl('');
    setBrowseOpen(false);
    markLoadStart(name, 'library');
    return loadBrikFile(new Blob([bytes as BlobPart]), name);
  };

  // Click handler for Local Model — auto-detects GGUF vs BRIK by the file's magic bytes.
  const handleLoadLocalModel = async () => {
    if (!selectedFile) return;
    setLoadedModelUrl('');
    setBrowseOpen(false); // close the picker modal so the loading overlay is visible (was missing → "rien ne se passe")
    if (isMobile) setIsSidebarOpen(false);
    const sig = new Uint8Array(await selectedFile.slice(0, 4).arrayBuffer());
    const isBrik = sig[0] === 0x42 && sig[1] === 0x52 && sig[2] === 0x49 && sig[3] === 0x4B; // "BRIK"
    rememberLocalModel(selectedFile.name); // add to the library
    markLoadStart(selectedFile.name, 'local-file');
    if (isBrik) {
      const ok = await loadBrikFile(selectedFile, selectedFile.name);
      // Persiste le .brik importé (≤ 700 Mo) dans l'IndexedDB APRÈS un chargement réussi : la
      // bibliothèque pourra le « Recharger » sans re-passer par le sélecteur de fichier (le trou
      // n°1 du cache d'import — un fichier local n'était jamais réutilisable après un reload).
      if (ok && selectedFile.size <= 700e6) {
        selectedFile.arrayBuffer()
          .then((buf) => putBrik(localBrikKey(selectedFile.name), new Uint8Array(buf), { modelName: selectedFile.name, tier: 'imported' }))
          .catch(() => { /* quota — la bibliothèque retombera sur le re-import */ });
      }
    } else {
      await loadModelEngine(selectedFile, selectedFile.name);
    }
  };

  // Stream-load a hosted .brik by URL (header first, tensors range-fetched + cached).
  // `source` qualifie la provenance du clic dans le funnel (welcome / sidebar / browse…).
  const handleStreamBrik = async (urlOverride?: string, source: string = 'brik-stream') => {
    const u = (urlOverride ?? brikUrl).trim();
    if (!u) return;
    if (isMobile) setIsSidebarOpen(false);
    setLoadedModelUrl(u);
    rememberUserModel(u, 'brik');
    setBrowseOpen(false);
    setModelState('initializing');
    setErrorMsg(null);
    markLoadStart(u.split('/').pop() || u, source);
    try {
      await loadBrikUrl(u);
    } catch (e: any) {
      setErrorMsg(t(`BRIK streaming failed: ${e?.message || e}`, `Streaming BRIK échoué : ${e?.message || e}`));
      setModelState('error');
    }
  };

  const handleUnloadModel = () => {
    if (activeModel) {
      activeModel.unload();
    }
    setActiveEngine(null);
    setActiveModel(null);
    setActiveTokenizer(null);
    setLoadedModelName('');
    setLoadedModelUrl('');
    setModelMetadata(null);
    setWeightPrec('f32');
    setMessages([]);
    setModelState('idle');
  };

  return {
    // state
    modelState, setModelState, errorMsg, setErrorMsg, webGpuSupported,
    loadingStep, setLoadingStep, loadingProgress,
    activeEngine, activeModel, activeTokenizer,
    loadedModelName, loadedModelUrl,
    modelMetadata, weightPrec, setWeightPrec, kvQuantOn, setKvQuantOn, modelIsBrik, autoPrec, setAutoPrec,
    selectedFile, setSelectedFile, customHFUrl, setCustomHFUrl, brikUrl, setBrikUrl,
    autoConvert, setAutoConvert, convertTier, setConvertTier, isDragging,
    // handlers
    handleDragOver, handleDragLeave, handleDrop, handleFileChange,
    loadModelEngine, handleLoadModelFromUrl, handleLoadLocalModel, handleStreamBrik, handleUnloadModel, loadLocalBrikFromCache,
  };
}
