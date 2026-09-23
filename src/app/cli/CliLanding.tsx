"use client";

// Page produit de la CLI (/cli). Tout ce qui ressemble à un écran est une CAPTURE réelle du
// terminal (captures.ts, généré depuis pyte) : aucune sortie inventée, aucun chiffre non mesuré.
// La session rejouée l'est au rythme ENREGISTRÉ, lu dans sa propre ligne de stats (« ⏱ 10.67s »).
// Mouvement : une seule animation, qui montre le comportement réel (le flux de tokens), coupée si
// l'OS demande moins de mouvement. On ne met en vitrine que ce qui distingue le produit : pas
// l'autocomplétion, pas le pourquoi du choix des modèles (retour de Romain, 2026-09-23).

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useHref, useLocale, useT } from '@/lib/i18n';
import s from './landing.module.css';
import { SESSION, PICKER, REPO, STATUS, type Capture, type Seg } from './captures';

const BANNER = `██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗███████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║████╗ ████║██║ ██╔╝██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██╔████╔██║█████═╝ █████╗  ██████╔╝██╔██╗ ██║
██╔══██╗██╔══██╗██║██║╚██╔╝██║██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║
██████╔╝██║  ██║██║██║ ╚═╝ ██║██║ ╚██╗███████╗██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝`;

const REPO_URL = 'https://github.com/RomainKH/Brimkern';

const lineText = (line: Seg[]) => line.map((seg) => seg[0]).join('');
const clsOf = (cls?: string) => (cls ? cls.split(' ').map((c) => s[c]).filter(Boolean).join(' ') : undefined);

const REDUCED_MQ = '(prefers-reduced-motion: reduce)';
function useReducedMotion() {
  return useSyncExternalStore(
    (on) => { const mq = window.matchMedia(REDUCED_MQ); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); },
    () => window.matchMedia(REDUCED_MQ).matches,
    () => false,
  );
}

// Déclenche une fois quand l'élément entre dans l'écran.
function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return { ref, seen };
}

// Rendu d'une capture dont seuls `visible[i]` caractères de la ligne i sont montrés. Le reste est
// rendu en `visibility: hidden` : la hauteur est réservée dès le départ, rien ne saute pendant
// l'animation. Le texte pas encore affiché sort aussi de l'arbre d'accessibilité : un lecteur
// d'écran lit ce qui est à l'écran, puis tout le texte une fois l'animation finie.
function CaptureView({ cap, visible, caretLine }: { cap: Capture; visible?: number[]; caretLine?: number }) {
  return (
    <>
      {cap.map((line, i) => {
        let budget = visible ? visible[i] : Infinity;
        return (
          <span key={i}>
            {line.map((seg, j) => {
              const [text, cls] = seg;
              const shown = budget >= text.length ? text : text.slice(0, Math.max(0, budget));
              const rest = text.slice(shown.length);
              budget -= text.length;
              return (
                <span key={j} className={clsOf(cls)}>
                  {shown}
                  {rest && <span style={{ visibility: 'hidden' }}>{rest}</span>}
                </span>
              );
            })}
            {caretLine === i && <span className={s.caret} />}
            {'\n'}
          </span>
        );
      })}
    </>
  );
}

function Shot({ title, cap, className, wrap }: { title: string; cap: Capture; className?: string; wrap?: boolean }) {
  return (
    <figure className={`${s.shot} ${className || ''}`} style={{ margin: 0 }}>
      <figcaption className={s.shotTitle}>{title}</figcaption>
      <pre className={`${s.shotBody} ${wrap ? s.wrapText : ''}`} tabIndex={0}>
        <CaptureView cap={cap} />
      </pre>
    </figure>
  );
}

