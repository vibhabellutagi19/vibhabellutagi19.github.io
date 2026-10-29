import { profile } from '@/data/site';
import { formatTag, getAllPosts } from '@/lib/posts';

const SITE_URL = 'https://buildwithvibs.in';
export const dynamic = 'force-static';

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Post dates are written like "Oct 22, 2026", which parses as local midnight. Rebuild it as
// midnight UTC so the feed date doesn't move a day with the build machine's timezone.
function toRfc822(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())).toUTCString();
}

// RSS 2.0 for feed readers. Items carry the excerpt, not the full post, so readers click
// through to the site for the diagrams and demos.
export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}/`;
      const pubDate = toRfc822(post.date);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
${pubDate ? `      <pubDate>${pubDate}</pubDate>\n` : ''}      <description>${escapeXml(post.excerpt)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(formatTag(tag))}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${profile.name} · Blog`)}</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notes on data engineering, Git, networking and the problems I run into building apps.</description>
    <language>en</language>
${posts[0] ? `    <lastBuildDate>${toRfc822(posts[0].date)}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
