import type { ProjectContent } from './types';

const illustrations: ProjectContent = {
  slug:       'creative-projects',
  title:      'MISCELLANEOUS',
  resolution: '1440 × 900',
  /* Was the catch-all for all 21 files in `creatives/`. The festival
     posters, the Arcana deck and In Pixels We See are their own projects
     now, which leaves this holding two pieces. Thin — see the note to
     George; it may not warrant a page of its own. */
  description:
    'Odds and ends: an alternative poster for Bob Fosse\'s Cabaret, and a folk pattern study.',
  metadata: {
    role: 'Illustrator & Graphic Designer.',
    categories: ['ILLUSTRATION', 'ART DIRECTION'],
    employer: 'FREELANCE',
  },
  sections: [
    { type: 'divider' },
    {
      type: 'imageGrid',
      cols: 2,
      images: [
        { src: '/images/projects/creatives/creative-18.png', alt: 'Cabaret — alternative film poster' },
        { src: '/images/projects/creatives/creative-21.png', alt: 'Folk pattern study' },
      ],
    },
  ],
};

export default illustrations;
