'use client';

import { Fragment, useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setHoldProgress } from './holdProgress';
import { useGSAP } from '@gsap/react';

import './scrollDefaults';

gsap.registerPlugin(ScrollTrigger);

/**
 * The page's spine — GSAP's "Pinned panels with overscroll"
 * (demos.gsap.com/demo/pinned-panels-with-overscroll, pen bGRdvMy),
 * which is the interaction George asked for.
 *
 * ── what it does that plain sticky did not ────────────────────────────
 * The old stack held each panel still and let the next one slide over it.
 * This one does two more things, and both are the point:
 *
 * 1. The outgoing panel RECEDES. It scales 1 → 0.7 and fades 1 → 0.5 while
 *    it is being covered, then drops the last of its opacity in a final
 *    tenth. So it reads as going away rather than as being hidden.
 *
 * 2. A panel TALLER than the screen scrolls its own content first. The
 *    inner block is moved `yPercent: -100` across the front of the pin, so
 *    you read the whole panel before anything arrives. That is the
 *    "overscroll" in the demo's name, and it is the part I had no answer
 *    for before — the intro is taller than the viewport, so under the old
 *    scheme it could not be pinned at all and had to sit in flow.
 *
 * ── the arithmetic, from the pen ──────────────────────────────────────
 *   difference      = innerHeight − windowHeight
 *   fakeScrollRatio = difference / (difference + windowHeight)
 *
 * `fakeScrollRatio` is the share of the whole animation spent fake
 * scrolling. The rest of the timeline is exactly 1 unit long (0.9 of scale
 * and fade, 0.1 of the final fade), which is what makes
 * `1 / (1 − ratio) − 1` the right duration for the scroll leg.
 *
 * One consequence is worth stating, because the holds depend on it: **one
 * timeline unit is exactly one viewport height**, in both the overscrolling
 * and the plain case. Without overscroll the pin runs `vh` over 1 unit.
 * With it the pin runs `h` over `1/(1−ratio)` units, and
 * `h × (1 − ratio) = h × vh/h = vh`. So a hold expressed in scroll pixels
 * converts to a duration by dividing by the window height, and the pin is
 * simply given that many more pixels to spend.
 *
 * The order is therefore: reveal hold → overscroll → tail hold → recede.
 *
 * The pen puts `marginBottom = innerHeight * ratio` on the panel itself, so
 * the next one starts arriving as the fake scroll finishes rather than on
 * top of it. Here that space goes on a SIBLING spacer instead: ScrollTrigger
 * records a pinned element's inline style when it sets the pin up and
 * restores it on every refresh, which quietly wiped the margin and left the
 * intro with no overscroll at all. A separate element is not GSAP's to
 * restore, and adds exactly the same distance to the page.
 *
 * That distance simplifies, incidentally:
 *   h × ratio = h × (h − vh) / ((h − vh) + vh) = h − vh
 * — it is just the overflow. The long form is kept because it is the pen's,
 * and because it makes the relationship to `fakeScrollRatio` visible.
 *
 * `pinSpacing: false` is what lets the next panel travel over this one
 * instead of being pushed down by a spacer.
 *
 * ── everything given to it is pinned ─────────────────────────────────
 * The pen calls `panels.pop()` so its last section is left alone. Here the
 * equivalent section is not passed in at all: it simply follows the stack
 * in the page, as ordinary content that scrolls up over the last panel.
 *
 * That is not tidiness. Sections that pin THEMSELVES — the category strip,
 * the projects band — must not live inside a panel this component wraps.
 * Nested inside one, neither got any pin spacing at all: both spacers came
 * out at `padding-bottom: 0`, so the strip had no scroll to travel across
 * and the band's rank never advanced. Outside, they pin normally.
 *
 * It also keeps them clear of the scale: this effect TRANSFORMS the panels
 * it owns, and a transformed ancestor turns a pinned child's `position:
 * fixed` back into a local coordinate system.
 */
