const CONTAINER_TITLES = {
  tip: 'Tip',
  warning: 'Warning',
  info: 'Info',
  note: 'Note',
  danger: 'Danger',
  tldr: 'TL;DR',
};

// Code blocks are highlighted at build time; the page ships coloured HTML, no highlighter.
const CODE_THEME = 'github-light-high-contrast';
// Dark mode: each token also carries --shiki-dark, which theme.css switches to.
const CODE_THEME_DARK = 'github-dark-high-contrast';
// Each language here adds its grammar to the build-time highlighter; unknown ones render as plain code.
const CODE_LANGUAGES = {
  bash: 'Bash',
  css: 'CSS',
  diff: 'Diff',
  dockerfile: 'Dockerfile',
  go: 'Go',
  groovy: 'Groovy',
  hcl: 'HCL',
  html: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  markdown: 'Markdown',
  md: 'Markdown',
  python: 'Python',
  py: 'Python',
  rust: 'Rust',
  scala: 'Scala',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  toml: 'TOML',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  yaml: 'YAML',
  yml: 'YAML',
  zsh: 'Shell',
};

let markedPromise;
let highlighterPromise;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({ themes: [CODE_THEME, CODE_THEME_DARK], langs: Object.keys(CODE_LANGUAGES) })
    );
  }

  return highlighterPromise;
}

async function getMarked() {
  if (!markedPromise) {
    markedPromise = import('marked').then(({ marked }) => {
      marked.setOptions({
        gfm: true,
        breaks: true,
      });
      return marked;
    });
  }

  return markedPromise;
}

export function parseFrontmatter(rawMarkdown) {
  // Files saved with Windows line endings would otherwise lose their frontmatter.
  const markdown = rawMarkdown.replace(/\r\n?/g, '\n');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const [, rawMetadata, content] = match;
  const metadata = {};

  rawMetadata.split('\n').forEach((line) => {
    const separator = line.indexOf(':');
    if (separator < 0) {
      return;
    }

    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, '');

    if (key) {
      metadata[key] = value;
    }
  });

  return { metadata, content };
}

/**
 * Splits markdown into fenced code blocks and everything else: `[{ text, code }]`.
 * A fence opens with 3+ backticks or tildes and closes with at least as many of the same character.
 * Line-based, so a fence inside a fence and an unclosed fence (code to the end) both behave.
 */
export function splitFences(markdown) {
  const segments = [];
  let current = { text: '', code: false };
  let fence = null;

  markdown.split('\n').forEach((line, index) => {
    const text = index === 0 ? line : `\n${line}`;
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];

    if (!fence && marker) {
      segments.push(current);
      current = { text, code: true };
      fence = marker;
    } else if (fence && marker && marker[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) {
      current.text += text;
      segments.push(current);
      current = { text: '', code: false };
      fence = null;
    } else {
      current.text += text;
    }
  });

  segments.push(current);
  return segments.filter((segment) => segment.text);
}

/** Runs `fn` on the markdown outside fenced code blocks. */
export function mapOutsideFences(markdown, fn) {
  return splitFences(markdown)
    .map((segment) => (segment.code ? segment.text : fn(segment.text)))
    .join('');
}

