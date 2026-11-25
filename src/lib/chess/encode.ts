// Encodage d'une position pour le modèle d'échecs — MIROIR EXACT de scripts/chess/prepare.py
// (encode) et play.py (encode_board). Toute divergence ici = un modèle qui joue sur un autre
// échiquier que celui de son entraînement, sans erreur visible : d'où le test encode.test.ts.
//
// Point de vue du TRAIT : les noirs voient l'échiquier retourné (case s → s ^ 56), couleurs échangées.
//   pieces[64] : 0 vide, 1-6 = P N B R Q K du trait, 7-12 = celles de l'adversaire
//   castle     : 4 bits — petit/grand roque du trait, puis de l'adversaire
//   ep         : case de prise en passant (vue du trait) SEULEMENT si une prise est légale, sinon 64
// Coups : indice de politique (de ^ flip) * 64 + (vers ^ flip) ; la promotion se résume à de→vers.

import type { Chess, Move, Square } from 'chess.js';

export interface Encoded { pieces: Int32Array; castle: number; ep: number; flip: number }

const TYPES: Record<string, number> = { p: 1, n: 2, b: 3, r: 4, q: 5, k: 6 };

export const sqIndex = (s: string): number => (s.charCodeAt(0) - 97) + 8 * (s.charCodeAt(1) - 49);
export const sqName = (i: number): Square => (String.fromCharCode(97 + (i % 8)) + String.fromCharCode(49 + Math.floor(i / 8))) as Square;

export function encodePosition(game: Chess, legal: Move[] = game.moves({ verbose: true })): Encoded {
	const turn = game.turn();
	const flip = turn === 'w' ? 0 : 56;
	const pieces = new Int32Array(64);
	const rows = game.board(); // rows[0] = 8e rangée, colonnes a → h
	for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
		const p = rows[r][f];
		if (!p) continue;
		const sq = (7 - r) * 8 + f;
		pieces[sq ^ flip] = TYPES[p.type] + (p.color === turn ? 0 : 6);
	}
	const opp = turn === 'w' ? 'b' : 'w';
	const me = game.getCastlingRights(turn), them = game.getCastlingRights(opp);
	const castle = (me.k ? 1 : 0) | (me.q ? 2 : 0) | (them.k ? 4 : 0) | (them.q ? 8 : 0);
	const epMove = legal.find((m) => m.flags.includes('e'));
	const ep = epMove ? sqIndex(epMove.to) ^ flip : 64;
	return { pieces, castle, ep, flip };
}

export const moveIndex = (m: { from: string; to: string }, flip: number): number => (sqIndex(m.from) ^ flip) * 64 + (sqIndex(m.to) ^ flip);
