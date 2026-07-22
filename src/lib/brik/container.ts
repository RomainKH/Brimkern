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

import { BRIK_VERSION, alignUp, type BrikManifest } from './format';
import type { BrikShardBytes } from './loader';

const MAGIC = 'BRIK';
// Fixed header: magic(4) + version(4) + manifestLength(4), then the manifest JSON.
const HEADER_FIXED = 12;

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
	if (bytes.length < HEADER_FIXED) throw new Error('BRIK: fichier tronqué (en-tête)');
	const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
	if (magic !== MAGIC) throw new Error(`BRIK: sceau magique absent (${magic})`);
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const version = dv.getUint32(4, true);
	const manifestLen = dv.getUint32(8, true);
	if (HEADER_FIXED + manifestLen > bytes.length) throw new Error('BRIK: manifeste tronqué');
	const manifest = JSON.parse(new TextDecoder().decode(bytes.subarray(HEADER_FIXED, HEADER_FIXED + manifestLen))) as BrikManifest;
	return { manifest, version, dataStart: brikDataStart(manifestLen) };
}

// Parse a full in-memory .brik file into its manifest + tensor-data section.
export function parseBrik(bytes: Uint8Array): ParsedBrik {
	const { manifest, version, dataStart } = parseBrikHeader(bytes);
	return { manifest, version, dataStart, data: bytes.subarray(dataStart) };
}
