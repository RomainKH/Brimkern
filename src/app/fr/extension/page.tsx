import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ExtensionClient from '../../extension/ExtensionClient';

export const metadata: Metadata = {
  title: 'Extension Chrome, Brave & Chromium : réponses locales pour vos recherches, sur votre GPU | Brimkern',
  description:
    'Une extension Chromium (Chrome, Brave, Edge, Arc, Vivaldi) qui ne demande plus l’aperçu IA de Google et répond à vos recherches et pages ouvertes sur votre GPU, avec sources cliquables et suivi de conversation. Bêta.',
  keywords: [
    'extension Chrome', 'extension Brave', 'extension Chromium', 'aperçu IA Google', 'udm=14', 'IA locale', 'LLM sur l’appareil', 'WebGPU',
    'réponses de recherche privées', 'extension brimkern',
  ],
  alternates: {
    canonical: `${SITE_URL}/fr/extension`,
    languages: { en: `${SITE_URL}/extension`, fr: `${SITE_URL}/fr/extension`, 'x-default': `${SITE_URL}/extension` },
  },
  openGraph: {
    title: 'Brimkern pour Chrome, Brave & Chromium : réponses locales pour vos recherches',
    description:
      'Aperçu IA non demandé ; une réponse calculée sur votre GPU avec sources cliquables, suivi de conversation et assistant de page. Bêta.',
    url: `${SITE_URL}/fr/extension`,
    type: 'website',
  },
};

export default function Page() {
  return <ExtensionClient />;
}
