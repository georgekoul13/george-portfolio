'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The floating menu — Figma 230:14522, two variants of one component, with
 * the MOTION taken from the recording George sent (palmer-dinnerware.com).
 *
 * ── the design (230:14522) ────────────────────────────────────────────
 * A row of separate 4px-radius tiles with 2px between them. Closed it is
 * [≡][MENU]; open it is [✕][• HOME][PRODUCT][GRAPHIC][CREATIVE][ABOUT].
 * Every tile is `--bg-surface` except the close button, which the design
 * lifts to `--bg-raised` so the way out is not the way in redrawn.
 *
 * Geometry straight off the node: icon tile 7px around an 18px icon (32
 * tall), text tiles 14px side / 11px top and bottom around CAP-TRIMMED
 * 14/24 Montserrat Light, which lands them at the same 32. The trim is what
 * makes those two paddings agree — untrimmed, a 24px line box would make the
 * text tiles 46 against the icon's 32.
 *
 * ── the motion (the recording) ────────────────────────────────────────
 * Read off the video frame by frame at 30fps:
 *
 *   the label      the MENU tile collapses and drops away
 *   the items      each pill RISES from below into the row, ~0.13s apart,
 *                  first to last, fully drawn before it arrives
 *   the row        re-centres continuously as it grows, so the group is
 *                  never off-centre mid-animation
 *   the icon       the two burger lines sweep into an ✕
 *   closing        the same in reverse, and the items leave LAST-first
 *
 * The pills are not clipped. In the recording a pill is fully legible while
 * the row is still narrow — it is sitting below the row, outside anything
 * that could clip it. So the rail's width is animated for LAYOUT only (it is
 * what re-centres the group) and its overflow stays visible; what hides the
 * items when the menu is shut is their own `autoAlpha`, which also takes
 * them out of the hit-testing.
 *
 * ── one deliberate departure from the recording ───────────────────────
 * Palmer's close button becomes a CIRCLE when the menu opens. 230:14522
 * keeps it at the same 4px radius as every other tile, and George asked for
 * the design to be followed as well as the animation — so the shape is the
 * design's and the movement is the video's.
 */

const NAV = [
  { label: 'Home',     href: '' },
  { label: 'Product',  href: '/product' },
  { label: 'Graphic',  href: '/graphic' },
  { label: 'Creative', href: '/creative' },
  /* The design ends on ABOUT and there is still no About route, so this
     lands on Contact — the page that does exist. The label follows the
     design; the destination is the one thing that cannot yet. One line to
     correct the day About ships. */
  { label: 'About',    href: '/contact' },
];

/** 4px radius, and the 32px height both paddings resolve to */
const TILE = 'flex shrink-0 items-center gap-[4px] rounded-[4px] px-[14px] py-[11px]';

/** Montserrat cap band at line-height 1 runs 0.1585em → 0.8585em. */
const CAP_TRIM = {
  lineHeight: 1,
  marginTop: '-0.1585em',
  marginBottom: '-0.1415em',
} as const;

/* `font` FIRST, then the trim. The shorthand resets `line-height`, so with
   the spread above it the trim's `lineHeight: 1` was being overwritten by the
   24 in the shorthand and every tile came out 42 tall instead of 32. */
const LABEL: React.CSSProperties = {
  font: '300 14px/24px var(--font-sans)',
  ...CAP_TRIM,
  color: '#ffffff',
};

/** one bar of the burger, and one stroke of the ✕ */
const BAR: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: 1.5,
  borderRadius: 1,
  background: '#ffffff',
};

