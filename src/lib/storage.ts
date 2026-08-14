// Storage accounting for the "Stockage" panel: measures + clears the four places Brimkern persists
// data — the two Cache API buckets (downloaded GGUFs, streamed .brik tensor ranges), the converted
// BRIK packages (IndexedDB, see brikCache), and the chat history (IndexedDB, see chatStore). All
// browser-only; every function is called from client handlers.

import { listConversations } from './chatStore';

// The Cache API buckets Brimkern owns (names defined where they're written).
export const GGUF_CACHE = 'brimkern-model-cache'; // raw GGUF downloads (fetchWithCacheAndProgress)
export const BRIK_RANGE_CACHE = 'brik-range-v1';  // streamed .brik tensor ranges (webgpu/source.ts)

export interface Usage { count: number; bytes: number; }

// Sum the size of a Cache API bucket. Prefers the Content-Length header (cheap); falls back to
// reading the blob only when it's missing (older entries). Returns 0/0 if the cache is absent.
export async function cacheUsage(name: string): Promise<Usage> {
	try {
		const cache = await caches.open(name);
		const keys = await cache.keys();
		let bytes = 0;
		for (const req of keys) {
			const resp = await cache.match(req);
			if (!resp) continue;
			const cl = resp.headers.get('content-length');
			if (cl) bytes += parseInt(cl, 10);
			else { try { bytes += (await resp.blob()).size; } catch { /* unreadable entry */ } }
		}
		return { count: keys.length, bytes };
	} catch { return { count: 0, bytes: 0 }; }
}

// Delete an entire Cache API bucket (all entries).
export async function clearCache(name: string): Promise<void> {
	try { await caches.delete(name); } catch { /* ignore */ }
}

export interface CacheEntry { url: string; bytes: number }

// Per-entry breakdown of a Cache API bucket (URL + size), for the expandable detail in the storage
// panel. Largest first. Range-cache entries (streamed .brik) share a base URL, so we keep them raw.
export async function cacheEntries(name: string): Promise<CacheEntry[]> {
	try {
		const cache = await caches.open(name);
		const out: CacheEntry[] = [];
		for (const req of await cache.keys()) {
			const resp = await cache.match(req);
			let bytes = 0;
			if (resp) {
				const cl = resp.headers.get('content-length');
				if (cl) bytes = parseInt(cl, 10);
				else { try { bytes = (await resp.blob()).size; } catch { /* unreadable */ } }
			}
			out.push({ url: req.url, bytes });
		}
		return out.sort((a, b) => b.bytes - a.bytes);
	} catch { return []; }
}

// Une entrée du panneau Stockage, REGROUPÉE par modèle.
export interface CacheGroup { key: string; label: string; bytes: number; parts: number }

// Le cache par plages contient une entrée PAR PLAGE HTTP : un seul modèle streamé y occupe des
// centaines de lignes du genre « lfm25-230m-q4.brik?__brik=52351536-54317615 · 1,9 Mo ». Illisible,
// et impossible d'y voir ce qu'un modèle pèse vraiment (retour Romain). On regroupe donc par FICHIER
// source — la clé de plage est `<url>?__brik=<début>-<fin>`, on coupe sur `?__brik=` — en sommant les
// octets et en comptant les morceaux. Les entrées hors plages (GGUF plein-fichier) restent seules,
// ce qui donne une liste homogène : une ligne = un modèle.
export function groupCacheEntries(entries: CacheEntry[]): CacheGroup[] {
	const byModel = new Map<string, CacheGroup>();
	for (const e of entries) {
		const key = stripRangeQuery(e.url);
		let g = byModel.get(key);
		if (!g) {
			// Nom de fichier lisible (dernier segment de chemin, sans query), repli sur l'URL entière.
			const label = decodeURIComponent(key.split('/').pop() || key);
			byModel.set(key, (g = { key, label, bytes: 0, parts: 0 }));
		}
		g.bytes += e.bytes;
		g.parts += 1;
	}
	return [...byModel.values()].sort((a, b) => b.bytes - a.bytes);
}

// ── PLAGES REDONDANTES ─────────────────────────────────────────────────────────────────────────
// Le panneau Stockage a rendu visible un vrai défaut le 2026-08-13 : 239,4 Mo en cache pour un
// fichier de 149 Mo. Aucun doublon EXACT — des plages qui se CHEVAUCHENT, la signature d'un plan de
// découpage qui a changé entre deux versions du code. Le chargeur d'aujourd'hui demande un span par
// couche ; les résidus d'un plan par-tenseur restent en cache, ne resserviront jamais, et comptent
// dans le quota du navigateur (celui-là même qui décide si un modèle peut être gardé).
//
// La règle est volontairement CONSERVATRICE : on ne supprime que les plages STRICTEMENT INCLUSES
// dans une autre plage du même fichier. Tout ce qu'elles contiennent est déjà servi par la plage
// englobante, donc leur suppression ne peut jamais provoquer un re-téléchargement de bytes qu'on
// possède encore. Les plages qui se chevauchent PARTIELLEMENT sont laissées : on ne peut pas prouver
// qu'elles sont mortes, et un faux positif ferait re-télécharger des mégaoctets.
//
// Fonction PURE (aucun accès au cache) pour être testable sans navigateur — cf. npm run test:ranges.
export interface RangeKey { url: string; start: number; end: number }

