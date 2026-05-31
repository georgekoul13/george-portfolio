'use client';

import { useEffect, useState } from 'react';

interface DisclaimerProps {
  text: string;
}

export default function Disclaimer({ text }: DisclaimerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems:    'flex-start',
        gap:           isMobile ? '12px' : '0',
        width:         '100%',
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight: 400,
          fontSize:   '16px',
          lineHeight: '16px',
          color:      '#F2EAE3',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          paddingTop: isMobile ? 0 : '6px',
          // Desktop: pin label to left 50% column
          flex:       isMobile ? undefined : '0 0 30%',
        }}
      >
        Disclaimer
      </span>

      {/* Body */}
      <p
        style={{
          fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight:    500,
          fontSize:      'clamp(18px, 1.67vw, 24px)',
          lineHeight:    '1.33',
          letterSpacing: '0.02em',
          color:         '#F2EAE3',
          margin:        0,
          flex:          isMobile ? undefined : '1',
        }}
      >
        {text}
      </p>
    </div>
  );
}
