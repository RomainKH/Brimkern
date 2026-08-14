"use client";

// Attribution auteur — et lien SORTANT vers romainkhanoyan.fr.
//
// Deux raisons d'exister : (1) créditer l'auteur du moteur ; (2) renvoyer une part du trafic de
// brimkern.com vers son site personnel. C'est donc un VRAI lien (pas de `nofollow` : on veut que le
// lien compte), avec `rel="me"` qui déclare la même identité de part et d'autre — ce qui aide les
// moteurs à relier les deux domaines à la même personne.
//
// Volontairement SOBRE et placé en pied de page : l'accueil est calibré anti-rebond autour d'un CTA
// unique (cf. 2026-08-12), un second appel à l'action visuel y ferait perdre des chargements.

import { useT } from '@/lib/i18n';

export default function ByLine({ compact = false }: { compact?: boolean }) {
  const t = useT();
  return (
    <p style={{ color: 'var(--text-muted)', fontSize: compact ? 11 : 12, margin: compact ? '18px 0 0' : '28px 0 0', textAlign: 'center' }}>
      {t('Brimkern — open WebGPU engine, built by ', 'Brimkern — moteur WebGPU open, conçu par ')}
      <a
        href="https://romainkhanoyan.fr"
        rel="me author"
        target="_blank"
        style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        Romain Khanoyan
      </a>
      {t('. Freelance — local AI, WebGPU, on-device engines.', '. Indépendant — IA locale, WebGPU, moteurs on-device.')}
    </p>
  );
}
