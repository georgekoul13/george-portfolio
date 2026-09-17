import { ASSETS, type Loop, type Shot } from './assets';
import { COPY, CHIP_RENAMES, dropArticle, type SectionCopy } from './copy';
import { LAYOUT, type LayoutCell } from './layout';
import type { Block, Cell, Vol2Project } from './blocks';

/**
 * The nineteen project pages, on the template of Figma 366:11793.
 *
 * ── the words live in `copy.ts` ───────────────────────────────────────
 * A page George has written reads from there. A page he has not keeps the
 * lorem below, and so does any section his entry does not reach — there is
 * no state in between, which is the point. George: *"ALL THE TEXTS
 * EVERYWHERE ARE PLACEHOLDERS we are going to do them page by page."*
 *
 * The section chips turned out to be drafts too: *"we can change the wording
 * 'The Design proccess' as well, it's just a placeholder."* So `copy.ts` may
 * override a chip, and `layout.ts` holds his working label until it does.
 *
 * Do not write a line into either file from inference. We write them
 * together, one project at a time.
 *
 * ── the PICTURES are not placeholders ─────────────────────────────────
 * They used to be arranged by this file: chips from a table here, stills
 * dealt out evenly between them, two to a row. That put the right pictures
 * in the wrong sections — Gaspar's eleven brand stills spread across six
 * sections, one of them stretched to twice its width because it happened to
 * land alone. The arrangement now comes from `layout.ts`, which was read off
 * George's canvas, and this file only says which FILE goes in which slot.
 *
 * ── how a file finds its slot ─────────────────────────────────────────
 * By shape, in order. The design names a slot's size; the export knows its
 * own pixels; a 400 slot takes the next square and an 840 slot takes the
 * next wide one. That matters because `image N` is both shapes — Istorima's
 * `image 3` is 1680x800 and sits across the column while `image 2` and
 * `image 4` are 800x800 cells either side of it. Reading the shape puts it
 * back exactly where the canvas has it; counting names does not.
 *
 * ── the two tables below, and why they have to exist ──────────────────
 * `NOT_EXPORTED` and `REPEATS` are the only places where this file departs
 * from filling slots in order, and both are facts about the EXPORT rather
 * than about the design. Neither can be worked out from the files: a slot
 * with no picture and a slot whose picture is also used elsewhere both look
 * like "one more 840" from here. They are checked against the chip they
 * belong to, so if `layout.ts` is re-read and a section moves, the
 * exception stops applying instead of landing on the wrong section.
 *
 * ── the slugs are PROVISIONAL ─────────────────────────────────────────
 * Sixteen reuse the slug the project already had, so no URL moves and no
 * link in `categories.ts` breaks. Three had none — Czech Folk and the two
 * typefaces — and take one derived from the folder name. Renaming any of
 * them is a one-line edit here plus the same word in `categories.ts`.
 */

/* ── the placeholder copy ─────────────────────────────────────────────
   George's own frames carry "Forem ipsum", so the same text is here: it
   sets at the length the design was drawn to, which `[to write]` did not —
   a two-word paragraph in a 432 column tells you nothing about whether the
   column works.

   It stays obviously fake on purpose. Lorem cannot be mistaken for finished
   copy and cannot say anything wrong about the work, which invented English
   would do on both counts. Replace a whole entry when we write it; never
   edit one of these into something that reads as real. */
const LOREM =
  'Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate ' +
  'libero et velit interdum, ac aliquet odio mattis.';

/** the longer one, for a section that carries a 432 column beside its stills */
const LOREM_LONG =
  LOREM +
  ' Class aptent taciti sociosqu ad litora torquent per conubia nostra, per ' +
  'inceptos himenaeos.';

/** one arrow-led line. The design says how many; the words are still ours. */
const LOREM_LINE = 'Forem ipsum dolor sit';

/* The four facts are NOT prose, so lorem would be wrong for them — and a
   real-looking value would be worse, because "DEERISLD" under Gaspar AI is
   a false statement rather than a blank. They read as the shape of the
   answer instead: obviously unfilled, but showing what belongs there. Only
   George has these. */
const FACT = {
  client: 'Client name',
  role: 'Role',
  deliverables: 'What was delivered',
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
 * Slots the design draws that the export does not have.
 *
 * EMPTY as of 2026-09-17, and kept because the shape of the problem will
 * come back. Every slot in every project now has a file. The three that did
 * not were Gaspar's `The Design proccess` and `Conversational Design` (the
 * canvas overview and two dialogue flow diagrams, `wide 01`–`wide 03`) and
 * Benefit's first `The Design proccess` (`wireframe.png`); George exported
 * all four. To Nixteri Book's stray full-width slot was a Deerislnd poster
 * left behind by duplicating the frame, and he removed it in Figma instead
 * — `layout.ts` no longer has the block at all.
 *
 * What this is FOR, when the next one turns up: an unfillable slot has to be
 * named rather than skipped, because the queue is positional. Benefit has
 * two sections both chipped `The Design proccess`, both wanting an 840. If
 * the first silently took the next wide file, the second would come up short
 * and every screen after it would shift a place.
 */
const NOT_EXPORTED: Record<string, { at: number; chip: string | null }[]> = {};

