// Model-catalog metadata + selection helpers shared by the app: the hosted mobile model, roadmap
// teasers, modality pills, name normalization, VRAM-driven precision auto-pick, and the GGUF-arch →
// tokenizer/template mapping. Pure data/logic — no React/DOM.

import type { ArchType } from './presets';

// Pre-built, mobile-friendly model: Qwen2.5-0.5B in our int4 BRIK format (tokenizer embedded, tied
// embeddings deduped → 359 MB), hosted on Hugging Face and streamed lazily by HTTP Range (verified
// 206 + CORS). Regenerate with `npm run build:mobile-brik`, then re-upload to the HF repo.
// BRIK MIXTE (corps int4 + attention entière int8, 377 Mo) : la qualité int8 constatée pour +18 Mo
// seulement vs le q4 pur qui lobotomisait le 0.5B (A/B par tenseur du 2026-07-15 — le charabia
// int4 exige le tout-int4, l'ancre q8 sur l'attention le répare ; testé navigateur en streaming :
// bandeau « mixte int8+int4 », réponses cohérentes). Uploadé le 2026-07-15 (Range OK sur le CDN).
// Le q8 plein (508 Mo) et le q4 (359 Mo) restent sur le repo HF en repli.
export const QWEN_MOBILE_BRIK_URL = 'https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik';

// Défaut mobile depuis le 2026-07-21 : LFM2.5-230M (moteur v2 hybride) — 149 Mo au lieu de 378,
// chat FR meilleur à ce poids (bancs du port lfm2). Le Qwen 0.5B mixte reste le second choix
// affiché sur les tuiles mobiles ; le préchargement d'arrière-plan vise ce défaut.
export const MOBILE_BRIK_URL = 'https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik';

// ── Poids de TIERS, épinglés à une RÉVISION ───────────────────────────────────────────────────
// `resolve/main` est un pointeur mutable : le propriétaire d'un dépôt (ou quiconque prend son
// compte) peut remplacer le fichier, et nos visiteurs chargeraient le nouveau au prochain défaut de
// cache. Pour des poids que NOUS choisissons et que nous ne mettons jamais à jour, le pointeur
// mutable n'apporte rien et coûte cette exposition — d'où l'épinglage au sha du commit. Un
// changement de version devient alors un acte explicite, relu dans un diff.
// Nos propres BRIK, eux, restent en `resolve/main` (on les téléverse) et sont couverts par
// l'empreinte de leur manifeste — cf. src/lib/brik/integrity.ts.
// Révisions relevées le 2026-08-19 (Range + CORS vérifiés sur chaque fichier).
export const TAESD_REV = 'https://huggingface.co/madebyollin/taesd/resolve/614f76814bbe30edbe2e627ace1c2234c81a2c0e';
export const TAESD_DECODER = `${TAESD_REV}/taesd_decoder.safetensors`;
// L'encodeur (img2img) est déduit du décodeur par remplacement de nom dans loadSdTurbo : garder les
// deux fichiers sur LA MÊME révision est donc automatique, mais autant le dire.
export const SD_TURBO_REV = 'https://huggingface.co/stabilityai/sd-turbo/resolve/b261bac6fd2cf515557d5d0707481eafa0485ec2';
export const QWEN2VL_REV = 'https://huggingface.co/bartowski/Qwen2-VL-2B-Instruct-GGUF/resolve/2160e265f926e84e84dbb1c73e623b5324b23707';

// BRIK image pré-quantifiés (scripts/build-image-brik.cjs) — hébergés sur HF comme le BRIK mobile.
// ⚠️ Romain doit créer le repo et uploader public/models/*.brik ; en attendant, le chargeur image
// retombe automatiquement sur les safetensors fp16 d'origine (2,4 Go) si le BRIK répond 404.
export const IMAGE_BRIK_BASE = 'https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main';

