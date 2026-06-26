/* =============================================================================
   jaecoo-base · scroll-reveal (progressive enhancement)
   Konten TIDAK pernah disembunyikan tanpa JS (CSS hanya menyembunyikan di .js).
   Di sini kita tampilkan kembali via IntersectionObserver. Hormati reduced-motion.
   ============================================================================ */
const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!els.length) {
  /* tidak ada yang perlu di-reveal */
} else if (reduce || !('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  els.forEach((el) => io.observe(el));
}
