'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMode } from '@/context/ModeContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrbitEl {
  id:       string;
  src:      string;
  slug:     string;
  group:    string;
  rotation: number;
  height:   number;
}

// ─── Orbit element data ───────────────────────────────────────────────────────
const orbitElements: OrbitEl[] = [
  { id: 'gaspar-1',  src: '/images/projects/orbit/gaspar-ai-1.png',              slug: 'gaspar-ai',               group: 'gaspar-ai',               rotation: -8,  height:  40 },
  { id: 'gaspar-2',  src: '/images/projects/orbit/gaspar-ai-2.png',              slug: 'gaspar-ai',               group: 'gaspar-ai',               rotation:  5,  height:  80 },
  { id: 'gaspar-3',  src: '/images/projects/orbit/gaspar-ai-3.png',              slug: 'gaspar-ai',               group: 'gaspar-ai',               rotation: -3,  height:  80 },
  { id: 'mask-1',    src: '/images/projects/orbit/Mask group.png',               slug: 'gaspar-ai',               group: 'gaspar-ai',               rotation:  4,  height:  80 },
  { id: 'piraeus-1', src: '/images/projects/orbit/piraeus-1.png',                slug: 'piraeus-insurance',       group: 'piraeus',                 rotation:  4,  height:  40 },
  { id: 'piraeus-2', src: '/images/projects/orbit/piraeus-2.png',                slug: 'piraeus-insurance',       group: 'piraeus',                 rotation: -6,  height:  64 },
  { id: 'piraeus-3', src: '/images/projects/orbit/piraeus-3.png',                slug: 'piraeus-insurance',       group: 'piraeus',                 rotation:  8,  height:  64 },
  { id: 'ins-1',     src: '/images/projects/orbit/insurance-product-1.png',      slug: 'wallbid',                 group: 'wallbid',                 rotation: -5,  height:  64 },
  { id: 'ins-2',     src: '/images/projects/orbit/insurance-product-2.png',      slug: 'wallbid',                 group: 'wallbid',                 rotation:  7,  height: 100 },
  { id: 'ins-3',     src: '/images/projects/orbit/insurance-product-3.png',      slug: 'wallbid',                 group: 'wallbid',                 rotation: -9,  height: 100 },
  { id: 'cw-1',      src: '/images/projects/orbit/cancellation-wallet-1.png',    slug: 'cancellation-wallet',     group: 'cancellation-wallet',     rotation:  6,  height:  64 },
  { id: 'cw-2',      src: '/images/projects/orbit/cancellation-wallet-2.png',    slug: 'cancellation-wallet',     group: 'cancellation-wallet',     rotation: -4,  height:  64 },
  { id: 'cw-3',      src: '/images/projects/orbit/cancellation-wallet-3.png',    slug: 'cancellation-wallet',     group: 'cancellation-wallet',     rotation: 10,  height:  64 },
  { id: 'cyber-1',   src: '/images/projects/orbit/cybersential-1.png',           slug: 'cybersential',            group: 'cybersential',            rotation: -7,  height:  64 },
  { id: 'cyber-2',   src: '/images/projects/orbit/cybersential-2.png',           slug: 'cybersential',            group: 'cybersential',            rotation:  5,  height:  64 },
  { id: 'banca-1',   src: '/images/projects/orbit/bancasure360-1.png',           slug: 'wallbid',                 group: 'wallbid',                 rotation:  8,  height:  64 },
  { id: 'banca-2',   src: '/images/projects/orbit/bancasure360-2.png',           slug: 'wallbid',                 group: 'wallbid',                 rotation: -6,  height:  64 },
  { id: 'mood-1',    src: '/images/projects/orbit/mood-1.png',                   slug: 'mood',                    group: 'mood',                    rotation: -3,  height:  40 },
  { id: 'mood-2',    src: '/images/projects/orbit/mood-2.png',                   slug: 'mood',                    group: 'mood',                    rotation:  7,  height: 100 },
  { id: 'mood-3',    src: '/images/projects/orbit/mood-3.png',                   slug: 'mood',                    group: 'mood',                    rotation: -9,  height: 100 },
  { id: 'mood-4',    src: '/images/projects/orbit/mood-4.png',                   slug: 'mood',                    group: 'mood',                    rotation:  4,  height: 100 },
  { id: 'ist-1',     src: '/images/projects/orbit/istorima-1.png',               slug: 'holy-projects',           group: 'istorima',                rotation: -5,  height:  64 },
  { id: 'ist-2',     src: '/images/projects/orbit/istorima-2.png',               slug: 'holy-projects',           group: 'istorima',                rotation:  8,  height:  64 },
  { id: 'ben-1',     src: '/images/projects/orbit/benefit-1.png',                slug: 'holy-projects',           group: 'benefit',                 rotation:  6,  height:  64 },
  { id: 'ben-2',     src: '/images/projects/orbit/benefit-2.png',                slug: 'holy-projects',           group: 'benefit',                 rotation: -4,  height: 100 },
  { id: 'music-1',   src: '/images/projects/orbit/music-festivals-1.png',        slug: 'creative-projects',       group: 'creative-projects',       rotation: -8,  height: 100 },
  { id: 'music-2',   src: '/images/projects/orbit/music-festivals-2.png',        slug: 'creative-projects',       group: 'creative-projects',       rotation:  5,  height: 100 },
  { id: 'music-3',   src: '/images/projects/orbit/music-festivals-3.png',        slug: 'creative-projects',       group: 'creative-projects',       rotation: -3,  height: 100 },
  { id: 'music-4',   src: '/images/projects/orbit/music-festivals-4.png',        slug: 'creative-projects',       group: 'creative-projects',       rotation:  9,  height: 100 },
  { id: 'book-1',    src: '/images/projects/orbit/book-cover-1.png',             slug: 'book-cover',              group: 'book-cover',              rotation: -6,  height: 100 },
  { id: 'book-2',    src: '/images/projects/orbit/book-cover-2.png',             slug: 'book-cover',              group: 'book-cover',              rotation:  4,  height:  80 },
  { id: 'book-3',    src: '/images/projects/orbit/book-cover-3.png',             slug: 'book-cover',              group: 'book-cover',              rotation: -9,  height:  80 },
  { id: 'book-4',    src: '/images/projects/orbit/book-cover-4.png',             slug: 'book-cover',              group: 'book-cover',              rotation:  7,  height:  80 },
  { id: 'book-5',    src: '/images/projects/orbit/book-cover-5.png',             slug: 'book-cover',              group: 'book-cover',              rotation: -3,  height:  80 },
  { id: 'logo-1',    src: '/images/projects/orbit/logo-designs-1.png',           slug: 'logo-designs',            group: 'logo-designs',            rotation:  5,  height:  64 },
  { id: 'logo-2',    src: '/images/projects/orbit/logo-designs-2.png',           slug: 'logo-designs',            group: 'logo-designs',            rotation: -7,  height:  64 },
  { id: 'logo-3',    src: '/images/projects/orbit/logo-designs-3.png',           slug: 'logo-designs',            group: 'logo-designs',            rotation:  8,  height:  64 },
  { id: 'psych-1',   src: '/images/projects/orbit/psychologist-branding-1.png',  slug: 'psychologist-branding',   group: 'psychologist-branding',   rotation: -4,  height:  80 },
  { id: 'psych-2',   src: '/images/projects/orbit/psychologist-branding-2.png',  slug: 'psychologist-branding',   group: 'psychologist-branding',   rotation:  6,  height:  64 },
  { id: 'psych-3',   src: '/images/projects/orbit/psychologist-branding-3.png',  slug: 'psychologist-branding',   group: 'psychologist-branding',   rotation: -8,  height:  64 },
  { id: 'psych-4',   src: '/images/projects/orbit/psychologist-branding-4.png',  slug: 'psychologist-branding',   group: 'psychologist-branding',   rotation:  3,  height:  64 },
  { id: 'ill-1',     src: '/images/projects/orbit/illustrations-1.png',          slug: 'creative-projects',       group: 'creative-projects',       rotation: -6,  height: 100 },
  { id: 'ill-2',     src: '/images/projects/orbit/illustrations-2.png',          slug: 'creative-projects',       group: 'creative-projects',       rotation:  8,  height: 100 },
  { id: 'ill-3',     src: '/images/projects/orbit/illustrations-3.png',          slug: 'creative-projects',       group: 'creative-projects',       rotation: -3,  height: 100 },
  { id: 'ill-4',     src: '/images/projects/orbit/illustrations-4.png',          slug: 'creative-projects',       group: 'creative-projects',       rotation:  5,  height: 100 },
  { id: 'ill-5',     src: '/images/projects/orbit/illustrations-5.png',          slug: 'creative-projects',       group: 'creative-projects',       rotation: -9,  height: 100 },
  { id: 'type-1',    src: '/images/projects/orbit/custom-typefaces-1.png',       slug: 'custom-typefaces',        group: 'custom-typefaces',        rotation:  7,  height:  80 },
  { id: 'type-2',    src: '/images/projects/orbit/custom-typefaces-2.png',       slug: 'custom-typefaces',        group: 'custom-typefaces',        rotation: -5,  height:  80 },
];

