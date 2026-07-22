// User "skills" — reusable system-prompt presets (personas / instructions), like a local version of
// custom instructions. Built-ins ship in code; the user's own skills are persisted in IndexedDB so
// they survive reloads. The active skill's `content` becomes the system prompt for generation.
// Browser-only: every function is called from client handlers/effects.

export interface Skill {
	id: string;
	name: string;
	content: string;   // the system-prompt text injected at generation
	builtin?: boolean; // shipped in code, not editable/deletable
	updatedAt: number;
}

// Starter skills (always available, can't be deleted). `default` mirrors the old hard-coded prompt.
export const BUILTIN_SKILLS: Skill[] = [
	{ id: 'default', name: 'Assistant', content: 'You are a helpful AI assistant.', builtin: true, updatedAt: 0 },
	{ id: 'concis', name: 'Concis', content: 'Réponds de façon concise et directe, sans préambule ni remplissage.', builtin: true, updatedAt: 0 },
	{ id: 'code', name: 'Code', content: 'Tu es un assistant de programmation expert. Donne du code clair, idiomatique et commenté, avec une explication brève et précise.', builtin: true, updatedAt: 0 },
	{ id: 'traducteur', name: 'Traducteur', content: 'Tu es un traducteur professionnel. Traduis fidèlement le message de l’utilisateur ; ne réponds qu’avec la traduction, sans commentaire.', builtin: true, updatedAt: 0 },
];

const DB_NAME = 'brimkern-skills';
const STORE = 'skills';
const VERSION = 1;

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

// The user's custom skills, most-recently-updated first.
export async function listCustomSkills(): Promise<Skill[]> {
	const db = await openDb();
	try {
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
			req.onsuccess = () => resolve((req.result as Skill[]).sort((a, b) => b.updatedAt - a.updatedAt));
			req.onerror = () => reject(req.error);
		});
	} finally { db.close(); }
}

export async function saveSkill(s: Skill): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).put(s);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally { db.close(); }
}

export async function deleteSkill(id: string): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).delete(id);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally { db.close(); }
}
