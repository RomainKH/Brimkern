import type { Metadata } from 'next';
import SdkDocClient from '../../../docs/sdk/SdkDocClient';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'SDK & paquet npm — Brimkern',
  description:
    "Référence API complète du paquet npm brimkern : un widget de chat IA local en une balise script, ou des sessions sans interface (createSession, generate, preload, status) — tout tourne sur le GPU du visiteur via WebGPU.",
  alternates: {
    canonical: `${SITE_URL}/fr/docs/sdk`,
    languages: { en: `${SITE_URL}/docs/sdk`, fr: `${SITE_URL}/fr/docs/sdk`, 'x-default': `${SITE_URL}/docs/sdk` },
  },
};

export default function Page() {
  return <SdkDocClient />;
}
