# vibhabellutagi19.github.io

Personal portfolio and technical blog — terminal/editor UI, static Next.js export, deployed to GitHub Pages.

**Live site:** [vibhabellutagi19.github.io](https://vibhabellutagi19.github.io)

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, `output: 'export'`)
- React 18
- Markdown blog content in `blog/posts/` (unchanged slugs and assets)
- GitHub Actions → static `out/` → `gh-pages` branch

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build (same as CI)

```bash
npm run build    # syncs post assets, then next build → out/
npm test
npx serve out    # optional: preview the static export
```

## Project structure

```
├── blog/posts/           # Markdown posts (source of truth for blog content)
│   ├── posts.json        # Post folder manifest
│   └── <date>-<slug>/index.md
├── public/               # Static assets (synced post images → public/posts/)
├── scripts/
│   └── sync-post-assets.mjs
├── src/
│   ├── app/              # Next.js routes (home, blog, sitemap, robots)
│   ├── components/       # Terminal shell, about panel, etc.
│   ├── data/site.js      # Experience, metrics, projects, about copy
│   └── lib/              # Posts loader, markdown, search/terminal helpers
├── .github/workflows/deploy.yml
└── next.config.mjs
```

## Editing content

| What | Where |
|------|--------|
| Experience, highlights, about text | `src/data/site.js` |
| Side projects (hidden until array is non-empty) | `projectsData` in `src/data/site.js` |
| New blog post | Add folder under `blog/posts/`, update `posts.json` — see `blog/posts/README.md` |
| Homepage layout / sections | `src/app/page.js` |
| Themes & styles | `src/app/terminal.css`, `src/app/globals.css` |

Blog URLs: `/blog/<slug>/`  
Legacy links `/blog/post.html?post=<slug>` redirect to the canonical slug URL.

## Deploy to GitHub Pages

Deployment is automated on push to **`main`**.

1. **Repository → Settings → Pages**
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `/ (root)`

2. Merge your changes into `main` and push:

   ```bash
   git push origin main
   ```

3. Check **Actions → Deploy to GitHub Pages**. When it succeeds, the site updates at the live URL above.

You can also run the workflow manually: **Actions → Deploy to GitHub Pages → Run workflow**.

The workflow runs `npm ci`, `npm run build`, and publishes the `out/` directory with [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

## Features

- Terminal-style layout (tmux bar, sidebar, vim status line, themes)
- Search palette (`⌘K` / `/`) and interactive terminal (`` ` ``)
- Static blog from existing markdown posts
- SEO: sitemap, robots, per-page metadata

## Troubleshooting

**Site not updating after push?**  
Confirm the workflow ran on `main` and Pages is set to the `gh-pages` branch.

**Blog images missing locally?**  
Run `npm run build` once (or `node scripts/sync-post-assets.mjs`) to copy assets into `public/posts/`.

**Stale dev errors (`vendor-chunks`, etc.)?**  
```bash
rm -rf .next && npm run dev
```

## License

Personal portfolio — use as reference; adapt for your own site as you like.
