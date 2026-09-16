/**
 * What a project page is made of — Figma 366:11793.
 *
 * The old template was four fixed slots: two heroes, a statement between
 * them, and a closing trio. Every project got the same shape whether or not
 * it had anything to put in it, which is why `gallery` cycled the same
 * picture three times for `cabaret`.
 *
 * This one is a LIST. A project is an ordered run of blocks, and the design
 * only draws three kinds:
 *
 *   text     a chip and a paragraph across the full measure
 *   media    one picture or one video, full width, 1320 x 640
 *   split    a chip, a paragraph in a 432 column, and the stills beside it
 *            in the remaining 840
 *
 * So Mood's twenty stills and Typeface B's single one are the same template
 * with a different list, and nothing has to be padded or repeated to fit.
 *
 * George's own section labels are the chips — `Brief`, `The challenge`,
 * `The Design proccess`, `The Directions`, and the project-specific ones like
 * `Sales flow` or `Conversational Design`. They are also what the sticky
 * header reads out as you scroll, so they are structure rather than
 * decoration: see `ProjectHeader`.
 *
 * ── the stills are CELLS, not rows ────────────────────────────────────
 * They used to be `Row[]`, a list of lists, with the aspect derived from how
 * many were in a row: one meant "across the whole column", two meant "a
 * pair". That derivation is wrong, and it is what George caught on Gaspar —
 * a single 400 square at the end of a run stretched to 840 and went from a
 * phone screenshot to a letterbox. The design's last row there (Figma
 * 352:5061) is a 400x400 frame sitting alone at the left of an 840 column.
 *
 * So a cell carries its own width and its own proportion, read off the
 * canvas, and the rows fall out of laying them side by side and letting them
 * wrap — which is what Figma's own auto-layout is doing. See `layout.ts` for
 * where the shapes come from and `ProjectBlocks` for the wrap.
 */

/** one picture slot beside a `split` */
export interface Cell {
  src: string;
  alt?: string;
  /** 1 = half the stills column, 2 = the whole of it */
  span: 1 | 2;
  /** the design's own proportion for this slot, e.g. `400 / 400` */
  aspect: string;
  kind: 'image' | 'video';
  /** first frame of a loop — the whole of it when autoplay is refused */
  poster?: string;
}

export type Block =
  | { kind: 'text'; chip?: string; text: string; bullets?: string[] }
  | { kind: 'media'; src: string; poster?: string; alt?: string }
  | { kind: 'split'; chip: string; text: string; bullets?: string[]; cells: Cell[] };

export interface ProjectMetaFields {
  client: string;
  role: string;
  /** George added this one — how long the thing took to design */
  designTime: string;
  deliverables: string;
}

export interface Vol2Project {
  slug: string;
  title: string;
  /** the line under the title on the base, 16/24 */
  subtitle: string;
  meta: ProjectMetaFields;
  /** the base's picture, and the card's — the same file in both places */
  hero: string;
  blocks: Block[];
}

/**
 * The chips a reader can be scrolled to, in order. The sticky header names
 * the current one and the progress bar runs to the last, so both read this
 * rather than counting sections for themselves.
 */
export function chipsOf(blocks: Block[]): string[] {
  return blocks
    .map((b) => (b.kind === 'media' ? null : b.chip))
    .filter((c): c is string => !!c);
}
