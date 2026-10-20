(() => {
  'use strict';
  const viewer = document.getElementById('screenshot-viewer');
  const image = document.getElementById('viewer-image');
  if (!viewer || !image || typeof viewer.showModal !== 'function') return;
  let opener;
  document.querySelectorAll('[data-zoom]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      viewer.showModal();
    });
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => { image.removeAttribute('src'); opener?.focus(); });
})();
