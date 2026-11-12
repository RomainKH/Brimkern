import type { Metadata } from 'next';
import TermsClient from '../../terms/TermsClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Conditions d’utilisation | Brimkern',
  description: 'Les conditions qui s’appliquent quand vous utilisez sur Brimkern un modèle dont la licence les impose, dont les restrictions d’usage de LTX-Video.',
  alternates: {
    canonical: `${SITE_URL}/fr/terms`,
    languages: { en: `${SITE_URL}/terms`, fr: `${SITE_URL}/fr/terms`, 'x-default': `${SITE_URL}/terms` },
  },
};

export default function Page() {
  return <TermsClient />;
}
