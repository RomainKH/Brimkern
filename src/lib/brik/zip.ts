// Minimal ZIP (store-only, no compression) so a converted BRIK can be downloaded as a single
// .brik.zip and re-imported later — dependency-free, on purpose (this project ships its own
// primitives). Method 0 (stored): for f16 weight bytes, DEFLATE buys almost nothing and costs CPU.
// Spec: PKWARE APPNOTE — local file headers, a central directory, and an end-of-central-directory.

const LOCAL_SIG = 0x04034b50;
const CENTRAL_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;
// Fixed DOS timestamp (1980-01-01 00:00) keeps output deterministic — no Date dependency.
const DOS_TIME = 0;
const DOS_DATE = 0x21;

// CRC-32 (IEEE 802.3), table-driven.
const CRC_TABLE = (() => {
	const t = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[n] = c >>> 0;
	}
	return t;
})();

function crc32(bytes: Uint8Array): number {
	let c = 0xffffffff;
	for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

const utf8 = (s: string) => new TextEncoder().encode(s);

interface ZipEntry {
	name: string;
	data: Uint8Array;
}

// Build a stored-only ZIP from named byte blobs. Returns the archive as an ORDERED list of byte
// chunks (headers + the entries' own byte arrays, by reference — never copied). Hand it straight
// to `new Blob(parts)`: the Blob copies once, instead of us first concatenating a second full-size
// buffer in memory (matters when a shard set is hundreds of MB). Use `concatParts` if you need one
// contiguous Uint8Array (e.g. tests / readZip).
export function makeZip(entries: ZipEntry[]): Uint8Array[] {
	const locals: Uint8Array[] = [];
	const centrals: Uint8Array[] = [];
	let offset = 0; // running offset of each local header (for the central directory)

	for (const e of entries) {
		const nameBytes = utf8(e.name);
		const crc = crc32(e.data);
		const size = e.data.length;

		const local = new Uint8Array(30 + nameBytes.length);
		const lv = new DataView(local.buffer);
		lv.setUint32(0, LOCAL_SIG, true);
		lv.setUint16(4, 20, true); // version needed
		lv.setUint16(6, 0, true); // flags
		lv.setUint16(8, 0, true); // method 0 = stored
		lv.setUint16(10, DOS_TIME, true);
		lv.setUint16(12, DOS_DATE, true);
		lv.setUint32(14, crc, true);
		lv.setUint32(18, size, true); // compressed size
		lv.setUint32(22, size, true); // uncompressed size
		lv.setUint16(26, nameBytes.length, true);
		lv.setUint16(28, 0, true); // extra len
		local.set(nameBytes, 30);
		locals.push(local, e.data);

		const central = new Uint8Array(46 + nameBytes.length);
		const cv = new DataView(central.buffer);
		cv.setUint32(0, CENTRAL_SIG, true);
		cv.setUint16(4, 20, true); // version made by
		cv.setUint16(6, 20, true); // version needed
		cv.setUint16(8, 0, true); // flags
		cv.setUint16(10, 0, true); // method
		cv.setUint16(12, DOS_TIME, true);
		cv.setUint16(14, DOS_DATE, true);
		cv.setUint32(16, crc, true);
		cv.setUint32(20, size, true);
		cv.setUint32(24, size, true);
		cv.setUint16(28, nameBytes.length, true);
		cv.setUint16(30, 0, true); // extra len
		cv.setUint16(32, 0, true); // comment len
		cv.setUint16(34, 0, true); // disk number
		cv.setUint16(36, 0, true); // internal attrs
		cv.setUint32(38, 0, true); // external attrs
		cv.setUint32(42, offset, true); // local header offset
		central.set(nameBytes, 46);
		centrals.push(central);

		offset += local.length + size;
	}

	const centralSize = centrals.reduce((a, b) => a + b.length, 0);
	const centralOffset = offset;

	const eocd = new Uint8Array(22);
	const ev = new DataView(eocd.buffer);
	ev.setUint32(0, EOCD_SIG, true);
	ev.setUint16(4, 0, true); // disk
	ev.setUint16(6, 0, true); // central dir disk
	ev.setUint16(8, entries.length, true); // entries on this disk
	ev.setUint16(10, entries.length, true); // total entries
	ev.setUint32(12, centralSize, true);
	ev.setUint32(16, centralOffset, true);
	ev.setUint16(20, 0, true); // comment len

	return [...locals, ...centrals, eocd];
}

// Flatten makeZip's chunk list into one contiguous Uint8Array.
export function concatParts(parts: Uint8Array[]): Uint8Array {
	const total = parts.reduce((a, c) => a + c.length, 0);
	const out = new Uint8Array(total);
	let p = 0;
	for (const c of parts) {
		out.set(c, p);
		p += c.length;
	}
	return out;
}

// Parse a stored-only ZIP (the kind makeZip emits — method 0, no data descriptors) back into its
// named entries, walking the central directory.
export function readZip(buf: Uint8Array): ZipEntry[] {
	const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

	// Find the End-Of-Central-Directory by scanning backwards for its signature.
	let eocd = -1;
	for (let i = buf.length - 22; i >= 0; i--) {
		if (dv.getUint32(i, true) === EOCD_SIG) {
			eocd = i;
			break;
		}
	}
	if (eocd < 0) throw new Error('ZIP invalide : end-of-central-directory introuvable');

	const count = dv.getUint16(eocd + 10, true);
	let p = dv.getUint32(eocd + 16, true); // central directory offset
	const entries: ZipEntry[] = [];

	for (let i = 0; i < count; i++) {
		if (dv.getUint32(p, true) !== CENTRAL_SIG) throw new Error('ZIP invalide : entrée de répertoire central corrompue');
		const method = dv.getUint16(p + 10, true);
		const size = dv.getUint32(p + 24, true); // uncompressed (== compressed for stored)
		const nameLen = dv.getUint16(p + 28, true);
		const extraLen = dv.getUint16(p + 30, true);
		const commentLen = dv.getUint16(p + 32, true);
		const localOff = dv.getUint32(p + 42, true);
		const name = new TextDecoder().decode(buf.subarray(p + 46, p + 46 + nameLen));
		if (method !== 0) throw new Error(`ZIP non supporté : la méthode ${method} (compressée) pour ${name}`);

		// Jump to the local header to find where the data actually starts (its name/extra lengths
		// can differ from the central record's).
		if (dv.getUint32(localOff, true) !== LOCAL_SIG) throw new Error('ZIP invalide : en-tête local corrompu');
		const lNameLen = dv.getUint16(localOff + 26, true);
		const lExtraLen = dv.getUint16(localOff + 28, true);
		const dataStart = localOff + 30 + lNameLen + lExtraLen;
		const data = buf.subarray(dataStart, dataStart + size);
		entries.push({ name, data });

		p += 46 + nameLen + extraLen + commentLen;
	}
	return entries;
}
