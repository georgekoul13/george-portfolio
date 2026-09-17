import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AUTHOR, SITE, canonical, jsonLd, page as seoPage } from '@/lib/seo';
import NoiseField from '@/components/vol2/NoiseField';
import MenuBar from '@/components/vol2/MenuBar';
import PanelStack from '@/components/vol2/PanelStack';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import ProjectBase from '@/components/vol2/project/ProjectBase';
import ProjectHeader from '@/components/vol2/project/ProjectHeader';
import ProjectBlocks from '@/components/vol2/project/ProjectBlocks';
import ProjectGate from '@/components/vol2/project/ProjectGate';
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

/**
 * Every project gets its OWN title, description and share card.
 *
 * They all shared one line from the root layout before this — nineteen pages
 * competing in search as the same page. The words are the ones already
 * written for the page (`copy.ts`), so search results say what the project is
 * rather than repeating the site tagline, and the card is the project's own
 * hero rather than the generic one.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getVol2Project(params.slug);
  if (!project) return {};
  return seoPage({
    title: project.title,
    description: project.subtitle,
    path: `/projects/${params.slug}`,
    image: SITE + project.hero,
  });
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
    /* Everything is inside the gate: it holds the loading curtain over the
       page until the pictures have arrived, and withholds every entrance
       animation until it lifts, so the page opens rather than catching up.
       George: *"whenever the user taps on a card, the loading happens until
       all the images are loaded and then the project page comes."* */
    <ProjectGate>
    {/* So a search engine reads this as a piece of work with an author, a
        client and a date — not as a page of pictures. */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLd({
        '@type': 'CreativeWork',
        name: project.title,
        description: project.subtitle,
        url: canonical(`/projects/${slug}`),
        image: SITE + project.hero,
        author: { '@type': 'Person', name: AUTHOR, url: canonical() },
        creator: { '@type': 'Person', name: AUTHOR },
        ...(project.meta.client ? { sourceOrganization: { '@type': 'Organization', name: project.meta.client } } : {}),
        ...(project.meta.role ? { jobTitle: project.meta.role } : {}),
      })}
    />
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
    </ProjectGate>
  );
}
