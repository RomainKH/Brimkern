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
		const key = e.url.split('?__brik=')[0];
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

// Supprime toutes les entrées d'un modèle dans un cache (toutes ses plages), sans toucher au reste.
export async function deleteCacheEntriesFor(cacheName: string, keyPrefix: string): Promise<number> {
	try {
		const cache = await caches.open(cacheName);
		const keys = await cache.keys();
		let n = 0;
		for (const req of keys) {
			if (req.url === keyPrefix || req.url.startsWith(`${keyPrefix}?__brik=`)) {
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
