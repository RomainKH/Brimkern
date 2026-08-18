// Documents de connaissance du SDK — « l'assistant répond sur MON contenu ».
//
// Contrainte de départ, qui dicte tout le reste : le modèle par défaut est un 230M avec une fenêtre
// de contexte courte, et il tourne sur le GPU d'un visiteur. On ne peut donc PAS lui verser tout un
// site dans le prompt, et on ne peut pas non plus embarquer un modèle d'embeddings pour faire de la
// recherche sémantique (ce serait un second téléchargement, sur une page tierce, pour un gain
// incertain à cette taille).
//
// Le compromis retenu : découpage en passages + sélection LEXICALE (recouvrement de termes pondéré),
// et on n'injecte que les 1 à 3 passages les plus proches de la QUESTION posée, à chaque tour. C'est
// modeste, mais c'est honnête : ça marche hors-ligne, ça ne coûte rien à charger, et ça échoue de
// façon lisible (aucun passage pertinent → on le dit au modèle, qui répond qu'il ne sait pas).
//
// Tout est PUR ici (aucun DOM, aucun réseau) : `npm run test:knowledge` valide le découpage et la
// sélection sans navigateur.

export interface KnowledgeDoc {
	title?: string;
	text: string;
}

export interface Chunk {
	title: string;
	text: string;
	/** Index du document d'origine — sert à citer et à diversifier la sélection. */
	doc: number;
}

// Mots trop fréquents pour discriminer quoi que ce soit (FR + EN). Même esprit que le filtre de la
// recherche web : sans eux, « quelles sont les heures » sélectionnerait n'importe quel passage.
const STOP = new Set([
	'avec', 'pour', 'dans', 'les', 'des', 'une', 'est', 'sur', 'par', 'que', 'qui', 'quoi', 'comment',
	'pourquoi', 'quand', 'vous', 'nous', 'votre', 'notre', 'mais', 'plus', 'tout', 'tous', 'cette',
	'sont', 'avez', 'puis', 'faire', 'fait', 'the', 'and', 'for', 'with', 'what', 'who', 'how', 'why',
	'when', 'about', 'your', 'our', 'you', 'are', 'can', 'does', 'did', 'this', 'that', 'from', 'have',
]);

/** Termes porteurs d'un texte : ≥3 caractères, sans les mots vides, dédupliqués. */
export function terms(s: string): string[] {
	const all = (s.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? []).filter((w) => !STOP.has(w));
	return [...new Set(all)];
}

/**
 * Découpe des documents en passages d'environ `target` caractères.
 *
 * On coupe aux FRONTIÈRES DE PARAGRAPHE d'abord, et seulement en dernier recours au milieu d'un
 * paragraphe trop long : un passage qui commence en plein milieu d'une phrase donne au modèle un
 * contexte tronqué qu'il complète en inventant — exactement ce qu'on cherche à éviter.
 */
export function chunkDocuments(docs: KnowledgeDoc[], target = 600): Chunk[] {
	const out: Chunk[] = [];
	docs.forEach((d, i) => {
		const title = (d.title || '').trim();
		const paras = (d.text || '').split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
		let buf = '';
		const flush = () => { if (buf.trim()) out.push({ title, text: buf.trim(), doc: i }); buf = ''; };
		for (const p of paras) {
			if (p.length > target * 1.6) {
				flush();
				// Paragraphe trop long : on coupe sur les fins de phrase, pas au caractère près.
				const phrases = p.split(/(?<=[.!?])\s+/);
				let cur = '';
				for (const ph of phrases) {
					if (cur && (cur + ' ' + ph).length > target) { out.push({ title, text: cur.trim(), doc: i }); cur = ph; }
					else cur = cur ? `${cur} ${ph}` : ph;
				}
				if (cur.trim()) out.push({ title, text: cur.trim(), doc: i });
				continue;
			}
			if (buf && (buf + '\n\n' + p).length > target) flush();
			buf = buf ? `${buf}\n\n${p}` : p;
		}
		flush();
	});
	return out;
}

/**
 * Score d'un passage pour une question : part des termes de la question qu'il contient, pondérée
 * par la RARETÉ du terme dans l'ensemble des passages (un mot présent partout n'apprend rien) et
 * par un bonus si le terme apparaît dans le titre du document.
 * 0 = aucun terme commun.
 */
