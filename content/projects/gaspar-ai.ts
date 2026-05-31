import type { ProjectContent } from './types';

const gasparAi: ProjectContent = {
  slug:       'gaspar-ai',
  title:      'GASPAR AI',
  resolution: '1440 × 900',
  description:
    'A generative AI employee help desk company that I completely redesigned. From logotype, product design and brand identity to conversational AI flows and a custom-made character mascot.',
  metadata: {
    role: 'Lead Designer.',
    categories: ['PRODUCT DESIGN', 'BRAND DESIGN', 'CONVERSATIONAL DESIGN'],
    employer: 'GASPAR AI',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/gaspar/gaspar-01.png', alt: 'Gaspar AI — 01' },
        { src: '/images/projects/gaspar/gaspar-02.png', alt: 'Gaspar AI — 02' },
        { src: '/images/projects/gaspar/gaspar-03.png', alt: 'Gaspar AI — 03' },
      ],
    },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/gaspar/gaspar-04.png', alt: 'Gaspar AI — 04' },
        { src: '/images/projects/gaspar/gaspar-05.png', alt: 'Gaspar AI — 05' },
        { src: '/images/projects/gaspar/gaspar-06.png', alt: 'Gaspar AI — 06' },
        { src: '/images/projects/gaspar/gaspar-07.png', alt: 'Gaspar AI — 07' },
        { src: '/images/projects/gaspar/gaspar-08.png', alt: 'Gaspar AI — 08' },
        { src: '/images/projects/gaspar/gaspar-09.png', alt: 'Gaspar AI — 09' },
        { src: '/images/projects/gaspar/gaspar-10.png', alt: 'Gaspar AI — 10' },
        { src: '/images/projects/gaspar/gaspar-11.png', alt: 'Gaspar AI — 11' },
        { src: '/images/projects/gaspar/gaspar-12.png', alt: 'Gaspar AI — 12' },
        { src: '/images/projects/gaspar/gaspar-13.png', alt: 'Gaspar AI — 13' },
        { src: '/images/projects/gaspar/gaspar-14.png', alt: 'Gaspar AI — 14' },
        { src: '/images/projects/gaspar/gaspar-15.png', alt: 'Gaspar AI — 15' },
        { src: '/images/projects/gaspar/gaspar-16.png', alt: 'Gaspar AI — 16' },
        { src: '/images/projects/gaspar/gaspar-17.png', alt: 'Gaspar AI — 17' },
        { src: '/images/projects/gaspar/gaspar-18.png', alt: 'Gaspar AI — 18' },
        { src: '/images/projects/gaspar/gaspar-19.png', alt: 'Gaspar AI — 19' },
        { src: '/images/projects/gaspar/gaspar-20.png', alt: 'Gaspar AI — 20' },
        { src: '/images/projects/gaspar/gaspar-21.png', alt: 'Gaspar AI — 21' },
        { src: '/images/projects/gaspar/gaspar-22.png', alt: 'Gaspar AI — 22' },
      ],
    },

    {
      type: 'scrollVideo',
      src:  '/images/projects/gaspar/gaspar-video-1.mp4',
    },

    { type: 'divider' },

    {
      type: 'disclaimer',
      text: 'Parts of this project are covered by NDA. What\'s here is a selection of the work I\'m cleared to share — the full scope goes considerably further.',
    },

    { type: 'divider' },

    {
      type: 'scrollVideo',
      src:  '/images/projects/gaspar/gaspar-ai-video2.mp4',
    },

    { type: 'moreProjects' },
  ],
};

export default gasparAi;
