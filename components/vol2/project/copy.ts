/**
 * THE WORDS. One project at a time, written with George.
 *
 * `layout.ts` says what shape a page is. This says what it says. A project
 * with no entry here falls back to the lorem in `vol2Projects.ts`, so the
 * file fills up one page at a time with nothing half-written in between.
 *
 * ── the chips are drafts too ──────────────────────────────────────────
 * The section labels in `layout.ts` are read off George's canvas, and he has
 * since confirmed they are working titles rather than final: *"we can change
 * the wording 'The Design proccess' as well, it's just a placeholder."* So a
 * section here may override its chip. Where `chip` is absent the layout's
 * own label stands.
 *
 * ── the rule that made this file necessary ────────────────────────────
 * Project copy already lives in three places — `data/projects.json`,
 * `content/projects/*.ts` and `components/vol2/project/projects.ts` — and a
 * correction to one is not a correction. That is how Gaspar AI came to be
 * described as an "AI-powered insurance assistant" on every card for months
 * while the paragraph underneath said help desk. Vol 2 reads THIS file and
 * nothing else. When the old routes go, the others go with them.
 *
 * ── how long a line is allowed to be ──────────────────────────────────
 * Not a style preference — the template sets the limit twice over.
 *
 *   beside pictures   **up to 45 words.** Tried at 10-15 first and George
 *                     called it: *"make the paragraphs next to the images
 *                     bigger, max 45 words, cuz it does not make sense now."*
 *                     Ten words in a 432 column beside a 538-tall video is a
 *                     caption with a paragraph's worth of space under it.
 *   full width        about **20**, because it sets at 72/80 across the whole
 *                     1320. Forty words there is nine lines of display type
 *                     and stops being a statement.
 *
 * ── the voice ─────────────────────────────────────────────────────────
 * Plain, spoken English. George, on the first draft: *"I feel that the texts
 * are hard to read. Let's have a more human like and simple way of
 * communicating."* He was right — it was written like an essay.
 *
 * What that means in practice, because "be simple" is not an instruction:
 *
 *   - Say **I**. He did the work; the page is him talking about it.
 *   - Whole sentences with verbs in them. "A dated brand, a logo with no
 *     idea behind it" is a headline, not something a person says.
 *   - One idea per sentence. No stacking clauses behind an em-dash.
 *   - Ordinary words. "How everything worked on smaller screens", not
 *     "responsive behaviour". "Gets back on track when it misunderstands",
 *     not "recovers from understanding the wrong one".
 *   - No aphorisms. "Gaspar stopped being a word and became a character"
 *     sounds clever and tells you nothing.
 *
 * This is a portfolio, not a manifesto. It should read like him explaining
 * the work across a table.
 *
 * NOTHING HERE IS INFERRED. Every line comes from George in conversation,
 * and anything he has not said stays lorem until he does.
 */

/**
 * Chip renames that apply to EVERY page.
 *
 * `layout.ts` stays a faithful read of the canvas; the renames live here with
 * the rest of the writing, because that is what they are. George:
 * *"Change brief to Overview everywhere."*
 *
 * `proccess` is a typo on the canvas, not a house style.
 */
export const CHIP_RENAMES: Record<string, string> = {
  Brief: 'Overview',
  'The Design proccess': 'Design process',
  /* sentence case, like every other chip in the set */
  'Conversational Design': 'Conversational design',
};

/**
 * A chip never opens with "The" — George, 2026-09-17: *"Remove the 'The' from
 * all the Chips."*
 *
 * Right call, and it is a UX-writing one rather than a stylistic one. These
 * are navigation labels: the sticky header reads the current one out as you
 * scroll, and a reader skims the set to decide whether to keep going. An
 * article in front of every item makes them all start the same way, which is
 * the one thing a scannable list must not do. "Challenge, Brand, Website"
 * reads as a list; "The challenge, The brand, The Website" reads as prose
 * chopped up.
 */
export const dropArticle = (chip: string) => {
  const bare = chip.replace(/^The\s+/, '');
  /* Capitalise, because the canvas does not. George typed "The challenge"
     and "The brand" with a lower-case second word — invisible while the
     article carried the capital, and "challenge" sitting next to "Overview"
     the moment it went. Only the first letter is touched, so a product name
     inside a chip survives. */
  return bare.charAt(0).toUpperCase() + bare.slice(1);
};

export interface SectionCopy {
  /** replaces the working label in `layout.ts` */
  chip?: string;
  /**
   * The paragraph — or ONE PER GROUP where a single chip covers several.
   * Mood is the only one so far: "The brand" runs over onboarding,
   * exploring, profile and cinema, four paragraphs under one label.
   */
  text: string | string[];
  /**
   * The arrow-led lines, where a section has a list to give.
   *
   * Absent falls back to the design's count as placeholders; an EMPTY ARRAY
   * removes them. Both are needed — the design puts two lines under most
   * sections, and only some of those sections turn out to have anything to
   * enumerate.
   */
  bullets?: string[];
}

export interface ProjectCopy {
  /** the line under the title on the base, 16/24 — what the project IS */
  subtitle: string;
  meta: { client: string; role: string; deliverables: string };
  /**
   * One entry per block in `LAYOUT[slug].blocks`, in order, `null` where the
   * block is a picture slot with no words of its own. Positional rather than
   * keyed by chip, because two sections can carry the same label — Gaspar has
   * two called "The Website vol2" and Benefit two called "The Design
   * proccess" — and a key would silently collapse them.
   */
  sections: (SectionCopy | null)[];
}

