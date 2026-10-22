import Link from 'next/link';

import { profile } from '@/data/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <p className="footer-copy">© 2026 {profile.name}</p>
        <div className="footer-links">
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <Link href="/blog/">Blog</Link>
        </div>
      </div>
    </footer>
  );
}
