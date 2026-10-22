'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function LinkedInMark() {
  return (
    <svg className="slide-li" viewBox="0 0 24 24" width="18" height="18" role="img" aria-label="LinkedIn recommendation">
      <rect width="24" height="24" rx="5" fill="currentColor" />
      <path
        d="M7.2 9.6h2.5V18H7.2zM8.45 5.8a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9ZM11.3 9.6h2.4v1.15h.03c.34-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.67 3 3.83V18h-2.5v-4.15c0-1-.02-2.27-1.38-2.27-1.39 0-1.6 1.08-1.6 2.2V18h-2.5z"
        fill="#fff"
      />
    </svg>
  );
}

/**
 * One quote at a time. Auto-advances while on screen, pauses on hover or
 * focus, and never auto-plays for visitors who prefer reduced motion.
 */
export function TestimonialCarousel({ items, interval = 7000 }) {
  const ref = useRef(null);
  const touchX = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const count = items.length;

  const go = useCallback((next) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const playing = !paused && visible && !reduced && count > 1;

  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    const timer = setTimeout(() => go(index + 1), interval);
    return () => clearTimeout(timer);
  }, [playing, index, go, interval]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      go(index - 1);
    } else if (event.key === 'ArrowRight') {
      go(index + 1);
    }
  };

  const onTouchEnd = (event) => {
    if (touchX.current === null) {
      return;
    }
    const delta = event.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 40) {
      go(delta < 0 ? index + 1 : index - 1);
    }
    touchX.current = null;
  };

  return (
    <div
      ref={ref}
      className={`carousel${playing ? ' is-playing' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      style={{ '--interval': `${interval}ms` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      onKeyDown={onKeyDown}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX;
      }}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel-track" aria-live={playing ? 'off' : 'polite'}>
        {items.map((item, itemIndex) => (
          <figure
            key={item.name}
            className={`slide tone-${itemIndex % 4}${itemIndex === index ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${itemIndex + 1} of ${count}`}
            aria-hidden={itemIndex !== index}
          >
            {item.highlight && <p className="slide-highlight">“{item.highlight}”</p>}
            <blockquote className="slide-quote">{item.quote}</blockquote>
            <figcaption className="slide-who">
              <span className="slide-avatar" aria-hidden="true">
                {initials(item.name)}
              </span>
              <span>
                <b>
                  {item.name}
                  {item.source === 'LinkedIn' && <LinkedInMark />}
                </b>
                {item.role} · {item.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {count > 1 && (
        <div className="carousel-controls">
          <button type="button" className="carousel-arrow" onClick={() => go(index - 1)} aria-label="Previous testimonial">
            ‹
          </button>
          <div className="carousel-dots">
            {items.map((item, itemIndex) => (
              <button
                key={item.name}
                type="button"
                className={`carousel-dot${itemIndex === index ? ' is-active' : ''}`}
                onClick={() => go(itemIndex)}
                aria-label={`Show testimonial ${itemIndex + 1} of ${count}, from ${item.name}`}
                aria-current={itemIndex === index}
              >
                <span key={itemIndex === index ? `on-${index}` : 'off'} />
              </button>
            ))}
          </div>
          <button type="button" className="carousel-arrow" onClick={() => go(index + 1)} aria-label="Next testimonial">
            ›
          </button>
        </div>
      )}
    </div>
  );
}
