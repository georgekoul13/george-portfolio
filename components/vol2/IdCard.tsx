/**
 * "Creative Licence" ID card — Figma 92:5266, the component's **Variant2**.
 *
 * Redrawn 2026-08-29. It used to be the Default variant: a cream card with a
 * hairline inner border carrying five stars, a photo well with a paperclip,
 * a licence paragraph, a six-cell form grid, a barcode and a validity box —
 * about 250 lines of small print, most of it under 10px. Variant2 throws all
 * of that away for one photograph and a name.
 *
 * The outer box stays 750 x 525 so `ConnectSection`'s `CARD_SCALE` and its
 * `fit()` keep working untouched.
 */

import Image from 'next/image';

const PORTRAIT = '/images/vol2/id/george-portrait.png';

/**
 * The crop, straight off Figma: the picture is blown up to 122% of the well
 * and pushed up so the frame lands on the collar and tie rather than the
 * face. `object-cover` cannot express it — cover would fit the image to the
 * well and show 53% of its height, where the design shows 45%.
 *
 * `height: auto` rather than Figma's 224.05%: at 122% width the natural
 * 896 x 1152 source is 1126 tall, not the 1105 Figma reports, so taking the
 * height from the aspect ratio keeps the picture undistorted and the top
 * offset is adjusted to frame the same band.
 */
const CROP = {
  width: '121.98%',
  height: 'auto',
  left: '-10.95%',
  top: '-101.5%',
} as const;

export default function IdCard({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative flex flex-col items-start justify-between ${className ?? ''}`}
      style={{
        width: 750,
        height: 525,
        padding: 16,
        borderRadius: 18,
        background: 'var(--bg-inverse)',
        ...style,
      }}
    >
      {/* the photo well — everything inside the card's 16px padding */}
      <div
        className="relative min-h-0 w-full flex-1 overflow-hidden"
        style={{ borderRadius: 16, background: 'var(--neutral-300)' }}
      >
        <Image
          src={PORTRAIT}
          alt="George Koulouris"
          width={876}
          height={1126}
          sizes="(min-width: 900px) 900px, 100vw"
          className="absolute max-w-none"
          style={CROP}
        />
      </div>

      {/* The name chip. Absolute, and it deliberately overhangs: Figma puts
          its top at 505 on a 525 card, so 20 of its 40 hang past the bottom
          edge and it reads as a tag clipped onto the photograph. */}
      <div
        className="absolute flex items-center"
        style={{
          left: 16,
          top: 505,
          gap: 6,
          padding: '8px 16px',
          borderRadius: 100,
          background: 'var(--blue-700)',
        }}
      >
        <img
          src="/images/vol2/ui/icon/spline-pointer.svg"
          alt=""
          aria-hidden="true"
          className="block shrink-0"
          style={{ width: 18, height: 18 }}
        />
        <span
          className="whitespace-nowrap uppercase"
          style={{
            font: '500 16px/24px var(--font-sans)',
            color: 'var(--text-primary)',
          }}
        >
          George Koulouris
        </span>
      </div>
    </div>
  );
}
