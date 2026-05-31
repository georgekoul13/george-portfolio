import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function UmoodPage() {
  const project = getProject('mood');
  if (!project) notFound();
  return <ProjectPageContent project={project} />;
}
