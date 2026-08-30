import projects from '@/data/projects.json';

/**
 * The three category pages — Figma "Category template", node 147:9780.
 *
 * Everything a category page varies by lives here, so adding a project,
 * re-tagging one or re-ordering a page is an edit to this file and nothing
 * else.
 *
 * THE SPLIT IS STILL PROVISIONAL. `data/projects.json` has only two buckets,
 * `ux-ui` (9) and `creative` (6) — there is no Graphic tag at all — so the
 * three pages are filled by naming slugs below rather than by filtering on the
 * data. George's call: get it testable now, categorise properly later, "one by
 * one, along with missing details and adding more projects". When the real
 * tags land, replace `slugs` with a filter on `category` and delete this note.
 *
 * The line drawn between the two visual pages, for whoever revisits it:
 * **Graphic is commissioned** — someone briefed it and it ships to their
 * audience. **Creative is self-directed or expressive** — the festival work
 * sits there because it is art direction first and deliverable second, and the
 * typefaces because they were never briefed at all.
 */

export type CategorySlug = 'product' | 'graphic' | 'creative';

export interface Category {
  slug: CategorySlug;
  /** the nav label */
  label: string;
  /**
   * One sentence. Figma breaks it across four rows with images set between
   * the words; the images are gone and it now wraps on its own, so the copy
   * is written as prose and the reveal does the shaping.
   */
  headline: string;
  /** the words that arrive as beats rather than a plain wipe */
  beats: string[];
  /**
   * Provisional; becomes a filter on `category` once the data is tagged.
   * **Order is the page order** — the first two get the large cards, so the
   * two that should open the page go first. Product leads on the two current
   * roles (Gaspar, Mood); the rest run roughly newest-first.
   */
  slugs: string[];
}

const orbit = (name: string) => `/images/projects/orbit/${name}.png`;

export const CATEGORIES: Record<CategorySlug, Category> = {
  product: {
    slug: 'product',
    label: 'Product',
    // Figma's own copy, minus its "HABBITS" typo
    headline: 'DESIGNING PRODUCTS, DESIGNING EXPERIENCES, DESIGNING HABITS AND SOMETHING ELSE',
    beats: ['PRODUCTS', 'EXPERIENCES', 'HABITS'],
    slugs: [
      'gaspar-ai',
      'mood',
      'piraeus-insurance',
      'bancasure360',
      'cybersential',
      'cancellation-wallet',
      'insurance-product-flows',
      'benefit',
      'istorima',
    ],
  },

  graphic: {
    slug: 'graphic',
    label: 'Graphic',
    // placeholder copy — Figma only writes the Product page's lines
    headline: 'DESIGNING COVERS, DESIGNING MARKS, DESIGNING LETTERS AND SOMETHING ELSE',
    beats: ['COVERS', 'MARKS', 'LETTERS'],
    slugs: ['book-cover', 'danai-michali', 'olga-posonidou', 'vasiliki-vozora', 'maria-fitsopoulou'],
  },

  creative: {
    slug: 'creative',
    label: 'Creative',
    // placeholder copy — Figma only writes the Product page's lines
    headline: 'DRAWING WORLDS, DRAWING POSTERS, DRAWING IDENTITIES AND SOMETHING ELSE',
    beats: ['WORLDS', 'POSTERS', 'IDENTITIES'],
    slugs: ['deerislnd', 'athens-goes-mayan', 'arcana', 'in-pixels-we-see', 'cabaret', 'custom-typefaces'],
  },
};

export interface CardProject {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  /** what the chip on the artwork reads — see `TAGS` */
  tag: string;
}

/**
 * The chip on each card.
 *
 * It used to repeat the category, which on a category page is the one thing
 * the reader already knows — nine cards saying PRODUCT under a page that says
 * PRODUCT. So it carries the **sector** instead: the thing that separates
 * Gaspar from Mood at a glance, and the thing a recruiter is actually
 * scanning for.
 *
 * Sector only works where there is a client with one. Three of these have no
 * single sector — the logos span industries, the typefaces and the
 * illustrations were never for anyone — so those fall back to the **medium**,
 * which is the next most useful thing to know before clicking.
 *
 * Kept short on purpose: the chip is 12/16 at a fixed 32px tall on a card
 * that is 413px wide at its smallest, so two words is the ceiling.
 *
 * Sources are `content/projects/*.ts` — `metadata.employer` and the
 * descriptions — not invented.
 */
const TAGS: Record<string, string> = {
  // product — sector
  'gaspar-ai': 'AI SAAS',
  mood: 'MUSIC',
  'piraeus-insurance': 'BANKING',
  bancasure360: 'INSURTECH',
  cybersential: 'CYBERSECURITY',
  'cancellation-wallet': 'TRAVEL',
  'insurance-product-flows': 'INSURANCE',
  benefit: 'SHIPPING',
  istorima: 'CULTURE',

  // graphic — sector, except the logos, which have no single one
  'danai-michali': 'COUNSELLING',
  'olga-posonidou': 'PSYCHOTHERAPY',
  'vasiliki-vozora': 'FAMILY THERAPY',
  'maria-fitsopoulou': 'DENTISTRY',
  'book-cover': 'PUBLISHING',


  // creative — medium, except the festivals
  deerislnd: 'EVENTS',
  'athens-goes-mayan': 'FESTIVAL',
  arcana: 'PERSONAL',
  'in-pixels-we-see': 'PIXEL ART',
  cabaret: 'POSTER',
  'custom-typefaces': 'TYPE DESIGN',
};

/**
 * Two slugs don't match their artwork's filename — the images were exported
 * before the slugs settled. Everything else is `{slug}-1.png`.
 */
const IMAGE_OVERRIDES: Record<string, string> = {
  'piraeus-insurance': 'piraeus-1',
  'insurance-product-flows': 'insurance-product-1',
};

export function projectsFor(category: Category): CardProject[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return category.slugs.flatMap((slug) => {
    const p = bySlug.get(slug);
    if (!p) return [];
    return [{
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      image: orbit(IMAGE_OVERRIDES[p.slug] ?? `${p.slug}-1`),
      tag: TAGS[p.slug] ?? category.label.toUpperCase(),
    }];
  });
}
