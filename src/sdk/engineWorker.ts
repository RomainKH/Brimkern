// L'HÔTE — ce qui tourne DANS le Web Worker. Point d'entrée d'un bundle à part
// (scripts/build-sdk.mjs), inliné en chaîne dans sdk.js et instancié depuis un Blob : un script
// servi par un CDN ne peut pas charger un worker par URL relative (origine différente), et un
// intégrateur ne doit pas avoir à héberger un second fichier.
//
// Conséquence heureuse du découpage : le moteur (~200 Ko) n'est plus dans le bundle que la balise
// <script> exécute — il part dans la chaîne du worker, qui n'est matérialisée QUE si l'on crée
// le worker, c'est-à-dire quand quelqu'un ouvre réellement le widget. La page d'accueil d'un site
// hôte ne paie donc plus le moteur pour un widget que personne n'ouvre.
//
// Il n'y a AUCUNE logique d'inférence ici : le worker exécute le même LocalBackend que le repli.
// C'est délibéré — deux implémentations de la même génération auraient divergé au premier correctif.

import { LocalBackend } from './localBackend';
import type { TurnRequest } from './backend';

type ToWorker =
	| { type: 'preload'; id: number; url: string }
	| { type: 'state'; id: number; url: string }
	| { type: 'turn'; id: number; req: TurnRequest }
	| { type: 'stop'; id: number };

const backend = new LocalBackend();
// Un tour annulé n'interrompt pas le GPU : la boucle de génération INTERROGE `isStopped` entre les
// tokens (c'est déjà son contrat côté moteur). L'annulation est donc un drapeau, pas un signal.
const stops = new Set<number>();
const post = (m: unknown) => (self as unknown as Worker).postMessage(m);

self.onmessage = async (e: MessageEvent<ToWorker>) => {
	const m = e.data;
	if (m.type === 'stop') { stops.add(m.id); return; }
	if (m.type === 'state') { post({ type: 'state', id: m.id, state: backend.state(m.url) }); return; }
	try {
		if (m.type === 'preload') {
			// La progression traverse en messages : c'est elle qui alimente la barre de l'intégrateur,
			// et une phase muette pendant ~150 Mo était le point de rebond n°1 du widget.
			await backend.preload(m.url, (status, p) => post({ type: 'progress', id: m.id, status, progress: p }));
			post({ type: 'done', id: m.id });
			return;
		}
		if (m.type === 'turn') {
			const ctl = new AbortController();
			// Sondé par la boucle : on relaie le drapeau d'arrêt sans réveiller le worker inutilement.
			const signal = new Proxy(ctl.signal, { get: (t, k) => (k === 'aborted' ? stops.has(m.id) : Reflect.get(t, k)) });
			// ⚠️ RÉGULATION DU FLUX — mesurée, pas préventive. Un message par token coûtait ~0,5 s sur
			// une réponse de 220 tokens (banc : 0,7 s en local contre 1,2 s en worker) : le contrat
			// `onToken` rend le texte CUMULÉ, donc chaque token clonait une chaîne qui grandit, et la
			// page repeignait plus souvent qu'elle ne peut afficher. On n'envoie donc qu'une fois par
			// TRAME (~16 ms) — au-delà, l'écran ne montre rien de plus. Le dernier état part toujours,
			// porté par `done` : aucun texte ne peut être perdu par la régulation.
			const CADENCE = 16;
			let dernier = 0, enAttente: string | null = null;
			const pousser = () => { if (enAttente !== null) { post({ type: 'token', id: m.id, text: enAttente }); enAttente = null; dernier = Date.now(); } };
			const text = await backend.turn(m.req, (t) => {
				enAttente = t;
				if (Date.now() - dernier >= CADENCE) pousser();
			}, signal as AbortSignal);
			pousser();
			post({ type: 'done', id: m.id, text });
			stops.delete(m.id);
			return;
		}
	} catch (err) {
		// Une Error ne traverse pas toujours le clone structuré avec sa pile : on envoie le message,
		// qui est ce que l'intégrateur verra. Sans ça, un échec de chargement arrivait en « [object
		// Object] » côté page.
		stops.delete(m.id);
		post({ type: 'error', id: m.id, message: err instanceof Error ? err.message : String(err) });
	}
};

// Signal de vie : le client attend ce message avant de déclarer le worker utilisable (sinon un
// worker qui échoue à s'évaluer — import cassé, CSP — ne se manifesterait qu'au premier tour).
post({ type: 'hello' });
