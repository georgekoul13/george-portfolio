'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText);

/**
 * Text on a drum — GSAP's "rolling text" demo.
 *
 * Every line is stacked in one place, split to characters, and each character
 * turned about the X axis behind a perspective on its parent:
 *
 *     gsap.set(lines, { perspective: 700, transformStyle: "preserve-3d" })
 *     tl.fromTo(chars, { rotationX: -90 },
 *       { rotationX: 90, stagger: 0.08, duration: 0.9, ease: "none" },
 *       index * 0.45)
 *
 * NOTE — the demo also pushes the rotation's origin back in z, which would
 * swing the characters around a cylinder rather than turning them on the
 * spot. GSAP drops the z component when it writes `transformOrigin`, so that
 * part has never taken effect here: what you see is a flip in place, seen
 * through the perspective below. It is the look George approved, so it is
 * left alone — but the depth is not doing what its name suggests.
 *
 * `perspective` is still derived from the font size rather than the window as
 * the demo does it. The demo's is sized for text set at 18vw; against a 20px
 * line the same figure would flatten the turn to nothing, so tying it to the
 * type keeps the foreshortening looking the same at any size.
 *
 * And the demo's single linear sweep from -90 through to 90 never rests: its
 * characters are near-facing for a fraction of a second, which is fine for
 * one huge word and useless for a line you are meant to read. So the sweep is
 * cut in half — in to 0, hold, then on to 90 — the same drum turning, just
 * pausing at each face.
 *
 * Used by the copyright band, which cycles four lines, and by the contact
 * page's thank-you, which turns a single one over and over.
 */

const ROLL = 0.55;
const HOLD = 2.4;
/**
 * The demo staggers a flat 0.08 per character across a nine-letter word.
 * Longer lines at a fixed per-character rate would have the near end rolling
 * away before the far end arrived, so it is expressed as a total spread and
 * divided out.
 */
const SPREAD = 0.5;

export default function RollingText({
  lines,
  font,
  size,
  color = 'var(--text-secondary)',
  className,
}: {
  lines: string[];
  /** the CSS `font` shorthand token the lines are set in */
  font: string;
  /** the font's pixel size — the drum's radius is derived from it */
  size: number;
  color?: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const els = gsap.utils.toArray<HTMLElement>('[data-roll]');
      const splits: SplitText[] = [];
      /* Kept in the demo's proportion — its perspective is ~3.9× its depth,
         and the depth there is a fraction of the type's size. */
      const perspective = Math.round(size * 1.6 * 3.9);
      const transformOrigin = '50% 50%';

      document.fonts.ready.then(() => {
        gsap.set(els, { perspective, transformStyle: 'preserve-3d' });

        const tl = gsap.timeline({ repeat: -1 });

        els.forEach((line, i) => {
          const split = SplitText.create(line, { type: 'chars' });
          splits.push(split);
          const chars = split.chars;
          const stagger = SPREAD / Math.max(1, chars.length - 1);

          /* Parked face-down up front. A timeline only renders the start
             values of tweens its playhead has reached, so without this every
             line after the first would sit flat at 0° — all of them stacked
             and legible at once — until its own turn came round. */
          gsap.set(chars, { rotationX: -90, transformOrigin });

          const at = i * (HOLD + ROLL);
          tl.fromTo(
            chars,
            { rotationX: -90 },
            { rotationX: 0, duration: ROLL, ease: 'power2.out', stagger, transformOrigin },
            at,
          ).to(
            chars,
            { rotationX: 90, duration: ROLL, ease: 'power2.in', stagger, transformOrigin },
            at + HOLD,
          );
        });
      });

      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [lines.join('|')] },
  );

  return (
    // every line stacked in one place; only the one facing you reads
    <div
      ref={root}
      className={`relative w-full ${className ?? ''}`}
      style={{ height: size * 2 }}
    >
      {lines.map((line) => (
        <p
          key={line}
          data-roll
          className="absolute left-1/2 top-1/2 m-0 whitespace-nowrap text-center [&>div]:[backface-visibility:hidden]"
          style={{ translate: '-50% -50%', font, color }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
