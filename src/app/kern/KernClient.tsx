"use client";

// Kern 0 (/kern) — la page qui met en avant le modèle d'échecs de brimkern (demande de Romain,
// 2026-11-26). Page produit dans DocsShell, comme /extension et /vs-webllm.
//
// Règle 4 du dépôt : chaque chiffre écrit ici est MESURÉ — tailles de fichiers relevées sur disque le
// 2026-11-26, vitesse dans Chrome (ROADMAP § 31, build de production, M4). Les résultats de la boucle
// ne sont PAS recopiés : ils sont lus en direct dans le dataset (history.jsonl), et la partie en cours
// dans le bucket (live.json, réécrit par publish.py) — la page ne vieillit pas et ne peut pas enjoliver.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Chess } from 'chess.js';
import { useT, useHref } from '@/lib/i18n';
import DocsShell, { PageTitle } from '../docs/DocsShell';
import cs from '../chess/chess.module.css';

const LIVE = 'https://huggingface.co/buckets/romainkh14/brimkern-chess-live/resolve/live.json';
const HISTORY = 'https://huggingface.co/datasets/romainkh14/brimkern-chess-games/resolve/main/history.jsonl';
const SPACE = 'https://huggingface.co/spaces/romainkh14/brimkern-chess-live';
const DATASET = 'https://huggingface.co/datasets/romainkh14/brimkern-chess-games';
const CODE = 'https://github.com/RomainKH/Brimkern/tree/main/scripts/chess';

type T = (en: string, fr: string) => string;
interface Opening { src: 'book' | 'iconic'; by?: string[]; game?: string; name?: { en: string; fr: string } }
interface Live {
  phase?: string; gen?: number; game?: number; games?: number; spec?: string; fen?: string; last?: string;
  white?: string; black?: string; opponent?: string; score?: number; updated?: number; opening?: Opening | null;
  positions?: number; analysed?: number;
}
interface Gen { gen: number; vs_opponent: { opponent: string; score: number; games: number }; gate: { score: number; games: number }; accepted: boolean }

// learn.py écrit les noms d'adversaires en français (« Leela (16 nœuds) ») ; l'étiquette (sf:2300,
// ld2:16, leela:1, maia:1900) est la source quand elle existe.
function oppFromSpec(spec: string, t: T): string {
  const [kind, n] = spec.split(':');
  const nodes = (label: string) => t(`${label} (${n} node${n === '1' ? '' : 's'})`, `${label} (${n} nœud${n === '1' ? '' : 's'})`);
  if (kind === 'sf') return `Stockfish ${n}`;
  if (kind === 'maia') return `Maia ${n}`;
  if (kind === 'leela') return nodes('Leela');
  if (kind === 'ld2') return nodes('Leela LD2');
  return spec;
}
function oppFromName(name: string, t: T): string {
  const m = /^Leela (LD2 )?\((\d+) nœuds?\)$/.exec(name);
  return m ? oppFromSpec(`${m[1] ? 'ld2' : 'leela'}:${m[2]}`, t) : name;
}
function openingText(o: Opening, t: T): string {
  if (o.src === 'iconic' && o.name) return t(`opening of “${o.name.en}” (${o.game})`, `ouverture de « ${o.name.fr} » (${o.game})`);
  const by = o.by || [];
  return by.length ? t(`opening played by ${by.join(' and ')}`, `ouverture jouée par ${by.join(' et ')}`) : t('masters’ opening', 'ouverture de maîtres');
}

// Échiquier en lecture seule : 64 cases non interactives, un seul nom accessible pour l'ensemble.
function MiniBoard({ fen, last, flip, label }: { fen: string; last?: string; flip: boolean; label: string }) {
  let rows: ({ type: string; color: string } | null)[][] = [];
  try { rows = new Chess(fen).board(); } catch { return null; }
  const lastSq = last ? [last.slice(0, 2), last.slice(2, 4)] : [];
  const cells = [];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const r = flip ? 7 - i : i, f = flip ? 7 - j : j;
    const sq = 'abcdefgh'[f] + (8 - r);
    const p = rows[r][f];
    const light = (r + f) % 2 === 0;
    cells.push(
      <div key={sq} className={`${cs.sq} ${light ? cs.light : cs.dark} ${lastSq.includes(sq) ? cs.last : ''}`} style={{ cursor: 'default' }}>
        {p && <span className={`${cs.piece} ${cs[p.type]} ${p.color === 'w' ? cs.pw : cs.pb}`} />}
      </div>,
    );
  }
  return <div className={cs.board} role="img" aria-label={label} style={{ touchAction: 'auto' }}>{cells}</div>;
}

