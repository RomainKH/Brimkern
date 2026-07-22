"use client";

// Read-only connection sensor for the model picker. Reads the Network Information API
// (navigator.connection: effectiveType / downlink / saveData) plus online/offline, and derives a
// coarse `tier` used to (a) show a connection chip, (b) estimate a per-model download time, and
// (c) nudge toward light models on a poor link. Chromium exposes the API; Firefox/Safari don't —
// there `hasInfo` is false and we degrade to `online`/`unknown` (never block, never guess a speed).
// SSR-safe: the first render matches the static HTML (online, unknown), the real reading is adopted
// in an effect after mount (same no-hydration-mismatch pattern as the theme/locale adopt).

import { useState, useEffect } from 'react';

export type NetTier = 'fast' | 'moderate' | 'slow' | 'offline' | 'unknown';
export type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g';

interface NetworkInformationLike {
  effectiveType?: EffectiveType;
  downlink?: number; // Mbps (spec-rounded, capped ~10)
  rtt?: number; // ms
  saveData?: boolean;
  addEventListener?: (type: 'change', fn: () => void) => void;
  removeEventListener?: (type: 'change', fn: () => void) => void;
}

export interface NetworkStatus {
  online: boolean;
  effectiveType: EffectiveType | null;
  downlinkMbps: number | null;
  saveData: boolean;
  tier: NetTier;
  // Mettre en avant les modèles légers ? (connexion lente / hors-ligne / économiseur de données)
  preferLight: boolean;
  // L'API Network Information est-elle disponible ? (Chromium oui ; Firefox/Safari non → tier limité)
  hasInfo: boolean;
}

const conn = (): NetworkInformationLike | undefined =>
  typeof navigator === 'undefined'
    ? undefined
    : (navigator as Navigator & { connection?: NetworkInformationLike }).connection;

function classify(online: boolean, et: EffectiveType | null, downlink: number | null): NetTier {
  if (!online) return 'offline';
  if (downlink == null && !et) return 'unknown';
  // Le débit estimé, quand présent, est plus granulaire que la classe effectiveType.
  if (downlink != null) {
    if (downlink < 1.5) return 'slow';
    if (downlink < 5) return 'moderate';
    return 'fast';
  }
  if (et === 'slow-2g' || et === '2g') return 'slow';
  if (et === '3g') return 'moderate';
  return 'fast'; // 4g
}

function read(): NetworkStatus {
  const online = typeof navigator === 'undefined' ? true : navigator.onLine !== false;
  const c = conn();
  const et = c?.effectiveType ?? null;
  const downlinkMbps = typeof c?.downlink === 'number' ? c.downlink : null;
  const saveData = !!c?.saveData;
  const tier = classify(online, et, downlinkMbps);
  return {
    online,
    effectiveType: et,
    downlinkMbps,
    saveData,
    tier,
    preferLight: tier === 'slow' || tier === 'offline' || saveData,
    hasInfo: !!c && (et != null || downlinkMbps != null || 'saveData' in c),
  };
}

// Valeur SSR / premier rendu : neutre, jamais "lent" (sinon on masquerait des modèles à tort avant
// d'avoir mesuré). L'état réel est lu après montage.
const INITIAL: NetworkStatus = {
  online: true,
  effectiveType: null,
  downlinkMbps: null,
  saveData: false,
  tier: 'unknown',
  preferLight: false,
  hasInfo: false,
};

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(INITIAL);

  useEffect(() => {
    const update = () => setStatus(read());
    update(); // lecture initiale après montage
    const c = conn();
    c?.addEventListener?.('change', update);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      c?.removeEventListener?.('change', update);
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return status;
}

// Temps de téléchargement estimé (secondes) pour `bytes` octets sur un lien de `downlinkMbps` Mbps.
// Facteur 0,8 : le débit réel reste sous le downlink annoncé (surcoût TCP/TLS, downlink plafonné par
// la spec). Renvoie null si on n'a pas de débit (pas d'API) — l'UI n'affiche alors aucune estimation.
export function estimateDownloadSeconds(bytes: number, downlinkMbps: number | null): number | null {
  if (!downlinkMbps || downlinkMbps <= 0 || !bytes) return null;
  const effectiveMbps = downlinkMbps * 0.8;
  return (bytes * 8) / (effectiveMbps * 1e6);
}

// Durée compacte, unités communes FR/EN (« s », « min », « h »).
export function formatDuration(seconds: number): string {
  if (seconds < 1) return '< 1 s';
  if (seconds < 60) return `${Math.round(seconds)} s`;
  const min = seconds / 60;
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h} h ${m}` : `${h} h`;
}
