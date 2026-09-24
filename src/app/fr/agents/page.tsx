import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import AgentsClient from '../../agents/AgentsClient';

export const metadata: Metadata = {
  title: 'Agents IA & MCP : Worker WebGPU local pour Claude Code & Cursor | Brimkern',
  description:
    'Déléguez les tâches courantes à votre GPU local. Serveur MCP stdio natif, sortie structurée JSON, et skills pour Claude Code, Cursor et Windsurf pour économiser vos tokens d’API.',
  keywords: [
    'serveur MCP', 'Model Context Protocol', 'sous-agent Claude Code', 'Cursor LLM local',
    'économie de tokens', 'worker GPU local', 'brimkern mcp', 'brimkern json',
  ],
  alternates: {
    canonical: `${SITE_URL}/fr/agents`,
    languages: { en: `${SITE_URL}/agents`, fr: `${SITE_URL}/fr/agents`, 'x-default': `${SITE_URL}/agents` },
  },
  openGraph: {
    title: 'Brimkern : Worker WebGPU local pour Agents IA & MCP',
    description:
      'Déléguez les tâches courantes à votre GPU local. Serveur MCP stdio natif, sortie structurée JSON et skills pour économiser vos tokens d’API.',
    url: `${SITE_URL}/fr/agents`,
    type: 'website',
  },
};

export default function Page() {
  return <AgentsClient />;
}
