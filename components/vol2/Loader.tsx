'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

/**
 * Loading screen — Figma 129:27406.
 *
 * A cream panel with LOADING… turning on a drum in the middle. The panel
 * lifts off the top of the screen, uncovering the site beneath it.
 *
 * It is already moving from the first frame rather than arriving at the end:
 * the panel creeps for as long as the page is loading, then is hauled clear
 * once everything is ready, so the exit always begins from something already
 * in motion.
 *
 * IT USED TO GO SIDEWAYS, and was drawn that way in Figma — the second frame
 * shows 137px of the page uncovered from the left. George changed it to a
 * lift on 2026-08-21. A character rode the boundary through both earlier
 * versions, a walking dino and then a ghost; both are gone and the panel now
 * leaves under its own steam.
 *
 * The creep is smaller than the sideways version's 170px because the travel
 * is now across the short axis of the screen: the same 12% of it.
 *
 * Everything here is CSS, which is what makes the pause below safe — anything
 * added later must not be a GSAP tween, because the global timeline is
 * stopped for as long as the panel is up.
 */

/** at least this long on screen, so the panel is read rather than flashed */
const MIN_SHOW = 1200;
/** …and a ceiling, so a stalled font or image can never strand anyone here */
const MAX_WAIT = 4000;

/**
 * The creep. It eases out towards a distance it never quite reaches, so a
 * long wait keeps inching rather than arriving somewhere and stopping dead —
 * and however long the page takes, the haul always begins from something
 * already in motion. That continuity is most of what makes the exit read as
 * smooth instead of as a jerk from a standstill.
 */
const CREEP_TO = 110;
const CREEP_MS = 9000;

const EXIT_MS = 1200;
/** gentle in, long settle — no snap at either end */
const EXIT_EASE = 'cubic-bezier(0.5, 0, 0.2, 1)';

/* ── LOADING… on the drum ───────────────────────────────────────────────
   The same mechanic as the copyright line: each character turned about an
   origin pushed back in z, so it swings on a cylinder rather than flipping
   flat, with the turn staggered along the word to send a wave through it.

   Written as a CSS animation rather than a GSAP one because GSAP is stopped
   while the panel is up — see `holdEverything`. The keyframes are scoped to
   this component's own markup and go away with it.                          */
const TEXT = 'Loading…';
const ROLL_MS = 1800;
/** how far apart each character's turn starts */
const ROLL_STEP_MS = 90;
const FONT = 32;
const DEPTH = -FONT;
const PERSPECTIVE = 220;

/**
 * Latched once and never cleared. It has to survive the release, because
 * dismissing the panel is a state change and React re-renders on the way out
 * — a flag that reset would re-pause the global timeline on that final
 * render, with nothing left to ever start it again.
 */
let holdApplied = false;
function holdEverything() {
  if (holdApplied || typeof window === 'undefined') return;
  holdApplied = true;
  /* Everything else on the page animates on mount — the hero's letters most
     of all — and would otherwise play its whole entrance behind the panel,
     leaving only the tail of it by the time the panel left. Rather than teach
     every section to wait, GSAP's global timeline is stopped while the panel
     is up.

     Paused during render, not in an effect: effects run child-first, so by
     the time this component's effect ran the hero's timeline — built in a
     layout effect — would already be going. Render precedes all of them. */
  gsap.globalTimeline.pause();
}

