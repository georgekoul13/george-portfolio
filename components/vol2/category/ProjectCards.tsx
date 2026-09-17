'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { CardProject } from './categories';
import Chip from '../Chip';
import Picture from '../project/Picture';

import '../scrollDefaults';

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
/* The medium shape is the ONLY one below `md` — the large card's 640/480
   lives in `--card-aspect`, which `tokens.css` defines from that breakpoint
   up. See the note on `Card`. */
const MEDIUM_ASPECT = '1240 / 960'; // 413.33 × 320

/**
 * ── ONE CARD BELOW `md`, TWO ABOVE IT ────────────────────────────────
 * George, on the category page on a phone: *"all the project cards should
 * have the same ui (similar to the 2nd one in the screenshot)."*
 *
 * The `large` treatment exists because the design gives the first two
 * projects a whole row each at desktop width, where a bigger card earns
 * bigger type. On a phone EVERY card is already full width, so `large` was
 * not making a card larger — it was only making its title and its line
 * bigger than the identical cards under it, for no reason the reader can
 * see. Two cards the same size with different type reads as a mistake.
 *
 * So the distinction is a breakpoint now rather than a prop: the same
 * component, sized up only where the layout actually differs. `md` is where
 * the grid stops being one column.
 */
export function Card({ project, large }: { project: CardProject; large: boolean }) {
  return (
    <Link
      data-card
      href={`/vol2/projects/${project.slug}`}
      className="group flex min-w-0 flex-col items-start"
      style={{ gap: large ? 'var(--card-gap-large)' : 'var(--card-gap)' }}
    >
      <span
        className="relative block w-full overflow-hidden"
        /* A TONE UNDER THE PICTURE. George, on the creative page: *"tarot
           card on creative page it's still empty."* Nothing is broken — that
           card is a 3.87MB PNG being re-encoded on demand, which takes over
           five seconds cold for the variant a large card asks for, and until
           it lands the box is the page's own black and reads as a hole.
           The project pages got this tone already; the cards were missed. */
        style={{
          /* the two are within 3% of each other; below `md` they are one */
          aspectRatio: large ? `var(--card-aspect, ${MEDIUM_ASPECT})` : MEDIUM_ASPECT,
          background: 'var(--bg-raised)',
        }}
      >
        {/* `sizes` follows this card's own grid: the large variant runs one
            up until 1200 then two, the medium one up until 900, two, then
            three at 1200.

            MEASURED, not assumed. These read 50/33/100vw and the real boxes
            are 0.444, 0.287 and 0.90 of the viewport — the difference is the
            page gutter and the grid gap, which a `vw` fraction quietly
            ignores. Overstating the width makes the browser step up to the
            next candidate in the srcset and download a size nobody asked
            for, which on a phone is the difference between a 1200 and a 1920.
            Rounded UP from the measurement, so a wider gutter at some future
            breakpoint still gets enough pixels. */}
        <Picture
          src={project.image}
          alt=""
          /* MEASURED, not assumed. These read 50/33/100vw and the real boxes
             are 0.444, 0.287 and 0.90 of the viewport — the difference is the
             page gutter and the grid gap, which a `vw` fraction quietly
             ignores. */
          sizes={
            large
              ? '(min-width: 1200px) 45vw, 90vw'
              : '(min-width: 1200px) 29vw, (min-width: 900px) 45vw, 90vw'
          }
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <span className="relative flex h-full flex-col items-start p-4">
          <Chip label={project.tag} />
        </span>
      </span>

      <span className="flex w-full flex-col items-start gap-2">
        <span
          className="w-full uppercase"
          style={{
            /* the large step is a `md:` token, so a phone gets one size */
            font: large ? 'var(--card-title, var(--type-16-20-b))' : 'var(--type-16-20-b)',
            color: 'var(--text-primary)',
          }}
        >
          {project.title}
        </span>
        <span
          className="w-full"
          style={{
            font: large ? 'var(--card-line, var(--type-14-20-r))' : 'var(--type-14-20-r)',
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
