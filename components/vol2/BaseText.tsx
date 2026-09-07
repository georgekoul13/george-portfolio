'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { ENTRANCE_END } from './hero/heroData';

gsap.registerPlugin(SplitText);

/**
 * The line under a base screen's title, unmasking line by line on load.
 *
 * Lifted out of `HeroSection` unchanged when 255:7046 split the base screen
 * into three separate boxes — title, drawing, line — so that a phone can put
 * the drawing between the first and the last. It has to be its own element
 * to be re-ordered, so the animation came with it.
 */
export default function BaseText({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const line = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = line.current;
      if (!el) return;
      let split: SplitText | undefined;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      /* Held invisible until the split has parked its lines. Splitting waits
         on `document.fonts.ready`, which can resolve at almost exactly the
         moment the loading panel leaves — and an unsplit paragraph is just
         fully readable copy, which is what must not be on screen first. */
      gsap.set(el, { autoAlpha: 0 });

      document.fonts.ready.then(() => {
        if (!line.current) return;
        split = SplitText.create(line.current, { type: 'lines', mask: 'lines' });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set(line.current, { autoAlpha: 1 });

        /* Timed off `gsap.globalTimeline`, not the wall clock. The letters'
           entrance runs on that timeline and the Loader PAUSES it while its
           panel is up — so a wall-clock delay would fire the sentence into a
           wordmark that had not started arriving yet. Reading the same clock
           the entrance is on keeps the two in step however long the loader
           holds, and `max(0, …)` covers a late `fonts.ready`. */
        const at = ENTRANCE_END + 0.15;
        gsap.to(split.lines, {
          yPercent: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          delay: Math.max(0, at - gsap.globalTimeline.time()),
        });
      });

      /* `autoSplit` is off deliberately: re-splitting would replay the reveal
         on every resize — the same trap `RevealText` fell into. */
      return () => split?.revert();
    },
    { scope: line },
  );

  return (
    <p ref={line} data-base-text style={style}>
      {children}
    </p>
  );
}
