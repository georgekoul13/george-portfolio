/**
 * Hero data — geometry from Figma node 100:3485 (Hero, 1318 × 462),
 * assets from George's exports in /public/images/vol2.
 *
 * The exported letters are already full-height slots (282 tall) with their
 * own widths, so a slot's width is simply its letterform's width. Files are
 * named per *instance* — "O 3" is the third O in the wordmark, not a third
 * variant of the glyph.
 */

/**
 * The wordmark's box is the WIDEST WORD, not the design frame it was
 * measured in.
 *
 * 255:7046 sets the wordmark hard left in its column and lets KOULOURIS run
 * the full 791 of it. Measured inside a 1318 frame the two words are 723 and
 * 969.5 with the indent between them, so a box of 1318 leaves 348 of air on
 * one side or the other however the words are placed inside it — which is
 * what made the wordmark read as centred and 36% smaller than the node's.
 *
 * At 969.529 the long word spans the box exactly, the short one takes its
 * 74.6% of it, and both start at 0. Everything else in this file is measured
 * against `word.w`, so the kerning is untouched.
 */
export const HERO_W = 969.529;
/**
 * The box is the INK, not the letters' export boxes.
 *
 * Every letterform is exported in a 282-tall slot with its cap starting
 * around y=68 and its baseline around y=213 — so a box of 2 rows at 0 and
 * 180 runs from 0 to 462 while the ink only runs 68 to 393. That empty 68
 * above and 69 below is why the wordmark sat low in its column with a hole
 * over it, and why the 48 to the line under it measured about 117 on the
 * screen. George: *"here there should not be empty but start from the
 * beginning"* and *"make the gap between koulouris and the text smaller."*
 *
 * 325 is 393 − 68, and each word moves up by the same 68, so the box now
 * holds exactly the letters. The rows still overhang it top and bottom —
 * they are absolutely placed and nothing clips them — which is what keeps
 * the round letters' overshoot intact.
 */
export const HERO_H = 325;
/** every letterform is exported at this height */
export const ROW_H = 282;

export type Entrance =
  | { kind: 'y'; from: number }
  | { kind: 'x'; from: number }
  | { kind: 'flip' };

export interface Slot {
  /** file basename in /images/vol2/letters/font */
  file: string;
  /** x offset within the word — carries the design's kerning */
  x: number;
  /** slot width, from the export's viewBox */
  w: number;
  /** how this letter arrives on load */
  entrance: Entrance;
  duration: number;
  ease: string;
}

export interface Word {
  name: string;
  x: number;
  y: number;
  w: number;
  slots: Slot[];
}

/**
 * Entrances are deliberately varied rather than a uniform stagger — that's
 * what gsap.com does, where each letter gets its own property, duration and
 * ease instead of one tween with a stagger.
 */
export const WORDS: Word[] = [
  {
    name: 'GEORGE',
    x: 0,
    /* −68: the row's own empty space above the caps, taken back out. */
    y: -68,
    w: 722.903,
    slots: [
      { file: 'G 1', x: 0,       w: 126, entrance: { kind: 'y', from: 100 },  duration: 0.7,  ease: 'power2.out' },
      { file: 'E 1', x: 131.197, w: 106, entrance: { kind: 'flip' },          duration: 1.0,  ease: 'back.out(1.7)' },
      { file: 'O 1', x: 229.814, w: 126, entrance: { kind: 'y', from: -100 }, duration: 0.9,  ease: 'back.out(1.4)' },
      { file: 'R 1', x: 358.018, w: 123, entrance: { kind: 'y', from: 100 },  duration: 0.45, ease: 'power2.out' },
      { file: 'G 2', x: 489.508, w: 126, entrance: { kind: 'x', from: -100 }, duration: 0.6,  ease: 'power2.out' },
      { file: 'E 2', x: 617.711, w: 106, entrance: { kind: 'y', from: 100 },  duration: 0.8,  ease: 'back.out(1.4)' },
    ],
  },
  {
    name: 'KOULOURIS',
    x: 348.471,
    y: 112,
    w: 969.529,
    slots: [
      { file: 'K 1', x: 0,       w: 123, entrance: { kind: 'y', from: 100 },  duration: 0.6,  ease: 'power2.out' },
      { file: 'O 2', x: 108.578, w: 126, entrance: { kind: 'flip' },          duration: 1.0,  ease: 'back.out(1.7)' },
      { file: 'U 1', x: 234.705, w: 123, entrance: { kind: 'y', from: 100 },  duration: 0.5,  ease: 'power2.out' },
      { file: 'L 1', x: 346.574, w: 106, entrance: { kind: 'y', from: -100 }, duration: 0.85, ease: 'back.out(1.4)' },
      { file: 'O 3', x: 436.507, w: 126, entrance: { kind: 'y', from: 100 },  duration: 0.7,  ease: 'power2.out' },
      { file: 'U 2', x: 564.828, w: 123, entrance: { kind: 'x', from: 100 },  duration: 0.6,  ease: 'power2.out' },
      { file: 'R 2', x: 676.696, w: 123, entrance: { kind: 'y', from: 100 },  duration: 0.45, ease: 'power2.out' },
      { file: 'I 1', x: 794.049, w: 53,  entrance: { kind: 'y', from: -100 }, duration: 1.0,  ease: 'back.out(1.4)' },
      { file: 'S 1', x: 846.693, w: 123, entrance: { kind: 'flip' },          duration: 0.9,  ease: 'back.out(1.7)' },
    ],
  },
];

