import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import AgentsClient from './AgentsClient';

export const metadata: Metadata = {
  title: 'AI Agents & MCP: Local WebGPU Worker for Claude Code & Cursor | Brimkern',
  description:
    'Offload small coding tasks to your local GPU. Native Model Context Protocol (MCP) stdio server, structured JSON output, and drop-in skills for Claude Code, Cursor, and Windsurf to save API tokens.',
  keywords: [
    'MCP server', 'Model Context Protocol', 'Claude Code sub-agent', 'Cursor AI local LLM',
    'token saver', 'local GPU coding worker', 'brimkern mcp', 'brimkern json',
  ],
  alternates: {
    canonical: `${SITE_URL}/agents`,
    languages: { en: `${SITE_URL}/agents`, fr: `${SITE_URL}/fr/agents`, 'x-default': `${SITE_URL}/agents` },
  },
  openGraph: {
    title: 'Brimkern: Local WebGPU Worker for AI Agents & MCP',
    description:
      'Offload small coding tasks to your local GPU. Native stdio MCP server, structured JSON output, and drop-in skills to save API tokens.',
    url: `${SITE_URL}/agents`,
    type: 'website',
  },
};

export default function AgentsPage() {
  return <AgentsClient />;
}
