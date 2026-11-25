// Parité TypeScript ↔ Python de la valeur façonnée des positions gagnées (mcts.ts progressValue ↔
// play.py progress_value) : la page doit jouer comme ce que convert_bench.py a mesuré.
//   npm run test:chess
import { Chess } from 'chess.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { progressValue } from './mcts';

const fixture: { fen: string; v: number; out: number }[] = JSON.parse(readFileSync(join(process.cwd(), 'src/lib/chess/progress.fixture.json'), 'utf8'));
let ko = 0;
for (const f of fixture) {
	const got = progressValue(new Chess(f.fen), f.v);
	if (Math.abs(got - f.out) > 1e-9) { ko++; console.error(`KO ${f.fen} v=${f.v} : ${got} ≠ ${f.out}`); }
}
console.log(`${fixture.length - ko}/${fixture.length} valeurs façonnées identiques à play.py`);
if (ko) process.exit(1);
