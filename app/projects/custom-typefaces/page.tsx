import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function UcustomUtypefacesPage() {
  const project = getProject('custom-typefaces');
  if (!project) notFound();
  return <ProjectPageContent project={project} />;
}
