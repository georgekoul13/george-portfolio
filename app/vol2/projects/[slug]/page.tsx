import { notFound } from 'next/navigation';
import NoiseField from '@/components/vol2/NoiseField';
import MenuBar from '@/components/vol2/MenuBar';
import PanelStack from '@/components/vol2/PanelStack';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import ProjectBase from '@/components/vol2/project/ProjectBase';
import ProjectHeader from '@/components/vol2/project/ProjectHeader';
import ProjectBlocks from '@/components/vol2/project/ProjectBlocks';
import MoreProjects from '@/components/vol2/project/MoreProjects';
import { chipsOf } from '@/components/vol2/project/blocks';
import {
  getVol2Project,
  allVol2ProjectSlugs,
  moreAfter,
} from '@/components/vol2/project/vol2Projects';

/**
 * Project template — Figma 366:11793.
 *
 * ── the tones swapped ─────────────────────────────────────────────────
 * The base is LIGHT now and the panel dark, where before both were dark on
 * darker. That makes a project open the way the home and category pages do
 * — cream, with the dark panel climbing over it — so all three templates
 * now share one entrance rather than this one being the exception.
 *
 * ── what the panel holds ──────────────────────────────────────────────
 *   the sticky head      title, the section you are in, and how far is left
 *   the blocks           George's own sections, in his order
 *   [data-project-end]   where the PROJECT stops and the site resumes
 *   More projects        three cards, the same ones the category pages use
 *   the footer
 *
 * That marker is load-bearing rather than tidy: George's annotation says the
 * progress bar "ends with the last section of the project, before the more
 * projects", so the bar measures to it. Without it the bar would still be at
 * two thirds when the project had finished.
 */
export function generateStaticParams() {
  return allVol2ProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getVol2Project(slug);
  if (!project) notFound();

  return (
    <div className="relative min-h-screen">
      <NoiseField />
      <MenuBar />
      <main className="relative">
        <PanelStack
          panels={[
            {
              key: 'base',
              tone: 'light',
              revealRun: 200,
              tailRun: 300,
              content: (
                <ProjectBase
                  title={project.title}
                  subtitle={project.subtitle}
                  meta={project.meta}
                  hero={project.hero}
                />
              ),
              style: { background: 'var(--bg-page)' },
            },
            {
              key: 'content',
              shoulder: true,
              revealRun: 200,
              tailRun: 0,
              content: (
                <div className="flex w-full flex-col">
                  <ProjectHeader title={project.title} chips={chipsOf(project.blocks)} />

                  <div
                    className="flex w-full flex-col"
                    style={{ paddingTop: 'var(--project-block-gap)' }}
                  >
                    <ProjectBlocks blocks={project.blocks} alt={project.title} />
                  </div>

                  {/* the project stops here; everything below belongs to the
                      site — see `ProjectHeader` */}
                  <div data-project-end aria-hidden="true" />

                  <div
                    className="flex w-full flex-col"
                    style={{ gap: 'var(--project-block-gap)', paddingTop: 'var(--project-block-gap)' }}
                  >
                    <MoreProjects slugs={moreAfter(slug)} />
                    <FooterSection />
                    <CopyrightSection />
                  </div>
                </div>
              ),
              style: { background: 'var(--bg-page)' },
            },
          ]}
        />
      </main>
    </div>
  );
}
