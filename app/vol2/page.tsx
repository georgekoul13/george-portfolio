import Loader from '@/components/vol2/Loader';
import Header from '@/components/vol2/Header';
import HeroSection from '@/components/vol2/hero/HeroSection';
import IntroSection from '@/components/vol2/IntroSection';
import SellingPointSection from '@/components/vol2/SellingPointSection';
import CategoriesSection from '@/components/vol2/CategoriesSection';
import ProjectsBand from '@/components/vol2/ProjectsBand';
import ConnectSection from '@/components/vol2/ConnectSection';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';

/**
 * Vol2 build surface. Not linked from anywhere — the live home page is
 * untouched until every template is done.
 */
export default function Vol2Page() {
  return (
    <div data-vol2>
      {/* first in the tree on purpose — it stops the page's animations during
          render, before any section's own timeline is built */}
      <Loader />
      <Header />
      <main style={{ background: 'var(--bg-page)' }} className="pt-[var(--header-h)]">
        {/* band order and dividers from the Figma home frame, 100:3483 down */}
        <HeroSection />
        <IntroSection />
        {/* No dividers around the selling point: it pins and owns the whole
            screen, so a rule either side would only ever be seen sliding
            past the edge of a band that is meant to arrive clean. */}
        <SellingPointSection />
        {/* The work comes before the categories now, not after. `ProjectsBand`
            carries its own leading line, so the pair it replaced —
            `HorizontalSection` and `ProjectGallery` — are both gone. */}
        <ProjectsBand />
        <CategoriesSection />
        <ConnectSection />
        <FooterSection />
        <CopyrightSection />
      </main>
    </div>
  );
}
