'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import { useGateReady } from './ProjectGate';
import { revealTiming } from './revealTiming';
import { onEnterView } from './enterView';

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
  on = 'view',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section';
  /**
   * WHEN the group arrives.
   *
   * `view` is the page's rule: each child waits for its own top to reach the
   * reveal line. `load` plays the moment the curtain lifts, and exists for
   * content that is part of the OPENING rather than part of the scroll.
   *
   * ── why a scroll line cannot serve the opening panel ──────────────────
   * George: *"in all the project pages the details under the title are not
   * all visible unless you scroll to the next section and scroll back up."*
   *
   * A reveal line assumes the element will travel towards it. Inside
   * `PanelStack` the opening panel is PINNED, and all it ever travels is its
   * own overflow — so the assumption fails at both ends of the range.
   * Measured on Cybersential, with the Client / Role / Deliverables row:
   *
   *   1512 x 945   panel 1155, overflow 210. The row's top runs 1012 -> 802
   *                against a line at 832. It crosses with 30px to spare, in
   *                the last frames before the panel starts receding.
   *   411 x 760    panel 693, overflow 0. NOTHING in the panel ever moves.
   *                Deliverables sits at 609 against a line at 547 and stays
   *                there — the reveal has no way to fire at all.
   *
   * What finally plays it, on both, is the panel RECEDING: the scale to 0.7
   * pulls everything towards the middle of the screen, which drags the row
   * up over the line while it is fading out. It is revealed behind the
   * arriving panel, and is simply there when the reader comes back up.
   *
   * So the masthead is not waiting for a reader; it is waiting for a
   * geometry that a pinned panel never provides. It belongs to the page
   * opening, and plays there — which is what `ProjectBase` always said it
   * was doing.
   */
  on?: 'view' | 'load';
  /** seconds before a `load` group starts, so a masthead reads top-down */
  delay?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  /* nothing is built while the curtain is up — see `ProjectGate` */
  const ready = useGateReady();

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const kids = Array.from(root.current!.children);
      if (!kids.length) return;
      /* later and quicker on a phone — see `revealTiming` */
      const T = revealTiming();

      /* Parked as soon as the page mounts, played only once `ProjectGate`
         has lifted the curtain — see the same note in `ProjectImage`. */
      gsap.set(kids, { autoAlpha: 0, y: 40 });
      if (!ready) return;

      const play = (kid: Element, i: number, lead: number) =>
        void gsap.to(kid, {
          autoAlpha: 1,
          /* 40px of travel — 24 was too little to register at all. The
             TIMING is `revealTiming`'s, because the number that works
             on a laptop is wrong on a phone: see there. */
          y: 0,
          duration: T.duration,
          delay: lead + i * T.stagger,
          ease: 'power3.out',
        });

      /* The opening panel's own content — see `on` above. */
      if (on === 'load') {
        kids.forEach((kid, i) => play(kid, i, delay));
        return;
      }

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
      const stop: (() => void)[] = [];
      kids.forEach((kid, i) => {
        stop.push(
          onEnterView(kid, () => play(kid, i, 0), T.at),
        );
      });

      return () => stop.forEach((fn) => fn());
    },
    { scope: root, dependencies: [ready, on, delay], revertOnUpdate: true },
  );

  return (
    <Tag ref={root as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