/** Slots start 50ms apart, so the last one to settle is not the last to start. */
export const STAGGER = 0.05;

/**
 * When the wordmark has finished arriving. Everything else in the hero — the
 * cursor, the braces, the subtitle, the CTA — keys off this, so retiming a
 * letter can't leave the rest of the section out of step.
 */
export const ENTRANCE_END = WORDS.flatMap((w) => w.slots).reduce(
  (end, slot, i) => Math.max(end, STAGGER * i + slot.duration),
  0,
);

/**
 * The illustrations the CTA throws on tap. Sizes are each one's own viewBox
 * — they are NOT normalised, because the design gives every sticker its own
 * weight. `rotate` is the resting angle read from the Figma instances.
 *
 * These used to double as the wordmark's O-swap pool. That was removed
 * 2026-09-04 at George's request; the CTA is the only thing that uses them
 * now.
 */
export interface Sticker {
  file: string;
  w: number;
  h: number;
  rotate: number;
}

export const STICKERS: Sticker[] = [
  { file: 'CD',        w: 114, h: 114, rotate:   0 },
  { file: 'FLAG 1',    w:  93, h: 114, rotate:  11.5 },
  { file: 'FLAG 2',    w:  93, h: 114, rotate:  -8 },
  { file: 'Phone',     w:  67, h: 135, rotate: -19.7 },
  { file: 'bomb A 1',  w: 114, h: 114, rotate:   6 },
  { file: 'bomb A 2',  w: 114, h: 114, rotate:  -6 },
  { file: 'bomb',      w:  78, h: 137, rotate:   7.3 },
  { file: 'flower',    w:  99, h:  99, rotate:  14 },
  { file: 'gameboy',   w:  84, h: 114, rotate:   0 },
  { file: 'globe',     w: 128, h: 114, rotate:  -9.6 },
  { file: 'happy',     w: 114, h: 114, rotate:   5 },
  { file: 'lollypop',  w:  86, h: 129, rotate:   7.4 },
  { file: 'pac man',   w: 101, h: 114, rotate:   0 },
  { file: 'pokeball',  w: 114, h: 114, rotate: -15 },
  { file: 'smile',     w: 114, h: 114, rotate:   0 },
  { file: 'sun',       w: 110, h: 115, rotate: -30 },
  { file: 'time',      w:  69, h: 111, rotate:  10.6 },
  { file: 'video',     w: 177, h: 107, rotate:  74.7 },
  { file: 'website',   w: 118, h: 119, rotate:   0 },
];


/**
 * The illustrations an O can turn into. Four, none of which is a letterform,
 * so the swap always reads as a substitution rather than a typo.
 */
export const O_POOL = ['smile', 'happy', 'globe', 'pokeball'] as const;

/**
 * entrance finishes → idle → an O swaps → hold → it leaves → idle …
 * The idle gap is measured after the exit completes, not on a fixed beat.
 */
export const SWAP = {
  /**
   * The wait before the *first* swap only. Shorter than the steady-state
   * idle so the wordmark's trick is discovered while someone is still
   * looking at it — eleven seconds of stillness read as nothing happening.
   */
  firstIdle: 3,
  idle: 10,
  hold: 4,
} as const;

export const stickerByFile = (file: string) =>
  STICKERS.find((s) => s.file === file)!;

export const letterSrc = (file: string) =>
  encodeURI(`/images/vol2/letters/font/${file}.svg`);
export const stickerSrc = (file: string) =>
  encodeURI(`/images/vol2/stickers/${file}.svg`);
