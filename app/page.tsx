import HeroSection from '@/components/hero/HeroSection';
import ProjectsSection from '@/components/projects/ProjectsSection';
import AboutSection from '@/components/about/AboutSection';
import FooterSection from '@/components/footer/FooterSection';

export default function Home() {
  return (
    <main>
      {/*
        Opaque content wrapper — z-index: 1 with a solid background so it
        fully covers the sticky footer while the user scrolls through all
        sections above. No spacer here so the background doesn't block reveal.
      */}
      <div style={{ position: 'relative', zIndex: 1, background: '#1A1A1A' }}>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
      </div>

      {/*
        Transparent spacer — outside the opaque wrapper so the footer can
        show through it. This is the scroll room that lets the About cream
        panel clear the viewport before the footer is fully exposed.
      */}
      <div style={{ height: '100vh' }} />

      {/*
        Footer — sticky at the bottom, pulled up to overlap the spacer via
        negative margin. Revealed as the opaque wrapper scrolls away.
      */}
      <div style={{ position: 'sticky', bottom: 0, marginTop: '-100vh', height: '100vh', zIndex: 0 }}>
        <FooterSection />
      </div>
    </main>
  );
}
