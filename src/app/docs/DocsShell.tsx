"use client";

// Coquille commune des pages de documentation : le menu latéral collant. Deux itérations sur
// retour Romain (2026-08-18) : d'abord « la doc est très vide, un menu sur le côté c'est bien pour
// se retrouver » ; puis « les liens du latéral doivent emmener sur la page directement » — les
// ancres de sections ressemblaient à de la navigation sans en être, et le texte était trop petit.
// Le latéral porte donc de VRAIES pages (la doc est découpée), et le sommaire de la page courante
// vit dans un second groupe « Sur cette page », dont les ancres défilent en `replaceState` : les
// ancres n'empilent plus d'entrées d'historique, donc le bouton « Retour » d'une page visitée
// ensuite (ex. le convertisseur) revient d'un coup, au lieu de rejouer chaque ancre cliquée.
// Sous 1000 px le latéral disparaît et le sommaire redevient la rangée de pastilles d'origine.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT, useLocale, useHref } from '@/lib/i18n';
import ByLine from '../ByLine';

export interface TocEntry { id: string; label: string }

// La ligne de lecture, en pixels sous le haut de la fenêtre. Volontairement HAUTE et non « au tiers
// de l'écran » : deux sections courtes (« Démarrer » et « Stockage & hors-ligne » sur /docs)
// tiennent toutes les deux au-dessus d'un tiers d'écran, et c'est la seconde qui l'emportait alors
// qu'on regarde la première. Mesuré, puis corrigé.
const LIGNE = 90;

// ── Briques de contenu partagées entre les pages de doc ──────────────────────────────────────────

// COLORATION SYNTAXIQUE, écrite ici plutôt qu'importée : une bibliothèque de coloration pèse
// 30 à 300 Ko pour des blocs qui tiennent en trois lignes et n'emploient que quatre langages. Elle
// ne traite donc QUE ce que la doc contient vraiment (shell, JS, HTML, commutateurs d'URL), et
// s'abstient sur le reste au lieu de deviner.
//
// Règle absolue : le texte rendu doit rester IDENTIQUE à l'entrée, caractère pour caractère — un
// bloc de code est là pour être copié. On ne fait donc qu'envelopper des tranches dans des <span>,
// jamais réécrire, et tout ce qui n'est pas reconnu ressort tel quel.
type Lang = 'js' | 'html' | 'sh' | 'url' | 'text';

// Les motifs, dans l'ordre de PRIORITÉ : un mot-clé à l'intérieur d'une chaîne ou d'un commentaire
// ne doit pas être coloré, donc commentaires et chaînes passent en premier et consomment la zone.
const RULES: Record<Exclude<Lang, 'text'>, { re: RegExp; cls: string }[]> = {
  js: [
    { re: /\/\/[^\n]*/g, cls: 'c-com' },
    { re: /'[^'\n]*'|"[^"\n]*"|`[^`]*`/g, cls: 'c-str' },
    { re: /\b(import|from|export|const|let|var|function|return|await|async|new|if|else)\b/g, cls: 'c-kw' },
    { re: /\b\d+(?:\.\d+)?\b/g, cls: 'c-num' },
  ],
  html: [
    { re: /<!--[\s\S]*?-->/g, cls: 'c-com' },
    { re: /"[^"\n]*"/g, cls: 'c-str' },
    { re: /<\/?[a-zA-Z][\w-]*/g, cls: 'c-kw' },
  ],
  sh: [
    { re: /#[^\n]*/g, cls: 'c-com' },
    { re: /^\s*(npm|npx|node|git|curl)\b/gm, cls: 'c-kw' },
  ],
  // Les listes de commutateurs (?gemv=0 …) et les URLs de test : on met en avant le drapeau ou la
  // query, qui est la seule partie que le lecteur va recopier ou modifier.
  url: [
    { re: /\?[a-zA-Z]+=[^\s]*/g, cls: 'c-kw' },
    { re: /&[a-zA-Z]+=[^\s]*/g, cls: 'c-kw' },
    { re: /https?:\/\/[^\s]+/g, cls: 'c-str' },
  ],
};

function colorer(code: string, lang: Lang): React.ReactNode {
  if (lang === 'text') return code;
  // Une seule passe : on collecte les correspondances de toutes les règles, on écarte celles qui
  // chevauchent une correspondance déjà retenue (la priorité va à la règle déclarée en premier),
  // puis on reconstruit la chaîne dans l'ordre.
  const spans: { start: number; end: number; cls: string }[] = [];
  for (const { re, cls } of RULES[lang]) {
    re.lastIndex = 0;
    for (let m = re.exec(code); m; m = re.exec(code)) {
      const [start, end] = [m.index, m.index + m[0].length];
      if (!spans.some((s) => start < s.end && end > s.start)) spans.push({ start, end, cls });
    }
  }
  spans.sort((a, b) => a.start - b.start);
  const out: React.ReactNode[] = [];
  let at = 0;
  spans.forEach((sp, i) => {
    if (sp.start > at) out.push(code.slice(at, sp.start));
    out.push(<span key={i} className={sp.cls}>{code.slice(sp.start, sp.end)}</span>);
    at = sp.end;
  });
  if (at < code.length) out.push(code.slice(at));
  return out;
}

// Un bloc de code copiable. Le fond vient de `.docs-code` (globals.css) : de l'encre, pour que les
// commandes RESSORTENT du papier ; les couleurs des jetons sont des classes, donc elles vivent avec
// lui dans la feuille de style.
export function Code({ children, lang = 'text' }: { children: string; lang?: Lang }) {
  return (
    <pre
      tabIndex={0}
      className="docs-code"
      style={{
        margin: '8px 0 0', padding: '12px 14px', borderRadius: 10, overflowX: 'auto',
        border: '1px solid',
        fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6,
      }}
    >
      {colorer(children, lang)}
    </pre>
  );
}

// Paragraphe de doc. Défini au niveau MODULE (et non dans un composant) : une fonction composant
// recréée à chaque rendu force React à démonter puis remonter le sous-arbre.
export function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 10px' }}>{children}</p>;
}

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ scrollMarginTop: 24 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, margin: '38px 0 10px', color: 'var(--text-primary)' }}>{title}</h2>
      {children}
    </section>
  );
}

