'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The categories — Figma 231:17155, with the tilt from
 * demos.gsap.com/demo/cursor-driven-perspective-tilt.
 *
 * ── reading the design ────────────────────────────────────────────────
 * The two frames are not two layouts, they are two MOMENTS. Solving each
 * card's rotated bounding box for scale and angle:
 *
 *   frame 1  centre 600 × 300  → scale 1.000, rotation  0.0°
 *            right  374 × 267  → scale 0.564, rotation 18.4°
 *   frame 2  centre 657 × 445  → scale 1.000, rotation 15.0°
 *            right  385 × 330  → scale 0.577, rotation 31.9°
 *            left   374 × 267  → scale 0.564, rotation 18.4°
 *
 * The front card is scale 1 in both, and its rotation goes 0 → 15 between
 * them. 15 is exactly the demo's limit, and every side card moves by about
 * the same amount on top of its own resting angle. So the angles in frame 2
 * are the CURSOR, not the layout: one rest position, plus a tilt applied to
 * everything at once.
 *
 * That is what makes this the demo and not a hover effect. There is one
 * `pointermove` on the stage and every card answers it, wherever the cursor
 * is — not a listener per card that only fires when you are on top of one.
 *
 * ── the background ────────────────────────────────────────────────────
 * Three concentric circles, all centred, radii 217 / 388 / 609 — a banded
 * field, not a gradient. It is Ponpon's ripple, and its colour belongs to
 * whichever card is in front, so bringing a card forward repaints the whole
 * screen behind it.
 */

const SLOT = {
  centre: { scale: 1, turn: 0 },
  flank:  { scale: 0.564, turn: 18.4 },
} as const;

/**
 * How far a side card sits from the middle: 657 of the 1440 frame, held as a
 * fraction of the SECTION rather than of the card.
 *
 * Card-relative was wrong on a phone. At 1440 the card is 600 in a 1440
 * frame — 2.4 screens wide — and a side card at 109.5% of its own width
 * leaves 232px of it on screen. At 390 the card is 280, only 1.4 screens
 * wide, so the same 109.5% throws both flanks clean off the edge and the
 * deck reads as a single card with nothing either side of it. Measuring
 * against the viewport keeps the same amount peeking at every width.
 */
const FLANK_X = 657 / 1440;

/**
 * The demo, verbatim:
 *   rotationX  15 → −15   across the stage top to bottom
 *   rotationY −15 →  15   across the stage left to right
 *   inner x/y −30 →  30   the contents drifting inside the tilting frame
 *
 * The signs are what make the side under the cursor go AWAY, which is both
 * the demo's behaviour and Ponpon's. The inner drift moves the other way —
 * the label follows you while the card leans off — and that opposition is
 * most of why it reads as depth rather than as a rotation.
 */
const TILT = 15;
const DRIFT = 30;
const PERSPECTIVE = 650;

const SWAP = { duration: 0.5, ease: 'power2.out' };

/**
 * Colours match the chips in the selling point directly above — Product is
 * the red chip, Graphic the green one, Creative the blue one.
 *
 * 231:17155 draws PRODUCT green and GRAPHIC pink, which contradicts the
 * chips in 231:16735 in the same scroll. Same word, two colours, a screen
 * apart. Going with the chips because they are already built and they read
 * first; flagged for George.
 */
const CATEGORIES = [
  { name: 'Product',  href: '/product',  color: 'var(--red-500)' },
  { name: 'Graphic',  href: '/graphic',  color: 'var(--green-500)' },
  { name: 'Creative', href: '/creative', color: 'var(--blue-500)' },
];

/**
 * The banded field for one category.
 *
 * Centre and radius are variables so the field can MOVE. Ponpon's is not a
 * still background — George, watching it: *"One constant ripple is running
 * through the middle of the viewport directly behind each card. When the
 * card is swapped the colours of the ripple change. When the cursor is on a
 * ripple a liquid animation happens — like the cursor affects the ripple."*
 * All three of those are here: the rings breathe outward on a slow cycle,
 * the whole field leans toward the pointer, and a swap crossfades the hue.
 */
