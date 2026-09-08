'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { ENTRANCE_END } from './hero/heroData';

gsap.registerPlugin(SplitText);

/** how much of the run the stagger occupies — the band's own number */
const SPREAD = 0.55;
/** and how long the whole line takes to write itself */
const RUN = 1.1;

/**
 * The line under a base screen's title, written character by character on
 * load.
 *
 * ── the same reveal as the featured band's headline ───────────────────
 * George: *"let's make the professional over-thinker revealed with the same
 * animation of the WHERE EVERY PROJECT IS DESIGNED WITH CARE."* That one
 * rises its characters out of the line they sit on in one left-to-right run
 * across both lines, so the sentence assembles in reading order rather than
 * the two lines racing each other — see `renderHead` in `ProjectsBand`.
 *
 * Its shape is a stagger, written there as an explicit lead per character
 * because it is SCRUBBED: `lead = (i/n) * SPREAD`, and each character then
 * takes the remaining `1 - SPREAD` of the run with a cubic ease out. This
 * one PLAYS, so the same shape is a plain stagger — each character's tween
 * is `1 - SPREAD` of the total and they start `SPREAD / (n-1)` apart. Same
 * numbers, same curve (`power3.out` IS `1 - (1-t)³`), one driven and one
 * played.
 *
 * `type: 'lines,chars'` with `mask: 'lines'`, not `mask: 'chars'`: the band
 * relies on each LINE box clipping, so a character parked at `yPercent: 100`
 * is simply below its own line. Masking the characters individually would
 * clip each one to itself and lose the rise.
 */
export default function BaseText({
  children,
  style,
  className,
  as: Tag = 'p',
  startAt = ENTRANCE_END + 0.15,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  /**
   * The element to render. A category hero's TITLE gets this same reveal —
   * George: *"let's add a revealing animation to the title as well"* — and a
   * title has to be an `h1`, not a paragraph.
   */
  as?: 'p' | 'h1';
  /**
   * When to start, in seconds on `gsap.globalTimeline`.
   *
   * Absolute rather than a delay, and on THAT clock rather than the wall
   * clock, because the Loader pauses the global timeline while its panel is
   * up: a wall-clock delay would burn itself down behind the curtain and the
   * reveal would already be over by the time anyone saw it. Reading the same
   * clock means "this long after the page is actually visible", however long
   * the loader held.
   *
   * The default is the home page's: after the wordmark's letters have
   * finished arriving. A category hero has no wordmark entrance to wait for,
   * so it passes its own, much earlier.
   */
  startAt?: number;
}) {
  const line = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = line.current;
      if (!el) return;
      let split: SplitText | undefined;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { visibility: 'inherit' });
        return;
      }

      document.fonts.ready.then(() => {
        if (!line.current) return;
        split = SplitText.create(line.current, { type: 'lines,chars', mask: 'lines' });
        const chars = split.chars as HTMLElement[];
        gsap.set(chars, { yPercent: 100, opacity: 0 });
        /* Uncovered only once every character is parked below its line — the
           markup ships hidden, because splitting waits on
           `document.fonts.ready` and until that resolves this is just a
           paragraph of fully readable copy, which is exactly what must not
           be on screen while the loading panel leaves. */
        gsap.set(line.current, { visibility: 'inherit' });

        /* Timed off `gsap.globalTimeline`, not the wall clock. The letters'
           entrance runs on that timeline and the Loader PAUSES it while its
           panel is up — so a wall-clock delay would fire the sentence into a
           wordmark that had not started arriving yet. Reading the same clock
           the entrance is on keeps the two in step however long the loader
           holds, and `max(0, …)` covers a late `fonts.ready`. */
        const at = startAt;
        const n = Math.max(1, chars.length - 1);
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          duration: RUN * (1 - SPREAD),
          ease: 'power3.out',
          stagger: (RUN * SPREAD) / n,
          delay: Math.max(0, at - gsap.globalTimeline.time()),
        });
      });

      /* `autoSplit` is off deliberately: re-splitting would replay the reveal
         on every resize — the same trap `RevealText` fell into. */
      return () => split?.revert();
    },
    { scope: line, dependencies: [startAt] },
  );

  return (
    <Tag
      ref={line as React.RefObject<HTMLParagraphElement & HTMLHeadingElement>}
      data-base-text={Tag === 'p' ? true : undefined}
      className={className}
      style={{ visibility: 'hidden', ...style }}
    >
      {children}
    </Tag>
  );
}
