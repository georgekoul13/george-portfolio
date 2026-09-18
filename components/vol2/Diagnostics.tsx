'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * What the page is actually doing, printed on the page.
 *
 * Add `?diag=1` to any Vol 2 url and a panel appears in the corner. It is
 * inert otherwise — no listeners, no render, nothing shipped to a reader who
 * has not asked for it.
 *
 * ── why this exists ───────────────────────────────────────────────────
 * George's phone is the only place the project-page reveals misbehave, and
 * it is the one place neither of us can inspect. The browser pane throttles
 * `requestAnimationFrame` to about one tick per half second whenever it is
 * hidden, which stops ScrollTrigger advancing at all, so every "mobile"
 * measurement taken through it is worthless — I took two before noticing.
 * There is no iOS simulator on this machine either.
 *
 * So rather than ship a third fix reasoned from a desktop, this asks the
 * phone. George opens a project page with `?diag=1`, screenshots the panel,
 * and the four lines in it separate every hypothesis that is still open:
 *
 *   reduced      the OS is set to Reduce Motion. Every reveal on the site
 *                bails out early when this is on, by design — content shows
 *                with no animation, which is exactly the reported symptom.
 *   triggers     how many ScrollTriggers exist. 0 means `ProjectGate` never
 *                released and nothing was ever built.
 *   fired        how many have already run. If this equals `triggers` at the
 *                top of the page, they all fired at once on load — the page
 *                measured flat and the reveals were spent before he looked.
 *   parked       stills still waiting. The healthy reading is most of them.
 *
 * It reads ScrollTrigger through the `?st=1` hook in `scrollDefaults`, which
 * is why that is switched on here too.
 */
type Stat = Record<string, string | number | boolean>;

export default function Diagnostics() {
  const params = useSearchParams();
  const pathname = usePathname();
  const on = params.get('diag') === '1';
  const [stat, setStat] = useState<Stat>({});

  useEffect(() => {
    if (!on) return;
    const read = () => {
      const ST = (window as unknown as { __ST?: { getAll: () => unknown[] } }).__ST;
      const all = (ST?.getAll?.() ?? []) as { progress: number; trigger?: Element }[];
      const stills = Array.from(document.querySelectorAll('[data-still]'));
      const parked = stills.filter((e) =>
        getComputedStyle(e).clipPath.includes('100%'),
      ).length;
      const chips = Array.from(document.querySelectorAll('[data-chip]'));
      const chipsHidden = chips.filter((e) => +getComputedStyle(e).opacity < 0.9).length;
      setStat({
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        triggers: all.length,
        fired: all.filter((t) => t.progress > 0).length,
        stills: `${parked} parked / ${stills.length}`,
        chips: `${chipsHidden} hidden / ${chips.length}`,
        scroll: `${Math.round(window.scrollY)} of ${Math.round(
          document.documentElement.scrollHeight - window.innerHeight,
        )}`,
        vw: window.innerWidth,
        curtain: Array.from(document.querySelectorAll('p')).some(
          (p) => p.textContent === 'Loading…',
        ),
      });
    };
    read();
    const id = window.setInterval(read, 500);
    window.addEventListener('scroll', read, { passive: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener('scroll', read);
    };
  }, [on, pathname]);

  if (!on) return null;

  return (
    <div
      className="fixed left-2 top-2 z-[10000] rounded-md px-3 py-2"
      style={{
        background: 'rgba(0,0,0,.82)',
        color: '#0fe347',
        font: '500 11px/16px ui-monospace, monospace',
        pointerEvents: 'none',
        maxWidth: '62vw',
      }}
    >
      {Object.entries(stat).map(([k, v]) => (
        <div key={k}>
          {k}: <span style={{ color: '#fffce0' }}>{String(v)}</span>
        </div>
      ))}
    </div>
  );
}
