import type { ProjectContent } from './types';

/**
 * Split out of the `illustrations` catch-all on 2026-08-21.
 *
 * George's note on framing: this restages an exercise he first did at
 * college, and he does not want the portfolio to say so. The description
 * below therefore describes the work rather than its origin — which is the
 * honest way round anyway, since what is on the page is the finished thing.
 */
const inPixelsWeSee: ProjectContent = {
  slug:       'in-pixels-we-see',
  title:      'IN PIXELS WE SEE',
  resolution: '1440 × 900',
  description:
    'Renowned paintings reimagined as pixel art — reduced to a handful of oversized blocks that hold nothing but colour and its arrangement. Take the drawing away and the painting still carries: Michelangelo\'s Creation of Adam stays majestic and divine, the Mona Lisa stays enigmatic, on colour alone. A personal exploration, each piece set against the words the painting is usually described with, and the two colours it finally comes down to.',
  metadata: {
    role: 'Concept and design.',
    categories: ['PIXEL ART', 'PERSONAL WORK'],
    employer: 'PERSONAL',
  },
  sections: [
    { type: 'divider' },
    {
      type: 'imageGrid',
      cols: 2,
      images: [
        { src: '/images/projects/creatives/creative-19.png', alt: 'In Pixels We See — Creation of Adam' },
        { src: '/images/projects/creatives/creative-20.png', alt: 'In Pixels We See — Mona Lisa' },
      ],
    },
  ],
};

export default inPixelsWeSee;
