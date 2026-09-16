import { cardsForSlugs } from '../category/categories';
import ProjectCards from '../category/ProjectCards';

/**
 * The band that closes a project — Figma 340:19432.
 *
 * Three cards under a 72/80 heading, and they are the SAME cards the
 * category pages use — `cardsForSlugs` builds them, so a project's thumbnail
 * is its own hero here exactly as it is everywhere else, and the chip
 * restyle reached this band for free.
 *
 * Which three: the next projects in the same category, wrapping round, so a
 * reader who came in on a link has somewhere to go that is not the back
 * button. The project itself is never among them.
 */
export default function MoreProjects({ slugs }: { slugs: string[] }) {
  if (!slugs.length) return null;
  return (
    <section
      className="flex w-full flex-col px-[var(--gutter)]"
      style={{ gap: 'var(--project-more-gap)' }}
    >
      <h2 style={{ font: 'var(--type-72-80-r)', color: 'var(--text-primary)' }}>More projects</h2>
      {/* `ProjectCards` already handles its own responsive column count and
          the gap between cards; passing three of them gives the design's
          single row at desktop. */}
      <ProjectCards projects={cardsForSlugs(slugs)} />
    </section>
  );
}
