'use client';

import RevealText from './RevealText';
import SocialLinks from './SocialLinks';

/**
 * Footer — Figma nodes 100:3547 (text) and 118:4595 (BOXES, 418px tall).
 *
 * The text gets the same reveal as every other big left-aligned block, with
 * "freelance collaborations" and "say hi!" arriving as beats — the intro's
 * rise and turn, and the colour wave — but without its underlines or hover
 * images, which stay intro-only.
 *
 * BOXES has been through two earlier designs — three big coloured chips that
 * fell into frame, then a scatter of brand marks. It is now a plain row of
 * four bordered cards with no arrival of its own. See `SocialLinks`.
 *
 * The copyright line used to live here as a rule and a caption; it is its
 * own band now — see `CopyrightSection`.
 */
export default function FooterSection() {
  return (
    <footer
      className="w-full px-[var(--gutter)]"
      /* was a flat 124/64 — now on the shared section rhythm, so it opens up
         with everything else rather than staying tight against the band */
      style={{ paddingTop: 'var(--section-pad-y)', paddingBottom: 'var(--section-pad-y)' }}
    >
      <RevealText className="max-w-[1100px]" beats={['freelance collaborations', 'say hi!']}>
        {`Reach out for freelance collaborations or just to say hi! :-)`}
      </RevealText>

      <SocialLinks />
    </footer>
  );
}
