
// Cache for post folders manifest
let postFoldersCache = null;

// Load post folders from manifest
async function loadPostFolders() {
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

// Get post slug from URL
function getPostSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post') || window.location.hash.substring(1);
}

// Find folder name by slug
async function findFolderBySlug(slug) {
    const postFolders = await loadPostFolders();
    
    // First, try to match by loading metadata and checking slug field
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
            // Continue to next folder
            continue;
        }
    }
    
    // Fallback: try to find folder where the slug matches the folder name pattern
    // Folder format: YYYY-MM-DD-title, slug is usually part of title
    for (const folder of postFolders) {
        // Extract title part from folder (everything after date)
        const folderTitle = folder.split('-').slice(3).join('-');
        // Check if slug matches or is contained in folder title
        if (folderTitle === slug || folderTitle.startsWith(slug) || slug === folderTitle.replace(/-/g, '')) {
            return folder;
        }
    }
    
    // Last fallback: try partial match
    for (const folder of postFolders) {
        const folderTitle = folder.split('-').slice(3).join('-');
        if (folderTitle.includes(slug) || slug.includes(folderTitle.split('-')[0])) {
            return folder;
        }
    }
    return null;
}

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

// Process custom containers (:::tip, :::warning, :::info, :::note)
function processCustomContainers(html) {
    // Match patterns like :::tip\n\ncontent\n\n:::
    // But we need to handle this before markdown parsing, so we'll use a different approach
    // We'll replace containers with placeholders, parse markdown, then replace placeholders
    return html;
}

function getContainerIcon(type) {
    const icons = {
        tip: '💡',
        warning: '⚠️',
        info: 'ℹ️',
        note: '📝'
    };
    return icons[type.toLowerCase()] || '📌';
}

function getContainerTitle(type) {
    const titles = {
        tip: 'Tip',
        warning: 'Warning',
        info: 'Info',
        note: 'Note'
    };
    return titles[type.toLowerCase()] || 'Note';
}

// Store folder name for image path resolution
let currentPostFolder = null;

// Render markdown to HTML
function renderMarkdown(content, metadata, folderName) {
    if (typeof marked === 'undefined') {
        console.error('Marked.js not loaded');
        return;
    }

    // Store folder name for image path fixing
    currentPostFolder = folderName;

    // Configure marked options with custom renderer for images
    const renderer = new marked.Renderer();
    const originalImage = renderer.image;
    renderer.image = function(href, title, text) {
        // Fix relative image paths
        if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('/')) {
            // Relative path - prepend the post folder path
            href = `posts/${folderName}/${href}`;
        }
        return originalImage.call(this, href, title, text);
    };

    marked.setOptions({
        breaks: true,
        gfm: true,
        renderer: renderer
    });

    // Process custom containers before markdown parsing
    const containerRegex = /:::(\w+)\n([\s\S]*?)\n:::/g;
    const containers = [];
    let containerIndex = 0;
    
    // Replace containers with unique placeholders
    let processedContent = content.replace(containerRegex, (match, type, innerContent) => {
        const trimmedContent = innerContent.trim();
        containers.push({ type: type.toLowerCase(), content: trimmedContent });
        return `\n\n<div data-container-id="${containerIndex++}"></div>\n\n`;
    });
    
    // Parse markdown
    let html = marked.parse(processedContent);
    
    // Replace placeholders with styled containers
    containers.forEach((container, index) => {
        const parsedContent = marked.parse(container.content);
        const containerHtml = `<div class="custom-container custom-container-${container.type}">
            <div class="custom-container-header">
                <span class="custom-container-icon">${getContainerIcon(container.type)}</span>
                <span class="custom-container-title">${getContainerTitle(container.type)}</span>
            </div>
            <div class="custom-container-content">${parsedContent}</div>
        </div>`;
        // Use a more specific regex to match the div
        const placeholderRegex = new RegExp(`<div data-container-id="${index}"></div>`, 'g');
        html = html.replace(placeholderRegex, containerHtml);
    });
    
    // Fix image paths in the HTML (fallback for any images that weren't caught by the renderer)
    html = html.replace(/<img([^>]*)\ssrc=["']([^"']+)["']/g, (match, attributes, src) => {
        // Only fix relative paths (not absolute URLs or root-relative paths)
        if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/') && !src.startsWith('posts/')) {
            // Handle paths starting with ./assets/ or just assets/
            if (src.startsWith('./assets/')) {
                src = src.substring(2); // Remove ./
            }
            src = `posts/${folderName}/${src}`;
        }
        return `<img${attributes} src="${src}"`;
    });
    
    document.getElementById('article-content').innerHTML = html;

    // Add copy buttons to code blocks
    addCopyButtonsToCodeBlocks();

    // Add click handlers for images
    addImageLightbox();

    // Initialize Giscus after content is loaded
    initializeGiscus(metadata.slug);
}

