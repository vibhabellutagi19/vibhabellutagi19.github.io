'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LegacyBlogRedirectPage() {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slugFromQuery = params.get('post');
    setSlug(slugFromQuery);

    if (!slugFromQuery) {
      return;
    }

    window.location.replace(`/blog/${slugFromQuery}/`);
  }, []);

  return (
    <section className="legacy-shell">
      <h1>Redirecting to the updated article URL…</h1>
      {slug ? (
        <p>
          If you are not redirected automatically,{' '}
          <Link href={`/blog/${slug}/`}>open the article here</Link>.
        </p>
      ) : (
        <p>
          Missing post slug. <Link href="/blog/">Go to blog index</Link>.
        </p>
      )}
    </section>
  );
}
