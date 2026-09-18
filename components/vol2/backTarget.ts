/**
 * Where "Back" goes: THE PAGE BEFORE THIS ONE.
 *
 * George: *"it always has to take you to the previous page. If the flow for
 * example is home > Product page > gaspar > mood (through more projects), the
 * back button on mood should go to gaspar."*
 *
 * That reverses what this file used to do. It remembered only the LISTING
 * pages and returned you to the last of those, on the reasoning that someone
 * hopping project → project → project would rather rejoin the grid than walk
 * back through every one of them. George wants the walk: More Projects is a
 * trail, and a control that skips the trail is lying about where you have
 * been.
 *
 * So Back is the browser's own history now — one step, same as the phone's
 * gesture and the trackpad swipe, which is the behaviour a reader has
 * already learned everywhere else.
 *
 * ── except on a cold arrival ──────────────────────────────────────────
 * The one real objection to `history.back()` survives: open a project from a
 * shared link and the entry behind it belongs to whoever sent it, so Back
 * throws you off the site entirely. `visits` counts navigations this tab has
 * actually made inside vol2 — when there have been none, the listing
 * fallback below is used instead, and only then.
 */

export const LISTINGS = ['/vol2', '/vol2/product', '/vol2/graphic', '/vol2/creative'];

const CURRENT = 'vol2:listing';
const PREVIOUS = 'vol2:listing-prev';

export const isListing = (path: string) => LISTINGS.includes(path);

/**
 * How many pages this tab has moved BETWEEN inside vol2.
 *
 * Zero means the current page is where the reader landed, so there is
 * nothing of ours behind it and `history.back()` would leave the site.
 *
 * In `sessionStorage` rather than a module variable because a reload keeps
 * the history stack but throws away every module: counted in memory, a
 * refresh on a project page would wrongly decide it was a cold arrival.
 * Cleared with the tab, which is exactly when the history goes too.
 */
const VISITS = 'vol2:visits';

/** Called on every vol2 navigation — see `NavMemory`. */
export function remember(path: string) {
  if (typeof sessionStorage === 'undefined') return;

  /* Counted for every vol2 page, listing or not — this is the trail, and
     project → project is the part of it George specifically wants kept. A
     re-render on the same path is not a navigation. */
  const last = sessionStorage.getItem(CURRENT_PATH);
  if (last !== path) {
    if (last) sessionStorage.setItem(VISITS, String(visits() + 1));
    sessionStorage.setItem(CURRENT_PATH, path);
  }

  if (!isListing(path)) return;
  const current = sessionStorage.getItem(CURRENT);
  if (current && current !== path) sessionStorage.setItem(PREVIOUS, current);
  sessionStorage.setItem(CURRENT, path);
}

/** the last vol2 path seen, listing or not — how a navigation is detected */
const CURRENT_PATH = 'vol2:path';

/** whether `history.back()` lands on one of ours rather than off the site */
export function hasHistory(): boolean {
  return visits() > 0;
}

function visits(): number {
  if (typeof sessionStorage === 'undefined') return 0;
  return Number(sessionStorage.getItem(VISITS) ?? 0) || 0;
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
