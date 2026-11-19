import { describe, expect, it } from 'vitest';

import { getHeadings, mapOutsideCode, parseFrontmatter, renderMarkdownToHtml, splitFences } from '../markdown';

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

  it('reads files saved with Windows line endings', () => {
    const parsed = parseFrontmatter('---\r\ntitle: Hi\r\n---\r\nBody\r\n');
    expect(parsed.metadata.title).toBe('Hi');
    expect(parsed.content).toBe('Body\n');
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
    // Light colour by default, the dark theme's colour alongside for dark mode.
    expect(html).toMatch(/<span style="color:#[0-9A-Fa-f]{6};--shiki-dark:#[0-9A-Fa-f]{6}">const<\/span>/);
  });

  it('escapes code in unknown or missing languages', async () => {
    const html = await renderMarkdownToHtml('```\n<script>alert(1)</script>\n```', 'post');

    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>');
  });
});

describe('splitFences', () => {
  it('separates fenced code from prose', () => {
    expect(splitFences('a\n```js\nx\n```\nb')).toEqual([
      { text: 'a', code: false },
      { text: '\n```js\nx\n```', code: true },
      { text: '\nb', code: false },
    ]);
  });

  it('handles tilde fences, longer fences and an unclosed fence', () => {
    const md = '~~~~\n```\nstill code\n```\n~~~~\nprose\n```\nnever closed';
    expect(splitFences(md).map((segment) => segment.code)).toEqual([true, false, true]);
  });

  it('skips inline code too when asked', () => {
    expect(mapOutsideCode('x `x`\n```\nx\n```', (text) => text.replace(/x/g, 'Y'))).toBe('Y `x`\n```\nx\n```');
  });
});

describe('callouts', () => {
  it('renders a callout with its default title', async () => {
    const html = await renderMarkdownToHtml(':::tip\nHello\n:::', 'post');
    expect(html).toContain('<aside class="callout callout-tip">');
    expect(html).toContain('<p class="callout-title">Tip</p>');
  });

  it('accepts a custom title, escaped', async () => {
    const html = await renderMarkdownToHtml(':::warning Read <this> first\nBody\n:::', 'post');
    expect(html).toContain('<p class="callout-title">Read &lt;this&gt; first</p>');
  });

  it('highlights code and rewrites images inside a callout', async () => {
    const html = await renderMarkdownToHtml(':::note\n![d](assets/x.png)\n\n```ts\nconst a = 1;\n```\n:::', 'my-post');
    expect(html).toContain('src="/posts/my-post/assets/x.png"');
    expect(html).toContain('<span class="code-lang">TypeScript</span>');
  });

  it('leaves callout syntax inside a code block alone', async () => {
    const html = await renderMarkdownToHtml('```md\n:::tip\nhello\n:::\n```', 'post');
    expect(html).not.toContain('<aside');
    expect(html).toContain(':::tip');
  });
});

describe('demo placeholders', () => {
  it('ignores a demo marker inside a code block', async () => {
    const html = await renderMarkdownToHtml('```\n::demo[pg]\n```', 'post');
    expect(html).not.toContain('data-demo');
    expect(html).toContain('::demo[pg]');
  });
});

describe('images', () => {
  it('escapes alt and title text', async () => {
    const html = await renderMarkdownToHtml('![a "quoted" <word>](x.png "the \\"title\\"")', 'post');
    expect(html).toContain('alt="a &quot;quoted&quot; &lt;word&gt;"');
    expect(html).toContain('title="the &quot;title&quot;"');
  });

  it('gives images without alt text an empty alt, so screen readers skip them', async () => {
    expect(await renderMarkdownToHtml('![](x.png)', 'post')).toContain('alt=""');
  });
});

describe('more code languages', () => {
  it.each([
    ['json', 'JSON'],
    ['yaml', 'YAML'],
    ['go', 'Go'],
    ['rust', 'Rust'],
    ['diff', 'Diff'],
  ])('highlights %s', async (lang, label) => {
    const html = await renderMarkdownToHtml(`\`\`\`${lang}\nx\n\`\`\``, 'post');
    expect(html).toContain(`<span class="code-lang">${label}</span>`);
  });
});
