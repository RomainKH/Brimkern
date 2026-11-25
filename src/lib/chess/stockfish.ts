// Stockfish 19 dans un worker : l'adversaire des matchs « brimkern contre une IA » de /chess.
// Binaire GPLv3 de stockfish.js (réseau lite, mono-fil) servi tel quel depuis public/engines/stockfish
// (licence et sources à côté) : un programme séparé à qui l'on parle UCI par postMessage. Mono-fil :
// ni SharedArrayBuffer ni réglage de fils, un seul cœur occupé.

export class Stockfish {
	private worker: Worker;
	private listeners = new Set<(line: string) => void>();

	private constructor(url: string) {
		this.worker = new Worker(url);
		this.worker.onmessage = (e) => {
			const line = String(e.data);
			for (const fn of [...this.listeners]) fn(line);
		};
	}

	static async create(url: string, timeoutMs = 30_000): Promise<Stockfish> {
		const sf = new Stockfish(url);
		try {
			await sf.until('uci', (l) => l === 'uciok', timeoutMs);
			sf.worker.postMessage('setoption name Hash value 16');
			await sf.ready(timeoutMs);
		} catch (e) {
			sf.terminate();
			throw e;
		}
		return sf;
	}

	// Envoie `cmd` et attend la première ligne qui satisfait `done`.
	private until(cmd: string, done: (line: string) => boolean, timeoutMs: number): Promise<string> {
		return new Promise((resolve, reject) => {
			const fn = (l: string) => {
				if (!done(l)) return;
				clearTimeout(timer);
				this.listeners.delete(fn);
				resolve(l);
			};
			const timer = setTimeout(() => {
				this.listeners.delete(fn);
				reject(new Error(`stockfish : pas de réponse à « ${cmd} »`));
			}, timeoutMs);
			this.listeners.add(fn);
			this.worker.postMessage(cmd);
		});
	}

	ready(timeoutMs = 30_000): Promise<string> {
		return this.until('isready', (l) => l === 'readyok', timeoutMs);
	}

	// elo : réglage UCI_Elo de Stockfish (1320 à 3190, sa propre échelle) ; null = pleine force.
	async configure(elo: number | null): Promise<void> {
		this.worker.postMessage(`setoption name UCI_LimitStrength value ${elo !== null}`);
		if (elo !== null) this.worker.postMessage(`setoption name UCI_Elo value ${elo}`);
		await this.ready();
	}

	async newGame(): Promise<void> {
		this.worker.postMessage('ucinewgame');
		await this.ready();
	}

	// Coup UCI (« e7e8q »), ou null si la position n'en a aucun. `signal` interrompt la réflexion :
	// Stockfish rend alors aussitôt son meilleur coup du moment.
	async bestMove(fen: string, movetimeMs: number, signal?: AbortSignal): Promise<string | null> {
		this.worker.postMessage(`position fen ${fen}`);
		const onAbort = () => this.worker.postMessage('stop');
		signal?.addEventListener('abort', onAbort, { once: true });
		try {
			const line = await this.until(`go movetime ${movetimeMs}`, (l) => l.startsWith('bestmove'), movetimeMs + 15_000);
			const mv = line.split(/\s+/)[1];
			return mv && mv !== '(none)' ? mv : null;
		} finally {
			signal?.removeEventListener('abort', onAbort);
		}
	}

	terminate(): void {
		this.listeners.clear();
		this.worker.terminate();
	}
}