// ── La session rejouée au rythme enregistré ─────────────────────────────────────────────────
function Replay() {
  const t = useT();
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLDivElement>();
  const lens = useMemo(() => SESSION.map((l) => lineText(l).length), []);
  const last = SESSION.length - 1;
  // Durée réelle de la réponse, lue dans la ligne de stats de la capture (« ⏱ 10.67s »).
  const recordedMs = useMemo(() => {
    const m = lineText(SESSION[last]).match(/⏱\s*([\d.]+)s/);
    return m ? parseFloat(m[1]) * 1000 : 10000;
  }, [last]);
  const answerChars = useMemo(() => lens.slice(1, last).reduce((a, b) => a + b, 0), [lens, last]);
  const PROMPT_CPS = 28; // frappe humaine de la question, ~28 caractères/s
  const promptMs = (lens[0] / PROMPT_CPS) * 1000;

  const full = lens;
  const [visible, setVisible] = useState<number[]>(() => lens.map(() => 0));
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (reduced) { setVisible(full); setRunning(false); return; }
    setRunning(true);
    const t0 = performance.now();
    const tick = (now: number) => {
      const el = now - t0;
      const v = lens.map(() => 0);
      v[0] = Math.min(lens[0], Math.floor((el / promptMs) * lens[0]));
      if (el > promptMs + 350) {
        let chars = Math.floor(((el - promptMs - 350) / recordedMs) * answerChars);
        for (let i = 1; i < last; i++) { v[i] = Math.min(lens[i], chars); chars -= lens[i]; if (chars <= 0) break; }
      }
      const done = el > promptMs + 350 + recordedMs;
      if (done) v[last] = lens[last];
      setVisible(done ? full : v);
      if (done) { setRunning(false); return; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [reduced, full, lens, promptMs, recordedMs, answerChars, last]);

  // Démarrage dans un rappel d'image, pas dans le corps de l'effet (pas de rendu en cascade).
  useEffect(() => {
    if (!seen) return;
    const id = requestAnimationFrame(() => play());
    return () => { cancelAnimationFrame(id); cancelAnimationFrame(raf.current); };
  }, [seen, play]);

  const caretLine = running ? visible.findIndex((v, i) => v < lens[i]) : -1;

  return (
    <div ref={ref}>
      <figure className={s.shot} style={{ margin: 0 }}>
        <figcaption className={s.shotTitle}>brimkern chat</figcaption>
        <pre className={`${s.shotBody} ${s.wrapText}`} tabIndex={0}>
          <CaptureView cap={SESSION} visible={visible} caretLine={caretLine} />
        </pre>
        <div className={s.shotFoot}>
          <span>{t('Recorded 2026-09-23, M-series Mac, Qwen 3 4B (native Dawn). Played back at the recorded pace.', 'Enregistrée le 23/09/2026, Mac série M, Qwen 3 4B (Dawn natif). Rejouée au rythme enregistré.')}</span>
          <button type="button" className={s.replayBtn} onClick={play} disabled={running}>
            {running ? t('Playing…', 'Lecture…') : t('Replay', 'Rejouer')}
          </button>
        </div>
      </figure>
    </div>
  );
}

function CopyLine({ text }: { text: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  return (
    <div className={s.copy}>
      <code className={s.copyText} tabIndex={0}>{text}</code>
      <button
        type="button"
        className={s.copyBtn}
        aria-label={`${t('Copy', 'Copier')} : ${text}`}
        onClick={async () => {
          try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* refusé */ }
        }}
      >
        {copied ? t('Copied', 'Copié') : t('Copy', 'Copier')}
      </button>
    </div>
  );
}

export default function CliLanding() {
  const t = useT();
  const href = useHref();
  const { locale, setLocale } = useLocale();
  const statLine = lineText(SESSION[SESSION.length - 1]);
  const savedIdx = statLine.indexOf('≈');

  return (
    <div className={s.page}>
      <header className={`${s.wrap} ${s.top}`}>
        <Link href={href('/')} className={s.home}><span aria-hidden="true">▌</span>Brimkern</Link>
        <nav className={s.topLinks} aria-label={t('CLI page', 'Page CLI')}>
          <Link href={href('/docs/cli')} className={s.topLink}>{t('Reference', 'Référence')}</Link>
          <a href={`${REPO_URL}/blob/main/bin/brimkern.mjs`} className={s.topLink} target="_blank" rel="noopener noreferrer">{t('Source', 'Source')}</a>
          <button type="button" className={s.topLink} onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')} aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}>
            {locale === 'fr' ? 'EN' : 'FR'}
          </button>
        </nav>
      </header>

      <main>
        {/* ── Hero : la bannière du terminal est le point focal ─────────────────────────── */}
        <section className={`${s.wrap} ${s.hero}`}>
          <p className={s.prompt}>~/your-project <b>$</b> brimkern chat<span className={s.cursor} aria-hidden="true" /></p>
          <pre className={s.banner} aria-hidden="true">{BANNER}</pre>
          <h1 className={s.h1}>
            {t('Your coding assistant runs ', 'Votre assistant de code tourne ')}
            <em>{t('on your GPU', 'sur votre GPU')}</em>
            {t(', in your terminal.', ', dans votre terminal.')}
          </h1>
          <p className={s.lede}>
            {t(
              'Qwen 3 4B on hand-written WGSL kernels. No server, no API key, no account: your code never leaves the machine.',
              'Qwen 3 4B sur des kernels WGSL écrits à la main. Ni serveur, ni clé d’API, ni compte : votre code ne quitte jamais la machine.'
            )}
          </p>
          <div className={s.ctas}>
            <a href="#install" className={`${s.btn} ${s.btnPrimary}`}>{t('Install from the repo', 'Installer depuis le dépôt')}</a>
            <Link href={href('/docs/cli')} className={`${s.btn} ${s.btnGhost}`}>{t('Read the reference', 'Lire la référence')}</Link>
          </div>
        </section>

        {/* ── 01 · la session rejouée : pleine largeur ──────────────────────────────────── */}
        <section className={`${s.wrap} ${s.section}`} aria-labelledby="replay-h">
          <div className={s.replayHead}>
            <div>
              <p className={s.cmdLabel}>01 · {t('a real session', 'une vraie session')}</p>
              <h2 id="replay-h" className={s.h2}>{t('It answers as it goes, at the speed you will get.', 'Il répond au fil de l’eau, à la vitesse que vous aurez.')}</h2>
            </div>
            <p className={s.body}>
              {t(
                'A capture of the terminal, not a mock-up. Markdown is rendered while it streams: bold, code, lists.',
                'Une capture du terminal, pas une maquette. Le Markdown est rendu pendant le flux : gras, code, listes.'
              )}
            </p>
          </div>
          <Replay />
        </section>

        {/* ── 02 · le dépôt : asymétrique ───────────────────────────────────────────────── */}
        <section className={`${s.wrap} ${s.section}`} aria-labelledby="repo-h">
          <div className={s.split}>
            <div className={s.splitSticky}>
              <p className={s.cmdLabel}>02 · {t('your project', 'votre projet')}</p>
              <h2 id="repo-h" className={s.h2}>{t('Ask about your repo. It has read the README.', 'Posez une question sur votre dépôt. Il a lu le README.')}</h2>
              <p className={s.body}>
                {t(
                  'Started in a folder, Brimkern gives the model the README, the package description and the git branch. Mention a file with ',
                  'Lancé dans un dossier, Brimkern donne au modèle le README, la description du paquet et la branche git. Mentionnez un fichier avec '
                )}
                <code>@path/file.ts</code>
                {t(' to add it, or run ', ' pour l’ajouter, ou lancez ')}
                <code>/diff</code>
                {t(' to review your changes.', ' pour relire vos modifications.')}
              </p>
            </div>
            <div className={s.stack}>
              <Shot title={t('in this repository', 'dans ce dépôt')} cap={REPO} wrap />
              <Shot title="/status" cap={STATUS} className={`${s.stackOffset} ${s.wide}`} />
            </div>
          </div>
        </section>

        {/* ── 03 · les modèles : tableau mesuré + sélecteur réel ────────────────────────── */}
        <section className={`${s.wrap} ${s.section}`} aria-labelledby="models-h">
          <p className={s.cmdLabel}>03 · {t('models', 'modèles')}</p>
          <h2 id="models-h" className={s.h2}>{t('Switch models mid-session, or bring one from Hugging Face.', 'Changez de modèle en cours de session, ou amenez-en un de Hugging Face.')}</h2>
          <div className={s.models}>
            <div>
              <div className={s.tableWrap} tabIndex={0}>
                <table className={s.table}>
                  <caption>{t('Speed measured on an M-series Mac.', 'Vitesse mesurée sur un Mac série M.')}</caption>
                  <thead>
                    <tr><th scope="col">preset</th><th scope="col">{t('model', 'modèle')}</th><th scope="col">{t('speed', 'vitesse')}</th><th scope="col">{t('for', 'pour')}</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>coder</td>
                      <td><span className={s.strong}>Qwen 3 4B</span><br />BRIK int4 · {t('2.53 GB', '2,53 Go')}</td>
                      <td>13–16 tok/s</td>
                      <td className={s.strong}>{t('the default, the most accurate', 'le défaut, le plus juste')}</td>
                    </tr>
                    <tr>
                      <td>fast</td>
                      <td><span className={s.strong}>Qwen 2.5 Coder 1.5B</span><br />GGUF Q4_K_M · {t('1.12 GB', '1,12 Go')}</td>
                      <td>~25 tok/s</td>
                      <td>{t('quick questions, lighter download', 'questions rapides, plus léger')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={s.body} style={{ marginTop: 18 }}>
                {t('Or any single-file GGUF from Hugging Face, the best quantization picked for you: ', 'Ou n’importe quel GGUF mono-fichier de Hugging Face, la meilleure quantification choisie pour vous : ')}
                <code>--model=Qwen/Qwen3-0.6B-GGUF</code>
              </p>
            </div>
            <Shot title="/model" cap={PICKER} className={s.wide} />
          </div>
        </section>

        {/* ── 04 · local : une phrase, la vraie ligne de stats ──────────────────────────── */}
        <section className={`${s.wrap} ${s.section}`} aria-labelledby="local-h">
          <p className={s.cmdLabel}>04 · local</p>
          <h2 id="local-h" className={s.statement}>{t('Nothing leaves the machine.', 'Rien ne quitte la machine.')}</h2>
          <div className={s.statLine} tabIndex={0}>
            {savedIdx > 0 ? <>{statLine.slice(0, savedIdx)}<span className={s.green}>{statLine.slice(savedIdx)}</span></> : statLine}
          </div>
          <p className={s.note}>
            {t(
              'The last figure is an estimate, shown as one: what a paid API would have billed for the same conversation (tokens ≈ characters / 4, history counted on every turn, $3 / $15 per million input / output tokens; set BRIMKERN_PRICE_IN and BRIMKERN_PRICE_OUT for your own).',
              'Le dernier chiffre est une estimation, présentée comme telle : ce qu’une API payante aurait facturé pour la même conversation (tokens ≈ caractères / 4, historique compté à chaque tour, 3 $ / 15 $ par million de tokens en entrée / sortie ; BRIMKERN_PRICE_IN et BRIMKERN_PRICE_OUT pour mettre le vôtre).'
            )}
          </p>
        </section>

        {/* ── 05 · installation ─────────────────────────────────────────────────────────── */}
        <section id="install" className={`${s.wrap} ${s.section}`} aria-labelledby="install-h" style={{ scrollMarginTop: 16 }}>
          <p className={s.cmdLabel}>05 · {t('install', 'installation')}</p>
          <h2 id="install-h" className={s.h2}>{t('Three commands, from the repository.', 'Trois commandes, depuis le dépôt.')}</h2>
          <p className={s.body}>
            {t(
              'Node.js and npm, a GPU with Metal (macOS) or Vulkan (Linux). The first launch downloads the model once (2.53 GB), then it is read from ~/.cache/brimkern.',
              'Node.js et npm, un GPU Metal (macOS) ou Vulkan (Linux). Le premier lancement télécharge le modèle une fois (2,53 Go), ensuite il est relu depuis ~/.cache/brimkern.'
            )}
          </p>
          <ol className={s.steps}>
            <li className={s.step}><span className={s.stepNum} aria-hidden="true">01</span><CopyLine text={`git clone ${REPO_URL} && cd Brimkern`} /></li>
            <li className={s.step}><span className={s.stepNum} aria-hidden="true">02</span><CopyLine text="npm install && npm run build:sdk" /></li>
            <li className={s.step}><span className={s.stepNum} aria-hidden="true">03</span><CopyLine text="node bin/brimkern.mjs chat" /></li>
          </ol>
          <p className={s.note} style={{ marginTop: 18 }}>
            {t('Every command and option: ', 'Toutes les commandes et options : ')}
            <Link href={href('/docs/cli')} style={{ color: 'var(--paper)' }}>{t('CLI reference', 'référence de la CLI')}</Link>
          </p>
        </section>
      </main>

      <footer className={`${s.wrap} ${s.foot}`}>
        <span>Brimkern CLI</span>
        <nav aria-label={t('Footer', 'Pied de page')}>
          <Link href={href('/docs/cli')}>{t('Reference', 'Référence')}</Link>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link href={href('/')}>brimkern.com</Link>
        </nav>
      </footer>
    </div>
  );
}
