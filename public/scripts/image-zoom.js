(function () {
  let overlay;
  let overlayImage;
  let overlayCaption;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'image-zoom';
    overlay.hidden = true;
    overlay.innerHTML = [
      '<button class="image-zoom-close" type="button" aria-label="Fermer l’image agrandie">×</button>',
      '<figure class="image-zoom-figure">',
      '<img class="image-zoom-image" alt="">',
      '<figcaption class="image-zoom-caption"></figcaption>',
      '</figure>',
    ].join('');

    overlayImage = overlay.querySelector('.image-zoom-image');
    overlayCaption = overlay.querySelector('.image-zoom-caption');

    overlay.addEventListener('click', (event) => {
      if (
        event.target === overlay ||
        event.target.closest('.image-zoom-close')
      ) {
        closeOverlay();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!overlay.hidden && event.key === 'Escape') {
        closeOverlay();
      }
    });

    document.body.appendChild(overlay);
  }

  function getCaption(image) {
    return image
      .closest('figure')
      ?.querySelector('figcaption')
      ?.textContent
      ?.trim() || image.alt || '';
  }

  function openOverlay(image) {
    if (!overlay) {
      createOverlay();
    }

    overlayImage.src = image.currentSrc || image.src;
    overlayImage.alt = image.alt || '';
    overlayCaption.textContent = getCaption(image);
    overlayCaption.hidden = !overlayCaption.textContent;
    overlay.hidden = false;
    document.documentElement.classList.add('image-zoom-open');
    overlay.querySelector('.image-zoom-close').focus();
  }

  function closeOverlay() {
    overlay.hidden = true;
    overlayImage.removeAttribute('src');
    document.documentElement.classList.remove('image-zoom-open');
  }

  function enhanceImages() {
    document
      .querySelectorAll('.article-content img[data-zoomable="true"]')
      .forEach((image) => {
        image.classList.add('article-image--zoomable');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `Agrandir l’image : ${image.alt || 'illustration'}`);

        image.addEventListener('click', () => openOverlay(image));
        image.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openOverlay(image);
          }
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceImages);
  } else {
    enhanceImages();
  }
})();
