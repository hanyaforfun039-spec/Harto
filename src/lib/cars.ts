/* =============================================================================
   jaecoo-base · CARS
   Akses data mobil (satu sumber kebenaran: data/cars.json).
   ============================================================================ */
import type { Car, SiteConfig } from './types';
import { estimasiCicilanDefault, type CicilanResult } from './credit';
import data from '../data/cars.json';

export const cars: Car[] = data as Car[];

export function getAllCars(): Car[] {
  return cars;
}

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

/** Harga OTR terendah dari semua varian. */
export function hargaMulai(car: Car): number {
  return Math.min(...car.varian.map((v) => v.hargaOtr));
}

/** Harga OTR tertinggi (untuk schema AggregateOffer). */
export function hargaTertinggi(car: Car): number {
  return Math.max(...car.varian.map((v) => v.hargaOtr));
}

/** Estimasi cicilan/bulan dari harga termurah, memakai default site. */
export function cicilanMulai(car: Car, site: SiteConfig): CicilanResult {
  return estimasiCicilanDefault(hargaMulai(car), site);
}

/** Daftar mobil sesuai urutan lineup di site config. */
export function getLineup(site: SiteConfig): Car[] {
  return site.lineup
    .map((slug) => getCarBySlug(slug))
    .filter((c): c is Car => Boolean(c));
}
