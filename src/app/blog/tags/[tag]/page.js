import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatTag, getAllTags, getPostsByTag } from '@/lib/posts';

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const label = formatTag(tag);
  const title = `${label} · Blog · Vibhavari Bellutagi`;
  const description = `Posts tagged ${label}.`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/tags/${tag}/` },
    openGraph: {
      url: `/blog/tags/${tag}/`,
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
}

export default async function BlogTagPage({ params }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="section">
      <div className="container container-narrow">
        <Link className="text-link back-link" href="/blog/">
          ← All posts
        </Link>
        <div className="section-head">
          <p className="eyebrow">Tag</p>
          <h1>{formatTag(tag)}</h1>
          <p className="section-lede">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}.
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
