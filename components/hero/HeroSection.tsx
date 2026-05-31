'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useMode } from '@/context/ModeContext';
import { ArrowDown } from 'lucide-react';
import MagnetLetter from './MagnetLetter';

// ─── Illustrations that get a periodic 360° spin in fun mode ─────────────────
const SPIN_KEYS = new Set(['0-1', '1-5']);

// ─── Image map ────────────────────────────────────────────────────────────────
const IMG: Record<string, string> = {
  // Word 0 — GEORGE
  '0-0': '/images/letters/G.png',
  '0-1': '/images/letters/E.png',
  '0-2': '/images/letters/O1.png',
  '0-3': '/images/letters/R.png',
  '0-4': '/images/letters/G2.png',
  '0-5': '/images/letters/E-1.png',
  // Word 1 — KOULOURIS
  '1-0': '/images/letters/K.png',
  '1-1': '/images/letters/O2.png',
  '1-2': '/images/letters/U.png',
  '1-3': '/images/letters/L.png',
  '1-4': '/images/letters/O3.png',
  '1-5': '/images/letters/U2.png',
  '1-6': '/images/letters/R2.png',
  '1-7': '/images/letters/I.png',
  '1-8': '/images/letters/S.png',
};

const WORDS = ['GEORGE', 'KOULOURIS'] as const;

// ─── Font-size computation ────────────────────────────────────────────────────
const BASE_SIZE      = 1000;
const TARGET_FRAC    = 0.82;
const MAX_TEXT_WIDTH = 900;

