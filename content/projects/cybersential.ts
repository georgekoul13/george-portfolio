import type { ProjectContent } from './types';

const cybersential: ProjectContent = {
  slug:       'cybersential',
  title:      'CYBERSENTIAL',
  resolution: '1440 × 900',
  /* Corrected 2026-08-21. This was filed as "a cybersecurity platform for
     small and medium businesses", which it is not: it is hospitality-
     specific, and it reaches its customers through HBX Group rather than
     being sold to SMBs at large. Sourced from the live product page at
     hotelbeds.wallbid.io/cybersential. */
  description:
    'A cyber risk assessment built at Wallbid for hotels, and offered to HBX Group partners across Europe at preferential rates through a strategic alliance. It covers dark-web monitoring, external vulnerability scanning, blacklist checks and email-authentication hardening, with the security work itself carried out by Safestate. I designed both halves: the partner-facing site that explains and sells the service, and the web app hotels use to manage their cover. It was drawn white-label from the start — built to be re-skinned for whichever brand distributes it — and what went live wears Wallbid\'s identity carrying elements of the partner\'s.',
  metadata: {
    role: 'Product Designer at Wallbid — white-label design for the partner-facing site and the insurance management web app.',
    categories: ['PRODUCT DESIGN', 'WEB DESIGN', 'DESIGN SYSTEM'],
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
