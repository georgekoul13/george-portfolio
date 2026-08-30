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

export default function ClientProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /**
   * Vol2 does not use the v1 chrome — no fun/pro toggle, no gradient-mesh
   * background, no loading screen. Its background is flat `--bg-page`. It does
   * keep the cursor, rebuilt on GSAP and the new tokens. As each v1 template is
   * replaced this check goes away along with the components it guards.
   */
  const isVol2 = pathname?.startsWith('/vol2');

  if (isVol2) {
    return (
      <>
        <ScrollToTop />
        {children}
        <Vol2Cursor />
      </>
    );
  }

  return (
    <ModeProvider>
      {/* Resets scroll to top on every route change */}
      <ScrollToTop />

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
    </ModeProvider>
  );
}
