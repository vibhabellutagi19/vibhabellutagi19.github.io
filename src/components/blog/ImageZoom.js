'use client';

import { useEffect, useRef, useState } from 'react';

// Click a diagram in a post or note to see it full size. Uses the native <dialog>, which
// handles Escape, focus and the backdrop. Images inside links keep opening their link.
export function ImageZoom({ targetId }) {
  const dialogRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) {
      return undefined;
    }

    const images = [...target.querySelectorAll('img')].filter((img) => !img.closest('a'));
    images.forEach((img) => {
      img.classList.add('is-zoomable');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `${img.alt ? `${img.alt}: ` : ''}open full size`);
    });

    const open = (img) => {
      setImage({ src: img.currentSrc || img.src, alt: img.alt });
      dialogRef.current?.showModal();
    };
    const onClick = (event) => {
      const img = event.target.closest?.('img.is-zoomable');
      if (img && target.contains(img)) open(img);
    };
    const onKey = (event) => {
      const img = event.target.closest?.('img.is-zoomable');
      if (img && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        open(img);
      }
    };

    target.addEventListener('click', onClick);
    target.addEventListener('keydown', onKey);
    return () => {
      target.removeEventListener('click', onClick);
      target.removeEventListener('keydown', onKey);
    };
  }, [targetId]);

  return (
    <dialog
      ref={dialogRef}
      className="image-zoom"
      aria-label={image?.alt || 'Image, full size'}
      // A click anywhere (image or backdrop) closes it; so does Escape.
      onClick={() => dialogRef.current?.close()}
      onClose={() => setImage(null)}
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element -- a copy of an image already on the page
        <img src={image.src} alt={image.alt} />
      )}
      <button type="button" className="image-zoom-close" aria-label="Close">
        ×
      </button>
    </dialog>
  );
}
