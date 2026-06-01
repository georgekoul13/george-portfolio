'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllSlugs, getProject } from '@/content/projects';

// ── Fluid font size — measure "NEXT PROJECT" at BASE_FONT then scale to card ──
function measureTextWidth(text: string, fontSize: number): number {
  const el = document.createElement('span');
  el.textContent = text;
  Object.assign(el.style, {
    position:   'fixed',
    top:        '-9999px',
    left:       '-9999px',
    fontSize:   `${fontSize}px`,
    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
    fontWeight: '500',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    visibility: 'hidden',
  });
  document.body.appendChild(el);
  const w = el.getBoundingClientRect().width;
  document.body.removeChild(el);
  return w;
}

const BASE_FONT = 100;

interface MoreProjectsProps {
  currentSlug: string;
}

export default function MoreProjects({ currentSlug }: MoreProjectsProps) {
  const [cardHovered,    setCardHovered]    = useState(false);
  const [behanceHovered, setBehanceHovered] = useState(false);
  const [igHovered,      setIgHovered]      = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [fontSize,       setFontSize]       = useState(BASE_FONT);

  const cardRef = useRef<HTMLAnchorElement>(null);

  // Find the next project (wraps around)
  const slugs        = getAllSlugs();
  const currentIndex = slugs.indexOf(currentSlug);
  const nextSlug     = slugs[(currentIndex + 1) % slugs.length];
  const nextProject  = getProject(nextSlug);

  // ── Mobile layout detection ─────────────────────────────────────────────────
  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Fluid font size — scales "NEXT PROJECT" to fill inner card width ─────────
  useEffect(() => {
    if (isMobileLayout) return;
    const compute = () => {
      if (!cardRef.current) return;
      const cardW  = cardRef.current.getBoundingClientRect().width;
      const innerW = cardW - 240; // 120 px padding each side
      const baseW  = measureTextWidth('NEXT PROJECT', BASE_FONT);
      const size   = Math.floor((innerW / baseW) * BASE_FONT);
      setFontSize(Math.min(size, BASE_FONT));
    };
    document.fonts.ready.then(compute);
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [isMobileLayout]);

  // ── Shared style helpers (match FooterSection exactly) ─────────────────────
  const linkStyle = (hovered: boolean) => ({
    fontFamily:     'var(--font-montserrat), Montserrat, sans-serif',
    fontWeight:     400,
    fontSize:       isMobileLayout ? '12px' : '16px',
    lineHeight:     isMobileLayout ? '12px' : '16px',
    letterSpacing:  '0.05em',
    color:          '#F2EAE3' as const,
    textDecoration: 'none'   as const,
    cursor:         'pointer' as const,
    opacity:        hovered ? 0.6 : 1,
    transition:     'opacity 0.2s ease',
    userSelect:     'none'   as const,
  });

  const copyrightStyle = {
    fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
    fontWeight:    400,
    fontSize:      isMobileLayout ? '10px' : '16px',
    lineHeight:    isMobileLayout ? '10px' : '16px',
    letterSpacing: '0.05em',
    color:         '#5C5957',
    userSelect:    'none' as const,
  };

  if (!nextProject) return null;

  return (
    <section
      style={{
        position:       'relative',
        height:         isMobileLayout ? '100svh' : '100vh',
        background:     'transparent',
        display:        'flex',
        flexDirection:  isMobileLayout ? 'column' : 'row',
        alignItems:     'center',
        justifyContent: isMobileLayout ? 'flex-start' : 'center',
        overflow:       isMobileLayout ? 'hidden'      : undefined,
        boxSizing:      isMobileLayout ? 'border-box' as const : undefined,
      }}
    >
      {/* ── Main card ─────────────────────────────────────────────────────────── */}
      <a
        ref={cardRef}
        href={`/projects/${nextSlug}`}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        onTouchStart={() => setCardHovered(true)}
        onTouchEnd={() => setCardHovered(false)}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          isMobileLayout ? '100%'               : 'calc(100% - 240px)',
          flex:           isMobileLayout ? 1                    : undefined,
          marginTop:      isMobileLayout ? 32                   : undefined,
          marginBottom:   isMobileLayout ? 16                   : undefined,
          padding:        isMobileLayout ? '32px'               : '120px',
          overflow:       isMobileLayout ? 'hidden'             : undefined,
          maxWidth:       isMobileLayout ? undefined            : '1200px',
          border:         '2px solid #444240',
          borderRadius:   '48px',
          background:     cardHovered ? '#F2EAE3' : 'transparent',
          textDecoration: 'none',
          cursor:         'pointer',
          transition:     'background 0.3s ease',
          boxSizing:      'border-box' as const,
          flexShrink:     0,
        }}
      >
        {/* Mobile: rotated 90° so it reads top-to-bottom in portrait card */}
        {isMobileLayout ? (
          <div
            style={{
              transform:     'rotate(90deg)',
              whiteSpace:    'nowrap',
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    500,
              fontSize:      '40px',
              lineHeight:    '64px',
              color:         cardHovered ? '#1A1A1A' : '#F2EAE3',
              textAlign:     'center',
              userSelect:    'none',
              transition:    'color 0.3s ease',
            }}
          >
            NEXT PROJECT
          </div>
        ) : (
          <span
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    500,
              fontSize:      `${fontSize}px`,
              lineHeight:    `${fontSize}px`,
              letterSpacing: 0,
              color:         cardHovered ? '#1A1A1A' : '#F2EAE3',
              textAlign:     'center',
              whiteSpace:    'nowrap',
              userSelect:    'none',
              transition:    'color 0.3s ease',
            }}
          >
            NEXT PROJECT
          </span>
        )}
      </a>

      {/* ── Bottom bar — mobile ───────────────────────────────────────────────── */}
      {isMobileLayout && (
        <>
          <div
            style={{
              display:        'flex',
              width:          '100%',
              justifyContent: 'space-between',
              alignItems:     'center',
              flexShrink:     0,
              marginBottom:   16,
            }}
          >
            <a href="https://www.behance.net/george_koulouris" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setBehanceHovered(true)} onMouseLeave={() => setBehanceHovered(false)} style={linkStyle(behanceHovered)}>BEHANCE</a>
            <a href="https://www.instagram.com/george_koulouris/" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIgHovered(true)} onMouseLeave={() => setIgHovered(false)} style={linkStyle(igHovered)}>INSTAGRAM</a>
          </div>
          <span style={{ ...copyrightStyle, flexShrink: 0 }}>COPYRIGHT © GEORGE KOULOURIS</span>
        </>
      )}

      {/* ── Bottom bar — desktop ──────────────────────────────────────────────── */}
      {!isMobileLayout && (
        <div
          style={{
            position:       'absolute',
            bottom:         '60px',
            left:           '120px',
            right:          '120px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}
        >
          <a href="https://www.behance.net/george_koulouris" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setBehanceHovered(true)} onMouseLeave={() => setBehanceHovered(false)} style={linkStyle(behanceHovered)}>BEHANCE</a>
          <span style={copyrightStyle}>COPYRIGHT © GEORGE KOULOURIS</span>
          <a href="https://www.instagram.com/george_koulouris/" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIgHovered(true)} onMouseLeave={() => setIgHovered(false)} style={linkStyle(igHovered)}>INSTAGRAM</a>
        </div>
      )}
    </section>
  );
}
