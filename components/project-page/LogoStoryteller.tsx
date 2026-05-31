'use client';

/**
 * LogoStoryteller — Apple-style scroll narrative
 *
 * Two panel variants per project
 * ──────────────────────────────
 * 'split'    (Maria)         text ↔ scroll-linked carousel, image fills a fixed box
 * 'showcase' (Olga, Vozora)  image/video centred at natural aspect ratio (object-fit:contain)
 *
 * Scroll pacing
 * ─────────────
 * Showcase images claim 2 × 100 vh each so the user has time to read them.
 * Showcase videos claim `scrollWeight × 100 vh` (default 5).
 * Split images keep 1 × 100 vh (carousel feel).
 *
 * Why opacity is NOT in the JSX style props
 * ──────────────────────────────────────────
 * React re-applies JSX styles on every re-render. Keeping opacity/pointerEvents/
 * transform out of the style prop prevents React from resetting them when, for
 * example, `isMobile` changes and triggers a re-render.
 */

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import Image           from 'next/image';
import { useIsMobile } from '@/hooks/useIsMobile';

// ── Types ─────────────────────────────────────────────────────────────────────

type MediaItem =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string; poster?: string; scrollWeight?: number };

interface StoryProject {
  variant?:       'split' | 'showcase';
  imagePosition?: 'left' | 'right';
  media:          MediaItem[];
  label:           string;
  sublabel?:       string;
}

interface LogoStorytellerProps {
  projects: StoryProject[];
}

// One entry in the frame map.
// Images get scrollWeight slots. Videos get scrollWeight slots so currentTime can be scrubbed.
interface FrameSlot {
  pi:         number;
  mi:         number;
  slotIndex:  number;
  totalSlots: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LogoStoryteller({ projects }: LogoStorytellerProps) {
  const isMobile = useIsMobile();

  // Build frame map — stable unless projects changes (it won't after mount)
  const frameMap = useMemo<FrameSlot[]>(() => {
    const map: FrameSlot[] = [];
    projects.forEach((p, pi) => {
      const isShowcase = (p.variant ?? 'split') === 'showcase';
      p.media.forEach((item, mi) => {
        // Showcase images: 2 slots (200 vh) so they linger long enough to read.
        // Showcase videos: scrollWeight slots for scrubbing (default 5).
        // Split images/videos: 1 slot each (carousel pace).
        const weight =
          item.kind === 'video'
            ? (item.scrollWeight ?? 5)
            : isShowcase ? 2 : 1;
        for (let s = 0; s < weight; s++) {
          map.push({ pi, mi, slotIndex: s, totalSlots: weight });
        }
      });
    });
    return map;
  }, [projects]);

  const totalSlots = frameMap.length;

  // ── Refs ───────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const frameRefs    = useRef<(HTMLDivElement | null)[][]>([]);
  const videoRefs    = useRef<Map<string, HTMLVideoElement>>(new Map());

  const curProjectRef    = useRef(0);
  const curFrameRef      = useRef(0);
  const videoTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Used by the seed call so the first onScroll() sets positions instantly (no animation)
  const isFirstScrollRef = useRef(true);

  // ── Initial panel positions — synchronous before first paint ──────────────
  // Panels live below the viewport (translateY 100%) until they become active.
  // The sticky container's overflow:hidden clips them — no opacity needed.
  useLayoutEffect(() => {
    panelRefs.current.forEach((el, pi) => {
      if (!el) return;
      el.style.transform     = pi === 0 ? 'translateY(0)' : 'translateY(100%)';
      el.style.pointerEvents = pi === 0 ? 'auto' : 'none';
    });
    frameRefs.current.forEach((frames, pi) => {
      frames?.forEach((el, mi) => {
        if (el) el.style.opacity = (pi === 0 && mi === 0) ? '1' : '0';
      });
    });
  }, []);

  // ── Scroll engine ──────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stopAllVideos = () => {
      if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
      videoRefs.current.forEach(v => v.pause());
    };

    // Slide the outgoing panel off-screen and the incoming panel into view.
    // Forward (↓ scroll): outgoing exits UP, incoming enters FROM BELOW.
    // Backward (↑ scroll): outgoing exits DOWN, incoming enters FROM ABOVE.
    const SLIDE = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    const slidePanels = (fromPi: number, toPi: number, instant = false) => {
      const fwd    = toPi > fromPi;
      const fromEl = panelRefs.current[fromPi];
      const toEl   = panelRefs.current[toPi];

      if (instant) {
        // Snap all panels to their correct stacked positions — no animation
        panelRefs.current.forEach((el, pi) => {
          if (!el) return;
          el.style.transition    = 'none';
          el.style.transform     = pi < toPi ? 'translateY(-100%)' : pi === toPi ? 'translateY(0)' : 'translateY(100%)';
          el.style.pointerEvents = pi === toPi ? 'auto' : 'none';
        });
        return;
      }

      if (fromEl) {
        fromEl.style.transition    = SLIDE;
        fromEl.style.transform     = fwd ? 'translateY(-100%)' : 'translateY(100%)';
        fromEl.style.pointerEvents = 'none';
      }
      if (toEl) {
        // Snap to start position first, then animate to centre
        toEl.style.transition = 'none';
        toEl.style.transform  = fwd ? 'translateY(100%)' : 'translateY(-100%)';
        toEl.style.pointerEvents = 'auto';
        void toEl.offsetHeight;          // force reflow
        toEl.style.transition = SLIDE;
        toEl.style.transform  = 'translateY(0)';
      }
    };

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const vh         = window.innerHeight;
      const scrollable = container.offsetHeight - vh;
      if (scrollable <= 0) return;

