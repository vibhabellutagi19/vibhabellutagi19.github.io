import { describe, expect, it } from 'vitest';

import { getAllPosts, getPostBySlug } from '../posts';

describe('post loading', () => {
  it('loads and sorts posts by date desc', async () => {
    const posts = await getAllPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(new Date(posts[0].date).getTime()).toBeGreaterThanOrEqual(
      new Date(posts.at(-1).date).getTime()
    );
  });

  it('resolves slug even when folder and slug differ', async () => {
    const post = await getPostBySlug('columns-and-expressions');
    expect(post).not.toBeNull();
    expect(post.slug).toBe('columns-and-expressions');
  });
});
