import type { MetadataRoute } from 'next';

// SEO : sitemap. Pages PRODUIT uniquement (le labo /video-test a été retiré le 2026-08-19 : la
// génération vidéo vit dans le chat, il faisait doublon).
import { SITE_URL as SITE } from '@/lib/site';

// Les DEUX langues, chacune déclarant ses alternates : c'est ce qui dit au moteur que /x et /fr/x sont
// la même page en deux langues (et non deux contenus concurrents).
const PAGES: { path: string; freq: 'weekly' | 'monthly'; prio: number }[] = [
  { path: '', freq: 'weekly', prio: 1 },
  { path: '/chat', freq: 'weekly', prio: 0.95 },     // l'application, sur son adresse stable
  { path: '/docs', freq: 'weekly', prio: 0.9 },      // documentation (tout y renvoie)
  { path: '/docs/models', freq: 'monthly', prio: 0.8 },  // modèles HF, liens de test, format .brik
  { path: '/docs/sdk', freq: 'monthly', prio: 0.8 },     // référence API du paquet npm
  { path: '/docs/diagnostics', freq: 'monthly', prio: 0.4 }, // commutateurs de repli
  { path: '/local-ai', freq: 'monthly', prio: 0.8 }, // SDK / offre pro
  { path: '/vs-webllm', freq: 'monthly', prio: 0.8 }, // comparaison mesurée (porte d'entrée SEO)
  { path: '/convert', freq: 'monthly', prio: 0.6 },  // convertisseur GGUF→BRIK
  { path: '/changelog', freq: 'weekly', prio: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, freq, prio }) => {
    const en = `${SITE}${path || '/'}`;
    const fr = `${SITE}/fr${path}`;
    const languages = { en, fr };
    return [
      { url: en, changeFrequency: freq, priority: prio, alternates: { languages } },
      // La version traduite pèse un cran de moins : l'anglais est la version canonique.
      { url: fr, changeFrequency: freq, priority: Math.max(0.1, prio - 0.1), alternates: { languages } },
    ];
  });
}
