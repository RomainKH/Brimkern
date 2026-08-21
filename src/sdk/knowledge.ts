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

/** Un passage retenu et le score qui l'a fait retenir (cf. `selectScored`). */
export interface ScoredChunk {
	chunk: Chunk;
	score: number;
}

// Mots trop fréquents pour discriminer quoi que ce soit (FR + EN).
const STOP = new Set([
	'avec', 'pour', 'dans', 'les', 'des', 'une', 'est', 'sur', 'par', 'que', 'qui', 'quoi', 'comment',
	'pourquoi', 'quand', 'vous', 'nous', 'votre', 'notre', 'mais', 'plus', 'tout', 'tous', 'cette',
	'sont', 'avez', 'puis', 'faire', 'fait', 'fais', 'font', 'the', 'and', 'for', 'with', 'what', 'who', 'how', 'why',
	'when', 'about', 'your', 'our', 'you', 'are', 'can', 'does', 'did', 'this', 'that', 'from', 'have',
	'je', 'tu', 'il', 'elle', 'on', 'ils', 'elles', 'du', 'de', 'la', 'le', 'un', 'en', 'au', 'aux',
	'ce', 'ces', 'cet', 'se', 'sa', 'son', 'ses', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'me', 'te',
	'ne', 'pas', 'si', 'ou', 'et', 'ni', 'car', 'donc', 'or', 'to', 'in', 'at', 'it', 'is', 'be',
	'as', 'an', 'by', 'do', 'no', 'so', 'my', 'he', 'we', 'us', 'me', 'am', 'was', 'were', 'been',
	'quel', 'quelle', 'quels', 'quelles', 'which', 'where', 'bonjour', 'salut', 'hello', 'merci',
]);

// Mémoïsation de stem() : les racines des termes de la question sont redemandées à chaque passage,
// et celles d'un passage à chaque question. Le cache est borné — une base de connaissance est petite,
// mais rien n'empêche un intégrateur d'en passer une énorme, et une Map sans limite serait une fuite.
const STEM_CACHE = new Map<string, string>();
const STEM_CACHE_MAX = 20_000;

/** Simplifie un mot pour la comparaison lexicale (supprime accents, pluriels et terminaisons courantes). */
export function stem(w: string): string {
	const vu = STEM_CACHE.get(w);
	if (vu !== undefined) return vu;
	const r = stemBrut(w);
	if (STEM_CACHE.size >= STEM_CACHE_MAX) STEM_CACHE.clear();
	STEM_CACHE.set(w, r);
	return r;
}

function stemBrut(w: string): string {
	let s = w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	if (s.length <= 3) return s;
	s = s.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/, '');
	if (s.length > 3) {
		s = s.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/, '');
	}
	return s;
}

