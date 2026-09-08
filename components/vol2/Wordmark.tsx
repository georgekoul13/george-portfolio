/**
 * The wordmark as a small mark — Figma 255:10234, the vector sitting at the
 * top-left of the category hero.
 *
 * Not `Hero`. That one is fourteen separately animated letters with an
 * illustration swapping into an O, which is the home page's opening
 * gesture; here the same lettering is a logo, and a logo that performs is a
 * logo that gets in the way of the title under it.
 *
 * Drawn as a mask rather than an `<img>` because the export hard-codes
 * `#0F0F0F`, and this has to follow the panel's tone like every other mark
 * on the site.
 */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="George Koulouris"
      className={`block ${className ?? ''}`}
      style={{
        /* 148 wide at 1440 and 240 on a phone — LARGER narrow, which is the
           node's own call: it is the only thing at the top of the column
           there, where wide it shares the corner with nothing. */
        width: 'var(--cat-mark-w)',
        aspectRatio: '148 / 56',
        background: 'currentColor',
        maskImage: 'url(/images/vol2/wordmark.svg)',
        WebkitMaskImage: 'url(/images/vol2/wordmark.svg)',
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}
