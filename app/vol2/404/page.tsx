import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import NotFoundContent from '@/components/vol2/notfound/NotFoundContent';

/**
 * A door onto the 404 for review — the real one is `not-found.tsx`, which
 * only appears when something actually fails to resolve.
 *
 * This route IS a server component, so it reads the drawing off disk and
 * hands it over rather than making the browser fetch it. The real 404 cannot
 * — see the note in `NotFoundContent`.
 */
/**
 * NOINDEX. This is a preview of the error screen at a real URL — exactly the
 * sort of page that gets indexed by accident and then turns up in a result
 * for the site's own name. The audit caught it inheriting the root layout's
 * title, which is how it would have shipped.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default async function NotFoundPreview() {
  const svg = await readFile(
    path.join(process.cwd(), 'public/images/vol2/avatar/george.svg'),
    'utf8',
  );
  return <NotFoundContent svg={svg} />;
}
