import type { ProjectContent } from './types';

/* Rebuilt 2026-08-21. Two problems with what was here.
   Its images pointed at `/images/projects/music-festivals/`, a folder that
   has never existed — the page 404'd every one of them. The posters were in
   `creatives/`, claimed by the `illustrations` catch-all.
   And the description claimed stage graphics, wristbands and merchandise.
   None of that is in any export, and an invented description is exactly how
   the Benefit entry went wrong, so the copy now covers what can be seen.
   Put the wider scope back if the assets turn up. */
const athensGoesMayan: ProjectContent = {
  slug:       'athens-goes-mayan',
  title:      'ATHENS GOES MAYAN',
  resolution: '1440 \u00d7 900',
  description:
    'Athens Goes Mayan — a PRIMER and ZAMANI run at OAKA. Mayan iconography set against the city itself: the Acropolis under a Mesoamerican sun, votive figures and stepped ornament carrying a line-up that had nothing to do with either. Art direction and design through Mood, who put me on the festival work alongside the product.',
  metadata: {
    role: 'Art direction and design, through Mood.',
    categories: ['ART DIRECTION', 'POSTER DESIGN'],
    employer: 'MOOD',
  },
  sections: [
    { type: 'divider' },
    {
      type: 'imageGrid',
      cols: 2,
      images: [
        { src: '/images/projects/creatives/creative-05.png', alt: 'Athens Goes Mayan — poster' },
        { src: '/images/projects/creatives/creative-06.png', alt: 'Athens Goes Mayan — poster' },
        { src: '/images/projects/creatives/creative-07.png', alt: 'Athens Goes Mayan — poster' },
        { src: '/images/projects/creatives/creative-08.png', alt: 'Athens Goes Mayan — poster' },
      ],
    },
  ],
};

export default athensGoesMayan;
