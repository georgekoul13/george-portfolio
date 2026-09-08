'use client';

import { useRef } from 'react';
import CursorTrail from './CursorTrail';
import RollingText from './RollingText';

/**
 * The closing band — Figma node 100:3553.
 *
 * The design is one centred line of 20/20 Montserrat, uppercase, in
 * `--text-secondary`, with 32px of padding. Two things are built on top of
 * it: the line rolls on a drum — see `RollingText` — and sweeping the cursor
 * through the band throws illustrations out behind it.
 *
 * The band is given real height because both of those need somewhere to
 * happen: at Figma's 84px it would be a strip too thin to sweep a cursor
 * across, and the drum's own travel wouldn't fit.
 */

/**
 * Only the first line is Figma's. The rest are placeholder copy — the drum
 * needs somewhere to roll to, and one line alone reads as a glitch rather
 * than a mechanism.
 */
const LINES = [
  'COPYRIGHT @ GEORGE KOULOURIS',
  'MADE IN GREECE, MOSTLY AT NIGHT',
  'NO AI WERE HARMED',
  'THANKS FOR SCROLLING ALL THE WAY',
];

/* The drum's perspective is derived from this, and it only has to be in the
   right neighbourhood — the size that actually renders comes from
   `--copyright-size`, which steps down so the longest line fits a phone. */
const FONT = 20;

export default function CopyrightSection() {
  const root = useRef<HTMLElement>(null);

  return (
    <section
      ref={root}
      className="relative flex w-full flex-col items-center justify-center px-[var(--gutter)] py-8"
      style={{ minHeight: '60svh' }}
    >
      <RollingText
        lines={LINES}
        font="400 var(--copyright-size)/var(--copyright-size) var(--font-sans)"
        size={FONT}
      />

      <CursorTrail stage={root} />
    </section>
  );
}
