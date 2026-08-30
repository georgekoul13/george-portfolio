import type { ProjectContent } from './types';

/**
 * Split out of the `illustrations` catch-all on 2026-08-21. That file claimed
 * all 21 files in `creatives/`, which is really five separate bodies of work;
 * these cards are one of them.
 *
 * THE EXPORT IS A SUBSET. Figma "Files (Final)", page 1:30 "Tarrot Cards
 * (done)", holds the finished deck: 22 card fronts, two card-back designs
 * and seven style variants of one card. Only nine fronts have ever been
 * exported to `creatives/`, and they are not the strongest nine — the deck
 * also has the panther, the flamingo, the moon and a run of portraits.
 * Replace the grid below once the full set is exported.
 */
const arcana: ProjectContent = {
  slug:       'arcana',
  title:      'ARCANA',
  resolution: '1440 × 900',
  description:
    'A personal deck: the complete Major Arcana, twenty-two cards and a back, exploring queerness, nature and intimacy. Bodies, animals and night skies stand in for the traditional figures — the panther, the flamingo, the moon — and every card names itself in plate at the foot of the image, the way a deck does.',
  metadata: {
    role: 'Illustrator — concept, illustration, and card system.',
    categories: ['ILLUSTRATION', 'PERSONAL WORK'],
    employer: 'PERSONAL',
  },
  sections: [
    { type: 'divider' },
    {
      type: 'imageGrid',
      cols: 3,
      images: [
        { src: '/images/projects/creatives/creative-09.png', alt: 'Arcana — card' },
        { src: '/images/projects/creatives/creative-10.png', alt: 'Arcana — The World' },
        { src: '/images/projects/creatives/creative-11.png', alt: 'Arcana — The Devil' },
        { src: '/images/projects/creatives/creative-12.png', alt: 'Arcana — Temperance' },
        { src: '/images/projects/creatives/creative-13.png', alt: 'Arcana — The Hanged Man' },
        { src: '/images/projects/creatives/creative-14.png', alt: 'Arcana — Strength' },
        { src: '/images/projects/creatives/creative-15.png', alt: 'Arcana — The Emperor' },
        { src: '/images/projects/creatives/creative-16.png', alt: 'Arcana — The Empress' },
        { src: '/images/projects/creatives/creative-17.png', alt: 'Arcana — The Fool' },
      ],
    },
  ],
};

export default arcana;
