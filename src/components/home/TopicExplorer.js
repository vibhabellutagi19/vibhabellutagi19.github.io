'use client';

import Link from 'next/link';
import { useState } from 'react';

import { numbered, PathList } from '@/components/blog/PathList';
import { isFinished, useReadingState } from '@/lib/reading-state';

/** Pick a topic on the left, get its posts in reading order on the right. */
export function TopicExplorer({ topics, total }) {
  const [activeId, setActiveId] = useState(topics[0]?.id);
  const { progress } = useReadingState();

  const topic = topics.find((item) => item.id === activeId) ?? topics[0];
  if (!topic) {
    return null;
  }
  const read = topic.posts.filter((post) => isFinished(progress[post.slug])).length;

  return (
    <div className="learn">
      <div className="learn-topics" role="group" aria-label="Topics">
        {topics.map((item) => (
          <button
            key={item.id}
            type="button"
            className="topic-tab"
            aria-pressed={item.id === topic.id}
            onClick={() => setActiveId(item.id)}
          >
            <span className="topic-tab-name">{item.name}</span>
            <span className="topic-tab-count">
              {item.posts.length} {item.posts.length === 1 ? 'post' : 'posts'}
            </span>
          </button>
        ))}
        <Link className="text-link learn-all" href="/blog/">
          All {total} posts →
        </Link>
      </div>

      <div className="learn-panel" aria-live="polite">
        <p className="learn-panel-head">
          <span>{topic.ordered ? 'Read in this order' : 'Each one stands alone'}</span>
          <span>
            {read} of {topic.posts.length} read
          </span>
        </p>
        <p className="learn-blurb">{topic.blurb}</p>
        <PathList items={numbered(topic.posts)} />
      </div>
    </div>
  );
}
