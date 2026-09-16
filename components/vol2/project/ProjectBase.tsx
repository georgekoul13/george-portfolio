import ProjectImage from './ProjectImage';
import type { ProjectMetaFields } from './blocks';

/**
 * The base screen of a project — Figma 366:11793, the `base` frame.
 *
 * ── it is LIGHT now ───────────────────────────────────────────────────
 * The previous base set its title in cream on the page's black. This one
 * paints `--bg-page` from a `data-tone="light"` panel and sets the title in
 * `--text-inverse`, so the project opens on the cream the home and category
 * pages open on, and the dark panel rises over it. The tone flip is the
 * panel's to declare, not this component's — see the page.
 *
 * ── and the order changed ─────────────────────────────────────────────
 * Picture first, title under it. The title lost a third of its size in the
 * swap (100/100 Medium becomes 64/64 Bold, uppercase, 3.2 of tracking),
 * which is what lets the picture lead without the two competing.
 *
 * The facts are one row of four now rather than the 2 x 2 grid with a rule
 * through it. `design time` and `Deliverables` are new and replace `Year`
 * and `Category` — the first two are still Client and Role.
 *
 * ── DO NOT copy Figma's token NAMES in here ───────────────────────────
 * The design calls the title's colour `--text/inverse` and the labels
 * `--text/disabled`, because Figma draws this frame against a dark artboard
 * and names the roles from there. This panel is `data-tone="light"`, which
 * already re-maps every semantic token — so `--text-inverse` resolves to the
 * CREAM here and the title came out cream on cream, invisible. The roles
 * that match the design's appearance are `--text-primary` for the dark ink
 * and `--text-tertiary` for the grey, both of which the tone flip has
 * already turned round. Match the appearance, not the name.
 */
function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-[6px]">
      <p
        className="uppercase"
        style={{
          font: 'var(--type-12-16-r)',
          color: 'var(--text-tertiary)',
          /* cap-trim: the label sits 14 above its value in the design, which
             only lands if the box is the letters rather than the line. */
          textBoxTrim: 'trim-both',
          textBoxEdge: 'cap alphabetic',
        } as React.CSSProperties}
      >
        {label}
      </p>
      <p style={{ font: 'var(--type-15-20-m)', color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

export default function ProjectBase({
  title,
  subtitle,
  meta,
  hero,
}: {
  title: string;
  subtitle: string;
  meta: ProjectMetaFields;
  hero: string;
}) {
  return (
    <div
      className="flex w-full flex-col px-[var(--gutter)]"
      style={{ paddingBlock: 'var(--base-pad-y)', gap: 'var(--project-base-gap)' }}
    >
      {/* `ProjectImage` already owns the aspect token and the uncover-from-
          below entrance, and takes a video just as happily — so a project
          whose opening frame moves needs no different component here. */}
      <ProjectImage src={hero} alt={title} />

      <div className="flex w-full flex-col" style={{ gap: 'var(--project-title-gap)' }}>
        <h1
          className="uppercase"
          style={{
            font: 'var(--type-64-64-b)',
            letterSpacing: '3.2px',
            color: 'var(--text-primary)',
            textBoxTrim: 'trim-both',
            textBoxEdge: 'cap alphabetic',
          } as React.CSSProperties}
        >
          {title}
        </h1>
        <p style={{ font: 'var(--type-16-24-r)', color: 'var(--text-tertiary)' }}>{subtitle}</p>
      </div>

      {/* One row at desktop. Below `lg` four cells across a phone would be
          19px wide, so they wrap to two and then to one. */}
      <div
        className="grid w-full grid-cols-1 sm:grid-cols-2 lg:flex"
        style={{ gap: 'var(--project-meta-gap)' }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--project-meta-gap)] sm:flex-row">
          <Cell label="Client" value={meta.client} />
          <Cell label="Role" value={meta.role} />
          <Cell label="Design time" value={meta.designTime} />
        </div>
        {/* Deliverables gets the same width as the other three together —
            it is a list, and the design gives it half the row. */}
        <div className="flex min-w-0 flex-1">
          <Cell label="Deliverables" value={meta.deliverables} />
        </div>
      </div>
    </div>
  );
}
