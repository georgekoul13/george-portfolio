/**
 * Run something the first time an element is really on screen.
 *
 * ── why not ScrollTrigger ─────────────────────────────────────────────
 * Because on a project page it fires about two screens early, and George
 * found it: *"from there and down everything is revealed before the
 * viewport."*
 *
 * ScrollTrigger positions a trigger from the element's place in the DOCUMENT.
 * These reveals live inside `PanelStack`, whose panels hold their content
 * still while the document keeps scrolling — so document position and the
 * position a reader actually sees diverge. Measured on Mood at 411x760, with
 * the trigger's own `start` and the element's own rect:
 *
 *     ScrollTrigger thinks the top is 569px down (its `top 72%`)
 *     the picture is really 2029px down — 1460px BELOW the fold
 *
 * and that 1460 was identical for the first, fifth and eleventh still, and
 * unchanged after creeping to the position and settling for 1.5s. It is a
 * standing offset, not a lag. `scrubToPosition` exists in this codebase for
 * the same reason, on the same panels.
 *
 * An IntersectionObserver has no such problem: it reports where the element
 * IS, whatever transform, pin or panel put it there. It is also what the
 * video loops already use, successfully, on these same pages.
 *
 * ── the margin is the old trigger point, exactly ──────────────────────
 * `start: 'top 72%'` means "when the element's top reaches 72% of the way
 * down the viewport". Shrinking the observer's bottom edge by the remaining
 * 28% says the same thing, and says it about the real position.
 */
export function onEnterView(
  el: Element,
  run: () => void,
  /** where the top of the element should be, as a fraction of the viewport */
  at: number,
): () => void {
  /* ── ALREADY ON SCREEN COUNTS AS ARRIVED ──────────────────────────────
     George, on the project pages: *"the details under the title are not all
     visible unless you scroll to the next section and scroll back up."*

     The trigger line is 88% of the way down the viewport on a laptop, and
     the opening screen has content BELOW it: the picture, the title, and
     then the Client / Role / Deliverables row sitting in the last eighth.
     The title fires because its top clears the line; the row underneath is
     parked at `autoAlpha: 0`, in full view, with nothing coming to release
     it. A reader who scrolls on finds it revealed on the way past, which is
     why it is there when they come back up.

     So a line the reader has to scroll TOWARDS is the wrong question to ask
     about something they are already looking at. Anything with any part of
     itself in the viewport when the reveal is armed plays at once — the
     entrance still runs, it simply does not wait. Everything below the fold
     is unchanged and still waits for its own top.

     This is armed once per element, at mount, so the test is a one-off read
     of the opening screen rather than a rule that weakens the reveal.

     The same trap took `clamp()` off the old ScrollTrigger start for the
     same reason: on-screen content, parked, with no scroll to free it. */
  if (el.getBoundingClientRect().top < window.innerHeight) {
    run();
    return () => {};
  }

  const bottom = Math.round((1 - at) * 100);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.disconnect();
        run();
      }
    },
    { rootMargin: `0px 0px -${bottom}% 0px` },
  );
  io.observe(el);
  return () => io.disconnect();
}
