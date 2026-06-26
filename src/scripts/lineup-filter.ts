/* =============================================================================
   jaecoo-base · Lineup filter (enhancement)
   Chips "Semua / J8 / J7 / J5" menyaring kartu mobil per lini model.
   Progressive enhancement: toolbar hanya tampil bila <html class="js"> (lihat
   index.astro). Tanpa JS, semua kartu tetap terlihat.
   ============================================================================ */
document.querySelectorAll<HTMLElement>('[data-lineup-filter]').forEach((bar) => {
  const wrap = bar.parentElement?.querySelector<HTMLElement>('[data-lineup]');
  if (!wrap) return;

  const chips = Array.from(bar.querySelectorAll<HTMLButtonElement>('.chip-filter'));
  const cards = Array.from(wrap.children) as HTMLElement[];

  const apply = (filter: string) => {
    cards.forEach((card) => {
      const fam = card.dataset.family ?? '';
      const show = filter === 'all' || fam === filter;
      card.classList.toggle('is-hidden', !show);
      // kartu yang ditampilkan dipastikan keluar dari state scroll-reveal
      if (show) card.classList.add('is-visible');
    });
    // balik ke awal saat ganti filter (penting untuk baris geser di HP)
    wrap.scrollTo({ left: 0, behavior: 'auto' });
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      apply(chip.dataset.filter ?? 'all');
    });
  });
});
