import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of use | Brimkern',
  description: 'Terms that apply when you use a model on Brimkern whose license requires them, including the LTX-Video use restrictions.',
  // `alternates` REMPLACE celui du layout : répéter `languages`, sinon la page perd ses hreflang.
  alternates: {
    canonical: `${SITE_URL}/terms`,
    languages: { en: `${SITE_URL}/terms`, fr: `${SITE_URL}/fr/terms`, 'x-default': `${SITE_URL}/terms` },
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
