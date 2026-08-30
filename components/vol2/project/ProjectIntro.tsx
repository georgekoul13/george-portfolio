'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BackLink from '../BackLink';

/**
 * A project page's opening — Figma node 147:11398.
 *
 * The back link and the title, 124 down from the header with 48 between
 * them. The title is 100/100 Montserrat Medium, which is the largest type on
 * the site outside the wordmark itself — `--type-100-100-m`, which is
 * already stepped down to 48 on a phone.
 *
 * Both gaps give on a narrow screen: 124 under an 89px header put the title
 * a third of the way down the first screen with nothing in between.
 *
 * `backTo` is where the arrow returns you: the category you arrived from when
 * that is known, and the home page otherwise.
 */
export default function ProjectIntro({
  title,
  backTo = '/vol2',
}: {
  title: string;
  backTo?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap
        .timeline({ delay: 0.15 })
        .from('[data-back]', { autoAlpha: 0, x: -12, duration: 0.5, ease: 'power3.out' })
        // the same left-to-right uncovering every headline on the site uses
        .fromTo(
          '[data-title]',
          { clipPath: 'inset(-30% 100% -30% 0%)' },
          { clipPath: 'inset(-30% 0% -30% 0%)', duration: 0.9, ease: 'none' },
          '-=0.25',
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
      <BackLink data-back href={backTo} />

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
