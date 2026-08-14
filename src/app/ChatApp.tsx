"use client";

// L'APPLICATION de chat. Elle était `src/app/page.tsx`, donc servie à la racine : le produit et sa
// présentation partageaient une URL, et l'accueil du chat devait faire les deux métiers (vendre le
// moteur ET charger un modèle). Depuis le 2026-08-13 la racine est une landing et ce composant est
// monté par /chat et /fr/chat — un seul rendu, deux URLs, la langue venant du LocaleProvider.
// L'écran d'accueil ci-dessous reste : il est ce qu'on voit en arrivant dans l'app sans modèle.

import { useState, useEffect, useLayoutEffect, useRef, type ClipboardEvent as ReactClipboardEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  Zap, Trash2, CheckCircle, AlertCircle,
  Loader2, Menu, X, Sparkles,
  Info, ShieldCheck, Database, ArrowRight,
  Plus, MessageSquare, ChevronDown, Sun, Moon, HardDrive, Settings, RefreshCw, Image as ImageIcon, Film, BookOpen
} from 'lucide-react';
import { cachedModelUrls } from '@/lib/storage';
import { PRESET_MODELS, TOKENIZER_PRESETS, type ArchType } from '@/lib/presets';
import { stripTurnMarkers, formatPrompt, isStopToken, declaredStopIds, templateWritesBos, THINK_BUDGETS, type ReflectionLevel } from '@/lib/chatFormat';
import { MOBILE_BRIK_URL, QWEN_MOBILE_BRIK_URL, IMAGE_BRIK, pickAutoPrecision, PREC_LABEL } from '@/lib/modelCatalog';
import { sampleNextToken, sampleFromTopK } from '@/lib/webgpu/sampling';
import { detectCalcs, formatCalc, currentDateLine } from '@/lib/localTools';
import { listConversations, type Conversation } from '@/lib/chatStore';
import StoragePanel from './StoragePanel';
import OptionsPanel from './OptionsPanel';
import SkillsPanel from './SkillsPanel';
import { listCustomSkills, BUILTIN_SKILLS, type Skill } from '@/lib/skillStore';
import { useT, useLocale, useHref } from '@/lib/i18n';
import { metric, metricOnce } from '@/lib/metrics';
import { parseDeeplink, parseModelInput, resolveHfModel } from '@/lib/deeplink';
import HfModelInput from './HfModelInput';
import { markModelUsed, evictStaleModels } from '@/lib/modelUsage';
import ByLine from './ByLine';
import GithubMark from './GithubMark';
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


// Exemples cliquables du champ « n'importe quel modèle » de l'accueil : des dépôts VÉRIFIÉS en ligne
// (un exemple mort serait la pire première impression pour un visiteur venu de Hugging Face).
const HOME_HF_EXAMPLES = [
  { label: 'Qwen3 0.6B (GGUF)', value: 'Qwen/Qwen3-0.6B-GGUF' },
  { label: 'Gemma 3 270M (GGUF)', value: 'unsloth/gemma-3-270m-it-GGUF' },
  { label: 'LFM2.5 230M (.brik)', value: 'romainkh14/LFM2.5-230M_BRIK' },
];

// A fenced code block with its own "copy code" button (copies just this block, not the whole
// message). Local copied-state so each block's button is independent.

