'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/vol2/Avatar';
import Ticker from '@/components/vol2/Ticker';
import { BACK_TILE, BACK_STYLE, BackGlyph } from '@/components/vol2/MenuBar';
import { VOL2_HOME } from '../surface';

/**
 * The 404 — Figma 398:17326.
 *
 * Shared by the preview route and by `not-found.tsx`, so a mistyped URL and a
 * `notFound()` thrown inside a page land on exactly the same screen.
 *
 * ── what it replaces ──────────────────────────────────────────────────
 * The previous one was 147:15098: the dark page, a header, and an enormous
 * numeral filling the frame. This is the opposite — the CREAM page, the hero
 * ribbon along the top, the drawing in the middle of it and one line under
 * him. The numeral is gone entirely; the page no longer announces a code at
 * all, it just says something went wrong.
 *
 * ── he is ASLEEP, and cannot be woken ─────────────────────────────────
 * George: *"put the sleeping version without waking it up — cuz in the error
 * state everything sleeps."* Not the idle doze on a short fuse: `sleeping`
 * builds the rig and then arms nothing, so there is no cursor to follow, no
 * tilt to answer, no tap that stirs him and no timer to expire. See `Avatar`.
 *
 * It is also the one page where that reads as meaning rather than as charm —
 * everywhere else he is asleep because you stopped moving, here because the
 * thing you asked for is not there.
 *
 * ── one control, and it goes BACK ─────────────────────────────────────
 * George: *"in the menu icon put the back button."* The design draws the
 * menu tile at the bottom; a menu is the wrong offer on a dead end, because
 * every one of its destinations is a fresh decision and the reader only
 * wanted the page they already had. So the same tile carries the back arrow
 * instead — the very component `MenuBar` uses, not a copy of it.
 *
 * A `<Link>` home rather than a history step, unlike the one in `MenuBar`. A
 * 404 is very often the FIRST page of a visit — a stale link, a typo, a URL
 * that moved — and `history.back()` there returns to whatever sent them,
 * which is the one place they have already left.
 *
 * ── why this is a CLIENT component, and why the SVG arrives twice over ─
 * The rig needs the drawing INLINE — nothing inside an `<img>` is reachable —
 * and everywhere else on the site a server component reads it off disk and
 * passes the markup down. That cannot happen here: `app/not-found.tsx` is
 * `'use client'` (it branches on `usePathname`, because Next 14.2 will not
 * fire a nested `not-found.tsx` for a `notFound()` thrown in a dynamic
 * segment), so anything it renders is client-bundled and `node:fs` fails to
 * build.
 *
 * So the markup is a PROP when a server can supply it — the `/vol2/404`
 * preview route does — and is fetched once on mount when it cannot. The file
 * is 20KB of static public asset behind the browser's own cache, and the
 * drawing is the only thing waiting on it.
 */
export default function NotFoundContent({ svg: given }: { svg?: string }) {
  const [svg, setSvg] = useState(given ?? '');

  useEffect(() => {
    if (given) return;
    let live = true;
    fetch('/images/vol2/avatar/george.svg')
      .then((r) => r.text())
      .then((t) => live && setSvg(t))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [given]);

  return (
    /* `data-tone="light"` rather than hard-coded cream: the design calls this
       `--bg/inverse`, but that is Figma naming the role from a dark artboard.
       The tone flip re-maps every semantic token, so `--bg-page` IS the cream
       here and `--text-primary` the dark ink — the same trick `ProjectBase`
       uses. Match the appearance, not the name. */
    <div
      data-vol2
      data-tone="light"
      className="min-h-[100lvh]"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* The ribbon is the page's own, not a header — 398:17327 draws it hard
          against the top edge with nothing above it. */}
      <Ticker />

      <main
        className="flex w-full flex-col items-center justify-center px-[var(--gutter)]"
        style={{
          /* the ribbon's height comes off, so the drawing is centred in what
             is left rather than in the window */
          minHeight: 'calc(100lvh - var(--ticker-h))',
          gap: 48,
          paddingBlock: 'clamp(80px, 12vh, 200px)',
        }}
      >
        {/* 499.91 wide in the design, kept as a ceiling rather than a fixed
            size so a phone gets the same drawing scaled down.

            The box is held even before the markup lands, so the line and the
            button do not jump when it does. */}
        <div className="w-full max-w-[500px]">
          {svg ? <Avatar svg={svg} sleeping /> : <div className="aspect-[500/601]" />}
        </div>

        <p
          className="text-center"
          style={{
            font: 'var(--type-32-40-b)',
            color: 'var(--text-primary)',
            maxWidth: 792,
          }}
        >
          Something went wrong!
        </p>

        {/* `data-tone="dark"` so this reads as the control it is. The page
            is cream, and a tile drawn with `--bg-raised` inside a light
            subtree comes out cream-on-cream — which is how it first shipped,
            and it looked nothing like the one the inner pages float over
            their dark panels. The tone flip gives this one element the dark
            mapping back, so it is the same tile, not a lookalike. */}
        <span data-tone="dark">
          <Link href={VOL2_HOME} className={BACK_TILE} style={BACK_STYLE} aria-label="Back to home">
            <BackGlyph />
          </Link>
        </span>
      </main>
    </div>
  );
}
