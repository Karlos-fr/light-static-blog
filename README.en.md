<p align="center">
  <img src="doc/header.png" alt="Light Static Blog" />
</p>

<p align="center">
  <a href="README.md"><img src="doc/flag-fr.svg" alt="" width="18" height="12" /> Français</a>
  /
  <a href="README.en.md"><img src="doc/flag-gb.svg" alt="" width="18" height="12" /> English</a>
</p>

# Light Static Blog

Minimal personal blog with Astro, TypeScript and Markdown.

## Stack

- Astro
- TypeScript
- Markdown for articles
- Simple CSS, without a heavy frontend framework

## Architecture and File Tree

The project is fully static: Astro turns pages and Markdown articles into HTML files in `dist/`. No Node server, backend, CMS or database is required in production.

```text
.
├── public/                     # Static files copied as-is
│   ├── images/                 # Article covers
│   ├── robots.txt
│   ├── scripts/                # Minimal light/dark switch, dependency-free
│   ├── rss.xsl                 # RSS feed presentation in a browser
│   └── sitemap.xsl             # Sitemap presentation in a browser
├── src/
│   ├── components/             # Shared structure, lists and pagination
│   ├── config/site.ts          # Identity, active theme and page size
│   ├── content/
│   │   ├── blog/               # Markdown articles; the filename becomes the slug
│   │   ├── config.ts           # Frontmatter schema and validation
│   │   └── TAGGING.md          # Tagging convention
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shared HTML structure and SEO
│   ├── lib/                    # Content, URLs and pagination
│   ├── pages/
│   │   ├── [slug].astro        # Article pages
│   │   ├── tags/               # Tags index and tag pages
│   │   ├── about.astro
│   │   ├── index.astro         # First article page
│   │   ├── page/[page].astro   # Following static pages
│   │   ├── rss.xml.ts
│   │   ├── sitemap.xml.ts
│   │   └── styles/theme.css.ts # Stable stylesheet composed at build time
│   └── themes/
│       ├── registry.ts         # Theme registry and validation
│       ├── shared/             # Shared foundations and contracts
│       ├── default/theme.css   # Default public theme
│       └── <identifier>/       # Optional additional themes
├── astro.config.mjs            # Static build and public path
├── ARTICLE_TEMPLATE.md         # Template for writing an article
├── package.json                # Scripts and dependencies
└── README.md
```

Articles are loaded from the `blog` collection, sorted by descending date and filtered to exclude `draft: true`. They are split into pages of six posts. Astro components carry the semantic structure; themes contain only tokens and visual rules.

The hosting path is defined only by `BASE_PATH`. For example, with `BASE_PATH=/blog/`, the homepage is published under `/blog/` and each article under `/blog/<slug>/`.

## Requirements

- Node.js 24 LTS
- npm

The `.nvmrc` and `.node-version` files let compatible managers automatically select the right Node.js version.

## Installation

```bash
npm install
```

## Development

```bash
SITE="http://localhost:4321" BASE_PATH="/" AUTHOR_NAME="Author name" SITE_THEME="default" npm run dev
```

The site is then available at `http://localhost:4321`.

On PowerShell:

```powershell
$env:SITE="http://localhost:4321"
$env:BASE_PATH="/"
$env:AUTHOR_NAME="Author name"
$env:SITE_THEME="default"
npm run dev
```

## URL Configuration

Three environment variables are required and one is optional:

- `SITE`: public site origin, without a final path, for example `https://example.com`;
- `BASE_PATH`: public path ending with `/`, for example `/` or `/blog/`.
- `AUTHOR_NAME`: author name shared by all articles.
- `SITE_THEME`: identifier of the theme being built; `default` is used by default.

These values feed internal links, canonical URLs, social metadata, JSON-LD structured data, the RSS feed and the sitemap.

The homepage exposes a `WebSite` JSON-LD object. Each article exposes a `BlogPosting` object containing its title, description, dates, tags, optional cover and the author defined by `AUTHOR_NAME`.

## Production Build

Example for a site published under `https://example.com/blog/`:

```bash
SITE="https://example.com" BASE_PATH="/blog/" AUTHOR_NAME="Author name" SITE_THEME="default" npm run validate
```

