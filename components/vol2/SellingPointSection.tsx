'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import './scrollDefaults';
import { scrubToHold, scrubToPosition } from './scrubToPosition';

gsap.registerPlugin(ScrollTrigger);

/* ─── The ribbon ──────────────────────────────────────────────────────────
   Figma exports the ribbon (193:7948) as flat art: the band is a filled
   outline and the words are outlined glyph paths. Nothing in that file can
   move, so the band is rebuilt here as a live stroked path with real text
   running along it.

   RIBBON_D is that art's CENTRELINE, derived from the export rather than
   eyeballed. The outline was sampled at 8000 points, its two long edges
   separated at the end caps, and each point on the inner edge paired with
   its NEAREST point on the outer one. That pairing matters: matching the
   edges by equal arc-length instead reads the ribbon as 137 units thick at
   the bottom bend — the outside of a curve is simply longer than the inside
   — and bends the centreline off the art. Paired by proximity the thickness
   holds at 68.8–69.1 the whole way down, which is the 69 below.

   Fitted back with Catmull-Rom at 24 points: 1318.2 long against the dense
   reference's 1320.5, so 0.17% short, and a quarter of the source size.

   It runs TOP to BOTTOM, and that is load-bearing: `textPath` lays its
   glyphs along the path's own direction, so which end the path starts at
   decides which way up every letter sits. Do not infer the direction from
   where the baked text's `d` opens (`M450.443 744.377`, near the foot of
   the box) — outlined type is a bag of glyph CONTOURS in no particular
   order, and that first one is not the first letter. Rendering the export
   settles it: its words begin upright at the top of the S and turn over by
   the bottom, which is this direction.                                      */
const RIBBON_D =
  'M537.9 83.6C528.3 75.8,500 44.5,480.1 36.7C460.2 28.9,437.8 35,418.4 37C398.9 39.1,381.1 43.9,363.4 48.8C345.6 53.7,328.6 59.7,311.7 66.3C294.8 73,278.1 80.5,262 88.7C245.8 96.8,230.1 105.6,214.7 115.2C199.4 124.9,184.1 135.3,169.7 146.5C155.2 157.8,141.1 169.7,128 182.7C114.8 195.8,102 209.7,90.7 224.9C79.4 240.1,68.7 256.4,60.3 273.8C51.9 291.3,44.6 310.5,40.3 329.7C36 349,33.5 369,34.6 389.2C35.6 409.4,38.8 431.7,46.8 451C54.8 470.3,68.8 489.8,82.6 504.9C96.4 519.9,113.5 530.9,129.5 541.2C145.5 551.6,162.4 559.2,178.8 566.9C195.2 574.6,211.7 580.9,227.8 587.4C243.9 593.9,259.8 599.7,275.3 606C290.8 612.3,306.1 618.3,320.7 625.1C335.3 632,349.8 639.1,362.7 647.2C375.7 655.3,388 663.9,398.2 673.6C408.5 683.3,417.4 693.9,424.2 705.4C430.9 716.9,435.3 728.4,438.7 742.5C442.1 756.6,443.8 782.1,444.8 790';

/** the box the art was exported at, and the band's own measured thickness */
const RIBBON_W = 565.9;
const RIBBON_H = 794.075;
const RIBBON_THICK = 69;

/**
 * Where each copy goes. Figma gives them as rotated bounding boxes — the
 * left one (193:7949) at (−339, −138), 794.714 × 935.597, holding the ribbon
 * turned 160.89°; the right one (193:7948) at (1183, 36), unturned. Those
 * are recorded here as the ribbon's own CENTRE plus an angle instead,
 * because a centre and an angle survive being scaled and a rotated bounding
 * box does not.
 *
 * The centres come to (58.4, 329.8) and (1466.0, 433.0) in the 1440 × 866
 * frame, so the right copy sits 26px past the right edge. Both axes are
 * tokens because the phone does not merely shrink this arrangement — it
 * moves the two copies into opposite CORNERS, which is a different
 * composition, not a scaled one. See `--ribbon-a-*` in tokens.css.
 *
 * `dir` is the side it flies in from — outward, off its own edge.
 */
