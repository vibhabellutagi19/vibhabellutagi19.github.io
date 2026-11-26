---
name: note-writing
description: Turn Vibha's own explanation of an engineering blog, article, or cohort session into a note for her second brain (notes/*.md, served at /notes). Use when she shares a link plus what she understood and asks for a note, or asks to create, update, or link a concept note. Not for blog posts (blog/posts/) — use blog-writing for those.
---

# Note writing

Notes record what Vibha **learned** from someone else's work. The value is in *her* understanding, so the note is built from her explanation, not from the source. The source is only used to check facts and fill gaps she asks about.

Format reference: `notes/README.md`. Read it before writing the first note in a session.

## Inputs

- Her explanation (typed or transcribed voice; messy is fine)
- The source URL (or cohort session name and week)
- Optional: her open questions

If she gives only a link and no explanation, **don't write the note**. Ask her to explain what she understood first, in a few sentences. Explaining is the learning step; the note comes after.

## Steps

1. **List existing notes** so links reuse real slugs:
   `ls notes/*.md notes/drafts/*.md` and read the frontmatter titles of the concept notes.
2. **Read the source** (fetch it) to check her claims. Don't summarize it into the note.
3. **Write the note** to `notes/drafts/<slug>.md` with `status: draft`. Never write `status: published` and never put a new note directly in `notes/`; publishing is her decision.
4. **Propose concept notes.** If an idea will clearly come up again (a pattern, a protocol, a data structure) and has no concept note yet, link it as `[[slug]]` anyway and list it at the end of your reply as a suggested concept note. Create a concept note only when she says yes.
5. **Reply with:** the file path, the list of `<!-- verify -->` markers you left and why, any suggested concept notes, and anything in her explanation that the source contradicts.

## Voice and honesty rules

- Write in first person, in her words. Keep her analogies, examples, and phrasing where they're clear; fix grammar, order, and gaps.
- **Don't add claims she didn't make.** If the note needs a fact she didn't state (a number, a name, a mechanism), you may add it from the source, but put `<!-- verify: what to check -->` right after it.
- If she got something wrong, don't silently fix it. Correct it in the note, and add `<!-- verify: she said X; the source says Y -->` so she sees the correction.
- **"My questions" is hers.** Copy her questions as she wrote them, only fixing typos. Don't invent questions for her. If she had none, leave the section out.
- No long quotes from the source: at most one short quote (under 15 words), attributed. Everything else is her paraphrase.
- Plain English first, then detail. Short paragraphs. Analogies welcome when they're hers or clearly helpful.

## Source note template (`type: source`)

```markdown
---
title: <what the blog is about, not the blog's own clickbait title>
type: source
status: draft
date: <today, YYYY-MM-DD>
summary: <one line: the system and the key idea>
source_url: <https URL>
source_author: <company or author>
tags: <3–5, comma-separated, lowercase>
tweet: <≤ 280 chars: the one surprising thing, in her voice, ending with "My notes ↓">
---

## TL;DR

<2–3 sentences: the problem, what they built, the key trade-off.>

## The problem

## How it works

<Mechanism in plain words. Use a small table or a code block when it helps. Link concepts with [[slug]].>

## What they gave up

<Trade-offs and limits, as bullets.>

## My questions

<Her questions, verbatim.>

:::recall
Q: <tests understanding of the mechanism, not trivia>
A: <one or two sentences>

Q: ...
A: ...
:::
```

2–4 recall cards. Good cards ask *why* or *what happens if*, not *what number*.

## Concept note template (`type: concept`)

An idea that outlives a single source: `redis-cluster-hash-slots`, `group-commit`, `sqlite-wal-mode`.

```markdown
---
title: <the idea>
type: concept
status: draft
date: <YYYY-MM-DD>
summary: <one line definition>
tags: <comma-separated>
---

## In one line

## How it works

## When it helps, when it hurts

## Seen in

- [[source-note-slug]]: <how that system uses it>
```

Concept notes grow: when a new source note uses an existing concept, offer to add a line to its "Seen in" list (edit the published file only with her OK).

## Cohort note template (`type: cohort`)

Same sections as a source note. Add `cohort_week: <n>`; `source_url` is optional (session recording or exercise link).

## Quick note template (`type: quick`)

For days with little time. Three to five lines in her words, no required sections, no recall cards, no summary (the first line is used).

```markdown
---
title: <what it is, in a few words>
type: quick
status: draft
date: <YYYY-MM-DD>
tags: <from notes/tags.json>
ai_assisted: false
---

<Her three to five lines, lightly cleaned up.>
```

Rules: don't expand a quick note into a full note unless she asks. Keep `<!-- verify -->` markers for anything she didn't state. Set `ai_assisted: false` when she wrote the lines herself.

## LinkedIn and X posts

Her daily LinkedIn and X posts are about notes; they are not a separate kind of note. When she gives a post URL for a note, add `linkedin_url:` (`https://www.linkedin.com/...`) or `x_url:` (`https://x.com/...`) to that note's frontmatter. Don't invent URLs; leave the field out until she has posted.

## Checklist before replying

- [ ] File is in `notes/drafts/`, `status: draft`, slug matches the file name (kebab-case)
- [ ] Required fields: title, type, date (YYYY-MM-DD), summary (not needed for `quick`); `source_url` for source notes
- [ ] Every fact she didn't state has a `<!-- verify -->` marker
- [ ] "My questions" contains only her questions
- [ ] `[[links]]` use existing slugs where a note exists
- [ ] `tweet` ≤ 280 characters
- [ ] No quote over 15 words; at most one quote
