// The site-wide link preview (home page, and any page without its own card).
// Drawn at build time from the same copy as the hero, so it can't drift from the site.
import { profile } from '@/data/site';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${profile.name}, ${profile.role}: I build data platforms, and the backends that feed them.`;

export default function Image() {
  return renderOgImage({
    eyebrow: profile.role,
    title: 'I build data platforms, and the backends that feed them.',
    tags: ['Data platforms', 'Backend & APIs'],
  });
}