/**
 * Sections that show pictures the page shows again further down.
 *
 * Deerislnd opens `The Design proccess` with the first two posters and then
 * gives all seven of them to `The Directions`. Seven files, nine slots, and
 * the two are deliberate — the section is about how the direction was
 * arrived at, so it holds the two it arrived at. They are read by index
 * instead of taken off the queue, which leaves `The Directions` its seven.
 */
const REPEATS: Record<string, Record<string, number[]>> = {
  deerislnd: { 'The Design proccess': [0, 1] },
};

/** a square export is a 400 cell; anything wider than it is tall is an 840 */
const isSquare = (s: Shot) => s.w > 0 && s.w === s.h;

function buildBlocks(slug: string, folder: string): Block[] {
  const a = ASSETS[folder];
  const plan = LAYOUT[slug];
  if (!a || !plan) return [];

  /* Four queues, each in export order. A slot takes the next file of its own
     shape, so the sequence survives a project whose squares and wides are
     interleaved in one `image N` run. */
  const allSquares = a.stills.filter(isSquare).map((s) => s.src);
  const squares = [...allSquares];
  const wides = a.stills.filter((s) => !isSquare(s)).map((s) => s.src);
  const highlights = a.highlights.map((s) => s.src);
  const videos = [...a.videos];

  const empty = NOT_EXPORTED[slug] ?? [];
  const repeats = REPEATS[slug] ?? {};

  /* The words for block `at`, where this page has been written. A project
     with no entry, or a section its entry does not reach, keeps the lorem —
     so a half-written page is impossible: it is either George's words or
     visibly not. */
  const written = COPY[slug]?.sections;
  const says = (at: number): SectionCopy | undefined => written?.[at] ?? undefined;

  /* The chip a section actually shows: what `copy.ts` says for this one, or
     a rename that applies everywhere, or the working label off the canvas. */
  const label = (w: SectionCopy | undefined, chip: string) =>
    dropArticle(w?.chip ?? CHIP_RENAMES[chip] ?? chip);

  /** the still for one slot, or nothing when the export does not have it */
  const fill = (c: LayoutCell): string | undefined =>
    c.w >= 800 ? wides.shift() : squares.shift();

  const shape = (c: LayoutCell) => ({
    span: (c.w >= 800 ? 2 : 1) as 1 | 2,
    aspect: `${c.w} / ${c.h}`,
  });

  const toCell = (c: LayoutCell, still?: string): Cell | null => {
    /* A loop is a PAIR of files, not one — the WebM and its H.264 fallback.
       It carries both so the markup can offer only what exists; see
       `VideoSources` for what deriving the sibling from the name cost. */
    if (c.k !== 'image') {
      const loop: Loop | undefined = videos.shift();
      if (!loop) return null;
      return { sources: loop, kind: 'video', ...shape(c) };
    }
    const src = still ?? fill(c);
    if (!src) return null;
    return { src, kind: 'image', ...shape(c) };
  };

  const blocks: Block[] = [];
  plan.blocks.forEach((b, at) => {
    if (b.kind === 'text') {
      const w = says(at);
      blocks.push({ kind: 'text', chip: label(w, b.chip), text: w?.text ?? LOREM, bullets: w?.bullets });
      return;
    }

    /* the slot is drawn but has no file — see `NOT_EXPORTED` */
    const blank = empty.some((e) => e.at === at && e.chip === (b.kind === 'split' ? b.chip : null));

    if (b.kind === 'media') {
      if (blank) return;
      /* The full-width slot is a still on some pages and one of George's
         Figma timelines on others; `anim` means the timeline, which arrives
         as a video file. A still first, so a project with both keeps them
         in the order the design has them. */
      if (b.cell.k === 'image') {
        const src = highlights.shift();
        if (src) blocks.push({ kind: 'media', src });
        return;
      }
      const loop = videos.shift();
      if (loop) blocks.push({ kind: 'media', sources: loop });
      return;
    }

    const w = says(at);
    const bullets =
      w?.bullets ?? (b.bullets ? Array.from({ length: b.bullets }, () => LOREM_LINE) : undefined);
    const chip = label(w, b.chip);

    /* A section that shows pictures the page shows again reads them by
       index rather than taking them off the queue — see `REPEATS`. */
    const again = repeats[b.chip];
    const cells = blank
      ? []
      : again
        ? b.cells
            .map((c, i) => toCell(c, allSquares[again[i]]))
            .filter((c): c is Cell => !!c)
        : b.cells.map((c) => toCell(c)).filter((c): c is Cell => !!c);

    /* A split whose pictures are all missing is still a section George
       wrote — it keeps its chip and its words and stops being a split. */
    if (!cells.length) {
      blocks.push({ kind: 'text', chip, text: w?.text ?? LOREM, bullets });
      return;
    }
    blocks.push({ kind: 'split', chip, text: w?.text ?? LOREM_LONG, bullets, cells });
  });

  return blocks;
}

const BY_SLUG = new Map<string, Vol2Project>(
  SOURCES.map(({ slug, folder, title }) => [
    slug,
    {
      slug,
      title,
      subtitle: COPY[slug]?.subtitle ?? LOREM,
      meta: COPY[slug]?.meta ?? { ...FACT },
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
