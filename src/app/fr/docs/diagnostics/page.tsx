import type { Metadata } from 'next';
import DiagnosticsDocClient from '../../../docs/diagnostics/DiagnosticsDocClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Diagnostics | Brimkern',
  description:
    "Les commutateurs d'URL qui désactivent chaque optimisation du moteur (?gemv=0, ?qshared2=0, ?warmup=0…) : la réponse doit être identique, seulement plus lente. Comment isoler un chemin de code fautif.",
  alternates: {
    canonical: `${SITE_URL}/fr/docs/diagnostics`,
    languages: { en: `${SITE_URL}/docs/diagnostics`, fr: `${SITE_URL}/fr/docs/diagnostics`, 'x-default': `${SITE_URL}/docs/diagnostics` },
  },
};

export default function Page() {
  return <DiagnosticsDocClient />;
}
