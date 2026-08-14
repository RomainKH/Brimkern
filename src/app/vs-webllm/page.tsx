import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import VsWebllmClient from './VsWebllmClient';

// Coquille Server Component (garde `metadata` côté serveur) ; tout le rendu bilingue vit dans le
// Client Component, comme /local-ai et /changelog.
//
// Pourquoi cette page existe : « run an LLM in the browser », « WebLLM alternative », « WebGPU LLM »
// sont les requêtes de notre public exact, et elles sortent aujourd'hui sur un seul projet. Une page
// de comparaison MESURÉE est la façon honnête de s'y placer — et la seule qui tienne dans le temps :
// les chiffres sont reproductibles avec le harnais du dépôt, et ce qui est à notre désavantage y est
// écrit aussi.
export const metadata: Metadata = {
  title: 'Brimkern vs WebLLM — running an LLM in the browser, measured',
  description:
    'A measured comparison of two WebGPU engines that run large language models client-side: prefill and decode throughput on the same 7B int4 model, and the structural difference — Brimkern reads single-file GGUF straight from Hugging Face, WebLLM needs weights compiled with MLC/TVM.',
  keywords: [
    'WebLLM alternative', 'run LLM in browser', 'WebGPU LLM', 'in-browser inference',
    'client-side LLM', 'local LLM browser', 'GGUF browser', 'browser AI without server',
  ],
  alternates: {
    canonical: `${SITE_URL}/vs-webllm`,
    languages: { en: `${SITE_URL}/vs-webllm`, fr: `${SITE_URL}/fr/vs-webllm`, 'x-default': `${SITE_URL}/vs-webllm` },
  },
  openGraph: {
    title: 'Brimkern vs WebLLM — running an LLM in the browser, measured',
    description:
      'Same GPU, same 7B int4 model: prefill 47.2 vs 18.7 tok/s, decode measured on both sides — and why one of them needs no compilation step.',
    url: `${SITE_URL}/vs-webllm`,
    type: 'article',
  },
};

export default function VsWebllmPage() {
  return <VsWebllmClient />;
}
