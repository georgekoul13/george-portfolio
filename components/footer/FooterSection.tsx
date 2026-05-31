'use client';

import { useState, useEffect, useRef } from 'react';

// Measure "LET'S CONNECT" at a given font size so we can scale to fit
function measureConnectWidth(fontSize: number): number {
  const el = document.createElement('span');
  el.textContent = "LET'S CONNECT";
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

const BASE_FONT = 100; // reference size for measurement

export default function FooterSection() {
  const [cardHovered,    setCardHovered]    = useState(false);
  const [behanceHovered, setBehanceHovered] = useState(false);
  const [igHovered,      setIgHovered]      = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  // Athens time — mobile header right slot (mirrors HeroSection clock)
  const [athensTime,     setAthensTime]     = useState('');

  // Fluid font size for desktop "LET'S CONNECT"
  const [connectFontSize, setConnectFontSize] = useState(BASE_FONT);
  const cardRef   = useRef<HTMLAnchorElement>(null);
  // Desktop cursor coords — direct DOM write, zero re-renders
  const coordsRef = useRef<HTMLSpanElement>(null);

  // ── Mobile layout detection ───────────────────────────────────────────────
  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Athens time clock ─────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const time = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Athens',
        hour:     '2-digit',
        minute:   '2-digit',
        second:   '2-digit',
      });
      setAthensTime(`GR, ${time}`);
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  // ── Desktop cursor coordinates — direct DOM write, no React re-renders ──
  useEffect(() => {
    if (isMobileLayout) return;

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
  }, [isMobileLayout]);

  // ── Desktop connect font size — scales text to fill inner card width ────
  useEffect(() => {
    if (isMobileLayout) return;
    const compute = () => {
      if (!cardRef.current) return;
      const cardW  = cardRef.current.getBoundingClientRect().width;
      const innerW = cardW - 240; // 120 px padding each side
      const baseW  = measureConnectWidth(BASE_FONT);
      const size   = Math.floor((innerW / baseW) * BASE_FONT);
      setConnectFontSize(Math.min(size, BASE_FONT)); // never exceed 100 px
    };
    document.fonts.ready.then(compute);
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [isMobileLayout]);

  // ── Shared style helpers ──────────────────────────────────────────────────
  const linkStyle = (hovered: boolean) => ({
    fontFamily:     'var(--font-montserrat), Montserrat, sans-serif',
    fontWeight:     400,
    fontSize:       isMobileLayout ? '12px' : '16px',
    lineHeight:     isMobileLayout ? '12px' : '16px',
    letterSpacing:  '0.05em',
    color:          '#F2EAE3' as const,
    textDecoration: 'none' as const,
    cursor:         'pointer' as const,
    opacity:        hovered ? 0.6 : 1,
    transition:     'opacity 0.2s ease',
    userSelect:     'none' as const,
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
        // Mobile padding: top = 32 (header), sides = 24, bottom = 40 (above toggle)
        paddingTop:     isMobileLayout ? 32    : undefined,
        paddingLeft:    isMobileLayout ? 24    : undefined,
        paddingRight:   isMobileLayout ? 24    : undefined,
        paddingBottom:  isMobileLayout ? 40    : undefined,
        boxSizing:      isMobileLayout ? 'border-box' as const : undefined,
      }}
    >
      {/* ── Header — GK. (left) + Athens time (right) ────────────────────── */}
      {/* Always rendered on every screen size. Mobile: column-flex child.    */}
      {/* Desktop: position absolute, mirrors HeroSection barPad / topOffset. */}
      <div
        style={isMobileLayout ? {
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          width:          '100%',
          flexShrink:     0,
        } : {
          position:       'absolute' as const,
          top:            60,
          left:           120,
          right:          120,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
        }}
      >
        <img
          src="/logo.svg"
          alt="GK."
          style={{ height: 32, width: 'auto', display: 'block' }}
        />
        {/* Mobile: Athens time clock. Desktop: live cursor coordinates */}
        {isMobileLayout ? (
          <span
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              fontSize:   16,
              lineHeight: 1,
              color:      '#F2EAE3',
              userSelect: 'none' as const,
            }}
          >
            {athensTime}
          </span>
        ) : (
          <span
            ref={coordsRef}
            style={{
              fontFamily:         'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:         400,
              fontSize:           16,
              lineHeight:         1,
              color:              '#F2EAE3',
              userSelect:         'none'          as const,
              whiteSpace:         'nowrap',
              fontVariantNumeric: 'tabular-nums',
            }}
          />
        )}
      </div>

      {/* ── Main card ─────────────────────────────────────────────────────── */}
      {/*                                                                      */}
      {/* MOBILE: card is a natural portrait shape (no transform). The text   */}
      {/* inside is rotated 90° so "LET'S CONNECT" reads top-to-bottom.       */}
      {/* flex:1 makes the card fill the space between header and bottom bar. */}
      {/* marginTop:32 = spec gap from header; marginBottom:16 = gap to       */}
      {/* social row. padding:40px 60px = visual breathing room.              */}
      {/*                                                                      */}
      {/* DESKTOP: fluid card, no rotation, 100px text. Untouched.            */}
      <a
        ref={cardRef}
        href="https://www.linkedin.com/in/george-koulouris/"
        target="_blank"
        rel="noopener noreferrer"
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
          padding:        isMobileLayout ? '32px'                : '120px',
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
        {/* ── Mobile text (rotated 90° inside portrait card) ── */}
        {isMobileLayout ? (
          <div
            style={{
              transform:     'rotate(90deg)',
              whiteSpace:    'nowrap',
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    500,
              fontSize:      '40px',
              lineHeight:    '64px',
              letterSpacing: '0',
              color:         cardHovered ? '#1A1A1A' : '#F2EAE3',
              textAlign:     'center',
              userSelect:    'none',
              transition:    'color 0.3s ease',
            }}
          >
            LET&apos;S CONNECT
          </div>
        ) : (
          /* ── Desktop text — font scales to fill the inner card width ── */
          <span
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    500,
              fontSize:      `${connectFontSize}px`,
              lineHeight:    `${connectFontSize}px`,
              letterSpacing: 0,
              color:         cardHovered ? '#1A1A1A' : '#F2EAE3',
              textAlign:     'center',
              whiteSpace:    'nowrap',
              userSelect:    'none',
              transition:    'color 0.3s ease',
            }}
          >
            LET&apos;S CONNECT
          </span>
        )}
      </a>

      {/* ── Bottom bar — mobile ───────────────────────────────────────────── */}
      {/* Two rows: BEHANCE | INSTAGRAM, then Copyright centered below.       */}
      {/* Spacing driven by marginBottom on each row (16px handled by card,   */}
      {/* 8px on the social row itself).                                      */}
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
            <a
              href="https://www.behance.net/george_koulouris"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setBehanceHovered(true)}
              onMouseLeave={() => setBehanceHovered(false)}
              style={linkStyle(behanceHovered)}
            >
              BEHANCE
            </a>
            <a
              href="https://www.instagram.com/george_koulouris/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIgHovered(true)}
              onMouseLeave={() => setIgHovered(false)}
              style={linkStyle(igHovered)}
            >
              INSTAGRAM
            </a>
          </div>

          <span style={{ ...copyrightStyle, flexShrink: 0 }}>
            COPYRIGHT © GEORGE KOULOURIS
          </span>
        </>
      )}

      {/* ── Bottom bar — desktop (unchanged) ─────────────────────────────── */}
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
          <a
            href="https://www.behance.net/george_koulouris"
              target="_blank"
              rel="noopener noreferrer"
            onMouseEnter={() => setBehanceHovered(true)}
            onMouseLeave={() => setBehanceHovered(false)}
            style={linkStyle(behanceHovered)}
          >
            BEHANCE
          </a>

          <span style={copyrightStyle}>COPYRIGHT © GEORGE KOULOURIS</span>

          <a
            href="https://www.instagram.com/george_koulouris/"
              target="_blank"
              rel="noopener noreferrer"
            onMouseEnter={() => setIgHovered(true)}
            onMouseLeave={() => setIgHovered(false)}
            style={linkStyle(igHovered)}
          >
            INSTAGRAM
          </a>
        </div>
      )}
    </section>
  );
}
