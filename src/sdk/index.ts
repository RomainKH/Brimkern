// Brimkern SDK — IA on-device embarquable. Un <script> + Brimkern.embed({...}) monte un widget de
// chat qui tourne un modèle .brik sur le GPU DU VISITEUR (zéro serveur, zéro coût d'inférence, privé,
// offline après le 1er chargement). Réutilise le moteur WGSL + Lfm2Model + le chargeur BRIK de l'app.
// Bundlé en public/sdk.js par scripts/build-sdk.mjs (esbuild IIFE). Le tokenizer (transformers.js) est
// chargé depuis un CDN à l'engagement pour garder sdk.js léger ; le MODÈLE et le calcul restent locaux.
//
// Deux surfaces :
//  - Brimkern.embed(cfg)          → le widget de chat clé en main (DOM). Rend une POIGNÉE :
//    open/close/toggle, ask(), setHistory(), setKnowledge(), on(), destroy().
//  - Brimkern.createSession(cfg)  → API programmatique sans DOM : session.ask()/reset()/destroy(),
//    setHistory()/setKnowledge()/on()/lastSources, plus Brimkern.generate() (one-shot),
//    Brimkern.preload() et Brimkern.status().
// Les deux surfaces PARTAGENT tout ce qui compte : composition du prompt, sélection des fiches,
// températures, événements. Une seule implémentation par comportement — sinon la surface non
// mesurée dérive de la surface mesurée (c'était le cas de la température, alignée en 0.1.3).
// Le MOTEUR est un singleton par URL de modèle : N widgets/sessions = 1 seule init WebGPU,
// un seul jeu de poids en VRAM (les embed() multiples ré-initialisaient tout — cause de
// saturations GPU constatées en prod, 2026-07-29).

import { chunkDocuments, selectScored, buildKnowledgeBlock, normalizeDocs, type Chunk } from './knowledge';
// Le moteur vit dans ./engineCore (aucun DOM) et tourne, par défaut, dans un Web Worker
// (./workerBackend). index.ts ne garde que le widget, la composition de prompt et l'API publique.
import { resolveModelUrl, type Msg, type LoadProgress } from './engineCore';
import { pickBackend, type EngineBackend, type TurnRequest } from './backend';
import { setWorkerScriptUrl } from './selfUrl';

// `Msg` est public depuis 0.1.3 : l'historique est INJECTABLE (SessionConfig.history), donc son
// type doit être nommable par l'intégrateur qui le range dans un localStorage.
export type { LoadProgress, Msg };

// ── Contexte WORKER ─────────────────────────────────────────────────────────────────────────────
// Ce même bundle est chargé dans le Web Worker par `importScripts` (cf. workerBackend.ts : c'est le
// seul moyen d'exécuter du code cross-origin dans un worker). On détecte donc le côté où l'on se
// trouve DÈS le top-level : dans un worker, on installe l'hôte de messages et on ne fait rien
// d'autre — pas de widget, pas de window.Brimkern (il n'y a ni DOM ni window).
const DANS_UN_WORKER = typeof self !== 'undefined'
  && typeof (self as any).importScripts === 'function'
  && typeof document === 'undefined';
if (DANS_UN_WORKER) void import('./engineWorker');

// ── Backend d'inférence : worker par défaut, thread principal en repli ──────────────────────────
// Créé PARESSEUSEMENT (au premier preload/ask), pas au chargement du script : une page qui pose la
// balise <script> sans que personne n'ouvre le widget ne doit démarrer aucun worker.
let backendPromise: Promise<EngineBackend> | null = null;
let backendNow: EngineBackend | null = null;
let workerPref: boolean | undefined;
function backend(): Promise<EngineBackend> {
  if (!backendPromise) backendPromise = pickBackend(workerPref).then((b) => (backendNow = b, b));
  return backendPromise;
}
/** Où tourne réellement l'inférence — pour le diagnostic et les bancs. */
export const runtime = (): 'worker' | 'main' | 'pending' => backendNow?.kind ?? 'pending';
// Le choix ne vaut que TANT QUE le backend n'existe pas : une fois créé, il est partagé par tous les
// widgets et sessions de la page (un seul worker, un seul jeu de poids en VRAM). On le dit plutôt
// que de laisser croire qu'un second embed() peut changer d'avis.
function appliquerOptions(cfg: { worker?: boolean; workerUrl?: string }): void {
  if (cfg.workerUrl) setWorkerScriptUrl(cfg.workerUrl);
  if (cfg.worker === undefined) return;
  if (backendPromise && workerPref !== cfg.worker) {
    console.warn('[brimkern] option `worker` ignorée : le backend est déjà démarré et partagé par la page.');
    return;
  }
  workerPref = cfg.worker;
}

// Repli UNIQUEMENT (tokenizer.json non-BPE) : le chemin nominal est le BpeTokenizer BUNDLÉ —
// vérifié token-exact vs transformers.js (scripts/test-bpe-tokenizer.cjs). Fini la dépendance
// réseau tierce sur le chemin critique (hors-ligne réel, CSP hôte stricte OK).

// Cadrage appliqué après le prompt de l'intégrateur — VOLONTAIREMENT court : sur un 230M,
// une liste de règles détaillées DÉGRADE (banc 2026-07-22 : « reply only to the last
// message » → le modèle se met à répéter le message en écho). Trois consignes simples :
// pas d'outils (tool-calling halluciné), honnêteté (pas de faits inventés), concision.
const GUARDRAILS =
  '\nAnswer briefly and honestly. If you do not know something, say so: never invent facts or details.' +
  '\nYou have no tools and no internet access: never emit tool calls, reply in plain text only.';

