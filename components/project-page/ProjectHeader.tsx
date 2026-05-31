'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

function BackArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: 'rotate(180deg)', display: 'block', flexShrink: 0 }}
    >
      <line x1="7" y1="7" x2="17" y2="17" />
      <polyline points="17 7 17 17 7 17" />
    </svg>
  );
}

// Mirror the exact same breakpoints & offsets as HeroSection
type ScreenSize = 'mobile' | 'tablet' | 'desktop';

export default function ProjectHeader() {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const coordsRef = useRef<HTMLSpanElement>(null);

  // ── Screen size detection — same breakpoints as HeroSection ────────────────
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if      (vw < 744)  setScreenSize('mobile');
      else if (vw < 1024) setScreenSize('tablet');
      else                setScreenSize('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Cursor coords — direct DOM write, no re-render ──────────────────────────
  useEffect(() => {
    const seed = () => {
      if (!coordsRef.current) return;
      const x = String(window.innerWidth).padStart(4,  '0');
      const y = String(window.innerHeight).padStart(4, '0');
      coordsRef.current.textContent = `${x} × ${y}`;
    };
    seed();
    const onMove = (e: MouseEvent) => {
      if (!coordsRef.current) return;
      const x = String(Math.round(e.clientX)).padStart(4, '0');
      const y = String(Math.round(e.clientY)).padStart(4, '0');
      coordsRef.current.textContent = `${x} × ${y}`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize',    seed,    { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize',    seed);
    };
  }, []);

  const isMobileLayout = screenSize === 'mobile';
  const isTabletLayout = screenSize === 'tablet';

  // Same values as HeroSection — topOffset + barPad
  const topOffset = isMobileLayout ? 32 : 60;
  const barPad    = isMobileLayout ? 24 : isTabletLayout ? 60 : 120;

  return (
    <nav
      style={{
        position:       'fixed',
        top:            topOffset,
        left:           barPad,
        right:          barPad,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        zIndex:         100,
        pointerEvents:  'auto',
      }}
    >
      {/* Left slot — back button (mirrors GK. position on homepage) */}
      <Link
        href="/"
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '4px',
          color:          '#F2EAE3',
          textDecoration: 'none',
          fontFamily:     'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight:     900,
          fontSize:       '20px',
          lineHeight:     '1',
          letterSpacing:  '0.02em',
          userSelect:     'none',
        }}
      >
        <BackArrow />
      </Link>

      {/* Right slot — cursor coords, hidden on mobile (mirrors homepage) */}
      <span
        ref={coordsRef}
        style={{
          display:            isMobileLayout ? 'none' : 'block',
          fontFamily:         'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight:         400,
          fontSize:           '16px',
          lineHeight:         '16px',
          letterSpacing:      '0.04em',
          color:              '#F2EAE3',
          whiteSpace:         'nowrap',
          fontVariantNumeric: 'tabular-nums',
          userSelect:         'none',
        }}
      />
    </nav>
  );
}
