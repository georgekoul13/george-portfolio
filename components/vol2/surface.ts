import { PREFIX } from '@/lib/seo';

/**
 * Where Vol 2 lives, for the code that runs in the BROWSER.
 *
 * ── the bug this exists to stop happening twice ───────────────────────
 * Vol 2 shipped with `pathname.startsWith('/vol2')` written out in eight
 * places: the chrome switch in `ClientProviders`, the 404 branch, the back
 * button, and every internal link. Every one of them was correct while Vol 2
 * lived at `/vol2` and every one of them broke the moment it became the site,
 * because a `beforeFiles` rewrite does not change the url the browser shows.
 * `usePathname()` returns `/`, so the test that asked "am I in Vol 2" started
 * answering NO on Vol 2's own pages.
 *
 * It failed loudly and quietly at the same time. George, minutes after the
 * swap: *"the first time you get in georgekoulouris.com you see the old
 * loading"* and *"the toogle is still there"* — vol1's entire chrome, mounted
 * over Vol 2 because the guard had inverted. Quietly, every card linked to
 * `/vol2/projects/…`, which 301s to the real url: it works, so nobody sees
 * it, while every navigation pays a redirect and every internal link a
 * crawler follows points at a url that moves.
 *
 * ── so: ONE source, and it is the same flag as everything else ────────
 * `PREFIX` is `''` when Vol 2 is the site and `/vol2` when it is not, read
 * from `NEXT_PUBLIC_VOL2_AS_ROOT` — the same constant the canonicals, the
 * sitemap and the JSON-LD ids already follow. Nothing here decides anything;
 * it just stops the answer being written out by hand.
 *
 * **Never write `/vol2` into a component again.** Link with `vol2Href`, ask
 * with `inVol2`.
 */
export { PREFIX };

/** the home page's path — `/` once Vol 2 is the site */
export const VOL2_HOME = PREFIX || '/';

/**
 * Is this path a Vol 2 surface?
 *
 * Once Vol 2 IS the site the answer is always yes: the rewrites cover `/`,
 * the three categories and every project, and nothing else is reachable.
 * Before that it is the prefix test, as it always was.
 */
export const inVol2 = (pathname: string | null | undefined): boolean =>
  PREFIX === '' || !!pathname?.startsWith('/vol2');

/** an internal link, with the prefix the deployment actually uses */
export const vol2Href = (path: string): string => `${PREFIX}${path}` || '/';

/**
 * The path as the BROWSER sees it, whatever the server was asked for.
 *
 * ── the second half of the same bug ───────────────────────────────────
 * Under a `beforeFiles` rewrite the two disagree. Rendering `/product`, the
 * server's `usePathname()` says `/vol2/product` — the route it actually
 * resolved — while the browser's says `/product`, because the url never
 * changed. Anything that RENDERS from that value therefore produces
 * different markup on each side, and React tears the tree down:
 *
 *   #418  hydration failed, the initial UI does not match
 *   #425  text content does not match
 *   #423  ...so the entire root switches to client rendering
 *
 * That last one is the expensive one. It throws away every byte of the
 * prerendered html and rebuilds it in the browser, which is most of what
 * static generation was for.
 *
 * `MenuBar` was the one doing it: `active: pathname === href` was false on
 * the server and true in the browser, so the nav's current item — and the
 * page name on the closed tile, which is read from it — differed.
 *
 * Normalising at the point of use makes both sides agree on the browser's
 * answer, which is the one that is true by the time anybody can see it.
 */
export const normalisePath = (pathname: string | null | undefined): string => {
  const p = pathname || '/';
  if (PREFIX !== '') return p;
  if (p === '/vol2') return '/';
  return p.startsWith('/vol2/') ? p.slice('/vol2'.length) : p;
};
