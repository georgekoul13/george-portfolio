/**
 * Regenerates `components/vol2/project/assets.ts` from what is on disk.
 *
 * George exports a folder per project into `public/images/vol2/projects`,
 * named for the project rather than for its slug, with a convention this
 * reads rather than guesses:
 *
 *   hero.webp       the base picture, and the card's
 *   image N.webp    a still — 800x800 for a grid cell, 1680x800 for a row
 *   highlight N.*   the full-width slot, still or loop
 *   wireframe N.png a row-width still, the design-process slot
 *   wide N.png      a row-width still that is not a wireframe
 *
 * ── the order of `stills` is the order the design uses them ───────────
 * Wireframes first, then `image N`, then `wide N`. A wireframe is always a
 * design-process slot and that section comes before the screens it produced
 * — Benefit has two sections chipped "The Design proccess", and its
 * `wireframe.png` belongs to the first, ahead of `image 3` and `image 9`
 * which are the wides inside the second. Appending wireframes at the end
 * put the wrong picture in the first one.
 *
 * ── the shape is measured, not inferred from the name ─────────────────
 * `image N` is BOTH shapes. Istorima's `image 3` is 1680x800 and sits
 * across the whole column while its neighbours are 800x800 cells, and
 * Nixteri's `image 01` is the wide one. The Figma layout says which slot
 * wants which shape (see `layout.ts`), so this reads every file's real
 * pixel size out of the PNG header and hands it over. Sorting `image N` by
 * name and hoping is what put a poster in a wireframe's slot.
 *
 * Run it after every export: `node scripts/build-project-assets.mjs`.
 * Hand-editing the output means the next export silently disagrees with it.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, openSync, readSync, closeSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = 'public/images/vol2/projects';

const num = (s) => {
  const m = s.match(/(\d+)/);
  return m ? +m[1] : 0;
};

/** width/height straight out of the PNG IHDR — no decode, no dependency */
function pngSize(head) {
  if (head.toString('ascii', 1, 4) !== 'PNG') return null;
  return { w: head.readUInt32BE(16), h: head.readUInt32BE(20) };
}

/**
 * The same for WebP, which is what these are now — 232MB of PNG became 18MB
 * at q88 and the sources changed under this script.
 *
 * Three headers carry the size, and which one a file gets is decided by the
 * encoder rather than by us, so all three are read:
 *   VP8X  an extended file (this is what anything with alpha becomes)
 *   VP8   plain lossy
 *   VP8L  lossless
 * Sizes are stored MINUS ONE in every case, which is the detail that makes a
 * hand-rolled reader worth commenting rather than worth guessing at.
 */
