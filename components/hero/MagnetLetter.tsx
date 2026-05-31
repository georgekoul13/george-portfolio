'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, animate, type MotionValue } from 'framer-motion';

// ─── Magnet constants (desktop / tablet) ──────────────────────────────────────
const MAGNET_RADIUS_DESKTOP = 120;
const MAX_SHIFT_DESKTOP     = 8;

// ─── Mobile magnet constants (touch) — stronger pull ─────────────────────────
const MAGNET_RADIUS_MOBILE  = 160;
const MAX_SHIFT_MOBILE      = 16;

const SPRING_CFG = { stiffness: 200, damping: 20, mass: 0.5 };

// ─── Flip constants ───────────────────────────────────────────────────────────
const FLIP_HALF = 0.2;   // seconds per half-flip
const STAGGER   = 0.04;  // seconds between consecutive letters

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  char:           string;
  imgSrc?:        string;
  fontSize:       number;
  mode:           'professional' | 'fun';
  isMobile:       boolean;
  cursorX:        MotionValue<number>;
  cursorY:        MotionValue<number>;
  overlapFactor?: number;
  letterIndex:    number;
  canSpin?:       boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MagnetLetter({
  char, imgSrc, fontSize, mode, isMobile, cursorX, cursorY,
  overlapFactor = 0.2, letterIndex, canSpin = false,
}: Props) {
  const ref             = useRef<HTMLSpanElement>(null);
  const textRef         = useRef<HTMLSpanElement>(null);
  const imgContainerRef = useRef<HTMLSpanElement>(null);

  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const springX = useSpring(rawX, SPRING_CFG);
  const springY = useSpring(rawY, SPRING_CFG);

  const isFirstRender = useRef(true);

  // Stable random idle values — computed once per mount
  const idle = useRef({
    floatY:   4 + Math.random() * 2,
    rotate:   (Math.random() - 0.5) * 6,
    duration: 2 + Math.random() * 2,
    delay:    Math.random() * 3,
  });

  // ── showImg — purely mode-driven, no tap toggle ──────────────────────────────
  // Mobile fun mode = same as desktop fun mode: illustrations always visible.
  // Tapping a letter does nothing on any breakpoint.
  const showImg = !!imgSrc && mode === 'fun';

  // Snapshot at mount for the `initial` Framer Motion prop (avoids flash)
  const initialShowImg = useRef(showImg);

  // ── Magnet effect — runs on all devices ─────────────────────────────────────
  // Desktop / tablet: fed by mousemove events in HeroSection
  // Mobile:           fed by touchstart + touchmove events in HeroSection
  //                   (touchend resets cursorX/Y to −9999 → springs release)
  // Mobile uses a larger radius (160 px) and stronger pull (16 px max)
  // to compensate for finger-sized touch targets and no hover affordance.
  useEffect(() => {
    const radius   = isMobile ? MAGNET_RADIUS_MOBILE  : MAGNET_RADIUS_DESKTOP;
    const maxShift = isMobile ? MAX_SHIFT_MOBILE       : MAX_SHIFT_DESKTOP;

    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = cursorX.get() - cx;
      const dy   = cursorY.get() - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < radius) {
        const strength = 1 - dist / radius;
        rawX.set((dx / dist) * strength * maxShift);
        rawY.set((dy / dist) * strength * maxShift);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    const unsubX = cursorX.on('change', update);
    const unsubY = cursorY.on('change', update);
    return () => { unsubX(); unsubY(); };
  }, [isMobile, cursorX, cursorY, rawX, rawY]);

  // Reset spring when mode changes (clears stale offsets)
  useEffect(() => { rawX.set(0); rawY.set(0); }, [mode, rawX, rawY]);

  // ── Card-flip transition ────────────────────────────────────────────────────
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delay = letterIndex * STAGGER;

    if (showImg) {
      if (textRef.current) {
        animate(textRef.current, { rotateY: 90, opacity: 0 },
          { delay, duration: FLIP_HALF, ease: 'easeIn' });
      }
      if (imgContainerRef.current) {
        animate(imgContainerRef.current, { rotateY: [-90, 0], opacity: 1 },
          { delay: delay + FLIP_HALF, duration: FLIP_HALF, ease: 'easeOut' });
      }
    } else {
      if (imgContainerRef.current) {
        animate(imgContainerRef.current, { rotateY: 90, opacity: 0 },
          { delay, duration: FLIP_HALF, ease: 'easeIn' });
      }
      if (textRef.current) {
        animate(textRef.current, { rotateY: [-90, 0], opacity: 1 },
          { delay: delay + FLIP_HALF, duration: FLIP_HALF, ease: 'easeOut' });
      }
    }
  }, [showImg, letterIndex]);

  // ── Periodic 360° spin (desktop only, canSpin letters, fun mode) ─────────────
  useEffect(() => {
    if (!canSpin || mode !== 'fun' || isMobile || !imgSrc) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let active = true;

    const scheduleNextSpin = () => {
      timeoutId = setTimeout(() => {
        if (!active || !imgContainerRef.current) return;
        animate(imgContainerRef.current, { rotate: [0, 360] },
          { duration: 0.5, ease: 'easeInOut' })
          .then(() => { if (active) scheduleNextSpin(); });
      }, 3000 + Math.random() * 3000);
    };

    scheduleNextSpin();
    return () => { active = false; clearTimeout(timeoutId); };
  }, [canSpin, mode, isMobile, imgSrc]);

  // ── Idle floating / tilt (desktop fun mode only) ────────────────────────────
  const inFunMode   = mode === 'fun' && !isMobile;
  const idleAnimate = inFunMode
    ? { y: [0, -idle.current.floatY, 0], rotate: [0, idle.current.rotate, 0] }
    : { y: 0, rotate: 0 };
  const idleTx = inFunMode
    ? { duration: idle.current.duration, delay: idle.current.delay,
        repeat: Infinity, ease: 'easeInOut' as const }
    : { duration: 0.3 };

  return (
    <motion.span
      animate={idleAnimate}
      transition={idleTx}
      style={{ display: 'inline-flex', verticalAlign: 'middle' }}
    >
      {/* Magnet span — spring displacement + slot sizing */}
      <motion.span
        ref={ref}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          justifyContent: 'center',
          position:       'relative',
          width:          showImg ? fontSize : 'auto',
          height:         fontSize,
          marginRight:    showImg ? -fontSize * overlapFactor : 0,
          perspective:    '800px' as unknown as number,
          x:              springX,
          y:              springY,
        }}
        // No onClick — tap-to-swap is removed on all breakpoints
      >
        {/* Text character */}
        <motion.span
          ref={textRef}
          style={{ display: 'block', userSelect: 'none', transformOrigin: 'center' }}
          initial={{
            rotateY: initialShowImg.current ? 90 : 0,
            opacity: initialShowImg.current ? 0  : 1,
          }}
        >
          {char}
        </motion.span>

        {/* Letter illustration */}
        {imgSrc && (
          <motion.span
            ref={imgContainerRef}
            aria-hidden
            style={{
              position:        'absolute',
              inset:           0,
              display:         'block',
              pointerEvents:   'none',
              transformOrigin: 'center',
            }}
            initial={{
              rotateY: initialShowImg.current ? 0   : -90,
              opacity: initialShowImg.current ? 1   : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={char}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </motion.span>
        )}
      </motion.span>
    </motion.span>
  );
}
