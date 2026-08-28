"use client";

// Streaming TensorSource for single-file .brik models served over HTTP. Instead of downloading the
// whole file up front, it fetches the small header (manifest) first — so the UI/profile appear
// instantly — then range-fetches each tensor on demand during the forward pass, caching every range
// in the Cache API so repeat loads are instant and offline-capable. Falls back to a single full
// download if the host doesn't honour Range requests.

import { coalescedSpan } from './layerSpans';
import { type TensorSource } from './model';
import { parseGguf } from './ggufParser';
import { parseBrik, parseBrikHeader } from '../brik/container';
import { brikToGgufManifest, computeShardBases, type GgufManifest } from '../brik/loader';
import { verifyManifestDigest } from '../brik/integrity';
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
	console.warn('[cache] écriture refusée (quota plein ? navigation privée ?) : les téléchargements de modèles ne seront PAS réutilisables à la prochaine visite. Libérez de l\'espace via le panneau Stockage.', e);
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
		await verifyManifestDigest(url, manifestBytes(full));
		return loadableFrom(manifest, bytesSource(data));
	}
	const manifestLen = new DataView(head.bytes.buffer, head.bytes.byteOffset, 12).getUint32(8, true);
	const header = await fetchRange(url, 0, 12 + manifestLen);
	const { manifest, dataStart } = parseBrikHeader(header.bytes);
	// Intégrité AVANT le premier tenseur : sur une URL que l'app a choisie elle-même, un manifeste
	// d'empreinte inattendue fait échouer le chargement (cf. brik/integrity.ts).
	await verifyManifestDigest(url, manifestBytes(header.bytes));
	return loadableFrom(manifest, rangeSource(url, dataStart));
}

// Les octets EXACTS du manifeste dans un en-tête .brik : [12, 12+longueur). C'est la tranche que
// scripts/brik-digest.cjs hache — les deux doivent découper au même endroit, sinon toute empreinte
// est fausse. Une seule fonction pour les deux appelants, plutôt que deux subarray recopiés.
function manifestBytes(headerOrFull: Uint8Array): Uint8Array {
	const len = new DataView(headerOrFull.buffer, headerOrFull.byteOffset, 12).getUint32(8, true);
	return headerOrFull.subarray(12, 12 + len);
}

