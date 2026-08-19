// Text→image generator interface for the chat.
//
// The chat only ever calls `ImageGenerator.generate(prompt, onProgress, …)` — it doesn't care what
// pipeline is behind it (today: the real SD-Turbo in sdturbo.ts). Keeping the interface in its own
// module lets page.tsx type against it without pulling the heavy diffusion code into the bundle
// (the pipeline itself is lazy-imported). See docs/image-gen-feasibility.md.

// `url` = full PNG (kept in memory). `thumb` = tiny blurred preview (persisted instead of the full
// image → storage stays small). `seed` lets us regenerate the EXACT same image on demand (click-to-
// reveal), so the conversation never has to store the heavy pixels. See ChatMessages reveal flow.
import type { OnProgress } from '../progress';

export interface ImageResult { url: string; w: number; h: number; thumb: string; seed: number; full?: string }
export type ImageRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3';
export type ImageQuality = 'draft' | 'fast' | 'standard' | 'plus' | 'hd' | 'fhd';

export interface ImageDimension {
  w: number;
  h: number;
  latentW: number;
  latentH: number;
}

export type LatentDim = number | { h: number; w: number };

// ⚠️ CONTRAINTE DURE : latentW et latentH doivent être des MULTIPLES DE 8 (donc w/h multiples de 64).
// Le UNet descend trois fois en stride 2 (ceil(H/2)) puis remonte en doublant (H*2) : sur un côté
// impair à un niveau donné, la remontée retombe un pixel à côté et le concat du skip lit hors du
// buffer — WebGPU clampe la lecture, donc AUCUNE erreur, juste des canaux décalés et une image
// silencieusement dégradée. Huit cellules de cette table violaient la règle (3:2/2:3 fast·hd·fhd,
// 4:3/3:4 fhd) ; vérifié par `npm run test:imagedims`, qui simule la propagation H/W du forward.
//
// Résolutions adaptatives calibrées :
// - draft : ~256px (ultra-rapide, économie VRAM)
// - fast : ~384px (équilibre rapidité / finesse)
// - standard : 512px (résolution native standard SD 1.5 / SDXS)
// - plus : ~640px (grand format équilibré)
// - hd : 1024px (résolution native SDXL / PixArt ou grand écran)
// - fhd : Full HD / 2K (~1920px)
export const IMAGE_DIMENSIONS: Record<ImageRatio, Record<ImageQuality, ImageDimension>> = {
  '1:1': {
    draft: { w: 256, h: 256, latentW: 32, latentH: 32 },
    fast: { w: 384, h: 384, latentW: 48, latentH: 48 },
    standard: { w: 512, h: 512, latentW: 64, latentH: 64 },
    plus: { w: 576, h: 576, latentW: 72, latentH: 72 },
    hd: { w: 1024, h: 1024, latentW: 128, latentH: 128 },
    fhd: { w: 1536, h: 1536, latentW: 192, latentH: 192 },
  },
  // 16:9 « draft » est en 448×256 (1,75) et non 384×256 : ce dernier vaut 1,50, c'est-à-dire
  // exactement le 3:2 d'à côté — choisir « paysage 16:9 » rendait un 3:2.
  '16:9': {
    draft: { w: 448, h: 256, latentW: 56, latentH: 32 },
    fast: { w: 512, h: 320, latentW: 64, latentH: 40 },
    standard: { w: 640, h: 384, latentW: 80, latentH: 48 },
    plus: { w: 704, h: 384, latentW: 88, latentH: 48 },
    hd: { w: 1024, h: 576, latentW: 128, latentH: 72 },
    fhd: { w: 1920, h: 1088, latentW: 240, latentH: 136 },
  },
  '9:16': {
    draft: { w: 256, h: 448, latentW: 32, latentH: 56 },
    fast: { w: 320, h: 512, latentW: 40, latentH: 64 },
    standard: { w: 384, h: 640, latentW: 48, latentH: 80 },
    plus: { w: 384, h: 704, latentW: 48, latentH: 88 },
    hd: { w: 576, h: 1024, latentW: 72, latentH: 128 },
    fhd: { w: 1088, h: 1920, latentW: 136, latentH: 240 },
  },
  '4:3': {
    draft: { w: 320, h: 256, latentW: 40, latentH: 32 },
    fast: { w: 448, h: 320, latentW: 56, latentH: 40 },
    standard: { w: 576, h: 448, latentW: 72, latentH: 56 },
    plus: { w: 640, h: 448, latentW: 80, latentH: 56 },
    hd: { w: 1024, h: 768, latentW: 128, latentH: 96 },
    fhd: { w: 1472, h: 1088, latentW: 184, latentH: 136 },
  },
  '3:4': {
    draft: { w: 256, h: 320, latentW: 32, latentH: 40 },
    fast: { w: 320, h: 448, latentW: 40, latentH: 56 },
    standard: { w: 448, h: 576, latentW: 56, latentH: 72 },
    plus: { w: 448, h: 640, latentW: 56, latentH: 80 },
    hd: { w: 768, h: 1024, latentW: 96, latentH: 128 },
    fhd: { w: 1088, h: 1472, latentW: 136, latentH: 184 },
  },
  // 3:2 « fast » vise 576×384 et non ~480×320 : sur la grille des multiples de 64, les deux voisins
  // de 480 (448 et 512) donnent 1,40 et 1,60 — soit exactement les cellules de 4:3 et de 16:9 à la
  // même qualité. 576×384 est le plus petit 3:2 EXACT au-dessus de 384px : choisir un format ne doit
  // pas rendre une autre image que celle du format d'à côté.
  '3:2': {
    draft: { w: 384, h: 256, latentW: 48, latentH: 32 },
    fast: { w: 576, h: 384, latentW: 72, latentH: 48 },
    standard: { w: 640, h: 448, latentW: 80, latentH: 56 },
    plus: { w: 704, h: 448, latentW: 88, latentH: 56 },
    hd: { w: 1024, h: 704, latentW: 128, latentH: 88 },
    fhd: { w: 1600, h: 1088, latentW: 200, latentH: 136 },
  },
  '2:3': {
    draft: { w: 256, h: 384, latentW: 32, latentH: 48 },
    fast: { w: 384, h: 576, latentW: 48, latentH: 72 },
    standard: { w: 448, h: 640, latentW: 56, latentH: 80 },
    plus: { w: 448, h: 704, latentW: 56, latentH: 88 },
    hd: { w: 704, h: 1024, latentW: 88, latentH: 128 },
    fhd: { w: 1088, h: 1600, latentW: 136, latentH: 200 },
  },
};