// ─── Deterministic shuffle (seed 42) ─────────────────────────────────────────
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s   = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const shuffledElements = seededShuffle(orbitElements, 42);

// ─── Deterministic random (LCG) ───────────────────────────────────────────────
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}

// ─── Rectangle overlap check ──────────────────────────────────────────────────
interface Rect { x: number; y: number; w: number; h: number }
function rectsOverlap(a: Rect, b: Rect, gap: number): boolean {
  return (
    a.x < b.x + b.w + gap &&
    a.x + a.w + gap > b.x &&
    a.y < b.y + b.h + gap &&
    a.y + a.h + gap > b.y
  );
}

// ─── Ring-scatter layout (desktop / tablet) ───────────────────────────────────
function computeScatter(
  refs: (HTMLDivElement | null)[],
  vw:   number,
  vh:   number,
): { ox: number; oy: number }[] {
  const rand    = seededRand(99);
  const N       = refs.length;
  const PADDING = 20;
  const EL_GAP  = -20;
  const cx   = vw / 2;
  const cy   = vh / 2;
  const RX   = vw * 0.42;
  const RY   = vh * 0.38;
  const step = (2 * Math.PI) / N;
  const placed: Rect[] = [];

  return refs.map((ref, i) => {
    const elW = ref?.offsetWidth  || 80;
    const elH = ref?.offsetHeight || 64;
    const baseAngle = (i / N) * 2 * Math.PI;
    let bestOx = PADDING, bestOy = PADDING;

    for (let attempt = 0; attempt < 100; attempt++) {
      const aJitter = (rand() - 0.5) * step * 0.9;
      const rFactor = 0.82 + rand() * 0.46;
      const angle   = baseAngle + aJitter;
      const rawX    = cx + Math.cos(angle) * RX * rFactor - elW / 2;
      const rawY    = cy + Math.sin(angle) * RY * rFactor - elH / 2;
      const ox      = Math.max(PADDING, Math.min(vw - elW - PADDING, rawX));
      const oy      = Math.max(PADDING, Math.min(vh - elH - PADDING, rawY));
      if (attempt === 0) { bestOx = ox; bestOy = oy; }
      const r: Rect = { x: ox, y: oy, w: elW, h: elH };
      if (!placed.some((p) => rectsOverlap(r, p, EL_GAP))) {
        placed.push(r);
        return { ox, oy };
      }
    }
    placed.push({ x: bestOx, y: bestOy, w: elW, h: elH });
    return { ox: bestOx, oy: bestOy };
  });
}

