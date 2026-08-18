import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

// `/chat` : l'application elle-même, sur sa propre route — et désormais la SEULE (la racine sert la
// landing depuis le 2026-08-13). Avant, l'app vivait à la racine, ce qui mélangeait « présenter le
// produit » et « l'utiliser » : un visiteur venu d'un moteur tombait dans un chat vide sans savoir ce
// qu'il regardait, et la doc renvoyait « à l'accueil », c'est-à-dire dans le chat.
// Les liens déjà publiés vers `/?model=…` continuent de marcher : la landing détecte les paramètres
// de deeplink et redirige vers /chat en conservant la query (voir LandingClient).
export const metadata: Metadata = {
  title: 'Chat | Brimkern',
  description: 'Load a GGUF model and chat with it on your own GPU, entirely in your browser.',
  alternates: {
    canonical: `${SITE_URL}/chat`,
    languages: { en: `${SITE_URL}/chat`, fr: `${SITE_URL}/fr/chat`, 'x-default': `${SITE_URL}/chat` },
  },
};

export { default } from '../ChatApp';
