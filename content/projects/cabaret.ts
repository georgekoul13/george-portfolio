import type { ProjectContent } from './types';

/**
 * Split out of the `illustrations` catch-all on 2026-08-21 — George's call
 * that one-offs get their own pages rather than a leftovers drawer.
 *
 * ASSUMPTION FLAGGED: filed as personal work. An alternative poster for a
 * 1972 film is almost certainly self-initiated, but he has not said so.
 */
const cabaret: ProjectContent = {
  slug:       'cabaret',
  title:      'CABARET',
  resolution: '1440 × 900',
  description:
    'An alternative poster for Bob Fosse\'s Cabaret. The film watches Weimar Berlin carry on dancing while the Nazis close in around it, and the poster puts that in a single image: a figure upended mid-movement, white against black, with the swastika above it letting one drop fall.',
  metadata: {
    role: 'Concept and design.',
    categories: ['POSTER DESIGN', 'PERSONAL WORK'],
    employer: 'PERSONAL',
  },
  sections: [
    { type: 'divider' },
    {
      type: 'fullImage',
      src: '/images/projects/creatives/creative-18.png',
      alt: 'Cabaret — alternative film poster',
    },
  ],
};

export default cabaret;
