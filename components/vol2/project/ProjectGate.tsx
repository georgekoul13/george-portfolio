'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoaderPanel, { EXIT_MS } from '../LoaderPanel';
import '../scrollDefaults';

gsap.registerPlugin(ScrollTrigger);

/**
 * Holds a project page behind the loading curtain until the screen you are
 * about to see is actually there.
 *
 * George: *"whenever the user taps on a card, the loading happens until all
 * the images are loaded and then the project page comes — then everything as
 * is with the animations and everything."* And, on the first version:
 * *"the loading of the project page is a black screen - use the one we use
 * for the main pages as well. When the page is loading it should not scroll
 * in the back page. Some images do not load properly — this is the priority
 * number one for a portfolio. The loading time for each page should be max
 * 3 to 4 sec."*
 *
 * ── it waits for the FIRST SCREEN, not the whole page ─────────────────
 * Waiting for every picture is what broke it. A project page carries up to
 * 21 stills; the dev server speaks HTTP/1.1, so the browser opens about six
 * connections and the rest queue, each cold-encoding as it arrives. Some
 * requests never came back at all — the grey boxes George found — and the
 * curtain sat there until its cap expired.
 *
 * So the stills are lazy again (see `Slot`), and this waits only for what is
 * inside the first viewport: in practice the hero, which carries `priority`.
 * Everything below arrives as it is scrolled to, uncovering as it lands,
 * which is what the rest of the page was already built to do.
 *
 * ── it gates the ANIMATIONS too ───────────────────────────────────────
 * Covering the page is not enough on its own. The hero's uncover and the
 * title's rise are triggered by being on screen, so they would play behind
 * the curtain and the page would arrive with its opening already spent — the
 * exact complaint George made about reveals firing offscreen.
 *
 * `ready` is a context, and every entrance takes it as a `useGSAP`
 * dependency. While it is false nothing is built; when it flips, every
 * timeline is created and parked in the same commit that starts the curtain
 * leaving. `useGSAP` runs in a layout effect, so the parking happens BEFORE
 * the browser paints — there is no frame in which the content is visible and
 * un-parked.
 *
 * The default is `true`, so anything rendered outside a gate behaves exactly
 * as it did before this existed.
 *
 * ── why not pause `gsap.globalTimeline`, like `Loader` does ───────────
 * Because a paused global clock renders no tweens, and `gsap.set` is a
 * zero-duration tween. `ProjectBlocks` parks every still with one, so pausing
 * the clock would silently stop the parking and leave the page uncovered —
 * the same trap the avatar's sleeping face hit.
 */
const Ready = createContext(true);

export const useGateReady = () => useContext(Ready);

/**
 * The ceiling, and it is George's number: *"the loading time for each page
 * should be max 3 to 4 sec."* Whatever has or has not arrived, the curtain
 * goes at 3.5s. It is a promise to the reader rather than a timeout — the
 * page behind it is complete and readable either way, because only the first
 * screen was ever being waited on.
 */
const CAP = 3500;
/** and a floor, so a cached page does not flash the curtain for one frame */
const FLOOR = 350;

export default function ProjectGate({ children }: { children: React.ReactNode }) {
  /** the curtain has been told to leave */
  const [leaving, setLeaving] = useState(false);
  /** …and has finished; only now does the page animate */
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;

    /* ── nothing moves underneath ───────────────────────────────────────
       George: *"when the page is loading it should not scroll in the back
       page."*
 
       THE GESTURES ONLY — NOT `overflow: hidden`. The first version set it
       on the body, and `Loader` already carries the warning about why that
       is wrong: a body with `overflow: hidden` becomes a scroll container,
       which makes it the sticky containing block for everything inside it,
       so every panel in a `PanelStack` silently stops sticking and the page
       measures flat. A project page is nothing but sticky panels, and
       ScrollTrigger takes its positions from exactly that geometry — it
       refreshes on `load` and on `document.fonts.ready`, both of which can
       land INSIDE the locked window, and on a phone usually do, because the
       curtain is up for longer there while the pictures arrive.
 
       That is the difference George is describing between his phone and the
       desktop. Cancelling the gestures is the only lock that holds on every
       browser anyway, and it is the one that changes no layout at all. */
    const swallow = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', swallow, { passive: false });
    window.addEventListener('touchmove', swallow, { passive: false });
    const free = () => {
      window.removeEventListener('wheel', swallow);
      window.removeEventListener('touchmove', swallow);
    };

    /* Three moments, not one. The panel takes over a second to slide clear,
       and animations started when it BEGAN leaving were finished before the
       reader could see any of them — the hero's whole uncover played behind
       it. So: the curtain is told to go, the scroll is handed back, and only
       when the screen is actually the reader's does `ready` flip and the
       entrances run. The content was parked at mount, so there is nothing
       un-parked to flash in between. */
    const release = () => {
      if (!live) return;
      free();
      setLeaving(true);
      window.setTimeout(() => {
        if (!live) return;
        /* Measure the page as the reader will actually meet it. Every
           refresh that happened while the curtain was up did so against a
           locked, part-loaded page, and whichever of those ran last is what
           every trigger on the page would otherwise be keyed to. */
        ScrollTrigger.refresh();
        setReady(true);
        setGone(true);
      }, EXIT_MS);
    };

    /* Measured after a frame: these are this component's own children, so on
       the first pass the browser has them in the DOM but `complete` means
       nothing for anything just started. */
    const id = requestAnimationFrame(() => {
      const first = Array.from(root.current?.querySelectorAll('img') ?? []).filter(
        (img) => img.getBoundingClientRect().top < window.innerHeight,
      );

      /* `decode()` rather than the `load` event: an image already in cache
         fires no load event, and one that has loaded but not decoded still
         paints late. A rejection is a resolve as far as this is concerned —
         a picture that will never arrive must not hold the page. */
      const shown = first.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : img.decode().catch(() => undefined),
      );

      Promise.all([
        Promise.all(shown),
        document.fonts.ready,
        new Promise((r) => setTimeout(r, FLOOR)),
      ]).then(release);
    });

    const cap = window.setTimeout(release, CAP);
    return () => {
      live = false;
      cancelAnimationFrame(id);
      clearTimeout(cap);
      free();
    };
  }, []);

  return (
    <Ready.Provider value={ready}>
      <div ref={root}>{children}</div>
      {/* Above the floating menu and the noise field, below nothing. It is
          unmounted once the lift has finished rather than left at opacity 0,
          so it cannot intercept anything afterwards. */}
      {!gone && <LoaderPanel leaving={leaving} creeping={!leaving} z={9999} />}
    </Ready.Provider>
  );
}
