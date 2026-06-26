/* =============================================================================
   jaecoo-base · HARTO FAQ (Web2 hybrid/efisiensi)
   FAQ long-tail ber-INTENT EFISIENSI per model — DILAPIS di atas car.faq
   (cars.json tetap utuh & tak ter-fork). Beda dari web kredit/generik.
   Dipakai untuk tampilan + FAQPage JSON-LD. Angka tarik dari site.efisiensi.
   ============================================================================ */
import type { Car, CarFaq, SiteConfig } from './types';
import { efisiensiModel, estimasiEfisiensiDefault } from './efisiensi';
import { formatRupiahShort } from './format';

/** FAQ efisiensi spesifik powertrain + model (untuk halaman /mobil/[slug]). */
export function efisiensiFaq(car: Car, site: SiteConfig): CarFaq[] {
  const m = efisiensiModel(site, car.slug);
  const r = m ? estimasiEfisiensiDefault(site, car.slug) : null;
  const km = site.efisiensi?.kmDefault.toLocaleString('id-ID') ?? '[…]';
  const range = m ? m.rangeKm.toLocaleString('id-ID') : '[…]';
  const kmpl = m ? m.kmpl : '[…]';
  const np = car.namaPendek;
  const out: CarFaq[] = [];

  if (car.powertrain === 'ev') {
    out.push(
      {
        q: `Berapa jarak tempuh ${np} EV sekali isi?`,
        a: `${np} dapat menempuh sekitar ${range} km sekali pengisian penuh (estimasi; angka resmi mengikuti data pabrikan). Lebih dari cukup untuk mobilitas harian di ${site.address.locality} dan sekitarnya.`,
      },
      {
        q: `Apakah ${np} EV perlu charger di rumah?`,
        a: `Tidak wajib — ${np} bisa diisi di stasiun pengisian umum dan pengisian cepat DC — namun home charger membuat pengisian harian lebih praktis dan murah. Kami bantu jelaskan opsi yang sesuai kebutuhan Anda.`,
      },
      {
        q: `Lebih hemat mana, mobil listrik atau bensin?`,
        a: `Biaya energi mobil listrik umumnya jauh di bawah BBM. Pada pemakaian ${km} km/bulan, estimasi penghematan hingga ${r ? formatRupiahShort(r.hematPerTahun) : '[…]'} per tahun dibanding SUV bensin biasa. Hitung sesuai pemakaian Anda di kalkulator efisiensi.`,
      },
    );
  } else if (car.powertrain === 'phev') {
    out.push(
      {
        q: `Berapa konsumsi BBM ${np}?`,
        a: `Sebagai hybrid plug-in (SHS), ${np} dapat berjalan penuh listrik untuk harian dan memakai bensin untuk jarak jauh — konsumsi gabungan sangat rendah, setara ±${kmpl} km/L. Angka pasti mengikuti data resmi dan gaya berkendara.`,
      },
      {
        q: `Berapa jangkauan ${np} sekali isi penuh?`,
        a: `Gabungan bensin dan listrik memberi jangkauan sekitar ${range} km — cukup untuk perjalanan lintas kota tanpa cemas berhenti mengisi daya.`,
      },
      {
        q: `Berapa hemat biaya bensin per bulan dengan ${np}?`,
        a: `Pada pemakaian ${km} km/bulan, estimasi penghematan hingga ${r ? formatRupiahShort(r.hematPerBulan) : '[…]'} per bulan dibanding SUV bensin biasa. Hitung angka pasti sesuai pemakaian Anda di kalkulator efisiensi.`,
      },
    );
  } else {
    out.push({
      q: `Apakah ${np} irit BBM?`,
      a: `${np} memakai mesin turbo yang efisien untuk kelasnya (konsumsi efektif ±${kmpl} km/L). Bila ingin efisiensi maksimal, pertimbangkan varian hybrid Super Hybrid System (SHS).`,
    });
  }

  out.push({
    q: `Apakah servis mobil hybrid/listrik JAECOO lebih mahal?`,
    a: `Tidak harus. Pengereman regeneratif memperpanjang usia kampas rem, interval servis mengikuti panduan pabrikan, dan baterai memiliki garansi resmi. Detail perawatan dibantu dijelaskan oleh ${site.salesName}.`,
  });
  return out;
}
