import Link from 'next/link';

import { profile } from '@/data/site';

const title = 'Privacy · Vibhavari Bellutagi';
const description = 'What this site collects, why, and where it is kept.';
const LAST_UPDATED = 'Nov 13, 2026';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/privacy/' },
  openGraph: {
    url: '/privacy/',
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

export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="container container-narrow">
        <Link className="text-link back-link" href="/">
          ← Home
        </Link>
        <div className="section-head">
          <p className="eyebrow">Privacy</p>
          <h1>Privacy policy</h1>
          <p className="section-lede">
            This site sets no cookies and has no accounts or ads. Here is everything it collects.
          </p>
        </div>

        <div className="article-content">
          <p>Last updated {LAST_UPDATED}.</p>

          <h2>Page views</h2>
          <p>
            I count visits with <a href="https://vercel.com/docs/analytics/privacy-policy">Vercel Web
            Analytics</a>, a privacy-friendly analytics service from the company that hosts this site. When
            you load a page, it receives the page address, the site you came from, your browser, operating
            system and device type, and your country (worked out from your IP address). It sets no cookies,
            does not store your IP address, and identifies visitors only by a hash that is discarded after a
            day, so it cannot track you across days or across other websites. I use it to see which posts
            people read.
          </p>

          <h2>Likes</h2>
          <p>
            The like button on blog posts is run by a small service I host on Cloudflare. To stop the same
            visitor liking a post twice, it stores a one-way hash of your IP address mixed with a secret
            value, alongside the post you liked. Your actual IP address is never stored. The hash stays until
            you unlike the post; clicking the button again deletes it.
          </p>

          <h2>Reading progress and saved posts</h2>
          <p>
            The blog remembers how far you got in each post and which posts you saved for later, so it can
            show your progress and let you pick up where you left off. This is kept in your browser&apos;s
            local storage and never sent to me or anyone else. Clearing your browser&apos;s site data removes
            it.
          </p>

          <h2>Hosting</h2>
          <p>
            The site is hosted on Vercel and the like service runs on Cloudflare. Like any web host, they
            may keep standard server logs, including IP addresses, under their own privacy policies:{' '}
            <a href="https://vercel.com/legal/privacy-policy">Vercel</a> and{' '}
            <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>.
          </p>

          <h2>Contacting me</h2>
          <p>
            If you email or message me, I use your details only to reply. Questions about this page, or a
            request to delete anything, go to <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
