// Blog data array - will be populated from markdown files
let blogData = [];

// Load blog posts from markdown files
async function loadBlogPosts() {
    // Determine the correct path prefix based on current location
    const pathname = window.location.pathname;
    const isBlogPage = pathname.includes('/blog/') || pathname.endsWith('/blog');
    const postsPath = isBlogPage ? 'posts/' : 'blog/posts/';

    console.log('Loading blog posts from:', postsPath, 'isBlogPage:', isBlogPage);

    try {
        // Fetch the posts manifest to get list of all post folders dynamically
        const manifestResponse = await fetch(`${postsPath}posts.json`);
        if (!manifestResponse.ok) {
            console.error('Failed to load posts manifest');
            blogData = [];
            return;
        }
        const postFolders = await manifestResponse.json();
        console.log('Found post folders:', postFolders);

        const posts = await Promise.all(
            postFolders.map(async (folderName) => {
                try {
                    const url = `${postsPath}${folderName}/index.md`;
                    console.log('Fetching:', url);
                    const response = await fetch(url);
                    if (!response.ok) {
                        console.warn(`Post ${folderName} not found at ${url} (${response.status})`);
                        return null;
                    }
                    const markdown = await response.text();
                    const { metadata, content } = parseFrontmatter(markdown);
                    
                    if (!metadata.title || !metadata.date) {
                        console.warn(`Post ${folderName} missing required metadata`);
                        return null;
                    }
                    
                    // Use slug from metadata, or extract from folder name (everything after date)
                    const slug = metadata.slug || folderName.split('-').slice(3).join('-');
                    
                    // Calculate read time automatically
                    const readTime = calculateReadTime(content);
                    
                    return {
                        date: metadata.date,
                        readTime: readTime,
                        title: metadata.title,
                        link: isBlogPage ? `post.html?post=${slug}` : `blog/post.html?post=${slug}`,
                        excerpt: metadata.excerpt,
                        slug: slug,
                        folderName: folderName
                    };
                } catch (error) {
                    console.error(`Error loading post ${folderName}:`, error);
                    return null;
                }
            })
        );

        // Filter out null values and sort by date (newest first)
        blogData = posts
            .filter(post => post !== null)
            .sort((a, b) => {
                // Parse dates (format: "Nov 20, 2024")
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA; // Newest first
            });
        
        console.log('Loaded blog posts:', blogData.length);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        // Fallback to empty array or default data
        blogData = [];
    }
}

// Function to render blog items
// limit: optional parameter to limit number of posts displayed (default: show all)
async function renderBlogItems(limit = null) {
    const blogGrid = document.getElementById('blog-grid');
    
    if (!blogGrid) {
        console.error('blog-grid element not found');
        return;
    }
    
    // Show loading state
    blogGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--muted);">Loading posts...</div>';
    
    // Load posts if not already loaded
    if (blogData.length === 0) {
        await loadBlogPosts();
    }
    
    if (blogData.length === 0) {
        blogGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--muted);">No blog posts found.</div>';
        return;
    }
    
    const postsToShow = limit ? blogData.slice(0, limit) : blogData;
    
    // Determine the correct path prefix based on current location
    const pathname = window.location.pathname;
    const isBlogPage = pathname.includes('/blog/') || pathname.endsWith('/blog');
    
    // Check if we are on the homepage (not blog page)
    const isHomepage = !isBlogPage;

    if (isHomepage) {
        blogGrid.classList.add('blog-list-view');
        blogGrid.classList.remove('blog-grid');
        
        blogGrid.innerHTML = postsToShow.map(blog => {
            const adjustedLink = blog.link;
            return `
            <a href="${adjustedLink}" class="blog-list-item">
                <span class="blog-list-date">${blog.date}</span>
                <span class="blog-list-title">${blog.title}</span>
                <span class="blog-list-arrow">→</span>
            </a>
            `;
        }).join('');
    } else {
        // Keep grid view for blog index page
        blogGrid.innerHTML = postsToShow.map(blog => {
            const adjustedLink = blog.link;
            
            return `
            <article class="blog-card">
                <div class="blog-meta">
                    <span>${blog.date}</span>
                    <span>${blog.readTime}</span>
                </div>
                <h3 class="blog-title">
                    <a href="${adjustedLink}">${blog.title}</a>
                </h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <div class="blog-actions">
                    <a href="${adjustedLink}" class="read-more">Read More →</a>
                </div>
            </article>
            `;
        }).join('');
    }
}

