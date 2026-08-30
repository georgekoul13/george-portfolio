import Header from '@/components/vol2/Header';
import Divider from '@/components/vol2/Divider';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import NotFoundStage from './NotFoundStage';

/**
 * The 404 page — Figma 147:15098.
 *
 * Shared by the route below and by `not-found.tsx`, so a mistyped URL and a
 * `notFound()` thrown inside a page land on exactly the same screen.
 *
 * The numeral band is `NotFoundStage`, a client component because the
 * cursor trail inside it needs a ref.
 *
 * It used to be a playable Dino game — a 400-line canvas-less loop with
 * falling stickers, shards, a jump arc and a score. George cut it on
 * 2026-08-29: the frame is one enormous numeral and nothing else, so
 * `DinoGame.tsx` was deleted rather than left unrendered.
 *
 * No footer here: Figma goes straight from the numeral to the rule and the
 * copyright, which is the one page on the site without the "reach out" band.
 */
export default function NotFoundContent() {
  return (
    <div data-vol2>
      <Header />
      <main style={{ background: 'var(--bg-page)' }} className="pt-[var(--header-h)]">
        <NotFoundStage />

        <Divider />
        <CopyrightSection />
      </main>
    </div>
  );
}