function webpSize(head) {
  if (head.toString('ascii', 0, 4) !== 'RIFF') return null;
  if (head.toString('ascii', 8, 12) !== 'WEBP') return null;
  const tag = head.toString('ascii', 12, 16);

  if (tag === 'VP8X') {
    return {
      w: (head.readUIntLE(24, 3) & 0xffffff) + 1,
      h: (head.readUIntLE(27, 3) & 0xffffff) + 1,
    };
  }
  if (tag === 'VP8 ') {
    // 20..22 frame tag, 23..25 the sync code, then 14-bit width and height
    return { w: head.readUInt16LE(26) & 0x3fff, h: head.readUInt16LE(28) & 0x3fff };
  }
  if (tag === 'VP8L') {
    // one signature byte, then 14 bits of width-1 and 14 of height-1, packed
    const bits = head.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

/** whichever of the two this file turns out to be */
function imageSize(file) {
  const fd = openSync(file, 'r');
  const head = Buffer.alloc(32);
  readSync(fd, head, 0, 32, 0);
  closeSync(fd);
  return pngSize(head) ?? webpSize(head);
}

const out = {};
/** every picture that has smaller copies, by its full-size url */
const srcsets = {};
for (const dir of readdirSync(ROOT).sort()) {
  if (!statSync(join(ROOT, dir)).isDirectory()) continue;
  /* `r/` holds the pre-rendered smaller copies — a directory, not a still */
  const files = readdirSync(join(ROOT, dir)).filter(
    (f) => f !== '.DS_Store' && f !== 'r',
  );
  /**
   * A url with a CONTENT FINGERPRINT on it.
   *
   * These files are not hashed in their names — George exports `hero.webp`
   * and replaces it in place, as he did with nine Piraeus images — so Next
   * serves everything under `public/` as `max-age=0` and a returning reader
   * revalidates all thirty-odd pictures on every visit. On a phone that is
   * thirty round trips to be told nothing changed.
   *
   * Eight characters of the file's own hash make the url change whenever the
   * bytes do, which is what lets `next.config.mjs` mark these `immutable`
   * for a year. Replace a picture, re-run this script, and every reader gets
   * the new one immediately — the old url is simply never requested again.
   */
  const stamp = (f) =>
    createHash('sha1').update(readFileSync(join(ROOT, dir, f))).digest('hex').slice(0, 8);
  const url = (f) =>
    `/images/vol2/projects/${dir}/${f}`.replace(/ /g, '%20') + `?v=${stamp(f)}`;
  /**
   * A picture, plus the smaller copies of it that exist on disk.
   *
   * `srcset` is written here rather than built in the browser because it has
   * to name FILES, and only this script knows which ones were made — see
   * `build-image-variants`. Nothing is resized at request time any more, so a
   * width that is not in this string does not exist.
   */
  const variants = existsSync(join(ROOT, dir, 'r'))
    ? readdirSync(join(ROOT, dir, 'r'))
    : [];
  const shot = (f) => {
    const s = /\.(png|webp)$/i.test(f) ? imageSize(join(ROOT, dir, f)) : null;
    const stem = f.replace(/\.[^.]+$/, '');
    const smaller = variants
      .filter((v) => v.startsWith(stem + '-'))
      .map((v) => ({ v, w: +(v.match(/-(\d+)\.webp$/)?.[1] ?? 0) }))
      .filter((x) => x.w > 0)
      .sort((a, b) => a.w - b.w);

    const set = [
      ...smaller.map((x) => `${url('r/' + x.v)} ${x.w}w`),
      ...(s?.w ? [`${url(f)} ${s.w}w`] : []),
    ];
    if (set.length > 1) srcsets[url(f)] = set.join(', ');
    return { src: url(f), w: s?.w ?? 0, h: s?.h ?? 0 };
  };

  const hero = files.find((f) => /^hero\./i.test(f));
  const stills = files.filter((f) => /^image/i.test(f)).sort((a, b) => num(a) - num(b));
  const wires = files.filter((f) => /^wireframe/i.test(f)).sort((a, b) => num(a) - num(b));
  const wide = files.filter((f) => /^wide/i.test(f)).sort((a, b) => num(a) - num(b));
  const highlights = files
    .filter((f) => /highlight/i.test(f) && !/\.(webm|mp4)$/i.test(f))
    .sort((a, b) => num(a) - num(b));
  /* A loop ships as a WebM and an H.264 mp4 of the same name, and the two
     are ONE slot, not two. Grouping them by stem is what lets the markup
     offer a real fallback: it used to derive the sibling by swapping the
     extension, which meant a `.webm` primary was offered twice — once
     correctly and once labelled `video/mp4`, pointing at the same VP9 file
     that a browser reaching for the fallback cannot play. */
  const loops = new Map();
  for (const f of files.filter((f) => /\.(webm|mp4)$/i.test(f)).sort((a, b) => num(a) - num(b))) {
    const stem = f.replace(/\.(webm|mp4)$/i, '');
    const slot = loops.get(stem) ?? {};
    slot[/\.webm$/i.test(f) ? 'webm' : 'mp4'] = url(f);
    loops.set(stem, slot);
  }

  out[dir] = {
    /* through `shot()` so the hero is registered in `SRCSET` too — it is the
       biggest file on the page and the one the loading curtain waits for */
    hero: hero ? shot(hero).src : null,
    stills: [...wires, ...stills, ...wide].map(shot),
    highlights: highlights.map(shot),
    videos: [...loops.values()],
  };
}

const body = `/* GENERATED by scripts/build-project-assets.mjs — do not edit.
   Re-run it after every export from Figma. */

export interface Shot {
  src: string;
  /** real pixel size, so a slot can ask for the shape it wants */
  w: number;
  h: number;
}

/**
 * The smaller copies of a picture, by its full-size url.
 *
 * A flat map rather than a field on every shot, because the HERO is stored as
 * a bare string in several places (cards, the band, the strip) and it is the
 * one file that most needs a phone-sized version. One lookup serves them all
 * without reshaping anything.
 *
 * Absent means there is nothing smaller — the file is already phone-sized.
 * Nothing is resized at request time, so a width not named here does not
 * exist; see \`scripts/build-image-variants.mjs\`.
 */
export const SRCSET: Record<string, string> = ${JSON.stringify(srcsets, null, 2)};

/** the \`srcset\` for a picture, or undefined when it needs none */
export const srcsetFor = (src: string): string | undefined => SRCSET[src];

/** one loop, in the formats it was encoded to */
export interface Loop {
  webm?: string;
  mp4?: string;
}

export interface ProjectAssets {
  hero: string | null;
  /** \`wireframe N\`, \`image N\`, \`wide N\` — the design's order, shapes mixed */
  stills: Shot[];
  /** full-width feature stills */
  highlights: Shot[];
  /** the feature loops, one entry per loop rather than one per file */
  videos: Loop[];
}

export const ASSETS: Record<string, ProjectAssets> = ${JSON.stringify(out, null, 2)};
`;
writeFileSync('components/vol2/project/assets.ts', body);
console.log(`wrote ${Object.keys(out).length} folders`);
