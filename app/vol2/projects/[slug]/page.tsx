import { notFound } from 'next/navigation';
import NoiseField from '@/components/vol2/NoiseField';
import MenuBar from '@/components/vol2/MenuBar';
import PanelStack from '@/components/vol2/PanelStack';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import RevealText from '@/components/vol2/RevealText';
import ProjectIntro from '@/components/vol2/project/ProjectIntro';
import ProjectMeta from '@/components/vol2/project/ProjectMeta';
import ProjectImage from '@/components/vol2/project/ProjectImage';
import ProjectGalleryRow from '@/components/vol2/project/ProjectGalleryRow';
import { getVol2Project, allVol2ProjectSlugs } from '@/components/vol2/project/projects';

/**
 * Project template — Figma 262:9599 (the hero) and 262:9989 (the panel over
 * it).
 *
 * The last of the templates to move onto the site's two-part structure, and
 * the one that changes least in doing so: the bands themselves were already
 * built to this design's predecessor, so the typography, the metadata grid
 * and the rule between its rows are untouched. What changed is where the
 * page divides.
 *
 *   base   262:9599   the title, the first still, and the facts — 80 apart
 *   panel  262:9989   the second still, the statement, the closing trio
 *
 * ── it is dark on darker ──────────────────────────────────────────────
 * Both halves are dark here, unlike the home and category pages: 262:9599
 * sets its title in cream, so the hero is the page's own black rather than
 * the cream the other two open on. The panel is `--bg-surface`, one step off
 * it — without that the shoulder was drawing a rounded corner between two
 * identical blacks and the join could not be read at all.
 *
 * ── the 80s ───────────────────────────────────────────────────────────
 * Both nodes space their blocks 80 apart, which is `--band-gap`. The
 * statement carries another 80 inside its own box (the node's `py-[80px]`),
 * so it sits 160 clear of the stills either side of it — the one band on the
 * page that is given room to be read rather than looked at.
 */

export function generateStaticParams() {
  return allVol2ProjectSlugs().map((slug) => ({ slug }));
}

export default function Vol2ProjectPage({ params }: { params: { slug: string } }) {
  const project = getVol2Project(params.slug);
  if (!project) notFound();

  return (
    <div data-vol2>
      <NoiseField />
      <MenuBar />

      <main style={{ background: 'var(--bg-page)' }}>
        <PanelStack
          panels={[
            {
              key: 'base',
              revealRun: 200,
              tailRun: 300,
              content: (
                <div
                  className="flex w-full flex-col"
                  style={{
                    gap: 'var(--band-gap)',
                    paddingBlock: 'var(--base-pad-y)',
                    /* `ProjectIntro` reads this to clear the old fixed
                       header, which this page no longer has — the panel's
                       own padding is the distance now. */
                    ['--project-intro-top' as string]: '0px',
                  }}
                >
                  <ProjectIntro title={project.title} />
                  <ProjectImage src={project.heroes[0]} alt={project.title} />
                  <ProjectMeta project={project} />
                </div>
              ),
              style: { background: 'var(--bg-page)' },
            },
            {
              /* NOT `data-panel-content`: that attribute carries the home and
                 category rhythm, and part of it is zeroing every child's
                 top padding — which would take the statement's 80 off one
                 side and leave it sitting crooked between the two stills. */
              key: 'content',
              shoulder: true,
              revealRun: 200,
              tailRun: 0,
              content: (
                <div
                  className="flex w-full flex-col"
                  style={{ paddingTop: 'var(--content-pad-top)', gap: 'var(--band-gap)' }}
                >
                  <ProjectImage src={project.heroes[1]} alt={project.title} />

                  {/* `play="pinned"`: this is inside a pinned panel, where a
                      ScrollTrigger keyed to the paragraph's position in the
                      document never advances — see `scrubToPosition`. */}
                  <div
                    className="w-full px-[var(--gutter)]"
                    style={{ paddingBlock: 'var(--band-gap)' }}
                  >
                    <RevealText play="pinned" className="w-full">
                      {project.statement}
                    </RevealText>
                  </div>

                  <ProjectGalleryRow images={project.gallery} />

                  <FooterSection />
                  <CopyrightSection />
                </div>
              ),
              /* `--bg-surface`, not the page's black — George: *"the
                 background of the panel is bg/surface, it's different from
                 the hero section."* A step off the hero is the only thing
                 marking the join on this template, since unlike the home and
                 category pages both halves are dark; the shoulder alone was
                 drawing a rounded corner between two identical blacks. */
              style: { background: 'var(--bg-surface)' },
            },
          ]}
        />
      </main>
    </div>
  );
}
