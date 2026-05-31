import type { ProjectContent } from './types';

const istorima: ProjectContent = {
  slug:       'istorima',
  title:      'ISTORIMA',
  resolution: '1440 × 900',
  description:
    'Istorima — from the Greek ιστορία, meaning story — is a platform that collects, archives, and publishes personal stories from communities across Greece. I designed the full product and visual identity, creating a system that treats every contribution as a piece of living cultural record.',
  metadata: {
    role: 'Lead Product Designer & Brand Designer — product design, visual identity, and editorial design system.',
    categories: ['PRODUCT DESIGN', 'BRAND DESIGN'],
    employer: 'MEDIA & CULTURE',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'gallery',
      rows: [
        {
          type: 'fullImage',
          src:  '/images/projects/istorima/cover.jpg',
          alt:  'Istorima — storytelling platform identity and editorial interface',
        },
        {
          type: 'imageGrid',
          cols: 2,
          images: [
            { src: '/images/projects/istorima/detail-1.jpg', alt: 'Story reading view with editorial typography system' },
            { src: '/images/projects/istorima/detail-2.jpg', alt: 'Story submission and community contribution interface' },
          ],
        },
      ],
    },

    { type: 'divider' },

    {
      type: 'textBlock',
      body: 'Building a platform worthy of its content meant making a series of deliberate subtractions. Personal stories deserve a design that puts words first — where navigation is invisible, the reading experience is uninterrupted, and the interface never competes with the voice of the person telling the story. The visual identity was rooted in Greek editorial tradition: strong typographic hierarchy, restraint in colour, and a grid that could hold both a single intimate paragraph and a full photo essay without strain. The submission flow was designed to feel like being listened to, not filling in a form.',
    },

    { type: 'divider' },

    {
      type: 'gallery',
      rows: [
        {
          type: 'imageGrid',
          cols: 2,
          images: [
            { src: '/images/projects/istorima/footer-1.jpg', alt: 'Brand identity and logomark system' },
            { src: '/images/projects/istorima/footer-2.jpg', alt: 'Archive browse view and story collection navigation' },
          ],
        },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default istorima;