function measureWordWidth(word: string): number {
  const el = document.createElement('span');
  el.textContent = word;
  Object.assign(el.style, {
    position:   'fixed',
    top:        '-9999px',
    left:       '-9999px',
    fontSize:   `${BASE_SIZE}px`,
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

function computeFontSize(word: string, targetWidth?: number): number {
  const baseW  = measureWordWidth(word);
  const target = targetWidth ?? Math.min(window.innerWidth * TARGET_FRAC, MAX_TEXT_WIDTH);
  return (target / baseW) * BASE_SIZE;
}

// ─── Screen-size type ─────────────────────────────────────────────────────────
type ScreenSize = 'mobile' | 'tablet' | 'desktop';

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { mode } = useMode();

  // Shared cursor / touch MotionValues — fed into every MagnetLetter
  const cursorX   = useMotionValue(0);
  const cursorY   = useMotionValue(0);
  const coordsRef = useRef<HTMLSpanElement>(null);  // direct DOM update (no re-render)

  const [fontSizes,  setFontSizes]  = useState<[number, number] | null>(null);
  // Pointer-type: true = coarse/touch (interactions differ: no hover magnet → touch magnet)
  const [isMobile,   setIsMobile]   = useState(false);
  // Width-based breakpoint: drives layout (padding, alignment, grid vs two-line)
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  // Athens local time — shown in mobile top bar right slot
  const [athensTime, setAthensTime] = useState('');

  // ── Detect pointer type (interaction tier) ──────────────────────────────────
  useEffect(() => {
    const mq      = window.matchMedia('(pointer: fine)');
    setIsMobile(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ── Width-based breakpoint (layout tier) ────────────────────────────────────
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

  // ── Font-size measurement ────────────────────────────────────────────────────
  // KOULOURIS (widest word) sets the shared scale for both words.
  // targetWidth is breakpoint-aware so names fit within the padded container.
  const computeSizes = useCallback(() => {
    const vw = window.innerWidth;
    let targetWidth: number;

    if (vw < 744) {
      // Mobile: 24 px padding each side → available = vw − 48
      targetWidth = vw - 48;
    } else if (vw < 1024) {
      // Tablet: 60 px padding each side → available = vw − 120
      targetWidth = vw - 120;
    } else {
      // Desktop: unchanged
      targetWidth = Math.min(vw * TARGET_FRAC, MAX_TEXT_WIDTH);
    }

    const fs = computeFontSize('KOULOURIS', targetWidth);
    setFontSizes([fs, fs]);
  }, []);

  useEffect(() => {
    document.fonts.ready.then(computeSizes);
    window.addEventListener('resize', computeSizes);
    return () => window.removeEventListener('resize', computeSizes);
  }, [computeSizes]);

  // ── Cursor tracking — desktop / tablet (pointer: fine) ──────────────────────
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (coordsRef.current) {
        const x = String(Math.round(e.clientX)).padStart(4, '0');
        const y = String(Math.round(e.clientY)).padStart(4, '0');
        coordsRef.current.textContent = `${x} × ${y}`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isMobile, cursorX, cursorY]);

  // ── Touch tracking — mobile (pointer: coarse) ───────────────────────────────
  // touchstart + touchmove: feed cursorX/Y so magnet springs fire immediately.
  // touchend: reset to −9999 so all letters are outside the radius and spring back.
  useEffect(() => {
    if (!isMobile) return;
    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      cursorX.set(t.clientX);
      cursorY.set(t.clientY);
    };
    const handleTouchEnd = () => {
      cursorX.set(-9999);
      cursorY.set(-9999);
    };
    window.addEventListener('touchstart',  handleTouch,    { passive: true });
    window.addEventListener('touchmove',   handleTouch,    { passive: true });
    window.addEventListener('touchend',    handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart',  handleTouch);
      window.removeEventListener('touchmove',   handleTouch);
      window.removeEventListener('touchend',    handleTouchEnd);
    };
  }, [isMobile, cursorX, cursorY]);

  // ── Scroll-direction nav reveal ─────────────────────────────────────────────
  useEffect(() => {
    const HIDE_THRESHOLD = 80;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < HIDE_THRESHOLD)          setNavVisible(true);
      else if (y > lastScrollY.current) setNavVisible(false);
      else                              setNavVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Athens time clock — mobile top bar right slot ───────────────────────────
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

  // ── Scroll button arrow nudge ────────────────────────────────────────────────
  const arrowRef = useRef<HTMLSpanElement>(null);
  const onScrollHover = () => {
    if (!arrowRef.current) return;
    animate(arrowRef.current, { y: [0, 5, 0] }, { duration: 0.4, ease: 'easeInOut' });
  };

  // ── Derived layout values ────────────────────────────────────────────────────
  const isMobileLayout  = screenSize === 'mobile';
  const isTabletLayout  = screenSize === 'tablet';

  // topOffset: how far from the top the fixed nav bar sits
  const topOffset     = isMobileLayout ? 32 : 60;
  // barPad: left/right offset of the fixed top bar (GK. + right slot)
  const barPad        = isMobileLayout ? 24 : isTabletLayout ? 60 : 120;
  // namePad: left/right padding of the name / subtitle content block
  const namePad       = isMobileLayout ? 24 : isTabletLayout ? 60 : 120;
  // subtitleSize: font size of the role subtitle
  const subtitleSize  = isMobileLayout ? 14 : 24;
  // scrollBtnSize: diameter of the bottom scroll-indicator circle
  const scrollBtnSize = isMobileLayout ? 48 : 72;

  return (
    <section
      style={{
        position:       'relative',
        // 100svh on mobile so the layout fits within the visible browser viewport
        // (excludes iOS Safari chrome); 100vh on larger screens where this isn't an issue
        height:         isMobileLayout ? '100svh' : '100vh',
        minHeight:      isMobileLayout ? '100svh' : '100vh',
        width:          '100%',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
      }}
    >
      {/* ── Top bar — fixed, slides off/on with scroll direction ───────────── */}
      <motion.div
        animate={{ y: navVisible ? 0 : -(topOffset + 60) }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position:       'fixed',
          top:            topOffset,
          left:           barPad,
          right:          barPad,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          zIndex:         100,
          pointerEvents:  navVisible ? 'auto' : 'none',
        }}
      >
        {/* Logo mark */}
        <img
          src="/logo.svg"
          alt="GK."
          style={{ height: 32, width: 'auto', display: 'block' }}
        />

        {/* Right slot: Athens time on mobile, cursor coords on desktop/tablet */}
        {isMobileLayout ? (
          <span
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 400,
              fontSize:   16,
              color:      '#F2EAE3',
              userSelect: 'none' as const,
              lineHeight: 1,
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
              letterSpacing:      '0.04em',
              color:              '#F2EAE3',
              userSelect:         'none' as const,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            0000 × 0000
          </span>
        )}
      </motion.div>

      {/* ── Name typography ─────────────────────────────────────────────────── */}
      {fontSizes && (
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            width:         '100%',
            // Desktop/tablet use a max-width cap; mobile fills the viewport
            maxWidth:      isMobileLayout ? undefined : (mode === 'fun' ? 1000 : 900),
            paddingLeft:   namePad,
            paddingRight:  namePad,
            boxSizing:     'border-box' as const,
          }}
        >
          {/* ── Subtitle ── */}
          <p
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    300,
              fontSize:      subtitleSize,
              lineHeight:    `${subtitleSize}px`,
              letterSpacing: '0.1em',
              color:         '#B5A496',
              textTransform: 'uppercase' as const,
              textAlign:     'center' as const,
              userSelect:    'none' as const,
              margin:        0,
              marginBottom:  isMobileLayout ? 19 : 24,
            }}
          >
            {mode === 'fun' ? 'Professional Over-thinker' : 'Product Designer'}
          </p>

          {/* ── Two-line name layout — all breakpoints, all modes ── */}
          {WORDS.map((word, wi) => (
            <div
              key={word}
              style={{
                display:       'flex',
                fontSize:      `${fontSizes[wi]}px`,
                fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight:    500,
                lineHeight:    0.88,
                color:         '#F2EAE3',
                overflow:      'visible',
                textTransform: 'uppercase' as const,
              }}
            >
              {word.split('').map((char, ci) => (
                <MagnetLetter
                  key={`${wi}-${ci}`}
                  char={char}
                  imgSrc={IMG[`${wi}-${ci}`]}
                  fontSize={fontSizes[wi]}
                  mode={mode}
                  isMobile={isMobile}
                  cursorX={cursorX}
                  cursorY={cursorY}
                  // GEORGE (6 letters) — light overlap; KOULOURIS (9) — tight
                  overlapFactor={wi === 0 ? 0.22 : 0.35}
                  letterIndex={ci}
                  canSpin={SPIN_KEYS.has(`${wi}-${ci}`)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Scroll indicator ─────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        onHoverStart={onScrollHover}
        style={{
          marginTop:      isMobileLayout ? 40 : 32,
          width:          scrollBtnSize,
          height:         scrollBtnSize,
          borderRadius:   '50%',
          border:         '1.5px solid #444240',
          background:     'transparent',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        0,
          flexShrink:     0,
        }}
        whileHover={{ borderColor: '#F2EAE3' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        aria-label="Scroll to next section"
      >
        <span ref={arrowRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowDown size={isMobileLayout ? 16 : 20} color="#F2EAE3" strokeWidth={1.5} />
        </span>
      </motion.button>
    </section>
  );
}
