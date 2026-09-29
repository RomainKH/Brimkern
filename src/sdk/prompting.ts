// COMPOSITION DU TOUR — le prompt système, le message réellement envoyé (fiches, résultats
// d'outils, question) et les exemples épinglés. Sorti d'index.ts (2026-09-28) pour une seule
// raison : les données d'entraînement du modèle du SDK (scripts/train/) doivent être composées par
// CE code, pas par une copie — un écart de format entre l'entraînement et le SDK apprendrait au
// modèle une forme qu'il ne verra jamais. Aucune logique changée par le déplacement.
import { chunkDocuments, selectScored, buildKnowledgeBlock, normalizeDocs, looksLikeFactQuestion, type Chunk } from './knowledge';
import { normalizeTools, formatToolBlock, hasDateTool, dateSystemLine, type ToolNote } from './tools';
import type { Msg } from './engineCore';
import type { SessionConfig, Source } from './index';

// Cadrage appliqué après le prompt de l'intégrateur — VOLONTAIREMENT court : sur un 230M,
// une liste de règles détaillées DÉGRADE (banc 2026-07-22 : « reply only to the last
// message » → le modèle se met à répéter le message en écho). Trois consignes simples :
// pas d'outils (tool-calling halluciné), honnêteté (pas de faits inventés), concision.
const GUARDRAILS =
  '\nAnswer briefly and honestly. If you do not know something, say so: never invent facts or details.' +
  '\nYou have no tools and no internet access: never emit tool calls, reply in plain text only.';
// Avec des outils déclarés (0.2.0), « You have no tools » devient FAUX et nourrit le réflexe de
// refus appris (« I don't have access to real-time inventory ») — mesuré au banc sdk-tools.mjs à
// côté d'une note qui contenait précisément le stock demandé. La variante reste aussi courte, et
// garde ce qui reste vrai : pas d'accès réseau, pas d'appels d'outils à émettre (c'est NOUS qui
// les exécutons), du texte simple.
const GUARDRAILS_OUTILS =
  '\nAnswer briefly and honestly. If you do not know something, say so: never invent facts or details.' +
  '\nBracketed tool results in the message are exact facts: use them as-is. Never emit tool calls yourself, reply in plain text only.';

