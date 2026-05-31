import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function UbookUcoverPage() {
  const project = getProject('book-cover');
  if (!project) notFound();
  return <ProjectPageContent project={project} />;
}
