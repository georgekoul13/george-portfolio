'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

import './scrollDefaults';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * The projects band — the line that leads in, then a receding 3D rank of the
 * work. Replaces two bands at once: `HorizontalSection`, a pinned ribbon
 * that travelled sideways while the page was held, and `ProjectGallery`, the
 * horizontal strip of square cards after it.
 *
 * The mechanic is the one on artpill.studio.
 *
 * Their version is Three.js r171 driving textured planes inside one
 * full-viewport canvas, with Lenis eating the wheel (their document never
 * scrolls: `scrollHeight` is one viewport). None of that is needed. Every
 * plane in the reference is a straight-edged flat rectangle — no curvature,
 * no shader, no displacement — so CSS 3D draws the identical picture, and
 * doing it in the DOM keeps `next/image`, real links and real text.
 *
 * ── the geometry ────────────────────────────────────────────────────────
 * Every card sits at the SAME world X, left of the perspective origin, and
 * differs only in Z. Perspective does the rest: `scale = P / (P + |z|)`
 * pulls each card toward the vanishing point as it recedes, so a column of
 * identical cards at one X projects as the diagonal march. Nothing needs a
 * per-card X.
 *
 * That is also why cards exit to the LEFT: coming forward means a bigger
 * projection factor on a negative X, which walks the card off frame before
 * it reaches the camera. The loop's teleport happens out of sight.
 *
 * ── the numbers ─────────────────────────────────────────────────────────
 * Read off the reference rather than guessed. Its front card measures
 * 250 x 412 on screen with a left edge of 350 and a right edge of 475 —
 * a 1.357 edge ratio. For a plane of width W rotated by t, the two edges sit
 * (W/2)sin(t) apart in Z, so
 *
 *     (A + B) / (A - B) = 1.357,  A = P + Zfront,  B = (W/2)sin(t)
 *
 * which gives B = 0.1515A. Feeding that back through the projected height
 * puts P near 460 and the rotation near 45 degrees at their viewport — a
 * much shorter perspective and a much harder turn than this reads as by
 * eye. Scaled to 1440 that is the DEFAULTS below.
 *
 * Every one of them is live-tunable: add `?tune=1` to the URL.
 */

/**
 * Fourteen, as asked. Nine of these carry George's new 900x675 artwork; the
 * five marked `low` are stand-ins pulled from elsewhere in the repo at
 * whatever size they happen to be, and they WILL look soft at this card
 * size. They are here to prove the mechanic at 14, not to ship.
 */
const CARDS = [
  { slug: 'olga-posonidou',   title: 'Olga Posonidou',   img: '/images/projects/orbit/olga-posonidou-1.png' },
  { slug: 'arcana',           title: 'Arcana',           img: '/images/projects/orbit/arcana-1.png' },
  { slug: 'deerislnd',        title: 'DEERISLND',        img: '/images/projects/orbit/deerislnd-1.png' },
  { slug: 'cabaret',          title: 'Cabaret',          img: '/images/projects/orbit/cabaret-1.png' },
  { slug: 'gaspar-ai',        title: 'Gaspar AI',        img: '/images/projects/gaspar/gaspar-04.png' },
  { slug: 'danai-michali',    title: 'Danai Michali',    img: '/images/projects/orbit/danai-michali-1.png' },
  { slug: 'in-pixels-we-see', title: 'In Pixels We See', img: '/images/projects/orbit/in-pixels-we-see-1.png' },
  { slug: 'book-cover',       title: 'Book Cover',       img: '/images/projects/book/book-01.png',      low: true },
  { slug: 'vasiliki-vozora',  title: 'Vasiliki Vozora',  img: '/images/projects/orbit/vasiliki-vozora-1.png' },
  { slug: 'athens-goes-mayan',title: 'Athens Goes Mayan',img: '/images/projects/orbit/athens-goes-mayan-1.png' },
  { slug: 'illustrations',    title: 'Illustrations',    img: '/images/projects/creatives/creative-01.png', low: true },
  { slug: 'maria-fitsopoulou',title: 'Maria Fitsopoulou',img: '/images/projects/orbit/maria-fitsopoulou-1.png' },
  { slug: 'mood',             title: 'Mood',             img: '/images/projects/mood/mood-04.png',      low: true },
  { slug: 'cybersential',     title: 'Cybersential',     img: '/images/projects/orbit/cybersential-1.png', low: true },
];

