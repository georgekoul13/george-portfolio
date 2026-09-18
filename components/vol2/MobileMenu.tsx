'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The burger menu — GSAP's "timeline clear and rebuild" demo
 * (codepen.io/GreenSock/pen/raMQBVQ), its structure and its numbers.
 *
 * The pattern is the point: ONE timeline, `.clear()`ed and rebuilt on every
 * toggle, so opening and closing are not the same animation played
 * backwards. Opening is built from `fromTo` tweens, which means every open
 * starts from a known state no matter what the last close left behind.
 * Closing is built from `to` tweens, which means it leaves from wherever
 * things actually are — including mid-open, if you hit the button twice.
 *
 * The demo's signature is the exit: the panels do not slide back out, they
 * fall past the bottom of the screen with a random tumble, staggered from
 * the end so the last one in is the first one gone.
 *
 * One adaptation. The demo has three panels of mixed content; here each nav
 * item IS a panel, which suits both halves of the animation — four bars
 * dealt in from the right on open, four cards dropped and tumbling on close.
 * It also means the stagger reads as the menu rather than as decoration, so
 * it is quicker than the demo's 0.2.
 *
 * THE SHEET IS PORTALLED, and it has to be. The header hides on scroll by
 * tweening its `yPercent`, and **a transformed element becomes the
 * containing block for its `position: fixed` descendants** — so a sheet
 * rendered inside the header resolved `inset-0` against the *header*, not
 * the viewport. It measured 375 × 89. The panels still showed, because
 * nothing clips them, but the blurred backdrop was 89px tall: the top strip
 * blurred and the whole page below it stayed sharp. Portalling to `body`
 * puts the sheet back on the viewport. The cost is that GSAP's scoped
 * selector strings no longer reach it — a portal is not a DOM descendant of
 * `root` — so the timeline addresses it by element instead.
 */

/** the burger's two moving bars, in their resting horizontal positions */
const BAR_TOP = { x1: 3, y1: 7, x2: 17, y2: 7 };
const BAR_BOT = { x1: 3, y1: 13, x2: 17, y2: 13 };
/** …and as the two strokes of an X */
const X_TOP = { x1: 5, y1: 5, x2: 15, y2: 15 };
const X_BOT = { x1: 15, y1: 5, x2: 5, y2: 15 };

