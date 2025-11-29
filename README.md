# Portfolio Website

A modern, elegant portfolio website showcasing work experience, blog posts with comments/likes, and photography gallery.

## Features

✨ **Clean, Modern Design** - Sophisticated dark theme with golden accents  
💼 **Work Experience Timeline** - Showcase your professional journey  
📝 **Blog with GitHub-Powered Interactions** - Comments AND emoji reactions (❤️ 👍 🎉 etc.)  
📸 **Photography Gallery** - Beautiful image showcase with hover effects  
📱 **Fully Responsive** - Works perfectly on all devices  
⚡ **Fast & Lightweight** - No frameworks, pure HTML/CSS/JS  
🔒 **No Database Required** - Everything stored in GitHub Discussions (free!)

## Quick Start

### 1. Upload to GitHub

1. Create a new repository on GitHub (e.g., `your-username.github.io`)
2. Upload all files to your repository:
   ```
   index.html
   blog/
     └── modern-web-architecture.html
   ```

### 2. Enable GitHub Pages

1. Go to your repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Your site will be live at `https://your-username.github.io`

### 3. Customize Content

#### Update Personal Information

Edit `index.html` and replace:

- **Logo/Name**: Find `<div class="logo">YN</div>` and change "YN" to your initials
- **Hero Section**: Update the heading and description
- **Work Experience**: Replace with your actual job history
- **Blog Posts**: Add your own articles
- **Photography**: Replace image URLs with your own photos
- **Social Links**: Update footer links with your social media profiles
- **Copyright**: Change "Your Name" to your actual name

#### Add Your Own Blog Posts

1. Copy `blog/modern-web-architecture.html` as a template
2. Rename it (e.g., `blog/my-new-post.html`)
3. Update the content, title, and metadata
4. Add a link to it in `index.html` in the blog section

## Setting Up Comments & Reactions (Giscus)

The blog uses **Giscus** for both comments AND reactions (likes). Everything is stored in GitHub Discussions - completely free!

**📺 [View Interactive Demo](giscus-demo.html)** to see how reactions work!

**📖 [Detailed Setup Guide](GISCUS-SETUP.md)** for step-by-step instructions.

### What You Get:

✅ **Comments** - Full discussion threads  
✅ **Reactions** - Emoji reactions (❤️ 👍 🎉 😄 😕 🚀 👀) visible to all users  
✅ **No Database** - Everything stored in GitHub  
✅ **No Ads** - Completely free forever  
✅ **Moderation** - Full control through GitHub

### Step-by-Step Setup:

1. **Enable Discussions** in your repository:

   - Go to Settings → General
   - Scroll to "Features"
   - Check "Discussions"

2. **Install Giscus App**:

   - Visit https://github.com/apps/giscus
   - Click "Install"
   - Select your repository

3. **Configure Giscus**:

   - Go to https://giscus.app
   - Enter your repository name (username/repo-name)
   - Choose "Discussion title contains page **pathname**"
   - Enable reactions: ✅ Yes
   - Select "Dark" theme to match the site
   - Copy the generated script

4. **Update Your Files**:

   Open `blog/modern-web-architecture.html` and find the Giscus script section. Replace these values:

   ```html
   data-repo="your-username/your-repo-name" data-repo-id="R_xxxxx"
   <!-- Get from giscus.app -->
   data-category="General" data-category-id="DIC_xxxxx"
   <!-- Get from giscus.app -->
   ```

5. **Test It**:
   - Push your changes to GitHub
   - Visit your blog post
   - You should see reaction emojis below the article
   - Click an emoji to react (requires GitHub login)

### How Reactions Work:

- Users click emoji reactions (❤️ 👍 🎉 etc.)
- Reactions are stored in GitHub Discussions
- Everyone sees the same reaction counts in real-time
- Users must be logged into GitHub to react
- You can moderate reactions through GitHub's interface

## Customization Guide

### Colors

Edit the CSS variables in `index.html`:

```css
:root {
  --noir: #0a0a0a; /* Dark background */
  --ivory: #f8f6f1; /* Light text */
  --accent: #d4af37; /* Gold accent (change this!) */
  --shadow: #1a1a1a; /* Slightly lighter dark */
  --muted: #6b6b6b; /* Muted text */
  --border: #2a2a2a; /* Border color */
}
```

### Fonts

The site uses:

- **Playfair Display** for headings (elegant serif)
- **IBM Plex Mono** for body text (modern monospace)

To change fonts:

1. Visit [Google Fonts](https://fonts.google.com)
2. Select your fonts
3. Replace the font link in the `<head>` section
4. Update `font-family` in the CSS

### Photography Gallery

To add your own photos:

1. **Option 1 - Use Unsplash URLs** (easiest):

   - Find photos on [Unsplash](https://unsplash.com)
   - Get the photo URL
   - Replace in the gallery items

2. **Option 2 - Upload Your Own**:

   - Create an `images` folder in your repository
   - Upload your photos
   - Update image paths: `src="images/your-photo.jpg"`

3. **Option 3 - Use a CDN**:
   - Upload to Cloudinary, Imgur, or similar
   - Use those URLs

## File Structure

```
portfolio/
├── index.html                          # Main portfolio page
├── blog/
│   ├── modern-web-architecture.html   # Sample blog post
│   ├── design-systems.html            # (create your own)
│   └── performance-optimization.html  # (create your own)
└── README.md                          # This file
```

## Performance Tips

- Images are lazy-loaded automatically
- Minimal JavaScript for better performance
- CSS animations are hardware-accelerated
- No external dependencies except fonts and Giscus

## Browser Support

Works on all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Deployment Checklist

- [ ] Replace all placeholder content
- [ ] Update social media links
- [ ] Set up Giscus comments
- [ ] Add your own blog posts
- [ ] Replace photography gallery images
- [ ] Test on mobile devices
- [ ] Update meta tags for SEO (add later)
- [ ] Add favicon (optional)

## Need Help?

Common issues:

**Site not showing up?**

- Wait 5-10 minutes after enabling GitHub Pages
- Check that files are in the root directory
- Verify repository is public

**Comments not working?**

- Make sure Discussions are enabled
- Verify Giscus app is installed
- Check that repository details in script are correct

**Images not loading?**

- Verify image URLs are correct
- Check file paths are relative or absolute
- Ensure images are uploaded to repository or using valid external URLs

## Future Enhancements

Consider adding:

- Blog RSS feed
- Dark/light mode toggle
- Search functionality
- Tags/categories for blog posts
- Contact form
- Analytics (Google Analytics, Plausible, etc.)
- Custom domain

## License

Feel free to use this template for your own portfolio! No attribution required.

---

Built with care. Designed for simplicity. Crafted for you. ✨
