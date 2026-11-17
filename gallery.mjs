(function registerGallery() {
const scenes = [
  {
    id: 'audio', label: 'Audio', product: 'auriculares', name: 'Auriculares Pulse ANC',
    headline: 'Subí el volumen.', description: 'Poné tu música en primer plano con cancelación activa de ruido.',
    image: 'assets/hero.jpg', width: 1536, height: 1024,
  },
  {
    id: 'tv', label: 'TV y video', product: 'smart-tv', name: 'Smart TV Vision 55″ 4K',
    headline: 'Hacé lugar al cine.', description: 'Armá una noche de películas con una pantalla de 55 pulgadas.',
    image: 'assets/scene-tv.jpg', width: 1448, height: 1086,
  },
  {
    id: 'kitchen', label: 'Cocina', product: 'freidora', name: 'Freidora Air Crisp 5 L',
    headline: 'Cociná algo distinto.', description: 'Prepará algo crocante con aire caliente y una canasta de 5 litros.',
    image: 'assets/scene-kitchen.jpg', width: 1448, height: 1086,
  },
];

function mountGallery() {
  const gallery = document.querySelector('#experiencia');
  if (!gallery) return;

  gallery.innerHTML = `
    <div class="wrap gallery-layout" data-reveal>
      <div class="gallery-intro">
        <h2 id="gallery-title">Elegí tu <br>momento<span>.</span></h2>
        <div class="gallery-description" aria-live="polite" aria-atomic="true"></div>
      </div>
      <div class="gallery-stage">
        ${scenes.map(({ id, product, name, image, width, height }) => `
          <button type="button" class="gallery-card" data-gallery-card="${id}"
              data-featured-product="${product}" aria-label="Ver ficha de ${name}">
            <img src="${image}" alt="" loading="lazy" decoding="async" width="${width}" height="${height}">
            <span class="gallery-card-caption"><strong>${name}</strong><span class="gallery-card-open">Ver ficha <span aria-hidden="true">↗</span></span></span>
          </button>`).join('')}
      </div>
      <div class="gallery-controls">
        <div class="gallery-choices" role="group" aria-label="Elegir escena">
          ${scenes.map(({ label }, index) => `<button type="button" data-gallery-select="${index}" aria-pressed="false">${label}</button>`).join('')}
        </div>
        <div class="gallery-arrows" role="group" aria-label="Recorrer escenas">
          <button type="button" data-gallery-step="-1" aria-label="Escena anterior">←</button>
          <button type="button" data-gallery-step="1" aria-label="Escena siguiente">→</button>
        </div>
      </div>
    </div>`;

  const stage = gallery.querySelector('.gallery-stage');
  const description = gallery.querySelector('.gallery-description');
  const choices = [...gallery.querySelectorAll('[data-gallery-select]')];
  const frames = [...stage.querySelectorAll('[data-gallery-card]')];
  let current = -1;

  function select(index) {
    const next = (index + scenes.length) % scenes.length;
    if (next === current) return;
    const { id, headline, description: details } = scenes[next];
    gallery.dataset.scene = id;
    description.innerHTML = `<div><p class="gallery-headline">${headline}</p><p>${details}</p></div>`;

    for (const [position, card] of frames.entries()) {
      const depth = (position - next + scenes.length) % scenes.length;
      card.dataset.depth = depth;
      card.disabled = depth !== 0;
      card.setAttribute('aria-hidden', String(depth !== 0));
      choices[position].setAttribute('aria-pressed', String(depth === 0));
    }
    current = next;
  }

  select(0);
  gallery.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-gallery-select]');
    const arrow = event.target.closest('[data-gallery-step]');
    if (choice) select(Number(choice.dataset.gallerySelect));
    if (arrow) select(current + Number(arrow.dataset.galleryStep));
  });

  gallery.addEventListener('keydown', (event) => {
    if (!event.target.matches('[data-gallery-select]')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    select(current + (event.key === 'ArrowRight' ? 1 : -1));
    choices[current].focus();
  });

  // Pan vertical remains in the browser. A horizontal swipe releases the product action.
  let gesture;
  let swipedCard;
  let swipeTime = 0;
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' && event.isPrimary) {
      gesture = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    }
  });
  stage.addEventListener('pointerup', (event) => {
    if (event.pointerId !== gesture?.pointerId) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.abs(x) < 45 || Math.abs(x) < 1.35 * Math.abs(y)) return;
    swipedCard = frames[current];
    swipeTime = performance.now();
    select(current + (x < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { gesture = undefined; });
  stage.addEventListener('click', (event) => {
    if (event.detail && swipedCard?.contains(event.target) && performance.now() - swipeTime < 400) {
      event.preventDefault();
      event.stopPropagation();
    }
    swipedCard = undefined;
  }, { capture: true });
}

(window.Fravega ??= {}).mountGallery = mountGallery;
})();
