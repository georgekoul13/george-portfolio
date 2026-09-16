import type { Sources } from './blocks';

/**
 * The `<source>` list for a loop — WebM first, mp4 behind it, and NOTHING
 * that is not on disk.
 *
 * This exists because the old two-liner was wrong in a way that only showed
 * up on the browsers it was meant to help. It derived the sibling from the
 * filename:
 *
 *     <source src={src.replace(/\.mp4$/i, '.webm')} type="video/webm" />
 *     <source src={src} type="video/mp4" />
 *
 * With an mp4 `src` that is right. With a WebM one — which is what every
 * Figma render is — the replace does nothing, so the SAME VP9 file is
 * offered twice, the second time labelled `video/mp4`. A browser without
 * VP9 skips the first source, takes the second on the strength of its type,
 * fetches a file it cannot decode, and stops. It would have been better off
 * with no fallback at all.
 *
 * So the formats come from the generated asset list, which knows what was
 * encoded, rather than from string surgery on a URL. `src` is still
 * accepted for a slot that only ever had one file.
 */
export default function VideoSources({ src, sources }: { src?: string; sources?: Sources }) {
  const webm = sources?.webm ?? (src && /\.webm$/i.test(src) ? src : undefined);
  const mp4 = sources?.mp4 ?? (src && /\.mp4$/i.test(src) ? src : undefined);

  return (
    <>
      {webm && <source src={webm} type="video/webm" />}
      {mp4 && <source src={mp4} type="video/mp4" />}
    </>
  );
}
