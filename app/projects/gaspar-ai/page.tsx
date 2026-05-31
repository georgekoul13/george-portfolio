// Gaspar AI project page — content defined in content/projects/gaspar-ai.ts
import { notFound } from 'next/navigation';
import { getProject } from '@/content/projects/index';
import ProjectPageContent from '@/components/project-page/ProjectPageContent';

export default function GasparAiPage() {
  const project = getProject('gaspar-ai');
  if (!project) notFound();

  return <ProjectPageContent project={project} />;
}