/** Runs `fn` on the markdown outside fenced code blocks and `inline code`. */
export function mapOutsideCode(markdown, fn) {
  return mapOutsideFences(markdown, (text) =>
    text
      .split(/(`[^`\n]*`)/)
      .map((part, index) => (index % 2 === 1 ? part : fn(part)))
      .join('')
  );
}

// `:::tip` or `:::tip Custom title`, closed by `:::` on its own line.
const CONTAINER = /^:::(\w+)[ \t]*([^\n]*)\n([\s\S]*?)\n:::[ \t]*$/gm;

/**
 * Callouts. A body can hold anything a post can, so it's parsed with the post's renderer:
 * code inside a callout is highlighted and images get the same path rewriting.
 * Fenced code is split out first, so a code block may contain a callout, and a callout a code block.
 */
function renderContainers(markdown, render) {
  const segments = splitFences(markdown);
  // Callouts can span fences, so match on the text with each fence swapped for a placeholder.
  const masked = segments.map((segment, index) => (segment.code ? `\u0000${index}\u0000` : segment.text)).join('');
  const unmask = (text) => text.replace(/\u0000(\d+)\u0000/g, (_, index) => segments[Number(index)].text);

  return unmask(
    masked.replace(CONTAINER, (_, type, customTitle, body) => {
      const normalized = type.toLowerCase();
      const title = customTitle.trim() ? escapeHtml(customTitle.trim()) : (CONTAINER_TITLES[normalized] ?? 'Note');
      return `<aside class="callout callout-${normalized}">
      <p class="callout-title">${title}</p>
      <div class="callout-body">${render(unmask(body.trim()))}</div>
    </aside>`;
    })
  );
}

// A line like `::demo[session-simulator]` marks where an interactive demo goes.
// It becomes an empty placeholder that the post page swaps for the component.
export const DEMO_PLACEHOLDER = /<div data-demo="([a-z0-9-]+)"><\/div>/;

function renderDemoPlaceholders(markdown) {
  return mapOutsideFences(markdown, (text) =>
    text.replace(/^::demo\[([a-z0-9-]+)\]$/gm, '\n<div data-demo="$1"></div>\n')
  );
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/&[a-z#0-9]+;/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s-]+/g, '-') || 'section'
  );
}

/** The h2/h3 headings of rendered post HTML, for the table of contents. */
export function getHeadings(html) {
  return [...html.matchAll(/<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)].map(([, level, id, inner]) => ({
    level: Number(level),
    id,
    text: inner
      .replace(/<a class="heading-anchor"[\s\S]*?<\/a>/, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim(),
  }));
}

async function highlightCodeBlocks(html, blocks) {
  if (blocks.length === 0) {
    return html;
  }

  const highlighter = await getHighlighter();
  return html.replace(/<!--code-block:(\d+)-->/g, (_, index) => {
    const { text, lang } = blocks[Number(index)];
    const label = CODE_LANGUAGES[lang];
    const code = label
      ? highlighter.codeToHtml(text, {
          lang,
          themes: { light: CODE_THEME, dark: CODE_THEME_DARK },
          defaultColor: 'light',
          // The page sets the code background; drop the theme's own.
          transformers: [{ pre: (node) => void delete node.properties.style }],
        })
      : `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`;

    return `<div class="code-block">
      <div class="code-head">
        <span class="code-lang">${label ?? ''}</span>
        <button type="button" class="code-copy">Copy</button>
      </div>
      ${code}
    </div>`;
  });
}

function normalizeLegacyLinks(html) {
  return html.replace(
    /href=["'](?:\.\/)?(?:blog\/)?post\.html\?post=([^"']+)["']/g,
    'href="/blog/$1/"'
  );
}

// Relative image paths resolve against the post's folder; notes pass their own `assetBase`.
export async function renderMarkdownToHtml(content, folderName, { assetBase = `/posts/${folderName}` } = {}) {
  const marked = await getMarked();
  const renderer = new marked.Renderer();
  renderer.image = ({ href = '', text = '', title = '' }) => {
    let normalizedHref = href;

    if (
      normalizedHref &&
      !normalizedHref.startsWith('http://') &&
      !normalizedHref.startsWith('https://') &&
      !normalizedHref.startsWith('/')
    ) {
      normalizedHref = normalizedHref.replace(/^\.\//, '');
      normalizedHref = `${assetBase}/${normalizedHref}`;
    }

    const safeTitle = title ? ` title="${escapeHtml(title)}"` : '';
    const safeAlt = ` alt="${escapeHtml(text)}"`;
    return `<img src="${escapeHtml(normalizedHref)}"${safeAlt}${safeTitle} loading="lazy" decoding="async" />`;
  };

  // Headings get unique ids and a self-link, so sections can be linked to and listed in the TOC.
  const usedIds = new Map();
  renderer.heading = function ({ tokens, depth, text }) {
    const inner = this.parser.parseInline(tokens);
    const base = slugify(text);
    const count = usedIds.get(base) ?? 0;
    usedIds.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    return `<h${depth} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
  };

  const codeBlocks = [];
  renderer.code = ({ text, lang = '' }) => {
    codeBlocks.push({ text, lang: lang.trim().split(/\s+/)[0].toLowerCase() });
    return `<!--code-block:${codeBlocks.length - 1}-->`;
  };

  const contentWithContainers = renderContainers(renderDemoPlaceholders(content), (body) =>
    marked.parse(body, { renderer })
  );
  const html = marked.parse(contentWithContainers, { renderer });
  return normalizeLegacyLinks(await highlightCodeBlocks(html, codeBlocks));
}
