import { parseFrontmatter } from './utils.js';

let postFoldersCache = null;

export async function loadPostFolders() {
  if (postFoldersCache) {
    return postFoldersCache;
  }

  try {
    const response = await fetch('posts/posts.json');
    if (!response.ok) {
      console.error('Failed to load posts manifest');
      return [];
    }
    postFoldersCache = await response.json();
    return postFoldersCache;
  } catch (error) {
    console.error('Error loading posts manifest:', error);
    return [];
  }
}

export function getPostSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('post') || window.location.hash.substring(1);
}

export async function findFolderBySlug(slug) {
  const postFolders = await loadPostFolders();

  // 1. Try metadata match
  for (const folder of postFolders) {
    try {
      const response = await fetch(`posts/${folder}/index.md`);
      if (response.ok) {
        const markdown = await response.text();
        const { metadata } = parseFrontmatter(markdown);
        if (metadata.slug === slug) {
          return folder;
        }
      }
    } catch (error) {
      continue;
    }
  }

  // 2. Try title match
  for (const folder of postFolders) {
    const folderTitle = folder.split('-').slice(3).join('-');
    if (
      folderTitle === slug ||
      folderTitle.startsWith(slug) ||
      slug === folderTitle.replace(/-/g, '')
    ) {
      return folder;
    }
  }

  // 3. Try partial match
  for (const folder of postFolders) {
    const folderTitle = folder.split('-').slice(3).join('-');
    if (
      folderTitle.includes(slug) ||
      slug.includes(folderTitle.split('-')[0])
    ) {
      return folder;
    }
  }
  return null;
}

export async function fetchPostData(folderName) {
  const response = await fetch(`posts/${folderName}/index.md`);
  if (!response.ok) {
    throw new Error('Post not found');
  }
  return await response.text();
}