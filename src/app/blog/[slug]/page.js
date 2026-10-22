import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatTag, getAllPostSlugs, getPostBySlug } from '@/lib/posts';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {};
  }

  const title = `${post.title} · Vibhavari Bellutagi`;
  // Excerpts can be raw markdown; previews need one clean line.
  const text = post.excerpt
    .replace(/[#>*_`[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const description = text.length > 160 ? `${text.slice(0, text.lastIndexOf(' ', 157))}…` : text;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}/`,
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

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="section">
      <article className="container container-narrow">
        <Link className="text-link back-link" href="/blog/">
          ← All posts
        </Link>
        <header className="article-head">
          <p className="post-meta">
            {post.date} · {post.readTime}
          </p>
          <h1>{post.title}</h1>
          {post.tags.length > 0 && (
            <p className="post-tags">
              {post.tags.map((tag) => (
                <Link key={tag} className="tag-chip" href={`/blog/tags/${tag}/`}>
                  {formatTag(tag)}
                </Link>
              ))}
            </p>
          )}
        </header>

        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.html }} />

        <footer className="article-foot">
          <Link className="text-link" href="/blog/">
            ← All posts
          </Link>
          <Link className="text-link" href="/#contact">
            Work with me →
          </Link>
        </footer>
      </article>
    </main>
  );
}
