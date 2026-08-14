// Deeplink « ouvrir ce modèle dans Le Kern » — la surface que consomme le menu « Use this model »
// des pages modèles Hugging Face (registre local-apps.ts de huggingface/huggingface.js, cf.
// docs/huggingface-integration.md) et qui sert aussi de raccourci de banc.
//
//   ?model=<owner>/<repo>            → résout le meilleur fichier chargeable du repo (BRIK > GGUF)
//   ?model=<owner>/<repo>&file=<path> → fichier précis du repo (un quant particulier)
//   ?brik=<url .brik> | ?gguf=<url>   → URL directe (bancs, hébergement tiers)
//
// Pur (hors `resolveHfModel` qui appelle l'API du Hub) : `pickModelFile` est testable sans réseau
// (npm run test:deeplink).

export type DeeplinkKind = 'brik' | 'gguf';
export interface DeeplinkTarget { url: string; kind: DeeplinkKind; path: string }

const HF_ID = /^[A-Za-z0-9][\w.-]*\/[\w.-]+$/;

// Préférences de quantification, du meilleur compromis navigateur au repli. Un BRIK gagne toujours :
// c'est notre format streamé (chargement par plages, tokenizer embarqué, quant native).
const BRIK_ORDER = ['q4', 'mixed', 'q3', 'q8', 'f16'];
const GGUF_ORDER = ['q4_k_m', 'q4_k_s', 'q4_0', 'q5_k_m', 'q5_k_s', 'q5_0', 'q8_0', 'q6_k', 'f16'];

// Fichiers qu'on ne sait pas (ou ne veut pas) charger comme modèle de chat.
function isLoadable(path: string): boolean {
	const p = path.toLowerCase();
	if (p.includes('mmproj')) return false;            // projecteur vision, pas un LLM autonome
	if (/-\d{5}-of-\d{5}\./.test(p)) return false;      // GGUF sharde en plusieurs fichiers : non supporté
	return p.endsWith('.brik') || p.endsWith('.gguf');
}

function rank(path: string, order: string[]): number {
	const p = path.toLowerCase();
	const i = order.findIndex((q) => p.includes(q));
	return i < 0 ? order.length : i;
}

// Choisit le fichier à charger dans la liste des chemins d'un repo. BRIK d'abord (tri par tier
// préféré), sinon GGUF (tri par quant préférée, puis par nom pour rester déterministe).
// null = aucun fichier chargeable (repo safetensors seul, GGUF shardé, mmproj seul…).
export function pickModelFile(paths: string[]): string | null {
	const usable = paths.filter(isLoadable);
	const briks = usable.filter((p) => p.toLowerCase().endsWith('.brik'));
	const pool = briks.length ? briks : usable;
	if (!pool.length) return null;
	const order = briks.length ? BRIK_ORDER : GGUF_ORDER;
	return pool.slice().sort((a, b) => rank(a, order) - rank(b, order) || a.localeCompare(b))[0];
}

export function hfResolveUrl(id: string, path: string): string {
	return `https://huggingface.co/${id}/resolve/main/${path.split('/').map(encodeURIComponent).join('/')}`;
}

// Résout un identifiant de repo du Hub en fichier chargeable. `file` court-circuite la sélection.
// Jette avec un message affichable tel quel (l'UI le met dans l'écran d'erreur).
export async function resolveHfModel(id: string, file?: string): Promise<DeeplinkTarget> {
	if (!HF_ID.test(id)) throw new Error(`Identifiant de modèle invalide : « ${id} » (attendu « auteur/modèle »).`);
	if (file) {
		if (!isLoadable(file)) throw new Error(`Fichier non chargeable : « ${file} » (attendu .brik ou .gguf non shardé).`);
		return { url: hfResolveUrl(id, file), kind: file.toLowerCase().endsWith('.brik') ? 'brik' : 'gguf', path: file };
	}
	const api = `https://huggingface.co/api/models/${id}/tree/main?recursive=1`;
	let entries: { path: string; type?: string }[];
	try {
		const r = await fetch(api);
		if (r.status === 401 || r.status === 403) throw new Error(`Le dépôt « ${id} » est privé ou nécessite d’accepter sa licence sur Hugging Face.`);
		if (r.status === 404) throw new Error(`Dépôt introuvable sur Hugging Face : « ${id} ».`);
		if (!r.ok) throw new Error(`Hugging Face a répondu HTTP ${r.status} pour « ${id} ».`);
		entries = await r.json();
	} catch (e) {
		throw e instanceof Error && e.message.startsWith('Le dépôt') || e instanceof Error && /introuvable|HTTP/.test(e.message)
			? e
			: new Error(`Impossible d’interroger Hugging Face pour « ${id} » (réseau ?).`);
	}
	const path = pickModelFile((entries ?? []).filter((e) => e.type !== 'directory').map((e) => e.path));
	if (!path) {
		throw new Error(`Aucun fichier chargeable dans « ${id} » : Le Kern lit les .brik et les .gguf (mono-fichier). Ce dépôt n’en contient pas — cherchez une version GGUF de ce modèle.`);
	}
	return { url: hfResolveUrl(id, path), kind: path.toLowerCase().endsWith('.brik') ? 'brik' : 'gguf', path };
}

