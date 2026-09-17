/**
 * @type {import('next').NextConfig}
 *
 * ── HOW VOL 2 REPLACES THE LIVE SITE ──────────────────────────────────
 * George: *"this site is going to replace the other so find the best way to
 * do it… the next step is to deploy to vercel to a test link so more people
 * can test it and if everything is ok we will push it to
 * georgekoulouris.com."*
 *
 * Two deployments of one branch, told apart by ONE environment variable:
 *
 *   test link      VOL2_AS_ROOT unset  — vol1 stays at `/`, Vol 2 at `/vol2`
 *   the real site  VOL2_AS_ROOT=1      — Vol 2 IS the site, at clean urls
 *
 * The flag is off by default, so a deploy that forgets it changes nothing.
 * That is the point: the swap is a Vercel setting and a redeploy, not a
 * branch merge, and it is undone the same way if something is wrong.
 *
 * `beforeFiles` rewrites run ahead of the filesystem, so `/` reaches Vol 2
 * even though `app/page.tsx` (vol1) still exists. Nothing is deleted, which
 * is what makes this reversible.
 *
 * The `/vol2/*` paths then REDIRECT to the clean ones — permanently, so the
 * same page is never reachable at two urls. `lib/seo.ts` drops its `/vol2`
 * prefix off the same flag, so canonicals, the sitemap and the JSON-LD ids
 * all follow in one move.
 */
/* Both names, and they must be set together. The server needs it to rewrite;
   `lib/seo.ts` needs the NEXT_PUBLIC_ one because canonicals are rendered on
   the client too. Setting only one produces a site whose urls and whose
   canonicals disagree — which is worse than not migrating at all. */
const asRoot =
  process.env.VOL2_AS_ROOT === '1' || process.env.NEXT_PUBLIC_VOL2_AS_ROOT === '1';

if (asRoot && process.env.NEXT_PUBLIC_VOL2_AS_ROOT !== '1') {
  throw new Error(
    'VOL2_AS_ROOT is set but NEXT_PUBLIC_VOL2_AS_ROOT is not. Set both, or the '
    + 'pages will be served at / while every canonical still points at /vol2.',
  );
}

const nextConfig = {
  images: {
    /* Vol 2 serves its own pre-built WebP straight from `public/` and never
       touches this — see `components/vol2/project/Picture.tsx`. It is still
       here for vol1, which uses `next/image` throughout. */
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    /**
     * A year, immutable, for the project pictures.
     *
     * Safe only because their urls carry a content fingerprint — see
     * `stamp()` in `scripts/build-project-assets.mjs`. Without it this would
     * be a trap: George replaces a picture in place and keeps the filename,
     * so a long cache would serve the old one until it expired.
     *
     * Next serves everything under `public/` as `max-age=0`, which meant a
     * returning reader revalidated all thirty-odd images on every visit.
     */
    return [
      {
        source: '/images/vol2/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  async rewrites() {
    if (!asRoot) return [];
    return {
      beforeFiles: [
        { source: '/', destination: '/vol2' },
        { source: '/product', destination: '/vol2/product' },
        { source: '/graphic', destination: '/vol2/graphic' },
        { source: '/creative', destination: '/vol2/creative' },
        { source: '/projects/:slug', destination: '/vol2/projects/:slug' },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async redirects() {
    if (!asRoot) return [];
    /* One page, one url. Without these the site would answer on both
       `/projects/mood` and `/vol2/projects/mood`, which splits every signal
       the canonical is trying to consolidate. */
    return [
      { source: '/vol2', destination: '/', permanent: true },
      { source: '/vol2/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
