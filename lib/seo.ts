import type { Metadata } from 'next';

/**
 * Everything the search engines are told, in one place.
 *
 * George: *"Optimise the website with SEO, etc we need to rank high in
 * google."* Before this, every page on the site — the home page, three
 * categories and nineteen projects — shared ONE title and ONE description
 * from the root layout. Twenty-three pages competing as the same page is the
 * single biggest thing holding the site back in search, because there is
 * nothing for a result to be *about*.
 *
 * ── the /vol2 prefix is temporary, and only named here ────────────────
 * Vol 2 is being built alongside the live site and will replace it, so every
 * canonical URL is built through `canonical()` rather than written out. When
 * the swap happens, `PREFIX` becomes '' and every title, canonical, sitemap
 * entry and JSON-LD id follows. Nothing else has to be found and edited.
 */
export const SITE = 'https://www.georgekoulouris.com';

/**
 * The sub-path Vol 2 is served under.
 *
 * Empty once it IS the site. Read from the same environment variable that
 * `next.config.mjs` uses to rewrite `/` onto Vol 2, so the urls a crawler is
 * told about and the urls the server actually answers on cannot disagree —
 * which is the failure mode that quietly de-indexes a site after a migration.
 *
 * `NEXT_PUBLIC_` is required: this runs in the browser as well as on the
 * server, and an undefined prefix on the client would emit canonicals that
 * point at the wrong place.
 */
export const PREFIX = process.env.NEXT_PUBLIC_VOL2_AS_ROOT === '1' ? '' : '/vol2';

export const canonical = (path = '') => `${SITE}${PREFIX}${path}`;

/**
 * The share card, for anything that has no better picture of its own.
 *
 * George drew it at exactly 1200x630 — the one size Facebook, LinkedIn,
 * Slack, WhatsApp and X all accept — so it is used as-is. A project page
 * overrides it with its own hero, which is always the stronger card: the
 * work, rather than a portrait of whose work it is.
 */
export const OG = '/images/vol2/preview/Preview.png';

/** who the site is about, reused by every page's title */
export const AUTHOR = 'George Koulouris';
const SUFFIX = `${AUTHOR} — Product & Visual Designer`;

/**
 * One page's metadata.
 *
 * `title` is written specifically and kept under about 60 characters, which
 * is where Google truncates; `description` under about 155 for the same
 * reason. Both are the page's own words rather than boilerplate — a
 * description that repeats the site tagline is a description Google rewrites.
 */
export function page({
  title,
  description,
  path = '',
  image,
}: {
  title: string;
  description: string;
  path?: string;
  /** a real picture from the page — far better than the generic card */
  image?: string;
}): Metadata {
  const url = canonical(path);
  const images = [{ url: image ?? OG, width: 1200, height: 630, alt: title }];
  return {
    title: `${title} · ${SUFFIX}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: AUTHOR,
      images,
      locale: 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}

/**
 * Structured data, as a `<script type="application/ld+json">`.
 *
 * This is what lets a search engine say "George Koulouris, product designer"
 * rather than guessing from the copy, and what a project page needs to be
 * understood as a piece of work with an author and a client rather than as a
 * page of pictures.
 */
export function jsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c'),
  };
}
