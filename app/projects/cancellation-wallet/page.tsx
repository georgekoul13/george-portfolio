import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function UcancellationUwalletPage() {
  const project = getProject('cancellation-wallet');
  if (!project) notFound();
  return <ProjectPageContent project={project} />;
}
