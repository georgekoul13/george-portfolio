'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import Chip from '../Chip';
import ProjectImage from './ProjectImage';
import type { Block, Row } from './blocks';

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
 * ── the grid is not a grid ────────────────────────────────────────────
 * Each row in a `split` is one or two stills, and the design mixes them
 * freely — two 400s, then one 840 across, then two more. A CSS grid with a
 * fixed column count cannot express "this row is one wide", so the rows are
 * flex and each still takes an equal share of whatever row it is in. One
 * still fills 840; two sit at 400 with the 40 gap between them. The numbers
 * fall out rather than being asserted.
 */

function Stills({ rows, alt }: { rows: Row[]; alt: string }) {
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
    <div ref={root} className="flex w-full flex-col" style={{ gap: 'var(--project-row-gap)' }}>
      {rows.map((row, i) => (
        <div key={i} className="flex w-full" style={{ gap: 'var(--project-row-gap)' }}>
          {row.map((shot, j) => (
            <div
              data-still
              key={shot.src + j}
              className="relative min-w-0 flex-1 overflow-hidden"
              /* 1:1 for a pair, 21:10 for one across — the design's 400x400
                 and 840x400. Taken from how many are in the row rather than
                 stored, so a row cannot disagree with itself. */
              style={{ aspectRatio: row.length > 1 ? '1 / 1' : '840 / 400' }}
            >
              <Image
                src={shot.src}
                alt={shot.alt ?? alt}
                fill
                sizes="(min-width: 900px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ProjectBlocks({ blocks, alt }: { blocks: Block[]; alt: string }) {
  return (
    <div className="flex w-full flex-col" style={{ gap: 'var(--project-block-gap)' }}>
      {blocks.map((b, i) => {
        if (b.kind === 'media') {
          return <ProjectImage key={i} src={b.src} poster={b.poster} alt={b.alt ?? alt} />;
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
              <p style={{ font: 'var(--type-24-32-m)', letterSpacing: '1.2px', color: 'var(--text-primary)' }}>
                {b.text}
              </p>
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
            <div
              className="flex w-full flex-col xl:flex-row xl:items-start"
              style={{ gap: 'var(--project-split-gap)' }}
            >
              <p
                className="min-w-0 xl:w-[432px] xl:shrink-0"
                style={{ font: 'var(--type-24-32-m)', letterSpacing: '1.2px', color: 'var(--text-primary)' }}
              >
                {b.text}
              </p>
              <div className="w-full min-w-0 xl:flex-1">
                <Stills rows={b.rows} alt={alt} />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
