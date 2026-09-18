import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

/**
 * What crawlers may read.
 *
 * `/vol2/lab` is NOT listed here, though it is the one route that should
 * never appear in a result. It carries `robots: noindex` on the page
 * instead, and the two are alternatives rather than a belt and braces: a
 * disallow stops the crawler fetching the page at all, so the noindex is
 * never read, and the url can still be indexed bare from a link to it.
 * Whichever one you choose, choosing both is the one that fails.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
