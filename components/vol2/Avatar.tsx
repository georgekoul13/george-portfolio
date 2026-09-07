'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * George, looking at the cursor — Figma 231:17154, five frames named
 * default / up / down / left / right.
 *
 * ── what the frames actually say ──────────────────────────────────────
 * `face color` sits at 204, 82 and `face stroke` at 204, 80 in ALL FIVE.
 * **The head never moves.** Only the face does. (An earlier build read the
 * frames as the whole figure sliding across its canvas, which is wrong and
 * was George's first correction: *"the character should always stay on the
 * center — same position. The eyes and where he looks must move around
 * according to where the cursor is."*)
 *
 * Measured against `default`, in that file's units:
 *
 *            left    right    up      down
 *   eyes     −12 x   +12 x    −10 y   +14 y
 *   mouth    −12 x   +12 x    −10 y   +14 y
 *   cheek L   −4      +20     −10 y   +14 y
 *   cheek R  −19       +5     −10 y   +14 y
 *   hair       —        —       —      +4 y
 *   buttons   −6 x    +6 x      —       —
 *   hand L    w 24    w 46      —       —      (36 at rest)
 *   hand R    w 46    w 24      —       —
 *
 * The body turns too — George: *"the illustration's body changes a bit too
 * — the face is ok but other elements are changing with the hover as
 * well."* The shirt's button placket slides the way he looks, and the two
 * sleeves foreshorten against each other: the near one narrows to 24 while
 * the far one opens out to 46. `body stoke` itself is 159,250 222×146 in
 * every frame, so the torso's OUTLINE is fixed and only what sits on it
 * moves — which is why this reads as a turn and not as a lean.
 *
 * Two things are worth copying exactly. The vertical is **asymmetric** — he
 * looks further down than up — and the **cheeks move unevenly**, the far one
 * compressing toward the edge of the face. That asymmetry is what makes it
 * read as a head turning rather than as features sliding about on a mask.
 *
 * Those frames are a 540 × 465 canvas whose face is 132 wide; this drawing's
 * face is 170.323, so every number above is scaled by 1.2903 to land in the
 * SVG's own units. (Checks out independently: the eye is 12 there and 15.484
 * here — the same ratio.)
 *
 * ── smooth, not a flip-book ───────────────────────────────────────────
 * The five frames are the EXTREMES of one continuous rig, not five states to
 * swap between; swapping steps visibly, and George asked for "as smooth as
 * possible". George on his own frames: *"basically i moved them and wrapped
 * them"* — so the brow and ear shape changes are warps of the same art, and
 * a scale reproduces them without needing the intermediate drawings.
 */

const CANVAS_W = 609;
const CANVAS_H = 434;
/**
 * How big the drawing is allowed to get. 100 more than the 434 it is drawn
 * at — George asked for it — expressed as a HEIGHT, because that is the axis
 * the window is short of and the axis he asked in. The width follows from
 * the canvas ratio, so the illustration is scaled, never stretched.
 *
 * `CANVAS_W`/`CANVAS_H` stay at the Figma numbers: they are the aspect ratio
 * and they feed `FIG_PCT`, the figure's share of the canvas. Both survive a
 * uniform scale, which is exactly why the cap is a separate pair.
 */
const CANVAS_MAX_H = CANVAS_H + 100;
const CANVAS_MAX_W = Math.round((CANVAS_MAX_H * CANVAS_W) / CANVAS_H);

/**
 * Everything the drawing has to share the window with when the panel holds
 * on it: the 216 of sentence beneath, the 124 gap between them, and ~22 of
 * slack so neither sits hard against an edge.
 *
 * The about panel stops with the drawing AND the sentence framed together —
 * that pairing is the section, and `IntroSection`'s `data-hold` is what parks
 * it. At 900 the group is 878 and fits with room to spare; below that the
 * drawing has to give, or its top is simply cut off during the one moment the
 * reader is held still and asked to look at it. So the canvas is capped by
 * the height LEFT OVER rather than by width alone, and the aspect ratio turns
 * that back into a width.
 *
 * 362 assumes the sentence's three lines at desktop measure — it sets at
 * 64/72 now rather than 72/80, which is what took it from four lines to
 * three and freed the height the drawing has just been given. Narrower
 * windows wrap it further, but they are also the ones that pick up the phone
 * layout, where this pairing is not what is on screen.
 */
const COMPANION_H = 362;
/** the drawing's own box, and how much of the canvas it fills */
const FIG_W = 286.459;
const FIG_PCT = (FIG_W / CANVAS_W) * 100;

/** the Figma frames' face is 132 wide, this one's is 170.323 */
const K = 170.323 / 132;

