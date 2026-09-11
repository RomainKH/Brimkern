import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import FruitFlyClient from '../../fruit-fly/FruitFlyClient';

export const metadata: Metadata = {
  title: 'Votre onglet va-t-il plus vite qu’un cerveau de mouche ? Mesurez votre GPU',
  description:
    'Le connectome complet de la drosophile a été publié en septembre 2026 : 166 000 neurones, 125 millions de synapses. Cette page mesure votre propre GPU dans l’onglet — un matmul WGSL écrit à la main, confronté d’abord à une référence CPU — et met les deux sur une même échelle. Aucun téléchargement, rien ne quitte votre machine.',
  keywords: [
    'connectome drosophile', 'cerveau de mouche cartographié', 'puissance de mon GPU',
    'GPU contre cerveau', 'neurones synapses connectome', 'banc WebGPU navigateur',
    'mesurer son GPU dans le navigateur', 'simulation cerveau navigateur',
  ],
  alternates: {
    canonical: `${SITE_URL}/fr/fruit-fly`,
    languages: { en: `${SITE_URL}/fruit-fly`, fr: `${SITE_URL}/fr/fruit-fly`, 'x-default': `${SITE_URL}/fruit-fly` },
  },
  openGraph: {
    title: 'Votre onglet va-t-il plus vite qu’une mouche ?',
    description:
      '166 000 neurones et 125 millions de synapses ont été cartographiés ce mois-ci. Un bouton, et vous mesurez votre propre GPU face à eux, dans l’onglet, sans rien télécharger.',
    url: `${SITE_URL}/fr/fruit-fly`,
    type: 'article',
  },
};

export default function Page() {
  return <FruitFlyClient />;
}
