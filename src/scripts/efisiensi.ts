/* efisiensi.ts — kalkulator efisiensi (Web2 "Harto") client.
   Baca input dari DOM → hitung ulang via lib/efisiensi (helper sama dgn server)
   → perbarui angka, bar/meter, dan link WhatsApp. Progressive enhancement:
   tanpa JS angka default tetap ter-render. */
import { hitungEfisiensi } from '../lib/efisiensi';
import { formatRupiah, formatRupiahShort } from '../lib/format';
import { pesanEfisiensi, waLink } from '../lib/whatsapp';
import type { SiteConfig } from '../lib/types';

const root = document.querySelector<HTMLElement>('[data-efisiensi]');

if (root) {
  const wa = root.dataset.wa ?? '';
  const sales = root.dataset.sales ?? '';
  const rangeMax = Number(root.dataset.rangeMax) || 1;

  const model = root.querySelector<HTMLSelectElement>('[data-eff-model]');
  const km = root.querySelector<HTMLInputElement>('[data-eff-km]');
  const bbm = root.querySelector<HTMLInputElement>('[data-eff-bbm]');
  const baseline = root.querySelector<HTMLSelectElement>('[data-eff-baseline]');
  const baselineCustom = root.querySelector<HTMLInputElement>('[data-eff-baseline-custom]');
  const waBtn = root.querySelector<HTMLAnchorElement>('[data-eff-wa]');

  const set = (sel: string, val: string) => {
    const el = root.querySelector<HTMLElement>(sel);
    if (el) el.textContent = val;
  };
  const setW = (sel: string, pct: number) => {
    const el = root.querySelector<HTMLElement>(sel);
    if (el) el.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  };

  const render = () => {
    if (!model || !km || !bbm) return;
    const opt = model.options[model.selectedIndex];
    const modelKmpl = Number(opt.dataset.kmpl) || 0;
    const rangeKm = Number(opt.dataset.range) || 0;
    const nama = opt.dataset.nama ?? '';
    const kmPerMonth = Number(km.value) || 0;
    const bbmPerLiter = Number(bbm.value) || 0;
    const customKmpl = Number(baselineCustom?.value);
    const baselineKmpl =
      baselineCustom?.value && customKmpl > 0 ? customKmpl : Number(baseline?.value) || 0;

    const r = hitungEfisiensi({ kmPerMonth, bbmPerLiter, baselineKmpl, modelKmpl, rangeKm });

    set('[data-eff-km-out]', kmPerMonth.toLocaleString('id-ID'));
    set('[data-eff-range]', rangeKm.toLocaleString('id-ID'));
    setW('[data-eff-range-bar]', (rangeKm / rangeMax) * 100);

    const costMax = Math.max(r.biayaLamaPerBulan, r.biayaJaecooPerBulan, 1);
    set('[data-eff-cost-jaecoo]', formatRupiahShort(r.biayaJaecooPerBulan));
    set('[data-eff-cost-lama]', formatRupiahShort(r.biayaLamaPerBulan));
    setW('[data-eff-bar-jaecoo]', (r.biayaJaecooPerBulan / costMax) * 100);
    setW('[data-eff-bar-lama]', (r.biayaLamaPerBulan / costMax) * 100);

    set('[data-eff-hemat-bln]', formatRupiah(r.hematPerBulan));
    set('[data-eff-hemat-thn]', formatRupiah(r.hematPerTahun));
    set('[data-eff-perkm]', `${formatRupiah(r.biayaPerKmJaecoo)}/km`);

    const nameEl = root.querySelector<HTMLElement>('.eff-bar-name');
    if (nameEl) nameEl.textContent = `JAECOO ${opt.textContent ?? ''}`.trim();

    if (waBtn) {
      const msg = pesanEfisiensi({ salesName: sales, address: { locality: '' } } as SiteConfig, nama, r);
      waBtn.href = waLink(wa, msg);
    }
  };

  model?.addEventListener('change', render);
  km?.addEventListener('input', render);
  bbm?.addEventListener('input', render);
  baseline?.addEventListener('change', render);
  baselineCustom?.addEventListener('input', render);
  render();
}
