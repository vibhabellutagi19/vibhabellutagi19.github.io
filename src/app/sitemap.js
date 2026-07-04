import { getAllPosts } from '@/lib/posts';

const SITE_URL = 'https://vibhabellutagi19.github.io';
export const dynamic = 'force-static';

export default async function sitemap() {
  const posts = await getAllPosts();

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: new Date(),
    },
    ...postEntries,
  ];
}
