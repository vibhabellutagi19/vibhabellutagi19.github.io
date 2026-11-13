import Link from 'next/link';

import { ReadMark } from './ReadMark';

/**
 * Posts as a numbered reading list. Each item carries its own `number`, so a filtered list
 * keeps every post's place in its topic.
 */
export function PathList({ items }) {
  return (
    <ol className="path">
      {items.map(({ post, number }) => (
        <li key={post.slug}>
          <Link className="path-item" href={`/blog/${post.slug}/`}>
            <span className="path-num" aria-hidden="true">
              {number}.
            </span>
            <span className="path-body">
              <span className="path-title">{post.title}</span>
              {post.excerpt && <span className="path-hook">{post.excerpt}</span>}
              <span className="post-meta">
                {post.date} · {post.readTime}
                <ReadMark slug={post.slug} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** The usual case: a whole topic, numbered from 1. */
export function numbered(posts) {
  return posts.map((post, index) => ({ post, number: index + 1 }));
}
