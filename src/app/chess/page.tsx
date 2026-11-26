import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ChessClient from './ChessClient';

export const metadata: Metadata = {
  title: 'Play Chess Against Kern 0, a Tiny Model on Your GPU | Brimkern',
  description:
    'Kern 0, the chess model trained by brimkern: one looped transformer block, 290 KB, running in your browser tab on WebGPU with tree search. Open weights in BRIK and GGUF.',
  keywords: ['chess', 'chess engine', 'browser chess', 'WebGPU', 'tiny transformer', 'MCTS', 'GGUF', 'open weights', 'Kern 0', 'brimkern'],
  alternates: {
    canonical: `${SITE_URL}/chess`,
    languages: { en: `${SITE_URL}/chess`, fr: `${SITE_URL}/fr/chess`, 'x-default': `${SITE_URL}/chess` },
  },
  openGraph: {
    title: 'Play chess against Kern 0, in your tab',
    description: 'One looped transformer block, 290 KB, on your GPU. Open weights (BRIK, GGUF).',
    url: `${SITE_URL}/chess`,
    type: 'website',
  },
};

export default function ChessPage() {
  return <ChessClient />;
}
