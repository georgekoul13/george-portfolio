import NavMemory from '@/components/vol2/NavMemory';

/**
 * Exists only to hold the navigation memory that "Back" reads — see
 * `navMemory`. No chrome: the root layout already bypasses all v1 chrome for
 * /vol2 routes, and deliberately no `not-found.tsx`, since Next 14.2 will not
 * fire a nested one for a `notFound()` thrown in a dynamic segment (the vol2
 * 404 is a path check inside the root `app/not-found.tsx`).
 */
export default function Vol2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavMemory />
      {children}
    </>
  );
}
