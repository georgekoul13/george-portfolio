'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import IdCard from './IdCard';

import './scrollDefaults';

gsap.registerPlugin(ScrollTrigger);

/**
 * "Let's connect" — Figma component 69:27052, 780 × 720.
 *
 * A folder with the Creative Licence tucked inside it. The component carries
 * three variants, which are the scroll animation written out as keyframes:
 *
 *   Default   card centred at `50% + 76px`, painted *before* the front flap
 *             — i.e. sitting down inside the folder
 *   Variant2  card at `top: -47.91%`, painted *after* the flap — lifted
 *             almost clear of the folder and now in front of it
 *   Variant3  card back down at `50% + 79.5px`, still after the flap
 *
 * So it rises out, comes forward, and settles over the front — which is what
 * George described: "the ID comes out of the folder and comes in front of
 * it". The z-order flip is the whole point of the middle keyframe, and it
 * can't be tweened, so it's switched at the top of the rise where the card
 * has cleared the flap and nothing is overlapping.
 *
 * The folder art is the same vector as the category cards but used at a
 * different aspect (780 × 720 against their 424 × 332), so Figma stretches
 * it. The insets below reproduce that rather than correcting it.
 */

const W = 780;
const H = 720;

/** `front`/`text` box — Figma's `inset-[27.41% 0 0.3% 0]` */
const PLATE_TOP = 0.2741 * H; // 197.4
const PLATE_H = H - PLATE_TOP - 0.003 * H; // 520.4

/**
 * The flap artwork sits at `inset-[-19.15% -3.68% -0.97% -3.68%]` of that
 * plate, which resolves to 837 × 625 — wider and taller than the plate, and
 * a different ratio from the 458 × 302 export, hence the stretch.
 */
const FLAP = {
  left: -0.0368 * W,
  top: PLATE_TOP - 0.1915 * PLATE_H,
  width: W + 2 * 0.0368 * W,
  height: PLATE_H * (1 + 0.1915 + 0.0097),
};

/** card centres, as y offsets from the folder's middle */
const CARD_IN = 76;
const CARD_OUT = 79.5;
/** Variant2 puts the card's *top* at -47.91% of the folder height */
const CARD_PEAK = -0.4791 * H + 525 / 2 - H / 2;

/**
 * At its peak the card's top edge sits 345px above the folder, so the whole
 * composition is 1065 tall against the folder's 720 — more than a laptop
 * viewport can show at full size. Two things follow.
 *
 * `fit()` scales the group so those full bounds always fit the viewport,
 * and stays at 1 on screens tall enough not to need it.
 *
 * `LIFT_SHIFT` slides the group down while the card is out, so the pair
 * stays centred on screen at the peak. Without it the folder would have to
 * sit permanently low to leave room, which looks wrong at rest — and the
 * resting and settled states both fit inside the folder alone, so the group
 * only needs to move while the card is actually up in the air.
 */
/**
 * The card is drawn at 750 × 525 against a 780-wide folder, which leaves it
 * only 15px of wall either side and takes it almost to the bottom edge.
 * Shrunk so it reads as something the folder could actually hold.
 */
const CARD_SCALE = 0.88;
const CARD_H = 525 * CARD_SCALE;

const CARD_TOP_AT_PEAK = CARD_PEAK + H / 2 - CARD_H / 2;

/** the widest thing in the group: the flap, which overhangs the folder both sides */
const COMP_W = W + 2 * 0.0368 * W;
const COMP_H = H - CARD_TOP_AT_PEAK;
const LIFT_SHIFT = H / 2 - (CARD_TOP_AT_PEAK + H) / 2;
/** breathing room above and below at the peak */
const MARGIN = 40;

/**
 * Both folder pieces are translucent in Figma — the back is `#272727` at
 * 40%, the front a 60%→80% gradient of the same — and both carry
 * `backdrop-filter: blur(9.09px)`. That filter is inert inside an `<img>`,
 * because an image is rendered in isolation and can't sample the page behind
 * it, so the folder came out as flat panels with nothing showing through.
 *
 * The blur is restored as a real layer masked to each piece's own
 * silhouette, sitting directly under its artwork. The upshot is what the
 * design intends: the card is frosted while it's down inside the folder, and
 * sharpens as it rises clear.
 */
const frost = (src: string) =>
  ({
    backdropFilter: 'blur(9.09px)',
    WebkitBackdropFilter: 'blur(9.09px)',
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  }) as React.CSSProperties;

/** pinned scroll the whole interaction gets before the page moves on */
const PIN = 1500;