export interface EmbedConfig {
  model?: string;       // clé de MODELS ou URL .brik directe (défaut : lfm2.5-230m)
  system?: string;      // prompt système = le comportement de l'assistant
  title?: string;       // titre du panneau
  greeting?: string;    // 1er message de l'assistant
  accent?: string;      // couleur d'accent (défaut rouge Brimkern)
  maxTokens?: number;   // plafond de génération par réponse
  // Mêmes documents de connaissance que la session programmatique (cf. SessionConfig.knowledge) :
  // c'est le cas d'usage principal du widget — répondre sur le contenu du site qui l'héberge.
  knowledge?: SessionConfig['knowledge'];
  knowledgeBudget?: number;
  examples?: SessionConfig['examples'];  // few-shot : le seul levier de TON efficace sur un 230M
  // Langue des consignes, des exemples ET DES LIBELLÉS du widget (placeholder, mention « IA
  // locale », bulles de statut, messages d'erreur) ; devinée du prompt système si absente.
  lang?: SessionConfig['lang'];
  worker?: SessionConfig['worker'];
  workerUrl?: SessionConfig['workerUrl'];
  // Conversation de départ — l'exacte contrepartie de `widget.history` : on relit ce qu'on a rangé
  // (localStorage, base côté hôte) et le visiteur retrouve son fil après un rechargement.
  // Quand elle n'est pas vide, `greeting` est IGNORÉ : un accueil suivi d'un fil déjà entamé sonne
  // faux, et un tour d'assistant de plus dans la fenêtre pousse la vraie conversation dehors.
  history?: Msg[];
  // Affiche, sous chaque réponse, les fiches qui l'ont produite. Faux par défaut : c'est un
  // changement d'aspect du widget, il ne s'impose pas à qui met simplement à jour sa balise
  // <script>. Les mêmes données sont disponibles sans affichage via l'événement `message`.
  showSources?: boolean;
}

export interface SessionConfig {
  model?: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  // Exemples FEW-SHOT (tours user/assistant de démonstration). Épinglés en tête de chaque prompt,
  // jamais élagués par la fenêtre d'historique. C'est la forme instruct-native de LFM2.5 et le seul
  // levier efficace pour lui faire tenir un style : sur un 230M, DÉCRIRE le style dans le prompt
  // système ne suffit pas (il paraphrase la consigne) — le MONTRER fonctionne (cf. Lfm2Model.classify,
  // bancs q4 2026-07-21). 2 à 3 exemples suffisent ; au-delà on paye du prefill pour rien.
  examples?: { user: string; assistant: string }[];
  // DOCUMENTS DE CONNAISSANCE — « l'assistant répond sur MON contenu ».
  // Une chaîne, un objet { title, text }, ou un tableau des deux. Ils sont découpés en passages une
  // fois, puis à CHAQUE question on n'injecte que les 1 à 3 passages les plus proches : le modèle
  // par défaut est un 230M à fenêtre courte, lui verser tout un site dégrade la réponse au lieu de
  // l'améliorer. Rien ne part sur un réseau — le tri est lexical et local (cf. ./knowledge.ts).
  knowledge?: string | { title?: string; text: string } | Array<string | { title?: string; text: string }>;
  // Budget de caractères des passages injectés par tour (défaut 1200 ≈ 300 tokens).
  knowledgeBudget?: number;
  // LANGUE des consignes, des exemples de démonstration et — pour embed() — des LIBELLÉS du widget
  // ('fr' | 'en'). Absente, elle est DEVINÉE
  // depuis le prompt système (accents, quelques mots courants) — ce qui suffit dans la pratique mais
  // reste une heuristique : un prompt français sans accent ni mot repère basculerait en anglais, et
  // le modèle par défaut répond alors dans la langue de la consigne, pas de la question. À déclarer
  // explicitement si votre prompt est atypique.
  lang?: 'fr' | 'en';
  // Inférence dans un Web Worker. **Défaut : false**, et c'est un choix mesuré, pas un oubli : sur
  // le modèle par défaut (230M), le banc ne relève AUCUNE frame perdue sur la page hôte dans l'un ou
  // l'autre bras — la boucle de décodage attend un readback GPU par token et rend donc la main au
  // navigateur. Le worker n'avait rien à débloquer. `true` l'active (débit identique, mesuré) : à
  // envisager pour un modèle plus gros, une machine lente ou une page hôte chargée. Détail de la
  // mesure dans ./backend.ts.
  worker?: boolean;
  // URL du fichier sdk.js à charger dans le worker. Déduite de <script src> automatiquement ; à
  // fournir seulement si le SDK est importé par un bundler (il n'y a alors pas de currentScript).
  workerUrl?: string;
  // Historique de départ (cf. EmbedConfig.history). Les tours invalides sont ignorés en silence
  // plutôt que de faire échouer la création : ce qui arrive ici vient souvent d'un stockage
  // persistant écrit par une version antérieure de l'hôte.
  history?: Msg[];
}

export interface AskOptions {
  onToken?: (text: string) => void; // streaming : texte cumulé nettoyé
  signal?: AbortSignal;             // annulation (le tour user est retiré de l'historique)
  // Les fiches retenues pour CE tour, livrées AVANT la génération (la sélection est locale et
  // instantanée) : de quoi afficher « d'après ces fiches… » pendant que la réponse s'écrit.
  onSources?: (sources: Source[]) => void;
}

// ── TRAÇABILITÉ ─────────────────────────────────────────────────────────────────────────────────
// Ce que le modèle a RÉELLEMENT lu pour ce tour. Sans ça, « pourquoi a-t-il répondu ça ? » n'a pas
// de réponse : le tri des fiches est local, silencieux, et c'était le seul maillon de la chaîne
// qu'un intégrateur ne pouvait ni afficher ni déboguer. Une réponse sourcée est aussi une réponse
// vérifiable par le visiteur — le seul antidote honnête à un modèle de 230 M qui se trompe.
export interface Source {
  /** Titre du document d'origine ('' si l'intégrateur n'en a pas donné). */
  title: string;
  /** Le passage, tel qu'il a été injecté dans le prompt. */
  text: string;
  /** Score de proximité lexicale avec la question (recouvrement pondéré par l'idf). */
  score: number;
  /** Index du document dans le `knowledge` fourni. */
  doc: number;
}

