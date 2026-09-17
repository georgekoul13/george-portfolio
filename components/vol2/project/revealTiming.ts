/**
 * When a reveal starts, and how long it takes — different on a phone.
 *
 * George, with the diagnostic panel open on his Pixel: *"the hero image has
 * animation and the first image has some movement but from there and down
 * everything is revealed before the viewport."*
 *
 * His readings ruled out every earlier guess: `reduced: false`, the gate
 * released, 35 triggers existed and fired in order. Nothing was broken. The
 * numbers were simply wrong for a touch screen.
 *
 * ── the arithmetic ────────────────────────────────────────────────────
 * A reveal starts when the element's top is `at` of the way down the
 * viewport. At 0.88 that is 88% —
 * On a 760px phone that is 669px down, so **91px of a 370px still is on
 * screen** when a ONE SECOND animation begins. A flick carries the page
 * 1200-1800px in well under that second, so the reveal finishes roughly a
 * thousand pixels above where it started — off screen. By the time the
 * picture is in front of the reader it is long since revealed.
 *
 * On a desktop the same numbers are fine, because a wheel moves a fraction
 * as far in the same time. That is the whole of the difference between the
 * two devices, and why three fixes reasoned from a laptop all missed it.
 *
 * ── so, on a narrow screen ────────────────────────────────────────────
 * Start LATER, so the element is properly in view rather than peeking over
 * the bottom edge, and run FASTER, so it finishes before momentum can carry
 * it away. `top 72%` puts about 210px of a still on screen — more than half
 * of it — before anything moves.
 *
 * Read once per component rather than on every element: the breakpoint does
 * not change under a reader's thumb, and `useGSAP` rebuilds on the resize
 * that would matter.
 */
export interface RevealTiming {
  /** where the element's top should be, as a fraction of the viewport */
  at: number;
  /** the clip uncover, and the text rise */
  duration: number;
  /** the inner picture's drift out of its scale */
  inner: number;
  /** between two things that arrive together — a row, or a chip and its line */
  stagger: number;
}

export function revealTiming(): RevealTiming {
  const narrow =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

  return narrow
    ? { at: 0.72, duration: 0.55, inner: 0.7, stagger: 0.05 }
    : { at: 0.88, duration: 1, inner: 1.2, stagger: 0.08 };
}
