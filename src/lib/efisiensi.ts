/* =============================================================================
   jaecoo-base · EFISIENSI  (Web2 "Harto")
   Modul hitung PENGHEMATAN energi: biaya BBM JAECOO (hybrid/EV, konsumsi efektif
   setara bensin) vs mobil lama, hemat/bln & /tahun, biaya per km, dan jangkauan.
   Dipakai server-side (render default) DAN client-side (kalkulator hero).
   BEDA dari lib/credit.ts (cicilan) — ini satu sumber kebenaran rumus efisiensi.
   Catatan: estimasi; pemakaian nyata bergantung rute & gaya berkendara.
   ============================================================================ */
import type { SiteConfig } from './types';

export interface EfisiensiInput {
  kmPerMonth: number; // jarak tempuh per bulan
  bbmPerLiter: number; // harga BBM (Rp/L)
  baselineKmpl: number; // konsumsi mobil lama (km/L)
  modelKmpl: number; // konsumsi efektif JAECOO setara bensin (km/L)
  rangeKm: number; // jangkauan model (km sekali isi penuh)
}

export interface EfisiensiResult extends EfisiensiInput {
  biayaLamaPerBulan: number;
  biayaJaecooPerBulan: number;
  hematPerBulan: number;
  hematPerTahun: number;
  biayaPerKmJaecoo: number;
  biayaPerKmLama: number;
  persenHemat: number; // 0..100
}

export function hitungEfisiensi(i: EfisiensiInput): EfisiensiResult {
  const biayaLamaPerBulan =
    i.baselineKmpl > 0 ? Math.round((i.kmPerMonth / i.baselineKmpl) * i.bbmPerLiter) : 0;
  const biayaJaecooPerBulan =
    i.modelKmpl > 0 ? Math.round((i.kmPerMonth / i.modelKmpl) * i.bbmPerLiter) : 0;
  const hematPerBulan = Math.max(0, biayaLamaPerBulan - biayaJaecooPerBulan);
  const hematPerTahun = hematPerBulan * 12;
  const biayaPerKmJaecoo = i.kmPerMonth > 0 ? Math.round(biayaJaecooPerBulan / i.kmPerMonth) : 0;
  const biayaPerKmLama = i.kmPerMonth > 0 ? Math.round(biayaLamaPerBulan / i.kmPerMonth) : 0;
  const persenHemat =
    biayaLamaPerBulan > 0 ? Math.round((hematPerBulan / biayaLamaPerBulan) * 100) : 0;
  return {
    ...i,
    biayaLamaPerBulan,
    biayaJaecooPerBulan,
    hematPerBulan,
    hematPerTahun,
    biayaPerKmJaecoo,
    biayaPerKmLama,
    persenHemat,
  };
}

/** Data efisiensi satu model dari site config (km/L efektif + jangkauan). */
export function efisiensiModel(
  site: SiteConfig,
  slug: string,
): { kmpl: number; rangeKm: number } | undefined {
  return site.efisiensi?.model[slug];
}

/** Estimasi default (server-render, no-JS): pakai asumsi site config + model. */
export function estimasiEfisiensiDefault(site: SiteConfig, slug?: string): EfisiensiResult {
  const e = site.efisiensi;
  const targetSlug = slug ?? site.heroCarSlug;
  const m = (e && (e.model[targetSlug] ?? Object.values(e.model)[0])) ?? { kmpl: 30, rangeKm: 1000 };
  return hitungEfisiensi({
    kmPerMonth: e?.kmDefault ?? 1500,
    bbmPerLiter: e?.bbmDefault ?? 13000,
    baselineKmpl: e?.baselineDefaultKmpl ?? 9,
    modelKmpl: m.kmpl,
    rangeKm: m.rangeKm,
  });
}
