import { describe, expect, it } from 'vitest';

import { parseFrontmatter, renderMarkdownToHtml } from '../markdown';

describe('parseFrontmatter', () => {
  it('parses metadata and body content', () => {
    const markdown = `---
title: "Hello"
date: "Jan 01, 2026"
slug: "hello"
---
Body content`;

    const parsed = parseFrontmatter(markdown);

    expect(parsed.metadata.title).toBe('Hello');
    expect(parsed.metadata.slug).toBe('hello');
    expect(parsed.content.trim()).toBe('Body content');
  });

  it('returns empty metadata when no frontmatter exists', () => {
    const parsed = parseFrontmatter('No frontmatter here');
    expect(parsed.metadata).toEqual({});
    expect(parsed.content).toBe('No frontmatter here');
  });
});

describe('renderMarkdownToHtml', () => {
  it('converts legacy post query links to canonical clean urls', async () => {
    const html = await renderMarkdownToHtml(
      '[read more](post.html?post=inside-git)',
      '2026-01-16-inside-git'
    );

    expect(html).toContain('href="/blog/inside-git/"');
  });

  it('rewrites relative image paths to public post assets', async () => {
    const html = await renderMarkdownToHtml(
      '![diagram](assets/graph.png)',
      '2026-01-16-inside-git'
    );

    expect(html).toContain('src="/posts/2026-01-16-inside-git/assets/graph.png"');
  });
});
