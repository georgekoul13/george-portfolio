'use client';

import { useMode } from '@/context/ModeContext';
import DraggableItem from '@/components/project-page/DraggableItem';

interface TypefaceGridProps {
  name:     string;
  subtitle?: string;
  variant:  'rounded' | 'angular';
  letters:  { key: string; src: string; alt: string }[];
}

export default function TypefaceGrid({ name, subtitle, variant, letters }: TypefaceGridProps) {
  const { mode } = useMode();
  const isFun = mode === 'fun';

  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '48px',
        width:          '100%',
      }}
    >
      {/* Label block */}
      <div
        style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '8px',
          textAlign:      'center',
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight:    600,
            fontSize:      '32px',
            color:         '#EEE2D9',
            letterSpacing: '1.6px',
            textTransform: 'uppercase',
            lineHeight:    1.2,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight:    400,
            fontSize:      '16px',
            color:         '#B5A496',
            letterSpacing: '0.32px',
            textTransform: 'uppercase',
            lineHeight:    1.4,
          }}
        >
          {subtitle}
        </span>
      </div>

      {/* Letter grid */}
      {variant === 'rounded' ? (
        <div
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            '16px',
            justifyContent: 'center',
          }}
        >
          {letters.map(letter => (
            <DraggableItem key={letter.key} label={letter.key} enabled={isFun}>
              <div
                style={{
                  position: 'relative',
                  width:    '100px',
                  height:   '100px',
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={letter.src}
                  alt={letter.alt}
                  style={{
                    position: 'absolute',
                    inset:    0,
                    width:    '100%',
                    height:   '100%',
                    opacity:  1,
                  }}
                />
              </div>
            </DraggableItem>
          ))}
        </div>
      ) : (
        <div
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            '48px',
            justifyContent: 'center',
            opacity:        0.8,
          }}
        >
          {letters.map(letter => (
            <DraggableItem key={letter.key} label={letter.key} enabled={isFun}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={letter.src}
                alt={letter.alt}
                style={{
                  height:    '65px',
                  width:     'auto',
                  display:   'block',
                }}
              />
            </DraggableItem>
          ))}
        </div>
      )}
    </div>
  );
}
