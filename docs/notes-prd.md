# Notes (second brain): Product Requirements Document

| | |
|---|---|
| **Owner** | Vibha |
| **Status** | v0.7, M1 and M2 built except Mermaid and a notes RSS feed (not yet live) |
| **Date** | 2026-11-19 |
| **Lives at** | `buildwithvibs.in/notes/` |
| **Code** | this repo: `src/lib/notes.js`, `src/app/notes/`, `notes/`, `.claude/skills/note-writing/` |

**History.** v0.1–v0.4 planned a separate Astro site in a private repo, with a local editor. v0.5 moves everything into this portfolio repo (Next.js 15 static export on Vercel), because the portfolio already had most of the reader experience. That changes four decisions, all marked **(v0.5)** below: one repo, a `/notes` path, drafts kept out of Git, and public recall cards. (v0.8 dropped the planned `notes.` subdomain redirect: nothing links to it.)

---

## 1. Summary

A second brain for what I **learn**:
1. **Daily blog notes:** one engineering blog a day, however short, starting now to build the habit.
2. **Cohort notes:** learnings from the software development cohort starting January 2027, shared on Twitter/X with the cohort community.

I explain what I understood to an AI assistant, and it drafts the note **in my words** from a fixed template. Notes are Markdown files, linked with `[[wikilinks]]`, and published one at a time.

**Notes vs blog:**

| | Notes (`/notes`) | Blog (`/blog`) |
|---|---|---|
| What | What I **learned** from others | What I **found** while building software |
| Voice | AI-drafted from my explanation | Written by me |
| Cadence | Daily | Occasional |
| Shape | Short, linked, evergreen concepts | Long-form, standalone story |

## 2. Goals and non-goals

### Goals
1. **Reader experience first:** pleasant to read on phone and desktop.
2. **Capture a blog in under 10 minutes:** explain → AI drafts → check → publish.
3. **Link knowledge:** `[[wikilinks]]`, automatic backlinks, related notes.
4. **Publish per note:** nothing goes live unless I mark it published.
5. **Shareable on Twitter/X:** a ready-to-post line per note.
6. **Remember it:** recall cards on every note.
7. **No new cost:** same repo, same Vercel project, no database.

### Non-goals
- A writing editor (AI drafts; VS Code for fixes)
- Multiple authors, comments, newsletters
- Auto-posting to Twitter/X
- AI features on the site, such as "ask my notes" (v2+)

## 3. Key decisions

| # | Decision | Why | Would change if… |
|---|---|---|---|
| D1 | **Markdown files in Git** are the source of truth | I own them, they're portable, history is free, nothing to operate | I need multi-user or phone-first capture |
| D2 | **No editor; AI-assisted capture** through the `note-writing` skill | I don't write notes by hand, so effort goes to the reader side | I start writing long notes by hand |
| D3 | **(v0.5) Same repo and stack as the portfolio** (Next.js 15, `output: 'export'`) | Reuses the existing TOC, reading progress, code highlighting, share button, tests and design. One codebase to maintain. | Notes outgrow the portfolio (e.g. need server features) |
| D4 | **(v0.5) Served at `/notes`, no subdomain** (v0.8: the `notes.` redirect was dropped) | A true subdomain on a single static export needs host rewrites and absolute links everywhere. A path is simpler and keeps search ranking on one domain. A short `notes.` link could be added later as a redirect in `vercel.json` plus a domain in Vercel. | I want notes to look like a separate site → host rewrite + per-host links (contained change: `NOTES_PATH` and `noteHref` in `src/lib/notes.js`) |
| D5 | **(v0.5) Drafts live in `notes/drafts/`, git-ignored** | This repo is public; anything committed is visible on GitHub, even if not built. Drafts never leave my machine. | The repo goes private |
| D6 | **Publishing is enforced by the build**: only `status: published` notes in `notes/` are built; a missing status means draft | Safety in code, not in remembering | — |
| D7 | **(v0.5) Recall cards are public** as "Test yourself" on each note | They're in a public repo anyway, and readers benefit from them | — |
| D8 | **Every AI-drafted note says so** ("Drafted with AI from my own explanation, then checked by me") | Honesty with readers and the cohort | — |

> **Principle for AI-drafted notes:** the AI shapes my understanding; it doesn't replace it. I always explain first. "My questions" stays in my words. Anything the AI adds that I didn't say gets a `<!-- verify -->` marker, and the build refuses to publish until I've cleared it.

