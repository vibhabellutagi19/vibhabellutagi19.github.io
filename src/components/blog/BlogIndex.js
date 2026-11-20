'use client';

import Link from 'next/link';
import { useState } from 'react';

import { isInProgress, useReadingState } from '@/lib/reading-state';

import { LatestPost, PostList } from './PostList';

const ALL = 'all';
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

/**
 * The blog index: one list, newest first. Series are a quiet filter and a small label on each post,
 * never separate sections, so the page reads as one body of writing.
 * `topics` is `[{ id, name, slugs }]`; each post may carry `part` ("Apache Spark · Part 2 of 4").
 */
export function BlogIndex({ posts, topics }) {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const { progress, saved } = useReadingState();

  const savedCount = posts.filter((post) => saved[post.slug]).length;
  // Unsaving the last saved post shouldn't strand the reader on an empty filter.
  const active = activeFilter === SAVED && savedCount === 0 ? ALL : activeFilter;
  const topic = topics.find((item) => item.id === active);

  const shown = posts.filter((post) => {
    if (active === SAVED) return Boolean(saved[post.slug]);
    if (topic) return topic.slugs.includes(post.slug);
    return true;
  });

  const inProgress = posts
    .filter((post) => isInProgress(progress[post.slug]))
    .sort((a, b) => progress[b.slug].updatedAt - progress[a.slug].updatedAt)
    .slice(0, MAX_CONTINUE);

  const filters = [
    { id: ALL, label: 'All', count: posts.length },
    ...topics.map((item) => ({ id: item.id, label: item.name, count: item.slugs.length })),
    ...(savedCount > 0 ? [{ id: SAVED, label: 'Saved', count: savedCount }] : []),
  ];

  return (
    <>
      {active === ALL && inProgress.length > 0 && <ContinueReading posts={inProgress} progress={progress} />}

      <nav className="blog-filters" aria-label="Filter posts">
        {filters.map(({ id, label, count }) => (
          <button
            key={id}
            type="button"
            className={`blog-filter${id === SAVED ? ' blog-filter-saved' : ''}`}
            aria-pressed={active === id}
            onClick={() => setActiveFilter(id)}
          >
            {label}
            <span className="blog-filter-count">{count}</span>
          </button>
        ))}
      </nav>

      {/* The newest post is pinned on the unfiltered view; a series filter reads oldest first. */}
      {active === ALL && shown.length > 0 && <LatestPost post={shown[0]} />}
      <PostList posts={topic ? [...shown].reverse() : active === ALL ? shown.slice(1) : shown} groupYears={!topic} />
    </>
  );
}
