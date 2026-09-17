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
