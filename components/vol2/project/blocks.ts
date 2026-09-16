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
 *   split    a chip, a paragraph in a 432 column, and a grid of stills
 *            beside it in the remaining 840
 *
 * So Mood's twenty stills and Typeface B's single one are the same template
 * with a different list, and nothing has to be padded or repeated to fit.
 *
 * George's own section labels are the chips — `Brief`, `The challenge`,
 * `The Design process`, `The Directions`, and the project-specific ones like
 * `Sales flow` or `Conversational Design`. They are also what the sticky
 * header reads out as you scroll, so they are structure rather than
 * decoration: see `ProjectHeader`.
 */

/** one row of the grid beside a `split`: either a pair, or one across */
export type Row = { src: string; alt?: string }[];

export type Block =
  | { kind: 'text'; chip?: string; text: string }
  | { kind: 'media'; src: string; poster?: string; alt?: string }
  | { kind: 'split'; chip: string; text: string; rows: Row[] };

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