// Add lightbox functionality to images
function addImageLightbox() {
    const images = document.querySelectorAll('.article-content img');
    
    images.forEach(img => {
        // Make images clickable
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', function() {
            if (typeof openLightbox === 'function') {
                openLightbox(this.src, this.alt);
            }
        });
    });
}

// Lightbox functions are now in shared lightbox.js

// Add copy buttons to all code blocks
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.article-content pre');
    
    codeBlocks.forEach((preBlock) => {
        // Skip if button already exists
        if (preBlock.querySelector('.copy-code-button')) {
            return;
        }

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 6.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copy</span>';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Get code content
        const codeElement = preBlock.querySelector('code');
        const codeText = codeElement ? codeElement.textContent : preBlock.textContent;
        
        // Make pre block relative for absolute positioning
        preBlock.style.position = 'relative';
        
        // Add button to pre block
        preBlock.appendChild(copyButton);
        
        // Copy functionality
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeText);
                copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4.5l-6 6-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copied!</span>';
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 6.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copy</span>';
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyButton.innerHTML = '<span>Error</span>';
                setTimeout(() => {
                    copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 6.5h-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copy</span>';
                }, 2000);
            }
        });
    });
}

function initializeGiscus(slug) {
    const giscusConfig = {
        repo: "vibhabellutagi19/vibhabellutagi19.github.io", 
        repoId: "R_kgDONGJxLg", 
        category: "General",
        categoryId: "DIC_kwDONGJxLs4CzKKT",
        mapping: "pathname", 
        term: slug || window.location.pathname, 
        reactionsEnabled: "1", 
        emitMetadata: "0", 
        inputPosition: "top", 
        theme: "noborder_dark", 
        lang: "en" ,
        loading: "lazy"
    };

    const reactionsContainer = document.querySelector('.giscus-reactions-container');
    if (reactionsContainer) {
        const reactionsScript = document.createElement('script');
        reactionsScript.src = 'https://giscus.app/client.js';
        reactionsScript.setAttribute('data-repo', giscusConfig.repo);
        reactionsScript.setAttribute('data-repo-id', giscusConfig.repoId);
        reactionsScript.setAttribute('data-category', giscusConfig.category);
        reactionsScript.setAttribute('data-category-id', giscusConfig.categoryId);
        reactionsScript.setAttribute('data-mapping', giscusConfig.mapping);
        reactionsScript.setAttribute('data-term', giscusConfig.term);
        reactionsScript.setAttribute('data-strict', '0');
        reactionsScript.setAttribute('data-loading', giscusConfig.loading);
        reactionsScript.setAttribute('data-reactions-enabled', '1');
        reactionsScript.setAttribute('data-emit-metadata', giscusConfig.emitMetadata);
        reactionsScript.setAttribute('data-input-position', giscusConfig.inputPosition);
        reactionsScript.setAttribute('data-theme', giscusConfig.theme);
        reactionsScript.setAttribute('data-lang', giscusConfig.lang);
        reactionsScript.crossOrigin = 'anonymous';
        reactionsScript.async = true;
        
        reactionsContainer.appendChild(reactionsScript);
    }

    const commentsContainer = document.querySelector('.comments-section');
    if (commentsContainer) {
        const commentsScript = document.createElement('script');
        commentsScript.src = 'https://giscus.app/client.js';
        commentsScript.setAttribute('data-repo', giscusConfig.repo);
        commentsScript.setAttribute('data-repo-id', giscusConfig.repoId);
        commentsScript.setAttribute('data-category', giscusConfig.category);
        commentsScript.setAttribute('data-category-id', giscusConfig.categoryId);
        commentsScript.setAttribute('data-mapping', giscusConfig.mapping);
        commentsScript.setAttribute('data-term', giscusConfig.term);
        commentsScript.setAttribute('data-strict', '0');
        commentsScript.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled);
        commentsScript.setAttribute('data-emit-metadata', giscusConfig.emitMetadata);
        commentsScript.setAttribute('data-input-position', giscusConfig.inputPosition);
        commentsScript.setAttribute('data-theme', giscusConfig.theme);
        commentsScript.setAttribute('data-lang', giscusConfig.lang);
        commentsScript.setAttribute('data-loading', 'lazy');
        commentsScript.crossOrigin = 'anonymous';
        commentsScript.async = true;
        
        commentsContainer.appendChild(commentsScript);
    }
}

// Load post when page is ready
document.addEventListener('DOMContentLoaded', loadPost);

