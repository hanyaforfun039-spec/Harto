/* =============================================================================
   jaecoo-base · CREDIT
   Simulasi cicilan dengan metode BUNGA FLAT (paling umum dipahami pembeli ritel).
   Dipakai server-side (render default) DAN client-side (kalkulator interaktif).
   Catatan: estimasi non-mengikat; angka final mengikuti pihak leasing.
   ============================================================================ */
import type { SiteConfig } from './types';

export interface CicilanInput {
  otr: number;
  dpPct: number;
  tenorYears: number;
  bungaFlatPctPerYear: number;
}

export interface CicilanResult {
  otr: number;
  dp: number;
  pokok: number; // jumlah yang dibiayai
  bungaTotal: number;
  totalBayar: number; // pokok + bunga
  cicilanPerBulan: number;
  tenorMonths: number;
  dpPct: number;
  tenorYears: number;
  bungaFlatPctPerYear: number;
}

export function hitungCicilan(i: CicilanInput): CicilanResult {
  const dp = Math.round(i.otr * (i.dpPct / 100));
  const pokok = i.otr - dp;
  const tenorMonths = i.tenorYears * 12;
  const bungaTotal = Math.round(pokok * (i.bungaFlatPctPerYear / 100) * i.tenorYears);
  const totalBayar = pokok + bungaTotal;
  const cicilanPerBulan = tenorMonths > 0 ? Math.round(totalBayar / tenorMonths) : 0;
  return {
    otr: i.otr,
    dp,
    pokok,
    bungaTotal,
    totalBayar,
    cicilanPerBulan,
    tenorMonths,
    dpPct: i.dpPct,
    tenorYears: i.tenorYears,
    bungaFlatPctPerYear: i.bungaFlatPctPerYear,
  };
}

/** Cicilan memakai default DP/tenor/bunga dari site config. */
export function estimasiCicilanDefault(otr: number, site: SiteConfig): CicilanResult {
  return hitungCicilan({
    otr,
    dpPct: site.kredit.dpDefaultPct,
    tenorYears: site.kredit.tenorDefaultYears,
    bungaFlatPctPerYear: site.kredit.bungaFlatPctPerYear,
  });
}
