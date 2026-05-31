import type { ProjectContent } from './types';

const mood: ProjectContent = {
  slug:       'mood',
  title:      'MOOD',
  resolution: '1440 × 900',
  description:
    'Greece\'s biggest underground music event platform. I redesigned the entire app introducing new features across event discovery, venue exploration and editorial content.',
  metadata: {
    role: 'Lead Product Designer.',
    categories: ['PRODUCT DESIGN', 'MOBILE'],
    employer: 'MUSIC OF OUR DESIRE',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/mood/mood-01.png', alt: 'Mood — 01' },
        { src: '/images/projects/mood/mood-02.png', alt: 'Mood — 02' },
        { src: '/images/projects/mood/mood-03.png', alt: 'Mood — 03' },
        { src: '/images/projects/mood/mood-04.png', alt: 'Mood — 04' },
        { src: '/images/projects/mood/mood-05.png', alt: 'Mood — 05' },
        { src: '/images/projects/mood/mood-06.png', alt: 'Mood — 06' },
        { src: '/images/projects/mood/mood-07.png', alt: 'Mood — 07' },
        { src: '/images/projects/mood/mood-08.png', alt: 'Mood — 08' },
        { src: '/images/projects/mood/mood-09.png', alt: 'Mood — 09' },
        { src: '/images/projects/mood/mood-10.png', alt: 'Mood — 10' },
        { src: '/images/projects/mood/mood-11.png', alt: 'Mood — 11' },
        { src: '/images/projects/mood/mood-12.png', alt: 'Mood — 12' },
        { src: '/images/projects/mood/mood-13.png', alt: 'Mood — 13' },
        { src: '/images/projects/mood/mood-14.png', alt: 'Mood — 14' },
        { src: '/images/projects/mood/mood-15.png', alt: 'Mood — 15' },
        { src: '/images/projects/mood/mood-16.png', alt: 'Mood — 16' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default mood;
