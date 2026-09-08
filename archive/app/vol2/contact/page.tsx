import Header from '@/components/vol2/Header';
import Divider from '@/components/vol2/Divider';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import ContactForm from '@/components/vol2/contact/ContactForm';

/**
 * Contact — Figma nodes 147:11421 and 147:13554.
 *
 * A display headline with a video of George set into it, then a two-column
 * form; submitting swaps both for a thank-you without leaving the page,
 * which is how the two frames differ. The footer and copyright below are the
 * same components as everywhere else, with the design's rule between them.
 */
export default function ContactPage() {
  return (
    <div data-vol2>
      <Header />
      <main style={{ background: 'var(--bg-page)' }} className="relative pt-[var(--header-h)]">
        {/* The back link is in the flow inside ContactForm now, not pinned
            here. Absolutely placing it meant its 60/80 offsets were measured
            against the page rather than the band, so it drifted the moment
            the header height or the gutter changed. */}
        <ContactForm />

        <FooterSection />
        <Divider />
        <CopyrightSection />
      </main>
    </div>
  );
}