      const scrolled    = Math.max(0, -rect.top);
      const progress    = Math.min(1, scrolled / scrollable);
      const absSlot     = Math.min(Math.floor(progress * totalSlots), totalSlots - 1);
      const slot        = frameMap[absSlot];
      const { pi: newPi, mi: newMi, slotIndex, totalSlots: vTotal } = slot;
      const prevPi = curProjectRef.current;
      const prevMi = curFrameRef.current;

      // ── First-call seed: set all panel positions instantly (handles pre-scroll) ─
      if (isFirstScrollRef.current) {
        isFirstScrollRef.current = false;
        slidePanels(0, newPi, true /* instant */);
        frameRefs.current[newPi]?.forEach((el, mi) => {
          if (el) el.style.opacity = mi === newMi ? '1' : '0';
        });
        curProjectRef.current = newPi;
        curFrameRef.current   = newMi;
        if (newPi === prevPi) return; // no further action needed on first call
      }

      // ── Project transition ───────────────────────────────────────────────
      if (newPi !== prevPi) {
        stopAllVideos();
        slidePanels(prevPi, newPi);
        // Sync all frames in the incoming project
        frameRefs.current[newPi]?.forEach((el, mi) => {
          if (el) el.style.opacity = mi === newMi ? '1' : '0';
        });
        curProjectRef.current = newPi;
        curFrameRef.current   = newMi;
        return;
      }

      // ── Frame switch ─────────────────────────────────────────────────────
      if (newMi !== prevMi) {
        stopAllVideos();
        const prevEl = frameRefs.current[prevPi]?.[prevMi];
        const newEl  = frameRefs.current[newPi]?.[newMi];
        if (prevEl) prevEl.style.opacity = '0';
        if (newEl)  newEl.style.opacity  = '1';
        curFrameRef.current = newMi;
      }

      // ── Video handling ───────────────────────────────────────────────────
      const media   = projects[newPi]?.media[newMi];
      const variant = projects[newPi]?.variant ?? 'split';

      if (media?.kind === 'video') {
        const key   = `${newPi}-${newMi}`;
        const video = videoRefs.current.get(key);
        if (!video) return;

        if (variant === 'showcase' && vTotal > 1) {
          // Scrub mode: scroll position → video.currentTime
          if (!isNaN(video.duration) && video.duration > 0) {
            const t = (slotIndex / (vTotal - 1)) * video.duration;
            if (Math.abs(video.currentTime - t) > 0.05) {
              video.currentTime = t;
            }
          }
          if (video.paused) video.play().catch(() => {});
          if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
          videoTimerRef.current = setTimeout(() => video.pause(), 80);
        } else {
          // Play-on-scroll mode (split variant)
          if (video.paused) video.play().catch(() => {});
          if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
          videoTimerRef.current = setTimeout(() => video.pause(), 150);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // seed for pre-scrolled page loads
    return () => {
      window.removeEventListener('scroll', onScroll);
      stopAllVideos();
    };
  }, [totalSlots, frameMap, projects]);

  // ── Ref-seeding helper — sets opacity immediately when the element mounts ─
  const seedFrame = (el: HTMLDivElement | null, pi: number, mi: number) => {
    if (!frameRefs.current[pi]) frameRefs.current[pi] = [];
    frameRefs.current[pi][mi] = el;
    if (el) el.style.opacity = (pi === 0 && mi === 0) ? '1' : '0';
  };

  const seedPanel = (el: HTMLDivElement | null, pi: number) => {
    panelRefs.current[pi] = el;
    if (el) {
      // Panels are always opacity:1 — visibility controlled by translateY + overflow:hidden
      el.style.transform     = pi === 0 ? 'translateY(0)' : 'translateY(100%)';
      el.style.pointerEvents = pi === 0 ? 'auto' : 'none';
    }
  };

  if (!projects.length) return null;