const N = CARDS.length;

export type Tuning = typeof DEFAULTS;

export const DEFAULTS = {
  /**
   * Camera distance, and it wants to be LONG. This was 1200, fitted from the
   * stills, and the hover proved it wrong: at that distance a card sitting
   * ~1350px off the projection axis has its two vertical edges projected at
   * very different factors, and they land closer together than the flat card
   * would be. Turning such a card square to the camera makes it NARROWER —
   * measured 82 -> 62 where the reference goes 120 -> 230.
   *
   * A long perspective makes the projection near-affine, so a rotated card
   * is honestly foreshortened by `cos(rotate)` and squaring it up widens it
   * by 1/cos — 1.79 at 56 degrees, against the reference's measured 1.92.
   * The falloff that the short perspective used to provide now comes from
   * `ratio` instead, where it belongs.
   *
   * The angle came down from 56 to 28 for a reason worth writing down: 56
   * was fitted from the EDGE-HEIGHT ratio read off compressed stills, and it
   * squashes a landscape card until it reads as a portrait one. The rest
   * state is the thing actually being judged, and there the reference's
   * cards read landscape at about 1.35 on screen. A card is foreshortened by
   * `cos(turn)`, so 1.35 out of a 1.5 plane needs cos(turn) = 0.9 — call it
   * 26 to 28 degrees, less than half what the edge fit claimed.
   *
   * 4200 got the sign right — the card widened rather than narrowed — but
   * only by 1.24 against the reference's 1.92, because a third of the
   * foreshortening was still being eaten by the differential. It has to go
   * much longer than feels reasonable before a rotated card behaves like an
   * honestly foreshortened one.
   */
  perspective: 12000,
  /** the vanishing point. Past 100 on purpose — it sits OFF the right edge. */
  originX: 111,
  originY: 50,
  /** every card's world X. Negative = left of the vanishing point. */
  worldX: -618,
  /**
   * How much smaller each card is than the one in front of it. Read off the
   * reference's rank as a near-CONSTANT 0.885 all the way back — and a
   * constant ratio is the giveaway that its cards are NOT evenly spaced in
   * Z. Even spacing under a perspective gives a ratio that flattens with
   * depth; a constant one needs depth to grow geometrically, which is what
   * `depthOf` below does.
   */
  ratio: 0.885,
  /**
   * Degrees of extra turn per place back. The rank is not a straight line in
   * the reference — it bows away, so a card is closest to square-on near the
   * front and progressively more edge-on toward the back. One constant angle
   * for everything reads as a flat deck of cards; this is what makes it a
   * path.
   */
  curve: 2.6,
  /**
   * Depth of the leading card. It rides WITH `perspective`: the front card's
   * size is `P / (P + near)`, so lengthening the camera without opening this
   * up in the same proportion just inflates the whole rank.
   */
  near: 860,
  /**
   * The turn. POSITIVE, and that sign is the whole ballgame: CSS `rotateY(t)`
   * sends a card's local +x to `(cos t, 0, -sin t)`, so flipping it decides
   * which vertical edge ends up nearer the camera. Get it wrong with the
   * vanishing point off to the right and the two edges project on top of each
   * other — every card collapses to a 4px sliver while its HEIGHT still looks
   * perfectly correct, which is a maddening thing to debug.
   */
  rotate: 28,
  /**
   * Landscape. These were 260x480 — portrait — which was wrong twice over:
   * the reference's planes are landscape, and every source image in this
   * repo is 900x675, so `object-cover` was throwing away two thirds of each
   * one to fit a tall box.
   *
   * 3:2 rather than the sources' own 4:3, because what has to land at the
   * reference's proportion is the FORESHORTENED card, not the plane: 480x320
   * turned 28 degrees reads as roughly 432x320 on screen, which is the 1.35
   * the reference measures. The residual crop off a 4:3 source is slight.
   */
  cardW: 480,
  cardH: 320,
  /**
   * Hover: how much of `rotate` survives. Measured on the reference at
   * effectively 0 — the card turns square to the camera and does nothing
   * else. Captured at one scroll position, rest vs hover: width 120 -> 230,
   * height 205 -> 232, left edge 300 -> 303. A near-doubling of width, a
   * stationary left edge and a height that barely moves is a rotation about
   * the LEFT EDGE and nothing more; the 13% of height is just the card's
   * centre swinging toward the camera as it opens.
   */
  hoverTurn: 1,
  /**
   * How far the hovered card slides out of the stack, in design px.
   *
   * This replaced a `scaleX`, which was simply wrong: it stretched the
   * photograph. Nothing about the card's size changes on hover in the
   * reference — the cards OVERLAP, so each one is partly hidden behind the
   * one in front of it, and sliding it sideways uncovers the rest. The
   * "width x1.92" I measured off pixels was the visible portion growing
   * while the plane stayed exactly the size it always was.
   *
   * Which is also why the visible left edge looked pinned: it was never the
   * card's edge, it was the edge of the card in front.
   */
  hoverShift: 150,
  /**
   * How far the rank rises toward the back, in screen px, as a smooth arc.
   * The path is not a straight line — the cards climb as they recede, which
   * is what makes the row read as a curve you are looking along rather than
   * a flat deck fanned out.
   *
   * Written as a SCREEN distance and divided back through the projection
   * below, so the number means what it says at any depth.
   */
  bow: 90,
  /** what the un-hovered cards dim to. The reference does not dim them. */
  restDim: 1,
};

