import { loadPostFolders, getPostSlug } from './api.js';
import { parseFrontmatter, slugify } from './utils.js';

export function generateAuthorDetails() {
  const container = document.getElementById('author-details');
  if (!container) return;

  container.innerHTML = `
    <div class="author-card">
      <div class="author-avatar">
        <span>VB</span>
      </div>
      <div class="author-info">
        <span class="author-label">Written by</span>
        <h3 class="author-name">Vibhavari Bellutagi</h3>
        <div class="author-socials">
          <a href="https://www.linkedin.com/in/vibhavari-bellutagi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span class="separator">•</span>
          <a href="https://github.com/vibhabellutagi19" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </div>
  `;
}

export function generateShareLinks(title) {
  const container = document.getElementById('share-links');
  if (!container) return;

  const url = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out this blog by Vibhavari Bellutagi on "${title}"`);

  // Twitter uses 'text' parameter for the body
  const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${shareText}`;
  
  // LinkedIn feed share with pre-filled text
  const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}%20${url}`;

  container.innerHTML = `
    <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="share-link share-linkedin">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
      </svg>
      Share on LinkedIn
    </a>
    <a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" class="share-link share-twitter">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05a4.28 4.28 0 00-7.29 3.9 12.14 12.14 0 01-8.81-4.46 4.29 4.29 0 001.33 5.73 4.27 4.27 0 01-1.94-.53v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.57 8.57 0 01-5.3 1.83c-.34 0-.68-.02-1.02-.06a12.14 12.14 0 006.57 1.93c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
      </svg>
      Share on Twitter
    </a>
  `;
}

export async function generatePostNavigation() {
  const container = document.getElementById('post-navigation');
  if (!container) return;

  const folders = await loadPostFolders();
  if (!folders || !folders.length) return;

  const currentSlug = getPostSlug();
  const collected = [];

  for (const folder of folders) {
    try {
      const resp = await fetch(`posts/${folder}/index.md`);
      if (!resp.ok) continue;
      const md = await resp.text();
      const { metadata } = parseFrontmatter(md);
      const slug = metadata.slug || folder.split('-').slice(3).join('-');
      const date = metadata.date ? new Date(metadata.date) : new Date(0);
      collected.push({ folder, title: metadata.title || slug, slug, date });
    } catch (err) {
      continue;
    }
  }

  collected.sort((a, b) => b.date - a.date);

  const currentIndex = collected.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return;

  const nextPost = currentIndex > 0 ? collected[currentIndex - 1] : null;
  const prevPost =
    currentIndex < collected.length - 1 ? collected[currentIndex + 1] : null;

  let html = '';

  if (prevPost) {
    html += `
      <a href="post.html?post=${prevPost.slug}" class="nav-prev">
        <span class="nav-label">← Previous</span>
        <span class="nav-title">${prevPost.title}</span>
      </a>
    `;
  } else {
    html += `<div></div>`;
  }

  if (nextPost) {
    html += `
      <a href="post.html?post=${nextPost.slug}" class="nav-next">
        <span class="nav-label">Next →</span>
        <span class="nav-title">${nextPost.title}</span>
      </a>
    `;
  }

  container.innerHTML = html;
}

export function generateTOC() {
  const tocContainer = document.getElementById('post-toc');
  if (!tocContainer) return;

  tocContainer.innerHTML = '';

  const content = document.querySelector('.article-content');
  if (!content) return;

  const headings = content.querySelectorAll('h2, h3');
  if (!headings.length) return;

  const tocHeader = document.createElement('div');
  tocHeader.className = 'post-sidebar-heading';
  tocHeader.textContent = 'Table of Contents';
  tocContainer.appendChild(tocHeader);

  const list = document.createElement('ul');
  list.className = 'post-toc-list';

  headings.forEach((h) => {
    if (!h.id) {
      h.id = slugify(h.textContent);
    }

    const li = document.createElement('li');
    li.className = h.tagName.toLowerCase() === 'h2' ? 'toc-h2' : 'toc-h3';

    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document
        .getElementById(h.id)
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${h.id}`);
    });

    li.appendChild(a);
    list.appendChild(li);
  });

  tocContainer.appendChild(list);

  const tocLinks = tocContainer.querySelectorAll('a');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = tocContainer.querySelector(`a[href="#${id}"]`);
        if (link) {
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    },
    { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 }
  );

  headings.forEach((h) => observer.observe(h));
}

export function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.article-content pre');
  codeBlocks.forEach((preBlock) => {
    if (preBlock.querySelector('.copy-code-button')) return;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 6.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copy</span>';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');

    const codeElement = preBlock.querySelector('code');
    const codeText = codeElement ? codeElement.textContent : preBlock.textContent;

    preBlock.style.position = 'relative';
    preBlock.appendChild(copyButton);

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeText);
        copyButton.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4.5l-6 6-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copied!</span>';
        copyButton.classList.add('copied');
        setTimeout(() => {
          copyButton.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 6.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copy</span>';
          copyButton.classList.remove('copied');
        }, 2000);
      } catch (err) {
        copyButton.innerHTML = '<span>Error</span>';
        setTimeout(() => {
           copyButton.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 6.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copy</span>';
        }, 2000);
      }
    });
  });
}

export function addImageLightbox() {
  const images = document.querySelectorAll('.article-content img');
  images.forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      if (typeof window.openLightbox === 'function') {
        window.openLightbox(this.src, this.alt);
      }
    });
  });
}