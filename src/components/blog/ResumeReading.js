'use client';

import { useEffect, useRef, useState } from 'react';

import { getProgress, isInProgress, saveProgress } from '@/lib/reading-state';

const SAVE_EVERY_MS = 1000;
// Links from "Continue reading" on /blog end in this hash, and jump straight back.
const CONTINUE_HASH = '#continue';

// Same measure as the reading progress bar: 0 at the top of the article, 1 at its end.
function measure(target) {
  const { top, height } = target.getBoundingClientRect();
  const distance = height - window.innerHeight;
  return distance > 0 ? Math.min(1, Math.max(0, -top / distance)) : 1;
}

function scrollToPercent(target, percent) {
  const top = target.getBoundingClientRect().top + window.scrollY;
  const distance = target.offsetHeight - window.innerHeight;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: top + percent * Math.max(0, distance), behavior: reduced ? 'auto' : 'smooth' });
}

/**
 * Remembers how far the reader got in this post (in their browser only) and, when they come
 * back to a half-read post, offers to take them back to where they stopped.
 */
export function ResumeReading({ slug, targetId }) {
  const [offer, setOffer] = useState(null);
  // While the offer is open, don't overwrite the saved place with a lower one.
  const holdBelow = useRef(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) {
      return undefined;
    }

    const stored = getProgress(slug);
    if (isInProgress(stored)) {
      if (window.location.hash === CONTINUE_HASH) {
        history.replaceState(null, '', window.location.pathname);
        requestAnimationFrame(() => scrollToPercent(target, stored.percent));
      } else if (!window.location.hash && window.scrollY < 200) {
        holdBelow.current = stored.percent;
        setOffer(stored.percent);
      }
    }

    let lastSaved = 0;
    let timer = 0;
    const save = () => {
      timer = 0;
      const percent = measure(target);
      if (percent < 0.02 || percent < holdBelow.current) {
        return;
      }
      if (Math.abs(percent - lastSaved) >= 0.01) {
        lastSaved = percent;
        saveProgress(slug, percent);
      }
    };
    const onScroll = () => {
      if (holdBelow.current && measure(target) > holdBelow.current) {
        holdBelow.current = 0;
        setOffer(null);
      }
      if (!timer) {
        timer = setTimeout(save, SAVE_EVERY_MS);
      }
    };
    const onHide = () => {
      if (document.visibilityState === 'hidden') save();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', save);
    return () => {
      clearTimeout(timer);
      save();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', save);
    };
  }, [slug, targetId]);

  if (offer === null) {
    return null;
  }

  function jump() {
    const target = document.getElementById(targetId);
    holdBelow.current = 0;
    setOffer(null);
    if (target) scrollToPercent(target, offer);
  }

  function dismiss() {
    holdBelow.current = 0;
    setOffer(null);
  }

  return (
    <div className="resume" role="region" aria-label="Continue reading">
      <p>
        Welcome back. You were <strong>{Math.round(offer * 100)}%</strong> through this post.
      </p>
      <button type="button" className="btn btn-primary btn-sm" onClick={jump}>
        Jump back in
      </button>
      <button type="button" className="resume-close" aria-label="Dismiss" onClick={dismiss}>
        ×
      </button>
    </div>
  );
}
