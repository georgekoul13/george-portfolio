import type { ProjectContent } from './types';

const bancasure360: ProjectContent = {
  slug:       'bancasure360',
  title:      'BANCASURE360',
  resolution: '1440 × 900',
  /* NAME NO BANK HERE. Several screens are branded — Attica, ΕΘΝΙΚΗ, and
     Piraeus in a payment dropdown — but they are demonstrations of the
     white-label skin, not claims of live deals. Piraeus is the only
     engagement George will state with confidence, and it has its own
     project. */
  description:
    'A B2B bancassurance platform built at Wallbid: one place for banks, brokers and distributors to sell insurance products, set up contracts, track sales performance by store or by employee, and manage their users — a product that has to serve a branch manager and a network-wide administrator equally well. It is white-labeled, so the same platform carries whichever brand is selling it, and the screens here show it wearing a few of them.',
  metadata: {
    role: 'Lead Product Designer — advisor dashboard, client portfolios, and customer-facing flows.',
    categories: ['PRODUCT DESIGN', 'UX DESIGN'],
    employer: 'WALLBID',
  },
  sections: [
    { type: 'divider' },

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

    { type: 'moreProjects' },
  ],
};

export default bancasure360;
