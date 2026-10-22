'use client';

import { useState } from 'react';

import { FeaturedPost, PostList } from './PostList';

export function BlogIndex({ posts, tags }) {
  const [activeTag, setActiveTag] = useState('all');
  const tagLabels = Object.fromEntries(tags.map(({ tag, label }) => [tag, label]));

  const filtered = activeTag === 'all' ? posts : posts.filter((post) => post.tags.includes(activeTag));
  // Only feature the newest post on the unfiltered view, so filtering reads as a plain list.
  const [featured, ...rest] = activeTag === 'all' ? filtered : [null, ...filtered];

  const filters = [{ tag: 'all', label: 'All', count: posts.length }, ...tags];

  return (
    <>
      <div className="post-filters" role="group" aria-label="Filter posts by topic">
        {filters.map(({ tag, label, count }) => (
          <button
            key={tag}
            type="button"
            className="filter-chip"
            aria-pressed={activeTag === tag}
            onClick={() => setActiveTag(tag)}
          >
            {label}
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>

      {featured && <FeaturedPost post={featured} tagLabels={tagLabels} />}

      <PostList posts={rest} tagLabels={tagLabels} />
    </>
  );
}
