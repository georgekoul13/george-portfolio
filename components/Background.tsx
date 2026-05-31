'use client';

import { useEffect, useRef } from 'react';

// ─── Minimal self-contained 2D Perlin noise ─────────────────────────────────
// Returns values in ≈ [−0.7, 0.7]. Permutation table seeded once at module load.
function buildNoiseFn() {
  const src = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const tmp = src[i]; src[i] = src[j]; src[j] = tmp;
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = src[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const g2 = (h: number, x: number, y: number) => {
    switch (h & 3) {
      case 0: return  x + y;
      case 1: return -x + y;
      case 2: return  x - y;
      default: return -x - y;
    }
  };

  return (x: number, y: number): number => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const a  = p[X]     + Y;
    const b  = p[X + 1] + Y;
    return lerp(
      lerp(g2(p[a],     xf,     yf),     g2(p[b],     xf - 1, yf),     u),
      lerp(g2(p[a + 1], xf,     yf - 1), g2(p[b + 1], xf - 1, yf - 1), u),
      v,
    );
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CANVAS_RES   = 200;    // internal canvas buffer — CSS stretches it to viewport
const NOISE_FREQ   = 3.5;    // noise cycles across canvas — larger = more features
const NOISE_SPEED  = 0.0005; // time increment per frame — very slow drift

const PRI_SIZE   = 550;   // px — primary glow radius
const SEC_SIZE   = 700;   // px — secondary glow radius (larger, more diffuse)
const PRI_LERP   = 0.08;  // primary follows cursor with this smoothing factor
const SEC_LERP   = 0.03;  // secondary lags further behind

const RIPPLE_THRESHOLD = 10;  // px movement per frame to trigger ripple
const RIPPLE_DURATION  = 0.6; // seconds

// ─── Component ────────────────────────────────────────────────────────────────
type RippleState = { x: number; y: number; age: number };

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const gradDiv = gradRef.current;
    if (!canvas || !gradDiv) return;

    // ── Canvas setup ──
    const ctx = canvas.getContext('2d')!;
    canvas.width  = CANVAS_RES;
    canvas.height = CANVAS_RES;

    const noise   = buildNoiseFn();
    const imgData = ctx.createImageData(CANVAS_RES, CANVAS_RES);
    const buf     = imgData.data;   // reused every frame — no alloc in loop

    // ── State (all mutable locals — no React state, no re-renders) ──
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;

    let targetX = cx, targetY = cy;   // raw cursor position
    let priX = cx,    priY = cy;      // primary glow (lerped)
    let secX = cx,    secY = cy;      // secondary glow (lerped)
    let prevX = cx,   prevY = cy;     // previous frame cursor — for velocity detection
    let ripple: RippleState | null = null;
    let lastTime = performance.now();
    let t = 0;
    let rafId: number;

    // ── Event listeners ──
    const onMouse = (e: MouseEvent) => { targetX = e.clientX; targetY = e.clientY; };
    const onTouch = (e: TouchEvent) => {
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    // ── Single RAF loop: noise + gradients + ripple ──
    const frame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // seconds, capped
      lastTime = now;
      t += NOISE_SPEED;

      // Gradient positions — lerp toward cursor / touch
      priX += (targetX - priX) * PRI_LERP;
      priY += (targetY - priY) * PRI_LERP;
      secX += (targetX - secX) * SEC_LERP;
      secY += (targetY - secY) * SEC_LERP;

      // Ripple — detect fast cursor movement (pixels moved this frame)
      const dist = Math.hypot(targetX - prevX, targetY - prevY);
      if (dist > RIPPLE_THRESHOLD && !ripple) {
        ripple = { x: targetX, y: targetY, age: 0 };
      }
      prevX = targetX; prevY = targetY;

      if (ripple) {
        ripple.age += dt;
        if (ripple.age >= RIPPLE_DURATION) ripple = null;
      }

      // ── Build gradient string — multi-stop falloff for feathered edges ──
      const glows: string[] = [
        // Primary — feathered: strong centre, tapers gently to transparent
        `radial-gradient(${PRI_SIZE}px circle at ${priX.toFixed(1)}px ${priY.toFixed(1)}px, rgba(70,70,70,0.22) 0%, rgba(70,70,70,0.10) 40%, rgba(70,70,70,0.02) 70%, transparent 100%)`,
        // Secondary — wide, very soft halo
        `radial-gradient(${SEC_SIZE}px circle at ${secX.toFixed(1)}px ${secY.toFixed(1)}px, rgba(55,55,55,0.14) 0%, rgba(55,55,55,0.05) 50%, transparent 100%)`,
      ];

      if (ripple) {
        const prog   = ripple.age / RIPPLE_DURATION;
        const alpha  = ((1 - prog) * (1 - prog) * 0.10).toFixed(3);
        const radius = (60 + prog * 320).toFixed(0);
        glows.push(
          `radial-gradient(${radius}px circle at ${ripple.x}px ${ripple.y}px, rgba(70,70,70,${alpha}) 0%, rgba(70,70,70,0) 70%, transparent 100%)`,
        );
      }
      gradDiv.style.backgroundImage = glows.join(', ');

      // ── Animate noise canvas ──
      // Drift direction: x moves right (+t), y moves up (−t) — diagonal drift
      let idx = 0;
      for (let y = 0; y < CANVAS_RES; y++) {
        const ny = (y / CANVAS_RES) * NOISE_FREQ - t * 0.22;
        for (let x = 0; x < CANVAS_RES; x++) {
          const nx = (x / CANVAS_RES) * NOISE_FREQ + t * 0.38;
          // Normalise Perlin output from ≈[−0.7,0.7] to [0,1]
          const n = (noise(nx, ny) / 0.707 + 1) * 0.5;
          // Map to 0-20 brightness range — stays very dark, just adds depth
          const v = (n * 12) | 0;
          buf[idx] = buf[idx + 1] = buf[idx + 2] = v;
          buf[idx + 3] = 255;
          idx += 4;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <>
      {/* Layer 0 — base dark fill */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundColor: '#1A1A1A' }}
      />

      {/* Layer 1 — cursor gradient glows, updated each frame via ref.
           z9998 + mix-blend-mode:screen puts this above all page content.
           Screen blend is invisible on light surfaces (cream panel, hover cards)
           and creates a pure neutral-grey lift on dark sections — no warm cast. */}
      <div
        ref={gradRef}
        aria-hidden="true"
        style={{
          position:     'fixed',
          inset:        0,
          zIndex:       9998,
          pointerEvents:'none',
          mixBlendMode: 'screen',
        }}
      />

      {/* Layer 2 — Perlin noise grain, same blend so grain only shows on dark. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position:     'fixed',
          inset:        0,
          width:        '100%',
          height:       '100%',
          zIndex:       9998,
          opacity:      0.10,
          pointerEvents:'none',
          mixBlendMode: 'screen',
          filter:       'blur(80px)',
        }}
      />
    </>
  );
}
