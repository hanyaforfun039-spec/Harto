/* carousel.ts — HeroCarousel Harto: auto-advance + manual (panah/titik) +
   sinkron saat swipe. Hormati prefers-reduced-motion (tanpa auto-slide). */
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const INTERVAL = 5000;

document.querySelectorAll<HTMLElement>('[data-hcar]').forEach((root) => {
  const track = root.querySelector<HTMLElement>('[data-hcar-track]');
  if (!track) return;
  const slides = Array.from(track.children) as HTMLElement[];
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-hcar-dot]'));
  const prev = root.querySelector<HTMLButtonElement>('[data-hcar-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-hcar-next]');
  if (slides.length < 2) return;

  let idx = 0;
  let timer: number | undefined;

  const setActive = (i: number) => {
    idx = i;
    dots.forEach((d, di) => {
      d.classList.toggle('is-active', di === i);
      d.setAttribute('aria-selected', di === i ? 'true' : 'false');
    });
  };

  const goTo = (i: number) => {
    const n = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[n].offsetLeft, behavior: REDUCE ? 'auto' : 'smooth' });
    setActive(n);
  };

  const stop = () => { if (timer) { clearInterval(timer); timer = undefined; } };
  const start = () => {
    if (REDUCE) return;
    stop();
    timer = window.setInterval(() => goTo(idx + 1), INTERVAL);
  };

  prev?.addEventListener('click', () => { goTo(idx - 1); start(); });
  next?.addEventListener('click', () => { goTo(idx + 1); start(); });
  dots.forEach((d, di) => d.addEventListener('click', () => { goTo(di); start(); }));

  // Sinkron indikator saat user swipe/scroll manual
  let scrollT: number | undefined;
  track.addEventListener('scroll', () => {
    if (scrollT) clearTimeout(scrollT);
    scrollT = window.setTimeout(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      setActive(Math.max(0, Math.min(slides.length - 1, i)));
    }, 90);
  }, { passive: true });

  // Jeda saat hover/fokus (biar tidak geser pas user baca)
  root.addEventListener('pointerenter', stop);
  root.addEventListener('pointerleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  setActive(0);
  start();
});
