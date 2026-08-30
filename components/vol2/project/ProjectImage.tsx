'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

/**
 * The full-width stills — Figma "Hero Image Frame", 1320 × 640 inside the
 * page's 60px gutters. Given an aspect rather than its fixed height so the
 * picture keeps its proportions at any width, and that aspect is a token:
 * 2.06:1 inside a 335px phone column is a 162px letterbox strip, so it
 * squares up to 3:2 there. See `--project-still`.
 *
 * The image arrives by being uncovered from below and drifting up behind its
 * own frame, which is the closest thing in this template to the wipe the
 * headlines use — nothing slides in from outside the layout.
 */
export default function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%' } })
        .from(root.current, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1, ease: 'power3.out' })
        .from('[data-inner]', { scale: 1.12, duration: 1.2, ease: 'power3.out' }, 0);
    },
    { scope: root },
  );

  return (
    <div className="w-full px-[var(--gutter)]">
      <div
        ref={root}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: 'var(--project-still)', clipPath: 'inset(0% 0% 0% 0%)' }}
      >
        {/* `next/image`, not `<img>`: these are the 1440x1080 source files
            and were being shipped whole to a 375 phone. `fill` because the
            box is an aspect-ratio well, and `sizes` because without it
            `fill` assumes 100vw at every breakpoint and picks the largest
            candidate anyway. GSAP animates this element's `scale`, which is
            a transform and so does not fight the inline `position` that
            `fill` sets. */}
        <Image
          data-inner
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
