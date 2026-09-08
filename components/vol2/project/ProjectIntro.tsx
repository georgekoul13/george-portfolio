'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * A project page's opening — Figma node 147:11398.
 *
 * Just the title now — 100/100 Montserrat Medium, the largest type on the
 * site outside the wordmark itself, stepped down to 48 on a phone.
 *
 * The BACK LINK that used to sit above it is gone. George: *"the back link
 * should now be here — it's not in the design I gave you."* 262:9599 opens
 * on the title, and the menu has carried its own back tile since 238:6401,
 * so the page was offering the same way out twice.
 */
export default function ProjectIntro({ title }: { title: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // the same left-to-right uncovering every headline on the site uses
      gsap.fromTo(
        '[data-title]',
        { clipPath: 'inset(-30% 100% -30% 0%)' },
        { clipPath: 'inset(-30% 0% -30% 0%)', duration: 0.9, ease: 'none', delay: 0.15 },
      );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="flex w-full flex-col items-start gap-8 px-[var(--gutter)] xl:gap-12"
      style={{ paddingTop: 'var(--project-intro-top)' }}
    >
      <h1
        data-title
        className="uppercase"
        style={{ font: 'var(--type-100-100-m)', color: 'var(--text-primary)' }}
      >
        {title}
      </h1>
    </div>
  );
}