// BRIK VIDÉO (AnimateDiff-Lightning sur base SD 1.5, docs/video-gen-feasibility.md) — uploadés le
// 2026-07-21 (byte-exact vérifiés). UNet 914 Mo + motion 483 Mo + CLIP-L 131 Mo, q8 streamé.
const VIDEO_BRIK_BASE = 'https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main';
export const VIDEO_BRIK = {
	unet: `${VIDEO_BRIK_BASE}/video-unet-q8.brik`,
	motion: `${VIDEO_BRIK_BASE}/video-motion-q8.brik`,
	clip: `${VIDEO_BRIK_BASE}/video-clip-q8.brik`,
	taesd: TAESD_DECODER,
};
export const IMAGE_BRIK = {
  sdturbo: { unet: `${IMAGE_BRIK_BASE}/sd-turbo-unet-q8.brik`, clip: `${IMAGE_BRIK_BASE}/sd-turbo-clip-q8.brik` },
  // SDXS-512 mobile : UNet light (int4, 205 Mo) + CLIP allégé (int4, 235 Mo) = ~445 Mo tout compris.
  sdxs: { unet: `${IMAGE_BRIK_BASE}/sdxs-unet-light.brik`, clip: `${IMAGE_BRIK_BASE}/sd-turbo-clip-mixed.brik` },
  // ⚠️ RealVisXL Turbo — PAS ENCORE UTILISABLE, gardé ici comme cible de portage. Deux blocages :
  // (1) ces quatre fichiers ne sont pas hébergés (404 vérifié le 2026-08-19) ; (2) le moteur n'a
  // AUCUN chemin SDXL — un seul encodeur CLIP (ctxDim 1024), pas de conditionnement additionnel
  // (pooled + time_ids), et mult [1,2,4,4] au lieu de [1,2,4]. Le brancher comme défaut desktop
  // envoyait le repli safetensors chercher 10,27 Go de fp32 pour une topologie illisible.
  // Ne pas recâbler avant d'avoir : le double encodeur, add_embedding, et les BRIK en ligne.
  realvisxl: {
    unet: `${IMAGE_BRIK_BASE}/realvisxl-unet-mixed.brik`,
    clip: `${IMAGE_BRIK_BASE}/realvisxl-clip2-q8.brik`,
    clip1: `${IMAGE_BRIK_BASE}/realvisxl-clip1-q8.brik`,
    vae: `${IMAGE_BRIK_BASE}/realvisxl-vae-q8.brik`,
  },
};

// Normalize a model name/filename for loose matching (the active model name loses its .gguf and gets
// cleaned when auto-converted to BRIK, so an exact === against the preset URL filename misses).
export const normModelName = (s: string) => (s || '').toLowerCase().replace(/\.(gguf|brik)$/i, '').replace(/[^a-z0-9]/g, '');

// Roadmap teasers shown (greyed, non-clickable) in the browse grid — known models across modalities,
// to signal where Brimkern is heading. `modality` drives the colored pill.
export type Modality = 'text' | 'text2img' | 'vision';
export interface ComingSoonModel {
  vendor: string;
  name: string;
  params: { en: string; fr: string } | string;
  modality: Modality;
  badge?: { en: string; fr: string; color?: string; bg?: string };
  useCase?: { en: string; fr: string };
  desc: { en: string; fr: string };
  tags: { en: string; fr: string }[];
}

