import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Chat | Brimkern',
  description: 'Chargez un modèle GGUF et discutez avec lui sur votre propre GPU, entièrement dans votre navigateur.',
  alternates: {
    canonical: `${SITE_URL}/fr/chat`,
    languages: { en: `${SITE_URL}/chat`, fr: `${SITE_URL}/fr/chat`, 'x-default': `${SITE_URL}/chat` },
  },
};

export { default } from '../../ChatApp';
