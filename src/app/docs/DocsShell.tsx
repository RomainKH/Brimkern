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

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT, useLocale, useHref } from '@/lib/i18n';
import BackLink from '../BackLink';
import ByLine from '../ByLine';

export interface TocEntry { id: string; label: string }

// ── Briques de contenu partagées entre les pages de doc ──────────────────────────────────────────

// Un bloc de code copiable, sobre (pas de dépendance de coloration syntaxique pour trois lignes).
// Le fond vient de `.docs-code` (globals.css) : de l'encre, pour que les commandes RESSORTENT du
// papier — les couleurs restent en CSS, où vivent leurs variantes clair/sombre.
export function Code({ children }: { children: string }) {
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
      {children}
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

  // Scrollspy : la section courante est celle dont le haut entre dans la bande 0-30 % du haut de
  // l'écran. Un IntersectionObserver par section suffit — pas de listener scroll.
  const [active, setActive] = useState<string>(toc[0]?.id ?? '');
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '0px 0px -70% 0px' },
    );
    for (const s of toc) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [toc]);

  // Défilement d'ancre SANS entrée d'historique : un clic d'ancre natif fait un pushState, et après
  // trois clics de sommaire le bouton « Retour » du navigateur (et notre BackLink, qui fait
  // history.back()) rejouait chaque ancre au lieu de changer de page — le bug rapporté depuis le
  // convertisseur. replaceState garde l'URL partageable sans polluer l'historique.
  const versAncre = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView();
    history.replaceState(null, '', `#${id}`);
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
        <BackLink />
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
        </div>
      </div>
    </main>
  );
}
