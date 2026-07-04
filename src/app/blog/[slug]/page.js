import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';

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

  return {
    title: `${post.slug}.md | vibhavari@portfolio`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}/`,
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
    <main className="blog-standalone">
      <div className="filehead">
        <span className="path">~/blog/{post.slug}.md</span>
        <span className="ft">{post.readTime}</span>
      </div>

      <div className="frontmatter">
        --- title: {post.title} · date: {post.date} · slug: {post.slug} ---
      </div>

      <h1 style={{ fontSize: '17px', fontWeight: 600, margin: '12px 0 8px' }}>{post.title}</h1>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
        <Link className="readmore" href="/blog/">
          ← cd ../blog
        </Link>
        {' · '}
        <Link className="readmore" href="/">
          cd ~ → home
        </Link>
      </div>
    </main>
  );
}