export interface PanelDef {
  key: string;
  /**
   * Scroll px held at the FRONT of this panel's pin, before its content
   * starts scrolling through — George: *"in order for the new panel to come
   * the animations of the previous must be done."*
   *
   * A plain beat: the panel is whole on screen and nothing moves, so the top
   * of it can be read before the overscroll takes it. The panel also fires
   * `panel:reveal` here, for anything inside that wants a one-shot cue; the
   * sentence and the chips no longer use it, because both are now scrubbed
   * against their own position instead — see `scrubToPosition`.
   */
  revealRun?: number;
  /**
   * Scroll px held at the END of the pin — after the panel's own content
   * has finished scrolling through, before it starts to recede. George:
   * *"each time a new pannel comes on top the scroll and the animation of
   * the previous one must have finished … let's add a bit scroll at the end
   * of each pannel so everything is visible and the user have time to see
   * them."*
   *
   * Without it the recede begins the instant the overscroll ends, so the
   * bottom of a tall panel — the chips, in the about panel's case — is
   * whole for about one frame before it starts shrinking away.
   */
  tailRun?: number;
  /**
   * Extra scroll px spread across this panel's OWN overscroll, slowing its
   * content against the wheel without moving it any further. George: *"let's
   * give more scroll area to the about me section so when they are revealed
   * they are more or less at the middle of the screen."*
   *
   * `revealRun` and `tailRun` are both dead holds — the panel is pinned and
   * nothing moves — so neither buys any time while the content is actually
   * travelling. This does: the overscroll still carries the content exactly
   * its own overflow, but now over `overflow + stretchRun` px of scroll, so a
   * block sitting mid-screen stays there for longer.
   *
   * It costs the timeline nothing in correctness. One unit stays exactly one
   * viewport height, because the extra pixels and the extra duration are
   * added in the same proportion — `E` px to the pin and `E / windowHeight`
   * units to the overscroll tween — so px-per-unit is unchanged and the holds
   * above still convert.
   */
  stretchRun?: number;
  /** flips every semantic token inside — see `[data-tone]` in tokens.css */
  tone?: 'light';
  /** the rounded top edge an arriving panel carries */
  shoulder?: boolean;
  content: ReactNode;
  style?: CSSProperties;
}

