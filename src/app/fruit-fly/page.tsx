import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import FruitFlyClient from './FruitFlyClient';

// Coquille Server Component (garde `metadata` côté serveur) ; le rendu bilingue vit dans le Client
// Component, comme /vs-webllm et /local-ai.
//
// Pourquoi cette page existe : le connectome complet de la drosophile a été publié le 03/09/2026 et
// la semaine suivante tout le monde branchait le jeu de données sur des jeux vidéo. Le public de ce
// moment — des gens que le rapport « énorme calcul / petite machine » amuse — est exactement le
// nôtre, et la seule façon honnête de s'y adresser est de MESURER le GPU du visiteur au lieu de lui
// raconter le nôtre.
export const metadata: Metadata = {
  title: 'Is your tab faster than a fruit fly brain? Measure your GPU',
  description:
    'The complete fruit fly connectome was published in September 2026: 166,000 neurons, 125 million synapses. This page measures your own GPU in the tab — a hand-written WGSL matmul, checked against a CPU reference first — and puts the two on one scale. No download, nothing leaves your machine.',
  keywords: [
    'fruit fly connectome', 'fly brain map', 'how powerful is my GPU', 'GPU vs brain',
    'connectome neurons synapses', 'WebGPU benchmark browser', 'measure GPU in browser',
    'drosophila connectome', 'brain simulation browser',
  ],
  alternates: {
    canonical: `${SITE_URL}/fruit-fly`,
    languages: { en: `${SITE_URL}/fruit-fly`, fr: `${SITE_URL}/fr/fruit-fly`, 'x-default': `${SITE_URL}/fruit-fly` },
  },
  openGraph: {
    title: 'Is your tab faster than a fruit fly brain?',
    description:
      '166,000 neurons and 125 million synapses were mapped this month. Press one button and measure your own GPU against them, in the tab, with no download.',
    url: `${SITE_URL}/fruit-fly`,
    type: 'article',
  },
};

export default function FruitFlyPage() {
  return <FruitFlyClient />;
}
