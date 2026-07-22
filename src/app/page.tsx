"use client";

import { useState, useEffect, useRef, type ClipboardEvent as ReactClipboardEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  Zap, Trash2, CheckCircle, AlertCircle,
  Loader2, Menu, X, Sparkles,
  Info, ShieldCheck, Database, ArrowRight,
  Plus, MessageSquare, ChevronDown, Sun, Moon, Package, HardDrive, Settings, RefreshCw, Image as ImageIcon, Globe, Film
} from 'lucide-react';
import { cachedModelUrls } from '@/lib/storage';
import { PRESET_MODELS, TOKENIZER_PRESETS, type ArchType } from '@/lib/presets';
import { stripTurnMarkers, formatPrompt, isStopToken, THINK_BUDGETS, type ReflectionLevel } from '@/lib/chatFormat';
import { MOBILE_BRIK_URL, QWEN_MOBILE_BRIK_URL, IMAGE_BRIK, pickAutoPrecision, PREC_LABEL } from '@/lib/modelCatalog';
import { sampleNextToken, sampleFromTopK } from '@/lib/webgpu/sampling';
import { detectCalcs, formatCalc, currentDateLine } from '@/lib/localTools';
import { listConversations, type Conversation } from '@/lib/chatStore';
import StoragePanel from './StoragePanel';
import OptionsPanel from './OptionsPanel';
import SkillsPanel from './SkillsPanel';
import { listCustomSkills, BUILTIN_SKILLS, type Skill } from '@/lib/skillStore';
import { useT, useLocale } from '@/lib/i18n';
import Link from 'next/link';
import { useModelEngine } from './useModelEngine';
import { ModelBrowserModal } from './ModelBrowserModal';
import { Composer } from './Composer';
import { ChatMessages } from './ChatMessages';
import { useConversations } from './useConversations';
import type { ImageGenerator } from '@/lib/webgpu/diffusion/imageGen';
import type { VisionSession as VisionSessionT } from '@/lib/webgpu/vision/qwen2vl';
import { nextMsgId } from './ids';
import { CONTEXT_SOFT_CAP, approxTokens, type PastedAttachment } from './composer-shared';
import type { Message } from './types';

// Decoding params for the chat loop. Greedy argmax loops on small quantized models; a repetition
// penalty + light sampling keeps replies varied and breaks the "same sentence forever" failure.
// Tightened from (0.7 / 40 / 0.9): a 0.5B Qwen is heavily Chinese-trained, so at higher temp/top-p a
// stray CJK token occasionally survives the tail and lands mid-answer in a Latin-script reply. Lower
// temp + tighter top-k/top-p cut that tail. Won't fully vanish (it's model capacity), but far rarer.
const SAMPLING = { temperature: 0.6, topK: 30, topP: 0.85, repetitionPenalty: 1.15 } as const;
const REPEAT_WINDOW = 64; // how many recent tokens the repetition penalty looks back over

// Sentinel "model URL" marking a conversation as an image (text→image) session, so auto-resume loads
// the image model instead of trying to fetch it as an LLM (no real URL — PRESET_MODELS won't match it).
const IMAGE_MODEL_URL = 'sdturbo://image';
// Sentinel des conversations VISION (Qwen2-VL) : pas d'auto-rechargement (~2,3 Go), la conv se
// rouvre en lecture et un nouveau tour repart d'un contexte neuf (les pixels ne sont pas persistés).
const VISION_MODEL_URL = 'qwen2vl://vision';


// Advisory context budget (CONTEXT_SOFT_CAP) + the cheap ~4 chars/token estimate (approxTokens) and
// the PastedAttachment shape live in ./composer-shared so <Composer> and the page agree on them.
// Not a hard model limit (Qwen2.5 trains to 32k, Llama3.2 to 128k) — it's the point past which a
// small in-browser model loses coherence and prefill gets slow (attention is O(seq²)); we warn,
// never block.

// A paste longer than this collapses into an attachment chip instead of flooding the composer
// (à la Claude Code's "pasted text"). Purely a composer-UX convenience: the full content is still
// concatenated into the message and sent to the model on submit — it does NOT reduce context.
const PASTE_COLLAPSE_CHARS = 800;

// Suggested starter prompts — built through t() so the card AND the prompt sent to the model follow
// the active locale. Adapted to the loaded model's MODALITY: an image generator gets image prompts,
// a vision model gets "describe the attached image" prompts, a chat LLM gets the text defaults.
type PromptMode = 'text' | 'image' | 'vision';
const SUGGESTED_PROMPTS = (t: (en: string, fr: string) => string, mode: PromptMode = 'text') => {
  if (mode === 'image') return [
    { title: t('Cozy landscape', 'Paysage cosy'), text: t('A cozy wooden cabin by a lake at sunset, warm golden light, digital painting, highly detailed.', "Une cabane en bois cosy au bord d'un lac au coucher du soleil, lumière dorée chaude, peinture numérique, très détaillé.") },
    { title: t('Cute character', 'Personnage mignon'), text: t('A cute red fox wearing a wool scarf, soft studio lighting, adorable, highly detailed illustration.', "Un adorable renard roux portant une écharpe en laine, éclairage studio doux, illustration très détaillée.") },
    { title: t('Abstract art', 'Art abstrait'), text: t('Abstract flowing shapes in red and cream, minimalist elegant composition, smooth gradients.', 'Formes fluides abstraites en rouge et crème, composition minimaliste et élégante, dégradés doux.') },
  ];
  if (mode === 'vision') return [
    // Cliquer REMPLIT le champ (au lieu d'envoyer) : un modèle vision a besoin d'une image jointe
    // d'abord — cf. le call-site qui bascule sur setUserInput en mode vision.
    { title: t('Describe the image', "Décrire l'image"), text: t('Describe this image in detail.', 'Décris cette image en détail.') },
    { title: t('Extract the text', 'Extraire le texte'), text: t('Read and transcribe all the text visible in this image.', 'Lis et retranscris tout le texte visible dans cette image.') },
    { title: t('Ask about it', 'Poser une question'), text: t('What is happening in this image?', "Que se passe-t-il dans cette image ?") },
  ];
  return [
    { title: t('Explain WebGPU', 'Expliquer le WebGPU'), text: t("Explain what WebGPU is and why running matrix computations directly in WGSL in the browser is revolutionary.", "Explique-moi ce qu'est WebGPU et en quoi le fait d'exécuter des calculs matriciels directement en WGSL dans le navigateur est révolutionnaire.") },
    { title: t('Write Python code', 'Écrire du code Python'), text: t('Write a simple Python script that sorts a list of users by descending score.', "Rédige un script Python simple qui trie une liste d'utilisateurs par score décroissant.") },
    { title: t('Creative ideas', 'Idées créatives'), text: t('Suggest 3 innovative project concepts using local AI in the browser.', "Propose-moi 3 concepts de projets innovants utilisant l'IA locale dans le navigateur.") },
  ];
};

// A fenced code block with its own "copy code" button (copies just this block, not the whole
// message). Local copied-state so each block's button is independent.

