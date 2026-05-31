'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const isFinePointer = useRef(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Spring gives the cursor a slight drag — feels weighted, not robotic
  const x = useSpring(rawX, { stiffness: 520, damping: 32, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 520, damping: 32, mass: 0.4 });

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(pointer: fine)').matches;
    setMounted(true);

    if (!isFinePointer.current) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      const el = e.target as Element;
      const clickable = el.closest(
        'a, button, [role="button"], label, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      setIsPointer(!!clickable);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  if (!mounted || !isFinePointer.current) return null;

  return (
    // Outer div: moves with spring x/y (the "tracker")
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    >
      {/* Inner div: animates size/fill, centers itself */}
      <motion.div
        animate={{
          width: isPointer ? 32 : 12,
          height: isPointer ? 32 : 12,
          backgroundColor: isPointer
            ? 'rgba(242, 234, 227, 0.10)'
            : 'rgba(242, 234, 227, 0)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          translateX: '-50%',
          translateY: '-50%',
          borderRadius: '50%',
          border: '1.5px solid rgba(242, 234, 227, 0.7)',
        }}
      />
    </motion.div>
  );
}
