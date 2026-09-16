'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';

gsap.registerPlugin(ScrollTrigger);

/**
 * The sticky head of a project panel — Figma 339:12126, and the three
 * annotations George left on it:
 *
 *   "This sections stays sticky at the top of the screen when it comes in
 *    the viewport"
 *   "This changes according to what section is shown (chips)"
 *   "This is a progress bar on how much scroll is left for this project. The
 *    project ends with the last section of the project, before the more
 *    projects"
 *
 * ── why this does not use `position: sticky` ──────────────────────────
 * It cannot. This lives inside a `PanelStack` panel, which is itself pinned:
 * a sticky child resolves against the nearest scrolling ancestor, and that
 * ancestor is already held at the top of the screen, so the header just
 * scrolls away with the content. Measured before the fix: it went from 1345
 * to −6106 while the panel's own rect never moved.
 *
 * So the sticking is done by hand. The OUTER element stays in flow and keeps
 * the header's space; the INNER one is translated down by however far the
 * outer has gone past the top. That is what sticky does anyway, and it is
 * blind to whatever transforms the pinning put on the ancestors.
 *
 * ── and why progress is not measured against the scroller ─────────────
 * Same reason. A pinned panel's `top` is a constant, so anything derived
 * from it is a constant too. Progress is read off two elements that DO move
 * with the content — this header and the end marker — as the fraction of
 * the distance between them that has passed the top of the screen. That
 * holds whatever the ancestors are doing.
 *
 * `[data-project-end]` sits before More projects, per George's note: the bar
 * is full when the PROJECT ends, not when the document does. Running it to
 * the bottom would leave it at two thirds with the work already finished.
 */
export default function ProjectHeader({
  title,
  chips,
}: {
  title: string;
  /** every section label, in order — see `chipsOf` */
  chips: string[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const outer = root.current;
      const slide = inner.current;
      const bar = fill.current;
      const out = label.current;
      const end = document.querySelector<HTMLElement>('[data-project-end]');
      if (!outer || !slide || !bar || !out || !end) return;

      const setY = gsap.quickSetter(slide, 'y', 'px');
      const setX = gsap.quickSetter(bar, 'scaleX');
      let last = '';

      const tick = () => {
        /* The outer box is never transformed, so its top is the honest
           answer to "how far has the content carried this". */
        const hTop = outer.getBoundingClientRect().top;
        const eTop = end.getBoundingClientRect().top;

        /* Hold it against the top of the screen — but only until the project
           ends, so it leaves with the last section rather than sitting over
           More projects. */
        const past = Math.max(0, -hTop);
        const room = Math.max(0, eTop - hTop - outer.offsetHeight);
        setY(Math.min(past, room));

        const run = eTop - hTop;
        setX(run > 0 ? gsap.utils.clamp(0, 1, past / run) : past > 0 ? 1 : 0);

        /* Whichever chip last crossed under the header. Walked backwards so
           the answer is the deepest one reached, not the first one matched. */
        const marks = gsap.utils.toArray<HTMLElement>('[data-chip]');
        let now = chips[0] ?? '';
        for (let i = marks.length - 1; i >= 0; i--) {
          if (marks[i].getBoundingClientRect().top <= outer.offsetHeight + 24) {
            now = marks[i].dataset.chip ?? now;
            break;
          }
        }
        if (now !== last) {
          last = now;
          out.textContent = now;
        }
      };

      /* `gsap.ticker`, like the gyroscope settle in `Avatar`.
         A scroll listener would be cheaper — this only has anything to say
         when the page has moved — but `PanelStack` pins with ScrollTrigger,
         and anything that normalises or hijacks scroll can starve a plain
         `scroll` listener while the ticker keeps its cadence. Consistency
         with the rest of the build wins over the saving.

         NOT VERIFIED IN THE BROWSER PANE. While the pane is hidden it
         suspends rAF *and* scroll dispatch — measured: scrollY moved 4706px
         and fired zero scroll events, rAF zero frames. So neither driver is
         observable there, and this needs a look on a real screen. */
      tick();
      gsap.ticker.add(tick);
      ScrollTrigger.addEventListener('refresh', tick);
      return () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener('refresh', tick);
      };
    },
    { scope: root, dependencies: [chips.join('|')] },
  );

  return (
    <div ref={root} data-project-header className="relative z-20 w-full">
      <div ref={inner} className="flex w-full flex-col items-center" style={{ background: 'var(--bg-page)' }}>
        <div
          className="flex w-full items-start gap-[40px] px-[var(--gutter)] uppercase"
          style={{ paddingBlock: 32, font: 'var(--type-20-20-r)', color: 'var(--text-primary)' }}
        >
          <p className="min-w-0 flex-1" style={{ fontWeight: 700 }}>
            {title}
          </p>
          {/* Written by the ticker rather than held in React state: it changes
              on every frame of a scroll, and re-rendering the panel that often
              to swap one word would be the most expensive thing on the page. */}
          <span ref={label} data-section-label className="shrink-0 text-right" />
        </div>

        <div
          className="relative mx-[var(--gutter)] overflow-hidden"
          style={{
            width: 'calc(100% - var(--gutter) * 2)',
            height: 2,
            borderRadius: 100,
            background: 'var(--bg-surface)',
          }}
        >
          <span
            ref={fill}
            data-progress
            className="absolute inset-0 block origin-left"
            style={{ background: 'var(--text-tertiary)', borderRadius: 100, transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  );
}
