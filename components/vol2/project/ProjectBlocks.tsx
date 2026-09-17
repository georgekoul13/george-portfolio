'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import Chip from '../Chip';
import Picture from './Picture';
import RevealText from '../RevealText';
import Rise from './Rise';
import { useGateReady } from './ProjectGate';
import ProjectImage from './ProjectImage';
import VideoSources from './VideoSources';
import type { Block, Cell } from './blocks';

gsap.registerPlugin(ScrollTrigger);

/**
 * The body of a project — Figma 366:11793, the panel.
 *
 * Three kinds of block, drawn exactly as the design draws them:
 *
 *   text   chip, then a paragraph across the whole 1320
 *   media  one still or one loop, full width — `ProjectImage` decides which
 *   split  chip, then a 432 column of words and 840 of pictures beside it
 *
 * Every chip carries `data-chip` so `ProjectHeader` can read out the section
 * you are in without either component knowing about the other's markup.
 *
 * ── the stills WRAP; they are not rows ────────────────────────────────
 * Figma lays the 840 column out as a wrap: every slot is either 400 wide or
 * 840, they run left to right, and a row ends when the next one will not
 * fit. Two 400s make a row with the 40 gap between them; an 840 takes a row
 * to itself; and a 400 with nothing after it STAYS 400 and sits at the left
 * of its own row.
 *
 * That last case is the one this got wrong. The old code took a list of rows
 * and derived the aspect from the count — one in the row meant 840x400 — so
 * Gaspar's eleventh brand still, a phone screenshot, was stretched into a
 * letterbox. George: *"in the case of one image here on the row it should be
 * like this"*, pointing at Figma 352:5061, which is 400x400 and alone.
 *
 * Flex wrap reproduces the whole rule with no counting: each cell asks for
 * its own share and the browser breaks the lines. Nothing here knows how
 * many rows there are, which is exactly why it cannot get them wrong.
 */

