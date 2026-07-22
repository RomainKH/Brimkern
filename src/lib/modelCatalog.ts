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
	taesd: 'https://huggingface.co/madebyollin/taesd/resolve/main/taesd_decoder.safetensors',
};
export const IMAGE_BRIK = {
  sdturbo: { unet: `${IMAGE_BRIK_BASE}/sd-turbo-unet-q8.brik`, clip: `${IMAGE_BRIK_BASE}/sd-turbo-clip-q8.brik` },
  // SDXS-512 mobile : UNet light (int4, 205 Mo) + CLIP allégé (int4, 235 Mo) = ~445 Mo tout compris.
  // Validé visuellement le 2026-07-16 (harnais Chrome : image quasi identique au stack q8 716 Mo,
  // écart eps moyen ~2 %). Le q8 reste dispo via ?imgtier=q8 si un GPU mobile bronche.
  sdxs: { unet: `${IMAGE_BRIK_BASE}/sdxs-unet-light.brik`, clip: `${IMAGE_BRIK_BASE}/sd-turbo-clip-mixed.brik` },
};

// Normalize a model name/filename for loose matching (the active model name loses its .gguf and gets
// cleaned when auto-converted to BRIK, so an exact === against the preset URL filename misses).
export const normModelName = (s: string) => (s || '').toLowerCase().replace(/\.(gguf|brik)$/i, '').replace(/[^a-z0-9]/g, '');

// Roadmap teasers shown (greyed, non-clickable) in the browse grid — known models across modalities,
// to signal where Brimkern is heading. `modality` drives the colored pill.
export type Modality = 'text' | 'text2img' | 'vision';
export const COMING_SOON: { vendor: string; name: string; params: string; modality: Modality; desc: string; tags: string[] }[] = [
  { vendor: 'Microsoft', name: 'Phi-3.5-mini', params: '~3.8B', modality: 'text', desc: 'Compact et excellent en raisonnement. Adaptation en cours (QKV/FFN fusionnés).', tags: ['raisonnement', 'compact'] },
  { vendor: 'Mistral AI', name: 'Mistral 7B Instruct', params: '~7B', modality: 'text', desc: 'Le best-seller open-weight, base d’une grande partie de l’écosystème.', tags: ['polyvalent', 'sliding-window'] },
  { vendor: 'Stability AI', name: 'Stable Diffusion Turbo', params: 'SD', modality: 'text2img', desc: 'Génération d’images depuis du texte — poids BRIK pré-quantifiés streamés (~1,3 Go au lieu de 2,4). Sur mobile, la tuile charge SDXS-512 distillé (~720 Mo, 1 step).', tags: ['diffusion', 'BRIK q8'] },
  { vendor: 'Alibaba', name: 'Qwen2-VL 2B', params: '~2B', modality: 'vision', desc: 'Décrit / interroge une image (image + texte → texte). Encodeur visuel à porter.', tags: ['multimodal', 'OCR'] },
];
export const MODALITY_PILL: Record<Modality, { label: string; bg: string; fg: string }> = {
  text: { label: 'Texte', bg: 'var(--accent-bg-rgba)', fg: 'var(--accent)' },
  text2img: { label: 'Texte → Image', bg: 'rgba(236,72,153,0.14)', fg: '#ec4899' },
  vision: { label: 'Image+Texte → Texte', bg: 'rgba(14,165,233,0.14)', fg: '#0ea5e9' },
};

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
  const f16GB = (totalParams * 2) / 1e9;
  const budgetGB = maxBindBytes >= 1e9 ? 5 : 2.5; // large max-binding ≈ capable discrete GPU
  if (f16GB <= budgetGB) return 'f16';
  if (f16GB / 2 <= budgetGB) return 'q8';
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
  qwen3: { archType: 'qwen3', tokenizerId: 'Qwen/Qwen3-0.6B' },
  mistral3: { archType: 'mistral3', tokenizerId: 'unsloth/Ministral-3-3B-Instruct-2512' },
};
