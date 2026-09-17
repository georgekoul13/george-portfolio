import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Site-wide ScrollTrigger behaviour for vol2.
 *
 * Import this for its side effect anywhere a scroll-driven entrance is
 * created — it runs at module evaluation, so it is always in place before a
 * component's `useGSAP` builds its triggers.
 *
 * `play none none reverse` is the whole point: the four slots are
 * onEnter / onLeave / onEnterBack / onLeaveBack, so an entrance plays coming
 * down the page and runs backwards on the way up, rather than freezing where
 * it finished. Scrolling back up now un-does what scrolling down did,
 * everywhere.
 *
 * This does nothing to scrubbed triggers — a `scrub` already ties progress
 * directly to scroll position in both directions, so `toggleActions` is
 * ignored there. It only affects the fire-and-forget entrances.
 *
 * A trigger that genuinely should happen once still can: pass `once: true`
 * explicitly, which overrides this.
 */
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({ toggleActions: 'play none none reverse' });

/**
 * IGNORE THE MOBILE URL BAR.
 *
 * On a phone, scrolling collapses and expands the browser's own chrome, and
 * every one of those fires a `resize`. ScrollTrigger refreshes on resize, so
 * it was re-measuring the whole page in the middle of the very scroll the
 * measurements are for — repeatedly, and hardest at exactly the moment a
 * reader starts moving, which is when the first reveals are meant to run.
 *
 * `ignoreMobileResize` tells it to ignore a resize whose WIDTH did not
 * change, which is precisely the URL-bar case and nothing else: a real
 * rotation or a window resize still refreshes.
 *
 * This is the single most common reason a scroll animation behaves on a
 * desktop and not on a phone, and it costs nothing to rule out.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Re-measure once the page has actually stopped moving.
 *
 * A trigger computes its start and end from where its element is when the
 * trigger is BUILT, and several of these are built early — the reveals wait
 * on `document.fonts.ready`, which usually resolves before the last image
 * has laid out. Anything that changes the document's height afterwards
 * leaves every trigger below it pointing at the wrong scroll positions, and
 * a scrubbed one then sits at progress 0 with its whole animation parked at
 * the start: on screen that is not a broken animation, it is a blank space
 * where a paragraph should be.
 *
 * The stacked panels made this reliably visible rather than occasionally —
 * `100svh` and a late-loading illustration both resolve after the reveals
 * are wired.
 *
 * `refresh()` is idempotent and only reads layout, so calling it on both
 * signals is cheap insurance rather than a guess about which one is last.
 */
if (typeof window !== 'undefined') {
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') requestAnimationFrame(refresh);
  else window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(() => requestAnimationFrame(refresh));
}

/**
 * Dev-only test hook: `?nolag=1` turns off GSAP's lag smoothing.
 *
 * Headless Chrome advances the clock in jumps, and `lagSmoothing` (on by
 * default, 500ms) clamps any frame whose delta looks like a stall — so a
 * screenshot taken after a long virtual wait still catches every timeline a
 * few frames in, which reads as "the animation is broken" when it is only
 * slow. Turning it off makes a headless run settle where a real browser
 * would. It costs an afternoon to work out from the symptoms; it costs one
 * query parameter to avoid.
 */
/* `?st=1` and `?diag=1` hand ScrollTrigger to the page. Outside development
   too, deliberately: the one machine where the scroll behaviour goes wrong is
   George's phone against a deployed build, and there is no other way to read
   what a trigger actually measured from in there. It costs a property on
   `window` and only when the url asks for it. */
if (typeof window !== 'undefined') {
  const q0 = new URLSearchParams(window.location.search);
  if (q0.get('st') || q0.get('diag')) {
    (window as unknown as { __ST?: unknown }).__ST = ScrollTrigger;
  }
}

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  const q = new URLSearchParams(window.location.search);
  if (q.get('nolag')) gsap.ticker.lagSmoothing(0);
  /* `?st=1` hands ScrollTrigger to the page so a probe can read what every
     trigger actually measured. There is no other way in from outside — it
     is a module import, not a global — and every hour lost on this build so
     far has gone to guessing at start/end values instead of reading them. */
  if (q.get('st')) (window as unknown as { __ST?: unknown }).__ST = ScrollTrigger;

  /* `?y=4000` scrolls there once the page has settled, so a screenshot can
     be taken of the REAL page rather than of one loaded in an iframe.
     
     That distinction is not cosmetic. A pinned section inside an iframe gets
     no pin spacing at all — every `.pin-spacer` comes back with
     `padding-bottom: 0` — so the whole scroll length of the projects band
     and the category strip simply does not exist in there. Hours went into
     "fixing" positions that were only ever wrong inside the harness. */
  const y = q.get('y');
  if (y) {
    const to = () => window.scrollTo(0, parseInt(y, 10));
    setTimeout(() => {
      ScrollTrigger.refresh();
      to();
      // and again after any late settle, so the shot lands where asked
      setTimeout(to, 400);
      setTimeout(to, 1200);
      setTimeout(to, 2600);
      setTimeout(to, 4200);
    }, 2600);
  }
}

export {};
