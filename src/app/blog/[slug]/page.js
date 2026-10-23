import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ViewCount } from '@/components/analytics/ViewCount';
import { CodeCopy } from '@/components/blog/CodeCopy';
import { LikeButton } from '@/components/blog/LikeButton';
import { ReadNext, SeriesBox } from '@/components/blog/PostNav';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { ResumeReading } from '@/components/blog/ResumeReading';
import { SaveButton } from '@/components/blog/SaveButton';
import { ShareButton } from '@/components/blog/ShareButton';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { postDemos } from '@/components/blog/demos';
import { profile } from '@/data/site';
import { DEMO_PLACEHOLDER } from '@/lib/markdown';
import {
  formatTag,
  getAllPosts,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  getSeries,
} from '@/lib/posts';

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
    // Setting alternates here replaces the layout's, so the feed link is repeated.
    alternates: {
      canonical: `/blog/${post.slug}/`,
      types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Vibhavari Bellutagi · Blog' }] },
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

  const allPosts = await getAllPosts();
  const series = getSeries(allPosts, post);
  const related = getRelatedPosts(allPosts, post, { exclude: series?.next ? [series.next.slug] : [] });
  const tagLabels = Object.fromEntries(allPosts.flatMap((item) => item.tags).map((tag) => [tag, formatTag(tag)]));

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
      <ReadingProgress targetId="post-body" />
      <ResumeReading slug={post.slug} targetId="post-body" />
      <CodeCopy />

      <div className="container article-layout">
        <article className="article">
          <Link className="text-link back-link" href="/blog/">
            ← All posts
          </Link>
          <header className="article-head">
            <p className="post-meta">
              {post.date} · {post.readTime}
              <ViewCount path={`/blog/${post.slug}/`} />
            </p>
            <h1>{post.title}</h1>
            <div className="article-tools">
              <p className="post-tags">
                {post.tags.map((tag) => (
                  <Link key={tag} className="tag-chip" href={`/blog/tags/${tag}/`}>
                    {formatTag(tag)}
                  </Link>
                ))}
              </p>
              <div className="post-actions">
                <LikeButton slug={post.slug} />
                <SaveButton slug={post.slug} />
                <ShareButton title={post.title} text={getDescription(post)} url={url} />
              </div>
            </div>
          </header>

          {series && <SeriesBox series={series} />}
          <TableOfContents headings={post.headings} />

          <div id="post-body" className="article-content">
            {renderContent(post.html)}
          </div>

          <ReadNext series={series} related={related} tagLabels={tagLabels} />

          <footer className="article-foot">
            <Link className="text-link" href="/blog/">
              ← All posts
            </Link>
            <Link className="text-link" href="/#contact">
              Work with me →
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
