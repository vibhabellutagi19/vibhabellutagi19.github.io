import { BlogIndex } from '@/components/blog/BlogIndex';
import { getAllPosts } from '@/lib/posts';
import { getTopicPath, groupByTopic } from '@/lib/topics';
import { SITE_OG_IMAGES, SITE_TWITTER_IMAGES } from '@/lib/share-image';

const title = 'Blog · Vibhavari Bellutagi';
const description = 'Technical essays on data engineering, Git, and software systems.';

export const metadata = {
  title,
  description,
  openGraph: {
    images: SITE_OG_IMAGES,
    url: '/blog/',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    images: SITE_TWITTER_IMAGES,
    title,
    description,
  },
};

export default async function BlogIndexPage() {
  const allPosts = await getAllPosts();
  // Series are filters and a small "Part N" label, not sections: only ones with 2+ posts read in order.
  const topics = groupByTopic(allPosts)
    .filter((topic) => topic.ordered && topic.posts.length > 1)
    .map((topic) => ({ id: topic.id, name: topic.name, slugs: topic.posts.map((post) => post.slug) }));
  const posts = allPosts.map((post) => {
    const path = getTopicPath(allPosts, post);
    return { ...post, part: path ? `${path.name} · Part ${path.index + 1} of ${path.parts.length}` : null };
  });

  return (
    <main className="section blog-index">
      <div className="container container-blog">
        <div className="blog-head">
          <div>
            <p className="eyebrow">Writing</p>
            <h1>
              How things <span className="serif">actually</span> work.
            </h1>
            <p className="section-lede">
              {posts.length} posts on data engineering, backend systems, Git and networking, newest first.
            </p>
          </div>
          <a className="text-link rss-link" href="/feed.xml">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <circle cx="5" cy="19" r="2" />
              <path d="M3 11a10 10 0 0 1 10 10M3 4a17 17 0 0 1 17 17" />
            </svg>
            Follow via RSS
          </a>
        </div>

        <BlogIndex posts={posts} topics={topics} />
      </div>
    </main>
  );
}
