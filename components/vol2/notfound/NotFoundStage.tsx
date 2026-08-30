'use client';

import { useRef } from 'react';
import CursorTrail from '../CursorTrail';

/**
 * The 404's one band — Figma 147:15098.
 *
 * A client component only because `CursorTrail` needs a ref to the element
 * it should live inside; the page around it stays a server component.
 */
export default function NotFoundStage() {
  const root = useRef<HTMLElement>(null);

  return (
    <section
      ref={root}
      /* No gutter. The numeral is meant to run past the frame edge — Figma
         places it at x=-82 in a 1440, outside the container's own 60 of
         padding — so a gutter here would clip it 60 short on each side and
         it would read as a mistake rather than a bleed. Nothing else lives
         in this band to need one. */
      className="relative flex w-full items-center justify-center"
      style={{
        height: 'var(--nf-stage-h)',
        paddingBlock: 'var(--nf-stage-pad)',
      }}
    >
      {/* Throws illustrations out behind the pointer — the same component
          the copyright band and the category intros use, scoped to this
          section so they only fly while you are over the numeral.

          NOT inside the clipping wrapper below: they fall to `120vh`, and
          clipped at the band's edge they would vanish a few pixels in. */}
      <CursorTrail stage={root} />

      {/* The clip is on THIS, not the section. The numeral is wider than the
          frame on purpose — 1604 in a 1440 — so something has to trim it or
          the page gains a horizontal scrollbar; putting that on the section
          would cut the trail off too. */}
      {/* `flex justify-center`, NOT `text-align: center`. Text alignment only
          distributes POSITIVE free space, so a line wider than its box is
          left where it is and the whole overhang lands on the right — this
          read 0 / +165 instead of the design's -82 / +82. Flex centring
          does go negative, which is what makes the bleed symmetric. */}
      <div className="pointer-events-none flex w-full justify-center overflow-hidden">
        {/* 800px Medium at 1440, bleeding 82 off each side. Written as a
            share of the viewport so the same overhang holds at every width,
            and cap-trimmed like the rest of the display type — the frame
            reports it as 560 tall against its 800, which is the 0.7 cap
            band. */}
        <p
          className="shrink-0 whitespace-nowrap"
          style={{
            fontWeight: 500,
            fontSize: 'var(--nf-numerals)',
            lineHeight: 1,
            marginTop: '-0.1585em',
            marginBottom: '-0.1415em',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-secondary)',
          }}
        >
          404
        </p>
      </div>
    </section>
  );
}
