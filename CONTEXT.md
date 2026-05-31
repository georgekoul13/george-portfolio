# Portfolio Design System — Context File

> This file is the single source of truth for design decisions, tokens, and component behavior across sessions. Update it as the system evolves.

---

## Project Overview

Personal portfolio for George Koulouris — UX/UI Designer & Creative based in Athens, Greece. The site presents 15 projects spanning two modes:

- **Professional** — enterprise UX/UI work (insurance, fintech, SaaS). Default mode.
- **Fun** — creative work (illustration, type, branding, music)

The mode is a global state that persists across all pages. A fixed toggle at the bottom center of every page switches between them. Case study content lives directly on the site — no external links to Behance or Figma.

---

## Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-dark` | `#1A1A1A` | Page background — the only background color on all pages |
| `--color-surface-dark` | `#1F1F1F` | Toggle pill inner background, deepest surface |
| `--color-surface` | `#272727` | Cards, panels, raised surfaces |
| `--color-grey-dark` | `#444240` | Toggle pill outer bg, borders, dividers, footer card border |
| `--color-grey-md` | `#5C5957` | Footer copyright text, disabled states |
| `--color-grey` | `#B5A496` | Secondary text, captions, metadata |
| `--color-grey-light` | `#EEE2D9` | Tertiary text, muted labels |
| `--color-light` | `#F2EAE3` | Primary text — all body and heading copy; loading screen background |
| `--color-yellow` | `#FFC567` | Accent — Professional mode highlight |
| `--color-pink` | `#FC7DA8` | Accent — Fun mode highlight |
| `--color-blue` | `#048CD6` | Links, interactive states, informational |

### Color Usage Rules

- `--color-dark` (`#1A1A1A`) is the one and only page background. No light mode, no theme switching.
- `--color-light` (`#F2EAE3`) doubles as the loading screen background (inverted from site) and the primary text color.
- `--color-yellow` and `--color-pink` are the dual accent colors — yellow signals professional, pink signals fun. Never use them interchangeably.
- `--color-grey` through `--color-grey-light` form a descending hierarchy for secondary and tertiary content.

---

## Typography

**Single typeface: Montserrat** — loaded from Google Fonts.

```
https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;800&display=swap
```

Weights in use: **300** (Light) · **400** (Regular) · **500** (Medium) · **800** (ExtraBold)

### Type Styles

| Name | Size | Line Height | Weight | Notes |
|---|---|---|---|---|
| `body-r` | 16px | 24px | 400 | Default body text, paragraphs |
| `body-compact` | 16px | 16px | 400 | Tags, labels, single-line UI text |
| `subtitle` | 24px | 24px | 300 | Subtitles, card descriptions |
| `title` | 32px | 32px | 500 | Section headers, card titles |
| `display` | 56px | 64px | 800 | Hero headings, page titles |
| `hero` | 100px | 100px | 500 | Footer CTA, large decorative text, nav "Next Project" target |
| `loading-counter` | 340px | 340px | 800 | Loading screen counter only — tabular nums |

Letter-spacing: `display` uses **+5%** (`letter-spacing: 0.05em`). All others default (0).

### Tailwind Custom Utilities (add to `tailwind.config.ts`)

```ts
fontSize: {
  'body-r':       ['16px',  { lineHeight: '24px',  fontWeight: '400' }],
  'body-compact': ['16px',  { lineHeight: '16px',  fontWeight: '400' }],
  'subtitle':     ['24px',  { lineHeight: '24px',  fontWeight: '300' }],
  'title':        ['32px',  { lineHeight: '32px',  fontWeight: '500' }],
  'display':      ['56px',  { lineHeight: '64px',  fontWeight: '800' }],
  'hero':         ['100px', { lineHeight: '100px', fontWeight: '500' }],
  'loading':      ['340px', { lineHeight: '340px', fontWeight: '800' }],
}
```

---

## Loading Screen

Shown once on initial page load before the site is revealed.

| Property | Value |
|---|---|
| Background | `#F2EAE3` (`--color-light`) — inverted from the rest of the site |
| Text | `000%` → `100%` counter, Montserrat ExtraBold 340px, color `#272727` |
| Number rendering | Tabular figures: `font-feature-settings: 'tnum'` — prevents layout shift as digits change |
| Minimum duration | 2 seconds, even if the page loads faster |
| Real progress | If the page genuinely takes longer than 2s, counter reflects real load progress |
| Exit animation | Fade out + slide up, revealing the site underneath. Duration: ~600ms ease-in-out |
| Counter format | Always 3 digits: `000%`, `025%`, `100%` — zero-padded |

