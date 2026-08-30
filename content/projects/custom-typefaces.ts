import type { ProjectContent } from './types';

const customTypefaces: ProjectContent = {
  slug:       'custom-typefaces',
  title:      'LOUKOUMI & SEISMOS',
  resolution: '1440 × 900',
  /* Named 2026-08-21 — they had none before, and "Custom Typefaces" was a
     folder name doing duty as a title. `rounded/` is Loukoumi, `angular/` is
     Seismos. (The asset folder is spelled `cystom-typefaces`; the typo is in
     the path and therefore in the public image URLs.) */
  description:
    'Two experimental typefaces, drawn for no client but myself. Loukoumi is soft, fat and fully rounded — the warm nostalgia of 80s design, named for the thing you get handed at a grandmother\'s house. Seismos is its opposite: sliced, faceted, deliberately unbalanced, letters that refuse to sit level. One is comfort; the other is the floor moving.',
  metadata: {
    role: 'Type Designer.',
    categories: ['TYPOGRAPHY', 'TYPE DESIGN'],
    employer: 'PERSONAL',
  },
  sections: [
    { type: 'divider' },

    {
      type:     'typefaceShowcase',
      name:     'REWIND',
      variant:  'rounded',
      letters: [
        { key: 'a',        src: '/images/projects/cystom-typefaces/rounded/a.svg',   alt: 'Loukoumi — A' },
        { key: 'b',        src: '/images/projects/cystom-typefaces/rounded/b.svg',   alt: 'Loukoumi — B' },
        { key: 'c',        src: '/images/projects/cystom-typefaces/rounded/c.svg',   alt: 'Loukoumi — C' },
        { key: 'd',        src: '/images/projects/cystom-typefaces/rounded/d.svg',   alt: 'Loukoumi — D' },
        { key: 'e',        src: '/images/projects/cystom-typefaces/rounded/e.svg',   alt: 'Loukoumi — E' },
        { key: 'f',        src: '/images/projects/cystom-typefaces/rounded/f.svg',   alt: 'Loukoumi — F' },
        { key: 'g',        src: '/images/projects/cystom-typefaces/rounded/g.svg',   alt: 'Loukoumi — G' },
        { key: 'h',        src: '/images/projects/cystom-typefaces/rounded/h.svg',   alt: 'Loukoumi — H' },
        { key: 'i',        src: '/images/projects/cystom-typefaces/rounded/i.svg',   alt: 'Loukoumi — I' },
        { key: 'j',        src: '/images/projects/cystom-typefaces/rounded/j.svg',   alt: 'Loukoumi — J' },
        { key: 'k',        src: '/images/projects/cystom-typefaces/rounded/k.svg',   alt: 'Loukoumi — K' },
        { key: 'l',        src: '/images/projects/cystom-typefaces/rounded/l.svg',   alt: 'Loukoumi — L' },
        { key: 'm',        src: '/images/projects/cystom-typefaces/rounded/m.svg',   alt: 'Loukoumi — M' },
        { key: 'n',        src: '/images/projects/cystom-typefaces/rounded/n.svg',   alt: 'Loukoumi — N' },
        { key: 'o',        src: '/images/projects/cystom-typefaces/rounded/o.svg',   alt: 'Loukoumi — O' },
        { key: 'p',        src: '/images/projects/cystom-typefaces/rounded/p.svg',   alt: 'Loukoumi — P' },
        { key: 'q',        src: '/images/projects/cystom-typefaces/rounded/q.svg',   alt: 'Loukoumi — Q' },
        { key: 'r',        src: '/images/projects/cystom-typefaces/rounded/r.svg',   alt: 'Loukoumi — R' },
        { key: 's',        src: '/images/projects/cystom-typefaces/rounded/s.svg',   alt: 'Loukoumi — S' },
        { key: 't',        src: '/images/projects/cystom-typefaces/rounded/t.svg',   alt: 'Loukoumi — T' },
        { key: 'u',        src: '/images/projects/cystom-typefaces/rounded/u.svg',   alt: 'Loukoumi — U' },
        { key: 'v',        src: '/images/projects/cystom-typefaces/rounded/v.svg',   alt: 'Loukoumi — V' },
        { key: 'w',        src: '/images/projects/cystom-typefaces/rounded/w.svg',   alt: 'Loukoumi — W' },
        { key: 'x',        src: '/images/projects/cystom-typefaces/rounded/x.svg',   alt: 'Loukoumi — X' },
        { key: 'y',        src: '/images/projects/cystom-typefaces/rounded/y.svg',   alt: 'Loukoumi — Y' },
        { key: 'z',        src: '/images/projects/cystom-typefaces/rounded/z.svg',   alt: 'Loukoumi — Z' },
        { key: 'asterisk', src: '/images/projects/cystom-typefaces/rounded/_.svg',   alt: 'Asterisk glyph' },
      ],
    },

    { type: 'divider' },

    {
      type:     'typefaceShowcase',
      name:     'VERTIGO',
      variant:  'angular',
      letters: [
        { key: 'a',           src: '/images/projects/cystom-typefaces/angular/a.svg',   alt: 'Seismos — A' },
        { key: 'b',           src: '/images/projects/cystom-typefaces/angular/b.svg',   alt: 'Seismos — B' },
        { key: 'c',           src: '/images/projects/cystom-typefaces/angular/c.svg',   alt: 'Seismos — C' },
        { key: 'd',           src: '/images/projects/cystom-typefaces/angular/d.svg',   alt: 'Seismos — D' },
        { key: 'e',           src: '/images/projects/cystom-typefaces/angular/e.svg',   alt: 'Seismos — E' },
        { key: 'f',           src: '/images/projects/cystom-typefaces/angular/f.svg',   alt: 'Seismos — F' },
        { key: 'g',           src: '/images/projects/cystom-typefaces/angular/g.svg',   alt: 'Seismos — G' },
        { key: 'h',           src: '/images/projects/cystom-typefaces/angular/h.svg',   alt: 'Seismos — H' },
        { key: 'i',           src: '/images/projects/cystom-typefaces/angular/i.svg',   alt: 'Seismos — I' },
        { key: 'j',           src: '/images/projects/cystom-typefaces/angular/j.svg',   alt: 'Seismos — J' },
        { key: 'k',           src: '/images/projects/cystom-typefaces/angular/k.svg',   alt: 'Seismos — K' },
        { key: 'l',           src: '/images/projects/cystom-typefaces/angular/l.svg',   alt: 'Seismos — L' },
        { key: 'm',           src: '/images/projects/cystom-typefaces/angular/m.svg',   alt: 'Seismos — M' },
        { key: 'n',           src: '/images/projects/cystom-typefaces/angular/n.svg',   alt: 'Seismos — N' },
        { key: 'o',           src: '/images/projects/cystom-typefaces/angular/o.svg',   alt: 'Seismos — O' },
        { key: 'p',           src: '/images/projects/cystom-typefaces/angular/p.svg',   alt: 'Seismos — P' },
        { key: 'q',           src: '/images/projects/cystom-typefaces/angular/q.svg',   alt: 'Seismos — Q' },
        { key: 'r',           src: '/images/projects/cystom-typefaces/angular/r.svg',   alt: 'Seismos — R' },
        { key: 's',           src: '/images/projects/cystom-typefaces/angular/s.svg',   alt: 'Seismos — S' },
        { key: 't',           src: '/images/projects/cystom-typefaces/angular/t.svg',   alt: 'Seismos — T' },
        { key: 'u',           src: '/images/projects/cystom-typefaces/angular/u.svg',   alt: 'Seismos — U' },
        { key: 'v',           src: '/images/projects/cystom-typefaces/angular/v.svg',   alt: 'Seismos — V' },
        { key: 'w',           src: '/images/projects/cystom-typefaces/angular/w.svg',   alt: 'Seismos — W' },
        { key: 'x',           src: '/images/projects/cystom-typefaces/angular/x.svg',   alt: 'Seismos — X' },
        { key: 'y',           src: '/images/projects/cystom-typefaces/angular/y.svg',   alt: 'Seismos — Y' },
        { key: 'z',           src: '/images/projects/cystom-typefaces/angular/x-1.svg', alt: 'Letter Z' },
        { key: 'question',    src: '/images/projects/cystom-typefaces/angular/_.svg',   alt: 'Question mark glyph' },
        { key: 'exclamation', src: '/images/projects/cystom-typefaces/angular/!.svg',   alt: 'Exclamation mark' },
      ],
    },

    { type: 'moreProjects' },
  ],
};

export default customTypefaces;
