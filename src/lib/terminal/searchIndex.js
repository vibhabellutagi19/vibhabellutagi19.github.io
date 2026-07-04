const NAV_ITEMS = [
  {
    id: 'home',
    type: 'section',
    label: 'home.md',
    hint: 'Portfolio overview',
    href: '/#home',
    section: 'home',
    keywords: ['home', 'about', 'neofetch', 'portfolio', 'vibhavari'],
  },
  {
    id: 'experience',
    type: 'section',
    label: 'experience.git',
    hint: 'Work history · git log',
    href: '/#experience',
    section: 'experience',
    keywords: ['experience', 'work', 'jobs', 'career', 'mews', 'deloitte'],
  },
  {
    id: 'blog-index',
    type: 'section',
    label: 'blog/index.md',
    hint: 'All posts',
    href: '/blog/',
    section: 'blog',
    keywords: ['blog', 'posts', 'writing', 'essays', 'articles'],
  },
  {
    id: 'projects',
    type: 'section',
    label: 'projects/',
    hint: 'Personal side projects',
    href: '/#projects',
    section: 'projects',
    keywords: ['projects', 'side project', 'personal', 'github', 'repos'],
  },
  {
    id: 'contact',
    type: 'section',
    label: '.env',
    hint: 'Contact & links',
    href: '/#contact',
    section: 'contact',
    keywords: ['contact', 'email', 'env', 'linkedin', 'github'],
  },
  {
    id: 'action-terminal',
    type: 'action',
    label: 'terminal',
    hint: 'Open interactive shell',
    action: 'terminal',
    keywords: ['terminal', 'bash', 'shell', 'console'],
  },
  {
    id: 'action-email',
    type: 'action',
    label: 'mailto',
    hint: 'vibhavari.bellutagi@gmail.com',
    action: 'email',
    keywords: ['email', 'mail', 'contact'],
  },
];

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreItem(item, terms) {
  const label = item.label.toLowerCase();
  const hint = (item.hint || '').toLowerCase();
  const keywords = (item.keywords || []).join(' ').toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (label.includes(term)) {
      score += 12;
    }
    if (label.startsWith(term)) {
      score += 8;
    }
    if (hint.includes(term)) {
      score += 6;
    }
    if (keywords.includes(term)) {
      score += 4;
    }
  }

  return score;
}

export function buildSearchIndex({ blogPosts = [], experience = [], projects = [] } = {}) {
  const blogItems = blogPosts.map((post) => ({
    id: `blog-${post.slug}`,
    type: 'blog',
    label: `${post.slug}.md`,
    hint: post.title,
    href: `/blog/${post.slug}/`,
    keywords: tokenize([post.slug, post.title, post.excerpt].join(' ')),
  }));

  const experienceItems = experience.map((entry, index) => ({
    id: `exp-${index}`,
    type: 'experience',
    label: entry.title,
    hint: entry.company,
    href: '/#experience',
    section: 'experience',
    keywords: tokenize([entry.title, entry.company, entry.description, entry.track, ...(entry.skills || [])].join(' ')),
  }));

  const projectItems = projects.map((project) => ({
    id: `project-${project.slug}`,
    type: 'project',
    label: `${project.slug}/`,
    hint: project.name,
    href: '/#projects',
    section: 'projects',
    keywords: tokenize(
      [project.slug, project.name, project.description, project.track, ...(project.stack || []), ...(project.highlights || [])].join(' ')
    ),
  }));

  return [...NAV_ITEMS.filter((item) => projects.length > 0 || item.id !== 'projects'), ...blogItems, ...experienceItems, ...projectItems];
}

export function searchItems(items, query, limit = 10) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return items.filter((item) => item.type === 'section' || item.type === 'action').slice(0, limit);
  }

  const terms = trimmed.split(/\s+/).filter(Boolean);

  return items
    .map((item) => ({ item, score: scoreItem(item, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .slice(0, limit)
    .map(({ item }) => item);
}

function slugFromLabel(label) {
  return label.replace(/\.md$/, '').toLowerCase();
}

export function findOpenTarget(items, query) {
  const trimmed = query.trim().toLowerCase().replace(/\.md$/, '');
  if (!trimmed) {
    return null;
  }

  const blogItems = items.filter((item) => item.type === 'blog');

  const exact = blogItems.find((item) => slugFromLabel(item.label) === trimmed);
  if (exact) {
    return exact;
  }

  const prefixMatches = blogItems.filter((item) => slugFromLabel(item.label).startsWith(trimmed));
  if (prefixMatches.length === 1) {
    return prefixMatches[0];
  }
  if (prefixMatches.length > 1) {
    return prefixMatches.sort((a, b) => slugFromLabel(a.label).length - slugFromLabel(b.label).length)[0];
  }

  const slugMatches = blogItems.filter((item) => slugFromLabel(item.label).includes(trimmed));
  if (slugMatches.length === 1) {
    return slugMatches[0];
  }
  if (slugMatches.length > 1) {
    return slugMatches.sort((a, b) => slugFromLabel(a.label).length - slugFromLabel(b.label).length)[0];
  }

  return searchItems(items, query, 1)[0] || null;
}

export function filterBlogPosts(blogPosts, query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return blogPosts;
  }

  const terms = trimmed.split(/\s+/).filter(Boolean);

  return blogPosts.filter((post) => {
    const haystack = [post.slug, post.title, post.excerpt].join(' ').toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
