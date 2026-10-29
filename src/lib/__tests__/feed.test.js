import { describe, expect, it } from 'vitest';

import { GET } from '../../app/feed.xml/route';
import { getAllPosts } from '../posts';

describe('RSS feed', () => {
  it('lists every post with an absolute link, date and escaped text', async () => {
    const response = await GET();
    const xml = await response.text();
    const posts = await getAllPosts();

    expect(response.headers.get('Content-Type')).toContain('application/rss+xml');
    expect(xml.match(/<item>/g)).toHaveLength(posts.length);
    expect(xml).toContain('<link>https://buildwithvibs.in/blog/prevent-double-booking-postgres/</link>');
    expect(xml).toContain('<pubDate>Thu, 22 Oct 2026');
    // "TCP Working: 3-Way Handshake & Reliable Communication" must not break the XML.
    expect(xml).toContain('3-Way Handshake &amp; Reliable');
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });
});
