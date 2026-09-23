import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import CliDocsClient from '../../../docs/cli/CliDocsClient';

export const metadata: Metadata = {
  title: 'Référence de la CLI : installation, commandes du REPL et options | Brimkern',
  description:
    'Installer la CLI Brimkern depuis le dépôt, puis la référence complète : commandes du REPL, contexte @fichier, outils git, pipes, modèles et toutes les options.',
  alternates: {
    canonical: `${SITE_URL}/fr/docs/cli`,
    languages: { en: `${SITE_URL}/docs/cli`, fr: `${SITE_URL}/fr/docs/cli`, 'x-default': `${SITE_URL}/docs/cli` },
  },
};

export default function Page() {
  return <CliDocsClient />;
}