// ── ÉVÉNEMENTS ──────────────────────────────────────────────────────────────────────────────────
// Le widget était une boîte noire : l'hôte ne pouvait ni mesurer l'engagement, ni journaliser une
// conversation, ni même APPRENDRE que WebGPU manquait chez un visiteur — l'erreur mourait dans une
// bulle. Un widget qu'on ne peut pas observer est un widget qu'on ne déploie pas.
export interface BrimkernEvents {
  /** Le modèle est chargé et prêt à générer (une seule fois par surface). */
  ready: () => void;
  /** Progression du chargement : clé de phase stable ('init'|'download'|'tokenizer'|'gpu') + octets. */
  progress: (phase: string, progress?: LoadProgress) => void;
  open: () => void;
  close: () => void;
  /**
   * Un tour, à mesure qu'il se produit — la question DÈS l'envoi, la réponse quand elle est
   * complète. `sources` accompagne les deux quand des fiches ont servi.
   */
  message: (msg: { role: 'user' | 'assistant'; content: string; sources?: Source[] }) => void;
  /** Une génération ou un chargement a échoué. L'erreur est AUSSI levée côté appelant pour `ask()`. */
  error: (err: Error) => void;
}

export type BrimkernEvent = keyof BrimkernEvents;

interface Emitter {
  on<K extends BrimkernEvent>(event: K, cb: BrimkernEvents[K]): () => void;
  emit<K extends BrimkernEvent>(event: K, ...args: Parameters<BrimkernEvents[K]>): void;
  clear(): void;
}

function createEmitter(): Emitter {
  const abonnes = new Map<BrimkernEvent, Set<(...a: any[]) => void>>();
  return {
    on(event, cb) {
      let set = abonnes.get(event);
      if (!set) abonnes.set(event, (set = new Set()));
      set.add(cb as any);
      // Rend un désabonnement plutôt que d'exiger un `off(event, cb)` : dans un effet React, la
      // fonction de nettoyage est exactement ce qu'on veut rendre, et on ne peut pas se tromper de
      // référence de callback.
      return () => { set!.delete(cb as any); };
    },
    emit(event, ...args) {
      const set = abonnes.get(event);
      if (!set) return;
      // Un écouteur qui lève ne doit PAS interrompre une génération en cours : le code de l'hôte
      // n'est pas notre code, et une erreur d'analytics ne peut pas casser le widget.
      for (const cb of [...set]) {
        try { (cb as (...a: any[]) => void)(...args); }
        catch (e) { console.error('[brimkern] écouteur `' + event + '` a levé :', e); }
      }
    },
    clear() { abonnes.clear(); },
  };
}

// Ce qui arrive dans `history` vient souvent d'un stockage persistant : on garde les tours
// exploitables et on jette le reste EN SILENCE. Faire échouer le montage d'un widget parce qu'un
// enregistrement du mois dernier a un champ de trop serait une punition sans rapport avec la faute.
// La fenêtre de contexte, elle, est bornée en aval (HISTORY_WINDOW, cf. engineCore) : inutile de
// tronquer ici, un long historique reste utile à l'AFFICHAGE.
function sanitizeHistory(input: unknown): Msg[] {
  if (!Array.isArray(input)) return [];
  const out: Msg[] = [];
  for (const m of input) {
    const role = (m as any)?.role;
    const content = (m as any)?.content;
    if ((role === 'user' || role === 'assistant') && typeof content === 'string' && content.trim()) {
      out.push({ role, content });
    }
  }
  return out;
}


