import type { ProjectContent } from './types';

const bookCover: ProjectContent = {
  slug:       'book-cover',
  title:      'BOOK COVER',
  resolution: '1440 × 900',
  description:
    'A freelance book cover commission for a short story collection. I researched the visual language of Balkan folklore symbolism and worked closely with the author to find imagery that clearly captures the essence of the book.',
  metadata: {
    role: 'Art Director & Graphic Designer.',
    categories: ['GRAPHIC DESIGN', 'ART DIRECTION'],
    employer: 'FREELANCE',
  },
  sections: [
    { type: 'divider' },

    {
      type: 'scrollSequence',
      images: [
        { src: '/images/projects/book/book-01.png', alt: 'Book Cover — 01' },
        { src: '/images/projects/book/book-02.png', alt: 'Book Cover — 02' },
        { src: '/images/projects/book/book-03.png', alt: 'Book Cover — 03' },
        { src: '/images/projects/book/book-04.png', alt: 'Book Cover — 04' },
        { src: '/images/projects/book/book-05.png', alt: 'Book Cover — 05' },
        { src: '/images/projects/book/book-06.png', alt: 'Book Cover — 06' },
        { src: '/images/projects/book/book-07.png', alt: 'Book Cover — 07' },
        { src: '/images/projects/book/book-08.png', alt: 'Book Cover — 08' },
        { src: '/images/projects/book/book-10.png', alt: 'Book Cover — 10' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default bookCover;
