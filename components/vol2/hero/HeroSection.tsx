'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Hero from './Hero';
import CtaButton from './CtaButton';
import { ENTRANCE_END } from './heroData';

gsap.registerPlugin(SplitText);

/**
 * Hero section — geometry from Figma node 100:3483.
 *
 * Section is 1440 × 953; the content frame sits at (60, 247) and is
 * 1320 × 582. Everything inside is positioned as a percentage of that
 * frame, so the composition holds its proportions as the page scales.
 *
 * The section animates in two beats. The wordmark arrives first — Hero owns
 * the letters — and once they've settled the cursor flies in, presses the
 * braces into place and pulls them apart to reveal the subtitle, then the CTA
 * follows. Everything after the first beat is offset from ENTRANCE_END so
 * retiming a letter can't desynchronise it.
 */

const FRAME_W = 1320;
const FRAME_H = 582;
/**
 * Figma section 100:3483 is 1440 × 953: header 0–97, then a gap before the
 * content frame, and 124px below it.
 *
 * Figma's gap is 150, which put 262px between the header and the *visible*
 * top of GEORGE — because two things sit between the frame and the ink: the
 * name box starts 42px into the frame, and every letterform is exported as a
 * 282-tall em box whose cap doesn't begin until y≈70. George asked for 200 to
 * the ink, so the gap absorbs both: 200 − 42 − 70 = 88.
 *
 * Only exact at 1440. The 42 and the 70 scale with the frame while this stays
 * fixed, so a narrower window reads tighter — same as it always did.
 */
const GAP_TOP = 88;
const GAP_BOTTOM = 124;
const pctW = (v: number) => `${(v / FRAME_W) * 100}%`;
const pctH = (v: number) => `${(v / FRAME_H) * 100}%`;

/**
 * The cursor is the only loose element left in the hero — the star over
 * GEORGE and the heart beside KOULOURIS were removed 2026-08-20. It is
 * choreographed on its own anyway: it's what opens the braces.
 */
const CURSOR = { x: 1195, y: 152, w: 84.853 };

/** half the subtitle's width plus the flex gap: how far each brace travels */
const BRACE_TRAVEL = 176;

