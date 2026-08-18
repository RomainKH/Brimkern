// La FRONTIÈRE — le contrat que l'inférence traverse, qu'elle tourne sur le thread principal ou
// dans un Web Worker. Ce fichier ne dépend NI du moteur NI du DOM : il pèse quelques centaines
// d'octets et c'est ce qui permet à index.ts de choisir un côté sans embarquer l'autre.
//
// POURQUOI un worker. Le calcul GPU est asynchrone, mais la boucle de décodage ne l'est pas : par
// token, elle soumet, attend un readback, détokenise, et rappelle l'intégrateur. Sur le thread
// principal d'un site TIERS, ce travail-là entre en concurrence directe avec ses animations, son
// défilement et ses propres scripts — et un widget qui fige la page qui l'héberge est un widget
// qu'on retire. Le déporter rend la page de l'hôte insensible à la génération.
//
// POURQUOI ça ne coûtait presque rien à écrire : le moteur (src/lib/webgpu/**, src/lib/brik/**)
// n'utilise aucune API de document — seulement `caches` et `location.search`, tous deux présents
// dans un worker. Il était donc déjà déportable ; il manquait ce contrat et un hôte.
//
// LA GRANULARITÉ EST LE POINT DÉLICAT. On ne fait PAS traverser le modèle (« donne-moi le token
// suivant » à chaque itération) : ce serait un aller-retour de messages par token, c'est-à-dire
// remplacer un readback par deux sauts de thread. On fait traverser LE TOUR ENTIER — une requête,
// un flux de textes cumulés en retour. C'est aussi pour ça que l'application (src/app/ChatApp.tsx)
// n'est pas encore derrière ce contrat : sa boucle appelle `topKKV`/`logitsKV` PAR TOKEN et
// entrelace outils, recherche web et vision — la déporter demande de déplacer la boucle, pas le
// modèle. Cf. l'entrée de ROADMAP.

import type { Msg, LoadProgress } from './engineCore';

export interface TurnRequest {
	url: string;
	history: Msg[];
	system: string;
	maxTokens: number;
	temperature: number;
	pinned: Msg[];
}

export type ModelState = 'loading' | 'ready' | 'error';

export interface EngineBackend {
	/** Charge moteur + poids (idempotent, un seul chargement par URL). */
	preload(url: string, onProgress?: (status: string, p?: LoadProgress) => void): Promise<void>;
	/** État connu SANS déclencher de chargement (`undefined` = jamais demandé). */
	state(url: string): ModelState | undefined;
	/** Un tour complet. `onToken` reçoit le texte CUMULÉ nettoyé, comme l'API publique le promet. */
	turn(req: TurnRequest, onToken?: (text: string) => void, signal?: AbortSignal): Promise<string>;
	/** Libère le worker s'il y en a un. Le backend local n'a rien à libérer (singleton de page). */
	dispose(): void;
	/** Pour le diagnostic et les bancs : où l'inférence tourne réellement. */
	readonly kind: 'worker' | 'main';
}

// Choix du backend — et le DÉFAUT est le thread principal, contre l'intuition. Voici pourquoi, parce
// que ça a été mesuré et que la mesure a contredit l'hypothèse de départ.
//
// Banc Chrome, build de production, page hôte sur une autre origine, 3 générations enchaînées sur le
// modèle par défaut (LFM2.5 230M), métronome `requestAnimationFrame` sur le thread de l'hôte :
//
//   |                    | worker | thread principal |
//   |--------------------|--------|------------------|
//   | débit              | 411 car/s | 396 car/s     |
//   | frames > 33 ms     | **0**  | **0**            |
//
// Autrement dit : à cette taille de modèle, la boucle de décodage **ne bloque pas** la page hôte. Elle
// attend un readback GPU à chaque token, et cette attente rend la main au navigateur — le métronome
// n'a pas sauté une seule frame, dans aucun des deux bras. Il n'y avait donc rien à débloquer, et
// activer le worker par défaut ferait payer un thread et un aller-retour de messages à tout le monde
// pour un gain nul et non démontré. (Le débit, lui, est identique : la régulation du flux de tokens
// côté worker a supprimé le surcoût initial de ~50 %, cf. engineWorker.ts.)
//
// Ce que ça NE dit pas, et qu'il faudra mesurer avant de changer d'avis : un modèle plus gros (plus de
// travail CPU par token), une machine lente, ou une page hôte réellement chargée. C'est exactement là
// que `worker: true` existe. Le mécanisme est prêt et validé ; c'est le défaut qui attend une mesure
// qui le justifie.
//
// Le repli sur le thread principal reste SILENCIEUX et automatique quand le worker est demandé mais
// ne peut pas être construit (CSP de l'hôte qui interdit blob:, pas de constructeur Worker, sdk.js
// importé par un bundler donc sans URL de script) : un widget ne doit jamais cesser de fonctionner à
// cause d'un choix d'exécution.
export async function pickBackend(prefer: boolean | undefined): Promise<EngineBackend> {
	const { LocalBackend } = await import('./localBackend');
	if (prefer !== true) return new LocalBackend();
	try {
		const { WorkerBackend } = await import('./workerBackend');
		const b = new WorkerBackend();
		await b.ready();
		return b;
	} catch (e) {
		console.warn('[brimkern] Web Worker indisponible : inférence sur le thread principal', e);
		return new LocalBackend();
	}
}
