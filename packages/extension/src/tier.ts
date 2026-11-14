// Quel modèle pour CETTE machine et CE réseau — fonction pure, testée sans navigateur
// (scripts/test-extension.mjs).
//
// Deux paliers seulement, tous deux déjà mesurés au banc du SDK (sdk-rag, sdk-dialogue) : un palier
// « fort » n'entrera ici qu'après le banc qualité sur pages de résultats (ROADMAP, extension lot 2).
// Le choix ne sert qu'au PREMIER téléchargement : un modèle déjà en cache est toujours préféré
// (cf. offscreen.ts) — retélécharger 300 Mo parce que le Wi-Fi est meilleur aujourd'hui n'est pas
// sobre.

export type Tier = 'light' | 'standard';

// Clés de MODELS (src/sdk/engineCore.ts) — l'URL est résolue par le SDK, pas recopiée ici. Octets
// lus sur le Hub (`curl -sIL … | grep content-length`, 2026-11-14) : ce qu'on annonce avant le
// téléchargement doit être ce qui va réellement transiter.
export const TIER_MODELS: Record<Tier, { model: string; bytes: number }> = {
  light: { model: 'lfm2.5-230m', bytes: 149_212_720 },
  standard: { model: 'qwen3-0.6b-shop', bytes: 304_464_672 },
};

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
  if (p.deviceMemoryGB != null && p.deviceMemoryGB <= 2) return { tier: 'light', reason: 'low-memory' };
  return { tier: 'standard', reason: 'default' };
}
// Pas d'estimation de durée de téléchargement : mesuré le 2026-11-14 (extension-google.mjs, profil
// neuf), `downlink` annonçait 1,55 Mbit/s → « environ 1572 s » quand le téléchargement réel a pris
// ~130 s. Une durée fausse d'un facteur 10 fait renoncer ; la taille, elle, est exacte.
