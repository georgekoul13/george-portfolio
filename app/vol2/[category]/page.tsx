import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { page as seoPage } from '@/lib/seo';
import NoiseField from '@/components/vol2/NoiseField';
import MenuBar from '@/components/vol2/MenuBar';
import PanelStack from '@/components/vol2/PanelStack';
import BaseScreen from '@/components/vol2/BaseScreen';
import Monogram from '@/components/vol2/Monogram';
import BaseText from '@/components/vol2/BaseText';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import CategoryTitle from '@/components/vol2/category/CategoryTitle';
import ProjectCards from '@/components/vol2/category/ProjectCards';
import { CATEGORIES, projectsFor, type CategorySlug } from '@/components/vol2/category/categories';

/**
 * Category template — Figma 255:9087 (the hero) and 262:5841 (its phone),
 * with the content on a panel over the top. One page each for Product,
 * Graphic and Creative.
 *
 * It is the home page's structure with one substitution: George — *"we are
 * going to have a similar hero and one panel coming on to it… just make sure
 * the padding gaps of the home panel are here too."* So the same
 * `BaseScreen`, the same `--content-pad-top` and `--panel-gap`, and the only
 * difference is what sits at the top of the base — the wordmark shrinks to a
 * mark in the corner and the category's own line becomes the title.
 *
 * ── what changed from 147:9780 ────────────────────────────────────────
 * The old template was a top `Header`, a left-aligned all-caps headline over
 * a cursor trail, then the cards. The new one speaks the home page's
 * language instead:
 *
 *   panel 1  cream — HI THERE! / the drawing / I'M GEORGE / the category's
 *                    own sentence. The SAME composition as the home page's
 *                    first panel, which is why it is the same component: the
 *                    only thing that differs is the line, so that is the only
 *                    thing passed in.
 *   panel 2  dark  — All projects (n), the cards, the footer, the copyright,
 *                    riding up over the cream on a rounded shoulder.
 *
 * The nav is the floating `MenuBar` at the bottom, not a header, so `main`
 * needs no top offset.
 *
 * No `Loader` here — that is the home page's entrance, not something to sit
 * through on every navigation.
 *
 * Panel 2 sits OUTSIDE the stack for the same reason it does on the home
 * page: nested inside a stack panel a pinned section gets no pin spacing,
 * and the scale the stack applies would turn any `position: fixed` inside it
 * into a local coordinate system.
 */

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

/**
 * The category's own line, not the site's. `lead` is already written for
 * each one and says what the work in it actually is — which is what a search
 * result for "product designer greece" needs to show.
 */
export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = CATEGORIES[params.category as CategorySlug];
  if (!category) return {};
  return seoPage({
    title: `${category.label} design`,
    /* `lead` is optional in the model; `intro` is the one every category
       has, so it is the fallback rather than a generic sentence. */
    description: category.lead ?? category.intro,
    path: `/${params.category}`,
  });
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = CATEGORIES[params.category as CategorySlug];
  if (!category) notFound();

  const projects = projectsFor(category);

  return (
    <div data-vol2>
      <NoiseField />
      <MenuBar />

      <main style={{ background: 'var(--bg-page)' }}>
        <PanelStack
          panels={[
            {
              /* The hero. `tone: "light"` re-maps every semantic token
                 inside, so the mark, the title and the lead are all dark on
                 the cream without naming a colour. */
              key: 'base',
              tone: 'light',
              revealRun: 200,
              tailRun: 300,
              content: (
                <BaseScreen
                  mark={<Monogram />}
                  /* Both lines write themselves as the page lands — George:
                     *"when the user lands in the hero of this page template,
                     let's reveal the title and the subtitle."* The same
                     character reveal the featured band's headline has.

                     `startAt` is on the global timeline's clock, which the
                     Loader pauses — so 0.15 means a beat after the curtain
                     lifts, not a beat after the JavaScript ran. The home
                     page's default waits for its wordmark's letters to land;
                     there is no wordmark here to wait for.

                     The lead starts at 0.75, while the title still has a
                     third of its run left: they overlap, which reads as one
                     movement rather than two things taking turns. */
                  title={
                    <BaseText
                      as="h1"
                      className="uppercase"
                      startAt={0.15}
                      style={{ font: 'var(--cat-title)', color: 'var(--text-primary)' }}
                    >
                      {category.intro}
                    </BaseText>
                  }
                  text={category.lead}
                  textFont="var(--cat-lead)"
                  textStartAt={0.75}
                />
              ),
              style: { background: 'var(--bg-page)', color: 'var(--text-primary)' },
            },
            {
              /* Everything the page says, on the home page's rhythm — the
                 same `--content-pad-top` to open it and `--panel-gap`
                 between its sections. */
              key: 'content',
              shoulder: true,
              revealRun: 200,
              tailRun: 0,
              content: (
                <div
                  data-panel-content
                  className="flex flex-col"
                  style={{ paddingTop: 'var(--content-pad-top)', gap: 'var(--panel-gap)' }}
                >
                  {/* The title and the grid are ONE band, `--titled-gap`
                      apart — the same pairing the home page's "Learn more"
                      makes with its strip. */}
                  <div
                    data-titled-band
                    className="flex w-full flex-col"
                    style={{ gap: 'var(--titled-gap)' }}
                  >
                    <CategoryTitle count={projects.length} />
                    <ProjectCards projects={projects} />
                  </div>

                  <FooterSection />
                  <CopyrightSection />
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