/** one slot — a still or a loop, at the proportion the design drew it */
function Slot({ cell, alt }: { cell: Cell; alt: string }) {
  return (
    <div
      data-still
      className="relative min-w-0 overflow-hidden"
      /* `--still-cell` is 100% on a phone and half-the-column-minus-the-gap
         above it, so the wrap goes to one-up where a 400 would be too small
         to read. A span-2 slot is the whole column at every width.

         The `clipPath` is declared at rest so GSAP has something to animate
         FROM — `from` on an unset clip-path has no end value to interpolate
         towards and lands on `none` in one frame. */
      style={{
        width: cell.span === 2 ? '100%' : 'var(--still-cell)',
        aspectRatio: cell.aspect,
        clipPath: 'inset(0% 0% 0% 0%)',
        /* A TONE UNDER THE PICTURE, so a slot that has not loaded yet is a
           panel rather than a hole.

           George, on his phone: a tall blank between two stills that he could
           not reproduce on the Mac. Nothing was broken — the Mac had 405
           optimised variants cached and the phone asks for widths it has
           never generated, so each one is a cold re-encode of a 750KB PNG
           and the box stands empty while it runs. Against the page's own
           black that empty box is indistinguishable from a layout bug.

           This does not make the picture arrive sooner; the source files are
           the thing that has to change for that. It makes the wait look like
           a wait. */
        background: 'var(--bg-raised)',
      }}
    >
      {cell.kind === 'video' ? (
        <video
          data-inner
          poster={cell.poster}
          aria-label={cell.alt ?? alt}
          muted
          loop
          playsInline
          /* `metadata`, not `none`: a loop that has not been asked to play
             yet should still show its first frame rather than an empty box.
             Playback is started by the observer in `Stills` — see there. */
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <VideoSources src={cell.src} sources={cell.sources} />
        </video>
      ) : (
        <Picture
          src={cell.src!}
          alt={cell.alt ?? alt}
          /* measured, like the cards in `ProjectCards` — a still is 0.90 of
             the viewport on a phone, not the whole of it, because the page
             keeps its gutter */
          sizes="(min-width: 1200px) 38vw, (min-width: 600px) 43vw, 90vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function Stills({ cells, alt }: { cells: Cell[]; alt: string }) {
  const root = useRef<HTMLDivElement>(null);
  /* nothing is built while the curtain is up — see `ProjectGate` */
  const ready = useGateReady();

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cleanups: (() => void)[] = [];

      /* Per still, not per wrap — see `Rise` for the whole reasoning. A
         section of Mood's is six pictures in three rows and a single trigger
         on the container ran all six the moment the FIRST row entered, so
         rows two and three were already sitting there when you reached them.

         The stagger that gave the row its cascade is kept as a delay taken
         from the cell's position WITHIN ITS ROW, so two pictures side by side
         still arrive one after the other, and the row below waits for its own
         turn rather than inheriting the one above. */
      const triggers: ScrollTrigger[] = [];
      const stills = gsap.utils.toArray<HTMLElement>('[data-still]', root.current);

      /* ── THE LOOPS HAVE TO BE TOLD TO PLAY ──────────────────────────
         `autoPlay` in the JSX is not enough, and an end-to-end audit is what
         caught it: the rendered HTML carries `muted` and `loop` but NO
         `autoplay` attribute — React does not server-render it on a media
         element — so every loop in a stills column sat paused at
         `readyState: 4`, fully downloaded and never started. The full-width
         loops were fine, because `ProjectImage` already drives them this way;
         only the in-column ones were missed.

         Played only while on screen, for the reason `ProjectImage` gives:
         otherwise every visitor decodes every loop whether or not they
         scroll to it, and it keeps running off the battery afterwards.
         Reduced motion never starts one at all — the first frame is the
         whole experience there, which is why `preload` is `metadata`. */
      const clips = gsap.utils.toArray<HTMLVideoElement>('video', root.current);
      if (clips.length) {
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              const v = e.target as HTMLVideoElement;
              if (e.isIntersecting) void v.play().catch(() => {});
              else v.pause();
            }),
          { rootMargin: '200px 0px' },
        );
        clips.forEach((v) => io.observe(v));
        cleanups.push(() => io.disconnect());
      }
      stills.forEach((still, i) => {
        const prev = stills[i - 1];
        /* a new row: this cell's left edge is not to the right of the one
           before it — measured rather than counted, because the wrap is the
           browser's and changes with the breakpoint */
        const sameRow =
          !!prev && still.offsetLeft > prev.offsetLeft && still.offsetTop === prev.offsetTop;

        /* ── THE UNCOVER, not a fade ──────────────────────────────────
           A 24px rise and a fade over 0.8s is not enough movement to be
           seen. George, having watched it: *"on desktop it looks the same…
           on the phone there is a minor animation only when i scroll too
           quickly, everything looks the same as before."* The tween was
           running — it just did not read as anything.

           So the stills take the page's OWN image reveal instead, the one
           `ProjectImage` gives the hero: the frame is uncovered from the
           bottom edge while the picture inside drifts up out of a 1.12
           scale. Two things moving against each other, over a full second,
           across the whole height of the frame. That is the gesture the rest
           of the site uses for a picture, which is what was asked for. */
        /* ── PARK THE START STATE OUTRIGHT, then tween TO the rest state ──
           `from()` is supposed to write its start values the moment it is
           created. It does NOT when the timeline is already paused — and the
           timeline below is paused, because the picture now gates it. The
           first version of this gate used `from` and silently stopped
           parking anything: every still sat fully uncovered from first paint
           and the reveal had nothing left to reveal. Caught by walking the
           page and looking for a frame that was open with no picture in it —
           100 of them, where there should be none.

           Setting the start state outright does not care what is paused. */
        const pic = still.querySelector<HTMLElement>('img, video');
        gsap.set(still, { clipPath: 'inset(100% 0% 0% 0%)' });
        if (pic) gsap.set(pic, { scale: 1.12 });

        /* parked above whatever happens next; played only once the curtain
           has lifted — see `ProjectGate` */
        if (!ready) return;

        const tl = gsap
          .timeline({ paused: true, delay: sameRow ? 0.08 : 0 })
          .to(still, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.out' })
          .to(pic, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0);

        /* ── THE UNCOVER WAITS FOR THE PICTURE ───────────────────────
           George: *"let's make sure there are no delays when the user is on
           the page"* — and, on which pages: *"i'm speaking for the product
           pages."*

           The reveal used to be keyed to scroll position alone, so the frame
           opened on whatever was inside it at that moment — and on a phone,
           which asks for widths nothing has generated yet, that was very
           often nothing. The animation performed perfectly onto an empty box
           and then the picture appeared afterwards, which reads as the page
           being broken rather than as the network being slow.

           So the cue is BOTH: the still has to have reached the line AND its
           picture has to be decodable. Whichever is later starts it. The
           frame holds its placeholder tone until then, which is a panel
           waiting rather than a hole.

           CAPPED at two seconds. A picture that fails outright, or a
           connection that stalls, must not leave a section of the page
           permanently hidden — after the cap it uncovers regardless and the
           reader gets the layout even if they do not get the image. */
        const pictureReady = () => {
          const img = pic instanceof HTMLImageElement ? pic : null;
          // a video carries its own poster and never blocks
          if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve();
          return new Promise<void>((res) => {
            const go = () => res();
            img.addEventListener('load', go, { once: true });
            img.addEventListener('error', go, { once: true });
            window.setTimeout(go, 2000);
          });
        };

        const st = ScrollTrigger.create({
          trigger: still,
          start: 'top 88%',
          once: true,
          onEnter: () => void pictureReady().then(() => tl.play()),
        });
        triggers.push(st);
      });
      return () => {
        triggers.forEach((t) => t.kill());
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div
      ref={root}
      className="flex w-full flex-wrap content-start"
      style={{ gap: 'var(--project-row-gap)' }}
    >
      {cells.map((c, i) => (
        <Slot key={(c.src ?? c.sources?.webm ?? c.sources?.mp4 ?? '') + i} cell={c} alt={alt} />
      ))}
    </div>
  );
}

/**
 * The arrow that leads each line of a section's list — Figma
 * `icon/arrow-down-right`, drawn rather than fetched so it takes the tone's
 * ink like the words next to it instead of shipping a second colour.
 */
function ArrowDownRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="mt-[3px] shrink-0"
    >
      <path
        d="M5.25 5.25L12.75 12.75M12.75 5.25V12.75H5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The paragraph, and under it the arrow-led lines some sections carry.
 *
 * THREE SIZES, and they are a hierarchy George set rather than one the file
 * already had:
 *
 *   display    **72/80** — the Overview, and only the Overview
 *   statement  **56/64** — every other full-width section
 *   body       **24/32 Medium**, 5% tracking — beside the pictures
 *
 * *"overview 72 and the rest 56, keep 24/32 near images."* His canvas sets
 * every full-width box at 72, Overview and Challenge alike, so the middle
 * step is new. Without it the page opens at full volume and never comes
 * down, and the Overview stops being the thing you read first.
 *
 * An earlier bug had all three at 24/32, which made the opening statement of
 * every project the size of a caption.
 */
function Words({
  text,
  bullets,
  size = 'body',
}: {
  text: string;
  bullets?: string[];
  size?: 'display' | 'statement' | 'body';
}) {
  const font =
    size === 'display'
      ? { font: 'var(--type-72-80-r)' }
      : size === 'statement'
        ? { font: 'var(--type-56-64-r)' }
        : { font: 'var(--type-24-32-m)', letterSpacing: '1.2px' };

  /* The two full-width sizes are the page's display type, so they arrive the
     way the home page's big lines do — written word by word against the
     scroll. The 24/32 beside the pictures does not: see `Rise`. */
  const big = size !== 'body';

  return (
    <>
      {big ? (
        /* `enter`, not `scroll`. Scrubbed, each of a case study's eight or
           nine statements has to be scrolled into existence before it can be
           read; played on arrival, the sentence writes itself once at its own
           pace and the reader just reads. George: *"let's have the revealing
           animation automation instead related to scroll on big text
           boxs."* */
        <RevealText play="enter" font={font.font} style={{ color: 'var(--text-primary)' }}>
          {text}
        </RevealText>
      ) : (
        <p style={{ ...font, color: 'var(--text-primary)' }}>
          {text}
        </p>
      )}
      {bullets?.length ? (
        <ul className="flex flex-col" style={{ gap: 8, color: 'var(--text-primary)' }}>
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start" style={{ gap: 8 }}>
              <ArrowDownRight />
              <span style={{ font: 'var(--type-16-24-r)' }}>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default function ProjectBlocks({ blocks, alt }: { blocks: Block[]; alt: string }) {
  return (
    <div className="flex w-full flex-col" style={{ gap: 'var(--project-block-gap)' }}>
      {blocks.map((b, i) => {
        if (b.kind === 'media') {
          return (
            <ProjectImage
              key={i}
              src={b.src}
              sources={b.sources}
              poster={b.poster}
              alt={b.alt ?? alt}
            />
          );
        }

        if (b.kind === 'text') {
          return (
            <section
              key={i}
              className="flex w-full flex-col px-[var(--gutter)]"
              style={{ gap: 'var(--project-chip-gap)' }}
            >
              {b.chip && (
                /* the chip rises on its own, ahead of the sentence it labels */
                <Rise className="inline-flex self-start">
                  <span data-chip={b.chip} className="inline-flex">
                    <Chip label={b.chip} />
                  </span>
                </Rise>
              )}
              <div className="flex w-full flex-col" style={{ gap: 24 }}>
                <Words text={b.text} bullets={b.bullets} size={b.display ? 'display' : 'statement'} />
              </div>
            </section>
          );
        }

        return (
          <section
            key={i}
            className="flex w-full flex-col px-[var(--gutter)]"
            style={{ gap: 'var(--project-chip-gap)' }}
          >
            <Rise className="inline-flex self-start">
              <span data-chip={b.chip} className="inline-flex">
                <Chip label={b.chip} />
              </span>
            </Rise>
            {/* Side by side only from `xl`. The design splits 1320 into 432
                of words and 840 of pictures, so the two fit beside each other
                at 1440 and nowhere narrower — at 1024 an 840 column leaves 48
                for the paragraph. Below that they stack, which is the only
                honest thing a 432 column can do on a laptop.

                And the STILLS flex rather than holding 840: pinned at the
                design's width they would overflow every screen between the
                breakpoint and 1440. The words keep their 432 because a
                measure is a measure; the pictures give. */}
            {/* ONE chip, then a paragraph-and-pictures pair for each group.
                Almost every section has a single group and looks exactly as
                it did; Mood has four, and the 40 between them is the design's
                own — tight enough that they read as one section rather than
                four, which is why they share a chip. */}
            {b.groups.map((g, gi) => (
              <div
                key={gi}
                className="flex w-full flex-col xl:flex-row xl:items-start"
                style={{ gap: 'var(--project-split-gap)' }}
              >
                <Rise
                  className="flex min-w-0 flex-col xl:w-[432px] xl:shrink-0"
                  style={{ gap: 24 }}
                >
                  <Words text={g.text} bullets={g.bullets} />
                </Rise>
                <div className="w-full min-w-0 xl:flex-1">
                  <Stills cells={g.cells} alt={alt} />
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
