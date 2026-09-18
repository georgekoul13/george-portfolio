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

import danaiMichali          from './danai-michali';
import illustrations         from './illustrations';
import customTypefaces       from './custom-typefaces';
/* These six were written but never imported, so `getProject` returned null
   for all of them and their pages 404'd on the live site while still being
   listed in the grid. Registered 2026-08-21. */
import bancasure360          from './bancasure360';
import benefit               from './benefit';
import istorima              from './istorima';
import insuranceProductFlows from './insurance-product-flows';
import athensGoesMayan       from './athens-goes-mayan';
import arcana                from './arcana';
import inPixelsWeSee         from './in-pixels-we-see';
import cabaret               from './cabaret';
import deerislnd             from './deerislnd';
import mariaFitsopoulou      from './maria-fitsopoulou';
import olgaPosonidou         from './olga-posonidou';
import vasilikiVozora        from './vasiliki-vozora';

const projects: Record<string, ProjectContent> = {
  'gaspar-ai':               gasparAi,
  'piraeus-insurance':       piraeusInsurance,
  'wallbid':                 wallbid,
  'cancellation-wallet':     cancellationWallet,
  'cybersential':            cybersential,
  'mood':                    mood,
  'holy-projects':           holyProjects,
  'book-cover':              bookCover,
  'danai-michali':           danaiMichali,
  'creative-projects':       illustrations,
  // the grid links to /projects/illustrations; the file's own slug says
  // 'creative-projects', so both resolve rather than one 404ing
  'illustrations':           illustrations,
  'custom-typefaces':        customTypefaces,
  'bancasure360':            bancasure360,
  'benefit':                 benefit,
  'istorima':                istorima,
  'insurance-product-flows': insuranceProductFlows,
  'athens-goes-mayan':       athensGoesMayan,
  'arcana':                  arcana,
  'in-pixels-we-see':        inPixelsWeSee,
  'cabaret':                 cabaret,
  'deerislnd':               deerislnd,
  'maria-fitsopoulou':       mariaFitsopoulou,
  'olga-posonidou':          olgaPosonidou,
  'vasiliki-vozora':         vasilikiVozora,
};

export function getProject(slug: string): ProjectContent | null {
  return projects[slug] ?? null;
}

// Used by generateStaticParams so Next.js pre-renders all project pages.
export function getAllSlugs(): string[] {
  return Object.keys(projects);
}