function loadableFrom(manifest: ReturnType<typeof parseBrikHeader>['manifest'], source: TensorSource): StreamLoadable {
	// Garde-fou : un BRIK image (UNet/CLIP, clés safetensors) collé dans le champ « BRIK par URL »
	// du chat produirait un manifeste LLM absurde (arch d=0) — refus clair plutôt que du chaos.
	if (manifest.model?.uiArch === 'image') {
		throw new Error('Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de génération d\'image, pas comme un LLM.');
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
	// `bytes` : octets du BRIK réellement descendus / total annoncé par le manifeste. C'est ce qui
	// permet à l'appelant d'afficher une barre ET un temps restant sur un pipeline image/vidéo,
	// comme le chemin LLM le fait depuis toujours (retour Romain du 2026-08-18).
	onShard?: (done: number, total: number, bytes?: { loaded: number; total: number }) => Promise<void> | void,
): Promise<BrikManifest> {
	const head = await fetchRange(url, 0, 12);
	let manifest: BrikManifest, dataStart: number, full: Uint8Array | null = null;
	if (!head.ranged) {
		// Pas de Range côté serveur → téléchargement d'un bloc, mis en cache entier (sans quoi
		// chaque ouverture re-téléchargeait tout — pas de reprise, mais au moins la réutilisation).
		full = await fetchFullCached(url);
		({ manifest, dataStart } = parseBrikHeader(full));
		await verifyManifestDigest(url, manifestBytes(full));
	} else {
		const manifestLen = new DataView(head.bytes.buffer, head.bytes.byteOffset, 12).getUint32(8, true);
		const header = await fetchRange(url, 0, 12 + manifestLen);
		({ manifest, dataStart } = parseBrikHeader(header.bytes));
		await verifyManifestDigest(url, manifestBytes(header.bytes));
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
	const totalBytes = shards.reduce((a, s) => a + s.byteLength, 0);
	let loadedBytes = 0;
	let done = 0;
	for (const shard of shards) {
		const off = dataStart + bases[shard.id];
		const bytes = full
			? full.subarray(off, off + shard.byteLength)
			: (await fetchRange(url, off, shard.byteLength)).bytes;
		for (const [name, t] of byShard.get(shard.id) ?? []) {
			onTensor(name, t, bytes.subarray(t.offset, t.offset + t.byteLength));
		}
		loadedBytes += shard.byteLength;
		await onShard?.(++done, shards.length, { loaded: loadedBytes, total: totalBytes });
	}
	return manifest;
}

// Plan des plages d'un BRIK image (un span par shard de manifest.shards).
async function planImageBrikRanges(url: string, signal?: AbortSignal): Promise<{ cache: NonNullable<Awaited<ReturnType<typeof openCache>>>; ranges: { off: number; len: number }[] } | null> {
	const cache = await openCache();
	if (!cache) return null;
	const head = await fetchRange(url, 0, 12, signal);
	if (!head.ranged) return null;
	const manifestLen = new DataView(head.bytes.buffer, head.bytes.byteOffset, 12).getUint32(8, true);
	const header = await fetchRange(url, 0, 12 + manifestLen, signal);
	const { manifest, dataStart } = parseBrikHeader(header.bytes);
	if (!manifest.shards) return null;
	const bases = computeShardBases(manifest.shards);
	const ranges = manifest.shards.map((s) => ({ off: dataStart + bases[s.id], len: s.byteLength }));
	return { cache, ranges };
}

// Plage par plage : quelles clés de cache ce BRIK image attend-il, et lesquelles sont là ?
// Exporté parce que « il en manque » ne se diagnostique pas sans le détail — et parce que c'est la
// SEULE définition de « intégralement en cache » (imageBrikCacheComplete la lit, le banc aussi).
export async function imageBrikRangeStatus(url: string): Promise<{ keys: string[]; hits: boolean[] }> {
	try {
		const plan = await planImageBrikRanges(url);
		if (!plan) return { keys: [], hits: [] };
		const keys = plan.ranges.map((r) => rangeKey(url, r.off, r.off + r.len - 1));
		const hits = await Promise.all(keys.map(async (k) => !!(await plan.cache.match(k))));
		return { keys, hits };
	} catch {
		return { keys: [], hits: [] };
	}
}

// Le BRIK image est-il INTÉGRALEMENT en cache local ?
export async function imageBrikCacheComplete(url: string): Promise<boolean> {
	const { keys, hits } = await imageBrikRangeStatus(url);
	return keys.length > 0 && hits.every(Boolean);
}

// État du cache du pipeline image, PAR PIÈCE. Le détail n'est pas décoratif : les deux BRIK pèsent
// 1,23 Go et le décodeur TAESD 4,7 Mo, donc « il manque quelque chose » ne dit rien d'utile — seul
// compte de savoir s'il manque du LOURD.
// ⚠️ Deux BUCKETS de Cache API distincts, et c'est le piège qui a rendu ce test toujours faux :
// les plages des BRIK vivent dans `brik-range-v1` (openCache), mais le TAESD est un safetensors
// entier écrit par `cachedBuf` de diffusion/sdturbo.ts dans `brimkern-model-cache` (FULL_CACHE).
// La version précédente cherchait le TAESD dans le bucket des plages : `cache.match` n'y a jamais
// répondu, la fonction sortait sur son premier `return false` — donc les 1,23 Go de UNet + CLIP
// n'étaient même pas examinés, et l'auto-reprise d'une conversation image n'a jamais eu lieu.
export interface ImageCacheState {
	unet: boolean;
	clip: boolean;
	taesd: boolean;
	/** Les POIDS LOURDS (UNet + CLIP) sont intégralement en cache. */
	heavy: boolean;
	/** Tout est là : zéro octet de réseau au chargement. */
	complete: boolean;
}

export async function imageModelCacheState(urls: { unet: string; clip: string; taesd: string }): Promise<ImageCacheState> {
	try {
		const [unet, clip, taesd] = await Promise.all([
			imageBrikCacheComplete(urls.unet),
			imageBrikCacheComplete(urls.clip),
			fullCached(urls.taesd),
		]);
		const heavy = unet && clip;
		return { unet, clip, taesd, heavy, complete: heavy && taesd };
	} catch {
		return { unet: false, clip: false, taesd: false, heavy: false, complete: false };
	}
}

// L'ensemble du pipeline image (UNet BRIK + CLIP BRIK + TAESD) est-il 100% en cache local ?
export async function imageModelCached(urls: { unet: string; clip: string; taesd: string }): Promise<boolean> {
	return (await imageModelCacheState(urls)).complete;
}

// Même chose pour la VIDÉO : trois BRIK streamés (UNet + module motion + CLIP) et le même décodeur
// TAESD, dans le même bucket plein-fichier — depuis que videoGen le met en cache au lieu de le
// retélécharger à chaque chargement.
export interface VideoCacheState {
	unet: boolean;
	motion: boolean;
	clip: boolean;
	taesd: boolean;
	/** Les POIDS LOURDS (UNet + motion + CLIP, ~1,53 Go) sont intégralement en cache. */
	heavy: boolean;
	complete: boolean;
}

export async function videoModelCacheState(urls: { unet: string; motion: string; clip: string; taesd: string }): Promise<VideoCacheState> {
	try {
		const [unet, motion, clip, taesd] = await Promise.all([
			imageBrikCacheComplete(urls.unet),
			imageBrikCacheComplete(urls.motion),
			imageBrikCacheComplete(urls.clip),
			fullCached(urls.taesd),
		]);
		const heavy = unet && motion && clip;
		return { unet, motion, clip, taesd, heavy, complete: heavy && taesd };
	} catch {
		return { unet: false, motion: false, clip: false, taesd: false, heavy: false, complete: false };
	}
}

// ── GGUF STREAMÉ (mêmes plages que le BRIK) ───────────────────────────────────────────────────
// Un GGUF distant se chargeait en UN SEUL téléchargement monolithique : tous les octets en RAM,
// puis un Blob de plusieurs centaines de Mo posé dans le Cache API. Au-delà de ~770 Mo, Chrome
// refuse l'écriture (quota) ET le stockage blob de l'origine part avec — le Blob rendu devient
// illisible et le chargement meurt sur « NotReadableError ». D'où : Llama 3.2 1B, DeepSeek 1.5B,
// Qwen 2.5 1.5B et Ministral 3 inutilisables, et les presets ~1 Go (Falcon 3, Granite) bloqués.
// Le format GGUF n'y est pour rien : les offsets des tenseurs sont ABSOLUS dans le fichier, donc la
// même infra de plages que le BRIK marche telle quelle — aucun gros Blob, reprise après coupure,
// hors-ligne réel, et le chargement démarre dès l'en-tête lu.
// `null` = pas de Range côté hôte → l'appelant retombe sur le téléchargement complet.
export interface GgufStream { manifest: GgufManifest; source: TensorSource }
export async function loadGgufStream(url: string, signal?: AbortSignal): Promise<GgufStream | null> {
	// Fichier DÉJÀ téléchargé en entier par l'ancien chemin (bucket plein-fichier) : on le laisse
	// servir. Repasser en plages re-téléchargerait tout et occuperait le disque en double, alors que
	// cette copie-là a forcément tenu sous le quota (elle est en cache) et se chargeait déjà bien.
	if (await ggufFullCached(url)) return null;
	const probe = await fetchRange(url, 0, 12, signal);
	if (!probe.ranged) return null;
	return { manifest: await parseGgufHeaderRanged(url, signal), source: rangeSource(url, 0) };
}

// Ce fichier est-il en cache dans le bucket PLEIN-FICHIER ? (`cachedBuf` de diffusion/sdturbo.ts y
// écrit les safetensors entiers : TAESD, encodeur TAESD, décodeur VAE complet.)
export async function fullCached(url: string): Promise<boolean> {
	try {
		const c = await caches.open(FULL_CACHE);
		return !!(await c.match(url));
	} catch {
		return false;
	}
}

// Une copie plein-fichier de ce GGUF est-elle en cache ? (ancien chemin monolithique.)
export async function ggufFullCached(url: string): Promise<boolean> {
	try {
		const c = await caches.open(FULL_CACHE);
		return !!(await c.match(url));
	} catch {
		return false;
	}
}

// En-tête GGUF par plages : sa taille n'est pas connue d'avance (le vocabulaire du tokenizer y est
// EMBARQUÉ — plusieurs Mo pour un vocab de 131k), donc on lit 8 Mo puis on double jusqu'à 128 Mo.
// parseGguf ne touche qu'à l'en-tête : un Blob partiel suffit (même ruse que le chargeur mmproj).
async function parseGgufHeaderRanged(url: string, signal?: AbortSignal): Promise<GgufManifest> {
	const src = rangeSource(url, 0);
	let lastErr: unknown;
	for (let size = 8 * 1024 * 1024; size <= 128 * 1024 * 1024; size *= 2) {
		try {
			const head = await src.bytes(0, size);
			return await parseGguf(new Blob([head.slice() as unknown as BlobPart])) as unknown as GgufManifest;
		} catch (e) {
			if (signal?.aborted) throw e;
			lastErr = e;
		}
	}
	throw lastErr instanceof Error ? lastErr : new Error('en-tête GGUF illisible par plages');
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
	return { cache, ranges: planTensorRanges(brikToGgufManifest(manifest), dataStart) };
}

// Plan des plages depuis un manifeste de forme GGUF, en offsets ABSOLUS. Partagé par le BRIK
// (base = dataStart) et le GGUF brut (base = 0, ses offsets sont déjà absolus) : un seul endroit où
// vit la règle « un span par couche, les tenseurs hors couche à l'unité ».
function planTensorRanges(gg: GgufManifest, base: number): { off: number; len: number }[] {
	const byLayer = new Map<string, { offset: number; bytes: number }[]>();
	const ranges: { off: number; len: number }[] = [];
	for (const [name, t] of Object.entries(gg.tensors)) {
		const m = name.match(/^blk\.(\d+)\./);
		if (m) {
			let g = byLayer.get(m[1]);
			if (!g) byLayer.set(m[1], (g = []));
			g.push(t);
		} else {
			ranges.push({ off: base + t.offset, len: t.bytes });
		}
	}
	for (const group of byLayer.values()) {
		const s = coalescedSpan(group);
		if (s) ranges.push({ off: base + s.start, len: s.end - s.start });
		else for (const t of group) ranges.push({ off: base + t.offset, len: t.bytes });
	}
	return ranges;
}

// Même plan pour un GGUF distant. L'en-tête (lu par plages, donc servi du cache aux ouvertures
// suivantes) donne les offsets absolus des tenseurs.
async function planGgufRanges(url: string, signal?: AbortSignal): Promise<{ cache: NonNullable<Awaited<ReturnType<typeof openCache>>>; ranges: { off: number; len: number }[] } | null> {
	const cache = await openCache();
	if (!cache) return null;
	const probe = await fetchRange(url, 0, 12, signal);
	if (!probe.ranged) return null;
	return { cache, ranges: planTensorRanges(await parseGgufHeaderRanged(url, signal), 0) };
}

// Le fichier est-il INTÉGRALEMENT en cache ? (aucun téléchargement — que des cache.match, plus les
// 2 petites requêtes d'en-tête, servies du cache si déjà vues). Gate de l'auto-chargement à la
// reprise de conversation : un cache partiel doit rester au préchargement d'arrière-plan, pas
// déclencher un streaming au premier plan dès l'ouverture de l'app.
export async function brikCacheComplete(url: string): Promise<boolean> {
	try {
		const plan = await planBrikRanges(url);
		if (!plan) return false;
		// cache.match en parallèle : en série, ~25 lookups ajoutaient ~1 s de latence à chaque
		// ouverture avant même de décider quoi que ce soit.
		const hits = await Promise.all(plan.ranges.map((r) => plan.cache.match(rangeKey(url, r.off, r.off + r.len - 1))));
		return hits.every(Boolean);
	} catch {
		return false; // hors-ligne sans en-tête caché, etc. → pas d'auto-chargement, jamais d'erreur
	}
}

export async function prefetchBrik(
	url: string,
	onProgress?: (p: PrefetchProgress) => void,
	signal?: AbortSignal,
): Promise<'done' | 'aborted' | 'unstorable'> {
	return prefetchPlanned(url, await planBrikRanges(url, signal), onProgress, signal);
}

// Préchargement d'un GGUF distant : mêmes spans, même parallélisme, même reprise que le BRIK.
export async function prefetchGguf(
	url: string,
	onProgress?: (p: PrefetchProgress) => void,
	signal?: AbortSignal,
): Promise<'done' | 'aborted' | 'unstorable'> {
	return prefetchPlanned(url, await planGgufRanges(url, signal), onProgress, signal);
}

// Le GGUF est-il INTÉGRALEMENT en cache ? (que des cache.match — miroir de brikCacheComplete.)
export async function ggufCacheComplete(url: string): Promise<boolean> {
	try {
		const plan = await planGgufRanges(url);
		if (!plan) return false;
		const hits = await Promise.all(plan.ranges.map((r) => plan.cache.match(rangeKey(url, r.off, r.off + r.len - 1))));
		return hits.every(Boolean);
	} catch {
		return false;
	}
}

async function prefetchPlanned(
	url: string,
	plan: { cache: NonNullable<Awaited<ReturnType<typeof openCache>>>; ranges: { off: number; len: number }[] } | null,
	onProgress?: (p: PrefetchProgress) => void,
	signal?: AbortSignal,
): Promise<'done' | 'aborted' | 'unstorable'> {
	if (!plan) return 'unstorable';
	const { cache, ranges } = plan;
	ranges.sort((a, b) => a.off - b.off); // ordre du fichier ≈ ordre de lecture du loader

	// Recensement : ce qui est déjà en cache compte comme fait (reprise après onglet fermé/annulation).
	// Lookups en parallèle — en série ils coûtaient ~1 s à vide avant le premier octet téléchargé.
	const totalBytes = ranges.reduce((a, r) => a + r.len, 0);
	const cachedHits = await Promise.all(ranges.map((r) => cache.match(rangeKey(url, r.off, r.off + r.len - 1))));
	let doneBytes = 0;
	const missing: { off: number; len: number }[] = [];
	ranges.forEach((r, i) => { if (cachedHits[i]) doneBytes += r.len; else missing.push(r); });
	onProgress?.({ doneBytes, totalBytes });

	// Téléchargement parallèle (4 plages en vol) : en série, ~25 spans de 10-20 Mo ne saturaient
	// jamais une bonne connexion. Un drapeau partagé arrête les autres ouvriers dès qu'une plage
	// est instockable (quota) ou en échec — inutile de continuer à télécharger dans le vide.
	let next = 0, unstorable = false, failed: unknown = null;
	const worker = async () => {
		while (!unstorable && failed === null) {
			const i = next++;
			if (i >= missing.length) return;
			const r = missing[i];
			if (signal?.aborted) return;
			try {
				await fetchRange(url, r.off, r.len, signal);
			} catch (e) {
				failed = e;
				return;
			}
			// fetchRange avale les échecs de cache.put (quota) — vérifier que la plage est bien stockée.
			if (!(await cache.match(rangeKey(url, r.off, r.off + r.len - 1)))) { unstorable = true; return; }
			doneBytes += r.len;
			onProgress?.({ doneBytes, totalBytes });
		}
	};
	await Promise.all(Array.from({ length: Math.min(4, missing.length) }, worker));
	if (signal?.aborted) return 'aborted';
	if (failed !== null) throw failed instanceof Error ? failed : new Error(String(failed));
	if (unstorable) return 'unstorable';
	return 'done';
}
