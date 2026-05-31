import type { ProjectContent } from './types';

const wallbid: ProjectContent = {
  slug:       'wallbid',
  title:      'WALLBID',
  resolution: '1440 × 900',
  description:
    'An insurtech company that sells insurance products through digital channels. I was the lead designer for two of the main products that follow below.',
  metadata: {
    role: 'Lead Product Designer.',
    categories: ['PRODUCT DESIGN', 'UX DESIGN'],
    employer: 'WALLBID',
  },
  sections: [
    { type: 'divider' },

    // ── BancaSure360 — B2B bancassurance platform ────────────────────────────
    {
      type: 'disclaimer',
      text: 'The screens shown represent a selected portion of the product. The full flow cannot be shared publicly due to a non-disclosure agreement.',
    },

    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/bancasure360/bancasure-1.jpg', alt: 'BancaSure360 — screen 1' },
        { src: '/images/projects/bancasure360/bancasure-2.jpg', alt: 'BancaSure360 — screen 2' },
        { src: '/images/projects/bancasure360/bancasure-3.jpg', alt: 'BancaSure360 — screen 3' },
        { src: '/images/projects/bancasure360/bancasure-4.jpg', alt: 'BancaSure360 — screen 4' },
        { src: '/images/projects/bancasure360/bancasure-5.jpg', alt: 'BancaSure360 — screen 5' },
        { src: '/images/projects/bancasure360/bancasure-6.jpg', alt: 'BancaSure360 — screen 6' },
        { src: '/images/projects/bancasure360/bancasure-7.jpg', alt: 'BancaSure360 — screen 7' },
        { src: '/images/projects/bancasure360/bancasure-8.jpg', alt: 'BancaSure360 — screen 8' },
        { src: '/images/projects/bancasure360/bancasure-9.jpg', alt: 'BancaSure360 — screen 9' },
      ],
    },

    { type: 'divider' },

    // ── Insurance Product Flows — generic pitch flows ────────────────────────
    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/insurance-product-flows/insurance-app-1.jpg', alt: 'Insurance flows — app screen 1' },
        { src: '/images/projects/insurance-product-flows/insurance-app-2.jpg', alt: 'Insurance flows — app screen 2' },
        { src: '/images/projects/insurance-product-flows/insurance-app-3.jpg', alt: 'Insurance flows — app screen 3' },
        { src: '/images/projects/insurance-product-flows/insurance-app-4.jpg', alt: 'Insurance flows — app screen 4' },
        { src: '/images/projects/insurance-product-flows/insurance-app-5.jpg', alt: 'Insurance flows — app screen 5' },
        { src: '/images/projects/insurance-product-flows/insurance-app-6.jpg', alt: 'Insurance flows — app screen 6' },
      ],
    },

    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/insurance-product-flows/insurance-web-1.jpg', alt: 'Insurance flows — web screen 1' },
        { src: '/images/projects/insurance-product-flows/insurance-web-2.jpg', alt: 'Insurance flows — web screen 2' },
        { src: '/images/projects/insurance-product-flows/insurance-web-3.jpg', alt: 'Insurance flows — web screen 3' },
        { src: '/images/projects/insurance-product-flows/insurance-web-4.jpg', alt: 'Insurance flows — web screen 4' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default wallbid;
