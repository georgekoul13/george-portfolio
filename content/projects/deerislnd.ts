import type { ProjectContent } from './types';

/**
 * Split out of `music-festivals` on 2026-08-21 at George's request. That
 * project was two unrelated campaigns wearing one name: this one, and Athens
 * Goes Mayan at OAKA.
 */
const deerislnd: ProjectContent = {
  slug:       'deerislnd',
  title:      'DEERISLND',
  resolution: '1440 × 900',
  description:
    'A run of nights at Theatro Dora Stratou, the Athens theatre built for Greek folk dance — so the campaign takes the folk language literally and rebuilds it. Traditional embroidery motifs are redrawn as pixels and set loose across the posters: the same symbols the theatre has danced to for seventy years, reassembled for a line-up that is anything but traditional. "The dance never stopped, the music just changed." Art direction and design through Mood.',
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
        { src: '/images/projects/creatives/creative-03.png', alt: 'DEERISLND — The New Folk' },
        { src: '/images/projects/creatives/creative-04.png', alt: 'DEERISLND — The New Folk' },
        { src: '/images/projects/creatives/creative-01.png', alt: 'DEERISLND — Theatro Dora Stratou' },
        { src: '/images/projects/creatives/creative-02.png', alt: 'DEERISLND — The dance never stopped' },
      ],
    },
  ],
};

export default deerislnd;
