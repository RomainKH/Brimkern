"use client";

// /chess — jouer contre le modèle d'échecs brimkern, dans l'onglet.
// Le modèle (scripts/chess) : UN bloc de transformeur bouclé, ~244 K paramètres, servi en BRIK
// (public/models/chess) et publié aussi en GGUF. Tronc sur WebGPU (kernels du chemin T5, validés contre
// la référence CPU au chargement), repli CPU sinon ; recherche MCTS (src/lib/chess/mcts.ts).
// Niveaux = QUANTITÉ de recherche (et tirage aléatoire pour les plus faibles), jamais un Elo : aucun
// chiffre de force sur la page tant qu'il n'est pas mesuré (règle 4 du dépôt).

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { useT, useHref, useLocale } from '@/lib/i18n';
import type { ChessModel } from '@/lib/chess/model';
import BrandMark from '../BrandMark';
import GithubStarsLink from '../GithubStarsLink';
import Board, { type LastMove, type Premove } from './Board';
import s from './chess.module.css';

const MODEL_URL = '/models/chess/brimkern-chess-q8.brik';
const GGUF_URL = '/models/chess/brimkern-chess-q8_0.gguf';

type Color = 'w' | 'b';
type Status = 'idle' | 'loading' | 'ready' | 'error';

// Débutant/Facile : coup TIRÉ selon la politique du réseau (température) — plausible, pas toujours
// le meilleur. Moyen : le coup préféré du réseau. Fort/Très fort : recherche de 256 / 1 024 positions.
// Maximum : recherche bornée par le TEMPS choisi, sans plafond de positions.
interface Level { id: string; en: string; fr: string; nodes: number; temperature?: number; timed?: boolean; hintEn: string; hintFr: string }
const LEVELS: Level[] = [
	{ id: 'beginner', en: 'Beginner', fr: 'Débutant', nodes: 1, temperature: 1, hintEn: 'Plays a plausible move drawn at random from its network, no search.', hintFr: 'Joue un coup plausible tiré au hasard par son réseau, sans recherche.' },
	{ id: 'easy', en: 'Easy', fr: 'Facile', nodes: 1, temperature: 0.35, hintEn: 'Usually its network’s favourite move, sometimes another one.', hintFr: 'Le plus souvent le coup préféré de son réseau, parfois un autre.' },
	{ id: 'medium', en: 'Medium', fr: 'Moyen', nodes: 1, hintEn: 'Always its network’s favourite move, instantly, no search.', hintFr: 'Toujours le coup préféré de son réseau, instantané, sans recherche.' },
	{ id: 'strong', en: 'Strong', fr: 'Fort', nodes: 256, hintEn: 'Searches 256 positions before each move.', hintFr: 'Examine 256 positions avant chaque coup.' },
	{ id: 'expert', en: 'Very strong', fr: 'Très fort', nodes: 1024, hintEn: 'Searches 1,024 positions before each move.', hintFr: 'Examine 1 024 positions avant chaque coup.' },
	{ id: 'max', en: 'Maximum', fr: 'Maximum', nodes: 1_000_000, timed: true, hintEn: 'Searches as many positions as it can in the time you allow.', hintFr: 'Examine autant de positions que possible dans le temps accordé.' },
];
const MAX_TIMES = [10, 30, 60, 120];
// Style : Agressif = les prises et échecs explorés d'abord (bonus d'a priori) et la nulle comptée
// comme une demi-défaite (contempt) — il évite les simplifications et joue pour gagner. Mêmes
// réglages que la boucle d'apprentissage (scripts/chess/learn.py --play-aggression 1 --contempt 0.2).
const STYLES = {
	aggressive: { en: 'Aggressive', fr: 'Agressif', aggression: 1, contempt: 0.2 },
	balanced: { en: 'Balanced', fr: 'Équilibré', aggression: 0, contempt: 0 },
} as const;
type StyleId = keyof typeof STYLES;

