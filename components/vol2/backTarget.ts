/**
 * Where "Back" goes.
 *
 * The browser's own history would be the obvious answer, but `router.back()`
 * is wrong here in two ways: someone who opened a project from a shared link
 * has no history to go back to and gets thrown off the site, and someone who
 * hopped project → project → project would walk back through every one of
 * them instead of returning to the list they were browsing.
 *
 * So only the *listing* pages are remembered — home and the three category
 * pages — and Back returns to the last one of those you were actually on.
 * From a project it means the grid you came from; from a category page it
 * means home; and when there is no history at all it means the fallback the
 * page passes in.
 */

export const LISTINGS = ['/vol2', '/vol2/product', '/vol2/graphic', '/vol2/creative'];

const CURRENT = 'vol2:listing';
const PREVIOUS = 'vol2:listing-prev';

export const isListing = (path: string) => LISTINGS.includes(path);

/** Called on every vol2 navigation — see `NavMemory`. */
export function remember(path: string) {
  if (typeof sessionStorage === 'undefined' || !isListing(path)) return;
  const current = sessionStorage.getItem(CURRENT);
  if (current && current !== path) sessionStorage.setItem(PREVIOUS, current);
  sessionStorage.setItem(CURRENT, path);
}

/**
 * On a listing page you want the one before it, otherwise you would link a
 * page to itself; anywhere else you want the listing you came from.
 */
export function returnTo(path: string): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  const key = isListing(path) ? PREVIOUS : CURRENT;
  const found = sessionStorage.getItem(key);
  return found && found !== path ? found : null;
}
