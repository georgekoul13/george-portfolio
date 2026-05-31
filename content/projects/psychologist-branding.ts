import type { ProjectContent } from './types';

const psychologistBranding: ProjectContent = {
  slug:       'psychologist-branding',
  title:      'SOCIAL MEDIA BRANDING',
  resolution: '1440 × 900',
  description:
    'Design of the complete visual identity and a series of illustrated social media posts for a mental health counselor.',
  metadata: {
    role: 'Brand & Social Media Designer.',
    categories: ['BRAND DESIGN', 'ILLUSTRATION'],
    employer: 'FREELANCE',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/psychologist-branding/danai-01.png', alt: 'Danai — 01' },
        { src: '/images/projects/psychologist-branding/danai-02.png', alt: 'Danai — 02' },
        { src: '/images/projects/psychologist-branding/danai-03.png', alt: 'Danai — 03' },
        { src: '/images/projects/psychologist-branding/danai-04.png', alt: 'Danai — 04' },
        { src: '/images/projects/psychologist-branding/danai-05.png', alt: 'Danai — 05' },
        { src: '/images/projects/psychologist-branding/danai-06.png', alt: 'Danai — 06' },
        { src: '/images/projects/psychologist-branding/danai-07.png', alt: 'Danai — 07' },
        { src: '/images/projects/psychologist-branding/danai-08.png', alt: 'Danai — 08' },
        { src: '/images/projects/psychologist-branding/danai-09.png', alt: 'Danai — 09' },
        { src: '/images/projects/psychologist-branding/danai-10.png', alt: 'Danai — 10' },
        { src: '/images/projects/psychologist-branding/danai-11.png', alt: 'Danai — 11' },
        { src: '/images/projects/psychologist-branding/danai-12.png', alt: 'Danai — 12' },
        { src: '/images/projects/psychologist-branding/danai-13.png', alt: 'Danai — 13' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default psychologistBranding;
