'use client';

import { useState, useEffect } from 'react';

export default function NotFound() {
  const [cardHovered,    setCardHovered]    = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleRefresh = () => window.location.reload();

  // ── Shared style helpers (mirrors FooterSection / MoreProjects) ───────────
  const copyrightStyle: React.CSSProperties = {
    fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
    fontWeight:    400,
    fontSize:      isMobileLayout ? '10px' : '16px',
    lineHeight:    isMobileLayout ? '10px' : '16px',
    letterSpacing: '0.05em',
    color:         '#5C5957',
    userSelect:    'none',
  };

  const errorLabelStyle: React.CSSProperties = {
    fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
    fontWeight:    400,
    fontSize:      isMobileLayout ? '12px' : '16px',
    lineHeight:    isMobileLayout ? '12px' : '16px',
    letterSpacing: '0.05em',
    color:         '#5C5957',
    userSelect:    'none',
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
        paddingTop:     isMobileLayout ? 32    : undefined,
        paddingLeft:    isMobileLayout ? 24    : undefined,
        paddingRight:   isMobileLayout ? 24    : undefined,
        paddingBottom:  isMobileLayout ? 40    : undefined,
        boxSizing:      isMobileLayout ? 'border-box' : undefined,
      }}
    >
      {/* ── Header — GK. (left) + 404 (right) ────────────────────────────── */}
      <div
        style={isMobileLayout ? {
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          width:          '100%',
          flexShrink:     0,
        } : {
          position:       'absolute',
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
        <span
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 400,
            fontSize:   isMobileLayout ? 16 : 16,
            lineHeight: 1,
            color:      '#5C5957',
            userSelect: 'none',
          }}
        >
          404
        </span>
      </div>

      {/* ── Main card — button that refreshes the page ────────────────────── */}
      <button
        onClick={handleRefresh}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        onTouchStart={() => setCardHovered(true)}
        onTouchEnd={() => setCardHovered(false)}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          isMobileLayout ? '100%'        : 'calc(100% - 240px)',
          flex:           isMobileLayout ? 1             : undefined,
          marginTop:      isMobileLayout ? 32            : undefined,
          marginBottom:   isMobileLayout ? 16            : undefined,
          padding:        isMobileLayout ? '32px'        : '120px',
          overflow:       isMobileLayout ? 'hidden'      : undefined,
          maxWidth:       isMobileLayout ? undefined      : '1200px',
          border:         '2px solid #444240',
          borderRadius:   '48px',
          background:     cardHovered ? '#F2EAE3' : 'transparent',
          cursor:         'pointer',
          transition:     'background 0.3s ease',
          boxSizing:      'border-box',
          flexShrink:     0,
          // reset button defaults
          appearance:     'none',
          outline:        'none',
          fontFamily:     'inherit',
        }}
      >
        {isMobileLayout ? (
          /* Mobile: text rotated 90° so it reads top-to-bottom in portrait card */
          <div
            style={{
              transform:  'rotate(90deg)',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 500,
              fontSize:   '40px',
              lineHeight: '64px',
              color:      cardHovered ? '#1A1A1A' : '#F2EAE3',
              textAlign:  'center',
              userSelect: 'none',
              transition: 'color 0.3s ease',
            }}
          >
            REFRESH
          </div>
        ) : (
          /* Desktop: large fixed size — "REFRESH" is short, 100px fills nicely */
          <span
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    500,
              fontSize:      '100px',
              lineHeight:    '100px',
              letterSpacing: 0,
              color:         cardHovered ? '#1A1A1A' : '#F2EAE3',
              textAlign:     'center',
              whiteSpace:    'nowrap',
              userSelect:    'none',
              transition:    'color 0.3s ease',
            }}
          >
            REFRESH
          </span>
        )}
      </button>

      {/* ── Bottom bar — mobile ───────────────────────────────────────────── */}
      {isMobileLayout && (
        <>
          <div
            style={{
              display:        'flex',
              width:          '100%',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
              marginBottom:   16,
            }}
          >
            <span style={errorLabelStyle}>AN ERROR OCCURRED</span>
          </div>
          <span style={{ ...copyrightStyle, flexShrink: 0 }}>
            COPYRIGHT © GEORGE KOULOURIS
          </span>
        </>
      )}

      {/* ── Bottom bar — desktop ──────────────────────────────────────────── */}
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
          <span style={errorLabelStyle}>AN ERROR OCCURRED</span>
          <span style={copyrightStyle}>COPYRIGHT © GEORGE KOULOURIS</span>
        </div>
      )}
    </section>
  );
}
