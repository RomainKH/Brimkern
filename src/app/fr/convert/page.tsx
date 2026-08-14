import type { Metadata } from 'next';
import ConvertClient from '../../convert/ConvertClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Convertir un GGUF en .brik — Brimkern',
  description: "Convertissez un modèle GGUF en .brik dans votre navigateur : quantification int4/int8, découpage streamable, tokenizer embarqué.",
  alternates: {
    canonical: `${SITE_URL}/fr/convert`,
    languages: { en: `${SITE_URL}/convert`, fr: `${SITE_URL}/fr/convert`, 'x-default': `${SITE_URL}/convert` },
  },
};

export default function Page() {
  return <ConvertClient />;
}
