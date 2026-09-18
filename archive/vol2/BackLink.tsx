'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { returnTo } from './backTarget';

/**
 * The "← Back" link at the top of every inner page — Figma 147:11365 and its
 * twins on the project and contact frames.
 *
 * The glyph is `icon/arrow-down-up`, George's own export: a diagonal pointing
 * up-left, the exact mirror of the `arrow-up-right` the social cards use. It
 * needs no rotation — it is drawn facing the way this link goes.
 *
 * It carries the cards' hover too: two glyphs in a clipped box, so the first
 * leaves through one corner while the second follows it in from the opposite
 * one. There it travels up-right, because that is where those links point;
 * here it goes up-left, which is where this one does.
 *
 * Drawn as a mask rather than an `<img>` because the export hard-codes its
 * stroke colour, and this has to follow the label's.
 *
 * Where it goes is decided at runtime — see `backTarget`. It returns you to
 * the listing page you were actually browsing, so a project reached from
 * Creative goes back to Creative and the same project reached from the home
 * grid goes back home. The `href` prop is the fallback for a cold arrival,
 * and is what renders on the server, so the first paint always has a real
 * destination and nothing shifts on hydration.
 */

const BOX = 18;
/*
 * The glyph fills its box, so it travels the box's full 18px on each axis to
 * clear the corner. Spelled as literal `translate-*-[18px]` utilities below,
 * since Tailwind reads class strings and not constants.
 */

function Arrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 block ${className ?? ''}`}
      style={{
        background: 'currentColor',
        maskImage: 'url(/images/vol2/ui/icon/arrow-down-up.svg)',
        WebkitMaskImage: 'url(/images/vol2/ui/icon/arrow-down-up.svg)',
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}

const GLIDE = 'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';

export default function BackLink({
  href = '/vol2',
  className,
  style,
  ...rest
}: {
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  /** so a page can target it — the project intro animates it in on load */
  'data-back'?: boolean;
}) {
  const pathname = usePathname() ?? '';
  const [target, setTarget] = useState(href);

  // read after mount: sessionStorage doesn't exist during the render on the
  // server, and guessing at it there would mismatch on hydration
  useEffect(() => {
    setTarget(returnTo(pathname) ?? href);
  }, [pathname, href]);

  return (
    <Link
      href={target}
      {...rest}
      /* -my-3 py-3 buys the 44px tap height the 20px label cannot reach on
         its own, without shifting it in the layout */
      className={`group -my-3 flex items-center gap-2 py-3 ${className ?? ''}`}
      style={{ color: 'var(--text-primary)', ...style }}
    >
      <span
        aria-hidden="true"
        className="relative block shrink-0 overflow-hidden"
        style={{ width: BOX, height: BOX }}
      >
        <Arrow
          className={`${GLIDE} group-hover:-translate-x-[18px] group-hover:-translate-y-[18px]
                      group-focus-visible:-translate-x-[18px] group-focus-visible:-translate-y-[18px]`}
        />
        <Arrow
          className={`translate-x-[18px] translate-y-[18px] ${GLIDE}
                      group-hover:translate-x-0 group-hover:translate-y-0
                      group-focus-visible:translate-x-0 group-focus-visible:translate-y-0`}
        />
      </span>
      <span className="uppercase" style={{ font: 'var(--type-20-20-r)' }}>
        Back
      </span>
    </Link>
  );
}
