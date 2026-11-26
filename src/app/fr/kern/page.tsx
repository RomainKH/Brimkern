import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import KernClient from '../../kern/KernClient';

export const metadata: Metadata = {
  title: 'Kern 0 : un modèle d’échecs de 290 Ko qui apprend en public | Brimkern',
  description:
    'Kern 0 est le modèle d’échecs de brimkern : 244 000 paramètres dans 290 Ko, un seul bloc de transformeur bouclé six fois, qui tourne dans votre onglet sur WebGPU. Il apprend en affrontant Stockfish et Leela Chess Zero, et chaque partie est publiée en direct.',
  keywords: ['Kern 0', 'modèle d’échecs', 'petit moteur d’échecs', 'échecs dans le navigateur', 'WebGPU', 'transformeur bouclé', 'Stockfish', 'Leela Chess Zero', 'poids ouverts', 'GGUF'],
  alternates: {
    canonical: `${SITE_URL}/fr/kern`,
    languages: { en: `${SITE_URL}/kern`, fr: `${SITE_URL}/fr/kern`, 'x-default': `${SITE_URL}/kern` },
  },
  openGraph: {
    title: 'Kern 0 : un modèle d’échecs de 290 Ko qui apprend en public',
    description: 'Un seul bloc de transformeur bouclé six fois, sur votre GPU. Il apprend contre Stockfish et Leela, et chaque partie est publiée en direct.',
    url: `${SITE_URL}/fr/kern`,
    type: 'website',
  },
};

export default function Page() {
  return <KernClient />;
}
