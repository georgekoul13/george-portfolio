'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface DraggableItemProps {
  /** Short label shown in the pill on hover/drag (e.g. "text-box", "image") */
  label:    string;
  /** Set true when fun mode is active */
  enabled:  boolean;
  children: React.ReactNode;
}

/**
 * Wraps any project-page section in a draggable container when fun mode is on.
 *
 * Hover  → grey border (#5c5957) + grey pill label (Figma node 164:5746)
 * Drag   → blue border (#048cd6) + blue pill label (Figma node 164:5751)
 *
 * Drag logic:
 *  - Pointer events + setPointerCapture for unified mouse/touch handling
 *  - Live delta written directly to DOM (no React re-render during drag)
 *  - Delta committed to state on release (stable through re-renders)
 *  - Delta is clamped so the element can NEVER leave the viewport —
 *    getBoundingClientRect() is captured at drag-start, deltas are clamped
 *    against (0, 0, innerWidth, innerHeight) throughout the gesture
 *  - Position resets when fun mode turns off
 */
export default function DraggableItem({ label, enabled, children }: DraggableItemProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Stable random float params — computed once on mount, no hydration mismatch
  const floatDuration = useRef(0);
  const floatDelay    = useRef(0);
  useEffect(() => {
    floatDuration.current = 2.4 + Math.random() * 1.8; // 2.4 – 4.2 s
    floatDelay.current    = Math.random() * 2.5;         // 0 – 2.5 s offset
  }, []);

  // Committed offset (React state — survives re-renders)
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Live drag refs — written on every pointermove, no React re-render during drag
  const liveDelta     = useRef({ x: 0, y: 0 });
  const pointerStart  = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Element bounds captured at drag-start — used for viewport clamping
  const initialRect = useRef<DOMRect | null>(null);

  // Separate state for rendering (border colour, cursor, z-index)
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered,  setIsHovered]  = useState(false);

  // ─── Clamp raw delta so element edges stay within viewport ────────────────
  const clamp = useCallback((rawDx: number, rawDy: number) => {
    const rect = initialRect.current;
    if (!rect) return { x: rawDx, y: rawDy };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      x: Math.max(-rect.left, Math.min(rawDx, vw - rect.right)),
      y: Math.max(-rect.top,  Math.min(rawDy, vh - rect.bottom)),
    };
  }, []);

  // ─── Write transform to DOM (skips React render cycle) ─────────────────────
  const flushTransform = useCallback(() => {
    if (!wrapRef.current) return;
    const x = offset.x + liveDelta.current.x;
    const y = offset.y + liveDelta.current.y;
    wrapRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [offset]);

  // ─── Pointer handlers ────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!enabled) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStart.current  = { x: e.clientX, y: e.clientY };
    liveDelta.current     = { x: 0, y: 0 };
    // Capture element's current viewport rect — clamping is relative to this
    initialRect.current   = wrapRef.current?.getBoundingClientRect() ?? null;
    isDraggingRef.current = true;
    setIsDragging(true);
  }, [enabled]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || !enabled) return;
    const raw = {
      x: e.clientX - pointerStart.current.x,
      y: e.clientY - pointerStart.current.y,
    };
    liveDelta.current = clamp(raw.x, raw.y);
    flushTransform();
  }, [enabled, clamp, flushTransform]);

  const onPointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    const { x: dx, y: dy } = liveDelta.current;
    liveDelta.current     = { x: 0, y: 0 };
    initialRect.current   = null;
    isDraggingRef.current = false;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setIsDragging(false);
  }, []);

  // ─── Reset when fun mode turns off ──────────────────────────────────────────
  useEffect(() => {
    if (!enabled) {
      isDraggingRef.current = false;
      liveDelta.current     = { x: 0, y: 0 };
      initialRect.current   = null;
      setOffset({ x: 0, y: 0 });
      setIsDragging(false);
      setIsHovered(false);
      if (wrapRef.current) wrapRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, [enabled]);

  // ─── Derived visual state ────────────────────────────────────────────────────
  const showUI = enabled && (isHovered || isDragging);
  const accent = isDragging ? '#048cd6' : '#5c5957';

  return (
    <div
      ref={wrapRef}
      style={{
        position:     'relative',
        border:       `1px solid ${showUI ? accent : 'transparent'}`,
        borderRadius: showUI ? '8px 8px 8px 0' : undefined,
        zIndex:       isDragging ? 100 : 'auto' as React.CSSProperties['zIndex'],
        cursor:       !enabled ? 'default' : isDragging ? 'grabbing' : 'grab',
        userSelect:   'none',
        touchAction:  enabled ? 'none' : 'auto',
        transform:    `translate(${offset.x}px, ${offset.y}px)`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => enabled && setIsHovered(true)}
      onMouseLeave={() => { if (!isDraggingRef.current) setIsHovered(false); }}
      onDragStart={e => e.preventDefault()}
    >
      {/* ── Float animation wrapper — separate from the drag transform ───────── */}
      <div
        style={{
          animation: (enabled && !isDragging && !isHovered)
            ? `draggableFloat ${floatDuration.current}s ease-in-out ${floatDelay.current}s infinite`
            : 'none',
        }}
      >
        {children}
      </div>

      {/* ── Pill label — attaches below bottom-left corner ───────────────────── */}
      {showUI && (
        <div
          style={{
            position:        'absolute',
            left:            '-1px',
            top:             'calc(100% - 1px)',
            backgroundColor: accent,
            padding:         '4px 8px',
            borderRadius:    '0 0 4px 4px',
            pointerEvents:   'none',
            zIndex:          10,
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    700,
              fontSize:      '8px',
              lineHeight:    '8px',
              color:         '#F2EAE3',
              letterSpacing: '0.16px',
              whiteSpace:    'nowrap',
              textTransform: 'lowercase',
              display:       'block',
            }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
