import type { MetadataRoute } from 'next';

// SEO : robots.txt généré. Hébergé sur brimkern.romainkhanoyan.fr (sous-domaine de romainkhanoyan.fr) (cf. metadataBase du layout).
const SITE = 'https://brimkern.romainkhanoyan.fr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
