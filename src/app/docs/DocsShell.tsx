"use client";

// Coquille commune des pages de documentation (/docs, /docs/sdk) : le menu latéral collant qui
// manquait — retour Romain du 2026-08-18 : la doc était « très vide », et « un menu sur le côté
// c'est bien pour se retrouver ». Le menu porte deux choses : les PAGES de la doc (on est passé
// d'une page unique à plusieurs) et les SECTIONS de la page courante, surlignées au défilement.
// Sous 1000 px le latéral disparaît et le sommaire redevient la rangée de pastilles d'origine —
// un latéral collant sur mobile mangerait la largeur de lecture.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT, useLocale, useHref } from '@/lib/i18n';
import BackLink from '../BackLink';
import ByLine from '../ByLine';

export interface TocEntry { id: string; label: string }

// ── Briques de contenu partagées entre les pages de doc ──────────────────────────────────────────

// Un bloc de code copiable, sobre (pas de dépendance de coloration syntaxique pour trois lignes).
export function Code({ children }: { children: string }) {
  return (
    <pre
      tabIndex={0}
      style={{
        margin: '8px 0 0', padding: '12px 14px', borderRadius: 10, overflowX: 'auto',
        background: 'var(--bg-code, var(--bg-sidebar))', border: '1px solid var(--border-color)',
        fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-primary)',
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

// ── La coquille ───────────────────────────────────────────────────────────────────────────────────

export default function DocsShell({ toc, children }: { toc: TocEntry[]; children: React.ReactNode }) {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const href = useHref();
  const pathname = usePathname();
  // La page courante, pour surligner l'entrée du menu. usePathname rend le chemin AVEC le préfixe
  // /fr éventuel — on le retire pour comparer à la même clé dans les deux langues.
  const current = (pathname ?? '').replace(/^\/fr(?=\/|$)/, '') || '/';

  // Scrollspy : la section courante est la DERNIÈRE dont le haut est passé au-dessus du tiers
  // supérieur de l'écran. Un IntersectionObserver par section suffit — pas de listener scroll.
  const [active, setActive] = useState<string>(toc[0]?.id ?? '');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      // La « ligne de lecture » : une section devient courante quand elle entre dans la bande
      // 0-30 % du haut de l'écran. -70 % en bas replie la fenêtre d'observation sur cette bande.
      { rootMargin: '0px 0px -70% 0px' },
    );
    for (const s of toc) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [toc]);

  const pages: { path: string; label: string }[] = [
    { path: '/docs', label: t('Overview', "Vue d'ensemble") },
    { path: '/docs/sdk', label: t('SDK & npm package', 'SDK & paquet npm') },
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
          <nav className="docs-side-block" aria-label={t('On this page', 'Sur cette page')}>
            <span className="docs-side-title">{t('On this page', 'Sur cette page')}</span>
            {toc.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={`docs-side-link${active === s.id ? ' active' : ''}`}>
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="docs-content">
          {/* Le sommaire mobile : mêmes ancres que le latéral, en pastilles, seulement < 1000 px. */}
          <nav className="docs-chips" aria-label={t('Table of contents', 'Sommaire')}>
            {toc.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, textDecoration: 'none', color: 'var(--text-secondary)', background: 'var(--bg-card-hover, rgba(127,127,127,0.1))', border: '1px solid var(--border-color)' }}
              >
                {s.label}
              </a>
            ))}
          </nav>
          {children}
          <ByLine />
        </div>
      </div>
    </main>
  );
}
