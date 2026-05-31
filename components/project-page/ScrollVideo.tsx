'use client';

import { useEffect, useRef } from 'react';

interface ScrollVideoProps {
  src:           string;    // .mp4 required — .mov won't play in browsers
  poster?:       string;
  scrollWeight?: number;    // how many × 100 vh the component claims — default 5
                            // scroll progress is mapped to video.currentTime (Vozora-style scrub)
}

export default function ScrollVideo({
  src,
  poster,
  scrollWeight = 5,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video     = videoRef.current;
    if (!container || !video) return;

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const vh         = window.innerHeight;
      const scrollable = container.offsetHeight - vh;
      if (scrollable <= 0) return;

      // Only act while the component is in or near the viewport
      if (rect.bottom < 0 || rect.top > vh) return;

      const scrolled  = Math.max(0, -rect.top);
      const progress  = Math.min(1, scrolled / scrollable);

      // Scrub: map scroll progress → currentTime
      if (!isNaN(video.duration) && video.duration > 0) {
        const t = progress * video.duration;
        if (Math.abs(video.currentTime - t) > 0.05) {
          video.currentTime = t;
        }
      }

      // Brief play → pause so the browser decodes and renders the new frame
      if (video.paused) video.play().catch(() => {});
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => video.pause(), 80);
    };

    // Pause instantly when scrolled fully out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          if (timerRef.current) clearTimeout(timerRef.current);
        }
      },
      { threshold: 0 },
    );
    observer.observe(video);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const radius = 'clamp(16px, 1.67vw, 24px)';

  return (
    // Tall container — scrollWeight × 100 vh gives the user time to scrub the whole video
    <div
      ref={containerRef}
      style={{ height: `${scrollWeight * 100}vh`, position: 'relative' }}
    >
      {/* Sticky viewer — centred, natural aspect ratio, no crop */}
      <div
        style={{
          position:       'sticky',
          top:            0,
          height:         '100vh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          style={{
            display:      'block',
            width:        '100%',
            height:       'auto',
            maxHeight:    'calc(100vh - 160px)',
            borderRadius: radius,
            overflow:     'hidden',   // clips video content to the rounded corners
          }}
        />
      </div>
    </div>
  );
}
