'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Vol2 cursor.
 *
 * Same behaviour as the cursor on the live site — a small ring that trails the
 * pointer with a little weight, and swells with a faint fill over anything
 * clickable — rebuilt on GSAP and the token palette. Vol2 carries no
 * framer-motion, and the v1 component hard-codes the v1 cream, so it is
 * reimplemented rather than reused.
 */

const RING = 12;
const RING_HOVER = 32;

/**
 * The cursor is `position: fixed` on the body, so it sits OUTSIDE every
 * `[data-tone='light']` subtree and `var(--text-primary)` always resolves to
 * the page-level (dark) value — cream. Over the cream about panel that is
 * cream on cream, and the cursor simply disappears.
 *
 * So the ink is chosen per-tone here rather than inherited. George asked for
 * dark grey rather than the tone's own near-black `--text-primary`: at 12px
 * a pure black ring reads as a dot of dirt on the cream, where a grey reads
 * as a cursor.
 */
const INK = {
  dark:  'var(--neutral-50)',
  light: 'var(--neutral-700)',
} as const;
const CLICKABLE =
  'a, button, [role="button"], label, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  /** rendered only for real pointers; touch has nothing to trail */
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(
      window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  }, []);

  useGSAP(
    () => {
      const el = ring.current;
      if (!fine || !el) return;

      // parked off-screen until the pointer first moves
      gsap.set(el, { x: -100, y: -100, xPercent: -50, yPercent: -50 });

      // quickTo gives the same weighted drag as the v1 spring
      const xTo = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3' });

      let over = false;
      let light = false;
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);

        const target = e.target as Element | null;

        /* `e.target` is already the topmost element under the pointer — the
           cursor itself is `pointer-events: none`, so it never shadows it —
           which makes this a free read rather than an `elementFromPoint`
           hit-test on every move. It also gets the STACKING right for free:
           while the categories panel rides up over the cream one, the target
           is whichever is actually on top. */
        const onLight = !!target?.closest?.('[data-tone="light"]');
        if (onLight !== light) {
          light = onLight;
          const ink = onLight ? INK.light : INK.dark;
          /* Colour is set rather than tweened: GSAP cannot interpolate a
             custom property, and a 0.18s crossfade between two inks reads as
             a smear on something this small anyway. */
          el.style.borderColor = `color-mix(in srgb, ${ink} 70%, transparent)`;
          if (fill.current) fill.current.style.background = ink;
        }

        const hit = !!target?.closest?.(CLICKABLE);
        if (hit === over) return;
        over = hit;
        // the fill is its own element so we tween opacity — GSAP can't
        // interpolate a color-mix() built on a custom property
        gsap.to(el, {
          width: hit ? RING_HOVER : RING,
          height: hit ? RING_HOVER : RING,
          duration: 0.18,
          ease: 'power2.out',
        });
        gsap.to(fill.current, { opacity: hit ? 0.1 : 0, duration: 0.18, ease: 'power2.out' });
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      return () => window.removeEventListener('pointermove', onMove);
    },
    { dependencies: [fine] },
  );

  if (!fine) return null;

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 rounded-full"
      style={{
        zIndex: 999999,
        width: RING,
        height: RING,
        border: `1.5px solid color-mix(in srgb, ${INK.dark} 70%, transparent)`,
      }}
    >
      <span
        ref={fill}
        className="absolute inset-0 rounded-full"
        style={{ background: INK.dark, opacity: 0 }}
      />
    </div>
  );
}
