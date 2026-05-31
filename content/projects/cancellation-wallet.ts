import type { ProjectContent } from './types';

const cancellationWallet: ProjectContent = {
  slug:       'cancellation-wallet',
  title:      'CANCELLATION WALLET',
  resolution: '1440 × 900',
  description:
    'A travel insurance product designed to help users manage policies end to end. Adding travellers, submitting claims and tracking progress were a few of the elements I worked on.',
  metadata: {
    role: 'Product Designer.',
    categories: ['PRODUCT DESIGN', 'MOBILE'],
    employer: 'WALLBID',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-01.jpg', alt: 'Cancellation Wallet — screen 1'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-02.jpg', alt: 'Cancellation Wallet — screen 2'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-03.jpg', alt: 'Cancellation Wallet — screen 3'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-04.jpg', alt: 'Cancellation Wallet — screen 4'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-05.jpg', alt: 'Cancellation Wallet — screen 5'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-06.jpg', alt: 'Cancellation Wallet — screen 6'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-07.jpg', alt: 'Cancellation Wallet — screen 7'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-08.jpg', alt: 'Cancellation Wallet — screen 8'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-09.jpg', alt: 'Cancellation Wallet — screen 9'  },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-10.jpg', alt: 'Cancellation Wallet — screen 10' },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-11.jpg', alt: 'Cancellation Wallet — screen 11' },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-12.jpg', alt: 'Cancellation Wallet — screen 12' },
        { src: '/images/projects/cancellation-wallet/cancellation-wallet-13.jpg', alt: 'Cancellation Wallet — screen 13' },
      ],
    },

    { type: 'divider' },

    {
      type: 'disclaimer',
      text: 'The screens shown above represent a selected portion of the product flow. The full sequence cannot be shared publicly due to a non-disclosure agreement.',
    },

    { type: 'divider' },

    { type: 'moreProjects' },
  ],
};

export default cancellationWallet;
