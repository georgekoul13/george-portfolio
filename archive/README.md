# Archive

Components that nothing renders any more.

They are **not deleted** — the Vol 2 restructure replaced the screens they
belonged to, but several of them are good work that a future page might want
back, so they live here instead of only in git history. Nothing in `app/` or
`components/` imports anything in this folder, and the build never sees it:
`archive/` sits outside Tailwind's `content` globs, outside `next lint`'s
default directories, and is excluded from `tsconfig`.

The layout mirrors the project, so putting something back is a move:

```bash
# a component
git mv archive/vol2/CategoryDeck.tsx components/vol2/CategoryDeck.tsx

# a route — `archive/app/` maps to `app/`, `archive/vol2/` to `components/vol2/`
git mv archive/app/vol2/contact app/vol2/contact
git mv archive/vol2/contact    components/vol2/contact
cat archive/vol2/contact/contact.tokens.css >> app/tokens.css
```

Anything restored will need a look at its tokens — several read custom
properties (`--cat-h`, `--intro-gap`, `--intro-pad-y`) that may have been
dropped from `app/tokens.css` since.

---

## vol2 — retired 2026-09-08

Replaced by the shared **base screen + one content panel** structure that now
runs every template (`BaseScreen` + `PanelStack`).

| File | What it was | Why it went |
|---|---|---|
| `IntroSection.tsx` | "About me" — Figma 231:16735. The HI THERE / I'M GEORGE pair framing the avatar, with the reveal sentence under it. | The home and category heroes are both `BaseScreen` now. Its `bare` variant was the category hero. |
| `hero/HeroSection.tsx` | The home hero band — wordmark, subtitle, LEARN MORE button. | Split into `hero/Hero.tsx` (the wordmark drawing) and `BaseScreen` (the frame around it). |
| `hero/CtaButton.tsx` | The LEARN MORE button, carrying both of gsap.com's hero-button behaviours — the pointer-origin "flair" fill and the rolling label. | Went with `HeroSection`. Worth keeping: the flair fill is the nicest single piece of motion in the old build. |
| `CategoriesSection.tsx` | The static categories list band — Figma 191:4899. | Replaced by `CategoryStrip`. |
| `CategoryDeck.tsx` | The 3-card Ponpon-style deck with the away-from-cursor lean — Figma 231:17155. | Never shipped; `CategoryStrip` won. Never committed before now. |
| `ConnectSection.tsx` | "Let's connect" — Figma 69:27052. The folder that opens to reveal the Creative Licence. | The footer carries the contact links now. |
| `IdCard.tsx` | The Creative Licence card — Figma 92:5266, Variant2. | Only ever rendered inside `ConnectSection`. |
| `category/CategoryIntro.tsx` | The old top of a category page — back link plus headline, Figma 147:11360. | The category hero is `BaseScreen` now; the back link moved into `MenuBar`. |
| `ArrivingBlock.tsx` | A non-pinned block that rides up over the panel below it and rounds off the same way a real panel does. | The category content became a real `PanelStack` panel, which does this itself. |
| `BackLink.tsx` | The back arrow and label above a page's headline. | Only `ContactForm` still called it; the back arrow is a tile in `MenuBar` now. |

## The contact page — retired 2026-09-08

George dropped it along with About: *"let's drop both — remove them from the
menu and the strip."* The route stayed on disk and kept building for a while
after, reachable by anyone who typed the URL. It is out of the build now.

The form never submitted anywhere — it composed a `mailto:`, which the
footer's EMAIL card opens in one click from every page.

| File | Goes back to |
|---|---|
| `app/vol2/contact/page.tsx` | `app/vol2/contact/page.tsx` |
| `vol2/contact/ContactForm.tsx` | `components/vol2/contact/ContactForm.tsx` |
| `vol2/contact/contact.tokens.css` | appended to `app/tokens.css` |

`Header`'s nav lost its CONTACT entry at the same time — it pointed at this
route. `Header` itself stays: the 404 page and `/vol2/lab` still use it.