export default function Loader() {
  holdEverything();

  const [leaving, setLeaving] = useState(false);
  const [creeping, setCreeping] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // scroll is locked while the panel is up, so nothing can be moved past
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    /* `overflow: hidden` on the body is not a scroll lock on a phone.
       George: *"when the loading happens the background page should not be
       scrollable."* It was: a finger dragged across the loader still
       scrolled the document underneath it, so the panels behind had already
       moved by the time the panel lifted.

       Cancelling the gestures themselves is the only thing that holds on
       every browser, and it is the one lock that changes no layout at all —
       which matters here, because a body that becomes a scroll container
       stops being the containing block the pinned panels are measured
       against (see the reduced-motion note below for what that costs).
       `passive: false` or the browser is entitled to ignore the
       `preventDefault`. */
    const swallow = (e: Event) => e.preventDefault();
    const lockGestures = () => {
      window.addEventListener('wheel', swallow, { passive: false });
      window.addEventListener('touchmove', swallow, { passive: false });
    };
    const freeGestures = () => {
      window.removeEventListener('wheel', swallow);
      window.removeEventListener('touchmove', swallow);
    };
    lockGestures();

    const release = () => {
      freeGestures();
      document.body.style.overflow = overflow;
      gsap.globalTimeline.resume();
      setGone(true);
    };

    if (reduce) {
      const t = setTimeout(release, 300);
      /* The unlock has to happen here too. React runs an effect's cleanup
         before it re-runs the effect, and under StrictMode it always
         re-runs — so a cleanup that only clears the timer leaves
         `overflow: hidden` in place, and the SECOND run then captures
         "hidden" as the value to restore. The lock becomes permanent.
         
         That is not a loading bug, it is a layout one: a body with
         `overflow: hidden` is a scroll container, which makes it the sticky
         containing block for everything inside it — so every panel in the
         stack silently stops sticking and the whole page scrolls flat. It
         only ever bit on the reduced-motion path, which is exactly the path
         that gets the least looking at. */
      return () => {
        clearTimeout(t);
        freeGestures();
        document.body.style.overflow = overflow;
      };
    }

    // one frame at rest first, so the creep is a transition and not a paint
    const kick = requestAnimationFrame(() => setCreeping(true));

    /* Ready means the fonts have landed and the window has loaded — the two
       things that would otherwise reflow or pop in behind the panel. The
       floor and the ceiling bracket it either side. */
    const ready = Promise.all([
      document.fonts.ready,
      new Promise<void>((res) => {
        if (document.readyState === 'complete') return res();
        window.addEventListener('load', () => res(), { once: true });
      }),
      new Promise<void>((res) => setTimeout(res, MIN_SHOW)),
    ]);

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setLeaving(true);
      setTimeout(release, EXIT_MS);
    };

    ready.then(go);
    const cap = setTimeout(go, MAX_WAIT);

    return () => {
      cancelAnimationFrame(kick);
      clearTimeout(cap);
      freeGestures();
      document.body.style.overflow = overflow;
    };
  }, []);

  if (gone) return null;

  const panelY = leaving ? '-100vh' : creeping ? `-${CREEP_TO}px` : '0px';

  return (
    // the stage holds still and clips, so nothing shows past the wipe's edge
    <div aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden">
      <style>{`
        @keyframes gk-loader-roll {
          0%   { transform: rotateX(0deg); }
          40%  { transform: rotateX(360deg); }
          100% { transform: rotateX(360deg); }
        }
      `}</style>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'var(--bg-inverse)',
          transform: `translateY(${panelY})`,
          transition: leaving
            ? `transform ${EXIT_MS}ms ${EXIT_EASE}`
            : `transform ${CREEP_MS}ms cubic-bezier(0.12, 0.7, 0.25, 1)`,
          willChange: 'transform',
        }}
      >
        <p
          className="flex uppercase"
          style={{
            font: 'var(--type-32-32-m)',
            color: 'var(--text-inverse)',
            perspective: PERSPECTIVE,
            transformStyle: 'preserve-3d',
          }}
        >
          {TEXT.split('').map((ch, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                transformOrigin: `50% 50% ${DEPTH}px`,
                backfaceVisibility: 'hidden',
                animation: `gk-loader-roll ${ROLL_MS}ms cubic-bezier(0.65, 0, 0.35, 1) infinite`,
                animationDelay: `${i * ROLL_STEP_MS}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </p>

      </div>
    </div>
  );
}