export default function MobileMenu({
  items,
}: {
  items: { label: string; href: string; active: boolean }[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>();
  const [open, setOpen] = useState(false);
  /* the portal target only exists in the browser, so the sheet joins on the
     first client render rather than during SSR */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /** the sheet's own parts, since scoped selector strings can't cross a portal */
  const part = (sel: string) =>
    gsap.utils.toArray<HTMLElement>(sheet.current?.querySelectorAll(sel) ?? []);

  const { contextSafe } = useGSAP(
    () => {
      tl.current = gsap.timeline();
    },
    { scope: root },
  );

  /**
   * While the menu is open the page underneath must not move.
   *
   * Deliberately NOT `overflow: hidden` on the body: this page is pinned by
   * ScrollTrigger in several places, and taking the scrollbar away forces a
   * refresh that jumps the pinned sections. Swallowing the scroll input
   * instead leaves the scroll position, the layout and every trigger exactly
   * as they were.
   *
   * `data-nav-open` on the root is the same switch seen from CSS — see
   * `globals.css`, where it drops the header's opaque bar so the blur runs
   * to the top of the screen instead of stopping under it.
   */
  useEffect(() => {
    const html = document.documentElement;
    if (!open) {
      delete html.dataset.navOpen;
      return;
    }
    html.dataset.navOpen = '';
    const swallow = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', swallow, { passive: false });
    window.addEventListener('touchmove', swallow, { passive: false });
    return () => {
      delete html.dataset.navOpen;
      window.removeEventListener('wheel', swallow);
      window.removeEventListener('touchmove', swallow);
    };
  }, [open]);

  const openMenu = () => {
    tl.current!
      .set(sheet.current, { visibility: 'visible', pointerEvents: 'auto' })
      .fromTo(part('[data-nav-bg]'), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
      .fromTo(
        part('[data-nav-panel]'),
        { x: '101%', y: 0, rotation: 0 },
        { x: '0%', duration: 0.6, ease: 'back.out', stagger: 0.08 },
        0,
      )
      .fromTo(
        part('[data-nav-label]'),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'expo.out', stagger: 0.03 },
        0.1,
      )
      .fromTo(
        '[data-bar-top]',
        { attr: BAR_TOP },
        { attr: X_TOP, duration: 0.35, ease: 'back.out(1.4)' },
        0.06,
      )
      .fromTo(
        '[data-bar-bot]',
        { attr: BAR_BOT },
        { attr: X_BOT, duration: 0.35, ease: 'back.out(1.4)' },
        0.06,
      )
      .fromTo('[data-bar-mid]', { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.06);
  };

  const closeMenu = () => {
    tl.current!
      .to('[data-bar-top]', { attr: BAR_TOP, duration: 0.2, ease: 'power3.in' })
      .to('[data-bar-bot]', { attr: BAR_BOT, duration: 0.2, ease: 'power3.in' }, '<')
      .to('[data-bar-mid]', { opacity: 1, duration: 0.2 }, '<')
      // the panels fall, last one in leaving first
      .to(
        part('[data-nav-panel]'),
        {
          y: '160vh',
          rotation: 'random(-15, 15)',
          duration: 1,
          ease: 'power3.in',
          stagger: { from: 'end', each: 0.04 },
        },
        '<',
      )
      .to(part('[data-nav-bg]'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<0.1')
      // put it out of reach again once it has left, not before
      .set(sheet.current, { visibility: 'hidden', pointerEvents: 'none' });
  };

  const toggle = contextSafe(() => {
    const next = !open;
    setOpen(next);
    /* Clear before rebuilding, so a second press mid-flight leaves from
       wherever the panels have actually got to rather than snapping. */
    tl.current!.clear();
    if (next) openMenu();
    else closeMenu();
  });

  const sheetMarkup = (
    <div
      ref={sheet}
      data-nav-sheet
      className="fixed inset-0 z-[55] lg:hidden"
      style={{ visibility: 'hidden', pointerEvents: 'none', overscrollBehavior: 'contain' }}
    >
      <div
        data-nav-bg
        onClick={toggle}
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', opacity: 0 }}
      />

      {/* clears the 89px header with the same 15px breathing room it had
          when the header was 97 */}
      <nav className="absolute inset-x-0 top-0 flex flex-col gap-2 px-[var(--gutter)] pt-[104px]">
        {items.map((item) => (
          <div
            key={item.label}
            data-nav-panel
            /* The padding lives on the LINK, not here. On the panel it made
               the pill 335 x 72 while the tappable `<a>` inside was only
               287 x 32 — so the 20px band top and bottom and the 24 either
               side looked like button and did nothing. Both elements have
               to stay: the panel and the label are animated separately
               (see `part()` above). */
            className="w-full overflow-hidden rounded-2xl"
            style={{ background: 'var(--bg-inverse)' }}
          >
            <Link
              data-nav-label
              href={item.href}
              onClick={toggle}
              tabIndex={open ? 0 : -1}
              aria-current={item.active ? 'page' : undefined}
              className="block px-6 py-5 uppercase"
              style={{
                font: 'var(--type-32-32-m)',
                color: item.active ? 'var(--green-500)' : 'var(--text-inverse)',
              }}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div ref={root} className="contents">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        /* p-2.5 makes the 24px glyph a 44px tap target; the matching -m-2.5
           keeps that padding out of the layout, so the header stays the
           height Figma draws instead of growing by 20. */
        className="relative z-[60] -m-2.5 block p-2.5 lg:hidden"
        style={{ color: 'var(--text-primary)' }}
      >
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <line data-bar-top {...BAR_TOP} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line data-bar-mid x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line data-bar-bot {...BAR_BOT} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {mounted && createPortal(sheetMarkup, document.body)}
    </div>
  );
}
