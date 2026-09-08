'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { STICKERS, stickerSrc } from './heroData';

/**
 * Main CTA — both of gsap.com's hero-button behaviours.
 *
 * HOVER is the "flair" fill, read from their stylesheet: a circle sized 170%
 * of the button with `transform-origin: 0 0`, inside an `overflow: hidden`
 * pill. The circle's origin is moved to the pointer and scaled 0 → 1 on
 * enter, 1 → 0 on leave, so the fill grows from wherever the cursor crossed.
 * CSS transitions drive it — the transition smooths the pointer-follow for
 * free.
 *
 * TAP tosses illustrations out of the button, measured off their live page.
 * Their four flair pieces sit at `left: 40%; top: 50%` of the button with
 * `transform-origin: 0 0`, resting at `scale(0) translateY(10px)`, and on
 * click each one arcs up ~2× the button's height, turns exactly one full
 * revolution, and drops back to the button's centre line at scale 0.3, where
 * it stays. Sideways drift is split evenly across the two halves of the arc,
 * which is what makes it read as a throw rather than a slide. Timings from
 * the trace: 0.52s up on `power2.out`, 0.56s down on `power2.in`, ~0.15s
 * apart. Crucially the pieces are siblings of the pill, not children, so the
 * `overflow: hidden` that clips the fill doesn't clip them.
 *
 * Three deliberate departures, all from the same fact: theirs fires once,
 * because it's a link and you leave the page, whereas this one scrolls you
 * down and stays on screen. So every tap re-throws with a fresh set; it
 * throws five illustrations drawn at random from the hero pool rather than
 * four fixed ones, so the button never repeats itself; and the pieces drop
 * away at the end of the arc instead of coming to rest on the label, which
 * on a button you keep looking at would just be litter.
 *
 * The scroll is held until the throw is over — see `goToWork`.
 */

/**
 * Where the button sends you: past the intro copy, straight to the three
 * disciplines. It carries no icon — the label is the whole button, and an
 * arrow on it would compete with the fill and the throw.
 */
const HREF = '#work';

/** how many illustrations go up on each tap */
const TOSS = 5;
/** apex as a multiple of the button's height, matching the reference's ~115/58 */
const APEX = 2;
/** each illustration's natural size, scaled into the reference's 23–62px band */
const SIZE = 0.42;

const UP = 0.52;
const DOWN = 0.56;
const STAGGER = 0.15;
/** the size they reach at the bottom of the arc, before dropping away */
const REST_SCALE = 0.3;
/** the drop that clears them off the label */
const AWAY = 0.45;
/** …started just before the arc lands, so nothing ever parks on the text */
const OVERLAP = 0.12;

