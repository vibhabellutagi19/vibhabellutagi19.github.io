import fs from 'node:fs/promises';
import path from 'node:path';

import { parseFrontmatter, renderMarkdownToHtml } from './markdown';

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
  };
}

export async function getAllPostSlugs() {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}
