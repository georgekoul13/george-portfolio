'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cardsForSlugs } from '../category/categories';
import { Card } from '../category/ProjectCards';
import { onEnterView } from './enterView';
import { revealTiming } from './revealTiming';

/**
 * The band that closes a project — Figma 340:19432.
 *
 * Three cards in ONE row under a 72/80 heading, and they are the same cards
 * the category pages use — `cardsForSlugs` builds them, so a project's
 * thumbnail is its own hero here exactly as it is everywhere else.
 *
 * ── its own row, not `ProjectCards` ───────────────────────────────────
 * That component lays a category out: the first two projects take the large
 * variant across a two-column grid and the rest flow beneath. Handing it
 * three gave a page one big pair and a stranded single, which is a category
 * page's shape rather than this band's. George: *"the more projects cards
 * should be 3 cards in a row."* So the row is here and only the card itself
 * is shared — which is the part that has to match.
 *
 * Which three: the next projects in the list, wrapping round, so a reader who
 * arrived on a link has somewhere to go that is not the back button.
 */
export default function MoreProjects({ slugs }: { slugs: string[] }) {
  const root = useRef<HTMLElement>(null);

  /* The one row on a project page that had no arrival at all — every card
     above it reveals and these three simply appeared. Same observer and same
     device-aware timing as everywhere else; see `enterView`. */
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const T = revealTiming();
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root.current);
      const stop = cards.map((card, i) => {
        gsap.set(card, { autoAlpha: 0, y: 40 });
        return onEnterView(
          card,
          () =>
            void gsap.to(card, {
              autoAlpha: 1,
              y: 0,
              duration: T.duration,
              delay: i * T.stagger,
              ease: 'power3.out',
            }),
          T.at,
        );
      });
      return () => stop.forEach((fn) => fn());
    },
    { scope: root },
  );

  const projects = cardsForSlugs(slugs);
  if (!projects.length) return null;

  return (
    <section
      ref={root}
      className="flex w-full flex-col px-[var(--gutter)]"
      style={{ gap: 'var(--project-more-gap)' }}
    >
      <h2 style={{ font: 'var(--type-72-80-r)', color: 'var(--text-primary)' }}>More projects</h2>
      {/* Three across from `md`, one below it — a 413 card on a phone would
          be 100px wide with three in the row. */}
      <div
        className="grid w-full grid-cols-1 md:grid-cols-3"
        style={{ gap: 'var(--cards-gap)' }}
      >
        {projects.map((p) => (
          <Card key={p.slug} project={p} large={false} />
        ))}
      </div>
    </section>
  );
}