### Implementation Notes

- The counter is a Client Component running a `requestAnimationFrame` or `setInterval` loop
- Clamp progress to `[0, 100]`; never exceed 100%
- The loading screen sits at `fixed inset-0 z-[100]` above everything
- Once dismissed, it is unmounted from the DOM (not just hidden)
- Use Framer Motion `AnimatePresence` to handle the exit animation cleanly

---

## Background (All Pages)

Every page shares the same layered background treatment:

### Layer 1 — Base color
`background-color: #1A1A1A`

### Layer 2 — Animated gradient mesh
- A radial gradient (or set of radial gradients) that moves toward the cursor position like a magnet
- Implemented with CSS variables updated on `mousemove` (and `touchmove` on mobile)
- Gradient colors: subtle variations of `#1A1A1A` with hints of the current mode accent at very low opacity (e.g. 5–8%)
- Transition: `transition: background-position 0.6s ease` or requestAnimationFrame for smooth tracking
- On mobile: reacts to touch position (`touchmove` → update gradient origin)

### Layer 3 — SVG grain texture
- An SVG `<feTurbulence>` noise filter or a static grain PNG
- Overlaid at **15–20% opacity** using `mix-blend-mode: overlay` or `opacity`
- Applied via a `::before` pseudo-element or an absolutely positioned `<div>` with `pointer-events: none`
- Covers the full viewport, fixed (does not scroll with content)

### Implementation Structure

```tsx
// Background.tsx — Client Component, rendered in root layout
// Layer order (bottom to top):
// 1. <div> bg-[#1A1A1A]         — base
// 2. <div> gradient mesh        — mouse-reactive
// 3. <div> grain overlay        — fixed, pointer-events-none, 15-20% opacity
// 4. {children}                 — page content
```

---

## Global Mode Toggle

### Concept

The toggle is the personality core of the site. It switches between Professional and Fun project sets and shifts the accent color system throughout. Always visible on every page.

### State

```ts
type Mode = 'professional' | 'fun'
```

- **Default:** `professional`
- **Stored in:** React context (`ModeContext`) — provided at root layout level
- **No localStorage persistence** — resets to `professional` on each page load

### Mode Transition

When the mode switches, components that respond to mode **crossfade** between their professional and fun states over **0.4s ease**. This applies to:
- Accent color changes (yellow ↔ pink)
- Project visibility (which projects are shown)
- Any text or UI element that reads from mode context

Use Framer Motion `AnimatePresence` or CSS `transition` on color/opacity as appropriate.

### Toggle Component Spec

| Property | Value |
|---|---|
| Shape | Pill |
| Width | 96px |
| Height | 50px |
| Outer background | `#444240` (`--color-grey-dark`) |
| Inner knob background | `#1F1F1F` (`--color-surface-dark`) |
| Knob size | ~42px diameter (4px inset on all sides) |
| Position | `fixed bottom-6 left-1/2 -translate-x-1/2` |
| z-index | 50 |

### Toggle States

| Mode | Icon in knob | Knob position |
|---|---|---|
| `professional` | MEH face — neutral expression | Right side of pill |
| `fun` | YES face — happy/smiling expression | Left side of pill |

The icon is part of the knob — it slides with it. Knob animates left ↔ right via Framer Motion spring (`stiffness: 400, damping: 30` or similar).

### Icon Design (inline SVG, ~24×24px centered in knob)

- **MEH (professional):** Circle, flat horizontal mouth, neutral dot eyes. Fill: `#EEE2D9` or `#FFC567`.
- **YES (fun):** Circle, wide arc smile, bright eyes. Fill: `#FC7DA8`.

### Accent Color by Mode

| Mode | Accent | Applied to |
|---|---|---|
| `professional` | `#FFC567` (yellow) | Active states, mode tags, accent highlights |
| `fun` | `#FC7DA8` (pink) | Active states, mode tags, accent highlights |

---

## Custom Cursor (Desktop Only)

Replaces the default browser cursor on non-touch devices.

| Property | Value |
|---|---|
| Default state | Small filled circle, ~12px diameter, color `#F2EAE3` |
| Hover state | Scales up to ~32px, border only (hollow), `border: 1.5px solid #F2EAE3` |
| Transition | Spring or `0.15s ease` for scale, cursor position follows instantly (no lag) |
| Mix blend mode | `mix-blend-mode: difference` (optional — adds inversion effect over light elements) |
| z-index | 9999, `pointer-events: none` |
| Mobile | Not rendered — detect touch device via `@media (pointer: fine)` or JS |

