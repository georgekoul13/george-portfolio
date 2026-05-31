'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/context/ModeContext';
import type { ProjectContent, Section } from '@/content/projects/types';

import ProjectHeader    from '@/components/project-page/ProjectHeader';
import ProjectHero      from '@/components/project-page/ProjectHero';
import Divider          from '@/components/project-page/Divider';
import FullImage        from '@/components/project-page/FullImage';
import ImageGrid        from '@/components/project-page/ImageGrid';
import GalleryContainer from '@/components/project-page/GalleryContainer';
import Carousel         from '@/components/project-page/Carousel';
import ScrollSequence     from '@/components/project-page/ScrollSequence';
import ScrollSequencePair from '@/components/project-page/ScrollSequencePair';
import SplitPanel        from '@/components/project-page/SplitPanel';
import ScrollVideo       from '@/components/project-page/ScrollVideo';
import LogoStoryteller   from '@/components/project-page/LogoStoryteller';
import TextBlock        from '@/components/project-page/TextBlock';
import TypefaceGrid     from '@/components/project-page/TypefaceGrid';
import Disclaimer       from '@/components/project-page/Disclaimer';
import MoreProjects     from '@/components/project-page/MoreProjects';
import DraggableItem    from '@/components/project-page/DraggableItem';

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if      (vw < 744)  setScreenSize('mobile');
      else if (vw < 1024) setScreenSize('tablet');
      else                setScreenSize('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return screenSize;
}

interface Props {
  project: ProjectContent;
}

/**
 * Fun-mode wiring for project pages.
 *
 * Draggable in fun mode:
 *   ProjectHero sub-elements (title, description, metadata) — handled inside ProjectHero
 *   TextBlock — wrapped here
 *
 * NOT draggable (never):
 *   ProjectHeader, Divider, MoreProjects
 *   FullImage, ImageGrid, GalleryContainer — images stay fixed
 */
export default function ProjectPageContent({ project }: Props) {
  const { mode }   = useMode();
  const isFun      = mode === 'fun';
  const screenSize = useScreenSize();

  const isMobileLayout = screenSize === 'mobile';
  const isTabletLayout = screenSize === 'tablet';

  // Mirror homepage: barPad = left/right padding, topOffset = fixed header top
  const barPad    = isMobileLayout ? 24 : isTabletLayout ? 60 : 120;
  const topOffset = isMobileLayout ? 32 : 60;
  // paddingTop clears the fixed header (topOffset) + header height (~24px) + breathing room (~80px)
  const contentPaddingTop = topOffset + 24 + 80;

  function renderSection(section: Section, i: number) {
    switch (section.type) {
      case 'divider':
        return <Divider key={i} />;

      // ── Images — NOT draggable ──────────────────────────────────────────────
      case 'gallery':
        return <GalleryContainer key={i} rows={section.rows} />;

      case 'fullImage':
        return (
          <FullImage key={i} src={section.src} alt={section.alt} badge={section.badge} />
        );

      case 'imageGrid':
        return <ImageGrid key={i} cols={section.cols} images={section.images} />;

      // ── Carousel — NOT draggable (media, like images) ──────────────────────
      case 'carousel':
        return (
          <Carousel
            key={i}
            images={section.images}
            interval={section.interval}
            aspectRatio={section.aspectRatio}
          />
        );

      // ── Scroll sequence — scroll-linked frame switcher, NOT draggable ───────
      case 'scrollSequence':
        return (
          <ScrollSequence
            key={i}
            images={section.images}
            aspectRatio={section.aspectRatio}
          />
        );

      // ── Scroll sequence pair — two columns advancing together ───────────────
      case 'scrollSequencePair':
        return (
          <ScrollSequencePair
            key={i}
            left={section.left}
            right={section.right}
            aspectRatio={section.aspectRatio}
            gap={section.gap}
          />
        );

      // ── Split panel — image/text alternating row (logo showcase) ───────────
      case 'splitPanel':
        return (
          <SplitPanel
            key={i}
            imagePosition={section.imagePosition}
            images={section.images}
            interval={section.interval}
            label={section.label}
            sublabel={section.sublabel}
          />
        );

      // ── Scroll video — plays while scrolling, pauses when scroll stops ─────
      case 'scrollVideo':
        return (
          <ScrollVideo
            key={i}
            src={section.src}
            poster={section.poster}
            scrollWeight={section.scrollWeight}
          />
        );

      // ── Logo storyteller — Apple-style scroll narrative ─────────────────────
      case 'logoStoryteller':
        return (
          <LogoStoryteller
            key={i}
            projects={section.projects}
          />
        );

      // ── Text — draggable in fun mode ────────────────────────────────────────
      case 'textBlock':
        return (
          <DraggableItem key={i} label="text-box" enabled={isFun}>
            <TextBlock body={section.body} />
          </DraggableItem>
        );

      // ── Typeface showcase — letter grid, draggable per-glyph in fun mode ─────
      case 'typefaceShowcase':
        return (
          <TypefaceGrid
            key={i}
            name={section.name}
            subtitle={section.subtitle}
            variant={section.variant}
            letters={section.letters}
          />
        );

      // ── Disclaimer — confidentiality / NDA notice ───────────────────────────
      case 'disclaimer':
        return <Disclaimer key={i} text={section.text} />;

      // ── More projects — not project content, stays fixed ───────────────────
      case 'moreProjects':
        return <MoreProjects key={i} currentSlug={project.slug} />;
    }
  }

  return (
    <>
      {/* Header — fixed, mirrors homepage top bar position exactly */}
      <ProjectHeader />

      <main
        style={{
          backgroundColor: '#1A1A1A',
          minHeight:       '100vh',
          paddingTop:      contentPaddingTop,
          paddingBottom:   isMobileLayout ? 40 : 80,
          paddingLeft:     barPad,
          paddingRight:    barPad,
          display:         'flex',
          flexDirection:   'column',
          overflow:        'visible',
        }}
      >
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           isMobileLayout ? 40 : isTabletLayout ? 48 : 56,
          width:         '100%',
        }}
      >
        {/* Hero — title / description / metadata each independently draggable */}
        <ProjectHero
          title={project.title}
          description={project.description}
          metadata={project.metadata}
          isFun={isFun}
        />

        {/* Sections */}
        {project.sections.map((section, i) => renderSection(section, i))}
      </div>
      </main>
    </>
  );
}
