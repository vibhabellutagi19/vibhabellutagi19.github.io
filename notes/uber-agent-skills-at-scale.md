---
title: Uber runs 5,000+ agent skills, and the agent isn't what fixed it
type: quick
status: published
date: 2026-11-26
summary: We're not just adopting AI agents anymore. We're learning how to streamline them.
tags: ai, llms, testing
linkedin_url: https://www.linkedin.com/feed/update/urn:li:share:7531624428070264832/
x_url: https://x.com/buildwith_vibs/status/2125865595820261577
ai_assisted: false
---

Reading Uber's blog on how they run 5,000+ agent skills, one thought stayed with me: we're not just adopting AI agents anymore. We're learning how to streamline them.

The gist, in short:

- A skill is a Markdown file that teaches an agent one job. Uber keeps all of them in one Git repo, and one CLI installs them for every agent their teams use.
- They test skills with real prompts, measure cost per skill, and replay tasks with and without a skill to check it actually helps.
- When something breaks, the agent files its own bug report and the skill's owner gets it.

But what I felt reading it was bigger than the details. It made me look back at how work used to get done, and I see three eras:

1. **Humans run the runbook.** Know-how lives in wikis and in a few people's heads. When a step breaks, someone gets stuck and asks around.
2. **Agents improvise.** Everyone has their own prompts. The agent guesses its way through, and failures are silent. Uber describes tool definitions alone eating 50–70K tokens before anyone types a word.
3. **Agents run governed skills.** Know-how becomes a skill with an owner, a review, metrics and tests. When a step fails, the agent reports it.

What struck me most: the agent isn't what fixed Era 2. Owners, tests, metrics and bug reports did. That's the same engineering discipline we've always used, now applied to prompts.
