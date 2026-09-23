import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import CliLanding from './CliLanding';

// Coquille Server Component pour la page de promotion et référence de la CLI Brimkern.
// Tout le contenu dynamique et bilingue vit dans CliClient.
export const metadata: Metadata = {
  title: 'WGSL Terminal CLI: Local WebGPU Inference for Code | Brimkern',
  description:
    'Run lightweight coding models on your GPU straight from the command line using hand-written WGSL compute shaders. Unix pipes support, instant .brik weight caching, zero Python, zero CUDA.',
  keywords: [
    'WebGPU CLI', 'WGSL terminal', 'local LLM CLI', 'run LLM command line',
    'terminal coding assistant', 'brik model', 'offline AI CLI', 'lightweight code LLM',
  ],
  alternates: {
    canonical: `${SITE_URL}/cli`,
    languages: { en: `${SITE_URL}/cli`, fr: `${SITE_URL}/fr/cli`, 'x-default': `${SITE_URL}/cli` },
  },
  openGraph: {
    title: 'Brimkern CLI: Hardware-accelerated WebGPU inference in your terminal',
    description:
      'Run coding LLMs directly from your shell using hand-written WGSL kernels. Supports Unix pipes, stdin chaining, and an interactive REPL, with Qwen 3 4B running on your GPU.',
    url: `${SITE_URL}/cli`,
    type: 'website',
  },
};

export default function CliPage() {
  return <CliLanding />;
}
