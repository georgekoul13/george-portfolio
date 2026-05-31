'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ScrollSequencePairProps {
  left:         { src: string; alt: string }[];
  right:        { src: string; alt: string }[];
  aspectRatio?: string;  // default '9 / 16' — portrait phone screens
  gap?:         string;  // gap between columns, default '16px'
}

export default function ScrollSequencePair({
  left,
  right,
  aspectRatio = '9 / 16',
  gap         = '16px',
}: ScrollSequencePairProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef  = useRef(0);
  const leftRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const count     = Math.min(left.length, right.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || count <= 1) return;

    const switchTo = (next: number) => {
      const prev = frameRef.current;
      if (next === prev) return;

      const prevL   = leftRefs.current[prev];
      const nextL   = leftRefs.current[next];
      const prevR   = rightRefs.current[prev];
      const nextR   = rightRefs.current[next];

      if (prevL) prevL.style.opacity = '0';
      if (nextL) nextL.style.opacity = '1';
      if (prevR) prevR.style.opacity = '0';
      if (nextR) nextR.style.opacity = '1';

      frameRef.current = next;
    };

    const onScroll = () => {
      const rect       = container.getBoundingClientRect();
      const vh         = window.innerHeight;
      const scrollable = container.offsetHeight - vh;
      if (scrollable <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollable);
      const next     = Math.min(Math.floor(progress * count), count - 1);
      switchTo(next);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [count]);

  if (!count) return null;

  // Column box — height-driven so portrait screens fit within the viewport
  const colStyle: React.CSSProperties = {
    position:     'relative',
    height:       'clamp(300px, 75vh, 680px)',
    aspectRatio,
    borderRadius: 'clamp(16px, 1.67vw, 24px)',
    overflow:     'hidden',
    background:   '#111',
    flexShrink:   0,
  };

  return (
    <div
      ref={containerRef}
      style={{ height: `${count * 100}vh`, position: 'relative' }}
    >
      {/* Sticky viewer */}
      <div
        style={{
          position:       'sticky',
          top:            0,
          height:         '100vh',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        {/* Side-by-side columns */}
        <div style={{ display: 'flex', gap, alignItems: 'center', justifyContent: 'center' }}>
          {/* Left column */}
          <div style={colStyle}>
            {left.map((img, i) => (
              <div
                key={img.src}
                ref={el => { leftRefs.current[i] = el; }}
                style={{ position: 'absolute', inset: 0, opacity: i === 0 ? 1 : 0 }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 45vw, 25vw"
                  style={{ objectFit: 'contain' }}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={colStyle}>
            {right.map((img, i) => (
              <div
                key={img.src}
                ref={el => { rightRefs.current[i] = el; }}
                style={{ position: 'absolute', inset: 0, opacity: i === 0 ? 1 : 0 }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 45vw, 25vw"
                  style={{ objectFit: 'contain' }}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
