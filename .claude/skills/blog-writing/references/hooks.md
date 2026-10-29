# Hook Patterns

Seven openings that create tension in the first 2–3 sentences. Each has the shape, an example (from arpitbhayani.me, except #6, which is from this blog), and a template.

## 1. Flatter, then flip

Describe what the reader is proud of or comfortable with, then pull the rug.

> You have a monolith, and you are proud of it. One repo, one deployment, one database.
> Here is the uncomfortable part — your monolith may already be a distributed system.

Template: `You [do/have X], and [it feels fine because Y]. Here is the uncomfortable part — [X is secretly Z].`

Best for: architecture opinions, "you're doing it wrong" posts.

## 2. Known concept, new name

Start from a concept everyone knows, then introduce a variant that breaks its rules.

> Tech debt has rules. You cut a corner to ship on time…
> Slop debt does not follow these rules.

Template: `[Familiar thing] has rules: [the rules]. [New thing] does not follow these rules.`

Best for: naming a new problem, opinion essays, emerging trends.

## 3. "Seems simple" + short thesis

Expose the gap between how easy it looks and how much it hurts, then compress it to one line.

> Time seems simple. But we engineers lose sleep over something as basic as keeping clocks in sync.
> The answer lies in this one simple statement — there is no global clock.

Template: `[X] seems simple. But [who] [suffers how]. [One-sentence reason].`

Best for: fundamentals and internals (clocks, DNS, TCP, consistency, caching).

## 4. Bold number

Open with a surprising, specific claim aimed at the reader.

> Every three years, half of what you know becomes obsolete.

Template: `[Specific number/claim about the reader's world].` Follow with where the number comes from.

Best for: career, industry, performance posts. The number must be real and sourced.

## 5. Demo vs. production

Name the tutorial everyone followed, then go where it breaks.

> Most of us build RAG the same way: follow a tutorial that embeds a handful of PDFs… The demo works. The answer looks reasonable.
> This article is about what comes after the demo.

Template: `Most of us [do X] the same way: [tutorial path]. [It works.] [Then reality: scale/time/users].` → `This post is about what comes after.`

Best for: practical engineering, "lessons from building" posts.

## 6. The scenario (concrete race/failure up front)

Drop the reader into a specific situation with stakes, then state what must happen.

> A class has 10 spots. Nine are booked. Two members tap "Book" at the same moment.
> Exactly one of them should get the spot. If both get in, the coach walks into a class with 11 people and 10 bikes.

Template: `[Concrete setup with numbers]. [Two things happen at once / something changes]. [What should happen]. [What goes wrong if it doesn't — made physical].`

Best for: concurrency, bugs, incident write-ups, "building apps" posts.

## 7. One metaphor carries the post

Introduce a vivid image and use it to explain the whole mechanism.

> Asynchronous replication leads to a fascinating situation where it feels like we are going through a wormhole — traveling back and forth in time.

Template: `[Mechanism] leads to a situation where it feels like [vivid image]. So where exactly is [image] in [system]?`

Best for: abstract consistency/ordering concepts. Only use the metaphor if it stays accurate through the whole post.

## Openings to avoid

- Definitions: "A Bloom filter is a probabilistic data structure that…" Move the definition to the second paragraph, after the tension.
- Importance claims: "X is one of the most challenging problems in…" This tells the reader it matters instead of showing them.
- Agenda first: "In this post we will cover A, B, C." A scope line is fine, but only after the hook.
- Questions with obvious answers: "Have you ever wondered how DNS works?"
