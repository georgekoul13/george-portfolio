'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { getHoldProgress } from './holdProgress';
import { vol2Href } from './surface';

import './scrollDefaults';
import ProjectCards from './category/ProjectCards';
import { cardsForSlugs } from './category/categories';
import { HERO_BY_SLUG } from './project/vol2Projects';
import Picture from './project/Picture';

/** a project's own opening picture — see `CARDS` */
const hero = (slug: string) => HERO_BY_SLUG[slug] ?? '';

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
 * TWELVE of the nineteen, in the order George set on 2026-09-17:
 *
 *   Mood · Gaspar AI · Deerislnd · Piraeus · Nixteri · Danai ·
 *   Cybersential · Czech Image · Cancellation · Istorima · Tarot ·
 *   Rounded Typeface
 *
 * It is not a ranking of the work — it is the order he wants a stranger to
 * meet it in, so the two biggest product jobs lead and the personal pieces
 * close. Cancellation Insurance and Rounded Typeface joined; Olga Posonidou,
 * Cabaret, In Pixels We See and Vasiliki Vozora came out. All nineteen are
 * still reachable from the category pages.
 *
 * It used to carry `athens-goes-mayan`, `illustrations` and
 * `maria-fitsopoulou` — three slugs with no project behind them any more.
 * Each was a card on the home page linking straight to a 404, which is worse
 * than not being there: a reader clicks the thing that interested them and
 * is told it is gone.
 *
 * The pictures are each project's own hero now, the same file its page opens
 * on and the same one its card carries everywhere else, rather than the old
 * 270x200 orbit thumbnails stretched across a card drawn at 1240 wide. That
 * is why they used to look soft.
 */
