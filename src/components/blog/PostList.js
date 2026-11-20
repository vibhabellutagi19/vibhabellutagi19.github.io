import Link from 'next/link';

import { ReadMark } from './ReadMark';

function getYear(date) {
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? 'Earlier' : String(year);
}

/** "Jan 13, 2025" -> "Jan 13" (the year is shown once, above its posts). */
function shortDate(date) {
  return String(date).replace(/,?\s*\d{4}$/, '');
}

export function PostTags({ tags, tagLabels }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="tags post-row-tags">
      {tags.map((tag) => (
        <li key={tag}>{tagLabels[tag] || tag}</li>
      ))}
    </ul>
  );
}

function PostRow({ post, showYear }) {
  return (
    <li>
      <Link className="post-row" href={`/blog/${post.slug}/`}>
        <span className="post-row-date">{showYear ? post.date : shortDate(post.date)}</span>
        <span className="post-row-body">
          {post.part && <span className="post-row-part">{post.part}</span>}
          <span className="post-row-title">{post.title}</span>
          {post.excerpt && <span className="post-row-excerpt">{post.excerpt}</span>}
          <span className="post-row-meta">
            {post.readTime}
            <ReadMark slug={post.slug} />
          </span>
        </span>
      </Link>
    </li>
  );
}

/** The newest post, pinned above the list: same content as a row, with more room. */
export function LatestPost({ post }) {
  return (
    <Link className="post-latest" href={`/blog/${post.slug}/`}>
      <span className="post-latest-label">
        Latest{post.part ? ` · ${post.part}` : ''}
      </span>
      <span className="post-latest-title">{post.title}</span>
      {post.excerpt && <span className="post-latest-excerpt">{post.excerpt}</span>}
      <span className="post-row-meta">
        {post.date} · {post.readTime}
        <ReadMark slug={post.slug} />
      </span>
    </Link>
  );
}

/** Posts in the order given, with a small year heading whenever the year changes (unless `groupYears` is off). */
export function PostList({ posts, groupYears = true }) {
  if (posts.length === 0) {
    return <p className="post-list-empty">No posts here yet.</p>;
  }

  if (!groupYears) {
    return (
      <ul className="post-rows">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} showYear />
        ))}
      </ul>
    );
  }

  const years = [];
  posts.forEach((post) => {
    const year = getYear(post.date);
    const last = years[years.length - 1];
    if (last && last.year === year) {
      last.posts.push(post);
    } else {
      years.push({ year, posts: [post] });
    }
  });

  return (
    <div className="post-years">
      {years.map(({ year, posts: yearPosts }) => (
        <section key={year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className="post-year-label">
            {year}
          </h2>
          <ul className="post-rows">
            {yearPosts.map((post) => (
              <PostRow key={post.slug} post={post} showYear={false} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
