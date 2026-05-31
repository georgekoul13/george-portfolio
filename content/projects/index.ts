// ─── Project Registry ─────────────────────────────────────────────────────────
// Add each project here as it gets a full content file.
// The dynamic route at app/projects/[slug]/page.tsx looks up by slug.

import type { ProjectContent } from './types';

import gasparAi              from './gaspar-ai';
import piraeusInsurance      from './piraeus-insurance';
import wallbid               from './wallbid';
import cancellationWallet    from './cancellation-wallet';
import cybersential          from './cybersential';
import mood                  from './mood';
import holyProjects          from './holy-projects';
import bookCover             from './book-cover';
import logoDesigns           from './logo-designs';
import psychologistBranding  from './psychologist-branding';
import illustrations         from './illustrations';
import customTypefaces       from './custom-typefaces';

const projects: Record<string, ProjectContent> = {
  'gaspar-ai':               gasparAi,
  'piraeus-insurance':       piraeusInsurance,
  'wallbid':                 wallbid,
  'cancellation-wallet':     cancellationWallet,
  'cybersential':            cybersential,
  'mood':                    mood,
  'holy-projects':           holyProjects,
  'book-cover':              bookCover,
  'logo-designs':            logoDesigns,
  'psychologist-branding':   psychologistBranding,
  'creative-projects':       illustrations,
  'custom-typefaces':        customTypefaces,
};

export function getProject(slug: string): ProjectContent | null {
  return projects[slug] ?? null;
}

// Used by generateStaticParams so Next.js pre-renders all project pages.
export function getAllSlugs(): string[] {
  return Object.keys(projects);
}