// ⚠️ Le séparateur peut être `?` OU `&` : source.ts écrit `?__brik=` sur une URL nue mais
// `&__brik=` dès que l'URL porte déjà une query (`…/resolve/main/x.brik?download=true`, une forme
// courante côté Hugging Face). Tout le code qui ne cherchait que `?__brik=` traitait alors chaque
// PLAGE comme un modèle distinct : le panneau Stockage réaffichait des centaines de lignes et
// l'éviction ne reconnaissait plus le modèle. D'où ce découpage unique, partagé.
const RANGE_MARK = /[?&]__brik=/;

/** L'URL du FICHIER derrière une clé de cache (la clé elle-même si ce n'est pas une plage). */
export function stripRangeQuery(url: string): string {
  const m = RANGE_MARK.exec(url);
  return m ? url.slice(0, m.index) : url;
}

/** Découpe une clé de plage `<url>[?&]__brik=<début>-<fin>`, ou null si ce n'en est pas une. */
export function parseRangeKey(url: string): RangeKey | null {
  const m0 = RANGE_MARK.exec(url);
  if (!m0) return null;
  const i = m0.index;
  const m = /^(\d+)-(\d+)$/.exec(url.slice(i + m0[0].length));
  if (!m) return null;
  const start = Number(m[1]), end = Number(m[2]);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return { url: url.slice(0, i), start, end };
}

/**
 * Parmi des clés de cache, celles à supprimer : une plage strictement incluse dans une autre plage
 * du MÊME fichier. « Strictement » = bornes distinctes d'au moins un côté — deux clés identiques
 * n'existent pas dans un cache (la seconde écrase la première), donc aucune inclusion mutuelle.
 */
export function redundantRangeKeys(urls: string[]): string[] {
  const byFile = new Map<string, { key: string; start: number; end: number }[]>();
  for (const u of urls) {
    const r = parseRangeKey(u);
    if (!r) continue; // entrée plein-fichier : jamais concernée
    let g = byFile.get(r.url);
    if (!g) byFile.set(r.url, (g = []));
    g.push({ key: u, start: r.start, end: r.end });
  }
  const out: string[] = [];
  for (const ranges of byFile.values()) {
    // Tri par début croissant, puis par fin DÉCROISSANTE : la plage englobante passe avant celles
    // qu'elle contient, ce qui suffit à décider en un seul balayage (`maxEnd` du préfixe).
    const sorted = [...ranges].sort((a, b) => a.start - b.start || b.end - a.end);
    let maxEnd = -1;
    for (const r of sorted) {
      // Incluse dans une plage DÉJÀ vue (qui commence avant ou au même point et finit au moins
      // aussi loin) → morte. `maxEnd` porte la meilleure couverture rencontrée jusqu'ici.
      if (r.end <= maxEnd) out.push(r.key);
      else maxEnd = r.end;
    }
  }
  return out;
}

/** Applique `redundantRangeKeys` au cache par plages. Rend le nombre d'entrées et les octets libérés. */
export async function pruneRedundantRanges(): Promise<{ removed: number; freed: number }> {
  try {
    const cache = await caches.open(BRIK_RANGE_CACHE);
    const keys = await cache.keys();
    const dead = new Set(redundantRangeKeys(keys.map((r) => r.url)));
    if (!dead.size) return { removed: 0, freed: 0 };
    let removed = 0, freed = 0;
    for (const req of keys) {
      if (!dead.has(req.url)) continue;
      // Taille lue AVANT suppression (Content-Length posé à l'écriture par source.ts).
      const hit = await cache.match(req);
      const n = Number(hit?.headers.get('content-length') || 0);
      if (await cache.delete(req)) { removed++; freed += Number.isFinite(n) ? n : 0; }
    }
    return { removed, freed };
  } catch { return { removed: 0, freed: 0 }; }
}

// Supprime toutes les entrées d'un modèle dans un cache (toutes ses plages), sans toucher au reste.
export async function deleteCacheEntriesFor(cacheName: string, keyPrefix: string): Promise<number> {
	try {
		const cache = await caches.open(cacheName);
		const keys = await cache.keys();
		let n = 0;
		for (const req of keys) {
			// `?__brik=` ET `&__brik=` (cf. RANGE_MARK) : sans le second, « supprimer ce modèle » ne
			// touchait AUCUNE plage d'un modèle dont l'URL porte déjà une query.
			if (req.url === keyPrefix || stripRangeQuery(req.url) === keyPrefix) {
				if (await cache.delete(req)) n++;
			}
		}
		return n;
	} catch { return 0; }
}

