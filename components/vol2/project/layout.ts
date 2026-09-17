/* GENERATED — read off the Figma file with the Plugin API, not written by hand.
   Source: Portfolio Website vol 2, page "Product pages" (4f0trlMHIIACk6KKKLhlVp).
   Each entry keeps the node id of the 1320 content column it came from, so a
   frame that changes can be re-read on its own. */

/**
 * WHAT EACH PROJECT PAGE IS MADE OF, in George's order.
 *
 * The block list used to be derived — chips from one table, stills dealt out
 * evenly between them — which meant a page had the right pieces in the wrong
 * places. Gaspar's eleven brand stills were spread across six sections that
 * were never meant to hold them. This is the design's own arrangement
 * instead: which sections carry pictures, how many, and what SHAPE each is.
 *
 * ── the cell shapes ───────────────────────────────────────────────────
 *   400x400   half the stills column — two of these make a row
 *   840x400   the whole stills column
 *   840x470+  a loop in the stills column, at its own aspect
 *   1320x640  full width, outside the column — a `media` block
 *
 * A LONE 400 IS STILL A 400. It keeps its half-width square and sits at the
 * left of its row; it does not grow to fill the row. George, on Gaspar:
 * *"in the case of one image here on the row it should be like this"* —
 * Figma 352:5061, a 400x400 frame alone in an 840 column.
 *
 * ── a split has GROUPS ────────────────────────────────────────────────
 * Most sections are one chip, one paragraph, one run of pictures — a single
 * group. Mood is one chip over FOUR paragraph-and-picture pairs, and the
 * first read of this file flattened it into twenty stills under one
 * paragraph, which lost the structure George had drawn. Checked since across
 * all nineteen: Mood is the only one, but the model carries groups
 * everywhere so the next one cannot be flattened by accident. Its four are
 * onboarding, exploration, profile and cinema, at 6/6/3/5 cells, read off
 * frames 352:6129, 353:9573, 353:9585 and 353:9597.
 *
 * `bullets` is how many arrow-led lines the text column carries in that
 * section. The words are still to be written; the count is the design's.
 *
 * Nothing here is edited or tidied. Two projects genuinely carry the same
 * chip twice — Benefit Apps has two sections called "The Design proccess"
 * and Gaspar two called "The Website vol2" — and both pairs are real, with
 * different pictures in each. Which of these slots have a file to put in
 * them is a separate question, and `vol2Projects.ts` answers it.
 */
export type CellKind = 'image' | 'video' | 'anim';

/** one picture slot, at the size the design drew it */
export interface LayoutCell {
  w: number;
  h: number;
  /** `anim` is one of George's Figma timelines — it arrives as a video file */
  k: CellKind;
}

/** one paragraph and the pictures beside it */
export interface LayoutGroup {
  cells: LayoutCell[];
  bullets?: number;
}

export type LayoutBlock =
  | { kind: 'text'; chip: string }
  | { kind: 'media'; cell: LayoutCell }
  | { kind: 'split'; chip: string; groups: LayoutGroup[] };

export interface ProjectLayout {
  /** the Figma node id of the content column this was read from */
  figma: string;
  blocks: LayoutBlock[];
}

export const LAYOUT: Record<string, ProjectLayout> = {
  "deerislnd": {
    figma: '340:19434',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'anim' } },
      { kind: 'text', chip: "The challenge" },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
      { kind: 'split', chip: "The Final",
        groups: [
          { cells: [{ w: 840, h: 640, k: 'anim' }] },
        ] },
    ],
  },
  "cancellation-wallet": {
    figma: '341:4009',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'anim' } },
      { kind: 'text', chip: "The challenge" },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "The solution",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'text', chip: "The complexity" },
    ],
  },
  "cybersential": {
    figma: '345:4911',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'text', chip: "The challenge" },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "Sales flow",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "Wallet",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'text', chip: "The complexity" },
    ],
  },
  "piraeus-insurance": {
    figma: '345:5307',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "Various insurance products",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'text', chip: "The challenge" },
      { kind: 'split', chip: "Phone insurance",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'text', chip: "The complexity" },
    ],
  },
  "bancasure360": {
    figma: '345:5733',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }, { w: 840, h: 400, k: 'image' }] },
        ] },
      { kind: 'text', chip: "The complexity" },
      { kind: 'split', chip: "Various insurance products",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
    ],
  },
  "gaspar-ai": {
    figma: '348:4075',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'anim' } },
      { kind: 'text', chip: "The challenge" },
      { kind: 'split', chip: "The brand",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "The Website vol2",
        groups: [
          { cells: [{ w: 840, h: 538, k: 'video' }], bullets: 2 },
        ] },
      { kind: 'split', chip: "The Website vol2",
        groups: [
          { cells: [{ w: 840, h: 538, k: 'video' }], bullets: 2 },
        ] },
      { kind: 'split', chip: "Conversational Design",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }, { w: 840, h: 400, k: 'image' }] },
        ] },
    ],
  },
  "mood": {
    figma: '352:5101',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The brand",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
    ],
  },
  "istorima": {
    figma: '353:9636',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 840, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }] },
        ] },
      { kind: 'text', chip: "The challenge" },
    ],
  },
  "benefit": {
    figma: '356:9835',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }] },
        ] },
      { kind: 'split', chip: "The Design proccess",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 840, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 840, h: 400, k: 'image' }] },
        ] },
      { kind: 'text', chip: "The challenge" },
    ],
  },
  "book-cover": {
    figma: '358:40360',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
      { kind: 'text', chip: "The challenge" },
    ],
  },
  "olga-posonidou": {
    figma: '358:99235',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
    ],
  },
  "vasiliki-vozora": {
    figma: '364:101487',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 840, h: 470, k: 'video' }], bullets: 2 },
        ] },
    ],
  },
  "danai-michali": {
    figma: '365:9535',
    blocks: [
      { kind: 'media', cell: { w: 1320, h: 640, k: 'image' } },
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'image' } },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
    ],
  },
  "arcana": {
    figma: '366:34601',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'image' } },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
    ],
  },
  "cabaret": {
    figma: '366:34727',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'image' } },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
    ],
  },
  "czech-image": {
    figma: '366:35011',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'anim' } },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
    ],
  },
  "in-pixels-we-see": {
    figma: '366:43506',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'anim' } },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }, { w: 400, h: 400, k: 'image' }], bullets: 2 },
        ] },
    ],
  },
  "typeface-a": {
    figma: '366:77551',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }], bullets: 2 },
        ] },
      { kind: 'media', cell: { w: 1320, h: 640, k: 'anim' } },
    ],
  },
  "typeface-b": {
    figma: '366:104016',
    blocks: [
      { kind: 'text', chip: "Brief" },
      { kind: 'split', chip: "The Directions",
        groups: [
          { cells: [{ w: 840, h: 400, k: 'image' }], bullets: 2 },
        ] },
    ],
  },
};
