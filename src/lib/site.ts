/* =============================================================================
   jaecoo-base · SITE RESOLVER
   Site config aktif untuk folder klien ini.
   -----------------------------------------------------------------------------
   MULTI-KLIEN ("template lalu copy"): tidak ada lagi daftar 4 tema di sini.
   Tiap folder klien punya SATU src/data/site.json, hasil gabungan tabel
   `dealer` + `sales_profile` yang ditulis scripts/sync-sites.mjs saat build.
   Untuk membuat klien baru: copy folder, ubah SITE_ID di .env, jalankan sync.
   ============================================================================ */
import type { SiteConfig } from './types';
import data from '../data/site.json';

export const site: SiteConfig = data as SiteConfig;

/** Dipakai untuk atribut data-site & penyaring announcement per situs. */
export const activeSiteId: string = site.id;
