import type { ProjectContent } from './types';

const piraeusInsurance: ProjectContent = {
  slug:       'piraeus-insurance',
  title:      'PIRAEUS BANK',
  resolution: '1440 × 900',
  description:
    'As an intermediate designer between the bank and their insurance partners, I was responsible for the customer-facing insurance flows of the Piraeus app/website and the internal interface used by their employees.',
  metadata: {
    role: 'Product Designer at Wallbid.',
    categories: ['PRODUCT DESIGN', 'UX DESIGN'],
    employer: 'WALLBID',
  },
  sections: [
    { type: 'divider' },

    // ── App — light (left) / dark (right), 12 screens, scroll-linked ─────────
    {
      type: 'scrollSequencePair',
      left: [
        { src: '/images/projects/piraeus/app-light-1.jpg',  alt: 'Piraeus Insurance app — light mode, screen 1'  },
        { src: '/images/projects/piraeus/app-light-2.jpg',  alt: 'Piraeus Insurance app — light mode, screen 2'  },
        { src: '/images/projects/piraeus/app-light-3.jpg',  alt: 'Piraeus Insurance app — light mode, screen 3'  },
        { src: '/images/projects/piraeus/app-light-4.jpg',  alt: 'Piraeus Insurance app — light mode, screen 4'  },
        { src: '/images/projects/piraeus/app-light-5.jpg',  alt: 'Piraeus Insurance app — light mode, screen 5'  },
        { src: '/images/projects/piraeus/app-light-6.jpg',  alt: 'Piraeus Insurance app — light mode, screen 6'  },
        { src: '/images/projects/piraeus/app-light-7.jpg',  alt: 'Piraeus Insurance app — light mode, screen 7'  },
        { src: '/images/projects/piraeus/app-light-8.jpg',  alt: 'Piraeus Insurance app — light mode, screen 8'  },
        { src: '/images/projects/piraeus/app-light-9.jpg',  alt: 'Piraeus Insurance app — light mode, screen 9'  },
        { src: '/images/projects/piraeus/app-light-10.jpg', alt: 'Piraeus Insurance app — light mode, screen 10' },
        { src: '/images/projects/piraeus/app-light-11.jpg', alt: 'Piraeus Insurance app — light mode, screen 11' },
        { src: '/images/projects/piraeus/app-light-12.jpg', alt: 'Piraeus Insurance app — light mode, screen 12' },
      ],
      right: [
        { src: '/images/projects/piraeus/app-dark-1.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 1'   },
        { src: '/images/projects/piraeus/app-dark-2.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 2'   },
        { src: '/images/projects/piraeus/app-dark-3.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 3'   },
        { src: '/images/projects/piraeus/app-dark-4.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 4'   },
        { src: '/images/projects/piraeus/app-dark-5.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 5'   },
        { src: '/images/projects/piraeus/app-dark-6.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 6'   },
        { src: '/images/projects/piraeus/app-dark-7.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 7'   },
        { src: '/images/projects/piraeus/app-dark-8.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 8'   },
        { src: '/images/projects/piraeus/app-dark-9.jpg',   alt: 'Piraeus Insurance app — dark mode, screen 9'   },
        { src: '/images/projects/piraeus/app-dark-10.jpg',  alt: 'Piraeus Insurance app — dark mode, screen 10'  },
        { src: '/images/projects/piraeus/app-dark-11.jpg',  alt: 'Piraeus Insurance app — dark mode, screen 11'  },
        { src: '/images/projects/piraeus/app-dark-12.jpg',  alt: 'Piraeus Insurance app — dark mode, screen 12'  },
      ],
    },

    { type: 'divider' },

    {
      type: 'textBlock',
      body: 'The interface supports both light and dark modes — because banking doesn\'t keep office hours, and a design that only works in daylight isn\'t finished.',
    },

    { type: 'divider' },

    {
      type: 'disclaimer',
      text: 'Parts of this project are not live yet and some screens are covered by NDA. What\'s shown here is the portion I\'m cleared to share.',
    },

    { type: 'divider' },

    // ── Web — 4 screens, scroll-linked ───────────────────────────────────────
    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/piraeus/web%201.jpg', alt: 'Piraeus Insurance web — screen 1' },
        { src: '/images/projects/piraeus/web%202.jpg', alt: 'Piraeus Insurance web — screen 2' },
        { src: '/images/projects/piraeus/web%203.jpg', alt: 'Piraeus Insurance web — screen 3' },
        { src: '/images/projects/piraeus/web%204.jpg', alt: 'Piraeus Insurance web — screen 4' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default piraeusInsurance;
