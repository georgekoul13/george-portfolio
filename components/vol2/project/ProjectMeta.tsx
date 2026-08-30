'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Vol2Project } from './projects';

import '../scrollDefaults';

gsap.registerPlugin(ScrollTrigger);

/**
 * The block under the first image — Figma node 147:9629.
 *
 * A summary line and paragraph on the left, and a two-by-two grid of facts on
 * the right with a rule between its rows. The left column flexes; the right
 * is a fixed 500 and they sit 80 apart.
 *
 * That 500 is a frame-sized number: it does not shrink, so on anything
 * narrower than about 1200 it simply ran off the side — on a 375 phone the
 * facts column started at x=100 and ended at x=600, printed straight over
 * the summary. Below `xl` the two columns stack instead and the facts take
 * the full width, which is also where the 2 × 2 grid reads best.
 */
function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-[6px]">
      <p
        className="uppercase"
        style={{ font: 'var(--type-12-16-r)', color: 'var(--text-tertiary)' }}
      >
        {label}
      </p>
      <p style={{ font: 'var(--type-15-20-m)', color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

export default function ProjectMeta({ project }: { project: Vol2Project }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from('[data-meta-part]', {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 82%' },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="flex w-full flex-col items-start gap-10 px-[var(--gutter)] xl:flex-row xl:gap-20"
    >
      <div data-meta-part className="flex min-w-0 flex-1 flex-col items-start gap-6">
        <p
          className="w-full"
          style={{ font: 'var(--type-32-40-sb)', color: 'var(--text-primary)' }}
        >
          {project.summary}
        </p>
        <p className="w-full" style={{ font: 'var(--type-16-24-r)', color: 'var(--text-tertiary)' }}>
          {project.body}
        </p>
      </div>

      <div data-meta-part className="flex w-full flex-col items-start gap-6 xl:w-[500px] xl:shrink-0">
        <div className="grid w-full grid-cols-2 items-start gap-4 xl:gap-0">
          <Cell label="Client" value={project.meta.client} />
          <Cell label="Role" value={project.meta.role} />
        </div>
        <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} />
        <div className="grid w-full grid-cols-2 items-start gap-4 xl:gap-0">
          {/* The freelance and personal work has no date in any source, so
              the cell is dropped rather than shown holding a dash. The row
              is a two-column GRID rather than a flex pair for exactly this
              case: a lone flexed cell stretched to the full width, putting
              Category on a different left edge from Client above it. */}
          {project.meta.year ? <Cell label="Year" value={project.meta.year} /> : null}
          <Cell label="Category" value={project.meta.category} />
        </div>
      </div>
    </div>
  );
}
