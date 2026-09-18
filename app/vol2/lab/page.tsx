import type { Metadata } from 'next';

/**
 * A tuning harness for the projects band — real controls, no content, and
 * the one page on the site that should never appear in a result.
 *
 * `noindex` rather than a `robots.txt` disallow. A disallow stops a crawler
 * READING the page, which means it never sees a noindex and can still index
 * the url from any link pointing at it, titleless. Letting it in and telling
 * it no is the combination that actually keeps a page out.
 */
export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
};

import Header from '@/components/vol2/Header';
import GalleryLab from '@/components/vol2/lab/GalleryLab';

/**
 * Scratch route for the receding-gallery experiment. Linked from nowhere;
 * the real home page is untouched.
 *
 * It runs the new sequence end to end — the line revealing, then scrolling
 * away as the rank arrives — so the handover between them can be judged,
 * which is the part that does not survive being looked at in pieces.
 *
 * `?tune=1` opens the geometry panel.
 */
export default function LabPage({
  searchParams,
}: {
  searchParams: { tune?: string };
}) {
  return (
    <div data-vol2>
      <Header />
      <main style={{ background: 'var(--bg-page)' }} className="pt-[var(--header-h)]">
        {/* stands in for the design-services band above it — the entry leg
            measures from the section's top reaching the viewport bottom, so
            without something above it there is no entry to watch */}
        <div style={{ height: '90svh' }} />
        <GalleryLab tune={searchParams.tune === '1'} />
        <div style={{ height: '60svh' }} />
      </main>
    </div>
  );
}
