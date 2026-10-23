'use client';

import Link from 'next/link';
import { useState } from 'react';

import { isInProgress, useReadingState } from '@/lib/reading-state';

import { FeaturedPost, PostList } from './PostList';

const SAVED = 'saved';
const MAX_CONTINUE = 3;

function ContinueReading({ posts, progress }) {
  return (
    <section className="continue" aria-labelledby="continue-title">
      <h2 id="continue-title" className="continue-title">
        Continue reading
      </h2>
      <ul className="continue-list">
        {posts.map((post) => {
          const percent = Math.round(progress[post.slug].percent * 100);
          return (
            <li key={post.slug}>
              <Link className="continue-card" href={`/blog/${post.slug}/#continue`}>
                <span className="continue-post">{post.title}</span>
                <span className="continue-bar" aria-hidden="true">
                  <span style={{ width: `${percent}%` }} />
                </span>
                <span className="continue-meta">
                  {percent}% read · <span className="continue-cta">Pick up where you left off →</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function BlogIndex({ posts, tags }) {
  const [activeTag, setActiveTag] = useState('all');
  const { progress, saved } = useReadingState();
  const tagLabels = Object.fromEntries(tags.map(({ tag, label }) => [tag, label]));

  const savedPosts = posts.filter((post) => saved[post.slug]);
  // Unsaving the last saved post shouldn't strand the reader on an empty filter.
  const active = activeTag === SAVED && savedPosts.length === 0 ? 'all' : activeTag;

  const filtered =
    active === 'all'
      ? posts
      : active === SAVED
        ? savedPosts
        : posts.filter((post) => post.tags.includes(active));
  // Only feature the newest post on the unfiltered view, so filtering reads as a plain list.
  const [featured, ...rest] = active === 'all' ? filtered : [null, ...filtered];

  const inProgress = posts
    .filter((post) => isInProgress(progress[post.slug]))
    .sort((a, b) => progress[b.slug].updatedAt - progress[a.slug].updatedAt)
    .slice(0, MAX_CONTINUE);

  const filters = [
    { tag: 'all', label: 'All', count: posts.length },
    ...(savedPosts.length > 0 ? [{ tag: SAVED, label: 'Saved', count: savedPosts.length }] : []),
    ...tags,
  ];

  return (
    <>
      {active === 'all' && inProgress.length > 0 && <ContinueReading posts={inProgress} progress={progress} />}

      <div className="post-filters" role="group" aria-label="Filter posts by topic">
        {filters.map(({ tag, label, count }) => (
          <button
            key={tag}
            type="button"
            className={`filter-chip${tag === SAVED ? ' filter-chip-saved' : ''}`}
            aria-pressed={active === tag}
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
