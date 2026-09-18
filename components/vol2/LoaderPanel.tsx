'use client';

/**
 * The curtain itself — the cream panel with LOADING… turning on a drum.
 *
 * Pulled out of `Loader` so the project pages can show the SAME one. George,
 * on the first version of the project gate: *"the loading of the project page
 * is a black screen - use the one we use for the main pages as well."* It
 * was a bare `--bg-page` rectangle, which is not a loading screen, it is an
 * absence.
 *
 * Only the VISUAL lives here. When it appears and what it waits for stay with
 * whoever renders it, because those differ: `Loader` is a page-load curtain
 * that holds for fonts and `window load`, and `ProjectGate` is a navigation
 * curtain that holds for the pictures of the screen you are about to see.
 *
 * ── everything in here is CSS ─────────────────────────────────────────
 * Not a stylistic preference. `Loader` stops `gsap.globalTimeline` while the
 * panel is up, so a GSAP tween in here would not render at all. Anything
 * added later has to stay CSS for the same reason.
 *
 * ── the creep ─────────────────────────────────────────────────────────
 * It eases towards a distance it never quite reaches, so a long wait keeps
 * inching rather than arriving somewhere and stopping dead — and however long
 * the page takes, the exit always begins from something already in motion.
 * That continuity is most of what makes the lift read as smooth rather than
 * as a jerk from a standstill.
 */

/** how far the panel inches up while it waits, and over how long */
export const CREEP_TO = 110;
export const CREEP_MS = 9000;

export const EXIT_MS = 1200;
/** gentle in, long settle — no snap at either end */
export const EXIT_EASE = 'cubic-bezier(0.5, 0, 0.2, 1)';

/* ── LOADING… on the drum ───────────────────────────────────────────────
   The same mechanic as the copyright line: each character turned about an
   origin pushed back in z, so it swings on a cylinder rather than flipping
   flat, with the turn staggered along the word to send a wave through it. */
const TEXT = 'Loading…';
const ROLL_MS = 1800;
/** how far apart each character's turn starts */
const ROLL_STEP_MS = 90;
const FONT = 32;
const DEPTH = -FONT;
const PERSPECTIVE = 220;

export default function LoaderPanel({
  leaving,
  creeping,
  /** stacking context — the project gate sits over a page, not over a load */
  z = 100,
}: {
  leaving: boolean;
  creeping: boolean;
  z?: number;
}) {
  const panelY = leaving ? '-100vh' : creeping ? `-${CREEP_TO}px` : '0px';

  return (
    // the stage holds still and clips, so nothing shows past the wipe's edge
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden" style={{ zIndex: z }}>
      <style>{`
        @keyframes gk-loader-roll {
          0%   { transform: rotateX(0deg); }
          40%  { transform: rotateX(360deg); }
          100% { transform: rotateX(360deg); }
        }
      `}</style>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'var(--bg-inverse)',
          transform: `translateY(${panelY})`,
          transition: leaving
            ? `transform ${EXIT_MS}ms ${EXIT_EASE}`
            : `transform ${CREEP_MS}ms cubic-bezier(0.12, 0.7, 0.25, 1)`,
          willChange: 'transform',
        }}
      >
        <p
          className="flex uppercase"
          style={{
            font: 'var(--type-32-32-m)',
            color: 'var(--text-inverse)',
            perspective: PERSPECTIVE,
            transformStyle: 'preserve-3d',
          }}
        >
          {TEXT.split('').map((ch, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                transformOrigin: `50% 50% ${DEPTH}px`,
                backfaceVisibility: 'hidden',
                animation: `gk-loader-roll ${ROLL_MS}ms cubic-bezier(0.65, 0, 0.35, 1) infinite`,
                animationDelay: `${i * ROLL_STEP_MS}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
