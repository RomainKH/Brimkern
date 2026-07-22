import type { Metadata } from 'next';
import ChangelogClient from './ChangelogClient';

// Server Component shell: keeps `metadata` on the server; all rendering (bilingual FR/EN content,
// locale toggle) lives in the ChangelogClient Client Component.
export const metadata: Metadata = {
  title: 'Changelog — Brimkern',
  description: "Historique des mises à jour de Brimkern, le moteur d'inférence LLM WebGPU local.",
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
