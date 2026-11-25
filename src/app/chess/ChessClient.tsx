"use client";

// /chess — jouer contre le modèle d'échecs brimkern, dans l'onglet.
// Le modèle (scripts/chess) : UN bloc de transformeur bouclé, ~244 K paramètres, servi en BRIK
// (public/models/chess) et publié aussi en GGUF. Tronc sur WebGPU (kernels du chemin T5, validés contre
// la référence CPU au chargement), repli CPU sinon ; recherche MCTS (src/lib/chess/mcts.ts).
// Aucun chiffre de force sur la page tant qu'il n'est pas mesuré (règle 4 du dépôt).

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type Move, type Square } from 'chess.js';
import { useT, useHref, useLocale } from '@/lib/i18n';
import type { ChessModel } from '@/lib/chess/model';
import BrandMark from '../BrandMark';
import GithubStarsLink from '../GithubStarsLink';
import s from './chess.module.css';

const MODEL_URL = '/models/chess/brimkern-chess-q8.brik';
const GGUF_URL = '/models/chess/brimkern-chess-q8_0.gguf';
const FILES = 'abcdefgh';
const LEVELS = [1, 64, 256, 1024] as const;

type Color = 'w' | 'b';
type Status = 'idle' | 'loading' | 'ready' | 'error';

const PIECE_NAME: Record<string, [string, string]> = {
	k: ['king', 'roi'], q: ['queen', 'dame'], r: ['rook', 'tour'], b: ['bishop', 'fou'], n: ['knight', 'cavalier'], p: ['pawn', 'pion'],
};

