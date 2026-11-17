export function mountMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('[data-hero]');
  const targets = document.querySelectorAll('[data-reveal], [data-stagger]');

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
  }

  hero.addEventListener('pointermove', (event) => {
    if (reduced.matches || !precisePointer.matches || event.pointerType !== 'mouse') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = hero.getBoundingClientRect();
      hero.style.setProperty('--hero-x', `${((event.clientX - box.left) / box.width - .5) * 18}px`);
      hero.style.setProperty('--hero-y', `${((event.clientY - box.top) / box.height - .5) * 12}px`);
      frame = 0;
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', clearDepth);
  hero.addEventListener('pointercancel', clearDepth);
  reduced.addEventListener('change', clearDepth);
  precisePointer.addEventListener('change', clearDepth);
}
