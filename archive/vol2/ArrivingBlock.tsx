'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * A block that rides up over the panel below it the way a `PanelStack` panel
 * does, and rounds off the same way once it gets there.
 *
 * The category page's content block is not a panel — nothing in it pins, so
 * it simply scrolls — but it arrives over one and carries the same shoulder,
 * and George's rule is about what the reader sees rather than about which
 * component drew it: *"can we remove the rounded corners when the panel is at
 * the top of the viewport?"* Left alone, this one kept its 24px corners with
 * two notches of the cream panel showing through them for the whole page.
 *
 * The mechanism is `PanelStack`'s, kept in one place conceptually rather than
 * one place literally: `--shoulder` scrubs 1 → 0 across the block's climb, and
 * the radius is `calc(var(--panel-radius) * var(--shoulder))`.
 */
export default function ArrivingBlock({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.fromTo(
        el,
        { '--shoulder': 1 },
        {
          '--shoulder': 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            /* the climb: top edge entering, to the block owning the screen */
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={className}
      style={{
        borderTopLeftRadius: 'calc(var(--panel-radius) * var(--shoulder, 1))',
        borderTopRightRadius: 'calc(var(--panel-radius) * var(--shoulder, 1))',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
