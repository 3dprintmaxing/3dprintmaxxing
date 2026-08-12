(() => {
  const aliases = new Map([
    ['red-yellow-print-new.jpg', 'first-layer-print.jpg'],
    ['workshop-tools-new.jpg', 'filament-workshop.jpg'],
    ['pla-living-room.jpg', 'filament-living-room-new.jpg'],
    ['star-test-print-new.jpg', 'pla-star-print.jpg'],
    ['filament-green.jpg', 'filament-green-new.jpg'],
    ['pla-printed-objects.jpg', 'filament-printer-new.jpg'],
    ['printed-objects-new.jpg', 'filament-printer-new.jpg'],
  ]);

  function removeDuplicateImages() {
    const seen = new Set();
    document.querySelectorAll('img').forEach((image) => {
      const source = image.getAttribute('src') || image.currentSrc || '';
      const filename = source.split('?')[0].split('/').pop();
      const canonical = aliases.get(filename) || filename || source;
      if (seen.has(canonical)) {
        const wrapper = image.closest('figure') || image.closest('.article-image') || image;
        wrapper.remove();
      } else {
        seen.add(canonical);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeDuplicateImages, { once: true });
  } else {
    removeDuplicateImages();
  }
})();
