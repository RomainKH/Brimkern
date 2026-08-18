// Le CLIENT du worker, côté page. Symétrique de engineWorker.ts, et volontairement mince : il ne
// sait rien de l'inférence, il route des messages et rend des promesses.
//
// COMMENT le worker est fabriqué, parce que ce n'est pas la façon évidente et que la façon évidente
// ne marche pas :
//
//  1. `new Worker('./engineWorker.js')` est exclu — sdk.js est servi par brimkern.com et exécuté sur
//     le site de l'intégrateur : l'URL du worker serait cross-origin, ce que le constructeur refuse.
//  2. Inliner le bundle du worker dans une chaîne marcherait, mais mettrait le moteur DEUX FOIS dans
//     sdk.js (une fois pour le worker, une fois pour le repli thread principal) : ~480 Ko sur la page
//     d'un tiers. Inacceptable pour gagner de la fluidité.
//  3. Ce qu'on fait : un Blob de DEUX LIGNES qui fait `importScripts(<url absolue de sdk.js>)`. Un
//     worker classique a le droit d'importer un script cross-origin (contrairement au constructeur),
//     donc le worker charge LE MÊME FICHIER que la page — un seul bundle, une seule version, aucune
//     duplication. index.ts détecte alors qu'il s'exécute dans un worker et installe l'hôte.
//
// L'URL est capturée à `document.currentScript` AU CHARGEMENT (elle n'est plus lisible ensuite).
// Sans elle — build ESM importé par un bundler, ou `workerUrl` non fourni — on ne peut pas fabriquer
// le stub : le backend refuse de se construire et l'appelant retombe sur le thread principal.

import type { EngineBackend, ModelState, TurnRequest } from './backend';
import type { LoadProgress } from './engineCore';
import { workerScriptUrl } from './selfUrl';

type FromWorker =
	| { type: 'hello' }
	| { type: 'progress'; id: number; status: string; progress?: LoadProgress }
	| { type: 'token'; id: number; text: string }
	| { type: 'state'; id: number; state?: ModelState }
	| { type: 'done'; id: number; text?: string }
	| { type: 'error'; id: number; message: string };

interface Pending {
	// `unknown` et non `any` : les réponses du worker sont hétérogènes (état, texte) et chaque
	// appelant les retype à l'envoi via `send<T>`.
	resolve: (v: unknown) => void;
	reject: (e: Error) => void;
	onToken?: (t: string) => void;
	onProgress?: (s: string, p?: LoadProgress) => void;
}

export class WorkerBackend implements EngineBackend {
	readonly kind = 'worker' as const;
	private worker: Worker;
	private url: string;
	private seq = 0;
	private pending = new Map<number, Pending>();
	private hello: Promise<void>;
	// L'état est MIROITÉ côté page : `status()` est synchrone dans l'API publique et ne peut donc pas
	// attendre un aller-retour. On le tient à jour aux transitions qu'on provoque nous-mêmes.
	private states = new Map<string, ModelState>();

	constructor() {
		if (typeof Worker === 'undefined') throw new Error('Worker indisponible');
		const src = workerScriptUrl();
		if (!src) throw new Error('URL du script introuvable (import ESM ?) : passez workerUrl');
		// `importScripts` évalue notre propre bundle DANS le worker ; index.ts y détecte le contexte
		// worker et installe l'hôte de messages. Deux lignes, aucune duplication de code.
		//
		// `__brimkernSearch` est posé AVANT l'import, et c'est indispensable : les kill-switches du
		// moteur sont des initialiseurs statiques, évalués pendant importScripts. Sans ça ils
		// liraient la query du blob: (vide) et seraient TOUS éteints en silence dans le worker —
		// un commutateur qui ne commute rien (cf. src/lib/webgpu/urlFlags.ts).
		const query = (() => { try { return location.search; } catch { return ''; } })();
		const stub = `self.__brimkernSearch=${JSON.stringify(query)};importScripts(${JSON.stringify(src)});`;
		const blob = new Blob([stub], { type: 'text/javascript' });
		this.url = URL.createObjectURL(blob);
		this.worker = new Worker(this.url);
		let helloResolve!: () => void, helloReject!: (e: Error) => void;
		this.hello = new Promise<void>((res, rej) => { helloResolve = res; helloReject = rej; });
		// Une erreur d'évaluation du worker (CSP, syntaxe) n'arrive PAS dans onmessage : sans ce
		// gestionnaire, `ready()` resterait en attente pour toujours et le widget paraîtrait figé.
		this.worker.onerror = (ev) => helloReject(new Error(`worker: ${ev.message || 'échec de chargement'}`));
		this.worker.onmessage = (e: MessageEvent<FromWorker>) => {
			const m = e.data;
			if (m.type === 'hello') { helloResolve(); return; }
			const p = this.pending.get(m.id);
			if (!p) return;
			if (m.type === 'progress') { p.onProgress?.(m.status, m.progress); return; }
			if (m.type === 'token') { p.onToken?.(m.text); return; }
			this.pending.delete(m.id);
			if (m.type === 'error') p.reject(new Error(m.message));
			else if (m.type === 'state') p.resolve(m.state);
			else p.resolve(m.text ?? '');
		};
	}

	/** Résolue quand le worker s'est évalué et a répondu — rejetée s'il n'a pas pu se charger. */
	ready(): Promise<void> { return this.hello; }

	// Rend l'id AVEC la promesse : l'annulation d'un tour doit viser cet id précis, et le déduire
	// après coup (`seq + 1`) casse dès qu'un preload s'intercale entre les deux.
	private send<T>(msg: Record<string, unknown>, hooks: Omit<Pending, 'resolve' | 'reject'> = {}): { id: number; done: Promise<T> } {
		const id = ++this.seq;
		const done = new Promise<T>((resolve, reject) => {
			this.pending.set(id, { resolve: resolve as (v: unknown) => void, reject, ...hooks });
			this.worker.postMessage({ ...msg, id });
		});
		return { id, done };
	}

	async preload(url: string, onProgress?: (s: string, p?: LoadProgress) => void): Promise<void> {
		await this.hello;
		if (this.states.get(url) !== 'ready') this.states.set(url, 'loading');
		try {
			await this.send<string>({ type: 'preload', url }, { onProgress }).done;
			this.states.set(url, 'ready');
		} catch (e) {
			this.states.set(url, 'error');
			throw e;
		}
	}

	state(url: string): ModelState | undefined { return this.states.get(url); }

	async turn(req: TurnRequest, onToken?: (t: string) => void, signal?: AbortSignal): Promise<string> {
		await this.hello;
		const { id, done } = this.send<string>({ type: 'turn', req }, { onToken });
		// L'annulation doit partir MÊME si le tour est déjà en cours côté worker : on relaie
		// l'abandon en message, la boucle de génération le voit entre deux tokens.
		const relay = () => this.worker.postMessage({ type: 'stop', id });
		if (signal?.aborted) relay();               // déjà annulé avant l'envoi : ne pas rater le coche
		else signal?.addEventListener('abort', relay, { once: true });
		try {
			const text = await done;
			this.states.set(req.url, 'ready');
			return text;
		} finally {
			signal?.removeEventListener('abort', relay);
		}
	}

	dispose(): void {
		this.worker.terminate();
		URL.revokeObjectURL(this.url);
		for (const p of this.pending.values()) p.reject(new Error('worker arrêté'));
		this.pending.clear();
	}
}
