# Blog Posts

This directory contains all blog posts organized in folders with the naming convention: `<date>-<title>`.

## Folder Structure

Each blog post is stored in its own folder:
```
blog/posts/
  ├── 2024-11-20-modern-web-architecture-patterns/
  │   └── index.md
  ├── 2024-11-15-building-scalable-design-systems/
  │   └── index.md
  └── 2024-11-10-web-performance-in-2024/
      └── index.md
```

## Adding a New Blog Post

1. Create a new folder with the naming convention: `YYYY-MM-DD-title-in-kebab-case`
   - Example: `2024-11-26-welcome-to-my-blog`
   - Date format: `YYYY-MM-DD` (year-month-day)
   - Title: Use kebab-case (lowercase with hyphens)

2. Create an `index.md` file inside the folder

3. Add frontmatter at the top of `index.md` with the following structure:

```markdown
---
title: "Your Post Title"
date: "Nov 26, 2024"
readTime: "5 min read"
excerpt: "A brief description of your post that will appear in the blog listing."
slug: "welcome-to-my-blog"
---

Your markdown content goes here...
```

4. Add the folder name to `posts/posts.json`:

```json
[
  "2024-11-20-modern-web-architecture-patterns",
  "2024-11-15-building-scalable-design-systems",
  "2024-11-10-web-performance-in-2024",
  "2024-11-26-welcome-to-my-blog"
]
```

The list is automatically loaded by both `blog.js` and `blog/post.html`, so you only need to update this one file!

6. Write your content in Markdown format below the frontmatter.

## Frontmatter Fields

- **title**: The post title (required)
- **date**: Publication date in format "Nov 26, 2024" (required)
- **readTime**: Estimated reading time, e.g., "5 min read" (required)
- **excerpt**: Short description for the blog listing (required)
- **slug**: URL-friendly identifier used in URLs (required)

## Folder Naming Convention

- Format: `YYYY-MM-DD-title-in-kebab-case`
- Date must match the date in frontmatter (can be different format)
- Title should be descriptive and URL-friendly
- Use lowercase and hyphens (kebab-case)

## Markdown Support

The blog supports standard Markdown syntax including:
- Headers (# ## ###)
- Bold and italic text
- Lists (ordered and unordered)
- Links and images
- Code blocks
- And more!

The markdown is rendered using [marked.js](https://marked.js.org/) which is lazy-loaded only when viewing individual posts.

