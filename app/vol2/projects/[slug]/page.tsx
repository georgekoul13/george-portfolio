import { notFound } from 'next/navigation';
import Header from '@/components/vol2/Header';
import Divider from '@/components/vol2/Divider';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import RevealText from '@/components/vol2/RevealText';
import ProjectIntro from '@/components/vol2/project/ProjectIntro';
import ProjectMeta from '@/components/vol2/project/ProjectMeta';
import ProjectImage from '@/components/vol2/project/ProjectImage';
import ProjectGalleryRow from '@/components/vol2/project/ProjectGalleryRow';
import { getVol2Project, allVol2ProjectSlugs } from '@/components/vol2/project/projects';

/**
 * Project template — Figma node 145:3043.
 *
 * Band order and spacing are the design's: the title, a full-width still, the
 * summary and facts, a second still, a statement, the closing trio, then the
 * footer and copyright. Everything inside `HeadlineArea` is 80 apart — that
 * is `--band-gap`, which steps down on a phone where 80 is a fifth of the
 * screen repeated seven times.
 *
 * Figma puts a rule before the copyright but not before the footer here —
 * unlike the category page, which has both. Followed as drawn.
 */

export function generateStaticParams() {
  return allVol2ProjectSlugs().map((slug) => ({ slug }));
}

export default function Vol2ProjectPage({ params }: { params: { slug: string } }) {
  const project = getVol2Project(params.slug);
  if (!project) notFound();

  return (
    <div data-vol2>
      <Header />
      <main style={{ background: 'var(--bg-page)' }} className="pt-[var(--header-h)]">
        <ProjectIntro title={project.title} />

        <div
          className="flex w-full flex-col"
          style={{ gap: 'var(--band-gap)', paddingTop: 'var(--band-gap)', paddingBottom: 'var(--band-gap)' }}
        >
          <ProjectImage src={project.heroes[0]} alt={project.title} />

          <ProjectMeta project={project} />

          <ProjectImage src={project.heroes[1]} alt={project.title} />

          {/* the statement gets the site's word-by-word reveal, scrubbed as
              it is everywhere except the category intro */}
          <div className="w-full px-[var(--gutter)]" style={{ paddingBlock: 'var(--band-gap)' }}>
            <RevealText className="w-full">{project.statement}</RevealText>
          </div>

          <ProjectGalleryRow images={project.gallery} />
        </div>

        <FooterSection />
        <Divider />
        <CopyrightSection />
      </main>
    </div>
  );
}
