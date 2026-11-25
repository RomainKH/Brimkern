"use client";

// Échiquier interactif — le COMPORTEMENT des échiquiers en ligne courants (glisser-déposer, clic-clic,
// annotations au clic droit, coup anticipé), avec nos propres visuels :
//   • glisser-déposer : la pièce se lève à l'appui et suit le pointeur, la case survolée s'entoure ;
//     lâchée sur une case légale → coup ; ailleurs → elle revient ;
//   • clic-clic : appui sur une pièce = sélection (cibles affichées), clic sur une cible = coup ;
//     second clic sur la pièce sélectionnée = désélection ;
//   • clic droit sur une case = surlignage ; glisser au clic droit = flèche (en L pour un cavalier) ;
//     un clic gauche efface les annotations ;
//   • coup anticipé (premove) pendant que le moteur réfléchit : retenu, joué dès que c'est notre tour
//     s'il est légal (sinon annulé) ; un clic ailleurs l'annule ;
//   • animation de glissement pour les coups joués sans glisser (moteur, clic-clic) — CSS seul ;
//   • promotion : colonne de choix sur la case d'arrivée.
// Clavier : chaque case reste un bouton (Entrée/Espace = clic-clic) ; `e.detail === 0` distingue
// l'activation clavier des clics souris, déjà traités par les événements de pointeur.