export const COMING_SOON: ComingSoonModel[] = [
  {
    vendor: 'Microsoft',
    name: 'Phi-3.5-mini',
    params: '~3.8B',
    modality: 'text',
    useCase: { en: 'Reasoning & math', fr: 'Raisonnement & maths' },
    desc: {
      en: 'Compact with strong reasoning capabilities. Port in progress (fused QKV/FFN).',
      fr: 'Compact et excellent en raisonnement. Adaptation en cours (QKV/FFN fusionnés).'
    },
    tags: [
      { en: 'reasoning', fr: 'raisonnement' },
      { en: 'compact', fr: 'compact' },
    ]
  },
  {
    vendor: 'SG161222 / Stability',
    name: 'RealVisXL Turbo',
    params: { en: '1024px photoreal', fr: '1024px photoréaliste' },
    modality: 'text2img',
    badge: { en: '💎 Ultra-HD Photoreal', fr: '💎 Photoréalisme Ultra-HD', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    useCase: { en: 'Cinematic 1024px studio photography', fr: 'Photo studio 1024px & cinéma' },
    desc: {
      en: 'SDXL photorealistic heavyweight: natural skin pores, high dynamic range, and studio lighting.',
      fr: 'Modèle SDXL photoréaliste de référence : pores naturels, dynamique élevée et rendu studio.'
    },
    tags: [
      { en: '1024px', fr: '1024px' },
      { en: 'SDXL', fr: 'SDXL' },
      { en: 'photoreal', fr: 'photoréaliste' },
    ]
  },
  {
    vendor: 'Stability AI',
    name: 'Stable Diffusion Turbo',
    params: { en: 'SD 512px · ~1.3 GB', fr: 'SD 512px · ~1,3 Go' },
    modality: 'text2img',
    badge: { en: '★ Best Quality', fr: '★ Meilleure qualité', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    useCase: { en: 'High detail & standard 512px', fr: 'Détails élevés & standard 512px' },
    desc: {
      en: 'Text to image in native 512px on capable GPUs. Streamed pre-quantized BRIK weights (~1.3 GB).',
      fr: 'Texte vers image, en 512px natif sur GPU capable. Poids BRIK pré-quantifiés streamés : ~1,3 Go.'
    },
    tags: [
      { en: 'diffusion', fr: 'diffusion' },
      { en: 'BRIK q8', fr: 'BRIK q8' },
      { en: '512px', fr: '512px' },
    ]
  },
  {
    vendor: 'IDM-Lab',
    name: 'SDXS-512',
    params: { en: '1-step · ~330 MB', fr: '1-step · ~330 Mo' },
    modality: 'text2img',
    badge: { en: '⚡ Ultra-fast (1-step)', fr: '⚡ Ultra-rapide (1-step)', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    useCase: { en: 'Fast drafting & low memory', fr: 'Brouillons rapides & poids plume' },
    desc: {
      en: 'Ultra-fast distilled 1-step UNet without mid-block (~330 MB): cuts generation time in half.',
      fr: 'UNet distillé ultra-rapide 1-step sans bloc central (~330 Mo) : divise par ~2 le temps de génération.'
    },
    tags: [
      { en: 'distilled', fr: 'distillé' },
      { en: 'ultra-fast', fr: 'ultra-rapide' },
      { en: 'BRIK light', fr: 'BRIK light' },
    ]
  },
  {
    vendor: 'SG161222',
    name: 'Realistic Vision Turbo',
    params: { en: 'SD 512px · ~1.3 GB', fr: 'SD 512px · ~1,3 Go' },
    modality: 'text2img',
    badge: { en: '📸 Photorealism & Portraits', fr: '📸 Photoréalisme & Portraits', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
    useCase: { en: 'Human portraits & realistic textures', fr: 'Portraits humains & textures réelles' },
    desc: {
      en: 'Photorealistic fine-tune specialized in realistic lighting, skin texture, and real-world photography.',
      fr: 'Modèle spécialisé dans l’éclairage naturel, le grain de peau et la photographie réaliste.'
    },
    tags: [
      { en: 'photoreal', fr: 'photoréalisme' },
      { en: 'portraits', fr: 'portraits' },
      { en: 'photography', fr: 'photo' },
    ]
  },
  {
    vendor: 'Black Forest Labs',
    name: 'FLUX.1-schnell',
    params: { en: 'DiT 12B · 1-4 steps', fr: 'DiT 12B · 1-4 steps' },
    modality: 'text2img',
    badge: { en: '🔥 Studio Quality (DiT)', fr: '🔥 Qualité Studio (DiT)', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    useCase: { en: 'State-of-the-art anatomy & typography', fr: 'Anatomie parfaite & typographie' },
    desc: {
      en: 'State-of-the-art 12B rectified flow transformer for ultra-realistic photorealism, hands, and scene composition.',
      fr: 'Transformeur de diffusion 12B pour un rendu photoréaliste de pointe, mains parfaites et composition avancée.'
    },
    tags: [
      { en: 'rectified-flow', fr: 'rectified-flow' },
      { en: '12B', fr: '12B' },
      { en: 'next-gen', fr: 'next-gen' },
    ]
  },
  {
    vendor: 'Lykon',
    name: 'DreamShaper Turbo',
    params: { en: 'SD 512px · ~1.3 GB', fr: 'SD 512px · ~1,3 Go' },
    modality: 'text2img',
    badge: { en: '🎬 Cinematic & Concept Art', fr: '🎬 Cinématographique & Art', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
    useCase: { en: 'Cinematic lighting & fantasy art', fr: 'Éclairage cinéma & art fantastique' },
    desc: {
      en: 'Popular artistic and photorealistic blend for cinematic shots, architecture, and dynamic lighting.',
      fr: 'Modèle polyvalent et immersif pour plans de cinéma, architecture et éclairages dynamiques.'
    },
    tags: [
      { en: 'cinematic', fr: 'cinéma' },
      { en: 'concept-art', fr: 'concept-art' },
    ]
  },
  {
    vendor: 'Alibaba',
    name: 'Qwen2-VL 2B',
    params: '~2.6 GB VRAM',
    modality: 'vision',
    badge: { en: '👁️ Visual Analysis', fr: '👁️ Analyse Visuelle', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
    useCase: { en: 'Visual Q&A & OCR', fr: 'Questions visuelles & OCR' },
    desc: {
      en: 'Describe and query images (image + text → text). Native visual encoder.',
      fr: 'Décrit / interroge une image (image + texte → texte). Encodeur visuel natif.'
    },
    tags: [
      { en: 'multimodal', fr: 'multimodal' },
      { en: 'OCR', fr: 'OCR' },
    ]
  },
  {
    vendor: 'Stability AI / PixArt',
    name: 'SDXL-Turbo / PixArt-Sigma',
    params: { en: '1024px native', fr: '1024px natif' },
    modality: 'text2img',
    badge: { en: '✨ 1024px Native', fr: '✨ 1024px Natif', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
    useCase: { en: 'High-res & 2× GPU upscaler', fr: 'Haute résolution & 2× GPU upscaler' },
    desc: {
      en: 'Native high-fidelity 1024px generation or real-time 2× GPU upscaler.',
      fr: 'Génération native haute fidélité en 1024px ou upscaler 2× GPU temps réel.'
    },
    tags: [
      { en: '1024px', fr: '1024px' },
      { en: 'SDXL', fr: 'SDXL' },
      { en: 'PixArt', fr: 'PixArt' },
      { en: 'upscaler', fr: 'upscaler' },
    ]
  },
  {
    vendor: 'Mistral AI',
    name: 'Mistral 7B Instruct',
    params: '~7B',
    modality: 'text',
    useCase: { en: 'General text & instruction', fr: 'Texte général & instruction' },
    desc: {
      en: 'The industry-standard open-weight model, foundation of much of the open ecosystem.',
      fr: 'Le best-seller open-weight, base d’une grande partie de l’écosystème.'
    },
    tags: [
      { en: 'versatile', fr: 'polyvalent' },
      { en: 'sliding-window', fr: 'sliding-window' },
    ]
  },
];
export const MODALITY_PILL: Record<Modality, { label: { en: string; fr: string }; bg: string; fg: string }> = {
  text: { label: { en: 'Text', fr: 'Texte' }, bg: 'var(--accent-bg-rgba)', fg: 'var(--accent)' },
  text2img: { label: { en: 'Text → Image', fr: 'Texte → Image' }, bg: 'rgba(236,72,153,0.14)', fg: '#ec4899' },
  vision: { label: { en: 'Image+Text → Text', fr: 'Image+Texte → Texte' }, bg: 'rgba(14,165,233,0.14)', fg: '#0ea5e9' },
};

// Taille d'un modèle telle qu'AFFICHÉE. Les presets portent une chaîne française figée (« 2,53 Go »)
// qui s'affichait telle quelle en anglais : on formate donc le nombre d'octets selon la locale.
// Décimal (Go/GB, pas Gio) : c'est ce qu'affichent le Finder et Hugging Face, donc ce que
// l'utilisateur retrouvera ailleurs.
export function fmtModelSize(bytes: number, fr: boolean): string {
  const giga = bytes >= 1e9;
  const v = giga ? bytes / 1e9 : bytes / 1e6;
  const n = giga ? v.toFixed(2) : String(Math.round(v));
  return `${fr ? n.replace('.', ',') : n} ${giga ? (fr ? 'Go' : 'GB') : (fr ? 'Mo' : 'MB')}`;
}

// Auto-pick weight precision from model size × device (VRAM-driven). A model that fits f16 stays f16
// (fastest, best quality); too big → q8 (½ VRAM, near-f16, robust); huge / mobile → q4. Falls back to
// f16/f32 when the model can't be quantized (d or ffn not a multiple of 32). The budget is a rough
// proxy (no VRAM API in WebGPU) — the manual override is there when it guesses wrong.
export function pickAutoPrecision(totalParams: number, supportsQ8: boolean, hasF16: boolean, isMobile: boolean, maxBindBytes: number): 'f32' | 'f16' | 'q8' | 'q4' {
  if (!supportsQ8) return hasF16 ? 'f16' : 'f32';
  // Mobile: q8 as long as it fits (~1 byte/param — a 0.5B is ~0.5 GB, fine on any recent phone).
  // int4 ONLY for models that wouldn't fit: on small models it wrecks quality — confirmed on Qwen
  // 0.5B (absurd refusals, verbatim echo of the previous turn) while the SAME model at q8/f16 is
  // perfectly coherent. int4's job is fitting big models, not shaving bytes off tiny ones.
  if (isMobile) return totalParams <= 1.2e9 ? 'q8' : 'q4';
  // Bureau : **q8 par défaut, plus f16** (2026-08-13). Le décodage lit TOUS les poids à chaque
  // token : il est limité par la BANDE PASSANTE, et le f16 lit deux fois plus d'octets que le q8
  // pour le même calcul. Mesuré en vrai sur Llama 3.2 1B, même question, même machine :
  //     f16 → prefill 220,4 t/s · décodage 21,5 t/s · total 4,61 s
  //     q8  → prefill 221,8 t/s · décodage 32,2 t/s · total 3,81 s
  // Le prefill est IDENTIQUE (il est limité par le calcul, et le GEMM tuilé q8 tient le même débit
  // que le f16), le décodage gagne 50 %, et la VRAM est divisée par deux — donc des modèles plus
  // gros passent. La qualité ne bouge pas : corrélation 0,9999 contre la référence CPU à un token,
  // et les réponses restent correctes. Le f16 ne reste que pour un GPU sans chemin q8.
  const q8GB = totalParams / 1e9;
  const budgetGB = maxBindBytes >= 1e9 ? 5 : 2.5; // large max-binding ≈ capable discrete GPU
  if (q8GB <= budgetGB) return 'q8';
  return 'q4';
}
export const PREC_LABEL: Record<string, string> = { f32: 'f32', f16: 'f16', q8: 'int8', q4: 'int4', q3: 'int3' };

// GGUF `general.architecture` → the tokenizer/template family its VOCABULARY requires. Loading a
// model with a tokenizer from another family feeds out-of-vocab ids → total garbage (Gemma 256k vs
// Qwen 151k vs Llama 128k). We force the right pair from the parsed GGUF so any local model gets its
// own tokenizer. Families that share a vocab and differ only by chat template (qwen2 ↔ deepseek
// distill) are intentionally left to the user's selection.
export const GGUF_ARCH_FAMILY: Partial<Record<string, { archType: ArchType; tokenizerId: string }>> = {
  gemma: { archType: 'gemma', tokenizerId: 'Xenova/gemma-tokenizer' },
  gemma2: { archType: 'gemma', tokenizerId: 'Xenova/gemma-tokenizer' },
  // Gemma 3 : vocab 262k DIFFÉRENT de Gemma 1/2 (ids de tour décalés) → tokenizer dédié.
  gemma3: { archType: 'gemma3', tokenizerId: 'unsloth/gemma-3-270m-it' },
  // SmolLM3 : vocab Llama-like propre au modèle (NoPE côté moteur, cf. ggufParser).
  smollm3: { archType: 'smollm3', tokenizerId: 'HuggingFaceTB/SmolLM3-3B' },
  qwen3: { archType: 'qwen3', tokenizerId: 'Qwen/Qwen3-0.6B' },
  mistral3: { archType: 'mistral3', tokenizerId: 'unsloth/Ministral-3-3B-Instruct-2512' },
  // `llama` MANQUAIT (ajouté 2026-08-13) : un GGUF llama chargé HORS preset — champ « n'importe quel
  // modèle », deeplink ?model=, URL collée — gardait le tokenizer sélectionné dans l'UI (souvent une
  // autre famille) et sortait du charabia sans le moindre avertissement. C'est le cas d'usage central
  // du produit (n'importe quel GGUF du Hub), donc le mapping doit couvrir l'arch la plus répandue.
  // Le dépôt de référence est unsloth/* : les dépôts meta-llama sont GATED (401 sans jeton).
  // ⚠️ L'arch `llama` couvre AUSSI Llama 2 / Mistral 7B / TinyLlama (vocab 32k, template
  // « <s>[INST]… ») : le forçage ne s'applique donc qu'au vocab 128k de Llama 3.x — cf.
  // ggufArchFamilyFor, qui discrimine sur la taille du vocab lue dans les poids.
  llama: { archType: 'llama3', tokenizerId: 'unsloth/Llama-3.2-1B-Instruct' },
};

// Famille à forcer pour un GGUF, en tenant compte du vocab quand l'arch seule ne suffit pas.
// `llama` est ambigu : 128k = Llama 3.x (tokenizer + template header-id), 32k = Llama 2 / Mistral /
// TinyLlama (autre tokenizer, autre template). On ne force que ce dont on est sûr — pour le reste on
// rend `undefined` (la sélection de l'utilisateur est conservée) plutôt que d'imposer un mauvais
// tokenizer, qui produit du charabia silencieux.
export function ggufArchFamilyFor(arch: string, vocabSize?: number | null): { archType: ArchType; tokenizerId: string } | undefined {
	if (arch === 'llama') {
		if (vocabSize && vocabSize >= 100000) return GGUF_ARCH_FAMILY.llama;
		if (vocabSize && vocabSize < 100000) {
			console.warn(`[brimkern] GGUF arch="llama" avec un vocab de ${vocabSize} → famille Llama 2 / Mistral / TinyLlama : pas de tokenizer par défaut pour celle-ci, la sélection actuelle est conservée (une réponse incohérente = mauvais tokenizer).`);
			return undefined;
		}
		return undefined; // vocab inconnu → ne rien imposer
	}
	return GGUF_ARCH_FAMILY[arch];
}
