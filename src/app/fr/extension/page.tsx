import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ExtensionClient from '../../extension/ExtensionClient';

export const metadata: Metadata = {
  title: 'Extension Chrome : réponses locales pour la recherche Google, sur votre GPU | Brimkern',
  description:
    'Une extension Chrome qui ne demande plus l’aperçu IA de Google et répond à votre recherche sur votre propre GPU, seulement au clic, à partir des résultats déjà affichés, sources à l’appui. Bêta.',
  keywords: [
    'extension Chrome', 'aperçu IA Google', 'udm=14', 'IA locale', 'LLM sur l’appareil', 'WebGPU',
    'réponses de recherche privées', 'extension brimkern',
  ],
  alternates: {
    canonical: `${SITE_URL}/fr/extension`,
    languages: { en: `${SITE_URL}/extension`, fr: `${SITE_URL}/fr/extension`, 'x-default': `${SITE_URL}/extension` },
  },
  openGraph: {
    title: 'Brimkern pour Chrome : réponses locales pour la recherche Google',
    description:
      'Aperçu IA non demandé ; une réponse calculée sur votre GPU, seulement au clic, avec ses sources. Bêta.',
    url: `${SITE_URL}/fr/extension`,
    type: 'website',
  },
};

export default function Page() {
  return <ExtensionClient />;
}
