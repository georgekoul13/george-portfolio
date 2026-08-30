/**
 * The hairline rule that separates the home page's bands — Figma nodes
 * 100:3494 and 100:3518. It's a full-width 1px line inset by the page's
 * 60px gutter, drawn in `--border-subtle` (neutral/800, what Figma calls
 * `primitives/neutral/800`).
 *
 * Not every gap in the design is one of these: node 100:3544, between the
 * grid and the connect card, is an empty 1px spacer with no line.
 */
export default function Divider() {
  return (
    <div className="w-full px-[var(--gutter)]">
      <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} />
    </div>
  );
}
