import type { Metadata } from 'next';
import SdkDocClient from './SdkDocClient';
import { SITE_URL } from '@/lib/site';

// Coquille Server Component (métadonnées côté serveur) ; le rendu bilingue vit dans SdkDocClient.
export const metadata: Metadata = {
  title: 'SDK & npm package — Brimkern',
  description:
    'Full API reference for the brimkern npm package: embed a local AI chat widget with one script tag, or use headless sessions (createSession, generate, preload, status) — everything runs on the visitor’s GPU via WebGPU.',
  alternates: {
    canonical: `${SITE_URL}/docs/sdk`,
    languages: { en: `${SITE_URL}/docs/sdk`, fr: `${SITE_URL}/fr/docs/sdk`, 'x-default': `${SITE_URL}/docs/sdk` },
  },
};

export default function SdkDocPage() {
  return <SdkDocClient />;
}
