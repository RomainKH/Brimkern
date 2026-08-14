import type { MetadataRoute } from 'next';

// SEO : robots.txt généré. Domaine unique dans src/lib/site.ts (cf. metadataBase du layout).
import { SITE_URL as SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
