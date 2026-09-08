'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

/**
 * The closing trio — Figma node 147:11407.
 *
 * Three 413.33-wide columns 40 apart, each a 420-tall still over a small
 * uppercase caption. Figma numbers the captions "01 /", "02 /" … so the
 * numbering is generated here rather than written into the content.
 *
 * The column count drops rather than the columns shrinking. Three across a
 * 375 phone made each shot 85 × 130 — a contact sheet, not a gallery. One
 * across gives it the full 335, and the middle band gets two.
 */
const ASPECT = '1240 / 1422'; // 413.33 × 474, per 262:12152

export default function ProjectGalleryRow({
  images,
}: {
  images: { src: string; caption: string }[];
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from('[data-shot]', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 85%' },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="grid w-full grid-cols-1 gap-8 px-[var(--gutter)] md:grid-cols-2 md:gap-10 lg:grid-cols-3"
    >
      {images.map((shot, i) => (
        <figure data-shot key={shot.src + i} className="m-0 flex min-w-0 flex-col gap-4 md:gap-6">
          {/* `relative` so `fill` has a containing block. `sizes` mirrors
              the grid above it — one up, then two at 600, then three at
              900 — so a phone fetches a phone-sized file. */}
          <span
            className="relative block w-full overflow-hidden"
            style={{ aspectRatio: ASPECT }}
          >
            <Image
              src={shot.src}
              alt=""
              fill
              sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
              className="object-cover"
            />
          </span>
          <figcaption
            className="uppercase"
            style={{ font: 'var(--type-14-20-r)', color: 'var(--text-tertiary)' }}
          >
            {String(i + 1).padStart(2, '0')}
            {shot.caption ? ` / ${shot.caption}` : ''}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
