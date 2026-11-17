(function registerMotion() {
function mountSelectionIndicator(group) {
  const marker = document.createElement('span');
  marker.className = 'motion-selection-marker';
  marker.setAttribute('aria-hidden', 'true');
  group.prepend(marker);

  function syncSelection() {
    const selected = group.querySelector('button[aria-pressed="true"]');
    if (!selected) return;
    marker.style.setProperty('--selection-x', `${selected.offsetLeft}px`);
    marker.style.setProperty('--selection-y', `${selected.offsetTop}px`);
    marker.style.setProperty('--selection-width', `${selected.offsetWidth}px`);
    marker.style.setProperty('--selection-height', `${selected.offsetHeight}px`);
    group.dataset.motionReady = '';
  }

  syncSelection();
  const changes = new MutationObserver(syncSelection);
  changes.observe(group, { attributes: true, attributeFilter: ['aria-pressed'], subtree: true });
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(syncSelection);
    resize.observe(group);
    for (const button of group.querySelectorAll('button')) resize.observe(button);
  } else {
    window.addEventListener('resize', syncSelection, { passive: true });
  }
}

function mountMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('[data-hero]');
  const targets = document.querySelectorAll('[data-reveal], [data-stagger]');
  const replay = hero.querySelector('[data-replay-hero]');
  document.querySelectorAll('[data-motion-selection]').forEach(mountSelectionIndicator);

  function playHero() {
    if (hero.classList.contains('is-playing')) {
      hero.classList.remove('is-playing');
      // Commit the rest pose before restarting an interrupted replay.
      void hero.offsetWidth;
    }
    hero.classList.add('is-playing');
  }

  replay.hidden = false;
  replay.addEventListener('click', playHero);
  hero.addEventListener('animationend', (event) => {
    if (['hero-orbit-fade', 'hero-replay-quiet'].includes(event.animationName)) {
      hero.classList.remove('is-playing');
    }
  });
  if (!reduced.matches && window.scrollY < hero.offsetTop + hero.offsetHeight) playHero();

  // Adopt the kit's first-sample behavior so already-visible content starts in place.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const sampled = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          if (sampled.has(target) && !reduced.matches && !target.contains(document.activeElement)) {
            target.classList.add('is-revealed');
          }
          observer.unobserve(target);
        }
        sampled.add(target);
      }
    }, { rootMargin: '0px 0px -3% 0px' });

    for (const element of targets) {
      if (element.hasAttribute('data-stagger')) {
        [...element.children].forEach((child, index) => child.style.setProperty('--stagger-index', index));
      }
      observer.observe(element);
    }
  }

  let frame = 0;
  function clearDepth() {
    cancelAnimationFrame(frame);
    frame = 0;
    hero.style.removeProperty('--hero-x');
    hero.style.removeProperty('--hero-y');
    hero.style.removeProperty('--hero-light-x');
    hero.style.removeProperty('--hero-light-y');
  }

  hero.addEventListener('pointermove', (event) => {
    if (reduced.matches || !precisePointer.matches || event.pointerType !== 'mouse') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = hero.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      hero.style.setProperty('--hero-x', `${x * 18}px`);
      hero.style.setProperty('--hero-y', `${y * 12}px`);
      hero.style.setProperty('--hero-light-x', `${x * 175}px`);
      hero.style.setProperty('--hero-light-y', `${y * 145}px`);
      frame = 0;
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', clearDepth);
  hero.addEventListener('pointercancel', clearDepth);
  reduced.addEventListener('change', clearDepth);
  reduced.addEventListener('change', () => hero.classList.remove('is-playing'));
  precisePointer.addEventListener('change', clearDepth);
}

(window.Fravega ??= {}).mountMotion = mountMotion;
})();
