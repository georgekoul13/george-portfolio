import type { ProjectContent } from './types';

const benefit: ProjectContent = {
  slug:       'benefit',
  title:      'BENEFIT',
  resolution: '1440 × 900',
  /* Benefit Software builds ERP and communication tools for shipping —
     office and onboard. Two separate pieces of work sit behind this page and
     the credit distinguishes them deliberately: the Suite was a team effort
     where George owned the library and the templates, while the companion
     app was his alone with art direction from his manager. Overstating
     either would be the easiest thing in the world and the least useful. */
  description:
    'Benefit Software makes the ERP and communication tools that shipping companies run on, ashore and at sea. Working at Holy, I was part of the design team on Benefit Suite, where the library and the suite\'s templates were mine — the components and layouts everything else was assembled from. Alongside it I designed the companion app, as the only designer on it, with art direction from my manager.',
  metadata: {
    role: 'UX Designer at Holy — design library and templates for Benefit Suite; sole designer on the companion app.',
    categories: ['PRODUCT DESIGN', 'DESIGN SYSTEM'],
    employer: 'HØLY™',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'gallery',
      rows: [
        {
          type: 'fullImage',
          src:  '/images/projects/benefit/cover.jpg',
          alt:  'Benefit — employee benefits wallet and activation platform',
        },
        {
          type: 'imageGrid',
          cols: 2,
          images: [
            { src: '/images/projects/benefit/detail-1.jpg', alt: 'Benefits wallet with active perks and usage tracking' },
            { src: '/images/projects/benefit/detail-2.jpg', alt: 'Benefit selection and onboarding flow for new employees' },
          ],
        },
      ],
    },

    { type: 'divider' },

    {
      type: 'textBlock',
      body: 'Most employees never know the full value of their benefits package — the information is buried in PDF handbooks, scattered across separate vendor portals, and forgotten after the first week. The design challenge for Benefit was making the invisible visible: surfacing the real monetary and lifestyle value of what employees are entitled to, without overwhelming them. Activation was designed to feel like a reward rather than an administrative task — each benefit had its own card, its own activation moment, and its own clear indication of what it unlocked. The system reduced HR support requests and increased benefit utilisation across every client that piloted it.',
    },

    { type: 'divider' },

    {
      type: 'gallery',
      rows: [
        {
          type: 'imageGrid',
          cols: 2,
          images: [
            { src: '/images/projects/benefit/footer-1.jpg', alt: 'HR admin dashboard with workforce benefits overview' },
            { src: '/images/projects/benefit/footer-2.jpg', alt: 'Individual benefit detail and redemption interface' },
          ],
        },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default benefit;
