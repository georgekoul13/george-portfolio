# How to Edit the Portfolio — Self-Service Guide

Everything you're likely to want to change, with exact steps.
After any change: save the file, then run the push command at the bottom.

---

## Push Changes to Live Site

After every change, run this in Terminal:

```bash
cd "/Users/george_koulouris/Cluade Ai/george-portfolio" && git add -A && git commit -m "describe what you changed" && git push
```

Vercel will automatically rebuild and deploy. Live in ~2 minutes.

---

## 1. Change Text in a Project

Project text lives in `content/projects/[project-name].ts`.

Open the file, find the text you want to change, edit it, save.

**Example — change the project description (top of every project page):**
```ts
// In content/projects/gaspar-ai.ts
description: 'Your new description here.',
```

**Example — change metadata (role, categories, employer):**
```ts
metadata: {
  role: 'Lead Product Designer',
  categories: ['PRODUCT DESIGN'],
  employer: 'COMPANY NAME',
},
```

---

## 2. Replace an Image

1. Export your new image from Figma (same dimensions as the original)
2. Name it **exactly the same** as the file you're replacing
3. Drop it into `public/images/projects/[project-folder]/`
4. Push — no code changes needed

**To find the right folder:** open the project's `.ts` file in `content/projects/` and look at the `src` values:
```ts
{ src: '/images/projects/piraeus/app-light-1.jpg', alt: '...' }
//                         ↑ folder name     ↑ filename
```

---

## 3. Add a New Image to a Sequence

Open the project's `.ts` file and add a new entry to the `images` array:

```ts
// scrollSequence example
{
  type: 'scrollSequence',
  images: [
    { src: '/images/projects/piraeus/web 1.jpg', alt: 'Screen 1' },
    { src: '/images/projects/piraeus/web 2.jpg', alt: 'Screen 2' },
    { src: '/images/projects/piraeus/web 3.jpg', alt: 'Screen 3' },
    { src: '/images/projects/piraeus/web 4.jpg', alt: 'Screen 4' },
    { src: '/images/projects/piraeus/web 5.jpg', alt: 'Screen 5' }, // ← new
  ],
},
```

Make sure the image file exists in `public/images/projects/[folder]/`.

---

## 4. Change the Order of Projects on the Home Page

Open `content/projects/index.ts`. The order of entries = the order projects appear:

```ts
const projects: Record<string, ProjectContent> = {
  'gaspar-ai':           gasparAi,       // ← appears first
  'piraeus-insurance':   piraeusInsurance,
  'wallbid':             wallbid,
  // ... drag entries up/down to reorder
};
```

---

## 5. Change Your Social Links

All three live in `components/footer/FooterSection.tsx` and `components/project-page/MoreProjects.tsx`.

Search for the URL you want to change (e.g. `behance.net`) and replace it in both files.

Current links:
- Behance: `https://www.behance.net/george_koulouris`
- Instagram: `https://www.instagram.com/george_koulouris/`
- LinkedIn: `https://www.linkedin.com/in/george-koulouris/`

---

## 6. Change the OG Preview Image (link preview on WhatsApp/Instagram)

1. Design a new image at **1200 × 630px**
2. Export as `og-image.jpg`
3. Replace `public/og-image.jpg` with the new file
4. Push — no code changes needed

---

## 7. Change the OG Preview Title / Description

Open `app/layout.tsx` and edit these lines:

```ts
title:       'George Koulouris Portfolio',
description: 'Product design, UX, UI, Creative Direction, Illustrations - Based in Greece',
```

Change them in all three places: the top-level `title`/`description`, inside `openGraph: {}`, and inside `twitter: {}`.

---

## 8. Change the Browser Tab Title

Same file — `app/layout.tsx`:

```ts
title: 'George Koulouris Portfolio',  // ← this appears in the browser tab
```

---

## 9. Add a Brand New Project

**Step 1** — Create the content file:
Copy an existing one (e.g. `content/projects/mood.ts`) and rename it to `content/projects/your-project.ts`.
Update the `slug`, `title`, `description`, `metadata`, and `sections`.

**Step 2** — Register it in the index:
Open `content/projects/index.ts` and add two lines:

```ts
import yourProject from './your-project';   // ← add this import

const projects = {
  // ... existing projects ...
  'your-project': yourProject,              // ← add this entry
};
```

**Step 3** — Add images:
Create a folder `public/images/projects/your-project/` and add your images there.

**Step 4** — Push.

---

## 10. Remove a Project

Open `content/projects/index.ts` and delete its import line and its entry in the `projects` object. The page will 404 automatically if someone visits the old URL.

---

## 11. Change the Logo

Replace `public/logo.svg` with your new SVG file (keep the same filename).
The logo appears in: header (HeroSection), footer, 404 page, and MoreProjects.

---

## 12. Change the Favicon

Replace `app/icon.svg` with your new SVG file (keep the same filename).
Next.js picks this up automatically as the browser favicon.
