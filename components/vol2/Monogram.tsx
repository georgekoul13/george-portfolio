/**
 * The GK monogram — Figma 262:10147, the short logo at the top-left of the
 * category hero.
 *
 * George: *"in the inner pages I want to have an indication of my logo — we
 * can also try the short version."* An indication is exactly the job: the
 * full wordmark was there first and read as a second title competing with
 * the one under it, which is the wrong emphasis on a page whose subject is
 * the category, not the name.
 *
 * Not `Hero`, either. That one is fourteen separately animated letters with
 * an illustration swapping into an O — the home page's opening gesture. Here
 * the lettering is a mark, and a mark that performs takes the wow moment
 * away from the drawing, which is where George wants it.
 *
 * Drawn as a mask rather than an `<img>` because the export hard-codes
 * `#0F0F0F`, and this has to follow the panel's tone like every other mark
 * on the site.
 */
export default function Monogram({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="George Koulouris"
      className={`block ${className ?? ''}`}
      style={{
        width: 'var(--cat-mark-w)',
        aspectRatio: '53.8182 / 32.0001',
        background: 'currentColor',
        maskImage: 'url(/images/vol2/monogram.svg)',
        WebkitMaskImage: 'url(/images/vol2/monogram.svg)',
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}
