import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import KernClient from './KernClient';

// Coquille Server Component (garde `metadata` côté serveur) ; le rendu bilingue vit dans KernClient.
export const metadata: Metadata = {
  title: 'Kern 0: a 290 KB chess model that learns in public | Brimkern',
  description:
    'Kern 0 is brimkern’s chess model: 244K parameters in 290 KB, one transformer block looped six times, running in your browser tab on WebGPU. It learns by playing Stockfish and Leela Chess Zero, and every game is published live.',
  keywords: ['Kern 0', 'chess model', 'tiny chess engine', 'browser chess', 'WebGPU', 'looped transformer', 'Stockfish', 'Leela Chess Zero', 'open weights', 'GGUF'],
  alternates: {
    canonical: `${SITE_URL}/kern`,
    languages: { en: `${SITE_URL}/kern`, fr: `${SITE_URL}/fr/kern`, 'x-default': `${SITE_URL}/kern` },
  },
  openGraph: {
    title: 'Kern 0: a 290 KB chess model that learns in public',
    description: 'One transformer block looped six times, on your GPU. It learns against Stockfish and Leela, and every game is published live.',
    url: `${SITE_URL}/kern`,
    type: 'website',
  },
};

export default function KernPage() {
  return <KernClient />;
}
