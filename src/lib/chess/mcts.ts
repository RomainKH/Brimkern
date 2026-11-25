// Recherche MCTS (PUCT, à la AlphaZero) sur le modèle d'échecs — MIROIR de scripts/chess/play.py
// (mêmes constantes : c_puct 1,5, réduction FPU 0,2, lots de feuilles avec perte virtuelle), pour que
// la force mesurée par play.py contre Stockfish soit celle de la page.
//
// Politique = a priori des coups légaux (softmax des logits de/vers, sous-promotions pénalisées),
// valeur = P(gain) du trait ramenée à [−1, 1]. Dans l'arbre : mat = −1, pat / matériel insuffisant /
// 50 coups / position déjà vue une fois (répétition DOUBLE, comme Lc0) = 0.

import { Chess, type Move } from 'chess.js';
import { encodePosition, moveIndex, type Encoded } from './encode';
import type { ChessModel } from './model';

const C_PUCT = 1.5, FPU = 0.2;

class Node {
	N = 0; W = 0;
	children: Node[] | null = null;
	moves: Move[] | null = null;
	constructor(public prior: number) {}
}

export interface SearchResult {
	move: Move;
	nodes: number;         // évaluations faites
	value: number;         // P(gain) estimée du trait à la racine
	pv: string[];          // variation principale (SAN)
	ms: number;
	policyMove: Move;      // le coup préféré du réseau seul (pour comparer)
}

const key = (fen: string) => fen.split(' ', 4).join(' ');

