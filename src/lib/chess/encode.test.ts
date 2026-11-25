// Parité d'encodage TypeScript ↔ Python : chaque position de la fixture (générée par
// scripts/chess/encode_fixture.py avec l'encodeur de l'entraînement) doit donner exactement les mêmes
// pièces, roques, case en passant et indices de coups légaux.
//   npm run test:chess
import { Chess } from 'chess.js';
import { encodePosition, moveIndex } from './encode';
import { readFileSync } from 'fs';
import { join } from 'path';
// Lu depuis la racine du dépôt (le test compilé vit dans .brik-build/chesstest).
const fixture: { fen: string; pieces: number[]; castle: number; ep: number; moves: number[] }[] =
	JSON.parse(readFileSync(join(process.cwd(), 'src/lib/chess/encode.fixture.json'), 'utf8'));

let ko = 0;
for (const f of fixture) {
	const g = new Chess(f.fen);
	const legal = g.moves({ verbose: true });
	const e = encodePosition(g, legal);
	const moves = [...new Set(legal.map((m) => moveIndex(m, e.flip)))].sort((a, b) => a - b);
	const errs: string[] = [];
	if (e.pieces.some((p, i) => p !== f.pieces[i])) errs.push('pièces');
	if (e.castle !== f.castle) errs.push(`roques ${e.castle} ≠ ${f.castle}`);
	if (e.ep !== f.ep) errs.push(`en passant ${e.ep} ≠ ${f.ep}`);
	if (moves.length !== f.moves.length || moves.some((m, i) => m !== f.moves[i])) errs.push(`coups (${moves.length} ≠ ${f.moves.length})`);
	if (errs.length) { ko++; console.error(`KO ${f.fen} : ${errs.join(', ')}`); }
}
console.log(`${fixture.length - ko}/${fixture.length} positions identiques à l'encodeur Python`);
if (ko) process.exit(1);
