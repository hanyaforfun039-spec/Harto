/* =============================================================================
   jaecoo-base · CreditCalculator (client)
   Membaca data dari DOM (data-* + <option data-otr>), menghitung ulang real-time,
   dan memperbarui link WhatsApp. Memakai helper yang sama dengan server (1 sumber).
   ============================================================================ */
import { hitungCicilan } from '../lib/credit';
import { formatRupiah } from '../lib/format';
import { pesanSimulasiKredit, waLink } from '../lib/whatsapp';
import type { SiteConfig } from '../lib/types';

document.querySelectorAll<HTMLElement>('[data-calculator]').forEach((root) => {
  const wa = root.dataset.wa ?? '';
  const bunga = parseFloat(root.dataset.bunga ?? '0');
  const sales = root.dataset.sales ?? '';

  const model = root.querySelector<HTMLSelectElement>('.calc-model');
  const dpInput = root.querySelector<HTMLInputElement>('.calc-dp');
  const tenorInput = root.querySelector<HTMLInputElement>('.calc-tenor');
  const waBtn = root.querySelector<HTMLAnchorElement>('.calc-wa');
  if (!model || !dpInput || !tenorInput) return;

  const set = (sel: string, val: string) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = val;
  };

  const render = () => {
    const opt = model.options[model.selectedIndex];
    const otr = parseInt(opt.dataset.otr ?? '0', 10);
    const nama = opt.dataset.nama ?? '';
    const dpPct = parseInt(dpInput.value, 10);
    const tenorYears = parseInt(tenorInput.value, 10);
    const r = hitungCicilan({ otr, dpPct, tenorYears, bungaFlatPctPerYear: bunga });

    set('.calc-dp-out', `${dpPct}%`);
    set('.calc-tenor-out', `${tenorYears} tahun`);
    set('.calc-dp-pct', String(dpPct));
    set('.calc-cicilan', formatRupiah(r.cicilanPerBulan));
    set('.calc-otr', formatRupiah(otr));
    set('.calc-dpamount', formatRupiah(r.dp));
    set('.calc-pokok', formatRupiah(r.pokok));
    set('.calc-tenor-months', `${r.tenorMonths} bln`);

    if (waBtn) {
      const msg = pesanSimulasiKredit({ salesName: sales } as SiteConfig, nama, r);
      waBtn.href = waLink(wa, msg);
    }
  };

  model.addEventListener('change', render);
  dpInput.addEventListener('input', render);
  tenorInput.addEventListener('input', render);
  render();
});
