import type { Metadata } from 'next';
import LocalAiClient from '../../local-ai/LocalAiClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'IA locale pour votre site | Brimkern',
  description: "Embarquez une IA qui tourne sur le GPU de vos visiteurs : zéro coût d'inférence, données privées, aucun serveur.",
  alternates: {
    canonical: `${SITE_URL}/fr/local-ai`,
    languages: { en: `${SITE_URL}/local-ai`, fr: `${SITE_URL}/fr/local-ai`, 'x-default': `${SITE_URL}/local-ai` },
  },
};

export default function Page() {
  return <LocalAiClient />;
}
