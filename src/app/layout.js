import { IBM_Plex_Mono } from 'next/font/google';

import { BootOverlay } from '@/components/terminal/BootOverlay';
import { TerminalShell } from '@/components/terminal/TerminalShell';
import { getAllPosts } from '@/lib/posts';

import './globals.css';

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'vibhavari@portfolio: ~/portfolio',
  description:
    'Portfolio of Vibhavari Bellutagi — data and software engineer. Experience, writing, and technical notes.',
};

export default async function RootLayout({ children }) {
  const posts = await getAllPosts();
  const blogPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
  }));

  return (
    <html lang="en" className={plexMono.variable} suppressHydrationWarning>
      <body>
        <BootOverlay />
        <TerminalShell blogPosts={blogPosts}>{children}</TerminalShell>
      </body>
    </html>
  );
}
