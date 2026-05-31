interface TextBlockProps {
  body: string;
}

// Large uppercase paragraph — clamp handles desktop→mobile sizing automatically.
// Desktop: 32px / 40px leading. Mobile: 24px / 32px leading.
export default function TextBlock({ body }: TextBlockProps) {
  return (
    <p
      style={{
        fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
        fontWeight:    500,
        // 24px mobile → 32px desktop
        fontSize:      'clamp(24px, 2.22vw, 32px)',
        // 32px mobile leading → 40px desktop
        lineHeight:    'clamp(32px, 2.78vw, 40px)',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        color:         '#EEE2D9',
        width:         '100%',
        margin:        0,
        flexShrink:    0,
      }}
    >
      {body}
    </p>
  );
}
