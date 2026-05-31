import type { ProjectContent } from './types';

const logoDesigns: ProjectContent = {
  slug:       'logo-designs',
  title:      'BRAND IDENTITIES',
  resolution: '1440 × 900',
  description:
    'A selection of brand work cases for different professionals. Each project started with a strategic brief and ended with a complete visual identity: logo, brand system, website.',
  metadata: {
    role:       'Brand Designer — concept, strategy, and refinement.',
    categories: ['BRAND DESIGN'],
    employer:   'VARIOUS',
  },
  sections: [
    { type: 'divider' },

    // ── Apple-style scroll narrative ─────────────────────────────────────────
    // Olga & Vozora → 'showcase' variant: label above, image at natural aspect ratio.
    // Maria         → 'split' variant: label left/right, image carousel fills a fixed box.
    // Vozora video  → scrollWeight:5 means 500 vh of scroll, currentTime scrubbed by scroll.
    {
      type: 'logoStoryteller',
      projects: [
        {
          variant: 'showcase',
          media: [
            { kind: 'image', src: '/images/projects/logo-designs/olga-poso-1.jpg', alt: 'Olga Posonidou brand identity'   },
            { kind: 'image', src: '/images/projects/logo-designs/olga-poso-2.jpg', alt: 'Olga Posonidou stationery'        },
            { kind: 'image', src: '/images/projects/logo-designs/olga-poso-3.jpg', alt: 'Olga Posonidou brand application' },
          ],
          label:    'COUNSELING',
        },
        {
          variant: 'showcase',
          media: [
            { kind: 'image', src: '/images/projects/logo-designs/maria-fits-1.jpg', alt: 'Maria Fitsopoulou logo'         },
            { kind: 'image', src: '/images/projects/logo-designs/maria-fits-2.jpg', alt: 'Maria Fitsopoulou brand'        },
            { kind: 'image', src: '/images/projects/logo-designs/maria-fits-3.jpg', alt: 'Maria Fitsopoulou identity'     },
            { kind: 'image', src: '/images/projects/logo-designs/maria-fits-4.jpg', alt: 'Maria Fitsopoulou application' },
          ],
          label:    'DENTIST',
        },
        {
          variant: 'showcase',
          media: [
            { kind: 'image', src: '/images/projects/logo-designs/vozora-1.jpg', alt: 'Basiliki Vozora brand identity'  },
            { kind: 'image', src: '/images/projects/logo-designs/vozora-2.jpg', alt: 'Basiliki Vozora brand materials' },
            // Video — scroll scrubs currentTime, user must scroll 500 vh to watch it all
            { kind: 'video', src: '/images/projects/logo-designs/vozora-03-preview.mp4', poster: '/images/projects/logo-designs/vozora-1.jpg', scrollWeight: 5 },
          ],
          label:    'COUNSELING',
        },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default logoDesigns;
