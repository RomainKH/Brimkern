"use client";

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useT, useLocale } from '@/lib/i18n';
import GithubMark from './GithubMark';

let starsReq: Promise<number | null> | null = null;
function fetchStars(): Promise<number | null> {
  if (!starsReq) {
    starsReq = fetch('/api/stars')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (typeof d?.stars === 'number' ? d.stars : null))
      .catch(() => null);
  }
  return starsReq;
}

function formatStars(n: number, fr: boolean): string {
  if (n >= 1000) {
    const k = (n / 1000).toFixed(n >= 10000 ? 0 : 1);
    return `${fr ? k.replace('.', ',') : k}k`;
  }
  return String(n);
}

export default function GithubStarsLink({
  className = 'lp-nav-icon lp-gh-stars',
  size = 15,
}: {
  className?: string;
  size?: number;
}) {
  const t = useT();
  const { locale } = useLocale();
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetchStars().then((n) => { if (alive && n !== null) setStars(n); });
    return () => { alive = false; };
  }, []);

  const label = stars !== null
    ? t(`GitHub (${stars} stars)`, `GitHub (${stars} étoiles)`)
    : 'GitHub';

  return (
    <a
      href="https://github.com/RomainKH/Brimkern"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    >
      <GithubMark size={size} />
      {stars !== null && (
        <span className="lp-gh-count">
          <Star size={11} aria-hidden="true" style={{ fill: 'currentColor' }} />
          {formatStars(stars, locale === 'fr')}
        </span>
      )}
    </a>
  );
}