/**
 * The three circles are at r 217 / 388 / 609, which as a fraction of the
 * outermost are 35.6% and 63.7% — so the stops sit either side of those with
 * only a few points of feather. Softer than this and the cream stops being a
 * ring and becomes a glow behind the card, which is the one thing the
 * reference is not doing.
 */
const rings = (c: string) =>
  `radial-gradient(circle var(--cat-rr) at var(--cat-cx) var(--cat-cy), ${c} 0%, ${c} 32%,` +
  ` var(--neutral-50) 39%, var(--neutral-50) 60%, ${c} 67%, ${c} 100%)`;

/** how far the field leans toward the pointer, in % of the section */
const PULL = 7;
/** how much the rings swell and settle, and how long one breath takes */
const SWELL = 0.1;
const BREATH = 7;

const CAP_TRIM = {
  lineHeight: 1,
  marginTop: '-0.1585em',
  marginBottom: '-0.1415em',
} as const;

export default function CategoryDeck() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(active);
  activeRef.current = active;
  /** which arrangement is already on screen, so the first paint doesn't
      slide in from nowhere — comparing the VALUE is also immune to
      StrictMode's double mount, which counting runs is not */
  const shown = useRef<number | null>(null);

  useGSAP(
    () => {
      const stage = root.current!.querySelector<HTMLElement>('[data-stage]')!;
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]');
      const inners = gsap.utils.toArray<HTMLElement>('[data-inner]');
      const fields = gsap.utils.toArray<HTMLElement>('[data-field]');
      const n = cards.length;

      gsap.set(stage, { perspective: PERSPECTIVE });

      /* Slots WRAP. `Math.sign(i - active)` reads correctly and is wrong:
         with the active card at either end both remaining cards take the
         same sign and stack in one slot, so the deck quietly loses a card. */
      const dirOf = (i: number) => ((i - activeRef.current + 1 + n) % n) - 1;

      const first = shown.current === null;
      const animate = !first && shown.current !== activeRef.current;
      shown.current = activeRef.current;

      const flank = root.current!.getBoundingClientRect().width * FLANK_X;

      cards.forEach((el, i) => {
        const dir = dirOf(i);
        const s = dir === 0 ? SLOT.centre : SLOT.flank;
        el.style.zIndex = String(dir === 0 ? 2 : 1);
        const to = {
          /* xPercent centres the card on its own middle; `x` then carries
             the slot offset in real pixels, so the two never have to agree
             about how wide a card is. */
          xPercent: -50,
          x: dir * flank,
          yPercent: -50,
          scale: s.scale,
          /* in-plane, so it composes with the cursor's rotationX/rotationY
             instead of competing for the same property */
          rotation: dir * s.turn,
        };
        /* `set` for the resting layout, `to` only for the swap: a
           zero-duration `to` still waits for a tick to render, so the deck
           would sit unpositioned until the ticker runs. */
        if (animate) gsap.to(el, { ...to, ...SWAP, overwrite: 'auto' });
        else gsap.set(el, to);
      });

      /* The field belongs to the front card, so a swap repaints the whole
         background. Crossfading three fixed layers rather than tweening one
         colour — a CSS variable holding a colour does not interpolate
         unless it has been registered with @property, so a tween of it
         snaps at the end instead of blending. */
      fields.forEach((el, i) => {
        const on = i === activeRef.current;
        if (animate) gsap.to(el, { autoAlpha: on ? 1 : 0, duration: 0.6, ease: 'power2.out' });
        else gsap.set(el, { autoAlpha: on ? 1 : 0 });
      });

      /* The offset is a measurement now, so it has to be taken again when
         the window changes — `xPercent` used to make that free. */
      const onResize = () => {
        const w = root.current!.getBoundingClientRect().width * FLANK_X;
        cards.forEach((el, i) => gsap.set(el, { x: dirOf(i) * w }));
      };
      window.addEventListener('resize', onResize);

      /* ── the ripple ──────────────────────────────────────────────────
         One integrator in the ticker rather than a tween per pointer event.
         It carries two things at once: a slow swell that never stops, and a
         lean toward the pointer that eases in and out on its own. Writing
         both from the same place means they compose instead of overwriting
         each other, which two separate tweens on the same custom property
         would do. */
      const field = { cx: 50, cy: 50, tx: 50, ty: 50, t: 0 };
      const ripple = (_time: number, dt: number) => {
        field.t += dt / 1000;
        field.cx += (field.tx - field.cx) * 0.05;
        field.cy += (field.ty - field.cy) * 0.05;
        const swell = 1 + SWELL * Math.sin((field.t / BREATH) * Math.PI * 2);
        const s = root.current;
        if (!s) return;
        s.style.setProperty('--cat-cx', `${field.cx.toFixed(2)}%`);
        s.style.setProperty('--cat-cy', `${field.cy.toFixed(2)}%`);
        s.style.setProperty('--cat-rr', `calc(var(--cat-r) * ${swell.toFixed(4)})`);
      };
      gsap.ticker.add(ripple);

      /* ── the tilt ─────────────────────────────────────────────────── */
      const stop = () => {
        window.removeEventListener('resize', onResize);
        gsap.ticker.remove(ripple);
      };
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return stop;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.ticker.remove(ripple);
        return stop;
      }

      const rx = gsap.quickTo(cards, 'rotationX', { ease: 'power3' });
      const ry = gsap.quickTo(cards, 'rotationY', { ease: 'power3' });
      const ix = gsap.quickTo(inners, 'x', { ease: 'power3' });
      const iy = gsap.quickTo(inners, 'y', { ease: 'power3' });

      const move = (e: PointerEvent) => {
        const b = stage.getBoundingClientRect();
        if (!b.width || !b.height) return;
        const u = (e.clientX - b.left) / b.width;
        const v = (e.clientY - b.top) / b.height;
        rx(gsap.utils.interpolate(TILT, -TILT, v));
        ry(gsap.utils.interpolate(-TILT, TILT, u));
        ix(gsap.utils.interpolate(-DRIFT, DRIFT, u));
        iy(gsap.utils.interpolate(-DRIFT, DRIFT, v));
        /* the liquid part: the whole field leans after the pointer */
        field.tx = 50 + (u - 0.5) * 2 * PULL;
        field.ty = 50 + (v - 0.5) * 2 * PULL;
      };
      const leave = () => {
        rx(0); ry(0); ix(0); iy(0);
        field.tx = 50; field.ty = 50;
      };

      /* On the SECTION, not the stage: the stage is only as big as the
         cards, and the field around it is most of what you see. */
      const host = root.current!;
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerleave', leave);
      return () => {
        stop();
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
      };
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section
      ref={root}
      id="work"
      aria-label="Categories"
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{ minHeight: 'var(--cat-h)', paddingInline: 'var(--gutter)' }}
    >
      {CATEGORIES.map((c) => (
        <div
          key={c.href}
          data-field
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: rings(c.color) }}
        />
      ))}

      <div
        data-stage
        className="relative"
        style={{ width: 'var(--cat-card)', height: 'var(--cat-card-h)' }}
      >
        {CATEGORIES.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            data-card
            className="absolute left-1/2 top-1/2 flex items-center justify-center will-change-transform"
            style={{
              width: 'var(--cat-card)',
              height: 'var(--cat-card-h)',
              borderRadius: 'var(--cat-radius)',
              /* a lighter wash of the same colour, which is what puts the
                 card in front of a field painted in its own hue */
              background:
                `linear-gradient(135deg, rgba(255,252,224,.45), rgba(255,252,224,.12)), ${c.color}`,
              transformStyle: 'preserve-3d',
            }}
            onClick={(e) => {
              /* a card that is not in front is a control first and a link
                 second: one click brings it in, a second follows it */
              if (i !== active) {
                e.preventDefault();
                setActive(i);
              }
            }}
          >
            <span
              data-inner
              className="block whitespace-nowrap uppercase"
              style={{
                ...CAP_TRIM,
                font: `700 var(--cat-label) var(--font-sans)`,
                color: 'var(--chip-ink)',
              }}
            >
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