On PowerShell:

```powershell
$env:SITE="https://example.com"
$env:BASE_PATH="/blog/"
$env:AUTHOR_NAME="Author name"
$env:SITE_THEME="default"
npm run validate
```

The `validate` command checks types and then generates the static site in `dist/`. To run only the generation:

```bash
npm run build
```

## Add an Article

Create a file in `src/content/blog/`, for example `my-article.md`. The filename becomes the public slug.

```md
---
title: "My title"
description: "Short summary"
pubDate: 2026-08-01
updatedDate: 2026-08-02 # optional
tags:
  - javascript
  - astro
draft: false
cover: "/images/cover.webp" # optional
---

Article content in Markdown.
```

- `draft: false` publishes the article.
- `draft: true` excludes it from pages, tags, RSS and sitemap.
- `cover` references a file placed in `public/` from the public root.
- The RSS feed contains the full HTML of each article. Covers and all images embedded in the content are published there with absolute URLs and Media RSS tags.
- Slugs matching a reserved route, such as `about`, `blog` or `tags`, are rejected at build time.

The `ARTICLE_TEMPLATE.md` file can be used as a starting point.

## Themes and Light/Dark Mode

The theme is selected at build time with `SITE_THEME`. The browser can only switch its light or dark palette. Without a saved choice, the site follows `prefers-color-scheme`; the switch then stores the choice in `localStorage`. HTML pages, RSS and sitemap all load `styles/theme.css` and the same two static scripts.

To add a theme:

1. Create `src/themes/<identifier>/theme.css`.
2. Define all semantic tokens used by the components, including light and dark palettes via `data-color-mode` and the `prefers-color-scheme` fallback.
3. Define the theme's own visual resources, for example `--color-rss`, `--icon-rss`, `--color-sitemap`, `--icon-sitemap` and the `--powered-icon-size` size of the project link.
4. Run `npm run validate` with `SITE_THEME=<identifier>` and test both modes, responsive layout, RSS and sitemap.

Themes are automatically discovered from `src/themes/<identifier>/theme.css`. An unknown `SITE_THEME` value makes the build fail with the list of available themes. No frontend framework or remote font is required.

## Publish an Article

1. Create the article in `src/content/blog/`.
2. Keep `draft: true` while writing.
3. Place the optional cover in `public/images/`.
4. Proofread the article, then switch `draft` to `false`.
5. Run `npm run validate` with the production values for `SITE`, `BASE_PATH` and `AUTHOR_NAME`.
6. Optionally check the result with `npm run preview`.
7. Deploy the contents of the `dist/` folder to the static hosting.

### Pre-Publication Checklist

- [ ] The title and description match the content.
- [ ] `pubDate` is correct.
- [ ] `updatedDate` is filled only when the article has been updated.
- [ ] Tags are consistent with `src/content/TAGGING.md`.
- [ ] The optional cover exists in `public/`.
- [ ] `draft: false` is set.
- [ ] `npm run validate` passes without errors.

## Local Build Preview

After defining `SITE`, `BASE_PATH` and `AUTHOR_NAME`:

```bash
npm run preview
```

## Deployment

The project is compatible with any hosting able to serve static files.

1. Define `SITE`, `BASE_PATH`, `AUTHOR_NAME` and optionally `SITE_THEME` with the target values.
2. Run `npm run validate`.
3. Upload the **contents** of `dist/`, not the folder itself, to the chosen public root.
4. Check the homepage, one article, `rss.xml` and `sitemap.xml`.

The `dist/` folder is a generated artifact, ignored by Git and intended to be rebuilt before each deployment.

## Constraints

- No backend
- No database
- No CMS
- No runtime API
- Client-side JavaScript limited to the light/dark switch; the content remains usable without JavaScript

## Useful Commands

```bash
npm install
SITE="http://localhost:4321" BASE_PATH="/" AUTHOR_NAME="Author name" SITE_THEME="default" npm run dev
SITE="https://example.com" BASE_PATH="/blog/" AUTHOR_NAME="Author name" SITE_THEME="default" npm run validate
SITE="https://example.com" BASE_PATH="/blog/" AUTHOR_NAME="Author name" SITE_THEME="default" npm run preview
```
