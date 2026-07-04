export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://vibhabellutagi19.github.io/sitemap.xml',
  };
}