## 4. Users

| User | Needs |
|---|---|
| **Me** | Fast capture, easy linking, drafts that stay private, a review habit |
| **Readers** (including the cohort community on Twitter/X) | Clear explanations, easy navigation between ideas, fast pages, good on mobile |

## 5. Features

### F1. Note types (built)
- **Source note** (`type: source`): one per blog I read. Sections: TL;DR, The problem, How it works, What they gave up, My questions, recall cards.
- **Concept note** (`type: concept`): an idea that outlives one source (e.g. *Redis Cluster hash slots*). Collects backlinks from every source that uses it.
- **Cohort note** (`type: cohort`): a cohort session or exercise, with `cohort_week`.
- **Log** (`type: log`): optional "read X today".

Format: `notes/README.md`.

### F2. AI-assisted capture (built)
1. I read, then explain what I understood (typed or voice) with the URL.
2. The `note-writing` skill writes `notes/drafts/<slug>.md` (`status: draft`), reusing existing slugs for `[[links]]`, with 2–4 recall cards and a `tweet` line, and a `<!-- verify -->` marker on any fact I didn't state.
3. I preview it with `pnpm dev` (drafts show with a "Draft" badge, locally only), fix it, clear the markers, set `status: published`, move it to `notes/`, commit, push.

The skill refuses to write a note from a link alone: explaining is the learning step.

### F3. Linking (built)
- `[[slug]]` and `[[slug|label]]`; `[[Redis Cluster]]` and `[[redis-cluster]]` are the same link. Links inside code stay literal.
- **Mentioned in:** backlinks on every note, from published notes only.
- **Related notes:** most shared tags, skipping notes already linked.
- A link to a note that isn't published (a draft, or not written yet) renders as plain text with a dashed underline. It never 404s and never reveals a draft. (v0.5: not a build error, because drafts don't exist in CI.)

### F4. Draft → publish (built)
- Only `status: published` files in `notes/` are built into pages, the sitemap and the home page.
- A published note **fails the build** if it is missing a required field, has a bad date/slug/type, has a tweet over 280 characters, still has a `<!-- verify -->` marker, or shares a slug with a draft.
- With zero published notes the site still builds (placeholder route, `noindex`).

### F5. Public pages (M1 built; M2 polish pending)
- **`/notes/`:** intro (with the notes-vs-blog line), all notes newest first (type, date, read time, summary, tags), and a concept index.
- **`/notes/<slug>/`:** type and week, title, summary, byline, share button (pre-filled with `tweet`), source link and AI label, table of contents, body, **Test yourself** cards, **Where I used this** (links to my blog posts via `blog_posts`), **Mentioned in**, **Related notes**, tags.
- Article structured data; canonical URLs; sitemap entries.
- Reuses the blog's typography, code highlighting with copy, callouts, tables and reading progress.

### F6. Recall (cards built; scheduling in M3)
- Cards are written in the note body inside `:::recall` with `Q:` / `A:` lines, and shown as "Test yourself".
- M3: a local review page with spaced repetition (e.g. FSRS via `ts-fsrs`), with review state kept in a git-ignored file.

### F7. Latest notes on the portfolio (built)
- **(v0.5)** The home page reads the 3 newest published notes straight from disk at build time ("02 / Notes" section). Same repo, same build: no feed, no deploy hook, nothing to go stale.
- "Notes" added to the main navigation.

## 6. Content model

```markdown
---
title: Blobasaur: how Zerodha built a Redis-compatible blob store on SQLite
type: source
status: draft
date: 2026-11-19
summary: One line, used in lists and link previews.
source_url: https://zerodha.tech/blog/high-performance-distributed-blob-storage/
source_author: Zerodha Tech
tags: databases, sqlite, redis
tweet: Up to 280 characters.
blog_posts: prevent-double-booking-postgres
---

Body. [[concept-slug]] links.

:::recall
Q: …
A: …
:::
```

Frontmatter is flat `key: value`, matching the blog's parser (no YAML lists). Full field table: `notes/README.md`.

