// Shared utility functions for blog functionality

// Parse frontmatter from markdown content
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { metadata: {}, content: content };
    }
    
    const frontmatter = match[1];
    const markdown = match[2];
    const metadata = {};
    
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            metadata[key] = value;
        }
    });
    
    return { metadata, content: markdown };
}

// Calculate reading time from markdown content
// Uses average reading speed of 200 words per minute
function calculateReadTime(content) {
    if (!content) return "1 min read";
    
    // Remove markdown syntax for more accurate word count
    // Remove code blocks
    let text = content.replace(/```[\s\S]*?```/g, '');
    // Remove inline code
    text = text.replace(/`[^`]+`/g, '');
    // Remove links but keep text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    // Remove images
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
    // Remove headers
    text = text.replace(/#+\s+/g, '');
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, '');
    // Remove markdown list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');
    // Remove markdown numbered list markers
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');
    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Count words (split by spaces)
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    // Calculate reading time (200 words per minute)
    const readingSpeed = 200;
    const minutes = Math.ceil(wordCount / readingSpeed);
    
    // Format as "X min read" or "1 min read" for less than 1 minute
    return minutes < 1 ? "1 min read" : `${minutes} min read`;
}

