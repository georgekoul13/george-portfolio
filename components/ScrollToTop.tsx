'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scrolls to the top of the page on every route change and
 * disables the browser's native scroll restoration so it never
 * tries to remember a previous position.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Tell the browser not to restore scroll position on back/forward
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
