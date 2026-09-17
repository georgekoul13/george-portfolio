'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import Chip from '../Chip';
import ProjectImage from './ProjectImage';
import VideoSources from './VideoSources';
import type { Block, Cell } from './blocks';

gsap.registerPlugin(ScrollTrigger);

/**
 * The body of a project — Figma 366:11793, the panel.
 *
 * Three kinds of block, drawn exactly as the design draws them:
 *
 *   text   chip, then a paragraph across the whole 1320
 *   media  one still or one loop, full width — `ProjectImage` decides which
 *   split  chip, then a 432 column of words and 840 of pictures beside it
 *
 * Every chip carries `data-chip` so `ProjectHeader` can read out the section
 * you are in without either component knowing about the other's markup.
 *
 * ── the stills WRAP; they are not rows ────────────────────────────────
 * Figma lays the 840 column out as a wrap: every slot is either 400 wide or
 * 840, they run left to right, and a row ends when the next one will not
 * fit. Two 400s make a row with the 40 gap between them; an 840 takes a row
 * to itself; and a 400 with nothing after it STAYS 400 and sits at the left
 * of its own row.
 *
 * That last case is the one this got wrong. The old code took a list of rows
 * and derived the aspect from the count — one in the row meant 840x400 — so
 * Gaspar's eleventh brand still, a phone screenshot, was stretched into a
 * letterbox. George: *"in the case of one image here on the row it should be
 * like this"*, pointing at Figma 352:5061, which is 400x400 and alone.
 *
 * Flex wrap reproduces the whole rule with no counting: each cell asks for
 * its own share and the browser breaks the lines. Nothing here knows how
 * many rows there are, which is exactly why it cannot get them wrong.
 */

/** one slot — a still or a loop, at the proportion the design drew it */
function Slot({ cell, alt }: { cell: Cell; alt: string }) {
  return (
    <div
      data-still
      className="relative min-w-0 overflow-hidden"
      /* `--still-cell` is 100% on a phone and half-the-column-minus-the-gap
         above it, so the wrap goes to one-up where a 400 would be too small
         to read. A span-2 slot is the whole column at every width. */
      style={{ width: cell.span === 2 ? '100%' : 'var(--still-cell)', aspectRatio: cell.aspect }}
    >
      {cell.kind === 'video' ? (
        <video
          poster={cell.poster}
          aria-label={cell.alt ?? alt}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <VideoSources src={cell.src} sources={cell.sources} />
        </video>
      ) : (
        <Image
          src={cell.src!}
          alt={cell.alt ?? alt}
          fill
          sizes="(min-width: 1200px) 40vw, (min-width: 600px) 45vw, 100vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

function Stills({ cells, alt }: { cells: Cell[]; alt: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(gsap.utils.toArray('[data-still]', root.current), {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 85%' },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="flex w-full flex-wrap content-start"
      style={{ gap: 'var(--project-row-gap)' }}
    >
      {cells.map((c, i) => (
        <Slot key={(c.src ?? c.sources?.webm ?? c.sources?.mp4 ?? '') + i} cell={c} alt={alt} />
      ))}
    </div>
  );
}

/**
 * The arrow that leads each line of a section's list — Figma
 * `icon/arrow-down-right`, drawn rather than fetched so it takes the tone's
 * ink like the words next to it instead of shipping a second colour.
 */
function ArrowDownRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="mt-[3px] shrink-0"
    >
      <path
        d="M5.25 5.25L12.75 12.75M12.75 5.25V12.75H5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The paragraph, and under it the arrow-led lines some sections carry.
 *
 * THREE SIZES, and they are a hierarchy George set rather than one the file
 * already had:
 *
 *   display    **72/80** — the Overview, and only the Overview
 *   statement  **56/64** — every other full-width section
 *   body       **24/32 Medium**, 5% tracking — beside the pictures
 *
 * *"overview 72 and the rest 56, keep 24/32 near images."* His canvas sets
 * every full-width box at 72, Overview and Challenge alike, so the middle
 * step is new. Without it the page opens at full volume and never comes
 * down, and the Overview stops being the thing you read first.
 *
 * An earlier bug had all three at 24/32, which made the opening statement of
 * every project the size of a caption.
 */
function Words({
  text,
  bullets,
  size = 'body',
}: {
  text: string;
  bullets?: string[];
  size?: 'display' | 'statement' | 'body';
}) {
  const font =
    size === 'display'
      ? { font: 'var(--type-72-80-r)' }
      : size === 'statement'
        ? { font: 'var(--type-56-64-r)' }
        : { font: 'var(--type-24-32-m)', letterSpacing: '1.2px' };
  return (
    <>
      <p style={{ ...font, color: 'var(--text-primary)' }}>
        {text}
      </p>
      {bullets?.length ? (
        <ul className="flex flex-col" style={{ gap: 8, color: 'var(--text-primary)' }}>
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start" style={{ gap: 8 }}>
              <ArrowDownRight />
              <span style={{ font: 'var(--type-16-24-r)' }}>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default function ProjectBlocks({ blocks, alt }: { blocks: Block[]; alt: string }) {
  return (
    <div className="flex w-full flex-col" style={{ gap: 'var(--project-block-gap)' }}>
      {blocks.map((b, i) => {
        if (b.kind === 'media') {
          return (
            <ProjectImage
              key={i}
              src={b.src}
              sources={b.sources}
              poster={b.poster}
              alt={b.alt ?? alt}
            />
          );
        }

        if (b.kind === 'text') {
          return (
            <section
              key={i}
              className="flex w-full flex-col px-[var(--gutter)]"
              style={{ gap: 'var(--project-chip-gap)' }}
            >
              {b.chip && (
                <span data-chip={b.chip} className="inline-flex self-start">
                  <Chip label={b.chip} />
                </span>
              )}
              <div className="flex w-full flex-col" style={{ gap: 24 }}>
                <Words text={b.text} bullets={b.bullets} size={b.display ? 'display' : 'statement'} />
              </div>
            </section>
          );
        }

        return (
          <section
            key={i}
            className="flex w-full flex-col px-[var(--gutter)]"
            style={{ gap: 'var(--project-chip-gap)' }}
          >
            <span data-chip={b.chip} className="inline-flex self-start">
              <Chip label={b.chip} />
            </span>
            {/* Side by side only from `xl`. The design splits 1320 into 432
                of words and 840 of pictures, so the two fit beside each other
                at 1440 and nowhere narrower — at 1024 an 840 column leaves 48
                for the paragraph. Below that they stack, which is the only
                honest thing a 432 column can do on a laptop.

                And the STILLS flex rather than holding 840: pinned at the
                design's width they would overflow every screen between the
                breakpoint and 1440. The words keep their 432 because a
                measure is a measure; the pictures give. */}
            {/* ONE chip, then a paragraph-and-pictures pair for each group.
                Almost every section has a single group and looks exactly as
                it did; Mood has four, and the 40 between them is the design's
                own — tight enough that they read as one section rather than
                four, which is why they share a chip. */}
            {b.groups.map((g, gi) => (
              <div
                key={gi}
                className="flex w-full flex-col xl:flex-row xl:items-start"
                style={{ gap: 'var(--project-split-gap)' }}
              >
                <div
                  className="flex min-w-0 flex-col xl:w-[432px] xl:shrink-0"
                  style={{ gap: 24 }}
                >
                  <Words text={g.text} bullets={g.bullets} />
                </div>
                <div className="w-full min-w-0 xl:flex-1">
                  <Stills cells={g.cells} alt={alt} />
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
