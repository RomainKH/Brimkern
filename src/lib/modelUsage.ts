"use client";

// Éviction des POIDS de modèles inutilisés — le cache navigateur se remplit vite : chaque modèle
// essayé laisse 150 Mo à 2 Go de plages derrière lui, et rien ne les libérait jamais. Un utilisateur
// curieux dépasse le Go en trois essais (retour Romain 2026-08-13).
//
// Ce qui est purgé : uniquement les POIDS téléchargés (Cache API). Ce qui NE l'est jamais :
//   • les conversations (quelques Ko, et c'est le travail de l'utilisateur) ;
//   • les .brik CONVERTIS localement (IndexedDB) — produits par l'utilisateur, pas re-téléchargeables ;
//   • le modèle actuellement chargé.
//
// La politique est explicite et réglable (jamais / 7 / 30 / 90 jours, défaut 30), et le panneau
// Stockage affiche la date de dernier usage de chaque modèle plus le bilan de la dernière purge :
// supprimer des centaines de Mo en silence serait pire que le problème.

import { BRIK_RANGE_CACHE, GGUF_CACHE, cacheEntries, groupCacheEntries, deleteCacheEntriesFor } from './storage';

const USAGE_KEY = 'brimkern-model-usage';   // { [clé modèle]: timestamp du dernier usage }
const POLICY_KEY = 'brimkern-evict-days';   // '0' = jamais, sinon nombre de jours
const REPORT_KEY = 'brimkern-evict-report'; // bilan de la dernière purge (affiché dans Stockage)
const DAY_MS = 86400000;

export const DEFAULT_EVICT_DAYS = 30;

// La clé d'un modèle = son URL SANS la query de plage (`?__brik=…` ou `&__brik=…`), donc la même
// que les lignes regroupées du panneau Stockage. Un modèle local (fichier importé) n'a pas d'URL :
// il n'entre pas ici.
// ⚠️ Les DEUX séparateurs comptent : source.ts écrit `&__brik=` dès que l'URL du modèle porte déjà
// une query. Ne reconnaître que `?` faisait de chaque plage un « modèle » différent — donc jamais
// daté, donc jamais évincé, pour exactement les modèles dont l'URL vient d'un lien de téléchargement.
export function modelKey(url: string): string {
  const m = /[?&]__brik=/.exec(url || '');
  return m ? (url || '').slice(0, m.index) : (url || '');
}

type UsageMap = Record<string, number>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export function getUsageMap(): UsageMap {
  return readJson<UsageMap>(USAGE_KEY, {});
}

// À appeler quand un modèle est CHARGÉ (pas seulement téléchargé) : c'est l'usage qui compte.
export function markModelUsed(url: string, now = Date.now()): void {
  if (!url) return;
  try {
    const map = getUsageMap();
    map[modelKey(url)] = now;
    localStorage.setItem(USAGE_KEY, JSON.stringify(map));
  } catch { /* stockage indisponible (navigation privée) — l'éviction est simplement inopérante */ }
}

export function getEvictDays(): number {
  const raw = readJson<number | null>(POLICY_KEY, null);
  return typeof raw === 'number' && raw >= 0 ? raw : DEFAULT_EVICT_DAYS;
}

export function setEvictDays(days: number): void {
  try { localStorage.setItem(POLICY_KEY, JSON.stringify(days)); } catch { /* ignore */ }
}

export interface EvictReport { at: number; freedBytes: number; models: string[] }

export function getLastEvictReport(): EvictReport | null {
  return readJson<EvictReport | null>(REPORT_KEY, null);
}

// ── La décision, en fonction PURE (testée : npm run test:evict) ────────────────────────────────
// `keep` = les modèles à conserver quoi qu'il arrive (celui qui est chargé). Un modèle SANS date
// d'usage connue est daté au premier passage plutôt que supprimé : sinon la toute première purge
// après la mise à jour effacerait des modèles téléchargés la veille, faute d'historique.
export interface EvictInput { key: string; bytes: number; lastUsed?: number }
export function pickStaleModels(models: EvictInput[], days: number, now: number, keep: string[] = []): EvictInput[] {
  if (days <= 0) return [];
  const cutoff = now - days * DAY_MS;
  return models.filter((m) => m.lastUsed !== undefined && m.lastUsed < cutoff && !keep.includes(m.key));
}

// Purge effective. Rend le bilan (octets libérés + modèles), et n'écrit un rapport que si quelque
// chose a été supprimé. `keepUrls` : le(s) modèle(s) en cours d'utilisation.
export async function evictStaleModels(keepUrls: string[] = [], now = Date.now()): Promise<EvictReport> {
  const days = getEvictDays();
  const empty: EvictReport = { at: now, freedBytes: 0, models: [] };
  if (days <= 0) return empty;

  const usage = getUsageMap();
  const keep = keepUrls.filter(Boolean).map(modelKey);
  let freedBytes = 0;
  const evicted: string[] = [];
  const seen: UsageMap = {};

  for (const cacheName of [BRIK_RANGE_CACHE, GGUF_CACHE]) {
    const groups = groupCacheEntries(await cacheEntries(cacheName));
    const candidates: EvictInput[] = groups.map((g) => ({ key: g.key, bytes: g.bytes, lastUsed: usage[g.key] }));
    // Premier passage : on DATE les modèles inconnus au lieu de les supprimer.
    for (const c of candidates) if (c.lastUsed === undefined) seen[c.key] = now;
    for (const stale of pickStaleModels(candidates, days, now, keep)) {
      await deleteCacheEntriesFor(cacheName, stale.key);
      freedBytes += stale.bytes;
      evicted.push(stale.key.split('/').pop() || stale.key);
      delete usage[stale.key];
    }
  }

  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify({ ...usage, ...seen }));
    if (evicted.length) {
      const report: EvictReport = { at: now, freedBytes, models: evicted };
      localStorage.setItem(REPORT_KEY, JSON.stringify(report));
      console.info(`[stockage] ${evicted.length} modèle(s) inutilisé(s) depuis ${days} j purgé(s) — ${(freedBytes / 1e6).toFixed(0)} Mo libérés :`, evicted.join(', '));
      return report;
    }
  } catch { /* ignore */ }
  return { at: now, freedBytes, models: evicted };
}
