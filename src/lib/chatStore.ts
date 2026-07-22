// Conversation history persisted in IndexedDB. Chat history is plain JSON and independent of the
// loaded model — an old conversation can be reopened after switching models (only *continuing*
// generation needs a model loaded). Browser-only: every function is called from client handlers/
// effects, never at module load, so it's safe in a "use client" component.

export interface StoredMessage {
	id: string;
	role: 'system' | 'user' | 'assistant';
	content: string;
	isError?: boolean;
	// timings kept loose; only used for display.
	timings?: unknown;
	// Generated image (text→image bubbles). Only the tiny blurred thumb + the generation params are
	// persisted (NOT the full PNG) — the full image is regenerated on click from prompt+seed.
	// Exception img2img : `full` (data URL PNG) — une image affinée dépend des pixels source et
	// n'est pas régénérable depuis prompt+seed, on la persiste entière (~150-300 Ko à 256px).
	image?: { url?: string; w: number; h: number; thumb?: string; prompt?: string; seed?: number; full?: string };
}

export interface Conversation {
	id: string;
	title: string;
	createdAt: number;
	updatedAt: number;
	messages: StoredMessage[];
	// Which model/tokenizer this chat was held with (for display + restoring formatting).
	modelName?: string;
	tokenizerId?: string;
	archType?: string;
	// Source URL of the model (preset/HF), so a reopened chat can auto-reload it from cache.
	modelUrl?: string;
}

const DB_NAME = 'brimkern';
const STORE = 'conversations';
const VERSION = 1;

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) {
				db.createObjectStore(STORE, { keyPath: 'id' });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

// All conversations, most-recently-updated first.
export async function listConversations(): Promise<Conversation[]> {
	const db = await openDb();
	try {
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
			req.onsuccess = () => resolve((req.result as Conversation[]).sort((a, b) => b.updatedAt - a.updatedAt));
			req.onerror = () => reject(req.error);
		});
	} finally {
		db.close();
	}
}

export async function saveConversation(c: Conversation): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).put(c);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally {
		db.close();
	}
}

export async function deleteConversation(id: string): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).delete(id);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally {
		db.close();
	}
}

// Delete every saved conversation (used by the storage panel's "clear history").
export async function clearAllConversations(): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).clear();
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally {
		db.close();
	}
}

// A short title from the first user message (fallback "Nouvelle conversation").
export function deriveTitle(messages: StoredMessage[]): string {
	const firstUser = messages.find((m) => m.role === 'user' && m.content.trim());
	if (!firstUser) return 'Nouvelle conversation';
	const t = firstUser.content.trim().replace(/\s+/g, ' ');
	return t.length > 42 ? t.slice(0, 42) + '…' : t;
}
