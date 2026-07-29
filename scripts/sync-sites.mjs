/* =============================================================================
   jaecoo-base · SYNC SITE (Supabase -> src/data/site.json)
   -----------------------------------------------------------------------------
   Filosofi tetap: Supabase = sumber edit, JSON = cache build. Komponen Astro
   membaca JSON secara SINKRON, jadi nol refactor di sisi halaman.

   BEDA dari versi lama: dulu satu tabel `sites` berisi 4 baris tema dan skrip
   ini menulis 4 file. Sekarang datanya dipecah dua —

     dealer         (1 baris)  bagian yang SAMA untuk Harto/Andre/Fitri
     sales_profile  (per orang) nama, kontak, sosmed, foto, brand

   — lalu digabung di sini menjadi satu file: src/data/site.json.
   Profil mana yang dipakai ditentukan SITE_ID di .env ('harto'|'andre'|'fitri').

   Dipanggil otomatis sebelum `astro build` (lihat package.json -> "build").
   NON-FATAL: env kosong / tabel belum ada / jaringan gagal -> warn dan
   PERTAHANKAN site.json yang sudah ada supaya build tetap lanjut.
   ============================================================================ */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_FILE = join(ROOT, 'src', 'data', 'site.json');

/* Profil sales milik folder ini. Ini SATU-SATUNYA baris yang perlu diubah saat
   menyalin template untuk klien baru.
   Sengaja ditulis di sini, bukan hanya mengandalkan SITE_ID di .env: .env tidak
   ikut ter-commit, jadi di Vercel ia tidak ada. Tanpa nilai bawaan ini, sync
   akan terlewat diam-diam dan perubahan profil/dealer tidak pernah naik.
   Env SITE_ID tetap menang bila diisi (berguna untuk uji coba lokal). */
const DEFAULT_SITE_ID = 'harto';

/* ---- env: process.env -> fallback .env ---------------------------------- */
function loadEnv() {
  const env = { ...process.env };
  const envPath = join(ROOT, '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      const k = t.slice(0, i).trim();
      if (env[k] === undefined) env[k] = t.slice(i + 1).trim(); // process.env menang
    }
  }
  return env;
}

async function get(url, key, path) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`HTTP ${res.status}: ${body}`);
    err.missingTable = body.includes('PGRST205');
    throw err;
  }
  return res.json();
}

/* ---- dealer + sales_profile -> SiteConfig --------------------------------
   Urutan kunci sengaja dibuat sama dengan site-*.json lama supaya diff-nya
   enak dibaca saat migrasi. Nilai null/undefined dibuang agar field opsional
   tidak muncul sebagai null di JSON.                                        */
function toConfig(d, p) {
  const out = {
    id: p.id,
    theme: p.theme,
    brand: p.brand,
    dealerName: d.dealer_name,
    salesName: p.sales_name,
    salesTitle: p.sales_title,
    salesCredentials: d.sales_credentials,
    whatsapp: p.whatsapp,
    phoneDisplay: p.phone_display,
    email: p.email,
    address: d.address,
    geo: d.geo,
    serviceAreas: d.service_areas,
    openingHours: d.opening_hours,
    mapUrl: d.map_url,
    tagline: d.tagline,
    subheadline: p.subheadline,
    positioning: d.positioning,
    heroVariant: d.hero_variant,
    heroCarSlug: d.hero_car_slug,
    heroHeadline: d.hero_headline,
    lineup: d.lineup,
    featuredSlug: d.featured_slug,
    kredit: d.kredit,
    promo: d.promo,
    testimoni: d.testimoni,
    // seo dipecah: bagian bersama di dealer.seo_base, teks per domain di profil.
    seo: { ...(d.seo_base ?? {}), ...(p.seo ?? {}) },
    social: p.social,
    storage: p.storage,
  };
  for (const k of ['geo', 'mapUrl', 'social', 'storage', 'heroHeadline', 'email']) {
    if (out[k] === null || out[k] === undefined) delete out[k];
  }
  return out;
}

async function main() {
  const env = loadEnv();
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_ANON_KEY;
  const siteId = env.SITE_ID || DEFAULT_SITE_ID;

  if (!url || !key || url.includes('<project-ref>') || key.includes('xxxxx')) {
    console.warn('[sync-site] ⏭  Env Supabase belum diisi. Lewati — pakai site.json yang ada.');
    return;
  }

  let dealer, profile;
  try {
    const [dRows, pRows] = await Promise.all([
      get(url, key, 'dealer?select=*&id=eq.main'),
      get(url, key, `sales_profile?select=*&id=eq.${encodeURIComponent(siteId)}`),
    ]);
    dealer = dRows[0];
    profile = pRows[0];
  } catch (err) {
    if (err.missingTable) {
      console.warn(
        '[sync-site] ⏭  Tabel dealer/sales_profile belum ada (migration 0010-0011 belum di-run).',
        '\n            Build lanjut dgn site.json yang ada.',
      );
      return;
    }
    console.warn(`[sync-site] ⚠  Gagal fetch: ${err.message}\n            Build lanjut dgn site.json yang ada.`);
    return;
  }

  if (!dealer) {
    console.warn("[sync-site] •  Baris dealer 'main' tidak ada — pertahankan site.json.");
    return;
  }
  if (!profile) {
    console.warn(`[sync-site] •  sales_profile '${siteId}' tidak ada — pertahankan site.json.`);
    return;
  }

  const json = JSON.stringify(toConfig(dealer, profile), null, 2) + '\n';
  const prev = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : '';
  if (prev === json) {
    console.log(`[sync-site] =  site.json sudah sama ('${siteId}').`);
  } else {
    writeFileSync(OUT_FILE, json, 'utf8');
    console.log(`[sync-site] ✓  site.json diperbarui dari Supabase ('${siteId}').`);
  }
}

main();