const RIBBONS = [
  { x: 'var(--ribbon-a-x)', y: 'var(--ribbon-a-y)', rotate: 160.89, dir: -1 },
  { x: 'var(--ribbon-b-x)', y: 'var(--ribbon-b-y)', rotate: 0, dir: 1 },
];

/** Figma sets it as one phrase repeated, separated by nothing but a space. */
const PHRASE = 'DESIGN SERVICES ';

/**
 * How many copies of the phrase are written into each ribbon.
 *
 * `textPath` simply does not draw glyphs that fall past either end of the
 * path, so over-supplying costs a little layout and nothing visually — but
 * under-supplying leaves a visible gap chasing the tail. The floor is
 * `pathLength / phraseWidth + 1`: the +1 is the copy that has to be waiting
 * off the start of the path to take the place of the one leaving the end.
 *
 * Measured: the path is 1318 long and the phrase sets 264.9 at 28px, so five
 * copies fill it and the sixth is the spare. Nine is comfortable margin for
 * a fallback face setting narrower than Montserrat.
 */
const REPEATS = 9;

/** px of path travelled per second — one phrase every ~6s */
const RIBBON_SPEED = 44;

/* ── The arrival, removed 2026-09-05 ────────────────────────────────────
   George: *"the chips and ribbons should not move."* The pinned
   choreography is gone; these are its measured numbers, kept as a record
   rather than as dead bindings so that bringing it back does not mean
   deriving them again.

     ARRIVAL        2200   pinned scroll for the whole sequence
     ARRIVAL_SMALL  1500   the same under 900px wide

   Timeline positions, in the timeline's own units — the point was always
   the ORDER, which reads better as a table than as six `position`
   arguments encountered one at a time:

     chipsIn      0
     ribbonsIn    0.9
     still        2.2    everything at rest; nothing happens through here
     ribbonsOut   3.2
     chipsOut     3.35
     end          4.8    empty screen, held so the pin never released
                         mid-exit

   The chips also had an idle float (Figma 191:4312, "Floationg
   animation") driven by a `seeded(i, salt)` hash — two sine waves per axis
   on periods that do not divide into each other, because one sine is a
   pendulum and five chips nodding on the same clock reads as a loading
   state rather than as floating. */

const CHIPS = [
  { label: 'Product', color: 'var(--red-500)' },
  { label: 'UX', color: 'var(--pink-500)' },
  { label: 'Creative', color: 'var(--blue-500)' },
  { label: 'Graphic', color: 'var(--green-500)' },
  { label: 'UI', color: 'var(--yellow-500)' },
];

/**
 * The floating annotation on the chip stack (Figma 191:4312, "Floationg
 * animation"). Same approach as the horizontal ribbon's idle drift, and for
 * the same reason: TWO sine waves per axis on periods that do not divide
 * into each other. One sine is a pendulum — the eye finds the beat inside a
 * couple of seconds and five chips nodding on the same clock stops reading
 * as floating and starts reading as a loading state.
 */
