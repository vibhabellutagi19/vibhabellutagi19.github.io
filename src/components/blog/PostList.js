import Link from 'next/link';

import { ReadMark } from './ReadMark';

function getYear(date) {
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? 'Earlier' : String(year);
}

function groupByYear(posts) {
  const groups = [];
  posts.forEach((post) => {
    const year = getYear(post.date);
    const last = groups[groups.length - 1];
    if (last && last.year === year) {
      last.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }
  });
  return groups;
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

export function FeaturedPost({ post, tagLabels }) {
  return (
    <Link className="post-featured" href={`/blog/${post.slug}/`}>
      <span className="eyebrow">Latest post</span>
      <span className="post-featured-title">{post.title}</span>
      {post.excerpt && <span className="post-featured-excerpt">{post.excerpt}</span>}
      <span className="post-featured-foot">
        <span className="post-meta">
          {post.date} · {post.readTime}
        </span>
        <PostTags tags={post.tags} tagLabels={tagLabels} />
        <span className="post-featured-cta">Read post →</span>
      </span>
    </Link>
  );
}

export function PostList({ posts, tagLabels }) {
  return (
    <div className="post-years">
      {groupByYear(posts).map(({ year, posts: yearPosts }) => (
        <section key={year} className="post-year" aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className="post-year-label">
            {year}
            <span>
              {yearPosts.length} {yearPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </h2>

          <ul className="post-list">
            {yearPosts.map((post) => (
              <li key={post.slug}>
                <Link className="post-item" href={`/blog/${post.slug}/`}>
                  <span className="post-meta">
                    {post.date} · {post.readTime}
                    <ReadMark slug={post.slug} />
                  </span>
                  <span className="post-title">{post.title}</span>
                  {post.excerpt && <span className="post-excerpt">{post.excerpt}</span>}
                  <PostTags tags={post.tags} tagLabels={tagLabels} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
