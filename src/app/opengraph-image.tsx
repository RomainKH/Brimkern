import { ogCard } from './og-card';

// Carte de partage de la racine, générée (aucun PNG statique à maintenir). Next la câble sur og:image
// et twitter:image automatiquement. EN ANGLAIS : c'est la version canonique du site, et les partages
// viennent surtout de Hugging Face, Reddit et X ; la version française vit dans fr/opengraph-image.tsx.
// Le titre reprend MOT POUR MOT celui de la landing : l'aperçu et la page doivent dire la même chose,
// sinon le clic est déçu à l'arrivée.
export const alt = 'Brimkern: powerful AI models, directly in your browser, on your own GPU';
export { size, contentType } from './og-card';

export default function OpengraphImage() {
  return ogCard({
    h1: 'Powerful AI models.',
    h1Accent: 'Directly in your browser.',
    lede: 'Open-source models straight from Hugging Face, on your own GPU. No server, no subscription.',
  });
}
