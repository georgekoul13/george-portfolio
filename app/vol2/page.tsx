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
 * Panel 3 sits OUTSIDE the stack, as ordinary content that scrolls up over
 * panel 2 exactly as a panel would. It has to: it holds two sections that
 * pin themselves — the category strip and the projects band — and nested
 * inside a stack panel neither got any pin spacing at all, so the strip had
 * nothing to travel across and the band's rank never advanced. It also
 * keeps them clear of the scale the stack applies, which would turn their
 * pinned `position: fixed` into a local coordinate system.
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
          ]}
        />

        {/* ── panel 3 (235:4907) — outside the stack, see the note above ──
            `ConnectSection` is gone with the ID card — George: "id must be
            removed", and that card was the whole point of the band: a folder
            whose flap opens to lift it out. The footer carries the contact
            links, so nothing is orphaned. Both files are still on disk if it
            comes back. */}
        {/* The shoulder lives on `CategoryStrip`, the FIRST child, not here.
            A radius on this wrapper drew nothing: every section inside paints
            its own `--bg-page`, and an opaque child square-corners whatever
            its parent rounded. The usual fix — `overflow: hidden` — is not
            available, because clipping an ancestor of `ProjectsBand` would
            turn its pinned `position: fixed` into a local coordinate system
            and break the pin outright. Rounding the child that actually
            paints the corner costs nothing and clips nothing. */}
        <div className="relative z-10" style={{ background: 'var(--bg-page)' }}>
          <CategoryStrip />
          <ProjectsBand />
          <FooterSection />
          <CopyrightSection />
        </div>
      </main>
    </div>
  );
}
