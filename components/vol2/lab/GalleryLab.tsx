'use client';

import { useEffect, useState } from 'react';
import ProjectsBand, { DEFAULTS, type Tuning } from '../ProjectsBand';

/**
 * The tuner harness for `ProjectsBand`, kept after the band shipped to
 * `/vol2` — the geometry is still worth dialling by eye, and doing it here
 * means the page itself never carries the panel.
 *
 * The harness. The gallery itself takes its whole geometry as
 * props, so the panel here is just fourteen numbers and a re-render — the
 * ScrollTrigger is never rebuilt, the render loop reads the live values.
 *
 * Hidden unless the URL carries `?tune=1`.
 */

const RANGES: Record<keyof Tuning, [number, number, number]> = {
  perspective: [1000, 30000, 100],
  originX:     [0, 100, 1],
  originY:     [0, 100, 1],
  worldX:      [-1200, 200, 5],
  ratio:       [0.7, 0.98, 0.005],
  curve:       [0, 6, 0.1],
  near:        [0, 3000, 20],
  rotate:      [-80, 80, 1],
  cardW:       [160, 700, 5],
  cardH:       [160, 800, 5],
  hoverTurn:   [0, 1, 0.02],
  hoverShift:  [0, 700, 5],
  focusMax:    [1, 4, 0.05],
  focusRange:  [1, 12, 0.5],
  focusFrom:   [-8, 4, 0.5],
  spread:      [0, 900, 10],
  bow:         [-200, 300, 5],
  restDim:     [0.1, 1, 0.05],
};

/**
 * Any key can be overridden from the query string — `?cardW=420&rotate=-38`.
 * Cheap to add and it turns "what if" into a link: the panel's `copy` button
 * writes the current geometry back out as one, so a look worth keeping can be
 * pasted into a message instead of described.
 */
function fromQuery(): Tuning {
  if (typeof window === 'undefined') return DEFAULTS;
  const q = new URLSearchParams(window.location.search);
  const out = { ...DEFAULTS };
  (Object.keys(DEFAULTS) as (keyof Tuning)[]).forEach((k) => {
    const v = q.get(k);
    if (v !== null && v !== '' && !Number.isNaN(parseFloat(v))) out[k] = parseFloat(v);
  });
  return out;
}

export default function GalleryLab({ tune }: { tune: boolean }) {
  const [t, setT] = useState<Tuning>(DEFAULTS);

  /* Query values land in an effect rather than in `useState`'s initialiser:
     reading `window` during render would make the client's first pass
     disagree with the server's and trip hydration. */
  useEffect(() => setT(fromQuery()), []);

  return (
    <>
      <ProjectsBand tuning={t} />

      {tune && (
        <div
          className="fixed left-4 top-24 z-50 max-h-[70vh] w-[250px] overflow-y-auto rounded-xl p-3"
          style={{
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            font: '400 11px/1.5 var(--font-sans)',
            color: 'var(--text-primary)',
          }}
        >
          {(Object.keys(RANGES) as (keyof Tuning)[]).map((k) => {
            const [min, max, step] = RANGES[k];
            return (
              <label key={k} className="mb-2 block">
                <span className="flex justify-between opacity-70">
                  <span>{k}</span>
                  <span>{t[k]}</span>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={t[k]}
                  onChange={(e) => setT({ ...t, [k]: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </label>
            );
          })}

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setT(DEFAULTS)}
              className="flex-1 rounded px-2 py-1"
              style={{ border: '1px solid var(--border-subtle)' }}
            >
              reset
            </button>
            <button
              onClick={() => {
                const q = new URLSearchParams(
                  Object.entries(t).map(([k, v]) => [k, String(v)]),
                );
                q.set('tune', '1');
                navigator.clipboard?.writeText(
                  `${location.origin}${location.pathname}?${q}`,
                );
              }}
              className="flex-1 rounded px-2 py-1"
              style={{ border: '1px solid var(--border-subtle)' }}
            >
              copy link
            </button>
          </div>
        </div>
      )}
    </>
  );
}
