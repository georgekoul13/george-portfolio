import { notFound } from 'next/navigation';
import { getProject, getAllSlugs } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

// Pre-render all project pages at build time.
export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

interface Props {
  params: { slug: string };
}

export default function ProjectPage({ params }: Props) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return <ProjectPageContent project={project} />;
}
