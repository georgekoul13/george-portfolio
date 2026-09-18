'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Hero from './Hero';
import { ENTRANCE_END } from './heroData';

gsap.registerPlugin(SplitText);

/**
 * Hero — Figma 230:14543.
 *
 * Rebuilt 2026-09-05. The band used to be a 1320 × 582 frame with everything
 * absolutely placed inside it: the wordmark hard left, the subtitle off in
 * the top-right corner, a LEARN MORE button at the bottom.
 *
 * It is the wordmark and the sentence under it, centred — 230:16015, which
 * draws exactly that and nothing else.
 *
 * What went was the DECORATION around the sentence: the `{ }` braces and the
 * mouse cursor hanging off their right end. George: *"let's remove the
 * professional over-thinker here and do just a typography revealing."* Read
 * once as removing the sentence, which was wrong — the frame he linked keeps
 * the words and drops the ornament, and "just a typography revealing" is the
 * treatment they get instead: 16/24, centred on a 336 measure, arriving line
 * by line from behind a mask.
 *
 * — and the button is gone. George: *"what you have is wrong like i removed
 * the button."* The "Scroll now" cue went the same way on 2026-09-05, at
 * George's request: the panel that slides up over the hero is the invitation
 * to scroll, so labelling it was saying twice what the motion already says.
 *
 * Measured off the frame at a 0.3139 render scale, which the wordmark itself
 * confirms: GEORGE comes out 726 design px against a known 722.903, and
 * KOULOURIS 968 against 969.529. On that scale both words sit at exactly the
 * centre of the 1318 wordmark box — GEORGE at 297.5, KOULOURIS at 174.2 —
 * and the gaps below are 96 and 24.
 *
 * It is a flex column now rather than an absolute frame. The design is a
 * centred stack, so laying it out as one costs nothing and it survives a
 * phone, which the fixed frame did not.
 *
 * ── it is no longer the screen ────────────────────────────────────────
 * 255:7046 makes this the LEFT COLUMN of a base screen — wordmark over a
 * 32/40 line, hard left, with the drawing beside it on cream. So this
 * component is now just that column, and `BaseScreen` owns the screen: the
 * background, the height, the gutters and the drawing. Everything it still
 * does — the letters arriving, the O swapping, the sentence unmasking line
 * by line on load — is unchanged, because George's *"everything else will
 * stay the same"* covers the motion as much as the parts.
 */


export default function HeroSection() {
  const root = useRef<HTMLDivElement>(null);
  const subtitle = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      /* The wordmark parks and plays its own letters in `Hero`, which React
         runs first because it is a child. Only the sentence is left. */
      let split: SplitText | undefined;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(root.current, { autoAlpha: 1 });
        return;
      }

      /* Held invisible until the split has parked its lines. Splitting waits
         on `document.fonts.ready`, which can resolve at almost exactly the
         moment the loading panel leaves — and an unsplit paragraph is just
         fully readable copy, which is what must not be on screen first. */
      gsap.set(subtitle.current, { autoAlpha: 0 });

      document.fonts.ready.then(() => {
        if (!subtitle.current) return;
        split = SplitText.create(subtitle.current, { type: 'lines', mask: 'lines' });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set(subtitle.current, { autoAlpha: 1 });

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

      /* `autoSplit` is off deliberately: the paragraph has a fixed measure so
         it cannot rewrap, and re-splitting would replay the reveal on every
         resize. */

      /* Everything inside is parked now — the letters by `Hero`'s own effect
         and the sentence by the set above — so the frame can be uncovered. */
      gsap.set(root.current, { autoAlpha: 1 });

      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <div className="w-full">
      <div
        ref={root}
        data-hero-frame
        className="flex w-full flex-col items-start"
        /* Hidden in the SERVER's markup, and uncovered only once every part
           inside has been parked — see the effect above. Parking happens at
           hydration, which lands well after the loading panel starts to
           leave, so without this the panel slides away from a hero that is
           already fully drawn and then snaps out to animate in. */
        style={{ visibility: 'hidden' }}
      >
        {/* ── the wordmark ─────────────────────────────────────────────── */}
        <Hero />

        {/* ── the sentence ─────────────────────────────────────────────── */}
        <p
          ref={subtitle}
          data-hero-subtitle
          style={{
            /* The design's 96 is measured to the INK. Every letter is
               exported in a 282-tall em box whose cap does not start until
               about y=70, so the wordmark's own box runs ~72px past the
               bottom of the letters and a plain 96 margin reads as 168.
               72/1318 of the wordmark's width takes that back, and a
               percentage margin resolves against the container's width, so
               it stays correct at every size. */
            marginTop: 'calc(48px - 5.463%)',
            /* 32/40 at 1440 now (255:7046) rather than 16/24 — the line has a
               column of its own on the base screen instead of sitting under a
               centred wordmark. */
            font: 'var(--type-32-40-r)',
            color: 'var(--text-primary)',
            width: '100%',
          }}
        >
          A professional over-thinker with a love for product and visual design
        </p>
      </div>
    </div>
  );
}
