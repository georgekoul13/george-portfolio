'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { scrubToPosition } from './scrubToPosition';

import './scrollDefaults';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * The categories — a self-running horizontal marquee of four cards.
 *
 * George: *"a 2-word title and below we will have 4 images that redirect on
 * the inner pages of the website — like the ones we used to have. So, no
 * rounded corners and on hover we need the hover we had. Here we need a
 * smooth automatic horizontal animation that when the user hovers on a card
 * the animation stops."*
 *
 * ── what changed ──────────────────────────────────────────────────────
 * This replaces the scroll-scrubbed strip (pen dydpJzY) that used to pin the
 * section and drag three gradient cards across it. Nothing here is driven by
 * scroll any more: the track runs on its own, forever, and the section holds
 * no pin at all — which also gives the page back the screen of scroll the pin
 * was eating.
 *
 * ── the loop ──────────────────────────────────────────────────────────
 * The four cards are rendered TWICE and the track is tweened to `-50%`, so
 * the moment the first set has left the frame the second is sitting exactly
 * where the first began and the tween can restart with nothing visibly
 * happening. That is the whole trick, and it is why the duplicate set is not
 * optional decoration: without it the loop has a seam.
 *
 * The copy is `aria-hidden` and its links are taken out of the tab order —
 * it is the same four destinations twice, and a screen reader or a keyboard
 * should meet each of them once.
 *
 * ── the hover ─────────────────────────────────────────────────────────
 * The one the v1 grid had: the card under the cursor comes up and everything
 * else drops back, so the hover reads as picking one out rather than as a
 * button lighting up. Rather than a hard `pause()`, the track's `timeScale`
 * is tweened to zero — a marquee that stops dead feels broken, and the
 * quarter-second of slowing is what makes it feel like it was your doing.
 */

const CATEGORIES = [
  {
    name: 'Product',
    href: '/product',
    img: '/images/projects/gaspar/gaspar-04.png',
  },
  {
    name: 'Graphic',
    href: '/graphic',
    img: '/images/projects/book/book-01.png',
  },
  {
    name: 'Creative',
    href: '/creative',
    img: '/images/projects/creatives/creative-01.png',
  },
  /* No About route exists yet, so this lands on Contact — the same
     substitution `MenuBar` makes, and for the same reason. Repoint it the day
     About has a design. */
  {
    name: 'About me',
    href: '/contact',
    img: '/images/vol2/id/george-portrait.png',
  },
];

const CAP_TRIM = {
  lineHeight: 1,
  marginTop: '-0.1585em',
  marginBottom: '-0.1415em',
} as const;

