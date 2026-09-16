'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { CardProject } from './categories';
import Chip from '../Chip';

import '../scrollDefaults';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

/**
 * A category's projects — Figma "PROJECT CARDS", node 147:11278, with the
 * Large and Medium cards from 145:6478 and 145:6497.
 *
 * Figma draws two large cards and then a row of three medium ones, and
 * labels the count "(6)" while showing five — so the layout is a rule, not a
 * literal: the first two projects are large, everything after them runs in
 * rows of three. That holds for a category of two as well as one of nine.
 *
 * Widths come from the 1320 content width and a 40px gutter: 2 × 640, then
 * 3 × 413.33. Expressed as fractions so the grid keeps its proportions, with
 * the image slots given the design's aspect rather than its fixed 480 / 320
 * heights for the same reason.
 *
 * The column counts drop on a narrow window rather than letting the cards
 * keep shrinking. The chip on the artwork is a fixed 32px in Figma — the same
 * size on both card sizes — so a card that shrinks without it makes the chip
 * look enormous: at 900px wide a medium card fell to 233 and the chip went
 * from the design's 22% of its width to 37%. Fewer, larger cards keeps every
 * part in the proportion it was drawn at.
 */

/* the numbers themselves live in `--cards-gap` / `--cards-row-gap` */
const LARGE_ASPECT = '640 / 480';
const MEDIUM_ASPECT = '1240 / 960'; // 413.33 × 320

function Card({ project, large }: { project: CardProject; large: boolean }) {
  return (
    <Link
      data-card
      href={`/vol2/projects/${project.slug}`}
      className="group flex min-w-0 flex-col items-start"
      style={{ gap: large ? 'var(--card-gap-large)' : 'var(--card-gap)' }}
    >
      <span
        className="relative block w-full overflow-hidden"
        style={{ aspectRatio: large ? LARGE_ASPECT : MEDIUM_ASPECT }}
      >
        {/* `sizes` follows this card's own grid: the large variant runs one
            up until 1200 then two, the medium one up until 900, two, then
            three at 1200. */}
        <Image
          src={project.image}
          alt=""
          fill
          sizes={
            large
              ? '(min-width: 1200px) 50vw, 100vw'
              : '(min-width: 1200px) 33vw, (min-width: 900px) 50vw, 100vw'
          }
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <span className="relative flex h-full flex-col items-start p-4">
          <Chip label={project.tag} />
        </span>
      </span>

      <span className="flex w-full flex-col items-start gap-2">
        <span
          className="w-full uppercase"
          style={{
            font: large ? 'var(--type-24-24-b)' : 'var(--type-16-20-b)',
            color: 'var(--text-primary)',
          }}
        >
          {project.title}
        </span>
        <span
          className="w-full"
          style={{
            font: large ? 'var(--type-16-24-r)' : 'var(--type-14-20-r)',
            color: 'var(--text-secondary)',
          }}
        >
          {project.subtitle}
        </span>
      </span>
    </Link>
  );
}

export default function ProjectCards({ projects }: { projects: CardProject[] }) {
  const root = useRef<HTMLElement>(null);

  const featured = projects.slice(0, 2);
  const rest = projects.slice(2);

  /* The tail is ONE grid that flows, not a list of hand-cut rows.
     
     It used to be chunked into threes, and a remainder of exactly one was
     rebalanced into 2 + 2 to avoid stranding a single card — Product's seven
     ran 3 / 2 / 2 rather than 3 / 3 / 1. That trades one ragged row for two:
     George, looking at it, *"let's have rows of 3 instead of having all these
     big gaps in the right."* Letting the grid flow puts every row at three
     and leaves the remainder where a grid always leaves it, in the last row
     only. */

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
        gsap.from(card, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="w-full px-[var(--gutter)] py-20">
      {/* Both gaps are TOKENS, not inline numbers: an inline gap beats a
          stylesheet rule, and below `lg` these two have to become equal —
          see `--cards-row-gap`. */}
      <div className="flex flex-col" style={{ gap: 'var(--cards-row-gap)' }}>
        {featured.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: 'var(--cards-gap)' }}>
            {featured.map((p) => (
              <Card key={p.slug} project={p} large />
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            /* Across, the cards are `--cards-gap` apart; DOWN, they keep the
               `--cards-row-gap` the hand-cut rows had between them, so the
               rhythm is unchanged and only the ragged edges are gone. Below
               `lg` the two are equal anyway — see the token. */
            style={{ columnGap: 'var(--cards-gap)', rowGap: 'var(--cards-row-gap)' }}
          >
            {rest.map((p) => (
              <Card key={p.slug} project={p} large={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
