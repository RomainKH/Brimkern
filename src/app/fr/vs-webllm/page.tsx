import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import VsWebllmClient from '../../vs-webllm/VsWebllmClient';

export const metadata: Metadata = {
  title: 'Brimkern vs WebLLM — faire tourner un LLM dans le navigateur, mesuré',
  description:
    'Comparaison mesurée de deux moteurs WebGPU qui exécutent un grand modèle de langage côté client : débits de prefill et de décodage sur le même modèle 7B int4, et la différence de fond — Brimkern lit les GGUF mono-fichier directement depuis Hugging Face, WebLLM exige des poids compilés avec MLC/TVM.',
  keywords: [
    'alternative WebLLM', 'LLM dans le navigateur', 'LLM WebGPU', 'inférence navigateur',
    'IA locale navigateur', 'GGUF navigateur', 'IA sans serveur',
  ],
  alternates: {
    canonical: `${SITE_URL}/fr/vs-webllm`,
    languages: { en: `${SITE_URL}/vs-webllm`, fr: `${SITE_URL}/fr/vs-webllm`, 'x-default': `${SITE_URL}/vs-webllm` },
  },
  openGraph: {
    title: 'Brimkern vs WebLLM — faire tourner un LLM dans le navigateur, mesuré',
    description:
      'Même GPU, même modèle 7B int4 : prefill 47,2 contre 18,7 tok/s, décodage mesuré des deux côtés — et pourquoi l’un des deux ne demande aucune compilation.',
    url: `${SITE_URL}/fr/vs-webllm`,
    type: 'article',
  },
};

export default function Page() {
  return <VsWebllmClient />;
}
