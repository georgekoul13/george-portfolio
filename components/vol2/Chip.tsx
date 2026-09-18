/**
 * The UI Chip — Figma 340:19360.
 *
 * One chip, two homes: the label on a project card's artwork, and the tag
 * that opens each section of a project page. George: *"the design of the chip
 * must change to the project cards as well."* Shared rather than copied so
 * the two cannot drift.
 *
 * It replaces the blurred black pill that sat on the cards before — 12/16
 * Regular, uppercase, `rgba(0,0,0,0.4)` behind a 12px backdrop blur, radius
 * 16. The new one is a solid raised surface at radius 8, and it is NOT
 * uppercased: the card's tags happen to be stored in capitals, but a section
 * label reads "The design process" and would be shouted by a rule that
 * assumed otherwise.
 *
 * The border is the same colour as the fill. That looks redundant and is not:
 * it adds a pixel each side, which is the difference between this box and one
 * an eighth smaller.
 */
export default function Chip({ label }: { label: string }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center self-start whitespace-nowrap"
      style={{
        font: 'var(--type-12-20-m)',
        letterSpacing: '0.6px',
        color: 'var(--text-primary)',
        background: 'var(--bg-raised)',
        border: '1px solid var(--bg-raised)',
        borderRadius: 8,
        padding: '8px 12px',
      }}
    >
      {label}
    </span>
  );
}
