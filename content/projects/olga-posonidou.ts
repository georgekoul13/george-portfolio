import type { ProjectContent } from './types';

/** Split out of the `logo-designs` bucket on 2026-08-21 — one brand, one page. */
const olgaPosonidou: ProjectContent = {
  slug:       'olga-posonidou',
  title:      'OLGA POSONIDOU',
  resolution: '1440 × 900',
  description:
    'Identity and stationery for Όλγα Ποσονίδου, a psychotherapist and social worker whose practice covers groups, relationships and parenting. The mark is two open hands turned toward each other with a single green dot held between them — the thing being worked on, held rather than fixed. Cobalt and green on cream, carried across the card system.',
  metadata: {
    role: 'Brand Designer — concept, mark, and stationery.',
    categories: ['BRAND DESIGN'],
    employer: 'FREELANCE',
  },
  sections: [
    { type: 'divider' },
    { type: 'imageGrid', cols: 2, images: [
      { src: '/images/projects/logo-designs/olga-poso-2.jpg', alt: 'Olga Posonidou — the mark' },
      { src: '/images/projects/logo-designs/olga-poso-1.jpg', alt: 'Olga Posonidou — stationery' },
      { src: '/images/projects/logo-designs/olga-poso-3.jpg', alt: 'Olga Posonidou — card system' },
    ] },
  ],
};

export default olgaPosonidou;