export default function CtaButton({ label = 'Learn more' }: { label?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLAnchorElement>(null);
  const flair = useRef<HTMLSpanElement>(null);
  const flung = useRef<(HTMLSpanElement | null)[]>([]);
  const toss = useRef<gsap.core.Timeline>();

  /** pointer position as a percentage of the button box */
  const at = (e: React.PointerEvent) => {
    const r = pill.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  };

  const place = (x: number, y: number, scale: number) => {
    flair.current!.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
  };

  const onEnter = (e: React.PointerEvent) => {
    const { x, y } = at(e);
    // jump to the entry point without transitioning, then grow from it
    flair.current!.style.transition = 'none';
    place(x, y, 0);
    void flair.current!.offsetWidth; // flush, so the next line animates
    flair.current!.style.transition = '';
    place(x, y, 1);
  };

  const onMove = (e: React.PointerEvent) => {
    const { x, y } = at(e);
    place(x, y, 1);
  };

  const onLeave = (e: React.PointerEvent) => {
    const { x, y } = at(e);
    place(x, y, 0);
  };

  const { contextSafe } = useGSAP({ scope: root });

  /**
   * The button is a link, so the browser would jump the instant it is clicked
   * and the tap animation would play to an empty screen. The jump is taken
   * over here instead and held until the timeline reports done, so the throw
   * is watched through and *then* you are moved.
   */
  const goToWork = () => {
    document.querySelector(HREF)?.scrollIntoView({ behavior: 'smooth' });
  };

  const onTap = contextSafe((e: React.MouseEvent) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();

    const r = pill.current!.getBoundingClientRect();
    const apex = r.height * APEX;
    // the anchor all five launch from
    const originX = r.width * 0.4;

    // a fresh set every tap, so the button never throws the same thing twice
    const picks = gsap.utils.shuffle([...STICKERS]).slice(0, TOSS);

    toss.current?.kill();
    const master = gsap.timeline({ onComplete: goToWork });

    picks.forEach((st, i) => {
      const el = flung.current[i];
      if (!el) return;
      const img = el.firstElementChild as HTMLImageElement;

      img.src = stickerSrc(st.file);
      img.style.height = `${st.h * SIZE}px`;
      img.style.width = 'auto';
      // the illustration keeps its own resting tilt and does its own
      // centring; the wrapper does the tumbling, so the two never fight
      // over `transform`
      gsap.set(img, { xPercent: -50, yPercent: -50, rotate: st.rotate });

      // land along the pill's middle band — the reference keeps its pieces
      // well clear of the rounded caps, which a flat pixel inset wouldn't
      const landing = gsap.utils.random(r.width * 0.22, r.width * 0.78) - originX;

      master.add(
        gsap
          .timeline()
          // half the sideways drift on the way up…
          .fromTo(
            el,
            { x: 0, y: 10, scale: 0, rotate: 0, autoAlpha: 1 },
            { x: landing / 2, y: -apex, scale: 1, rotate: -180, duration: UP, ease: 'power2.out' },
          )
          // …and half on the way down, which is what makes it read as a throw
          .to(el, {
            x: landing,
            y: 0,
            scale: REST_SCALE,
            rotate: -360,
            duration: DOWN,
            ease: 'power2.in',
          })
          /* The reference leaves its pieces sitting on the button, which
             works there because you have already left the page. Here they
             would come to rest on top of the label and stay, so they carry
             on through instead and drop out of sight. Slightly overlapped
             with the landing so there is no moment of them parked on the
             text. */
          .to(el, {
            y: r.height * 2.4,
            autoAlpha: 0,
            duration: AWAY,
            ease: 'power2.in',
          }, `-=${OVERLAP}`),
        i * STAGGER,
      );
    });

    toss.current = master;
  });

  return (
    // the thrown illustrations are siblings of the pill, so the pill's
    // `overflow: hidden` clips the fill without clipping them
    <span ref={root} className="relative inline-block">
      {Array.from({ length: TOSS }).map((_, i) => (
        <span
          key={i}
          ref={(el) => { flung.current[i] = el; }}
          aria-hidden="true"
          className="pointer-events-none absolute z-20 block"
          style={{ left: '40%', top: '50%', transformOrigin: '0 0', visibility: 'hidden' }}
        >
          <img alt="" className="block max-w-none" />
        </span>
      ))}

      <a
        ref={pill}
        href={HREF}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={onTap}
        className="relative inline-flex items-center overflow-hidden rounded-[100px] px-12 py-4 uppercase"
        style={{
          border: '2px solid var(--blue-700)',
          color: 'var(--text-primary)',
          font: 'var(--type-20-20-r)',
        }}
      >
        {/* fill — a circle 170% of the button, grown from the pointer */}
        <span
          ref={flair}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            transformOrigin: '0 0',
            transform: 'translate(50%, 50%) scale(0)',
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span
            className="absolute left-0 top-0 block aspect-square w-[170%] rounded-full"
            style={{ background: 'var(--blue-700)', transform: 'translate(-50%, -50%)' }}
          />
        </span>

        <span className="relative z-10">{label}</span>

      </a>
    </span>
  );
}
