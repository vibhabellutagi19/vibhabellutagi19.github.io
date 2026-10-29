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
const CODE_LANGUAGES = {
  bash: 'Bash',
  groovy: 'Groovy',
  hcl: 'HCL',
  javascript: 'JavaScript',
  js: 'JavaScript',
  python: 'Python',
  scala: 'Scala',
  sh: 'Shell',
  sql: 'SQL',
  toml: 'TOML',
  ts: 'TypeScript',
  typescript: 'TypeScript',
};

let markedPromise;
let highlighterPromise;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({ themes: [CODE_THEME], langs: Object.keys(CODE_LANGUAGES) })
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

export function parseFrontmatter(markdown) {
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

function renderContainers(markdown, marked) {
  const containerRegex = /:::(\w+)\n([\s\S]*?)\n:::/g;
  return markdown.replace(containerRegex, (_, type, body) => {
    const normalized = type.toLowerCase();
    const title = CONTAINER_TITLES[normalized] ?? 'Note';
    const htmlBody = marked.parse(body.trim());

    return `<aside class="callout callout-${normalized}">
      <p class="callout-title">${title}</p>
      <div class="callout-body">${htmlBody}</div>
    </aside>`;
  });
}

// A line like `::demo[session-simulator]` marks where an interactive demo goes.
// It becomes an empty placeholder that the post page swaps for the component.
export const DEMO_PLACEHOLDER = /<div data-demo="([a-z0-9-]+)"><\/div>/;

function renderDemoPlaceholders(markdown) {
  return markdown.replace(/^::demo\[([a-z0-9-]+)\]$/gm, '\n<div data-demo="$1"></div>\n');
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
          theme: CODE_THEME,
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

export async function renderMarkdownToHtml(content, folderName) {
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
      normalizedHref = `/posts/${folderName}/${normalizedHref}`;
    }

    const safeTitle = title ? ` title="${title}"` : '';
    const safeAlt = text ? ` alt="${text}"` : '';
    return `<img src="${normalizedHref}"${safeAlt}${safeTitle} loading="lazy" />`;
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

  const contentWithContainers = renderContainers(renderDemoPlaceholders(content), marked);
  const html = marked.parse(contentWithContainers, { renderer });
  return normalizeLegacyLinks(await highlightCodeBlocks(html, codeBlocks));
}
