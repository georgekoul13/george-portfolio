'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The page's ground: a still grain over a few very slowly drifting tonal
 * shapes. One fixed layer behind everything, inert to the pointer.
 *
 * Modelled on ponpon-mania.com's background, but inverted in one important
 * way. Theirs BOILS the grain — the noise is re-seeded a few times a second
 * on a stepped clock, which reads as hand-drawn because their palette is
 * loud enough to carry it. On a near-black ground the same thing reads as
 * video compression noise or a dirty screen, so here the grain is still and
 * only the tonal field moves.
 *
 * ── why the grain is load-bearing ───────────────────────────────────────
 * Not decoration. The drift below spans about ten levels of an 8-bit
 * channel, and a smooth gradient that shallow is exactly where dark
 * displays band worst — you would get visible steps rather than a wash.
 * Grain dithers those steps away. Turn `GRAIN` to 0 and the banding is
 * immediately visible, which is the quickest way to see what it is doing.
 *
 * No WebGL. The shapes are radial gradients moved by transform, so they
 * composite on the GPU and cost nothing per frame; the grain is one
 * rasterised SVG. The one thing this cannot do is ponpon's POSTERISED
 * edges — hard-edged organic blobs need a shader to threshold the noise.
 *
 * ── why it sits ON TOP ──────────────────────────────────────────────────
 * It would be tidier underneath, but five components and every page's
 * `main` paint `--bg-page` opaquely, so a layer behind them is a layer
 * nobody sees. Making them all transparent is a real refactor to hang an
 * experiment on. Overlaying is also just how film grain is done: the shapes
 * use `screen`, which lifts the near-black ground and leaves cream type
 * essentially alone, since screen has almost nothing left to give a colour
 * that bright. Pointer-events are off, so it blocks nothing.
 */

/** how strong the grain is. 0 shows the banding it exists to hide. */
const GRAIN = 0.055;

/**
 * The tonal shapes. `light` is an alpha on white, so the whole range lives
 * between --bg-page (#0f0f0f) and about #191919 — roughly ten levels. It
 * wants to stay there: wider and it stops reading as depth and starts
 * reading as a gradient somebody forgot to finish.
 */
const BLOBS = [
  { light: 0.055, size: 95, x: 18, y: 22, dx: 12, dy: -9, secs: 34 },
  { light: 0.04,  size: 80, x: 78, y: 38, dx: -14, dy: 11, secs: 47 },
  { light: 0.03,  size: 110, x: 46, y: 82, dx: 9, dy: -13, secs: 61 },
];

/* Desaturated fractal noise, rasterised once by the browser. `numOctaves`
   above 3 buys nothing at this opacity and costs real time to generate. */
const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function NoiseField() {
  const root = useRef<HTMLDivElement>(null);

  /* `?noise=0` turns it off, `?grain=` and `?light=` scale the two halves —
     the only honest way to judge this is A/B against the same page, and the
     difference is small enough that memory is not good enough. Read in an
     effect rather than during render so the server's first pass and the
     client's agree. */
  const [q, setQ] = useState({ on: true, grain: 1, light: 1 });
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const num = (k: string, d: number) => {
      const v = parseFloat(p.get(k) ?? '');
      return Number.isNaN(v) ? d : v;
    };
    setQ({ on: p.get('noise') !== '0', grain: num('grain', 1), light: num('light', 1) });
  }, []);


  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      /* Each shape gets its own period and they are deliberately coprime-ish
         — 34 / 47 / 61 — so the composite never visibly repeats. Equal
         periods would resynchronise every cycle and the drift would read as
         a loop instead of as weather. */
      gsap.utils.toArray<HTMLElement>('[data-blob]').forEach((el, i) => {
        const b = BLOBS[i];
        gsap.to(el, {
          xPercent: b.dx,
          yPercent: b.dy,
          duration: b.secs,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: root },
  );

  /* after every hook, never before — an early return above `useGSAP`
     changes the hook count between renders and React throws. */
  if (!q.on) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 60 }}
    >
      <div className="absolute inset-0" style={{ mixBlendMode: 'screen' }}>
        {BLOBS.map((b, i) => (
          <div
            key={i}
            data-blob
            className="absolute will-change-transform"
          style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}vmax`,
              height: `${b.size}vmax`,
              /* centred on its own point, so the percentage above is where
                 the shape IS rather than where its corner is */
              marginLeft: `${-b.size / 2}vmax`,
              marginTop: `${-b.size / 2}vmax`,
              background: `radial-gradient(circle, rgba(255,255,255,${b.light * q.light}) 0%, rgba(255,255,255,0) 62%)`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{ backgroundImage: GRAIN_SVG, opacity: GRAIN * q.grain }}
      />
    </div>
  );
}
