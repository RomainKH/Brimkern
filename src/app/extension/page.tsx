import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ExtensionClient from './ExtensionClient';

export const metadata: Metadata = {
  title: 'Browser Extension (Chrome, Brave, Chromium): Local Search Answers on Your GPU | Brimkern',
  description:
    'A Chromium extension (Chrome, Brave, Edge, Arc, Vivaldi) that skips Google’s AI Overview and answers searches & open pages on your own GPU with clickable sources and follow-up chat. Beta.',
  keywords: [
    'Chrome extension', 'Brave extension', 'Chromium extension', 'Google AI Overview', 'udm=14', 'local AI', 'on-device LLM', 'WebGPU',
    'private search answers', 'brimkern extension',
  ],
  alternates: {
    canonical: `${SITE_URL}/extension`,
    languages: { en: `${SITE_URL}/extension`, fr: `${SITE_URL}/fr/extension`, 'x-default': `${SITE_URL}/extension` },
  },
  openGraph: {
    title: 'Brimkern for Chrome, Brave & Chromium: local answers for web search',
    description:
      'No AI Overview requested; an answer computed on your GPU with clickable sources, follow-up questions and a local page assistant. Beta.',
    url: `${SITE_URL}/extension`,
    type: 'website',
  },
};

export default function ExtensionPage() {
  return <ExtensionClient />;
}
