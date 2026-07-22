"use client";

// Streaming TensorSource for single-file .brik models served over HTTP. Instead of downloading the
// whole file up front, it fetches the small header (manifest) first — so the UI/profile appear
// instantly — then range-fetches each tensor on demand during the forward pass, caching every range
// in the Cache API so repeat loads are instant and offline-capable. Falls back to a single full
// download if the host doesn't honour Range requests.

import { coalescedSpan, type TensorSource } from './model';
import { parseBrik, parseBrikHeader } from '../brik/container';
import { brikToGgufManifest, computeShardBases, type GgufManifest } from '../brik/loader';
import type { BrikManifest, BrikTensorEntry } from '../brik/format';

const CACHE_NAME = 'brik-range-v1';

// Cache key for a byte range. A query string (not a #fragment — those are stripped by the Cache
// API) keeps each range distinct under the same origin URL.
function rangeKey(url: string, offset: number, end: number): string {
	return `${url}${url.includes('?') ? '&' : '?'}__brik=${offset}-${end}`;
}

async function openCache(): Promise<Cache | null> {
	try { return await caches.open(CACHE_NAME); } catch { return null; }
}

// Fetch [offset, offset+length) via a Range request, served from the Cache API when present. Returns
// { bytes, ranged } — `ranged` is false when the server ignored Range and sent the whole body.
// `signal` (préchargement) : annulation immédiate, y compris en plein milieu d'une plage.
async function fetchRange(url: string, offset: number, length: number, signal?: AbortSignal): Promise<{ bytes: Uint8Array; ranged: boolean }> {
	const end = offset + length - 1;
	const cache = await openCache();
	const key = rangeKey(url, offset, end);
	if (cache) {
		const hit = await cache.match(key);
		if (hit) return { bytes: new Uint8Array(await hit.arrayBuffer()), ranged: true };
	}
	// Retry with backoff: on mobile the network blips and the tab is suspended on sleep, which aborts
	// an in-flight fetch ("Failed to fetch"). Each completed range is cached, so retrying (or simply
	// reloading) RESUMES — only the not-yet-cached ranges re-download. We retry the whole fetch+read.
	let lastErr: unknown;
	for (let attempt = 0; attempt < 4; attempt++) {
		try {
			const resp = await fetch(url, { headers: { Range: `bytes=${offset}-${end}` }, signal });
			if (!resp.ok && resp.status !== 206) throw new Error(`range fetch ${offset}-${end} échoué : HTTP ${resp.status}`);
			const ranged = resp.status === 206;
			const body = new Uint8Array(await resp.arrayBuffer());
			const bytes = ranged ? body : body.subarray(offset, offset + length);
			// Store with an explicit Content-Length so the storage panel can sum cache size from headers.
			if (cache && ranged) { try { await cache.put(key, new Response(bytes, { headers: { 'Content-Length': String(bytes.byteLength) } })); } catch (e) { warnCachePutOnce(e); } }
			return { bytes, ranged };
		} catch (e) {
			if (signal?.aborted) throw e; // annulation volontaire — ne pas retenter
			lastErr = e;
			if (attempt < 3) await new Promise((r) => setTimeout(r, 500 * 2 ** attempt)); // 0.5s, 1s, 2s
		}
	}
	throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

// A TensorSource that range-fetches from `url`, adding `baseOffset` (the .brik data section start)
// to each manifest-relative tensor offset.
// Échec d'écriture du cache (quota plein, mode privé…) : avalé pour ne pas casser le chargement,
// mais signalé UNE fois — sinon « ça retélécharge à chaque fois » sans aucun indice (retour Romain).
let cachePutWarned = false;
function warnCachePutOnce(e: unknown) {
	if (cachePutWarned) return;
	cachePutWarned = true;
	console.warn('[cache] écriture refusée (quota plein ? navigation privée ?) — les téléchargements de modèles ne seront PAS réutilisables à la prochaine visite. Libérez de l\'espace via le panneau Stockage.', e);
}

// Téléchargement complet mis en cache tel quel (bucket plein-fichier) — pour les serveurs SANS
// support Range : l'infra par plages ne cache que les 206, donc ce chemin re-téléchargeait TOUT
// le fichier à chaque ouverture. Lecture cache d'abord, écriture après (signalée si refusée).
const FULL_CACHE = 'brimkern-model-cache';
export async function fetchFullCached(url: string): Promise<Uint8Array> {
	try {
		const c = await caches.open(FULL_CACHE);
		const hit = await c.match(url);
		if (hit) return new Uint8Array(await hit.arrayBuffer());
	} catch { /* Cache API absente */ }
	const resp = await fetch(url);
	if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
	const bytes = new Uint8Array(await resp.arrayBuffer());
	try {
		const c = await caches.open(FULL_CACHE);
		await c.put(url, new Response(bytes.slice() as unknown as BodyInit, { headers: { 'Content-Length': String(bytes.byteLength) } }));
	} catch (e) { warnCachePutOnce(e); }
	return bytes;
}

export function rangeSource(url: string, baseOffset: number): TensorSource {
	return { bytes: async (offset, length) => (await fetchRange(url, baseOffset + offset, length)).bytes };
}

// A TensorSource backed by an in-memory Uint8Array (the no-range fallback).
function bytesSource(data: Uint8Array): TensorSource {
	return { bytes: async (offset, length) => data.subarray(offset, offset + length) };
}

export interface StreamLoadable {
	source: TensorSource;
	manifest: GgufManifest;
	tokenizerId?: string;
	// Embedded tokenizer files (tokenizer.json + tokenizer_config.json) when the .brik bundles them.
	tokenizer?: { kind: string; id?: string; json?: string; config?: string };
	uiArch?: string;
	modelName: string;
}

// Open a single-file .brik by URL for streaming. Reads the header (12 bytes → manifest length →
// manifest), then returns a range-fetching source for the tensor data. If the host doesn't support
// Range, downloads the whole file once and serves it from memory (correct, just not streamed).
export async function loadBrikStream(url: string): Promise<StreamLoadable> {
	const head = await fetchRange(url, 0, 12);
	if (!head.ranged) {
		// No Range support → one full download, parsed in memory — CACHED whole (sinon chaque
		// ouverture re-téléchargeait l'intégralité du fichier).
		const full = await fetchFullCached(url);
		const { manifest, data } = parseBrik(full);
		return loadableFrom(manifest, bytesSource(data));
	}
	const manifestLen = new DataView(head.bytes.buffer, head.bytes.byteOffset, 12).getUint32(8, true);
	const header = await fetchRange(url, 0, 12 + manifestLen);
	const { manifest, dataStart } = parseBrikHeader(header.bytes);
	return loadableFrom(manifest, rangeSource(url, dataStart));
}

function loadableFrom(manifest: ReturnType<typeof parseBrikHeader>['manifest'], source: TensorSource): StreamLoadable {
	// Garde-fou : un BRIK image (UNet/CLIP, clés safetensors) collé dans le champ « BRIK par URL »
	// du chat produirait un manifeste LLM absurde (arch d=0) — refus clair plutôt que du chaos.
	if (manifest.model?.uiArch === 'image') {
		throw new Error('Ce fichier est un BRIK image (UNet/CLIP) — il se charge via la tuile de génération d\'image, pas comme un LLM.');
	}
	return {
		source,
		manifest: brikToGgufManifest(manifest),
		tokenizerId: manifest.tokenizer?.id,
		tokenizer: manifest.tokenizer,
		uiArch: manifest.model?.uiArch,
		modelName: manifest.model.name,
	};
}

// ── Préchargement en arrière-plan ─────────────────────────────────────────────────────────────
// Remplit le cache HTTP avec TOUTES les plages que le chargement streamé demandera, sans rien
// uploader au GPU — pour que le premier « Charger le modèle » soit servi depuis le cache. Les clés
// doivent matcher au octet près : même fetchRange, mêmes spans coalescés par couche (coalescedSpan,
// partagé avec model.ts) et mêmes fetchs par-tenseur hors couche (chemin rawTensor).
// Reprise gratuite : les plages déjà en cache sont recensées d'abord (aucun re-téléchargement).
// Issues : 'done' (tout en cache), 'aborted' (signal), 'unstorable' (pas de Range côté serveur,
// Cache API absente ou quota refusé — inutile de continuer à télécharger dans le vide).

// ── BRIK image (UNet / CLIP pré-quantifiés) ────────────────────────────────────────────────────
// Conteneur BRIK standard mais clés = noms safetensors et shards = une unité réseau (resnet /
// attention / couche CLIP) : le streaming fait UNE plage HTTP par shard (10-40 Mo — le coalescing,
// c'est le shard), cache + reprise hérités de fetchRange. Livre chaque tenseur (bytes bruts + méta)
// au callback, shard par shard — l'appelant uploade au fil de l'eau et peut drainer le staging via
// l'await du callback (les bytes d'un shard sont relâchés avant le suivant).
export async function streamImageBrik(
	url: string,
	onTensor: (name: string, entry: BrikTensorEntry, bytes: Uint8Array) => void,
	onShard?: (done: number, total: number) => Promise<void> | void,
): Promise<BrikManifest> {
	const head = await fetchRange(url, 0, 12);
	let manifest: BrikManifest, dataStart: number, full: Uint8Array | null = null;
	if (!head.ranged) {
		// Pas de Range côté serveur → téléchargement d'un bloc, mis en cache entier (sans quoi
		// chaque ouverture re-téléchargeait tout — pas de reprise, mais au moins la réutilisation).
		full = await fetchFullCached(url);
		({ manifest, dataStart } = parseBrikHeader(full));
	} else {
		const manifestLen = new DataView(head.bytes.buffer, head.bytes.byteOffset, 12).getUint32(8, true);
		const header = await fetchRange(url, 0, 12 + manifestLen);
		({ manifest, dataStart } = parseBrikHeader(header.bytes));
	}
	if (manifest.model?.uiArch !== 'image') {
		throw new Error('Ce BRIK n\'est pas un modèle image (uiArch ≠ image).');
	}
	const bases = computeShardBases(manifest.shards);
	const byShard = new Map<number, [string, BrikTensorEntry][]>();
	for (const [name, t] of Object.entries(manifest.tensors)) {
		let g = byShard.get(t.shard);
		if (!g) byShard.set(t.shard, (g = []));
		g.push([name, t]);
	}
	const shards = [...manifest.shards].sort((a, b) => a.id - b.id);
	let done = 0;
	for (const shard of shards) {
		const off = dataStart + bases[shard.id];
		const bytes = full
			? full.subarray(off, off + shard.byteLength)
			: (await fetchRange(url, off, shard.byteLength)).bytes;
		for (const [name, t] of byShard.get(shard.id) ?? []) {
			onTensor(name, t, bytes.subarray(t.offset, t.offset + t.byteLength));
		}
		await onShard?.(++done, shards.length);
	}
	return manifest;
}

// Un BRIK image est-il INTÉGRALEMENT en cache ? Miroir de brikCacheComplete mais au plan des
// SHARDS (les plages que streamImageBrik demande) — le plan LLM (blk.N.*) ne matcherait aucune
// clé. Gate de l'auto-rechargement du générateur d'image à la reprise : sans lui, revenir sur
// l'app relançait un téléchargement de centaines de Mo, plein écran.
export async function imageBrikCacheComplete(url: string): Promise<boolean> {
	try {
		const cache = await openCache();
		if (!cache) return false;
		const head = await fetchRange(url, 0, 12);
		if (!head.ranged) return false;
		const manifestLen = new DataView(head.bytes.buffer, head.bytes.byteOffset, 12).getUint32(8, true);
		const header = await fetchRange(url, 0, 12 + manifestLen);
		const { manifest, dataStart } = parseBrikHeader(header.bytes);
		const bases = computeShardBases(manifest.shards);
		for (const s of manifest.shards) {
			const off = dataStart + bases[s.id];
			if (!(await cache.match(rangeKey(url, off, off + s.byteLength - 1)))) return false;
		}
		return true;
	} catch {
		return false;
	}
}

export interface PrefetchProgress { doneBytes: number; totalBytes: number }

// Plan des plages que le loader streamé demandera, offsets ABSOLUS dans le fichier (rangeSource
// ajoute dataStart) : un span par couche blk.N.* quand coalescedSpan l'accepte (sinon par-tenseur,
// comme le repli du loader), et chaque tenseur hors couche individuellement (embeddings, normes de
// sortie, tête de logits). SOURCE DE VÉRITÉ UNIQUE pour prefetchBrik ET brikCacheComplete — les
// clés du cache doivent matcher au octet près, un plan divergent rendrait le préchargement inutile.
// null = rien à planifier (Cache API absente, ou serveur sans Range).
async function planBrikRanges(url: string, signal?: AbortSignal): Promise<{ cache: NonNullable<Awaited<ReturnType<typeof openCache>>>; ranges: { off: number; len: number }[] } | null> {
	const cache = await openCache();
	if (!cache) return null;
	const head = await fetchRange(url, 0, 12, signal);
	if (!head.ranged) return null; // pas de Range → le loader téléchargera tout d'un bloc, rien à précacher
	const manifestLen = new DataView(head.bytes.buffer, head.bytes.byteOffset, 12).getUint32(8, true);
	const header = await fetchRange(url, 0, 12 + manifestLen, signal);
	const { manifest, dataStart } = parseBrikHeader(header.bytes);
	const gg = brikToGgufManifest(manifest);

	const byLayer = new Map<string, { offset: number; bytes: number }[]>();
	const ranges: { off: number; len: number }[] = [];
	for (const [name, t] of Object.entries(gg.tensors)) {
		const m = name.match(/^blk\.(\d+)\./);
		if (m) {
			let g = byLayer.get(m[1]);
			if (!g) byLayer.set(m[1], (g = []));
			g.push(t);
		} else {
			ranges.push({ off: dataStart + t.offset, len: t.bytes });
		}
	}
	for (const group of byLayer.values()) {
		const s = coalescedSpan(group);
		if (s) ranges.push({ off: dataStart + s.start, len: s.end - s.start });
		else for (const t of group) ranges.push({ off: dataStart + t.offset, len: t.bytes });
	}
	return { cache, ranges };
}

// Le fichier est-il INTÉGRALEMENT en cache ? (aucun téléchargement — que des cache.match, plus les
// 2 petites requêtes d'en-tête, servies du cache si déjà vues). Gate de l'auto-chargement à la
// reprise de conversation : un cache partiel doit rester au préchargement d'arrière-plan, pas
// déclencher un streaming au premier plan dès l'ouverture de l'app.
export async function brikCacheComplete(url: string): Promise<boolean> {
	try {
		const plan = await planBrikRanges(url);
		if (!plan) return false;
		for (const r of plan.ranges) {
			if (!(await plan.cache.match(rangeKey(url, r.off, r.off + r.len - 1)))) return false;
		}
		return true;
	} catch {
		return false; // hors-ligne sans en-tête caché, etc. → pas d'auto-chargement, jamais d'erreur
	}
}

export async function prefetchBrik(
	url: string,
	onProgress?: (p: PrefetchProgress) => void,
	signal?: AbortSignal,
): Promise<'done' | 'aborted' | 'unstorable'> {
	const plan = await planBrikRanges(url, signal);
	if (!plan) return 'unstorable';
	const { cache, ranges } = plan;
	ranges.sort((a, b) => a.off - b.off); // ordre du fichier ≈ ordre de lecture du loader

	// Recensement : ce qui est déjà en cache compte comme fait (reprise après onglet fermé/annulation).
	const totalBytes = ranges.reduce((a, r) => a + r.len, 0);
	let doneBytes = 0;
	const missing: { off: number; len: number }[] = [];
	for (const r of ranges) {
		if (await cache.match(rangeKey(url, r.off, r.off + r.len - 1))) doneBytes += r.len;
		else missing.push(r);
	}
	onProgress?.({ doneBytes, totalBytes });

	for (const r of missing) {
		if (signal?.aborted) return 'aborted';
		try {
			await fetchRange(url, r.off, r.len, signal);
		} catch (e) {
			if (signal?.aborted) return 'aborted';
			throw e;
		}
		// fetchRange avale les échecs de cache.put (quota) — vérifier que la plage est bien stockée,
		// sinon on téléchargerait tout le fichier dans le vide.
		if (!(await cache.match(rangeKey(url, r.off, r.off + r.len - 1)))) return 'unstorable';
		doneBytes += r.len;
		onProgress?.({ doneBytes, totalBytes });
	}
	return 'done';
}