// Le titre + chapeau commun des pages de doc, pour que le découpage garde une seule voix.
export function PageTitle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: '14px 0 10px', color: 'var(--text-primary)' }}>{title}</h1>
      <P>{children}</P>
    </>
  );
}

// ── La coquille ───────────────────────────────────────────────────────────────────────────────────

export default function DocsShell({ toc = [], children }: { toc?: TocEntry[]; children: React.ReactNode }) {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const href = useHref();
  const pathname = usePathname();
  // La page courante, pour surligner l'entrée du menu. usePathname rend le chemin AVEC le préfixe
  // /fr éventuel — on le retire pour comparer à la même clé dans les deux langues.
  const current = (pathname ?? '').replace(/^\/fr(?=\/|$)/, '') || '/';

  // Scrollspy : la section active est la DERNIÈRE dont le titre est passé au-dessus d'une ligne de
  // lecture fixée au tiers supérieur de l'écran.
  //
  // Ce qui rendait cette règle fausse et comment c'est réglé : les dernières sections d'une page
  // n'atteignaient jamais ce tiers, faute de défilement disponible en fin de document — elles ne
  // devenaient donc jamais actives (signalé sur « Stockage & hors-ligne », puis sur « Versions & CDN »
  // et « Serveur, licence, liens »). Une ligne qui GLISSE vers le bas corrige la dernière mais
  // déborde sur l'avant-dernière. La bonne réponse n'est pas dans la règle, elle est dans la page :
  // la page réserve EXACTEMENT l'espace nécessaire en bas (la cale ci-dessous) pour que la dernière
  // section puisse monter jusqu'à la ligne. La règle redevient alors simple, et juste pour toutes.
  //
  // ⚠️ Et SURTOUT pas de « si on est en bas, prendre la dernière » par-dessus : avec la marge, une
  // page courte est déjà au bout du document quand on regarde sa PREMIÈRE section, et ce filet
  // surlignait alors la dernière. Il a fallu le retirer après l'avoir mesuré.
  const [active, setActive] = useState<string>(toc[0]?.id ?? '');
  useEffect(() => {
    if (!toc.length) return;
    const relire = () => {
      const ligne = LIGNE;
      let courante = toc[0].id;
      for (const s of toc) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= ligne) courante = s.id;
      }
      setActive(courante);
    };
    relire();
    window.addEventListener('scroll', relire, { passive: true });
    window.addEventListener('resize', relire);
    return () => { window.removeEventListener('scroll', relire); window.removeEventListener('resize', relire); };
  }, [toc]);

  // Défilement d'ancre SANS entrée d'historique : un clic d'ancre natif fait un pushState, et après
  // trois clics de sommaire le bouton « Retour » du navigateur (et notre BackLink, qui fait
  // history.back()) rejouait chaque ancre au lieu de changer de page — le bug rapporté depuis le
  // convertisseur. replaceState garde l'URL partageable sans polluer l'historique.
  // La CALE de fin de page. Une marge fixe ne marche pas : sur /docs le document fait 1 406 px pour
  // une fenêtre de 900, donc au maximum du défilement la dernière section reste à 212 px du haut et
  // ne franchit jamais la ligne de lecture (mesuré). On calcule donc l'espace qui MANQUE, à partir
  // de la hauteur réelle de tout ce qui suit le dernier titre.
  const caleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!toc.length) return;
    const ajuster = () => {
      const cale = caleRef.current;
      const dernier = document.getElementById(toc[toc.length - 1].id);
      if (!cale || !dernier) return;
      cale.style.height = '0px';
      const apres = document.documentElement.scrollHeight - (dernier.getBoundingClientRect().top + window.scrollY);
      // +12 px de jeu : sans lui la dernière section atterrit EXACTEMENT sur la ligne (90,0 px
      // mesuré), et le sous-pixel la fait basculer du mauvais côté de la comparaison.
      cale.style.height = `${Math.max(0, Math.round(window.innerHeight - LIGNE - apres + 12))}px`;
    };
    ajuster();
    // Les polices et les images changent les hauteurs après le premier rendu : on re-mesure une fois
    // le temps qu'elles arrivent, plutôt que de figer une valeur fausse.
    const t = setTimeout(ajuster, 400);
    window.addEventListener('resize', ajuster);
    return () => { clearTimeout(t); window.removeEventListener('resize', ajuster); };
  }, [toc]);

  const versAncre = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView();
    history.replaceState(null, '', `#${id}`);
    // On surligne SANS attendre l'observateur : sur une page courte, la dernière section n'atteint
    // jamais la bande de lecture (le document n'a plus de quoi défiler), donc l'observateur ne se
    // déclencherait pas et le clic resterait sans effet visible.
    setActive(id);
  };

  // Les PAGES de la doc — chaque libellé du menu emmène sur une vraie page. Les deux dernières
  // existaient déjà hors de /docs : le menu les rend atteignables sans repasser par le hub.
  const pages: { path: string; label: string }[] = [
    { path: '/docs', label: t('Overview', "Vue d'ensemble") },
    { path: '/docs/models', label: t('Models & the .brik format', 'Modèles & format .brik') },
    { path: '/docs/sdk', label: t('SDK & npm package', 'SDK & paquet npm') },
    { path: '/docs/diagnostics', label: t('Diagnostics', 'Diagnostics') },
    { path: '/vs-webllm', label: t('Compared to WebLLM', 'Comparé à WebLLM') },
    { path: '/changelog', label: 'Changelog' },
  ];

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Link href={href('/')} style={{ color: 'var(--accent-text)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          ← Brimkern
        </Link>
        <button
          onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
          aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 6, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
        >
          {locale === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      <div className="docs-layout">
        <aside className="docs-side" aria-label={t('Documentation menu', 'Menu de la documentation')}>
          <nav className="docs-side-block">
            <span className="docs-side-title">Documentation</span>
            {pages.map((p) => (
              <Link key={p.path} href={href(p.path)} className={`docs-side-link${current === p.path ? ' active' : ''}`}>
                {p.label}
              </Link>
            ))}
          </nav>
          {toc.length > 1 && (
            <nav className="docs-side-block" aria-label={t('On this page', 'Sur cette page')}>
              <span className="docs-side-title">{t('On this page', 'Sur cette page')}</span>
              {toc.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={versAncre(s.id)} className={`docs-side-link${active === s.id ? ' active' : ''}`}>
                  {s.label}
                </a>
              ))}
            </nav>
          )}
        </aside>

        <div className="docs-content">
          {/* Le sommaire mobile : mêmes ancres que le latéral, en pastilles, seulement < 1000 px. */}
          {toc.length > 1 && (
            <nav className="docs-chips" aria-label={t('Table of contents', 'Sommaire')}>
              {toc.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={versAncre(s.id)}
                  style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, textDecoration: 'none', color: 'var(--text-secondary)', background: 'var(--bg-card-hover, rgba(127,127,127,0.1))', border: '1px solid var(--border-color)' }}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          )}
          {children}
          <ByLine />
          {/* Cale : voir plus haut. Hauteur posée en JS, donc nulle tant que rien ne manque. */}
          <div ref={caleRef} aria-hidden />
        </div>
      </div>
    </main>
  );
}
