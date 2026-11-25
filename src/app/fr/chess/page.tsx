import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ChessClient from '../../chess/ChessClient';

export const metadata: Metadata = {
  title: 'Jouez aux échecs contre un modèle minuscule, sur votre GPU | Brimkern',
  description:
    'Un modèle d’échecs entraîné par brimkern : un seul bloc de transformeur bouclé, quelques centaines de Ko, qui tourne dans votre onglet sur WebGPU avec une recherche arborescente. Poids ouverts en BRIK et GGUF.',
  keywords: ['échecs', 'moteur d’échecs', 'échecs dans le navigateur', 'WebGPU', 'transformeur minuscule', 'MCTS', 'GGUF', 'poids ouverts', 'brimkern'],
  alternates: {
    canonical: `${SITE_URL}/fr/chess`,
    languages: { en: `${SITE_URL}/chess`, fr: `${SITE_URL}/fr/chess`, 'x-default': `${SITE_URL}/chess` },
  },
  openGraph: {
    title: 'Jouez aux échecs contre brimkern, dans votre onglet',
    description: 'Un seul bloc de transformeur bouclé, quelques centaines de Ko, sur votre GPU. Poids ouverts (BRIK, GGUF).',
    url: `${SITE_URL}/fr/chess`,
    type: 'website',
  },
};

export default function Page() {
  return <ChessClient />;
}
