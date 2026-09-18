/* GENERATED from altText.json — regenerate rather than editing by hand.
   The source of truth is the JSON beside this file. */
import RAW from './altText.json';

/**
 * What every picture on a project page actually shows.
 *
 * ── why this is not the project title ─────────────────────────────────
 * It was. Every image on a page carried the same string, so a screen
 * reader on the Mood page said "Mood: Music of our desire" twenty-four
 * times in a row, and Google was handed twenty-four identical labels for
 * twenty-four different screens — which is the same as handing it none.
 * George: *"let's do the alt text properly too."*
 *
 * So each of the 173 stills and 10 loops was looked at and described:
 * what is in the picture, in plain words. No "screenshot of", which every
 * screen reader already announces, and no keyword padding, which is read
 * out in full to the one person it inconveniences most.
 *
 * ── keyed by the file, not the position ───────────────────────────────
 * `Cybersential/image 3.webp`, not "the fourth image". A block order that
 * changes in `layout.ts` would silently shift every description by one,
 * and nobody reading the page would ever see it happen. The key survives
 * reordering, and an image with no entry falls back to the project title
 * rather than to nothing.
 *
 * The lookup strips the cache stamp and decodes the folder name, because
 * a src is `/images/vol2/projects/Benefit%20Apps/hero.webp?v=2e477ef1`.
 */
export const ALT: Record<string, string> = RAW;

/** the written description, or undefined when a file has none yet */
export function altOf(src: string | undefined): string | undefined {
  if (!src) return undefined;
  const path = decodeURIComponent(src.split('?')[0]);
  const at = path.indexOf('/projects/');
  if (at < 0) return undefined;
  return ALT[path.slice(at + '/projects/'.length)];
}

export function altFor(src: string | undefined, fallback: string): string {
  return altOf(src) ?? fallback;
}
