'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMode } from '@/context/ModeContext';

// ─── Font list ────────────────────────────────────────────────────────────────
const FONTS = [
  'var(--font-montserrat), Montserrat, sans-serif',
  'var(--font-playfair), "Playfair Display", serif',
  'var(--font-righteous), Righteous, sans-serif',
  'var(--font-boogaloo), Boogaloo, sans-serif',
  'var(--font-abril), "Abril Fatface", serif',
  'var(--font-pacifico), Pacifico, cursive',
  'var(--font-black-ops), "Black Ops One", sans-serif',
  'var(--font-satisfy), Satisfy, cursive',
];

const CHARS        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&$@#%!?';
const TICK_MS      = 120;
const BASE_SIZE    = 160;
const MAGNET_RADIUS = 80;
const MAGNET_MAX   = 6;
const SPRING_CFG   = { stiffness: 200, damping: 20 } as const;


function randChars() {
  return (
    CHARS[Math.floor(Math.random() * CHARS.length)] +
    CHARS[Math.floor(Math.random() * CHARS.length)]
  );
}

function measureFontSizes(): number[] {
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d')!;
  const heights = FONTS.map(font => {
    ctx.font = `400 ${BASE_SIZE}px ${font}`;
    const m = ctx.measureText('me');
    return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  });
  const avg = heights.reduce((a, b) => a + b, 0) / heights.length;
  return heights.map(h => Math.round((avg / h) * BASE_SIZE));
}

// ─── Body copy ────────────────────────────────────────────────────────────────
const PRO_TEXT = `Before finding my way into design, I studied Theoretical Mathematics — and I brought its logic with me: the most elegant solution is rarely the first one.\n\nIn product design, every decision needs to hold up: does it work, does it serve the user, does it fit with the team's reality?\n"I like this" is not a reason I'll accept.`;