const X = 12 * K;        // 15.48 — eyes, mouth, brows
const UP = 10 * K;       // 12.90
const DOWN = 14 * K;     // 18.06
const CHEEK_NEAR = 20 * K;
const CHEEK_FAR = 4 * K;
const HAIR_DOWN = 4 * K;
const BUTTONS = 6 * K;
/** sleeve width 36 at rest, 24 turned toward you, 46 turned away */
const SLEEVE_NEAR = 24 / 36;
const SLEEVE_FAR = 46 / 36;
/** brow height goes 7.85 → 14.14 at both vertical extremes — it arches */
const BROW_ARCH = 14.143 / 7.853;
/** the ears grow about this much when he tips his head */
const EAR_SWELL = 1.1;

const EASE = 'power3';
const DUR = 0.5;

export default function Avatar({ svg, className }: { svg: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = root.current;
      if (!stage) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      /* A pointer to follow, or a phone to be tilted — but not both, and no
         longer "a pointer or nothing". This used to return here on anything
         that was not a mouse, which is why the drawing sat frozen on a phone;
         the rig below is now built for either input and only the LISTENERS
         differ. */
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      if (!fine && !coarse) return;

      /* Every layer is wrapped in a `[data-rig]` group carrying no transform
         of its own. The placement lives on the group INSIDE it, so GSAP can
         write here freely — several parts are positioned by a mirror matrix,
         and letting GSAP decompose a reflection into scale and rotation to
         add a few pixels to it is how you get a face that turns inside out. */
      const at = (name: string) =>
        stage.querySelector<SVGGElement>(`[data-rig="${name}"]`);
      const eyes = ['eye-l', 'eye-r', 'mouth'].map(at).filter(Boolean) as SVGGElement[];
      const browL = at('eyebrow-l');
      const browR = at('eyebrow-r');
      const cheekL = at('cheek-l');
      const cheekR = at('cheek-r');
      const hair = at('hair');
      const buttons = at('shirt-buttons');
      const handL = at('hand-l');
      const handR = at('hand-r');
      const ears = ['ear-l', 'ear-l-up', 'ear-l-down', 'ear-r', 'ear-r-up', 'ear-r-down',
                    'earring-up', 'earring-down'].map(at).filter(Boolean) as SVGGElement[];
      if (!eyes.length) return;

      const q = (t: gsap.TweenTarget, p: string, dur = DUR) =>
        gsap.quickTo(t, p, { duration: dur, ease: EASE });

      const eyeX = q(eyes, 'x');
      const eyeY = q(eyes, 'y');
      const brows = [browL, browR].filter(Boolean) as SVGGElement[];
      const browX = q(brows, 'x');
      const browY = q(brows, 'y');
      const browS = q(brows, 'scaleY', 0.6);
      const chLX = q(cheekL!, 'x');
      const chRX = q(cheekR!, 'x');
      const chY = q([cheekL, cheekR].filter(Boolean) as SVGGElement[], 'y');
      const hairY = q(hair!, 'y', 0.7);
      const earS = q(ears, 'scaleY', 0.7);
      const btnX = q(buttons!, 'x', 0.6);
      /* Each sleeve scales about its OWN outer edge, so it foreshortens
         into the shoulder instead of sliding away from the body. */
      if (handL) gsap.set(handL, { transformOrigin: '0% 50%' });
      if (handR) gsap.set(handR, { transformOrigin: '100% 50%' });
      const hLS = q(handL!, 'scaleX', 0.6);
      const hRS = q(handR!, 'scaleX', 0.6);

      /** he looks further down than up, so the axis is not symmetrical */
      const vert = (v: number) => (v < 0 ? v * UP : v * DOWN);

      /* The SECTION, not the drawing. `parentElement` is only the 609px
         canvas, which would leave him staring straight ahead for all of the
         panel except the moment you crossed the picture itself. */
      const host = stage.closest('section') ?? stage;

      /** Where he is looking, as two numbers in −1…1. The cursor is one way
          of arriving at them; a phone's gyroscope, below, is the other. */
      const aim = (u: number, v: number) => {
        const y = vert(v);
        eyeX(u * X);
        eyeY(y);

        /* The brows follow the eyes across but only half as far down — they
           are pinned to the brow ridge, not to the eye — and they arch at
           BOTH extremes, which is the "warp" in the frames rather than a
           second drawing. */
        browX(u * X);
        browY(y * 0.5);
        browS(1 + (BROW_ARCH - 1) * Math.abs(v));

        /* The uneven pair. Looking right, the right cheek barely moves while
           the left swings across the face; looking left, the reverse. */
        chLX(u > 0 ? u * CHEEK_NEAR : u * CHEEK_FAR);
        chRX(u > 0 ? u * CHEEK_FAR : u * CHEEK_NEAR);
        chY(y);

        hairY(v > 0 ? v * HAIR_DOWN : 0);
        earS(1 + (EAR_SWELL - 1) * Math.abs(v));

        /* The torso. Looking right opens the LEFT sleeve out and narrows the
           right one; looking left does the reverse. The placket goes with
           him. */
        btnX(u * BUTTONS);
        const near = 1 + Math.abs(u) * (SLEEVE_NEAR - 1);
        const far = 1 + Math.abs(u) * (SLEEVE_FAR - 1);
        hLS(u > 0 ? far : near);
        hRS(u > 0 ? near : far);
      };

      const move = (e: PointerEvent) => {
        const hb = host.getBoundingClientRect();
        if (!hb.width || !hb.height) return;
        aim(
          gsap.utils.clamp(-1, 1, ((e.clientX - hb.left) / hb.width - 0.5) * 2),
          gsap.utils.clamp(-1, 1, ((e.clientY - hb.top) / hb.height - 0.5) * 2),
        );
      };

      const leave = () => {
        eyeX(0); eyeY(0);
        browX(0); browY(0); browS(1);
        chLX(0); chRX(0); chY(0);
        hairY(0); earS(1);
        btnX(0); hLS(1); hRS(1);
      };

      /* so he is already watching you before you reach him */
      if (fine) {
        host.addEventListener('pointermove', move);
        host.addEventListener('pointerleave', leave);
      }

      /* ── the phone's answer to the cursor ─────────────────────────────
         George: *"let's also give a gyroscope UI effect to the illustration
         on mobile."* There is no cursor to follow on a phone, so he follows
         the phone instead — tilt it and he looks that way, exactly as far as
         he would look if you had moved a mouse the same fraction across him.

         Feeding the same `aim` rather than a second set of rules is the
         whole point: it is one behaviour with two inputs, so nothing about
         how he looks can drift apart between a laptop and a phone.

         The FIRST reading is taken as level. However you happen to be
         holding the phone when he comes on screen is his straight-ahead —
         which is the only definition that works, since nobody holds a phone
         at 0°, and an absolute one would leave him permanently staring at
         the floor.

         Smoothed on the ticker rather than driven straight off the event:
         the sensor is noisy at rest and jitters a face that is supposed to
         be still. The same 0.12 lerp the rest of this build uses. */
      const DOE =
        typeof DeviceOrientationEvent === 'undefined'
          ? null
          : (DeviceOrientationEvent as unknown as {
              requestPermission?: () => Promise<PermissionState | string>;
            });

      /** degrees of tilt that buy a full look, either way */
      const TILT = 24;
      let level: number | null = null;
      let tu = 0;
      let tv = 0;
      let cu = 0;
      let cv = 0;

      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        if (level === null) level = e.beta;
        tu = gsap.utils.clamp(-1, 1, e.gamma / TILT);
        tv = gsap.utils.clamp(-1, 1, (e.beta - level) / TILT);
      };
      const settle = () => {
        cu += (tu - cu) * 0.12;
        cv += (tv - cv) * 0.12;
        aim(cu, cv);
      };

      let armed = false;
      const listen = () => {
        if (armed) return;
        armed = true;
        window.addEventListener('deviceorientation', onTilt);
        gsap.ticker.add(settle);
      };

      /* iOS hands out orientation only after an explicit grant, and only
         asks from inside a real gesture — so the request rides a touch
         rather than firing on mount, where it is refused silently and the
         drawing simply never moves.

         Not `{ once: true }`. The call REJECTS outright on an insecure
         origin, and the first touch on a page is very often one the reader
         did not mean as an answer to anything; burning the only attempt on
         it left the drawing frozen for the rest of the visit with nothing to
         say why. It re-asks on each touch until it is granted, and stops
         asking the moment it is. */
      const ask = () => {
        if (armed) return;
        DOE?.requestPermission?.()
          .then((state) => {
            if (state === 'granted') listen();
          })
          .catch(() => {});
      };
      if (coarse && DOE) {
        if (typeof DOE.requestPermission === 'function') {
          window.addEventListener('touchend', ask);
        } else {
          listen();
        }
      }

      return () => {
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
        window.removeEventListener('touchend', ask);
        window.removeEventListener('deviceorientation', onTilt);
        gsap.ticker.remove(settle);
      };
    },
    { scope: root },
  );

  return (
    <div
      data-avatar
      className={`relative mx-auto w-full ${className ?? ''}`}
      style={{
        /* full size whenever the window can afford it: at 900 the cap works
           out at 755 against a wanted 749, so a normal desktop gets the whole
           drawing and it is only genuinely short windows that trim it */
        maxWidth: `min(${CANVAS_MAX_W}px, calc((100svh - ${COMPANION_H}px) * ${CANVAS_W} / ${CANVAS_H}))`,
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
      }}
    >
      {/* The body is nailed down — only what is inside the face moves. */}
      <div
        ref={root}
        data-avatar-fig
        className="absolute inset-y-0 left-1/2 [&>svg]:h-full [&>svg]:w-full"
        style={{ width: `${FIG_PCT}%`, marginLeft: `${-FIG_PCT / 2}%` }}
        /* Inlined rather than an <img>, which is the whole point: nothing
           inside an image is reachable. The markup is read off disk by the
           server component that renders this, so it costs no extra request
           and cannot flash. */
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
