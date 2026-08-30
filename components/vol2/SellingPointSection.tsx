'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import './scrollDefaults';

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

/**
 * How much pinned scroll the whole sequence takes: chips in, ribbons in, a
 * beat of stillness, then both taken back off the screen before the pin
 * lets go. The section holds the viewport for all of it.
 */
const ARRIVAL = 2200;
const ARRIVAL_SMALL = 1500;

/* Timeline positions, in the timeline's own units. Laid out here rather
   than sprinkled through the calls because the whole point is the ORDER —
   reveal the chips, then the ribbons, hold, then clear the screen — and
   that order is much easier to check as a table than as six `position`
   arguments read one at a time. */
const AT = {
  chipsIn: 0,
  ribbonsIn: 0.9,
  /** everything at rest; nothing happens through here */
  still: 2.2,
  ribbonsOut: 3.2,
  chipsOut: 3.35,
  /** empty screen, held briefly, so the pin never releases mid-exit */
  end: 4.8,
};

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
const seeded = (i: number, salt: number) => {
  const n = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

export default function SellingPointSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
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

      /* ── The arrival ─────────────────────────────────────────────────
         The section pins at `top top` and is exactly one screen tall with
         an opaque background, so from the moment it takes hold there is
         nothing else on screen — no neighbour showing above or below. That
         is why it pins rather than merely scroll-triggering, and why the
         dividers either side are gone.

         Scrubbed, so the reader brings the chips in themselves rather than
         watching a clip play. Chips land first, the ribbons come in over
         the tail of them, and the last stretch is deliberately empty — the
         composition sits finished for a beat before the pin releases. */
      const chips = gsap.utils.toArray<HTMLElement>('[data-chip]');
      const ribbons = gsap.utils.toArray<HTMLElement>('[data-ribbon]');

      const length = () => (window.innerWidth < 900 ? ARRIVAL_SMALL : ARRIVAL);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + length(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          /* Highest of the page's four pinned sections, because it is the
             topmost. ScrollTrigger refreshes in descending priority, and a
             pin that refreshes late has already had its start measured
             against a page that did not yet contain the spacers of the pins
             above it. That is not cosmetic: with this section on the
             default 0 and the horizontal one on 1, the horizontal section
             measured its start 1150px — exactly this section's own pin
             length — too early, the two pin ranges overlapped by 250px, and
             the chips sat on screen next to "WHERE EVERY PROJECT…". */
          refreshPriority: 4,
        },
      });

      tl.from(
        chips,
        {
          yPercent: 60,
          autoAlpha: 0,
          scale: 0.7,
          ease: 'back.out(1.4)',
          duration: 1,
          stagger: 0.18,
        },
        AT.chipsIn,
      );

      /* Out along the PAGE's x axis, not the ribbon's. GSAP composes its
         transform as translate → rotate → scale, so `x` is the outermost
         term and stays horizontal whatever the copy is rotated to — which
         is why the resting rotation lives on the SVG's own CSS transform,
         one element further in, leaving this wrapper free. */
      ribbons.forEach((r, i) => {
        const dir = RIBBONS[i].dir;
        tl.from(
          r,
          {
            x: () => dir * window.innerWidth * 0.55,
            rotation: dir * 12,
            scale: 0.82,
            autoAlpha: 0,
            ease: 'power3.out',
            duration: 1.3,
          },
          AT.ribbonsIn,
        );
      });

      /* ── The exit ────────────────────────────────────────────────────
         The section does not just stop being interesting — it clears
         itself, and only then does the pin let go. That is what keeps this
         band and the horizontal one from ever being on screen together:
         by the time the next section starts arriving there is nothing left
         here to share the screen with.

         Ribbons leave first, back out the side they came in, because they
         arrived last — the sequence reads as unwinding. The chips follow,
         upward and out of frame, which is the direction the page is already
         travelling, and from the bottom of the stack up so the pile
         unstacks rather than sliding away as one slab. */
      ribbons.forEach((r, i) => {
        tl.to(
          r,
          {
            x: () => RIBBONS[i].dir * window.innerWidth * 0.9,
            rotation: RIBBONS[i].dir * 14,
            scale: 0.8,
            autoAlpha: 0,
            ease: 'power2.in',
            duration: 1.1,
          },
          AT.ribbonsOut,
        );
      });

      tl.to(
        chips,
        {
          yPercent: -170,
          scale: 0.65,
          autoAlpha: 0,
          ease: 'power2.in',
          duration: 1,
          stagger: { each: 0.12, from: 'end' },
        },
        AT.chipsOut,
      );

      // hold the empty screen so the pin can never release mid-exit
      tl.to({}, { duration: 0.1 }, AT.end);

      /* ── The chips' idle float ───────────────────────────────────────
         On a wrapper inside each chip, never on the chip itself: the
         arrival owns the chip's transform and this owns the wrapper's. One
         element carrying both would be two authors on one property, and the
         per-frame drift wins every frame. */
      const drifters = gsap.utils.toArray<HTMLElement>('[data-drift]');
      const bodies = drifters.map((el, i) => ({
        setX: gsap.quickSetter(el, 'x', 'px') as (v: number) => void,
        setY: gsap.quickSetter(el, 'y', 'px') as (v: number) => void,
        setR: gsap.quickSetter(el, 'rotation', 'deg') as (v: number) => void,
        ax1: 5 + seeded(i, 2) * 5,
        ax2: 2 + seeded(i, 3) * 2.5,
        ay1: 7 + seeded(i, 4) * 6,
        ay2: 2.5 + seeded(i, 5) * 3,
        ar: 0.7 + seeded(i, 6) * 1.3,
        t1: 5.3 + seeded(i, 7) * 3.1,
        t2: 3.1 + seeded(i, 8) * 1.7,
        t3: 6.7 + seeded(i, 9) * 3.9,
        t4: 2.9 + seeded(i, 10) * 1.9,
        t5: 8.1 + seeded(i, 11) * 4.4,
        p1: seeded(i, 12) * Math.PI * 2,
        p2: seeded(i, 13) * Math.PI * 2,
        p3: seeded(i, 14) * Math.PI * 2,
      }));

      const start = performance.now();
      /* A plain rAF loop, and the next frame is asked for BEFORE the work.
         Requesting it after means one throw inside the body ends the loop
         permanently and silently — which is exactly how the horizontal
         section's float died the first time, 102 frames in. */
      let frame = requestAnimationFrame(function loop() {
        frame = requestAnimationFrame(loop);
        const now = (performance.now() - start) / 1000;
        bodies.forEach((b) => {
          b.setX(Math.sin(now / b.t1 + b.p1) * b.ax1 + Math.sin(now / b.t2 + b.p2) * b.ax2);
          b.setY(Math.sin(now / b.t3 + b.p3) * b.ay1 + Math.sin(now / b.t4 + b.p1) * b.ay2);
          b.setR(Math.sin(now / b.t5 + b.p2) * b.ar);
        });
      });

      return () => cancelAnimationFrame(frame);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Design services"
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
                style={{ font: 'var(--chip-font)', color: 'var(--text-inverse)' }}
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
