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
 * NOTHING HERE IS INFERRED. Every line comes from George in conversation,
 * and anything he has not said stays lorem until he does.
 */

/**
 * Chip renames that apply to EVERY page.
 *
 * `layout.ts` stays a faithful read of the canvas; the renames live here
 * with the rest of the writing, because that is what they are. George,
 * 2026-09-17: *"Change brief to Overview everywhere."*
 */
export const CHIP_RENAMES: Record<string, string> = {
  Brief: 'Overview',
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
      'A generative-AI help desk for IT and HR. Sixteen months on its name, ' +
      'its product and its voice.',
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
          'Gaspar AI resolves employee IT and HR requests inside Slack and ' +
          'Teams, automatically, before they become tickets.',
      },
      null, // the Figma loop, full width
      {
        /* The challenge. George asked for the previous designer to be left
           out of it — the state of the work is the point, not who made it. */
        text:
          'A dated brand, a logo with no idea behind it, and a product grown ' +
          'without a plan.',
      },
      {
        // The brand — the 11 stills
        text:
          'Gaspardesk named where we were, not where we were going — a ' +
          'helpdesk, when the thing doing the work was AI. It became Gaspar ' +
          'AI. The founder wanted more playfulness than the category had, so ' +
          'Gaspar stopped being a word and became a character.',
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
          'Every screen drawn from scratch by one person over sixteen months: ' +
          'components, responsive behaviour, and the prototypes the engineers ' +
          'built from. No system to inherit, nobody to split it with. The ' +
          'largest part is under NDA.',
      },
      {
        // the first commercial site
        chip: 'The Website',
        text:
          'The first thing I shipped. The company needed somewhere to point ' +
          'people while everything else was rebuilt, so the site carried the ' +
          'new name, the new logotype and Gaspar himself — and leaned into ' +
          'playfulness, in a category where everyone looked like enterprise ' +
          'software.',
        /* No list to give, so no arrows. See `bullets` on `SectionCopy`. */
        bullets: [],
      },
      {
        // the same site a year on
        chip: 'The Website vol2',
        text:
          'A year on, the site could not hold what the company had become: far ' +
          'more product, and more to say about it. Version two is bigger and ' +
          'deliberately calmer — the playfulness pulled back to where it ' +
          'supports the work instead of leading it.',
        bullets: [],
      },
      {
        // Conversational Design — the two dialogue-manager diagrams
        text:
          "Gaspar's replies were designed, not written as they came up. " +
          'Working with the AI engineers I mapped how a conversation actually ' +
          'goes — where it branches, what happens when someone raises a second ' +
          'thing halfway through, how it recovers from understanding the wrong ' +
          'one.',
      },
    ],
  },
};
