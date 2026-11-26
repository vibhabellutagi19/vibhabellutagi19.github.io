# Notes

My second brain: what I **learn** from others (engineering blogs I read, cohort sessions).
What I **find** while building goes in the blog (`blog/posts/`) instead.

Published at `buildwithvibs.in/notes/`.
Product spec: [`docs/notes-prd.md`](../docs/notes-prd.md).

## Daily loop

1. Read the blog.
2. Explain what I understood to Claude, with the URL. The `note-writing` skill (`.claude/skills/note-writing/`) turns it into a note.
3. The draft lands in `notes/drafts/<slug>.md`. That folder is **git-ignored**: this repo is public, so drafts never leave my machine.
4. `pnpm dev`, open `localhost:3000/notes/<slug>/` (drafts show with a "Draft" badge, locally only).
5. Check every `<!-- verify -->` marker against the source, then delete it.
6. Set `status: published`, move the file to `notes/`, commit, push. Vercel deploys.

## File format

One file per note: `notes/<slug>.md`. The file name is the slug and the URL (`/notes/<slug>/`), kebab-case.

```markdown
---
title: Blobasaur: Zerodha's sharded blob store on SQLite
type: source
status: published
date: 2026-11-19
summary: One line, used in lists and link previews.
source_url: https://zerodha.tech/blog/high-performance-distributed-blob-storage/
source_author: Zerodha Tech
tags: databases, sqlite, redis
tweet: Optional, up to 280 characters, used by the share button.
---

Body in Markdown. Link other notes with [[slug]] or [[slug|label]].

:::recall
Q: A question that tests the idea, not trivia?
A: The answer in one or two sentences.
:::
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | |
| `type` | yes | `source` (a blog I read), `concept` (an idea that outlives one source), `cohort`, `log`, `quick` (3–5 lines, see below) |
| `status` | no | `published` or `draft`. **Missing means draft**, so nothing goes live by accident |
| `date` | yes | `YYYY-MM-DD` |
| `summary` | yes, except `quick` | one line. A quick note may skip it; its first line is used instead |
| `source_url` | `source` only | https |
| `source_author` | no | shown next to the source link |
| `cohort_week` | `cohort` only | a number; groups the note under that week on `/notes/cohort/` |
| `tags` | no | comma-separated, **only from `notes/tags.json`** (see below) |
| `tweet` | no | ≤ 280 characters |
| `linkedin_url` | no | link to my LinkedIn post about this note (`https://www.linkedin.com/...`); shows "Discuss on LinkedIn" |
| `x_url` | no | link to my X post about this note (`https://x.com/...`); shows "Discuss on X" |
| `blog_posts` | no | comma-separated slugs of my blog posts that use this idea ("Where I used this") |
| `ai_assisted` | no | defaults to `true`; shows "Drafted with AI from my own explanation" |

Frontmatter is one `key: value` per line (no YAML lists), same as blog posts.

## Posting on LinkedIn and X

The thoughts I post on LinkedIn and X every day are notes too: same file, same type (`source`, `quick`, ...), same rules.

1. Write the note as usual (daily loop above) and publish it.
2. Post on LinkedIn and X, ending with the note's link (`buildwithvibs.in/notes/<slug>/`).
3. Copy each post's URL into `linkedin_url:` and `x_url:`, commit, push. The note page then links to both posts, so readers can join the discussion.

Both fields are optional; add only the one I posted to.

## Tags

`notes/tags.json` is the list of allowed tags. A fixed list keeps one topic under one name, so `db`, `database` and `databases` never split it three ways. To add a topic, add its tag to the list (lowercase, kebab-case). Each tag has a page at `/notes/tags/<tag>/`, which also links to the blog's posts on the same tag.

Use 3–5 tags per note, for broad topics (`databases`, `networking`). Specific ideas get a concept note and a `[[link]]` instead.

## Software-dev cohort

Cohort notes (`type: cohort`, `cohort_week: N`) appear on `/notes` like any note, and on `/notes/cohort/` grouped by week. Every week has its own link to share (`/notes/cohort/#week-N`), with a share button next to it.

## Quick notes

For days with little time: `type: quick`, three to five lines, no `summary:` needed and no required sections. Set `ai_assisted: false` on one you wrote yourself.

```markdown
---
title: WAL before data
type: quick
status: published
date: 2026-12-08
tags: postgres, databases
ai_assisted: false
---

The WAL is written before the data page, so a crash can replay it.
```

## Rules the build enforces

A published note fails `pnpm build` if it:
- is missing a required field, or has a bad date, slug, or type
- still contains a `<!-- verify -->` marker
- has a `tweet` over 280 characters
- uses a tag that isn't in `notes/tags.json`
- shares its slug with a file in `notes/drafts/`

Links to notes that aren't published yet render as plain text (dashed underline), so they never 404 and never reveal a draft.

## Images

Put them in `public/notes-media/<slug>/` and reference them relatively (`![alt](diagram.png)`).
