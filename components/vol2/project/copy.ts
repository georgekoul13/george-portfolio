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
  text: string;
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