// ── LANGUE DE LA SESSION ────────────────────────────────────────────────────────────────────────
// `lang` déclaré fait foi ; sinon on devine depuis le prompt système. L'heuristique cherche des
// accents ou des mots français fréquents, bornés par \b, sans quoi « aide » matchait à l'intérieur
// de mots anglais (« maiden »). Elle était enfermée dans makeSystemBuilder alors que le WIDGET en a
// besoin lui aussi (ses libellés) : une seule règle, un seul endroit.
function estFr(cfg: Pick<SessionConfig, 'lang' | 'system'>): boolean {
	if (cfg.lang) return cfg.lang === 'fr';
	return cfg.system
		? /[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(cfg.system)
		: false;
}

// ── LIBELLÉS DU WIDGET ──────────────────────────────────────────────────────────────────────────
// Ils étaient écrits en français DANS LE CODE : un site anglais qui posait la balise <script>
// recevait un widget français (placeholder « Écris un message… », mention « aucune donnée envoyée »)
// — cassé pour ses visiteurs, et cassé pour la démo /sdk-demo passée à l'anglais par défaut le
// 2026-08-20. Ils suivent maintenant la MÊME langue que les consignes (`lang`, devinée à défaut) :
// une seule option à déclarer pour que tout le widget parle la langue de la page.
const LIBELLES = {
	en: {
		ouvrir: 'Open the chat',
		fermer: 'Close',
		placeholder: 'Type a message…',
		note: 'Local AI — runs on your GPU, nothing is sent anywhere.',
		erreur: 'Error: ',
		vide: 'Sorry, I can only answer in plain text here: could you rephrase?',
		mo: 'MB',
		sources: 'Sources:',
		// Les clés de phase viennent du moteur (cf. LoadPhase dans engineCore).
		phases: { init: 'Starting up…', download: 'downloading the model…', tokenizer: 'tokenizer…', gpu: 'weights to the GPU…' },
		erreurs: { 'no-webgpu': 'This browser does not support WebGPU: the local assistant cannot run here.' },
	},
	fr: {
		ouvrir: 'Ouvrir le chat',
		fermer: 'Fermer',
		placeholder: 'Écris un message…',
		note: 'IA locale — tourne sur votre GPU, aucune donnée envoyée.',
		erreur: 'Erreur : ',
		vide: 'Désolé, je ne peux répondre qu’en texte simple ici : pouvez-vous reformuler ?',
		mo: 'Mo',
		sources: 'Sources :',
		phases: { init: 'initialisation…', download: 'téléchargement du modèle…', tokenizer: 'tokenizer…', gpu: 'poids sur le GPU…' },
		erreurs: { 'no-webgpu': 'Ce navigateur ne prend pas en charge WebGPU : l’assistant local ne peut pas tourner ici.' },
	},
} as const;

type Libelles = typeof LIBELLES['en' | 'fr'];
// Une phase inconnue s'affiche TELLE QUELLE plutôt que de disparaître : si le moteur en ajoute une,
// le widget la montre en clair au lieu de vider la bulle de statut.
const phrasePhase = (L: Libelles, phase: string): string =>
	(L.phases as Record<string, string>)[phase] ?? phase;
// Un code d'erreur connu est traduit ; sinon on montre le message du moteur tel quel — un
// diagnostic exact (« tenseur absent : … ») vaut mieux qu'une formule générique traduite.
const phraseErreur = (L: Libelles, e: any): string =>
	(e?.code && (L.erreurs as Record<string, string>)[e.code]) || e?.message || String(e);

// notes.
function makeSystemBuilder(cfg: Pick<SessionConfig, 'system' | 'knowledge' | 'knowledgeBudget' | 'examples' | 'lang'>): {
	system: (q: string) => string;
	/**
	 * Le message réellement envoyé au modèle pour ce tour (notes + question) ET les fiches qui y
	 * sont entrées. L'historique affiché, lui, garde la question seule.
	 * Les deux sortent du MÊME appel : une seconde sélection « pour les sources » pourrait diverger
	 * de celle qui a nourri le prompt, et une traçabilité approximative ne trace rien.
	 */
	userTurn: (q: string) => { text: string; sources: Source[] };
	/** Tours de démonstration épinglés en tête du prompt (jamais élagués). */
	pinned: Msg[];
} {
	const base = (cfg.system || 'You are a helpful assistant.') + GUARDRAILS;
	const epingler = (ex: { user: string; assistant: string }[]): Msg[] =>
		ex.flatMap((e) => [{ role: 'user' as const, content: e.user }, { role: 'assistant' as const, content: e.assistant }]);
	if (!cfg.knowledge) return { system: () => base, userTurn: (q) => ({ text: q, sources: [] }), pinned: epingler(cfg.examples || []) };
	const chunks: Chunk[] = chunkDocuments(normalizeDocs(cfg.knowledge));
	const budget = cfg.knowledgeBudget ?? 1200;
	const isFr = estFr(cfg);
	const consigne = isFr
		? base + '\n\nLe message utilisateur peut inclure des fiches de référence entre des balises ---. Dans ce cas, réponds uniquement à partir de ces fiches en citant fidèlement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n’as pas cette information.'
		: base + '\n\nThe user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.';
	return {
		system: () => consigne,
		userTurn: (q: string) => {
			const retenus = selectScored(q, chunks, budget);
			const b = buildKnowledgeBlock(retenus.map((x) => x.chunk), q, isFr).trim();
			// Bloc vide (salutation, ou aucun passage au-dessus du seuil) : AUCUNE source. Ce qui est
			// annoncé comme source doit être ce que le modèle a lu, pas ce qui a failli être retenu.
			return {
				text: b ? `${b}\n\nQuestion: ${q}` : q,
				sources: b ? retenus.map(({ chunk, score }) => ({ title: chunk.title, text: chunk.text, score, doc: chunk.doc })) : [],
			};
		},
		pinned: epingler([...knowledgeExamples(isFr), ...(cfg.examples || [])]),
	};
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

	// Les VALEURS des exemples sont volontairement différentes de celles d'une vraie base : on montre
	// l'OPÉRATION (aller chercher la bonne ligne, choisir le bon nombre), pas une réponse à recopier.
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
	];
}

// ── API programmatique : sessions sans DOM ──
export interface BrimkernSession {
  ask(text: string, opts?: AskOptions): Promise<string>;
  reset(): void;    // vide l'historique, GARDE le moteur chargé
  destroy(): void;
  readonly history: Msg[];
  /**
   * Remplace l'historique — la reprise d'une conversation rangée ailleurs (localStorage, base de
   * l'hôte). Les tours invalides sont ignorés. Lève pendant une génération : la boucle en cours
   * s'appuie sur la dernière entrée de l'historique pour se rétracter en cas d'échec.
   */
  setHistory(msgs: Msg[]): void;
  /**
   * Remplace les documents de connaissance SANS perdre la conversation. Le découpage est refait ici
   * (une fois), le moteur et les poids ne bougent pas. Avant, il fallait détruire la session et en
   * créer une autre — c'est-à-dire jeter le fil pour mettre un catalogue à jour.
   */
  setKnowledge(knowledge: SessionConfig['knowledge']): void;
  /** Les fiches du dernier tour (cf. `Source`). Vide si aucune n'a servi. */
  readonly lastSources: Source[];
  /** S'abonner ; rend la fonction de désabonnement. Événements : ready, progress, message, error. */
  on<K extends 'ready' | 'progress' | 'message' | 'error'>(event: K, cb: BrimkernEvents[K]): () => void;
}