/** the width every length in DEFAULTS was fitted at */
const DESIGN_W = 1440;

/**
 * The line that leads the band in — Figma 210:5708, taking the place the
 * reference gives its own headline: large, high in the frame, and scrolling
 * up and out as the rank arrives rather than sitting in a band of its own.
 *
 * Figma draws it as "WERE EVERY", a typo for "WHERE". Corrected. The old
 * copy also carried ", SCROLL TO SEE FEATURED PROJECTS" — an instruction
 * that only existed to explain the ribbon this replaces.
 */
const HEADLINE = ['WHERE EVERY PROJECT IS', 'DESIGNED WITH CARE'];

/** Montserrat cap band at line-height 1 runs 0.1585em -> 0.8585em. */
const CAP_TRIM = { lineHeight: 1, marginTop: '-0.1585em', marginBottom: '-0.1415em' } as const;

/**
 * Page scroll spent per card. The reference gives its rank about 1800px for
 * fourteen cards, so ~130 — this is a little slower.
 */
const RATE = 150;
/**
 * Where the rank sits before the band is reached, in cards behind the near
 * plane. Not a round number: at the reference's entry moment its leading
 * card sits about 65% across the frame, and a card's screen X is
 * `ox + (cx - ox) * P/(P + depth)`, so solving that back gives a depth of
 * roughly four places back.
 *
 * Four was still too shallow: it put the whole rank across the frame while
 * the line was still being read, so the images arrived before the sentence
 * did. At seven only the leading two or three are in frame during the
 * headline, clustered at the right the way the reference has them.
 */
const START = -7;
/** how far the entry leg carries it before the pin takes over */
const ENTRY = -4.5;
/** extra cards' worth of travel so the last one clears the frame */
const TAIL = 3;
/**
 * A card smaller than this is not drawn. The whole point of putting the
 * vanishing point off the right edge is that a card small enough is ALREADY
 * out of frame, so it can stop being drawn without anyone seeing it go.
 */
const FAR_SCALE = 0.05;

