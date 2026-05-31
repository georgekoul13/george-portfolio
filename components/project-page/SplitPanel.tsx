'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/useIsMobile';

interface SplitPanelProps {
  imagePosition: 'left' | 'right';
  images:        { src: string; alt: string }[];
  interval?:     number;   // ms between carousel frames, default 2000
  label:         string;
  sublabel:      string;
}

export default function SplitPanel({
  imagePosition,
  images,
  interval = 2000,
  label,
  sublabel,
}: SplitPanelProps) {
  const isMobile = useIsMobile();

  // ── Carousel frame — direct DOM swap, no React re-renders during cycling ──
  const frameRef  = useRef(0);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      const prev = frameRef.current;
      const next = (prev + 1) % images.length;
      if (layerRefs.current[prev]) layerRefs.current[prev]!.style.opacity = '0';
      if (layerRefs.current[next]) layerRefs.current[next]!.style.opacity = '1';
      frameRef.current = next;
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  // ── Image pane ────────────────────────────────────────────────────────────
  const imagePane = (
    <div
      style={{
        flex:         '1 0 0',
        height:       isMobile ? '260px' : '402px',
        minWidth:     0,
        position:     'relative',
        borderRadius: '32px',
        overflow:     'hidden',
        background:   '#111',
        flexShrink:   0,
      }}
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          ref={el => { layerRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            inset:    0,
            opacity:  i === 0 ? 1 : 0,
            // No transition — instant cut
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );

  // ── Label pane ────────────────────────────────────────────────────────────
  const textPane = (
    <div
      style={{
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
      }}
    >
      <p
        style={{
          fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight:    600,
          fontSize:      isMobile ? '20px' : '32px',
          lineHeight:    isMobile ? '24px' : '32px',
          letterSpacing: isMobile ? '1px'  : '1.6px',
          color:         '#EEE2D9',
          margin:        0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight:    400,
          fontSize:      '16px',
          lineHeight:    '16px',
          letterSpacing: '0.32px',
          color:         '#B5A496',
          margin:        0,
        }}
      >
        {sublabel}
      </p>
    </div>
  );

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap:           '24px',
        alignItems:    isMobile ? 'stretch' : 'center',
        width:         '100%',
        flexShrink:    0,
      }}
    >
      {isMobile ? (
        // Mobile: image always on top
        <>{imagePane}{textPane}</>
      ) : imagePosition === 'left' ? (
        <>{imagePane}{textPane}</>
      ) : (
        <>{textPane}{imagePane}</>
      )}
    </div>
  );
}
