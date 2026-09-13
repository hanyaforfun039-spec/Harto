/* =============================================================================
   jaecoo-base · CARS
   Akses data mobil (satu sumber kebenaran: data/cars.json).

   CATATAN HARGA: sejak lineup memuat model yang masih pre-book, harga boleh
   KOSONG. `hargaMulai` karena itu mengembalikan `number | null` — sengaja,
   supaya TypeScript memaksa setiap pemanggil memikirkan kasus tanpa harga
   alih-alih diam-diam menampilkan "Rp NaN".
   ============================================================================ */
import type { Car, SiteConfig } from './types';
import { estimasiCicilanDefault, type CicilanResult } from './credit';
import { formatRupiah } from './format';
import data from '../data/cars.json';

export const cars: Car[] = data as Car[];

export function getAllCars(): Car[] {
  return cars;
}

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

/** Merek dibaca dari nama model, bukan disimpan terpisah, supaya tidak ada
    dua sumber kebenaran yang bisa berbeda. */
export function merek(car: Car): 'OMODA' | 'JAECOO' {
  return /^omoda/i.test(car.nama) ? 'OMODA' : 'JAECOO';
}

/** Nama lengkap berikut mereknya, mis. "JAECOO J8 ARDIS" / "OMODA 04 EV". */
export function namaBermerek(car: Car): string {
  const m = merek(car);
  return car.nama.toUpperCase().startsWith(m) ? car.nama : `${m} ${car.nama}`;
}

/** Semua harga varian yang sudah punya angka. */
function hargaTerisi(car: Car): number[] {
  return car.varian
    .map((v) => v.hargaOtr)
    .filter((h): h is number => typeof h === 'number' && Number.isFinite(h) && h > 0);
}

/** true bila minimal satu varian sudah punya harga resmi. */
export function punyaHarga(car: Car): boolean {
  return hargaTerisi(car).length > 0;
}

export function sedangPreOrder(car: Car): boolean {
  return car.status === 'pre-order';
}

/** Harga OTR terendah, atau null bila harga resmi belum keluar. */
export function hargaMulai(car: Car): number | null {
  const h = hargaTerisi(car);
  return h.length ? Math.min(...h) : null;
}

/** Harga OTR tertinggi (untuk schema AggregateOffer), atau null. */
export function hargaTertinggi(car: Car): number | null {
  const h = hargaTerisi(car);
  return h.length ? Math.max(...h) : null;
}

/** Estimasi cicilan/bulan dari harga termurah, atau null bila belum berharga. */
export function cicilanMulai(car: Car, site: SiteConfig): CicilanResult | null {
  const h = hargaMulai(car);
  return h === null ? null : estimasiCicilanDefault(h, site);
}

/** Kalimat pengganti saat harga belum ada. */
export function catatanHarga(car: Car): string {
  return car.hargaCatatan ?? 'Hubungi kami untuk info harga';
}

/** FAQ dengan token {harga} diisi harga terkini saat build.
    Tanpa ini, angka di dalam jawaban FAQ ditulis manual dan pernah melenceng
    jauh dari harga di tabel varian. */
export function faqTerisi(car: Car): { q: string; a: string }[] {
  const h = hargaMulai(car);
  const teks = h === null ? catatanHarga(car) : formatRupiah(h);
  return (car.faq ?? []).map((f) => ({ q: f.q, a: f.a.replace(/\{harga\}/g, teks) }));
}

/** Daftar mobil sesuai urutan lineup di site config. */
export function getLineup(site: SiteConfig): Car[] {
  return site.lineup
    .map((slug) => getCarBySlug(slug))
    .filter((c): c is Car => Boolean(c));
}

/** Mobil yang bisa dihitung kreditnya — yang belum berharga dikecualikan. */
export function getLineupBerharga(site: SiteConfig): Car[] {
  return getLineup(site).filter(punyaHarga);
}
