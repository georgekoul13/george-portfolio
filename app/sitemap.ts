import { execSync } from 'node:child_process';
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
/**
 * When the site last actually changed — not when it was last BUILT.
 *
 * This was `new Date()`, which meant every one of the 23 urls claimed to
 * have changed every time anything was deployed, including a redeploy that
 * changed nothing at all. Google uses `lastmod` only while it finds it
 * accurate, and a date that moves on every build teaches it not to.
 *
 * Vercel's build has the repo, so the answer is the last commit — derived
 * rather than hand-kept, for the same reason the url list is. If git is not
 * there, the field is left OFF entirely: an absent `lastmod` is a signal
 * Google knows how to ignore, where a wrong one is one it learns to
 * distrust.
 */
function lastChanged(): Date | undefined {
  try {
    const iso = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const d = new Date(iso);
    return Number.isNaN(d.valueOf()) ? undefined : d;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = lastChanged();

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
