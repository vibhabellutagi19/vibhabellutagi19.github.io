import Link from 'next/link';

import { profile } from '@/data/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div>
          <p className="footer-sign">Build with Vibs.</p>
          <p className="footer-copy">© 2026 {profile.name}</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
          <Link href="/blog/">Blog</Link>
          <a href="/feed.xml">RSS</a>
          <Link href="/privacy/">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