export default function PanelStack({ panels: defs }: { panels: PanelDef[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]');
      if (!panels.length) return;

      const inner = (p: HTMLElement) =>
        p.querySelector<HTMLElement>('[data-panel-inner]')!;
      /* The spacer sits after whatever is actually IN THE FLOW — which is
         the panel before ScrollTrigger pins it, and the `.pin-spacer` that
         wraps it afterwards. Reading `panel.nextElementSibling` alone was a
         silent, one-shot failure: once pinned, a panel has no next sibling,
         so every later call — from the ResizeObserver, from `refreshInit` —
         returned null and did nothing. The gap could then only ever be set
         on the very first pass, before fonts and images had settled, and if
         it came out 0 there it stayed 0 for good. */
      const gapAfter = (p: HTMLElement) => {
        const inFlow = p.closest('.pin-spacer') ?? p;
        const next = inFlow.nextElementSibling as HTMLElement | null;
        return next?.hasAttribute('data-panel-gap') ? next : null;
      };

      /* The spacer depends on the window height, so it has to be rewritten
         before ScrollTrigger measures anything — otherwise a resize leaves
         every panel's start position computed against the old one.
         `refreshInit` fires before positions are read, which is the only
         safe moment to change layout. */
      const setGaps = () => {
        panels.forEach((panel, i) => {
          const gap = gapAfter(panel);
          if (!gap) return;
          const h = inner(panel).offsetHeight;
          const overflow = Math.max(0, h - window.innerHeight);
          /* The spacer is the panel's WHOLE pin, less the screen it already
             occupies: the reveal hold, the content scrolling through, and
             the tail hold.

             It cannot be just the overflow. `pinSpacing: false` means a
             pinned panel takes up no room while it is pinned, so the next
             section's arrival is decided purely by where it sits in the
             document — extending the pin makes the panel hold longer while
             the next one slides over it regardless. With only the overflow
             here, the categories began covering the about panel at 2346
             while its own tail ran to 2600: the chips were held still,
             perfectly composed, behind the panel that had already replaced
             them.

             Adding the holds pushes the next section down by exactly as
             much, so it starts arriving as the recede starts — which is
             what George asked for: the previous panel's scroll and
             animation finish, and then the new one comes on top. */
          const d = defs[i];
          const holdRun = gsap.utils
            .toArray<HTMLElement>('[data-hold]', inner(panel))
            .reduce((n, el) => n + (Number(el.dataset.hold) || window.innerHeight), 0);
          gap.style.height =
            `${overflow + (d?.revealRun ?? 0) + (d?.tailRun ?? 0) + (d?.stretchRun ?? 0) + holdRun}px`;
        });
      };
      setGaps();
      ScrollTrigger.addEventListener('refreshInit', setGaps);

      /* Layout offset of a descendant within the panel's content, walked up
         the `offsetParent` chain rather than differenced from two
         `getBoundingClientRect`s. The content is TRANSLATED by the overscroll
         and the panel is SCALED by the recede, and a rect would carry both;
         `offsetTop` is layout, so it reads the same whatever is applied on
         top. `[data-panel-inner]` is positioned so the walk terminates on it. */
      /* `--panel-radius` in PIXELS.

         `getPropertyValue` hands back the custom property's raw text — the
         whole `clamp(24px, …, 40px)` — not what it resolves to, so parsing it
         yields NaN and the radius silently became 0. A throwaway element with
         the token applied is the only way to read the computed length, since
         GSAP needs a number to tween to. */
      const panelRadius = () => {
        const probe = document.createElement('div');
        probe.style.cssText =
          'position:absolute;visibility:hidden;pointer-events:none;border-top-left-radius:var(--panel-radius)';
        document.body.appendChild(probe);
        const px = parseFloat(getComputedStyle(probe).borderTopLeftRadius) || 0;
        probe.remove();
        return px;
      };

      const offsetWithin = (el: HTMLElement, box: HTMLElement) => {
        let y = 0;
        let n: HTMLElement | null = el;
        while (n && n !== box) {
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        return y;
      };

      panels.forEach((panel, i) => {
        const box = inner(panel);
        const diff = box.offsetHeight - window.innerHeight;
        const ratio = diff > 0 ? diff / (diff + window.innerHeight) : 0;
        const hold = defs[i]?.revealRun ?? 0;
        const tail = defs[i]?.tailRun ?? 0;
        /* only means anything to a panel that HAS an overscroll to stretch */
        const stretch = ratio ? defs[i]?.stretchRun ?? 0 : 0;
        const overflow = Math.max(0, box.offsetHeight - window.innerHeight);

        /* Anything inside asking to be held still while it reveals. The stop
           is placed where the block's own CENTRE meets the viewport's, which
           is what "keep the user here" means in practice — parked with the
           thing you are meant to be reading in the middle of the screen. It
           is clamped to the travel that actually exists, so a block at the
           very bottom of a panel simply holds at the end of the overscroll
           rather than asking for room the panel has not got. */
        const holds = gsap.utils
          .toArray<HTMLElement>('[data-hold]', box)
          .map((el) => ({
            el,
            run: Number(el.dataset.hold) || window.innerHeight,
            at: gsap.utils.clamp(
              0,
              overflow,
              offsetWithin(el, box) + el.offsetHeight / 2 - window.innerHeight / 2,
            ),
          }))
          .sort((a, b) => a.at - b.at);
        const holdRun = holds.reduce((n, h) => n + h.run, 0);

        /* One timeline unit is exactly one VIEWPORT HEIGHT, in both cases,
           which is what makes a hold in scroll px convertible at all:
             no overscroll — the pin runs a viewport and the timeline is 1
             overscroll   — the pin runs `h` and the timeline is 1/(1−ratio),
                            and h × (1 − ratio) = h × vh/h = vh
           so `hold / windowHeight` is the hold's duration either way, and
           the pin simply gets `hold` more pixels to spend. */
        const holdDur = hold / window.innerHeight;
        const tailDur = tail / window.innerHeight;

        let revealed = false;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            /* the panel is whole on screen before anything happens to it */
            start: 'bottom bottom',
            end: () =>
              `+=${(ratio ? box.offsetHeight : window.innerHeight) + hold + tail + stretch + holdRun}`,
            pinSpacing: false,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (revealed) return;
              revealed = true;
              /* Whatever is inside can now play its entrance. It is an event
                 rather than a callback so the sections stay unaware of the
                 stack, and a section that does not listen simply doesn't. */
              panel.dispatchEvent(new CustomEvent('panel:reveal'));
            },
          },
        });

        // the panel holds still while its own contents arrive
        if (hold) tl.to({}, { duration: holdDur });

        if (ratio) {
          /* The overscroll, written as a plain `y: -overflow` rather than the
             pen's `yPercent: -100, y: innerHeight`. The two are identical —
             -100% + vh = -(h - vh) — but only one of them can be CUT INTO
             SEGMENTS, and it has to be, because the holds land in the middle
             of the travel.

             Its whole duration is `(overflow + stretchRun) / vh` units, which
             falls straight out of the arithmetic at the top of this file:
             `1/(1-ratio) - 1` is exactly `overflow / vh`. So a segment that
             carries the content `d` px costs `d / overflow` of that. */
          const runDur = (overflow + stretch) / window.innerHeight;
          const legDur = (d: number) => (overflow > 0 ? (d / overflow) * runDur : 0);

          let from = 0;
          holds.forEach((h) => {
            if (h.at > from) {
              tl.to(box, { y: -h.at, duration: legDur(h.at - from), ease: 'none' });
              from = h.at;
            }

            /* The hold itself: the content is parked and the scroll buys
               nothing but this progress, which the block inside reads to
               scrub its own reveal. A proxy object rather than a bare
               `tl.to({}, …)` so there is something to publish from. */
            const p = { v: 0 };
            tl.to(p, {
              v: 1,
              duration: h.run / window.innerHeight,
              ease: 'none',
              onUpdate: () => setHoldProgress(h.el, p.v),
            });
          });

          if (overflow > from) {
            tl.to(box, { y: -overflow, duration: legDur(overflow - from), ease: 'none' });
          }
        }

        /* …and holds again once it has, so the end of the panel can be
           read before anything covers it. */
        if (tail) tl.to({}, { duration: tailDur });

        /* ── the recede ──────────────────────────────────────────────
           A panel at scale 1 fills the screen, so its own edges are off it.
           The moment it starts shrinking they come INTO view — and whatever
           was bleeding off the design, the ribbons above all, is suddenly a
           shape sliced by a hard straight line. George saw it scrolling back
           UP, where the fade runs in reverse and the cut arcs sit there in
           plain sight for the whole gesture.

           Two things fix it together.

           The bottom corners round as it goes. At rest they are below the
           fold and a radius there would only notch the cream against the
           screen edge, so it is TWEENED rather than set: zero while the panel
           is full-bleed, `--panel-radius` by the time it is a card. The
           shoulder it arrived on is already rounded, so it recedes as the
           same object it came in as — which is what George asked for, that
           this panel have rounded corners like the other one.

           And it goes much fainter, 0.2 rather than the pen's 0.5. The
           clipped edge is only a problem while you can still read what is
           being clipped; at 0.2 the ribbons are a suggestion behind the
           arriving panel rather than two arcs with their ends cut off. */
        /* The token, not the panel's CURRENT top radius.

           Reading the panel was wrong for a panel with no shoulder — the
           FIRST viewport of a page, which is full-bleed and square by design.
           It read 0 and so receded as a bare square rectangle: a card with no
           corners, which is what looked broken on the category template,
           where the cream intro IS the first viewport.

           Every panel becomes a card once it starts shrinking, so every panel
           gets the same corners on the way out. A panel that arrived on a
           shoulder is already at this radius on top and only its bottom
           moves; one that started square rounds all four. Square at rest for
           the first viewport, identical cards for all of them in motion. */
        const radius = panelRadius();
        const shoulderRadius = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 0;

        tl.fromTo(
          panel,
          {
            scale: 1,
            opacity: 1,
            borderTopLeftRadius: shoulderRadius,
            borderTopRightRadius: shoulderRadius,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
          {
            scale: 0.7,
            opacity: 0.2,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
            duration: 0.9,
          },
        ).to(panel, { opacity: 0, duration: 0.1 });
      });

      /* Two refreshes AFTER the spacers exist and the triggers are built.

         React runs effects CHILD FIRST, so every trigger inside a panel —
         the category strip's pin, the projects band's — is created before
         this component has written a single spacer. They therefore measure a
         document that is missing all of the overscroll room, and come out
         short by exactly that: with the about panel 1126px taller than the
         window, the strip started at 1800 instead of 2926 and the band at
         2700 instead of 3826, each pinning more than a screen early.
      
         Without it every start below the intro was 226px too high — the
         panels began at 900/1800/2700 instead of 900/2026/2926 and the
         projects band pinned a screen early, dropping its cards on top of
         the footer. The page-wide refreshes in `scrollDefaults` are bound to
         `load` and `fonts.ready`, and in dev both of those have already
         fired by the time this component mounts, so nothing ever re-measured
         the layout this effect had just changed.

         On the next frame, not this one: the spacer heights were written a
         moment ago and the browser has not necessarily reflowed yet. */
      /* Straight away, synchronously: by this point the spacers are written
         and — because effects run child first — every trigger inside a panel
         already exists, so one refresh here corrects all of them at once. */
      ScrollTrigger.refresh();

      /* ── and then keep it honest ──────────────────────────────────────
         Everything above still assumes the page has finished laying out by
         the time this effect runs, and it has not: fonts, the illustration,
         the project images and the pin spacers of the two sections inside
         the last panel all change heights afterwards. Scheduling a refresh
         for "later" is guesswork, and it showed — the same page settled
         correctly on one load and a screen short on the next.

         A ResizeObserver removes the guess. Whenever a panel's content
         actually changes height, the spacers are rewritten and the
         positions recomputed, however late that happens. Debounced to a
         frame so a run of small changes costs one refresh, and the first
         (synchronous) callback is ignored because it only ever reports what
         was just measured. */
      let queued = 0;
      let primed = false;
      let refreshing = false;

      const recompute = () => {
        refreshing = true;
        setGaps();
        ScrollTrigger.refresh();
        /* Released a frame later, once the reverted-and-reapplied pins have
           finished resizing everything they touch. */
        requestAnimationFrame(() => { refreshing = false; });
      };

      const ro = new ResizeObserver(() => {
        /* Two guards, and both are load-bearing. The first callback only
           reports the size just measured, so it is noise. And a refresh
           REVERTS every pin and re-applies it, which resizes the very
           elements being observed — without the re-entrancy flag the
           observer feeds itself, the page never leaves the reverted state,
           and every pin sits at `padding-bottom: 0` with no scroll to run
           against. Both pinned sections in the last panel died that way. */
        if (!primed) { primed = true; return; }
        if (refreshing) return;
        cancelAnimationFrame(queued);
        queued = requestAnimationFrame(recompute);
      });
      panels.forEach((panel) => ro.observe(inner(panel)));

      /* `setTimeout`, NOT `gsap.delayedCall`: a delayed call lives on
         `gsap.globalTimeline`, and the Loader PAUSES that while its panel is
         up, so one scheduled that way simply never fires. */
      const late = window.setTimeout(() => ScrollTrigger.refresh(), 400);

      return () => {
        ro.disconnect();
        cancelAnimationFrame(queued);
        window.clearTimeout(late);
        ScrollTrigger.removeEventListener('refreshInit', setGaps);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {defs.map((d) => {
        return (
          <Fragment key={d.key}>
            {/* Two elements, not one. The OUTER is what gets pinned, scaled
                and faded, and it is clipped to the screen; the INNER is the
                thing that fake-scrolls inside it. Putting both jobs on one
                element means the scroll would move the panel it is supposed
                to be scrolling within.

                The colour lives on the OUTER for the same reason: on a panel
                taller than the screen the inner scrolls away, and a
                background on it would go too and leave the cream behind. */}
            <section
              data-panel
              data-tone={d.tone}
              className="relative overflow-hidden"
              style={{
                /* `lvh`, not `svh`. A phone's toolbar retracts as you
                   scroll and the visible area GROWS — `svh` is the height
                   with the toolbar showing, so a panel sized in it comes up
                   short the moment the bar hides and leaves a strip of page
                   background under it. `lvh` is the tallest the viewport can
                   get, so the panel always covers. Erring the other way
                   costs nothing: a panel slightly taller than the visible
                   area just extends past the fold, which is exactly what a
                   full-bleed panel should do.

                   Identical to `svh` on a desktop, where there is no
                   retracting chrome — so this changes nothing there. */
                height: '100lvh',
                ...(d.shoulder
                  ? {
                      borderTopLeftRadius: 'var(--panel-radius)',
                      borderTopRightRadius: 'var(--panel-radius)',
                    }
                  : null),
                ...d.style,
              }}
            >
              {/* `relative` so the `offsetParent` walk that places the holds
                  terminates here rather than escaping to the page */}
              <div data-panel-inner className="relative">{d.content}</div>
            </section>

            {/* Overscroll room for a panel taller than the screen. Its
                height is written by `setGaps`, and is 0 for every panel that
                already fits — so an unused one costs nothing.

                EVERY panel gets one, including the last. It used to be
                skipped there on the grounds that whatever follows the stack
                brings its own room, and that was true only while the final
                panel was a short one. The about panel is now last and is the
                one panel that overscrolls: it needed 1126px and had no
                spacer to put it in, so its pin ran a screen past the end of
                the page and everything below it measured short. */}
            <div data-panel-gap aria-hidden="true" style={{ height: 0 }} />
          </Fragment>
        );
      })}
    </div>
  );
}
