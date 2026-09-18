import type { ProjectContent } from './types';

const bookCover: ProjectContent = {
  slug:       'book-cover',
  title:      'BOOK COVER',
  resolution: '1440 × 900',
  /* Το νυχτέρι, Λευτέρης Σουκουλδάνος, Πρότυπες Εκδόσεις Πηγή.
     ISBN 978-960-626-954-7, 115pp, 13×18. Seven stories of Balkan tradition,
     Orthodox faith and folk imagination set in Thrace, from the Balkan Wars
     to the 1990s — which is where the embroidery language on the cover comes
     from. George: this is the cover *and* the book's visual identity, so the
     old "a book cover commission" undersold it. */
  description:
    'Το νυχτέρι — a collection of seven stories by Λευτέρης Σουκουλδάνος, published by Πρότυπες Εκδόσεις Πηγή. The book moves through Thrace from the Balkan Wars to the nineties, in a world of folk tradition, Orthodox faith and the things women did at night when nobody was watching. I designed the cover and the book\'s visual identity, building its language out of Balkan embroidery — the motifs rebuilt as a system rather than borrowed as decoration — working closely with the author to find imagery that carries the book rather than illustrating it.',
  metadata: {
    role: 'Art direction, cover, and the book\'s visual identity.',
    categories: ['EDITORIAL DESIGN', 'ART DIRECTION'],
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