### Hover triggers

Any element with `cursor-pointer` or that is naturally interactive (`a`, `button`) triggers the expanded state. Implement by adding a `data-cursor="hover"` attribute convention or by listening to `mouseenter`/`mouseleave` on interactive elements.

---

## Homepage Layout

The homepage is **not** a scrollable grid. It has **4 full-viewport sections** that scroll vertically:

### Section 1 — Hero
- Full viewport height (`min-h-screen`)
- Primary identity statement — name, role, mode context
- No navigation bar

### Section 2 — Projects (Orbit)
- Full viewport height
- Projects are displayed in an **orbit/circular layout** — project items arranged around a central point
- The visible set of projects responds to the current mode (professional or fun) with a crossfade transition
- Exact orbit mechanics (radius, rotation, interaction) to be designed at build time

### Section 3 — About Me
- Full viewport height
- Personal introduction, background, approach

### Section 4 — Footer
- See Footer section below
- Includes "LET'S CONNECT" CTA and bottom bar

**No navigation bar on the homepage.** The mode toggle is still present (fixed bottom center).

---

## Navigation (Inner Pages Only)

Shown on all pages **except** the homepage.

| Property | Value |
|---|---|
| Position | Fixed top bar |
| Background | `#1A1A1A` with `border-b: 1px solid #272727` |
| Left slot | "George Koulouris" — Montserrat Regular 16px, `#F2EAE3`, links to `/` |
| Right slot | "Next Project →" — Montserrat Regular 16px, `#F2EAE3`, links to next project in sequence |
| Padding | `px-8 md:px-12`, `h-16` |

### "Next Project" Logic

Projects cycle in the order they appear in `projects.json`. The last project loops back to the first. The navigation must know the current project slug and compute the next one.

---

## Footer (All Pages)

The footer appears at the bottom of every page (as Section 4 on homepage, as a standard footer section on inner pages).

### "LET'S CONNECT" Card

| Property | Value |
|---|---|
| Width | 1200px (centered, responsive below that) |
| Border | `2px solid #444240` |
| Border radius | `48px` |
| Padding | Generous — vertically centered text, ~80px top/bottom |
| Text | "LET'S CONNECT" |
| Text style | Montserrat Medium 100px, `#F2EAE3` |
| Default state | Transparent background, `#F2EAE3` text |
| Hover state | Background fills `#F2EAE3`, text color inverts to `#1A1A1A` |
| Hover transition | `0.3s ease` |
| Link target | LinkedIn (placeholder URL for now) |
| Cursor | Custom cursor enters hover state |

### Bottom Bar

```
[BEHANCE]          © George Koulouris          [INSTAGRAM]
```

| Element | Style | Link |
|---|---|---|
| BEHANCE | `body-compact`, `#B5A496` | Placeholder `#` |
| Copyright | `body-compact`, `#5C5957` — centered | No link |
| INSTAGRAM | `body-compact`, `#B5A496` | Placeholder `#` |

All social links are placeholders for now — set `href="#"`.

---

## Project Images

- Stored in `public/images/projects/<slug>/`
- One subfolder per project, named by slug (e.g. `public/images/projects/gaspar-ai/`)
- Each project page controls its own image layout
- No CDN or cloud provider — Next.js `<Image>` with local `public/` paths

---

## Component Behavior

### Project Cards (Orbit Layout)

- Cards in the orbit section are not standard grid cards
- Exact visual treatment defined at build time — they should be lightweight and not compete with the orbit motion
- Mode filter: professional projects visible in professional mode, fun projects in fun mode
- Crossfade between modes: 0.4s ease

### Page Transitions (Inner Pages)

- Route changes: fade + slight upward translate (`y: 16px → 0`, opacity `0 → 1`, 400ms ease-out)
- Powered by Framer Motion `<AnimatePresence>` in root layout

### Scroll Animations

- `whileInView` with `once: true`
- Default: fade up (`y: 24 → 0`, opacity `0 → 1`, 500ms `easeOut`)
- Staggered lists: `staggerChildren: 0.08`

---

## Data Layer

All content lives in `/data/`:

- `projects.json` — 15 project objects: `id`, `title`, `subtitle`, `category` (`ux-ui` | `creative`), `mode` (`professional` | `fun`), `slug`
- `site.json` — name, title, location, email, tagline, social links

