import type { ProjectContent } from './types';

const insuranceProductFlows: ProjectContent = {
  slug:       'insurance-product-flows',
  title:      'INSURANCE FLOWS',
  resolution: '1440 × 900',
  description:
    'Generic insurance flows built at Wallbid to show potential clients how our tools could adapt to their products. Each flow covered a different insurance type — a proof of concept that the same design system could flex across wildly different products and regulatory contexts.',
  metadata: {
    role: 'UX Designer — flow architecture, wireframes, and interaction design.',
    categories: ['UX DESIGN', 'PRODUCT DESIGN'],
    employer: 'WALLBID',
  },
  sections: [
    { type: 'divider' },

    // ── Web — 4 screens, scroll-linked ───────────────────────────────────────
    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/insurance-product-flows/insurance-web-1.jpg', alt: 'Insurance product flows — web screen 1' },
        { src: '/images/projects/insurance-product-flows/insurance-web-2.jpg', alt: 'Insurance product flows — web screen 2' },
        { src: '/images/projects/insurance-product-flows/insurance-web-3.jpg', alt: 'Insurance product flows — web screen 3' },
        { src: '/images/projects/insurance-product-flows/insurance-web-4.jpg', alt: 'Insurance product flows — web screen 4' },
      ],
    },

    { type: 'divider' },

    {
      type: 'disclaimer',
      text: 'The screens shown represent a selected portion of the full flow. Additional screens and the complete user journey cannot be shared publicly due to a non-disclosure agreement.',
    },

    { type: 'divider' },

    // ── App — 6 screens, scroll-linked ───────────────────────────────────────
    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/insurance-product-flows/insurance-app-1.jpg', alt: 'Insurance product flows — app screen 1' },
        { src: '/images/projects/insurance-product-flows/insurance-app-2.jpg', alt: 'Insurance product flows — app screen 2' },
        { src: '/images/projects/insurance-product-flows/insurance-app-3.jpg', alt: 'Insurance product flows — app screen 3' },
        { src: '/images/projects/insurance-product-flows/insurance-app-4.jpg', alt: 'Insurance product flows — app screen 4' },
        { src: '/images/projects/insurance-product-flows/insurance-app-5.jpg', alt: 'Insurance product flows — app screen 5' },
        { src: '/images/projects/insurance-product-flows/insurance-app-6.jpg', alt: 'Insurance product flows — app screen 6' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default insuranceProductFlows;
