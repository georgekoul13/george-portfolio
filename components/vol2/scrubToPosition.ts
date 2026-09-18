import gsap from 'gsap';
import { getHoldProgress } from './holdProgress';

/**
 * Drives a paused timeline from an element's LIVE position in the viewport,
 * so its animation is scrubbed by the scroll rather than played once.
 *
 * ── why not a ScrollTrigger ───────────────────────────────────────────
 * These blocks live inside a PINNED panel whose content is carried upward by
 * a scrubbed tween (see `PanelStack`). ScrollTrigger resolves a trigger's
 * start and end from its position in the DOCUMENT, cached at refresh — but a
 * pinned panel's content does not move through the document at all, it is
 * translated by a tween. So a trigger keyed to the paragraph's own position
 * never advances, which is exactly why these reveals were switched to a
 * one-shot play in the first place.
 *
 * Reading the rect every frame sidesteps the whole problem: it is the real
 * on-screen position, whatever produced it — pin, transform, overscroll or
 * ordinary flow.
 *
 * ── what it buys ──────────────────────────────────────────────────────
 * George, on the intro sentence: *"let's make the revealing of this text
 * happen word by word with scroll — like we had in the previous version of
 * the Vol2, not automatically after one scroll."* And: *"in the previous
 * vol2 we have a removing animation on scroll up — let's add this too."*
 *
 * Both are the same thing. A progress that tracks position runs backwards
 * when you scroll back up, so the words un-write themselves and the chips
 * drop away without a separate exit animation existing at all.
 *
 * `from` and `to` are fractions of the viewport height, measured against the
 * element's TOP edge: progress 0 when the top sits at `from`, 1 at `to`.
 * Expressing them against the viewport rather than in pixels is what keeps
 * the reveal finishing in the same place on a laptop and a tall monitor.
 */
export interface ScrubRange {
  from: number;
  to: number;
  /**
   * Share of the remaining distance closed each frame — the lag that makes a
   * flick of the wheel resolve smoothly instead of snapping. Roughly
   * equivalent to ScrollTrigger's `scrub: 0.8`, which is what the previous
   * build used.
   */
  smooth?: number;
}

export function scrubToPosition(
  el: HTMLElement,
  tl: gsap.core.Timeline,
  { from, to, smooth = 0.12 }: ScrubRange,
): () => void {
  const tick = () => {
    const vh = window.innerHeight;
    const a = from * vh;
    const b = to * vh;
    if (a === b) return;

    const want = gsap.utils.clamp(0, 1, (a - el.getBoundingClientRect().top) / (a - b));
    const cur = tl.progress();

    /* Snap once the gap is imperceptible. Without it an exponential approach
       never actually arrives, and a reveal that stops at 0.998 leaves the
       last word a hair short of written for as long as you look at it. */
    tl.progress(Math.abs(want - cur) < 0.0015 ? want : cur + (want - cur) * smooth);
  };

  /* `gsap.ticker`, not a scroll listener. The element moves while the panel
     is being scrubbed, and it keeps moving through momentum and smooth-scroll
     after the last scroll event has fired — a listener would leave the reveal
     stranded mid-word. The ticker also runs while `gsap.globalTimeline` is
     paused, which it is during the loader. */
  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}

/**
 * The same scrub, driven by the enclosing panel's HOLD instead of by the
 * element's position on screen.
 *
 * Use this for anything inside a `[data-hold]`: during the hold the block is
 * parked and its position no longer changes, so `scrubToPosition` would
 * freeze — the scroll advances but the rect does not. `PanelStack` publishes
 * the hold's progress instead; see `holdProgress`.
 *
 * The smoothing is the same lag, and it is what makes the reveal survive a
 * flick of the wheel rather than snapping to the end of it.
 */
export function scrubToHold(
  el: Element,
  tl: gsap.core.Timeline,
  smooth = 0.12,
): () => void {
  const tick = () => {
    const want = getHoldProgress(el);
    const cur = tl.progress();
    tl.progress(Math.abs(want - cur) < 0.0015 ? want : cur + (want - cur) * smooth);
  };
  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}
