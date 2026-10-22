import Link from 'next/link';

import { getAllPosts } from '@/lib/posts';

const title = 'Blog · Vibhavari Bellutagi';
const description = 'Technical essays on data engineering, Git, and software systems.';

export const metadata = {
  title,
  description,
  openGraph: {
    url: '/blog/',
    title,
    description,
    images: ['/opengraph-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/twitter-image.jpg'],
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="section">
      <div className="container container-narrow">
        <div className="section-head">
          <p className="eyebrow">Writing</p>
          <h1>Blog</h1>
          <p className="section-lede">
            Notes on data engineering, Git and the systems behind software. {posts.length} posts.
          </p>
        </div>

        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link className="post-item" href={`/blog/${post.slug}/`}>
                <span className="post-meta">
                  {post.date} · {post.readTime}
                </span>
                <span className="post-title">{post.title}</span>
                {post.excerpt && <span className="post-excerpt">{post.excerpt}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
