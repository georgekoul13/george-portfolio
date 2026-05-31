import type { ProjectContent } from './types';

const musicFestivals: ProjectContent = {
  slug:       'music-festivals',
  title:      'MUSIC FESTIVALS',
  resolution: '1440 × 900',
  description:
    'I created visual identity systems for music festivals across Greece — work that spans poster design, stage graphics, wristband and merchandise design, and digital assets. Each festival had its own distinct visual world, built to survive a week of weather, crowds, and chaos without losing coherence.',
  metadata: {
    role: 'Brand Designer — concept, visual identity, art direction, and production-ready assets across print, environmental, and digital media.',
    categories: ['BRAND DESIGN', 'ART DIRECTION'],
    employer: 'ENTERTAINMENT',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'gallery',
      rows: [
        {
          type: 'fullImage',
          src:  '/images/projects/music-festivals/cover.jpg',
          alt:  'Music festival visual identity — poster series and brand system overview',
        },
        {
          type: 'imageGrid',
          cols: 2,
          images: [
            { src: '/images/projects/music-festivals/detail-1.jpg', alt: 'Festival poster series with typographic identity' },
            { src: '/images/projects/music-festivals/detail-2.jpg', alt: 'Stage backdrop and large-format environmental graphics' },
          ],
        },
        {
          type: 'imageGrid',
          cols: 3,
          images: [
            { src: '/images/projects/music-festivals/detail-3.jpg', alt: 'Wristband, programme, and merchandise design' },
            { src: '/images/projects/music-festivals/detail-4.jpg', alt: 'Social media and digital asset system' },
            { src: '/images/projects/music-festivals/detail-5.jpg', alt: 'Wayfinding and site signage system' },
          ],
        },
      ],
    },

    { type: 'divider' },

    {
      type: 'textBlock',
      body: 'Festival identities are stress-tested in ways most brand work never is. The same mark has to read from fifty metres on a stage banner and hold up at actual size on a wristband. The same colour palette has to work in full sun on a bleached poster and glow on a screen in a dark tent. Building visual identities for music festivals meant designing systems that were bold enough to cut through visual noise and refined enough to reward close attention. Each festival started with a distinct personality — a musical world, a geography, an audience — and the design work was about finding the visual language that made that world legible before a single act was announced.',
    },

    { type: 'divider' },

    {
      type: 'gallery',
      rows: [
        {
          type: 'imageGrid',
          cols: 3,
          images: [
            { src: '/images/projects/music-festivals/footer-1.jpg', alt: 'Brand system applied across multiple festivals' },
            { src: '/images/projects/music-festivals/footer-2.jpg', alt: 'Ticket and lanyard design with full brand application' },
            { src: '/images/projects/music-festivals/footer-3.jpg', alt: 'Motion and animation direction for digital screens' },
          ],
        },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default musicFestivals;
