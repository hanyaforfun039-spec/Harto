/* =============================================================================
   jaecoo-base · PromoStrip countdown (enhancement)
   Tanpa JS tetap menampilkan tanggal berakhir. Dengan JS -> sisa waktu live.
   ============================================================================ */
document.querySelectorAll<HTMLElement>('[data-countdown]').forEach((root) => {
  const iso = root.dataset.deadline;
  const out = root.querySelector('.promo-count-static');
  const label = root.querySelector('.promo-count-label');
  if (!iso || !out) return;

  const end = new Date(iso).getTime();

  const tick = () => {
    const diff = end - Date.now();
    if (diff <= 0) {
      if (label) label.textContent = '';
      out.textContent = 'Promo telah berakhir';
      window.clearInterval(id);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (label) label.textContent = 'Sisa waktu';
    out.textContent = `${d} hari ${h} jam ${m} menit`;
  };

  const id = window.setInterval(tick, 60000);
  tick();
});