```
notes/
├── README.md            # format + daily loop
├── <slug>.md            # published notes (committed)
└── drafts/<slug>.md     # drafts (git-ignored)
public/notes-media/<slug>/   # images
src/lib/notes.js             # loading, validation, wikilinks, backlinks, recall
src/app/notes/               # /notes and /notes/[slug]
src/components/notes/        # NoteList, NoteCards
.claude/skills/note-writing/ # the capture prompt
docs/notes-prd.md            # this file
```

## 7. Architecture

```
 my laptop                                   GitHub (public)          Vercel
┌────────────────────────────────┐
│ explain → note-writing skill   │
│        ▼                       │
│ notes/drafts/x.md (ignored)    │
│        │ check, publish, move  │
│        ▼                       │   git push   ┌────────────┐  build  ┌──────────────────────────┐
│ notes/x.md ────────────────────┼─────────────►│ portfolio  │────────►│ next build (export)      │
└────────────────────────────────┘              │ repo       │         │ • published notes only   │
                                                └────────────┘         │ • validate, fail on      │
                                                                       │   verify markers         │
                                                                       │ • resolve [[links]],     │
                                                                       │   backlinks              │
                                                                       └────────────┬─────────────┘
                                                                                    ▼
                                                                  buildwithvibs.in/notes
```

## 8. Non-functional requirements

| Area | Requirement |
|---|---|
| **Privacy** | Drafts never committed (git-ignored) and never built (status check). Verified: a build with only a draft produces no output mentioning it. |
| **Correctness** | Unit tests for dates, wikilinks, recall parsing, validation, backlinks, related notes (`src/lib/__tests__/notes.test.js`) |
| **Performance** | Static HTML from Vercel's CDN; note pages ship the same JS as blog posts (~114 kB first load) |
| **Cost** | ₹0 extra |
| **Portability** | Plain Markdown, readable without the site |

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| **AI writes, I don't learn** | Skill refuses to write without my explanation; "My questions" stays mine; recall cards test me |
| AI adds wrong details | `<!-- verify -->` markers block publishing; "Drafted with AI" label |
| A draft gets committed by mistake | `notes/drafts/` ignored; a note with no status is a draft; a file in `drafts/` is a draft whatever it says |
| **Habit fails** | M0 is the habit, not the site; capture < 10 min |
| Quoting too much from sources | Skill allows one short quote per note, everything else paraphrased, source always linked |
| Slug renames break links | Don't rename published notes; if needed, add a redirect in `vercel.json` |
| Notes slug collides with a blog slug | Different paths (`/notes/` vs `/blog/`), so no clash; likes/saved state are not used on notes yet |

## 10. Milestones

| Milestone | Scope | Status |
|---|---|---|
| **M0: Habit** | `note-writing` skill + format; read and capture daily | Ready, start now |
| **M1: Publish** | Loader, validation, `/notes` pages, home section, nav, sitemap, tests | **Built**, needs merge |
| **M2: Reader polish + sharing** | **Built (v0.6), site-wide for posts and notes:** a preview image per page for X/LinkedIn, search (Pagefind), reading streak on `/notes`, like/save/resume/author card on notes, highlight-to-share quotes, click-to-zoom images, dark mode, print stylesheet. **v0.7:** the `/notes/cohort/` page (Software-dev cohort, grouped by week, a share link per week), note tag pages with a fixed tag list (`notes/tags.json`, enforced by the build), and dark mode site-wide (the dark header, hero and footer get a lifted shade in dark mode; interactive demos keep their light design). **Still to do:** Mermaid diagrams, notes RSS feed | Before the cohort starts, **by mid-December 2026** (the India move overlaps January) |
| **M3: Recall** | Local review page with spaced repetition, streak | After M2 |
| **v2** | Graph view, "ask my notes" (RAG), suggested links, editing from phone | After a month of use |

**To go live:** merge the branch, then publish the first note. No domain or DNS setup is needed.

## 11. Success metrics (first 60 days)
- ≥ 40 source notes, ≥ 15 concept notes with ≥ 2 backlinks each
- ≥ 20 published
- Capture time ≤ 10 minutes (self-reported)

## 12. Open questions
1. **Existing "learned" blog posts** (DNS, TCP/UDP, Git essentials, JavaScript basics) fit the notes definition. Leave them in the blog, or move them to notes with redirects?
2. ~~Dark mode~~: built in v0.6, site-wide in v0.7 (follows the system setting; toggle in the header).
3. **README:** it still says "deployed to GitHub Pages"; update to Vercel.
