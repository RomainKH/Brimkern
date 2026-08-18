import type { Metadata } from 'next';
import DiagnosticsDocClient from './DiagnosticsDocClient';
import { SITE_URL } from '@/lib/site';

// Coquille Server Component (métadonnées côté serveur) ; le rendu bilingue vit dans DiagnosticsDocClient.
export const metadata: Metadata = {
  title: 'Diagnostics | Brimkern',
  description:
    'URL switches that turn each engine optimization back off (?gemv=0, ?qshared2=0, ?warmup=0…): the answer should be identical, only slower. How to isolate a misbehaving code path.',
  alternates: {
    canonical: `${SITE_URL}/docs/diagnostics`,
    languages: { en: `${SITE_URL}/docs/diagnostics`, fr: `${SITE_URL}/fr/docs/diagnostics`, 'x-default': `${SITE_URL}/docs/diagnostics` },
  },
};

export default function DiagnosticsDocPage() {
  return <DiagnosticsDocClient />;
}