function App() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  // Model loader tab (browse vs import). Engine/model/loading/precision/form state lives in useModelEngine.
  const [activeTab, setActiveTab] = useState<'models' | 'import'>('models');

  // Tokenizer selection
  const [selectedTokenizerId, setSelectedTokenizerId] = useState<string>(TOKENIZER_PRESETS[0].id);
  const [modelArchType, setModelArchType] = useState<ArchType>('qwen');
  
  // Écrans étroits / tactiles — déclaré TÔT : maxTokens et systemPrompt ci-dessous en dépendent.
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Generation Parameters (fixed for now — no UI to tune them). Mobile : plafond réduit — à ~6 t/s
  // de décodage, 512 tokens dépassent la minute ; 256 borne le pire cas à ~40 s (la consigne de
  // concision injectée dans le system prompt fait le reste).
  const maxTokens = isMobile ? 256 : 512;

  // Skills: reusable system-prompt presets (built-ins + the user's custom ones, persisted). The
  // active skill's content IS the system prompt used for generation.
  const [customSkills, setCustomSkills] = useState<Skill[]>([]);
  const [activeSkillIds, setActiveSkillIds] = useState<string[]>(['default']); // multiple skills can be combined
  const [skillsOpen, setSkillsOpen] = useState<boolean>(false);
  const allSkills = [...BUILTIN_SKILLS, ...customSkills];
  const activeSkills = activeSkillIds.map((id) => allSkills.find((s) => s.id === id)).filter(Boolean) as Skill[];
  // Selected skills' instructions are concatenated into the system prompt (compose several personas).
  // Outils locaux (calcul exact + date du jour injectés dans le prompt) : 100 % hors réseau → ON
  // par défaut. Lecture des liens collés : passe par r.jina.ai (réseau) → OFF par défaut.
  // Déclarés ICI car systemPrompt (ci-dessous) dépend de localToolsOn.
  const [localToolsOn, setLocalToolsOn] = useState<boolean>(true);
  const [urlReadOn, setUrlReadOn] = useState<boolean>(false);
  const systemPrompt = (activeSkills.map((s) => s.content).join('\n\n') || 'You are a helpful AI assistant.') +
    // Mobile : concision imposée (injection modèle → FR, cf. convention i18n). ~500 caractères ≈
    // 160 tokens ≈ 25 s à ~6 t/s de décodage — la lecture reste agréable et le téléphone ne chauffe
    // pas une minute par réponse. Stable sur la session → le préfixe KV reste réutilisable.
    (isMobile ? '\nRéponds de façon concise : 500 caractères maximum, va à l\'essentiel. Ne détaille que si on te le demande explicitement.' : '') +
    // Outil « date » : les petits modèles n'ont aucune notion du jour courant. Stable sur la
    // journée → le préfixe KV du system prompt reste réutilisable entre les tours.
    (localToolsOn ? `\n(Date du jour : ${currentDateLine(locale === 'fr' ? 'fr' : 'en')}.)` : '');
  const toggleSkill = (id: string) => setActiveSkillIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  
  const [cachedUrls, setCachedUrls] = useState<Set<string>>(new Set()); // model URLs whose bytes are cached locally (→ "dispo" checkmark)
  // Models the user added by URL (custom GGUF / streamed .brik) — shown in the library so they can be
  // reloaded in one click. Persisted to localStorage. (Local file imports have no reloadable URL.)
  const [userModels, setUserModels] = useState<{ url?: string; name: string; kind: 'gguf' | 'brik' | 'local' }[]>([]);
  const [browseOpen, setBrowseOpen] = useState<boolean>(false); // "Parcourir les modèles" modal
  // When set, the chat is in IMAGE mode: prompts go to this generator instead of the LLM token loop.
  // The real SD-Turbo pipeline (CLIP → UNet int8 → TAESD), lazy-loaded by loadImageModel.
  const [imageGen, setImageGen] = useState<ImageGenerator | null>(null);
  // Mode VISION (Qwen2-VL 2B, desktop) : image + texte → texte. Session = LLM Q8 + ViT/merger sur
  // un engine partagé (~2,6 Go VRAM), chargée par loadVisionModel. Exclusif des modes LLM/image.
  const [visionSession, setVisionSession] = useState<VisionSessionT | null>(null);
  // Image jointe au prochain message (data URL) + son aperçu réduit pour la bulle utilisateur.
  const [pendingImage, setPendingImage] = useState<{ dataUrl: string; preview: string; w: number; h: number } | null>(null);
  // État KV de la conversation vision : convId lié, session engine, tokens déjà préfillés, et les
  // ids générés au tour précédent pas encore poussés dans le cache (le stop-token ou le dernier
  // token échantillonné) — re-préfillés en tête du tour suivant.
  const visionKvRef = useRef<{ convId: string | null; sess: string; fed: number; pending: number[] }>({ convId: null, sess: '', fed: 0, pending: [] });
  // Image quality = latent side per generation (16/32/64 → 128/256/512px). Default 256px: good
  // quality without cooking the GPU — 512 is native SD-Turbo but slow/hot in f32, opt-in only.
  const [imageSize, setImageSize] = useState<number>(32);
  const [advOpen, setAdvOpen] = useState<boolean>(false); // "Options avancées (dév)" accordion — collapsed by default
  // Thinking budget for reasoning models (see THINK_BUDGETS). Only surfaced when a reasoning model
  // (deepseek arch) is loaded; ignored otherwise.
  const [reflectionLevel, setReflectionLevel] = useState<ReflectionLevel>('medium');
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  // Large pastes collapsed into chips (see PASTE_COLLAPSE_CHARS) — kept out of the textarea but
  // concatenated into the outgoing message on send.
  const [attachments, setAttachments] = useState<PastedAttachment[]>([]);

  // Conversation history. Only currentConvId lives here — the model engine needs it and the on-mount
  // auto-resume needs the engine's loader, so owning it here keeps the two hooks from going circular.
  // The list, persistence, and handlers live in useConversations (created after useModelEngine below).
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [benchRunning, setBenchRunning] = useState<boolean>(false);
  const [showAllModels, setShowAllModels] = useState<boolean>(false); // mobile: reveal the heavy models the picker hides by default
  const [modelQuery, setModelQuery] = useState<string>(''); // search box over the preset model grid
  const [storageOpen, setStorageOpen] = useState<boolean>(false); // storage-management modal
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false); // settings modal (Réglages)
  // Journal des étapes de chargement affiché dans l'overlay (télécharger/quantifier/valider…) : les
  // étapes s'empilent, une progression (« Téléchargement 120/359 Mo ») remplace sa propre ligne.
  const [loadingLog, setLoadingLog] = useState<string[]>([]);
  // GPU power regime (thermal duty cycle of image generation) — set in the Réglages panel, persisted.
  const [gpuDuty, setGpuDuty] = useState<number>(0.6);
  // Recherche web opt-in (Réglages → Web & outils) : OFF par défaut — quand actif, la question de
  // l'utilisateur (elle seule) est envoyée à Wikipédia et les extraits sont injectés dans le prompt.
  const [webSearchOn, setWebSearchOn] = useState<boolean>(false);
  // Starts `false` on BOTH server and client so the first render matches (the toggle icon would
  // otherwise mismatch → hydration error). The real theme is applied to <html> before paint by
  // the inline script in layout.tsx; this state just drives the header icon.
  const [dark, setDark] = useState<boolean>(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // KV réutilisé entre les tours d'une conversation : `fed` = les token ids EXACTEMENT envoyés au
  // cache KV (positions 1:1). Le prompt du tour suivant partage un long préfixe avec `fed` (template
  // append-only) → on ne re-prefill que le suffixe. `model` garde l'identité du modèle : s'il change,
  // le cache GPU n'existe plus → session neuve obligatoire (sinon attention sur des K/V vides).
  const kvSessRef = useRef<{ model: unknown; sessionId: string; fed: number[] } | null>(null);
  // Cache de tokenisation inter-tours : formatPrompt étant append-only, le prompt du tour N est un
  // préfixe STRICT (string) du prompt du tour N+1 → on ne tokenise que le delta (réponse précédente
  // + nouveau tour), O(nouveau) au lieu de O(historique entier) (~50-200 ms/message sur mobile).
  // `tok` = identité du tokenizer (changement de modèle → cache invalide). Voir handleSendMessage.
  const tokCacheRef = useRef<{ tok: unknown; prompt: string; tokens: number[] } | null>(null);
  // Préchargement du modèle mobile en arrière-plan (voir l'effet dédié) : % en cours pour les
  // tuiles, « déjà téléchargé » pour l'étiquette, contrôleur pour l'annulation.
  const [prefetchPct, setPrefetchPct] = useState<number | null>(null);
  const [prefetchDone, setPrefetchDone] = useState(false);
  const prefetchCtl = useRef<AbortController | null>(null);
  const themeAdopted = useRef(false);
  const uiRestored = useRef(false);

  // Restore UI flags that should survive a page navigation (this client page unmounts when you go to
  // /convert or /changelog). One-time, ref-guarded read on mount — same pattern as the theme adopt.
  useEffect(() => {
    if (uiRestored.current) return;
    uiRestored.current = true;
    try {
      const sb = localStorage.getItem('brimkern-sidebar');
      if (sb !== null) setIsSidebarOpen(sb === '1');
      const sk = localStorage.getItem('brimkern-skills');
      if (sk) { const arr = JSON.parse(sk); if (Array.isArray(arr) && arr.length) setActiveSkillIds(arr); }
      const um = localStorage.getItem('brimkern-usermodels');
      if (um) { const arr = JSON.parse(um); if (Array.isArray(arr)) setUserModels(arr); }
      const gd = parseFloat(localStorage.getItem('brimkern-gpu-duty') || '');
      if (gd > 0 && gd <= 1) setGpuDuty(gd);
      if (localStorage.getItem('brimkern-websearch') === '1') setWebSearchOn(true);
      if (localStorage.getItem('brimkern-localtools') === '0') setLocalToolsOn(false);
      if (localStorage.getItem('brimkern-urlread') === '1') setUrlReadOn(true);
    } catch { /* localStorage unavailable */ }
  }, []);

  // Persist those flags whenever they change (no setState here → safe in an effect).
  useEffect(() => { try { localStorage.setItem('brimkern-sidebar', isSidebarOpen ? '1' : '0'); } catch { /* ignore */ } }, [isSidebarOpen]);
  useEffect(() => { try { localStorage.setItem('brimkern-skills', JSON.stringify(activeSkillIds)); } catch { /* ignore */ } }, [activeSkillIds]);
  useEffect(() => { try { localStorage.setItem('brimkern-usermodels', JSON.stringify(userModels)); } catch { /* ignore */ } }, [userModels]);
  useEffect(() => { try { localStorage.setItem('brimkern-gpu-duty', String(gpuDuty)); } catch { /* ignore */ } }, [gpuDuty]);
  useEffect(() => { try { localStorage.setItem('brimkern-websearch', webSearchOn ? '1' : '0'); } catch { /* ignore */ } }, [webSearchOn]);
  useEffect(() => { try { localStorage.setItem('brimkern-localtools', localToolsOn ? '1' : '0'); } catch { /* ignore */ } }, [localToolsOn]);
  useEffect(() => { try { localStorage.setItem('brimkern-urlread', urlReadOn ? '1' : '0'); } catch { /* ignore */ } }, [urlReadOn]);

  // Record a URL-loaded model (custom GGUF or streamed .brik) into the library, deduped — so it can be
  // reloaded later in one click. Presets already live in the library, so they're skipped.
  const rememberUserModel = (url: string, kind: 'gguf' | 'brik') => {
    const u = url.trim();
    if (!u || PRESET_MODELS.some((m) => m.url === u)) return;
    setUserModels((prev) => prev.some((m) => m.url === u) ? prev : [{ url: u, name: u.split('/').pop() || u, kind }, ...prev].slice(0, 20));
  };
  // Record a locally-imported model (no reloadable URL — its tile re-opens the file picker), deduped by name.
  const rememberLocalModel = (name: string) => {
    if (!name) return;
    setUserModels((prev) => prev.some((m) => m.kind === 'local' && m.name === name) ? prev : [{ name, kind: 'local' as const }, ...prev].slice(0, 20));
  };
  // A model URL counts as cached if any cache entry starts with it — streamed .brik are cached per byte
  // RANGE under `url?__brik=…` keys, so an exact Set.has(url) would miss them. Used for the badge,
  // auto-resume, and cache→library pruning so all three agree.
  const isCached = (url?: string) => !!url && [...cachedUrls].some((c) => c.startsWith(url));
  // Keep the library in sync with the cache: after a Storage-panel clear, drop URL models whose bytes
  // are gone (local entries stay — they were never cached). Re-reads the cache to refresh badges too.
  const handleCacheChanged = async () => {
    const fresh = await cachedModelUrls().catch(() => new Set<string>());
    setCachedUrls(fresh);
    setUserModels((prev) => prev.filter((m) => m.kind === 'local' || (m.url && [...fresh].some((c) => c.startsWith(m.url!)))));
  };

  // Model engine + loading lifecycle (WebGPU engine, model/tokenizer, loading/precision/form state +
  // all loader paths). Returned with the SAME names the component used, so call sites are unchanged.
  const {
    modelState, setModelState, errorMsg, setErrorMsg, webGpuSupported,
    loadingStep, setLoadingStep, loadingProgress,
    activeEngine, activeModel, activeTokenizer,
    loadedModelName, loadedModelUrl,
    modelMetadata, weightPrec, setWeightPrec, kvQuantOn, setKvQuantOn, modelIsBrik, autoPrec, setAutoPrec,
    selectedFile, setSelectedFile, customHFUrl, setCustomHFUrl, brikUrl, setBrikUrl,
    autoConvert, setAutoConvert, convertTier, setConvertTier, isDragging,
    handleDragOver, handleDragLeave, handleDrop, handleFileChange,
    handleLoadModelFromUrl: engineLoadFromUrl, handleLoadLocalModel: engineLoadLocal,
    handleStreamBrik: engineStreamBrik, handleUnloadModel, loadLocalBrikFromCache,
  } = useModelEngine({
    isMobile, setIsSidebarOpen, setBrowseOpen, currentConvId, setMessages,
    rememberUserModel, rememberLocalModel, setCachedUrls, selectedTokenizerId, setSelectedTokenizerId,
    modelArchType, setModelArchType,
  });

  // Leaving image mode when an LLM loads: the chat routes on `imageGen` (message → image), so a
  // text model loaded OVER an active image session MUST clear it — otherwise « ça va ? » under Qwen
  // still generates an image (bug du 5 juil.). dispose() destroys the pipeline's GPUDevice (~1 Go
  // de poids résidents) — sinon cette VRAM reste occupée sous le LLM.
  const leaveImageMode = () => {
    imageGen?.dispose?.();
    setImageGen(null);
  };
  // Même exigence pour le mode vision : un LLM/image chargé par-dessus doit libérer ses ~2,6 Go.
  const leaveVisionMode = () => {
    visionSession?.dispose();
    setVisionSession(null);
    setPendingImage(null);
    visionKvRef.current = { convId: null, sess: '', fed: 0, pending: [] };
  };
  // Les presets peuvent pointer un .brik (poids pré-quantifiés streamés) : router vers le streamer.
  const handleLoadModelFromUrl = (url: string) => { leaveImageMode(); leaveVisionMode(); return url.endsWith('.brik') ? engineStreamBrik(url) : engineLoadFromUrl(url); };
  const handleLoadLocalModel = () => { leaveImageMode(); leaveVisionMode(); return engineLoadLocal(); };
  const handleStreamBrik = (urlOverride?: string) => { leaveImageMode(); leaveVisionMode(); return engineStreamBrik(urlOverride); };

  // Conversation history: list, auto-save, and new/open/delete handlers. Depends on the engine above
  // (activeModel/loadedModel*) so it's created here. The page keeps the bridge mount-effect that wires
  // cache + listConversations + load-model-then-restore, via the hydrate/restore helpers it returns.
  const {
    conversations, setConversations,
    hydrateConversations, restoreConversation, beginConversation,
    handleNewChat, openConversation, handleDeleteConversation,
  } = useConversations({
    currentConvId, setCurrentConvId, messages, setMessages, modelState, setModelState,
    activeModel, loadedModelName, loadedModelUrl, selectedTokenizerId, setSelectedTokenizerId,
    modelArchType, setModelArchType,
    imageModel: visionSession ? { name: 'Qwen2-VL 2B (vision)', url: VISION_MODEL_URL }
      : imageGen ? { name: imageGen.name, url: IMAGE_MODEL_URL } : null,
  });

  // Dev: expose a CLIP reference check in the console (window.__clipRef()) — runs the real CLIP via
  // transformers.js and compares to ours. Lazy-imported so it never touches the normal bundle.
  useEffect(() => {
    (window as any).__clipRef = () => import('@/lib/webgpu/diffusion/clipRef').then((m) => m.validateClipVsRef());
    // Vision Qwen2-VL (chantier V1/V2 — pas encore d'UI) :
    // __mmproj(url) inspecte un mmproj GGUF (tableau des tenseurs + config) ;
    // __vitTest() valide l'encodeur ViT complet (RoPE 2D, attention pleine, merger) vs réf CPU.
    (window as any).__mmproj = (url: string) => import('@/lib/webgpu/vision/mmproj').then((m) => m.inspectMmproj(url));
    // __visionChat(imageUrl, question?) : test V3 complet (LLM Q8 + mmproj + injection + décodage).
    (window as any).__visionChat = (img: string, q?: string) => import('@/lib/webgpu/vision/qwen2vl').then((m) => m.visionChatTest(img, q));
    (window as any).__vitTest = async () => {
      const [{ validateVit }, { WebGpuEngine }] = await Promise.all([
        import('@/lib/webgpu/vision/vit'), import('@/lib/webgpu/kernels'),
      ]);
      const e = new WebGpuEngine();
      if (!(await e.init())) return 'WebGPU indisponible';
      const fail = await validateVit(e);
      e.destroy();
      console.log(fail ? `[vit] self-test KO: ${fail}` : '[vit] self-test OK (rope_2d + encodeur + merger)');
      return fail ?? 'OK';
    };
  }, []);

  // Load the user's custom skills (IndexedDB). setState in the promise callback → safe in an effect.
  useEffect(() => {
    let active = true;
    listCustomSkills().then((s) => { if (active) setCustomSkills(s); }).catch(() => { /* IndexedDB unavailable */ });
    return () => { active = false; };
  }, []);

  // Dark mode. On the FIRST run we adopt whatever theme the inline script already put on <html>
  // (without toggling the class — toggling with the initial `false` is what stripped it and
  // flashed white on navigation). Afterwards (user clicks the toggle) we apply + persist.
  useEffect(() => {
    if (!themeAdopted.current) {
      themeAdopted.current = true;
      if (document.documentElement.classList.contains('dark')) setDark(true);
      return;
    }
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('brimkern-theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Track small / touch screens (limited GPU + memory → mobile warning, icon-only header).
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1000);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Wake lock d'écran (mobile) : à ~5 t/s une réponse longue dépasse le délai de mise en veille —
  // l'écran s'éteint pendant que le modèle « mouline », l'onglet est throttlé et l'OS peut reprendre
  // le GPU (device lost). On garde l'écran allumé UNIQUEMENT pendant le chargement et la génération
  // (jamais pour le préchargement, qui est un arrière-plan volontaire), et on relâche sitôt fini.
  // Le lock est libéré d'office quand l'onglet se cache → ré-acquis au retour de visibilité.
  const holdWakeLock = isMobile && (modelState === 'generating' || modelState === 'loading' || modelState === 'initializing');
  useEffect(() => {
    if (!holdWakeLock) return;
    type Sentinel = { release?: () => Promise<void> };
    const wl = (navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<Sentinel> } }).wakeLock;
    if (!wl) return; // API absente (vieux navigateur) — l'utilisateur peut toujours toucher l'écran
    let lock: Sentinel | null = null;
    let disposed = false;
    const acquire = async () => {
      try {
        const l = await wl.request('screen');
        if (disposed) { void l.release?.(); return; }
        lock = l;
      } catch { /* refusé (économie d'énergie, batterie faible…) — non bloquant */ }
    };
    const onVis = () => { if (document.visibilityState === 'visible') void acquire(); };
    void acquire();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVis);
      void lock?.release?.().catch(() => { /* déjà libéré */ });
    };
  }, [holdWakeLock]);

  // Préchargement mobile : le vrai coût de première utilisation est le téléchargement du BRIK
  // (~360-510 Mo) — si le cache est incomplet, on le remplit en arrière-plan dès l'arrivée, pendant
  // que l'utilisateur lit l'écran d'accueil (prefetchBrik reprend là où un passage précédent s'est
  // arrêté). Garde-fous : mobile + WebGPU confirmé seulement, jamais si l'économiseur de données est
  // actif, VISIBLE (ligne de progression dans les tuiles) et annulable (opt-out de session), et
  // abandonné dès qu'un chargement réel démarre (cleanup sur modelState — le loader resservira les
  // plages déjà en cache, rien n'est perdu).
  // L'effet ne dépend que d'un booléen DÉRIVÉ : l'ancienne version dépendait des 4 états bruts, et
  // n'importe quel changement pendant le délai de lancement exécutait le cleanup (abort) tandis que
  // `prefetchTried` — posé avant le départ — interdisait toute relance : le préchargement mourait en
  // silence. Ici le cleanup ne tire que quand précharger n'a plus de sens (chargement réel démarré,
  // modèle en place), et une redescente à « idle » peut relancer — la reprise est gratuite, les
  // plages déjà en cache sont recensées d'abord.
  const wantPrefetch = isMobile && webGpuSupported === true && modelState === 'idle' && !loadedModelName;
  useEffect(() => {
    if (!wantPrefetch) return;
    if (sessionStorage.getItem('brimkern-prefetch') === 'off') return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const ctl = new AbortController();
    prefetchCtl.current = ctl;
    // Première visite (splash affiché) : partir vite, pour que le rideau montre un vrai progrès.
    // Ensuite : laisser la page se poser (rendu, resume de conversation) avant d'occuper le réseau.
    let firstVisit = false;
    try { firstVisit = !localStorage.getItem('brimkern-splash-seen'); } catch { /* stockage bloqué */ }
    const timer = setTimeout(async () => {
      try {
        const { prefetchBrik } = await import('@/lib/webgpu/source');
        const res = await prefetchBrik(
          MOBILE_BRIK_URL,
          (p) => setPrefetchPct(Math.min(99, Math.round((p.doneBytes / p.totalBytes) * 100))),
          ctl.signal,
        );
        if (res === 'done') setPrefetchDone(true);
        else if (res === 'unstorable') console.info('[prefetch] stockage indisponible (pas de Range côté serveur, Cache API absente ou quota refusé) — préchargement abandonné');
      } catch (e) {
        if (!ctl.signal.aborted) console.warn('[prefetch] préchargement interrompu — reprendra à la prochaine visite (les plages déjà en cache sont conservées)', e);
      } finally {
        setPrefetchPct(null);
      }
    }, firstVisit ? 500 : 2500);
    return () => { clearTimeout(timer); ctl.abort(); };
  }, [wantPrefetch]);

  // (Splash d'accueil retiré 2026-07-21 — il promettait un chargement puis se fermait sans modèle.)

  // Chargement AUTOMATIQUE du modèle mobile (demande Romain : « le modèle par défaut quand je me
  // connecte ») : dès que le préchargement conclut 'done' (fichier complet en cache — pour un
  // habitué le recensement prend ~1 s, pour un nouveau ça suit la fin du téléchargement), le
  // modèle se charge sans tap. Une fois par session, et jamais après qu'un modèle a déjà été
  // chargé (un déchargement volontaire ne doit pas déclencher un rechargement surprise).
  const autoLoadedRef = useRef(false);
  useEffect(() => { if (loadedModelName) autoLoadedRef.current = true; }, [loadedModelName]);
  useEffect(() => {
    if (!prefetchDone || autoLoadedRef.current || !isMobile) return;
    if (modelState !== 'idle' || loadedModelName || imageGen) return;
    autoLoadedRef.current = true;
    handleStreamBrik(MOBILE_BRIK_URL);
  }, [prefetchDone, isMobile, modelState, loadedModelName, imageGen]);

  // Annuler = stopper net + ne pas relancer de la session (sessionStorage : on RE-proposera à la
  // prochaine visite — un refus ponctuel, réseau partagé par ex., n'est pas un refus définitif).
  const cancelPrefetch = () => {
    sessionStorage.setItem('brimkern-prefetch', 'off');
    prefetchCtl.current?.abort();
    setPrefetchPct(null);
  };

  // Ligne de statut du préchargement, affichée dans les deux tuiles mobiles (sidebar + accueil).
  const prefetchStatus = (center: boolean) =>
    prefetchPct !== null ? (
      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: center ? 'center' : 'flex-start', marginTop: center ? 8 : 0 }}>
        <span>⬇ {t('Downloading the model in the background…', 'Téléchargement du modèle en arrière-plan…')} {prefetchPct}%</span>
        <button
          onClick={cancelPrefetch}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '10.5px' }}
        >
          {t('Cancel', 'Annuler')}
        </button>
      </div>
    ) : prefetchDone && !loadedModelName ? (
      <div style={{ fontSize: '10.5px', color: 'var(--success)', textAlign: center ? 'center' : 'left', marginTop: center ? 8 : 0 }}>
        ✓ {t('Model already downloaded — loads instantly', 'Modèle déjà téléchargé — chargement instantané')}
      </div>
    ) : null;


  useEffect(() => {
    const selected = TOKENIZER_PRESETS.find(t => t.id === selectedTokenizerId);
    if (selected) {
      setModelArchType(selected.type);
    }
  }, [selectedTokenizerId]);

  // Alimente le journal de chargement depuis loadingStep ; remis à zéro hors chargement.
  useEffect(() => {
    if (modelState !== 'loading' && modelState !== 'initializing') {
      if (loadingLog.length) setLoadingLog([]);
      return;
    }
    if (!loadingStep) return;
    setLoadingLog((prev) => {
      const last = prev[prev.length - 1];
      if (last === loadingStep) return prev;
      // Même famille de message (seuls les chiffres changent) → progression : remplacer la ligne.
      const fam = (x: string) => x.replace(/[\d,./  ]+/g, '');
      if (last && fam(last) === fam(loadingStep)) return [...prev.slice(0, -1), loadingStep];
      return [...prev.slice(-11), loadingStep];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStep, modelState]);

  // Persistent storage: on mobile, best-effort storage gets EVICTED under pressure — the streamed
  // model's range cache silently vanishes between sessions. persist() asks the browser to protect
  // our origin's storage (Chrome grants silently based on engagement; harmless elsewhere).
  useEffect(() => {
    try { navigator.storage?.persist?.().then((ok) => console.log(`[storage] persistant: ${ok}`)); } catch { /* unsupported */ }
  }, []);

  // Scroll to bottom. During generation the list updates ~8×/s — a 'smooth' scrollIntoView each
  // time stacks scroll animations (10-20 ms of compositing each on mobile). So: throttle to ~4/s
  // and scroll INSTANTLY while streaming; keep the smooth animation for regular updates.
  const lastAutoScrollRef = useRef(0);
  // Stick-to-bottom respectueux : on ne force le scroll QUE si l'utilisateur est déjà en bas
  // (± 90 px). S'il remonte relire pendant que l'IA écrit, on ne le ramène pas de force ; dès
  // qu'il redescend en bas, le suivi reprend. Un nouvel envoi re-colle toujours en bas.
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const onMessagesScroll = () => {
    const el = messagesScrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
  };
  useEffect(() => {
    if (!stickToBottomRef.current) return; // l'utilisateur est remonté → pas de forcing
    const streaming = modelState === 'generating';
    const now = performance.now();
    if (streaming && now - lastAutoScrollRef.current < 250) return;
    lastAutoScrollRef.current = now;
    messagesEndRef.current?.scrollIntoView({ behavior: streaming ? 'auto' : 'smooth' });
  }, [messages, modelState]);

  // Auto-grow the composer to fit its text. When empty we leave height:auto so CSS min-height owns
  // the single-row size — setting an explicit scrollHeight on an unlaid-out/empty textarea is what
  // produced the oversized empty box. We only pin a pixel height once there's actual text to fit.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    if (userInput) ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [userInput]);

  // Load saved conversations on mount. This effect bridges the two hooks: it seeds the cache set and
  // the conversation list, then auto-resumes the most recent non-empty chat. If that chat's model is a
  // known preset already cached, load the MODEL FIRST (no network) — its activation paints the welcome
  // message — THEN restore the conversation on top, so you land straight in a ready-to-chat session
  // without the chat flashing and being replaced by the welcome. (Persistence + restore details live
  // in useConversations; here we only orchestrate the order.)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = await cachedModelUrls().catch(() => new Set<string>());
      if (cancelled) return;
      setCachedUrls(cached);
      const cs = await listConversations().catch(() => [] as Conversation[]);
      if (cancelled) return;
      hydrateConversations(cs);
      const last = cs.find((c) => c.messages?.length);
      if (!last) return;
      if (last.modelUrl === IMAGE_MODEL_URL) {
        // Conversation IMAGE : on la restaure SANS charger le générateur (retour mobile de Romain
        // 2026-07-21 — même « en cache », le rechargement auto déclenchait des téléchargements et
        // bloquait l'utilisateur). Les images sont persistées dans les messages → elles s'affichent
        // sans le modèle ; seuls les modèles TEXTE s'auto-chargent. Pour regénérer, l'utilisateur
        // relance le mode image à la demande (tuile / bouton).
        restoreConversation(last);
        return;
      }
      // Auto-load à la reprise : preset GGUF en cache (chemin historique desktop) OU .brik streamé
      // (le modèle mobile n'était jamais rechargé — l'URL BRIK n'est pas un preset et passe par le
      // streamer, pas le chargeur GGUF). Pour un .brik, uniquement si le fichier est INTÉGRALEMENT
      // en cache (zéro réseau, chargement quasi instantané) : un cache partiel déclencherait un
      // streaming au premier plan dès l'ouverture — ce téléchargement appartient au préchargement
      // d'arrière-plan (ligne de progression + Annuler), qui chargera le modèle une fois complet.
      const isBrik = !!last.modelUrl?.endsWith('.brik');
      let brikReady = false;
      if (isBrik && [...cached].some((c) => c.startsWith(last.modelUrl!))) {
        const { brikCacheComplete } = await import('@/lib/webgpu/source');
        brikReady = await brikCacheComplete(last.modelUrl!);
        if (cancelled) return;
      }
      const canAutoLoad = !!last.modelUrl && [...cached].some((c) => c.startsWith(last.modelUrl!)) &&
        (PRESET_MODELS.some((m) => m.url === last.modelUrl) || brikReady);
      // Modèle absent du cache → on N'AUTO-RESTAURE PAS : rouvrir la dernière conv sans son modèle
      // laissait l'utilisateur bloqué devant un chat mort (retour de Romain). Accueil neuf à la place ;
      // la conversation reste dans la sidebar et s'ouvre à la demande.
      if (!canAutoLoad) return;
      if (isBrik) await handleStreamBrik(last.modelUrl!); // load model (paints welcome), then…
      else await handleLoadModelFromUrl(last.modelUrl!);
      if (cancelled) return;
      restoreConversation(last);                    // …drop the saved conversation on top
    })().catch(() => { /* IndexedDB unavailable → history just disabled */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = locale === 'fr' ? ['B', 'Ko', 'Mo', 'Go'] : ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };


  // Autoregressive generation loop
  // Collapse a large paste into an attachment chip instead of flooding the textarea. Smaller pastes
  // insert normally. The chip's content is folded back into the message on send.
  const handlePaste = (e: ReactClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    if (text && text.length > PASTE_COLLAPSE_CHARS) {
      e.preventDefault();
      const lines = text.split('\n').length;
      setAttachments((prev) => [...prev, {
        id: `paste-${Date.now()}-${prev.length}`,
        label: `${t('Pasted text', 'Texte collé')} · ${lines.toLocaleString()} ${lines > 1 ? t('lines', 'lignes') : t('line', 'ligne')} · ~${approxTokens(text).toLocaleString()} tok`,
        content: text,
      }]);
    }
  };

  // Fold the typed text together with any collapsed-paste attachments into one message string. Each
  // attachment is fenced so the model sees it as a distinct block; typed text leads (the usual
  // "do X to this: <paste>" shape).
  const composeOutgoing = (typed: string, atts: PastedAttachment[]) => {
    const body = atts.map((a) => `\n\n\`\`\`\n${a.content}\n\`\`\``).join('');
    return (typed + body).trim();
  };

  // Load the real SD-Turbo text→image pipeline (CLIP + UNet + TAESD) and enter image mode. Frees any
  // LLM. The diffusion subsystem is lazy-imported so it stays out of the main bundle. ⚠️ Heavy: streams
  // the model weights (UNet+text encoder, fp16) and runs f32 — first runs are small/slow by design.
  const loadImageModel = async () => {
    setBrowseOpen(false);
    if (isMobile) setIsSidebarOpen(false);
    if (activeModel) handleUnloadModel();
    leaveImageMode(); // un pipeline image déjà chargé ? le libérer avant d'en reconstruire un
    leaveVisionMode();
    setModelState('loading');
    setLoadingStep(t('Loading Stable Diffusion Turbo…', 'Chargement de Stable Diffusion Turbo…'));
    try {
      const { loadSdTurbo } = await import('@/lib/webgpu/diffusion/sdturbo');
      const taesd = 'https://huggingface.co/madebyollin/taesd/resolve/main/taesd_decoder.safetensors';
      // Poids : BRIK pré-quantifiés d'abord (téléchargement ÷2-÷3, zéro quantification au
      // chargement) avec repli safetensors fp16 si le BRIK n'est pas (encore) hébergé.
      // Overrides dev : ?imgbrik=0 force les safetensors ; ?imgmodel=sdxs charge le UNet distillé
      // (~330 Mo, 1 step) ; ?imgtier=mixed|light change le tier BRIK.
      const stUrls = {
        unet: 'https://huggingface.co/stabilityai/sd-turbo/resolve/main/unet/diffusion_pytorch_model.fp16.safetensors',
        clip: 'https://huggingface.co/stabilityai/sd-turbo/resolve/main/text_encoder/model.fp16.safetensors',
        taesd,
      };
      // Quality (latent size) is picked PER GENERATION via the composer selector; URL params remain
      // as dev overrides: ?size= (initial selector value), ?steps=1..4, ?finalLN=0|1 (CLIP LN A/B),
      // ?duty=0.4..1 (thermal duty cycle — internal default 0.6, 1 = full throttle).
      const q = new URLSearchParams(window.location.search);
      const p = q.get('finalLN');
      const finalLN = p === null ? undefined : p === '1' || p === 'true';
      const size = Math.min(64, Math.max(8, parseInt(q.get('size') || '32', 10) || 32));
      const steps = Math.min(4, Math.max(1, parseInt(q.get('steps') || '1', 10) || 1));
      const dutyRaw = q.get('duty');
      // Régime GPU : réglage utilisateur (panneau Réglages), l'URL ?duty= reste l'override dev.
      const pace = { duty: dutyRaw !== null ? Math.min(1, Math.max(0.1, parseFloat(dutyRaw) || 0.6)) : gpuDuty };
      setImageSize(size);
      const model = (q.get('imgmodel') === 'sdxs' || isMobile) ? 'sdxs' as const : 'sdturbo' as const;
      // Tiers par défaut : desktop q8 (équivalence numérique prouvée), mobile light (445 Mo,
      // validé visuellement). ?imgtier=q8|mixed|light remplace le tier du UNet quel que soit le
      // défaut du modèle.
      const tierOverride = ['q8', 'mixed', 'light'].includes(q.get('imgtier') || '') ? q.get('imgtier') : null;
      const brikUrls = {
        unet: tierOverride ? IMAGE_BRIK[model].unet.replace(/-(q8|mixed|light)\.brik$/, `-${tierOverride}.brik`) : IMAGE_BRIK[model].unet,
        clip: IMAGE_BRIK[model].clip, // CLIP partagé (encodeur figé identique SD-Turbo/SDXS)
        taesd,
      };
      // Perte du device GPU pendant une génération (pic VRAM mobile) : sans ce filet, l'app
      // attendait un GPU mort pour toujours (« bloqué à 1/13 »). On bascule en erreur récupérable.
      const onLost = () => {
        console.warn('[image] device GPU perdu pendant la génération/le chargement image');
        setImageGen(null);
        setModelState('error');
        setErrorMsg(t(
          'The GPU disconnected during image generation — the system reclaimed graphics memory (image generation is heavy on phones). Reload the page or the model to try again; prefer 256px on mobile.',
          "Le GPU s'est déconnecté pendant la génération d'image — le système a repris la mémoire graphique (la génération est lourde sur téléphone). Rechargez la page ou le modèle pour réessayer ; préférez 256px sur mobile.",
        ));
      };
      let gen;
      if (q.get('imgbrik') === '0') {
        gen = await loadSdTurbo(stUrls, { steps, size, finalLN, pace, onLost }, (s) => setLoadingStep(s));
      } else {
        try {
          gen = await loadSdTurbo(brikUrls, { steps, size, finalLN, pace, onLost }, (s) => setLoadingStep(s));
        } catch (be) {
          // BRIK pas encore hébergé / réseau : repli transparent sur les safetensors historiques.
          console.warn('[image] BRIK indisponible → repli safetensors fp16', be);
          gen = await loadSdTurbo(stUrls, { steps, size, finalLN, pace, onLost }, (s) => setLoadingStep(s));
        }
      }
      setImageGen(gen);
      setCurrentConvId(null);
      setMessages([{
        id: 'welcome', role: 'assistant',
        content: t(
          `Image mode — **${gen.name}**. Describe an image and I'll generate it.\n\n` +
            `Set the **quality** above the input box (256px recommended · 512px native, slower).`,
          `Mode image — **${gen.name}**. Décris une image, je la génère.\n\n` +
            `La **qualité** se règle au-dessus de la zone de saisie (256px conseillé · 512px natif, plus lent).`,
        ),
      }]);
      setModelState('ready');
    } catch (e: any) {
      console.error('[image] chargement SD-Turbo échoué', e);
      setImageGen(null);
      setModelState('idle');
      setMessages([{ id: 'welcome', role: 'assistant', content: t(`Failed to load SD-Turbo: ${e?.message || e}`, `Échec du chargement de SD-Turbo : ${e?.message || e}`), isError: true }]);
    }
  };

  // ── Mode VISION (Qwen2-VL 2B, desktop) ─────────────────────────────────────────────────────────
  // Charge le LLM Q8_0 (~1 Go) + le mmproj ViT (~1,3 Go, quantifié q8 au chargement) sur un engine
  // partagé. Desktop uniquement (~2,6 Go VRAM) — la tuile n'apparaît pas sur mobile.
  const loadVisionModel = async () => {
    setBrowseOpen(false);
    if (activeModel) handleUnloadModel();
    leaveImageMode();
    leaveVisionMode();
    setModelState('loading');
    setLoadingStep(t('Loading Qwen2-VL (vision)…', 'Chargement de Qwen2-VL (vision)…'));
    try {
      const { loadVisionSession } = await import('@/lib/webgpu/vision/qwen2vl');
      const s = await loadVisionSession({}, (p) => setLoadingStep(p));
      s.engine.onLost = (info) => {
        if (info?.reason === 'destroyed') return;
        console.warn('[vision] device GPU perdu');
        leaveVisionMode();
        setModelState('error');
        setErrorMsg(t('The GPU disconnected (vision needs ~2.6 GB of VRAM). Reload the model to try again.',
          'Le GPU s’est déconnecté (la vision demande ~2,6 Go de VRAM). Recharge le modèle pour réessayer.'));
      };
      setVisionSession(s);
      setCurrentConvId(null);
      visionKvRef.current = { convId: null, sess: '', fed: 0, pending: [] };
      setMessages([{
        id: 'welcome', role: 'assistant',
        content: t(
          'Vision mode — **Qwen2-VL 2B**. Attach an image (📎 button) and ask a question about it — everything runs locally on your GPU.',
          'Mode vision — **Qwen2-VL 2B**. Joins une image (bouton 📎) et pose une question dessus — tout tourne localement sur ton GPU.',
        ),
      }]);
      setModelState('ready');
    } catch (e: any) {
      console.error('[vision] chargement échoué', e);
      leaveVisionMode();
      setModelState('idle');
      setMessages([{ id: 'welcome', role: 'assistant', content: t(`Failed to load Qwen2-VL: ${e?.message || e}`, `Échec du chargement de Qwen2-VL : ${e?.message || e}`), isError: true }]);
    }
  };

  // Un tour de chat vision : compose le template Qwen2 (+ bloc image injecté s'il y a une pièce
  // jointe), préfille, puis décode token par token (échantillonnage temp 0.7 / top-k 40, affichage
  // throttlé). Multi-tours : le KV persiste tant qu'on reste dans la même conversation ; rouvrir
  // une vieille conv vision repart d'un contexte NEUF (les pixels des images ne sont pas persistés).
  const handleVisionMessage = async (prompt: string) => {
    const s = visionSession;
    if (!s) return;
    const img = pendingImage;
    setPendingImage(null);
    setUserInput('');
    if (!currentConvId) beginConversation();
    const vk = visionKvRef.current;
    const fresh = vk.convId !== currentConvId || vk.sess === '';
    setMessages(prev => [...prev, {
      id: nextMsgId(), role: 'user', content: prompt,
      ...(img ? { image: { url: img.preview, w: img.w, h: img.h, thumb: img.preview, full: img.preview } } : {}),
    }]);
    const aId = nextMsgId();
    setMessages(prev => [...prev, { id: aId, role: 'assistant', content: '' }]);
    setModelState('generating');
    const abort = new AbortController();
    abortControllerRef.current = abort;
    const setA = (content: string) => setMessages(prev => prev.map(m => m.id === aId ? { ...m, content } : m));
    try {
      const { encodeText, encodeImageBlock, IM_END, ENDOFTEXT } = await import('@/lib/webgpu/vision/qwen2vl');
      const { sampleNextToken } = await import('@/lib/webgpu/sampling');
      if (fresh) {
        s.model.reset();
        vk.convId = currentConvId ?? `conv-${Date.now()}`;
        vk.sess = `vision-${Date.now()}`;
        vk.fed = 0;
        vk.pending = [];
      }
      const ids: number[] = [...vk.pending];
      vk.pending = [];
      ids.push(...await encodeText(s, vk.fed === 0 && ids.length === 0
        ? '<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n<|im_start|>user\n'
        : '\n<|im_start|>user\n'));
      const inject: { at: number; rows: Float32Array }[] = [];
      if (img) {
        setA(t('Encoding the image…', 'Encodage de l’image…'));
        const block = await encodeImageBlock(s, img.dataUrl, (p) => setA(p));
        const at = vk.fed + ids.length + block.localAt;
        s.model.visionSegments.push({ at, gh: block.gh, gw: block.gw });
        inject.push({ at, rows: block.rows });
        ids.push(...block.ids);
      }
      ids.push(...await encodeText(s, `${prompt}<|im_end|>\n<|im_start|>assistant\n`));
      setA(t('Prefill…', 'Préfill…'));
      let tokens = ids, past = vk.fed;
      const outIds: number[] = [];
      let lastPaint = 0;
      for (let step = 0; step < 768; step++) {
        if (abort.signal.aborted) break;
        const logits = await s.model.logitsKV(tokens, past, vk.sess, step === 0 ? inject : undefined);
        past += tokens.length;
        const next = sampleNextToken(logits, { temperature: 0.7, topK: 40 });
        if (next === IM_END || next === ENDOFTEXT) { vk.pending = [IM_END]; break; }
        outIds.push(next);
        tokens = [next];
        vk.pending = [next]; // re-préfillé au tour suivant si on s'arrête ici (budget/stop)
        const now = performance.now();
        if (now - lastPaint > 120) { lastPaint = now; setA(s.tokenizer.decode(outIds, { skip_special_tokens: true })); }
      }
      vk.fed = past;
      const text = s.tokenizer.decode(outIds, { skip_special_tokens: true });
      setA(text || t('(empty answer)', '(réponse vide)'));
    } catch (e: any) {
      console.error('[vision] génération échouée', e);
      setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: t(`Vision error: ${e?.message || String(e)}`, `Erreur vision : ${e?.message || String(e)}`), isError: true } : m));
    } finally {
      abortControllerRef.current = null;
      setModelState('ready');
    }
  };

  // Generate an image from a prompt (image mode). Mirrors handleSendMessage's message flow but calls
  // the image generator and stores the result as an image bubble instead of streaming tokens.
  // « Affiner cette image » : reprend le prompt dans le composer et mémorise la SEED de l'image
  // source — le prochain envoi régénère avec le même bruit initial (composition conservée), le
  // texte enrichi fait le raffinement. Consommée une fois puis effacée.
  // Si l'image source est AFFICHÉE (url dispo) et que le générateur sait faire du vrai img2img,
  // on repart de ses PIXELS (TAESD encodeur + re-bruitage partiel) au lieu de la seule seed —
  // fidélité bien meilleure. Force réglable via ?strength= (défaut 0.55).
  const refineSeedRef = useRef<number | null>(null);
  const refineUrlRef = useRef<string | null>(null);
  const handleRefineImage = (prompt: string, seed: number, url?: string) => {
    refineSeedRef.current = seed;
    refineUrlRef.current = url ?? null;
    setUserInput(prompt);
    textareaRef.current?.focus();
  };

  const handleGenerateImage = async (prompt: string) => {
    if (!imageGen) return;
    if (!currentConvId) beginConversation();
    setMessages(prev => [...prev, { id: nextMsgId(), role: 'user', content: prompt }]);
    setUserInput('');
    setAttachments([]);
    const aId = nextMsgId();
    setMessages(prev => [...prev, { id: aId, role: 'assistant', content: t('Generating…', 'Génération…') }]);
    setModelState('generating');
    try {
      const onProgress = (s: string) => setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: s } : m));
      // Plafond mobile : 256px max même si un vieux réglage/URL porte 512 (pic VRAM → GPU repris
      // par l'OS en pleine génération — le sélecteur ne propose plus 512 sur téléphone).
      const refineSeed = refineSeedRef.current ?? undefined;
      const refineUrl = refineUrlRef.current;
      refineSeedRef.current = null;
      refineUrlRef.current = null;
      let img;
      if (refineUrl && imageGen.generateImg2Img) {
        // Affinage par les pixels (vrai img2img) — taille de sortie = taille de la source.
        const strength = (() => { const v = parseFloat(new URLSearchParams(location.search).get('strength') ?? ''); return Number.isFinite(v) && v > 0 && v <= 1 ? v : 0.55; })();
        img = await imageGen.generateImg2Img(prompt, refineUrl, strength, onProgress, refineSeed, gpuDuty);
      } else {
        img = await imageGen.generate(prompt, onProgress, refineSeed, isMobile ? Math.min(imageSize, 32) : imageSize, gpuDuty);
      }
      setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: '', image: { url: img.url, w: img.w, h: img.h, thumb: img.thumb, prompt, seed: img.seed, full: img.full } } : m));
    } catch (e: any) {
      setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: t(`Generation error: ${e?.message || String(e)}`, `Erreur de génération : ${e?.message || String(e)}`), isError: true } : m));
    } finally {
      setModelState('ready');
    }
  };

  // Click-to-reveal a persisted image: regenerate the full PNG from its prompt+seed (only the blurred
  // thumb was stored). Needs the image model loaded. Deterministic → identical to the original.
  const revealImage = async (id: string, prompt?: string, seed?: number) => {
    if (!imageGen || !prompt) return;
    // Regenerate at the ORIGINAL size (w/8), not the current selector — seed+size must both match
    // for the deterministic regeneration to reproduce the persisted thumbnail's image.
    const orig = messages.find(m => m.id === id)?.image;
    const origLatent = orig?.w ? Math.max(8, Math.round(orig.w / 8)) : undefined;
    setMessages(prev => prev.map(m => (m.id === id && m.image) ? { ...m, image: { ...m.image, revealing: true } as Message['image'] } : m));
    try {
      const img = await imageGen.generate(prompt, undefined, seed, origLatent, gpuDuty);
      setMessages(prev => prev.map(m => (m.id === id && m.image) ? { ...m, image: { ...m.image, url: img.url, revealing: false } } : m));
    } catch (e) {
      console.error('[image] révélation échouée', e);
      setMessages(prev => prev.map(m => (m.id === id && m.image) ? { ...m, image: { ...m.image, revealing: false } } : m));
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    // Vision mode: image + texte → texte (Qwen2-VL).
    if (visionSession) {
      const prompt = (textToSend ?? userInput).trim();
      if (prompt && modelState === 'ready') void handleVisionMessage(prompt);
      return;
    }
    // Image mode: a text→image model is loaded → the prompt produces an image, not an LLM token stream.
    if (imageGen) {
      const prompt = (textToSend ?? userInput).trim();
      if (prompt && modelState === 'ready') void handleGenerateImage(prompt);
      return;
    }
    const typed = textToSend ?? userInput;
    const sentAttachments = textToSend ? [] : attachments;
    const text = composeOutgoing(typed, sentAttachments);
    if (!text.trim() || modelState !== 'ready' || !activeModel || !activeTokenizer) return;
    
    const activeAbortController = new AbortController();
    abortControllerRef.current = activeAbortController;

    // Start a new saved conversation on the first message of a fresh chat.
    if (!currentConvId) beginConversation();

    stickToBottomRef.current = true; // envoyer = revenir suivre la réponse
    const userMsgId = nextMsgId();
    const newUserMessage: Message = { id: userMsgId, role: 'user', content: text };

    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setAttachments([]);
    setModelState('generating');

    const assistantMsgId = nextMsgId();
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);
    
    try {
      // NB : pas de activeModel.reset() ici — le cache KV du tour précédent est réutilisé (préfixe
      // commun). L'engine se réinitialise seul quand on démarre une session neuve (pastLen 0).

      // Recherche web opt-in : la question part vers Wikipédia, les extraits sont injectés dans le
      // TOUR COURANT du prompt uniquement (le message affiché et l'historique gardent le texte brut,
      // donc le préfixe KV des tours passés reste réutilisable). RAG minimal, pas de tool-calling —
      // fiable même sur un petit modèle. Échec de recherche → réponse sans contexte, jamais bloquant.
      let modelText = text;
      let webNote = '';
      if (webSearchOn) {
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: t('🌐 Searching the web…', '🌐 Recherche web…') } : m));
        const { searchWeb } = await import('@/lib/webSearch');
        const results = await searchWeb(text, locale === 'fr' ? 'fr' : 'en');
        if (results.length) {
          modelText = `${text}\n\n[Contexte issu d'une recherche web (Wikipédia). Appuie-toi sur ces extraits et cite tes sources :]\n` +
            results.map((r, i) => `(${i + 1}) ${r.title} : ${r.extract}\nSource : ${r.url}`).join('\n');
          webNote = ` · 🌐 ${results.length} ${results.length > 1 ? t('Wikipedia sources', 'sources Wikipédia') : t('Wikipedia source', 'source Wikipédia')}`;
        }
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: '' } : m));
      }

      // Lecture d'un lien collé (opt-in) : le texte de la page est injecté dans le tour courant.
      if (urlReadOn) {
        const urlMatch = text.match(/https?:\/\/[^\s)>"']+/);
        if (urlMatch) {
          setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: t('🔗 Reading the link…', '🔗 Lecture du lien…') } : m));
          const { readUrl } = await import('@/lib/webSearch');
          const page = await readUrl(urlMatch[0]);
          if (page) {
            modelText += `\n\n[Contenu de la page ${page.url} :]\n${page.content}`;
            webNote += t(' · 🔗 link read', ' · 🔗 lien lu');
          }
          setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: '' } : m));
        }
      }

      // Calculatrice locale : les expressions détectées sont évaluées EXACTEMENT côté CPU et le
      // résultat injecté — les petits modèles se trompent systématiquement en arithmétique.
      if (localToolsOn) {
        const calcs = detectCalcs(text);
        if (calcs.length) {
          modelText += `\n\n[Calculatrice — résultats exacts, utilise-les tels quels : ${calcs.map((c) => `${c.expr} = ${formatCalc(c.value)}`).join(' ; ')}]`;
          webNote += t(' · 🧮 calc', ' · 🧮 calcul');
        }
      }

      // Filter out errors and welcome message for prompt history
      const prevHistory = messages
        .filter(m => !m.isError && m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));
      
      const chatHistory = [...prevHistory, { role: 'user' as const, content: modelText }];
      let prompt = formatPrompt(chatHistory, modelArchType, systemPrompt);

      // Reflection budget (reasoning models only). 'off' prefills an empty <think></think> so the
      // model answers directly; otherwise we allow `thinkBudget` tokens of reasoning, then force a
      // close. Non-reasoning archs ignore all of this (thinkBudget stays 0).
      const isReasoning = modelArchType === 'deepseek' || modelArchType === 'qwen3'; // Qwen3 : <think> natif, même budget
      const thinkBudget = isReasoning ? THINK_BUDGETS[reflectionLevel] : 0;
      const effectiveMaxTokens = maxTokens + thinkBudget;
      if (isReasoning && reflectionLevel === 'off') prompt += '<think>\n\n</think>\n\n';
      // Token ids that close the thinking phase (no BOS/specials), tokenized lazily on first use.
      let closeThinkIds: number[] | null = null;
      const getCloseThinkIds = async (): Promise<number[]> => {
        if (!closeThinkIds) {
          const enc = await activeTokenizer('\n</think>\n\n', { add_special_tokens: false });
          closeThinkIds = Array.from(enc.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
        }
        return closeThinkIds;
      };
      let thinkClosed = false;

      // 1. Encode prompt. transformers v4 returns input_ids as a BigInt64Array, so coerce each
      // id to a plain Number — the WebGPU engine indexes with it (BigInt × Number would throw).
      // Cache inter-tours (tokCacheRef) : si le prompt courant étend celui du tour précédent, seul
      // le delta est tokenisé (add_special_tokens:false — les spéciaux éventuels sont déjà dans le
      // préfixe caché). Le token à la couture peut différer de la tokenisation canonique (fusion BPE
      // à travers la frontière) mais décode EXACTEMENT le même texte, et le préfixe KV compare `fed`
      // à nos propres ids → cohérent par construction. Tout mismatch (conv chargée, injection web au
      // tour passé, régénération) retombe sur la tokenisation complète. Kill-switch : ?tokcache=0.
      const toIds = (enc: { input_ids: { data: ArrayLike<number | bigint> } }) =>
        Array.from(enc.input_ids.data, (v) => Number(v));
      const tokCacheOn = new URLSearchParams(window.location.search).get('tokcache') !== '0';
      const tokCache = tokCacheRef.current;
      let promptTokens: number[];
      if (tokCacheOn && tokCache && tokCache.tok === activeTokenizer && prompt.length > tokCache.prompt.length && prompt.startsWith(tokCache.prompt)) {
        const delta = await activeTokenizer(prompt.slice(tokCache.prompt.length), { add_special_tokens: false });
        promptTokens = tokCache.tokens.concat(toIds(delta));
      } else {
        promptTokens = toIds(await activeTokenizer(prompt));
      }
      // Gemma est très sensible au <bos> (id 2) en tête : son template ne l'ajoute pas et le tokenizer
      // ne le fait pas toujours. Sans lui, Gemma part en rambling incohérent. On l'ajoute si absent.
      if (modelArchType === 'gemma' && promptTokens[0] !== 2) {
        promptTokens.unshift(2);
        console.warn('[brimkern] Gemma : <bos> (2) absent du prompt → ajouté en tête.');
      }
      // Mémorise la tokenisation APRÈS l'éventuel <bos> (le préfixe string reste valable : au tour
      // suivant, les tokens cachés commencent déjà par 2 → le check ci-dessus ne double rien).
      tokCacheRef.current = { tok: activeTokenizer, prompt, tokens: promptTokens };

      // 2. Prefill phase — incrémental : on ne (re)calcule que les tokens ABSENTS du cache KV.
      // Au tour N, le prompt = préfixe déjà en cache (tours précédents) + nouveau tour → coût
      // O(nouveau message) au lieu de O(historique entier). Sur mobile (~10 t/s de prefill), le
      // re-prefill complet doublait le temps de réponse dès le 2e message.
      // Kill-switches de diagnostic (régression device-specific, surtout mobile) :
      //   ?kvreuse=0  → désactive la réutilisation KV inter-tours (session neuve à chaque message)
      //   ?gputopk=0  → revient au sampling CPU plein-vocab (readback complet des logits)
      const dbg = new URLSearchParams(window.location.search);
      const kvReuseOn = dbg.get('kvreuse') !== '0';
      // GPU top-k désactivable par URL ET auto-désactivé si le self-test l'a jugé cassé sur ce GPU
      // (topKOk=false → repli CPU plein-vocab, plus lent mais toujours correct).
      const gpuTopkOn = dbg.get('gputopk') !== '0' && activeEngine?.topKOk !== false;

      const prevSess = kvSessRef.current;
      let sessionId = Date.now().toString();
      let fed: number[] = [];
      let pastLen = 0;
      if (kvReuseOn && prevSess && prevSess.model === activeModel && prevSess.fed.length > 0) {
        // Longueur du préfixe commun (≥1 token doit rester à prefill pour produire des logits).
        const nMax = Math.min(prevSess.fed.length, promptTokens.length - 1);
        let L = 0;
        while (L < nMax && prevSess.fed[L] === promptTokens[L]) L++;
        if (L > 0) { sessionId = prevSess.sessionId; fed = prevSess.fed.slice(0, L); pastLen = L; }
      }
      kvSessRef.current = { model: activeModel, sessionId, fed };
      const newPromptTokens = promptTokens.slice(pastLen);
      console.log(`[kv] ${pastLen > 0 ? `session réutilisée — préfixe ${pastLen}/${promptTokens.length} tokens déjà en cache` : `session neuve — prefill complet (${promptTokens.length} tokens)`}${kvReuseOn ? '' : ' [réutilisation coupée par ?kvreuse=0]'} · sampling ${gpuTopkOn ? 'GPU top-k' : 'CPU plein-vocab [?gputopk=0]'}`);

      const tPrefill0 = performance.now();

      // Sampling GPU-side (topKKV) : softcap + pénalité + top-K sur le GPU, seuls ~64 candidats
      // reviennent (512 o) au lieu du vocab entier (~600 Ko/token) — le plancher mobile.
      const recentIds = (toks: number[]) => [...new Set(toks.slice(-REPEAT_WINDOW))];
      let currentToken: number;
      if (gpuTopkOn) {
        const pre = await activeModel.topKKV(newPromptTokens, pastLen, sessionId, recentIds(promptTokens), SAMPLING.repetitionPenalty);
        currentToken = sampleFromTopK(pre.ids, pre.vals, SAMPLING);
      } else {
        currentToken = sampleNextToken(
          await activeModel.logitsKV(newPromptTokens, pastLen, sessionId),
          { ...SAMPLING, recentTokens: promptTokens.slice(-REPEAT_WINDOW) },
        );
      }
      fed.push(...newPromptTokens);

      // Invalid token = NaN/garbage logits. The usual cause is numeric overflow at low precision —
      // Gemma especially (logit softcaps + large activations) overflows f16 (max 65504) → NaN. Give an
      // actionable message instead of the cryptic "token_ids must be a non-empty array" from decode().
      if (!Number.isInteger(currentToken) || currentToken < 0) {
        throw new Error(t(
          'The model produced invalid output (NaN logits). At f16 some models (e.g. Gemma, precision-sensitive) overflow — try the f32 (Quality) precision, or int8.',
          'Le modèle a produit une sortie invalide (logits NaN). En f16, certains modèles (ex. Gemma, sensible à la précision) débordent — essayez la précision f32 (Qualité), ou int8.',
        ));
      }

      const tPrefill1 = performance.now();
      const prefillTimeMs = tPrefill1 - tPrefill0;
      
      // Detokenize first token
      let assistantText = stripTurnMarkers(await activeTokenizer.decode([currentToken], { skip_special_tokens: true }));
      const generatedTokens = [currentToken];
      
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMsgId) {
          return { ...m, content: assistantText };
        }
        return m;
      }));
      
      // 3. Autoregressive decoding phase.
      // Perf mobile : l'ancien chemin re-détokenisait TOUTE la séquence et re-rendait toute la liste
      // de messages À CHAQUE token (O(n²) cumulé, sur le main thread, ENTRE deux soumissions GPU →
      // tout est sérialisé). Désormais : détection d'arrêt sur la queue seule (8 tokens ≈ 30+ chars,
      // les marqueurs font ≤ ~22), et affichage throttlé à ~8 Hz + rendu final complet.
      const tDecodeStart = performance.now();
      let stepCount = 1;
      let lastUiMs = 0;

      // Bandeau diagnostic sous la réponse : ce qui a RÉELLEMENT tourné (précision, format KV,
      // chemin de sampling, réutilisation du préfixe) — indispensable pour les tests mobiles.
      // Honnêteté du bandeau : si le FICHIER est plus quantifié que la précision demandée (BRIK
      // q4-natif affiché « int8 » via requantification), la qualité réelle est celle de la source.
      const native = activeModel.nativePrecision;
      const capped = (native === 'q4' && weightPrec !== 'q4') || (native === 'q8' && (weightPrec === 'f16' || weightPrec === 'f32'));
      // BRIK mixte (attention q8 + corps q4) à sa précision native : « int8 » serait trompeur (le
      // corps est int4) et « int4 » injuste (la qualité mesurée ≈ int8) → étiquette dédiée. Un tier
      // choisi explicitement redevient uniforme et garde l'étiquette classique (source mixte).
      const mixedNative = activeModel.isMixedNative;
      const precLabel = mixedNative && weightPrec === native
        ? t('mixed int8+int4', 'mixte int8+int4')
        : `${PREC_LABEL[weightPrec] ?? weightPrec}${capped ? ` (source ${mixedNative ? t('mixed', 'mixte') : PREC_LABEL[native]})` : ''}`;
      const runInfo = `${precLabel}${kvQuantOn ? ' · KV int8' : ''} · ${gpuTopkOn ? 'top-k GPU' : 'top-k CPU'} · ${t('prefix', 'préfixe')} ${pastLen}/${promptTokens.length}${webNote}`;
      const pushUi = (text: string) => {
        const decodeElapsedMs = performance.now() - tDecodeStart;
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? {
          ...m,
          content: text,
          timings: {
            info: runInfo,
            prompt_tokens: newPromptTokens.length,
            prompt_time_ms: prefillTimeMs,
            prompt_speed_ts: newPromptTokens.length / (prefillTimeMs / 1000),
            decode_tokens: stepCount,
            decode_time_ms: decodeElapsedMs,
            decode_speed_ts: (stepCount - 1) / (decodeElapsedMs / 1000),
            total_time_ms: prefillTimeMs + decodeElapsedMs,
          },
        } : m));
      };

      while (stepCount < effectiveMaxTokens) {
        if (activeAbortController.signal.aborted) break;

        // Single token forward step utilizing the KV cache → GPU-side top-K (forward + softcap +
        // repetition penalty + selection in ONE submit, 512-byte readback), then CPU sampling over
        // the candidates — same math as the old full-logits path (?gputopk=0 falls back to it).
        const pos = promptTokens.length + stepCount - 1;
        let nextToken: number;
        if (gpuTopkOn) {
          const step = await activeModel.topKKV([currentToken], pos, sessionId, recentIds([...promptTokens, ...generatedTokens]), SAMPLING.repetitionPenalty);
          nextToken = sampleFromTopK(step.ids, step.vals, SAMPLING);
        } else {
          nextToken = sampleNextToken(await activeModel.logitsKV([currentToken], pos, sessionId), {
            ...SAMPLING,
            recentTokens: [...promptTokens, ...generatedTokens].slice(-REPEAT_WINDOW),
          });
        }
        fed.push(currentToken);

        currentToken = nextToken;
        generatedTokens.push(currentToken);
        stepCount++;

        // Queue brute (marqueurs de tour non filtrés) pour la détection d'arrêt — coût constant.
        const tailRaw: string = await activeTokenizer.decode(generatedTokens.slice(-8), { skip_special_tokens: true });

        // Reflection budget reached and the model is STILL inside <think> → force-close the thinking
        // phase so it commits to an answer. We (1) flush the just-sampled pending token into the KV
        // cache exactly as the next iteration would, (2) append the </think> tokens, then (3) sample
        // the first answer token. KV invariant preserved: `currentToken` stays the unfed pending one.
        // (Le décodage complet nécessaire au test n'arrive qu'une fois le budget atteint.)
        if (isReasoning && thinkBudget > 0 && !thinkClosed && generatedTokens.length >= thinkBudget) {
          const rawText = await activeTokenizer.decode(generatedTokens, { skip_special_tokens: true });
          if (rawText.includes('</think>') || !rawText.includes('<think>')) {
            thinkClosed = true; // fermé tout seul (ou jamais ouvert) → plus rien à forcer
          } else {
            thinkClosed = true;
            await activeModel.logitsKV([currentToken], promptTokens.length + generatedTokens.length - 1, sessionId);
            fed.push(currentToken);
            let closeLogits: Float32Array | null = null;
            for (const tk of await getCloseThinkIds()) {
              const pos = promptTokens.length + generatedTokens.length;
              generatedTokens.push(tk);
              closeLogits = await activeModel.logitsKV([tk], pos, sessionId);
              fed.push(tk);
            }
            currentToken = sampleNextToken(closeLogits!, {
              ...SAMPLING,
              recentTokens: [...promptTokens, ...generatedTokens].slice(-REPEAT_WINDOW),
            });
            generatedTokens.push(currentToken);
            stepCount = generatedTokens.length;
            assistantText = stripTurnMarkers(await activeTokenizer.decode(generatedTokens, { skip_special_tokens: true }));
            setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantText } : m));
            continue;
          }
        }

        // Affichage throttlé (~8 Hz) : décodage complet + re-render seulement à ce rythme.
        const nowMs = performance.now();
        if (nowMs - lastUiMs > 120) {
          lastUiMs = nowMs;
          assistantText = stripTurnMarkers(await activeTokenizer.decode(generatedTokens, { skip_special_tokens: true }));
          pushUi(assistantText);
        }

        // Check for stop tokens — scan the raw tail (markers can be ~22 chars wide).
        if (isStopToken(currentToken, tailRaw.slice(-48), modelArchType)) {
          break;
        }
      }

      // Rendu final complet + stats définitives (la boucle s'arrête presque toujours entre deux
      // ticks d'affichage — sans ça, la fin du message manquerait).
      assistantText = stripTurnMarkers(await activeTokenizer.decode(generatedTokens, { skip_special_tokens: true }));
      pushUi(assistantText);

      setModelState('ready');
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('abort') || activeAbortController.signal.aborted) {
        setModelState('ready');
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId && m.content === '') {
            return { ...m, content: t('*Generation interrupted by the user.*', "*Génération interrompue par l'utilisateur.*") };
          }
          return m;
        }));
      } else {
        console.error("Erreur de calcul WebGPU :", e);
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId) {
            return {
              ...m,
              content: t(`GPU matrix execution error: ${e.message || String(e)}`, `Erreur d'exécution matricielle GPU : ${e.message || String(e)}`),
              isError: true
            };
          }
          return m;
        }));
        // Device GPU perdu : onLost a (ou va) basculer l'app en erreur récupérable — surtout ne pas
        // repasser à « ready » (le moteur est mort, chaque envoi replanterait à l'identique).
        if (!activeEngine?.lost) setModelState('ready');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setModelState('ready');
    }
  };

  // Benchmark decode throughput with f32 vs f16 layer weights (the core of the BRIK idea).
  // Prefill a fixed prompt (untimed, also warms the weight cache at each precision), then time
  // N greedy decode steps. Results pushed as a chat message.
  const handleBenchmark = async () => {
    if (!activeModel || !activeTokenizer || modelState !== 'ready' || benchRunning) return;
    setBenchRunning(true);
    try {
      const prompt = formatPrompt([{ role: 'user', content: 'Explain quantum computing in one short paragraph.' }], modelArchType, systemPrompt);
      const encoded = await activeTokenizer(prompt);
      const promptTokens = Array.from(encoded.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
      const N = 24;
      // Empreinte VRAM résidente par précision (octets/param). On NE mesure pas une précision qui
      // dépasserait un budget sûr : sur un 4B, le pass f32 (~16 Go) ou f16 (~8 Go) fait PERDRE le
      // device GPU (mapAsync « external Instance no longer exists ») → bench planté. Budget prudent
      // 4 Go → un gros modèle ne compare que ses tiers quantifiés (ceux qu'on utilise réellement).
      const BPP: Record<string, number> = { f32: 4, f16: 2, q8: 1, q4: 0.5, q3: 0.375 };
      const totalParams = Object.values(modelMetadata?.tensors as Record<string, { nElems?: number }> ?? {}).reduce((a, t) => a + (t.nElems || 0), 0);
      const fits = (p: string) => totalParams === 0 || totalParams * BPP[p] * 1.3 <= 4e9;
      const measure = async (precision: 'f32' | 'f16' | 'q8' | 'q4' | 'q3') => {
        activeModel.setWeightPrecision(precision);
        activeModel.reset();
        const sid = `bench-${precision}-${Date.now()}`;
        let cur = await activeModel.generateNextKV(promptTokens, 0, sid); // prefill: builds+warms weights
        const t0 = performance.now();
        for (let i = 0; i < N; i++) cur = await activeModel.generateNextKV([cur], promptTokens.length + i, sid);
        return N / ((performance.now() - t0) / 1000);
      };
      // Saute une précision trop lourde ; isole une éventuelle perte de device pour ne pas tout planter.
      const safeMeasure = async (p: 'f32' | 'f16' | 'q8' | 'q4' | 'q3') => {
        if (!fits(p)) return null;
        try { return await measure(p); } catch (e) { console.warn(`[bench] précision ${p} ignorée:`, e); return null; }
      };
      kvSessRef.current = null; // le benchmark écrase le cache KV → la session de chat n'est plus réutilisable
      const f32 = await safeMeasure('f32');
      const f16 = await safeMeasure('f16');
      const q8 = activeModel.supportsQ8 ? await safeMeasure('q8') : null;
      const q4 = activeModel.supportsQ4 ? await safeMeasure('q4') : null;
      // q3 n'a pas de requantif à la volée (pas de f32→q3 GPU) : ne le mesurer que si le modèle est
      // DÉJÀ q3 natif, sinon measure('q3') retomberait sur le chemin f32 et afficherait un chiffre faux.
      const q3 = activeModel.nativePrecision === 'q3' ? await safeMeasure('q3') : null;
      const skippedHeavy = (['f32', 'f16'] as const).filter((p) => !fits(p));
      activeModel.setWeightPrecision(activeModel.nativePrecision); // restore the model's default for normal chat
      setWeightPrec(activeModel.nativePrecision);
      activeModel.reset();
      setMessages(prev => [...prev, {
        id: `bench-${Date.now()}`, role: 'assistant',
        content: t(
          `**⚡ Decode benchmark** (${N} tokens, model **${loadedModelName}**)\n\n` +
          (f32 !== null ? `- **f32** weights: \`${f32.toFixed(1)} tok/s\` (VRAM ref. 1×)\n` : '') +
          (f16 !== null ? `- **f16** weights: \`${f16.toFixed(1)} tok/s\` (½ VRAM)\n` : '') +
          (q8 !== null ? `- **BRIK8** (int8) weights: \`${q8.toFixed(1)} tok/s\` (~f16 quality, ½ the VRAM of f16)\n` : '') +
          (q4 !== null ? `- **BRIK4** (int4) weights: \`${q4.toFixed(1)} tok/s\` (¼ VRAM)\n` : '') +
          (q3 !== null ? `- **BRIK3** (int3) weights: \`${q3.toFixed(1)} tok/s\` (~20% less than int4)\n` : '') +
          (skippedHeavy.length ? `\n*${skippedHeavy.join(' / ')} skipped — too large in VRAM for this model (would risk a GPU device loss).*` : '') +
          `\n*All precisions share the same GPU-resident path; BRIK8/BRIK4/BRIK3 keep the quantized weights in VRAM (dequantized on the fly), which lets bigger models fit. embed + logits projection stay in f32.*`,
          `**⚡ Benchmark décodage** (${N} tokens, modèle **${loadedModelName}**)\n\n` +
          (f32 !== null ? `- Poids **f32** : \`${f32.toFixed(1)} tok/s\` (réf. VRAM 1×)\n` : '') +
          (f16 !== null ? `- Poids **f16** : \`${f16.toFixed(1)} tok/s\` (½ VRAM)\n` : '') +
          (q8 !== null ? `- Poids **BRIK8** (int8) : \`${q8.toFixed(1)} tok/s\` (qualité ~f16, ½ VRAM de f16)\n` : '') +
          (q4 !== null ? `- Poids **BRIK4** (int4) : \`${q4.toFixed(1)} tok/s\` (¼ VRAM)\n` : '') +
          (q3 !== null ? `- Poids **BRIK3** (int3) : \`${q3.toFixed(1)} tok/s\` (~20% de moins que l'int4)\n` : '') +
          (skippedHeavy.length ? `\n*${skippedHeavy.join(' / ')} non mesuré(s) — trop lourd(s) en VRAM pour ce modèle (risque de perte du device GPU).*` : '') +
          `\n*Toutes les précisions partagent le même chemin GPU-resident ; BRIK8/BRIK4/BRIK3 gardent les poids quantifiés en VRAM (déquant à la volée), ce qui permet de charger des modèles plus gros. embed + projection logits restent en f32.*`,
        )
      }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { id: `bench-err-${Date.now()}`, role: 'assistant', isError: true, content: t(`Benchmark failed: ${e?.message || e}`, `Benchmark échoué : ${e?.message || e}`) }]);
      try { activeModel.setWeightPrecision(activeModel.nativePrecision); } catch { /* noop */ }
    } finally {
      setBenchRunning(false);
    }
  };

  // Switch layer-weight precision (f32 / f16 = faster + ½ VRAM / q4 = ¼ VRAM, bigger models).
  // Applies on the next message (weights rebuild lazily at the new precision).
  const changePrecision = (p: 'f32' | 'f16' | 'q8' | 'q4' | 'q3') => {
    if (!activeModel || p === weightPrec || modelState === 'generating' || benchRunning) return;
    try {
      activeModel.setWeightPrecision(p);
      activeModel.reset();
      kvSessRef.current = null; // KV vidé → prochaine génération repart d'une session neuve
      setWeightPrec(p);
    } catch (e: any) {
      setMessages(prev => [...prev, { id: `prec-err-${Date.now()}`, role: 'assistant', isError: true, content: t(`Precision ${p} unavailable: ${e?.message || e}`, `Précision ${p} indisponible : ${e?.message || e}`) }]);
    }
  };

  // Switch (back) to Auto: recompute the VRAM-driven precision for the current model + device and apply it.
  const applyAutoPrec = () => {
    setAutoPrec(true);
    if (!activeModel || !modelMetadata?.tensors) return;
    const totalParams = Object.values(modelMetadata.tensors as Record<string, { nElems?: number }>).reduce((a, t) => a + (t.nElems || 0), 0);
    const auto = pickAutoPrecision(totalParams, activeModel.supportsQ8, !!activeEngine?.hasF16, isMobile, activeEngine?.maxStorageBufferBindingSize || 0);
    changePrecision(auto);
    changeKvQuant(auto === 'q4' || totalParams > 1.2e9); // KV int8 seulement quand ça compte (gros modèle / q4) — sinon f32, plus rapide
  };

  // Toggle the compact int8 KV cache (longer context for the same VRAM). Applies on the next message.
  const changeKvQuant = (on: boolean) => {
    if (!activeModel || on === kvQuantOn || modelState === 'generating' || benchRunning) return;
    activeModel.setKvQuant(on);
    activeModel.reset();
    kvSessRef.current = null; // format du cache changé (f32↔q8) → session neuve
    setKvQuantOn(on);
  };


  // Copy message
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePresetPromptClick = (text: string) => {
    if (modelState === 'ready') {
      handleSendMessage(text);
    } else {
      setUserInput(text);
    }
  };

  // What the header/sidebar show as "loaded": the image generator's name in image mode, else the LLM.
  const displayModelName = visionSession ? 'Qwen2-VL 2B (vision)' : imageGen ? imageGen.name : loadedModelName;
  // Unload whichever model is active (LLM, image generator or vision session).
  const unloadActiveModel = () => {
    if (visionSession) { leaveVisionMode(); setMessages([]); setModelState('idle'); }
    else if (imageGen) { imageGen.dispose?.(); setImageGen(null); setMessages([]); setModelState('idle'); }
    else handleUnloadModel();
  };

  // Relance le dernier chargement depuis l'écran d'erreur (après une perte du device GPU, le chemin
  // nominal : chaque chargement recrée un moteur neuf, et les plages déjà en cache sont réutilisées).
  const retryLastLoad = () => {
    const url = loadedModelUrl || (isMobile ? MOBILE_BRIK_URL : '');
    if (!url) return;
    if (url.endsWith('.brik')) handleStreamBrik(url);
    else handleLoadModelFromUrl(url);
  };

  // Approximate size of the prompt the next send will build (history + draft + system), used for the
  // composer's token counter + soft-cap warning. Cheap char-based estimate — see CONTEXT_SOFT_CAP.
  const contextTokens =
    messages.filter((m) => !m.isError && m.id !== 'welcome').reduce((a, m) => a + approxTokens(m.content), 0) +
    approxTokens(userInput) + approxTokens(systemPrompt) +
    attachments.reduce((a, at) => a + approxTokens(at.content), 0);
  const contextOver = contextTokens > CONTEXT_SOFT_CAP;

  // On mobile, only the light models are shown by default (phone GPUs/VRAM choke on the bigger
  // ones). The user can reveal the rest with "afficher tous". Desktop sees everything.
  const visibleModels = isMobile && !showAllModels ? PRESET_MODELS.filter((m) => m.mobile) : PRESET_MODELS;

  return (
    <div className="app-container">
      {/* Splash d'accueil retiré (2026-07-21) : il promettait un chargement puis disparaissait sans
          modèle chargé → confusion. L'accueil clair + le préchargement en arrière-plan (auto-load quand
          le cache est complet) suffisent. */}
      {/* Mobile backdrop — tap outside the drawer to close it */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9 }}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {/* Marque « kern-B » : un B massif entaillé d'un crénage diagonal (brimKERN). SVG inline
              plat — currentColor suit le thème, zéro asset (l'ancien PNG glossy de 200 Ko est retiré). */}
          <svg width="40" height="40" viewBox="0 0 100 100" aria-label="Brimkern" className="logo-image" style={{ flexShrink: 0, color: 'var(--text-primary)' }}>
            <defs><clipPath id="brimkern-kern" clipPathUnits="userSpaceOnUse"><path clipRule="evenodd" d="M0 0H100V100H0Z M62 -10 L34 112 L46 112 L74 -10 Z" /></clipPath></defs>
            <text x="50" y="86" textAnchor="middle" fontFamily="var(--font-heading), Georgia, serif" fontSize="100" fontWeight="900" fill="currentColor" clipPath="url(#brimkern-kern)">B</text>
          </svg>
          <div className="logo-text">Brimkern</div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
              style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              title={dark ? (locale === 'fr' ? 'Mode clair' : 'Light mode') : (locale === 'fr' ? 'Mode nuit' : 'Dark mode')}
              style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px' }}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                title={t('Close panel', 'Fermer le panneau')}
                style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '16px 20px 0 20px' }}>
          <button
            className="new-chat-btn"
            onClick={() => { handleNewChat(); if (isMobile) setIsSidebarOpen(false); }}
            disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
          >
            <Plus size={16} />
            <span>{t('New conversation', 'Nouvelle conversation')}</span>
          </button>
        </div>

        <div className="sidebar-content">
          {/* Section: Conversation history */}
          {conversations.length > 0 && (
            <div className="sidebar-section">
              <div className="section-title">
                <MessageSquare size={14} /> Conversations
              </div>
              <div className="card" style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '220px', overflowY: 'auto' }}>
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => { openConversation(c); if (isMobile) setIsSidebarOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '7px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
                      background: c.id === currentConvId ? 'var(--accent-bg-rgba)' : 'transparent',
                      color: c.id === currentConvId ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={c.title}>{c.title}</span>
                    <button
                      onClick={(e) => handleDeleteConversation(c.id, e)}
                      title={t('Delete conversation', 'Supprimer la conversation')}
                      style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', flexShrink: 0 }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Moteur GPU — petite carte de statut (plus de section « compatibilité matérielle » ni de
              dépliable). L'aide détaillée n'apparaît que si WebGPU est absent (erreur bloquante). */}
          <div className="sidebar-section">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={13} /> {t('GPU engine', 'Moteur GPU')}
                </span>
                {webGpuSupported === null ? (
                  <span className="status-badge unsupported">{t('Checking…', 'Vérification...')}</span>
                ) : webGpuSupported ? (
                  <span className="status-badge supported">{t('Active (WGSL)', 'Actif (WGSL)')}</span>
                ) : (
                  <span className="status-badge unsupported">{t('Unsupported', 'Non supporté')}</span>
                )}
              </div>
              {webGpuSupported === false && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '11px', lineHeight: 1.5, color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1, color: 'var(--error)' }} />
                  <span>
                    {t('No model can run without WebGPU. Most common cause: ', 'Aucun modèle ne peut tourner sans WebGPU. Cause la plus fréquente : ')}
                    <strong>{t('hardware acceleration is disabled', "l'accélération matérielle est désactivée")}</strong>
                    {t('. Enable it (Chrome: Settings → System → “Use graphics acceleration when available”), restart the browser, then reload. Also requires a recent Chrome/Edge and HTTPS — see chrome://gpu if it persists.',
                      ' . Activez-la (Chrome : Paramètres → Système → « Utiliser l\'accélération graphique si disponible »), redémarrez le navigateur puis rechargez. Exige aussi un Chrome/Edge récent et HTTPS — voir chrome://gpu si ça persiste.')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section: GGUF Loader */}
          <div className="sidebar-section">
            <div className="section-title">
              <Database size={14} /> {t('Model loader', 'Chargeur de modèle')}
            </div>

            {/* Mobile: radically simplified — only the hosted, streamed BRIK model (low VRAM,
                tokenizer embedded). No GGUF tabs / conversion (too heavy for a phone). */}
            {isMobile && (
              <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loadedModelName ? (
                  // Chargé : on confirme ET on offre « changer de modèle » (bug : avant, cul-de-sac —
                  // impossible d'en reprendre un autre sur mobile). Ouvre le navigateur de modèles.
                  <>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.4 }}>
                      <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      <span>{t('Model loaded:', 'Modèle chargé :')} <strong>{loadedModelName}</strong></span>
                    </div>
                    <button
                      className="btn btn-secondary btn-block"
                      style={{ fontSize: '12px' }}
                      onClick={() => setBrowseOpen(true)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      <Database size={13} /> {t('Change model', 'Changer de modèle')}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Deux choix TEXTE sur mobile (retour Romain 2026-07-21) : LFM2.5 149 Mo
                        (défaut, meilleur chat FR à ce poids) et Qwen 0.5B 378 Mo (plus costaud). */}
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {t('Two lightweight models, streamed with embedded tokenizer:', 'Deux modèles légers, streamés avec tokenizer embarqué :')}
                    </div>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => handleStreamBrik(MOBILE_BRIK_URL)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      <Sparkles size={14} /> {t('LFM2.5 230M (149 MB) — recommended', 'LFM2.5 230M (149 Mo) — recommandé')}
                    </button>
                    <button
                      className="btn btn-secondary btn-block"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleStreamBrik(QWEN_MOBILE_BRIK_URL)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      <Sparkles size={13} /> {t('Qwen 2.5 0.5B (378 MB) — beefier', 'Qwen 2.5 0.5B (378 Mo) — plus costaud')}
                    </button>
                    {prefetchStatus(false)}
                    <button
                      className="btn btn-secondary btn-block"
                      style={{ fontSize: '12px' }}
                      onClick={() => setBrowseOpen(true)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      <Database size={13} /> {t('Browse all models', 'Parcourir tous les modèles')}
                    </button>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{t('Browse for more (Qwen 3 0.6B, Gemma…). The two above stream instantly; others convert on first load.', "Parcours-en d'autres (Qwen 3 0.6B, Gemma…). Les deux ci-dessus sont streamés instantanément ; les autres se convertissent au 1er chargement.")}</div>
                  </>
                )}
                {/* Génération d'image mobile (beta) : SDXS-512 distillé (~350 Mo q8 + CLIP 362 Mo,
                    1 step natif) — le tier taillé pour téléphone. Chargé via le même pipeline BRIK. */}
                <button
                  className="btn btn-secondary btn-block"
                  style={{ fontSize: '12px' }}
                  onClick={() => loadImageModel()}
                  disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                >
                  <ImageIcon size={13} /> {t('Try image generation (beta)', "Essayer la génération d'image (bêta)")}
                </button>
              </div>
            )}

            {!isMobile && (
              <button
                className="btn btn-primary btn-block"
                onClick={() => setBrowseOpen(true)}
                disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
              >
                <Database size={14} /> {t('Browse / load a model', 'Parcourir / charger un modèle')}
              </button>
            )}
            {/* Labo vidéo (desktop) : le banc /video-test?gen=1 — 1,5 Go streamés + ~4 min de GPU,
                assumé expérimental en attendant l'onglet produit (tâche étape 4). */}
            {!isMobile && (
              // Vrai bouton-lien (comme la génération d'image) — était un texte gris qu'on ne voyait pas.
              <a href="/video-test?gen=1" className="btn btn-secondary btn-block" style={{ fontSize: '12px', marginTop: 8, textDecoration: 'none' }}>
                <Film size={13} /> {t('Video lab (beta) — generate a clip', 'Labo vidéo (bêta) — générer un clip')}
              </a>
            )}
            {!isMobile && loadedModelName && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <CheckCircle size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t('Loaded:', 'Chargé :')} {loadedModelName}</span>
              </div>
            )}
            {browseOpen && createPortal((
            <ModelBrowserModal
              setBrowseOpen={setBrowseOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              modelState={modelState}
              autoConvert={autoConvert}
              setAutoConvert={setAutoConvert}
              convertTier={convertTier}
              setConvertTier={setConvertTier}
              modelQuery={modelQuery}
              setModelQuery={setModelQuery}
              isMobile={isMobile}
              showAllModels={showAllModels}
              setShowAllModels={setShowAllModels}
              loadedModelName={loadedModelName}
              isCached={isCached}
              userModels={userModels}
              setUserModels={setUserModels}
              benchRunning={benchRunning}
              handleUnloadModel={handleUnloadModel}
              handleLoadModelFromUrl={handleLoadModelFromUrl}
              handleStreamBrik={handleStreamBrik}
              loadLocalBrikFromCache={loadLocalBrikFromCache}
              handleLoadLocalModel={handleLoadLocalModel}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              customHFUrl={customHFUrl}
              setCustomHFUrl={setCustomHFUrl}
              brikUrl={brikUrl}
              setBrikUrl={setBrikUrl}
              selectedTokenizerId={selectedTokenizerId}
              setSelectedTokenizerId={setSelectedTokenizerId}
              isDragging={isDragging}
              onLoadImageModel={loadImageModel}
              onLoadVisionModel={isMobile ? undefined : loadVisionModel}
            />
            ), document.body)}
          </div>


          {/* Section: Specifications */}
          {modelMetadata && (
            <div className="sidebar-section">
              <div className="section-title">
                <Info size={14} /> {t('physical specifications', 'spécifications physiques')}
              </div>
              <div className="card" style={{ padding: '12px' }}>
                <table className="metadata-table">
                  <tbody>
                    <tr>
                      <th>Architecture</th>
                      <td>{modelMetadata.arch}</td>
                    </tr>
                    <tr>
                      <th>{t('Embd size (d)', "Taille d'embd (d)")}</th>
                      <td>{modelMetadata.config.d}</td>
                    </tr>
                    <tr>
                      <th>{t('Layer blocks', 'Couches Blocks')}</th>
                      <td>{modelMetadata.config.blockCount}</td>
                    </tr>
                    <tr>
                      <th>{t('Q / KV heads', 'Têtes Q / KV')}</th>
                      <td>{modelMetadata.config.nHeads} / {modelMetadata.config.nKvHeads}</td>
                    </tr>
                    <tr>
                      <th>{t('RoPE frequency', 'Fréquence RoPE')}</th>
                      <td>{modelMetadata.config.ropeTheta}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: advanced / dev options — collapsed by default (most users don't need these). */}
          {loadedModelName && !isMobile && (
            <div className="sidebar-section">
              <button
                onClick={() => setAdvOpen((o) => !o)}
                className="section-title"
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Zap size={14} />
                <span style={{ flex: 1, textAlign: 'left' }}>{t('Advanced options (dev)', 'Options avancées (dév)')}</span>
                <ChevronDown size={14} style={{ transform: advOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
              </button>
              {advOpen && (
                <div className="card" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {t('Precision is auto-picked from your GPU. Override it, the KV cache, or benchmark throughput here.', 'La précision est choisie automatiquement selon ton GPU. Force ici un autre choix, le cache KV, ou mesure le débit.')}
                  </div>

                  {/* Force weight precision (VRAM) */}
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: 4 }}>{t('Weight precision (VRAM)', 'Précision des poids (VRAM)')}</div>
                    <div className="tabs-container" style={{ gap: '2px' }}>
                      <button className={`tab-btn ${autoPrec ? 'active' : ''}`} onClick={applyAutoPrec} disabled={modelState === 'generating' || benchRunning} title={t('Auto (VRAM-driven)', 'Auto (selon la VRAM)')} style={{ fontSize: '11px', padding: '6px 4px' }}>Auto</button>
                      {([
                        { id: 'f32' as const, label: 'f32', enabled: true },
                        { id: 'f16' as const, label: 'f16', enabled: !!activeEngine?.hasF16 },
                        { id: 'q8' as const, label: 'int8', enabled: !!activeModel?.supportsQ8 },
                        { id: 'q4' as const, label: 'int4', enabled: !!activeModel?.supportsQ4 },
                      ]).map((opt) => (
                        <button
                          key={opt.id}
                          className={`tab-btn ${!autoPrec && weightPrec === opt.id ? 'active' : ''}`}
                          onClick={() => { setAutoPrec(false); changePrecision(opt.id); }}
                          disabled={!opt.enabled || modelState === 'generating' || benchRunning}
                          title={!opt.enabled ? t('Unavailable: d or ffn not a multiple of 32', 'Indisponible : d ou ffn non multiple de 32')
                            : opt.id === 'q4' ? t('⚠️ int4 badly degrades small models (<1B): nonsensical refusals, repetition. Reserve it for big models that don\'t fit in int8.', '⚠️ int4 dégrade fortement les petits modèles (<1B) : refus absurdes, répétitions. Réservé aux gros modèles qui ne tiennent pas en int8.')
                            : undefined}
                          style={{ fontSize: '12px', padding: '6px 4px' }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {autoPrec && (
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: 4 }}>Auto → <strong style={{ color: 'var(--accent)' }}>{PREC_LABEL[weightPrec] ?? weightPrec}</strong></div>
                    )}
                    {!autoPrec && !modelIsBrik && weightPrec !== 'f32' && weightPrec !== 'f16' && (
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: 4 }}>{t('GGUF: int8/int4 re-quantized on every load. Convert to ', 'GGUF : int8/int4 quantifiés à chaque chargement. Convertir en ')}<strong style={{ color: 'var(--accent)' }}>BRIK</strong>{t(' → instant loading.', ' → chargement instantané.')}</div>
                    )}
                  </div>

                  {/* KV cache */}
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: 4 }}>{t('Attention cache (context)', 'Cache attention (contexte)')}</div>
                    <div className="tabs-container" style={{ gap: '2px' }}>
                      {([
                        { on: false, label: 'KV f32', hint: t('Full-precision attention cache (ref.)', 'Cache attention pleine précision (réf.)') },
                        { on: true, label: t('✦ KV q8 (long context)', '✦ KV q8 (contexte long)'), hint: t('int8 cache · ¼ KV VRAM → ~4× more context', 'Cache int8 · ¼ VRAM KV → ~4× plus de contexte') },
                      ]).map((opt) => (
                        <button
                          key={String(opt.on)}
                          className={`tab-btn ${kvQuantOn === opt.on ? 'active' : ''}`}
                          onClick={() => changeKvQuant(opt.on)}
                          disabled={modelState === 'generating' || benchRunning}
                          title={opt.hint}
                          style={{ fontSize: '11px', padding: '6px 4px', fontWeight: opt.on ? 700 : 500 }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Decode-throughput benchmark */}
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={handleBenchmark}
                    disabled={modelState !== 'ready' || benchRunning}
                    style={{ fontSize: '12px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    title={t('Measures decode throughput (f32 / f16 / int4). ⚠️ Compute-heavy: the tab may freeze for a few moments.', "Mesure le débit de décodage (f32 / f16 / int4). ⚠️ Calcul intensif : l'onglet peut se figer quelques instants.")}
                  >
                    {benchRunning ? <Loader2 size={14} className="spin" /> : <Zap size={14} />} {benchRunning ? 'Benchmark…' : t('Benchmark throughput', 'Benchmark débit')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Réglages + stockage */}
          <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px', flex: 1 }}
              onClick={() => setOptionsOpen(true)}
            >
              <Settings size={12} /> {t('Settings', 'Réglages')}
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px', flex: 1 }}
              onClick={() => setStorageOpen(true)}
            >
              <HardDrive size={12} /> {t('Storage', 'Stockage')}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="chat-area">
        {/* Header */}
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button
              className="circle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? t('Hide panel', 'Masquer le panneau') : t('Show panel', 'Afficher le panneau')}
              style={{ flexShrink: 0 }}
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          <div className="chat-header-info">
            {displayModelName ? (
              <>
                <span className="loaded-model-name" title={displayModelName}>
                  {isMobile
                    ? (displayModelName.match(/^[A-Za-z]+/)?.[0] || displayModelName.slice(0, 10))
                    : (displayModelName.length > 32 ? displayModelName.slice(0, 32) + '…' : displayModelName)}
                </span>
                <span className="loaded-model-status">
                  <span className={`pulse-dot ${modelState === 'generating' ? 'anim' : ''}`}></span>
                  {t('Active · WGSL', 'Actif · WGSL')}
                </span>
              </>
            ) : (
              <>
                <span className="loaded-model-name">{t('No model loaded', 'Aucun modèle chargé')}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Configure the sidebar', 'Configurez la barre latérale')}</span>
              </>
            )}
          </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {displayModelName && !isMobile && (
              <button
                className="btn btn-danger"
                onClick={unloadActiveModel}
                disabled={modelState === 'generating' || benchRunning}
                title={t('Unload model', 'Décharger le modèle')}
                style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center' }}
              >
                {t('Unload', 'Décharger')}
              </button>
            )}
            <Link
              href="/local-ai"
              title={t('Local AI for your website (no server cost)', 'IA locale pour votre site (sans coût serveur)')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, padding: '6px 8px' }}
            >
              <Globe size={16} />
              {!isMobile && <span>{t('For websites', 'Pour les sites')}</span>}
            </Link>
            <Link
              href="/convert"
              title={t('BRIK conversion', 'Conversion BRIK')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', padding: '6px 8px' }}
            >
              <Package size={16} />
              {!isMobile && <span>{t('Convert', 'Convertir')}</span>}
            </Link>
            <Link
              href="/changelog"
              title="Changelog"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', padding: '6px 8px' }}
            >
              <Info size={16} />
              {!isMobile && <span>Changelog</span>}
            </Link>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-container" ref={messagesScrollRef} onScroll={onMessagesScroll}>
          {modelState === 'idle' && messages.length === 0 && (
            <div className="welcome-screen">
              {/* La marque kern-B en tête d'accueil — page de spécimen, pas d'icône « IA » générique. */}
              <svg width="64" height="64" viewBox="0 0 100 100" aria-hidden className="welcome-mark">
                <defs><clipPath id="welcome-kern" clipPathUnits="userSpaceOnUse"><path clipRule="evenodd" d="M0 0H100V100H0Z M62 -10 L34 112 L46 112 L74 -10 Z" /></clipPath></defs>
                <text x="50" y="86" textAnchor="middle" fontFamily="var(--font-heading), Georgia, serif" fontSize="100" fontWeight="900" fill="currentColor" clipPath="url(#welcome-kern)">B</text>
              </svg>
              <h2 className="welcome-title">{t('Brimkern · Local WebGPU inference', 'Brimkern · Inférence WebGPU locale')}</h2>
              <div className="welcome-rule" />
              <p className="welcome-subtitle">
                {t('A standalone, optimized build powered by hand-written WGSL compute shaders. Your models and computations run entirely locally, with no third-party server.', "Version standalone optimisée exploitant des compute shaders WGSL écrits sur mesure. Vos modèles et calculs s'exécutent entièrement en local sans aucun serveur tiers.")}
              </p>
              
              <div className="welcome-steps">
                <div className="welcome-step">
                  <div className="welcome-step-num">{t('step 1', 'étape 1')}</div>
                  <div className="welcome-step-title">{t('Drop in your GGUF', 'Insérez votre GGUF')}</div>
                  <div className="welcome-step-desc">
                    {t('Drag and drop any small GGUF model (e.g. Qwen 0.5B, Gemma 2 2B).', "Glissez-déposez n'importe quel modèle GGUF de petite taille (ex: Qwen 0.5B, Gemma 2 2B).")}
                  </div>
                </div>

                <div className="welcome-step">
                  <div className="welcome-step-num">{t('step 2', 'étape 2')}</div>
                  <div className="welcome-step-title">{t('Compute on the GPU', 'Calculez sur le GPU')}</div>
                  <div className="welcome-step-desc">
                    {t('The JS parser extracts the tensors and our WGSL kernels run the forward pass live.', 'Le parser JS extrait les tenseurs et nos kernels WGSL effectuent le forward pass en direct.')}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', textAlign: 'center', width: '100%' }}>
                {isMobile ? (
                  <>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Two lightweight models ready to use:', "Deux modèles légers prêts à l'emploi :")}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '13px', padding: '8px 16px' }}
                        onClick={() => handleStreamBrik(MOBILE_BRIK_URL)}
                      >
                        <Sparkles size={14} /> {t('LFM2.5 230M (149 MB) — recommended', 'LFM2.5 230M (149 Mo) — recommandé')}
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '7px 14px' }}
                        onClick={() => handleStreamBrik(QWEN_MOBILE_BRIK_URL)}
                      >
                        <Sparkles size={13} /> {t('Qwen 2.5 0.5B (378 MB)', 'Qwen 2.5 0.5B (378 Mo)')}
                      </button>
                    </div>
                    {prefetchStatus(true)}
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('Or pick a Hugging Face model for a quick test:', 'Ou sélectionnez un modèle Hugging Face de test rapide :')}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                      {visibleModels.map((m, idx) => (
                        <button
                          key={idx}
                          className="btn"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                          onClick={() => {
                            setActiveTab('models');
                            handleLoadModelFromUrl(m.url);
                          }}
                        >
                          {m.name.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {(modelState === 'initializing' || modelState === 'loading') && (
            <div className="model-loading-overlay">
              <div className="spinner"></div>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>{loadingStep}</h3>
              {/* Journal des étapes : ce que le moteur fait vraiment (téléchargement, quantification,
                  validation…) — l'étape courante en tête, les précédentes cochées. */}
              {loadingLog.length > 1 && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7, color: 'var(--text-secondary)', textAlign: 'left', width: '100%', maxWidth: 420 }}>
                  {loadingLog.map((l, i) => (
                    <div key={i} style={{ opacity: i === loadingLog.length - 1 ? 1 : 0.55, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {i === loadingLog.length - 1 ? '▸' : '✓'} {l}
                    </div>
                  ))}
                </div>
              )}
              
              {loadingProgress && (
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${loadingProgress.percentage}%` }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    <span>{loadingProgress.percentage}%</span>
                    <span>{formatBytes(loadingProgress.loaded)} / {formatBytes(loadingProgress.total)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {modelState === 'error' && (
            <div className="card" style={{ maxWidth: '500px', margin: '40px auto', borderColor: 'var(--error)' }}>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--error)' }}>
                <AlertCircle size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>{t('Hardware or file error', 'Erreur matérielle ou de fichier')}</h3>
                  <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                    {errorMsg}
                  </p>
                  {/* Vraies portes de sortie : recharger (le chemin nominal après une perte GPU),
                      inspecter/vider le stockage (cache modèle corrompu ou saturé), et l'accueil
                      en dernier recours — « Retour à l'accueil » seul laissait l'utilisateur bloqué. */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                    {(loadedModelUrl || isMobile) && (
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={retryLastLoad}
                      >
                        <RefreshCw size={12} /> {t('Reload the model', 'Recharger le modèle')}
                      </button>
                    )}
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => setStorageOpen(true)}
                    >
                      <HardDrive size={12} /> {t('Storage / clear cache', 'Stockage / vider le cache')}
                    </button>
                    <button
                      className="btn"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => setModelState('idle')}
                    >
                      {t('Back to home', "Retour à l'accueil")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ChatMessages
            messages={messages}
            modelState={modelState}
            copiedIndex={copiedIndex}
            copyToClipboard={copyToClipboard}
            messagesEndRef={messagesEndRef}
            onRevealImage={revealImage}
            canReveal={!!imageGen}
            onRefineImage={imageGen ? handleRefineImage : undefined}
          />
        </div>

        {/* Suggestions card — adaptées à la modalité du modèle chargé (image / vision / texte). */}
        {modelState === 'ready' && messages.length <= 1 && (() => {
          const promptMode: PromptMode = imageGen ? 'image' : visionSession ? 'vision' : 'text';
          const suggestions = SUGGESTED_PROMPTS(t, promptMode);
          return (
          <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto 16px', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {/* Mobile : UNE seule suggestion — trois cartes longues masquaient le message de
                  bienvenue du modèle (specs) sur un petit écran. */}
              {(isMobile ? suggestions.slice(0, 1) : suggestions).map((item, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
                  // Vision : on REMPLIT le champ (l'utilisateur doit joindre une image avant d'envoyer) ;
                  // image/texte : envoi direct comme avant.
                  onClick={() => promptMode === 'vision' ? setUserInput(item.text) : handlePresetPromptClick(item.text)}
                >
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {item.title} <ArrowRight size={12} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    "{item.text.length > 70 ? item.text.slice(0, 70) + '…' : item.text}"
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}

        {/* Input bar */}
        <Composer
          attachments={attachments}
          setAttachments={setAttachments}
          modelArchType={modelArchType}
          modelState={modelState}
          reflectionLevel={reflectionLevel}
          setReflectionLevel={setReflectionLevel}
          benchRunning={benchRunning}
          activeSkills={activeSkills}
          setSkillsOpen={setSkillsOpen}
          textareaRef={textareaRef}
          handlePaste={handlePaste}
          isMobile={isMobile}
          userInput={userInput}
          setUserInput={setUserInput}
          handleSendMessage={handleSendMessage}
          handleStopGeneration={handleStopGeneration}
          contextOver={contextOver}
          contextTokens={contextTokens}
          imageMode={!!imageGen}
          imageSize={imageSize}
          setImageSize={setImageSize}
          webSearchOn={webSearchOn || urlReadOn}
          visionMode={!!visionSession}
          pendingImage={pendingImage}
          setPendingImage={setPendingImage}
        />
      </main>

      {optionsOpen && (
        <OptionsPanel
          onClose={() => setOptionsOpen(false)}
          gpuDuty={gpuDuty} setGpuDuty={setGpuDuty}
          webSearchOn={webSearchOn} setWebSearchOn={setWebSearchOn}
          localToolsOn={localToolsOn} setLocalToolsOn={setLocalToolsOn}
          urlReadOn={urlReadOn} setUrlReadOn={setUrlReadOn}
        />
      )}

      {storageOpen && (
        <StoragePanel
          onClose={() => setStorageOpen(false)}
          onHistoryCleared={() => { setConversations([]); handleNewChat(); }}
          onCacheChanged={handleCacheChanged}
        />
      )}

      {skillsOpen && (
        <SkillsPanel
          onClose={() => setSkillsOpen(false)}
          onChanged={() => { listCustomSkills().then(setCustomSkills).catch(() => {}); }}
          activeIds={activeSkillIds}
          onToggle={toggleSkill}
        />
      )}
    </div>
  );
}

export default App;