// ─── Per-element idle float params (fun mode desktop, seed 77) ───────────────
interface IdleParams {
  floatX: number; floatY: number; floatRot: number;
  speedX: number; speedY: number; speedRot: number;
  phaseX: number; phaseY: number; phaseRot: number;
}
const idleParams: IdleParams[] = (() => {
  const rand = seededRand(77);
  return shuffledElements.map(() => ({
    floatX:   3  + rand() * 5,
    floatY:   4  + rand() * 7,
    floatRot: (rand() - 0.5) * 8,
    speedX:   0.00025 + rand() * 0.00035,
    speedY:   0.00025 + rand() * 0.00035,
    speedRot: 0.00015 + rand() * 0.00025,
    phaseX:   rand() * Math.PI * 2,
    phaseY:   rand() * Math.PI * 2,
    phaseRot: rand() * Math.PI * 2,
  }));
})();

// ─── Per-element reveal delays — one-by-one stagger (30 ms apart) ─────────────
// shuffledElements is already in a random visual order, so index i ≡ reveal rank i.
const REVEAL_STAGGER_MS = 30;
const revealDelays: number[] = shuffledElements.map((_, i) => i * (REVEAL_STAGGER_MS / 1000));

// ─── Title text ───────────────────────────────────────────────────────────────
const TEXT    = 'MY PROJECTS';
const LETTERS = TEXT.split('');

// ─── Orbit constants ──────────────────────────────────────────────────────────
const ORBIT_STEP = (2 * Math.PI) / (60 * 60);
const RX_FRAC    = 0.44;
const RY_FRAC    = 0.18;
const TILT       = Math.PI / 8;

// ─── Mobile: Mac desktop–style file layout ───────────────────────────────────

// Group → human-readable project name shown beneath each thumbnail
const GROUP_LABELS: Record<string, string> = {
  'gaspar-ai':             'Gaspar AI',
  'piraeus':               'Piraeus Insurance',
  'wallbid':               'Wallbid',
  'cancellation-wallet':   'Cancellation Wallet',
  'cybersential':          'Cybersential',
  'mood':                  'Mood',
  'istorima':              'Istorima',
  'benefit':               'Benefit',
  'book-cover':            'Book Cover',
  'logo-designs':          'Logo Designs',
  'psychologist-branding': 'Psychologist Branding',
  'creative-projects':     'Creative Projects',
  'custom-typefaces':      'Custom Typefaces',
};

// Scatter canvas height (px)
const MOBILE_SCATTER_H = 900;

// Pre-computed % positions — stable across renders, no resize listener needed.
// Uses a 4-col × 12-row loose grid with ±20 % jitter so the layout reads as
// organised rows/columns while elements still slightly overlap — like a tidy
// but casual Mac desktop.  Calibrated on a 390 px reference width.
interface MobileFilePos { x: number; y: number; rotation: number; }

