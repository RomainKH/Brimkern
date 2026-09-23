import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import CliLanding from '../../cli/CliLanding';

// Coquille Server Component pour la version française de la page CLI.
export const metadata: Metadata = {
  title: 'CLI WGSL Terminal : Inférence WebGPU locale pour le code | Brimkern',
  description:
    'Exécutez des modèles de code légers sur votre GPU directement depuis votre terminal via des compute shaders WGSL. Support des pipes Unix, mise en cache instantanée des poids .brik, sans Python ni CUDA.',
  keywords: [
    'CLI WebGPU', 'terminal WGSL', 'LLM local terminal', 'LLM en ligne de commande',
    'assistant code terminal', 'modèle brik', 'IA hors-ligne CLI', 'LLM code léger',
  ],
  alternates: {
    canonical: `${SITE_URL}/fr/cli`,
    languages: { en: `${SITE_URL}/cli`, fr: `${SITE_URL}/fr/cli`, 'x-default': `${SITE_URL}/cli` },
  },
  openGraph: {
    title: 'CLI Brimkern : Inférence WebGPU accélérée matériellement dans votre terminal',
    description:
      'Exécutez des LLMs orientés code directement depuis votre shell grâce aux kernels WGSL écrits à la main. Compatible pipes Unix, chaînage stdin et REPL interactif, avec Qwen 3 4B exécuté sur votre GPU.',
    url: `${SITE_URL}/fr/cli`,
    type: 'website',
  },
};

export default function Page() {
  return <CliLanding />;
}
