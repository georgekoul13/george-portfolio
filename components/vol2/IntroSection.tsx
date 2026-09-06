import { readFile } from 'node:fs/promises';
import path from 'node:path';
import RevealText from './RevealText';
import Avatar from './Avatar';

/**
 * "About me" — Figma 231:16735.
 *
 * Content frame 1320 × 848 inside 60px gutters, 124 above it. Two rows:
 *
 *   0   Group 148, 1320 × 434 — "HI THERE!" hard left, "I'M GEORGE" hard
 *       right, and the 609-wide illustration canvas centred between them
 *   558 the paragraph, 1320 × 290, centred
 *
 * The greeting and the name used to live inside the paragraph ("Hello
 * there! I'm George, a Product & Visual Designer…"). The design lifts them
 * out and hangs them in the top corners, with the drawing between — so the
 * sentence now opens on the job rather than on the introduction, and the
 * introduction is what frames the picture.
 *
 * That also retires the hover-reveal image, which was only ever on the word
 * "George" and left with it. Product and Visual keep their underlines,
 * which is exactly the two the design draws.
 */

/** Figma's permanent underlines. */
const UNDERLINED = ['Product', 'Visual'];

const HOME_SENTENCE =
  'I\u2019m a Product & Visual Designer based in Greece. Let\u2019s create stories ' +
  'that are based on facts and not only aesthetics.';

/**
 * Not underlined — the design has exactly two rules and these would be two
 * more. They get the arrival beat only, which is the emphasis without the
 * decoration.
 */
const BEATS = ['facts', 'not only aesthetics'];

/** the corner labels, 22px tall in a 1320 row */
const CORNER = {
  font: 'var(--type-16-20-b)',
  letterSpacing: '0.04em',
} as const;

/**
 * The drawing is read off disk here and handed to `Avatar` as markup rather
 * than linked as an `<img>`. It has to be inlined for the rig to reach the
 * eyes at all, and doing it in this server component means no second request
 * and no moment where the page has the illustration but not its parts.
 */
export default async function IntroSection({
  sentence = HOME_SENTENCE,
  underlined = UNDERLINED,
  beats = BEATS,
}: {
  /** the line under the drawing. The category pages pass their own — the
      composition is the same, only the sentence changes (238:6357). */
  sentence?: string;
  underlined?: string[];
  beats?: string[];
} = {}) {
  const svg = await readFile(
    path.join(process.cwd(), 'public/images/vol2/avatar/george.svg'),
    'utf8',
  );

  return (
    <section id="intro" className="w-full px-[var(--gutter)]" style={{ paddingBlock: 'var(--intro-pad-y)' }}>
      {/* `data-hold` on the WHOLE GROUP — the drawing and the sentence
          together, not the sentence on its own.

          That is what this section IS: *"the whole concept of this section is
          to have the illustration with the explanation below."* Holding the
          paragraph alone centred the paragraph, which pushed the drawing off
          the top of the screen — so the one moment the reader is forced to sit
          still was spent looking at the half of the idea that makes no sense
          without the other half.

          The group is 878 tall in a 900 window: 434 of drawing, the 124 gap,
          and 320 of sentence. It fits, with 11px to spare top and bottom, and
          `PanelStack` parks whatever carries `data-hold` at the centre of the
          screen — so the hold now frames both, and the scroll cannot move on
          until the sentence beneath the drawing has finished writing. */}
      <div data-hold className="mx-auto w-full max-w-[1320px]">
        {/* ── the drawing, with the greeting either side of it ─────────
            Wide, the two labels hang in the top corners of the drawing's box.
            Narrow (238:11970) they come OUT of the corners and stack — HI
            THERE! above the drawing, I'M GEORGE below it, both centred and
            twice the size. That is a different composition rather than the
            same one reflowed, so the switch lives in `globals.css` keyed off
            these three attributes; `order` is what puts the drawing between
            two elements that precede it in the markup. */}
        <div data-portrait className="relative">
          <span
            data-hi
            className="absolute left-0 top-0 uppercase"
            style={{ ...CORNER, color: 'var(--text-primary)' }}
          >
            Hi there!
          </span>
          <span
            data-me
            className="absolute right-0 top-0 uppercase"
            style={{ ...CORNER, color: 'var(--text-primary)' }}
          >
            I&rsquo;m George
          </span>
          <Avatar svg={svg} />
        </div>

        {/* 558 − 434 = 124 between the drawing and the sentence */}
        <RevealText
          /* Scrubbed against its own position on screen. It sits inside a
             pinned panel, where a scrubbed ScrollTrigger never advances —
             see `scrubToPosition`. */
          play="pinned"
          /* a step down from the display size — see `--type-64-72-r` */
          font="var(--type-64-72-r)"
          className="text-center"
          style={{ marginTop: 'var(--intro-gap)' }}
          underlined={underlined}
          beats={beats}
        >
          {sentence}
        </RevealText>
      </div>
    </section>
  );
}
