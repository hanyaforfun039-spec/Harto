/* =============================================================================
   jaecoo-base · FORMAT
   Format mata uang & angka gaya Indonesia (id-ID).
   ============================================================================ */

const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat('id-ID');

/** 689900000 -> "Rp 689.900.000" */
export function formatRupiah(n: number): string {
  return idr.format(Math.round(n));
}

/** 549900000 -> "Rp 549,9 jt" ; 1200000000 -> "Rp 1,2 M" */
export function formatRupiahShort(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${trim(n / 1_000_000_000)} M`;
  if (n >= 1_000_000) return `Rp ${trim(n / 1_000_000)} jt`;
  return formatRupiah(n);
}

/** 1500000 -> "1.500.000" (tanpa "Rp") */
export function formatAngka(n: number): string {
  return num.format(Math.round(n));
}

/** Satu desimal, koma sebagai pemisah, buang ",0" */
function trim(x: number): string {
  const r = Math.round(x * 10) / 10;
  return r.toString().replace('.', ',');
}
