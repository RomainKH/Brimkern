import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ChangelogClient from './ChangelogClient';

// Server Component shell: keeps `metadata` on the server; all rendering (bilingual FR/EN content,
// locale toggle) lives in the ChangelogClient Client Component.
export const metadata: Metadata = {
  title: 'Changelog — Brimkern',
  description: "Release history of Brimkern, the local WebGPU LLM inference engine.",
  // `alternates` REMPLACE celui du layout : sans `languages` ici, la page anglaise perdait ses
  // hreflang (vérifié : 0 balise sur /changelog) et se retrouvait sans lien vers sa version française.
  alternates: {
    canonical: `${SITE_URL}/changelog`,
    languages: { en: `${SITE_URL}/changelog`, fr: `${SITE_URL}/fr/changelog`, 'x-default': `${SITE_URL}/changelog` },
  },
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
