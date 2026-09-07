'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Illustrations thrown out behind the cursor — GSAP's "cursor trail" demo,
 * its numbers and its timeline unchanged:
 *
 *     gap = 100                       // travel before the next one is thrown
 *     tl.from(shape, { opacity: 0, scale: 0, ease: "elastic.out(1,0.3)" })
 *       .to(shape, { rotation: "random([-360, 360])" }, "<")
 *       .to(shape, { y: "120vh", ease: "back.in(.4)", duration: 1 }, 0)
 *
 * Two departures from it. The demo reaches its timing through
 * `gsap.defaults({ duration: 1 })`, which is global and would quietly re-time
 * every other animation on the site, so durations are passed per tween. And
 * it listens on `window`, whereas this is scoped to whichever element is
 * handed to it — otherwise the illustrations would follow the cursor across
 * the whole page rather than living in one band.
 *
 * Used by the copyright band on the home page and the intro on the category
 * pages.
 *
 * ON TOUCH there is no cursor to trail, so a tap throws a burst instead —
 * the same illustrations on the same timeline, fanned out around the point
 * that was touched. Only the starting positions differ; every one still
 * pops in on the elastic, spins a random full turn and drops off the bottom,
 * so the two behave like one idea rather than two. Dragging a finger keeps
 * throwing, which is as close to the trail as touch gets.
 */

/** how far the cursor travels before the next one is thrown */
const GAP = 100;
const POOL = 20;

/** a tap throws this many at once… */
const BURST = 6;
/** …scattered this far from the point touched, so they don't stack */
const BURST_SPREAD = 70;
/** and this far apart in time, so the burst blooms rather than appearing */
const BURST_STAGGER = 0.05;

const ILLUSTRATIONS = [
  'pokeball', 'gameboy', 'lollypop', 'globe', 'CD', 'flower',
  'sun', 'time', 'website', 'pac man', 'video', 'Phone',
];

