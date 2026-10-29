import fs from 'node:fs/promises';
import path from 'node:path';

import { getHeadings, parseFrontmatter, renderMarkdownToHtml } from './markdown';

const POSTS_DIR = path.join(process.cwd(), 'blog', 'posts');
const POSTS_MANIFEST_PATH = path.join(POSTS_DIR, 'posts.json');

function parsePostDate(dateString) {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return new Date('1970-01-01');
  }
  return parsed;
}

function getFolderSlug(folderName) {
  return folderName.split('-').slice(3).join('-');
}

function parseTags(raw) {
  return (raw || '')
    .split(',')
    .map((tag) =>
      tag
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    )
    .filter(Boolean);
}

// Tags whose display name isn't plain title case.
const TAG_LABELS = {
  javascript: 'JavaScript',
  trpc: 'tRPC',
};

export function formatTag(tag) {
  if (TAG_LABELS[tag]) {
    return TAG_LABELS[tag];
  }

  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function estimateReadTime(content) {
  const words = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

async function readPostFolders() {
  const raw = await fs.readFile(POSTS_MANIFEST_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function getAllPosts() {
  const folders = await readPostFolders();

  const posts = await Promise.all(
    folders.map(async (folderName) => {
      const markdownPath = path.join(POSTS_DIR, folderName, 'index.md');
      const markdown = await fs.readFile(markdownPath, 'utf8');
      const { metadata, content } = parseFrontmatter(markdown);
      const slug = metadata.slug || getFolderSlug(folderName);
      const excerpt = metadata.excerpt || content.slice(0, 180).trim();

      return {
        slug,
        folderName,
        title: metadata.title || slug,
        date: metadata.date || '',
        excerpt,
        tags: parseTags(metadata.tags),
        series: metadata.series || null,
        readTime: metadata.readTime || estimateReadTime(content),
      };
    })
  );

  return posts.sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date));
}

export async function getPostBySlug(slug) {
  const posts = await getAllPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    return null;
  }

  const markdownPath = path.join(POSTS_DIR, post.folderName, 'index.md');
  const markdown = await fs.readFile(markdownPath, 'utf8');
  const { metadata, content } = parseFrontmatter(markdown);
  const html = await renderMarkdownToHtml(content, post.folderName);

  return {
    ...post,
    metadata,
    content,
    html,
    headings: getHeadings(html),
  };
}

export async function getAllPostSlugs() {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getAllTags() {
  const posts = await getAllPosts();
  const counts = new Map();
  posts.forEach((post) => {
    post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, label: formatTag(tag), count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

/** The series a post belongs to, oldest part first, or null. */
export function getSeries(posts, post) {
  if (!post.series) {
    return null;
  }

  const parts = posts
    .filter((item) => item.series === post.series)
    .sort((a, b) => parsePostDate(a.date) - parsePostDate(b.date));
  const index = parts.findIndex((item) => item.slug === post.slug);

  return {
    name: post.series,
    parts,
    index,
    previous: parts[index - 1] ?? null,
    next: parts[index + 1] ?? null,
  };
}

/** Posts sharing the most tags with `post`, newest first among equals; topped up with the latest posts. */
export function getRelatedPosts(posts, post, { exclude = [], limit = 3 } = {}) {
  const skip = new Set([post.slug, ...exclude]);
  const candidates = posts.filter((item) => !skip.has(item.slug));
  const shared = (item) => item.tags.filter((tag) => post.tags.includes(tag)).length;

  const related = candidates
    .map((item) => ({ item, score: shared(item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || parsePostDate(b.item.date) - parsePostDate(a.item.date))
    .map(({ item }) => item);

  const latest = candidates.filter((item) => !related.includes(item));
  return [...related, ...latest].slice(0, limit);
}
