import { readFile } from 'node:fs/promises';
import path from 'node:path';
import NotFoundContent from '@/components/vol2/notfound/NotFoundContent';

/**
 * A door onto the 404 for review — the real one is `not-found.tsx`, which
 * only appears when something actually fails to resolve.
 *
 * This route IS a server component, so it reads the drawing off disk and
 * hands it over rather than making the browser fetch it. The real 404 cannot
 * — see the note in `NotFoundContent`.
 */
export default async function NotFoundPreview() {
  const svg = await readFile(
    path.join(process.cwd(), 'public/images/vol2/avatar/george.svg'),
    'utf8',
  );
  return <NotFoundContent svg={svg} />;
}
