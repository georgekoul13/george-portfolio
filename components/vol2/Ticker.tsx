'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The strip across the top of every base screen — Figma 255:8423, "HERO
 * RIBBON".
 *
 * Ten words on the page's own black, 8px apart, each pair divided by a 2px
 * dot — no illustrations. George: *"we need to repeat the words with this
 * order in a looped way so it looks like the ribbons we have in the next
 * section."* And it does read as one now: the same trick as the curved
 * DESIGN SERVICES bands, a list of services said over and over with a mark
 * between them, only laid flat.
 *
 * It replaces an earlier version of this node that alternated a sticker with
 * a label. That one is gone from the file entirely, so nothing of it is kept
 * here.
 */

/** the services, in the node's order */
const ITEMS = [
  'UI',
  'UX',
  'PRODUCT',
  'GRAPHIC',
  'CREATIVE',
  'BRAND',
  'ILLUSTRATIONS',
  'LOGO',
  'WEB',
  'APPS',
] as const;

/** px per second — slow enough to read a word as it goes by */
const SPEED = 42;
/** the fewest copies that can be laid out before anything is measured */
const MIN_COPIES = 2;
/** every gap in the row, word to dot and dot to word alike */
const GAP = 8;

/**
 * Cap trim. The node's text boxes are 11 tall at 16px because Figma trims to
 * the cap and the baseline, which is what makes the bar 43 rather than 56 —
 * so the same trim has to be here or the strip is 13px too tall for no
 * visible reason.
 */
const CAP_TRIM = {
  lineHeight: 1,
  marginTop: '-0.1585em',
  marginBottom: '-0.1415em',
} as const;

export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);
  /**
   * How many times the list is laid out. Two is not enough, and the failure
   * is only visible on a wide screen: one lap ran out before the right edge
   * and left a hole that opened and closed once a cycle, rather than a
   * ribbon. It has to cover the viewport PLUS a whole lap, because at the
   * moment before the offset resets the first lap is entirely off to the
   * left and doing no work.
   */
  const [copies, setCopies] = useState(MIN_COPIES);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>('[data-track]');
      if (!track) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      /* The distance after which the view repeats, measured rather than
         derived. Half the track's width is NOT it: the flex gaps sit between
         the children, so the second copy starts one gap further along than
         half — and the strip jumped by exactly that gap on every wrap, which
         is what stopped it reading as a loop. The offset between the first
         item of each copy is the repeat exactly. */
      const items = Array.from(track.children) as HTMLElement[];
      const lap = () =>
        items.length > ITEMS.length
          ? items[ITEMS.length].offsetLeft - items[0].offsetLeft
          : 0;

      /* Enough copies to cover the screen and a lap besides, remeasured
         whenever the window changes width. */
      const fit = () => {
        const d = lap();
        if (d > 0) {
          setCopies(Math.max(MIN_COPIES, Math.ceil((window.innerWidth + d) / d) + 1));
        }
      };
      fit();
      window.addEventListener('resize', fit);

      let x = 0;
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        const dt = (now - last) / 1000;
        last = now;
        const d = lap();
        if (d > 0) {
          x = (x + SPEED * dt) % d;
          gsap.set(track, { x: -x });
        }
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', fit);
      };
    },
    /* rebuilt when the copy count changes, so `items` is never stale */
    { scope: root, dependencies: [copies] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="w-full overflow-hidden"
      style={{ background: 'var(--ticker-bg)', paddingBlock: 16 }}
    >
      {/* No side padding on the TRACK: it would sit inside the repeat and
          push the copies out of step. The strip runs edge to edge, which is
          what an endless one has to do anyway. */}
      <div data-track className="flex w-max items-center" style={{ gap: GAP }}>
        {Array.from({ length: copies }, (_, copy) =>
          ITEMS.map((word, i) => (
            /* The word and the dot AFTER it are one child, so a copy is
               exactly `ITEMS.length` children and the lap above can be
               measured by index. It also guarantees the unit ends with a
               dot, so the next one starts with a word and the join is
               invisible. */
            <span key={`${copy}-${i}`} className="flex shrink-0 items-center" style={{ gap: GAP }}>
              <span
                className="whitespace-nowrap"
                /* `font` FIRST, then the trim. The shorthand resets
                   `line-height`, so spreading `CAP_TRIM` before it threw the
                   trim away and the bar came out 51 instead of 43 — the same
                   way the menu tiles once came out 42 instead of 32. */
                style={{
                  font: 'var(--type-16-24-r)',
                  ...CAP_TRIM,
                  color: 'var(--ticker-fg)',
                }}
              >
                {word}
              </span>
              <span
                className="block shrink-0 rounded-full"
                style={{ width: 2, height: 2, background: '#d9d9d9' }}
              />
            </span>
          )),
        )}
      </div>
    </div>
  );
}
