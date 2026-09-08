/**
 * The footer's social row — Figma node 118:4595, "BOXES".
 *
 * Four equal cards in a row, 16px apart: a hairline box 240 tall, padded 32,
 * with the arrow pinned top-right and the label sitting on the floor in
 * 32/32 Montserrat Medium, uppercase.
 *
 * No JavaScript. Everything here is hover state, which CSS does on its own —
 * and unlike a GSAP tween it costs nothing when nobody is pointing at it.
 */

/**
 * Figma's arrow lives in a 32px box with the glyph inset to 29.17% and then
 * bled back out by 7.5%, which resolves to 15.33px centred in the box. The
 * box is set to clip — which is what makes the hover below possible.
 */
const BOX = 32;
const GLYPH = 15.33;
/** centred by position rather than a transform, which is reserved for the travel */
const INSET = (BOX - GLYPH) / 2;

/*
 * The arrow travels 24px on hover — `INSET + GLYPH` rounded up, which is
 * exactly enough to carry it past the corner of its box. Spelled as the
 * literal `translate-*-6` utilities below, since Tailwind reads class
 * strings and not constants.
 */

/**
 * EMAIL first, and named for what it does rather than who hosts it — George.
 * It carries more weight than it did: with the Contact page dropped, this
 * card IS the contact route, so it leads rather than trailing three profiles.
 * The rest run by how likely they are to be the reason someone came.
 */
const SOCIALS = [
  { label: 'Email',     href: 'mailto:georgekoul13@gmail.com' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/george-koulouris/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Behance',   href: 'https://www.behance.net/' },
];

/**
 * The card's edge, as a variable rather than a fixed token.
 *
 * `--border-subtle` is one step off `--bg-page`, which is exactly right on
 * the black it was drawn on and invisible on the project template's panel,
 * which is `--bg-surface` — a step lighter, so the border and the background
 * land on the same value. That page raises this to `--border-default`; see
 * its panel style.
 */

/** the shared easing for both arrows, so they travel as one gesture */
const GLIDE = 'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';

/**
 * The glyph. Drawn as a mask rather than an `<img>` because the exported SVG
 * hard-codes its stroke colour, and this one has to inherit.
 */
function Arrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute block ${className ?? ''}`}
      style={{
        left: INSET,
        top: INSET,
        width: GLYPH,
        height: GLYPH,
        background: 'currentColor',
        maskImage: 'url(/images/vol2/ui/icon/arrow-up-right.svg)',
        WebkitMaskImage: 'url(/images/vol2/ui/icon/arrow-up-right.svg)',
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}

export default function SocialLinks() {
  return (
    /* The cards never go below 250px. Four of those plus their gaps need
       1048px, so under about that width they stop sharing the row and it
       scrolls sideways instead — which keeps the 32px type inside its card
       rather than spilling out of it. */
    <div className="no-scrollbar mt-12 flex items-start gap-4 overflow-x-auto">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith('http') ? '_blank' : undefined}
          rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
          className={
            'group relative flex h-[240px] min-w-[250px] flex-1 flex-col items-end justify-between ' +
            'border border-[color:var(--social-border)] p-8 transition-colors duration-300 ' +
            'hover:border-[color:var(--border-focus)] focus-visible:border-[color:var(--border-focus)] ' +
            'focus-visible:outline-none'
          }
          style={{ color: 'var(--text-primary)' }}
        >
          {/* Two arrows and a clip: on hover the first leaves through the
              top-right corner while the second follows it in from the
              bottom-left, so the glyph reads as being carried off rather than
              nudged. The box already clips in Figma, which is the only reason
              the second one is invisible at rest. */}
          <span className="relative block overflow-hidden" style={{ width: BOX, height: BOX }}>
            <Arrow
              className={`${GLIDE} group-hover:translate-x-6 group-hover:-translate-y-6
                          group-focus-visible:translate-x-6 group-focus-visible:-translate-y-6`}
            />
            <Arrow
              className={`-translate-x-6 translate-y-6 ${GLIDE}
                          group-hover:translate-x-0 group-hover:translate-y-0
                          group-focus-visible:translate-x-0 group-focus-visible:translate-y-0`}
            />
          </span>

          <span
            className="w-full uppercase"
            style={{ font: 'var(--type-32-32-m)', color: 'var(--text-primary)' }}
          >
            {s.label}
          </span>
        </a>
      ))}
    </div>
  );
}
