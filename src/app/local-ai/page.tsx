import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import LocalAiClient from './LocalAiClient';

// Server Component shell (garde `metadata` côté serveur) ; tout le rendu bilingue + le toggle de
// langue vit dans LocalAiClient (Client Component), comme /changelog.
export const metadata: Metadata = {
  title: "On-device AI for your website, zero server cost — Brimkern",
  description:
    "Embed an AI that runs on your visitors' own GPU: no inference cost, no server, private by construction. Configured with a plain prompt, powered by our WebGPU engine.",
  // `alternates` REMPLACE celui du layout : sans `languages` ici, la page anglaise perdait ses
  // hreflang (vérifié : 0 balise sur /local-ai) et se retrouvait sans lien vers sa version française.
  alternates: {
    canonical: `${SITE_URL}/local-ai`,
    languages: { en: `${SITE_URL}/local-ai`, fr: `${SITE_URL}/fr/local-ai`, 'x-default': `${SITE_URL}/local-ai` },
  },
};

export default function LocalAiPage() {
  return <LocalAiClient />;
}
