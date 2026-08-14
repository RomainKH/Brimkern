import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ConvertClient from './ConvertClient';

// Coquille Server Component : la page était un Client Component PUR, donc SANS `metadata` — ni
// titre, ni description propres pour les moteurs (elle héritait de ceux de l'accueil, et deux pages
// au même titre se cannibalisent). Même schéma que /changelog et /local-ai.
export const metadata: Metadata = {
  title: 'Convert a GGUF to .brik — Brimkern',
  description:
    "Convert a GGUF model to .brik in your browser: int4/int8 quantization, streamable shards, embedded tokenizer. No file ever leaves your machine.",
  // `alternates` REMPLACE celui du layout : sans `languages` ici, la page anglaise perdait ses
  // hreflang (vérifié : 0 balise sur /convert) et se retrouvait sans lien vers sa version française.
  alternates: {
    canonical: `${SITE_URL}/convert`,
    languages: { en: `${SITE_URL}/convert`, fr: `${SITE_URL}/fr/convert`, 'x-default': `${SITE_URL}/convert` },
  },
};

export default function ConvertPage() {
  return <ConvertClient />;
}