function createSession(cfg: SessionConfig = {}): BrimkernSession {
  appliquerOptions(cfg);
  const url = resolveModelUrl(cfg.model);
  const maxTokens = cfg.maxTokens || 220;
  // Découpage fait UNE FOIS ici (coût en O(taille des documents), aucune raison de le repayer à
  // chaque question) ; la sélection, elle, dépend de la question. `let` depuis setKnowledge().
  let knowledge = cfg.knowledge;
  let promptOf = makeSystemBuilder(cfg);
  let history: Msg[] = sanitizeHistory(cfg.history);
  let lastSources: Source[] = [];
  const bus = createEmitter();
  let busy = false;
  let destroyed = false;
  let annonce = false; // `ready` n'est émis qu'une fois par session
  // Température : celle qui est déclarée, sinon 0,25 s'il y a des fiches et 0,55 sinon. La session
  // était figée à 0,55 quoi qu'il arrive alors que le widget descendait à 0,25 avec des fiches —
  // deux surfaces, deux comportements, une seule mesure : à 0,55, la lecture d'une ligne de tableau
  // partait une fois sur trois sur la mauvaise colonne. Le même prompt doit se conduire pareil des
  // deux côtés. Recalculée à chaque tour parce que setKnowledge() peut en changer la réponse.
  const temperature = () => cfg.temperature ?? (knowledge ? 0.25 : 0.55);
  const refuseSiOccupe = (quoi: string) => {
    if (busy) throw new Error(`brimkern: ${quoi} impossible pendant une génération`);
  };

  return {
    async ask(text: string, opts: AskOptions = {}): Promise<string> {
      if (destroyed) throw new Error('session détruite');
      if (busy) throw new Error('génération déjà en cours sur cette session');
      busy = true;
      history.push({ role: 'user', content: text });
      bus.emit('message', { role: 'user', content: text });
      try {
        // Le dernier tour part AUGMENTÉ des notes ; `history` (affiché, et réutilisé aux tours
        // suivants) garde la question seule — sinon les notes s'accumuleraient dans le contexte.
        const { text: augmente, sources } = promptOf.userTurn(text);
        lastSources = sources;
        opts.onSources?.(sources);
        const envoye = [...history.slice(0, -1), { role: 'user' as const, content: augmente }];
        const b = await backend();
        // Le chargement passe par preload() (idempotent) AVANT le tour, au lieu de rester implicite
        // dans turn() : c'est le seul moyen de rendre la progression observable côté session. Un
        // premier ask() téléchargeait 149 Mo sans qu'aucun callback ne puisse le dire.
        await b.preload(url, (phase, pr) => bus.emit('progress', phase, pr));
        if (!annonce) { annonce = true; bus.emit('ready'); }
        const req: TurnRequest = { url, history: envoye, system: promptOf.system(text), maxTokens, temperature: temperature(), pinned: promptOf.pinned };
        const acc = await b.turn(req, opts.onToken, opts.signal);
        if (opts.signal?.aborted) { history.pop(); return ''; } // tour annulé : l'historique reste propre
        history.push({ role: 'assistant', content: acc });
        bus.emit('message', { role: 'assistant', content: acc, sources });
        return acc;
      } catch (e) {
        history.pop(); // le tour user n'a pas abouti
        // Émis ET relevé : l'appelant de ask() a son `catch`, mais un abonné `error` (journalisation,
        // supervision) doit voir la panne sans avoir à envelopper chaque appel.
        bus.emit('error', e instanceof Error ? e : new Error(String(e)));
        throw e;
      } finally { busy = false; }
    },
    reset() { history = []; lastSources = []; },
    destroy() { destroyed = true; history = []; lastSources = []; bus.clear(); },
    get history() { return history.slice(); },
    get lastSources() { return lastSources.slice(); },
    setHistory(msgs: Msg[]) { refuseSiOccupe('setHistory'); history = sanitizeHistory(msgs); },
    setKnowledge(k: SessionConfig['knowledge']) {
      refuseSiOccupe('setKnowledge');
      knowledge = k;
      // Reconstruit le builder ENTIER, pas seulement les passages : la présence de fiches change
      // aussi la consigne système et les exemples épinglés (cf. knowledgeExamples).
      promptOf = makeSystemBuilder({ ...cfg, knowledge: k });
      lastSources = [];
    },
    on: bus.on,
  };
}


// ── Widget (DOM vanilla, styles scoppés .bk-*) ──
// L'accent ne s'interpole PLUS dans la feuille de style : il passe par une propriété personnalisée
// posée sur les deux éléments du widget. La feuille était partagée (un seul #bk-style pour la page)
// et injectée une fois, donc le SECOND embed() de la page héritait en silence de la couleur du
// premier — un widget « support » rouge et un widget « ventes » bleu rendaient deux widgets rouges.
// Au passage, plus aucune valeur de l'intégrateur n'entre dans du texte CSS.
function injectStyles() {
  if (document.getElementById('bk-style')) return;
  const s = document.createElement('style');
  s.id = 'bk-style';
  s.textContent = `
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:var(--bk-accent);color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:var(--bk-accent)}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:var(--bk-accent);color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-src{align-self:flex-start;max-width:82%;margin-top:-6px;font-size:10.5px;line-height:1.4;color:#8b887f}
  .bk-src b{font-weight:600;color:#6f6c64}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:var(--bk-accent)}
  .bk-send{background:var(--bk-accent);color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `;
  document.head.appendChild(s);
}

