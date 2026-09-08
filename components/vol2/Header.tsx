'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import MobileMenu from './MobileMenu';

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { label: 'Product',  href: '/product' },
  { label: 'Graphic',  href: '/graphic' },
  { label: 'Creative', href: '/creative' },
  /* Figma ends this nav on CONTACT, and the home frame on ABOUT. Both are
     gone — George dropped the two pages, and the contact route went to
     `archive/` with them, so the slot would now point at nothing. The three
     categories are the whole nav, which is what `MenuBar` already shows. */
];

/**
 * Vol2 is a parallel surface under `/vol2`, so its nav has to stay inside it
 * — the bare `/product` above is the *live* page, and following it mid-test
 * would drop you out of the build without it being obvious why. Rewritten
 * rather than hard-coded so this file needs no edit on the day vol2 takes
 * over the real routes.
 */
function useNav() {
  const pathname = usePathname() ?? '';
  const vol2 = pathname.startsWith('/vol2');
  return NAV.map((item) => ({
    ...item,
    href: vol2 ? `/vol2${item.href}` : item.href,
    // the category page marks its own entry — Figma paints it brand green
    active: pathname === (vol2 ? `/vol2${item.href}` : item.href),
  }));
}

/**
 * Sticky header.
 *
 * Annotation: "Sticky. On the header after the first viewport it goes up and
 * it's revealed on scroll down" — i.e. it stays put through the first screen,
 * then hides on downward scroll and comes back on upward scroll.
 */
export default function Header() {
  const root = useRef<HTMLElement>(null);
  const nav = useNav();
  const homeHref = (usePathname() ?? '').startsWith('/vol2') ? '/vol2' : '/';

  useGSAP(() => {
    const el = root.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const show = gsap.quickTo(el, 'yPercent', { duration: 0.4, ease: 'power3.out' });

    const trigger = ScrollTrigger.create({
      start: () => window.innerHeight,
      end: 'max',
      onUpdate: (self) => {
        /* Checking the SCROLL POSITION, not just the direction.
           `start` is a whole viewport down, but on a page too short to
           scroll that far ScrollTrigger still fires an update with
           `direction: 1` — which parked the header at -100, entirely off
           screen, on the 404 (max scroll 481 against a start of 800). It
           looked like the header was missing from that page. */
        const past = self.scroll() > window.innerHeight;
        show(past && self.direction === 1 ? -100 : 0);
      },
      onLeaveBack: () => show(0),
    });

    return () => trigger.kill();
  }, { scope: root });

  return (
    <header
      ref={root}
      // above the menu's backdrop (z-55), so the logo and the X stay crisp
      // while the page behind them is dimmed and blurred. The bar itself
      // gives way to the blur while the menu is open — `--header-bg` is
      // switched to transparent by `[data-nav-open]` in globals.css.
      className="fixed inset-x-0 top-0 z-[56] w-full"
      style={{ background: 'var(--header-bg, var(--bg-page))', transition: 'background 0.3s ease' }}
    >
      <div className="flex items-center justify-between px-[var(--gutter)] py-8">
        {/* -my-2.5 py-2.5 gives the link a 44px tap height without moving
            the logo or changing the header's own height. 40.5 is 54 × 24/32 —
            the mark's own ratio, kept so the G and K don't distort. */}
        <Link
          href={homeHref}
          aria-label="George Koulouris — home"
          className="-my-2.5 flex items-center py-2.5"
        >
          <img
            src="/images/vol2/ui/logo.svg"
            alt=""
            className="h-6 w-[40.5px]"
            style={{ color: 'var(--text-primary)' }}
          />
        </Link>

        {/* the inline nav is desktop only; below `lg` it becomes the burger */}
        <nav className="hidden items-center gap-4 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className="uppercase transition-colors duration-200"
              style={{
                font: 'var(--type-16-16-r)',
                color: item.active ? 'var(--green-500)' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!item.active) e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                if (!item.active) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileMenu items={nav} />
      </div>
      <div
        data-header-rule
        className="h-px w-full transition-opacity duration-300"
        style={{ background: 'var(--border-subtle)' }}
      />
    </header>
  );
}