export default function CursorTrail({ stage }: { stage: RefObject<HTMLElement> }) {
  const root = useRef<HTMLSpanElement>(null);

  /**
   * The pool lives on `<body>`, not where this component sits in the tree.
   *
   * The illustrations are `position: fixed`, thrown to the cursor's own
   * `clientX/clientY`. That only means "the viewport" while no ancestor has
   * a transform — and every one of these now has one: the copyright band is
   * inside the home page's last panel, and a panel with more content than
   * the window carries that content on a `translateY`. A transformed
   * ancestor becomes the containing block for `fixed`, so the coordinates
   * were being read against a box scrolled thousands of px up the page.
   *
   * That is both of the things George saw: nothing appearing under the
   * cursor in the band, and a scatter of stickers sitting over the featured
   * projects, which is simply where those throws landed.
   *
   * A portal puts them back in the viewport's coordinate system without
   * moving the listeners, which stay on the section so the trail still only
   * lives in its own band.
   */
  const [pool, setPool] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const host = document.createElement('span');
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);
    setPool(host);
    return () => host.remove();
  }, []);

  useGSAP(
    () => {
      const section = stage.current;
      if (!section || !pool) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      /* Scoped to this component's own pool. Unscoped, `toArray` searches
         the whole document, so two bands on one page would throw each
         other's illustrations. */
      const flair = gsap.utils.toArray<HTMLElement>('[data-flair]', pool);
      const wrap = gsap.utils.wrap(0, flair.length);
      let index = 0;
      let inside = false;
      let mouse = { x: 0, y: 0 };
      let last = mouse;

      const throwOne = (x: number, y: number, delay = 0) => {
        const img = flair[wrap(index)];
        gsap.killTweensOf(img);
        gsap.set(img, { clearProps: 'all' });
        gsap.set(img, { opacity: 1, left: x, top: y, xPercent: -50, yPercent: -50 });

        gsap
          .timeline({ delay })
          .from(img, { opacity: 0, scale: 0, duration: 1, ease: 'elastic.out(1,0.3)' })
          .to(img, { rotation: 'random([-360, 360])', duration: 1 }, '<')
          .to(img, { y: '120vh', ease: 'back.in(.4)', duration: 1 }, 0);

        index++;
      };

      /* The touch answer to the trail. Fanned on a circle rather than
         scattered at random, so the burst reads as coming *from* the point
         touched; the radius is jittered so the ring doesn't show. */
      const burst = (x: number, y: number) => {
        const turn = Math.random() * Math.PI * 2;
        for (let i = 0; i < BURST; i++) {
          const angle = turn + (i / BURST) * Math.PI * 2;
          const reach = BURST_SPREAD * (0.55 + Math.random() * 0.65);
          throwOne(x + Math.cos(angle) * reach, y + Math.sin(angle) * reach, i * BURST_STAGGER);
        }
      };

      const trail = () => {
        if (!inside) return;
        if (Math.hypot(last.x - mouse.x, last.y - mouse.y) > GAP) {
          throwOne(mouse.x, mouse.y);
          last = mouse;
        }
      };

      const onMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
      const onEnter = (e: MouseEvent) => {
        mouse = { x: e.clientX, y: e.clientY };
        last = mouse;
        inside = true;
      };
      const onLeave = () => { inside = false; };

      /* A touch device fires mouse events too, right after the touch, which
         would throw the burst and then a stray single. Tracked so the mouse
         handlers stand down once a finger has been used. */
      let touched = false;

      const onTouch = (e: TouchEvent) => {
        touched = true;
        const t = e.touches[0];
        if (t) burst(t.clientX, t.clientY);
      };

      /* Dragging keeps throwing — the same GAP rule as the cursor, so a slow
         finger leaves a trail and a flick leaves a scatter. */
      const onTouchMove = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        if (Math.hypot(last.x - t.clientX, last.y - t.clientY) > GAP) {
          throwOne(t.clientX, t.clientY);
          last = { x: t.clientX, y: t.clientY };
        }
      };

      // named, so the same references can be removed again below
      const guardedMove = (e: Event) => { if (!touched) onMove(e as MouseEvent); };
      const guardedEnter = (e: Event) => { if (!touched) onEnter(e as MouseEvent); };

      section.addEventListener('mousemove', guardedMove);
      section.addEventListener('mouseenter', guardedEnter);
      section.addEventListener('mouseleave', onLeave);
      // passive: the burst is decoration and must never block a scroll
      section.addEventListener('touchstart', onTouch, { passive: true });
      section.addEventListener('touchmove', onTouchMove, { passive: true });
      gsap.ticker.add(trail);

      return () => {
        gsap.ticker.remove(trail);
        section.removeEventListener('mousemove', guardedMove);
        section.removeEventListener('mouseenter', guardedEnter);
        section.removeEventListener('mouseleave', onLeave);
        section.removeEventListener('touchstart', onTouch);
        section.removeEventListener('touchmove', onTouchMove);
      };
    },
    { scope: root, dependencies: [stage, pool] },
  );

  return (
    /* Fixed and inert — thrown to wherever the cursor is, then dropped past
       the bottom of the screen.

       Size and resting opacity are classes, not inline styles, because each
       throw begins with the demo's `clearProps: "all"` — which wipes inline
       styles and would otherwise leave every illustration at its natural size
       and fully opaque. In the demo these live in a `.flair` rule for exactly
       this reason. */
    <span ref={root} aria-hidden="true">
      {pool &&
        createPortal(
          Array.from({ length: POOL }).map((_, i) => (
            <img
              key={i}
              data-flair
              src={encodeURI(`/images/vol2/stickers/${ILLUSTRATIONS[i % ILLUSTRATIONS.length]}.svg`)}
              alt=""
              className="pointer-events-none fixed z-10 w-[50px] max-w-none opacity-0"
            />
          )),
          pool,
        )}
    </span>
  );
}
