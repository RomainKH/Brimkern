// Quel modèle pour CETTE machine et CE réseau — fonction pure, testée sans navigateur
// (scripts/test-extension.mjs).
//
// Deux paliers, choisis au banc qualité sur 24 vraies pages Google × 2 passes, réponses lues une à
// une (scripts/e2e/serp-quality.mjs, format 'search', ROADMAP § 30, 2026-11-15) — score = justes +
// ½ partielles, sur 48 :
//   Qwen3.5 2B 46 (0 faux, 5,5 s) · Qwen3.5 4B 46,5 (0 faux, 14 s, 2,7 Go : rien de plus pour ×2,5)
//   Qwen3.5 0.8B 43 (1 faux) · Qwen3 1.7B 42,5 · Qwen3 0.6B Shop 40,5 (2 faux, 2,4 s)
//   LFM2.5 230M ~31 (recopie des titres) : retiré — une réponse fausse n'a rien de sobre.
// Le choix ne sert qu'au PREMIER téléchargement : un modèle déjà en cache est toujours préféré
// (cf. offscreen.ts) — retélécharger un modèle parce que le Wi-Fi est meilleur aujourd'hui n'est
// pas sobre.

export type Tier = 'light' | 'standard';

// `model` : une clé de MODELS (src/sdk/engineCore.ts) ou l'URL d'un GGUF à révision ÉPINGLÉE.
// Octets lus sur le Hub (`curl -sIL … | grep content-length`) : ce qu'on annonce avant le
// téléchargement doit être ce qui va réellement transiter. `label` : le nom affiché au consentement
// et sur la page /extension.
export const TIER_MODELS: Record<Tier, { model: string; label: string; bytes: number }> = {
  light: { model: 'qwen3-0.6b-shop', label: 'Qwen3 0.6B', bytes: 304_464_672 },
  standard: {
    model: 'https://huggingface.co/unsloth/Qwen3.5-2B-GGUF/resolve/f6d5376be1edb4d416d56da11e5397a961aca8ae/Qwen3.5-2B-Q4_K_M.gguf',
    label: 'Qwen3.5 2B',
    bytes: 1_280_835_840,
  },
};
// Mémoire de l'appareil (navigator.deviceMemory, paliers 0,25 … 8) en dessous de laquelle on prend le
// léger : le 2B occupe ~1,3 Go de poids, plus le cache KV, à côté de Chrome et de la page Google.
export const LIGHT_MEMORY_GB = 4;

export interface Probe {
  webgpu: boolean;
  /** Adaptateur logiciel (SwiftShader & co) : le calcul partirait sur le CPU. */
  fallbackAdapter?: boolean;
  /** navigator.deviceMemory — par paliers, plafonné à 8 par la spec. */
  deviceMemoryGB?: number;
  saveData?: boolean;
  downlinkMbps?: number;
  effectiveType?: string;
}

export type Choice =
  | { tier: Tier; reason: 'save-data' | 'slow-network' | 'low-memory' | 'default' }
  | { tier: null; reason: 'no-webgpu' | 'software-gpu' };

export function chooseTier(p: Probe): Choice {
  if (!p.webgpu) return { tier: null, reason: 'no-webgpu' };
  // Un adaptateur de repli exécute WebGPU sur le CPU : une réponse y coûterait des dizaines de
  // secondes à pleine charge — l'inverse de la promesse de sobriété. On le dit au lieu de le faire.
  if (p.fallbackAdapter) return { tier: null, reason: 'software-gpu' };
  if (p.saveData) return { tier: 'light', reason: 'save-data' };
  // Mêmes seuils que le sélecteur de modèle du site (src/lib/useNetworkStatus.ts, `classify`) :
  // le débit estimé prime, la classe effectiveType sert à défaut.
  const slow = p.downlinkMbps != null
    ? p.downlinkMbps < 1.5
    : p.effectiveType === 'slow-2g' || p.effectiveType === '2g';
  if (slow) return { tier: 'light', reason: 'slow-network' };
  if (p.deviceMemoryGB != null && p.deviceMemoryGB <= LIGHT_MEMORY_GB) return { tier: 'light', reason: 'low-memory' };
  return { tier: 'standard', reason: 'default' };
}
// Pas d'estimation de durée de téléchargement : mesuré le 2026-11-14 (extension-google.mjs, profil
// neuf), `downlink` annonçait 1,55 Mbit/s → « environ 1572 s » quand le téléchargement réel a pris
// ~130 s. Une durée fausse d'un facteur 10 fait renoncer ; la taille, elle, est exacte.
