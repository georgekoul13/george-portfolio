'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

/**
 * The categories — Figma 191:4899, a 1440 x 681 band padded 60 all round
 * with the list (210:5662) filling the 1320 measure.
 *
 * It used to be three folders riding the horizontal track, then briefly a
 * row of image cards under a CATEGORIES headline. It is now a plain static
 * list, and it comes BEFORE the horizontal band rather than on it — which
 * is also why this is a section of its own instead of another `[data-push]`
 * on the track.
 *
 * Hovering a row raises a preview image that follows the cursor:
 * GreenSock's "cursor tracking image preview" (codepen PwqrzeG), a
 * `quickTo` per axis at 0.4 on a power3.
 */

/**
 * Figma 210:5662. The frame labels them PRODUCT / GRAPHIC / CRATIVE — the
 * last is a typo — and every count reads "X PROJECTS", a placeholder. Names
 * match the nav; counts are the real ones.
 *
 * The preview images are the full-size project files, NOT the `orbit/`
 * previews: those were cut for the old folder peek and are thumbnails
 * (`orbit/gaspar-ai-1.png` is 223 x 72), so at 350 square they are a blur.
 * Which image stands for a category is George's call — these are the
 * best-cropping of what the repo holds.
 */
const CATEGORIES = [
  { name: 'Product',  count: 9, href: '/product',
    img: '/images/projects/gaspar/gaspar-04.png' },
  { name: 'Graphic',  count: 5, href: '/graphic',
    img: '/images/projects/book/book-01.png' },
  { name: 'Creative', count: 6, href: '/creative',
    img: '/images/projects/creatives/creative-01.png' },
];

/**
 * Every text node in the frame is cap-trimmed (`text-box-trim: trim-both` /
 * `text-box-edge: cap alphabetic`), which is what makes a 72px name report
 * as 50 tall and the 88 / 72 gaps come out as the design's. Montserrat's
 * cap band at `line-height: 1` runs 0.1585em → 0.8585em; trimming those two
 * remainders leaves a box that IS the cap.
 */
const CAP_TRIM = {
  lineHeight: 1,
  marginTop: '-0.1585em',
  marginBottom: '-0.1415em',
} as const;

export default function CategoriesSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;

      /* GreenSock's demo, near enough verbatim: a `quickTo` per axis at 0.4
         on a power3, a 0.1s `autoAlpha` fade, and the mousemove listener
         attached only while a row is hovered — `onReverseComplete` takes it
         off again.

         `firstEnter` is shared across all three, not per row. Passing the
         pointer position as quickTo's START value on the first move after
         an enter is what makes the image appear AT the cursor; without it
         each one sweeps in from wherever it was last left, and moving
         between two rows throws an image across the screen.

         Skipped entirely without a real pointer. On a phone `mouseenter`
         still fires synthetically on tap, which would strand the image
         under the finger with no mouseleave coming to clear it. */
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const previews = gsap.utils.toArray<HTMLImageElement>('[data-cat-preview]');
      const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-cat]'));
      let firstEnter = false;

      gsap.set(previews, { xPercent: -50, yPercent: -50 });

      const undo: (() => void)[] = [];

      rows.forEach((rowEl, i) => {
        const image = previews[i];
        if (!image) return;

        const setX = gsap.quickTo(image, 'x', { duration: 0.4, ease: 'power3' });
        const setY = gsap.quickTo(image, 'y', { duration: 0.4, ease: 'power3' });

        const align = (e: MouseEvent) => {
          if (firstEnter) {
            setX(e.clientX, e.clientX);
            setY(e.clientY, e.clientY);
            firstEnter = false;
          } else {
            setX(e.clientX);
            setY(e.clientY);
          }
        };
        const stopFollow = () => document.removeEventListener('mousemove', align);

        const fade = gsap.to(image, {
          autoAlpha: 1,
          ease: 'none',
          paused: true,
          duration: 0.1,
          onReverseComplete: stopFollow,
        });

        const enter = (e: MouseEvent) => {
          firstEnter = true;
          fade.play();
          document.addEventListener('mousemove', align);
          align(e);
        };
        const leave = () => fade.reverse();

        rowEl.addEventListener('mouseenter', enter);
        rowEl.addEventListener('mouseleave', leave);
        undo.push(() => {
          rowEl.removeEventListener('mouseenter', enter);
          rowEl.removeEventListener('mouseleave', leave);
          stopFollow();
        });
      });

      return () => undo.forEach((fn) => fn());
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      /* the hero's CTA lands here — "past the intro copy, straight to the
         three disciplines", which is this band now rather than the
         horizontal one below it */
      id="work"
      className="relative w-full px-[var(--gutter)]"
      style={{
        background: 'var(--bg-page)',
        paddingTop: 'var(--cat-pad-y)',
        paddingBottom: 'var(--cat-pad-y)',
      }}
    >
      <div
        className="flex w-full flex-col items-start"
        style={{ gap: 'var(--cat-row-gap)' }}
      >
        {CATEGORIES.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            data-cat
            className="group flex w-full flex-col items-start"
            style={{ gap: 'var(--cat-rule-gap)' }}
          >
            <span className="flex w-full items-start justify-between whitespace-nowrap">
              <span className="flex items-start" style={{ gap: 'var(--cat-name-gap)' }}>
                <span
                  style={{
                    ...CAP_TRIM,
                    fontSize: 'var(--cat-index)',
                    fontWeight: 600,
                    fontVariantNumeric: 'lining-nums tabular-nums',
                    color: 'var(--text-primary)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="uppercase"
                  style={{
                    ...CAP_TRIM,
                    fontSize: 'var(--cat-name)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {c.name}
                </span>
              </span>
              <span
                className="uppercase"
                style={{
                  ...CAP_TRIM,
                  fontSize: 'var(--cat-count)',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                }}
              >
                {c.count} projects
              </span>
            </span>
            <span
              aria-hidden="true"
              className="block w-full"
              style={{ height: 1, background: 'var(--border-subtle)' }}
            />
          </Link>
        ))}
      </div>

      {/* One `<img>` per category rather than one shared element, which is
          how the GreenSock demo does it: each keeps its own `quickTo`, so
          moving from one row to the next swaps images without one sliding
          across the screen.

          `position: fixed`, so they must stay clear of any transformed
          ancestor — a transformed element becomes the containing block for
          fixed descendants, and they would then be placed against that
          instead of the viewport. */}
      {CATEGORIES.map((c) => (
        <Image
          key={c.href}
          data-cat-preview
          src={c.img}
          alt=""
          aria-hidden="true"
          width={350}
          height={350}
          sizes="(min-width: 900px) 350px, 200px"
          className="pointer-events-none fixed left-0 top-0 object-cover"
          style={{
            width: 'var(--cat-preview)',
            height: 'var(--cat-preview)',
            zIndex: 9,
            opacity: 0,
            visibility: 'hidden',
          }}
        />
      ))}
    </section>
  );
}
