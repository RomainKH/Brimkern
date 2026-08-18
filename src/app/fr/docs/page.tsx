import type { Metadata } from 'next';
import DocsClient from '../../docs/DocsClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Documentation | Brimkern',
  description:
    "Comment exécuter n'importe quel GGUF de Hugging Face dans votre navigateur : liens de test instantané, format streamé .brik et son convertisseur intégré, SDK embarquable, stockage et hors-ligne, diagnostics.",
  alternates: {
    canonical: `${SITE_URL}/fr/docs`,
    languages: { en: `${SITE_URL}/docs`, fr: `${SITE_URL}/fr/docs`, 'x-default': `${SITE_URL}/docs` },
  },
};

export default function Page() {
  return <DocsClient />;
}
