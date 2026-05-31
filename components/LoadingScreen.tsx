'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MIN_MS     = 2000;           // guaranteed minimum display time
const SESSION_KEY = 'gk-portfolio-loaded';

type Phase = 'counting' | 'exiting' | 'done';

export default function LoadingScreen() {
  // Start visible — avoids any flash of the dark site on first load
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('counting');
  const startRef          = useRef(0);
  const rafRef            = useRef(0);

  useEffect(() => {
    // On subsequent hard-refreshes within the same session, skip immediately
    if (sessionStorage.getItem(SESSION_KEY)) {
      setPhase('done');
      return;
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const t       = Math.min(elapsed / MIN_MS, 1); // 0 → 1 over MIN_MS

      // easeOutPower2.4 — fast early progress, decelerates toward 100%
      // Hits ~80% by the 1-second mark, then eases into 100%
      const eased   = 1 - Math.pow(1 - t, 2.4);

      // Never show 100 until time is truly up — keeps the "almost there" tension
      const display = t < 1
        ? Math.min(Math.floor(eased * 100), 99)
        : 100;

      setCount(display);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Brief hold at 100% so the user registers it, then slide out
        setTimeout(() => setPhase('exiting'), 150);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Persist the "seen" flag only after the exit animation finishes
  useEffect(() => {
    if (phase === 'done') sessionStorage.setItem(SESSION_KEY, '1');
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <motion.div
      // Slide from y=0 → y='-100%' during exit — reveals site below
      initial={{ y: 0 }}
      animate={{ y: phase === 'exiting' ? '-100%' : 0 }}
      transition={{
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1], // strong ease-in-out — slow start, fast middle, slow end
      }}
      onAnimationComplete={() => {
        if (phase === 'exiting') setPhase('done');
      }}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          99999,
        backgroundColor: '#F2EAE3',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        overflow:        'hidden',
      }}
    >
      <span
        style={{
          // Responsive from ~80px on small screens up to 340px at ≥1480px
          fontSize:            'clamp(80px, 23vw, 340px)',
          fontFamily:          'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight:          800,
          lineHeight:          1,
          color:               '#272727',
          // Tabular + lining figures — digits hold fixed widths so layout never shifts
          fontFeatureSettings: "'tnum' 1, 'lnum' 1",
          letterSpacing:       '-0.01em',
          userSelect:          'none',
        }}
      >
        {String(count).padStart(3, '0')}%
      </span>
    </motion.div>
  );
}
