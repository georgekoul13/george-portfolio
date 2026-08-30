import { notFound } from 'next/navigation';
import Header from '@/components/vol2/Header';
import Divider from '@/components/vol2/Divider';
import FooterSection from '@/components/vol2/FooterSection';
import CopyrightSection from '@/components/vol2/CopyrightSection';
import CategoryIntro from '@/components/vol2/category/CategoryIntro';
import CategoryTitle from '@/components/vol2/category/CategoryTitle';
import ProjectCards from '@/components/vol2/category/ProjectCards';
import { CATEGORIES, projectsFor, type CategorySlug } from '@/components/vol2/category/categories';

/**
 * Category template — Figma node 147:9780. One page each for Product,
 * Graphic and Creative.
 *
 * Band order and spacing are the design's: intro, the count, the cards, a
 * rule, the footer, a rule, the copyright. The footer and copyright bands are
 * identical to the home page's and are the same components.
 *
 * No `Loader` here — that is the home page's entrance, not something to sit
 * through on every navigation.
 */

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = CATEGORIES[params.category as CategorySlug];
  if (!category) notFound();

  const projects = projectsFor(category);

  return (
    <div data-vol2>
      <Header />
      <main style={{ background: 'var(--bg-page)' }} className="pt-[var(--header-h)]">
        <CategoryIntro headline={category.headline} beats={category.beats} />

        <CategoryTitle count={projects.length} />

        <ProjectCards projects={projects} />

        <Divider />
        <FooterSection />
        <Divider />
        <CopyrightSection />
      </main>
    </div>
  );
}
