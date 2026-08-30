import NotFoundContent from '@/components/vol2/notfound/NotFoundContent';

/**
 * A door onto the 404 for review — the real one is `not-found.tsx`, which
 * only appears when something actually fails to resolve.
 */
export default function NotFoundPreview() {
  return <NotFoundContent />;
}