function LiveGame({ t }: { t: T }) {
  const [s, setS] = useState<Live | null>(null);
  // « En pause » se décide à la réception (l'heure n'est pas lue au rendu : règle de pureté de React).
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let alive = true, timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const r = await fetch(LIVE, { cache: 'no-store' });
        const j: Live = await r.json();
        // Jeu : un coup toutes les quelques secondes. Analyse et entraînement : un signe de vie toutes les
        // 50 positions / 30 s (learn.py depuis la gen 9), mais jusqu'à une heure sans rien avant.
        const quiet = j.phase === 'annotate' || j.phase === 'train' ? 3 * 3600 : 600;
        if (alive) { setS(j); setPaused(!j.updated || Date.now() / 1000 - j.updated > quiet); }
      } catch { /* hors ligne : on garde le dernier état */ }
      if (alive) timer = setTimeout(tick, 3000);
    };
    tick();
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  if (!s) return <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('Loading the game in progress…', 'Chargement de la partie en cours…')}</p>;
  const isKern = (n?: string) => /^(Kern|brimkern|candidate)/.test(n || '');
  const opp = s.spec && s.phase === 'play' ? oppFromSpec(s.spec, t) : t('the champion', 'le champion');
  const who = (n?: string) => !n ? '' : isKern(n) ? (s.phase === 'gate' ? t('new version', 'nouvelle version') : 'Kern 0') : n === 'champion' ? t('champion', 'champion') : oppFromName(n, t);
  const status = paused
    ? t('The learning loop is paused (the machine may be off). Last position:', 'La boucle d’apprentissage est en pause (la machine est peut-être éteinte). Dernière position :')
    : s.phase === 'play' ? t(`Generation ${s.gen}, game ${s.game} of ${s.games}: Kern 0 against ${opp}.`, `Génération ${s.gen}, partie ${s.game} sur ${s.games} : Kern 0 contre ${opp}.`)
    : s.phase === 'gate' ? t(`Generation ${s.gen}, gate game ${s.game} of ${s.games}: the new version must beat the champion to replace it.`, `Génération ${s.gen}, départage ${s.game} sur ${s.games} : la nouvelle version doit battre le champion pour le remplacer.`)
    : s.phase === 'annotate' ? t(`Generation ${s.gen}: the games are over, Stockfish is analysing the ${s.positions ?? ''} positions Kern 0 just played${s.analysed ? ` (${s.analysed} done)` : ''}. The board comes back with the gate games, after retraining.`,
                                 `Génération ${s.gen} : les parties sont finies, Stockfish analyse les ${s.positions ?? ''} positions que Kern 0 vient de jouer${s.analysed ? ` (${s.analysed} faites)` : ''}. L’échiquier reprend avec le départage, après le réentraînement.`)
    : s.phase === 'train' ? t(`Generation ${s.gen}: Kern 0 is retraining on its corrected games. The board comes back with the gate games.`, `Génération ${s.gen} : Kern 0 se réentraîne sur ses parties corrigées. L’échiquier reprend avec le départage.`)
    : '';
  const playing = s.phase === 'play' || s.phase === 'gate';
  const flip = isKern(s.black) && !isKern(s.white);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)', gap: 20, alignItems: 'start' }} className="kern-live">
      {s.fen ? (
        <MiniBoard fen={s.fen} last={s.last} flip={flip}
          label={t(`Position of the game in progress: ${who(s.white)} (white) against ${who(s.black)} (black).`,
                   `Position de la partie en cours : ${who(s.white)} (blancs) contre ${who(s.black)} (noirs).`)} />
      ) : <div />}
      <div>
        <p style={{ color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.55, margin: '0 0 8px' }} aria-live="polite">{status}</p>
        {playing && s.white && s.black && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55, margin: '0 0 8px' }}>
            {t('White', 'Blancs')} : {who(s.white)} · {t('Black', 'Noirs')} : {who(s.black)}
            {s.opening ? <><br />{openingText(s.opening, t)}</> : null}
          </p>
        )}
        <a href={SPACE} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13.5, padding: '7px 14px', marginTop: 6 }}>
          {t('Follow it move by move, with every game of this generation', 'Le suivre coup par coup, avec toutes les parties de la génération')} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

