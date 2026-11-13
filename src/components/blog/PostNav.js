import Link from 'next/link';

import { PostTags } from './PostList';

/**
 * The line above a post's title, "Git · Part 2 of 3". It opens to list every part,
 * so the rest of the series is one click away without a box of its own.
 */
export function SeriesBox({ series }) {
  return (
    <details className="series-box">
      <summary>
        <span className="eyebrow">
          {series.name} · Part {series.index + 1} of {series.parts.length}
        </span>
      </summary>
      <ol className="series-list">
        {series.parts.map((part, index) => (
          <li key={part.slug}>
            {index === series.index ? (
              <span aria-current="page">{part.title}</span>
            ) : (
              <Link href={`/blog/${part.slug}/`}>{part.title}</Link>
            )}
          </li>
        ))}
      </ol>
    </details>
  );
}

function NextCard({ post, label, tagLabels }) {
  return (
    <Link className="next-card" href={`/blog/${post.slug}/`}>
      <span className="eyebrow">{label}</span>
      <span className="next-card-title">{post.title}</span>
      {post.excerpt && <span className="next-card-excerpt">{post.excerpt}</span>}
      <span className="next-card-foot">
        <span className="post-meta">{post.readTime}</span>
        <PostTags tags={post.tags} tagLabels={tagLabels} />
      </span>
    </Link>
  );
}

/**
 * The end of a post: the next part of its series, or posts on the same topics when there isn't one.
 * Gives a reader who just finished somewhere to go other than back to the list.
 */
export function ReadNext({ series, related, tagLabels }) {
  const next = series?.next;

  return (
    <section className="read-next" aria-labelledby="read-next-title">
      <h2 id="read-next-title" className="read-next-title">
        {next ? 'Keep reading' : 'Read next'}
      </h2>

      {next && (
        <NextCard
          post={next}
          label={`Part ${series.index + 2} of ${series.parts.length} · ${series.name}`}
          tagLabels={tagLabels}
        />
      )}

      {!next && related.length > 0 && (
        <ul className="read-next-list">
          {related.map((post) => (
            <li key={post.slug}>
              <Link className="post-item" href={`/blog/${post.slug}/`}>
                <span className="post-meta">
                  {post.date} · {post.readTime}
                </span>
                <span className="post-title">{post.title}</span>
                <PostTags tags={post.tags} tagLabels={tagLabels} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {series?.previous && (
        <p className="read-next-previous">
          Previous in the series:{' '}
          <Link className="text-link" href={`/blog/${series.previous.slug}/`}>
            {series.previous.title}
          </Link>
        </p>
      )}
    </section>
  );
}
