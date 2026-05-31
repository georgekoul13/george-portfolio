'use client';

import Image from 'next/image';
import { useIsMobile } from '@/hooks/useIsMobile';

interface FullImageProps {
  src:    string;
  alt:    string;
  badge?: string;
}

export default function FullImage({ src, alt, badge }: FullImageProps) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position:        'relative',
        width:           '100%',
        height:          isMobile ? '200px' : '600px',
        borderRadius:    isMobile ? '24px' : '32px',
        overflow:        'hidden',
        flexShrink:      0,
        backgroundColor: '#2a2a2a',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, 90vw"
      />

      {badge && (
        <div
          style={{
            position:        'absolute',
            bottom:          '24px',
            left:            '24px',
            backgroundColor: '#1A1A1A',
            color:           '#B5A496',
            fontFamily:      'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight:      500,
            fontSize:        '11px',
            letterSpacing:   '0.12em',
            lineHeight:      '16px',
            textTransform:   'uppercase',
            padding:         '8px 16px',
            borderRadius:    '100px',
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
}