Imported directly in Server Components — no API layer.

Case study content (images, body copy, sections) lives co-located in each `app/projects/<slug>/page.tsx`. No headless CMS.

---

## File Structure

```
george-portfolio/
├── app/
│   ├── layout.tsx                  ← root layout: Montserrat, ModeContext, Background, AnimatePresence
│   ├── page.tsx                    ← homepage: 4 full-viewport sections (no nav)
│   └── projects/
│       ├── gaspar-ai/page.tsx
│       ├── piraeus-insurance/page.tsx
│       ├── insurance-product-flows/page.tsx
│       ├── cancellation-wallet/page.tsx
│       ├── cybersential/page.tsx
│       ├── bancasure360/page.tsx
│       ├── mood/page.tsx
│       ├── istorima/page.tsx
│       ├── benefit/page.tsx
│       ├── music-festivals/page.tsx
│       ├── book-cover/page.tsx
│       ├── logo-designs/page.tsx
│       ├── psychologist-branding/page.tsx
│       ├── illustrations/page.tsx
│       └── custom-typefaces/page.tsx
├── context/
│   └── ModeContext.tsx             ← global Professional/Fun mode state + provider
├── components/
│   ├── LoadingScreen.tsx           ← full-viewport loading counter, mounts first
│   ├── Background.tsx              ← layered: base + gradient mesh + grain, cursor-reactive
│   ├── CustomCursor.tsx            ← desktop-only cursor replacement
│   ├── ModeToggle.tsx              ← fixed bottom-center pill toggle
│   ├── Nav.tsx                     ← inner pages only: name left, next project right
│   ├── Footer.tsx                  ← LET'S CONNECT card + bottom bar
│   ├── ProjectCard.tsx             ← orbit-layout project item
│   └── ...
├── data/
│   ├── projects.json
│   └── site.json
├── public/
│   └── images/
│       └── projects/
│           ├── gaspar-ai/
│           ├── piraeus-insurance/
│           └── ...                 ← one subfolder per project slug
├── CONTEXT.md
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-05-21 | Dark background only (`#1A1A1A`) | Single fixed dark theme — no light mode |
| 2026-05-21 | Montserrat exclusively | One typeface, controlled weights — disciplined and distinctive |
| 2026-05-21 | Yellow + Pink as dual accents | Yellow = professional authority; Pink = creative energy |
| 2026-05-21 | Mode toggle fixed bottom center | Always accessible, never interrupts content |
| 2026-05-21 | MEH / YES face icons in toggle | Personality-forward; communicates modes at a glance |
| 2026-05-21 | Case study content on-site | Full creative control; no Behance/Figma dependency |
| 2026-05-21 | No CMS | Static JSON + co-located page content; simplest data layer |
| 2026-05-21 | App Router (Next.js 14) | RSC, layouts, AnimatePresence at root |
| 2026-05-21 | Homepage: 4 full-viewport sections | Not a grid — orbit layout for projects, immersive scrolling |
| 2026-05-21 | Mode crossfade: 0.4s ease | Smooth, not jarring; communicates intentional shift |
| 2026-05-21 | Loading screen inverted palette | `#F2EAE3` background with `#272727` counter — dramatic reveal into dark site |
| 2026-05-21 | Loading counter: 340px ExtraBold tabular | Dominant, typographic, prevents digit-width jitter |
| 2026-05-21 | Gradient mesh + grain background | Adds depth and texture to flat dark bg; cursor magnetism adds interactivity |
| 2026-05-21 | Custom cursor desktop only | Enhances desktop feel; safely skipped on touch devices |
| 2026-05-21 | Footer: LET'S CONNECT card | Single clear CTA; no form, no mailto — direct to LinkedIn |
| 2026-05-21 | No nav on homepage | Homepage is self-contained; nav only needed on inner pages |
| 2026-05-21 | Inner nav: next project link | Encourages sequential exploration; keeps visitors in the work |
| 2026-05-21 | Images in `public/images/projects/<slug>/` | Simple, co-located, no CDN overhead |

---

## Open Questions

*All previously open questions have been resolved. New questions as they arise go here.*

- [ ] Orbit layout: do projects orbit continuously (animated rotation) or are they static positions the user interacts with?
- [ ] On inner project pages, what is the case study structure? (e.g. hero image, overview, problem, solution, outcomes sections?)
- [ ] Nav "Next Project" on the last project — does it loop to the first, or is the link hidden?
