---
name: blog-writing
description: Draft, outline, or review technical blog posts for this site (blog/posts/*/index.md) using a tension-first framing — hook, one-line thesis, make the problem hurt with real numbers, mechanism via a tiny worked example, claim-style headings, trade-offs, and a closing line that echoes the hook. Use when the user asks to write, outline, rewrite, improve the hook/intro/headings of, or review a blog post or draft.
---

# Blog Writing

A framing method for technical posts, distilled from studying Arpit Bhayani's essays (arpitbhayani.me/blogs). The core idea: **every post creates a tension in its first three sentences and spends the rest of the post resolving it.** Readers keep reading because something they believed was challenged, or something that looked easy turned out to be hard.

Use this skill in three modes:

- **Outline** — the user has a topic. Produce the hook options, thesis, and heading list before any prose.
- **Draft** — the user wants a full post. Outline first, confirm the hook and thesis with them, then write.
- **Review** — the user has a draft. Score it against the checklist at the bottom and propose concrete rewrites (show before/after for the opening, headings, and close).

## Step 1: Find the tension before writing anything

Answer these in one line each. If you can't, the post isn't ready to write — ask the user.

1. **What does the reader currently believe or do?** ("I follow the RAG tutorial", "my monolith is simple", "time is just `Date.now()`")
2. **Why is that wrong, incomplete, or about to hurt them?**
3. **What will they be able to do or see differently after reading?**
4. **What's the concrete failure?** A real incident, a reproduced bug, a number. Prefer something the author actually ran or hit.

## Step 2: Write the hook (first 2–3 sentences)

Pick one pattern from [references/hooks.md](references/hooks.md). Offer the user 2–3 hook options using different patterns and let them choose.

Rules:
- No throat-clearing: never open with "In today's world…", "X is a popular tool…", "In this blog we will…", or a dictionary definition.
- The first sentence should be short. The second or third sentence is the turn ("Here is the uncomfortable part —", "But…", "Except…").
- Name the reader's situation with "you" or "most of us".
- A scope line ("This post covers…") is allowed, but only *after* the tension is set, never as the opener.

## Step 3: State a one-line thesis

One sentence the reader could repeat to a colleague. Put it alone on its own line right after the hook.

> There is no global clock.
> Your monolith may already be a distributed system.

On this site, the `:::tldr` box goes right after the hook/scope paragraph and holds **Problem** and **Fix** in bold labels. The thesis and the TL;DR must agree.

## Step 4: Structure — make it hurt before you fix it

Default skeleton (adapt, don't force):

1. **Hook + thesis + TL;DR**
2. **The damage** — show the failure concretely before explaining any mechanism. A reproduced race, a wrong output, a timeline of what broke. Real numbers.
3. **The mechanism** — explain why it happens using the *smallest possible worked example* (two transactions, three updates to key X, a 10-bit array). Then generalize.
4. **The fix(es)** — in order of simplicity. Show code only where it carries the idea.
5. **Trade-offs / where the fix breaks** — what it costs, when not to use it.
6. **"This is not an argument for X"** — pre-empt the obvious misreading.
7. **Close** — echo the hook in one sharp line, or a short "the gist is…" paragraph. Never end on "Hope you enjoyed it!" or "Thanks for reading".

### Headings are claims, not labels

The heading list alone should read like the argument. Write them as assertions.

| Label (avoid) | Claim (prefer) |
|---|---|
| Database | The Database Is a Global Variable |
| Refactoring | Why Refactoring Doesn't Save You |
| Deployment | Single Deploy Is an Illusion |
| Introduction | *(delete — the hook is the intro)* |
| Conclusion | *(replace with a claim, or drop the heading and just close)* |

## Step 5: Make it concrete

- **Numbers over adjectives.** "NTP is accurate to 100–500 µs on a LAN" beats "NTP is fairly accurate". If the author has measurements, use them; if not, flag where a number is needed with `[NUMBER: …]` rather than inventing one.
- **Never fabricate** benchmarks, incident details, or quotes. Placeholders are fine; made-up data is not.
- **One tiny worked example per concept.** Name the actors (A and B, U1/U2/U3, key X) and walk them step by step.
- **Bridge to what the reader knows.** Map the new idea onto a familiar one: index alias ↔ Postgres MVCC, embedding model change ↔ schema migration, shared DB ↔ global variable. One strong metaphor carried through the post beats several weak ones.
- **Show real-world usage** near the end: which databases/frameworks/companies use this and where.
- **Diagrams** go in the post folder's `assets/` and are referenced relatively. Suggest one wherever the prose describes boxes and arrows.

## Step 6: Voice

- Paragraphs of 2–4 sentences. Use a one-line paragraph for emphasis, sparingly (≈ once per section at most).
- Plain declarative sentences. Dashes for asides. Cut intensifiers: "very", "really", "extremely", "super", "basically", "simply", "just" (when it minimizes difficulty).
- The reader is the protagonist: mostly "you" and "we". Use "I" deliberately — for what the author built, ran, or got wrong, and for honest admissions of uncertainty. A post that admits what the author doesn't know reads as more trustworthy, not less.
- No behind-the-scenes narration. Cut sentences about how or when the post or the fix came about ("I found this while writing this post", "fixed in September", "this took me two days"). The reader needs the problem and the fix, not the author's timeline. A mistake is interesting because of what it breaks, so say that instead.
- No hype words: "game-changer", "revolutionary", "powerful", "seamless", "unlock", "dive deep", "leverage".

## Repo conventions

- New post: `blog/posts/YYYY-MM-DD-kebab-title/index.md`, assets in `assets/` beside it, and prepend the folder name to `blog/posts/posts.json` (newest first). See `blog/posts/README.md`.
- Frontmatter: `title`, `date` ("Oct 22, 2026"), `excerpt`, `slug`, `tags` (comma-separated). The `excerpt` is a mini-hook — write it with the same tension as the opening (e.g. "Two members, one spot left. How Move stops overbooking…"), not a summary.
- Callouts available: `:::tldr`, `:::note`, `:::tip`, `:::info`, `:::warning`, each closed with `:::`.
- Match the voice of existing posts; read one recent post (e.g. `blog/posts/2026-10-22-prevent-double-booking-postgres/index.md`) before drafting.

## Review checklist

When reviewing, go through each item and report pass / fix with a concrete suggested rewrite:

1. Does the first sentence create tension (belief → flip, simple → hard, demo → production, bold number)? Or is it a definition/background?
2. Is there a one-line thesis a reader could repeat?
3. Is the failure shown *before* the mechanism?
4. Do the headings, read alone, tell the argument?
5. Is every abstract claim backed by a number, an example, or code the author ran?
6. Is there one tiny worked example per core concept?
7. Are trade-offs and "when not to use this" covered?
8. Is the obvious misreading pre-empted?
9. Does the close echo the hook in one line (no "thanks for reading")?
10. Voice: short paragraphs, no intensifiers/hype, "I" used only where it earns trust, no narration of how the post or fix came about.
11. Does the `excerpt` work as a hook on its own?

Lead the review with the 2–3 changes that would improve the post most — usually the opening, the headings, and missing numbers — before the full checklist.
