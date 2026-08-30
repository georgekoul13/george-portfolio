'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { CardProject } from './categories';

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

const GAP = 40;
const LARGE_ASPECT = '640 / 480';
const MEDIUM_ASPECT = '1240 / 960'; // 413.33 × 320

/**
 * The blurred pill on the artwork — Figma 147:9507.
 *
 * Figma fills it with the category, but on a category page that is the one
 * thing already known, so it carries the project's sector instead — see
 * `TAGS` in `categories.ts`. Same pill, different word.
 */
function CategoryChip({ label }: { label: string }) {
  return (
    <span
      className="relative shrink-0 self-start uppercase"
      style={{
        font: 'var(--type-12-16-r)',
        color: 'var(--text-primary)',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        padding: '8px 12px',
      }}
    >
      {label}
    </span>
  );
}

function Card({ project, large }: { project: CardProject; large: boolean }) {
  return (
    <Link
      data-card
      href={`/vol2/projects/${project.slug}`}
      className="group flex min-w-0 flex-col items-start"
      style={{ gap: large ? 24 : 20 }}
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
          <CategoryChip label={project.tag} />
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

  /* Rows of three, so a remainder doesn't stretch across the full width.
     A remainder of exactly one is the bad case — a single medium card
     stranded on the left of an empty row — so the last two rows are
     rebalanced into 2 + 2 instead. Product's nine projects hit this: seven in
     the tail would run 3 / 3 / 1, and now run 3 / 2 / 2. */
  const rows: CardProject[][] = [];
  for (let i = 0; i < rest.length; i += 3) rows.push(rest.slice(i, i + 3));
  if (rows.length > 1 && rows[rows.length - 1].length === 1) {
    const orphan = rows.pop()!;
    const prev = rows.pop()!;
    rows.push(prev.slice(0, 2), [prev[2], ...orphan]);
  }

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
      <div className="flex flex-col" style={{ gap: GAP + 40 }}>
        {featured.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: GAP }}>
            {featured.map((p) => (
              <Card key={p.slug} project={p} large />
            ))}
          </div>
        )}

        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" style={{ gap: GAP }}>
            {row.map((p) => (
              <Card key={p.slug} project={p} large={false} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
