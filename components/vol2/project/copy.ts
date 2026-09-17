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
 *   beside pictures   **10 to 15 words.** George: *"In the texts next to the
 *                     images i want something short like 10 to 15 words. If
 *                     we need to add more text we can have another section."*
 *                     A section is the unit of more, not a longer paragraph.
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
          'Gaspardesk named where we were, not where we were going.',
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
          'One designer, sixteen months, every screen from scratch. The largest ' +
          'part is under NDA.',
      },
      {
        // the first commercial site
        chip: 'The Website',
        text:
          'First job: somewhere to point people. New name, new logotype, and ' +
          'Gaspar all over it.',
        bullets: ['[to write]', '[to write]'],
      },
      {
        // the same site a year on
        chip: 'The Website vol2',
        text:
          'A year on, far more product to explain. Bigger, calmer, still ' +
          'playful.',
        bullets: ['[to write]', '[to write]'],
      },
      {
        // Conversational Design — the two dialogue-manager diagrams
        text:
          'Where a conversation branches, and what happens when someone raises ' +
          'two things at once.',
      },
    ],
  },
};
