import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function UlogoUdesignsPage() {
  const project = getProject('logo-designs');
  if (!project) notFound();
  return <ProjectPageContent project={project} />;
}