// L'accent finit dans une propriété personnalisée : on ne laisse passer qu'une couleur CSS valide
// (un hôte qui relaierait une entrée utilisateur ne peut pas s'en servir pour sortir de la valeur).
function safeAccent(accent?: string) {
  if (!accent) return '#c72c1e';
  if (/^#[0-9a-fA-F]{3,8}$/.test(accent)) return accent;
  try { if (typeof CSS !== 'undefined' && CSS.supports('color', accent) && !/[{};()]/.test(accent)) return accent; } catch { /* below */ }
  return '#c72c1e';
}

// Ce qu'un widget MONTÉ sait faire. `embed()` n'en expose qu'une façade (cf. BrimkernWidget) parce
// que le montage peut être différé jusqu'à DOMContentLoaded.
interface MountedWidget {
  open(): void;
  close(): void;
  toggle(): void;
  ask(text: string): Promise<string>;
  destroy(): void;
  setKnowledge(k: SessionConfig['knowledge']): void;
  setHistory(msgs: Msg[]): void;
  history(): Msg[];
  el: HTMLElement;
}

function mountWidget(cfg: EmbedConfig, bus: Emitter): MountedWidget {
  let knowledge = cfg.knowledge;
  let promptOf = makeSystemBuilder(cfg);
  const L = LIBELLES[estFr(cfg) ? 'fr' : 'en'];
  const accent = safeAccent(cfg.accent);
  const title = cfg.title || 'Assistant';
  const maxTokens = cfg.maxTokens || 220;
  injectStyles();

  const fab = document.createElement('button');
  fab.className = 'bk-fab'; fab.setAttribute('aria-label', L.ouvrir); fab.textContent = '💬';
  const panel = document.createElement('div');
  panel.className = 'bk-panel';
  fab.style.setProperty('--bk-accent', accent);
  panel.style.setProperty('--bk-accent', accent);
  panel.innerHTML = `
    <div class="bk-hd"><span class="bk-dot"></span><span>${escapeHtml(title)}</span><button class="bk-x" aria-label="${escapeHtml(L.fermer)}">×</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${escapeHtml(L.placeholder)}"></textarea><button class="bk-send">↑</button></div>
    <div class="bk-note">${escapeHtml(L.note)}</div>`;
  document.body.appendChild(fab); document.body.appendChild(panel);

  const msgsEl = panel.querySelector('.bk-msgs') as HTMLElement;
  const inEl = panel.querySelector('.bk-in') as HTMLTextAreaElement;
  const sendEl = panel.querySelector('.bk-send') as HTMLButtonElement;
  const closeEl = panel.querySelector('.bk-x') as HTMLElement;
  let history: Msg[] = sanitizeHistory(cfg.history);
  let busy = false;
  let engaged = false; // le chargement (partagé) n'est rattaché à ce widget qu'à l'engagement
  let detruit = false;
  // Une génération en cours doit S'ARRÊTER quand le widget est démonté : sans ce signal, un
  // changement de route dans un SPA laissait le GPU décoder une réponse que plus personne n'allait
  // lire, et le callback de flux écrivait dans un noeud retiré du document.
  const vie = new AbortController();

  const addBubble = (role: Msg['role'], text: string) => {
    const d = document.createElement('div'); d.className = `bk-m ${role === 'user' ? 'bk-u' : 'bk-a'}`; d.textContent = text;
    msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight; return d;
  };
  // Les titres viennent de l'intégrateur : ils passent par textContent, jamais par innerHTML.
  const addSources = (sources: Source[]) => {
    if (!cfg.showSources || !sources.length) return;
    const d = document.createElement('div');
    d.className = 'bk-src';
    const b = document.createElement('b'); b.textContent = `${L.sources} `;
    d.appendChild(b);
    // Le titre s'il existe, sinon le début du passage : une source sans étiquette lisible n'aide
    // personne, et « [1] » tout seul n'est pas une source.
    d.appendChild(document.createTextNode(
      sources.map((s, i) => `[${i + 1}] ${s.title || s.text.slice(0, 40).replace(/\s+/g, ' ').trim() + '…'}`).join(' · '),
    ));
    msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight;
  };

  // Le fil rendu depuis l'historique : la reprise de conversation, et le rendu initial.
  const render = () => {
    msgsEl.textContent = '';
    for (const m of history) addBubble(m.role, m.content);
  };

  // Accueil SEULEMENT si le fil est vide. Un `greeting` par-dessus une conversation reprise sonne
  // faux — et un tour d'assistant de plus dans une fenêtre courte pousse dehors le vrai contexte.
  if (history.length) render();
  else if (cfg.greeting) { history.push({ role: 'assistant', content: cfg.greeting }); addBubble('assistant', cfg.greeting); }

  // Chargement via le singleton partagé : le clic du fab ET le 1er envoi rattachent LA MÊME
  // promesse ; une bulle de statut suit la progression (et se retire quand le modèle est prêt).
  const url = resolveModelUrl(cfg.model);
  const ensureModel = () => {
    if (!engaged) {
      engaged = true;
      const s = addBubble('assistant', L.phases.init); s.classList.add('bk-status');
      backend()
        .then((b) => b.preload(url, (m, p) => {
          bus.emit('progress', m, p);
          const phase = phrasePhase(L, m);
          s.textContent = p?.total ? `${phase} ${Math.round(p.loaded / 1048576)} / ${Math.round(p.total / 1048576)} ${L.mo}` : phase;
        }))
        .then(() => { s.remove(); bus.emit('ready'); })
        .catch((e) => {
          s.textContent = L.erreur + phraseErreur(L, e); engaged = false;
          // L'échec de chargement restait DANS la bulle : l'hôte n'apprenait jamais que WebGPU
          // manquait chez ses visiteurs. C'est la statistique la plus utile du widget.
          bus.emit('error', e instanceof Error ? e : new Error(String(e)));
        });
    }
    return backend();
  };

  // Un tour complet, pour l'envoi manuel COMME pour widget.ask() : une seule implémentation, sinon
  // l'API programmatique dérive du chemin réellement mesuré.
  const send = async (text: string): Promise<string> => {
    busy = true; sendEl.disabled = true;
    history.push({ role: 'user', content: text }); addBubble('user', text);
    bus.emit('message', { role: 'user', content: text });
    const bubble = addBubble('assistant', '…');
    try {
      await ensureModel();
      const { text: augmente, sources } = promptOf.userTurn(text);
      const envoye = [...history.slice(0, -1), { role: 'user' as const, content: augmente }];
      // Température : 0,55 pour du bavardage, 0,25 dès qu'il y a des fiches. Un assistant qui doit
      // RECOPIER un chiffre d'une note n'a rien à gagner à échantillonner large — et beaucoup à
      // perdre : à 0,55 la lecture d'une ligne de tableau partait une fois sur trois sur la mauvaise
      // colonne, ou recopiait la valeur de l'exemple de démonstration.
      const req: TurnRequest = { url, history: envoye, system: promptOf.system(text), maxTokens, temperature: knowledge ? 0.25 : 0.55, pinned: promptOf.pinned };
      let acc = await (await backend()).turn(req, (t) => {
        bubble.textContent = t || '…'; msgsEl.scrollTop = msgsEl.scrollHeight;
      }, vie.signal);
      if (detruit) return '';
      // Réponse vide (ultra-rare : stop en 1er token) → repli poli plutôt qu'une bulle « (vide) ».
      if (!acc) acc = L.vide;
      bubble.textContent = acc;
      history.push({ role: 'assistant', content: acc });
      addSources(sources);
      bus.emit('message', { role: 'assistant', content: acc, sources });
      return acc;
    } catch (e: any) {
      bubble.textContent = L.erreur + phraseErreur(L, e);
      bus.emit('error', e instanceof Error ? e : new Error(String(e)));
      throw e;
    }
    finally { busy = false; sendEl.disabled = false; if (!detruit) inEl.focus(); }
  };

  const submit = () => {
    const text = inEl.value.trim(); if (!text || busy || detruit) return;
    inEl.value = '';
    // L'envoi manuel ne doit pas produire de rejet non capté : l'erreur est déjà dans la bulle et
    // sur l'événement `error`.
    void send(text).catch(() => {});
  };

  const setOuvert = (ouvert: boolean) => {
    if (detruit) return;
    if (panel.classList.contains('bk-open') === ouvert) return;
    panel.classList.toggle('bk-open', ouvert);
    if (ouvert) { inEl.focus(); void ensureModel(); }
    bus.emit(ouvert ? 'open' : 'close');
  };

  fab.onclick = () => setOuvert(!panel.classList.contains('bk-open'));
  closeEl.onclick = () => setOuvert(false);
  sendEl.onclick = submit;
  inEl.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } };

  return {
    open: () => setOuvert(true),
    close: () => setOuvert(false),
    toggle: () => setOuvert(!panel.classList.contains('bk-open')),
    ask(text: string) {
      if (detruit) return Promise.reject(new Error('brimkern: widget démonté'));
      const t = String(text ?? '').trim();
      if (!t) return Promise.reject(new Error('brimkern: ask() attend une question non vide'));
      if (busy) return Promise.reject(new Error('génération déjà en cours sur ce widget'));
      setOuvert(true);
      return send(t);
    },
    destroy() {
      if (detruit) return;
      detruit = true;
      // Le moteur, lui, RESTE chargé : il est partagé par la page (un seul jeu de poids en VRAM).
      // Démonter un widget n'a pas à faire retélécharger 149 Mo au suivant.
      vie.abort();
      fab.onclick = null; closeEl.onclick = null; sendEl.onclick = null; inEl.onkeydown = null;
      fab.remove(); panel.remove();
      history = [];
    },
    setKnowledge(k) {
      knowledge = k;
      promptOf = makeSystemBuilder({ ...cfg, knowledge: k });
    },
    setHistory(msgs: Msg[]) {
      if (busy) throw new Error('brimkern: setHistory impossible pendant une génération');
      history = sanitizeHistory(msgs);
      render();
    },
    history: () => history.slice(),
    el: panel,
  };
}


