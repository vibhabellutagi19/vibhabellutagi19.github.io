import Link from 'next/link';

import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'blog/ | vibhavari@portfolio',
  description: 'Technical essays on data engineering, Git, and software systems.',
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="blog-standalone">
      <div className="filehead">
        <span className="path">~/blog — ls -la *.md</span>
        <span className="ft">{posts.length} posts</span>
      </div>

      {posts.map((post) => (
        <article className="post" key={post.slug}>
          <div className="frontmatter">
            --- date: {post.date} · slug: {post.slug} ---
          </div>
          <div className="fname">
            <Link href={`/blog/${post.slug}/`}>{post.slug}.md</Link>
          </div>
          <div className="fmeta">
            <span className="rt">{post.readTime}</span>
            <span>{post.date}</span>
          </div>
          <p className="excerpt">{post.excerpt || post.title}</p>
          <Link className="readmore" href={`/blog/${post.slug}/`}>
            cat {post.slug}.md →
          </Link>
        </article>
      ))}

      <Link className="readmore" href="/">
        cd ~ → back to portfolio
      </Link>
    </main>
  );
}