export default function CategoryStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const viewport = section.querySelector<HTMLElement>('[data-viewport]')!;
      const track = section.querySelector<HTMLElement>('[data-track]')!;
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', track);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cleanup: (() => void)[] = [];

      /* ── the headline ───────────────────────────────────────────────
         The same reveal the featured-projects line has — characters rising
         in a left-to-right stagger — because George asked for exactly that:
         *"let's have the explore more revealed like the other text."*

         Scrubbed against the line's LIVE rect, not a ScrollTrigger. This
         section is the first screen of the last panel now, and a panel with
         more content than the window carries that content upward with a
         tween — so the headline's position in the DOCUMENT never changes and
         a trigger keyed to it would sit at 0 forever. The rect is the real
         on-screen position whatever produced it; see `scrubToPosition`.

         Same range the trigger had — top at 88% of the viewport to top at
         45% — so the reveal reads exactly as it did. */
      const head = section.querySelector<HTMLElement>('[data-head]')!;
      document.fonts.ready.then(() => {
        const split = SplitText.create(head, { type: 'chars' });
        const chars = split.chars as HTMLElement[];
        if (reduce) return;

        gsap.set(head, { autoAlpha: 1 });
        const tl = gsap.timeline({ paused: true });
        tl.from(chars, { yPercent: 100, opacity: 0, ease: 'power3.out', stagger: 0.03 });
        cleanup.push(scrubToPosition(head, tl, { from: 0.88, to: 0.45 }));
        cleanup.push(() => split.revert());
      });

      /* ── the marquee ────────────────────────────────────────────────
         A real SCROLL CONTAINER now, not a transformed track. George:
         *"let's add a drag or a horizontal scroll so the user can go to the
         card they want easily."*

         Driving `scrollLeft` rather than `x` is what buys that for free: the
         trackpad, a touch swipe and the keyboard all move a scroll container
         already, and the drag below only has to cover the mouse. A
         transformed track would have had to reimplement every one of those.

         The wrap is the same trick as before — the four cards are rendered
         twice, so at exactly half the scroll width the view is identical to
         the start and `scrollLeft` can jump back with nothing to see. */
      if (!reduce) {
        const SPEED = 94; // px per second, ≈ one full pass in 28s
        /* Tweened rather than toggled, so hovering slows the row to a stop
           instead of freezing it — a marquee that stops dead reads as broken.
           Hover, focus and an active drag all pull it to zero. */
        const rate = { v: 1 };
        let dragging = false;

        const tick = () => {
          const half = track.scrollWidth / 2;
          if (half <= 0) return;
          if (!dragging && rate.v > 0) {
            viewport.scrollLeft += (SPEED / 60) * gsap.ticker.deltaRatio() * rate.v;
          }
          /* the seam, in both directions — dragging backwards past zero has
             to wrap too, or the row simply ends */
          if (viewport.scrollLeft >= half) viewport.scrollLeft -= half;
          else if (viewport.scrollLeft < 0) viewport.scrollLeft += half;
        };
        gsap.ticker.add(tick);
        cleanup.push(() => gsap.ticker.remove(tick));

        const slow = (to: number) =>
          gsap.to(rate, { v: to, duration: to ? 0.5 : 0.4, ease: 'power2.out' });

        /* ── drag ──
           Pointer events, so mouse and pen go through the same path; touch is
           left to the browser's own panning, which is better than anything
           re-implemented here. */
        let startX = 0;
        let moved = 0;
        const down = (e: PointerEvent) => {
          if (e.pointerType === 'touch') return;
          dragging = true;
          moved = 0;
          startX = e.clientX;
          viewport.setPointerCapture(e.pointerId);
          viewport.style.cursor = 'grabbing';
        };
        const move = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - startX;
          startX = e.clientX;
          moved += Math.abs(dx);
          viewport.scrollLeft -= dx;
        };
        const up = (e: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          viewport.releasePointerCapture?.(e.pointerId);
          viewport.style.cursor = '';
          /* A drag that ends on a card would otherwise FOLLOW it — the
             pointer went down and up on a link, which is a click by any
             measure. Swallowing the next one, and only when the pointer
             actually travelled, keeps dragging and tapping distinct. */
          if (moved > 6) {
            const swallow = (ev: Event) => {
              ev.preventDefault();
              ev.stopPropagation();
            };
            viewport.addEventListener('click', swallow, { capture: true, once: true });
            window.setTimeout(
              () => viewport.removeEventListener('click', swallow, { capture: true }),
              0,
            );
          }
        };
        viewport.addEventListener('pointerdown', down);
        viewport.addEventListener('pointermove', move);
        viewport.addEventListener('pointerup', up);
        viewport.addEventListener('pointercancel', up);
        cleanup.push(() => {
          viewport.removeEventListener('pointerdown', down);
          viewport.removeEventListener('pointermove', move);
          viewport.removeEventListener('pointerup', up);
          viewport.removeEventListener('pointercancel', up);
        });

        /* ── hover ──
           Per card, not on the track: the track is twice as wide as the frame
           and half of it is off-screen, so a listener there would fire for
           cards the reader cannot see. The lift is the one the v1 grid had —
           the card under the cursor comes forward and the rest drop back, so
           it reads as picking one out rather than as a button lighting up. */
        cards.forEach((card) => {
          const enter = () => {
            slow(0);
            gsap.to(card, { scale: 1.04, opacity: 1, duration: 0.35, ease: 'power3.out' });
            gsap.to(
              cards.filter((c) => c !== card),
              { opacity: 0.35, duration: 0.35, ease: 'power3.out' },
            );
          };
          const leave = () => {
            slow(1);
            gsap.to(cards, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
          };
          card.addEventListener('pointerenter', enter);
          card.addEventListener('pointerleave', leave);
          /* keyboard parity: tabbing to a card should stop the row too,
             otherwise the thing you just focused slides out from under you */
          card.addEventListener('focus', enter);
          card.addEventListener('blur', leave);
          cleanup.push(() => {
            card.removeEventListener('pointerenter', enter);
            card.removeEventListener('pointerleave', leave);
            card.removeEventListener('focus', enter);
            card.removeEventListener('blur', leave);
          });
        });
      }

      return () => cleanup.forEach((fn) => fn());
    },
    { scope: root },
  );

  const card = (c: (typeof CATEGORIES)[number], copy: boolean) => (
    <Link
      key={`${c.href}-${copy ? 'b' : 'a'}`}
      data-card
      href={c.href}
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
      aria-label={`${c.name} projects`}
      className="relative block shrink-0 overflow-hidden"
      style={{
        width: 'var(--cs-card)',
        height: 'var(--cs-card-h)',
        /* Square. George, looking at the strip: *"let's remove the rounded
           corners on these images."*

           They were 16 for one round, to settle an earlier note about
           cohesive corners — these were square wide and 16 narrow, so they
           agreed with the project cards on a phone and not on a laptop. That
           is fixed either way; this picks the other answer. The project cards
           are still 16, so the two disagree again — worth knowing rather than
           quietly matching them, since squaring those touches every category
           page and the featured list too. */
        borderRadius: 0,
        background: 'var(--bg-raised)',
      }}
    >
      <Image
        src={c.img}
        alt=""
        aria-hidden="true"
        fill
        sizes="600px"
        className="object-cover"
      />
      {/* the label has to sit on photography, so it carries its own scrim
          rather than trusting whatever happens to be behind it */}
      <span
        className="absolute inset-x-0 bottom-0 flex items-end"
        style={{
          padding: 'var(--cs-label-pad)',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0) 100%)',
        }}
      >
        <span
          className="uppercase"
          style={{
            ...CAP_TRIM,
            font: `700 var(--cat-label) var(--font-sans)`,
            color: 'var(--neutral-50)',
          }}
        >
          {c.name}
        </span>
      </span>
    </Link>
  );

  return (
    <section
      ref={root}
      id="work"
      aria-label="Categories"
      className="relative flex w-full flex-col items-center justify-start overflow-hidden"
      style={{
        /* The first screen of the last block, which arrives over the about
           panel exactly as a stack panel does — so it has to fill the
           viewport the way one does, or it reads as a short band with the
           projects already crowding in under it. It is not a `[data-panel]`
           (that block sits outside `PanelStack`, because the sections in it
           pin themselves), so it does not inherit the panel's own height and
           has to say this for itself.

           `min-height`, not `height`: at 1440 the content already comes to
           905 and should keep setting its own size. `lvh` for the reason in
           `PanelStack` — a phone's toolbar retracts and `svh` would come up
           short. */
        /* Exactly one viewport, so the panel wrapping this has no overscroll
           to run — its content is the screen. The SHOULDER is the panel's now,
           not this section's: it is a `[data-panel]` in its own right, and
           `PanelStack` draws the rounded top for anything with `shoulder`. */
        /* No `min-height` any more. It was a screen tall when it was a PANEL
           in its own right; inside the content panel that just parks the
           title at the top of a viewport-tall box and leaves ~400px of dead
           space under the cards, which is where the phone's 576px "gap" came
           from. The panel's own `--panel-gap` sets the distance now. */
        /* George: *"the learn more, all projects gap from the text to the top
           of its panel is still too much, make it around 56px."* So the
           headline is measured from the top of the panel rather than centred
           in it — centring in a full viewport is what put a screen's worth of
           empty above a single line. `justify-start` above is the other half
           of it. */
        /* and no vertical padding: `--titled-pad-top` measured this section
           from the top of a panel, which it is no longer at, and the bottom
           padding was half of an uneven gap. */
        background: 'var(--bg-page)',
        /* shared with the category listing's title — see `--titled-gap` */
        gap: 'var(--titled-gap)',
      }}
    >
      <h2
        data-head
        /* George: *"make the learn more capitalized."* Uppercase, like every
           other heading on this page. */
        className="text-center uppercase"
        style={{
          ...CAP_TRIM,
          font: 'var(--type-72-80-r)',
          color: 'var(--text-primary)',
          paddingInline: 'var(--gutter)',
          /* hidden until the split has parked its characters — an unsplit
             heading is just fully readable copy, which is what must not be
             on screen before the reveal */
          visibility: 'hidden',
        }}
      >
        Learn more
      </h2>

      {/* Full-bleed and scrollable: the row runs edge to edge, and it is the
          scroll container the reader drags. `overscroll-x: contain` stops a
          swipe that reaches the end from turning into a browser back
          gesture. */}
      <div
        data-viewport
        className="no-scrollbar w-full overflow-x-auto overflow-y-hidden"
        style={{ overscrollBehaviorX: 'contain', cursor: 'grab', scrollBehavior: 'auto' }}
      >
        <div
          data-track
          className="flex w-max flex-nowrap items-start"
          style={{ gap: 'var(--cs-gap)', paddingInline: 'calc(var(--cs-gap) / 2)' }}
        >
          {CATEGORIES.map((c) => card(c, false))}
          {CATEGORIES.map((c) => card(c, true))}
        </div>
      </div>
    </section>
  );
}
