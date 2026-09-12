'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

/**
 * A slot takes a still or a looping video, decided by the file extension, so
 * a project can swap one for the other without a code change. George, on the
 * experimental posters: *"the panel big image is the video"* — and, on how it
 * should behave: *"i dont want to have the scroll playing interaction."*
 *
 * So it is a moving poster, not a player: no chrome, no play button, nothing
 * for the reader to operate. `muted` and `playsInline` are not style choices
 * — without both, iOS refuses to autoplay at all, and without `playsInline`
 * it hijacks into fullscreen.
 */
const VIDEO = /\.(mp4|webm|mov)$/i;

/**
 * The full-width stills — Figma "Hero Image Frame", 1320 × 640 inside the
 * page's 60px gutters. Given an aspect rather than its fixed height so the
 * picture keeps its proportions at any width, and that aspect is a token:
 * 2.06:1 inside a 335px phone column is a 162px letterbox strip, so it
 * squares up to 3:2 there. See `--project-still`.
 *
 * The image arrives by being uncovered from below and drifting up behind its
 * own frame, which is the closest thing in this template to the wipe the
 * headlines use — nothing slides in from outside the layout.
 */
export default function ProjectImage({
  src,
  alt,
  poster,
}: {
  src: string;
  alt: string;
  /** first frame of a video slot — what shows before it loads, and the only
      thing that shows when autoplay is refused. */
  poster?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const isVideo = VIDEO.test(src);

  /* Play only while it is on screen. Without this every visitor downloads the
     clip whether or not they scroll this far, and it keeps decoding off the
     battery once it has passed. Reduced motion never starts it at all — the
     poster is the whole experience there, which is why one is required. */
  useGSAP(
    () => {
      if (!isVideo) return;
      const v = root.current?.querySelector('video');
      if (!v) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        },
        { rootMargin: '200px 0px' },
      );
      io.observe(v);
      return () => io.disconnect();
    },
    { scope: root, dependencies: [isVideo, src] },
  );

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%' } })
        .from(root.current, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1, ease: 'power3.out' })
        .from('[data-inner]', { scale: 1.12, duration: 1.2, ease: 'power3.out' }, 0);
    },
    { scope: root },
  );

  return (
    <div className="w-full px-[var(--gutter)]">
      <div
        ref={root}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: 'var(--project-still)', clipPath: 'inset(0% 0% 0% 0%)' }}
      >
        {/* `next/image`, not `<img>`: these are the 1440x1080 source files
            and were being shipped whole to a 375 phone. `fill` because the
            box is an aspect-ratio well, and `sizes` because without it
            `fill` assumes 100vw at every breakpoint and picks the largest
            candidate anyway. GSAP animates this element's `scale`, which is
            a transform and so does not fight the inline `position` that
            `fill` sets. */}
        {isVideo ? (
          <video
            data-inner
            poster={poster}
            aria-label={alt}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          >
            {/* WebM first — VP9 holds this content at a third of H.264's
                size. A browser that cannot play it falls straight through to
                the mp4, and a missing file is the same non-event, so the
                sibling does not have to exist. */}
            <source src={src.replace(/\.mp4$/i, '.webm')} type="video/webm" />
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <Image
            data-inner
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