export const COPY: Record<string, ProjectCopy> = {
  /* ── Rounded Typeface — written 2026-09-17 ──────────────────────────
     Personal work, and the pair to the angular one. Same invented-name
     story applies: the live vol1 file calls this "Loukoumi" and explains
     the name. It has none.

     What he was after: *"soft and friendly"* — the opposite of the other
     one, which he wanted aggressive and unstable. Two sentences, one each,
     and the specimens do the rest. */
  'rounded-typeface': {
    subtitle: 'A display face with no straight edges left in it. Personal work.',
    meta: {
      client: 'Personal project',
      role: 'Visual Designer',
      deliverables: '1 typeface',
    },
    sections: [
      {
        // Overview
        text: 'I wanted something soft and friendly.',
      },
      {
        chip: 'Letters',
        text:
          'Fat, rounded and closed up, with the counters squeezed almost shut. ' +
          'Set solid it reads as one soft mass rather than a row of letters, ' +
          'which is the point of it.',
        bullets: [],
      },
    ],
  },

  /* ── Angular Typeface — written 2026-09-17 ──────────────────────────
     Personal work.

     THE NAMES ON FILE ARE INVENTED. `content/projects/custom-typefaces.ts`
     titles this pair "LOUKOUMI & SEISMOS" and tells a story about Loukoumi
     being named for what a grandmother hands you. George: *"no they don't
     have names, that was invented."* That file is live on vol1; vol2 reads
     only from here.

     Titled for what they are, at his request — Angular and Rounded — and
     the slugs moved with them, from /typeface-a and /typeface-b.

     What he was after: *"something aggressive and unstable."* */
  'angular-typeface': {
    subtitle: 'A display face built out of diagonal cuts. Personal work.',
    meta: {
      client: 'Personal project',
      role: 'Visual Designer',
      deliverables: '1 typeface',
    },
    sections: [
      {
        // Overview
        text: 'I wanted something aggressive and unstable.',
      },
      {
        /* One specimen sheet. No arrows — nothing to enumerate. */
        chip: 'Letters',
        text:
          'Every letter is cut on the diagonal, so nothing sits level and no ' +
          'two edges agree. Heavy enough to hold a poster on its own, and ' +
          'uncomfortable at any size.',
        bullets: [],
      },
    ],
  },

  /* ── In Pixels We See — written 2026-09-17 ──────────────────────────
     Personal work. Five posters: Mona Lisa, Witches' Sabbath, Birth of
     Venus, Creation of Adam, Water Lilies.

     The title was "pixels" in SOURCES, lower case. Every poster carries IN
     PIXELS WE SEE along its top edge, so the h1 does too now.

     THE IDEA IS HIS, and it is not the one on file. The stored record says
     colour alone carries the painting — the Creation of Adam stays
     majestic, the Mona Lisa stays enigmatic. George: *"this was an
     experimentation of colors mainly, by simplifying the colors to solid
     pixels that do not blend yet create the image... the other was from the
     other session."* So the page is about how the eye assembles colour, not
     about paintings being timeless.

     And per his standing note: the page does NOT mention that this restages
     an exercise he first did at college. */
  'in-pixels-we-see': {
    subtitle:
      'Five famous paintings rebuilt out of solid colour, one block at a ' +
      'time.',
    meta: {
      client: 'Personal project',
      role: 'Visual Designer',
      deliverables: '5 posters',
    },
    sections: [
      {
        // Overview
        text:
          'An experiment with colour. Simplify a painting down to solid ' +
          'pixels that never blend, and the picture still arrives.',
      },
      null, // the animation, full width
      {
        /* Five posters, not directions. No arrows — five titles will not fit
           in two lines. */
        chip: 'Posters',
        text:
          'The Mona Lisa, Witches\' Sabbath, the Birth of Venus, the Creation ' +
          'of Adam, Water Lilies. Each one is only the colours it is made of, ' +
          'squared off and laid flat, with nothing left to do the drawing.',
        bullets: [],
      },
    ],
  },

  /* ── Czech Image — written 2026-09-17 ───────────────────────────────
     2019. Posters for the CZECH IMAGE PROJECT, run by the Czech Centres —
     the Czech foreign ministry's cultural arm — to mark a hundred years
     since the founding of Czechoslovakia. Open to art and design students
     and graduates under 35; a Czech-Greek jury picked the Greek winner,
     whose poster joined the international exhibition in Prague.

     GEORGE WON IT. *"these poster where designed for CZECHIMAGE 2019 GREECE
     where i placed 1rst."* First place in Greece, and it appears nowhere in
     any stored record — the project did not even have a name. An earlier
     session called it "Czech Folk" after the folder, which is why the slug
     was /czech-folk until now.

     The brief was "Czechia" and "The Czechs through my eyes", so the three
     posters are three answers to it.

     NOTE: `image 03.png` is a blank 800x800 RGBA export — fully
     transparent, nothing in it. The folk poster exists on the page only as
     the animation until George re-exports it. */
  'czech-image': {
    subtitle:
      "Posters for the Czech Centres' competition marking a hundred years of " +
      'Czechoslovakia. First place in Greece.',
    meta: {
      client: 'Czech Centres',
      role: 'Visual Designer',
      deliverables: '3 posters',
    },
    sections: [
      {
        // Overview
        /* His wording, with "counties" corrected to "countries". The point
           of the change is that the competition ran across ten countries and
           he answered it as the Greek entry — which is what makes placing
           first mean something. */
        text:
          'The Czech Centres asked designers across countries in Europe to ' +
          'draw Czechia through their own eyes. I answered three times in ' +
          'Greece.',
      },
      null, // the folk pattern, animated, full width
      {
        /* Three posters, not directions. No arrows: three things do not fit
           in two lines. */
        chip: 'Posters',
        text:
          'One takes Czech folk ornament and lets it bloom. One sets Prague in ' +
          'a display face drawn for it. One turns the Astronomical Clock into ' +
          'a graphic of its own, under the words Timeless Place.',
        bullets: [],
      },
    ],
  },

  /* ── Cabaret Movie Poster — written 2026-09-17 ──────────────────────
     Personal work. An alternative poster for Bob Fosse's Cabaret, 1972.

     George called it *"an experimental project"* and did not offer a thesis,
     so the page does not build one for him. What he did confirm: *"the drop
     falls on the dancer. It's based on the story of the movie cabaret."*
     That is the whole idea and it is enough — the poster is doing the
     explaining, which is what a poster is for. */
  cabaret: {
    subtitle:
      "An alternative poster for Bob Fosse's Cabaret, 1972.",
    meta: {
      client: 'Personal project',
      role: 'Visual Designer',
      deliverables: '2 posters',
    },
    sections: [
      {
        // Overview
        text:
          'Berlin keeps dancing while something else arrives above it. That is ' +
          'the film, and it is the poster.',
      },
      null, // the poster, full width
      {
        /* Two posters, not two directions — and no arrows, because nothing
           here is a list. */
        chip: 'Posters',
        text:
          'The dancer is upside down, mid-movement, and the swastika above her ' +
          'lets one drop fall onto her. In the second the symbol takes the ' +
          'whole sheet and the title sits over it. Black, white and one red.',
        bullets: [],
      },
    ],
  },

  /* ── Tarot Cards — written 2026-09-17 ───────────────────────────────
     Personal work. A full Major Arcana, 22 cards, of which eight are on the
     page and all 22 are in the full-deck shot.

     THE TITLE said "Tarrot", with two Rs, in the h1. Not a word, and the
     same class of error as DEERISLD. The export folder still carries the
     misspelling; the title does not.

     What it is, in his words: *"a personal project about queerness, the
     male body, patterns, nature."* */
  arcana: {
    subtitle:
      'A personal Major Arcana: twenty-two cards about queerness, the male ' +
      'body, pattern and nature.',
    meta: {
      client: 'Personal project',
      role: 'Illustrator',
      deliverables: '22 cards',
    },
    sections: [
      {
        // Overview
        text:
          'A tarot deck I drew for myself. Queerness, the male body, pattern ' +
          'and nature, twenty-two cards deep.',
      },
      null, // the full deck, full width
      {
        /* The eight stills are cards, not directions — and naming the chip
           "Major Arcana" tells a reader both what they are looking at and
           that there are twenty-two of them. No arrows: the paragraph lists
           four things, not two. */
        chip: 'Major Arcana',
        text:
          'The Fool, the Magician, the High Priestess, the Lovers, Strength. ' +
          'Every card keeps its meaning and finds a body for it — a panther, a ' +
          'flamingo, sunflowers over a scar, a harness, somebody asleep.',
        bullets: [],
      },
    ],
  },

  /* ── Danai Michali — written 2026-09-17 ─────────────────────────────
     Freelance, and ONGOING — he still makes her posts.

     THE LOGO IS NOT A MONOGRAM. I read the fine line on the card as an
     interlocked ΔΜ and George corrected it: *"where is the monogram? the
     logo is like a window to the therapy, an arch with the name and inside
     it a very simplified abstract floral, earthy element that looked like
     rorschach test."* The fine line I misread is a CHAIR, on the info side
     of the card. Rorschach inside something earthy is a better idea than
     the one I invented for it.

     The social work: *"more than 30 posts... carousels where the first
     image is an illustration in the same look and feel and then typography
     cards that explain that post's topic."* The ten stills here are the
     opening illustrations. */
  'danai-michali': {
    subtitle:
      'Logo, cards and an ongoing run of social posts for a systemic ' +
      'counsellor.',
    meta: {
      client: 'Danai Michali',
      role: 'Brand Designer',
      deliverables: 'Logo, cards and social media',
    },
    sections: [
      /* The array is positional against LAYOUT.blocks, and this page OPENS
         with a picture — media, Overview, media, posts. Without the nulls the
         words slid up two places and the social paragraph landed on the
         Overview at 72/80. */
      null, // the card, full width
      {
        // Overview — it sits between the two shots of the card
        text:
          'Danai is a systemic counsellor. Her mark is an arch with a floral ' +
          'shape inside it — a window into the therapy.',
      },
      null, // the card again, full width
      {
        /* The ten stills are social posts, not directions — the sixth canvas
           chip in thirteen pages that did not match its contents. And the
           arrows have a real job here for once: the carousel IS a two-part
           structure, so the paragraph sets up a list and the arrows deliver
           it. */
        chip: 'Social media',
        text:
          'The shape inside is simplified far enough to read as a Rorschach ' +
          'blot, which is deliberate. The posts carry the same look — over ' +
          'thirty of them now, one topic at a time, each opening with its own ' +
          'illustration.',
        bullets: ['An illustration to open', 'Typography cards that explain it'],
      },
    ],
  },

  /* ── Vasiliki Vozora — written 2026-09-17 ───────────────────────────
     Freelance. Βασιλική Βοζώρα, Σύμβουλος Ψυχικής Υγείας, specialising in
     systemic and family counselling for individuals, couples, families and
     groups — read off the card.

     THE STORED RECORD MISSED HALF THE JOB. It describes cards, mauve and
     uncoated stock and nothing else; the second section is a WEBSITE, and
     George confirmed the job was *"logo, cards and website."* Both sections
     were chipped "The Directions" on the canvas, which is wrong twice over —
     they are not directions and a reader saw the same label in a row.

     The mark, in his words: *"a delicate next to a font, a calm familiar
     face, like the face of the therapist."*

     No arrows: neither section enumerates anything. See `bullets`. */
  'vasiliki-vozora': {
    subtitle:
      'Logo, cards and a website for a systemic and family counsellor.',
    meta: {
      client: 'Vasiliki Vozora',
      role: 'Brand Designer',
      deliverables: 'Logo, cards and website',
    },
    sections: [
      {
        // Overview
        text:
          'Vasiliki is a mental health counsellor. She works with individuals, ' +
          'couples, parents, families and groups.',
      },
      {
        chip: 'Identity',
        text:
          'The mark is a face, drawn delicately in a single line and set ' +
          'beside the name. Calm and familiar, the way the therapist is — you ' +
          'are looking at someone before you have read a word. Dusty mauve ' +
          'against a warm off-white.',
        bullets: [],
      },
      {
        chip: 'Website',
        text:
          'The site opens on the line that does the work: taking care of ' +
          'yourself starts with a conversation. Everything else — who she ' +
          'sees, how it works, how to reach her — sits under it.',
        bullets: [],
      },
    ],
  },

  /* ── Olga Posonidou — written 2026-09-17 ────────────────────────────
     Freelance. Olga Posonidou, psychotherapist and social worker —
     Ψυχοθεραπεύτρια, Κοινωνική λειτουργός, Συντονίστρια Ομάδων, Σχολών &
     Γονέων, read off the card. The stored record said her practice covers
     "groups, relationships and parenting"; the card says schools, not
     relationships.

     TWO directions, both his:
       the hands — *"like an open hug waiting for you"*
       the line  — *"Η θεραπεία δεν είναι μία ευθεία"*, and the wandering
                   line draws Ο Π, her initials
     The line is the one she chose.

     Deliverables stop at logo and business cards. "Visual identity" would
     oversell five images of a mark and a card system. */
  'olga-posonidou': {
    subtitle:
      'Logo and cards for a psychotherapist, from two ideas about what ' +
      'therapy looks like.',
    meta: {
      client: 'Olga Posonidou',
      role: 'Brand Designer',
      deliverables: 'Logo and business cards',
    },
    sections: [
      {
        // Overview
        text:
          'Olga is a psychotherapist and social worker. She works with ' +
          'groups, with schools and with parents.',
      },
      {
        /* The two directions, and which one ran — the same honesty as
           Deerislnd. */
        text:
          'I drew two. Open hands with a green dot between them, an open hug ' +
          'waiting for you. Or a single line that wanders before it settles, ' +
          'because therapy is not a straight one, and on the way it draws her ' +
          'initials. She chose the line.',
        bullets: ['An open hug waiting for you', 'Therapy is not a straight line'],
      },
    ],
  },

  /* ── To Nixteri Book — written 2026-09-17 ───────────────────────────
     Freelance. Το νυχτέρι by Λευτέρης Σουκουλδάνος, Πρότυπες Εκδόσεις Πηγή,
     115pp, ISBN 978-960-626-954-7. Client name in Latin characters at
     George's request.

     THE AUTHOR'S NAME: my own note had "Σουλτάνογλου" and the stored record
     had "Σουκουλδάνος". The cover artwork settled it — ΛΕΥΤΕΡΗΣ
     ΣΟΥΚΟΥΛΔΑΝΟΣ — and pigi.gr confirms. Read the artwork, not the notes.

     The concept, in his words: *"7 women, 7 stories, 7 woman figures. Each
     one has the proper symbol on each apron according to the story."* The
     book opens with kyra-Rinio's death and the nixteri held for her — an
     all-night vigil of women, where her life comes back through their
     stories. So the figures on the cover are the cast, not a border. */
  'book-cover': {
    subtitle:
      'Cover and visual identity for To Nixteri, a collection of seven ' +
      'stories, built from Balkan folk embroidery.',
    meta: {
      client: 'Lefteris Soukouldanos',
      role: 'Visual Designer',
      deliverables: 'Cover and book visual identity',
    },
    sections: [
      {
        /* Overview — the plot, because the plot IS the concept.

           NOT "telling her story". George: *"they do not tell 'her story'.
           more like με αφορμή την πεθαμένη λένε ιστορίες."* The dead woman
           is the occasion, not the subject — each of the seven tells her
           own, which is exactly why each figure carries a different symbol.
           The publisher's blurb says her life comes back through their
           memories, which is looser than the book. */
        text:
          'A woman dies, and the women who knew her sit up all night telling ' +
          'stories. Seven women, seven stories.',
      },
      {
        text:
          'So the cover is the seven of them. One figure, rebuilt seven times, ' +
          'each with the symbol of her own story stitched on her apron — ' +
          'bread, a cross, a horse, a bird. They are not decoration, they are ' +
          'the seven women.',
        bullets: ['Seven women, seven stories', 'A symbol on every apron'],
      },
      {
        /* The challenge, his answer: real research into Greek, Balkan and
           Slavic folk pattern, and *"tried to produce something that respects
           their rules as much as possible. And i tried to keep the
           cross-stitch feeling."* Working inside a craft's grammar rather
           than borrowing its look. */
        text:
          'I researched real Greek, Balkan and Slavic folk patterns and worked ' +
          'inside their rules, so it reads as cross-stitch rather than an ' +
          'imitation.',
      },
    ],
  },

  /* ── Deerislnd Posters — written 2026-09-17 ─────────────────────────
     Freelance. Deerislnd played the This is Athens City Festival at Theatro
     Dora Stratou, 16 May 2026, free entrance.

     THE NAME IS "Deerislnd". The project title said "DEERISLD", the festival
     site writes "Deer Islnd", and the posters themselves say DEERISLND —
     George settled it, and the title is corrected. Getting a client's name
     wrong on the page showing their posters is the worst kind of typo.

     Two sections already had real words on his canvas rather than lorem, and
     they are kept close to as written: "We had 2 different visual direction"
     with its two arrows, and "A custom display font with masking an arial
     view of the actual theatre" — arial corrected to aerial.

     The festival's own numbers (350,000 visitors, 380 events, 186 locations
     in May 2026) are the festival's to claim, so they are not here. */
  deerislnd: {
    subtitle:
      'Posters for a music duo playing the This is Athens City Festival, at ' +
      'the Dora Stratou theatre.',
    meta: {
      client: 'Deerislnd',
      role: 'Visual Designer',
      deliverables: 'Poster and social media materials',
    },
    sections: [
      {
        // Overview
        text:
          'Deerislnd played the This is Athens City Festival at Theatro Dora ' +
          'Stratou, a place rooted in Greek folk dance.',
      },
      null, // the animated poster, full width
      {
        /* The challenge, his answer: *"the challenge was the tight
           deadline... if i remember corectly 2 to 3 days."* The number is
           what makes it worth a section — every project claims a tight
           deadline, and two full directions inside three days is a fact. */
        text:
          'Two or three days from brief to poster. I still drew two full ' +
          'directions in that time.',
      },
      {
        /* His line was "A deep research and experimentation on both aspects
           of this event." Both aspects = the venue and the night, which is my
           reading of it rather than his words. */
        text:
          'The theatre is rooted in Greek folk dance and the music is not. I ' +
          'looked at both sides of that before drawing anything, because the ' +
          'poster had to belong to the venue and to the night at the same time.',
      },
      {
        /* His own text, and the arrows are his. The last sentence is the part
           worth saying out loud: *"the folk illustrations are my personal
           favorites but this won."* A two-direction story is only honest if
           it says which one you would have picked. */
        text:
          'We went in two directions and drew them both out properly rather ' +
          'than picking one on paper. The folk illustrations were my ' +
          'favourite. The typographic one is what ran.',
        bullets: ['Folk illustrations', 'Clash of fonts'],
      },
      {
        text:
          'A custom display font, masking an aerial view of the theatre ' +
          'itself. You read the name and see the place at the same time.',
      },
    ],
  },

  /* ── Benefit Apps — written 2026-09-17 ──────────────────────────────
     Holy, 2021-22, for Benefit Software S.M.P.C. of Piraeus (benefit.gr) —
     ERP built exclusively for shipping. Same credit shape as Istorima at
     George's request, but with a split the other pages do not have: the
     mobile app was his alone, the suite was the team's.

     `data/projects.json` still calls this "Employee benefits management app
     redesign", which an early session invented by reading the company's
     NAME as a common noun. It is shipping software.

     No numbers: benefit.gr claims 1,700+ vessels and 5,000+ active users,
     which are the client's to claim and not from 2021 anyway. */
  benefit: {
    subtitle:
      'ERP for shipping companies: every ship, every cargo, every crew ' +
      'member. I designed the mobile app and parts of the suite.',
    meta: {
      client: 'Benefit Software',
      role: 'UX Designer @ Holy',
      deliverables: 'The mobile app, and parts of the suite as part of the team',
    },
    sections: [
      {
        // Overview
        text:
          'Shipping companies run on Benefit: where every ship is, what it is ' +
          'carrying, and who is on board.',
      },
      {
        /* The mobile app — his alone. Group names read off the wireframe:
           Log In Process, Dashboard Alternatives, Messages/Notifications,
           Submission List, Quick Search & Actions, Main Pages. */
        chip: 'Mobile app',
        text:
          'I was the only designer on the mobile app. Login, dashboards, ' +
          'messages and notifications, submissions, quick search — the whole ' +
          'thing in a phone, for people whose work does not happen at a desk.',
      },
      {
        /* The suite — a team effort, and it LEADS with that. George asked
           twice: *"we need to tell that it was a team effort"* on Istorima,
           then *"let's make sure that the suit was team project"* here,
           because the first draft put it mid-sentence as "I worked as part of
           the team", which reads as a turn of phrase rather than a fact. The
           chip says contribution rather than ownership for the same reason.
           His list: *"the messaging system, some dashboards, components."* */
        chip: 'Across the suite',
        text:
          'The suite was a team project. My part was the messaging system, ' +
          'some of the dashboards, and components that other people then built ' +
          'with.',
      },
      {
        /* The breadth, which is MY reading of his answer rather than his own
           words — he described what the suite covers, not what was hard. */
        text:
          'Everything a shipping company knows sits in one product: ships, ' +
          'cargo, routes, crews, and the full history of every person.',
      },
    ],
  },

  /* ── Istorima — written 2026-09-17 ──────────────────────────────────
     Holy (holy.gd), 2021-22. Client is Istorima; Holy is the employer.

     A TEAM PROJECT, and it has to say so — George: *"deliverables platform,
     but we need to tell that it was a team effort."* The stored record was
     corrected once already for claiming "the full product and visual
     identity", so the credit is in the copy rather than left to a reader's
     assumption.

     No numbers. archive.istorima.org publishes 10,215 stories, 727
     researchers and 8,770 locations, but those are 2026 figures for work
     done in 2021-22, and they are the archive's to claim. "Thousands" is
     true then and now. */
  istorima: {
    subtitle:
      "Greece's archive of oral history. Thousands of recorded accounts, and " +
      'a way to find the one you want.',
    meta: {
      client: 'Istorima',
      role: 'UX Designer @ Holy',
      deliverables: 'Platform design, as part of the team',
    },
    sections: [
      {
        // Overview
        text:
          "Istorima is Greece's archive of oral history: thousands of recorded " +
          'accounts, gathered by researchers all over the country.',
      },
      {
        /* What he worked on, in his own list, with the team credit first
           rather than buried. Both sides of the product — the public archive
           and the tool researchers catalogue with, which is the screen
           showing Interview Data, Media & Locations, Indexing and Syncing. */
        text:
          'This was a team project at Holy. I worked on the researchers upload ' +
          'platform, the homepage, the search and filtering, the categories ' +
          'and the library components — both sides of it, the public archive ' +
          'and the tool researchers catalogue with.',
      },
      {
        /* The challenge, his words: *"the biggest challenge was the amount of
           content and the filtering."* */
        text:
          'The amount of it. Thousands of recordings, and the filtering is ' +
          'what decides whether any one of them can be found.',
      },
    ],
  },

  /* ── Mood: Music of our desire — written 2026-09-17 ──────────────────
     Oct 2025 - May 2026, and it has ENDED: *"the collaboration with mood
     ended on june 1."* His CV says May 2026; either way it is past tense.
     He was the only designer there.

     The old record calls it "Greece's biggest underground music event
     platform"; the screens also show Amsterdam, so the superlative is left
     out. `data/projects.json` still says "Emotional wellbeing tracking app
     concept", which an early session invented.

     THE PAGE HAS FOUR GROUPS under one chip — onboarding, exploring,
     profile, cinema — which is why `text` is an array here. See
     `layout.ts`. */
  mood: {
    subtitle:
      'An underground music events platform. I redesigned the whole app and ' +
      'took it beyond music into theatre and cinema.',
    meta: {
      client: 'Mood: Music of Our Desire',
      role: 'Lead Product Designer',
      /* his own CV wording: "From UX flows to UI, marketing materials, and
         external collaborations" */
      deliverables: 'App redesign, UX flows and UI, marketing materials, festival posters',
    },
    sections: [
      {
        // Overview
        text:
          'Mood is where you find out what is on tonight: the parties, the ' +
          'venues, the people going.',
      },
      {
        /* Was "The brand", which undersold it — George: *"the 20 screens are
           the app redesign where i revisited both colors and typography."*

           Four paragraphs, one per group. The first carries the principle he
           gave for the whole redesign: *"the visual focus and the main
           colorfull aspect of the app should be the content, posters and
           visuals of the events, not the ui."* */
        chip: 'App redesign',
        text: [
          'The interface had to get out of the way. Every event comes with a ' +
            'poster, and the posters are loud, so I took the colour out of the ' +
            'UI and let the artwork carry it. That starts at the first screen.',
          'Exploring is the heart of it: what is on, where, and who is ' +
            'playing. I rebuilt the browsing so a poster is the thing you see ' +
            'first, and the text only tells you what you still need to know.',
          'Your profile holds what you are going to and what you have saved. ' +
            'It is the one part of the app that is about you rather than about ' +
            'the city.',
          'When I arrived Mood only did music. By the time I left it did ' +
            'theatre and cinema too, which meant the same screens had to hold a ' +
            'film listing as comfortably as a club night.',
        ],
      },
    ],
  },

  /* ── Cybersential — written 2026-09-17 ──────────────────────────────
     Wallbid, 2024-25. Live at hotelbeds.wallbid.io/cybersential.

     HOTELS AND HBX STAY OUT OF IT. The stored record led with "a cyber risk
     assessment built at Wallbid for hotels, offered to HBX Group partners",
     and the live page is hotel-framed throughout — but that page sits on a
     partner subdomain, and George redirected: *"it doesnt have to do with
     hotels... let's focus on the cyber security of the product."* So the
     page is about what the product does, not who distributes it.

     Every service named here is on the live page: dark web monitoring,
     vulnerability scanning, blacklist monitoring, SPF/DMARC/DKIM. The
     prices, the thirty-day payment link and the domain counters are off the
     screens themselves. */
  cybersential: {
    subtitle:
      'A cyber risk assessment for businesses: dark web leaks, vulnerability ' +
      'scans, blacklists and email fraud, in one subscription.',
    meta: {
      client: 'Wallbid',
      role: 'Product Designer',
      deliverables: 'The whole platform design',
    },
    sections: [
      {
        // Overview
        text:
          'Cybersential watches a business for the things it cannot see: ' +
          'leaked data, open vulnerabilities, blacklisted domains, spoofed ' +
          'email.',
      },
      {
        /* The challenge, in his words: *"the client wanted something easy
           that anyone could understand but at the same time this was not
           complaiant with legal - so i had to balance."* */
        text:
          'The client wanted language anyone could understand. Legal would not ' +
          'allow it. Most of the work was between those two.',
      },
      {
        /* Design process — read off the map itself, which groups into Sales
           flow, Wallet and Email, and is mostly the screens nobody
           advertises. Two separate sets of terms and conditions is the
           challenge made visible. */
        text:
          'The map has three parts: the selling site, the wallet and the ' +
          'emails. Most of it is not the main route through — two sets of ' +
          'terms and conditions, a privacy notice, FAQs, session and error ' +
          'screens, and a setup template for every service.',
      },
      {
        // Sales flow
        text:
          'You read what it does, pick a plan, enter your company details for ' +
          'the invoice, and get a payment link. You can pay now or keep the ' +
          'link and pay within thirty days, which is when the subscription ' +
          'starts.',
      },
      {
        /* Wallet. The same shape as Cancellation Insurance: you have bought
           something and it does nothing until you tell it what to watch. The
           counters on screen are literal — 0/4 domains, 0/5 websites. */
        text:
          'Buying it is not the same as having it. In the wallet you tell each ' +
          'service what to watch — which domains, which inboxes — and verify ' +
          'them. Nothing runs until they are all set up, so the wallet counts ' +
          'what is still missing.',
      },
      {
        // Complexity — three parties again, his answer
        text:
          'Wallbid built it, Safestate ran the security, and a partner sold ' +
          'it. Every decision had to suit all three.',
      },
    ],
  },

  /* ── Cancellation Insurance — written 2026-09-17 ────────────────────
     Wallbid, 2024-25. Live with Eurolife FFH, and George cleared their name
     staying visible in the Useful Documents list on screen 5: *"the project
     is live with eurolife ff so let's keep it."*

     The product calls itself "My Travel Wallet" on screen; the old record
     files it as Cancellation Wallet; George's canvas titles the page
     Cancellation Insurance. The page keeps his title. */
  'cancellation-wallet': {
    subtitle:
      'Travel insurance you get by ticking a box on a hotel booking. This is ' +
      'where you manage it.',
    meta: {
      client: 'Wallbid',
      role: 'Product Designer',
      deliverables: 'The whole platform design',
    },
    sections: [
      {
        // Overview
        text:
          'Tick the insurance box when you book a hotel, and an email brings ' +
          'you here to manage what you bought.',
      },
      null, // the Figma loop, full width
      {
        /* The challenge, and it is a good one — George: *"some users got
           there only after something happened, some set up everything
           before."* The people who most need the product prepared least. */
        text:
          'Some people set everything up in advance. Others arrive only after ' +
          'something has gone wrong, with nothing filled in.',
      },
      {
        /* Design process. Same shape as Piraeus: the constraint is
           compliance, not screen count. *"in order to do the claim
           everything has to be set up in order to be compliant with the
           insurance company."* Every requirement named here is visible in
           the screens — guests, consents, one guest per room. */
        text:
          'You cannot file a claim until the policy is complete: every guest ' +
          'named, every consent accepted, every room assigned. That is the ' +
          "insurer's requirement. The flow is built to get people through it " +
          'early, and to get them through it fast when they have not.',
      },
      {
        /* Was "The solution", which George rejected: *"i'm not sure that
           solution is the best wording - here i have some of the pages of
           that product more or less categorised in different sections of the
           platform."* They are pages from across the product rather than one
           argument, so the chip says so — and borrows the product's own name
           off the screen. */
        chip: 'Inside the wallet',
        text:
          'There is no app to download and no password to remember. The email ' +
          'drops you in, a code verifies you, and from there you find your ' +
          'booking, say which room you are in, add the people staying with ' +
          'you, and submit.',
      },
      {
        // Complexity — the many-parties problem plus the white-label
        text:
          'Every booking carries different cover from a different insurer, and ' +
          'the platform is rebranded for each partner selling it.',
      },
    ],
  },

  /* ── BancaSure360 — written 2026-09-17 ──────────────────────────────
     Wallbid, 2024-25. A product of theirs sold to banks, not a commission.

     NAME NO BANK. The screens carry Attica, ETHNIKI and Piraeus in a payment
     dropdown, and they are demonstrations of the white-label skin rather
     than live deals — Attica was a real client but the deal is not live.
     George's rule holds: Piraeus is the only engagement he states outright,
     and it has its own page. The dashboard screens are skinned "The Bank",
     which is the honest way to show it. */
  bancasure360: {
    subtitle:
      'A platform banks use to sell insurance. One product for every bank, ' +
      'wearing whichever brand is selling it.',
    meta: {
      client: 'Wallbid',
      role: 'Product Designer',
      deliverables: 'The whole platform design',
    },
    sections: [
      {
        // Overview
        text:
          'Bank employees sell insurance here, manage their clients and handle ' +
          'claims. Their managers see the same work from above.',
      },
      {
        // Design process — the two canvas maps
        text:
          'I designed the whole platform: quotes, applications, the basket, ' +
          'customer overviews, claims, and a different view for every level of ' +
          'manager. Each of those brings its own modals and in-between states, ' +
          'which is most of what you see mapped here.',
      },
      {
        /* Complexity. On this page and Cancellation Insurance it is the
           white-label on top of the three-way balancing — George: *"only in
           BancaSure360 & Cancellation Insurance had the added complexity
           that needed to be white labeled."* Asked whether a bank's brand
           ever broke a screen: *"no, nothing broke - the system was solid."*
           Which is the claim worth making, so it is the last clause. */
        text:
          'The same platform carries whichever bank is selling it. Colours, ' +
          'logo, typography and some flows change, and the system holds.',
      },
      {
        /* Was "Various insurance products", which was wrong — the nine
           screens are dashboards, and the first is a seller's targets view.
           George: *"these are the dashboards and the different views per user
           role."* */
        chip: 'Dashboards by role',
        text:
          'Three kinds of person use this: the employee selling policies, ' +
          'their manager, and the manager above that. Each gets a different ' +
          'dashboard and different powers, built from the same parts so the ' +
          'product still feels like one thing.',
      },
    ],
  },

  /* ── Piraeus Insurance — written 2026-09-17 ─────────────────────────
     Wallbid, 2024-25. The ONE client George can name outright: *"Only
     piraeus is a deal i can say with confident."*

     What can be shown: not much of the product, because most of it has not
     launched. *"i can not go in a lot details cuz not everything is online
     yet."* Focus on You is the exception — it is live on the bank's own
     site, so it can be named and described.

     Insurer names stay out of the WORDS. They are all over the app screens,
     and George cleared those to stay ("leave them") because a product
     anyone can buy in the Piraeus app is public, whichever brand is on it.
     The flow map was different: ERGO appeared there as his own working
     annotation, and it is blurred. */
  'piraeus-insurance': {
    /* NOT the staff-facing tool. That is BancaSure360, a different project —
       George: *"the tool that the bank's own staff use to sell them is the
       bancasure360."* The claim was mine, from the old vol1 record, which
       says he did "the customer-facing insurance flows AND the internal
       interface used by their employees" and conflates the two. He confirmed
       it as a deliverable before either of us noticed it came from my guess
       rather than from him. */
    subtitle:
      'Insurance flows inside the Piraeus Bank app and website, for products ' +
      'the bank sells through its partners.',
    meta: {
      client: 'Piraeus Bank',
      role: 'Product Designer',
      deliverables: 'Customer-facing insurance flows for the app and website',
    },
    sections: [
      {
        // Overview
        text:
          'Piraeus Bank sells insurance it does not underwrite. I designed how ' +
          'customers buy it, in the app and online.',
      },
      {
        /* Design process — the flow map. NOT about removing steps, which is
           the first thing anyone reaches for and is wrong here. George:
           *"here we need to focus on the complaiance of all these big
           companies and the streamlining of that instead of removing."* You
           cannot shorten a regulated financial product; the craft is making
           a process that is fixed in length still feel simple. */
        text:
          'Insurance and banking have compliance rules you cannot design ' +
          'away. Every flow had to carry everything the bank and each insurer ' +
          'are required to ask. I mapped them, then worked on order and ' +
          'wording so the process felt simple even though nothing could be cut.',
      },
      {
        // Various insurance products — phone, pet, cyber
        text:
          'The bank sells several products through its partners: phone cover, ' +
          'pet cover, cyber cover and more. Each one comes from a different ' +
          'insurer with its own rules, so each needed its own flow while still ' +
          'feeling like the same app.',
      },
      {
        /* Challenge = the SITUATION. Complexity, four sections down, is the
           daily work. Both came out of one answer from George and would
           otherwise have said the same thing twice. */
        text:
          'Piraeus cannot sell insurance on its own, and the partners it needs ' +
          'run old systems with workflows that do not bend.',
      },
      {
        /* Was "Phone insurance" on the canvas, which was wrong — phone, pet
           and cyber are all in the section above. George: *"yes rename it to
           Focus on You."* */
        chip: 'Focus on You',
        text:
          'Focus on You is health cover, and the one product here that is ' +
          'already live. You can buy it inside the Piraeus app or e-banking in ' +
          'a few steps, with no medical history check and no waiting.',
      },
      {
        // Complexity = the daily work
        text:
          "Every screen had to satisfy three sides at once: the bank's sales " +
          "targets, each insurer's fixed process, and what we could build.",
      },
    ],
  },

  /* ── Gaspar AI — written 2026-09-17 ─────────────────────────────────
     Sep 2022 – Jan 2024, his own employer rather than a client.

     NDA, in his words: *"I can not share the actual design of the Admin
     portal — I could if I redesigned it though — and I can not share in any
     way what was the integrating process between Gaspar AI and all the
     integrations."* So the platform is named as work done and never
     described, no screen of it appears, and the word "integration" does not
     go near how any of it was wired. The dialogue-flow diagrams are cleared:
     he confirmed they are the conversational work, not the portal. */
  'gaspar-ai': {
    subtitle:
      'A generative AI help desk for IT and HR teams. I redesigned the brand, ' +
      'the product and the way it talks.',
    meta: {
      client: 'Gaspar AI',
      role: 'Lead Product Designer',
      deliverables:
        'Brand identity, logotype, mascot, marketing website ×2, product design, conversational design',
    },
    sections: [
      {
        // Overview — full width, 72/80, so it is a statement and not a paragraph
        text:
          'Gaspar AI answers IT and HR questions for employees, right inside ' +
          'Slack or Teams, without anyone opening a ticket.',
      },
      null, // the Figma loop, full width
      {
        /* The challenge. George asked for the previous designer to be left
           out of it — the state of the work is the point, not who made it. */
        text:
          'The brand felt old, the logo said nothing about what the product ' +
          'did, and the product had grown without a plan.',
      },
      {
        // The brand — the 11 stills
        text:
          'I changed the name and the logo together. Gaspardesk fit a helpdesk ' +
          'but nothing wider, so we became Gaspar AI — a name that could grow ' +
          'with the product. I turned Gaspar into a character, with a smaller ' +
          'robot for each automation it could run.',
      },
      {
        /* Was "The Design proccess" on the canvas. George wanted a section
           saying everything was designed with purpose — which is what every
           designer claims and none can prove. He agreed the scale is the
           checkable version: *"the scale is the story — one designer, whole
           product from scratch."* The picture argues it; the words say what
           the picture cannot. */
        /* Was "The scale of it", which was mine and not good. This is the
           section a recruiter is looking for and it had no word for itself:
           the chips run Overview, Challenge, Brand, ?, Website, Website vol2,
           Conversational Design, and the gap is the product work — the core
           of the job the page is applying for. Name the discipline. */
        chip: 'Product design',
        text:
          'I was the only designer, and I drew every screen from scratch over ' +
          'sixteen months — the components, how everything worked on smaller ' +
          'screens, and the prototypes the developers built from. The biggest ' +
          'part of the work is under NDA.',
      },
      {
        /* "Website" and "Website vol2" named the artefact, not the work — and
           a reader skimming the chips saw the same word twice and read it as a
           repeat. These say there is a before and an after worth stopping for. */
        chip: 'First website',
        text:
          'The company needed a site to send people to while the rest was ' +
          'being rebuilt. I built it around the new name, the new logo and ' +
          'Gaspar. Every other AI company looked like enterprise software, so ' +
          'I made ours playful.',
        /* No list to give, so no arrows. See `bullets` on `SectionCopy`. */
        bullets: [],
      },
      {
        chip: 'Website one year on',
        text:
          'A year later the site could not hold everything we had added. There ' +
          'was much more product to explain, so I rebuilt it bigger and ' +
          'calmer. The playfulness is still there, just quieter. It supports ' +
          'the work now instead of leading it.',
        bullets: [],
      },
      {
        // Conversational Design — the two dialogue-manager diagrams
        text:
          'I worked with the AI engineers on how Gaspar talks. I mapped out ' +
          'how a conversation can go: where it splits, what happens when ' +
          'someone asks about two things at once, and how it gets back on ' +
          'track when it misunderstands.',
      },
    ],
  },
};