function History({ t }: { t: T }) {
  const [rows, setRows] = useState<Gen[] | null>(null);
  useEffect(() => {
    fetch(HISTORY, { cache: 'no-store' })
      .then((r) => r.text())
      .then((txt) => setRows(txt.split('\n').filter(Boolean).map((l) => JSON.parse(l)).reverse()))
      .catch(() => setRows([]));
  }, []);
  const th = { textAlign: 'left', padding: '8px 10px 8px 0', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 } as const;
  const td = { padding: '9px 10px 9px 0', fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' } as const;
  if (rows === null) return <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('Loading the results…', 'Chargement des résultats…')}</p>;
  if (!rows.length) return <p style={{ color: 'var(--text-muted)', fontSize: 14 }}><a href={DATASET}>{t('Results are in the dataset.', 'Les résultats sont dans le dataset.')}</a></p>;
  return (
    <div style={{ overflowX: 'auto' }} role="region" tabIndex={0} aria-label={t('Results by generation', 'Résultats par génération')}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
            <th scope="col" style={th}>{t('Gen.', 'Gén.')}</th>
            <th scope="col" style={th}>{t('Opponent', 'Adversaire')}</th>
            <th scope="col" style={th}>{t('Kern 0’s score', 'Score de Kern 0')}</th>
            <th scope="col" style={th}>{t('Gate', 'Départage')}</th>
            <th scope="col" style={th}>{t('New champion', 'Nouveau champion')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((g) => (
            <tr key={g.gen} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={td}>{g.gen}</td>
              <td style={{ ...td, fontFamily: 'inherit', color: 'var(--text-primary)' }}>{oppFromName(g.vs_opponent.opponent, t)}</td>
              <td style={td}>{String(g.vs_opponent.score).replace('.', t('.', ','))}/{g.vs_opponent.games}</td>
              <td style={td}>{String(g.gate.score).replace('.', t('.', ','))}/{g.gate.games}</td>
              <td style={{ ...td, fontFamily: 'inherit', color: g.accepted ? 'var(--success)' : 'var(--text-muted)' }}>{g.accepted ? t('yes', 'oui') : t('no', 'non')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function KernClient() {
  const t = useT();
  const href = useHref();
  const h2 = { fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '46px 0 14px', color: 'var(--text-primary)', scrollMarginTop: 84 } as const;
  const p = { color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.65, margin: '0 0 12px', maxWidth: 720 } as const;
  const card = { padding: 20 } as const;
  const h3 = { fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' } as const;
  const cardP = { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.55, margin: 0 } as const;

  // Tailles sur disque, relevées le 2026-11-26 (octets → Mo décimaux, comme fmtModelSize).
  const sizes: { name: string; what: string; size: string; us?: boolean }[] = [
    { name: 'Kern 0', what: t('8-bit weights (.brik); 351 KB as GGUF', 'poids 8 bits (.brik) ; 351 Ko en GGUF'), size: t('290 KB', '290 Ko'), us: true },
    { name: 'Maia 1900', what: t('Leela network trained to play like a 1900 human', 'réseau Leela entraîné à jouer comme un humain à 1900'), size: t('1.3 MB', '1,3 Mo') },
    { name: 'Leela LD2', what: t('a small Leela network', 'un petit réseau Leela'), size: t('6.4 MB', '6,4 Mo') },
    { name: 'Leela T1-256x10', what: t('the smallest network on Leela’s recommended list', 'le plus petit réseau de la liste recommandée de Leela'), size: t('37 MB', '37 Mo') },
    { name: 'Stockfish 19', what: t('the program with its built-in networks', 'le programme avec ses réseaux intégrés'), size: t('100 MB', '100 Mo') },
  ];

  const toc = [
    { id: 'live', label: t('Playing right now', 'En ce moment') },
    { id: 'different', label: t('What makes it different', 'Ce qui le distingue') },
    { id: 'size', label: t('Size, measured', 'La taille, mesurée') },
    { id: 'learns', label: t('How it learns', 'Comment il apprend') },
    { id: 'results', label: t('Results', 'Résultats') },
    { id: 'open', label: t('Open', 'Ouvert') },
  ];

  return (
    <DocsShell toc={toc}>
      <style>{'@media (max-width: 640px) { .kern-live { grid-template-columns: minmax(0, 1fr) !important; } }'}</style>
      <PageTitle title={t('Kern 0, a 290 KB chess model that learns in public', 'Kern 0, un modèle d’échecs de 290 Ko qui apprend en public')}>
        {t('Kern 0 is brimkern’s chess model. It fits in 290 KB, plays in your browser tab on your GPU, and learns by playing Stockfish and Leela Chess Zero. Every game it plays is published as it happens.',
           'Kern 0 est le modèle d’échecs de brimkern. Il tient dans 290 Ko, joue dans votre onglet sur votre GPU, et apprend en affrontant Stockfish et Leela Chess Zero. Chacune de ses parties est publiée au moment où elle se joue.')}
      </PageTitle>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
        <Link href={href('/chess')} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
          {t('Play against Kern 0', 'Jouer contre Kern 0')} <ArrowRight size={15} />
        </Link>
        <a href={SPACE} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
          {t('Watch it learn, live', 'Le regarder apprendre en direct')}
        </a>
      </div>

      <h2 id="live" style={h2}>{t('Playing right now', 'En ce moment')}</h2>
      <LiveGame t={t} />

      <h2 id="different" style={h2}>{t('What makes it different', 'Ce qui le distingue')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <div className="card" style={card}>
          <h3 style={h3}>{t('Tiny', 'Minuscule')}</h3>
          <p style={cardP}>{t('244,000 parameters in 290 KB. The smallest network on Leela’s recommended list is about 130 times larger.',
                              '244 000 paramètres dans 290 Ko. Le plus petit réseau de la liste recommandée de Leela est environ 130 fois plus gros.')}</p>
        </div>
        <div className="card" style={card}>
          <h3 style={h3}>{t('One block, read six times', 'Un seul bloc, relu six fois')}</h3>
          <p style={cardP}>{t('Instead of stacking distinct layers, Kern 0 applies one transformer block six times in a row to the same position, like rereading the board. That is where the size goes.',
                              'Au lieu d’empiler des couches différentes, Kern 0 applique un seul bloc de transformeur six fois de suite à la même position, comme s’il relisait l’échiquier. C’est là que se joue sa taille.')}</p>
        </div>
        <div className="card" style={card}>
          <h3 style={h3}>{t('In your tab, on your GPU', 'Dans votre onglet, sur votre GPU')}</h3>
          <p style={cardP}>{t('No install and no server: it runs on brimkern’s own WebGPU engine, about 140 positions per second in Chrome on an Apple M4, with a CPU fallback when WebGPU is missing.',
                              'Rien à installer, aucun serveur : il tourne sur le moteur WebGPU de brimkern, environ 140 positions par seconde dans Chrome sur un Apple M4, avec un repli sur le processeur quand WebGPU manque.')}</p>
        </div>
        <div className="card" style={card}>
          <h3 style={h3}>{t('Taught by stronger engines', 'Formé par plus fort que lui')}</h3>
          <p style={cardP}>{t('AlphaZero and Leela learned alone, against themselves, on thousands of machines. Kern 0 plays engines stronger than itself, Stockfish corrects each of its mistakes, and it all runs on one laptop.',
                              'AlphaZero et Leela ont appris seuls, contre eux-mêmes, sur des milliers de machines. Kern 0 affronte des moteurs plus forts que lui, Stockfish corrige chacune de ses erreurs, et tout tourne sur un seul portable.')}</p>
        </div>
        <div className="card" style={card}>
          <h3 style={h3}>{t('A style of its own', 'Un style à lui')}</h3>
          <p style={cardP}>{t('It plays to win: attacking moves are explored first and a draw counts against it. Its games start from the openings of great players and from famous games.',
                              'Il joue pour gagner : les coups d’attaque sont explorés d’abord et une nulle compte contre lui. Ses parties partent des ouvertures des grands joueurs et de parties célèbres.')}</p>
        </div>
        <div className="card" style={card}>
          <h3 style={h3}>{t('Open', 'Ouvert')}</h3>
          <p style={cardP}>{t('MIT-licensed code, weights in BRIK and GGUF, and every game in a public dataset. It also speaks UCI, so any chess program can use it.',
                              'Code sous licence MIT, poids en BRIK et GGUF, et toutes ses parties dans un dataset public. Il parle aussi UCI : n’importe quel logiciel d’échecs peut l’utiliser.')}</p>
        </div>
      </div>

      <h2 id="size" style={h2}>{t('Size, measured', 'La taille, mesurée')}</h2>
      <p style={p}>{t('Files on disk, measured on 2026-11-26.', 'Fichiers sur disque, mesurés le 26/11/2026.')}</p>
      <div style={{ overflowX: 'auto' }} role="region" tabIndex={0} aria-label={t('File sizes', 'Tailles des fichiers')}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 460 }}>
          <tbody>
            {sizes.map((r) => (
              <tr key={r.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th scope="row" style={{ textAlign: 'left', padding: '11px 10px 11px 0', fontWeight: r.us ? 800 : 600, color: r.us ? 'var(--accent-text)' : 'var(--text-primary)' }}>
                  {r.name}
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--text-muted)', fontSize: 12.5, marginTop: 2 }}>{r.what}</span>
                </th>
                <td style={{ padding: '11px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 14, color: r.us ? 'var(--accent-text)' : 'var(--text-primary)', whiteSpace: 'nowrap' }}>{r.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="learns" style={h2}>{t('How it learns', 'Comment il apprend')}</h2>
      <ol style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, margin: 0, paddingLeft: 22, maxWidth: 720 }}>
        <li><strong style={{ color: 'var(--text-primary)' }}>{t('It plays', 'Il joue')}</strong>{t(' 20 games against Stockfish or Leela, at the level where games stay close: the opponent gets stronger when Kern 0 wins, weaker when it loses.',
          ' 20 parties contre Stockfish ou Leela, au niveau où les parties restent serrées : l’adversaire monte quand Kern 0 gagne, descend quand il perd.')}</li>
        <li><strong style={{ color: 'var(--text-primary)' }}>{t('Stockfish analyses', 'Stockfish analyse')}</strong>{t(' every position, at full strength. Kern 0’s mistakes, the moves that cost it at least 10% of its winning chances, count three times.',
          ' chaque position, à pleine puissance. Les erreurs de Kern 0, les coups qui lui coûtent au moins 10 % de ses chances de gain, comptent trois fois.')}</li>
        <li><strong style={{ color: 'var(--text-primary)' }}>{t('It retrains', 'Il se réentraîne')}</strong>{t(' on its own corrected games, mixed with the positions it learned first, so it does not forget.',
          ' sur ses propres parties corrigées, mêlées aux positions apprises au départ, pour ne rien oublier.')}</li>
        <li><strong style={{ color: 'var(--text-primary)' }}>{t('The new version must win', 'La nouvelle version doit gagner')}</strong>{t(': it plays 20 games against the champion and replaces it only with at least 55% of the points.',
          ' : elle joue 20 parties contre le champion et ne le remplace qu’avec au moins 55 % des points.')}</li>
      </ol>
      <p style={{ ...p, marginTop: 14 }}>{t('Each pair of games starts from the same opening, once with Kern 0 as white and once as black. In critical moments, when it thinks it is better but hesitates, it searches four times longer: on seven moves where it had thrown away a winning position, a search four times longer finds a sound move in six instead of one.',
        'Chaque paire de parties part de la même ouverture, une fois avec Kern 0 aux Blancs, une fois aux Noirs. Dans les moments critiques, quand il se croit mieux mais hésite, il cherche quatre fois plus longtemps : sur sept coups où il avait gâché une position gagnante, une recherche quatre fois plus longue trouve un bon coup dans six cas au lieu d’un.')}</p>

      <h2 id="results" style={h2}>{t('Results, generation by generation', 'Résultats, génération par génération')}</h2>
      <p style={p}>{t('Read live from the public dataset. Stockfish is limited by its UCI_Elo setting and plays 0.1 s per move, which makes it weaker than its label: these are not FIDE ratings. Stockfish at full strength and Leela’s large networks remain out of reach.',
        'Lu en direct dans le dataset public. Stockfish est bridé par son réglage UCI_Elo et joue 0,1 s par coup, ce qui le rend plus faible que son étiquette : ce ne sont pas des Elo FIDE. Stockfish à pleine puissance et les grands réseaux de Leela restent hors de portée.')}</p>
      <History t={t} />

      <h2 id="open" style={h2}>{t('Open', 'Ouvert')}</h2>
      <ul style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
        <li><a href="/models/chess/brimkern-chess-q8_0.gguf" download>{t('Weights, GGUF (351 KB)', 'Poids, GGUF (351 Ko)')}</a> · <a href="/models/chess/brimkern-chess-q8.brik" download>{t('BRIK (290 KB)', 'BRIK (290 Ko)')}</a></li>
        <li><a href={DATASET} target="_blank" rel="noopener noreferrer">{t('Every game, and the best ones as PGN', 'Toutes les parties, et les meilleures en PGN')}</a></li>
        <li><a href={SPACE} target="_blank" rel="noopener noreferrer">{t('The live page of the learning loop', 'La page en direct de la boucle d’apprentissage')}</a></li>
        <li><a href={CODE} target="_blank" rel="noopener noreferrer">{t('Training, learning loop and UCI engine: scripts/chess', 'Entraînement, boucle d’apprentissage et moteur UCI : scripts/chess')}</a></li>
      </ul>

      <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={href('/chess')} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 14, padding: '9px 16px' }}>
          {t('Play against Kern 0', 'Jouer contre Kern 0')} <ArrowRight size={15} />
        </Link>
      </div>
    </DocsShell>
  );
}
