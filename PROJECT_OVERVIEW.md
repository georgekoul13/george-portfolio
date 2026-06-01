# George Koulouris Portfolio — Project Overview

This document is the single source of truth for the portfolio project.
Hand it to a new Claude session and it will have full context to continue work.

---

## Live Site

| URL | Purpose |
|-----|---------|
| `https://www.georgekoulouris.com` | Primary (canonical) |
| `https://georgekoulouris.com` | Redirects → www |
| `https://george-portfolio-peach-zeta.vercel.app` | Vercel fallback (always works) |

---

## Accounts & Services

| Service | Account | Purpose |
|---------|---------|---------|
| **GitHub** | `georgekoul13` → repo `george-portfolio` | Source code, triggers Vercel deploys |
| **Vercel** | `georgekoul13` (Hobby plan) | Hosting, auto-deploys on push to `main` |
| **Namecheap** | George's account | Domain registrar for `georgekoulouris.com` |

---

## Tech Stack

| Technology | Version | Role |
|-----------|---------|------|
| Next.js | 14.2.35 (App Router) | Framework |
| React | 18 | UI |
| TypeScript | 5 | Language |
| Framer Motion | 12 | Animations (loading screen, page transitions) |
| Lucide React | 1.16 | Icons |
| Google Fonts | — | Montserrat (main), Playfair Display, and fun-mode fonts |

**Styling:** 100% inline styles — no Tailwind classes in components, no CSS modules.
`globals.css` only sets resets and image protection rules.

---

## Project Location (local)

```
~/Cluade Ai/george-portfolio/
```

Note the typo in the folder name ("Cluade" not "Claude") — keep it as-is.

---

## Folder Structure

```
george-portfolio/
├── app/
│   ├── layout.tsx          ← OG metadata, fonts, global providers
│   ├── page.tsx            ← Home page
│   ├── globals.css         ← Resets + image protection
│   ├── icon.svg            ← Browser favicon (Next.js App Router picks this up automatically)
│   └── projects/
│       └── [slug]/
│           └── page.tsx    ← Dynamic project page
├── components/
│   ├── Background.tsx      ← Perlin noise + cursor glow background
│   ├── ClientProviders.tsx ← Wraps children with client-only providers
│   ├── LoadingScreen.tsx   ← 000%→100% loading animation
│   ├── ModeToggle.tsx      ← PRO / FUN mode switcher (bottom right)
│   ├── footer/
│   │   └── FooterSection.tsx
│   ├── hero/
│   │   └── HeroSection.tsx
│   ├── project-page/
│   │   ├── MoreProjects.tsx        ← "Next Project" section at end of each project
│   │   ├── ProjectPageClient.tsx   ← Renders sections from content file
│   │   ├── ScrollSequence.tsx      ← Scroll-linked single image sequence
│   │   ├── ScrollSequencePair.tsx  ← Scroll-linked dual image sequence (light/dark)
│   │   └── SplitPanel.tsx          ← Side-by-side image panel
│   └── projects/
│       └── ProjectsSection.tsx     ← Home page project orbit/grid
├── content/
│   └── projects/
│       ├── index.ts          ← Registry: maps slugs → content files
│       ├── types.ts          ← TypeScript types for all section types
│       ├── gaspar-ai.ts
│       ├── piraeus-insurance.ts
│       ├── wallbid.ts
│       ├── cancellation-wallet.ts
│       ├── cybersential.ts
│       ├── mood.ts
│       ├── holy-projects.ts
│       ├── book-cover.ts
│       ├── logo-designs.ts
│       ├── psychologist-branding.ts
│       ├── illustrations.ts      ← slug: 'creative-projects'
│       └── custom-typefaces.ts
└── public/
    ├── logo.svg              ← GK logo (header, footer, 404)
    ├── og-image.jpg          ← OG preview image (1200×630)
    └── images/
        └── projects/
            ├── bancasure360/
            ├── book/
            ├── cancellation-wallet/
            ├── creatives/
            ├── cybersential/
            ├── cystom-typefaces/   ← note: typo in folder name, kept as-is
            ├── gaspar/
            ├── holy-projects/
            ├── insurance-product-flows/
            ├── logo-designs/
            ├── mood/
            ├── orbit/
            ├── piraeus/
            └── psychologist-branding/
```

---

## Project Slugs (12 active)

| Slug | Content file | Description |
|------|-------------|-------------|
| `gaspar-ai` | `gaspar-ai.ts` | AI product |
| `piraeus-insurance` | `piraeus-insurance.ts` | Banking/insurance |
| `wallbid` | `wallbid.ts` | Real estate platform |
| `cancellation-wallet` | `cancellation-wallet.ts` | Fintech |
| `cybersential` | `cybersential.ts` | Cybersecurity |
| `mood` | `mood.ts` | Mood tracking app |
| `holy-projects` | `holy-projects.ts` | Church/community |
| `book-cover` | `book-cover.ts` | Book cover design |
| `logo-designs` | `logo-designs.ts` | Logo collection |
| `psychologist-branding` | `psychologist-branding.ts` | Brand identity |
| `creative-projects` | `illustrations.ts` | Illustrations & creatives |
| `custom-typefaces` | `custom-typefaces.ts` | Type design |

---

## Environment Variables

Set in Vercel → project → Settings → Environment Variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.georgekoulouris.com` | Production |

---

## Deployment Flow

```
Local change → git add/commit/push → GitHub (main branch) → Vercel auto-deploys → Live in ~2 min
```

Push command (always use full path):
```bash
cd "/Users/george_koulouris/Cluade Ai/george-portfolio" && git add -A && git commit -m "your message" && git push
```

---

## Key Design Decisions

- **Background:** Perlin noise canvas (`mix-blend-mode: screen`) + cursor radial gradient glow. Both layers use screen blend — invisible on light surfaces, subtle lift on dark areas. Canvas has `filter: blur(120px)` and brightness `n*8` (very subtle).
- **Mobile breakpoint:** `< 744px` — used consistently across all components
- **Fonts:** Montserrat is the primary font for all UI. Fun-mode cards each use a different Google Font loaded via `next/font/google`.
- **No Tailwind in components** — all layout/style done with inline React `style={}` props
- **Loading screen:** Shown once per session (uses `sessionStorage`). Counts 000%→100% with easeOut curve over 2 seconds, then slides up.
- **Pro/Fun mode toggle:** Bottom-right corner. Fun mode makes the project cards orbit. Pro mode shows a clean grid.
- **Social links:**
  - Behance: `https://www.behance.net/george_koulouris`
  - Instagram: `https://www.instagram.com/george_koulouris/`
  - LinkedIn (footer connect button): `https://www.linkedin.com/in/george-koulouris/`

---

## Section Types (content files)

Each project content file exports an array of `sections`. Available types:

| Type | Description |
|------|-------------|
| `divider` | Full-width horizontal rule |
| `fullBleedImage` | Single image, full viewport width |
| `scrollSequence` | Scroll-linked image sequence (single column) |
| `scrollSequencePair` | Scroll-linked dual image sequence (light + dark side by side) |
| `splitPanel` | Two images side by side |
| `video` | Autoplay looping video |
| `textBlock` | Body text paragraph |
| `disclaimer` | Small italic disclaimer text |
| `moreProjects` | "Next Project" card — always last section |
