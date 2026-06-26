/* =============================================================================
   jaecoo-base · TestDriveForm (client)
   Submit -> validasi native -> susun pesan (helper sama dgn server) -> buka wa.me.
   ============================================================================ */
import { pesanTestDrive, waLink } from '../lib/whatsapp';
import type { SiteConfig } from '../lib/types';

document.querySelectorAll<HTMLFormElement>('[data-td-form]').forEach((form) => {
  const wa = form.dataset.wa ?? '';
  const sales = form.dataset.sales ?? '';
  const area = form.dataset.area ?? '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const nama = String(data.get('nama') ?? '');
    const mobil = String(data.get('mobil') ?? '');
    const rencana = String(data.get('rencana') ?? '');
    const bayar = String(data.get('bayar') ?? '');

    // Reuse helper server (1 sumber format) via site parsial.
    const siteLike = { salesName: sales, address: { locality: area } } as unknown as SiteConfig;
    const msg = pesanTestDrive(siteLike, { nama, mobil, rencana, bayar });
    const url = waLink(wa, msg);

    window.open(url, '_blank', 'noopener') ?? (window.location.href = url);
  });
});
