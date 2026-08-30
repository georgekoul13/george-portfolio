/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /* AVIF first, WebP behind it. Next only encodes the format the browser
       actually asks for, so the fallback costs nothing on a client that
       cannot take AVIF — and AVIF is roughly 20-30% under WebP on the
       photographic project stills, which are the heaviest thing here. */
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