export default function HeroSection() {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLImageElement>(null);
  const braceL = useRef<HTMLSpanElement>(null);
  const braceR = useRef<HTMLSpanElement>(null);
  const subtitle = useRef<HTMLParagraphElement>(null);
  const cta = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // nothing will animate, so show it exactly as rendered
        gsap.set(root.current, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline();

      /* ── The cursor arrives once the letters have settled, then opens the
            braces ─────────────────────────────────────────────────────── */
      const land = ENTRANCE_END;

      /* Every start state below is SET, never left to `from()`.
         A `from` writes its start values only when its parent timeline
         renders, and the Loader pauses `gsap.globalTimeline` during its own
         render — before this effect ever runs. So the cursor, the braces and
         the CTA were all sitting at their resting positions from first paint
         and then "arrived" on top of themselves. Same defect as the wordmark
         and the subtitle; same fix. */
      gsap.set(cursor.current, { x: 300, y: 120, rotate: 28, scale: 0.5, autoAlpha: 0 });
      tl.to(
        cursor.current,
        { x: 0, y: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 0.85, ease: 'power3.out' },
        land,
      )
        // a small press, as if it clicked the braces apart. Starts after the
        // arrival lands so the two aren't fighting over `scale`.
        .to(cursor.current, { scale: 0.86, duration: 0.11, ease: 'power2.in' }, land + 0.85)
        .to(cursor.current, { scale: 1, duration: 0.5, ease: 'back.out(2.6)' });

      const open = land + 0.9;

      /* The braces were the one thing in the hero that was already on screen
         before anything happened — every letter, the cursor, the subtitle and
         the CTA arrive, and they just sat there waiting to be pulled apart.
         They now arrive too, popping in under the cursor as it presses, so
         the press reads as the thing that put them there. Timed to finish on
         the press rather than after it: they have to exist before they can be
         opened.

         Each brace is three nested elements because each transform needs an
         owner of its own: the outer span takes the split, the inner span
         takes this pop, and the image keeps the mirror on the right-hand one.
         Two tweens sharing one element's transform is what made the braces
         snap open, jump back 47px and open again; putting the pop on the
         image instead would have folded away that mirror. */
      const bracePops = [
        braceL.current?.firstElementChild,
        braceR.current?.firstElementChild,
      ];
      gsap.set(bracePops, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
      tl.to(
        bracePops,
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' },
        land + 0.62,
      );

      gsap.set(braceL.current, { x: BRACE_TRAVEL });
      gsap.set(braceR.current, { x: -BRACE_TRAVEL });
      gsap.set(cta.current, { y: 28, autoAlpha: 0 });

      tl.to(braceL.current, { x: 0, duration: 0.9, ease: 'power3.out' }, open)
        .to(braceR.current, { x: 0, duration: 0.9, ease: 'power3.out' }, open)
        .to(cta.current, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, open + 0.3);

      /* The subtitle reveals line by line from behind a mask — the same
         technique as the scroll reveals elsewhere on the page. Splitting has
         to wait for the real font, so the tween is added to the running
         timeline afterwards and offset by however much of it has already
         played. `autoSplit` is off deliberately: the paragraph has a fixed
         width, so it can't rewrap, and re-splitting would replay the reveal
         on every resize. */
      let split: SplitText | undefined;

      /* Held invisible until the split has parked its lines. Splitting waits
         on `document.fonts.ready`, which can resolve at almost exactly the
         moment the loading panel leaves — and an unsplit paragraph is just
         fully readable copy. Without this the sentence is briefly on screen
         before it reveals itself. */
      gsap.set(subtitle.current, { autoAlpha: 0 });

      document.fonts.ready.then(() => {
        if (!subtitle.current) return;
        split = SplitText.create(subtitle.current, { type: 'lines', mask: 'lines' });
        /* Parked first, then tweened back — never `from()`. A `from` writes
           its start value only when the parent timeline renders, and the
           Loader has the global timeline held while this is built, so the
           lines were never pushed below their masks: the sentence sat fully
           readable from first paint and then "revealed" itself on top of
           its own visible copy. */
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set(subtitle.current, { autoAlpha: 1 });
        gsap.to(split.lines, {
          yPercent: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          delay: Math.max(0, open + 0.1 - tl.time()),
        });
      });

      /* Everything inside is now parked — the letters by Hero's own effect,
         which React runs before this one because it is a child, and the
         cursor, braces, CTA and subtitle by the sets above. Safe to uncover. */
      gsap.set(root.current, { autoAlpha: 1 });

      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <section className="relative w-full" style={{ background: 'var(--bg-page)' }}>
      <div
        className="mx-auto w-full max-w-[1440px] px-[var(--gutter)]"
        style={{ paddingTop: GAP_TOP, paddingBottom: GAP_BOTTOM }}
      >
        <div
          ref={root}
          data-hero-frame
          className="relative w-full"
          /* Hidden in the SERVER's markup, and uncovered only once every
             part inside has been parked — see the effect above.

             Parking happens at React hydration, which lands around 2.4s in
             dev; the loading panel starts leaving at about 1.8s. So for the
             whole of that exit the panel was sliding away from a hero that
             was still sitting there fully drawn, and only then did it snap
             out and animate in. No amount of correcting the tweens fixes
             that — the markup itself has to start hidden, because until
             hydration there is no JavaScript to hide it. */
          style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}`, visibility: 'hidden' }}
        >
          {/* Name — occupies its own box at (0, 42), 1318 × 462 */}
          <div
            data-hero-part
            className="absolute"
            style={{ left: 0, top: pctH(42), width: pctW(1318) }}
          >
            <Hero />
          </div>

          <img
            ref={cursor}
            data-hero-cursor
            src="/images/vol2/decor/cursor.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute max-w-none"
            style={{ left: pctW(CURSOR.x), top: pctH(CURSOR.y), width: pctW(CURSOR.w) }}
          />

          {/* Subtitle — braces are mirrored halves of one asset */}
          <div
            data-hero-part
            data-hero-subtitle
            className="absolute flex items-center gap-2"
            style={{
              left: pctW(936),
              top: pctH(112),
              width: pctW(384),
              // braces are currentColor, so set it once for both
              color: 'var(--text-primary)',
            }}
          >
            {/* the spans carry the motion so GSAP never has to take over the
                mirrored transform on the right-hand brace — outer span splits,
                inner span pops */}
            <span ref={braceL} className="block shrink-0">
              <span className="block">
                <img
                  src="/images/vol2/ui/brace.svg"
                  alt=""
                  aria-hidden="true"
                  className="block" style={{ height: 'var(--brace-h)', width: 'var(--brace-w)' }}
                />
              </span>
            </span>
            <p
              ref={subtitle}
              className="shrink-0"
              style={{ font: 'var(--type-16-20-r)', color: 'var(--text-primary)', width: 336 }}
            >
              A professional over-thinker with a love for product and visual design
            </p>
            <span ref={braceR} className="block shrink-0">
              <span className="block">
                <img
                  src="/images/vol2/ui/brace.svg"
                  alt=""
                  aria-hidden="true"
                  className="block -scale-x-100" style={{ height: 'var(--brace-h)', width: 'var(--brace-w)' }}
                />
              </span>
            </span>
          </div>

          {/* CTA — positioned by percentage, but kept at its natural size so
              the label doesn't scale with the artwork. */}
          <div
            ref={cta}
            data-hero-part
            data-hero-cta
            className="absolute"
            style={{ left: 0, top: pctH(528) }}
          >
            <CtaButton />
          </div>
        </div>
      </div>
    </section>
  );
}