const CARDS = [
  { slug: 'mood',                title: 'Mood',                img: hero('mood') },
  { slug: 'gaspar-ai',           title: 'Gaspar AI',           img: hero('gaspar-ai') },
  { slug: 'deerislnd',           title: 'Deerislnd Posters',   img: hero('deerislnd') },
  { slug: 'piraeus-insurance',   title: 'Piraeus Insurance',   img: hero('piraeus-insurance') },
  { slug: 'book-cover',          title: 'To Nixteri Book',     img: hero('book-cover') },
  { slug: 'danai-michali',       title: 'Danai Michali',       img: hero('danai-michali') },
  { slug: 'cybersential',        title: 'Cybersential',        img: hero('cybersential') },
  { slug: 'czech-image',         title: 'Czech Image',         img: hero('czech-image') },
  { slug: 'cancellation-wallet', title: 'Cancellation Insurance', img: hero('cancellation-wallet') },
  { slug: 'istorima',            title: 'Istorima',            img: hero('istorima') },
  { slug: 'arcana',              title: 'Tarot Cards',         img: hero('arcana') },
  { slug: 'rounded-typeface',    title: 'Rounded Typeface',    img: hero('rounded-typeface') },
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
  cardW: 560,
  cardH: 376,
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
  hoverShift: 280,
  /**
   * The cubic focus curve, lifted from gaspoorf/curve-gallery — the Blender
   * camera-path demo. Its scaling is
   *
   *     f = 1 - distance / maxDistance
   *     scale = 1 + f**3 * (maxScale - 1)
   *
   * A cube rather than a straight line, so a plane far away sits at its
   * plain size and only ramps as it arrives — "coming into focus" rather
   * than growing steadily the whole way in.
   *
   * It layers ON TOP of the geometric falloff rather than replacing it, so
   * the two are independent: `ratio` sets how the rank recedes, this sets
   * how much the leading card is singled out. Turning it off is
   * `focusMax: 1`. Note the reference's own rank measures a CONSTANT ratio
   * all the way back, i.e. no focus term at all — this is a deliberate
   * departure from it, not a correction toward it.
   */
  focusMax: 1.5,
  /**
   * How many places back the focus zone reaches. It wants to be WIDE — at 4
   * the whole ramp lands in four cards and leaves a shelf you can see:
   * neighbour ratios ran 1.13, 1.13, 1.13, then 1.42, 1.34, 1.21, then back
   * to 1.13. Two smooth curves stacked can still read as a lump if one of
   * them turns over inside the other's flat part. At 7 the ramp eases the
   * whole way out and the ratios taper 1.29 -> 1.13 without a step.
   */
  focusRange: 7,
  /**
   * Where the curve peaks, in places. NEGATIVE, and it has to be: `u` counts
   * from the near plane, but a card reaching that plane is already walking
   * off the left edge, so the front of the VISIBLE rank sits around u = -3.
   * Peaking at 0 put the whole ramp in the middle of the row and left the
   * leading cards clamped flat against each other — the emphasis landed on
   * the wrong cards entirely.
   */
  focusFrom: -3,
  /**
   * Extra separation between cards at the FAR end, in screen px.
   *
   * Perspective packs the arriving cards almost on top of each other, so the
   * back of the rank reads as one striped mass rather than as projects. This
   * pushes each card further along the row the deeper it sits, which widens
   * the GAPS without touching the near end: the offset is proportional to
   * depth, so it is zero for the card about to leave frame and grows from
   * there. The cards on their way out stay exactly where they were.
   *
   * Same trick as `bow` — written as a screen distance and divided back
   * through the projection so the number means what it says at any depth.
   */
  spread: 300,
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
/** below this stage width the rank is zoomed rather than scaled down */
/**
 * Pinned scroll the headline gets ENTIRELY TO ITSELF. Nothing else moves and
 * nothing else is on screen for the whole of it — see `arrive`.
 */
const ENTRY_RUN = 800;
/**
 * The share of the rank's leg over which the cards fade up as they sweep in.
 * Shorter than the headline's exit (0.2), so they are arriving while the line
 * is still on its way out rather than after it has gone — George: *"bring the
 * cards as the text is moving outside of the frame."*
 */
const CARDS_FADE = 0.1;
/**
 * How many of the fourteen the phone shows. George: *"the featured will be
 * the one under the other but only 10 in the responsive."* The 3D rank is a
 * pointer instrument — it wants a cursor over a wide stage and a drag across
 * it — so narrow it is not scaled down, it is replaced by a plain stacked
 * list, and the list is cut to ten rather than made to scroll forever.
 */
const MOBILE_COUNT = 10;
const MOBILE_UNDER = 700;
/** how much of the screen the leading card should hold on a phone */
const MOBILE_LEAD = 0.66;

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
 * Four was too shallow: it put the whole rank across the frame while the
 * line was still being read. Seven left only the leading two or three in
 * frame — better, and still wrong, because "two or three" is exactly what
 * George kept seeing before the text. Depth alone can never settle this: how
 * much of the rank is in frame depends on the stage width, so a number tuned
 * at 1440 leaks cards on a wider screen.
 *
 * So the rank no longer moves at all until the headline is done, and it is
 * held INVISIBLE for that whole leg rather than merely pushed far enough
 * back to be unlikely to show. Seven is now just where it waits.
 */
const START = -7;
/** extra cards' worth of travel so the last one clears the frame */
const TAIL = 3;
/**
 * The rank's whole distance, in px of scroll. The rank covers every place
 * from where it waits, so the travel has to pay for those seven too —
 * otherwise the same scroll carries it further and the cards sweep past
 * faster than `RATE` says they do.
 */
const TRAVEL = (N + TAIL - START) * RATE;
/**
 * What the band asks the panel to hold for: the entry leg and the rank.
 *
 * It is an attribute rather than a pin now. The band is the middle screen of
 * the home page's last panel, and a pinned section nested inside a pinned
 * panel gets no pin spacing of its own — its rank never advanced. So instead
 * of pinning itself it declares a HOLD: `PanelStack` parks it in the middle
 * of the window, spends this many px of scroll going nowhere, and publishes
 * the progress for the band to read. Same scroll, same choreography, one
 * pin instead of two. See `holdProgress`.
 */
const HOLD_RUN = ENTRY_RUN + TRAVEL;
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

  /* Read in an effect so the server's markup and the client's first pass
     agree; the rank is what renders on the server and a phone swaps to the
     list on hydration. */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* The tuner rewrites this on every slider drag; the render loop reads it
     rather than closing over a value, so a change lands on the next frame
     without rebuilding the ScrollTrigger. */
  const t = useRef(tuning);
  t.current = tuning;

  const hover = useRef<number | null>(null);
  hover.current = active;

  useGSAP(
    () => {
      /* Nothing to rig narrow — there is no stage, no pin and no rank, just
         a list. `narrow` is a dependency below so crossing the breakpoint
         reverts this context and rebuilds rather than leaving a pinned
         ScrollTrigger behind on a layout that no longer has one. */
      if (narrow) return;

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

      /* Per-card hover progress. The hover used to be a hard boolean read
         straight off React state, so a card snapped in and out; this eases
         it. One float per card rather than a tween per card because the
         render loop already runs every frame — there is nothing for a tween
         to do that this does not. */
      const hovT = new Array(N).fill(0);

      /* Every length in DEFAULTS was fitted at 1440. Scaling them by the
         stage's own width — rather than letting the cards keep a fixed pixel
         size — is what stops the rank from filling a laptop and overflowing a
         phone. Angles and the two origin percentages are ratios already, so
         they stay put. `perspective` has to go on the stage's style because
         CSS resolves it on the parent, not on the transformed child. */
      /* 0 while the headline has the screen to itself, 1 once the rank has
         fully arrived. Multiplied into every card's opacity below, which is
         what guarantees no image can precede the text on ANY viewport —
         unlike a starting depth, which only makes it unlikely. */
      let arrive = 0;

      const render = () => {
        const c = t.current;
        /* Every distance in this band is `k` times a design pixel, so the
           whole rank scales with the stage — correct, and useless on a
           phone: at 390 the lead card comes out about 130px wide and the
           ones behind it are thumbnails of a thumbnail.
           
           A phone is not a small desktop here, it is a closer camera. `k` is
           floored so the lead card holds roughly two-thirds of the screen,
           which means fewer cards are in frame at once and each of them can
           actually be read. Everything else — perspective, depth, spread,
           hover — is expressed in terms of `k`, so nothing else changes. */
        const raw = stage.current!.offsetWidth;
        const k = raw < MOBILE_UNDER
          ? Math.max(raw / DESIGN_W, (raw * MOBILE_LEAD) / c.cardW)
          : raw / DESIGN_W;
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
          /* ease toward hovered / not, then smoothstep it so the card
             floats out and settles rather than arriving at a constant speed */
          hovT[i] += ((h === i ? 1 : 0) - hovT[i]) * 0.13;
          const t01 = hovT[i];
          const e = t01 * t01 * (3 - 2 * t01);
          const on = e > 0.001;
          const rest = turnAt(u);
          const rad = (rest * Math.PI) / 180;

          /* Rotating to face the camera about the card's LEFT edge, while
             the transform-origin stays at the centre. Holding the left edge
             still costs a nudge right of half the width it gains, and the
             centre swings toward the camera by half the depth it loses —
             both fall straight out of the angle, so the hover has no magic
             numbers in it at all. */
          const turn = rest * (1 - e * (1 - c.hoverTurn));
          /* Out of the stack, and nothing else. */
          const openX = c.hoverShift * k * e;
          const openZ = c.hoverTurn < 1 ? halfW * Math.sin(rad) * e : 0;

          /* The arc. `bow` is a screen distance, so it has to be divided back
             through the projection — a card at `depth` is drawn at
             `P / (P + depth)`, so multiplying by the inverse of that leaves
             the rise reading the same at every depth. */
          const rise = -(c.bow * k * depth) / P;
          /* Clamped at zero so it only ever pushes cards further back along
             the row, never pulls a leaving one. `depth` goes negative once a
             card passes the near plane, and without this the cards on their
             way out would slide too — which is the one thing that had to
             stay exactly as it was. */
          const spread = Math.max(0, (c.spread * k * depth) / P);

          /* cubic focus — their formula, with `u` standing in for distance */
          const f = gsap.utils.clamp(0, 1, 1 - (u - c.focusFrom) / c.focusRange);
          const focus = 1 + Math.pow(f, 3) * (c.focusMax - 1);

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
            x: c.worldX * k + spread + openX,
            y: rise,
            z,
            rotationY: turn,
            /* the focus curve is the ONLY thing that scales a card; hover
               does not touch it — see `hoverShift` */
            scale: focus,
            opacity: gone ? 0 : (h === null || on ? 1 : c.restDim) * arrive,
            visibility: gone || arrive <= 0.001 ? 'hidden' : 'visible',
          });
        }
      };

      /* One lerp in the ticker rather than a tween per scroll event: the
         scrub and the drag both write `target`, and this is the only thing
         that ever moves `p`. Two sources, one integrator, no fighting. */
      const tick = () => {
        arrive = gsap.utils.clamp(0, 1, bandP() / CARDS_FADE);
        state.target = position() + state.drag;
        state.p += (state.target - state.p) * 0.12;
        render();
        renderHead();
      };
      gsap.ticker.add(tick);

      /* ONE trigger, and it does not begin until the panel has arrived.
         
         The band used to have a second `entry` trigger running from `top
         bottom` to `top top`, so the headline was already assembling and the
         first cards already sliding in while the section was still climbing
         the screen. That was right when the band simply followed the page.
         It is wrong now: this panel rides up over the categories, and George
         asked for *"the next section that comes on top must first come and
         then reveal the text with the images"* — so nothing may happen until
         the panel is actually here.
         
         The old entry leg is not lost, it is folded into the FRONT of the
         pin: `ENTRY_RUN` px of the pinned scroll now do what the climb used
         to do. Same choreography, same overlap between the line leaving and
         the first cards arriving — just all of it after the arrival rather
         than during it. */
      /** 0 → 1 across the panel's hold on this section — the old pin */
      const mainP = () => getHoldProgress(section);

      /** where the entry leg ends, as a fraction of the whole hold */
      const entryShare = ENTRY_RUN / HOLD_RUN;
      /** 0 → 1 across the reveal, then held at 1 */
      const entryP = () => gsap.utils.clamp(0, 1, mainP() / entryShare);

      /* The rank's own share of the entry leg, which starts LATER than the
         headline's. George: *"in the featured projects let's reveal the cards
         AFTER some of the above text is shown."*

         Both used to read `entryP` directly, so the first cards were already
         sliding in from the right while the opening characters of "WHERE
         EVERY PROJECT IS" were still arriving, and the two entrances fought
         each other for the same moment. Holding the rank until the headline
         is `CARDS_AFTER` of the way through gives the line the opening beat
         to itself, and still leaves the two overlapping — the cards begin
         while the last words are landing, which is what keeps it one
         movement rather than two things taking turns. */

      /** 0 until the reveal is done, then 0 → 1 across the rank */
      const bandP = () =>
        gsap.utils.clamp(0, 1, (mainP() - entryShare) / (1 - entryShare));

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
        const e = entryP();
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
        /* leaving: it scrolls up and out over the first fifth of the RANK,
           while the first cards are already coming in from the right — which
           is the whole reason the two read as one movement. Keyed to the
           rank rather than to the pin, so the reveal above finishes before
           the line starts to go. */
        const out = gsap.utils.clamp(0, 1, bandP() / 0.2);
        /* −50 is the baseline that turns `top: 50%` into a true centre; the
           rest carries it clear of the top edge. 250 rather than 130 because
           it now starts from the middle and has half a screen further to go
           before it is actually out of frame. */
        gsap.set(head, { yPercent: -50 - out * 250, opacity: 1 - out });
      };

      const position = () =>
        START + (N + TAIL - START) * bandP();

      /* Drag rides ON TOP of the scroll position rather than replacing it,
         so letting go doesn't snap back to wherever the page happens to be. */
      /* ── THE CAPTURE WAITS FOR A REAL DRAG ──────────────────────────
         Every card here is a `<Link>`, and until this changed not one of
         them could be clicked. `setPointerCapture` retargets the events that
         follow to the capture element, and the browser then fires `click` at
         the nearest common ancestor of the down and up targets — both of
         which had become this `<section>`. The anchor never saw a click, so
         the rank looked right, moved right, and went nowhere.

         George: *"on desktop when the user click on the card it should lead
         to that project."*

         It captured on EVERY `pointerdown` with no threshold at all, so
         there was no press that could reach a link. The capture is deferred
         until the pointer has actually travelled, which is the only time it
         earns its keep — it is there so a drag that leaves the section keeps
         driving the rank. `CategoryStrip` had the identical bug; if a third
         draggable ever appears, this is the shape it needs. */
      const SLOP = 6;
      let dragging = false;
      let pressed = false;
      let lastX = 0;
      let moved = 0;
      let id = -1;
      const down = (e: PointerEvent) => {
        pressed = true;
        dragging = false;
        moved = 0;
        id = e.pointerId;
        lastX = e.clientX;
      };
      const move = (e: PointerEvent) => {
        if (!pressed || e.pointerId !== id) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        moved += Math.abs(dx);
        if (!dragging) {
          if (moved <= SLOP) return;
          dragging = true;
          section.setPointerCapture(id);
        }
        state.drag -= dx / 90;
      };
      const up = (e: PointerEvent) => {
        if (!pressed) return;
        pressed = false;
        dragging = false;
        if (section.hasPointerCapture?.(e.pointerId)) {
          section.releasePointerCapture(e.pointerId);
        }
        /* A drag that ends on a card is a press and a release on a link by
           any measure, so the browser will follow it. Swallow that one
           click, and only when the pointer actually travelled — otherwise
           sweeping the rank sideways lands you on a project. */
        if (moved > SLOP) {
          const swallow = (ev: Event) => {
            ev.preventDefault();
            ev.stopPropagation();
          };
          section.addEventListener('click', swallow, { capture: true, once: true });
          window.setTimeout(
            () => section.removeEventListener('click', swallow, { capture: true }),
            0,
          );
        }
      };
      section.addEventListener('pointerdown', down);
      section.addEventListener('pointermove', move);
      /* On the WINDOW: under the slop there is no capture yet, so a button
         released outside the section would never reach a listener on it and
         the rank would think it was still held. */
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);

      render();
      const onResize = () => render();
      window.addEventListener('resize', onResize);

      return () => {
        split?.revert();
        window.removeEventListener('resize', onResize);
        gsap.ticker.remove(tick);

        section.removeEventListener('pointerdown', down);
        section.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      };
    },
    /* `revertOnUpdate` is NOT the default. Without it `useGSAP` re-runs the
       callback on a dependency change but never calls the previous cleanup —
       so crossing into the phone layout left the rank's ticker running over
       a stage React had already unmounted, and `render()` threw on a null
       element every single frame. */
    { scope: root, dependencies: [narrow], revertOnUpdate: true },
  );

  /* ── the phone: a list, not a rank ──────────────────────────────────
     The same headline, then the first ten one under the other. Nothing here
     is pinned or scrubbed: the band's whole mechanic is a pointer sweeping a
     wide stage, and there is neither a pointer nor a stage on a phone. */
  if (narrow) {
    return (
      <section
        data-band-list
        ref={root}
        className="relative w-full"
        style={{
          /* The shoulder for the whole last block. It is the first thing
             in there, and the block is not a stack panel, so the rounded top
             has to be painted by whatever actually draws the background at
             that edge — see the note in `page.tsx`. */
          background: 'var(--bg-page)',
          /* Explicit, and it matters. This `<section>` is the SAME DOM node
             the rank uses — React reconciles by type, so the branches share
             it — and the rank's branch sets `height: 100svh`. GSAP has also
             written `translate/rotate/scale` onto it, and once inline styles
             are mutated outside React its style bookkeeping no longer matches
             the element. Left implicit, the 100svh survived the swap and the
             list, far taller than a viewport, overflowed its own 844px box
             and landed on top of the footer.

             A distinct `key` would force a fresh node and fix it more
             cleanly, but it cannot be used here: the rank is PINNED, so
             ScrollTrigger has re-parented that section into a `.pin-spacer`,
             and unmounting it makes React look for the node under a parent
             that no longer owns it — `removeChild` throws and the page dies. */
          height: 'auto',
          /* the panel's `--panel-gap` is the distance to what came before */
          paddingTop: 0,
        }}
      >
        <h2
          /* Left, not centred — George picked this one out on the phone.
             Only the phone's: the wide branch's line is a display-sized
             headline the rank sweeps past, and centring is what keeps it
             clear of the cards. */
          className="px-[var(--gutter)] uppercase"
          /* The same size as "Learn more" — George: *"in the responsive the
             learn more and the where every… should have the same text
             size."* They are peer section headings, and this one was the odd
             one out at 24 against the other's 38. Same token, so they cannot
             drift apart again. */
          style={{ ...CAP_TRIM, font: 'var(--type-72-80-r)', color: 'var(--text-primary)' }}
        >
          {HEADLINE.join(' ')}
        </h2>

        {/* The category pages' own cards, not a second set drawn to look
            like them — George: *"use the same components like we use in the
            categories page for the projects."* `ProjectCards` brings its own
            section, gutters, chip, hover and entrance, and its grid is
            single-column at this width, which is exactly the one-under-the-
            other the design asks for. */}
        <ProjectCards projects={cardsForSlugs(CARDS.slice(0, MOBILE_COUNT).map((c) => c.slug))} />
      </section>
    );
  }

  return (
    <section
      ref={root}
      className="relative w-full"
      /* The panel parks this screen and spends `HOLD_RUN` px on it — the pin
         this section used to own. It is exactly a viewport tall, so parking
         it at the centre of the window is parking it at the top. */
      data-hold={HOLD_RUN}
      style={{
        /* `lvh` — see `PanelStack`. */
        height: '100lvh',
        background: 'var(--bg-page)',
        touchAction: 'pan-y',
        paddingInline: 'var(--gutter)',
      }}
    >
      {/* Behind the clip on purpose: in the reference a card that reaches
          the headline passes IN FRONT of it. */}
      <div
        data-headline
        className="pointer-events-none absolute inset-x-0 flex justify-center px-[var(--gutter)]"
        /* Centred now, not high. Keeping it clear of the rank used to be the
           whole problem — the second line ran through the incoming cards — and
           the answer was to push the line up out of their way. It is the wrong
           answer: it makes the line fight for the frame with something that
           should not be there yet. The cards are held off until it has been
           read, so the line can simply have the middle of the screen. */
        style={{ top: 'var(--band-head-top)' }}
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
              href={vol2Href(`/projects/${c.slug}`)}
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
              <Picture
                src={c.img}
                alt=""
                sizes="500px"
                className="absolute inset-0 h-full w-full object-cover"
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
