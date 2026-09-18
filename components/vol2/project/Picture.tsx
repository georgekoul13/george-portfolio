import { srcsetFor } from './assets';

/**
 * A project picture — a plain `<img>` pointing at a file that already exists.
 *
 * George: *"we definitely need to fix the thing with the images… this is the
 * priority number one for a portfolio."*
 *
 * ── why not `next/image` ──────────────────────────────────────────────
 * Every image failure this site has had came from the same place: resizing on
 * demand. Cold, a variant took seconds to produce; under a page's worth of
 * parallel requests some never came back at all; and with `loading="lazy"`
 * the browser would not even ask, because these live inside `PanelStack`'s
 * transformed panels and their rect never enters the viewport — a still can
 * sit grey for ever and no amount of scrolling fixes it.
 *
 * None of that was inherent, and the measurements are what settled it. The
 * sources are already WebP at sensible dimensions: 18.3 MB for all 173, the
 * heaviest whole page 2.57 MB, and only 39 files wider than 1600px. There is
 * nothing an optimiser needs to do at request time that cannot be done once,
 * at build time, and served as a static file.
 *
 * So `scripts/build-image-variants.mjs` writes the smaller copies, the asset
 * script records them in `SRCSET`, and this renders them. A static file
 * cannot cold-encode, cannot queue behind a worker, and cannot fail to be
 * requested.
 *
 * ── the attributes are all load-bearing ───────────────────────────────
 * `width`/`height` give the box an intrinsic ratio, so the layout is correct
 * before the bytes land and nothing shifts. `decoding="async"` keeps a big
 * picture off the main thread. `fetchPriority` is how the hero gets ahead of
 * twenty siblings now that nothing is lazy.
 */
export default function Picture({
  src,
  alt,
  w,
  h,
  sizes,
  priority,
  className,
  draggable,
}: {
  src: string;
  alt: string;
  /** the file's real pixel size — from `assets.ts`, not guessed */
  w?: number;
  h?: number;
  sizes?: string;
  /** the one picture on the page worth fetching ahead of the rest */
  priority?: boolean;
  className?: string;
  draggable?: boolean;
}) {
  const srcSet = srcsetFor(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={w || undefined}
      height={h || undefined}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      draggable={draggable}
      className={className}
    />
  );
}
