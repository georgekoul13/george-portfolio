'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';

gsap.registerPlugin(ScrollTrigger);

/**
 * The quiet reveal — a fade and a short rise, one child after the next.
 *
 * George, testing the project pages: *"let's make sure that we use the same
 * revealing smooth animations in these pages as well cuz i can not see
 * them."* The pictures already had one (`Stills`, and the uncover in
 * `ProjectImage`); every word on the page simply appeared.
 *
 * ── why not `RevealText` everywhere ───────────────────────────────────
 * The word-by-word wipe is a DISPLAY behaviour. It spends most of a screen
 * of scroll writing one sentence, which is right for a headline you are
 * meant to watch and wrong for a 24/32 caption beside a screenshot — a
 * reader who has to scroll a paragraph into existence to read it is being
 * made to work. So the big full-width text takes the wipe and everything
 * else takes this: the same arrival, at the weight of the thing arriving.
 *
 * It is paced with the stills deliberately — `power3.out` over a second,
 * firing when the element's own top reaches 88% of the window — so a chip
 * and the picture beside it come in together rather than taking turns. The
 * pictures themselves take the stronger gesture, the clip-path uncover; see
 * `Stills`. Words cannot be uncovered the same way without reading as a
 * wipe, which this template already spends on the display type.
 *
 * Children are animated INDIVIDUALLY rather than as one box, so a chip, its
 * paragraph and its list arrive in reading order.
 */
export default function Rise({
  children,
  className,
  style,
  /** wrapper tag — a `section` where this is the block's own outer element */
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section';
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const kids = Array.from(root.current!.children);
      if (!kids.length) return;

      /* ── EACH CHILD IS TRIGGERED BY ITSELF ───────────────────────────
         One trigger on the wrapper with a stagger was wrong, and George
         caught it: *"as i scroll i see them there — i assume that the
         animation already happened offscreen."* A trigger fires when the
         TRIGGER's top crosses the line, so on a tall block — a column of
         copy, a wrap of six stills — the first row entering played the whole
         group, and everything below the fold finished before it was ever
         seen. Arriving at row three, you find it already there.

         Keyed to its own element, every child waits for its own top, which
         is the behaviour the words describe. The stagger is replaced by a
         small per-child delay so a chip and the paragraph under it still
         arrive in reading order when they cross together. */
      kids.forEach((kid, i) => {
        gsap.from(kid, {
          autoAlpha: 0,
          /* 40, not 24. George could not see the reveal at all at 24 over
             0.8s — on a phone it finished inside the momentum of a normal
             flick. The distance and the time both had to grow before the
             arrival reads as movement rather than as the element simply
             being there. */
          y: 40,
          duration: 1,
          delay: i * 0.08,
          ease: 'power3.out',
          /* NOT `clamp()`. Clamping pulls a start that would be negative up
             to zero, and a block already on screen at rest then sits at
             progress 0 — parked and invisible — until the reader scrolls a
             pixel. The title under the hero is exactly that block, and it
             opened the page blank. Unclamped, a start that is already behind
             the scroll fires on refresh instead, so the first screen arrives
             on load and everything below it still waits its turn. */
          scrollTrigger: { trigger: kid, start: 'top 88%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
