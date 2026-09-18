import type { MetadataRoute } from 'next';
import { canonical } from '@/lib/seo';
import { CATEGORIES } from '@/components/vol2/category/categories';
import { allVol2ProjectSlugs } from '@/components/vol2/project/vol2Projects';

/**
 * Every page worth indexing, generated from the same data the pages are.
 *
 * Written from `CATEGORIES` and the project list rather than typed out, so a
 * project added to the site is a project in the sitemap — a hand-kept list is
 * a list that goes stale the first time nobody remembers it.
 *
 * The `/vol2` prefix comes from `canonical()`, so this needs no edit when
 * Vol 2 takes over the real routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: canonical(), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...Object.keys(CATEGORIES).map((c) => ({
      url: canonical(`/${c}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...allVol2ProjectSlugs().map((slug) => ({
      url: canonical(`/projects/${slug}`),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      /* the work is the point of the site, so the case studies rank above
         the listing pages that merely point at them */
      priority: 0.9,
    })),
  ];
}
