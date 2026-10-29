import Image from 'next/image';
import Link from 'next/link';

import { profile } from '@/data/site';

// Outline icons from Tabler Icons (MIT, tabler.io/icons), merged into one path each.
const ICONS = {
  github:
    'M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5',
  linkedin:
    'M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 1 0 -4 0M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z',
  mail: 'M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10zM3 7l9 6l9 -6',
  rss: 'M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M4 4a16 16 0 0 1 16 16M4 11a9 9 0 0 1 9 9',
};

const LINKS = [
  { icon: 'github', label: 'GitHub', href: profile.github },
  { icon: 'linkedin', label: 'LinkedIn', href: profile.linkedin },
  { icon: 'mail', label: 'Email', href: `mailto:${profile.email}` },
  { icon: 'rss', label: 'RSS feed', href: '/feed.xml' },
];

/** Who wrote this, in the post sidebar: photo, a short bio from the About section, and links. */
export function AuthorCard() {
  return (
    <section className="author-card" aria-label="About the author">
      <Image className="author-photo" src={profile.avatar} alt={profile.name} width={96} height={96} />
      <p className="author-name">{profile.name}</p>
      <p className="author-bio">
        {profile.role}. 10+ years in software, seven of them building data platforms (Spark, Kafka, Databricks) at
        Deloitte, AgileLab and Mews. Now building products end to end, including{' '}
        <Link href="/#work">Move</Link>, a gym management app.
      </p>
      <Link className="btn btn-primary btn-sm author-cta" href="/#contact">
        Work with me
      </Link>
      <ul className="author-links">
        {LINKS.map(({ icon, label, href }) => (
          <li key={icon}>
            <a
              href={href}
              aria-label={label}
              title={label}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d={ICONS[icon]} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
