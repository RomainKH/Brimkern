import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import CliDocsClient from './CliDocsClient';

// Référence de la CLI (install, commandes, options). La page produit est /cli.
export const metadata: Metadata = {
  title: 'CLI reference: install, REPL commands and options | Brimkern',
  description:
    'Install the Brimkern CLI from the repository, then the full reference: REPL commands, @file context, git helpers, pipes, models and every command-line option.',
  alternates: {
    canonical: `${SITE_URL}/docs/cli`,
    languages: { en: `${SITE_URL}/docs/cli`, fr: `${SITE_URL}/fr/docs/cli`, 'x-default': `${SITE_URL}/docs/cli` },
  },
};

export default function Page() {
  return <CliDocsClient />;
}
