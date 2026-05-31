'use client';

import Image from 'next/image';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ImageGridProps {
  cols:   2 | 3;
  images: { src: string; alt: string }[];
}

export default function ImageGrid({ cols, images }: ImageGridProps) {
  const isMobile = useIsMobile();

  // ─── Mobile 3-col: horizontal scroll rail with 300×300 fixed cards ───────────
  if (isMobile && cols === 3) {
    return (
      <div
        style={{
          display:                 'flex',
          gap:                     '16px',
          overflowX:               'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth:          'none',
          msOverflowStyle:         'none',
          // Bleed past the page's right padding so the next card peeks in
          // — must match the page's own paddingRight clamp exactly
          marginRight:  'calc(-1 * clamp(24px, 9.14vw, 120px))',
          paddingRight: 'clamp(24px, 9.14vw, 120px)',
          flexShrink:   0,
        } as React.CSSProperties}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              width:           '300px',
              height:          '300px',
              borderRadius:    '24px',
              overflow:        'hidden',
              position:        'relative',
              backgroundColor: '#2a2a2a',
              flexShrink:      0,
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="300px"
            />
          </div>
        ))}
      </div>
    );
  }

  // ─── Desktop 3-col + all 2-col: standard equal-column row ────────────────────
  return (
    <div
      style={{
        display:    'flex',
        gap:        isMobile ? '16px' : '24px',
        width:      '100%',
        flexShrink: 0,
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            flex:            '1 0 0',
            minWidth:        0,
            height:          isMobile
              ? (cols === 2 ? '163px' : '402px')
              : '402px',
            borderRadius:    isMobile ? '24px' : '32px',
            overflow:        'hidden',
            position:        'relative',
            backgroundColor: '#2a2a2a',
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            style={{ objectFit: 'cover' }}
            sizes={
              cols === 2
                ? '(max-width: 768px) 50vw, 50vw'
                : '(max-width: 768px) 33vw, 33vw'
            }
          />
        </div>
      ))}
    </div>
  );
}
