import { generateTOC, generatePostNavigation, generateShareLinks, addCopyButtonsToCodeBlocks, addImageLightbox, generateAuthorDetails } from './ui.js';

// Process custom containers (:::tip, :::warning, :::info, :::note)
function getContainerIcon(type) {
  const icons = {
    tip: '💡',
    warning: '⚠️',
    info: 'ℹ️',
    note: '📝',
  };
  return icons[type.toLowerCase()] || '📌';
}

function getContainerTitle(type) {
  const titles = {
    tip: 'Tip',
    warning: 'Warning',
    info: 'Info',
    note: 'Note',
  };
  return titles[type.toLowerCase()] || 'Note';
}

// Render markdown to HTML
export function renderMarkdown(content, metadata, folderName) {
  if (typeof marked === 'undefined') {
    console.error('Marked.js not loaded');
    return;
  }

  // Configure marked options with custom renderer for images
  const renderer = new marked.Renderer();
  const originalImage = renderer.image;
  renderer.image = function (href, title, text) {
    // Fix relative image paths
    if (
      href &&
      !href.startsWith('http://') &&
      !href.startsWith('https://') &&
      !href.startsWith('/')
    ) {
      // Relative path - prepend the post folder path
      href = `posts/${folderName}/${href}`;
    }
    return originalImage.call(this, href, title, text);
  };

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: renderer,
  });

  // Process custom containers before markdown parsing
  const containerRegex = /:::(\w+)\n([\s\S]*?)\n:::/g;
  const containers = [];
  let containerIndex = 0;

  // Replace containers with unique placeholders
  let processedContent = content.replace(
    containerRegex,
    (match, type, innerContent) => {
      const trimmedContent = innerContent.trim();
      containers.push({ type: type.toLowerCase(), content: trimmedContent });
      return `\n\n<div data-container-id="${containerIndex++}"></div>\n\n`;
    }
  );

  // Parse markdown
  let html = marked.parse(processedContent);

  // Replace placeholders with styled containers
  containers.forEach((container, index) => {
    const parsedContent = marked.parse(container.content);
    const containerHtml = `<div class="custom-container custom-container-${
      container.type
    }">
            <div class="custom-container-header">
                <span class="custom-container-icon">${getContainerIcon(
                  container.type
                )}</span>
                <span class="custom-container-title">${getContainerTitle(
                  container.type
                )}</span>
            </div>
            <div class="custom-container-content">${parsedContent}</div>
        </div>`;
    
    const placeholderRegex = new RegExp(
      `<div data-container-id="${index}"></div>`,
      'g'
    );
    html = html.replace(placeholderRegex, containerHtml);
  });

  // Fix image paths in the HTML (fallback for any images that weren't caught by the renderer)
  html = html.replace(
    /<img([^>]*)\ssrc=["']([^"']+)["']/g,
    (match, attributes, src) => {
      // Only fix relative paths (not absolute URLs or root-relative paths)
      if (
        src &&
        !src.startsWith('http://') &&
        !src.startsWith('https://') &&
        !src.startsWith('/') &&
        !src.startsWith('posts/')
      ) {
        // Handle paths starting with ./assets/ or just assets/
        if (src.startsWith('./assets/')) {
          src = src.substring(2); // Remove ./
        }
        src = `posts/${folderName}/${src}`;
      }
      return `<img${attributes} src="${src}"`;
    }
  );

  document.getElementById('article-content').innerHTML = html;

  // Post-rendering UI enhancements
  generateTOC();
  generatePostNavigation();
  generateShareLinks(metadata.title);
  generateAuthorDetails();
  addCopyButtonsToCodeBlocks();
  addImageLightbox();
}