  return (
    <div ref={containerRef} style={{ height: `${totalSlots * 100}vh`, position: 'relative' }}>

      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {projects.map((project, pi) => {
          const variant = project.variant ?? 'split';

          // ── SPLIT variant ────────────────────────────────────────────────
          if (variant === 'split') {
            const isLeftImage = project.imagePosition === 'left';

            const imagePaneSplit = (
              <div style={{
                flex:         '1 0 0',
                height:       isMobile ? '260px' : '402px',
                minWidth:     0,
                position:     'relative',
                borderRadius: '32px',
                overflow:     'hidden',
                background:   '#111',
                flexShrink:   0,
              }}>
                {project.media.map((item, mi) => (
                  <div
                    key={`f-${pi}-${mi}`}
                    ref={el => seedFrame(el, pi, mi)}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    {item.kind === 'image' ? (
                      <Image src={item.src} alt={item.alt} fill
                        sizes="(max-width:768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                        priority={pi === 0 && mi === 0} />
                    ) : (
                      <video
                        ref={el => { if (el) videoRefs.current.set(`${pi}-${mi}`, el); else videoRefs.current.delete(`${pi}-${mi}`); }}
                        src={item.src} poster={item.poster}
                        muted loop playsInline preload="metadata"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                ))}
              </div>
            );

            const labelPaneSplit = (
              <div style={{
                flex:           '1 0 0',
                minWidth:       0,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '8px',
                padding:        '24px',
                textAlign:      'center',
                textTransform:  'uppercase' as const,
              }}>
                <p style={{ fontFamily: 'var(--font-montserrat),Montserrat,sans-serif', fontWeight: 600, fontSize: isMobile ? '20px' : '32px', lineHeight: isMobile ? '24px' : '32px', letterSpacing: isMobile ? '1px' : '1.6px', color: '#EEE2D9', margin: 0 }}>{project.label}</p>
                {project.sublabel && <p style={{ fontFamily: 'var(--font-montserrat),Montserrat,sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '16px', letterSpacing: '0.32px', color: '#B5A496', margin: 0 }}>{project.sublabel}</p>}
              </div>
            );

            return (
              <div key={pi} ref={el => seedPanel(el, pi)}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', alignItems: isMobile ? 'stretch' : 'center', width: '100%' }}>
                  {isMobile
                    ? <>{imagePaneSplit}{labelPaneSplit}</>
                    : isLeftImage
                      ? <>{imagePaneSplit}{labelPaneSplit}</>
                      : <>{labelPaneSplit}{imagePaneSplit}</>}
                </div>
              </div>
            );
          }

          // ── SHOWCASE variant ─────────────────────────────────────────────
          // Centred label above, image at natural aspect ratio below.
          // Each image claims 2 × 100 vh so there's time to view it.
          // Videos are scrubbed by scroll — must watch the whole thing to advance.
          return (
            <div key={pi} ref={el => seedPanel(el, pi)}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           isMobile ? '12px' : '28px',
                width:         '100%',
              }}>
                {/* Label */}
                <div style={{ textAlign: 'center', textTransform: 'uppercase' as const }}>
                  <p style={{ fontFamily: 'var(--font-montserrat),Montserrat,sans-serif', fontWeight: 600, fontSize: isMobile ? '18px' : '24px', lineHeight: isMobile ? '22px' : '28px', letterSpacing: '1.2px', color: '#EEE2D9', margin: project.sublabel ? '0 0 8px 0' : '0' }}>{project.label}</p>
                  {project.sublabel && <p style={{ fontFamily: 'var(--font-montserrat),Montserrat,sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '14px', letterSpacing: '0.28px', color: '#B5A496', margin: 0 }}>{project.sublabel}</p>}
                </div>

                {/* Media stack — images size to natural aspect ratio so borderRadius
                    clips the actual photo corners, not the bounding box. */}
                <div style={{
                  position:   'relative',
                  width:      '100%',
                  height:     isMobile ? '52vh' : '62vh',
                  flexShrink: 0,
                }}>
                  {project.media.map((item, mi) => (
                    <div
                      key={`f-${pi}-${mi}`}
                      ref={el => seedFrame(el, pi, mi)}
                      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {item.kind === 'image' ? (
                        // width/height=0 lets CSS drive the size. The image renders at
                        // its natural aspect ratio capped by the container — borderRadius
                        // then clips the real photo corners, not an invisible bounding box.
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={0}
                          height={0}
                          sizes="(max-width:768px) 100vw, 80vw"
                          style={{
                            width:        'auto',
                            height:       'auto',
                            maxWidth:     '100%',
                            maxHeight:    '100%',
                            display:      'block',
                            borderRadius: '32px',
                          }}
                          priority={pi === 0 && mi === 0}
                        />
                      ) : (
                        <video
                          ref={el => { if (el) videoRefs.current.set(`${pi}-${mi}`, el); else videoRefs.current.delete(`${pi}-${mi}`); }}
                          src={item.src} poster={item.poster}
                          muted playsInline
                          preload="auto"
                          style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%', display: 'block', borderRadius: '32px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
