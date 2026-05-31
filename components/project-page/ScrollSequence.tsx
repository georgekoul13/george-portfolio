'use client';

import { useEffect, useRef } from 'react';

interface ScrollSequenceProps {
  images:       { src: string; alt: string }[];
  aspectRatio?: string;   // kept for API compat but no longer used — images render at natural size
}

export default function ScrollSequence({
  images,
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef     = useRef(0);
  const layerRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length <= 1) return;

    const switchTo = (next: number) => {
      const prev = frameRef.current;
      if (next === prev) return;

      const prevLayer = layerRefs.current[prev];
      const nextLayer = layerRefs.current[next];

      if (prevLayer) prevLayer.style.opacity = '0';
      if (nextLayer) nextLayer.style.opacity = '1';

      frameRef.current = next;
    };

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const vh         = window.innerHeight;
      const scrollable = container.offsetHeight - vh;
      if (scrollable <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollable);
      const next     = Math.min(
        Math.floor(progress * images.length),
        images.length - 1,
      );
      switchTo(next);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [images.length]);

  if (!images.length) return null;

  const radius = 'clamp(16px, 1.67vw, 24px)';

  return (
    <div
      ref={containerRef}
      style={{ height: `${images.length * 100}vh`, position: 'relative' }}
    >
      {/* Sticky viewer */}
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
        {/*
         * Image stack — no fixed aspect-ratio container, no background.
         * The first image (position: relative) defines the frame's natural size.
         * All other images (position: absolute, inset: 0) overlay it exactly.
         * border-radius is applied directly to each <img> so no overflow:hidden
         * is needed.
         */}
        <div style={{ position: 'relative', maxWidth: '100%' }}>
          {images.map((img, i) => (
            <div
              key={img.src}
              ref={el => { layerRefs.current[i] = el; }}
              style={i === 0 ? {
                position: 'relative',
                opacity:  1,
              } : {
                position: 'absolute',
                inset:    0,
                opacity:  0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{
                  display:      'block',
                  // First image: fill container width so landscape images aren't
                  // rendered at their small natural size. max-height + height:auto
                  // on <img> (a replaced element) proportionally constrains both
                  // dimensions, so portrait images stay correct too.
                  // Overlay images: fill the frame the first image established.
                  width:        '100%',
                  height:       i === 0 ? 'auto' : '100%',
                  maxHeight:    'calc(100vh - 160px)',
                  objectFit:    i === 0 ? undefined : 'contain',
                  borderRadius: radius,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