function escapeHtml(s: string) { return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)); }

// ── L'API, exportée ET posée sur window ─────────────────────────────────────────────────────────
// Deux publics, un seul objet :
//   • la balise <script> (build IIFE) → window.Brimkern.embed({...})
//   • le paquet npm (build ESM)       → import { embed } from 'brimkern'
// Les membres sont donc de VRAIS exports nommés. Avant, ils n'existaient que sur `window` : le
// build ESM ne publiait que des types, donc rien d'utilisable, et le simple fait d'importer le
// paquet plantait au rendu SERVEUR (« window is not defined ») dans une app Next/Remix/Astro.
// L'affectation à window est donc conditionnée au navigateur, et l'import est devenu inoffensif.

/**
 * La poignée rendue par embed(). Elle existe parce que embed() ne rendait RIEN : un widget monté
 * était monté pour toujours. Dans une application à navigation côté client, il survivait aux
 * changements de route et un second embed() empilait un second bouton sur document.body — le
 * nettoyage d'un effet React n'avait tout simplement rien à appeler.
 */
export interface BrimkernWidget {
  open(): void;
  close(): void;
  toggle(): void;
  /**
   * Pose une question comme si le visiteur l'avait tapée (ouvre le panneau) : un bouton « Cette
   * page vous aide-t-elle ? » de la page hôte peut lancer la conversation. Rejette si le widget est
   * démonté, si une génération est déjà en cours, ou s'il n'y a pas de DOM.
   */
  ask(text: string): Promise<string>;
  /** Retire le DOM, coupe les écouteurs et ANNULE une génération en cours. Le moteur reste chargé (partagé par la page). */
  destroy(): void;
  setKnowledge(knowledge: SessionConfig['knowledge']): void;
  setHistory(msgs: Msg[]): void;
  readonly history: Msg[];
  /** S'abonner ; rend la fonction de désabonnement. */
  on<K extends BrimkernEvent>(event: K, cb: BrimkernEvents[K]): () => void;
  /** Le panneau, pour un ajustement de style ponctuel. `null` avant le montage (document pas prêt). */
  readonly el: HTMLElement | null;
}

