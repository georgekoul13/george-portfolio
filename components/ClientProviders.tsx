'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ModeProvider } from '@/context/ModeContext';
import Background from '@/components/Background';
import CustomCursor from '@/components/CustomCursor';
import ModeToggle from '@/components/ModeToggle';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollToTop from '@/components/ScrollToTop';
import Vol2Cursor from '@/components/vol2/Cursor';
import { inVol2 } from '@/components/vol2/surface';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /**
   * Vol2 does not use the v1 chrome — no fun/pro toggle, no gradient-mesh
   * background, no loading screen. Its background is flat `--bg-page`. It does
   * keep the cursor, rebuilt on GSAP and the new tokens.
   *
   * ── this was `pathname.startsWith('/vol2')`, and it broke at the swap ──
   * A `beforeFiles` rewrite does not change the url the browser shows, so the
   * moment Vol 2 became the site `usePathname()` returned `/` and this test
   * answered NO on Vol 2's own pages — mounting vol1's loading screen,
   * gradient mesh, fun/pro toggle and cursor over the top of it. George saw
   * it within minutes of the swap. `inVol2` reads the same flag as the
   * canonicals do; see `surface.ts`.
   *
   * ── and why `ModeProvider` is now OUTSIDE the branch ──────────────────
   * Because vol1's pages are still in the build. They are unreachable once
   * the rewrites are on, but Next still PRERENDERS them, and several call
   * `useMode()`, which throws without this provider above it. Gating the
   * provider on the branch turned a chrome decision into a build failure —
   * three pages died on `useMode must be used within ModeProvider`.
   *
   * It is free to keep: pure `useState`, no effect, no storage, no DOM. Only
   * the VISIBLE chrome is switched, which is the only thing that was ever
   * the question.
   */
  const isVol2 = inVol2(pathname);

  return (
    <ModeProvider>
      {/* Resets scroll to top on every route change */}
      <ScrollToTop />

      {isVol2 ? (
        <>
          {children}
          <Vol2Cursor />
        </>
      ) : (
        <>
          {/* z-index 100: loading screen — sits above everything on first load */}
          <LoadingScreen />

          {/* z-index 0: gradient mesh, z-index 1: grain overlay */}
          <Background />

          {/* z-index 2+: all page content sits above the background */}
          <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>

          {/* z-index 50: fixed toggle, always on top of content */}
          <ModeToggle />

          {/* z-index 9999: custom cursor, topmost layer */}
          <CustomCursor />
        </>
      )}
    </ModeProvider>
  );
}
