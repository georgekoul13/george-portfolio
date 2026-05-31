import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function UcybersentialPage() {
  const project = getProject('cybersential');
  if (!project) notFound();
  return <ProjectPageContent project={project} />;
}
