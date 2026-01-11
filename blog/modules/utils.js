// Shared utility functions

export function parseFrontmatter(content) {
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
            if (value.length >= 2) {
                const firstChar = value.charAt(0);
                const lastChar = value.charAt(value.length - 1);
                if ((firstChar === '"' && lastChar === '"') || (firstChar === "'" && lastChar === "'")) {
                    value = value.slice(1, -1);
                }
            }
            metadata[key] = value;
        }
    });
    
    return { metadata, content: markdown };
}

export function calculateReadTime(content) {
    if (!content) return "1 min read";
    
    // Remove markdown syntax for more accurate word count
    let text = content.replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]+`/g, '')
        .replace(/\([^)]+\)/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        .replace(/#+\s+/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        .replace(/\s+/g, ' ').trim();
    
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const readingSpeed = 200;
    const minutes = Math.ceil(wordCount / readingSpeed);
    
    return minutes < 1 ? "1 min read" : `${minutes} min read`;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9-]/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}
