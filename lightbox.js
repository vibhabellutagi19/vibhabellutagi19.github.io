// Shared lightbox functionality for images across the site

// Open lightbox with image
function openLightbox(imageSrc, imageAlt) {
  // Check if lightbox already exists
  const existingOverlay = document.querySelector('.image-lightbox-overlay');
  if (existingOverlay) {
    return; // Don't open multiple lightboxes
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'image-lightbox-overlay';
  overlay.innerHTML = `
        <div class="image-lightbox-content">
            <button class="image-lightbox-close" aria-label="Close">&times;</button>
            <img src="${imageSrc}" alt="${
    imageAlt || ''
  }" class="image-lightbox-image">
        </div>
    `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  // Close on overlay click
  overlay.addEventListener('click', function (e) {
    if (
      e.target === overlay ||
      e.target.classList.contains('image-lightbox-close')
    ) {
      closeLightbox(overlay);
    }
  });

  // Close on Escape key
  const escapeHandler = function (e) {
    if (e.key === 'Escape') {
      closeLightbox(overlay);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Close lightbox
function closeLightbox(overlay) {
  overlay.style.opacity = '0';
  setTimeout(() => {
    if (overlay.parentNode) {
      document.body.removeChild(overlay);
    }
    document.body.style.overflow = ''; // Restore scrolling
  }, 200);
}
