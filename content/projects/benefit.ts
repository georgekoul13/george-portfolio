import type { ProjectContent } from './types';

const benefit: ProjectContent = {
  slug:       'benefit',
  title:      'BENEFIT',
  resolution: '1440 × 900',
  description:
    'I designed Benefit — an employee benefits platform that simplifies the selection, activation, and tracking of workplace benefits in a single card-based wallet. The product spans health insurance, gym memberships, meal vouchers, and learning budgets, giving employees a clear view of the full value their employer provides.',
  metadata: {
    role: 'Lead Product Designer — design strategy, end-to-end product design, and design system.',
    categories: ['PRODUCT DESIGN', 'HR TECH'],
    employer: 'EMPLOYEE BENEFITS',
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
