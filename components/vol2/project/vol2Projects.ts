import { ASSETS } from './assets';
import type { Block, Row, Vol2Project } from './blocks';

/**
 * The nineteen project pages, on the template of Figma 366:11793.
 *
 * ── EVERY WORD BELOW IS A PLACEHOLDER ─────────────────────────────────
 * George: *"ALL THE TEXTS EVERYWHERE ARE PLACEHOLDERS we are going to do
 * them page by page."* The titles and the section chips are his and are
 * real; the subtitle, the section paragraphs and all four facts are not.
 * They are marked rather than invented so that a page reads as unfinished
 * instead of reading as finished and wrong — the same arrangement as
 * `SUMMARIES`, and for the same reason.
 *
 * Do not "improve" a line here. We write them together, one project at a
 * time.
 *
 * ── the slugs are PROVISIONAL ─────────────────────────────────────────
 * Sixteen reuse the slug the project already had, so no URL moves and no
 * link in `categories.ts` breaks. Three had none — Czech Folk and the two
 * typefaces — and take one derived from the folder name. Renaming any of
 * them is a one-line edit here plus the same word in `categories.ts`.
 */

/** placeholder, and it says so — never let one of these ship */
const TBD = '[to write]';

const CHIPS: Record<string, string[]> = {
  /* George's own section labels, read off the Figma canvas. The order is
     the order they appear down the page. */
  deerislnd: ['Brief', 'The challenge', 'The design process', 'The Directions', 'The Final'],
  'cancellation-wallet': ['Brief', 'The challenge', 'The design process', 'The solution', 'The complexity'],
  cybersential: ['Brief', 'The challenge', 'The design process', 'Sales flow', 'Wallet', 'The complexity'],
  'piraeus-insurance': ['Brief', 'The design process', 'Various insurance products', 'The challenge', 'Phone insurance', 'The complexity'],
  bancasure360: ['Brief', 'The design process', 'The complexity', 'Various insurance products'],
  'gaspar-ai': ['Brief', 'The challenge', 'The brand', 'The design process', 'The Website vol2', 'Conversational Design'],
  mood: ['Brief', 'The brand'],
  istorima: ['Brief', 'The design process', 'The challenge'],
  benefit: ['Brief', 'The design process', 'The challenge'],
  'book-cover': ['Brief', 'The challenge', 'The Directions'],
  'olga-posonidou': ['Brief', 'The Directions'],
  'vasiliki-vozora': ['Brief', 'The Directions'],
  'danai-michali': ['Brief', 'The Directions'],
  arcana: ['Brief', 'The Directions'],
  cabaret: ['Brief', 'The Directions'],
  'czech-folk': ['Brief', 'The Directions'],
  'in-pixels-we-see': ['Brief', 'The Directions'],
  'typeface-a': ['Brief', 'The Directions'],
  'typeface-b': ['Brief', 'The Directions'],
};

/** slug -> the export folder it draws from, and the title George gave it */
const SOURCES: { slug: string; folder: string; title: string }[] = [
  { slug: 'deerislnd', folder: 'Deerislnd', title: 'DEERISLD Posters' },
  { slug: 'cancellation-wallet', folder: 'Cancellation Insurance', title: 'Cancellation Insurance' },
  { slug: 'cybersential', folder: 'Cybersential', title: 'Cybersential' },
  { slug: 'piraeus-insurance', folder: 'Piraeus Insurance', title: 'Piraeus Insurance' },
  { slug: 'bancasure360', folder: 'BancaSure360', title: 'BancaSure360' },
  { slug: 'gaspar-ai', folder: 'Gaspar AI', title: 'Gaspar AI' },
  { slug: 'mood', folder: 'Mood', title: 'Mood: Music of our desire' },
  { slug: 'istorima', folder: 'istorima', title: 'Istorima' },
  { slug: 'benefit', folder: 'Benefit Apps', title: 'Benefit Apps' },
  { slug: 'book-cover', folder: 'Nixteri', title: 'To Nixteri Book' },
  { slug: 'olga-posonidou', folder: 'Olga Posonidou', title: 'Olga Posonidou' },
  { slug: 'vasiliki-vozora', folder: 'Vasiliki Vozora', title: 'Vasiliki Vozora' },
  { slug: 'danai-michali', folder: 'Danai Michali', title: 'Danai Michali' },
  { slug: 'arcana', folder: 'Tarrot Cards', title: 'Tarrot Cards' },
  { slug: 'cabaret', folder: 'Cabaret', title: 'Cabaret Movie Poster' },
  { slug: 'czech-folk', folder: 'Czech', title: 'Czech Folk' },
  { slug: 'in-pixels-we-see', folder: 'pixel', title: 'pixels' },
  { slug: 'typeface-a', folder: 'Typeface A', title: 'Typeface A' },
  { slug: 'typeface-b', folder: 'Typeface b', title: 'Typeface B' },
];

