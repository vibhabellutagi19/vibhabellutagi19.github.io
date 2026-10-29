'use client';

import { useEffect, useState } from 'react';

import { analytics } from '@/data/site';

// Reads GoatCounter's public counter. Shows nothing until a count arrives, or if the request fails.
export function ViewCount({ path }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!analytics.goatcounterCode) {
      return undefined;
    }

    const controller = new AbortController();
    const url = `https://${analytics.goatcounterCode}.goatcounter.com/counter/${encodeURIComponent(path)}.json`;

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

  return <> · {count} views</>;
}
