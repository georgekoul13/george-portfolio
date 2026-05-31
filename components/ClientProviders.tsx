'use client';

import type { ReactNode } from 'react';
import { ModeProvider } from '@/context/ModeContext';
import Background from '@/components/Background';
import CustomCursor from '@/components/CustomCursor';
import ModeToggle from '@/components/ModeToggle';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollToTop from '@/components/ScrollToTop';

export default function ClientProviders({ children }: { children: ReactNode }) {
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
