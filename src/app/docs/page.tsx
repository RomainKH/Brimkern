import type { Metadata } from 'next';
import DocsClient from './DocsClient';
import { SITE_URL } from '@/lib/site';

// Coquille Server Component (métadonnées côté serveur) ; le rendu bilingue vit dans DocsClient.
export const metadata: Metadata = {
  title: 'Documentation — Brimkern',
  description:
    'How to run any Hugging Face GGUF in your browser: instant test links, the .brik streaming format and its in-browser converter, the embeddable SDK, storage and offline behaviour, diagnostics.',
  alternates: {
    canonical: `${SITE_URL}/docs`,
    languages: { en: `${SITE_URL}/docs`, fr: `${SITE_URL}/fr/docs`, 'x-default': `${SITE_URL}/docs` },
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
