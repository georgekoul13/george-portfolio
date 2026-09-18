'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Vol2NotFound from '@/components/vol2/notfound/NotFoundContent';
import { inVol2 } from '@/components/vol2/surface';

export default function NotFound() {
  const pathname = usePathname();
  const [cardHovered,    setCardHovered]    = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  /* A 404 cannot export `metadata` from a client component, so it inherits
     the layout's site-wide fallback and would be titled as though it were
     the home page. Set after mount rather than during render: a title is
     not markup, so there is nothing for React to hydrate and nothing to
     mismatch. */
  useEffect(() => {
    document.title = 'Page not found · George Koulouris';
  }, []);

  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* Vol2 has its own 404 — the dino game. A nested `not-found.tsx` under
     `app/vol2` is the tidier way to do this, but Next 14.2 does not fire one
     for `notFound()` thrown from a dynamic segment, so the branch lives here
     instead. Placed below the hooks, not above them: an early return before
     `useState`/`useEffect` would change the hook order between the two 404s.
     Once Vol 2 IS the site this is every 404, which is why the test is
     `inVol2` and not a written-out prefix — see `surface.ts` for what that
     cost the first time. */
  if (inVol2(pathname)) return <Vol2NotFound />;

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
