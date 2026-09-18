import type { ProjectContent } from './types';

const istorima: ProjectContent = {
  slug:       'istorima',
  title:      'ISTORIMA',
  resolution: '1440 × 900',
  /* Corrected 2026-08-21: this claimed "the full product and visual
     identity", which overstates it. Istorima was a team project at Holy and
     George worked across it rather than owning it. The archive's own
     published figures — stories, researchers, locations — are deliberately
     not quoted: they are today's numbers, years after the work, and they are
     the archive's to claim rather than his. */
  description:
    'Istorima Archive is Greece\'s archive of oral history — thousands of recorded personal accounts, browsable by theme, by decade and by place, gathered by researchers all over the country. I worked on it as part of the design team at Holy, across both sides of the product: the public archive people search and listen to, and the platform the researchers use to upload and catalogue what they have recorded.',
  metadata: {
    role: 'UX Designer at Holy — part of the design team, across the public archive and the researchers\' upload platform.',
    categories: ['PRODUCT DESIGN', 'UX DESIGN'],
    employer: 'HØLY™',
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