function App() {
  const t = useT();
  // Liens internes préfixés par la locale (voir useHref) : rester dans sa langue en naviguant.
  const href = useHref();
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
  // Raisonnement des modèles « thinking » : MASQUÉ par défaut (il occupait le haut de chaque réponse
  // alors que c'est la réponse qui compte). Le réglage le rend lisible pour qui veut le voir.
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
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
  // Initialisé depuis localStorage dès le PREMIER rendu : au remontage client (retour de
  // /changelog) il n'y a pas d'hydratation, c'est la seule façon de ne jamais peindre le mauvais
  // état (un useLayoutEffect arrive après le rendu initial → un frame ouvert + transition visible).
  // Au chargement complet, le mismatch SSR(true)/client est absorbé par le verrou CSS pré-paint
  // (html.sb-closed) + suppressHydrationWarning sur l'<aside>.
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try { return localStorage.getItem('brimkern-sidebar') !== '0'; } catch { return true; }
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  // Accueil « navigateur incompatible » : copie du lien de la page pour le rouvrir dans Chrome/Edge.
  // Les WebView in-app (Reddit, X…) n'exposent pas toujours navigator.clipboard → repli execCommand.
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const copyPageLink = async () => {
    const url = window.location.origin + window.location.pathname;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };
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
  // Sidebar : l'état persisté s'applique en useLayoutEffect — AVANT le premier paint post-montage —
  // sinon elle se peint ouverte puis se ferme sous les yeux de l'utilisateur (retour de /changelog,
  // hydratation). Le tout premier paint (HTML statique, pré-hydratation) est couvert par le script
  // pré-paint du layout (html.sb-closed + verrou CSS), retiré plus bas une fois React synchronisé.
  useLayoutEffect(() => {
    try {
      const sb = localStorage.getItem('brimkern-sidebar');
      if (sb !== null) setIsSidebarOpen(sb === '1');
    } catch { /* localStorage unavailable */ }
  }, []);

  useEffect(() => {
    if (uiRestored.current) return;
    uiRestored.current = true;
    // Le verrou CSS pré-paint n'est plus nécessaire : React affiche maintenant le bon état.
    document.documentElement.classList.remove('sb-closed');
    try {
      const sk = localStorage.getItem('brimkern-skills');
      if (sk) { const arr = JSON.parse(sk); if (Array.isArray(arr) && arr.length) setActiveSkillIds(arr); }
      const um = localStorage.getItem('brimkern-usermodels');
      if (um) { const arr = JSON.parse(um); if (Array.isArray(arr)) setUserModels(arr); }
      const gd = parseFloat(localStorage.getItem('brimkern-gpu-duty') || '');
      if (gd > 0 && gd <= 1) setGpuDuty(gd);
      if (localStorage.getItem('brimkern-websearch') === '1') setWebSearchOn(true);
      if (localStorage.getItem('brimkern-localtools') === '0') setLocalToolsOn(false);
      if (localStorage.getItem('brimkern-urlread') === '1') setUrlReadOn(true);
      if (localStorage.getItem('brimkern-showreasoning') === '1') setShowReasoning(true);
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
  useEffect(() => { try { localStorage.setItem('brimkern-showreasoning', showReasoning ? '1' : '0'); } catch { /* ignore */ } }, [showReasoning]);

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

  // Ids d'arrêt DÉCLARÉS par le modèle chargé (EOS / fin de tour du GGUF). Ils priment sur la table
  // par architecture, qui s'oublie à chaque nouvelle famille — SmolLM3 n'y figurait pas et
  // continuait sa réponse en inventant le tour suivant (« … Paris. user Can you tell me… »).
  const stopIds = declaredStopIds((modelMetadata as { metadata?: Record<string, unknown> } | null)?.metadata);

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
  const handleStreamBrik = (urlOverride?: string, source?: string) => { leaveImageMode(); leaveVisionMode(); return engineStreamBrik(urlOverride, source); };

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
    // __mmprojLoad(url) : CHRONOMÈTRE le chargement des poids du ViT (le vrai coût de la vision —
    // 512 plages en série + une vidange GPU par tenseur avant l'optimisation du 2026-08-12).
    // Retourne les secondes + la config lue, et libère tout. Sert de banc de non-régression.
    (window as any).__mmprojLoad = async (url: string) => {
      const [{ loadMmproj }, { WebGpuEngine }] = await Promise.all([
        import('@/lib/webgpu/vision/mmproj'), import('@/lib/webgpu/kernels'),
      ]);
      const e = new WebGpuEngine();
      if (!(await e.init())) return { error: 'WebGPU indisponible' };
      const t0 = performance.now();
      const { cfg, w } = await loadMmproj(e, url, (s) => console.log('[mmproj]', s));
      const seconds = +((performance.now() - t0) / 1000).toFixed(1);
      // Empreinte du patch-embedding (seul tenseur qui reste côté CPU) : elle traverse le même
      // découpage par spans que tout le reste → identique avec et sans ?mmprojspans=0 = preuve
      // que le découpage rend exactement les mêmes octets que le chemin par-tenseur.
      let sum = 0;
      for (let i = 0; i < w.patchW.length; i++) sum += w.patchW[i] * (i % 97 + 1);
      e.destroy();
      console.log(`[mmproj] poids chargés en ${seconds} s`);
      return { seconds, layers: cfg.layers, dim: cfg.dim, outDim: cfg.outDim, patchSum: +sum.toFixed(3) };
    };
    // __selfValidate() : la validation des kernels (celle que subit tout chargement de modèle) sans
    // télécharger un modèle — sert au banc Chrome des changements de kernels. Retourne l'étape en
    // échec ou 'OK', plus l'état des gates NON BLOQUANTS (repli silencieux quand un driver les rate).
    (window as any).__selfValidate = async () => {
      const { WebGpuEngine } = await import('@/lib/webgpu/kernels');
      const e = new WebGpuEngine();
      if (!(await e.init())) return { error: 'WebGPU indisponible' };
      const ok = await e.selfValidate();
      const gates = {
        hasF16: e.hasF16, f16SharedOk: e.f16SharedOk, attnDecodeOk: e.attnDecodeOk,
        attnFullWgOk: e.attnFullWgOk, swaOk: e.swaOk, convTiledOk: e.convTiledOk,
      };
      const stage = e.validationFailure;
      e.destroy();
      console.log(ok ? '[selfValidate] OK' : `[selfValidate] KO à l'étape ${stage}`, gates);
      return { ok, stage, gates };
    };
    // __decodeBench(profil) : PLAFOND de décodage de nos kernels sur les formes d'un vrai modèle,
    // sans télécharger ses poids. Le décodage lit TOUS les poids par token (matmul-vecteur, m=1) :
    // on mesure donc les 7 matmuls d'UNE couche + la tête logits, puis on extrapole × nLayers. C'est
    // exact à la structure près (l'attention à contexte court est négligeable devant les projections)
    // et ça évite d'allouer 4 Go de VRAM pour répondre à « quel débit peut-on espérer ? ».
    // Sert à se situer face à un moteur concurrent : ex. WebLLM sur DeepSeek-R1-Distill-Qwen-7B
    // q4f16_1 mesuré chez Romain à 18,7 t/s de prefill et 14,0 t/s de décodage (2026-08-13).
    (window as any).__decodeBench = async (which: 'qwen7b' | 'qwen05b' | 'llama1b' = 'qwen7b', dtype: 'q4' | 'q8' = 'q4') => {
      const { WebGpuEngine } = await import('@/lib/webgpu/kernels');
      const PROFILES: Record<string, { d: number; ffn: number; kv: number; layers: number; vocab: number; label: string }> = {
        // DeepSeek-R1-Distill-Qwen-7B = Qwen2 7B : 28 couches, GQA 28/4 têtes de 128.
        qwen7b: { d: 3584, ffn: 18944, kv: 512, layers: 28, vocab: 152064, label: 'Qwen2 7B (DeepSeek-R1-Distill)' },
        qwen05b: { d: 896, ffn: 4864, kv: 128, layers: 24, vocab: 151936, label: 'Qwen2.5 0.5B' },
        llama1b: { d: 2048, ffn: 8192, kv: 512, layers: 16, vocab: 128256, label: 'Llama 3.2 1B' },
      };
      const p = PROFILES[which];
      const e = new WebGpuEngine();
      if (!(await e.init())) return { error: 'WebGPU indisponible' };
      const fill = (n: number, seed: number) => {
        const x = new Float32Array(n);
        let s = seed;
        for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) >>> 0; x[i] = (s / 4294967296) - 0.5; }
        return x;
      };
      // Les 7 projections d'une couche + la tête logits, en (k → n).
      const shapes = [
        { label: 'attn_q', k: p.d, n: p.d }, { label: 'attn_k', k: p.d, n: p.kv },
        { label: 'attn_v', k: p.d, n: p.kv }, { label: 'attn_o', k: p.d, n: p.d },
        { label: 'ffn_gate', k: p.d, n: p.ffn }, { label: 'ffn_up', k: p.d, n: p.ffn },
        { label: 'ffn_down', k: p.ffn, n: p.d },
      ];
      const a = fill(Math.max(p.d, p.ffn), 7);
      let layerMs = 0, layerParams = 0;
      const detail: any[] = [];
      for (const sh of shapes) {
        const wf32 = e.uploadGpu(fill(sh.k * sh.n, 13));
        const w = dtype === 'q8' ? e.f32ToQ8Gpu(wf32, sh.k * sh.n) : e.f32ToQ4Gpu(wf32, sh.k * sh.n);
        wf32.destroy?.();
        let ms = Infinity;
        for (let i = 0; i < 3; i++) ms = Math.min(ms, await e.benchMatmul(a.subarray(0, sh.k), w, 1, sh.k, sh.n, { iters: 20 }));
        for (const b of Object.values(w)) (b as any).destroy?.();
        layerMs += ms; layerParams += sh.k * sh.n;
        detail.push({ shape: `${sh.label} ${sh.k}→${sh.n}`, ms: +ms.toFixed(3) });
      }
      // Tête logits (vocab × d) : ~8 % des poids d'un 7B, pas négligeable au décodage.
      let headMs = 0;
      {
        const rows = Math.min(p.vocab, 40000); // mesurée sur une tranche, puis mise à l'échelle
        const wf32 = e.uploadGpu(fill(rows * p.d, 21));
        const w = dtype === 'q8' ? e.f32ToQ8Gpu(wf32, rows * p.d) : e.f32ToQ4Gpu(wf32, rows * p.d);
        wf32.destroy?.();
        let ms = Infinity;
        for (let i = 0; i < 3; i++) ms = Math.min(ms, await e.benchMatmul(a.subarray(0, p.d), w, 1, p.d, rows, { iters: 20 }));
        for (const b of Object.values(w)) (b as any).destroy?.();
        headMs = ms * (p.vocab / rows);
      }
      e.destroy();
      const perTokenMs = layerMs * p.layers + headMs;
      const bytesPerParam = dtype === 'q4' ? 0.5 + 4 / 32 : 1 + 2 / 32; // codes + échelles f16 par groupe de 32
      const weightBytes = (layerParams * p.layers + p.vocab * p.d) * bytesPerParam;
      const out = {
        model: p.label, dtype,
        layerMs: +layerMs.toFixed(2), headMs: +headMs.toFixed(2),
        perTokenMs: +perTokenMs.toFixed(1),
        tokensPerSec: +(1000 / perTokenMs).toFixed(1),
        weightsGB: +(weightBytes / 1e9).toFixed(2),
        effectiveGBps: +((weightBytes / 1e9) / (perTokenMs / 1000)).toFixed(1),
        detail,
      };
      console.log(`[decode] ${p.label} ${dtype} : ${out.tokensPerSec} tok/s théoriques (${out.perTokenMs} ms/token, ${out.weightsGB} Go lus → ${out.effectiveGBps} Go/s effectifs)`);
      return out;
    };
    // __prefillBench(profil, dtype, seq) : PLAFOND de PREFILL de nos kernels sur les formes d'un vrai
    // modèle — le pendant exact de __decodeBench, qui manquait. Sans lui on ne pouvait comparer notre
    // prefill 7B à celui d'un concurrent (18,7 tok/s mesurés sur WebLLM) qu'en chargeant réellement
    // 4,7 Go de poids : un banc de 20 minutes pour une question de 30 secondes.
    // Même décomposition qu'au décodage (les 7 projections d'UNE couche × nLayers), mais à m = seq
    // tokens d'un coup — c'est TOUTE la différence entre les deux régimes : ici les poids sont lus
    // une fois pour `seq` lignes, donc on est limité par le CALCUL, pas par la bande passante.
    // La tête logits reste à m=1 (on ne décode que la dernière position).
    // ⚠️ Plafond des MATMULS : attention (O(seq²)), normalisations et RoPE ne sont pas comptées —
    // même convention que __decodeBench, dont le plafond 14,4 t/s se traduisait par 9,6 t/s réels.
    (window as any).__prefillBench = async (which: 'qwen7b' | 'qwen05b' | 'llama1b' = 'qwen7b', dtype: 'q4' | 'q8' = 'q4', seq = 512) => {
      const { WebGpuEngine } = await import('@/lib/webgpu/kernels');
      const PROFILES: Record<string, { d: number; ffn: number; kv: number; layers: number; vocab: number; label: string }> = {
        qwen7b: { d: 3584, ffn: 18944, kv: 512, layers: 28, vocab: 152064, label: 'Qwen2 7B (DeepSeek-R1-Distill)' },
        qwen05b: { d: 896, ffn: 4864, kv: 128, layers: 24, vocab: 151936, label: 'Qwen2.5 0.5B' },
        llama1b: { d: 2048, ffn: 8192, kv: 512, layers: 16, vocab: 128256, label: 'Llama 3.2 1B' },
      };
      const p = PROFILES[which];
      const e = new WebGpuEngine();
      if (!(await e.init())) return { error: 'WebGPU indisponible' };
      const fill = (n: number, seed: number) => {
        const x = new Float32Array(n);
        let s = seed;
        for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) >>> 0; x[i] = (s / 4294967296) - 0.5; }
        return x;
      };
      const shapes = [
        { label: 'attn_q', k: p.d, n: p.d }, { label: 'attn_k', k: p.d, n: p.kv },
        { label: 'attn_v', k: p.d, n: p.kv }, { label: 'attn_o', k: p.d, n: p.d },
        { label: 'ffn_gate', k: p.d, n: p.ffn }, { label: 'ffn_up', k: p.d, n: p.ffn },
        { label: 'ffn_down', k: p.ffn, n: p.d },
      ];
      // L'activation d'entrée : seq lignes de k. Allouée une fois au plus grand k rencontré.
      const aBig = fill(seq * Math.max(p.d, p.ffn), 7);
      let layerMs = 0, layerFlops = 0;
      const detail: { shape: string; ms: number; gflops: number }[] = [];
      for (const sh of shapes) {
        const wf32 = e.uploadGpu(fill(sh.k * sh.n, 13));
        const w = dtype === 'q8' ? e.f32ToQ8Gpu(wf32, sh.k * sh.n) : e.f32ToQ4Gpu(wf32, sh.k * sh.n);
        wf32.destroy?.();
        let ms = Infinity;
        // Moins d'itérations qu'au décodage : une GEMM 512×3584×18944 dure des dizaines de ms, et
        // 20 répétitions dans un seul submit déclencheraient le chien de garde du GPU.
        for (let i = 0; i < 3; i++) ms = Math.min(ms, await e.benchMatmul(aBig.subarray(0, seq * sh.k), w, seq, sh.k, sh.n, { iters: 4 }));
        for (const b of Object.values(w)) (b as any).destroy?.();
        const flops = 2 * seq * sh.k * sh.n;
        layerMs += ms; layerFlops += flops;
        detail.push({ shape: `${sh.label} ${sh.k}→${sh.n}`, ms: +ms.toFixed(2), gflops: +((flops / 1e9) / (ms / 1000)).toFixed(1) });
      }
      let headMs = 0;
      {
        const rows = Math.min(p.vocab, 40000);
        const wf32 = e.uploadGpu(fill(rows * p.d, 21));
        const w = dtype === 'q8' ? e.f32ToQ8Gpu(wf32, rows * p.d) : e.f32ToQ4Gpu(wf32, rows * p.d);
        wf32.destroy?.();
        let ms = Infinity;
        for (let i = 0; i < 3; i++) ms = Math.min(ms, await e.benchMatmul(aBig.subarray(0, p.d), w, 1, p.d, rows, { iters: 20 }));
        for (const b of Object.values(w)) (b as any).destroy?.();
        headMs = ms * (p.vocab / rows);
      }
      e.destroy();
      const totalMs = layerMs * p.layers + headMs;
      const totalFlops = layerFlops * p.layers;
      const out = {
        model: p.label, dtype, seq,
        layerMs: +layerMs.toFixed(2), headMs: +headMs.toFixed(2),
        totalMs: +totalMs.toFixed(0),
        tokensPerSec: +(seq / (totalMs / 1000)).toFixed(1),
        gflops: +((totalFlops / 1e9) / (totalMs / 1000)).toFixed(0),
        detail,
      };
      console.log(`[prefill] ${p.label} ${dtype} seq=${seq} : ${out.tokensPerSec} tok/s théoriques (${out.totalMs} ms pour ${seq} tokens, ${out.gflops} GFLOP/s)`);
      return out;
    };
    // __gemmBench(mTokens, dtype) : banc A/B des GEMM du PREFILL sur des formes réelles d'un 0.5B —
    // le kernel tuilé + bloqué en registres (32×64, défaut dès m ≥ 32) contre son repli (f16 :
    // une ligne par thread ; q8/q4 : 4 lignes par invocation). dtype = 'f16' (défaut desktop), 'q8'
    // ou 'q4' (chemin des presets BRIK). Retourne par forme les ms des deux chemins, le rapport, les
    // GFLOP/s et l'écart relatif MAX entre les deux sorties (bruit de sommation attendu, ~1e-5).
    (window as any).__gemmBench = async (mTokens = 512, dtype: 'f16' | 'q8' | 'q4' = 'f16') => {
      const { WebGpuEngine } = await import('@/lib/webgpu/kernels');
      const e = new WebGpuEngine();
      if (!(await e.init())) return { error: 'WebGPU indisponible' };
      if (dtype === 'f16' && !e.hasF16) return { error: 'shader-f16 absent sur ce GPU — chemin f16 inutilisé' };
      const shapes = [
        { label: 'attn qkv/o 1024→1024', k: 1024, n: 1024 },
        { label: 'ffn gate/up 1024→2816', k: 1024, n: 2816 },
        { label: 'ffn down 2816→1024', k: 2816, n: 1024 },
      ];
      const fill = (n: number, seed: number) => {
        const x = new Float32Array(n);
        let s = seed;
        for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) >>> 0; x[i] = (s / 4294967296) - 0.5; }
        return x;
      };
      const results: any[] = [];
      for (const sh of shapes) {
        const a = fill(mTokens * sh.k, 7), wt = fill(sh.n * sh.k, 13);
        // Le poids est quantifié SUR LE GPU (même chemin que la construction d'un modèle).
        const wf32 = e.uploadGpu(wt);
        const w = dtype === 'f16' ? e.uploadGpuF16(wt)
          : dtype === 'q8' ? e.f32ToQ8Gpu(wf32, sh.n * sh.k)
          : e.f32ToQ4Gpu(wf32, sh.n * sh.k);
        wf32.destroy?.();
        const wF16 = dtype === 'f16';
        // Temps du kernel SEUL (benchMatmul : A résident, 10 passes dans un encodeur, une attente),
        // en gardant le minimum sur 3 séries — un hoquet suffit à inverser un A/B de quelques ms.
        const time = async (shared: boolean) => {
          let ms = Infinity;
          for (let i = 0; i < 3; i++) ms = Math.min(ms, await e.benchMatmul(a, w, mTokens, sh.k, sh.n, { shared, wF16 }));
          return ms;
        };
        const tiled = await time(true), fallback = await time(false);
        // Équivalence des sorties sur ces formes réelles (selfValidate couvre les bords partiels).
        const out = async (shared: boolean) => {
          e.f16SharedOk = shared; e.qSharedOk = shared;
          const r = dtype === 'f16' ? await e.matmulT(a, w, mTokens, sh.k, sh.n, true)
            : dtype === 'q8' ? await e.matmulQ8Shared(a, w.codes, w.sc, mTokens, sh.k, sh.n)
            : await e.matmulQ4Shared(a, w.nib, w.sc, w.mn, mTokens, sh.k, sh.n);
          e.f16SharedOk = true; e.qSharedOk = true;
          return r;
        };
        // Pour q8/q4 les wrappers de readback ciblent explicitement le kernel tuilé : on compare donc
        // au kernel 4-lignes via matmulQ8Tiled / matmulQ4Tiled (le repli réel du prefill).
        const outTiled = await out(true);
        const outRef = dtype === 'f16' ? await out(false)
          : dtype === 'q8' ? await e.matmulQ8Tiled(a, w.codes, w.sc, mTokens, sh.k, sh.n)
          : await e.matmulQ4Tiled(a, w.nib, w.sc, w.mn, mTokens, sh.k, sh.n);
        for (const b of dtype === 'f16' ? [w] : Object.values(w)) (b as any).destroy?.();
        let maxRel = 0;
        for (let i = 0; i < outTiled.length; i++) {
          maxRel = Math.max(maxRel, Math.abs(outTiled[i] - outRef[i]) / (1 + Math.abs(outRef[i])));
        }
        const gflop = (2 * mTokens * sh.k * sh.n) / 1e9;
        results.push({
          shape: sh.label,
          tiledMs: +tiled.toFixed(2), fallbackMs: +fallback.toFixed(2),
          speedup: +(fallback / tiled).toFixed(2),
          tiledGflops: +(gflop / (tiled / 1000)).toFixed(1),
          fallbackGflops: +(gflop / (fallback / 1000)).toFixed(1),
          maxRel: +maxRel.toExponential(1),
        });
        console.log(`[gemm ${dtype}] ${sh.label} m=${mTokens} : tuilé ${tiled.toFixed(2)} ms vs repli ${fallback.toFixed(2)} ms (×${(fallback / tiled).toFixed(2)}), écart max ${maxRel.toExponential(1)}`);
      }
      e.destroy();
      return { mTokens, dtype, results };
    };
  }, []);

  // Le hook de banc de tokenisation doit voir le modèle COURANT : dans l'effet de montage il
  // capturerait le tokenizer de la première render (null). Effet dédié, re-posé à chaque
  // changement de modèle/tokenizer.
  useEffect(() => {
    // __tokTest(texte?) : ce que le modèle chargé VOIT réellement. Sort le prompt formaté (template
    // de l'arch), les ids produits par le tokenizer actif, leur re-décodage, et la taille de vocab
    // annoncée par le manifeste. C'est le premier test à faire devant une sortie incohérente : un
    // décalage d'ids (mauvais tokenizer pour l'arch) donne exactement le même symptôme que des poids
    // corrompus, et rien dans l'UI ne les distingue.
    (window as any).__tokTest = async (texte = 'Bonjour, comment vas-tu ?') => {
      const tok = activeTokenizer;
      if (!tok) return { error: 'aucun modèle chargé' };
      const prompt = formatPrompt([{ role: 'user', content: texte }] as any, modelArchType, '');
      const enc = await tok(prompt);
      const ids: number[] = Array.from(enc?.input_ids?.data ?? enc?.input_ids ?? []).map(Number);
      const encNoSpecial = await tok(texte, { add_special_tokens: false });
      const idsPlain: number[] = Array.from(encNoSpecial?.input_ids?.data ?? encNoSpecial?.input_ids ?? []).map(Number);
      const emb = (activeModel as any)?.manifest?.tensors?.['token_embd.weight'];
      const d = (activeModel as any)?.manifest?.config?.d;
      return {
        arch: (activeModel as any)?.manifest?.arch, archType: modelArchType, tokenizerId: selectedTokenizerId,
        vocabFromWeights: emb && d ? emb.nElems / d : null,
        prompt: prompt.slice(0, 400),
        promptIds: ids.slice(0, 40), nPromptIds: ids.length, maxId: ids.length ? Math.max(...ids) : null,
        plainIds: idsPlain.slice(0, 20),
      };
    };
    // __gemmBench(mTokens, dtype) : banc A/B des GEMM du PREFILL sur des formes réelles d'un 0.5B —
    // le kernel tuilé + bloqué en registres (32×64, défaut dès m ≥ 32) contre son repli (f16 :
    // une ligne par thread ; q8/q4 : 4 lignes par invocation). dtype = 'f16' (défaut desktop), 'q8'
    // ou 'q4' (chemin des presets BRIK). Retourne par forme les ms des deux chemins, le rapport, les
    // GFLOP/s et l'écart relatif MAX entre les deux sorties (bruit de sommation attendu, ~1e-5).
    (window as any).__gemmBench = async (mTokens = 512, dtype: 'f16' | 'q8' | 'q4' = 'f16') => {
      const { WebGpuEngine } = await import('@/lib/webgpu/kernels');
      const e = new WebGpuEngine();
      if (!(await e.init())) return { error: 'WebGPU indisponible' };
      if (dtype === 'f16' && !e.hasF16) return { error: 'shader-f16 absent sur ce GPU — chemin f16 inutilisé' };
      const shapes = [
        { label: 'attn qkv/o 1024→1024', k: 1024, n: 1024 },
        { label: 'ffn gate/up 1024→2816', k: 1024, n: 2816 },
        { label: 'ffn down 2816→1024', k: 2816, n: 1024 },
      ];
      const fill = (n: number, seed: number) => {
        const x = new Float32Array(n);
        let s = seed;
        for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) >>> 0; x[i] = (s / 4294967296) - 0.5; }
        return x;
      };
      const results: any[] = [];
      for (const sh of shapes) {
        const a = fill(mTokens * sh.k, 7), wt = fill(sh.n * sh.k, 13);
        // Le poids est quantifié SUR LE GPU (même chemin que la construction d'un modèle).
        const wf32 = e.uploadGpu(wt);
        const w = dtype === 'f16' ? e.uploadGpuF16(wt)
          : dtype === 'q8' ? e.f32ToQ8Gpu(wf32, sh.n * sh.k)
          : e.f32ToQ4Gpu(wf32, sh.n * sh.k);
        wf32.destroy?.();
        const wF16 = dtype === 'f16';
        // Temps du kernel SEUL (benchMatmul : A résident, 10 passes dans un encodeur, une attente),
        // en gardant le minimum sur 3 séries — un hoquet suffit à inverser un A/B de quelques ms.
        const time = async (shared: boolean) => {
          let ms = Infinity;
          for (let i = 0; i < 3; i++) ms = Math.min(ms, await e.benchMatmul(a, w, mTokens, sh.k, sh.n, { shared, wF16 }));
          return ms;
        };
        const tiled = await time(true), fallback = await time(false);
        // Équivalence des sorties sur ces formes réelles (selfValidate couvre les bords partiels).
        const out = async (shared: boolean) => {
          e.f16SharedOk = shared; e.qSharedOk = shared;
          const r = dtype === 'f16' ? await e.matmulT(a, w, mTokens, sh.k, sh.n, true)
            : dtype === 'q8' ? await e.matmulQ8Shared(a, w.codes, w.sc, mTokens, sh.k, sh.n)
            : await e.matmulQ4Shared(a, w.nib, w.sc, w.mn, mTokens, sh.k, sh.n);
          e.f16SharedOk = true; e.qSharedOk = true;
          return r;
        };
        // Pour q8/q4 les wrappers de readback ciblent explicitement le kernel tuilé : on compare donc
        // au kernel 4-lignes via matmulQ8Tiled / matmulQ4Tiled (le repli réel du prefill).
        const outTiled = await out(true);
        const outRef = dtype === 'f16' ? await out(false)
          : dtype === 'q8' ? await e.matmulQ8Tiled(a, w.codes, w.sc, mTokens, sh.k, sh.n)
          : await e.matmulQ4Tiled(a, w.nib, w.sc, w.mn, mTokens, sh.k, sh.n);
        for (const b of dtype === 'f16' ? [w] : Object.values(w)) (b as any).destroy?.();
        let maxRel = 0;
        for (let i = 0; i < outTiled.length; i++) {
          maxRel = Math.max(maxRel, Math.abs(outTiled[i] - outRef[i]) / (1 + Math.abs(outRef[i])));
        }
        const gflop = (2 * mTokens * sh.k * sh.n) / 1e9;
        results.push({
          shape: sh.label,
          tiledMs: +tiled.toFixed(2), fallbackMs: +fallback.toFixed(2),
          speedup: +(fallback / tiled).toFixed(2),
          tiledGflops: +(gflop / (tiled / 1000)).toFixed(1),
          fallbackGflops: +(gflop / (fallback / 1000)).toFixed(1),
          maxRel: +maxRel.toExponential(1),
        });
        console.log(`[gemm ${dtype}] ${sh.label} m=${mTokens} : tuilé ${tiled.toFixed(2)} ms vs repli ${fallback.toFixed(2)} ms (×${(fallback / tiled).toFixed(2)}), écart max ${maxRel.toExponential(1)}`);
      }
      e.destroy();
      return { mTokens, dtype, results };
    };
  }, []);

  // Le hook de banc de tokenisation doit voir le modèle COURANT : dans l'effet de montage il
  // capturerait le tokenizer de la première render (null). Effet dédié, re-posé à chaque
  // changement de modèle/tokenizer.
  useEffect(() => {
    // __tokTest(texte?) : ce que le modèle chargé VOIT réellement. Sort le prompt formaté (template
    // de l'arch), les ids produits par le tokenizer actif, leur re-décodage, et la taille de vocab
    // annoncée par le manifeste. C'est le premier test à faire devant une sortie incohérente : un
    // décalage d'ids (mauvais tokenizer pour l'arch) donne exactement le même symptôme que des poids
    // corrompus, et rien dans l'UI ne les distingue.
    (window as any).__tokTest = async (texte = 'Bonjour, comment vas-tu ?') => {
      const tok = activeTokenizer;
      if (!tok) return { error: 'aucun modèle chargé' };
      const prompt = formatPrompt([{ role: 'user', content: texte }] as any, modelArchType, '');
      const enc = await tok(prompt);
      const ids: number[] = Array.from(enc?.input_ids?.data ?? enc?.input_ids ?? []).map(Number);
      const encNoSpecial = await tok(texte, { add_special_tokens: false });
      const idsPlain: number[] = Array.from(encNoSpecial?.input_ids?.data ?? encNoSpecial?.input_ids ?? []).map(Number);
      const emb = (activeModel as any)?.manifest?.tensors?.['token_embd.weight'];
      const d = (activeModel as any)?.manifest?.config?.d;
      return {
        arch: (activeModel as any)?.manifest?.arch, archType: modelArchType, tokenizerId: selectedTokenizerId,
        vocabFromWeights: emb && d ? emb.nElems / d : null,
        prompt: prompt.slice(0, 400),
        promptIds: ids.slice(0, 40), nPromptIds: ids.length, maxId: ids.length ? Math.max(...ids) : null,
        plainIds: idsPlain.slice(0, 20),
      };
    };
    // __tokIds(textes) : les ids produits par le tokenizer ACTIF, quel que soit le chemin qui l'a
    // fourni (lu dans le GGUF, embarqué dans le BRIK, ou téléchargé depuis Hugging Face). Sert à
    // prouver l'ÉQUIVALENCE : le même modèle chargé avec et sans `?ggtok=0` doit produire exactement
    // les mêmes ids, y compris sur les marqueurs de gabarit — un tokenizer qui fragmente
    // « <|im_end|> » ne se voit pas au chargement, il se voit à la première réponse incohérente.
    (window as any).__tokIds = async (texts: string[]) => {
      const tok: any = activeTokenizer;
      if (!tok) return { error: 'aucun tokenizer actif' };
      const out: Record<string, number[]> = {};
      for (const txt of texts) {
        const enc = await tok(txt, { add_special_tokens: false });
        out[txt] = Array.from(enc.input_ids.data as ArrayLike<number | bigint>, (v) => Number(v));
      }
      // Aller-retour : ce que le chat affiche vient de decode(), pas de encode().
      const roundTrip = await tok.decode(out[texts[0]] ?? [], { skip_special_tokens: true });
      return { ids: out, roundTrip };
    };
    // __decodeSplit(n) : LE partage qui manquait pour comprendre le décodage. On mesure trois
    // choses sur le MÊME modèle chargé, dans l'ordre où le coût s'empile :
    //   1. le forward complet du moteur (topKKV : embed → couches → norme → tête → top-k, une seule
    //      soumission GPU, un seul readback) — tout ce qui est GPU, sans une ligne de chat ;
    //   2. le même, plus la détokenisation de chaque token (ce que le chat fait pour afficher) ;
    //   3. le débit AFFICHÉ par le chat, relevé sur la dernière réponse.
    // Le plafond des matmuls seuls est donné par __decodeBench (17,5 t/s sur un 7B q4). Entre ce
    // plafond et le débit affiché, il manquait ~45 % sans adresse : ce hook dit si le coût est dans
    // le GPU (attention, normes, soumission) ou dans la boucle de chat (détokenisation, pénalité de
    // répétition, rendu React).
    (window as any).__decodeSplit = async (n = 32) => {
      const model: any = activeModel;
      const tok: any = activeTokenizer;
      if (!model?.topKKV) return { error: 'aucun modèle à cache KV chargé' };
      const sess = `split-${Date.now()}`;
      // Amorce : un vrai préfixe, pour que l'attention ait un cache à parcourir.
      const amorce = [1, 100, 200, 300, 400, 500, 600, 700];
      await model.topKKV(amorce, 0, sess, [], 1);
      const past = amorce.length;
      // (1) forward pur
      const t1 = performance.now();
      let last = 42;
      for (let i = 0; i < n; i++) { const r = await model.topKKV([last], past + i, sess, [], 1); last = Number(r.ids[0]); }
      const msForward = (performance.now() - t1) / n;
      // (2) forward + détokenisation, comme le chat
      const sess2 = `split2-${Date.now()}`;
      await model.topKKV(amorce, 0, sess2, [], 1);
      const t2 = performance.now();
      let last2 = 42;
      for (let i = 0; i < n; i++) {
        const r = await model.topKKV([last2], past + i, sess2, [], 1);
        last2 = Number(r.ids[0]);
        await tok.decode([last2], { skip_special_tokens: true });
      }
      const msPlusDetok = (performance.now() - t2) / n;
      const affiche = (() => {
        const el = [...document.querySelectorAll('.message-stats')].pop();
        const m = el?.textContent?.match(/Generation:\s*([\d.]+)/);
        return m ? +m[1] : null;
      })();
      const out = {
        modèle: loadedModelName,
        forwardSeulMs: +msForward.toFixed(2), forwardSeulTokS: +(1000 / msForward).toFixed(1),
        avecDetokMs: +msPlusDetok.toFixed(2), avecDetokTokS: +(1000 / msPlusDetok).toFixed(1),
        coutDetokMs: +(msPlusDetok - msForward).toFixed(2),
        chatAfficheTokS: affiche,
      };
      console.log(`[split] forward seul ${out.forwardSeulTokS} t/s · +détok ${out.avecDetokTokS} t/s (détok ${out.coutDetokMs} ms/token) · chat affiché ${out.chatAfficheTokS ?? '?'} t/s`);
      return out;
    };
    // __refForward(nTokens?) : RÉFÉRENCE CPU du forward, écrite d'après l'architecture (et NON d'après
    // notre pipeline), comparée aux logits GPU. Deux régimes :
    //   • 1 token  : l'attention est triviale (une clé ⇒ poids 1) et le RoPE est l'identité (position
    //     0). Valide l'embedding, les RMSNorm, V, la projection de sortie, le SwiGLU, les résiduels,
    //     la norme finale et la tête. Résultat du 2026-08-13 : corrélation 1,0000 sur Llama comme sur
    //     Qwen — ce chemin-là est sain.
    //   • N tokens : exerce EN PLUS Q, K, le RoPE positionnel, le masque causal et la réplication GQA.
    //     C'est là que doit se trouver le charabia de la famille llama (cf. docs/ROADMAP.md §6).
    // Point CRUCIAL : la référence lit les poids BRUTS (`debugTensorF32(name, true)`) et applique la
    // convention de ggml — paires de dimensions ADJACENTES pour llama/mistral/smollm3, rotate_half
    // ailleurs. Utiliser les poids dé-permutés validerait une dé-permutation fautive.
    // `mode` : 'ggml' (défaut) = poids BRUTS + convention de l'arch, la vérité de référence ;
    // 'gpu' = poids dé-permutés + rotate_half, c'est-à-dire ce que notre chemin par défaut fait.
    // Comparer les deux dit si le pipeline est COHÉRENT avec lui-même et laquelle des deux
    // conventions il applique réellement.
    // `layers` : compare EN PLUS l'état caché après CHAQUE couche à celui du GPU (chemin classique,
    // model.debugHiddenPerLayer) et renvoie la PREMIÈRE couche qui décroche. Comparer les logits
    // seuls donnait un verdict sans adresse : un écart né à la couche 3 et un écart né à la
    // couche 15 produisent la même corrélation finale.
    (window as any).__refForward = async (nTokens = 1, mode: 'ggml' | 'gpu' = 'ggml', layers = false) => {
      const model: any = activeModel;
      if (!model?.debugTensorF32) return { error: 'aucun modèle CustomWebModel chargé' };
      const man = model.manifest;
      const { d, nHeads, nKvHeads, headDim, blockCount, rmsEps, ropeTheta } = man.config;
      const bos = man.metadata?.['tokenizer.ggml.bos_token_id'];
      // Une suite de tokens ordinaires (pas de spéciaux) : on veut exercer les positions, pas le template.
      const toks = [Number.isFinite(bos) ? Number(bos) : 1, 100, 200, 300, 400].slice(0, Math.max(1, nTokens));
      const T = async (n: string) => await model.debugTensorF32(n, mode === 'ggml');
      const interleaved = mode === 'ggml' ? !!man.config.ropeInterleaved : false;

      const emb = await T('token_embd.weight');
      const vocab = emb.length / d;
      const embScale = man.config.embedScale ?? 1;
      // x = [seq][d]
      const x = toks.map((tk) => {
        const row = Float32Array.from(emb.subarray(tk * d, (tk + 1) * d));
        if (embScale !== 1) for (let i = 0; i < d; i++) row[i] *= embScale;
        return row;
      });

      const onePlus = man.config.rmsGainOnePlus === true;
      const rms = (v: Float32Array, w: Float32Array) => {
        let ss = 0;
        for (let i = 0; i < v.length; i++) ss += v[i] * v[i];
        const inv = 1 / Math.sqrt(ss / v.length + rmsEps);
        const o = new Float32Array(v.length);
        for (let i = 0; i < v.length; i++) o[i] = v[i] * inv * (onePlus ? 1 + w[i] : w[i]);
        return o;
      };
      const mv = (W: Float32Array, v: Float32Array, out: number, inn: number, bias?: Float32Array) => {
        const o = new Float32Array(out);
        for (let r = 0; r < out; r++) {
          let acc = 0; const base = r * inn;
          for (let i = 0; i < inn; i++) acc += W[base + i] * v[i];
          o[r] = acc + (bias ? bias[r] : 0);
        }
        return o;
      };
      // Facteurs de fréquence (Llama 3.1/3.2 : tenseur rope_freqs.weight, [headDim/2] diviseurs). Les
      // OUBLIER était le défaut de la première version de cette référence : ils n'ont AUCUN effet à la
      // position 0 (le RoPE y est l'identité), d'où une corrélation de 1,0000 à un token et 0,8337 à
      // trois — le profil exact qu'on observait, et qui accusait à tort la dé-permutation Q/K.
      const ff = man.tensors['rope_freqs.weight'] ? await T('rope_freqs.weight') : null;

      // RoPE de ggml : la fréquence i tourne (2i, 2i+1) en convention NORM, (i, i+half) en NEOX.
      const rope = (vec: Float32Array, pos: number, base: number) => {
        const half = headDim / 2;
        for (let h = 0; h < vec.length / headDim; h++) {
          const off = h * headDim;
          for (let i = 0; i < half; i++) {
            const freq = pos / (Math.pow(base, (2 * i) / headDim) * (ff ? ff[i] : 1));
            const c = Math.cos(freq), sn = Math.sin(freq);
            const i0 = interleaved ? off + 2 * i : off + i;
            const i1 = interleaved ? off + 2 * i + 1 : off + i + half;
            const a = vec[i0], b = vec[i1];
            vec[i0] = a * c - b * sn;
            vec[i1] = b * c + a * sn;
          }
        }
        return vec;
      };
      const act = man.config.act === 'gelu'
        ? (u: number) => 0.5 * u * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (u + 0.044715 * u * u * u)))
        : (u: number) => u / (1 + Math.exp(-u));
      const attnScale = man.config.attnScale ?? 1 / Math.sqrt(headDim);
      const seq = toks.length;
      // État caché de RÉFÉRENCE après chaque couche (copie : `x` est muté en place).
      const refPerLayer: Float32Array[] = [];

      for (let L = 0; L < blockCount; L++) {
        const p = `blk.${L}`;
        const theta = man.config.ropeThetaPerLayer?.[L] ?? ropeTheta;
        const skipRope = man.config.skipRopePerLayer?.[L] ?? false;
        const win = man.config.windowPerLayer?.[L] ?? 0;
        const wq = await T(`${p}.attn_q.weight`), wk = await T(`${p}.attn_k.weight`), wv = await T(`${p}.attn_v.weight`);
        const bq = man.tensors[`${p}.attn_q.bias`] ? await T(`${p}.attn_q.bias`) : undefined;
        const bk = man.tensors[`${p}.attn_k.bias`] ? await T(`${p}.attn_k.bias`) : undefined;
        const bv = man.tensors[`${p}.attn_v.bias`] ? await T(`${p}.attn_v.bias`) : undefined;
        const wo = await T(`${p}.attn_output.weight`);
        const an = await T(`${p}.attn_norm.weight`);
        // QK-Norm (Qwen3, Gemma 3) : une RMSNorm PAR TÊTE sur q et k, avant le RoPE. Elle manquait à
        // cette référence, qui accusait donc Qwen3 0.6B de diverger dès la couche 0 à partir de
        // 2 tokens (à 1 token l'écart est invisible : avec une seule clé, le poids d'attention vaut 1
        // quel que soit q). Une référence incomplète accuse le moteur à sa place.
        const qn = man.tensors[`${p}.attn_q_norm.weight`] ? await T(`${p}.attn_q_norm.weight`) : null;
        const kn = man.tensors[`${p}.attn_k_norm.weight`] ? await T(`${p}.attn_k_norm.weight`) : null;
        const rmsHeads = (vec: Float32Array, w: Float32Array) => {
          const out = new Float32Array(vec.length);
          for (let hh = 0; hh < vec.length / headDim; hh++) {
            out.set(rms(vec.subarray(hh * headDim, (hh + 1) * headDim) as Float32Array, w), hh * headDim);
          }
          return out;
        };
        const qs: Float32Array[] = [], ks: Float32Array[] = [], vs: Float32Array[] = [];
        for (let tPos = 0; tPos < seq; tPos++) {
          const h = rms(x[tPos], an);
          let q = mv(wq, h, nHeads * headDim, d, bq);
          let k = mv(wk, h, nKvHeads * headDim, d, bk);
          const v = mv(wv, h, nKvHeads * headDim, d, bv);
          if (qn) q = rmsHeads(q, qn);
          if (kn) k = rmsHeads(k, kn);
          qs.push(skipRope ? q : rope(q, tPos, theta));
          ks.push(skipRope ? k : rope(k, tPos, theta));
          vs.push(v);
        }
        const group = nHeads / nKvHeads;
        for (let tPos = 0; tPos < seq; tPos++) {
          const attn = new Float32Array(nHeads * headDim);
          for (let hh = 0; hh < nHeads; hh++) {
            const kvh = Math.floor(hh / group);
            // Masque causal (+ fenêtre glissante quand l'arch en déclare une).
            const from = win > 0 ? Math.max(0, tPos - win + 1) : 0;
            const scores: number[] = [];
            for (let j = from; j <= tPos; j++) {
              let dot = 0;
              for (let e = 0; e < headDim; e++) dot += qs[tPos][hh * headDim + e] * ks[j][kvh * headDim + e];
              scores.push(dot * attnScale);
            }
            const mx = Math.max(...scores);
            let sum = 0;
            const w = scores.map((sc) => { const e = Math.exp(sc - mx); sum += e; return e; });
            for (let e = 0; e < headDim; e++) {
              let acc = 0;
              for (let j = from; j <= tPos; j++) acc += (w[j - from] / sum) * vs[j][kvh * headDim + e];
              attn[hh * headDim + e] = acc;
            }
          }
          const attnOut = mv(wo, attn, d, nHeads * headDim);
          for (let i = 0; i < d; i++) x[tPos][i] += attnOut[i];
        }
        const fn = await T(`${p}.ffn_norm.weight`);
        const gate = await T(`${p}.ffn_gate.weight`), up = await T(`${p}.ffn_up.weight`), down = await T(`${p}.ffn_down.weight`);
        const ffn = gate.length / d;
        for (let tPos = 0; tPos < seq; tPos++) {
          const h2 = rms(x[tPos], fn);
          const g = mv(gate, h2, ffn, d), u = mv(up, h2, ffn, d);
          const a1 = new Float32Array(ffn);
          for (let i = 0; i < ffn; i++) a1[i] = act(g[i]) * u[i];
          const dn = mv(down, a1, d, ffn);
          for (let i = 0; i < d; i++) x[tPos][i] += dn[i];
        }
        // Aplati [seq][d] → [seq*d], comme le rend le GPU.
        if (layers) {
          const flat = new Float32Array(seq * d);
          for (let tPos = 0; tPos < seq; tPos++) flat.set(x[tPos], tPos * d);
          refPerLayer.push(flat);
        }
      }
      const normed = rms(x[seq - 1], await T('output_norm.weight'));
      const headW = man.tensors['output.weight'] ? await T('output.weight') : emb;
      const logitsRef = mv(headW, normed, vocab, d);

      const logitsGpu: Float32Array = await model.logitsKV(toks, 0, `ref-${Date.now()}`);
      const topOf = (arr: ArrayLike<number>, k = 5) =>
        Array.from({ length: arr.length }, (_, i) => i).sort((a, b) => arr[b] - arr[a]).slice(0, k)
          .map((i) => ({ id: i, v: +Number(arr[i]).toFixed(2) }));
      // Corrélation de Pearson entre deux vecteurs de même longueur.
      const correlate = (a: ArrayLike<number>, b: ArrayLike<number>) => {
        const n = Math.min(a.length, b.length);
        let ma = 0, mb = 0;
        for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
        ma /= n; mb /= n;
        let num = 0, da = 0, db = 0;
        for (let i = 0; i < n; i++) { const u = a[i] - ma, v = b[i] - mb; num += u * v; da += u * u; db += v * v; }
        return num / Math.sqrt(da * db);
      };
      const corr = correlate(logitsRef, logitsGpu);

      // ── Dichotomie sur les COUCHES ────────────────────────────────────────────────────────────
      // Le GPU repasse ici par le chemin CLASSIQUE (layerForward, poids déquantifiés, sans cache
      // KV) : si celui-ci suit la référence alors que les logits du chat divergent, la cause est
      // dans le chemin résident fusionné, pas dans la composition du forward.
      let perLayer: { layer: number; corr: number; maxAbsDiff: number }[] | undefined;
      let firstBadLayer: number | null | undefined;
      let hiddenResidentCorr: number | undefined;
      let incrementalCorr: number | undefined;
      if (layers) {
        const gpuPerLayer: Float32Array[] = await model.debugHiddenPerLayer(toks);
        perLayer = refPerLayer.map((r, L) => {
          const g = gpuPerLayer[L];
          let mx = 0;
          const n = Math.min(r.length, g.length);
          for (let i = 0; i < n; i++) mx = Math.max(mx, Math.abs(r[i] - g[i]));
          return { layer: L, corr: +correlate(r, g).toFixed(4), maxAbsDiff: +mx.toFixed(4) };
        });
        // Seuil 0,999 : la déquantification et l'ordre de sommation du GPU laissent un bruit de
        // ~1e-3 en relatif — au-delà, ce n'est plus de l'arithmétique, c'est une divergence.
        firstBadLayer = perLayer.find((p) => p.corr < 0.999)?.layer ?? null;
        console.log(`[ref] couches : première divergence = ${firstBadLayer === null ? 'aucune' : `couche ${firstBadLayer}`}`,
          perLayer.map((p) => `${p.layer}:${p.corr}`).join(' '));
        // Et l'état caché du chemin RÉSIDENT (celui du chat : cache KV + poids quantifiés résidents,
        // après la norme finale), comparé au même vecteur de la référence. C'est le partage qui
        // manquait : « couches saines + logits faux » ne dit pas si le mal est dans la pile de
        // couches résidente ou dans la tête de projection.
        try {
          const hGpu: Float32Array = await model.hiddenKV(toks, 0, `refh-${Date.now()}`);
          hiddenResidentCorr = +correlate(normed, hGpu).toFixed(4);
          console.log(`[ref] état caché résident (après norme finale) : corrélation ${hiddenResidentCorr}`);
        } catch (e) { console.warn('[ref] hiddenKV indisponible', e); }
        // Le MÊME chemin résident, mais token par token (pastLen qui grandit) au lieu d'un lot de N.
        // C'est le partage décisif restant : le lot et l'incrémental empruntent deux branches
        // différentes de l'attention résidente (prefill multi-tokens vs décodage), et le chat
        // n'utilise la première qu'au prefill — exactement là où le charabia apparaît.
        try {
          const sess = `refi-${Date.now()}`;
          let inc: Float32Array | null = null;
          for (let i = 0; i < toks.length; i++) inc = await model.logitsKV([toks[i]], i, sess);
          incrementalCorr = +correlate(logitsRef, inc!).toFixed(4);
          console.log(`[ref] même chemin, token par token : corrélation ${incrementalCorr}`);
        } catch (e) { console.warn('[ref] décodage incrémental indisponible', e); }
      }
      const out = {
        arch: man.arch, mode, tokens: toks, ropeConvention: interleaved ? 'adjacentes (ggml NORM)' : 'rotate_half (NEOX)',
        // Diagnostic de la RÉFÉRENCE elle-même : sans ça, on ne sait pas si un chiffre stable vient du
        // moteur ou d'une référence qui ignore silencieusement un morceau (facteurs RoPE absents,
        // fenêtre, biais…). Trois mesures identiques au millième après trois corrections = suspect.
        // `ffRange` : l'étendue RÉELLE des facteurs de fréquence. Sans elle, on ne sait pas si un
        // tenseur rope_freqs présent CHANGE quelque chose — des facteurs tous à 1 rendent le chemin
        // « à facteurs » et le chemin standard équivalents, et invalident toute conclusion tirée de
        // leur comparaison.
        refUses: {
          ropeFactors: !!ff, interleaved, kvNote: 'GPU KV selon ?kvq', seq: toks.length,
          ffRange: ff ? [+Math.min(...ff).toFixed(4), +Math.max(...ff).toFixed(4)] : null,
          qkNorm: !!man.tensors[`blk.0.attn_q_norm.weight`],
        },
        precision: model.precision, correlation: +corr.toFixed(4),
        topRef: topOf(logitsRef), topGpu: topOf(logitsGpu),
        verdict: corr > 0.99 ? 'CONFORME' : 'DIVERGENCE',
        firstBadLayer, perLayer, hiddenResidentCorr, incrementalCorr,
      };
      console.log(`[ref] ${man.arch} ${toks.length} token(s), mode ${mode}, rope ${out.ropeConvention} : corrélation ${out.correlation} — ${out.verdict}`);
      return out;
    };
  }, [activeTokenizer, activeModel, modelArchType, selectedTokenizerId]);

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

  // Préchargement (mobile ET desktop) : le vrai coût de première utilisation est le téléchargement
  // du BRIK du CTA d'accueil (LFM2.5, 149 Mo) — si le cache est incomplet, on le remplit en
  // arrière-plan dès l'arrivée, pendant que l'utilisateur lit l'écran d'accueil (prefetchBrik
  // reprend là où un passage précédent s'est arrêté). Le desktop a plus de bande passante et de
  // quota que le mobile : l'exclure faisait payer l'attente complète au clic sur « Essayer
  // maintenant ». Seul l'auto-CHARGEMENT reste mobile (sur desktop l'utilisateur choisit).
  // Garde-fous : WebGPU confirmé seulement, jamais si l'économiseur de données est
  // actif, VISIBLE (ligne de progression dans les tuiles) et annulable (opt-out de session), et
  // abandonné dès qu'un chargement réel démarre (cleanup sur modelState — le loader resservira les
  // plages déjà en cache, rien n'est perdu).
  // L'effet ne dépend que d'un booléen DÉRIVÉ : l'ancienne version dépendait des 4 états bruts, et
  // n'importe quel changement pendant le délai de lancement exécutait le cleanup (abort) tandis que
  // `prefetchTried` — posé avant le départ — interdisait toute relance : le préchargement mourait en
  // silence. Ici le cleanup ne tire que quand précharger n'a plus de sens (chargement réel démarré,
  // modèle en place), et une redescente à « idle » peut relancer — la reprise est gratuite, les
  // plages déjà en cache sont recensées d'abord.
  const wantPrefetch = webGpuSupported === true && modelState === 'idle' && !loadedModelName;
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
    if (urlWantsModel()) return; // un deeplink est en route : ne pas lui passer devant
    autoLoadedRef.current = true;
    handleStreamBrik(MOBILE_BRIK_URL, 'mobile-auto');
  }, [prefetchDone, isMobile, modelState, loadedModelName, imageGen]);

  // Deeplink « ouvrir ce modèle dans Le Kern » — la surface consommée par le menu « Use this model »
  // des pages modèles Hugging Face (cf. docs/huggingface-integration.md) et par les bancs :
  //   ?model=auteur/dépôt[&file=chemin]  → résout le meilleur fichier du dépôt (BRIK > GGUF)
  //   ?brik=<url> | ?gguf=<url>          → URL directe
  // Une seule tentative par session, uniquement moteur libre (WebGPU confirmé, rien de chargé) — la
  // reprise de conversation et le préchargement gardent la priorité s'ils ont déjà agi. Les échecs
  // de résolution sont AFFICHÉS (écran d'erreur) : un visiteur qui arrive depuis HF doit comprendre
  // pourquoi son modèle ne se charge pas, pas voir un accueil muet.
  // Chargement d'une CIBLE de deeplink, quelle qu'en soit la provenance : la query string (visiteur
  // venu de Hugging Face) ou le champ « tester n'importe quel modèle » de l'UI. Un seul chemin pour
  // les deux → même résolution du meilleur quant, mêmes messages d'erreur affichés, et le
  // tokenizer/l'arch sont déduits du fichier (rien à régler à la main).
  const loadDeeplinkTarget = async (target: NonNullable<ReturnType<typeof parseDeeplink>>, origin: string) => {
    let url: string, kind: 'brik' | 'gguf';
    if ('url' in target) ({ url, kind } = target);
    else {
      setModelState('initializing');
      setLoadingStep(t(`Resolving ${target.id} on Hugging Face…`, `Résolution de ${target.id} sur Hugging Face…`));
      const r = await resolveHfModel(target.id, target.file);
      url = r.url; kind = r.kind;
      setLoadingStep(t(`Found ${r.path} — loading…`, `Trouvé ${r.path} — chargement…`));
    }
    metric('deeplink_load', { kind, origin });
    if (kind === 'brik') await handleStreamBrik(url, origin);
    else await handleLoadModelFromUrl(url);
  };

  // Saisie LIBRE : ce que l'utilisateur colle dans le champ « tester n'importe quel modèle »
  // (identifiant, page du dépôt, page d'un fichier, lien direct). Rend un message d'erreur à
  // AFFICHER dans le champ, ou null si le chargement est parti.
  const loadModelFromInput = async (raw: string): Promise<string | null> => {
    const target = parseModelInput(raw);
    if (!target) {
      return t(
        'Unrecognized. Paste a Hugging Face model (author/model), the URL of its page, or a direct .gguf / .brik link.',
        'Non reconnu. Collez un modèle Hugging Face (auteur/modèle), l’URL de sa page, ou un lien direct .gguf / .brik.',
      );
    }
    setBrowseOpen(false);
    try {
      await loadDeeplinkTarget(target, 'paste');
      return null;
    } catch (e) {
      const msg = (e as Error)?.message || String(e);
      setErrorMsg(msg);
      setModelState('error');
      return msg;
    }
  };

  // L'URL demande-t-elle un modèle PRÉCIS ? (`?model=`, `?file=`, `?gguf=`, `?brik=`, ou le `?start=1`
  // du CTA de la landing.) Deux chargements automatiques doivent alors se taire : la reprise de la
  // dernière conversation et l'auto-chargement mobile. Sans ça, ils gagnent la course — la reprise
  // n'attend qu'IndexedDB, le deeplink attend la sonde WebGPU — et l'utilisateur qui clique
  // « LFM2.5 » sur l'accueil voit démarrer le Qwen de sa session précédente (signalé par Romain).
  // Un choix explicite prime toujours sur « ce que tu avais la dernière fois ».
  const urlWantsModel = () => {
    if (typeof window === 'undefined') return false;
    const q = window.location.search;
    return !!parseDeeplink(q) || new URLSearchParams(q).get('start') === '1';
  };

  const deeplinkTried = useRef(false);
  useEffect(() => {
    if (deeplinkTried.current) return;
    if (webGpuSupported !== true || modelState !== 'idle' || loadedModelName) return;
    const target = parseDeeplink(window.location.search);
    if (!target) {
      deeplinkTried.current = true;
      // `?start=1` : le CTA de la landing. Sans lui, le visiteur qui vient de cliquer « Essayer
      // maintenant » atterrit sur un accueil où il doit re-cliquer un bouton équivalent — deux clics
      // pour un seul choix, exactement l'hésitation que l'accueil anti-rebond avait supprimée.
      if (new URLSearchParams(window.location.search).get('start') === '1') {
        handleStreamBrik(MOBILE_BRIK_URL, 'landing');
      }
      return;
    }
    deeplinkTried.current = true;
    (async () => {
      try {
        await loadDeeplinkTarget(target, 'deeplink');
      } catch (e) {
        console.warn('[deeplink] chargement direct échoué', e);
        setErrorMsg((e as Error)?.message || String(e));
        setModelState('error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webGpuSupported, modelState, loadedModelName]);

  // ── Éviction des modèles inutilisés ───────────────────────────────────────────────────────────
  // (1) On DATE le modèle à chaque fois qu'il devient réellement actif (pas au téléchargement :
  // c'est l'usage qui décide de ce qu'on garde). (2) Une fois par session, on purge les poids
  // inutilisés depuis N jours (30 par défaut, réglable dans Stockage, « jamais » possible) — sans
  // jamais toucher aux conversations, aux .brik convertis localement, ni au modèle chargé.
  useEffect(() => {
    if (modelState !== 'ready' || !loadedModelUrl) return;
    markModelUsed(loadedModelUrl);
  }, [modelState, loadedModelUrl]);

  const evictRan = useRef(false);
  useEffect(() => {
    if (evictRan.current) return;
    evictRan.current = true;
    // Différé : la purge lit tout le cache (des centaines d'entrées) — hors du chemin critique du
    // premier rendu et du chargement de modèle.
    const id = setTimeout(() => {
      evictStaleModels(loadedModelUrl ? [loadedModelUrl] : [])
        .then((r) => { if (r.models.length) handleCacheChanged(); }) // badges « en cache » + bibliothèque à jour
        .catch(() => { /* stockage indisponible — sans effet */ });
    }, 4000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // L'URL porte une demande explicite → on garde la LISTE des conversations (barre latérale) mais
      // on ne recharge ni modèle ni conversation : le visiteur a demandé autre chose.
      if (urlWantsModel()) return;
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
      let streamReady = false;
      if (last.modelUrl && [...cached].some((c) => c.startsWith(last.modelUrl!))) {
        const src = await import('@/lib/webgpu/source');
        // Depuis que le GGUF se charge AUSSI par plages, la même règle s'applique aux deux formats :
        // un cache partiel ne doit pas déclencher un streaming au premier plan à l'ouverture. Un GGUF
        // hérité du chemin monolithique (copie plein-fichier) compte comme prêt.
        streamReady = isBrik
          ? await src.brikCacheComplete(last.modelUrl)
          : (await src.ggufCacheComplete(last.modelUrl)) || (await src.ggufFullCached(last.modelUrl));
        if (cancelled) return;
      }
      const canAutoLoad = !!last.modelUrl && [...cached].some((c) => c.startsWith(last.modelUrl!)) && streamReady;
      // Modèle absent du cache → on N'AUTO-RESTAURE PAS : rouvrir la dernière conv sans son modèle
      // laissait l'utilisateur bloqué devant un chat mort (retour de Romain). Accueil neuf à la place ;
      // la conversation reste dans la sidebar et s'ouvre à la demande.
      if (!canAutoLoad) return;
      if (isBrik) await handleStreamBrik(last.modelUrl!, 'resume'); // load model (paints welcome), then…
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

  // Débit + ETA de la barre de chargement — « 120 Mo / 359 Mo » sans vitesse ni temps restant est
  // anxiogène sur un fichier de centaines de Mo. Fenêtre glissante de 8 s (le débit instantané HF
  // fluctue trop pour une ETA lisible) ; reset quand la progression recule (nouvelle phase).
  const rateSamples = useRef<{ t: number; loaded: number }[]>([]);
  const [loadRate, setLoadRate] = useState<{ bps: number; etaS: number } | null>(null);
  useEffect(() => {
    if (!loadingProgress || !loadingProgress.total) { rateSamples.current = []; setLoadRate(null); return; }
    const now = performance.now();
    const s = rateSamples.current;
    if (s.length && loadingProgress.loaded < s[s.length - 1].loaded) s.length = 0;
    s.push({ t: now, loaded: loadingProgress.loaded });
    while (s.length > 2 && now - s[0].t > 8000) s.shift();
    if (s.length >= 2) {
      const dt = (now - s[0].t) / 1000, db = loadingProgress.loaded - s[0].loaded;
      if (dt > 0.5 && db > 0) {
        const bps = db / dt;
        setLoadRate({ bps, etaS: (loadingProgress.total - loadingProgress.loaded) / bps });
        return;
      }
    }
    setLoadRate(null);
  }, [loadingProgress]);
  // « téléchargé / total » : l'unité n'est écrite qu'UNE fois quand elle est commune (le cas normal,
  // « 383,2 / 609,8 Mo »), sinon les deux (« 512 Ko / 1,2 Go » reste juste au début d'un gros
  // téléchargement). Un chiffre après la virgule suffit et la largeur ne bouge plus.
  const formatProgressPair = (loaded: number, total: number) => {
    const a = formatBytes(loaded, 1), b = formatBytes(total, 1);
    const ua = a.slice(a.lastIndexOf(' ') + 1), ub = b.slice(b.lastIndexOf(' ') + 1);
    return ua === ub ? `${a.slice(0, a.lastIndexOf(' '))} / ${b}` : `${a} / ${b}`;
  };

  const formatEta = (s: number) => {
    if (s < 60) return t(`~${Math.max(1, Math.round(s))} s left`, `~${Math.max(1, Math.round(s))} s restantes`);
    return t(`~${Math.round(s / 60)} min left`, `~${Math.round(s / 60)} min restantes`);
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
        // add_special_tokens : FAUX quand le template écrit déjà le début de séquence (llama3
        // « <|begin_of_text|> », mistral3 « <s> ») — sinon le tokenizer en ajoute un SECOND et la
        // sortie part en charabia (cf. templateWritesBos). Vrai partout ailleurs : les templates
        // ChatML/Gemma comptent justement sur le tokenizer pour le poser.
        promptTokens = toIds(await activeTokenizer(prompt, { add_special_tokens: !templateWritesBos(modelArchType) }));
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
      // Prefill TUILÉ (même approche que LFM2, tranches de 128) : un prompt long en UNE soumission
      // GPU risquait le watchdog/device-lost (constaté en prod sur LFM2 >400 tokens), gonflait les
      // buffers de scratch, et ne permettait ni progression ni Stop. Les tranches intermédiaires ne
      // servent qu'à remplir le KV ; leur petit readback (top-k/logits du dernier token, ignoré)
      // borne chaque soumission. Chaque tranche complétée entre dans `fed` : même interrompu, le
      // prefill déjà payé est réutilisé au tour suivant (préfixe KV).
      const PREFILL_CHUNK = 128;
      const showPrefillProgress = newPromptTokens.length > PREFILL_CHUNK * 2;
      let currentToken = -1;
      for (let c = 0, feedPos = pastLen; ; c += PREFILL_CHUNK) {
        const chunk = newPromptTokens.slice(c, c + PREFILL_CHUNK);
        const isLast = c + PREFILL_CHUNK >= newPromptTokens.length;
        if (activeAbortController.signal.aborted) throw new DOMException('aborted', 'AbortError');
        if (showPrefillProgress) {
          const doneToks = Math.min(c + chunk.length, newPromptTokens.length);
          setMessages(prev => prev.map(m => m.id === assistantMsgId
            ? { ...m, content: t(`⏳ Reading the context — ${doneToks}/${newPromptTokens.length} tokens…`, `⏳ Lecture du contexte — ${doneToks}/${newPromptTokens.length} tokens…`) }
            : m));
        }
        if (gpuTopkOn) {
          const pre = await activeModel.topKKV(chunk, feedPos, sessionId, recentIds(promptTokens), SAMPLING.repetitionPenalty);
          if (isLast) currentToken = sampleFromTopK(pre.ids, pre.vals, SAMPLING);
        } else {
          const logits = await activeModel.logitsKV(chunk, feedPos, sessionId);
          if (isLast) currentToken = sampleNextToken(logits, { ...SAMPLING, recentTokens: promptTokens.slice(-REPEAT_WINDOW) });
        }
        feedPos += chunk.length;
        fed.push(...chunk);
        if (isLast) break;
      }

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
      let loopCut = false; // vrai si la génération a été coupée sur une boucle de lignes répétées
      let stoppedNaturally = false; // vrai si le modèle a produit sa marque de fin de tour
      const generatedTokens = [currentToken];

      // Fenêtre de pénalité de répétition INCRÉMENTALE : l'ancien chemin recopiait
      // [...promptTokens, ...generatedTokens] + new Set À CHAQUE token (O(contexte) par token sur
      // le thread chaud). Ici : fenêtre glissante de REPEAT_WINDOW + comptes par id, O(1) par token.
      const penaltyWindow: number[] = [...promptTokens.slice(-REPEAT_WINDOW), currentToken].slice(-REPEAT_WINDOW);
      const penaltyCounts = new Map<number, number>();
      for (const id of penaltyWindow) penaltyCounts.set(id, (penaltyCounts.get(id) ?? 0) + 1);
      const pushPenalty = (id: number) => {
        penaltyWindow.push(id);
        penaltyCounts.set(id, (penaltyCounts.get(id) ?? 0) + 1);
        if (penaltyWindow.length > REPEAT_WINDOW) {
          const old = penaltyWindow.shift()!;
          const c = penaltyCounts.get(old)! - 1;
          if (c === 0) penaltyCounts.delete(old); else penaltyCounts.set(old, c);
        }
      };
      const penaltyIds = () => [...penaltyCounts.keys()];
      
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
      const pushUi = (text: string, truncated = false) => {
        const decodeElapsedMs = performance.now() - tDecodeStart;
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? {
          ...m,
          content: text,
          truncated,
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
          const step = await activeModel.topKKV([currentToken], pos, sessionId, penaltyIds(), SAMPLING.repetitionPenalty);
          nextToken = sampleFromTopK(step.ids, step.vals, SAMPLING);
        } else {
          nextToken = sampleNextToken(await activeModel.logitsKV([currentToken], pos, sessionId), {
            ...SAMPLING,
            recentTokens: penaltyWindow.slice(),
          });
        }
        fed.push(currentToken);

        currentToken = nextToken;
        generatedTokens.push(currentToken);
        pushPenalty(currentToken);
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
              pushPenalty(tk);
              closeLogits = await activeModel.logitsKV([tk], pos, sessionId);
              fed.push(tk);
            }
            currentToken = sampleNextToken(closeLogits!, {
              ...SAMPLING,
              recentTokens: penaltyWindow.slice(),
            });
            generatedTokens.push(currentToken);
            pushPenalty(currentToken);
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

        // Check for stop tokens — scan the raw tail (markers can be ~22 chars wide). Les ids
        // déclarés par le FICHIER passent en premier : la table par architecture s'oublie (cf.
        // declaredStopIds), le manifeste, lui, est toujours là.
        if (isStopToken(currentToken, tailRaw.slice(-48), modelArchType, stopIds)) {
          stoppedNaturally = true;
          break;
        }

        // Garde-fou anti-BOUCLE. La pénalité de répétition agit token par token : elle n'empêche pas
        // un petit modèle de recopier une LIGNE entière indéfiniment. Vu en vrai (2026-08-13) :
        // « Source : https://fr.wikipedia.org/wiki/Mark_Ruffalo » répétée quinze fois d'affilée après
        // qu'un extrait web avait été injecté dans le prompt. On coupe dès qu'une même ligne non
        // triviale sort 3 fois — mieux vaut une réponse courte qu'un mur de copies (et ça économise
        // des tokens de décodage sur un appareil léger). Vérifié une fois sur 24 tokens, pas à chaque
        // token : le décodage complet coûte, et une boucle se voit largement dans cette fenêtre.
        if (generatedTokens.length % 24 === 0) {
          const soFar = stripTurnMarkers(await activeTokenizer.decode(generatedTokens, { skip_special_tokens: true }));
          const lines = soFar.split('\n').map((l) => l.trim()).filter((l) => l.length > 12);
          if (lines.length >= 3) {
            const counts = new Map<string, number>();
            for (const l of lines) counts.set(l, (counts.get(l) ?? 0) + 1);
            const worst = Math.max(...counts.values());
            if (worst >= 3) {
              console.warn(`[chat] boucle détectée (une ligne répétée ${worst}×) — génération coupée`);
              loopCut = true;
              break;
            }
          }
        }
      }

      // Plafond atteint sans que le modèle ait produit sa fin de tour : la réponse est COUPÉE.
      // `stoppedNaturally` est posé par la sortie sur stop token ; sinon on marque le message.
      const hitCap = !stoppedNaturally && !loopCut;

      // Rendu final complet + stats définitives (la boucle s'arrête presque toujours entre deux
      // ticks d'affichage — sans ça, la fin du message manquerait).
      assistantText = stripTurnMarkers(await activeTokenizer.decode(generatedTokens, { skip_special_tokens: true }));
      // Boucle coupée : on retire aussi les copies déjà produites (garder « Source : … » quinze fois
      // n'apporte rien) en dédupliquant les lignes consécutives identiques.
      if (loopCut) {
        const seen = new Set<string>();
        assistantText = assistantText.split('\n').filter((l) => {
          const k = l.trim();
          if (k.length <= 12) return true;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        }).join('\n').trimEnd();
      }
      pushUi(assistantText, hitCap);

      // Funnel : le « wow » a eu lieu — une première réponse complète cette session.
      metricOnce('first_reply', { model: loadedModelName });
      setModelState('ready');
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('abort') || activeAbortController.signal.aborted) {
        setModelState('ready');
        setMessages(prev => prev.map(m => {
          // Contenu vide OU ligne de progression du prefill tuilé (⏳) : rien de généré à garder.
          if (m.id === assistantMsgId && (m.content === '' || m.content.startsWith('⏳'))) {
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
      // Même règle que le chat : pas de BOS ajouté quand le template l'écrit (cf. templateWritesBos).
      const encoded = await activeTokenizer(prompt, { add_special_tokens: !templateWritesBos(modelArchType) });
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

  // « Continuer » sous une réponse coupée au plafond : on renvoie une consigne de reprise plutôt que
  // de bricoler la boucle de décodage. Le prompt étant append-only, le préfixe KV des tours passés
  // (dont la réponse partielle) est réutilisé : la reprise ne re-préfille que cette consigne.
  const handleContinue = () => {
    if (modelState !== 'ready') return;
    handleSendMessage(t('Continue exactly where you stopped, without repeating yourself.',
                        'Continue exactement là où tu t’es arrêté, sans te répéter.'));
  };

  // Switch (back) to Auto: recompute the VRAM-driven precision for the current model + device and apply it.
  const applyAutoPrec = () => {
    setAutoPrec(true);
    if (!activeModel || !modelMetadata?.tensors) return;
    const totalParams = Object.values(modelMetadata.tensors as Record<string, { nElems?: number }>).reduce((a, t) => a + (t.nElems || 0), 0);
    const auto = pickAutoPrecision(totalParams, activeModel.supportsQ8, !!activeEngine?.hasF16, isMobile, activeEngine?.maxStorageBufferBindingSize || 0);
    changePrecision(auto);
    // KV int8 seulement quand ça compte (gros modèle / q4) — sinon f32, plus rapide. Le kill-switch
    // ?kvq=0 vit dans useModelEngine (chemin de CHARGEMENT) : ce bouton-ci n'est qu'un retour manuel
    // à l'auto, il doit refléter la même règle.
    const kvCut = new URLSearchParams(window.location.search).get('kvq') === '0';
    changeKvQuant(!kvCut && (auto === 'q4' || totalParams > 1.2e9));
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
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} suppressHydrationWarning>
        <div className="sidebar-header">
          {/* Marque « kern-B » : un B massif entaillé d'un crénage diagonal (brimKERN). SVG inline
              plat — currentColor suit le thème, zéro asset (l'ancien PNG glossy de 200 Ko est retiré). */}
          {/* La marque RAMÈNE à l'accueil. Tant que la racine servait l'application, un lien vers
              elle n'aurait mené nulle part ; depuis qu'elle porte la landing, c'était le seul chemin
              de retour qui manquait — et cliquer le logo pour revenir à l'accueil est ce que tout le
              monde essaie en premier. */}
          <Link
            href={href('/')}
            title={t('Back to home', "Retour à l'accueil")}
            style={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit', minWidth: 0 }}
          >
            <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden className="logo-image" style={{ flexShrink: 0, color: 'var(--text-primary)' }}>
              <defs><clipPath id="brimkern-kern" clipPathUnits="userSpaceOnUse"><path clipRule="evenodd" d="M0 0H100V100H0Z M62 -10 L34 112 L46 112 L74 -10 Z" /></clipPath></defs>
              <text x="50" y="86" textAnchor="middle" fontFamily="var(--font-heading), Georgia, serif" fontSize="100" fontWeight="900" fill="currentColor" clipPath="url(#brimkern-kern)">B</text>
            </svg>
            <div className="logo-text">Brimkern</div>
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* GitHub en évidence dans l'en-tête : le moteur est open source (MIT) et c'est le
                premier réflexe d'un visiteur technique — il était enterré dans un bouton de
                l'accueil, invisible dès qu'un modèle était chargé. `aria-label` sur les trois
                boutons-icônes : `title` seul ne donne pas de nom accessible fiable (audit axe). */}
            <a
              href="https://github.com/RomainKH/Brimkern"
              target="_blank"
              rel="noopener noreferrer"
              title={t('Source code on GitHub (MIT)', 'Code source sur GitHub (MIT)')}
              aria-label={t('Source code on GitHub (MIT)', 'Code source sur GitHub (MIT)')}
              style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', padding: '6px' }}
            >
              <GithubMark size={18} />
            </a>
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
              aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
              style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              title={dark ? (locale === 'fr' ? 'Mode clair' : 'Light mode') : (locale === 'fr' ? 'Mode nuit' : 'Dark mode')}
              aria-label={dark ? (locale === 'fr' ? 'Mode clair' : 'Light mode') : (locale === 'fr' ? 'Mode nuit' : 'Dark mode')}
              style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px' }}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                title={t('Close panel', 'Fermer le panneau')}
                aria-label={t('Close panel', 'Fermer le panneau')}
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
                    {/* ÉPURATION mobile (2026-08-13) : ces deux boutons de modèle étaient rendus ICI
                        *et* sur l'écran d'accueil — mêmes libellés, mêmes actions, plus « Parcourir
                        tous les modèles » et « Annuler » en double. Mesuré : 27 éléments cliquables à
                        l'écran sur 390 px, contre 25 au bureau, alors que le mobile devrait en montrer
                        MOINS. Le choix du modèle vit désormais à UN seul endroit (l'accueil, qui porte
                        le CTA anti-rebond) ; la barre latérale ne garde que la porte d'entrée du
                        catalogue, utile si elle est ouverte avant tout chargement. */}
                    {prefetchStatus(false)}
                    <button
                      className="btn btn-primary btn-block"
                      style={{ fontSize: '12px' }}
                      onClick={() => setBrowseOpen(true)}
                      disabled={modelState === 'initializing' || modelState === 'loading' || modelState === 'generating'}
                    >
                      <Database size={13} /> {t('Choose a model', 'Choisir un modèle')}
                    </button>
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
            {/* Le labo vidéo occupait ici une ligne + deux lignes d'avertissement dans TOUTES les
                sessions, pour une fonctionnalité expérimentale (audit d'épuration 2026-08-13). Il vit
                désormais dans le navigateur de modèles, avec les autres modalités. */}
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
              onLoadFromInput={loadModelFromInput}
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
            {/* Deux liens, pas quatre (arbitrage de Romain, 2026-08-14). « Pour les sites » et
                « Convertir » sont des destinations de DÉCOUVERTE : leur place est sur la landing et
                dans le hub /docs, pas dans une barre qu'on regarde en travaillant. Rien n'est
                orphelin — les deux restent accessibles depuis /docs (cartes du hub) et depuis la
                landing. Et l'en-tête du chat cesse de proposer quatre sorties à qui vient de
                charger un modèle pour discuter. */}
            <Link
              href={href('/docs')}
              title={t('Documentation', 'Documentation')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', padding: '6px 8px' }}
            >
              <BookOpen size={16} />
              {!isMobile && <span>{t('Documentation', 'Documentation')}</span>}
            </Link>
            <Link
              href={href('/changelog')}
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
              {webGpuSupported === false ? (
                /* Accueil dédié « navigateur incompatible » : sans WebGPU la page était un produit
                   mort (seul un badge sidebar l'expliquait) — trafic Reddit/X in-app typiquement.
                   Ici : la proposition, le chemin (Chrome/Edge), un lien à emporter. */
                <>
                  <p className="welcome-subtitle">
                    {t("This browser has no WebGPU, so no model can run here. Everything Brimkern does — chat, image generation, vision — runs 100% locally in a compatible browser, with no server.",
                       "Ce navigateur ne prend pas en charge WebGPU : aucun modèle ne peut tourner ici. Tout ce que fait Brimkern — chat, génération d'images, vision — s'exécute pourtant 100 % en local dans un navigateur compatible, sans aucun serveur.")}
                  </p>
                  <div className="welcome-steps">
                    <div className="welcome-step">
                      <div className="welcome-step-num">{t('the fix', 'la solution')}</div>
                      <div className="welcome-step-title">{t('Open in Chrome or Edge', 'Ouvrez dans Chrome ou Edge')}</div>
                      <div className="welcome-step-desc">
                        {t('A recent Chrome or Edge, on desktop or Android. From the Reddit or X in-app browser, pick “Open in browser”.',
                           'Un Chrome ou Edge récent, sur ordinateur ou Android. Depuis le navigateur intégré de Reddit ou X, choisissez « Ouvrir dans le navigateur ».')}
                      </div>
                    </div>
                    <div className="welcome-step">
                      <div className="welcome-step-num">{t('already on Chrome?', 'déjà sur Chrome ?')}</div>
                      <div className="welcome-step-title">{t('Check the acceleration', "Vérifiez l'accélération")}</div>
                      <div className="welcome-step-desc">
                        {t('Settings → System → “Use graphics acceleration when available”, then restart the browser (chrome://gpu to diagnose).',
                           "Paramètres → Système → « Utiliser l'accélération graphique si disponible », puis redémarrez le navigateur (chrome://gpu pour diagnostiquer).")}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }} onClick={copyPageLink}>
                      {linkCopied ? <><CheckCircle size={14} /> {t('Link copied', 'Lien copié')}</> : t('Copy the link for later', 'Copier le lien pour plus tard')}
                    </button>
                    <a className="btn" style={{ fontSize: '13px', padding: '8px 16px' }} href="https://github.com/RomainKH/Brimkern" target="_blank" rel="noopener noreferrer">
                      {t('View the code on GitHub', 'Voir le code sur GitHub')}
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="welcome-subtitle">
                    {t('A standalone, optimized build powered by hand-written WGSL compute shaders. Your models and computations run entirely locally, with no third-party server.', "Version standalone optimisée exploitant des compute shaders WGSL écrits sur mesure. Vos modèles et calculs s'exécutent entièrement en local sans aucun serveur tiers.")}
                  </p>

                  {/* Le CTA AVANT les explications : un seul chemin évident vers le premier « wow »
                      (une rangée de boutons équivalents fait hésiter, et hésiter c'est rebondir). */}
                  {isMobile ? (
                    <div style={{ textAlign: 'center', width: '100%', marginBottom: '36px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '13px', padding: '8px 16px' }}
                          onClick={() => handleStreamBrik(MOBILE_BRIK_URL, 'welcome')}
                        >
                          <Sparkles size={14} /> {t('LFM2.5 230M (149 MB) — recommended', 'LFM2.5 230M (149 Mo) — recommandé')}
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '12px', padding: '7px 14px' }}
                          onClick={() => handleStreamBrik(QWEN_MOBILE_BRIK_URL, 'welcome')}
                        >
                          <Sparkles size={13} /> {t('Qwen 2.5 0.5B (378 MB)', 'Qwen 2.5 0.5B (378 Mo)')}
                        </button>
                      </div>
                      {prefetchStatus(true)}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '14px', padding: '10px 22px' }}
                        onClick={() => handleStreamBrik(MOBILE_BRIK_URL, 'welcome')}
                      >
                        <Sparkles size={15} /> {t('Try it now — LFM2.5 (149 MB)', 'Essayer maintenant — LFM2.5 (149 Mo)')}
                      </button>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '380px' }}>
                        {t('Downloaded once, kept on this device: next visits start in seconds. 100% local.',
                           'Téléchargé une fois, gardé sur cet appareil : les prochaines visites démarrent en quelques secondes. 100 % local.')}
                      </span>
                      <button className="btn" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={() => setBrowseOpen(true)}>
                        <Database size={13} /> {t('Browse all models', 'Parcourir tous les modèles')}
                      </button>
                    </div>
                  )}

                  <div className="welcome-steps">
                    <div className="welcome-step">
                      <div className="welcome-step-num">{t('step 1', 'étape 1')}</div>
                      <div className="welcome-step-title">{t('Pick a model', 'Choisissez un modèle')}</div>
                      <div className="welcome-step-desc">
                        {t('One click is enough — the weights stream in. Or drag and drop your own GGUF (Qwen, Gemma, Llama…).', 'Un clic suffit — les poids arrivent en streaming. Ou glissez-déposez votre propre GGUF (Qwen, Gemma, Llama…).')}
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

                  {/* « N'importe quel modèle du Hub » : la capacité qui distingue le produit d'un
                      catalogue fermé — le moteur lit tout GGUF mono-fichier. Elle n'existait que via
                      la query string (?model=) ou deux champs d'URL enterrés dans l'onglet Importer.
                      Placée ICI, sous les étapes : le CTA unique du haut reste seul (l'accueil
                      anti-rebond du 2026-08-12 a montré qu'une rangée de boutons équivalents fait
                      hésiter), mais qui lit jusqu'ici découvre qu'il peut tester son propre modèle. */}
                  <div style={{ marginTop: '28px', textAlign: 'left', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-card-hover, rgba(127,127,127,0.05))' }}>
                    <HfModelInput onLoad={loadModelFromInput} examples={HOME_HF_EXAMPLES} compact />
                  </div>

                  {/* Deux sorties pour le curieux pas prêt à télécharger : le SDK (vraie 2e page) et
                      les autres modalités — mêmes filets d'encre que les étapes, mais cliquables. */}
                  <div className="welcome-steps" style={{ marginTop: '28px' }}>
                    <Link href={href('/local-ai')} className="welcome-step welcome-card">
                      <div className="welcome-step-num">SDK</div>
                      <div className="welcome-step-title">{t('Add it to your site', 'Intégrez-le à votre site')}</div>
                      <div className="welcome-step-desc">
                        {t('One <script> tag gives any page a local, free, private AI assistant. →', "Une balise <script> donne à n'importe quelle page un assistant IA local, gratuit et privé. →")}
                      </div>
                    </Link>
                    <button type="button" className="welcome-step welcome-card" onClick={() => setBrowseOpen(true)}>
                      <div className="welcome-step-num">{t('also', 'aussi')}</div>
                      <div className="welcome-step-title">{t('Images & vision', 'Images & vision')}</div>
                      <div className="welcome-step-desc">
                        {t('Generate images (SD-Turbo) or describe photos (Qwen2-VL), still fully in-browser. →', 'Générez des images (SD-Turbo) ou décrivez des photos (Qwen2-VL), toujours 100 % dans le navigateur. →')}
                      </div>
                    </button>
                  </div>

                  {/* Attribution + lien vers le site de l'auteur, en PIED de l'accueil : le CTA du
                      haut reste seul (accueil anti-rebond), mais le visiteur qui lit jusqu'en bas
                      voit qui a fait le moteur. */}
                  <ByLine />
                </>
              )}
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
                // Largeur alignée sur le journal des étapes au-dessus (420) : à 300 px les trois
                // libellés (« 63 % », « 23,1 Mo/s · ~10 s restantes », « 383,23 Mo / 609,82 Mo »)
                // ne tenaient pas et le dernier repassait à la ligne — le bloc sautait d'une ligne
                // à l'autre pendant tout le téléchargement. nowrap + un seul chiffre après la
                // virgule + l'unité une seule fois : la ligne reste courte ET stable.
                <div style={{ width: '100%', maxWidth: '420px' }}>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${loadingProgress.percentage}%` }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', whiteSpace: 'nowrap' }}>
                    <span>{loadingProgress.percentage}%</span>
                    {loadRate && <span>{formatBytes(loadRate.bps, 1)}/s · {formatEta(loadRate.etaS)}</span>}
                    <span>{formatProgressPair(loadingProgress.loaded, loadingProgress.total)}</span>
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
            onContinue={handleContinue}
            busy={modelState === 'generating'}
            showReasoning={showReasoning}
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
          showReasoning={showReasoning} setShowReasoning={setShowReasoning}
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