// ── Saisie LIBRE (champ « tester n'importe quel modèle ») ─────────────────────────────────────
// Ce que les gens collent réellement quand on leur dit « mets un modèle Hugging Face » : un
// identifiant, l'URL de la page, l'URL d'un fichier vue depuis l'onglet « Files », ou une URL
// directe. Tout est ramené à la même paire de cas que le deeplink — donc au même résolveur, à la
// même sélection de quant et au même forçage tokenizer/arch depuis le GGUF : rien à régler à la main.
// null = entrée non exploitable (l'UI affiche alors quoi coller).
export type ModelInput = { url: string; kind: DeeplinkKind } | { id: string; file?: string };
export function parseModelInput(raw: string): ModelInput | null {
	const text = (raw || '').trim().replace(/^["'<]|["'>]$/g, '');
	if (!text) return null;

	// 1. URL absolue.
	if (/^https?:\/\//i.test(text)) {
		let u: URL;
		try { u = new URL(text); } catch { return null; }
		const host = u.hostname.toLowerCase();
		const seg = u.pathname.split('/').filter(Boolean);
		if (host === 'huggingface.co' || host === 'hf.co' || host.endsWith('.huggingface.co')) {
			// .../<owner>/<repo>/resolve/<rev>/<path> = lien de TÉLÉCHARGEMENT direct → tel quel.
			// .../<owner>/<repo>/blob/<rev>/<path>    = page du fichier → on garde owner/repo + file
			//                                            (le résolveur reconstruit l'URL resolve/).
			// .../<owner>/<repo>[/tree/...]           = dépôt → on laisse choisir le meilleur fichier.
			const i = seg.findIndex((s) => s === 'resolve' || s === 'blob');
			if (i >= 2) {
				const id = `${seg[0]}/${seg[1]}`;
				const file = seg.slice(i + 2).map(decodeURIComponent).join('/');
				if (!file) return HF_ID.test(id) ? { id } : null;
				if (seg[i] === 'blob') return HF_ID.test(id) && isLoadable(file) ? { id, file } : null;
				return isLoadable(file) ? { url: u.toString(), kind: kindOf(file) } : null;
			}
			if (seg.length >= 2) {
				const id = `${seg[0]}/${seg[1]}`;
				return HF_ID.test(id) ? { id } : null;
			}
			return null;
		}
		// Hôte quelconque (CDN, Space, serveur perso) : seul le nom de fichier décide.
		const last = seg[seg.length - 1] || '';
		return isLoadable(last) ? { url: u.toString(), kind: kindOf(last) } : null;
	}

	// 2. « hf.co/owner/repo » ou « huggingface.co/owner/repo » sans schéma.
	const bare = text.replace(/^(?:https?:\/\/)?(?:www\.)?(?:huggingface\.co|hf\.co)\//i, '');

	// 3. Identifiant nu « owner/repo », éventuellement suivi du chemin d'un fichier.
	const parts = bare.split('/').filter(Boolean);
	if (parts.length >= 2) {
		const id = `${parts[0]}/${parts[1]}`;
		if (!HF_ID.test(id)) return null;
		if (parts.length === 2) return { id };
		const file = parts.slice(2).join('/');
		return isLoadable(file) ? { id, file } : null;
	}
	return null;
}

function kindOf(path: string): DeeplinkKind {
	return path.toLowerCase().endsWith('.brik') ? 'brik' : 'gguf';
}

// Lit les paramètres de deeplink d'une query string. Retourne null si aucun n'est présent.
export function parseDeeplink(search: string): { url: string; kind: DeeplinkKind } | { id: string; file?: string } | null {
	const q = new URLSearchParams(search);
	const brik = q.get('brik'), gguf = q.get('gguf'), model = q.get('model');
	const httpOk = (u: string) => /^https:\/\//.test(u) || /^\/[^/]/.test(u) || /^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(u);
	if (brik && httpOk(brik) && brik.toLowerCase().endsWith('.brik')) return { url: brik, kind: 'brik' };
	if (gguf && httpOk(gguf) && gguf.toLowerCase().endsWith('.gguf')) return { url: gguf, kind: 'gguf' };
	if (model) return { id: model, file: q.get('file') ?? undefined };
	return null;
}
