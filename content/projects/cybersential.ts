import type { ProjectContent } from './types';

const cybersential: ProjectContent = {
  slug:       'cybersential',
  title:      'CYBERSENTIAL',
  resolution: '1440 × 900',
  description:
    'A cybersecurity platform for small and medium businesses. Accessible dashboards, clear risk language and a comprehensible sales flow.',
  metadata: {
    role: 'Product Designer.',
    categories: ['PRODUCT DESIGN', 'BRAND DESIGN'],
    employer: 'WALLBID',
  },
  sections: [
    { type: 'divider' },

    // ── Sales flow — 7 screens, scroll-linked ────────────────────────────────
    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/cybersential/cybersential-sales-01.jpg', alt: 'Cybersential — sales flow screen 1' },
        { src: '/images/projects/cybersential/cybersential-sales-02.jpg', alt: 'Cybersential — sales flow screen 2' },
        { src: '/images/projects/cybersential/cybersential-sales-03.jpg', alt: 'Cybersential — sales flow screen 3' },
        { src: '/images/projects/cybersential/cybersential-sales-04.jpg', alt: 'Cybersential — sales flow screen 4' },
        { src: '/images/projects/cybersential/cybersential-sales-05.jpg', alt: 'Cybersential — sales flow screen 5' },
        { src: '/images/projects/cybersential/cybersential-sales-06.jpg', alt: 'Cybersential — sales flow screen 6' },
        { src: '/images/projects/cybersential/cybersential-sales-07.jpg', alt: 'Cybersential — sales flow screen 7' },
      ],
    },

    { type: 'divider' },

    {
      type: 'disclaimer',
      text: 'The screens shown above represent a selected portion of the sales flow. The full sequence and all product screens cannot be shared publicly due to a non-disclosure agreement.',
    },

    { type: 'divider' },

    // ── Product screens — 4 screens, scroll-linked ───────────────────────────
    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/cybersential/cybersential-product-01.jpg', alt: 'Cybersential product — dashboard screen 1' },
        { src: '/images/projects/cybersential/cybersential-product-02.jpg', alt: 'Cybersential product — dashboard screen 2' },
        { src: '/images/projects/cybersential/cybersential-product-03.jpg', alt: 'Cybersential product — dashboard screen 3' },
        { src: '/images/projects/cybersential/cybersential-product-04.jpg', alt: 'Cybersential product — dashboard screen 4' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default cybersential;