export default function ChessClient() {
	const t = useT();
	const href = useHref();
	const { locale, setLocale } = useLocale();
	const fr = locale === 'fr';

	// La partie et le modèle vivent dans l'état (lisibles au rendu) ; on mute la partie puis `fen`
	// déclenche le rendu. Seul le contrôleur d'annulation de la recherche est une ref.
	const [game] = useState(() => new Chess());
	const [model, setModel] = useState<ChessModel | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const [fen, setFen] = useState(() => game.fen());
	const [human, setHuman] = useState<Color>('w');
	const [orientation, setOrientation] = useState<Color>('w');
	const [level, setLevel] = useState<number>(256);
	const [status, setStatus] = useState<Status>('idle');
	const [loadMsg, setLoadMsg] = useState('');
	const [thinking, setThinking] = useState(false);
	const [progress, setProgress] = useState(0);
	const [selected, setSelected] = useState<Square | null>(null);
	const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
	const [promo, setPromo] = useState<{ from: Square; to: Square } | null>(null);
	const [whiteWin, setWhiteWin] = useState(0.5);
	const [info, setInfo] = useState<{ nodes: number; ms: number; pv: string[]; backend: string } | null>(null);

	// ── Chargement : WebGPU (validé) puis le modèle. Jamais d'erreur bloquante : repli CPU. ─────────
	useEffect(() => {
		let alive = true;
		let loaded: ChessModel | null = null;
		(async () => {
			setStatus('loading');
			setLoadMsg(t('Starting the GPU engine…', 'Démarrage du moteur GPU…'));
			let engine = null;
			try {
				const { WebGpuEngine } = await import('@/lib/webgpu/kernels');
				const e = new WebGpuEngine();
				if (await e.init()) { await e.selfValidate(); engine = e; }
			} catch (err) { console.warn('[chess] WebGPU indisponible, modèle sur le CPU :', err); }
			if (!alive) return;
			setLoadMsg(t('Loading the model…', 'Chargement du modèle…'));
			try {
				const { ChessModel } = await import('@/lib/chess/model');
				const m = await ChessModel.load(MODEL_URL, engine);
				if (!alive) { m.dispose(); return; }
				loaded = m;
				setModel(m);
				setStatus('ready');
			} catch (err) {
				console.error('[chess] chargement du modèle échoué', err);
				if (alive) setStatus('error');
			}
		})();
		return () => { alive = false; abortRef.current?.abort(); loaded?.dispose(); };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sync = useCallback(() => setFen(game.fen()), [game]);

	const engineMove = useCallback(async () => {
		if (!model || game.isGameOver()) return;
		const ctl = new AbortController();
		abortRef.current = ctl;
		setThinking(true);
		setProgress(0);
		try {
			const { search } = await import('@/lib/chess/mcts');
			const engineColor = game.turn();
			const res = await search(model, game, { nodes: level, signal: ctl.signal, onProgress: (n) => setProgress(n) });
			if (ctl.signal.aborted) return;
			const mv = game.move(res.move);
			setLastMove({ from: mv.from, to: mv.to });
			setWhiteWin(engineColor === 'w' ? res.value : 1 - res.value);
			setInfo({ nodes: res.nodes, ms: res.ms, pv: res.pv, backend: model.backend });
			sync();
		} finally {
			if (abortRef.current === ctl) { abortRef.current = null; setThinking(false); }
		}
	}, [game, model, level, sync]);

	const newGame = (color: Color) => {
		abortRef.current?.abort();
		game.reset();
		setHuman(color);
		setOrientation(color);
		setSelected(null); setLastMove(null); setPromo(null); setInfo(null); setWhiteWin(0.5);
		sync();
		if (color === 'b') void engineMove();
	};

	const undo = () => {
		abortRef.current?.abort();
		setThinking(false);
		if (!game.history().length) return;
		game.undo();
		if (game.turn() !== human && game.history().length) game.undo();
		const h = game.history({ verbose: true });
		const last = h[h.length - 1];
		setLastMove(last ? { from: last.from, to: last.to } : null);
		setSelected(null); setPromo(null);
		sync();
	};

	const play = (from: Square, to: Square, promotion?: string) => {
		let mv: Move;
		try { mv = game.move({ from, to, promotion }); } catch { return; }
		setLastMove({ from: mv.from, to: mv.to });
		setSelected(null); setPromo(null);
		sync();
		void engineMove();
	};

	// PGN de la partie : la matière que scripts/chess/learn.py --pgn transforme en entraînement.
	const downloadPgn = () => {
		const g = new Chess();
		for (const m of game.history({ verbose: true })) g.move(m);
		const me = t('You', 'Vous');
		g.setHeader('Event', 'brimkern chess');
		g.setHeader('Site', typeof window !== 'undefined' ? window.location.origin + '/chess' : 'brimkern');
		g.setHeader('Date', new Date().toISOString().slice(0, 10).replace(/-/g, '.'));
		g.setHeader('White', human === 'w' ? me : `brimkern (${level})`);
		g.setHeader('Black', human === 'b' ? me : `brimkern (${level})`);
		const url = URL.createObjectURL(new Blob([g.pgn() + '\n'], { type: 'application/x-chess-pgn' }));
		const a = document.createElement('a');
		a.href = url; a.download = `brimkern-chess-${Date.now()}.pgn`; a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	};

	const legalFrom = useMemo(() => (selected ? game.moves({ square: selected, verbose: true }) : []),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selected, fen]);

	const onSquare = (sq: Square) => {
		if (status !== 'ready' || thinking || game.isGameOver() || game.turn() !== human) return;
		const piece = game.get(sq);
		if (selected) {
			const mv = legalFrom.find((m) => m.to === sq);
			if (mv) {
				if (mv.promotion) setPromo({ from: selected, to: sq });
				else play(selected, sq);
				return;
			}
		}
		setSelected(piece && piece.color === human ? sq : null);
	};

	// ── Statut de partie. ───────────────────────────────────────────────────────────────────────────
	const over = game.isGameOver();
	let statusText: string;
	if (status === 'loading') statusText = loadMsg;
	else if (status === 'error') statusText = t('The model could not be loaded.', 'Le modèle n’a pas pu être chargé.');
	else if (game.isCheckmate()) statusText = game.turn() === human ? t('Checkmate: brimkern wins.', 'Échec et mat : brimkern gagne.') : t('Checkmate: you win.', 'Échec et mat : vous gagnez.');
	else if (game.isStalemate()) statusText = t('Draw by stalemate.', 'Nulle par pat.');
	else if (game.isThreefoldRepetition()) statusText = t('Draw by threefold repetition.', 'Nulle par triple répétition.');
	else if (game.isInsufficientMaterial()) statusText = t('Draw: insufficient material.', 'Nulle : matériel insuffisant.');
	else if (over) statusText = t('Draw (fifty-move rule).', 'Nulle (règle des cinquante coups).');
	else if (thinking) statusText = level <= 1 ? t('brimkern is playing…', 'brimkern joue…') : t(`brimkern is thinking… ${progress}/${level}`, `brimkern réfléchit… ${progress}/${level}`);
	else statusText = game.inCheck() ? t('Your move: you are in check.', 'À vous : vous êtes en échec.') : t('Your move.', 'À vous de jouer.');

	// ── Échiquier. ──────────────────────────────────────────────────────────────────────────────────
	const rows = game.board();
	const checkSq = game.inCheck() ? rows.flat().find((p) => p && p.type === 'k' && p.color === game.turn())?.square : null;
	const targets = new Map(legalFrom.map((m) => [m.to, !!m.captured]));
	const squares: React.ReactNode[] = [];
	for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
		const rank = orientation === 'w' ? 8 - i : i + 1;
		const file = orientation === 'w' ? j : 7 - j;
		const sq = `${FILES[file]}${rank}` as Square;
		const p = rows[8 - rank][file];
		const light = (file + rank) % 2 === 1;
		const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
		const cls = [s.sq, light ? s.light : s.dark, isLast ? s.last : '', selected === sq ? s.selected : '', checkSq === sq ? s.check : ''].join(' ');
		const name = p ? `${sq}, ${fr ? `${PIECE_NAME[p.type][1]} ${p.color === 'w' ? 'blanc' : 'noir'}` : `${p.color === 'w' ? 'white' : 'black'} ${PIECE_NAME[p.type][0]}`}` : sq;
		squares.push(
			<button key={sq} type="button" className={cls} onClick={() => onSquare(sq)} aria-label={name} aria-pressed={selected === sq}>
				{p && <span className={`${s.piece} ${s[p.type]} ${p.color === 'w' ? s.pw : s.pb}`} aria-hidden="true" />}
				{targets.has(sq) && <span className={targets.get(sq) ? s.ring : s.dot} aria-hidden="true" />}
			</button>,
		);
	}
	const ranks = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
	const files = orientation === 'w' ? FILES.split('') : FILES.split('').reverse();
	const history = game.history();
	const whiteShare = Math.round(whiteWin * 100);

	return (
		<div className="docs-page">
			<div className="docs-shell">
				<header className="docs-header">
					<Link href={href('/')} className="docs-brand" aria-label="Brimkern">
						<BrandMark size={24} />
						<span>Brimkern</span>
						<span className="docs-brand-badge">{t('chess', 'échecs')}</span>
					</Link>
					<div className="docs-header-actions">
						<Link href={href('/chat')} className="docs-header-link">{t('Chat', 'Chat')}</Link>
						<Link href={href('/docs')} className="docs-header-link">Docs</Link>
						<GithubStarsLink className="lp-gh-stars" size={14} />
						<button onClick={() => setLocale(fr ? 'en' : 'fr')} aria-label={fr ? 'Switch to English' : 'Passer en français'} className="docs-header-lang">
							{fr ? 'EN' : 'FR'}
						</button>
					</div>
				</header>

				<main className={s.wrap}>
					<h1 className={s.title}>{t('Play chess against brimkern', 'Jouez aux échecs contre brimkern')}</h1>
					<p className={s.lead}>
						{t(
							'A chess model trained by brimkern, small enough to load in an instant: one transformer block, looped, that runs in your tab on your GPU. Nothing is sent anywhere.',
							'Un modèle d’échecs entraîné par brimkern, assez petit pour se charger en un instant : un seul bloc de transformeur, bouclé, qui tourne dans votre onglet sur votre GPU. Rien ne part sur un serveur.',
						)}
					</p>

					<div className={s.layout}>
						<div className={s.boardGrid}>
							<div className={s.evalBar} role="img" aria-label={t(`Evaluation: White ${whiteShare}% to win`, `Évaluation : ${whiteShare} % de gain pour les blancs`)}
								style={{ flexDirection: orientation === 'w' ? 'column' : 'column-reverse' }}>
								<div className={s.evalBlack} style={{ flexGrow: 100 - whiteShare }} />
								<div className={s.evalWhite} style={{ flexGrow: whiteShare }} />
							</div>
							<div className={s.ranks} aria-hidden="true">{ranks.map((r) => <span key={r}>{r}</span>)}</div>
							<div className={s.board} role="group" aria-label={t('Chessboard', 'Échiquier')}>
								{squares}
								{promo && (
									<div className={s.promo}>
										<div className={s.promoBox} role="group" aria-label={t('Promote to', 'Promouvoir en')}>
											{(['q', 'r', 'b', 'n'] as const).map((k) => (
												<button key={k} type="button" className={s.promoBtn} onClick={() => play(promo.from, promo.to, k)}
													aria-label={fr ? PIECE_NAME[k][1] : PIECE_NAME[k][0]}>
													<span className={`${s.piece} ${s[k]} ${human === 'w' ? s.pw : s.pb}`} aria-hidden="true" />
												</button>
											))}
										</div>
									</div>
								)}
							</div>
							<div className={s.files} aria-hidden="true">{files.map((f) => <span key={f}>{f}</span>)}</div>
						</div>

						<div className={s.panel}>
							<div className={s.card} aria-live="polite">
								<div className={s.status}>{statusText}</div>
								{info && (
									<div className={s.sub}>
										{info.nodes > 1
											? t(`${info.nodes} positions evaluated in ${(info.ms / 1000).toFixed(1)} s (${info.backend === 'webgpu' ? 'WebGPU' : 'CPU'})`,
												`${info.nodes} positions évaluées en ${(info.ms / 1000).toFixed(1)} s (${info.backend === 'webgpu' ? 'WebGPU' : 'CPU'})`)
											: t(`Network only, ${Math.round(info.ms)} ms (${info.backend === 'webgpu' ? 'WebGPU' : 'CPU'})`,
												`Réseau seul, ${Math.round(info.ms)} ms (${info.backend === 'webgpu' ? 'WebGPU' : 'CPU'})`)}
										{info.pv.length > 1 && <><br />{t('Expected line: ', 'Suite attendue : ')}{info.pv.join(' ')}</>}
									</div>
								)}
							</div>

							<div className={s.card}>
								<div className={s.row} style={{ marginBottom: 12 }}>
									<button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={() => newGame('w')} disabled={status !== 'ready'}>
										{t('New game (White)', 'Nouvelle partie (blancs)')}
									</button>
									<button type="button" className={s.btn} onClick={() => newGame('b')} disabled={status !== 'ready'}>
										{t('Play Black', 'Jouer les noirs')}
									</button>
								</div>
								<div className={s.row} style={{ marginBottom: 12 }}>
									<button type="button" className={s.btn} onClick={undo} disabled={status !== 'ready' || !history.length}>{t('Take back', 'Reprendre')}</button>
									<button type="button" className={s.btn} onClick={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}>{t('Flip board', 'Retourner')}</button>
								</div>
								<div className={s.row} style={{ marginBottom: 12 }}>
									<button type="button" className={s.btn} onClick={downloadPgn} disabled={!history.length}>{t('Download PGN', 'Télécharger le PGN')}</button>
								</div>
								<label className={s.label} htmlFor="chess-level">{t('Thinking per move', 'Réflexion par coup')}</label>
								<select id="chess-level" className={s.select} value={level} onChange={(e) => setLevel(Number(e.target.value))} disabled={thinking}>
									{LEVELS.map((n) => (
										<option key={n} value={n}>
											{n === 1 ? t('Network only (instant)', 'Réseau seul (instantané)') : t(`${n.toLocaleString('en')} positions`, `${n.toLocaleString('fr')} positions`)}
										</option>
									))}
								</select>
							</div>

							<div className={s.card}>
								<div className={s.label}>{t('Moves', 'Coups')}</div>
								{history.length ? (
									<div className={s.moves} tabIndex={0} aria-label={t('Move list', 'Liste des coups')}>
										{Array.from({ length: Math.ceil(history.length / 2) }, (_, i) => (
											<div key={i} style={{ display: 'contents' }}>
												<span className={s.moveNum}>{i + 1}.</span>
												<span>{history[2 * i]}</span>
												<span>{history[2 * i + 1] ?? ''}</span>
											</div>
										))}
									</div>
								) : <div className={s.sub}>{t('No moves yet.', 'Aucun coup joué.')}</div>}
							</div>

							<div className={`${s.card} ${s.info}`}>
								{model
									? t(`Model: ${Math.round(model.bytes / 1024)} KB, one shared block looped ${model.loops} times, running on ${model.backend === 'webgpu' ? 'WebGPU' : 'the CPU (WebGPU unavailable or not validated)'}.`,
										`Modèle : ${Math.round(model.bytes / 1024)} Ko, un seul bloc partagé bouclé ${model.loops} fois, sur ${model.backend === 'webgpu' ? 'WebGPU' : 'le CPU (WebGPU indisponible ou non validé)'}.`)
									: t('Model: loading…', 'Modèle : chargement…')}
								<br />
								{t('Open weights: ', 'Poids ouverts : ')}
								<a href={MODEL_URL} download>.brik</a>{' · '}<a href={GGUF_URL} download>.gguf</a>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
