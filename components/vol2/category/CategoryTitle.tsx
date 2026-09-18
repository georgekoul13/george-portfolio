'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';

gsap.registerPlugin(ScrollTrigger);

/**
 * "All projects (n)" — Figma node 147:11273.
 *
 * It sits below the first viewport, so unlike the headline above it this one
 * waits for the scroll: the intro's reveal has finished by the time anyone
 * gets here.
 *
 * Figma pads this band 80 while every other band on the page is 60, which
 * reads as a slip — at 80 the title sits proud of both the headline above it
 * and the cards below. Kept at 60 so the left edge holds all the way down.
 */
export default function CategoryTitle({ count }: { count: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%' } })
        .fromTo(
          '[data-title]',
          { clipPath: 'inset(-30% 100% -30% 0%)' },
          { clipPath: 'inset(-30% 0% -30% 0%)', duration: 0.7, ease: 'none' },
        )
        .from('[data-count]', { autoAlpha: 0, y: 14, duration: 0.5, ease: 'back.out(2)' }, '-=0.15');
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex w-full items-start gap-2 px-[var(--gutter)]">
      <p
        data-title
        className="whitespace-nowrap"
        style={{ font: 'var(--type-72-80-r)', color: 'var(--text-primary)' }}
      >
        All projects
      </p>
      <span
        data-count
        className="pt-2"
        style={{ font: 'var(--type-24-24-m)', color: 'var(--green-500)' }}
      >
        ({count})
      </span>
    </div>
  );
}
