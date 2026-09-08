import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ReactNode } from 'react';
import Avatar from './Avatar';
import Ticker from './Ticker';
import BaseText from './BaseText';

/**
 * The first screen of every page but a project's — Figma 255:7046 wide and
 * 255:9406 narrow.
 *
 * George: *"in all the base pages we will always have the illustration and
 * logo with some text, or a title with some text."* So it is one component
 * with one variable: what goes above the line. The home page passes the
 * wordmark; a category page passes its title.
 *
 * ── the composition ──────────────────────────────────────────────────
 * Cream, not the page's black — this is the surface the dark panel arrives
 * over, so the two are each other's opposite and the join needs no other
 * marking. `tone: "light"` on the panel re-maps every semantic token inside,
 * so nothing in here names a colour.
 *
 * Three boxes, not two, and a GRID rather than a row of columns: wide, the
 * title and the line share the left column with the drawing beside them;
 * narrow (255:9406), the drawing moves BETWEEN them. That is a different
 * composition rather than the same one reflowed, and only a grid whose areas
 * are re-declared can do it without the title and the line being welded
 * together in the markup.
 *
 * ── what it replaced ─────────────────────────────────────────────────
 * The home page used to open with a black hero and then hand over to a cream
 * panel carrying the drawing and a sentence about it. That was two screens
 * saying one thing. This is the restructure George asked for: *"we are going
 * to do another mini restructure to make it more simple."*
 */
export default async function BaseScreen({
  mark,
  title,
  text,
  textFont = 'var(--type-32-40-r)',
  textStartAt,
}: {
  /**
   * A small wordmark above the title, on the pages whose title is words
   * rather than the wordmark itself — 255:9087. Wide it sits in the corner
   * and takes no part in the column's own layout; narrow it is the first
   * thing in the column, which is why it is a sibling rather than something
   * inside the copy.
   */
  mark?: ReactNode;
  /** the wordmark on the home page, a page title everywhere else */
  title: ReactNode;
  text?: ReactNode;
  /** the category hero's lead is a step larger narrow — see `--cat-lead` */
  textFont?: string;
  /** when the lead starts writing itself, on the global timeline's clock */
  textStartAt?: number;
}) {
  const svg = await readFile(
    path.join(process.cwd(), 'public/images/vol2/avatar/george.svg'),
    'utf8',
  );

  return (
    <section
      data-base
      className="relative flex w-full flex-col"
      /* `lvh` so it still covers once a phone's toolbar retracts — see the
         note in `PanelStack`. */
      style={{ minHeight: '100lvh' }}
    >
      <Ticker />

      <div
        data-base-body
        /* the attribute, not the presence of a child: the whole narrow
           composition changes when there is a mark, and CSS needs to be able
           to ask */
        data-has-mark={mark ? '' : undefined}
        className="grid w-full flex-1 items-center px-[var(--gutter)]"
        style={{ paddingBlock: 'var(--base-pad-y)' }}
      >
        {mark ? <div data-base-mark>{mark}</div> : null}

        {/* The title and the line are ONE cell wide, and three cells narrow.
            They have to be both: a grid item that spans two rows — which the
            drawing does wide — makes those rows grow to fit it, and the 48
            between the title and the line grew with them. So wide they are a
            column of their own with the 48 inside it, and narrow this
            wrapper becomes `display: contents` and hands them back to the
            grid, where the drawing can sit between them. */}
        {/* The 48 between the title and the line lives in CSS, not here: an
            inline gap beats a stylesheet rule, and the phone's composition
            needs to bring it down to 16. */}
        <div data-base-copy className="flex min-w-0 flex-col">
          <div data-base-title className="min-w-0">
            {title}
          </div>

          {text ? (
            <BaseText
              startAt={textStartAt}
              style={{ font: textFont, color: 'var(--text-primary)' }}
            >
              {text}
            </BaseText>
          ) : null}
        </div>

        <div data-base-figure className="min-w-0">
          <Avatar svg={svg} />
        </div>
      </div>
    </section>
  );
}
