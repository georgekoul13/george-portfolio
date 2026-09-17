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
 * NOTHING HERE IS INFERRED. Every line comes from George in conversation,
 * and anything he has not said stays lorem until he does.
 */

export interface SectionCopy {
  /** replaces the working label in `layout.ts` */
  chip?: string;
  text: string;
  /** the arrow-led lines, where the design gives a section some */
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
      'A generative-AI help desk for IT and HR — and sixteen months rebuilding ' +
      'its name, its product and the way it speaks.',
    meta: {
      client: 'Gaspar AI',
      role: 'Lead Product Designer',
      deliverables:
        'Brand identity, logotype, mascot, marketing website ×2, product design, conversational design',
    },
    sections: [
      {
        // Brief
        text:
          'Gaspar AI resolves employee IT and HR requests inside Slack and ' +
          'Microsoft Teams, automatically, before they turn into tickets. I ' +
          'joined in September 2022 as its first full-time designer and stayed ' +
          'sixteen months — the brand, the product and the language the bot ' +
          'speaks were all in scope.',
      },
      null, // the Figma loop, full width
      {
        // The challenge
        text:
          'There had never been a designer in the building. The one they used ' +
          'was external, so nothing had a direction to follow: the brand was ' +
          'dated, and the logo carried no idea connecting it to what the ' +
          'product actually did. The product had grown the same way — capable, ' +
          'but assembled rather than designed. And this was 2022, before every ' +
          'company had an AI agent, so there was no template to copy and no ' +
          'expectation to meet.',
      },
      {
        // The brand — the 11 stills
        text:
          'It was called Gaspardesk: Gaspar, plus helpdesk. Clear, and that was ' +
          'the problem. It named the category the company was in rather than the ' +
          'one it was growing into, and said nothing about the AI doing the work ' +
          '— a ceiling built into the letterhead for a startup still finding its ' +
          'footing. It became Gaspar AI, with a new logotype to match. The ' +
          'founder wanted a brand more playful than the other AI companies of ' +
          'the time, so Gaspar stopped being a word and became a character, one ' +
          'that turned up doing things across our channels, with a family of ' +
          'smaller robots behind him standing for the automations he could run.',
      },
      {
        /* Was "The Design proccess" on the canvas. George wanted a section
           saying everything was designed with purpose — which is what every
           designer claims and none can prove. He agreed the scale is the
           checkable version: *"the scale is the story — one designer, whole
           product from scratch."* The picture argues it; the words say what
           the picture cannot. */
        chip: 'The scale of it',
        text:
          'Every screen was drawn from scratch by one person over sixteen ' +
          'months: the components, the responsive behaviour, and the prototypes ' +
          'the engineers built from. There was no system to inherit and nobody ' +
          'to split it with, so everything here either had a reason or did not ' +
          'get made. The largest piece is under NDA — the setup and management ' +
          'that ran semi-manually before it, rebuilt as a product.',
      },
      {
        // the first commercial site
        chip: 'The Website',
        text:
          'The first thing I made was a new commercial site, because the company ' +
          'needed somewhere to point people while everything else was being ' +
          'rebuilt. It carried the new name, the new logotype and Gaspar ' +
          'himself, and it leaned hard into the playfulness — which was the ' +
          'right bet in a category where every competitor looked like enterprise ' +
          'software.',
        bullets: ['[to write]', '[to write]'],
      },
      {
        // the same site a year on
        chip: 'The Website vol2',
        text:
          'A year later the site could not hold what the company had become. ' +
          'There was far more product to explain, so version two is much larger ' +
          '— and deliberately calmer. I pulled the playfulness back to where it ' +
          'supports the work rather than leads it: professional, still with a ' +
          'character in it.',
        bullets: ['[to write]', '[to write]'],
      },
      {
        // Conversational Design — the two dialogue-manager diagrams
        text:
          "Gaspar's replies were designed rather than written as they came up. " +
          'Working alongside the AI engineers, I mapped how a conversation ' +
          'could actually go — where it branches, what happens when someone ' +
          'raises a second thing halfway through, how it recovers when it has ' +
          'understood the wrong one — and made sure the whole of it held ' +
          'together as language and not only as logic.',
      },
    ],
  },
};
