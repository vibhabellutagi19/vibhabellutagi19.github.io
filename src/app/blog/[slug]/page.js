import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ViewCount } from '@/components/analytics/ViewCount';
import { LikeButton } from '@/components/blog/LikeButton';
import { postDemos } from '@/components/blog/demos';
import { profile } from '@/data/site';
import { DEMO_PLACEHOLDER } from '@/lib/markdown';
import { formatTag, getAllPostSlugs, getPostBySlug } from '@/lib/posts';

const SITE_URL = 'https://buildwithvibs.in';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Excerpts can be raw markdown; previews need one clean line.
function getDescription(post) {
  const text = post.excerpt
    .replace(/[#>*_`[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 160 ? `${text.slice(0, text.lastIndexOf(' ', 157))}…` : text;
}

// Post dates are written like "Oct 22, 2026". Built from local parts so the day can't shift with the timezone.
function getIsoDate(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  const pad = (n) => String(n).padStart(2, '0');
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

// Splitting on a capturing regex alternates HTML chunks (even indexes) with demo names (odd).
function renderContent(html) {
  return html.split(new RegExp(DEMO_PLACEHOLDER.source)).map((part, index) => {
    if (index % 2 === 0) {
      return part.trim() ? <div key={index} className="article-html" dangerouslySetInnerHTML={{ __html: part }} /> : null;
    }
    const Demo = postDemos[part];
    return Demo ? <Demo key={index} /> : null;
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {};
  }

  const title = `${post.title} · Vibhavari Bellutagi`;
  const description = getDescription(post);
  const publishedTime = getIsoDate(post.date);

  return {
    title,
    description,
    keywords: post.tags.map(formatTag),
    authors: [{ name: profile.name, url: SITE_URL }],
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}/`,
      title,
      description,
      publishedTime,
      authors: [profile.name],
      tags: post.tags.map(formatTag),
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

  const url = `${SITE_URL}/blog/${post.slug}/`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: getDescription(post),
    datePublished: getIsoDate(post.date),
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/opengraph-image.jpg`,
    keywords: post.tags.map(formatTag).join(', '),
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
  };

  return (
    <main className="section">
      <script
        type="application/ld+json"
        // JSON.stringify doesn't escape "<", so a title containing "</script>" could break out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <article className="container container-narrow">
        <Link className="text-link back-link" href="/blog/">
          ← All posts
        </Link>
        <header className="article-head">
          <p className="post-meta">
            {post.date} · {post.readTime}
            <ViewCount path={`/blog/${post.slug}/`} />
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

        <div className="article-content">{renderContent(post.html)}</div>

        <LikeButton slug={post.slug} />

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
