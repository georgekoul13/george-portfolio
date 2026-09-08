import Loader from '@/components/vol2/Loader';
import NoiseField from '@/components/vol2/NoiseField';
import MenuBar from '@/components/vol2/MenuBar';
import PanelStack from '@/components/vol2/PanelStack';
import BaseScreen from '@/components/vol2/BaseScreen';
import Hero from '@/components/vol2/hero/Hero';
import SellingPointSection from '@/components/vol2/SellingPointSection';
import CategoryStrip from '@/components/vol2/CategoryStrip';
import ProjectsBand from '@/components/vol2/ProjectsBand';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';

/**
 * Vol2 build surface. Not linked from anywhere — the live home page is
 * untouched until every template is done.
 *
 * ── Two panels ────────────────────────────────────────────────────────
 * George's restructure: *"in all the base pages we will always have the
 * illustration and logo with some text, or a title with some text… then a
 * panel with the content of the page is going to come on top like we do it
 * right now."*
 *
 *   1  base     255:7046 / 255:9406   the wordmark, the line under it and
 *                                     the drawing, on cream, under a ticker
 *   2  content  255:8674              everything the page actually says,
 *                                     on black, arriving over the base
 *
 * It was three: a black hero, then a cream panel carrying the drawing and a
 * sentence about it, then the content. The middle one is gone — the drawing
 * and the line moved up into the base, which is the simplification: the same
 * two things said once instead of across two screens.
 *
 * The mechanic underneath is unchanged — GSAP's layered pinning, see
 * `PanelStack`. A panel pins once it is whole on screen and the next slides
 * up over it while it holds still.
 */
export default function Vol2Page() {
  return (
    <div data-vol2>
      {/* first in the tree on purpose — it stops the page's animations during
          render, before any section's own timeline is built */}
      <Loader />
      {/* EXPERIMENT — grain + slow tonal drift over the whole page */}
      <NoiseField />
      <MenuBar />

      <main style={{ background: 'var(--bg-page)' }}>
        <PanelStack
          panels={[
            {
              /* `tone: 'light'` re-maps every semantic token inside rather
                 than recolouring anything by hand — see tokens.css. The base
                 is cream and the panel over it is black, so the two are each
                 other's opposite and the join needs no other marking.

                 The wordmark and the sentence arrive on LOAD rather than on a
                 cue: this is the first thing on the screen and there is no
                 scroll to spend yet. The panel still holds briefly so the
                 black cannot start arriving over the top of it. */
              key: 'base',
              tone: 'light',
              revealRun: 200,
              tailRun: 300,
              content: (
                <BaseScreen
                  title={<Hero />}
                  text="A professional over-thinker with a love for product and visual design"
                />
              ),
              style: { background: 'var(--bg-page)', color: 'var(--text-primary)' },
            },
            {
              /* Everything the page says, in one panel (255:8674): the chips
                 and their ribbons, the categories, the featured projects and
                 the footer. It is far taller than the window, so its content
                 is carried up by the overscroll rather than arriving in
                 pieces — see `PanelStack`. */
              key: 'content',
              shoulder: true,
              revealRun: 200,
              /* The footer is the end of the page; nothing after it needs the
                 panel to sit still first. */
              tailRun: 0,
              content: (
                <div
                  data-panel-content
                  className="flex flex-col"
                  style={{ paddingTop: 'var(--content-pad-top)', gap: 'var(--panel-gap)' }}
                >
                  <SellingPointSection />
                  <CategoryStrip />
                  <ProjectsBand />
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
