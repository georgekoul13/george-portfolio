# Deploying Vol 2

Vol 2 and the live site are **one branch, two deployments**, told apart by one
environment variable. Nothing is deleted and nothing is merged away, so the
swap is a Vercel setting plus a redeploy — and it is undone the same way.

| | `VOL2_AS_ROOT` | what answers at `/` | Vol 2 lives at |
|---|---|---|---|
| **test link** | unset | vol1, untouched | `/vol2` |
| **the real site** | `1` | Vol 2 | `/`, `/product`, `/projects/…` |

Both names must be set together:

```
VOL2_AS_ROOT=1
NEXT_PUBLIC_VOL2_AS_ROOT=1
```

The server needs the first to rewrite; `lib/seo.ts` needs the second because
canonicals render on the client too. Setting only one gives you a site served
at `/` whose every canonical still points at `/vol2` — worse than not
migrating at all — so the build **throws** rather than letting that ship.

## 1. The test link — do this first

Deploy the `vol2` branch to Vercel with **no environment variables**. Vercel
gives you a preview url; share:

```
https://<preview>.vercel.app/vol2
```

The live site is unaffected: `georgekoulouris.com` keeps serving whatever is
on `main`.

What testers should be told to look at: the home page's rank of projects, a
category page, and two or three case studies including **Gaspar AI** (the
longest) and **Mood** (four picture groups). On a phone as well as a laptop.

## 2. The swap

When the test link is signed off:

1. Set both variables in the Vercel project, Production scope only.
2. Merge `vol2` into `main` (or point Production at the `vol2` branch).
3. Redeploy.

`/` becomes Vol 2. `/vol2/*` **permanently redirects** to the clean paths, so
no page is ever reachable at two urls. The sitemap, every canonical and every
JSON-LD id drop the prefix in the same move, because they all read the same
flag.

To roll back: remove the two variables and redeploy.

## 3. After the swap

- Submit `https://www.georgekoulouris.com/sitemap.xml` in Google Search
  Console. 23 urls.
- vol1's pages are still in the build and still reachable at their own paths.
  They are not in the sitemap and nothing links to them. Decide whether to
  delete them or redirect the ones that had traffic — **check Search Console
  for which old urls actually rank before deleting anything.**
- The seven unused font families in `app/layout.tsx` can be deleted outright
  once vol1's fun mode goes with them.

## Rebuilding the images

Only needed after George exports new artwork into
`public/images/vol2/projects/<Project>/`:

```bash
node scripts/build-image-variants.mjs   # smaller copies of anything > 1600px
node scripts/build-project-assets.mjs   # regenerates components/vol2/project/assets.ts
```

The second stamps every url with a content hash, which is what lets the images
be cached for a year. Replace a picture, re-run it, and readers get the new one
immediately.

The PNG masters live in `assets/masters/` — not served, not in the build.