export default function ConnectSection() {
  const root = useRef<HTMLElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      /* Height was the only constraint that mattered on a laptop — the
         composition is 1065 tall against a 720 folder. On a phone width
         binds first: the flap is drawn 7% wider than the folder either side,
         so the full composition is 837 across and hangs 231px off a 375
         screen. Both dimensions now, whichever is tighter. */
      const fit = () =>
        Math.min(
          1,
          (window.innerHeight - MARGIN * 2) / COMP_H,
          (window.innerWidth - MARGIN * 2) / COMP_W,
        );
      gsap.set(group.current, { scale: fit(), transformOrigin: '50% 50%' });

      /* Pinned, so the section holds the screen to itself until the card is
         out and settled — nothing else scrolls past mid-interaction. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=' + PIN,
          pin: true,
          scrub: 1,
          /* The interaction can't be left half-done. A flick of the wheel
             would otherwise drop you somewhere mid-lift and move on, so the
             section is held until it resolves to one end or the other.
             `directional` is the default and is what makes it read as
             completion rather than resistance: any downward gesture carries
             the card the rest of the way out, any upward one puts it back.
             The delay lets a continuous scroll run its course before the
             snap takes over, so it only ever catches a gesture that stops. */
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.25, max: 0.7 },
            delay: 0.08,
            ease: 'power2.inOut',
          },
          invalidateOnRefresh: true,
          onRefresh: () => gsap.set(group.current, { scale: fit() }),
        },
      });

      tl
        // out of the folder, the group easing down to keep it on screen…
        .fromTo(card.current, { y: CARD_IN }, { y: CARD_PEAK, duration: 1, ease: 'power2.inOut' }, 0)
        /* Scaled, because `transform: translate() scale()` applies the
           translation in the parent's space — an unscaled shift overshoots
           by exactly the amount the group was shrunk. */
        .fromTo(
          group.current,
          { y: 0 },
          { y: () => LIFT_SHIFT * fit(), duration: 1, ease: 'power2.inOut' },
          0,
        )
        // …forward, at the top of the rise where it has cleared the flap
        .set(card.current, { zIndex: 3 }, 0.62)
        // …and down to rest in front, the group returning to centre
        .to(card.current, { y: CARD_OUT, duration: 0.9, ease: 'power2.inOut' }, 1)
        .to(group.current, { y: 0, duration: 0.9, ease: 'power2.inOut' }, 1);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="flex w-full items-center justify-center overflow-hidden px-[var(--gutter)]"
      /* `svh`, not `vh`. Every other full-height band moved to `svh` when
         the responsive pass went through — this one was missed. On a phone
         `vh` is the LARGE viewport, so the section is taller than the screen
         until the URL bar collapses and the composition jumps as it does. */
      style={{ height: '100svh' }}
    >
      {/* No responsive scaling here on purpose: `fit()` above already scales
          this group to the viewport and re-runs on every refresh. A second
          scale in CSS would land on the same transform GSAP owns and simply
          be overwritten. */}
      <div ref={group} className="relative shrink-0" style={{ width: W, height: H }}>
        {/* back of the folder, over its own frosted pane */}
        <div aria-hidden="true" className="absolute inset-0" style={frost('/images/vol2/ui/folder-back.svg')} />
        <img
          src="/images/vol2/ui/folder-back.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />

        {/* the card. Starts behind the flap; the timeline lifts it and then
            promotes it above. */}
        <div
          ref={card}
          className="absolute left-1/2"
          style={{ top: '50%', translate: '-50% -50%', zIndex: 1 }}
        >
          <IdCard style={{ scale: CARD_SCALE }} />
        </div>

        {/* front flap, likewise over its own frosted pane — this is the one
            the card is behind while it's inside the folder */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ ...FLAP, ...frost('/images/vol2/ui/folder-front.svg'), zIndex: 2 }}
        />
        <img
          src="/images/vol2/ui/folder-front.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute max-w-none"
          style={{ ...FLAP, zIndex: 2 }}
        />

        {/* label, on the flap */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-center"
          style={{ top: PLATE_TOP, height: PLATE_H, gap: 16.893, padding: 54.057, zIndex: 2 }}
        >
          <p
            className="whitespace-nowrap text-center uppercase"
            style={{
              font: 'var(--type-56-64-m)',
              letterSpacing: '2.8px',
              color: 'var(--text-primary)',
            }}
          >
            Let’s connect
          </p>
        </div>
      </div>
    </section>
  );
}
