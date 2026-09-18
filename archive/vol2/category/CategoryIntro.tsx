'use client';

import { useRef } from 'react';
import RevealText from '../RevealText';
import BackLink from '../BackLink';
import CursorTrail from '../CursorTrail';

/**
 * The top of a category page — Figma node 147:11360.
 *
 * A back link and a headline. Figma sets three images inline among the words;
 * they are gone, and the line now gets the home page's intro reveal instead —
 * the word-by-word wipe, with the category's three subject words arriving as
 * beats. No hover images: those stay the intro paragraph's alone.
 *
 * The back link is pinned to the top-left corner of the band rather than
 * stacked above the headline, which leaves the headline free to sit in the
 * middle of the band vertically. It is left-aligned, like every other big
 * display line on the site.
 *
 * Two things differ from the home page's use of the reveal. The opening word
 * is already written when it starts, so the sentence reads as continuing
 * rather than beginning. And it plays on load rather than on scroll, because
 * this band is sized to hold the first viewport on its own — there is no
 * scroll to spend on it until the reveal has finished, which is what puts the
 * next section behind it.
 *
 * Sweeping the cursor through throws illustrations out behind it, the same
 * trail the copyright band uses.
 */

/** the page gutter — see `--gutter` in tokens.css */
const PAD_X = 'var(--gutter)';
const PAD_Y = 124;

export default function CategoryIntro({
  headline,
  beats,
}: {
  headline: string;
  beats: string[];
}) {
  const root = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={root}
      className="relative flex w-full flex-col items-start justify-center"
      style={{
        minHeight: 'calc(100svh - var(--header-h))',
        padding: `${PAD_Y}px ${PAD_X}`,
      }}
    >
      <BackLink className="absolute" style={{ left: PAD_X, top: PAD_Y }} />

      <RevealText className="w-full" beats={beats} lead={1} play="load">
        {headline}
      </RevealText>

      <CursorTrail stage={root} />
    </div>
  );
}
