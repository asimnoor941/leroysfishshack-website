# Leroy's Fish Shack website

Executive-grade, 3D, scroll-driven rebuild of https://leroysfishshack.com/ (waterfront seafood restaurant, Fishermen's Village, Punta Gorda FL). Same client as Blackfin Fuels (`C:\Projects\Blackfinfuels-Website`), different business. Started as a copy of the Blackfin engine.

**Status (2026-11-14):** live site mirrored to `reference/original-site/` and audited (`docs/SITE-AUDIT.md`, `docs/BRAND.md`, `docs/ASSET-INVENTORY.md`). Brand tokens, fonts (Fraunces + Plus Jakarta Sans), logo and `src/data/site.ts` are real. Home page built (scenes in `src/scripts/home.ts`); `/private-events/`, `/reservations/` and a new HTML `/menu/` are next. Media is imported with `python -I scripts/import-assets.py`. Preview repo: `asimnoor941/leroysfishshack-website` (GitHub Pages).

**No questions to the owner:** resolve conflicts ourselves (most specific source wins; e.g. private events = the River Room, up to 50 guests) and leave missing facts out. Local DNS can't resolve leroysfishshack.com: pin 160.153.0.117 (curl `--resolve`).

## First steps once we have the live site link

1. Mirror it: `python -I tools/mirror.py reference/original-site <host>`. This writes `content/<slug>.md` (copy), `media/`, `pages/` and `manifest.json`.
2. Audit it (agent `site-auditor`): pages, URLs, facts, conflicts, licence-risky images, speed (`tools/qa/weigh.mjs`). Write `docs/SITE-AUDIT.md`.
3. Brand: pull colours, fonts and logo from the live site into `docs/BRAND.md`, then replace the tokens at the top of `src/styles/global.css`, the fonts in `BaseLayout.astro`, `Logo.astro`, favicons and `public/site.webmanifest`.
4. Fill `src/data/site.ts`, `astro.config.mjs` (`site`), `public/robots.txt`, nav and footer links.
5. Agree the direction on the **home page first** (show the owner a preview) before building the other pages.
6. Build the remaining pages with the same URLs as the live site, then run `visual-qa`.
7. Preview hosting: create a GitHub repo under **asimnoor941**, enable Pages (Source: GitHub Actions) and push to `main`.

## Stack

Astro 7 (static), plain CSS, GSAP ScrollTrigger + Lenis for motion. Node 22.23+ (24 installed). No UI framework, no WebGL.

```
npm run dev         # http://localhost:4321
npm run build       # static site in dist/
npm run build:demo  # preview build: noindex (.env.demo)
node scripts/rebase.mjs dist <repo>     # prefix links for GitHub Pages (CI does this)
python -I tools/mirror.py reference/original-site <host>
node tools/qa/shot.mjs <url> <out.jpg> [--full] [--mobile] [--scroll=0.5]
BASE=http://localhost:4321 node tools/qa/pagescheck.mjs / /about-us/
node tools/qa/weigh.mjs <live-url> <preview-url>
```

`tools/qa` has its own `npm install` (puppeteer-core, uses the installed Chrome). Git Bash turns a leading `/path` argument into a Windows path: run the QA scripts from PowerShell, or pass paths without the leading slash.

## Owner preferences (learned on Blackfin, apply here)

- Compact and calm: smaller type, little empty space, stacked sections. A dense bento/tile home page was rejected as "too rushy".
- No decorative line before eyebrow labels (it reads as an em dash). No em dashes in copy either.
- Mobile-friendly first; check 390px width.
- Must look clearly different from the old site, not the old layout with animations added.
- Ask (with a preview) before any big layout change. Don't fan out page-building agents until the direction is approved on one page.
- Messages for the owner: WhatsApp format, plain bullets, no emojis.

## Motion rules