// ── LANGUE DE LA SESSION ────────────────────────────────────────────────────────────────────────
// `lang` déclaré fait foi ; sinon on devine depuis le prompt système. L'heuristique cherche des
// accents ou des mots français fréquents, bornés par \b, sans quoi « aide » matchait à l'intérieur
// de mots anglais (« maiden »). Elle était enfermée dans makeSystemBuilder alors que le WIDGET en a
// besoin lui aussi (ses libellés) : une seule règle, un seul endroit.
export function estFr(cfg: Pick<SessionConfig, 'lang' | 'system'>): boolean {
	if (cfg.lang) return cfg.lang === 'fr';
	if (cfg.system) return /[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(cfg.system);
	// Sans prompt système, il n'y a rien à deviner dans la config : on lit la PAGE (lang de <html>,
	// puis langue du navigateur). Avant, ce cas tombait silencieusement en anglais — un embed() nu
	// sur un site français servait un widget anglais. Le verdict du prompt système, lui, reste
	// souverain : la langue des consignes doit suivre celle du comportement déclaré, pas celle de
	// la page qui l'héberge.
	if (typeof document !== 'undefined' && /^fr\b/i.test(document.documentElement.lang || '')) return true;
	if (typeof navigator !== 'undefined' && /^fr\b/i.test(navigator.language || '')) return true;
	return false;
}

export function makeSystemBuilder(cfg: Pick<SessionConfig, 'system' | 'knowledge' | 'knowledgeBudget' | 'examples' | 'lang' | 'tools'>): {
	system: (q: string) => string;
	/**
	 * Le message réellement envoyé au modèle pour ce tour (notes + résultats d'outils + question) ET
	 * les fiches qui y sont entrées. L'historique affiché, lui, garde la question seule.
	 * Les deux sortent du MÊME appel : une seconde sélection « pour les sources » pourrait diverger
	 * de celle qui a nourri le prompt, et une traçabilité approximative ne trace rien.
	 * `toolBlock` (0.2.0) : les résultats d'outils déjà exécutés pour ce tour (cf. ./tools.ts) —
	 * ils sont injectés ICI pour que les deux surfaces composent le tour au même endroit.
	 */
	userTurn: (q: string, toolBlock?: string) => { text: string; sources: Source[]; conversationnel: boolean };
	/** Tours de démonstration épinglés en tête du prompt (jamais élagués). */
	pinned: Msg[];
} {
	// L'outil 'date' vit dans le prompt SYSTÈME : la ligne est stable sur la journée, donc le
	// préfixe KV survit d'un tour à l'autre — même choix que l'app (ChatApp.tsx).
	const outilsDeclares = normalizeTools(cfg.tools);
	const dateLine = hasDateTool(outilsDeclares) ? dateSystemLine(estFr(cfg)) : '';
	const base = (cfg.system || 'You are a helpful assistant.') + (outilsDeclares.length ? GUARDRAILS_OUTILS : GUARDRAILS) + dateLine;
	const epingler = (ex: { user: string; assistant: string }[]): Msg[] =>
		ex.flatMap((e) => [{ role: 'user' as const, content: e.user }, { role: 'assistant' as const, content: e.assistant }]);
	// Des outils déclarés = la forme crochet à DÉMONTRER (cf. toolExamples) : mesuré au banc
	// sdk-tools.mjs, sans démonstration le modèle répond « I don't have access to real-time
	// inventory » à côté d'une note qui contient justement le stock.
	const exemplesOutils = outilsDeclares.length ? toolExamples(estFr(cfg)) : [];
	// Sans documents, il n'y a ni fiche ni consigne de refus : rien à rattraper, `conversationnel` est
	// faux et le filet ne s'arme pas. Un assistant sans base de connaissance a le droit de dire
	// qu'il ne sait pas — c'est même tout ce qu'il peut faire.
	if (!cfg.knowledge) {
		return {
			system: () => base,
			userTurn: (q, toolBlock) => ({ text: toolBlock ? `${q}\n\n${toolBlock}` : q, sources: [], conversationnel: false }),
			pinned: epingler([...exemplesOutils, ...(cfg.examples || [])]),
		};
	}
	const chunks: Chunk[] = chunkDocuments(normalizeDocs(cfg.knowledge));
	const budget = cfg.knowledgeBudget ?? 1200;
	const isFr = estFr(cfg);
	const consigne = isFr
		? base + '\n\nLe message utilisateur peut inclure des fiches de référence entre des balises ---. Dans ce cas, réponds uniquement à partir de ces fiches en citant fidèlement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n’as pas cette information.'
		: base + '\n\nThe user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.';
	return {
		system: () => consigne,
		userTurn: (q: string, toolBlock?: string) => {
			const retenus = selectScored(q, chunks, budget);
			// Un outil a répondu et aucune fiche n'est retenue : le tour part SANS le bloc de fiches.
			// Sinon, buildKnowledgeBlock émettrait sa consigne de refus (« dis que tu n'as pas cette
			// information ») à côté d'un résultat qu'on demande justement d'utiliser — deux consignes
			// contradictoires, et à 230M c'est la dernière lue qui gagne.
			if (toolBlock && !retenus.length) {
				return { text: `${q}\n\n${toolBlock}`, sources: [], conversationnel: false };
			}
			const b = buildKnowledgeBlock(retenus.map((x) => x.chunk), q, isFr).trim();
			// Bloc vide (salutation, ou aucun passage au-dessus du seuil) : AUCUNE source. Ce qui est
			// annoncé comme source doit être ce que le modèle a lu, pas ce qui a failli être retenu.
			const avecOutils = (texte: string) => (toolBlock ? `${texte}\n\n${toolBlock}` : texte);
			return {
				text: b ? `${avecOutils(b)}\n\nQuestion: ${q}` : avecOutils(q),
				sources: b ? retenus.map(({ chunk, score }) => ({ title: chunk.title, text: chunk.text, score, doc: chunk.doc })) : [],
				// Le tour est CONVERSATIONNEL quand aucun passage n'a été retenu et que le message n'est
				// pas une demande d'information : c'est le seul cas où un refus est certainement faux,
				// puisque la consigne envoyée disait justement qu'aucune fiche n'était nécessaire.
				conversationnel: !retenus.length && !looksLikeFactQuestion(q),
			};
		},
		pinned: epingler([...knowledgeExamples(isFr), ...exemplesOutils, ...(cfg.examples || [])]),
	};
}

// Exemples ÉPINGLÉS quand des outils sont déclarés — le pendant outil de knowledgeExamples, pour la
// même raison mesurée (sdk-tools.mjs, 2026-08-24) : la calculatrice passait (ancre lexicale forte)
// mais un outil custom « stock » recevait « I don't have access to real-time inventory data » à
// côté d'une note qui contenait précisément le stock. À 230M, DÉCRIRE échoue, MONTRER fonctionne.
// Les tours sont FABRIQUÉS par formatToolBlock, celui-là même qui construit les vrais tours : la
// dérive exemple/prompt est impossible par construction (même principe que knowledgeExamples).
// Les valeurs sont volontairement différentes de tout cas réel : on démontre l'OPÉRATION (recopier
// le fait du crochet), pas une réponse à réciter.
function toolExamples(fr = false): { user: string; assistant: string }[] {
	const tour = (q: string, notes: ToolNote[]) => `${q}\n\n${formatToolBlock(notes, fr)}`;
	if (fr) {
		return [
			{
				user: tour('Combien font 45*3 ?', [{ name: 'calculatrice', result: '45*3 = 135' }]),
				assistant: '45*3 = 135.',
			},
			{
				user: tour('Il vous en reste en rayon ?', [{ name: 'rayon', result: '3 exemplaires en rayon' }]),
				assistant: 'Oui — il en reste 3 exemplaires en rayon.',
			},
		];
	}
	return [
		{
			user: tour('What is 45*3?', [{ name: 'calculator', result: '45*3 = 135' }]),
			assistant: '45*3 = 135.',
		},
		{
			user: tour('Do you still have some on the shelf?', [{ name: 'shelf', result: '3 items on the shelf' }]),
			assistant: 'Yes — 3 items are on the shelf.',
		},
	];
}

// Exemples ÉPINGLÉS quand des documents sont fournis. Ce ne sont pas des fioritures : sur le modèle
// par défaut (230M), la consigne écrite ne suffit pas — mesuré, il refusait « je n'ai pas cette
// information » alors que le passage contenant la réponse était juste au-dessus. La leçon est déjà
// dans le moteur (cf. Lfm2Model.classify) : à cette taille, DÉCRIRE le comportement échoue, le
// MONTRER fonctionne.
function knowledgeExamples(fr = false): { user: string; assistant: string }[] {
	// Les tours de démonstration sont FABRIQUÉS par buildKnowledgeBlock, celui-là même qui construit
	// les vrais tours. Ils étaient écrits à la main et avaient dérivé : ils montraient les notes SANS
	// la ligne de consigne qui les précède en vrai. À 230 M, l'appariement se fait sur la surface —
	// une forme jamais démontrée est une forme jamais suivie. Passer par le builder rend la dérive
	// impossible : changer le format du bloc met les exemples à jour du même geste.
	const note = (title: string, text: string): Chunk => ({ title, text, doc: 0 });
	const tour = (notes: Chunk[], q: string) => `${buildKnowledgeBlock(notes, undefined, fr).trim()}\n\nQuestion: ${q}`;
	// Variante qui PASSE la question au builder. Sans fiche, le bloc n'est plus unique : une demande
	// d'information hors fiches reçoit un refus, un message de conversation reçoit une consigne de
	// conversation (cf. looksLikeFactQuestion). Un exemple doit donc montrer la consigne QU'IL
	// accompagne vraiment — sinon on démontre une forme que le modèle ne verra jamais.
	const tourAvecQuestion = (notes: Chunk[], q: string) => `${buildKnowledgeBlock(notes, q, fr).trim()}\n\nQuestion: ${q}`;

	// Les VALEURS des exemples sont volontairement différentes de celles d'une vraie base : on montre
	// l'OPÉRATION (aller chercher la bonne ligne, choisir le bon nombre), pas une réponse à recopier.
	// ⚠️ SOUPÇON NON TRANCHÉ (2026-09-28) : ces exemples sont du MÊME domaine que la boutique du banc
	// (public/sdk-demo.html vend des chaussures ; « I wear a 42 » y est la question de l'exemple à un
	// chiffre près). Remplacés par des tarifs de groupe de même forme, sdk-rag passe de 12/12 · 12/12 à
	// 10/12 · 9/12 (bras alternés, 230M), et les échecs sont PILE les opérations démontrées. Aide réelle
	// ou réponse soufflée ? Un banc à une boutique ne peut pas le dire : à trancher sur un banc
	// multi-domaines avant de toucher ces exemples (variante : ~/.cache/brimkern-train/prompting-tarifs-groupe.ts, ROADMAP § 22).
	if (fr) {
		return [
			{ user: 'Bonjour !', assistant: 'Bonjour ! Comment puis-je vous aider ?' },
			// Lecture d'une ligne de tableau. Sans cet exemple, « je fais du 42, quelle taille en cm ? »
			// rendait « Le 42 est une taille en cm » : le modèle voyait le tableau et ne savait pas
			// qu'on attendait qu'il y prenne UNE ligne (mesuré, scripts/e2e/sdk-rag.mjs).
			{
				// La fiche de l'exemple a la MÊME FORME qu'une vraie : liste à puces, deux-points, et une
				// colonne parasite entre parenthèses. Démontrée sur un tableau en ligne sans parenthèse,
				// l'opération ne se transférait pas : le modèle répondait « La pointure 42 correspond à
				// une taille de chaussures : US 43 » — mauvaise colonne ET mauvaise ligne (3 tirs sur 3).
				user: tour([note('Guide des tailles', 'Tableau des correspondances :\n- Pointure EU 38 : 24,0 cm (US 6,5)\n- Pointure EU 39 : 24,5 cm (US 7,0)\n- Pointure EU 41 : 26,0 cm (US 8,0)')], 'Je fais du 41, quelle taille en cm ?'),
				assistant: 'La pointure 41 correspond à 26,0 cm.',
			},
			// Deux nombres dans la même fiche : il faut celui de la QUESTION. Sans cet exemple, « combien
			// de temps pour retourner un article ? » répondait avec le délai de remboursement.
			{
				user: tour([note('Retours', 'Les retours sont gratuits sous 14 jours. Le remboursement est effectué sous 3 jours ouvrés.')], 'Combien de temps pour retourner un article ?'),
				assistant: 'Vous disposez de 14 jours pour retourner un article.',
			},
			{
				user: tour([], 'Qui a gagné la Coupe du Monde 1998 ?'),
				assistant: 'Je n’ai pas cette information dans mes fiches.',
			},
			// Et le pendant, qui manquait : un message qui n'appelle aucune fiche et qui n'est pas une
			// demande d'information. Sans cet exemple, le modèle n'avait sous les yeux qu'UNE façon de
			// répondre sans fiche — le refus — et il la recopiait sur « AIDEZ-MOI » comme sur « ça va ? »
			// (banc sdk-dialogue.mjs : 3/11, puis 9/11 avec la seule consigne, les deux échecs restants
			// étant de la mimétique pure). La question de l'exemple est volontairement DIFFÉRENTE de
			// celles du banc : on démontre la forme, on ne fait pas apprendre une réponse.
			{
				user: tourAvecQuestion([], 'Tu es un robot ?'),
				assistant: 'Je suis un assistant automatique, oui. Comment puis-je vous aider ?',
			},
		];
	}
	return [
		{ user: 'Hello!', assistant: 'Hello! How can I help you today?' },
		{
			user: tour([note('Size guide', 'Size conversions:\n- Size EU 38: 24.0 cm (US 6.5)\n- Size EU 39: 24.5 cm (US 7.0)\n- Size EU 41: 26.0 cm (US 8.0)')], 'I wear a 41, what is that in cm?'),
			assistant: 'A size 41 is 26.0 cm.',
		},
		{
			user: tour([note('Returns', 'Returns are free within 14 days. Refunds are issued within 3 working days.')], 'How long do I have to return an item?'),
			assistant: 'You have 14 days to return an item.',
		},
		{
			user: tour([], 'Who won the 1998 World Cup?'),
			assistant: 'I do not have that information in my notes.',
		},
		{
			user: tourAvecQuestion([], 'Are you a robot?'),
			assistant: 'I am an automated assistant, yes. How can I help?',
		},
	];
}

