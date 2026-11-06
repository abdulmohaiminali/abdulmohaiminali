// Keep the original wave and spacing, but rasterize only the visible footer slice.
export function mountFooterSlats(canvas) {
  const footer = canvas.closest('.micro-footer');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx || !footer) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false, suspended = false, raf = 0, last = 0, nextFrame = 0, time = 0;
  let dirty = true, rect, width = 0, height = 0, offset = 0, dpr = 1;
  const pointer = { x: -1000, y: -1000 };

  const measure = () => {
    rect = footer.getBoundingClientRect();
    width = Math.max(1, rect.width);
    offset = Math.max(0, Math.floor(-rect.top - 24));
    height = Math.max(1, Math.min(rect.height - offset, window.innerHeight + 48));
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const pixelsW = Math.round(width * dpr), pixelsH = Math.round(height * dpr);
    if (canvas.width !== pixelsW || canvas.height !== pixelsH) {
      canvas.width = pixelsW;
      canvas.height = pixelsH;
    }
    canvas.style.top = `${offset}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirty = false;
  };
  const paint = () => {
    ctx.clearRect(0, 0, width, height);
    const cols = Math.ceil(width / 22) + 1;
    const firstRow = Math.max(0, Math.floor((offset - 12) / 24));
    const lastRow = Math.min(Math.ceil(rect.height / 24), Math.ceil((offset + height + 24) / 24));
    const pointerX = pointer.x - rect.left, pointerY = pointer.y - rect.top;
    const radiusX = Math.max(width * .13, 1), radiusY = Math.max(rect.height * .3, 1);
    for (let row = firstRow; row <= lastRow; row++) for (let col = 0; col < cols; col++) {
      const x = col * 22 - 11, y = row * 24 - 12;
      const wave = Math.sin(x * .009 + y * .014 - time) + .42 * Math.sin(x * .016 - y * .008 + time * .7);
      const dx = (x - pointerX) / radiusX, dy = (y - pointerY) / radiusY;
      const touch = pointer.x < 0 ? 0 : Math.exp(-(dx * dx + dy * dy) * 1.7);
      const crest = Math.max(0, Math.min(1, .48 + .34 * wave + .2 * touch));
      const barH = 7 + crest * 15;
      const angle = Math.sin(wave + col * .08) * .12;
      const cos = Math.cos(angle) * dpr, sin = Math.sin(angle) * dpr;
      ctx.setTransform(cos, sin, -sin, cos, x * dpr, (y - offset) * dpr);
      ctx.globalAlpha = .045 + crest * crest * .19;
      ctx.fillStyle = crest > .76 ? '#ffffff' : '#00bf63';
      ctx.beginPath();ctx.roundRect(-5.5, -barH / 2, 11, barH, 5.5);ctx.fill();
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
  };
  const canRun = () => visible && !suspended && !document.hidden;
  const frame = now => {
    raf = 0;
    if (!canRun()) return;
    if (!motion.matches && now < nextFrame - .5) { start();return; }
    if (dirty) measure();
    if (!motion.matches && last) time += Math.min(now - last, 100) * .00054;
    last = now;
    nextFrame = Math.max(nextFrame + 1000 / 30, now);
    paint();
    if (!motion.matches) start();
  };
  const start = () => {
    if (canRun() && !raf) raf = requestAnimationFrame(frame);
  };
  const stop = () => { cancelAnimationFrame(raf);raf = 0;last = 0;nextFrame = 0; };
  const invalidate = () => { dirty = true;start(); };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) invalidate();else stop();
  });
  const resizeObserver = new ResizeObserver(invalidate);
  observer.observe(footer);
  resizeObserver.observe(footer);
  // Pointer events only record coordinates; no synchronous layout on mouse movement.
  footer.addEventListener('pointermove', event => {
    pointer.x = event.clientX;pointer.y = event.clientY;
    if (!motion.matches) start();
  }, { passive: true });
  footer.addEventListener('pointerleave', () => { pointer.x = -1000;pointer.y = -1000; });
  window.addEventListener('scroll', invalidate, { passive: true });
  window.addEventListener('resize', invalidate, { passive: true });
  motion.addEventListener('change', () => { stop();invalidate(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();else invalidate();
  });
  // Keep observers for a back/forward-cache restore; do not permanently disable the effect.
  window.addEventListener('pagehide', () => { suspended = true;stop(); });
  window.addEventListener('pageshow', () => { suspended = false;invalidate(); });
}
