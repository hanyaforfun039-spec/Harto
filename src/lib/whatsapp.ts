/* =============================================================================
   jaecoo-base · WHATSAPP
   Builder link wa.me + template pesan terformat (TANPA emoji, sesuai brand).
   Semua konversi bermuara ke sini (tidak ada backend).
   ============================================================================ */
import type { SiteConfig } from './types';
import type { CicilanResult } from './credit';
import { formatRupiah } from './format';

/** Susun URL wa.me dengan pesan ter-encode. number = E.164 tanpa '+'. */
export function waLink(number: string, message: string): string {
  const n = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

/** Pesan umum: minta penawaran (opsional sebut model). */
export function pesanPenawaran(site: SiteConfig, modelNama?: string): string {
  const ref = modelNama ? ` ${modelNama}` : '';
  return (
    `Halo ${site.salesName}, saya tertarik dengan JAECOO${ref}.\n` +
    `Boleh minta penawaran harga OTR ${site.address.locality} dan info lebih lanjut?`
  );
}

/** Pesan simulasi kredit terisi (dari kalkulator). */
export function pesanSimulasiKredit(
  site: SiteConfig,
  modelNama: string,
  r: CicilanResult,
): string {
  return (
    `Halo ${site.salesName}, saya mau lanjut simulasi kredit JAECOO ${modelNama}:\n` +
    `- Harga OTR: ${formatRupiah(r.otr)}\n` +
    `- DP ${r.dpPct}%: ${formatRupiah(r.dp)}\n` +
    `- Tenor: ${r.tenorYears} tahun (${r.tenorMonths} bulan)\n` +
    `- Estimasi cicilan: ${formatRupiah(r.cicilanPerBulan)} / bulan\n` +
    `Mohon dibantu proses pengajuannya.`
  );
}

/** Pesan test drive dari form (nama opsional — kartu memakai versi tanpa nama). */
export function pesanTestDrive(
  site: SiteConfig,
  data: { nama?: string; mobil: string; rencana?: string; bayar?: string },
): string {
  const baris = [`Halo ${site.salesName}, saya ingin test drive JAECOO ${data.mobil}.`];
  if (data.nama) baris.push(`- Nama: ${data.nama}`);
  baris.push(`- Model: ${data.mobil}`);
  if (data.rencana) baris.push(`- Rencana beli: ${data.rencana}`);
  if (data.bayar) baris.push(`- Cara bayar: ${data.bayar}`);
  baris.push(`- Area: ${site.address.locality} dan sekitarnya`);
  return baris.join('\n');
}

/* Shortcut link siap pakai (server-render). */
export const linkTestDrive = (site: SiteConfig, mobil: string) =>
  waLink(site.whatsapp, pesanTestDrive(site, { mobil }));

/* Shortcut link siap pakai (server-render). */
export const linkPenawaran = (site: SiteConfig, modelNama?: string) =>
  waLink(site.whatsapp, pesanPenawaran(site, modelNama));
