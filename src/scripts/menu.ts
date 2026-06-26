/* =============================================================================
   jaecoo-base · Header enhancement (opsional)
   Hamburger sudah berfungsi tanpa JS (<details>). Di sini hanya:
   - tutup menu saat klik link atau tekan Escape
   - kunci scroll saat menu terbuka
   - bayangan header saat halaman di-scroll
   ============================================================================ */
const mnav = document.querySelector<HTMLDetailsElement>('[data-mobile-nav]');
if (mnav) {
  const close = () => (mnav.open = false);
  mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mnav.open) close();
  });
  mnav.addEventListener('toggle', () => {
    document.body.style.overflow = mnav.open ? 'hidden' : '';
  });
}

const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