export function scoreChunk(qTerms: string[], chunk: Chunk, idf: Map<string, number>): number {
	if (!qTerms.length) return 0;
	const hay = `${chunk.title} ${chunk.text}`.toLowerCase();
	const titre = chunk.title.toLowerCase();
	let s = 0, poidsTotal = 0;
	for (const t of qTerms) {
		const w = idf.get(t) ?? 1;
		poidsTotal += w;
		if (hay.includes(t)) s += w * (titre.includes(t) ? 1.5 : 1);
	}
	return poidsTotal ? s / poidsTotal : 0;
}

/** Rareté d'un terme : log(N / nombre de passages qui le contiennent). */
export function buildIdf(chunks: Chunk[]): Map<string, number> {
	const df = new Map<string, number>();
	for (const c of chunks) {
		for (const t of terms(`${c.title} ${c.text}`)) df.set(t, (df.get(t) ?? 0) + 1);
	}
	const idf = new Map<string, number>();
	const n = Math.max(1, chunks.length);
	for (const [t, d] of df) idf.set(t, Math.log(1 + n / d));
	return idf;
}

/**
 * Les passages à injecter pour cette question. `maxChars` borne le total : sur un 230M, noyer le
 * prompt dégrade la réponse au lieu de l'améliorer — deux passages courts battent cinq longs.
 * Diversifie par document tant que c'est possible (deux passages du même document se répètent
 * souvent), et n'accepte QUE ce qui dépasse un seuil : mieux vaut zéro passage qu'un hors sujet.
 */
export function selectChunks(question: string, chunks: Chunk[], maxChars = 1200, maxChunks = 3, seuil = 0.34): Chunk[] {
	const q = terms(question);
	if (!q.length || !chunks.length) return [];
	const idf = buildIdf(chunks);
	const notes = chunks
		.map((c) => ({ c, s: scoreChunk(q, c, idf) }))
		.filter((x) => x.s >= seuil)
		.sort((a, b) => b.s - a.s);
	const pris: Chunk[] = [];
	const docsVus = new Set<number>();
	let budget = maxChars;
	// Premier passage : un extrait par document, par ordre de score.
	for (const { c } of notes) {
		if (pris.length >= maxChunks || c.text.length > budget) continue;
		if (docsVus.has(c.doc)) continue;
		pris.push(c); docsVus.add(c.doc); budget -= c.text.length;
	}
	// Second passage : on complète avec les meilleurs restants si le budget le permet.
	for (const { c } of notes) {
		if (pris.length >= maxChunks) break;
		if (pris.includes(c) || c.text.length > budget) continue;
		pris.push(c); budget -= c.text.length;
	}
	return pris;
}

/**
 * Le bloc ajouté au prompt système. La consigne est aussi importante que les passages : sans
 * « uniquement à partir des notes », un petit modèle complète avec ce qu'il croit savoir — et une
 * réponse inventée sur le contenu d'un client est pire que « je ne sais pas ».
 */
export function buildKnowledgeBlock(chunks: Chunk[]): string {
	if (!chunks.length) {
		// ⚠️ La formulation compte plus qu'il n'y paraît. Elle commençait par « You have reference
		// notes, but none of them match… » — et le modèle par défaut (230M) refusait alors
		// SYSTÉMATIQUEMENT toute question sur un passage commençant lui aussi par « You have »
		// (« You have 30 days to return… »). À cette taille, l'appariement se fait sur la surface :
		// deux débuts identiques suffisent à faire suivre le mauvais exemple. Mesuré, puis corrigé en
		// changeant l'attaque de la phrase.
		return '\n\nNo reference note matches this question. Say that you do not have this information: do not guess.';
	}
	const notes = chunks
		.map((c, i) => `[${i + 1}]${c.title ? ` ${c.title}` : ''}\n${c.text}`)
		.join('\n\n');
	return `\n\nAnswer using ONLY the reference notes below. If the answer is not in them, say you do not have that information: never fill the gap with what you assume.\n\n--- NOTES ---\n${notes}\n--- END OF NOTES ---`;
}

/** Normalise ce que l'intégrateur passe : une chaîne, un objet, ou un mélange des deux. */
export function normalizeDocs(input: unknown): KnowledgeDoc[] {
	const arr = Array.isArray(input) ? input : [input];
	const out: KnowledgeDoc[] = [];
	for (const d of arr) {
		if (typeof d === 'string' && d.trim()) out.push({ text: d });
		else if (d && typeof d === 'object' && typeof (d as KnowledgeDoc).text === 'string' && (d as KnowledgeDoc).text.trim()) {
			out.push({ title: (d as KnowledgeDoc).title, text: (d as KnowledgeDoc).text });
		}
	}
	return out;
}