export default function ChessClient() {
	const t = useT();
	const href = useHref();
	const { locale, setLocale } = useLocale();
	const fr = locale === 'fr';

	// La partie et le modèle vivent dans l'état (lisibles au rendu) ; on mute la partie puis `fen`
	// déclenche le rendu. Le calcul en cours et le coup anticipé sont des refs (lus par la boucle async).
	const [game] = useState(() => new Chess());
	const [model, setModel] = useState<ChessModel | null>(null);
	const runRef = useRef<{ cancelled: boolean; stop: AbortController } | null>(null);
	const premoveRef = useRef<Premove | null>(null);
	const seqRef = useRef(0);
	const [fen, setFen] = useState(() => game.fen());
	const [human, setHuman] = useState<Color>('w');
	const [orientation, setOrientation] = useState<Color>('w');
	const [levelId, setLevelId] = useState('expert');
	const [maxTime, setMaxTime] = useState(30);
	const [styleId, setStyleId] = useState<StyleId>('aggressive');
	const [status, setStatus] = useState<Status>('idle');
	const [loadMsg, setLoadMsg] = useState('');
	const [thinking, setThinking] = useState(false);
	const [progress, setProgress] = useState({ done: 0, ms: 0 });
	const [lastMove, setLastMove] = useState<LastMove | null>(null);
	const [premove, setPremoveState] = useState<Premove | null>(null);
	const [whiteWin, setWhiteWin] = useState(0.5);
	const [info, setInfo] = useState<{ nodes: number; ms: number; pv: string[]; backend: string } | null>(null);
	const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[4];

	const setPremove = (p: Premove | null) => { premoveRef.current = p; setPremoveState(p); };
	const mark = (from: string, to: string, animate: boolean) => setLastMove({ from, to, animate, seq: ++seqRef.current });

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
		return () => { alive = false; if (runRef.current) { runRef.current.cancelled = true; runRef.current.stop.abort(); } loaded?.dispose(); };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sync = () => setFen(game.fen());

	const cancelThinking = () => {
		const run = runRef.current;
		if (run) { run.cancelled = true; run.stop.abort(); runRef.current = null; }
		setThinking(false);
	};

	// ── Le moteur joue tant que ce n'est pas à `me` (la couleur humaine, passée explicitement : une
	// nouvelle partie change `human` dans le même événement) ; s'il y a un coup anticipé encore légal,
	// on le joue et le moteur répond à nouveau — une seule boucle, pas de récursion. ──────────────────
	const engineLoop = async (me: Color) => {
		if (!model) return;
		const { search } = await import('@/lib/chess/mcts');
		while (!game.isGameOver() && game.turn() !== me) {
			const run = { cancelled: false, stop: new AbortController() };
			runRef.current = run;
			setThinking(true);
			setProgress({ done: 0, ms: 0 });
			const engineColor = game.turn();
			const res = await search(model, game, {
				nodes: level.nodes, temperature: level.temperature, timeMs: level.timed ? maxTime * 1000 : undefined,
				batch: level.nodes > 256 ? 16 : 8, signal: run.stop.signal,
				aggression: STYLES[styleId].aggression, contempt: STYLES[styleId].contempt,
				onProgress: (done, _v, ms) => setProgress({ done, ms }),
			});
			if (run.cancelled) return;
			runRef.current = null;
			const mv = game.move(res.move);
			mark(mv.from, mv.to, true);
			setWhiteWin(engineColor === 'w' ? res.value : 1 - res.value);
			setInfo({ nodes: res.nodes, ms: res.ms, pv: res.pv, backend: model.backend });
			sync();
			setThinking(false);
			const pm = premoveRef.current;
			if (!pm || game.isGameOver()) break;
			setPremove(null);
			let played = null;
			try { played = game.move({ from: pm.from, to: pm.to, promotion: 'q' }); } catch { played = null; }
			if (!played) break;
			mark(played.from, played.to, true);
			sync();
		}
	};

	const newGame = (color: Color) => {
		cancelThinking();
		game.reset();
		setHuman(color);
		setOrientation(color);
		setLastMove(null); setPremove(null); setInfo(null); setWhiteWin(0.5);
		sync();
		if (color === 'b') void engineLoop('b');
	};

	const undo = () => {
		cancelThinking();
		setPremove(null);
		if (!game.history().length) return;
		game.undo();
		if (game.turn() !== human && game.history().length) game.undo();
		const h = game.history({ verbose: true });
		const last = h[h.length - 1];
		if (last) mark(last.from, last.to, false); else setLastMove(null);
		sync();
	};

	const onMove = (from: Square, to: Square, promotion?: string, animate = true) => {
		let mv;
		try { mv = game.move({ from, to, promotion }); } catch { return; }
		mark(mv.from, mv.to, animate);
		sync();
		void engineLoop(human);
	};

	// PGN de la partie : la matière que scripts/chess/learn.py --pgn transforme en entraînement.
	const downloadPgn = () => {
		const g = new Chess();
		for (const m of game.history({ verbose: true })) g.move(m);
		const me = t('You', 'Vous');
		g.setHeader('Event', 'brimkern chess');
		g.setHeader('Site', window.location.origin + '/chess');
		g.setHeader('Date', new Date().toISOString().slice(0, 10).replace(/-/g, '.'));
		g.setHeader('White', human === 'w' ? me : `brimkern (${level.en})`);
		g.setHeader('Black', human === 'b' ? me : `brimkern (${level.en})`);
		const url = URL.createObjectURL(new Blob([g.pgn() + '\n'], { type: 'application/x-chess-pgn' }));
		const a = document.createElement('a');
		a.href = url; a.download = `brimkern-chess-${Date.now()}.pgn`; a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	};

	// ── Statut de partie. ───────────────────────────────────────────────────────────────────────────
	const over = game.isGameOver();
	const searching = level.nodes > 1;
	let statusText: string;
	if (status === 'loading') statusText = loadMsg;
	else if (status === 'error') statusText = t('The model could not be loaded.', 'Le modèle n’a pas pu être chargé.');
	else if (game.isCheckmate()) statusText = game.turn() === human ? t('Checkmate: brimkern wins.', 'Échec et mat : brimkern gagne.') : t('Checkmate: you win.', 'Échec et mat : vous gagnez.');
	else if (game.isStalemate()) statusText = t('Draw by stalemate.', 'Nulle par pat.');
	else if (game.isThreefoldRepetition()) statusText = t('Draw by threefold repetition.', 'Nulle par triple répétition.');
	else if (game.isInsufficientMaterial()) statusText = t('Draw: insufficient material.', 'Nulle : matériel insuffisant.');
	else if (over) statusText = t('Draw (fifty-move rule).', 'Nulle (règle des cinquante coups).');
	else if (thinking && !searching) statusText = t('brimkern is playing…', 'brimkern joue…');
	else if (thinking && level.timed) statusText = t(`brimkern is thinking… ${progress.done.toLocaleString('en')} positions, ${Math.floor(progress.ms / 1000)} / ${maxTime} s`,
		`brimkern réfléchit… ${progress.done.toLocaleString('fr')} positions, ${Math.floor(progress.ms / 1000)} / ${maxTime} s`);
	else if (thinking) statusText = t(`brimkern is thinking… ${progress.done} / ${level.nodes.toLocaleString('en')}`, `brimkern réfléchit… ${progress.done} / ${level.nodes.toLocaleString('fr')}`);
	else statusText = game.inCheck() ? t('Your move: you are in check.', 'À vous : vous êtes en échec.') : t('Your move.', 'À vous de jouer.');

	const ranks = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
	const files = orientation === 'w' ? 'abcdefgh'.split('') : 'hgfedcba'.split('');
	const history = game.history();
	const whiteShare = Math.round(whiteWin * 100);
	const backendName = (b: string) => (b === 'webgpu' ? 'WebGPU' : 'CPU');

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
							<Board game={game} fen={fen} orientation={orientation} human={human}
								canMove={status === 'ready' && !thinking && !over && game.turn() === human}
								canPremove={status === 'ready' && thinking && !over}
								lastMove={lastMove} premove={premove} onMove={onMove} onPremove={setPremove} />
							<div className={s.files} aria-hidden="true">{files.map((f) => <span key={f}>{f}</span>)}</div>
						</div>

						<div className={s.panel}>
							<div className={s.card} aria-live="polite">
								<div className={s.status}>{statusText}</div>
								{thinking && searching && (
									<button type="button" className={`${s.btn} ${s.playNow}`} onClick={() => runRef.current?.stop.abort()}>
										{t('Play now', 'Jouer maintenant')}
									</button>
								)}
								{premove && <div className={s.sub}>{t(`Premove: ${premove.from}–${premove.to} (click the board to cancel)`, `Coup anticipé : ${premove.from}–${premove.to} (clic sur l’échiquier pour l’annuler)`)}</div>}
								{info && !thinking && (
									<div className={s.sub}>
										{info.nodes > 1
											? t(`${info.nodes.toLocaleString('en')} positions in ${(info.ms / 1000).toFixed(1)} s (${backendName(info.backend)})`,
												`${info.nodes.toLocaleString('fr')} positions en ${(info.ms / 1000).toFixed(1)} s (${backendName(info.backend)})`)
											: t(`Network only, ${Math.round(info.ms)} ms (${backendName(info.backend)})`, `Réseau seul, ${Math.round(info.ms)} ms (${backendName(info.backend)})`)}
										{info.pv.length > 1 && <><br />{t('Expected line: ', 'Suite attendue : ')}{info.pv.join(' ')}</>}
									</div>
								)}
							</div>

							<div className={s.card}>
								<label className={s.label} htmlFor="chess-level">{t('Difficulty', 'Difficulté')}</label>
								<select id="chess-level" className={s.select} value={levelId} onChange={(e) => setLevelId(e.target.value)}>
									{LEVELS.map((l) => <option key={l.id} value={l.id}>{fr ? l.fr : l.en}</option>)}
								</select>
								<div className={s.sub} style={{ marginBottom: level.timed ? 10 : 12 }}>{fr ? level.hintFr : level.hintEn}</div>
								{level.timed && (
									<>
										<label className={s.label} htmlFor="chess-time">{t('Thinking time per move', 'Temps de réflexion par coup')}</label>
										<select id="chess-time" className={s.select} style={{ marginBottom: 12 }} value={maxTime} onChange={(e) => setMaxTime(Number(e.target.value))}>
											{MAX_TIMES.map((n) => <option key={n} value={n}>{n < 60 ? `${n} s` : `${n / 60} min`}</option>)}
										</select>
									</>
								)}
								<label className={s.label} htmlFor="chess-style">{t('Style', 'Style')}</label>
								<select id="chess-style" className={s.select} style={{ marginBottom: 12 }} value={styleId} onChange={(e) => setStyleId(e.target.value as StyleId)}>
									{(Object.keys(STYLES) as StyleId[]).map((k) => <option key={k} value={k}>{fr ? STYLES[k].fr : STYLES[k].en}</option>)}
								</select>
								<div className={s.row} style={{ marginBottom: 8 }}>
									<button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={() => newGame('w')} disabled={status !== 'ready'}>
										{t('New game (White)', 'Nouvelle partie (blancs)')}
									</button>
									<button type="button" className={s.btn} onClick={() => newGame('b')} disabled={status !== 'ready'}>
										{t('Play Black', 'Jouer les noirs')}
									</button>
								</div>
								<div className={s.row}>
									<button type="button" className={s.btn} onClick={undo} disabled={status !== 'ready' || !history.length}>{t('Take back', 'Reprendre')}</button>
									<button type="button" className={s.btn} onClick={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}>{t('Flip board', 'Retourner')}</button>
									<button type="button" className={s.btn} onClick={downloadPgn} disabled={!history.length} aria-label={t('Download PGN', 'Télécharger le PGN')}>PGN</button>
								</div>
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
								) : <div className={s.sub}>{t('No moves yet. Drag a piece, or click it and then its square.', 'Aucun coup joué. Faites glisser une pièce, ou cliquez-la puis sa case.')}</div>}
							</div>

							<div className={`${s.card} ${s.info}`}>
								{model
									? t(`Model: ${Math.round(model.bytes / 1024)} KB, one shared block looped ${model.loops} times, running on ${model.backend === 'webgpu' ? 'WebGPU' : 'the CPU (WebGPU unavailable or not validated)'}.`,
										`Modèle : ${Math.round(model.bytes / 1024)} Ko, un seul bloc partagé bouclé ${model.loops} fois, sur ${model.backend === 'webgpu' ? 'WebGPU' : 'le CPU (WebGPU indisponible ou non validé)'}.`)
									: t('Model: loading…', 'Modèle : chargement…')}
								<br />
								{t('Right-click a square to highlight it, right-drag to draw an arrow.', 'Clic droit sur une case pour la surligner, glisser au clic droit pour une flèche.')}
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
