'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/context/ModeContext';

const SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const;

// ─── Faces — exported SVG assets ─────────────────────────────────────────────
/* eslint-disable @next/next/no-img-element */
function MehFace() {
  return <img src="/images/icons/toggle/MEH.svg" width={32} height={32} alt="" />;
}

function YesFace() {
  return <img src="/images/icons/toggle/YES.svg" width={32} height={32} alt="" />;
}
/* eslint-enable @next/next/no-img-element */

// ─── Toggle ───────────────────────────────────────────────────────────────────
export default function ModeToggle() {
  const { mode, toggleMode } = useMode();
  const isPro = mode === 'professional';

  // Width-based breakpoint — mobile needs more bottom clearance (32px vs 24px)
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Hide toggle when footer is in the viewport (user has scrolled to the last section)
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      // Footer starts at (docHeight − viewportHeight) from the top.
      // We hide the toggle as soon as the footer enters from the bottom.
      const scrollBottom = window.scrollY + window.innerHeight;
      setFooterVisible(scrollBottom > document.body.scrollHeight - window.innerHeight);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position:  'fixed',
        bottom:    isMobileLayout ? 32 : 24,
        left:      '50%',
        transform: 'translateX(-50%)',
        zIndex:    9999,
      }}
    >
      {/* Vertical slide — separates from the horizontal centering transform above */}
      <motion.div
        animate={{ y: footerVisible ? 150 : 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
      <button
        onClick={toggleMode}
        aria-label={`Switch to ${isPro ? 'fun' : 'professional'} mode`}
        style={{
          position:        'relative',
          width:           96,
          height:          50,
          backgroundColor: '#444240',
          borderRadius:    100,
          border:          'none',
          padding:         0,
          outline:         'none',
          cursor:          'pointer',
          display:         'block',
          boxShadow:       '0px 1px 1px rgba(0,0,0,0.10), 0px 3px 3px rgba(0,0,0,0.09), 0px 6px 4px rgba(0,0,0,0.05), 0px 11px 4px rgba(0,0,0,0.01), 0px 17px 5px rgba(0,0,0,0)',
        }}
      >
        {/* Inner dark pill — sits above the outer #444240 bg */}
        <div
          style={{
            position:        'absolute',
            top: 1, left: 1, right: 1, bottom: 1,
            backgroundColor: '#1F1F1F',
            borderRadius:    1000,
            pointerEvents:   'none',
          }}
        />

        {/* YES face — left slot (left:12, top:9), fades in when fun */}
        <motion.div
          animate={{ opacity: isPro ? 0 : 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ position: 'absolute', left: 12, top: 9, pointerEvents: 'none' }}
        >
          <YesFace />
        </motion.div>

        {/* MEH face — right slot (left:50, top:9), fades in when professional */}
        <motion.div
          animate={{ opacity: isPro ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ position: 'absolute', left: 50, top: 9, pointerEvents: 'none' }}
        >
          <MehFace />
        </motion.div>

        {/* Sliding knob — springs between left:8 (pro) and left:56 (fun) */}
        <motion.div
          animate={{ x: isPro ? 8 : 56 }}
          transition={SPRING}
          style={{
            position:     'absolute',
            top:          9,
            left:         0,
            width:        32,
            height:       32,
            borderRadius: '50%',
            background:   'radial-gradient(circle, rgba(242,234,227,0.15) 0%, rgba(242,234,227,0.05) 100%)',
            border:       '1px solid rgba(242,234,227,0.10)',
            pointerEvents: 'none',
          }}
        />
      </button>
      </motion.div>
    </div>
  );
}