export function getImageDimension(ratio: ImageRatio, quality: ImageQuality): ImageDimension {
  return IMAGE_DIMENSIONS[ratio]?.[quality] ?? IMAGE_DIMENSIONS['1:1'].standard;
}

// Ordre croissant des résolutions — sert au plafond machine (planImage).
const QUALITY_ORDER: ImageQuality[] = ['draft', 'fast', 'standard', 'plus', 'hd', 'fhd'];

// Ce que le pipeline va RÉELLEMENT produire, agrandissement compris.
export interface ImagePlan {
  w: number;              // largeur FINALE du PNG rendu
  h: number;              // hauteur FINALE
  latentW: number;        // ce qui part dans le UNet
  latentH: number;
  upscale: 1 | 2;         // agrandissement GPU appliqué après décodage
  quality: ImageQuality;  // résolution réellement retenue (peut être rabattue)
}

/**
 * Traduit un choix (format, résolution) en plan d'exécution — SOURCE UNIQUE pour la génération ET
 * pour les libellés de l'interface.
 *
 * Deux rabattages, dans cet ordre :
 *  1. `ceiling` = plafond de la machine. Sur mobile / petit GPU, 512² fait un pic VRAM que l'OS
 *     traite en reprenant le GPU au milieu de la génération (blocage silencieux, retour terrain) —
 *     le plafond s'applique donc AVANT tout, et rabattre ici n'entraîne aucun agrandissement.
 *  2. Modèle natif 512 (SD-Turbo, SDXS) : il ne SAIT pas composer en 1024, donc hd/fhd se rendent
 *     en `standard` puis ×2 sur GPU. C'est un agrandissement propre, pas un rendu natif — et
 *     l'interface doit annoncer la taille de sortie VRAIE : le sélecteur promettait 1920×1088 et
 *     livrait 1280×768 (relevé du 2026-08-19), parce que les libellés lisaient la table brute.
 */
