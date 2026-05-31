import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function UpiraeusUinsurancePage() {
  const project = getProject('piraeus-insurance');
  if (!project) notFound();
  return <ProjectPageContent project={project} />;
}
