'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import '../scrollDefaults';
import Image from 'next/image';
import VideoSources from './VideoSources';
import type { Sources } from './blocks';

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
  sources,
  alt,
  poster,
  priority,
}: {
  /** a still */
  src?: string;
  /** a loop, in the formats it exists in — see `Sources` */
  sources?: Sources;
  alt: string;
  /** first frame of a video slot — what shows before it loads, and the only
      thing that shows when autoplay is refused. */
  poster?: string;
  /**
   * The project's opening picture — fetch it FIRST rather than lazily.
   *
   * George: *"in some projects there is a slide delay of the hero image."*
   * `next/image` is lazy by default, so the one picture that is already in
   * frame when the page opens was queued behind everything else on it. The
   * frame uncovered on cue and there was nothing inside it yet, which reads
   * as the animation stuttering rather than as a download.
   *
   * Only ever ONE of these per page: `priority` is a claim on the connection
   * and handing it to every slot would put the hero back where it started.
   */
  priority?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const isVideo = !!sources || (!!src && VIDEO.test(src));

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
        /* the same tone the stills carry, for the same reason — an
           unarrived picture should read as a panel, not as a hole in the
           page. See `Slot` in `ProjectBlocks`. */
        style={{
          aspectRatio: 'var(--project-still)',
          clipPath: 'inset(0% 0% 0% 0%)',
          background: 'var(--bg-raised)',
        }}
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
            /* the hero's loop is the first thing on the page too — hold its
               first frame ready rather than waiting for the reader to be
               looking at an empty box */
            preload={priority ? 'metadata' : 'none'}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            {/* WebM first — VP9 holds this content at a fraction of H.264's
                size — and then the mp4 for anything that cannot take VP9.
                Only what is actually on disk is offered: an unplayable file
                behind a `video/mp4` label is worse than no fallback, because
                the browser stops at it. */}
            <VideoSources src={src} sources={sources} />
          </video>
        ) : (
          <Image
            data-inner
            src={src!}
            alt={alt}
            fill
            sizes="100vw"
            priority={priority}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
