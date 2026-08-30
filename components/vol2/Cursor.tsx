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
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);

        const target = e.target as Element | null;
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
        border: '1.5px solid color-mix(in srgb, var(--text-primary) 70%, transparent)',
      }}
    >
      <span
        ref={fill}
        className="absolute inset-0 rounded-full"
        style={{ background: 'var(--text-primary)', opacity: 0 }}
      />
    </div>
  );
}
