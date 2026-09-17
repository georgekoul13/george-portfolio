import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

/**
 * What crawlers may read.
 *
 * `/vol2/lab` is a tuning harness for the projects band — a real page with
 * real controls and no content. It is the one route that should never appear
 * in a result.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/vol2/lab', '/api/'] },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