const mobileFilePositions: MobileFilePos[] = (() => {
  const rand      = seededRand(314);
  const COLS      = 4;
  const N         = shuffledElements.length;                    // 47
  const REF_W     = 390;
  const EL_W      = 100;   // max thumbnail width  (px)
  const EL_H      = 130;   // thumbnail + label    (px)
  const xMinPct   = (8    / REF_W) * 100;                      // ≈  2.05 %
  const xMaxPct   = ((REF_W - 8 - EL_W) / REF_W) * 100;       // ≈ 72.31 %
  const usablePct = xMaxPct - xMinPct;                          // ≈ 70.26 %
  const cellWPct  = usablePct / COLS;                           // ≈ 17.56 %
  const yMaxPct   = ((MOBILE_SCATTER_H - EL_H) / MOBILE_SCATTER_H) * 100; // ≈ 85.56 %
  const fullRows  = Math.floor(N / COLS);                       // 11
  const lastRowN  = N % COLS;                                   // 3
  const totalRows = fullRows + (lastRowN > 0 ? 1 : 0);         // 12
  const cellHPct  = yMaxPct / totalRows;                        // ≈  7.13 %

  return shuffledElements.map((_, i) => {
    const row       = Math.floor(i / COLS);
    const isLastRow = lastRowN > 0 && row === fullRows;
    let col: number;
    if (!isLastRow) {
      col = i % COLS;
    } else {
      // Spread the 3 last-row elements evenly across all 4 columns
      const j = i - fullRows * COLS;
      col = Math.round(j * (COLS - 1) / (lastRowN - 1));
    }

    // Anchor on cell centres — both axes
    const cellCenterPct = xMinPct + (col + 0.5) * cellWPct;
    const cellMidYPct   = (row + 0.5) * cellHPct;

    // Moderate jitter: ±20 % of each cell dimension
    const jx = (rand() - 0.5) * cellWPct * 0.4;
    const jy = (rand() - 0.5) * cellHPct * 0.4;

    return {
      x:        Math.max(xMinPct, Math.min(cellCenterPct + jx, xMaxPct)),
      y:        Math.max(0,        Math.min(cellMidYPct   + jy, yMaxPct)),
      rotation: (rand() - 0.5) * 30,   // –15 … +15 deg
    };
  });
})();

// ─── Mobile: MobileFileItem ───────────────────────────────────────────────────
interface MobileFileProps {
  el:            OrbitEl;
  index:         number;
  pos:           MobileFilePos;
  isFun:         boolean;
  visible:       boolean;
  isHighlighted: boolean;
  draggedGroup:  string | null;
  onNavigate:    (slug: string, group: string) => void;
  onDragStart:   (group: string) => void;
  onDragEnd:     () => void;
}