const FUN_TEXT = `By studying theoretical mathematics, I spent years asking questions with no obvious answers. And that's the job description for a product designer.\n\nI'm the designer who reads the brief twice, asks a lot of follow-up questions and isn't done until the entirety of the solution to a problem isn't carefully planned.`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const { mode } = useMode();
  const isPro = mode === 'professional';

  const [fontIndex, setFontIndex] = useState(0);
  const [display,   setDisplay]   = useState('me');
  const [opacity,   setOpacity]   = useState(1);
  const [fontSizes, setFontSizes] = useState<number[]>(
    new Array(FONTS.length).fill(BASE_SIZE)
  );

  // ── Mobile layout detection ─────────────────────────────────────────────────
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const isProRef       = useRef(isPro);
  const pausedRef      = useRef(false);   // hover pause
  const cyclingRef     = useRef(false);   // true = intersection says go
  const meInViewRef    = useRef(false);
  const tickRef        = useRef(0);
  const nextRestRef    = useRef(7);
  const elemRef        = useRef<HTMLParagraphElement>(null);   // motion.p (magnet)
  const meContainerRef = useRef<HTMLDivElement>(null);         // 200px div (observer)
  const fadeTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Magnet ─────────────────────────────────────────────────────────────────
  const mx      = useMotionValue(0);
  const my      = useMotionValue(0);
  const springX = useSpring(mx, SPRING_CFG);
  const springY = useSpring(my, SPRING_CFG);

  // ── Font measurement ────────────────────────────────────────────────────────
  useEffect(() => {
    document.fonts.ready.then(() => setFontSizes(measureFontSizes()));
  }, []);


  // ── Animation control ───────────────────────────────────────────────────────
  // Stop: 0.3s fade → Montserrat "me" (always, regardless of mode)
  const stopAnimation = useCallback(() => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    setOpacity(0);
    fadeTimerRef.current = setTimeout(() => {
      setFontIndex(0);
      setDisplay('me');
      setOpacity(1);
    }, 150);
  }, []);

  // Start fresh: reset tick counters — cyclingRef already flipped by caller
  const startAnimation = useCallback(() => {
    tickRef.current     = 0;
    nextRestRef.current = 7;
  }, []);

  // Helper: recalc whether we should be cycling right now
  const syncCycling = useCallback(() => {
    const should = meInViewRef.current;
    if (should && !cyclingRef.current) {
      cyclingRef.current = true;
      startAnimation();
    } else if (!should && cyclingRef.current) {
      cyclingRef.current = false;
      stopAnimation();
    }
  }, [startAnimation, stopAnimation]);

  // ── Mode sync ───────────────────────────────────────────────────────────────
  useEffect(() => {
    isProRef.current = isPro;
    // Only update display while actively cycling and not hovered
    if (cyclingRef.current && !pausedRef.current) {
      setDisplay(isPro ? 'me' : randChars());
    }
  }, [isPro]);

  // ── Cycling interval ────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (!cyclingRef.current || pausedRef.current) return;

      tickRef.current++;
      if (tickRef.current >= nextRestRef.current) {
        nextRestRef.current = tickRef.current + 6 + Math.floor(Math.random() * 3);
        return;
      }

      setFontIndex(prev => {
        let next = Math.floor(Math.random() * FONTS.length);
        if (next === prev) next = (next + 1) % FONTS.length;
        return next;
      });
      setDisplay(isProRef.current ? 'me' : randChars());
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  // ── Intersection observer: "me" container ───────────────────────────────────
  useEffect(() => {
    const el = meContainerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      meInViewRef.current = entry.intersectionRatio >= 0.5;
      syncCycling();
    }, { threshold: [0, 0.5] });
    obs.observe(el);
    return () => obs.disconnect();
  }, [syncCycling]);

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current); };
  }, []);

  // ── Hover handlers ──────────────────────────────────────────────────────────
  const handleMouseEnter = () => {
    pausedRef.current = true;
    // Fun mode + cycling active → crossfade random chars to "me"
    if (!isProRef.current && cyclingRef.current) {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      setOpacity(0);
      fadeTimerRef.current = setTimeout(() => {
        setDisplay('me');
        setOpacity(1);
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    pausedRef.current = false;
    mx.set(0);
    my.set(0);
    // Fun mode + cycling active → resume random chars
    if (!isProRef.current && cyclingRef.current) {
      setDisplay(randChars());
    }
    setOpacity(1);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = elemRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = e.clientX - cx;
    const dy   = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist < MAGNET_RADIUS) {
      const pull = (1 - dist / MAGNET_RADIUS) * MAGNET_MAX;
      mx.set((dx / dist) * pull);
      my.set((dy / dist) * pull);
    } else {
      mx.set(0);
      my.set(0);
    }
  };

  // ── Shared body text styles ──────────────────────────────────────────────────
  const bodyStyle = {
    fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
    fontWeight:    800,
    fontSize:      isMobileLayout ? '20px'  : '40px',
    lineHeight:    isMobileLayout ? '24px'  : '44px',
    letterSpacing: isMobileLayout ? '0.05em' : '0.05em',
    textTransform: 'uppercase' as const,
    color:         '#1A1A1A',
    textAlign:     'center' as const,
    margin:        0,
    whiteSpace:    'pre-line' as const,
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    // Outer: relative container. Dark block sticks; cream panel flows naturally
    // over the top of it as the user scrolls — no transforms needed.
    <div style={{ position: 'relative' }}>

      {/* ── SECTION 1 — Dark block (stays fixed while cream scrolls over it) ── */}
      <div
        style={{
          position:       'sticky',
          top:            0,
          height:         isMobileLayout ? '100svh' : '100vh',
          zIndex:         1,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        {/* Label — crossfades between modes (same 0.4s ease as body text) */}
        <div
          style={{
            position:     'relative',
            height:       isMobileLayout ? '16px' : '24px',
            width:        '100%',
            marginBottom: isMobileLayout ? 8 : 16,
          }}
        >
          {/* Professional */}
          <p
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    300,
              fontSize:      isMobileLayout ? '16px' : '24px',
              lineHeight:    isMobileLayout ? '16px' : '24px',
              letterSpacing: '0.1em',
              color:         '#B5A496',
              textTransform: 'uppercase',
              textAlign:     'center',
              margin:        0,
              userSelect:    'none',
              position:      'absolute',
              inset:         0,
              opacity:       isPro ? 1 : 0,
              transition:    'opacity 0.4s ease',
              pointerEvents: isPro ? 'auto' : 'none',
            }}
          >
            Some words about
          </p>

          {/* Fun */}
          <p
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    300,
              fontSize:      isMobileLayout ? '16px' : '24px',
              lineHeight:    isMobileLayout ? '16px' : '24px',
              letterSpacing: '0.1em',
              color:         '#B5A496',
              textTransform: 'uppercase',
              textAlign:     'center',
              margin:        0,
              userSelect:    'none',
              position:      'absolute',
              inset:         0,
              opacity:       isPro ? 0 : 1,
              transition:    'opacity 0.4s ease',
              pointerEvents: isPro ? 'none' : 'auto',
            }}
          >
            A story about
          </p>
        </div>

        {/* Fixed-height container — observed for intersection trigger */}
        <div
          ref={meContainerRef}
          style={{
            height:         isMobileLayout ? 156  : 200,
            width:          isMobileLayout ? 156  : '100%',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <motion.p
            ref={elemRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{
              fontFamily:  FONTS[fontIndex],
              fontWeight:  400,
              fontSize:    `${fontSizes[fontIndex]}px`,
              lineHeight:  1,
              color:       '#F2EAE3',
              textAlign:   'center',
              margin:      0,
              userSelect:  'none',
              cursor:      'default',
              opacity,
              x:           springX,
              y:           springY,
              transition:  'opacity 0.15s ease',
            }}
          >
            {display}
          </motion.p>
        </div>
      </div>

      {/* ── SECTION 2 — Cream panel (natural height = tallest text + top/bottom padding) */}
      <div
        style={{
          position:   'relative',
          zIndex:     2,
          background: '#F2EAE3',
          boxShadow:  '0 -8px 32px rgba(0,0,0,0.15)',
        }}
      >
        {/* Full-width wrapper — padding drives section height & text margins */}
        <div
          style={{
            position:      'relative',
            width:         '100%',
            boxSizing:     'border-box',
            paddingTop:    isMobileLayout ? 32  : 120,
            paddingBottom: isMobileLayout ? 32  : 120,
            paddingLeft:   isMobileLayout ? 32  : 120,
            paddingRight:  isMobileLayout ? 32  : 120,
          }}
        >
          {/* Professional text */}
          <p
            style={{
              ...bodyStyle,
              position:      'absolute',
              top:           isMobileLayout ? 32  : 120,
              left:          isMobileLayout ? 32  : 120,
              right:         isMobileLayout ? 32  : 120,
              opacity:       isPro ? 1 : 0,
              transition:    'opacity 0.4s ease',
              pointerEvents: isPro ? 'auto' : 'none',
            }}
          >
            {PRO_TEXT}
          </p>

          {/* Fun text */}
          <p
            style={{
              ...bodyStyle,
              position:      'absolute',
              top:           isMobileLayout ? 32  : 120,
              left:          isMobileLayout ? 32  : 120,
              right:         isMobileLayout ? 32  : 120,
              opacity:       isPro ? 0 : 1,
              transition:    'opacity 0.4s ease',
              pointerEvents: isPro ? 'none' : 'auto',
            }}
          >
            {FUN_TEXT}
          </p>

          {/* CSS-grid overlap spacers — wrapper sizes to max(pro height, fun height).
              Both paragraphs occupy the same grid cell so the cell = the taller one. */}
          <div style={{ display: 'grid' }}>
            <p aria-hidden style={{ ...bodyStyle, gridArea: '1 / 1 / 2 / 2', visibility: 'hidden', pointerEvents: 'none' }}>
              {PRO_TEXT}
            </p>
            <p aria-hidden style={{ ...bodyStyle, gridArea: '1 / 1 / 2 / 2', visibility: 'hidden', pointerEvents: 'none' }}>
              {FUN_TEXT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
