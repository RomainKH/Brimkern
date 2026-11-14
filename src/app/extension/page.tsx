import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ExtensionClient from './ExtensionClient';

export const metadata: Metadata = {
  title: 'Chrome Extension: Local Answers for Google Search, on Your GPU | Brimkern',
  description:
    'A Chrome extension that stops requesting Google’s AI Overview and answers your search on your own GPU, only when you click, from the results already on the page, with sources. Preview.',
  keywords: [
    'Chrome extension', 'Google AI Overview', 'udm=14', 'local AI', 'on-device LLM', 'WebGPU',
    'private search answers', 'brimkern extension',
  ],
  alternates: {
    canonical: `${SITE_URL}/extension`,
    languages: { en: `${SITE_URL}/extension`, fr: `${SITE_URL}/fr/extension`, 'x-default': `${SITE_URL}/extension` },
  },
  openGraph: {
    title: 'Brimkern for Chrome: local answers for Google Search',
    description:
      'No AI Overview requested; an answer computed on your GPU, only when you click, with its sources. Preview.',
    url: `${SITE_URL}/extension`,
    type: 'website',
  },
};

export default function ExtensionPage() {
  return <ExtensionClient />;
}
