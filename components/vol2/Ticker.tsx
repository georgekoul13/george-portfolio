'use client';

import { useRef } from 'react';
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
/** the sticker's drawn size */
const ICON = 28.5;

export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>('[data-track]');
      if (!track) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      let x = 0;
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        const dt = (now - last) / 1000;
        last = now;
        /* The list is rendered TWICE, so at exactly half the track's width
           the view is identical to the start and the offset can jump back
           with nothing to see. */
        const half = track.scrollWidth / 2;
        if (half > 0) {
          x = (x + SPEED * dt) % half;
          gsap.set(track, { x: -x });
        }
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="w-full overflow-hidden"
      style={{ background: 'var(--ticker-bg)', paddingBlock: 22 }}
    >
      <div data-track className="flex w-max items-center" style={{ gap: 20, paddingInline: 32 }}>
        {[0, 1].map((copy) =>
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
                style={{ font: 'var(--type-24-24-r)', color: 'var(--ticker-fg)' }}
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
