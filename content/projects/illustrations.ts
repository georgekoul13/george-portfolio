import type { ProjectContent } from './types';

const illustrations: ProjectContent = {
  slug:       'creative-projects',
  title:      'MISCELLANEOUS',
  resolution: '1440 × 900',
  description:
    'Various illustrations, music festival visuals, personal freelance projects.',
  metadata: {
    role: 'Illustrator & Graphic Designer.',
    categories: ['ILLUSTRATION', 'ART DIRECTION'],
    employer: 'FREELANCE',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/creatives/creative-01.png', alt: 'Creative — 01' },
        { src: '/images/projects/creatives/creative-02.png', alt: 'Creative — 02' },
        { src: '/images/projects/creatives/creative-03.png', alt: 'Creative — 03' },
        { src: '/images/projects/creatives/creative-04.png', alt: 'Creative — 04' },
        { src: '/images/projects/creatives/creative-05.png', alt: 'Creative — 05' },
        { src: '/images/projects/creatives/creative-06.png', alt: 'Creative — 06' },
        { src: '/images/projects/creatives/creative-07.png', alt: 'Creative — 07' },
        { src: '/images/projects/creatives/creative-08.png', alt: 'Creative — 08' },
        { src: '/images/projects/creatives/creative-09.png', alt: 'Creative — 09' },
        { src: '/images/projects/creatives/creative-10.png', alt: 'Creative — 10' },
        { src: '/images/projects/creatives/creative-11.png', alt: 'Creative — 11' },
        { src: '/images/projects/creatives/creative-12.png', alt: 'Creative — 12' },
        { src: '/images/projects/creatives/creative-13.png', alt: 'Creative — 13' },
        { src: '/images/projects/creatives/creative-14.png', alt: 'Creative — 14' },
        { src: '/images/projects/creatives/creative-15.png', alt: 'Creative — 15' },
        { src: '/images/projects/creatives/creative-16.png', alt: 'Creative — 16' },
        { src: '/images/projects/creatives/creative-17.png', alt: 'Creative — 17' },
        { src: '/images/projects/creatives/creative-18.png', alt: 'Creative — 18' },
        { src: '/images/projects/creatives/creative-19.png', alt: 'Creative — 19' },
        { src: '/images/projects/creatives/creative-20.png', alt: 'Creative — 20' },
        { src: '/images/projects/creatives/creative-21.png', alt: 'Creative — 21' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default illustrations;