export function planImage(
  ratio: ImageRatio,
  quality: ImageQuality,
  opts: { nativeHighRes?: boolean; ceiling?: ImageQuality } = {},
): ImagePlan {
  let q = quality;
  if (opts.ceiling && QUALITY_ORDER.indexOf(q) > QUALITY_ORDER.indexOf(opts.ceiling)) q = opts.ceiling;
  let upscale: 1 | 2 = 1;
  if (!opts.nativeHighRes && (q === 'hd' || q === 'fhd')) { upscale = 2; q = 'standard'; }
  const d = getImageDimension(ratio, q);
  return { w: d.w * upscale, h: d.h * upscale, latentW: d.latentW, latentH: d.latentH, upscale, quality: q };
}

// Un générateur sait-il composer nativement au-delà de sa résolution d'entraînement ? (SDXL /
// PixArt le sauraient ; SD-Turbo et SDXS non.) Sur `undefined`, la réponse est NON : c'est le cas
// des pipelines actuels, et le chemin haute résolution doit passer par l'agrandissement.
export function isNativeHighRes(gen?: { supportsHighRes?: boolean; modelFamily?: string } | null): boolean {
  return !!gen?.supportsHighRes || gen?.modelFamily === 'sdxl' || gen?.modelFamily === 'pixart';
}

export interface ImageGenerator {
  name: string;
  placeholder: boolean;
  // Famille de topologie : décide du chemin haute résolution (cf. isNativeHighRes). Non renseignée
  // par les pipelines SD-Turbo/SDXS actuels → traités comme natifs 512.
  modelFamily?: 'sd' | 'sdxs' | 'sdxl' | 'pixart';
  supportsHighRes?: boolean;
  generate: (prompt: string, onProgress?: OnProgress, seed?: number, latentSize?: LatentDim, duty?: number) => Promise<ImageResult>;
  // Vrai img2img : repart des PIXELS de `initUrl` (blob/data URL d'une image générée), encodés en
  // latent (TAESD encodeur, ~5 Mo chargés à la 1re utilisation) puis re-bruités à σ(strength) —
  // strength ∈ (0,1] : 0.3 = retouche légère, 0.55 = affinage, 1 = ignore la source. La taille de
  // sortie suit la source (pas le sélecteur de qualité). Optionnel : absent sur un vieux générateur.
  generateImg2Img?: (prompt: string, initUrl: string, strength: number, onProgress?: OnProgress, seed?: number, duty?: number) => Promise<ImageResult>;
  // L'engine du pipeline, exposé pour le PROFILEUR (?gpuprofile=1) : sans lui, __gpuProfile ne
  // lisait que l'engine du LLM et rendait « aucun modèle chargé » en mode image, alors que le GPU
  // travaillait. Même exposition qu'en vidéo et en vision.
  engine?: import('../kernels').WebGpuEngine;
  // Free the pipeline's GPU resources (device destroy — ~1 GB of resident weights). MUST be called
  // when leaving image mode (unload, or loading an LLM over it); the generator is dead afterwards.
  dispose?: () => void;
}

// Vignette persistée d'une image : 48 px sur le GRAND côté, l'autre au prorata. Les deux producteurs
// (génération et agrandissement) forçaient un carré 48×48, donc toute image non carrée était
// persistée déformée — et c'est cette vignette que la conversation restaurée affiche, floutée, sous
// le bouton « révéler » : un 16:9 y apparaissait en carré étiré. Une seule fonction pour que la règle
// ne puisse pas diverger entre les deux chemins.
export const THUMB_SIDE = 48;

export function thumbSize(w: number, h: number): { tw: number; th: number } {
	const k = THUMB_SIDE / Math.max(w, h, 1);
	return { tw: Math.max(1, Math.round(w * k)), th: Math.max(1, Math.round(h * k)) };
}
