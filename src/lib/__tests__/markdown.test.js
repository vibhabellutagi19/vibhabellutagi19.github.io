import { describe, expect, it } from 'vitest';

import { getHeadings, parseFrontmatter, renderMarkdownToHtml } from '../markdown';

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

describe('headings', () => {
  it('gives headings unique ids and lists them for the table of contents', async () => {
    const html = await renderMarkdownToHtml('## Why `FOR UPDATE`?\n\n## Why `FOR UPDATE`?\n\n### Q & A', 'post');

    expect(html).toContain('<h2 id="why-for-update">');
    expect(html).toContain('<h2 id="why-for-update-1">');
    expect(html).toContain('href="#why-for-update"');
    expect(getHeadings(html)).toEqual([
      { level: 2, id: 'why-for-update', text: 'Why FOR UPDATE?' },
      { level: 2, id: 'why-for-update-1', text: 'Why FOR UPDATE?' },
      { level: 3, id: 'q-a', text: 'Q & A' },
    ]);
  });
});

describe('code blocks', () => {
  it('highlights known languages and adds a label and copy button', async () => {
    const html = await renderMarkdownToHtml('```ts\nconst a = 1;\n```', 'post');

    expect(html).toContain('<span class="code-lang">TypeScript</span>');
    expect(html).toContain('class="code-copy"');
    expect(html).toMatch(/<span style="color:#[0-9A-Fa-f]{6}">const<\/span>/);
  });

  it('escapes code in unknown or missing languages', async () => {
    const html = await renderMarkdownToHtml('```\n<script>alert(1)</script>\n```', 'post');

    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>');
  });
});
