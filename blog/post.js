import { getPostSlug, findFolderBySlug } from './modules/api.js';
import { parseFrontmatter, calculateReadTime } from './modules/utils.js';
import { renderMarkdown } from './modules/markdown.js';

// Load and render markdown post
async function loadPost() {
  const slug = getPostSlug();
  if (!slug) {
    document.getElementById('article-content').innerHTML =
      '<p style="color: var(--muted);">Post not found.</p>';
    return;
  }

  try {
    // Find the folder for this slug
    const folderName = await findFolderBySlug(slug);
    if (!folderName) {
      throw new Error(`Post folder not found for slug: ${slug}`);
    }

    // Fetch markdown file from folder
    const response = await fetch(`posts/${folderName}/index.md`);
    if (!response.ok) {
      throw new Error('Post not found');
    }

    const markdown = await response.text();
    const { metadata, content } = parseFrontmatter(markdown);

    // Calculate read time automatically
    const readTime = calculateReadTime(content);

    // Update page metadata
    document.title = `${metadata.title} - Blog`;
    document.getElementById('article-title').textContent = metadata.title;
    document.getElementById('article-excerpt').textContent = metadata.excerpt;
    document.getElementById('article-meta').innerHTML = `
            <span>${metadata.date}</span>
            <span>${readTime}</span>
        `;

    // Lazy load marked.js only when needed
    if (typeof marked === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js';
      script.onload = () => {
        renderMarkdown(content, metadata, folderName);
      };
      document.head.appendChild(script);
    } else {
      renderMarkdown(content, metadata, folderName);
    }
  } catch (error) {
    document.getElementById('article-content').innerHTML =
      '<p style="color: var(--muted);">Error loading post. Please try again later.</p>';
    console.error('Error loading post:', error);
  }
}

// Load post when page is ready
document.addEventListener('DOMContentLoaded', loadPost);
