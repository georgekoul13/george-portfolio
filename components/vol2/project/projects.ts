import projects from '@/data/projects.json';
import { getProject } from '@/content/projects/index';
import { STILLS } from './stills';

/**
 * The vol2 project page's content — Figma "Project template", node 145:3043.
 *
 * The template asks for more than the site currently stores. `projects.json`
 * has a title and a one-line subtitle; the v1 content files add a longer
 * description and `metadata.role` / `.employer` / `.categories`. Nothing
 * anywhere has the summary line, the year, the statement, or captions for the
 * closing trio.
 *
 * So the four are filled from what exists where that is honest, and left as
 * marked placeholders where it isn't — the same arrangement as the category
 * pages, and for the same reason: George wants it testable now and will fill
 * in the real details project by project afterwards. Everything provisional
 * is gathered in `YEARS` and `STATEMENTS` below so it is obvious what still
 * needs him.
 */

export interface Vol2Project {
  slug: string;
  title: string;
  /** the big set-up line under the hero — see `SUMMARIES` */
  summary: string;
  /** the paragraph beneath it */
  body: string;
  meta: { client: string; role: string; year: string; category: string };
  /** the two full-width images */
  heroes: [string, string];
  /** the 72/80 statement between them and the trio */
  statement: string;
  /** the closing three, each with its caption */
  gallery: { src: string; caption: string }[];
}

/* ── Summaries ───────────────────────────────────────────────────────────
   The big set-up line under the hero.

   It used to be `listed.subtitle` — the same string the card already shows
   on the category page — so a reader arriving from a card was met with the
   line they had just clicked, set larger. George's call: give it its own
   line.

   EMPTY ON PURPOSE. Every entry here is George's to write; until one lands
   the page falls back to the subtitle, which is what it showed before, so
   nothing regresses while the file fills up. Do not invent these — the
   subtitle says what the project IS, and this line is meant to say why it
   mattered, which is not something to guess on someone's behalf. */
const SUMMARIES: Record<string, string> = {
};

/* ── Years ───────────────────────────────────────────────────────────────
   Derived from George's employment dates rather than guessed: Holy
   2021–22, Gaspar AI 2022–24, Wallbid 2024–25, Mood 2025–26. Maria
   Fitsopoulou's mark carries "ESTD 2026" on it, which dates that one.

   The freelance and personal work has no date in any source — not in the
   repo, not in his profile — so it is left blank rather than invented, and
   the meta row simply omits the line. Ask him; do not fill these in. */
const YEARS: Record<string, string> = {
  istorima:                  '2021 — 2022',
  benefit:                   '2021 — 2022',
  'gaspar-ai':               '2022 — 2024',
  'piraeus-insurance':       '2024 — 2025',
  bancasure360:              '2024 — 2025',
  'cancellation-wallet':     '2024 — 2025',
  cybersential:              '2024 — 2025',
  'insurance-product-flows': '2024 — 2025',
  mood:                      '2025 — 2026',
  deerislnd:                 '2025 — 2026',
  'athens-goes-mayan':       '2025 — 2026',
  'maria-fitsopoulou':       '2026',
};

/* ── Statements ──────────────────────────────────────────────────────────
   The one line that sits between the two hero images, at 72/80 with the
   word-by-word reveal — so it has to be short enough to land as a single
   thought, not a paragraph.

   DRAFTED, NOT DICTATED. Every one is built from a fact established with
   George on 2026-08-21, but the phrasing is mine and this is the most
   voice-carrying text on the page. He should rewrite the ones that do not
   sound like him. DEERISLND's is the campaign's own line. */
const STATEMENTS: Record<string, string> = {
  'gaspar-ai':               'A help desk that answers before anyone has to ask.',
  mood:                      "A city's nights, in the order you would actually go looking for them.",
  'piraeus-insurance':       'Between a bank and its insurers, someone has to speak both languages.',
  bancasure360:              "One platform, whichever bank's name is on the door.",
  cybersential:              'Security a hotel can actually read.',
  'cancellation-wallet':     'Every policy, every traveller, every claim, in one place.',
  'insurance-product-flows': 'One system, bent to fit whatever it is asked to sell.',
  benefit:                   'The components everything else was built from.',
  istorima:                  "A country's memory, and a way to find your way through it.",
  'book-cover':              'Balkan embroidery rebuilt as a system, not borrowed as decoration.',
  'danai-michali':           'A practice has to feel safe before it is read.',
  'olga-posonidou':          'Two open hands, and the thing held between them.',
  'vasiliki-vozora':         'Quiet enough to sit with.',
  'maria-fitsopoulou':       'A molar, drawn softly enough to trust.',
  deerislnd:                 'The dance never stopped. The music just changed.',
  'athens-goes-mayan':       'A Mayan sun over the Acropolis.',
  arcana:                    'Twenty-two cards, none of them polite.',
  'in-pixels-we-see':        'Take the drawing away and the painting still carries.',
  cabaret:                   'Berlin kept dancing.',
  'custom-typefaces':        'One is comfort. The other is the floor moving.',
};

/**
 * Figma's example reads "Interface & Industrial", so a pair keeps the
 * ampersand. Three or more strung together that way turns into a chant —
 * those get commas.
 */
function joinCategories(list?: string[]): string | undefined {
  if (!list?.length) return undefined;
  return list.length <= 2 ? list.join(' & ') : list.join(', ');
}

export function getVol2Project(slug: string): Vol2Project | null {
  const listed = projects.find((p) => p.slug === slug);
  if (!listed) return null;

  const full = getProject(slug);

  /* Five distinct images would be ideal — two heroes and a trio — but the
     projects hold anywhere from two to five, so the slots cycle what exists
     rather than asking for one that isn't there. */
  const stills = STILLS[slug] ?? [];
  const pick = (n: number) =>
    stills.length ? stills[(n - 1) % stills.length] : '/images/projects/orbit/gaspar-ai-1.png';

  return {
    slug,
    title: listed.title,
    summary: SUMMARIES[slug] || listed.subtitle,
    body: full?.description ?? listed.subtitle,
    meta: {
      client: full?.metadata.employer ?? '—',
      role: full?.metadata.role ?? '—',
      year: YEARS[slug] ?? '',
      category: joinCategories(full?.metadata.categories) ?? listed.category,
    },
    heroes: [pick(1), pick(2)],
    statement: STATEMENTS[slug] ?? '',
    /* Captions were three invented lines repeated on all fifteen pages —
       "interface states across the core product surfaces" sitting under a
       festival poster. Figma's numbering carries the row on its own until
       real ones exist. */
    gallery: [3, 4, 5].map((n) => ({ src: pick(n), caption: '' })),
  };
}

export function allVol2ProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
