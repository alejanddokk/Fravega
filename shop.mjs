(function registerShop() {
const categories = {
  all: 'Todo',
  audio: 'Audio',
  tv: 'TV y video',
  tecnologia: 'Tecnología',
  cocina: 'Cocina',
  hogar: 'Hogar',
  ofertas: 'Ofertas',
};

const products = [
  { id: 'auriculares', name: 'Auriculares Pulse ANC', category: 'audio', description: 'Sonido envolvente y cancelación activa de ruido para concentrarte en lo que escuchás.', specs: ['Conexión Bluetooth', 'Hasta 35 h de batería', 'Cancelación activa de ruido'], price: 129999, previous: 159999 },
  { id: 'smart-tv', name: 'Smart TV Vision 55″ 4K', category: 'tv', description: 'Una pantalla amplia con contraste definido para disfrutar películas, series y deportes.', specs: ['Pantalla de 55 pulgadas', 'Resolución 4K UHD', 'Wi-Fi y HDMI'], price: 649999, previous: 779999 },
  { id: 'notebook', name: 'Notebook Studio 14″', category: 'tecnologia', description: 'Lista para trabajar, estudiar y crear desde cualquier escritorio.', specs: ['Pantalla de 14 pulgadas', '16 GB de memoria RAM', 'SSD de 512 GB'], price: 879999 },
  { id: 'freidora', name: 'Freidora Air Crisp 5 L', category: 'cocina', description: 'Prepará comidas crocantes con aire caliente y una canasta fácil de limpiar.', specs: ['Capacidad de 5 litros', 'Programas preconfigurados', 'Canasta extraíble'], price: 149999, previous: 189999 },
  { id: 'aspiradora', name: 'Robot aspirador Orbit', category: 'hogar', description: 'Programá la limpieza y dejá que el robot recorra tus ambientes.', specs: ['Sensores anticaídas', 'Base de carga', 'Limpieza programable'], price: 329999 },
  { id: 'celular', name: 'Smartphone Nova 128 GB', category: 'tecnologia', description: 'Pantalla amplia, cámara doble y espacio para fotos, videos y aplicaciones.', specs: ['Pantalla de 6,5 pulgadas', '128 GB de almacenamiento', 'Carga USB-C'], price: 389999, previous: 459999 },
];

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});
const storageKey = 'fravega-encende-demo-v1';
const shippingCost = 4999;
const maxQuantity = 20;
const orderCodePattern = /^FV-[0-9A-F]{12}$/;