// aggression : prises et échecs voient leur a priori multiplié par (1 + aggression) — la recherche
// explore d'abord les coups d'attaque (même règle que Net.evaluate dans play.py).
function priors(logits: Float32Array, moves: Move[], flip: number, aggression = 0): Float32Array {
	const lg = new Float32Array(moves.length);
	let mx = -Infinity;
	moves.forEach((m, i) => {
		lg[i] = logits[moveIndex(m, flip)] - (m.promotion && m.promotion !== 'q' ? 6 : 0);
		if (lg[i] > mx) mx = lg[i];
	});
	let sum = 0;
	for (let i = 0; i < lg.length; i++) {
		lg[i] = Math.exp(lg[i] - mx);
		if (aggression > 0 && (moves[i].captured || /[+#]/.test(moves[i].san))) lg[i] *= 1 + aggression;
		sum += lg[i];
	}
	for (let i = 0; i < lg.length; i++) lg[i] /= sum;
	return lg;
}

// Options de recherche :
//   nodes        : plafond d'évaluations (1 = le réseau seul, sans recherche) ;
//   timeMs       : plafond de temps — la recherche s'arrête au premier des deux plafonds atteint ;
//   temperature  : réseau seul uniquement — > 0 tire le coup selon la politique^(1/T) au lieu de
//                  prendre le meilleur (niveaux faibles : des coups plausibles, pas toujours les bons) ;
//   signal       : « joue maintenant » — la recherche s'arrête et rend le meilleur coup trouvé.
export interface SearchOptions {
	nodes: number; timeMs?: number; temperature?: number; batch?: number; signal?: AbortSignal;
	aggression?: number;   // bonus d'a priori des prises et échecs (style)
	contempt?: number;     // une nulle vaut −contempt pour le camp qui cherche : il joue pour gagner
	onProgress?: (done: number, value: number, ms: number) => void;
}

export async function search(model: ChessModel, root: Chess, opts: SearchOptions): Promise<SearchResult> {
	const t0 = performance.now();
	const game = new Chess(root.fen());
	const rootTurn = game.turn();
	// Historique des positions (répétitions) : les positions de la partie jouée, plus le chemin courant.
	const seen = new Map<string, number>();
	for (const m of root.history({ verbose: true })) seen.set(key(m.before), (seen.get(key(m.before)) ?? 0) + 1);
	const bump = (k: string, d: number) => seen.set(k, (seen.get(k) ?? 0) + d);

	const expand = async (positions: { game: Chess; legal: Move[] }[]) => {
		const enc: Encoded[] = positions.map((p) => encodePosition(p.game, p.legal));
		const ev = await model.evaluate(enc);
		return ev.map((e, i) => ({ pr: priors(e.logits, positions[i].legal, enc[i].flip, opts.aggression ?? 0), v: 2 * e.value - 1 }));
	};

	const rootNode = new Node(1);
	const rootLegal = game.moves({ verbose: true });
	const [r0] = await expand([{ game, legal: rootLegal }]);
	rootNode.moves = rootLegal;
	rootNode.children = Array.from(r0.pr, (p) => new Node(p));
	rootNode.N = 1;
	let best = 0;
	for (let i = 1; i < r0.pr.length; i++) if (r0.pr[i] > r0.pr[best]) best = i;
	const policyMove = rootLegal[best];
	if (opts.nodes <= 1 || rootLegal.length === 1) {
		let move = policyMove;
		if (opts.temperature && opts.temperature > 0 && rootLegal.length > 1) {
			const w = Array.from(r0.pr, (p) => Math.pow(p, 1 / opts.temperature!));
			let r = Math.random() * w.reduce((a, b) => a + b, 0);
			for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) { move = rootLegal[i]; break; } }
		}
		return { move, nodes: 1, value: (r0.v + 1) / 2, pv: [move.san], ms: performance.now() - t0, policyMove };
	}

	const batch = opts.batch ?? 8;
	const deadline = opts.timeMs ? t0 + opts.timeMs : Infinity;
	let done = 0;
	while (done < opts.nodes && performance.now() < deadline) {
		if (opts.signal?.aborted) break;
		type Pending = { path: Node[]; leaf?: { game: Chess; legal: Move[] }; tv?: number };
		const pending: Pending[] = [];
		for (let b = 0; b < Math.min(batch, opts.nodes - done); b++) {
			let node = rootNode;
			const path = [rootNode];
			const pushed: string[] = [];
			let tv: number | undefined;
			while (node.children) {
				const sq = Math.sqrt(node.N), parentQ = node.N ? -(node.W / node.N) : 0;
				let bi = 0, bu = -Infinity;
				for (let i = 0; i < node.children.length; i++) {
					const ch = node.children[i];
					const q = ch.N ? ch.W / ch.N : parentQ - FPU;
					const u = q + C_PUCT * ch.prior * sq / (1 + ch.N);
					if (u > bu) { bu = u; bi = i; }
				}
				game.move(node.moves![bi]);
				const k = key(game.fen());
				bump(k, 1); pushed.push(k);
				node = node.children[bi];
				path.push(node);
				if (game.isCheckmate()) { tv = -1; break; }
				if (game.isStalemate() || game.isInsufficientMaterial() || game.isDrawByFiftyMoves() || (seen.get(k) ?? 0) >= 2) {
					const c = opts.contempt ?? 0;
					tv = game.turn() === rootTurn ? -c : c;
					break;
				}
			}
			for (const n of path) { n.N += 1; n.W -= 1; } // perte virtuelle
			pending.push(tv !== undefined ? { path, tv } : { path, leaf: { game: new Chess(game.fen()), legal: game.moves({ verbose: true }) } });
			for (let i = pushed.length - 1; i >= 0; i--) { game.undo(); bump(pushed[i], -1); }
		}
		const toEval = pending.filter((p) => p.leaf);
		const evals = toEval.length ? await expand(toEval.map((p) => p.leaf!)) : [];
		const value = new Map<Pending, number>();
		toEval.forEach((p, i) => {
			const leaf = p.path[p.path.length - 1];
			if (!leaf.children) { leaf.moves = p.leaf!.legal; leaf.children = Array.from(evals[i].pr, (x) => new Node(x)); }
			value.set(p, evals[i].v);
		});
		for (const p of pending) {
			let v = -(p.tv ?? value.get(p)!); // la feuille compte pour son parent
			for (let i = p.path.length - 1; i >= 0; i--) {
				const n = p.path[i];
				n.N -= 1; n.W += 1; // annule la perte virtuelle
				n.N += 1; n.W += v;
				v = -v;
			}
			done++;
		}
		opts.onProgress?.(done, (1 - rootNode.W / rootNode.N) / 2, performance.now() - t0);
		await new Promise((r) => setTimeout(r, 0)); // rend la main à l'interface entre deux lots
	}

	const pick = (n: Node) => { let bi = 0; n.children!.forEach((c, i) => { if (c.N > n.children![bi].N) bi = i; }); return bi; };
	const bi = pick(rootNode);
	const pv: string[] = [];
	let n: Node | undefined = rootNode;
	const g = new Chess(root.fen());
	while (n?.children && pv.length < 8) {
		const i = pick(n);
		if (!n.children[i].N) break;
		pv.push(g.move(n.moves![i]).san);
		n = n.children[i];
	}
	// Valeur racine du point de vue du trait : W est compté pour le parent de la racine (inexistant).
	return { move: rootLegal[bi], nodes: done + 1, value: (1 - rootNode.W / rootNode.N) / 2, pv, ms: performance.now() - t0, policyMove };
}
