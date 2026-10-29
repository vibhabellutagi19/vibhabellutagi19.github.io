import { describe, expect, it } from 'vitest';

import { getAllPosts, getPostBySlug, getRelatedPosts, getSeries } from '../posts';

describe('post loading', () => {
  it('loads and sorts posts by date desc', async () => {
    const posts = await getAllPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(new Date(posts[0].date).getTime()).toBeGreaterThanOrEqual(
      new Date(posts.at(-1).date).getTime()
    );
  });

  it('resolves slug even when folder and slug differ', async () => {
    const post = await getPostBySlug('spark-application-lifecycle-outside');
    expect(post).not.toBeNull();
    expect(post.slug).toBe('spark-application-lifecycle-outside');
  });
});

const post = (slug, date, tags = [], series = null) => ({ slug, date, tags, series, title: slug });

describe('getSeries', () => {
  const posts = [
    post('part-3', 'Mar 1, 2025', [], 'Spark'),
    post('other', 'Feb 1, 2025'),
    post('part-1', 'Jan 1, 2025', [], 'Spark'),
    post('part-2', 'Feb 1, 2025', [], 'Spark'),
  ];

  it('orders parts oldest first and finds the neighbours', () => {
    const series = getSeries(posts, posts[3]);

    expect(series.parts.map((part) => part.slug)).toEqual(['part-1', 'part-2', 'part-3']);
    expect(series.index).toBe(1);
    expect(series.previous.slug).toBe('part-1');
    expect(series.next.slug).toBe('part-3');
  });

  it('returns null for a post outside any series', () => {
    expect(getSeries(posts, posts[1])).toBeNull();
  });
});

describe('getRelatedPosts', () => {
  // Newest first, the way getAllPosts returns them.
  const posts = [
    post('newest', 'Apr 1, 2025', ['git']),
    post('two-shared', 'Mar 1, 2025', ['postgres', 'concurrency']),
    post('one-shared', 'Feb 1, 2025', ['postgres']),
    post('current', 'Jan 1, 2025', ['postgres', 'concurrency']),
  ];

  it('ranks by shared tags, then tops up with the latest posts', () => {
    const related = getRelatedPosts(posts, posts[3]);
    expect(related.map((item) => item.slug)).toEqual(['two-shared', 'one-shared', 'newest']);
  });

  it('skips excluded posts and respects the limit', () => {
    const related = getRelatedPosts(posts, posts[3], { exclude: ['two-shared'], limit: 1 });
    expect(related.map((item) => item.slug)).toEqual(['one-shared']);
  });
});

describe('real series', () => {
  it('chains the Apache Spark posts from the first part', async () => {
    const posts = await getAllPosts();
    const series = getSeries(posts, posts.find((item) => item.slug === 'handling-nulls-in-spark'));

    expect(series.parts).toHaveLength(4);
    expect(series.index).toBe(0);
    expect(series.next.slug).toBe('spark-job-anatomy');
  });
});
