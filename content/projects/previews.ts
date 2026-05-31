// ─── Project Preview Catalog ──────────────────────────────────────────────────
// Lightweight metadata for ALL projects used in "More Projects" cards.
// Uses orbit images as thumbnails until real case-study images are added.
// No full ProjectContent needed — just slug, title, category, thumbnail.

export interface ProjectPreview {
  slug:      string;
  title:     string;
  category:  string;   // short label shown in the card
  thumbnail: string;   // path to a representative image
}

const previews: ProjectPreview[] = [
  {
    slug:      'gaspar-ai',
    title:     'GASPAR AI',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/gaspar-ai-1.png',
  },
  {
    slug:      'piraeus-insurance',
    title:     'PIRAEUS INSURANCE',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/piraeus-1.png',
  },
  {
    slug:      'insurance-product-flows',
    title:     'INSURANCE FLOWS',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/insurance-product-1.png',
  },
  {
    slug:      'cancellation-wallet',
    title:     'CANCELLATION WALLET',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/cancellation-wallet-1.png',
  },
  {
    slug:      'cybersential',
    title:     'CYBERSENTIAL',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/cybersential-1.png',
  },
  {
    slug:      'bancasure360',
    title:     'BANCASURE360',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/bancasure360-1.png',
  },
  {
    slug:      'mood',
    title:     'MOOD',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/mood-2.png',
  },
  {
    slug:      'istorima',
    title:     'ISTORIMA',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/istorima-1.png',
  },
  {
    slug:      'benefit',
    title:     'BENEFIT',
    category:  'PRODUCT DESIGN',
    thumbnail: '/images/projects/orbit/benefit-1.png',
  },
  {
    slug:      'music-festivals',
    title:     'MUSIC FESTIVALS',
    category:  'BRAND DESIGN',
    thumbnail: '/images/projects/orbit/music-festivals-1.png',
  },
  {
    slug:      'book-cover',
    title:     'BOOK COVER',
    category:  'BRAND DESIGN',
    thumbnail: '/images/projects/orbit/book-cover-1.png',
  },
  {
    slug:      'logo-designs',
    title:     'LOGO DESIGNS',
    category:  'BRAND DESIGN',
    thumbnail: '/images/projects/orbit/logo-designs-1.png',
  },
  {
    slug:      'psychologist-branding',
    title:     'PSYCHOLOGIST BRANDING',
    category:  'BRAND DESIGN',
    thumbnail: '/images/projects/orbit/psychologist-branding-1.png',
  },
  {
    slug:      'illustrations',
    title:     'ILLUSTRATIONS',
    category:  'ILLUSTRATION',
    thumbnail: '/images/projects/orbit/illustrations-1.png',
  },
  {
    slug:      'custom-typefaces',
    title:     'CUSTOM TYPEFACES',
    category:  'TYPOGRAPHY',
    thumbnail: '/images/projects/orbit/custom-typefaces-1.png',
  },
];

const previewMap = new Map(previews.map(p => [p.slug, p]));

export function getPreview(slug: string): ProjectPreview | null {
  return previewMap.get(slug) ?? null;
}
