# New business website

Executive-grade, 3D, scroll-driven rebuild of the client's existing website, built with Astro. Started from the Blackfin Fuels engine (motion system, components, compact type scale, preview deploy) with all Blackfin content removed.

**Status:** starter. Waiting for the live site link. All business details, brand colours, fonts and the logo are placeholders. See "First steps" in `CLAUDE.md`.

```
npm install
npm run dev         # http://localhost:4321
npm run build       # static site in dist/
npm run build:demo  # preview build (noindex)
```

## Folders

- `src/` the site (pages, layout, components, styles, motion scripts, shared facts in `data/site.ts`)
- `tools/mirror.py` mirrors the live site into `reference/` (kept local, never published)
- `tools/qa/` headless Chrome checks: screenshots, page/link checks, page weight (`cd tools/qa && npm install` once)
- `.claude/agents/` project agents: `site-auditor`, `page-builder`, `visual-qa`
- `.github/workflows/pages.yml` publishes the demo build to GitHub Pages on every push to `main`
- `docs/` audit, brand and plan documents (written once the live site is mirrored)

`CLAUDE.md` holds the working rules for AI-assisted sessions in this repo.