export default function MenuBar() {
  const pathname = usePathname() ?? '';
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const menuTile = useRef<HTMLDivElement>(null);
  const barTop = useRef<HTMLSpanElement>(null);
  const barBottom = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  /** so the first render lands closed without animating shut */
  const shown = useRef<boolean | null>(null);
  /** which axis was last laid out, so a breakpoint change snaps */
  const shownStacked = useRef<boolean | null>(null);

  /* The open row measures ~500px. That fits a laptop and nothing else, so
     below `sm` the links stack upward out of the button instead — same
     tiles, same gaps, turned through ninety degrees. Read in an effect, not
     during render, so the server's markup and the client's first pass
     agree. */
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setStacked(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Vol2 is a parallel surface, so every link has to stay inside it — a
     bare `/product` is the LIVE page, and following it mid-test drops you
     out of the build without it being obvious why. */
  const base = pathname.startsWith('/vol2') ? '/vol2' : '';
  const items = NAV.map((n) => {
    const href = `${base}${n.href}` || '/';
    return { ...n, href, active: pathname === href || (!n.href && pathname === base) };
  });

  useGSAP(
    () => {
      const railEl = rail.current;
      const menuEl = menuTile.current;
      if (!railEl || !menuEl) return;

      const pills = gsap.utils.toArray<HTMLElement>('[data-pill]', railEl);

      /* Tween ONLY when `open` itself changed at the same breakpoint;
         otherwise snap.

         Three things animate that never should. The first render. The
         desktop↔mobile handover, because `stacked` is read in an effect and
         so always arrives a render late. And the one that is easy to miss:
         `useGSAP` REVERTS its context on cleanup, so under StrictMode's
         double mount the second run finds the rail back at its CSS size with
         `shown.current` already set — no longer null, and equal to `open`.
         Keying off "have I run before" called that a change and played a
         half-second open→closed on every single load. Keying off whether the
         VALUE moved does not. */
      const changed =
        shown.current !== null && shown.current !== open && shownStacked.current === stacked;
      const snap = !changed;
      shown.current = open;
      shownStacked.current = stacked;

      const tl = gsap.timeline();
      const set = (el: gsap.TweenTarget, vars: gsap.TweenVars, at = 0) =>
        snap ? gsap.set(el, vars) : tl.to(el, vars, at);

      /* ── the row's width ──
         Measured free, then clamped on BOTH axes when shut. Leaving the
         unused axis at `auto` is what knocked the bar off centre: a closed
         rail 500px wide and 0 tall is invisible, but it still occupies 500px
         of the row, so the whole group measured 634px and the visible
         [≡][MENU] sat a quarter of a screen left of the middle. Zero on both
         means the container is exactly the button group when shut and
         exactly the open row when open — and since the container is
         `left-1/2 -translate-x-1/2`, both are centred.

         This is also the tween that re-centres the group CONTINUOUSLY as it
         grows, which is what the recording does. */
      gsap.set(railEl, { width: 'auto', height: 'auto' });
      const fullW = railEl.offsetWidth;
      const fullH = railEl.offsetHeight;
      /* …and back to the state we are animating FROM before tweening.
         Measuring leaves the rail at `auto`, which computes to the OPEN size
         — so `to(fullW)` was a tween to where it already was, and the group
         snapped to its full width in one frame instead of growing. Only
         closing ever animated. */
      gsap.set(railEl, open ? { width: 0, height: 0 } : { width: fullW, height: fullH });
      set(
        railEl,
        open
          ? { width: fullW, height: fullH, duration: 0.55, ease: 'power3.out' }
          : { width: 0, height: 0, duration: 0.45, ease: 'power3.inOut' },
      );

      /* ── the MENU label ──
         Collapses to nothing rather than fading in place: in the recording
         the tile is gone before the first pill has finished arriving. */
      set(
        menuEl,
        {
          width: open ? 0 : menuEl.scrollWidth,
          autoAlpha: open ? 0 : 1,
          duration: open ? 0.28 : 0.4,
          ease: 'power2.out',
        },
        0,
      );

      /* ── the pills ──
         Up from below, in order, one behind the next. `back.out` gives the
         small overshoot the recording has as each one lands. Closing runs
         `from: 'end'` because the video drops the LAST pill first — the row
         unbuilds itself in the order it was built. */
      const hidden = { yPercent: stacked ? 0 : 130, xPercent: stacked ? -30 : 0, autoAlpha: 0 };
      if (snap) {
        gsap.set(pills, open ? { yPercent: 0, xPercent: 0, autoAlpha: 1 } : hidden);
      } else if (open) {
        gsap.set(pills, hidden);
        tl.to(
          pills,
          {
            yPercent: 0,
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: 'back.out(1.6)',
            stagger: 0.07,
          },
          0.05,
        );
      } else {
        tl.to(
          pills,
          { ...hidden, duration: 0.3, ease: 'power2.in', stagger: { each: 0.05, from: 'end' } },
          0,
        );
      }

      /* ── the icon ──
         Two bars at ∓4, sweeping into an ✕. The rotation LEADS the
         convergence — `power3.inOut` on the angle against `power2.inOut` on
         the offset — which is what gives the wedge the recording passes
         through on its way to the cross, rather than two bars sliding
         together and then tilting. */
      const morph = (el: HTMLElement | null, rest: number, angle: number) => {
        if (!el) return;
        if (snap) {
          gsap.set(el, { y: open ? 0 : rest, rotate: open ? angle : 0 });
          return;
        }
        tl.to(el, {
          rotate: open ? angle : 0,
          duration: 0.42,
          ease: 'power3.inOut',
        }, 0);
        tl.to(el, {
          y: open ? 0 : rest,
          duration: 0.42,
          ease: 'power2.inOut',
        }, 0.06);
      };
      morph(barTop.current, -4, 45);
      morph(barBottom.current, 4, -45);
    },
    { scope: root, dependencies: [open, stacked] },
  );

  /* Escape closes it wherever focus is; a click anywhere else does too. The
     bar is fixed over the whole page, so leaving it open and forgotten is
     the likeliest way to end up fighting it. */
  useGSAP(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const away = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', away);
    return () => {
      window.removeEventListener('keydown', key);
      window.removeEventListener('pointerdown', away);
    };
  }, { dependencies: [open] });

  return (
    <div
      ref={root}
      className="fixed left-1/2 z-[56] flex -translate-x-1/2 flex-col-reverse items-center gap-[2px] sm:flex-row sm:items-center"
      style={{ bottom: 'var(--menu-bottom)' }}
    >
      {/* kept together so the column above can rise out of them */}
      <div className="flex items-center gap-[2px]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex shrink-0 items-center rounded-[4px] p-[7px]"
          style={{
            /* the design lifts the close state a step — --bg-raised, not
               --bg-surface — so the way out is not just the way in redrawn */
            background: open ? 'var(--bg-raised)' : 'var(--bg-surface)',
            transition: 'background .25s ease',
          }}
        >
          {/* Two spans rather than the icon SVGs, because the burger and the
              ✕ are the same two bars in different places — drawn as one
              shape they could only cross-fade, and the recording rotates
              them. */}
          <span aria-hidden="true" className="relative block size-[18px]">
            <span ref={barTop} style={{ ...BAR, top: '50%', marginTop: -0.75 }} />
            <span ref={barBottom} style={{ ...BAR, top: '50%', marginTop: -0.75 }} />
          </span>
        </button>

        {/* closed label — collapses to nothing as the rail opens */}
        <div
          ref={menuTile}
          aria-hidden={open}
          /* 238:10151 puts only the icon on a phone — no MENU label beside
             it. Hidden rather than removed so the desktop tween still has an
             element to collapse. */
          className={`${TILE} hidden overflow-hidden sm:flex`}
          style={{ background: 'var(--bg-surface)' }}
        >
          <span className="whitespace-nowrap uppercase" style={LABEL}>Menu</span>
        </div>
      </div>

      {/* The links. `overflow` stays VISIBLE: the width below is animated for
          layout — it is what keeps the group centred while it grows — and
          clipping to it would cut the pills off mid-arrival, which the
          recording plainly does not do. They are hidden by their own
          `autoAlpha`, which takes them out of hit-testing too.

          The closed size is a CLASS, not an inline style: GSAP animates this
          element's inline width/height, and an inline `width: 0` from React
          would be rewritten on every state change and clobber the tween
          mid-flight. A class always loses to GSAP, and still gives the
          server's markup the closed state so nothing flashes open before
          hydration. */}
      <div
        ref={rail}
        className="flex h-0 w-auto flex-col items-stretch gap-[2px] sm:h-auto sm:w-0 sm:flex-row sm:items-center"
      >
        {items.map((item) => (
          <Link
            key={item.label}
            data-pill
            href={item.href}
            tabIndex={open ? undefined : -1}
            aria-current={item.active ? 'page' : undefined}
            className={TILE}
            style={{ background: 'var(--bg-surface)' }}
          >
            {item.active && (
              /* 4px dot on the current page — Figma paints it brand green */
              <span
                aria-hidden="true"
                className="block size-[4px] shrink-0 rounded-full"
                style={{ background: 'var(--green-500)' }}
              />
            )}
            <span className="whitespace-nowrap uppercase" style={LABEL}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
