const photographyData = [
  {
    imageUrl:
      'https://images.pexels.com/photos/34965685/pexels-photo-34965685.jpeg',
    alt: 'Split in Croatia',
    caption: 'Split in Croatia, 2025',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/35298624/pexels-photo-35298624.jpeg',
    alt: 'White Lotus',
    caption: 'Took this pitcure in Coorg, India',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965688/pexels-photo-34965688.jpeg',
    alt: 'London Eye',
    caption: 'London Eye at Night, 2024',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/35198395/pexels-photo-35198395.jpeg',
    alt: 'Flamingo',
    caption: 'Flamingo in Phoenix Park, Nice, France, 2022',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965687/pexels-photo-34965687.jpeg',
    alt: 'Tulips in South France',
    caption: 'Tulips in South France, 2025',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965686/pexels-photo-34965686.jpeg',
    alt: 'Tulips in South France',
    caption: 'Tulips in South France, 2023',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/35198394/pexels-photo-35198394.jpeg',
    alt: 'wallpaper',
    caption: 'Most downloaded Wallpaper, 2025',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965690/pexels-photo-34965690.jpeg',
    alt: 'Mont Saint-Michel',
    caption: 'Mont Saint-Michel, 2023',
  },
];

// Function to render photography items
function renderPhotographyItems() {
  const galleryGrid = document.getElementById('gallery-grid');
  galleryGrid.innerHTML = photographyData
    .map(
      (photo) => `
        <div class="gallery-item">
            <img src="${photo.imageUrl}" alt="${photo.alt}">
            <div class="gallery-overlay">
                <div class="gallery-caption">${photo.caption}</div>
            </div>
        </div>
    `
    )
    .join('');

  // Add lightbox functionality to gallery images
  addGalleryLightbox();
}

// Add lightbox functionality to gallery images
function addGalleryLightbox() {
  const galleryImages = document.querySelectorAll('.gallery-item img');

  galleryImages.forEach((img) => {
    // Make images clickable
    img.style.cursor = 'pointer';

    img.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent triggering gallery overlay
      if (typeof openLightbox === 'function') {
        openLightbox(this.src, this.alt);
      }
    });
  });
}
