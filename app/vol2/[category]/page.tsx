import { notFound } from 'next/navigation';
import NoiseField from '@/components/vol2/NoiseField';
import MenuBar from '@/components/vol2/MenuBar';
import PanelStack from '@/components/vol2/PanelStack';
import IntroSection from '@/components/vol2/IntroSection';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import CategoryTitle from '@/components/vol2/category/CategoryTitle';
import ProjectCards from '@/components/vol2/category/ProjectCards';
import { CATEGORIES, projectsFor, type CategorySlug } from '@/components/vol2/category/categories';

/**
 * Category template — Figma 238:6357 (the cream panel) and 238:4773 (the
 * dark one under it). One page each for Product, Graphic and Creative.
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

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = CATEGORIES[params.category as CategorySlug];
  if (!category) notFound();

  const projects = projectsFor(category);

  return (
    <div data-vol2>
      <NoiseField />
      <MenuBar />

      <main style={{ background: 'var(--bg-page)' }}>
        {/* `followed`: the block below rides up over this panel, so it keeps
            the closing viewport that the home page's last panel does not
            need — see `PanelStack`. */}
        <PanelStack
          followed
          panels={[
            {
              key: 'intro',
              tone: 'light',
              /* Short: there is no hero above this one, so the panel is
                 already whole on screen when the page opens and the hold is
                 only there to keep the recede off the sentence's heels. */
              revealRun: 200,
              tailRun: 500,
              content: <IntroSection sentence={category.intro} underlined={[]} beats={[]} />,
              style: { background: 'var(--bg-page)', color: 'var(--text-primary)' },
            },
          ]}
        />

        {/* The shoulder it rides up on. `overflow: clip` rather than putting
            the radius on the first child (which is how the home page does
            it): nothing in here pins, so clipping costs nothing, and it means
            the corner survives whatever ends up first in this block. */}
        <div
          className="relative z-10"
          style={{
            background: 'var(--bg-page)',
            overflow: 'clip',
            borderTopLeftRadius: 'var(--panel-radius)',
            borderTopRightRadius: 'var(--panel-radius)',
            /* The same shoulder padding the home page's arriving block has.
               Without it "All projects" sat hard against the block's own top
               edge, so the two templates opened differently. George: *"all
               panels should have the same rounded corners, paddings etc."* */
            paddingTop: 'var(--section-pad-y)',
          }}
        >
          {/* The title gets a screen of its own, so this block opens the
              way the home page's does — George: *"make it uniform."* Both
              arriving blocks are now one viewport before their content
              begins, rather than one presenting a composed screen and the
              other dropping you straight into a grid.

              `min-height` so a long title or a narrow window can still push
              it taller, and `lvh` for the reason in `PanelStack`. The title
              keeps its own top-left alignment; only the band it sits in
              changes. */}
          <div className="flex w-full flex-col justify-center" style={{ minHeight: '100lvh' }}>
            <CategoryTitle count={projects.length} />
          </div>

          <ProjectCards projects={projects} />
          <FooterSection />
          <CopyrightSection />
        </div>
      </main>
    </div>
  );
}
