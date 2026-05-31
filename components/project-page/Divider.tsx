// Full-width separator line — matches Figma: h-px, rounded, #444240

export default function Divider() {
  return (
    <div
      aria-hidden="true"
      style={{
        width:           '100%',
        height:          '1px',
        backgroundColor: '#444240',
        borderRadius:    '8px',
        flexShrink:      0,
      }}
    />
  );
}