function MobileFileItem({
  el, index, pos, isFun, visible, isHighlighted, draggedGroup,
  onNavigate, onDragStart, onDragEnd,
}: MobileFileProps) {
  const outerRef   = useRef<HTMLDivElement>(null);
  const pulseRef   = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const liveDelta  = useRef({ x: 0, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const totalMoved = useRef(0);
  const dragging   = useRef(false);
  const [zTop, setZTop] = useState(false);

  const pulseDuration = 2 + (index * 0.317) % 2;
  const pulseDelay    = (index * 0.197) % 2;

  // Write drag offset directly to DOM — avoids React re-renders during drag
  const flushTransform = useCallback(() => {
    if (!outerRef.current) return;
    const x = offset.x + liveDelta.current.x;
    const y = offset.y + liveDelta.current.y;
    outerRef.current.style.transform =
      `translate(${x}px, ${y}px) rotate(${pos.rotation}deg)`;
  }, [offset, pos.rotation]);

  // Non-passive touchmove so we can call preventDefault while dragging
  useEffect(() => {
    const node = outerRef.current;
    if (!node || !isFun) return;
    const handler = (e: TouchEvent) => { if (dragging.current) e.preventDefault(); };
    node.addEventListener('touchmove', handler, { passive: false });
    return () => node.removeEventListener('touchmove', handler);
  }, [isFun]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    liveDelta.current  = { x: 0, y: 0 };
    totalMoved.current = 0;
    if (isFun) {
      dragging.current = true;
      setZTop(true);
      onDragStart(el.group);
      if (pulseRef.current) pulseRef.current.style.animationPlayState = 'paused';
    }
  }, [isFun, el.group, onDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current) return;
    const t  = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    totalMoved.current = Math.hypot(dx, dy);
    liveDelta.current  = { x: dx, y: dy };
    flushTransform();
  }, [flushTransform]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Prevent the browser's synthetic click that follows touchend — navigation
    // is handled here directly so we don't want a duplicate onClick later.
    e.preventDefault();
    const moved = totalMoved.current;
    dragging.current = false;

    if (moved < 8) {
      // Tap — reset any drift and navigate
      liveDelta.current = { x: 0, y: 0 };
      flushTransform();
      if (isFun) {
        setZTop(false);
        onDragEnd();
        if (pulseRef.current) pulseRef.current.style.animationPlayState = 'running';
      }
      onNavigate(el.slug, el.group);
    } else if (isFun) {
      // Drop — commit delta into state; file stays where released.
      // Using state (not ref) ensures the committed position survives React re-renders.
      let newX = offset.x + liveDelta.current.x;
      let newY = offset.y + liveDelta.current.y;
      // Clamp: don't let the element land outside the viewport
      if (outerRef.current) {
        const rect = outerRef.current.getBoundingClientRect();
        const vpW  = window.innerWidth;
        const vpH  = window.innerHeight;
        if (rect.left   < 0)    newX -= rect.left;
        else if (rect.right  > vpW) newX -= (rect.right  - vpW);
        if (rect.top    < 0)    newY -= rect.top;
        else if (rect.bottom > vpH) newY -= (rect.bottom - vpH);
      }
      liveDelta.current = { x: 0, y: 0 };
      setOffset({ x: newX, y: newY });   // re-render applies translate(newX, newY)
      setZTop(false);
      onDragEnd();
      if (pulseRef.current) pulseRef.current.style.animationPlayState = 'running';
    }
  }, [isFun, el.slug, el.group, offset, flushTransform, onNavigate, onDragEnd]);

  const isGroupDimmed = draggedGroup !== null && draggedGroup !== el.group;

  return (
    <div
      ref={outerRef}
      style={{
        position:      'absolute',
        left:          `${pos.x}%`,
        top:           `${pos.y}%`,
        width:         100,
        zIndex:        zTop ? 50 : 2,
        touchAction:   'none',
        cursor:        'pointer',
        opacity:       !visible ? 0 : isGroupDimmed ? 0.35 : 1,
        transition:    'opacity 0.35s ease',
        transform:     `translate(${offset.x}px, ${offset.y}px) rotate(${pos.rotation}deg)`,
        display:       'flex',
        flexDirection: 'column' as const,
        alignItems:    'center',
        gap:           4,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      // Fallback for non-touch environments (desktop browser, simulator)
      onClick={() => onNavigate(el.slug, el.group)}
    >
      {/* Scale wrapper — flashes 1.1 on tap for whole group */}
      <div
        style={{
          transform:       `scale(${isHighlighted ? 1.1 : 1})`,
          transition:      'transform 0.15s ease',
          transformOrigin: 'center bottom',
          display:         'flex',
          flexDirection:   'column' as const,
          alignItems:      'center',
          gap:             4,
          width:           '100%',
        }}
      >
        {/* Float pulse — fun mode only */}
        <div
          ref={pulseRef}
          style={{
            animation: isFun
              ? `mobileFilePulse ${pulseDuration}s ease-in-out ${pulseDelay}s infinite`
              : 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={el.src}
            alt=""
            draggable={false}
            style={{
              maxWidth:      100,
              maxHeight:     100,
              width:         'auto',
              height:        'auto',
              objectFit:     'contain' as const,
              display:       'block',
              pointerEvents: 'none',
              userSelect:    'none' as const,
              boxShadow:     '0px 4px 12px rgba(0,0,0,0.25), 0px 8px 24px rgba(0,0,0,0.15)',
            }}
          />
        </div>

        {/* Filename label */}
        <span
          style={{
            fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight:    400,
            fontSize:      11,
            lineHeight:    '14px',
            color:         '#F2EAE3',
            textAlign:     'center' as const,
            maxWidth:      90,
            wordBreak:     'break-word' as const,
            userSelect:    'none' as const,
            pointerEvents: 'none' as const,
            display:       'block',
          }}
        >
          {GROUP_LABELS[el.group] ?? el.group}
        </span>
      </div>
    </div>
  );
}

// ─── Mobile section ───────────────────────────────────────────────────────────
function MobileProjectsSection() {
  const { mode } = useMode();
  const router   = useRouter();
  const isFun    = mode === 'fun';

  const sectionRef = useRef<HTMLElement>(null);

  const [highlightedGroup, setHighlightedGroup] = useState<string | null>(null);
  const [draggedGroup,     setDraggedGroup]     = useState<string | null>(null);
  const [revealedUpTo,     setRevealedUpTo]     = useState(-1);

  // ── Reveal files one-by-one when section first enters the viewport ─────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let triggered = false;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        obs.disconnect();
        let count = 0;
        const N = shuffledElements.length;
        const tick = () => {
          setRevealedUpTo(count);
          count++;
          if (count < N) setTimeout(tick, REVEAL_STAGGER_MS);
        };
        tick();
      }
    }, { threshold: 0.1 });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // Navigate immediately — same behaviour as desktop onClick
  const handleNavigate = useCallback((slug: string, group: string) => {
    setHighlightedGroup(group);   // brief flash visible while page loads
    router.push(`/projects/${slug}`);
  }, [router]);

  const handleDragEnd = useCallback(() => setDraggedGroup(null), []);

  return (
    <>
      <style>{`
        @keyframes mobileFilePulse {
          0%, 100% { transform: scale(1);    }
          50%       { transform: scale(1.05); }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          position:        'relative',
          minHeight:       '100svh',
          height:          'auto',
          width:           '100%',
          overflow:        'visible',
          backgroundColor: 'transparent',
        }}
      >
        {/* ── Title ──────────────────────────────────────────────────────────── */}
        <div style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24, textAlign: 'center' }}>
          <p
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    600,
              fontSize:      20,
              color:         '#F2EAE3',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              margin:        0,
              userSelect:    'none' as const,
            }}
          >
            My Projects
          </p>
          <p
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    300,
              fontSize:      12,
              color:         '#B5A496',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              margin:        '12px 0 0',
              userSelect:    'none' as const,
            }}
          >
            Tap on a file to see the magic
          </p>
        </div>

        {/* ── Scatter canvas — Mac desktop vibe ─────────────────────────────── */}
        <div
          style={{
            position:  'relative',
            width:     '100%',
            height:    MOBILE_SCATTER_H,
            marginTop: 24,
          }}
        >
          {shuffledElements.map((el, i) => (
            <MobileFileItem
              key={el.id}
              el={el}
              index={i}
              pos={mobileFilePositions[i]}
              isFun={isFun}
              visible={revealedUpTo >= i}
              isHighlighted={highlightedGroup === el.group}
              draggedGroup={draggedGroup}
              onNavigate={handleNavigate}
              onDragStart={setDraggedGroup}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Desktop section ──────────────────────────────────────────────────────────
function DesktopProjectsSection() {
  const { mode } = useMode();
  const router   = useRouter();
  const isFun    = mode === 'fun';

  const sectionRef    = useRef<HTMLElement>(null);
  const elemRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef        = useRef<number>();
  const angle         = useRef(0);
  const paused        = useRef(false);
  const magnet        = useRef({ index: -1, dx: 0, dy: 0 });
  const isFirstRender = useRef(true);
  const hasRevealedRef = useRef(false);
  const revealTidRef  = useRef<ReturnType<typeof setTimeout>>();

  // ── Fun-mode drag state ──────────────────────────────────────────────────────
  const dragOffsets = useRef<{ x: number; y: number }[]>(
    shuffledElements.map(() => ({ x: 0, y: 0 }))
  );
  const activeDrag  = useRef<{ index: number; startX: number; startY: number } | null>(null);
  const liveDrag    = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);

  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const anyHovered = hoveredGroup !== null;

  // ── Trigger reveal: opacity 0 → 1, staggered one by one ───────────────────
  const triggerReveal = useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    const N = shuffledElements.length;
    requestAnimationFrame(() => {
      for (let i = 0; i < N; i++) {
        const ref = elemRefs.current[i];
        if (!ref) continue;
        ref.style.transition = `opacity 0.4s ease ${revealDelays[i]}s`;
        ref.style.opacity    = '1';
      }
      // Clear transitions after the last element has fully faded in
      const clearAfter = (revealDelays[N - 1] + 0.5) * 1000;
      revealTidRef.current = setTimeout(() => {
        for (let j = 0; j < N; j++) {
          const ref = elemRefs.current[j];
          if (ref) ref.style.transition = 'none';
        }
      }, clearAfter);
    });
  }, []);

  // ── IntersectionObserver: fire reveal the first time section enters view ───
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        triggerReveal();
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(section);
    return () => obs.disconnect();
  }, [triggerReveal]);

  // ── Fun-mode drag: track mouse globally while a drag is active ────────────
  useEffect(() => {
    if (!isFun) return;
    const onMove = (e: MouseEvent) => {
      if (!activeDrag.current) return;
      liveDrag.current = {
        x: e.clientX - activeDrag.current.startX,
        y: e.clientY - activeDrag.current.startY,
      };
    };
    const onUp = () => {
      if (!activeDrag.current) return;
      const { index } = activeDrag.current;
      if (Math.hypot(liveDrag.current.x, liveDrag.current.y) > 4) {
        // Clamp: read the element's current screen position and correct the offset
        // so it can't land outside the viewport.
        const ref = elemRefs.current[index];
        let cx = 0, cy = 0;
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const vpW  = window.innerWidth;
          const vpH  = window.innerHeight;
          if (rect.left   < 0)    cx = -rect.left;
          else if (rect.right  > vpW) cx = vpW - rect.right;
          if (rect.top    < 0)    cy = -rect.top;
          else if (rect.bottom > vpH) cy = vpH - rect.bottom;
        }
        dragOffsets.current[index].x += liveDrag.current.x + cx;
        dragOffsets.current[index].y += liveDrag.current.y + cy;
        wasDragging.current = true;
      }
      const ref = elemRefs.current[index];
      if (ref) ref.style.zIndex = '';
      liveDrag.current   = { x: 0, y: 0 };
      activeDrag.current = null;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',  onUp);
    };
  }, [isFun]);

  // ── Orbit / scatter positioning (no reveal logic here) ────────────────────
  useEffect(() => {
    const N           = shuffledElements.length;
    const firstRender = isFirstRender.current;
    isFirstRender.current = false;

    // Reset drag state on every mode transition (or initial mount)
    dragOffsets.current  = shuffledElements.map(() => ({ x: 0, y: 0 }));
    liveDrag.current     = { x: 0, y: 0 };
    activeDrag.current   = null;
    wasDragging.current  = false;
    document.body.style.cursor = '';

    // On first render: hide all elements; reveal is handled by IntersectionObserver
    if (firstRender) {
      for (let i = 0; i < N; i++) {
        const r = elemRefs.current[i];
        if (r) r.style.opacity = '0';
      }
    }

    const startOrbit = () => {
      for (let i = 0; i < N; i++) {
        const r = elemRefs.current[i];
        if (r) { r.style.transition = 'none'; r.style.transitionDelay = ''; }
      }
      const tick = () => {
        if (!paused.current) angle.current -= ORBIT_STEP;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cx = vw / 2;
        const cy = vh / 2;
        const rx = vw * RX_FRAC;
        const ry = vh * RY_FRAC;
        for (let i = 0; i < N; i++) {
          const ref = elemRefs.current[i];
          if (!ref) continue;
          const a  = (i / N) * 2 * Math.PI + angle.current;
          const ex = Math.cos(a) * rx;
          const ey = Math.sin(a) * ry;
          const ox = cx + ex * Math.cos(TILT) - ey * Math.sin(TILT);
          const oy = cy + ex * Math.sin(TILT) + ey * Math.cos(TILT);
          const w  = ref.offsetWidth;
          const h  = ref.offsetHeight;
          const m  = magnet.current;
          const mdx = m.index === i ? m.dx : 0;
          const mdy = m.index === i ? m.dy : 0;
          ref.style.transform =
            `translate(${ox - w / 2 + mdx}px, ${oy - h / 2 + mdy}px)` +
            ` rotate(${shuffledElements[i].rotation}deg)`;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isFun) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const vw        = window.innerWidth;
      const vh        = window.innerHeight;
      const positions = computeScatter(elemRefs.current, vw, vh);

      if (firstRender) {
        // Just position; opacity stays 0 until IntersectionObserver fires
        for (let i = 0; i < N; i++) {
          const ref = elemRefs.current[i];
          if (!ref) continue;
          const { ox, oy } = positions[i];
          ref.style.transition      = 'none';
          ref.style.transitionDelay = '';
          ref.style.transform       =
            `translate(${ox}px, ${oy}px) rotate(${shuffledElements[i].rotation}deg)`;
        }
      } else {
        // Mode switch: animate to scatter positions
        for (let i = 0; i < N; i++) {
          const ref = elemRefs.current[i];
          if (!ref) continue;
          const { ox, oy } = positions[i];
          ref.style.transition      = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
          ref.style.transitionDelay = '';
          ref.style.transform       =
            `translate(${ox}px, ${oy}px) rotate(${shuffledElements[i].rotation}deg)`;
        }
      }

      const SETTLE_MS = 950;
      const t0        = performance.now() + SETTLE_MS;
      let idleRaf: number;

      const idleTick = (now: number) => {
        if (now < t0) { idleRaf = requestAnimationFrame(idleTick); return; }
        const t = now - t0;
        for (let i = 0; i < N; i++) {
          const ref = elemRefs.current[i];
          if (!ref) continue;
          const p        = idleParams[i];
          const { ox, oy } = positions[i];
          const dOff = dragOffsets.current[i];
          const lx   = activeDrag.current?.index === i ? liveDrag.current.x : 0;
          const ly   = activeDrag.current?.index === i ? liveDrag.current.y : 0;
          const dx = p.floatX   * Math.sin(t * p.speedX   + p.phaseX);
          const dy = p.floatY   * Math.sin(t * p.speedY   + p.phaseY);
          const dr = p.floatRot * Math.sin(t * p.speedRot + p.phaseRot);
          if (ref.style.transition) ref.style.transition = 'none';
          ref.style.transform =
            `translate(${ox + dOff.x + lx + dx}px, ${oy + dOff.y + ly + dy}px)` +
            ` rotate(${shuffledElements[i].rotation + dr}deg)`;
        }
        idleRaf = requestAnimationFrame(idleTick);
      };

      idleRaf = requestAnimationFrame(idleTick);
      return () => { cancelAnimationFrame(idleRaf); };
    }

    // ── Pro mode (orbit) ──────────────────────────────────────────────────────
    paused.current = false;
    magnet.current = { index: -1, dx: 0, dy: 0 };

    if (firstRender) {
      startOrbit();
      return () => {
        clearTimeout(revealTidRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    // Mode switch: animate to orbit positions, then resume orbit RAF
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;
    const rx = vw * RX_FRAC;
    const ry = vh * RY_FRAC;

    for (let i = 0; i < N; i++) {
      const ref = elemRefs.current[i];
      if (!ref) continue;
      const a  = (i / N) * 2 * Math.PI + angle.current;
      const ex = Math.cos(a) * rx;
      const ey = Math.sin(a) * ry;
      const ox = cx + ex * Math.cos(TILT) - ey * Math.sin(TILT);
      const oy = cy + ex * Math.sin(TILT) + ey * Math.cos(TILT);
      const w  = ref.offsetWidth;
      const h  = ref.offsetHeight;
      ref.style.transition      = 'transform 0.65s cubic-bezier(0.4, 0, 1, 1)';
      ref.style.transitionDelay = '';
      ref.style.transform       =
        `translate(${ox - w / 2}px, ${oy - h / 2}px)` +
        ` rotate(${shuffledElements[i].rotation}deg)`;
    }

    const tid = setTimeout(() => startOrbit(), 700);

    return () => {
      clearTimeout(tid);
      clearTimeout(revealTidRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isFun]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnter = (group: string) => {
    if (activeDrag.current !== null) return;
    paused.current = true;
    setHoveredGroup(group);
    shuffledElements.forEach((el, i) => {
      const ref = elemRefs.current[i];
      if (!ref) return;
      ref.style.transition = 'opacity 0.25s ease';
      ref.style.opacity    = el.group === group ? '1' : '0.3';
    });
  };

  const handleLeave = () => {
    paused.current = false;
    magnet.current = { index: -1, dx: 0, dy: 0 };
    setHoveredGroup(null);
    elemRefs.current.forEach((ref) => {
      if (!ref) return;
      ref.style.transition = 'opacity 0.25s ease';
      ref.style.opacity    = '1';
    });
  };

  const handleMove = (e: React.MouseEvent, i: number) => {
    if (activeDrag.current !== null) return;
    const ref = elemRefs.current[i];
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    const dx   = e.clientX - (rect.left + rect.width  / 2);
    const dy   = e.clientY - (rect.top  + rect.height / 2);
    const dist = Math.hypot(dx, dy);
    const MAX  = 8;
    magnet.current = {
      index: i,
      dx: dist > 0 ? (dx / dist) * Math.min(dist / 80, 1) * MAX : 0,
      dy: dist > 0 ? (dy / dist) * Math.min(dist / 80, 1) * MAX : 0,
    };
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position:        'relative',
        height:          '100vh',
        width:           '100%',
        overflow:        'visible',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          position:  'absolute',
          top:       '50%',
          left:      '50%',
          transform: 'translate(-50%, -50%)',
          zIndex:    5,
          display:   'flex',
          overflow:  'visible',
          pointerEvents: 'none',
        }}
      >
        {LETTERS.map((char, i) => (
          <span
            key={i}
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    500,
              fontSize:      32,
              color:         '#F2EAE3',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              display:       'inline-block',
              userSelect:    'none' as const,
              whiteSpace:    'pre' as const,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {shuffledElements.map((el, i) => {
        const isActive = hoveredGroup === el.group;
        const isDimmed = anyHovered && !isActive;

        return (
          <div
            key={el.id}
            ref={(r) => { elemRefs.current[i] = r; }}
            style={{
              position: 'absolute',
              top:      0,
              left:     0,
              zIndex:   isActive ? 10 : 1,
            }}
          >
            <div
              onMouseEnter={() => handleEnter(el.group)}
              onMouseLeave={handleLeave}
              onMouseMove={(e) => handleMove(e, i)}
              onMouseDown={isFun ? (e: React.MouseEvent) => {
                e.preventDefault();
                wasDragging.current = false;
                activeDrag.current  = { index: i, startX: e.clientX, startY: e.clientY };
                liveDrag.current    = { x: 0, y: 0 };
                const ref = elemRefs.current[i];
                if (ref) ref.style.zIndex = '20';
                document.body.style.cursor = 'grabbing';
              } : undefined}
              onClick={() => {
                if (wasDragging.current) { wasDragging.current = false; return; }
                router.push(`/projects/${el.slug}`);
              }}
              style={{
                cursor:          isFun ? 'grab' : 'pointer',
                transform:       isDimmed ? 'scale(0.88)' : 'scale(1)',
                transition:      'transform 0.25s ease',
                transformOrigin: 'center',
                display:         'flex',
                flexDirection:   'column' as const,
                alignItems:      'center',
                gap:             4,
                userSelect:      'none' as const,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={el.src}
                alt=""
                draggable={false}
                style={{
                  height:        el.height,
                  width:         'auto',
                  display:       'block',
                  pointerEvents: 'none',
                  userSelect:    'none' as const,
                  boxShadow:     '0px 4px 8px rgba(0,0,0,0.10), 0px 15px 15px rgba(0,0,0,0.09), 0px 34px 20px rgba(0,0,0,0.05), 0px 60px 24px rgba(0,0,0,0.01), 0px 94px 26px rgba(0,0,0,0)',
                }}
              />
              {/* Filename label — fun mode only */}
              {isFun && (
                <span
                  style={{
                    fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight:    400,
                    fontSize:      11,
                    lineHeight:    '14px',
                    color:         '#F2EAE3',
                    textAlign:     'center' as const,
                    maxWidth:      90,
                    wordBreak:     'break-word' as const,
                    userSelect:    'none' as const,
                    pointerEvents: 'none' as const,
                    display:       'block',
                    textShadow:    '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {GROUP_LABELS[el.group] ?? el.group}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

// ─── Root export — routes to mobile or desktop ────────────────────────────────
export default function ProjectsSection() {
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth < 744);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isMobileLayout ? <MobileProjectsSection /> : <DesktopProjectsSection />;
}
