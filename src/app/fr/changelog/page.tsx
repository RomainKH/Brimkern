import type { Metadata } from 'next';
import ChangelogClient from '../../changelog/ChangelogClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog — Brimkern',
  description: "Historique des mises à jour de Brimkern, le moteur d'inférence LLM WebGPU local.",
  alternates: {
    canonical: `${SITE_URL}/fr/changelog`,
    languages: { en: `${SITE_URL}/changelog`, fr: `${SITE_URL}/fr/changelog`, 'x-default': `${SITE_URL}/changelog` },
  },
};

export default function Page() {
  return <ChangelogClient />;
}