/**
 * Monte le widget de chat (DOM) et rend sa poignée. Attend le document s'il n'est pas encore prêt —
 * la poignée, elle, est utilisable IMMÉDIATEMENT : les appels faits avant le montage sont rejoués
 * dessus (et un destroy() avant montage annule le montage au lieu de le laisser arriver plus tard).
 */
export const embed = (cfg: EmbedConfig = {}): BrimkernWidget => {
  const bus = createEmitter();
  let w: MountedWidget | null = null;
  let inerte = false;  // aucun DOM : la poignée existe mais ne montera jamais rien
  let mortNe = false;  // destroy() appelé avant le montage
  const attente: Array<(w: MountedWidget) => void> = [];
  const quandMonte = (fn: (w: MountedWidget) => void) => {
    if (w) fn(w);
    else if (!inerte && !mortNe) attente.push(fn);
  };
  const monter = () => {
    if (mortNe || w) return;
    w = mountWidget(cfg, bus);
    for (const fn of attente.splice(0)) fn(w);
  };

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Rendu serveur : on rend une poignée INERTE plutôt que rien. `const w = embed(); return () =>
    // w.destroy();` dans un effet ne doit pas planter selon le côté où il s'exécute.
    inerte = true;
    console.warn('[brimkern] embed() ignoré : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.');
  } else {
    appliquerOptions(cfg);
    if (document.body) monter();
    else window.addEventListener('DOMContentLoaded', monter, { once: true });
  }

  return {
    open: () => quandMonte((x) => x.open()),
    close: () => quandMonte((x) => x.close()),
    toggle: () => quandMonte((x) => x.toggle()),
    ask(text: string) {
      // Une promesse qui ne se résout JAMAIS est pire qu'un rejet : sans DOM, ou après destroy(),
      // on le dit tout de suite.
      if (inerte) return Promise.reject(new Error('brimkern: ask() sans DOM (rendu serveur ?)'));
      if (mortNe) return Promise.reject(new Error('brimkern: widget démonté'));
      return new Promise<string>((res, rej) => quandMonte((x) => x.ask(text).then(res, rej)));
    },
    destroy() {
      mortNe = true;
      attente.length = 0;
      w?.destroy();
      w = null;
      bus.clear();
    },
    setKnowledge: (k) => quandMonte((x) => x.setKnowledge(k)),
    setHistory: (m) => quandMonte((x) => x.setHistory(m)),
    get history() { return w ? w.history() : sanitizeHistory(cfg.history); },
    get el() { return w ? w.el : null; },
    on: bus.on,
  };
};

export { createSession };

/** One-shot : une question, une réponse, pas d'historique conservé. */
export const generate = async (opts: SessionConfig & { prompt: string; onToken?: (t: string) => void; signal?: AbortSignal; onSources?: (s: Source[]) => void }): Promise<string> => {
  // L'API prend UN objet. Appelée à tort comme `generate('question', { model })` — l'erreur la
  // plus naturelle du monde — elle recevait la chaîne en guise d'options : `prompt` valait
  // `undefined`, le modèle répondait littéralement à « undefined » et l'option `model` était
  // ignorée en silence. Une signature qu'on peut mal appeler doit le DIRE, pas deviner.
  if (typeof opts !== 'object' || opts === null || typeof opts.prompt !== 'string') {
    throw new TypeError(
      'Brimkern.generate expects a single object: generate({ prompt: "…", model?, system? }). ' +
      `Received ${typeof opts}${typeof opts === 'object' && opts ? ' without a `prompt` string' : ''}.`,
    );
  }
  const session = createSession(opts);
  return session.ask(opts.prompt, { onToken: opts.onToken, signal: opts.signal, onSources: opts.onSources });
};

/**
 * Précharge moteur + modèle. onProgress reçoit la phase ET, pendant le téléchargement, les octets :
 * (status, {loaded, total}) — l'intégrateur peut afficher une vraie barre. `status` est une CLÉ
 * stable ('init' | 'download' | 'tokenizer' | 'gpu'), pas une phrase : à vous de la libeller dans
 * la langue de votre page (le widget de embed() le fait avec sa propre table, cf. LIBELLES).
 */
export const preload = (opts: { model?: string; worker?: boolean; workerUrl?: string; onProgress?: (status: string, progress?: LoadProgress) => void } = {}): Promise<boolean> => (
  appliquerOptions(opts),
  typeof navigator !== 'undefined' && 'gpu' in navigator
    ? backend().then((b) => b.preload(resolveModelUrl(opts.model), opts.onProgress)).then(() => true).catch(() => false)
    : Promise.resolve(false));

/**
 * État du modèle : 'unavailable' (pas de WebGPU), 'idle' (pas encore demandé — ou device perdu, la
 * prochaine demande recharge), 'loading', 'ready', 'error'.
 */
export const status = (model?: string): 'unavailable' | 'idle' | 'loading' | 'ready' | 'error' => {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) return 'unavailable';
  // Synchrone par contrat : on lit l'état MIROITÉ du backend courant. Tant qu'aucun n'existe (rien
  // n'a encore été demandé), 'idle' — exactement la sémantique d'avant.
  return backendNow?.state(resolveModelUrl(model)) ?? 'idle';
};

// La surface globale de la balise <script>. Conditionnée : importer le paquet côté serveur ne doit
// RIEN faire, pas planter.
if (typeof window !== 'undefined') {
  (window as any).Brimkern = { embed, createSession, generate, preload, status, runtime };
}
