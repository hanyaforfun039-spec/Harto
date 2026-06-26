/* =============================================================================
   jaecoo-base · SYNC SITES (Supabase -> src/data/sites/*.json)
   -----------------------------------------------------------------------------
   Arsitektur "sync script": Supabase = sumber edit, JSON = cache build.
   Skrip ini menarik tabel public.sites lalu MENULIS ULANG file site-*.json,
   sehingga komponen/halaman Astro tetap baca JSON secara SINKRON (nol refactor,
   "template lalu copy" tetap simpel).

   Dipanggil otomatis sebelum `astro build` (lihat package.json -> "build").
   Aman & NON-FATAL: kalau env belum diisi, tabel belum ada, atau jaringan
   gagal -> beri peringatan dan PERTAHANKAN JSON yang sudah ada (build lanjut).

   Env (process.env dulu, lalu fallback baca file .env):
     PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY
   ============================================================================ */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITES_DIR = join(ROOT, 'src', 'data', 'sites');
const IDS = ['premium', 'hybrid', 'kredit', 'area'];

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
      const v = t.slice(i + 1).trim();
      if (env[k] === undefined) env[k] = v; // process.env menang
    }
  }
  return env;
}

/* ---- DB row (snake_case + jsonb) -> SiteConfig JSON (camelCase) ---------- */
function rowToConfig(r) {
  const out = {
    id: r.id,
    theme: r.theme,
    brand: r.brand,
    dealerName: r.dealer_name,
    salesName: r.sales_name,
    salesTitle: r.sales_title,
    salesCredentials: r.sales_credentials,
    whatsapp: r.whatsapp,
    phoneDisplay: r.phone_display,
    email: r.email,
    address: r.address,
    geo: r.geo,
    serviceAreas: r.service_areas,
    openingHours: r.opening_hours,
    mapUrl: r.map_url,
    tagline: r.tagline,
    subheadline: r.subheadline,
    positioning: r.positioning,
    heroVariant: r.hero_variant,
    heroCarSlug: r.hero_car_slug,
    lineup: r.lineup,
    featuredSlug: r.featured_slug,
    kredit: r.kredit,
    promo: r.promo,
    testimoni: r.testimoni,
    seo: r.seo,
    social: r.social,
  };
  // Field opsional (email, geo, mapUrl, social) -> buang kalau null/undefined.
  for (const k of ['email', 'geo', 'mapUrl', 'social']) {
    if (out[k] === null || out[k] === undefined) delete out[k];
  }
  return out;
}

async function main() {
  const env = loadEnv();
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('<project-ref>') || key.includes('xxxxx')) {
    console.warn(
      '[sync-sites] ⏭  Env Supabase belum diisi. Lewati sync — pakai JSON yang ada.',
    );
    return; // non-fatal
  }

  const select =
    'id,theme,brand,dealer_name,sales_name,sales_title,sales_credentials,' +
    'whatsapp,phone_display,email,address,geo,service_areas,opening_hours,map_url,' +
    'tagline,subheadline,positioning,hero_variant,hero_car_slug,lineup,featured_slug,' +
    'kredit,promo,testimoni,seo,social';

  let rows;
  try {
    const res = await fetch(`${url}/rest/v1/sites?select=${select}&order=id`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      const body = await res.text();
      if (body.includes('PGRST205')) {
        console.warn(
          '[sync-sites] ⏭  Tabel public.sites belum ada (migration 0001 belum di-run).',
          '\n             Jalankan supabase/migrations/0001_sites.sql + 0002 di SQL Editor.',
          '\n             Build lanjut dgn JSON yang ada.',
        );
        return; // non-fatal
      }
      console.warn(`[sync-sites] ⚠  Gagal fetch (HTTP ${res.status}): ${body}\n             Build lanjut dgn JSON yang ada.`);
      return; // non-fatal
    }
    rows = await res.json();
  } catch (err) {
    console.warn(`[sync-sites] ⚠  Jaringan gagal: ${err.message}\n             Build lanjut dgn JSON yang ada.`);
    return; // non-fatal
  }

  const byId = new Map(rows.map((r) => [r.id, r]));
  let written = 0;
  for (const id of IDS) {
    const row = byId.get(id);
    const file = join(SITES_DIR, `site-${id}.json`);
    if (!row) {
      console.warn(`[sync-sites] •  '${id}' tak ada di DB — pertahankan ${`site-${id}.json`}`);
      continue;
    }
    const json = JSON.stringify(rowToConfig(row), null, 2) + '\n';
    const prev = existsSync(file) ? readFileSync(file, 'utf8') : '';
    if (prev === json) {
      console.log(`[sync-sites] =  '${id}' sudah sama.`);
    } else {
      writeFileSync(file, json, 'utf8');
      written++;
      console.log(`[sync-sites] ✓  '${id}' diperbarui dari Supabase.`);
    }
  }
  console.log(`[sync-sites] Selesai — ${written} file diperbarui dari ${rows.length} baris DB.`);
}

main();