export default function SellingPointSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      /* Anything GSAP does not own, and so will not revert on its own —
         currently the entrance's viewport observer. */
      const cleanup: (() => void)[] = [];
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      /* ── The ribbons' marquee ────────────────────────────────────────
         `startOffset` is the only honest way to move text along a path: a
         transform on the <text> would slide it off the curve instead of
         through it. It runs from 0 to −one phrase, at which point copy 2 is
         standing exactly where copy 1 was and the loop restarts on an
         identical frame — so the wrap is invisible without any crossfade.

         The distance is measured, never assumed. The phrase's width depends
         on the face that actually loaded, so this waits for `fonts.ready`
         and reads it off a hidden ruler set in the same style. Hard-coding
         it would drift the moment Montserrat fell back.                     */
      const marquees = gsap.utils.toArray<SVGTextPathElement>('[data-marquee]');
      const ruler = section.querySelector<SVGTextElement>('[data-ruler]');

      const spin = () => {
        const unit = ruler?.getComputedTextLength() ?? 0;
        if (!unit) return;
        marquees.forEach((tp) => {
          gsap.fromTo(
            tp,
            { attr: { startOffset: 0 } },
            {
              attr: { startOffset: -unit },
              duration: unit / RIBBON_SPEED,
              ease: 'none',
              repeat: -1,
            },
          );
        });
      };

      /* `fonts.ready` can resolve either side of this effect, so the state
         is checked rather than waited on blindly. */
      if (document.fonts.status === 'loaded') spin();
      else document.fonts.ready.then(spin);

      /* ── The entrance, restored 2026-09-05 ───────────────────────────
         George: *"let's not forget the reveal animations that we already
         had for the texts, the chips and the ribbons."*

         This is a REVEAL, not the old travel. The chips and the ribbons
         arrive and then hold exactly where 231:16735 draws them — they never
         travel across the band the way they used to. Which is what "should
         not move" and "don't forget the reveals" both ask for at the same
         time.

         The ARRIVAL itself is scrubbed against the band's position on screen
         — George asked for the same treatment the sentence gets: *"let's add
         the revealing animation we had in the chips as well."* So they build
         as you scroll down and come apart again as you scroll back up, and
         the panel's `tailRun` holds them finished and still before the next
         panel is allowed over them. */
      const chips = gsap.utils.toArray<HTMLElement>('[data-chip]');
      const ribbons = gsap.utils.toArray<HTMLElement>('[data-ribbon]');

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduce) {
        /* Start states are SET, never left to `from()`. A paused `from`
           writes its start values only when the timeline first renders, so
           until the cue arrives the chips and ribbons sit at their resting
           positions in full view — and then snap away to animate back in.
           The same defect the hero and the reveals both had. */
        gsap.set(ribbons, { scale: 0.86, autoAlpha: 0, transformOrigin: '50% 50%' });
        gsap.set(chips, { y: 44, autoAlpha: 0 });

        const entrance = gsap.timeline({ paused: true });

        /* The ribbons first and from further out: they are the backdrop the
           chips land in front of, so they have to be there to land in. */
        entrance.to(
          ribbons,
          { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
          0,
        );
        entrance.to(
          chips,
          { y: 0, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.08 },
          0.25,
        );

        /* Played when this section is actually ON SCREEN, not when the
           panel it lives in arrives.

           The panel cue fires as the panel takes the screen — but this band
           is the BOTTOM half of a panel taller than the window, so at that
           moment it is still hundreds of pixels below the fold. The chips
           and ribbons were animating in where nobody could see them, and by
           the time the panel's overscroll carried them up the entrance had
           long finished. All you ever saw was the parked state or the
           settled one, which is exactly why they read as missing.

           A rect check works whether the section is pinned, transformed by
           the overscroll, or sitting in ordinary flow — none of which a
           ScrollTrigger keyed to its own position would survive. */
        /* The band carries its own `data-hold`, so the panel stops with it
           filling the screen and the chips build over a screen of scroll that
           moves nothing — George: *"let's add a force scroll to the chips as
           well."* The positional scrub is the fallback for anywhere this
           section is used outside a panel that holds. */
        const held = section.closest('[data-hold]');
        cleanup.push(
          held
            ? scrubToHold(held, entrance)
            : scrubToPosition(section, entrance, { from: 0.85, to: 0.05 }),
        );
      }

      /* ── Static otherwise, 2026-09-05 ────────────────────────────────
         George: *"the chips and ribbons should not move and the other
         section should come on top of them like the white came on top of
         hero."*

         So the whole choreography is gone: the pinned ScrollTrigger, the
         2200px arrival that flew the chips in and the ribbons out, and the
         chips' idle float. The band is now exactly what 231:16735 draws and
         it simply sits there while the categories panel rides up over it.

         What survives is the MARQUEE above — the ribbons themselves are
         nailed down and only the lettering travels along them. That is the
         ribbon's identity rather than the ribbon moving, and without it two
         big black arcs read as clip art.

         `ARRIVAL`, `ARRIVAL_SMALL` and the `AT` cue sheet are kept in the
         file: they are the measured timings of that arrival, and re-deriving
         them costs a great deal more than leaving them unreferenced. */

      return () => cleanup.forEach((fn) => fn());
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Design services"
      /* The panel stops here for a screen of scroll while the chips and the
         ribbons build — see `PanelStack`'s hold handling. */
      data-hold
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{
        background: 'var(--bg-page)',
        height: 'var(--hsection-h)',
        paddingInline: 'var(--gutter)',
        /* the browser tries to hold the scroll position steady when content
           above resizes, and a pin-spacer being written in is exactly that —
           it reads as the page nudging itself up and down */
        overflowAnchor: 'none',
      }}
    >
      {RIBBONS.map((r, i) => (
        /* Two elements again: the wrapper is GSAP's, for the arrival, and
           the SVG inside holds the resting placement in CSS so it is right
           in the server's markup and never flashes through un-positioned.
           `transformOrigin: 0 0` on the wrapper is the ribbon's own visual
           centre — that is what the SVG's −50%/−50% puts there — so scaling
           and rotating the wrapper pivots the ribbon about itself. */
        <span
          key={i}
          data-ribbon
          className="pointer-events-none absolute block"
          style={{ left: r.x, top: r.y, transformOrigin: '0 0' }}
        >
          <svg
            viewBox={`0 0 ${RIBBON_W} ${RIBBON_H}`}
            width={RIBBON_W}
            height={RIBBON_H}
            aria-hidden="true"
            focusable="false"
            className="block"
            style={{
              transform: `translate(-50%, -50%) rotate(${r.rotate}deg) scale(var(--ribbon-scale))`,
            }}
          >
            <defs>
              <path id={`vol2-ribbon-${i}`} d={RIBBON_D} fill="none" />
            </defs>
            {/* the band itself — a stroke as wide as the art it replaces */}
            <use
              href={`#vol2-ribbon-${i}`}
              stroke="var(--text-primary)"
              strokeWidth={RIBBON_THICK}
              fill="none"
            />
            <text
              fill="var(--text-inverse)"
              dominantBaseline="central"
              style={{ font: '700 28px/28px var(--font-sans)' }}
            >
              <textPath data-marquee href={`#vol2-ribbon-${i}`} startOffset={0}>
                {PHRASE.repeat(REPEATS)}
              </textPath>
            </text>
            {/* the ruler: one phrase, same style, never drawn — read once to
                find out how far the marquee travels before it repeats */}
            {i === 0 && (
              <text
                data-ruler
                visibility="hidden"
                style={{ font: '700 28px/28px var(--font-sans)' }}
              >
                {PHRASE}
              </text>
            )}
          </svg>
        </span>
      ))}

      <div
        className="relative flex flex-col items-center"
        style={{ gap: 'var(--sp-gap)' }}
      >
        {CHIPS.map((c) => (
          <div key={c.label} data-chip>
            <div
              data-drift
              className="flex items-center justify-center rounded-lg"
              style={{
                background: c.color,
                height: 'var(--chip-h)',
                paddingInline: 'var(--chip-px)',
              }}
            >
              <span
                className="whitespace-nowrap uppercase"
                /* --chip-ink, not --text-inverse: the label sits on the
                   chip's own brand colour, so it stays near-black even
                   when the panel around it is light. */
                style={{ font: 'var(--chip-font)', color: 'var(--chip-ink)' }}
              >
                {c.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
