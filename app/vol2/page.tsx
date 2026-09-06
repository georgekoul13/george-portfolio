import Loader from '@/components/vol2/Loader';
import NoiseField from '@/components/vol2/NoiseField';
import MenuBar from '@/components/vol2/MenuBar';
import PanelStack from '@/components/vol2/PanelStack';
import HeroSection from '@/components/vol2/hero/HeroSection';
import IntroSection from '@/components/vol2/IntroSection';
import SellingPointSection from '@/components/vol2/SellingPointSection';
import CategoryStrip from '@/components/vol2/CategoryStrip';
import ProjectsBand from '@/components/vol2/ProjectsBand';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';

/**
 * Vol2 build surface. Not linked from anywhere — the live home page is
 * untouched until every template is done.
 *
 * ── Three panels ──────────────────────────────────────────────────────
 * George's structure, and the Figma frame each one answers to:
 *
 *   1  base   230:14543   the hero
 *   2  first  231:16735   about me — the drawing, the sentence, and the
 *                         ribbons and chips beneath them, on cream
 *   3  last   235:4907    categories, featured projects, footer
 *
 * The mechanic is GSAP's "pinned panels with overscroll", which George
 * asked for by name — see `PanelStack`. A panel pins once it is whole on
 * screen, recedes as the next covers it, and scrolls its own content
 * through first if it is taller than the window.
 *
 * ── the panel waits for its own animations ────────────────────────────
 * *"In order for the new panel to come the animations of the previous must
 * be done."* Each panel reserves `revealRun` px at the front of its pin and
 * `tailRun` at the end, and the recede cannot begin until both have been
 * spent. The reveals inside are scrubbed against their own position on
 * screen — word by word as you scroll, and un-written as you scroll back
 * up — so `stretchRun` below is what actually gives them room to play in.
 *
 * Panel 3 is a real panel now, and it carries all three of its sections at
 * once. Nothing inside it pins any more — the band asks the panel to hold
 * for it instead — so the whole page is exactly three pinned panels.
 */
export default function Vol2Page() {
  return (
    <div data-vol2>
      {/* first in the tree on purpose — it stops the page's animations during
          render, before any section's own timeline is built */}
      <Loader />
      {/* EXPERIMENT — grain + slow tonal drift over the whole page */}
      <NoiseField />
      {/* The nav is a floating tile row at the BOTTOM now (230:14522), not a
          bar at the top, so `main` needs no header offset and the hero runs
          full-bleed to the top edge as 230:14543 draws it. */}
      <MenuBar />

      <main style={{ background: 'var(--bg-page)' }}>
        <PanelStack
          panels={[
            {
              /* The hero's own entrance runs on load rather than on a cue —
                 it is the first thing on the screen and there is no scroll
                 to spend yet — but it still holds the panel briefly so the
                 cream card cannot start arriving over the top of it. */
              key: 'hero',
              revealRun: 200,
              tailRun: 300,
              content: <HeroSection />,
              style: { background: 'var(--bg-page)' },
            },
            {
              /* `tone: 'light'` re-maps every semantic token inside rather
                 than recolouring the sections one by one — see tokens.css.
                 The ribbon inverts to a black band with cream lettering,
                 which is what 231:16735 draws, and nothing in there needed
                 editing.

                 This is the panel that overscrolls: the drawing, the
                 sentence and the ribbons come to well over a screen, so its
                 content scrolls through before anything arrives. */
              key: 'about',
              tone: 'light',
              shoulder: true,
              /* Short on purpose. This is scroll during which the panel is
                 pinned and NOTHING moves. At 900 it was nearly a screen and a
                 half of dead travel with the sentence clipped at the panel's
                 edge the whole time, which reads as the page having stalled.
                 What it buys at 350 is a beat on the drawing before the
                 content starts to climb. */
              revealRun: 350,
              /* Zero now the panel HOLDS at the sentence and again at the
                 chips: the dwell those two need is bought outright by the
                 stops, so slowing the travel between them as well would only
                 make the parts with nothing to read feel heavy. Kept here,
                 set to nothing, because it is the lever to reach for if the
                 avatar-to-sentence stretch ever wants damping. */
              stretchRun: 0,
              /* The long one, and it earns it: this is where the ribbons
                 and the chips finally sit still. Before it existed the
                 recede started the moment the overscroll finished and the
                 last chip was cut off mid-word. */
              tailRun: 700,
              content: (
                <>
                  <IntroSection />
                  <SellingPointSection />
                </>
              ),
              style: { background: 'var(--bg-page)', color: 'var(--text-primary)' },
            },
            {
              /* The last panel, and it is all three sections — George: *"the
                 last panel in home has the learn more, the featured projects
                 and the footer section."* Which is what 235:4907 draws: one
                 frame, not three that arrive in turn.

                 So they scroll THROUGH it rather than over each other. The
                 panel is far taller than the window, so its content is
                 carried up by the overscroll — categories, then the band,
                 then the footer — and only the panel itself ever slid over
                 anything.

                 What made this impossible before was the band: it pinned
                 itself, and a pinned section nested inside a pinned panel
                 gets no pin spacing, so its rank never advanced. It no
                 longer pins. It declares `data-hold` instead and the panel
                 parks it, which is the same mechanism the about panel's
                 sentence and chips use. Every reveal in here is now driven
                 either by that hold or by the element's live rect — nothing
                 inside reads its own position in the document, because
                 inside a pinned panel that position is a lie. */
              key: 'last',
              shoulder: true,
              revealRun: 200,
              /* The footer is the end of the page; there is nothing after it
                 that needs the panel to sit still first. */
              tailRun: 0,
              content: (
                <>
                  <CategoryStrip />
                  <ProjectsBand />
                  <FooterSection />
                  <CopyrightSection />
                </>
              ),
              style: { background: 'var(--bg-page)' },
            },
          ]}
        />

      </main>
    </div>
  );
}
