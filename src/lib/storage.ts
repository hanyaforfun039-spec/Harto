/* Helper URL Supabase Storage — project BERSAMA (Harto/Putri/Andre).
   Aset PER-SALES (foto SPK serah terima + foto konsultan) diambil dari bucket
   masing-masing lewat `site.storage`. Foto katalog mobil TIDAK di sini. */
import type { SiteConfig } from './types';

const BASE = (import.meta.env.PUBLIC_SUPABASE_URL ?? 'https://fxjspvdkeybabxotniov.supabase.co').replace(/\/+$/, '');

/* Default lama (kompatibel bila site belum punya blok storage). */
const DEFAULT_BUCKET = 'Harto';
const DEFAULT_CONSULTANT = 'Foto Harto.webp';
const DEFAULT_DELIVERY_COUNT = 8;

export function publicUrl(bucket: string, file: string): string {
  return `${BASE}/storage/v1/object/public/${bucket}/${encodeURIComponent(file)}`;
}

/* Foto konsultan. null bila belum diset (komponen menyembunyikannya, tak ada
   ikon gambar rusak). Tanpa blok storage sama sekali → default lama (Harto). */
export function consultantPhotoUrl(site: SiteConfig): string | null {
  const s = site.storage;
  if (!s) return publicUrl(DEFAULT_BUCKET, DEFAULT_CONSULTANT);
  if (!s.consultantPhoto) return null;
  return publicUrl(s.bucket, s.consultantPhoto);
}

/* Daftar URL foto SPK. [] bila belum diset → galeri disembunyikan. */
export function deliveryPhotos(site: SiteConfig): string[] {
  const s = site.storage;
  if (!s) {
    return Array.from({ length: DEFAULT_DELIVERY_COUNT }, (_, i) => publicUrl(DEFAULT_BUCKET, `SPK${i + 1}.webp`));
  }
  const files =
    s.deliveryFiles ??
    (s.deliveryCount != null ? Array.from({ length: s.deliveryCount }, (_, i) => `SPK${i + 1}.webp`) : []);
  return files.map((f) => publicUrl(s.bucket, f));
}