3D effects are on the content itself (tilt, swing, flip, turn), driven by scroll, via `data-3d` attributes handled in `src/scripts/motion.ts`. Nothing animates on page load; only the section being scrolled moves. `autoAssign3D` gives inner pages effects automatically. Balance the kinds:
- scroll-driven 3D (`data-3d="tilt|swing|flip|table|turn|depth|draw|stage"`) for set pieces;
- `data-3d="pop"` / `"pop-group"` plays once on entry, for lists and figures;
- `data-float` for phones and badges (starts after the first scroll);
- `data-hover-tilt` for static cards;
- reading content stays static. Forms never move; highlight them with a glow instead.
- `data-float-open` floats elements inside an open `<dialog>`.
All motion respects `prefers-reduced-motion`.

## Rules

- Copy comes from `reference/original-site/content/`. Keep the live wording; fix only typos. Do not invent facts, numbers, prices, testimonials, service areas or team details. If something is missing, leave it out and report it. If the live site contradicts itself, ask the owner and record the answer here.
- URLs must match the live site (trailing slash) so rankings carry over. Internal links are root-relative with a trailing slash.
- Contact details and shared facts come only from `src/data/site.ts`.
- Images: check licences. Stock images (Shutterstock, Adobe Stock, iStock, watermarked or unknown origin) are not reused unless the owner confirms a licence. Prefer the business's own photos.
- `reference/` is third-party material: never import from it, never publish it (it is in `.gitignore`). Copy what we may use into `src/assets/` via a script.
- Do not claim integrations that do not exist yet.
- All content is real HTML. One `<h1>` per page (PageHero provides it); headings in order.
- Private details (emails, credentials) never go into requests to outside services.

## Where things are

| Path | What it is |
|---|---|
| `src/pages/` | One `.astro` file per route. |
| `src/layouts/BaseLayout.astro` | Head, schema.org (Organization, WebSite, BreadcrumbList), header, footer. |
| `src/components/` | Shared components; each documents its props at the top. |
| `src/data/site.ts` | Shared facts (placeholders now). |
| `src/styles/global.css` | Tokens (brand colours/fonts are still Blackfin's placeholders) and shared classes. |
| `src/scripts/` | `motion.ts` (3D/pop/float/hover), `lenis.ts`, `site.ts`, `track.ts`. |
| `tools/` | `mirror.py` (live-site mirror), `qa/` (screenshots, page checks, weight). |
| `.claude/agents/` | Project agents: `site-auditor`, `page-builder`, `visual-qa`. |
| `.github/workflows/pages.yml` | Builds the demo and publishes it to GitHub Pages on push to `main`. |

Components: `PageHero`, `Section` (tones base/raised/deep/light), `CtaBand`, `Button`, `Stat`, `FeatureCard`, `Steps`, `Faq`, `Photo`, `VideoClip`, `Icon`, `Logo`, `Contours`, `Header`, `Footer`.
Classes: `container`, `grid grid--2|3|4`, `split` (+ `split--flip`), `stack`, `cluster`, `card`, `frame`, `tag`, `checklist`, `eyebrow`, `lede`, `prose`, `numeral`, `muted`. `data-reveal` / `data-reveal-group` for simple reveals.
Page-specific styles go in a `<style>` block using the tokens (no new colours or fonts outside the tokens).

## Astro 7 gotchas

- Every non-void tag must be closed; no block elements inside `<p>`.
- Images: `import x from '../assets/...'` then `<Photo>` / `<Picture>`; never a string path into `src/`.
- Scoped styles do not reach child components: use `:global(...)` or a wrapper.
- `compressHTML` is `true`; leave it.

## Building a page

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHero from '../components/PageHero.astro';
import Section from '../components/Section.astro';
import CtaBand from '../components/CtaBand.astro';
---
<BaseLayout title="About" description="..." breadcrumbs={[{ name: 'About', href: '/about-us/' }]}>
  <PageHero eyebrow="..." title="About" lede="..." image={photo} imageAlt="..." />
  <Section eyebrow="..." title="..." lede="..." tone="raised"> ... </Section>
  <CtaBand title="..." text="..." />
</BaseLayout>
```
