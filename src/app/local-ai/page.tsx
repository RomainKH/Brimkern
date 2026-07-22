import type { Metadata } from 'next';
import LocalAiClient from './LocalAiClient';

// Server Component shell (garde `metadata` côté serveur) ; tout le rendu bilingue + le toggle de
// langue vit dans LocalAiClient (Client Component), comme /changelog.
export const metadata: Metadata = {
  title: "IA locale, sans coût serveur — Brimkern",
  description:
    "Embarquez une IA qui tourne sur le GPU de vos visiteurs : zéro coût d'inférence, données privées, aucun serveur. Configurée par un simple prompt, propulsée par notre moteur WebGPU.",
};

export default function LocalAiPage() {
  return <LocalAiClient />;
}
