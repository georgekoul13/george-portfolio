import type { ProjectContent } from './types';

const holyProjects: ProjectContent = {
  slug:        'holy-projects',
  title:       'HOLY',
  resolution:  '1440 × 900',
  description:
    'Creative agency. Part of a team responsible for designing various platforms including Istorima archive and Benefit to name a few.',
  metadata: {
    role:       'UX Designer — from junior to main design position.',
    categories: ['UX DESIGN', 'PRODUCT DESIGN'],
    employer:   'HØLY™',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/holy-projects/holy-projects-01.png', alt: 'Holy — screen 1'  },
        { src: '/images/projects/holy-projects/holy-projects-02.png', alt: 'Holy — screen 2'  },
        { src: '/images/projects/holy-projects/holy-projects-03.png', alt: 'Holy — screen 3'  },
        { src: '/images/projects/holy-projects/holy-projects-04.png', alt: 'Holy — screen 4'  },
        { src: '/images/projects/holy-projects/holy-projects-05.png', alt: 'Holy — screen 5'  },
        { src: '/images/projects/holy-projects/holy-projects-06.png', alt: 'Holy — screen 6'  },
        { src: '/images/projects/holy-projects/holy-projects-07.png', alt: 'Holy — screen 7'  },
        { src: '/images/projects/holy-projects/holy-projects-08.png', alt: 'Holy — screen 8'  },
        { src: '/images/projects/holy-projects/holy-projects-09.png', alt: 'Holy — screen 9'  },
        { src: '/images/projects/holy-projects/holy-projects-10.png', alt: 'Holy — screen 10' },
        { src: '/images/projects/holy-projects/holy-projects-11.png', alt: 'Holy — screen 11' },
        { src: '/images/projects/holy-projects/holy-projects-12.png', alt: 'Holy — screen 12' },
        { src: '/images/projects/holy-projects/holy-projects-13.png', alt: 'Holy — screen 13' },
        { src: '/images/projects/holy-projects/holy-projects-14.png', alt: 'Holy — screen 14' },
        { src: '/images/projects/holy-projects/holy-projects-15.png', alt: 'Holy — screen 15' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default holyProjects;
