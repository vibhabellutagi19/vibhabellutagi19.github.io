'use client';

import Link from 'next/link';
import { useState } from 'react';

import { isInProgress, useReadingState } from '@/lib/reading-state';

import { numbered, PathList } from './PathList';
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

function TopicSections({ topics }) {
  return (
    <div className="topic-sections">
      {topics.map((topic) => (
        <section key={topic.id} className="topic-section" aria-labelledby={`topic-${topic.id}`}>
          <div className="topic-intro">
            <h2 id={`topic-${topic.id}`}>{topic.name}</h2>
            <p>{topic.blurb}</p>
            <p className="post-meta">
              {topic.total} {topic.total === 1 ? 'post' : 'posts'}
              {topic.ordered && ' · read in order'}
            </p>
          </div>
          <PathList items={topic.items} />
        </section>
      ))}
    </div>
  );
}

const ALL = 'all';
const BY_TOPIC = 'topic';
const BY_DATE = 'date';

/**
 * The blog index. Posts are grouped into topics, each in reading order; the chips narrow it to
 * one topic (or the reader's saved posts), and the switch swaps the grouping for a plain
 * newest-first list.
 */
export function BlogIndex({ posts, topics, tags }) {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [order, setOrder] = useState(BY_TOPIC);
  const { progress, saved } = useReadingState();
  const tagLabels = Object.fromEntries(tags.map(({ tag, label }) => [tag, label]));

  const savedCount = posts.filter((post) => saved[post.slug]).length;
  // Unsaving the last saved post shouldn't strand the reader on an empty filter.
  const active = activeFilter === SAVED && savedCount === 0 ? ALL : activeFilter;
  const keep = (post) => active !== SAVED || Boolean(saved[post.slug]);

  const shownTopics = topics
    .filter((topic) => active === ALL || active === SAVED || topic.id === active)
    .map((topic) => ({
      ...topic,
      total: topic.posts.length,
      // Numbered before filtering, so a saved post keeps its place in the topic.
      items: numbered(topic.posts).filter(({ post }) => keep(post)),
    }))
    .filter((topic) => topic.items.length > 0);

  const shownSlugs = new Set(shownTopics.flatMap((topic) => topic.items.map(({ post }) => post.slug)));
  const byDate = posts.filter((post) => shownSlugs.has(post.slug));
  // Only feature the newest post on the unfiltered view, so filtering reads as a plain list.
  const featured = active === ALL ? posts[0] : null;

  const inProgress = posts
    .filter((post) => isInProgress(progress[post.slug]))
    .sort((a, b) => progress[b.slug].updatedAt - progress[a.slug].updatedAt)
    .slice(0, MAX_CONTINUE);

  const filters = [
    { id: ALL, label: 'All', count: posts.length },
    ...topics.map((topic) => ({ id: topic.id, label: topic.name, count: topic.posts.length })),
    ...(savedCount > 0 ? [{ id: SAVED, label: 'Saved', count: savedCount }] : []),
  ];

  return (
    <>
      {active === ALL && inProgress.length > 0 && <ContinueReading posts={inProgress} progress={progress} />}

      <div className="blog-toolbar">
        <div className="post-filters" role="group" aria-label="Filter posts by topic">
          {filters.map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              className={`filter-chip${id === SAVED ? ' filter-chip-saved' : ''}`}
              aria-pressed={active === id}
              onClick={() => setActiveFilter(id)}
            >
              {label}
              <span className="filter-count">{count}</span>
            </button>
          ))}
        </div>
        <div className="sort-toggle" role="group" aria-label="Order">
          <button type="button" aria-pressed={order === BY_TOPIC} onClick={() => setOrder(BY_TOPIC)}>
            Reading order
          </button>
          <button type="button" aria-pressed={order === BY_DATE} onClick={() => setOrder(BY_DATE)}>
            Newest first
          </button>
        </div>
      </div>

      {featured && <FeaturedPost post={featured} tagLabels={tagLabels} />}

      {order === BY_TOPIC ? (
        <TopicSections topics={shownTopics} />
      ) : (
        <PostList posts={featured ? byDate.slice(1) : byDate} tagLabels={tagLabels} />
      )}
    </>
  );
}