export default function PerspectiveGallery({
  tuning = DEFAULTS,
}: {
  tuning?: Tuning;
}) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  /* The tuner rewrites this on every slider drag; the render loop reads it
     rather than closing over a value, so a change lands on the next frame
     without rebuilding the ScrollTrigger. */
  const t = useRef(tuning);
  t.current = tuning;

  const hover = useRef<number | null>(null);
  hover.current = active;

  useGSAP(
    () => {
      const section = root.current!;
      const cards = gsap.utils.toArray<HTMLElement>('[data-pcard]');
      if (!cards.length) return;

      gsap.set(cards, { xPercent: -50, yPercent: -50, transformStyle: 'preserve-3d' });

      /* `p` is measured in CARDS, not pixels or percent — one unit of p
         advances the whole rank by exactly one place. Counting in cards
         rather than pixels is what lets the scroll length, the drag rate and
         the entry offsets all be written in the same currency — and it
         survived the move to geometric depth untouched, where a pixel-based
         position would not have. */
      const state = { p: START, target: START, drag: 0 };

      /* Every length in DEFAULTS was fitted at 1440. Scaling them by the
         stage's own width — rather than letting the cards keep a fixed pixel
         size — is what stops the rank from filling a laptop and overflowing a
         phone. Angles and the two origin percentages are ratios already, so
         they stay put. `perspective` has to go on the stage's style because
         CSS resolves it on the parent, not on the transformed child. */
      const render = () => {
        const c = t.current;
        const k = stage.current!.offsetWidth / DESIGN_W;
        const h = hover.current;
        const P = c.perspective * k;

        /* Depth grows geometrically so the size ratio between neighbours is
           constant, which is what the reference measures at. `u` is position
           in the rank in cards; the leading card sits at `near`. */
        const depthOf = (u: number) => (P + c.near * k) * Math.pow(c.ratio, -u) - P;
        /* the turn a card carries at its place in the rank */
        const turnAt = (u: number) => c.rotate + c.curve * u;
        const halfW = (c.cardW * k) / 2;

        stage.current!.style.perspective = `${c.perspective * k}px`;
        stage.current!.style.perspectiveOrigin = `${c.originX}% ${c.originY}%`;
        stage.current!.style.setProperty('--pg-w', `${c.cardW * k}px`);
        stage.current!.style.setProperty('--pg-h', `${c.cardH * k}px`);

        /* The rank is FINITE. It was a loop, and the loop was wrong: the
           reference starts empty with one card arriving at the right, fills
           as you scroll, and ends with every card gone off the left — about
           1800px of page for fourteen cards. Nothing ever wraps, which is
           also why none of this needs the opacity tapers it used to have.
           Cards are clipped by the frame, never faded. */
        for (let i = 0; i < N; i++) {
          const u = i - state.p;
          const depth = depthOf(u);
          const on = h === i;
          const rest = turnAt(u);
          const rad = (rest * Math.PI) / 180;

          /* Rotating to face the camera about the card's LEFT edge, while
             the transform-origin stays at the centre. Holding the left edge
             still costs a nudge right of half the width it gains, and the
             centre swings toward the camera by half the depth it loses —
             both fall straight out of the angle, so the hover has no magic
             numbers in it at all. */
          const turn = on ? rest * c.hoverTurn : rest;
          /* Out of the stack, and nothing else. */
          const openX = on ? c.hoverShift * k : 0;
          const openZ = on && c.hoverTurn < 1 ? halfW * Math.sin(rad) : 0;

          /* The arc. `bow` is a screen distance, so it has to be divided back
             through the projection — a card at `depth` is drawn at
             `P / (P + depth)`, so multiplying by the inverse of that leaves
             the rise reading the same at every depth. */
          const rise = -(c.bow * k * depth) / P;

          const z = -depth + openZ;

          /* Two ways off stage, and both are just "it is not in the frame":
             past the camera (a card that has grown and walked off the left)
             and beyond the far limit (one that has not arrived yet). The
             near cutoff has to sit WELL short of the perspective distance —
             at z = P the projection divides by zero. */
          /* Culled by how small it has become rather than by a depth
             number: with geometric spacing the far end runs away fast, and
             `scale` is the thing that actually says "off frame". */
          const scale = P / (P - z);
          const gone = z > P * 0.45 || scale < FAR_SCALE;

          gsap.set(cards[i], {
            x: c.worldX * k + openX,
            y: rise,
            z,
            rotationY: turn,
            /* no scale at all — see `hoverShift` */
            scale: 1,
            opacity: gone ? 0 : h === null || on ? 1 : c.restDim,
            visibility: gone ? 'hidden' : 'visible',
          });
        }
      };

      /* One lerp in the ticker rather than a tween per scroll event: the
         scrub and the drag both write `target`, and this is the only thing
         that ever moves `p`. Two sources, one integrator, no fighting. */
      const tick = () => {
        state.target = position() + state.drag;
        state.p += (state.target - state.p) * 0.12;
        render();
        renderHead();
      };
      gsap.ticker.add(tick);

      const travel = () => (N + TAIL) * RATE;

      /* Two triggers, read every frame rather than each writing the position
         itself. `entry` runs while the section is still climbing the screen,
         so the first cards are already arriving as the text above scrolls
         away — the overlap the reference has, and the reason the band does
         not read as "text, then a gallery". `main` is the pin and carries
         the rest. Reading both in the ticker means they can never fight over
         who last wrote the value. */
      const entry = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'top top',
      });

      const main = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${travel()}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
      });

      /* The line rides the same two triggers as the rank rather than getting
         a ScrollTrigger of its own. It has to: once the section pins, every
         element inside it is frozen in the viewport, so a trigger keyed to
         the line's own position would never complete. Reading progress off
         the triggers that already exist sidesteps that entirely. */
      const head = section.querySelector<HTMLElement>('[data-headline]');

      /* Split to characters and rise them in a stagger, rather than sliding
         two whole lines. Each line box already clips, so a character sitting
         at yPercent 100 is simply below its own line and invisible — no
         extra masks needed.
         `chars` is captured once; re-splitting every frame would be both
         ruinous and pointless, since the split does not depend on scroll. */
      const split = head
        ? new SplitText(head.querySelectorAll('[data-line]'), { type: 'chars' })
        : null;
      const chars: HTMLElement[] = (split?.chars as HTMLElement[]) ?? [];
      const SPREAD = 0.55; // how much of the entry leg the stagger occupies

      const renderHead = () => {
        if (!head) return;
        /* Arriving. The stagger runs left to right across BOTH lines as one
           run, so the sentence assembles in reading order instead of the two
           lines racing each other. */
        const e = entry.progress;
        const n = Math.max(1, chars.length - 1);
        chars.forEach((el, i) => {
          const lead = (i / n) * SPREAD;
          const local = gsap.utils.clamp(0, 1, (e - lead) / (1 - SPREAD));
          /* a soft ease so the letters settle rather than stop dead */
          const eased = 1 - Math.pow(1 - local, 3);
          gsap.set(el, { yPercent: (1 - eased) * 100, opacity: eased });
        });
        /* leaving: it scrolls up and out over the first fifth of the pin,
           while the first cards are already coming in from the right —
           which is the whole reason the two read as one movement */
        const out = gsap.utils.clamp(0, 1, main.progress / 0.2);
        gsap.set(head, { yPercent: -out * 130, opacity: 1 - out });
      };

      const position = () =>
        START + (ENTRY - START) * entry.progress + (N + TAIL - ENTRY) * main.progress;

      /* Drag rides ON TOP of the scroll position rather than replacing it,
         so letting go doesn't snap back to wherever the page happens to be. */
      let dragging = false;
      let lastX = 0;
      const down = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        section.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        state.drag -= (e.clientX - lastX) / 90;
        lastX = e.clientX;
      };
      const up = (e: PointerEvent) => {
        dragging = false;
        section.releasePointerCapture?.(e.pointerId);
      };
      section.addEventListener('pointerdown', down);
      section.addEventListener('pointermove', move);
      section.addEventListener('pointerup', up);
      section.addEventListener('pointercancel', up);

      render();
      const onResize = () => render();
      window.addEventListener('resize', onResize);

      return () => {
        split?.revert();
        window.removeEventListener('resize', onResize);
        gsap.ticker.remove(tick);
        entry.kill();
        main.kill();
        section.removeEventListener('pointerdown', down);
        section.removeEventListener('pointermove', move);
        section.removeEventListener('pointerup', up);
        section.removeEventListener('pointercancel', up);
      };
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section
      ref={root}
      className="relative w-full"
      style={{ height: '100svh', background: 'var(--bg-page)', touchAction: 'pan-y' }}
    >
      {/* Behind the clip on purpose: in the reference a card that reaches
          the headline passes IN FRONT of it. */}
      <div
        data-headline
        className="pointer-events-none absolute inset-x-0 flex justify-center px-[var(--gutter)]"
        /* High, not centred. The reference puts its headline's cap at about
           8% of the viewport and centres the rank at 50%, which is what keeps
           the two clear of each other — at 26% the second line ran straight
           through the incoming cards. */
        style={{ top: '9%' }}
      >
        <h2
          className="text-center uppercase"
          style={{
            fontSize: 'var(--pgal-head)',
            lineHeight: 1.06,
            fontWeight: 300,
            letterSpacing: '-0.01em',
            color: 'var(--text-secondary)',
          }}
        >
          {HEADLINE.map((line) => (
            /* each line clipped by its own box so the wipe has an edge */
            /* `nowrap`, because the two lines are broken by hand above. Left
               to itself the longer one re-wraps at the top of the size ramp —
               96px of a 22-character line is wider than it looks — and the
               headline arrives as four ragged lines instead of two. */
            <span key={line} className="block overflow-hidden">
              <span data-line className="block whitespace-nowrap">
                {line}
              </span>
            </span>
          ))}
        </h2>
      </div>

      {/* The 3D context and the clip are deliberately two different
          elements. Safari flattens `preserve-3d` the moment an ancestor
          carries `overflow: hidden`, so the stage below must never be the
          thing that clips — the section is. */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={stage}
          className="absolute inset-0"
          /* perspective / perspectiveOrigin / --pg-w / --pg-h are written by
             the render loop so a resize and a slider drag take the same path.

             `pointer-events: none` is not optional. The stage is a plane at
             z = 0 and every card sits at NEGATIVE z, i.e. behind it, so an
             ordinary transparent stage wins every hit test and no card ever
             sees a `mouseenter` — the rank renders perfectly and is simply
             not hoverable. The cards take their own pointer-events back. */
          style={{ transformStyle: 'preserve-3d', pointerEvents: 'none' }}
        >
          {CARDS.map((c, i) => (
            <Link
              key={c.slug}
              href={`/vol2/projects/${c.slug}`}
              data-pcard
              aria-label={c.title}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((v) => (v === i ? null : v))}
              className="pointer-events-auto absolute block overflow-hidden will-change-transform"
              style={{
                left: '50%',
                top: '50%',
                width: 'var(--pg-w)',
                height: 'var(--pg-h)',
                background: 'var(--bg-raised)',
              }}
            >
              <Image
                src={c.img}
                alt=""
                aria-hidden="true"
                fill
                sizes="500px"
                className="object-cover"
                draggable={false}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* The title sits OUTSIDE the 3D context. Inside it, the browser
          depth-sorts it against the cards and it disappears behind them. */}
      <p
        className="pointer-events-none absolute left-1/2 w-full -translate-x-1/2 text-center uppercase transition-opacity duration-200"
        style={{
          ...CAP_TRIM,
          bottom: '18%',
          fontSize: 16,
          letterSpacing: '0.06em',
          color: 'var(--text-primary)',
          opacity: active === null ? 0 : 1,
        }}
      >
        {active === null ? ' ' : CARDS[active].title}
      </p>
    </section>
  );
}

export { CARDS };
