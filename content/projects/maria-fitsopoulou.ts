import type { ProjectContent } from './types';

/** Split out of the `logo-designs` bucket on 2026-08-21 — one brand, one page. */
const mariaFitsopoulou: ProjectContent = {
  slug:       'maria-fitsopoulou',
  title:      'MARIA FITSOPOULOU',
  resolution: '1440 × 900',
  description:
    'A brand identity for a general dentistry practice. The mark is one continuous line that reads as a molar and as something rounder and softer at the same time — an organic outline where the category expects a clinical one — set against a wide-tracked serif wordmark on warm cream.',
  metadata: {
    role: 'Brand Designer — concept, mark, and identity system.',
    categories: ['BRAND DESIGN'],
    employer: 'FREELANCE',
  },
  sections: [
    { type: 'divider' },
    { type: 'imageGrid', cols: 2, images: [
      { src: '/images/projects/logo-designs/maria-fits-1.jpg', alt: 'Maria Fitsopoulou — logo' },
      { src: '/images/projects/logo-designs/maria-fits-2.jpg', alt: 'Maria Fitsopoulou — wordmark lockup' },
      { src: '/images/projects/logo-designs/maria-fits-3.jpg', alt: 'Maria Fitsopoulou — horizontal lockup' },
      { src: '/images/projects/logo-designs/maria-fits-4.jpg', alt: 'Maria Fitsopoulou — the mark alone' },
    ] },
  ],
};

export default mariaFitsopoulou;