// The set of model source URLs whose bytes are already cached locally (downloaded GGUFs + streamed
// BRIK ranges) — so the picker can flag "en cache" and a reopened chat can auto-reload without a
// network fetch. Returns request URLs (full strings) across both model caches.
export async function cachedModelUrls(): Promise<Set<string>> {
	const out = new Set<string>();
	for (const name of [GGUF_CACHE, BRIK_RANGE_CACHE]) {
		try {
			const cache = await caches.open(name);
			for (const req of await cache.keys()) out.add(req.url);
		} catch { /* bucket absent */ }
	}
	return out;
}

// Friendly labels for the Cache API buckets we know; anything else (e.g. transformers.js's own
// tokenizer/model cache) is listed under its raw name so nothing is invisible in the total.
// Fabrique (t) => {...} — convention i18n : module lib sans hook, le composant passe son useT().
const CACHE_LABELS = (t: (en: string, fr: string) => string): Record<string, string> => ({
	// Le bucket par plages sert aussi les GGUF depuis qu'ils se chargent en streaming (2026-08-13) ;
	// GGUF_CACHE ne garde plus que les copies plein-fichier héritées ou les hôtes sans Range.
	[BRIK_RANGE_CACHE]: t('Streamed models (BRIK / GGUF)', 'Modèles streamés (BRIK / GGUF)'),
	[GGUF_CACHE]: t('GGUFs downloaded whole', 'GGUF téléchargés en entier'),
	'transformers-cache': t('Tokenizers / Hugging Face files', 'Tokenizers / fichiers Hugging Face'),
});

export interface NamedUsage extends Usage { name: string; label: string; }

// Every Cache API bucket the origin holds, with its size — so the panel accounts for ALL cache
// storage (incl. transformers.js's tokenizer cache), not just Brimkern's own. Largest first.
export async function allCaches(t: (en: string, fr: string) => string = (en) => en): Promise<NamedUsage[]> {
	try {
		const labels = CACHE_LABELS(t);
		const names = await caches.keys();
		const out: NamedUsage[] = [];
		for (const name of names) {
			const u = await cacheUsage(name);
			out.push({ name, label: labels[name] ?? name, count: u.count, bytes: u.bytes });
		}
		return out.sort((a, b) => b.bytes - a.bytes);
	} catch { return []; }
}

// Chat history footprint: number of conversations + approximate bytes (JSON length ≈ bytes for the
// mostly-ASCII content; cheap, no extra reads).
export async function historyUsage(): Promise<Usage> {
	try {
		const cs = await listConversations();
		return { count: cs.length, bytes: cs.reduce((a, c) => a + JSON.stringify(c).length, 0) };
	} catch { return { count: 0, bytes: 0 }; }
}

// Browser's overall persistent-storage estimate (used / quota), or null if the API is unavailable.
export async function storageEstimate(): Promise<{ usage: number; quota: number } | null> {
	try {
		if (navigator.storage?.estimate) {
			const e = await navigator.storage.estimate();
			return { usage: e.usage ?? 0, quota: e.quota ?? 0 };
		}
	} catch { /* ignore */ }
	return null;
}

// Le stockage de l'origine est-il PERSISTANT ? (exempté d'éviction automatique par le navigateur —
// sans ça, un cache multi-Go peut être purgé sous pression disque et le modèle se re-télécharge).
export async function isStoragePersisted(): Promise<boolean> {
	try { return (await navigator.storage?.persisted?.()) ?? false; } catch { return false; }
}

// Demande la persistance (idempotent). Chrome l'accorde selon l'engagement de l'utilisateur (PWA
// installée, favori, usage) ; peut donc renvoyer false sans erreur. Retourne l'état effectif.
// ⚠️ N'EST PAS une action utilisateur. Chrome n'affiche aucune demande : il accorde (ou non) la
// persistance selon l'engagement réel avec le site — favori, app installée, notifications acceptées,
// historique d'usage. Un appel explicite renvoie donc presque toujours `false` sans rien changer :
// c'est pourquoi il n'y a PLUS de bouton « Garder sur l'appareil » (il ne faisait rien de visible,
// retour Romain). On l'appelle une fois en silence au montage — si le navigateur veut bien, tant
// mieux ; sinon l'UI se contente d'INFORMER que le cache peut être évincé.
export async function requestPersistentStorage(): Promise<boolean> {
	try { return (await navigator.storage?.persist?.()) ?? false; } catch { return false; }
}
