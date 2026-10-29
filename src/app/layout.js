import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';

import { GoatCounter } from '@/components/analytics/GoatCounter';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { analytics } from '@/data/site';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const title = 'Vibhavari Bellutagi · Freelance Full-Stack Developer';
const description =
  'Freelance full-stack developer with 10+ years in software. I build web apps, SaaS products, MVPs and business tools, from idea to live product.';

// The preview image comes from opengraph-image.jpg / twitter-image.jpg in this folder.
export const metadata = {
  metadataBase: new URL('https://buildwithvibs.in'),
  title,
  description,
  alternates: {
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Vibhavari Bellutagi · Blog' }] },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Vibhavari Bellutagi',
    title,
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
        {analytics.goatcounterCode && <GoatCounter code={analytics.goatcounterCode} />}
      </body>
    </html>
  );
}
