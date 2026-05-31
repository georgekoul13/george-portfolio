'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CarouselProps {
  images:      { src: string; alt: string }[];
  interval?:   number;   // ms per frame, default 1400
  aspectRatio?: string;  // CSS aspect-ratio value, default '16 / 9'
}

export default function Carousel({
  images,
  interval    = 1400,
  aspectRatio = '16 / 9',
}: CarouselProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setFrame(f => (f + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  if (!images.length) return null;

  return (
    <div
      style={{
        position:   'relative',
        width:      '100%',
        aspectRatio,
        borderRadius: 'clamp(16px, 1.67vw, 24px)',
        overflow:   'hidden',
        flexShrink: 0,
        background: '#111',  // fallback while images load
      }}
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          style={{
            position: 'absolute',
            inset:    0,
            // Opacity-only switch with zero transition = instant cut, video feel
            opacity:  i === frame ? 1 : 0,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 100vw, calc(100vw - 240px)"
            style={{ objectFit: 'cover' }}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Frame indicator — subtle pills at bottom center */}
      {images.length > 1 && (
        <div
          style={{
            position:       'absolute',
            bottom:         '20px',
            left:           '50%',
            transform:      'translateX(-50%)',
            display:        'flex',
            gap:            '5px',
            alignItems:     'center',
            pointerEvents:  'none',
          }}
        >
          {images.map((_, i) => (
            <div
              key={i}
              style={{
                height:       '4px',
                width:        i === frame ? '20px' : '4px',
                borderRadius: '2px',
                background:   i === frame
                  ? 'rgba(242, 234, 227, 0.9)'
                  : 'rgba(242, 234, 227, 0.25)',
                // Pills also cut instantly — consistent with the sharp frame switch
                transition:   'none',
                flexShrink:   0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
