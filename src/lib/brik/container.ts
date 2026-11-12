// BRIK single-file container (.brik). One self-contained binary instead of a directory of shards +
// a separate manifest.json (or a .brik.zip wrapper): leaner than ZIP for store-only data, and —
// because the manifest sits in a small fixed-position header — HTTP range / Cache API friendly
// (fetch the header, then range-request individual layers without parsing a ZIP central directory).
//
// Layout:
//   [0..4)            magic "BRIK"
//   [4..8)            version (u32 LE)
//   [8..12)           manifest byte length L (u32 LE)
//   [12..12+L)        manifest JSON (UTF-8) — the standard BrikManifest
//   [pad to 16]       tensor data section, 16-byte aligned (so vec4 loads stay aligned)
//   [dataStart..]     shard bytes concatenated in ascending shard-id order
//
// The manifest's shard byteLengths + per-tensor {shard, offset} already describe the layout WITHIN
// the data section, so a tensor's absolute file offset is dataStart + shardBase + tensorOffset.

import { BRIK_VERSION, alignUp, validateBrikManifest, type BrikManifest } from './format';
import type { BrikShardBytes } from './loader';

const MAGIC = 'BRIK';
// Fixed header: magic(4) + version(4) + manifestLength(4), then the manifest JSON.
const HEADER_FIXED = 12;
// Garde-fou : aucun manifeste BRIK réel ne dépasse quelques Mo (même avec un tokenizer.json embarqué).
// Borner la taille annoncée dans les 12 premiers octets empêche un serveur ou un fichier corrompu
// (manifestLen = 0xffffffff) de déclencher un fetchRange / slice de 4 Go en RAM avant parseBrikHeader.
export const MAX_MANIFEST_BYTES = 64 * 1024 * 1024;

// Lit et valide les 12 octets fixes de l'en-tête BRIK (sceau magique, version, taille du manifeste).
export function readBrikManifestLength(head: Uint8Array): number {
	if (head.length < HEADER_FIXED) throw new Error('BRIK: fichier tronqué (en-tête)');
	const magic = String.fromCharCode(head[0], head[1], head[2], head[3]);
	if (magic !== MAGIC) throw new Error(`BRIK: sceau magique absent (${magic})`);
	const dv = new DataView(head.buffer, head.byteOffset, head.byteLength);
	const version = dv.getUint32(4, true);
	if (version !== BRIK_VERSION) throw new Error(`BRIK: version non supportée (${version})`);
	const manifestLen = dv.getUint32(8, true);
	if (manifestLen === 0 || manifestLen > MAX_MANIFEST_BYTES) {
		throw new Error(`BRIK: taille de manifeste invalide (${manifestLen} o)`);
	}
	return manifestLen;
}

// Byte offset where the (16-byte-aligned) tensor data section begins, given the manifest length.
export function brikDataStart(manifestByteLength: number): number {
	return alignUp(HEADER_FIXED + manifestByteLength);
}

// Serialize a BRIK package (manifest + shard bytes) into a single .brik file. Pure (no Blob/DOM) so
// it runs identically in the browser converter, a Node build script, and tests.
export function serializeBrik(manifest: BrikManifest, shards: BrikShardBytes[]): Uint8Array {
	const manifestBytes = new TextEncoder().encode(JSON.stringify(manifest));
	const dataStart = brikDataStart(manifestBytes.length);

	const ordered = [...manifest.shards].sort((a, b) => a.id - b.id);
	const fileToBytes = new Map(shards.map((s) => [s.file, s.bytes]));
	let dataLen = 0;
	for (const sh of ordered) {
		const bytes = fileToBytes.get(sh.file);
		if (!bytes) throw new Error(`shard manquant : ${sh.file}`);
		if (bytes.length !== sh.byteLength) {
			throw new Error(`taille de shard incohérente pour ${sh.file} : ${bytes.length} ≠ ${sh.byteLength}`);
		}
		dataLen += sh.byteLength;
	}

	const out = new Uint8Array(dataStart + dataLen);
	for (let i = 0; i < MAGIC.length; i++) out[i] = MAGIC.charCodeAt(i);
	const dv = new DataView(out.buffer);
	dv.setUint32(4, BRIK_VERSION, true);
	dv.setUint32(8, manifestBytes.length, true);
	out.set(manifestBytes, HEADER_FIXED);

	let off = dataStart;
	for (const sh of ordered) {
		out.set(fileToBytes.get(sh.file)!, off);
		off += sh.byteLength;
	}
	return out;
}

export interface ParsedBrik {
	manifest: BrikManifest;
	version: number;
	dataStart: number;
	// The tensor data section (a view into the input bytes). Sliced to one Blob, its offsets line up
	// with brikToGgufManifest's (which are relative to the concatenated shard data).
	data: Uint8Array;
}

// Read just the header + manifest from the leading bytes of a .brik file (enough to know dataStart
// and every tensor's byte range — for range-based streaming you only need this many bytes first).
export function parseBrikHeader(bytes: Uint8Array): { manifest: BrikManifest; version: number; dataStart: number } {
	const manifestLen = readBrikManifestLength(bytes);
	if (HEADER_FIXED + manifestLen > bytes.length) throw new Error('BRIK: manifeste tronqué');
	// Tout ce qui sort de ce JSON.parse vient du réseau : validé avant d'aller dimensionner quoi que
	// ce soit (cf. validateBrikManifest — bornes, et surtout « chaque tenseur tient dans son shard »).
	const manifest = validateBrikManifest(
		JSON.parse(new TextDecoder().decode(bytes.subarray(HEADER_FIXED, HEADER_FIXED + manifestLen))) as BrikManifest,
	);
	return { manifest, version: BRIK_VERSION, dataStart: brikDataStart(manifestLen) };
}

// Parse a full in-memory .brik file into its manifest + tensor-data section. Bornes vérifiées ici
// (gratuit) ; les empreintes `shard.sha256`, elles, se vérifient en ASYNCHRONE aux frontières de
// confiance (`verifyBrikShards`, integrity.ts) : hachées ici en synchrone, elles gelaient l'onglet
// (~70 Mo/s en TypeScript pur, soit ~35 s pour un .brik local de 2,5 Go).
export function parseBrik(bytes: Uint8Array): ParsedBrik {
	const { manifest, version, dataStart } = parseBrikHeader(bytes);
	const data = bytes.subarray(dataStart);
	const ordered = [...manifest.shards].sort((a, b) => a.id - b.id);
	let off = 0;
	for (const sh of ordered) {
		if (off + sh.byteLength > data.byteLength) {
			throw new Error(`BRIK: section de données tronquée au shard ${sh.id} (${data.byteLength} < ${off + sh.byteLength})`);
		}
		off += sh.byteLength;
	}
	return { manifest, version, dataStart, data };
}