import { useMemo, useRef, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { useT, useLocale } from '@/lib/i18n';
import s from './chess.module.css';

type Color = 'w' | 'b';
export interface LastMove { from: string; to: string; seq: number; animate: boolean }
export interface Premove { from: Square; to: Square }

const FILES = 'abcdefgh';
const PIECE_NAME: Record<string, [string, string]> = {
	k: ['king', 'roi'], q: ['queen', 'dame'], r: ['rook', 'tour'], b: ['bishop', 'fou'], n: ['knight', 'cavalier'], p: ['pawn', 'pion'],
};

interface Props {
	game: Chess;
	fen: string;              // force le recalcul quand la partie change
	orientation: Color;
	human: Color;
	canMove: boolean;         // c'est notre tour et le moteur est prêt
	canPremove: boolean;      // le moteur réfléchit : coups anticipés permis
	lastMove: LastMove | null;
	premove: Premove | null;
	onMove: (from: Square, to: Square, promotion?: string, animate?: boolean) => void;
	onPremove: (p: Premove | null) => void;
}

export default function Board({ game, fen, orientation, human, canMove, canPremove, lastMove, premove, onMove, onPremove }: Props) {
	const t = useT();
	const { locale } = useLocale();
	const fr = locale === 'fr';
	const boardRef = useRef<HTMLDivElement>(null);
	const ghostRef = useRef<HTMLSpanElement | null>(null);
	const dragRef = useRef<{ from: Square; x0: number; y0: number; x: number; y: number; moved: boolean; wasSelected: boolean } | null>(null);
	const rightRef = useRef<Square | null>(null);
	const [dragFrom, setDragFrom] = useState<Square | null>(null);
	const [hover, setHover] = useState<Square | null>(null);
	const [selected, setSelected] = useState<Square | null>(null);
	const [marks, setMarks] = useState<Set<string>>(new Set());
	const [arrows, setArrows] = useState<{ from: Square; to: Square }[]>([]);
	const [promo, setPromo] = useState<{ from: Square; to: Square } | null>(null);

	// ── Géométrie. ──────────────────────────────────────────────────────────────────────────────────
	const colRow = (sq: string) => {
		const file = sq.charCodeAt(0) - 97, rank = Number(sq[1]);
		return orientation === 'w' ? { c: file, r: 8 - rank } : { c: 7 - file, r: rank - 1 };
	};
	const squareAt = (clientX: number, clientY: number): Square | null => {
		const el = boardRef.current;
		if (!el) return null;
		const b = el.getBoundingClientRect();
		const c = Math.floor(((clientX - b.left) / b.width) * 8), r = Math.floor(((clientY - b.top) / b.height) * 8);
		if (c < 0 || c > 7 || r < 0 || r > 7) return null;
		const file = orientation === 'w' ? c : 7 - c, rank = orientation === 'w' ? 8 - r : r + 1;
		return `${FILES[file]}${rank}` as Square;
	};

	// ── Cibles : coups légaux à notre tour ; coups « pseudo » (position avec le trait inversé) en
	// coup anticipé — vérifiés pour de vrai au moment de les jouer. ───────────────────────────────
	const premoveGame = useMemo(() => {
		if (!canPremove) return null;
		const parts = fen.split(' ');
		parts[1] = human; parts[3] = '-';
		try { return new Chess(parts.join(' ')); } catch { return null; }
	}, [fen, canPremove, human]);
	const targetsOf = (from: Square | null): Map<string, { capture: boolean; promotion: boolean }> => {
		const m = new Map<string, { capture: boolean; promotion: boolean }>();
		if (!from) return m;
		const g = canMove ? game : premoveGame;
		if (!g) return m;
		for (const mv of g.moves({ square: from, verbose: true })) m.set(mv.to, { capture: !!mv.captured, promotion: !!mv.promotion });
		return m;
	};
	const active = dragFrom ?? selected;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const targets = useMemo(() => targetsOf(active), [active, fen, canMove, canPremove]);
	const ownPiece = (sq: Square) => { const p = game.get(sq); return !!p && p.color === human; };

	// ── Jouer : coup réel, ou coup anticipé. ─────────────────────────────────────────────────────────
	const commit = (from: Square, to: Square, animate = true) => {
		const tg = targetsOf(from).get(to);
		if (!tg) return false;
		setSelected(null);
		if (canMove) {
			if (tg.promotion) setPromo({ from, to });
			else onMove(from, to, undefined, animate);
		} else if (canPremove) {
			onPremove({ from, to });
		}
		return true;
	};

	const clearAnnotations = () => { if (marks.size) setMarks(new Set()); if (arrows.length) setArrows([]); };

	const select = (sq: Square) => {
		if (selected && selected !== sq && commit(selected, sq)) return;
		if (ownPiece(sq) && (canMove || canPremove)) setSelected(selected === sq ? null : sq);
		else { setSelected(null); if (premove) onPremove(null); }
	};

	// ── Pointeur. ───────────────────────────────────────────────────────────────────────────────────
	const moveGhost = (x: number, y: number) => {
		const el = boardRef.current, gh = ghostRef.current;
		if (!el || !gh) return;
		const b = el.getBoundingClientRect(), sz = b.width / 8;
		gh.style.width = gh.style.height = `${sz}px`;
		gh.style.transform = `translate(${x - b.left - sz / 2}px, ${y - b.top - sz / 2}px)`;
	};

	const onPointerDown = (e: React.PointerEvent) => {
		if (promo) return;
		const sq = squareAt(e.clientX, e.clientY);
		if (!sq) return;
		if (e.button === 2) { rightRef.current = sq; return; }
		if (e.button !== 0) return;
		clearAnnotations();
		if (selected && selected !== sq && commit(selected, sq)) return;
		if (ownPiece(sq) && (canMove || canPremove)) {
			e.preventDefault();
			boardRef.current?.setPointerCapture(e.pointerId);
			dragRef.current = { from: sq, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, moved: false, wasSelected: selected === sq };
			setSelected(sq);
			setDragFrom(sq);
			setHover(sq);
		} else {
			setSelected(null);
			if (premove) onPremove(null);
		}
	};

	const onPointerMove = (e: React.PointerEvent) => {
		const d = dragRef.current;
		if (!d) return;
		if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 4) d.moved = true;
		d.x = e.clientX; d.y = e.clientY;
		moveGhost(e.clientX, e.clientY);
		const sq = squareAt(e.clientX, e.clientY);
		if (sq !== hover) setHover(sq);
	};

	const endDrag = () => { dragRef.current = null; setDragFrom(null); setHover(null); };

	const onPointerUp = (e: React.PointerEvent) => {
		const sq = squareAt(e.clientX, e.clientY);
		if (e.button === 2) {
			const from = rightRef.current;
			rightRef.current = null;
			if (!from || !sq) return;
			if (from === sq) setMarks((m) => { const n = new Set(m); if (n.has(sq)) n.delete(sq); else n.add(sq); return n; });
			else setArrows((a) => a.some((x) => x.from === from && x.to === sq) ? a.filter((x) => !(x.from === from && x.to === sq)) : [...a, { from, to: sq }]);
			return;
		}
		const d = dragRef.current;
		if (!d) return;
		endDrag();
		if (sq && sq !== d.from) {
			if (!commit(d.from, sq, !d.moved) && !d.moved) select(sq);
			return;
		}
		// Relâché sur sa case : un second clic sur la pièce déjà sélectionnée la désélectionne.
		if (sq === d.from && !d.moved && d.wasSelected) setSelected(null);
	};

	// ── Rendu. ──────────────────────────────────────────────────────────────────────────────────────
	const rows = game.board();
	const checkSq = game.inCheck() ? rows.flat().find((p) => p && p.type === 'k' && p.color === game.turn())?.square : null;
	const squares: React.ReactNode[] = [];
	for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
		const rank = orientation === 'w' ? 8 - i : i + 1;
		const file = orientation === 'w' ? j : 7 - j;
		const sq = `${FILES[file]}${rank}` as Square;
		const p = rows[8 - rank][file];
		const light = (file + rank) % 2 === 1;
		const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
		const isPre = premove && (premove.from === sq || premove.to === sq);
		const cls = [s.sq, light ? s.light : s.dark, isLast ? s.last : '', active === sq ? s.selected : '', isPre ? s.premove : '',
			marks.has(sq) ? s.marked : '', checkSq === sq ? s.check : '', hover === sq && dragFrom && hover !== dragFrom ? s.hover : '',
			lastMove?.to === sq ? s.lastTo : ''].join(' ');
		const name = p ? `${sq}, ${fr ? `${PIECE_NAME[p.type][1]} ${p.color === 'w' ? 'blanc' : 'noir'}` : `${p.color === 'w' ? 'white' : 'black'} ${PIECE_NAME[p.type][0]}`}` : sq;
		// Glissement : la pièce d'arrivée part de la case de départ (décalage en tailles de case).
		let slide: React.CSSProperties | undefined;
		if (p && lastMove?.animate && lastMove.to === sq) {
			const a = colRow(lastMove.from), b = colRow(sq);
			slide = { ['--dx' as string]: `${(a.c - b.c) * 100}%`, ['--dy' as string]: `${(a.r - b.r) * 100}%` };
		}
		const tg = targets.get(sq);
		squares.push(
			<button key={sq} type="button" className={cls} aria-label={name} aria-pressed={active === sq}
				onClick={(e) => { if (e.detail === 0) select(sq); }}>
				{p && (
					<span key={slide ? `slide-${lastMove!.seq}` : 'static'}
						className={`${s.piece} ${s[p.type]} ${p.color === 'w' ? s.pw : s.pb} ${dragFrom === sq ? s.lifted : ''} ${slide ? s.slide : ''}`}
						style={slide} aria-hidden="true" />
				)}
				{tg && <span className={tg.capture ? s.ring : s.dot} aria-hidden="true" />}
			</button>,
		);
	}

	const dragPiece = dragFrom ? game.get(dragFrom) : null;
	const arrowEls = arrows.map(({ from, to }, k) => {
		const a = colRow(from), b = colRow(to);
		const x1 = a.c + 0.5, y1 = a.r + 0.5, x2 = b.c + 0.5, y2 = b.r + 0.5;
		const dx = Math.abs(b.c - a.c), dy = Math.abs(b.r - a.r);
		const knight = (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
		// Cavalier : en L, d'abord le long du grand côté.
		const pts = knight ? (dy === 2 ? `${x1},${y1} ${x1},${y2} ${x2},${y2}` : `${x1},${y1} ${x2},${y1} ${x2},${y2}`) : `${x1},${y1} ${x2},${y2}`;
		return <polyline key={k} points={pts} className={s.arrowLine} markerEnd="url(#chess-arrowhead)" />;
	});

	const promoCol = promo ? colRow(promo.to) : null;
	const promoDown = promoCol ? promoCol.r === 0 : true;

	return (
		<div ref={boardRef} className={`${s.board} ${dragFrom ? s.dragging : ''}`} role="group" aria-label={t('Chessboard', 'Échiquier')}
			onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
			onPointerCancel={endDrag} onContextMenu={(e) => e.preventDefault()}>
			{squares}
			<svg className={s.arrows} viewBox="0 0 8 8" aria-hidden="true">
				<defs>
					<marker id="chess-arrowhead" viewBox="0 0 4 4" refX="2.2" refY="2" markerWidth="4" markerHeight="4" orient="auto">
						<path d="M0,0 L4,2 L0,4 z" className={s.arrowHead} />
					</marker>
				</defs>
				{arrowEls}
			</svg>
			{dragPiece && <span ref={(el) => { ghostRef.current = el; const d = dragRef.current; if (el && d) moveGhost(d.x, d.y); }} className={`${s.piece} ${s.ghost} ${s[dragPiece.type]} ${dragPiece.color === 'w' ? s.pw : s.pb}`} aria-hidden="true" />}
			{promo && promoCol && (
				<>
					<div className={s.promoScrim} onPointerDown={(e) => { e.stopPropagation(); setPromo(null); }} />
					<div className={s.promoCol} role="group" aria-label={t('Promote to', 'Promouvoir en')}
						style={{ left: `${promoCol.c * 12.5}%`, top: promoDown ? 0 : 'auto', bottom: promoDown ? 'auto' : 0, flexDirection: promoDown ? 'column' : 'column-reverse' }}
						onPointerDown={(e) => e.stopPropagation()}>
						{(['q', 'n', 'r', 'b'] as const).map((k) => (
							<button key={k} type="button" className={s.promoBtn} aria-label={fr ? PIECE_NAME[k][1] : PIECE_NAME[k][0]}
								onClick={() => { const pr = promo; setPromo(null); onMove(pr.from, pr.to, k, false); }}>
								<span className={`${s.piece} ${s[k]} ${human === 'w' ? s.pw : s.pb}`} aria-hidden="true" />
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
