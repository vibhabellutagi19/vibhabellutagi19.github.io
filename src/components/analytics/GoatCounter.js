'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

// count.js only counts the first page load, so client-side navigations are counted here instead.
export function GoatCounter({ code }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      window.goatcounter?.count?.({ path: pathname });
    }
  }, [pathname, ready]);

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={`https://${code}.goatcounter.com/count`}
      data-goatcounter-settings={JSON.stringify({ no_onload: true })}
      strategy="afterInteractive"
      onReady={() => setReady(true)}
    />
  );
}
