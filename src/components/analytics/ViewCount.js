'use client';

import { useEffect, useState } from 'react';

import { analytics } from '@/data/site';

// Before the site's first tracked visit, so it covers every view.
const COUNT_SINCE = '2024-01-01';

// Reads GoatCounter's public counter. Shows nothing until a count arrives, or if the request fails.
export function ViewCount({ path }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!analytics.goatcounterCode) {
      return undefined;
    }

    const controller = new AbortController();
    // The bare URL is cached by GoatCounter's proxy, and a page fetched before its first visit kept
    // returning 0 long after. An explicit all-time start date is a separate, fresh cache entry.
    const url = `https://${analytics.goatcounterCode}.goatcounter.com/counter/${encodeURIComponent(path)}.json?start=${COUNT_SINCE}`;

    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.count) {
          setCount(data.count);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [path]);

  if (!count) {
    return null;
  }

  return <> · {count} {count === '1' ? 'view' : 'views'}</>;
}
