import type { Metadata } from 'next';
import ModelsDocClient from './ModelsDocClient';
import { SITE_URL } from '@/lib/site';

// Coquille Server Component (métadonnées côté serveur) ; le rendu bilingue vit dans ModelsDocClient.
export const metadata: Metadata = {
  title: 'Models & the .brik format — Brimkern',
  description:
    'How to run any single-file Hugging Face GGUF in your browser, build instant test links, and what the .brik streaming format changes — with the in-browser GGUF → .brik converter.',
  alternates: {
    canonical: `${SITE_URL}/docs/models`,
    languages: { en: `${SITE_URL}/docs/models`, fr: `${SITE_URL}/fr/docs/models`, 'x-default': `${SITE_URL}/docs/models` },
  },
};

export default function ModelsDocPage() {
  return <ModelsDocClient />;
}
