import type { ProjectContent } from './types';

/**
 * Split out of the `logo-designs` bucket on 2026-08-21 — one brand, one page.
 * There is also a video, `vozora-03-preview.mp4`, which the v1 page scrubs on
 * scroll. The vol2 template has no video slot yet.
 */
const vasilikiVozora: ProjectContent = {
  slug:       'vasiliki-vozora',
  title:      'VASILIKI VOZORA',
  resolution: '1440 × 900',
  description:
    'Identity for Βασιλική Βοζώρα, a mental-health counsellor practising systemic and family therapy with individuals, couples and groups. A quieter register than the other practice identities: a small line-drawn face as the mark, dusty mauve against warm off-white, printed on uncoated stock and photographed under moving shadow.',
  metadata: {
    role: 'Brand Designer — concept, mark, and identity system.',
    categories: ['BRAND DESIGN'],
    employer: 'FREELANCE',
  },
  sections: [
    { type: 'divider' },
    { type: 'imageGrid', cols: 2, images: [
      { src: '/images/projects/logo-designs/vozora-1.jpg', alt: 'Vasiliki Vozora — card, face up' },
      { src: '/images/projects/logo-designs/vozora-2.jpg', alt: 'Vasiliki Vozora — card, reverse' },
    ] },
  ],
};

export default vasilikiVozora;
