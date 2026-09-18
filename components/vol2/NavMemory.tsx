'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { remember } from './backTarget';

/**
 * Records which listing page you were last on. Mounted once in the vol2
 * layout rather than inside `BackLink`, because the link never renders on the
 * home page — which is exactly the visit that most needs remembering.
 */
export default function NavMemory() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) remember(pathname);
  }, [pathname]);
  return null;
}
