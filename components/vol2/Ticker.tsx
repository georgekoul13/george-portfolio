'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The strip across the top of every base screen — Figma 255:8423.
 *
 * A dark band on `--bg-raised`, 32 in from each end and 22 top and bottom,
 * carrying a sticker and a label every 20px: the services, said plainly and
 * then said again. It is the one piece of the page that never stops moving,
 * which is the point — the base screen underneath it is otherwise still
 * until you scroll.
 *
 * Two departures from the node, both stated rather than smuggled:
 *
 * - The node sets the labels in Inter. This site has one family loaded, and
 *   adding a second for a decorative strip is a bigger decision than it
 *   looks — it is a font on every page's critical path. They are set in the
 *   site's own sans at the drawn size.
 * - The node's sequence has CREATIVE twice, once against a bomb and once
 *   against a smiley, with no second word for the second sticker. Rather
 *   than invent copy, the five distinct pairs repeat.
 */

const ITEMS = [
  { sticker: 'globe', label: 'UI DESIGN' },
  { sticker: 'FLAG 1', label: 'UX DESIGN' },
  { sticker: 'pokeball', label: 'PRODUCT' },
  { sticker: 'smile', label: 'GRAPHIC' },
  { sticker: 'bomb', label: 'CREATIVE' },
] as const;

/** px per second — slow enough to read a word as it goes by */
const SPEED = 42;
/** the fewest copies that can be laid out before anything is measured */
const MIN_COPIES = 2;
/** the sticker's size. 28.5 in the node, a step down here —
    George: *"we can make the ribbon a bit smaller."* */
const ICON = 24;

export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);
  /**
   * How many times the list is laid out. Two is not enough, and the failure
   * is only visible on a wide screen: one lap of these five pairs is about
   * 827px, so a 1440 window ran the strip out 633px short of its right edge
   * on every wrap — a hole opening and closing once a cycle rather than a
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
          push the second copy out of step with the first. The strip runs edge
          to edge, which is what an endless one has to do anyway. */}
      <div data-track className="flex w-max items-center" style={{ gap: 20 }}>
        {Array.from({ length: copies }, (_, copy) =>
          ITEMS.map((item, i) => (
            <span key={`${copy}-${i}`} className="flex shrink-0 items-center" style={{ gap: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI(`/images/vol2/stickers/${item.sticker}.svg`)}
                alt=""
                className="block max-w-none shrink-0"
                style={{ height: ICON }}
              />
              <span
                className="whitespace-nowrap"
                style={{ font: 'var(--type-20-24-r)', color: 'var(--ticker-fg)' }}
              >
                {item.label}
              </span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}
