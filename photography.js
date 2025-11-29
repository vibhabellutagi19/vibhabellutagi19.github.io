// Photography data array
// To get direct image URLs from Pexels:
// 1. Go to your photo on Pexels (e.g., https://www.pexels.com/photo/34965690/)
// 2. Right-click on the image and select "Copy image address" or "Open image in new tab"
// 3. The direct URL will look like: https://images.pexels.com/photos/34965690/pexels-photo-34965690.jpeg
// 4. Or use the format: https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg

const photographyData = [
  {
    imageUrl:
      'https://images.pexels.com/photos/34965685/pexels-photo-34965685.jpeg',
    alt: 'Split in Croatia',
    title: 'Split in Croatia',
    caption: 'Split in Croatia, 2025',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965689/pexels-photo-34965689.jpeg',
    alt: 'Mont Saint-Michel',
    title: 'Mont Saint-Michel in Normandy, France',
    caption: 'Taken from the Drone during my visit to Normandy, 2023',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965688/pexels-photo-34965688.jpeg',
    alt: 'London Eye',
    title: 'London Eye in London, England',
    caption: 'London Eye at Night, 2024',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965690/pexels-photo-34965690.jpeg',
    alt: 'Mont Saint-Michel',
    title: 'Mont Saint-Michel in Normandy, France',
    caption: 'Mont Saint-Michel, 2023',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965687/pexels-photo-34965687.jpeg',
    alt: 'Tulips in South France',
    title: 'Tulips in South France',
    caption: 'Tulips in South France, 2025',
  },
  {
    imageUrl:
      'https://images.pexels.com/photos/34965686/pexels-photo-34965686.jpeg',
    alt: 'Tulips in South France',
    title: 'Tulips in South France',
    caption: 'Tulips in South France, 2023',
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
                <div class="gallery-title">${photo.title}</div>
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
