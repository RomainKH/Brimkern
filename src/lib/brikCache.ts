// Persistent cache of converted single-file .brik packages, in IndexedDB (keyed by a cheap signature
// of the source GGUF + target tier). Lets "auto-convert GGUF → BRIK at load" happen ONCE: the next
// load of the same file/tier reads the cached .brik and skips the (slow) re-conversion entirely.
// Browser-only — every function is called from client handlers, never at module load.

export interface BrikCacheMeta { key: string; modelName: string; tier: string; byteLength: number; createdAt: number; }

const DB_NAME = 'brimkern-brik';
const STORE = 'packages';
const VERSION = 1;

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'key' });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

// Bump whenever the GGUF→BRIK converter changes in a way that makes previously-cached packages
// invalid (e.g. a quantization/packing fix). Old keys no longer match → the package is silently
// reconverted with the corrected pipeline instead of serving a stale/corrupt one.
//   v2: chunked GPU quantization — fixes silent corruption of large tensors (token_embd ~1GB f32)
//       that exceeded maxStorageBufferBindingSize, which produced garbage .brik weights.
export const BRIK_CONVERTER_VERSION = 2;

// A cheap, collision-resistant key for a source model + tier (no full-file hash — name+size+mtime
// is enough to detect "same file"). `sig` is e.g. `${name}:${size}:${lastModified}` or a URL.
export function brikCacheKey(sig: string, tier: string): string {
	return `${sig}::${tier}::v${BRIK_CONVERTER_VERSION}`;
}

export async function getBrik(key: string): Promise<Uint8Array | null> {
	const db = await openDb();
	try {
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
			req.onsuccess = () => resolve(req.result ? (req.result.bytes as Uint8Array) : null);
			req.onerror = () => reject(req.error);
		});
	} finally { db.close(); }
}

export async function putBrik(key: string, bytes: Uint8Array, meta: Omit<BrikCacheMeta, 'key' | 'byteLength' | 'createdAt'>): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).put({ key, bytes, byteLength: bytes.byteLength, createdAt: Date.now(), ...meta });
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally { db.close(); }
}

// Metadata of all cached packages (no bytes), most-recent first — for a management UI.
export async function listBrik(): Promise<BrikCacheMeta[]> {
	const db = await openDb();
	try {
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
			req.onsuccess = () => resolve((req.result as any[])
				.map(({ key, modelName, tier, byteLength, createdAt }) => ({ key, modelName, tier, byteLength, createdAt }))
				.sort((a, b) => b.createdAt - a.createdAt));
			req.onerror = () => reject(req.error);
		});
	} finally { db.close(); }
}

export async function deleteBrik(key: string): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).delete(key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally { db.close(); }
}
