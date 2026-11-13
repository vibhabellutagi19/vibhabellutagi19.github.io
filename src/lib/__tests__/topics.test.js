import { describe, expect, it } from 'vitest';

import { getAllPosts } from '../posts';
import { getTopic, getTopicPath, groupByTopic } from '../topics';

const post = (slug, date, tags = []) => ({ slug, date, tags, title: slug });

const posts = [
  post('locks', 'Oct 22, 2026', ['building-apps', 'postgres']),
  post('git-3', 'Jan 16, 2026', ['git']),
  post('git-2', 'Jan 13, 2026', ['git']),
  post('git-1', 'Jan 10, 2026', ['git']),
  post('untagged', 'Mar 21, 2025'),
];

describe('getTopic', () => {
  it('matches a post to the topic that owns one of its tags', () => {
    expect(getTopic(posts[1]).id).toBe('git');
    expect(getTopic(posts[0]).id).toBe('projects');
  });

  it('puts a post with no matching tag in the last topic', () => {
    expect(getTopic(posts[4]).id).toBe('projects');
  });
});

describe('groupByTopic', () => {
  it('lists each topic oldest post first and skips empty topics', () => {
    const groups = groupByTopic(posts);

    expect(groups.map((group) => group.id)).toEqual(['git', 'projects']);
    expect(groups[0].posts.map((item) => item.slug)).toEqual(['git-1', 'git-2', 'git-3']);
    expect(groups[1].posts.map((item) => item.slug)).toEqual(['untagged', 'locks']);
  });

  it('places every real post in exactly one topic', async () => {
    const all = await getAllPosts();
    const grouped = groupByTopic(all).flatMap((group) => group.posts.map((item) => item.slug));

    expect(grouped.sort()).toEqual(all.map((item) => item.slug).sort());
  });
});

describe('getTopicPath', () => {
  it('gives the position, previous and next part within an ordered topic', () => {
    const path = getTopicPath(posts, posts[2]);

    expect(path.name).toBe('Git');
    expect(path.index).toBe(1);
    expect(path.previous.slug).toBe('git-1');
    expect(path.next.slug).toBe('git-3');
  });

  it('is null for a topic that is not a sequence', () => {
    expect(getTopicPath(posts, posts[0])).toBeNull();
  });

  it('is null when the post is alone in its topic', () => {
    expect(getTopicPath([post('solo', 'Jan 1, 2026', ['networking'])], post('solo', 'Jan 1, 2026', ['networking']))).toBeNull();
  });
});
