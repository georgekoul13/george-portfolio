/**
 * How a panel tells the block inside it how far through its HOLD the reader
 * has scrolled.
 *
 * George: *"let's not scroll down the viewport until the sentence … and force
 * keep the user here for one scroll"*, and the same for the chips. So the
 * panel stops carrying its content upward, parks the block where it can be
 * read, and spends a screen's worth of scroll going nowhere while the block
 * reveals itself.
 *
 * That breaks the obvious way of driving the reveal. `scrubToPosition` maps
 * the block's own position on screen to a progress — but during a hold the
 * block does not move at all, so its position is constant and the progress
 * would freeze at whatever it was. The scroll is advancing; the element just
 * is not. So the progress has to come from the thing that knows about the
 * scroll, which is the panel's own timeline.
 *
 * A registry rather than a prop or a callback, because of WHEN each side is
 * ready. `PanelStack` builds its timeline in an effect; `RevealText` builds
 * its own behind `document.fonts.ready`, which resolves long afterwards.
 * Neither can hand the other anything at construction time. Writing to a
 * shared map lets the panel start publishing before anyone reads, and lets a
 * block attach whenever it happens to be ready.
 */
const progress = new WeakMap<Element, number>();

export function setHoldProgress(el: Element, v: number): void {
  progress.set(el, v);
}

export function getHoldProgress(el: Element): number {
  return progress.get(el) ?? 0;
}
