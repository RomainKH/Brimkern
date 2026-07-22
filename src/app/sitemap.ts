import type { MetadataRoute } from 'next';

// SEO : sitemap. Pages PRODUIT uniquement — le labo /video-test (beta) est volontairement exclu.
const SITE = 'https://brimkern.romainkhanoyan.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/local-ai`, changeFrequency: 'monthly', priority: 0.8 }, // SDK / offre pro
    { url: `${SITE}/convert`, changeFrequency: 'monthly', priority: 0.6 },  // convertisseur GGUF→BRIK
    { url: `${SITE}/changelog`, changeFrequency: 'weekly', priority: 0.5 },
  ];
}