/** Termes porteurs d'un texte : mots signifiants, nombres (42, 30...) et unités (cm, eu, us...). */
export function terms(s: string): string[] {
	const all = (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((w) => {
		if (STOP.has(w)) return false;
		if (/\d/.test(w)) return true; // Nombres et codes avec chiffres (ex. 42, 5, 24h, 30j)
		return w.length >= 2; // Mots et acronymes de 2 lettres et plus (ex. cm, eu, us, uk, kg)
	});
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

// ── Index d'un passage, calculé UNE fois ──────────────────────────────────────────────────────
// scoreChunk recalculait, pour CHAQUE passage et CHAQUE terme de la question, la liste des mots du
// passage, leurs racines, puis un `some()` qui rappelait `stem()` sur chaque mot. Sur une base de
// 200 passages de 150 mots interrogée avec 8 termes, cela faisait ~240 000 appels à `stem()` par
// question — chacun avec une normalisation NFD et deux regex — sur le thread principal, juste avant
// une génération. L'index ci-dessous est calculé une fois par passage et mémoïsé sur l'objet lui-même
// (WeakMap : rien à libérer, l'entrée meurt avec le passage).
//
// ÉQUIVALENCE — le `some()` remplacé n'était pas approximé, il a été réécrit à l'identique. Il
// testait, pour une racine de question `st` et une racine de passage `dst` :
//     dst === st  ||  (st.length>=4 && dst.startsWith(st4))  ||  (dst.length>=4 && st.startsWith(dst4))
// où `x4` = les 4 premières lettres. Le 2ᵉ terme exige que `dst` fasse au moins 4 lettres (rien de
// plus court ne peut commencer par une chaîne de 4), donc dst4 === st4. Le 3ᵉ exige que `st` en fasse
// au moins 4, donc st4 === dst4 : le MÊME test. Les deux se réduisent à « une racine du passage
// commence par les 4 lettres de st », soit une appartenance à un ensemble de préfixes. Le 1ᵉʳ terme
// est l'ensemble des racines. D'où : mêmes scores exactement, en O(1) par terme au lieu de O(mots).
// Vérifié en différentiel contre l'implémentation précédente : 48 000 comparaisons (120 passages ×
// 400 questions pseudo-aléatoires), 0 écart, et 1,58 ms → 0,17 ms par question (×9,4). Le témoin
// bénéficiait déjà du cache de `stem` ajouté en même temps : l'écart réel est donc plus grand.
interface ChunkIndex {
	hay: string;
	titre: string;
	docStems: Set<string>;
	docPrefix4: Set<string>;
	titreStems: Set<string>;
	titrePrefix4: Set<string>;
}
const INDEX = new WeakMap<Chunk, ChunkIndex>();

function prefixes4(stems: Iterable<string>): Set<string> {
	const p = new Set<string>();
	for (const st of stems) if (st.length >= 4) p.add(st.slice(0, 4));
	return p;
}

function indexChunk(chunk: Chunk): ChunkIndex {
	const cache = INDEX.get(chunk);
	if (cache) return cache;
	const hay = `${chunk.title} ${chunk.text}`.toLowerCase();
	const titre = chunk.title.toLowerCase();
	const docStems = new Set(terms(hay).map(stem));
	const titreStems = new Set(terms(titre).map(stem));
	const ix: ChunkIndex = {
		hay, titre, docStems, titreStems,
		docPrefix4: prefixes4(docStems),
		titrePrefix4: prefixes4(titreStems),
	};
	INDEX.set(chunk, ix);
	return ix;
}

/**
 * Score d'un passage pour une question : part des termes de la question qu'il contient, pondérée
 * par la RARETÉ du terme dans l'ensemble des passages (un mot présent partout n'apprend rien) et
 * par un bonus si le terme apparaît dans le titre du document. Supporte le stemming et les racines.
 * 0 = aucun terme commun.
 */
export function scoreChunk(qTerms: string[], chunk: Chunk, idf: Map<string, number>): number {
	if (!qTerms.length) return 0;
	const ix = indexChunk(chunk);
	let s = 0, poidsTotal = 0;
	for (const t of qTerms) {
		const w = idf.get(t) ?? 1;
		poidsTotal += w;
		const st = stem(t);
		const p4 = st.length >= 4 ? st.slice(0, 4) : null;
		// « Le passage contient-il ce terme ? » — forme exacte, racine identique, ou racines qui
		// partagent leurs 4 premières lettres (retour → retourner). Le test par préfixe est ici en
		// O(1) : cf. la démonstration d'équivalence au-dessus d'indexChunk.
		const trouve = ix.hay.includes(t) || ix.docStems.has(st) || (p4 !== null && ix.docPrefix4.has(p4));
		if (trouve) {
			const dansTitre = ix.titre.includes(t) || ix.titreStems.has(st) || (p4 !== null && ix.titrePrefix4.has(p4));
			s += w * (dansTitre ? 2.2 : 1.0);
		}
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
export function selectChunks(question: string, chunks: Chunk[], maxChars = 1200, maxChunks = 3, seuil = 0.22, relatif = 0.5): Chunk[] {
	return selectScored(question, chunks, maxChars, maxChunks, seuil, relatif).map((x) => x.chunk);
}

/**
 * La MÊME sélection, score compris. C'est la forme interne — `selectChunks` n'en est qu'une
 * projection — parce que le score est ce que l'API publique expose à l'intégrateur (`onSources`,
 * `session.lastSources`) : sans lui, « pourquoi a-t-il répondu ça ? » n'a pas de réponse, et une
 * base de fiches ne se débogue qu'à l'aveugle. L'ORDRE est celui de l'injection dans le prompt
 * ([1], [2], …) : ce que l'intégrateur affiche correspond à ce que le modèle a lu.
 */
export function selectScored(question: string, chunks: Chunk[], maxChars = 1200, maxChunks = 3, seuil = 0.22, relatif = 0.5): ScoredChunk[] {
	const q = terms(question);
	if (!q.length || !chunks.length) return [];
	const idf = buildIdf(chunks);
	const bruts = chunks
		.map((c) => ({ c, s: scoreChunk(q, c, idf) }))
		.filter((x) => x.s >= seuil)
		.sort((a, b) => b.s - a.s);
	// PLANCHER RELATIF au meilleur passage. Le seuil absolu ne peut pas trancher entre « pertinent »
	// et « contient un mot en commun » : « la livraison est gratuite à partir de combien ? » retenait
	// la fiche Livraison (0,695) ET la fiche Retours (0,228, pour le seul mot « gratuits »), et le
	// modèle répondait depuis la seconde (mesuré sur /sdk-demo). Un passage à un tiers du score du
	// meilleur est du bruit, quel que soit le seuil absolu — et deux notes valent mieux qu'une
	// seulement quand elles sont vraiment comparables, ce que ce rapport exprime directement.
	const plancher = bruts.length ? bruts[0].s * relatif : 0;
	const notes = bruts.filter((x) => x.s >= plancher);
	const pris: ScoredChunk[] = [];
	const docsVus = new Set<number>();
	let budget = maxChars;
	// Premier passage : un extrait par document, par ordre de score.
	for (const { c, s } of notes) {
		if (pris.length >= maxChunks || c.text.length > budget) continue;
		if (docsVus.has(c.doc)) continue;
		pris.push({ chunk: c, score: s }); docsVus.add(c.doc); budget -= c.text.length;
	}
	// Second passage : on complète avec les meilleurs restants si le budget le permet.
	for (const { c, s } of notes) {
		if (pris.length >= maxChunks) break;
		if (pris.some((x) => x.chunk === c) || c.text.length > budget) continue;
		pris.push({ chunk: c, score: s }); budget -= c.text.length;
	}
	return pris;
}

/**
 * Le message a-t-il la forme d'une DEMANDE D'INFORMATION ? C'est ce qui décide, quand aucune fiche
 * ne correspond, entre un refus (« je n'ai pas cette information ») et une réponse de conversation.
 *
 * Pourquoi ce tri existe. La consigne de refus était injectée dès que la sélection ne retenait rien,
 * sauf salutation reconnue. Résultat mesuré sur /sdk-demo (banc sdk-dialogue.mjs, 3/11) : « are you
 * ok ? », « ALLO ? », « PLEASE », « HELP ME », « I DIE » recevaient tous « I do not have that
 * information », et comme un modèle de 230 M recopie ce qu'il vient d'écrire, la conversation ne
 * s'en relevait plus. Le refus est JUSTE pour « Who won the 1998 World Cup ? » — il faut le garder,
 * c'est la promesse du produit — et absurde pour tout le reste.
 *
 * La règle : au moins deux termes de contenu ET une forme interrogative (un « ? » final, ou un mot
 * de question en tête). Deux termes parce qu'un message d'un seul terme utile — « stop », « please »,
 * « useless » — n'est jamais une demande de fait. La forme interrogative parce que « thanks a lot »
 * et « je comprends rien » en ont deux et ne demandent rien. Vérifié terme par terme sur la
 * transcription signalée : les onze messages se rangent du bon côté.
 *
 * Ce tri est fait EN CODE, pas confié au modèle : à 230 M, une consigne qui dit « refuse si c'est
 * une question de fait, sinon bavarde » est deux règles, et deux règles se brouillent (cf. le
 * cadrage volontairement court dans index.ts). Une décision déterministe, une seule consigne.
 */
export function looksLikeFactQuestion(q: string): boolean {
	if (terms(q).length < 2) return false;
	const s = q.trim().toLowerCase();
	if (/\?\s*$/.test(s)) return true;
	return /^(?:who|what|when|where|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|have|has|qui|que|quoi|quand|où|pourquoi|comment|combien|quel|quelles?|quels|est|sont|était|avez|peux|pouvez|puis|vous|y a-t-il|est-ce)\b/.test(s);
}

/**
 * La réponse est-elle un REFUS DE RENSEIGNER ? Sert de filet : quand on a explicitement dit au
 * modèle qu'aucune fiche n'était nécessaire et qu'il refuse quand même, on ne laisse pas le mur
 * atteindre le visiteur (cf. l'usage dans index.ts).
 *
 * Pourquoi un filet et pas seulement une consigne : mesuré sur trois tours du banc de dialogue,
 * la consigne seule passe de 3/11 à 25/33 — le disque rayé est cassé (« hello », « ça va ? »,
 * « ALLO ? » : 3/3), mais les interjections d'un mot (« PLEASE », « I DIE ») et le tour qui suit un
 * refus LÉGITIME retombent encore dans le refus une fois sur trois. C'est la limite d'un 230 M, et
 * c'est le même constat qui a produit le strip mécanique de la re-salutation dans engineCore : à
 * cette taille, ce qu'une consigne n'obtient pas, un traitement déterministe l'obtient.
 *
 * Le motif décrit un refus de RENSEIGNER — un verbe d'information — et pas toute tournure négative :
 * « I am not able to stop. » est une réponse acceptable à un « stop » sec et ne doit pas être
 * remplacée.
 */
export function looksLikeRefusal(reply: string, fr = false): boolean {
	const s = reply.trim();
	if (!s) return false;
	return fr
		? /pas cette information|n[’']ai pas (?:cette|ces|d[’']information)|ne (?:sais|dispose) pas|pas en mesure de (?:vous )?(?:aider|répondre|renseigner|fournir)|ne peux pas (?:vous )?(?:aider|fournir|renseigner|répondre)/i.test(s)
		: /do not have (?:that|this|any) information|don[’']t have (?:that|this|any) information|no information (?:about|on)|(?:can[’']t|cannot|not able to|unable to) (?:assist|provide|answer|access|help you with that)/i.test(s);
}

/** Détecte les salutations ou formules de politesse courantes qui ne doivent pas être bloquées par un refus de notes. */
export function isGreetingOrChitchat(q: string): boolean {
	const clean = q.trim().toLowerCase().replace(/[!?.,;:\-_]/g, '').trim();
	return /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(clean);
}

/**
 * Le bloc ajouté au prompt système. La consigne est aussi importante que les passages : sans
 * « uniquement à partir des notes », un petit modèle complète avec ce qu'il croit savoir — et une
 * réponse inventée sur le contenu d'un client est pire que « je ne sais pas ».
 */
export function buildKnowledgeBlock(chunks: Chunk[], query?: string, fr = false): string {
	if (query && isGreetingOrChitchat(query)) {
		return '';
	}
	// La consigne suit la LANGUE de la session. Elle était en anglais dans tous les cas : sur une
	// boutique française, le modèle de 230 M répondait « Yes, the returns are always free. » à une
	// question française (mesuré sur /sdk-demo le 2026-08-19). À cette taille, la langue de la
	// dernière instruction lue pèse plus que celle de la question.
	if (!chunks.length) {
		// Aucune fiche — et deux situations à ne pas confondre. Une DEMANDE D'INFORMATION hors fiches
		// doit être refusée : c'est la promesse du produit, et le banc RAG la vérifie (« Qui a gagné la
		// Coupe du monde 1998 ? »). Tout le reste — « ça va ? », « AIDEZ-MOI », « stop » — n'est pas
		// une demande de fait, et lui servir un refus transforme le widget en mur (cf.
		// looksLikeFactQuestion et scripts/e2e/sdk-dialogue.mjs).
		if (query && !looksLikeFactQuestion(query)) {
			// La consigne est COURTE, et une clause de plus a été retirée après mesure : « N'énonce aucun
			// chiffre ni fait sur la boutique » se faisait recracher telle quelle (« I am not able to
			// provide information about the store. »), ce qui est encore un mur. Un 230 M paraphrase la
			// dernière instruction lue ; on ne lui donne donc à paraphraser que ce qu'on veut entendre.
			// L'interdiction d'inventer, elle, est déjà dans le cadrage du prompt système (GUARDRAILS).
			return fr
				? '\n\nCe message n’appelle aucune fiche : réponds en une phrase courte et aimable.'
				: '\n\nThis message needs no reference note: reply in one short, friendly sentence.';
		}
		return fr
			? '\n\nAucune fiche de référence ne correspond à cette question. Dis que tu n’as pas cette information : ne devine pas.'
			: '\n\nNo reference note matches this question. Say that you do not have this information: do not guess.';
	}
	const notes = chunks
		.map((c, i) => `[${i + 1}]${c.title ? ` ${c.title}` : ''}\n${c.text}`)
		.join('\n\n');
	const consigne = fr
		? 'Réponds UNIQUEMENT à partir des fiches ci-dessous, en français. Reprends leurs chiffres exactement. Si la réponse n’y est pas, dis que tu n’as pas cette information : n’invente jamais pour combler.'
		: 'Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume.';
	return `\n\n${consigne}\n\n--- NOTES ---\n${notes}\n--- END OF NOTES ---`;
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
