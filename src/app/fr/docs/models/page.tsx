import type { Metadata } from 'next';
import ModelsDocClient from '../../../docs/models/ModelsDocClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Modèles & format .brik — Brimkern',
  description:
    "Comment exécuter n'importe quel GGUF mono-fichier de Hugging Face dans votre navigateur, construire des liens de test instantané, et ce que change le format streamé .brik — avec le convertisseur GGUF → .brik intégré.",
  alternates: {
    canonical: `${SITE_URL}/fr/docs/models`,
    languages: { en: `${SITE_URL}/docs/models`, fr: `${SITE_URL}/fr/docs/models`, 'x-default': `${SITE_URL}/docs/models` },
  },
};

export default function Page() {
  return <ModelsDocClient />;
}