function normalize(text) {
  return text.toLocaleLowerCase('es-AR').normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function readStore() {
  try {
    const state = JSON.parse(localStorage.getItem(storageKey) ?? '{}') ?? {};
    const cart = {};
    for (const { id } of products) {
      const quantity = state.cart?.[id];
      if (Number.isInteger(quantity) && quantity > 0) {
        cart[id] = Math.min(quantity, maxQuantity);
      }
    }
    const orders = Array.isArray(state.orders) ? state.orders.filter(order =>
      orderCodePattern.test(order?.code) &&
      ['delivery', 'pickup'].includes(order.method) &&
      Number.isFinite(order.total) && order.total > 0
    ).slice(0, 12) : [];
    return { cart, orders };
  } catch {
    return { cart: {}, orders: [] };
  }
}

function productImage(product, extraClass = '') {
  const index = products.indexOf(product);
  return `<div class="shop-product-image ${extraClass}" style="--image-x: ${index % 3 * 50}%; --image-y: ${Math.floor(index / 3) * 100}%" role="img" aria-label="${product.name}"></div>`;
}

function priceMarkup(product) {
  return `<div class="shop-price">
    ${product.previous ? `<s>${money.format(product.previous)}</s>` : ''}
    <strong>${money.format(product.price)}</strong>
  </div>`;
}

function productCard(product) {
  return `<div class="shop-slot" data-slot="${product.id}"><article class="shop-card">
    <button type="button" class="shop-card-picture" data-shop-action="product" data-product="${product.id}" aria-label="Ver ficha de ${product.name}">
      ${productImage(product)}
      ${product.previous ? `<span class="shop-discount">−${Math.round(100 * (1 - product.price / product.previous))}%</span>` : ''}
    </button>
    <div class="shop-card-info">
      <span class="shop-category-label">${categories[product.category]}</span>
      <h3><button type="button" data-shop-action="product" data-product="${product.id}">${product.name}</button></h3>
      <div class="shop-card-bottom">
        ${priceMarkup(product)}
        <button type="button" class="shop-add" data-shop-action="add" data-product="${product.id}" aria-label="Agregar ${product.name} al carrito"><span aria-hidden="true">+</span></button>
      </div>
    </div>
  </article></div>`;
}

function purchaseSteps(current) {
  const labels = ['Carrito', 'Entrega', 'Confirmación'];
  return `<ol class="shop-cart-steps" aria-label="Pasos de la compra">${labels.map((label, index) =>
    `<li${index === current ? ' aria-current="step"' : ''}>${label}</li>`).join('')}</ol>`;
}

function mountShop() {
  const catalog = document.querySelector('#catalog');
  const dialog = document.querySelector('#app-dialog');
  const search = document.querySelector('#site-search');
  const searchInput = search?.elements.namedItem('q');
  const cartCount = document.querySelector('#cart-count');
  const announcement = document.createElement('p');
  announcement.className = 'shop-sr';
  announcement.setAttribute('role', 'status');
  document.body.append(announcement);

  const state = readStore();
  let category = 'all';
  let query = '';
  let dialogOrigin;
  let featuredTransition;
  let markedPhoto;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  catalog.innerHTML = `<div class="shop-wrap">
    <header class="shop-heading" data-reveal>
      <div>
        <h2 id="shop-heading" tabindex="-1">Encontrá lo tuyo<span>.</span></h2>
        <p>Equipá tu casa, tu trabajo y tu tiempo libre.</p>
      </div>
      <label class="shop-order">Ordenar por
        <select id="shop-sort">
          <option value="featured">Destacados</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </label>
    </header>
    <div class="shop-filters" role="group" aria-label="Filtrar el catálogo" data-reveal>
      ${Object.entries(categories).map(([id, name]) => `<button type="button" data-category="${id}" aria-pressed="${id === 'all'}">${name}</button>`).join('')}
    </div>
    <p class="shop-results" role="status"></p>
    <div class="shop-grid"></div>
    <p class="shop-demo-note">Catálogo de demostración. Precios, promociones y disponibilidad ilustrativos.</p>
  </div>`;

  const heading = catalog.querySelector('#shop-heading');
  const sort = catalog.querySelector('#shop-sort');
  const grid = catalog.querySelector('.shop-grid');
  const results = catalog.querySelector('.shop-results');
  const filters = catalog.querySelector('.shop-filters');
  const template = document.createElement('template');
  template.innerHTML = products.map(productCard).join('');
  const slots = new Map([...template.content.children].map(slot => [slot.dataset.slot, slot]));
  const cardMoves = new Map();

  function stopCardMoves() {
    for (const animation of cardMoves.values()) animation.cancel();
    cardMoves.clear();
  }

  function placeCards(matches) {
    const before = new Map();
    if (!reducedMotion.matches && typeof grid.animate === 'function') {
      for (const slot of grid.querySelectorAll('.shop-slot')) {
        before.set(slot, slot.getBoundingClientRect());
      }
    }
    stopCardMoves();
    const focused = grid.contains(document.activeElement) ? document.activeElement : null;
    const ordered = matches.map(product => slots.get(product.id));
    const keep = new Set(ordered);
    for (const child of [...grid.children]) if (!keep.has(child)) child.remove();

    ordered.forEach((slot, index) => {
      const current = grid.children[index];
      if (current !== slot) grid.insertBefore(slot, current ?? null);
    });
    if (focused && grid.contains(focused) && document.activeElement !== focused) {
      focused.focus({ preventScroll: true });
    }

    // Measure the grid slots. Scroll motion runs on the cards inside them.
    const distances = ordered.filter(slot => before.has(slot)).map(slot => {
      const was = before.get(slot);
      const now = slot.getBoundingClientRect();
      return { slot, x: was.left - now.left, y: was.top - now.top };
    });
    for (const { slot, x, y } of distances) {
      if (Math.abs(x) < 1 && Math.abs(y) < 1) continue;
      const animation = slot.animate([
        { transform: `translate(${x}px, ${y}px)` },
        { transform: `translate(${x * .32}px, ${y * .32 - 20}px)`, offset: .6 },
        { transform: 'none' },
      ], { duration: 650, easing: 'cubic-bezier(.21,.72,.29,1)' });
      cardMoves.set(slot, animation);
      const settle = () => {
        if (cardMoves.get(slot) === animation) cardMoves.delete(slot);
      };
      animation.finished.then(settle, settle);
    }
  }

  function renderCatalog() {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    const matches = products.filter(product => {
      const text = normalize([product.name, categories[product.category], product.description, ...product.specs].join(' '));
      const categoryMatches = category === 'all' || product.category === category ||
        (category === 'ofertas' && product.previous);
      return categoryMatches && words.every(word => text.includes(word));
    });

    if (sort.value === 'price-asc') matches.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-desc') matches.sort((a, b) => b.price - a.price);
    for (const filter of filters.querySelectorAll('[data-category]')) {
      filter.setAttribute('aria-pressed', String(filter.dataset.category === category));
    }
    const countText = matches.length === 1 ? '1 producto' : `${matches.length} productos`;
    results.textContent = query ? `${countText} para “${query}”` : countText;
    if (matches.length) {
      placeCards(matches);
      return;
    }
    stopCardMoves();
    grid.innerHTML = `<div class="shop-empty">
      <h3>No encontramos productos.</h3>
      <p>Probá otra búsqueda o volvé a ver todo el catálogo.</p>
      <button type="button" class="shop-secondary" data-shop-action="reset">Ver todo</button>
    </div>`;
  }

  function visitCatalog() {
    if (location.hash !== '#catalog') history.pushState(null, '', '#catalog');
    heading.focus({ preventScroll: true });
    catalog.scrollIntoView();
  }

  function updateCart() {
    const count = Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
    if (cartCount && cartCount.textContent !== String(count)) {
      cartCount.textContent = String(count);
      if (!reducedMotion.matches) {
        cartCount.getAnimations().forEach(animation => animation.cancel());
        cartCount.animate([{ scale: 1 }, { scale: 1.2, offset: .4 }, { scale: 1 }], 250);
      }
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // A session still works when the browser disables storage.
    }
  }

  function cartSubtotal() {
    return products.reduce((sum, product) => sum + product.price * (state.cart[product.id] ?? 0), 0);
  }

  function showPanel(title, contents, className = '', focus = true) {
    if (className) featuredTransition?.skipTransition();
    const wasOpen = dialog.open;
    if (!wasOpen) dialogOrigin = document.activeElement;
    const isCart = className === 'cart';
    const enteringCart = isCart && (!wasOpen || !dialog.classList.contains('shop-cart-view'));
    dialog.classList.toggle('shop-drawer', Boolean(className));
    dialog.classList.toggle('shop-cart-view', isCart);
    dialog.innerHTML = `<div class="shop-panel">
      <header class="shop-panel-header">
        <h2 id="shop-panel-title" tabindex="-1">${title}</h2>
        <button type="button" class="shop-close" data-shop-action="close" aria-label="Cerrar">×</button>
      </header>
      <div class="shop-panel-body ${enteringCart ? 'shop-cart-enter' : ''}">${contents}</div>
    </div>`;
    dialog.setAttribute('aria-labelledby', 'shop-panel-title');
    if (!wasOpen) dialog.showModal();
    if (focus || !wasOpen) dialog.querySelector('#shop-panel-title').focus({ preventScroll: true });
  }

  function showProduct(product, sourceImage, trigger) {
    showPanel(product.name, `<div class="shop-detail">
      ${sourceImage ? '<div class="shop-campaign-photo"></div>' : productImage(product)}
      <div>
        <p class="shop-category-label">${categories[product.category]}</p>
        <p>${product.description}</p>
        <ul class="shop-specs">${product.specs.map(spec => `<li>${spec}</li>`).join('')}</ul>
        ${priceMarkup(product)}
        <button type="button" class="shop-primary" data-shop-action="add" data-product="${product.id}">Agregar al carrito</button>
        <p class="shop-demo-note">Producto y precio ilustrativos.</p>
      </div>
    </div>`);
    if (trigger) dialogOrigin = trigger;
    if (!sourceImage) return null;

    const photo = document.createElement('img');
    photo.src = sourceImage.currentSrc || sourceImage.src;
    photo.alt = product.name;
    const frame = dialog.querySelector('.shop-campaign-photo');
    frame.append(photo);
    return photo;
  }

  function featuredPhoto(trigger) {
    if (trigger?.dataset.featuredOrigin === 'hero') return document.querySelector('.hero-art img');
    return trigger?.querySelector('img');
  }

  function swapFeaturedPhoto(source, update) {
    featuredTransition?.skipTransition();
    if (reducedMotion.matches || !document.startViewTransition || !source?.naturalWidth) {
      update();
      return;
    }

    const root = document.documentElement;
    root.classList.add('has-featured-transition');
    markedPhoto?.classList.remove('is-featured-frame');
    source.classList.add('is-featured-frame');
    markedPhoto = source;

    // Adapt the skill kit's shared scene transition to the shop's native dialog.
    const transition = document.startViewTransition(() => {
      if (featuredTransition !== transition) return;
      source.classList.remove('is-featured-frame');
      markedPhoto = update();
      markedPhoto?.classList.add('is-featured-frame');
    });
    featuredTransition = transition;
    transition.ready.catch(() => {});
    const settle = () => {
      if (featuredTransition !== transition) return;
      markedPhoto?.classList.remove('is-featured-frame');
      root.classList.remove('has-featured-transition');
      markedPhoto = undefined;
      featuredTransition = undefined;
    };
    transition.finished.then(settle, settle);
  }

  function dismissDialog() {
    const source = dialog.querySelector('.shop-campaign-photo img');
    const destination = featuredPhoto(dialogOrigin);
    if (!source || !destination?.isConnected) {
      dialog.close();
      return;
    }
    swapFeaturedPhoto(source, () => {
      dialog.close();
      return destination;
    });
  }

  function showCart(focus = true) {
    const items = products.filter(product => state.cart[product.id]);
    const units = items.reduce((sum, product) => sum + state.cart[product.id], 0);
    const selection = `<div class="shop-cart-stage">
      <div class="shop-cart-stage-copy">
        <p>Tu selección</p>
        ${purchaseSteps(0)}
      </div>
      <div class="shop-cart-meter"><strong>${String(units).padStart(2, '0')}</strong><span>${units === 1 ? 'unidad' : 'unidades'}</span></div>
    </div>`;
    const contents = items.length ? `<ul class="shop-cart-items">
      ${items.map(product => {
        const quantity = state.cart[product.id];
        return `<li class="shop-cart-item">
          ${productImage(product)}
          <div>
            <h3>${product.name}</h3>
            <p>${money.format(product.price * quantity)}</p>
            <div class="shop-quantity">
              <button type="button" data-shop-action="minus" data-product="${product.id}" aria-label="Reducir cantidad de ${product.name}" ${quantity === 1 ? 'disabled' : ''}>−</button>
              <span>${quantity}</span>
              <button type="button" data-shop-action="plus" data-product="${product.id}" aria-label="Aumentar cantidad de ${product.name}" ${quantity === maxQuantity ? 'disabled' : ''}>+</button>
              <button type="button" class="shop-remove" data-shop-action="remove" data-product="${product.id}" aria-label="Quitar ${product.name}">Quitar</button>
            </div>
          </div>
        </li>`;
      }).join('')}
    </ul>
    <div class="shop-summary">
      <p><span>Subtotal</span><strong>${money.format(cartSubtotal())}</strong></p>
      <button type="button" class="shop-primary" data-shop-action="checkout">Continuar <span aria-hidden="true">↗</span></button>
    </div>` : `<div class="shop-cart-empty">
      <div class="shop-empty-mark" aria-hidden="true"><i class="icon icon-bag"></i><span>+</span></div>
      <h3>Tu carrito está vacío.</h3>
      <p>Explorá el catálogo y elegí lo que querés sumar.</p>
      <button type="button" class="shop-primary" data-shop-action="browse">Explorar catálogo</button>
    </div>`;
    showPanel('Tu carrito', selection + contents, 'cart', focus);
  }

  function showCheckout() {
    const subtotal = cartSubtotal();
    if (!subtotal) {
      showCart();
      return;
    }
    showPanel('Entrega y retiro', `<form class="shop-checkout" data-shop-form="checkout">
      <div class="shop-purchase-progress">${purchaseSteps(1)}</div>
      <p>Estás probando una compra de demostración. La confirmación se guarda en este navegador.</p>
      <fieldset><legend>¿Cómo querés recibir tu compra?</legend>
        <label><input type="radio" name="method" value="pickup" checked> Retiro de prueba <strong>Gratis</strong></label>
        <label><input type="radio" name="method" value="delivery"> Envío de prueba <strong>${money.format(shippingCost)}</strong></label>
      </fieldset>
      <div class="shop-summary">
        <p><span>Total</span><strong><output name="total">${money.format(subtotal)}</output></strong></p>
        <button class="shop-primary">Confirmar pedido de prueba</button>
        <button type="button" class="shop-secondary" data-shop-action="cart">Volver al carrito</button>
      </div>
    </form>`, 'drawer');
  }

  function showConfirmation({ code, method, total }) {
    const receiptMethod = method === 'delivery' ? 'Envío de prueba' : 'Retiro de prueba';
    showPanel('Pedido de prueba confirmado', `<div class="shop-purchase-progress">${purchaseSteps(2)}</div><div class="shop-order-code">
      <span>Código de seguimiento</span><strong>${code}</strong>
    </div>
    <p>${receiptMethod} · ${money.format(total)}</p>
    <button type="button" class="shop-primary" data-shop-action="tracking">Ver seguimiento de prueba</button>`, 'drawer');
  }

  function showTracking() {
    showPanel('Seguí tu compra', `<p>Consultá el estado de un pedido de prueba guardado en este navegador.</p>
    <form class="shop-tracking" data-shop-form="tracking">
      <label for="shop-order-code">Código del pedido de prueba</label>
      <input id="shop-order-code" name="code" placeholder="FV-…" value="${state.orders[0]?.code ?? ''}" maxlength="15" required>
      <button class="shop-primary">Consultar pedido</button>
      <p class="shop-tracking-result" role="status"></p>
    </form>
    <a class="shop-text-link" href="https://www.fravega.com/mi-cuenta/mis-compras">Consultar en el sitio oficial de Frávega ↗</a>`, 'drawer');
  }

  function showService(type) {
    if (type === 'account') {
      showPanel('Mi cuenta', `<p>Revisá tus compras y los datos de tu cuenta desde el sitio oficial de Frávega.</p>
      <a class="shop-primary" href="https://www.fravega.com/mi-cuenta/mis-compras">Ir a Mi cuenta en Frávega ↗</a>
      <button type="button" class="shop-secondary" data-shop-action="tracking">Seguir un pedido de prueba</button>`, 'drawer');
      return;
    }
    showPanel('Centro de ayuda', `<p>Consultá con Frávega sobre entregas, cambios, medios de pago o garantía.</p>
    <ul class="shop-service-links">
      <li><a href="https://www.fravega.com/centro-de-ayuda">Centro de ayuda oficial ↗</a></li>
      <li><a href="https://www.fravega.com/sucursales/">Sucursales de Frávega ↗</a></li>
      <li><a href="https://www.fravega.com/servicio-tecnico">Servicio técnico oficial ↗</a></li>
    </ul>`, 'drawer');
  }

  function changeQuantity(action, product) {
    const quantity = state.cart[product.id] ?? 0;
    if (action === 'add' || action === 'plus') {
      if (quantity === maxQuantity) {
        announcement.textContent = 'Llegaste al máximo de unidades para este producto.';
        return;
      }
      state.cart[product.id] = quantity + 1;
    } else if (action === 'minus' && quantity > 1) {
      state.cart[product.id] = quantity - 1;
    } else if (action === 'remove') {
      delete state.cart[product.id];
    }
    updateCart();
    if (action === 'add') {
      showCart();
      announcement.textContent = `${product.name} agregado al carrito.`;
      return;
    }
    showCart(false);
    const restored = dialog.querySelector(`[data-shop-action="${action}"][data-product="${product.id}"]:not(:disabled)`);
    (restored ?? dialog.querySelector('#shop-panel-title')).focus({ preventScroll: true });
  }

  const panels = new Map([
    ['cart', showCart],
    ['tracking', showTracking],
    ['account', () => showService('account')],
    ['help', () => showService('help')],
  ]);

  document.addEventListener('click', event => {
    const control = event.target.closest('[data-category], [data-open], [data-shop-action], [data-featured-product]');
    if (!control) return;
    if (control.dataset.featuredProduct) {
      const product = products.find(item => item.id === control.dataset.featuredProduct);
      const source = featuredPhoto(control);
      if (product) swapFeaturedPhoto(source, () => showProduct(product, source, control));
      return;
    }
    if (Object.hasOwn(categories, control.dataset.category)) {
      if (control.matches('a') && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
      event.preventDefault();
      category = control.dataset.category;
      if (!filters.contains(control)) {
        query = '';
        if (searchInput) searchInput.value = '';
        renderCatalog();
        visitCatalog();
        return;
      }
      renderCatalog();
      return;
    }

    const action = control.dataset.shopAction ?? control.dataset.open;
    if (panels.has(action)) {
      event.preventDefault();
      panels.get(action)();
      return;
    }
    const product = products.find(item => item.id === control.dataset.product);
    if (action === 'product' && product) showProduct(product);
    if (['add', 'plus', 'minus', 'remove'].includes(action) && product) changeQuantity(action, product);
    if (action === 'checkout') showCheckout();
    if (action === 'close') dismissDialog();
    if (action === 'browse') {
      dialog.close();
      dialogOrigin = null;
      visitCatalog();
    }
    if (action === 'reset') {
      category = 'all';
      query = '';
      if (searchInput) searchInput.value = '';
      renderCatalog();
      heading.focus();
    }
  });

  search?.addEventListener('submit', event => {
    event.preventDefault();
    query = searchInput.value.trim();
    category = 'all';
    renderCatalog();
    visitCatalog();
  });
  sort.addEventListener('change', renderCatalog);

  dialog.addEventListener('cancel', event => {
    if (!dialog.querySelector('.shop-campaign-photo')) return;
    event.preventDefault();
    dismissDialog();
  });
  dialog.addEventListener('close', () => {
    if (dialogOrigin?.isConnected) dialogOrigin.focus({ preventScroll: true });
    dialogOrigin = null;
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      featuredTransition?.skipTransition();
      stopCardMoves();
    }
  });
  dialog.addEventListener('change', event => {
    const form = event.target.closest('[data-shop-form="checkout"]');
    if (!form) return;
    const fee = form.elements.method.value === 'delivery' ? shippingCost : 0;
    form.elements.total.value = money.format(cartSubtotal() + fee);
  });
  dialog.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    if (form.dataset.shopForm === 'tracking') {
      const code = form.elements.code.value.trim().toUpperCase();
      const order = state.orders.find(candidate => candidate.code === code);
      form.querySelector('.shop-tracking-result').textContent = order
        ? `Pedido de prueba confirmado · ${order.method === 'pickup' ? 'Retiro' : 'Envío'} · ${money.format(order.total)}`
        : 'No encontramos ese pedido de prueba en este navegador.';
    }
    if (form.dataset.shopForm === 'checkout' && cartSubtotal()) {
      const method = form.elements.method.value;
      const code = 'FV-' + Array.from(crypto.getRandomValues(new Uint8Array(6)), byte =>
        byte.toString(16).padStart(2, '0')
      ).join('').toUpperCase();
      const total = cartSubtotal() + (method === 'delivery' ? shippingCost : 0);
      const order = { code, method, total };
      state.orders = [order, ...state.orders].slice(0, 12);
      state.cart = {};
      updateCart();
      showConfirmation(order);
    }
  });

  renderCatalog();
  updateCart();
}

(window.Fravega ??= {}).mountShop = mountShop;
})();
