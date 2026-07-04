const CONTAINER_TITLES = {
  tip: 'Tip',
  warning: 'Warning',
  info: 'Info',
  note: 'Note',
  danger: 'Danger',
};

let markedPromise;

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

  const contentWithContainers = renderContainers(content, marked);
  const html = marked.parse(contentWithContainers, { renderer });
  return normalizeLegacyLinks(html);
}