/**
 * Deal the stills out across the sections that want pictures.
 *
 * The design gives each section a handful and mixes pair-rows with
 * row-width ones. Until each page is laid out for real, the stills are
 * spread evenly and dealt two to a row, with a project's row-width stills
 * (the wireframes) taking a row of their own — which is what they are
 * exported at.
 */
function rowsFrom(stills: string[], wides: string[]): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < stills.length; i += 2) {
    rows.push(stills.slice(i, i + 2).map((src) => ({ src })));
  }
  for (const src of wides) rows.push([{ src }]);
  return rows;
}

function buildBlocks(slug: string, folder: string): Block[] {
  const a = ASSETS[folder];
  if (!a) return [];
  const chips = CHIPS[slug] ?? ['Brief'];
  const blocks: Block[] = [];

  /* The opening is a chip and a paragraph across the measure — no pictures
     beside it — then the feature slot under it. */
  blocks.push({ kind: 'text', chip: chips[0], text: TBD });

  const feature = a.videos[0] ?? a.highlights[0] ?? a.hero;
  if (feature) blocks.push({ kind: 'media', src: feature, poster: a.highlights[0] ?? a.hero ?? undefined });

  /* Everything after the first chip is a split, and the stills are shared
     out between them. */
  const rest = chips.slice(1);
  if (!rest.length) return blocks;

  const per = Math.ceil(a.stills.length / rest.length);
  rest.forEach((chip, i) => {
    const mine = a.stills.slice(i * per, (i + 1) * per);
    const wides = i === rest.length - 1 ? a.wides : [];
    blocks.push({ kind: 'split', chip, text: TBD, rows: rowsFrom(mine, wides) });
  });

  return blocks;
}

const BY_SLUG = new Map<string, Vol2Project>(
  SOURCES.map(({ slug, folder, title }) => [
    slug,
    {
      slug,
      title,
      subtitle: TBD,
      meta: { client: TBD, role: TBD, designTime: TBD, deliverables: TBD },
      hero: ASSETS[folder]?.hero ?? '',
      blocks: buildBlocks(slug, folder),
    },
  ]),
);

export function getVol2Project(slug: string): Vol2Project | null {
  return BY_SLUG.get(slug) ?? null;
}

export function allVol2ProjectSlugs(): string[] {
  return Array.from(BY_SLUG.keys());
}

/** the next three in the list, wrapping — see `MoreProjects` */
export function moreAfter(slug: string): string[] {
  const all = Array.from(BY_SLUG.keys());
  const i = all.indexOf(slug);
  if (i < 0) return all.slice(0, 3);
  return [...all.slice(i + 1), ...all.slice(0, i)].slice(0, 3);
}

/**
 * Just the opening picture of each project, for the cards.
 *
 * `categories.ts` needs the hero and nothing else; importing the records
 * themselves would pull every block of all nineteen into the category
 * bundle to read one string from each.
 */
export const HERO_BY_SLUG: Record<string, string> = Object.fromEntries(
  SOURCES.map(({ slug, folder }) => [slug, ASSETS[folder]?.hero]).filter(
    (e): e is [string, string] => !!e[1],
  ),
);
