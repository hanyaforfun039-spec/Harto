/* =============================================================================
   jaecoo-base · SYNC CARS (Supabase -> src/data/cars.json)
   -----------------------------------------------------------------------------
   Sama filosofi dgn sync-sites: Supabase = sumber edit, JSON = cache build.
   Menarik tabel public.cars (urut sort_order) -> tulis ulang src/data/cars.json.
   `cars.ts` tetap baca JSON sinkron (nol refactor). NON-FATAL: env kosong /
   tabel belum ada / jaringan gagal -> warn + pertahankan cars.json (build lanjut).
   ============================================================================ */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CARS_FILE = join(ROOT, 'src', 'data', 'cars.json');

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
      if (env[k] === undefined) env[k] = t.slice(i + 1).trim();
    }
  }
  return env;
}

function rowToCar(r) {
  return {
    slug: r.slug,
    nama: r.nama,
    namaPendek: r.nama_pendek,
    kategori: r.kategori,
    powertrain: r.powertrain,
    tagline: r.tagline,
    varian: r.varian,
    specs: r.specs,
    fitur: r.fitur,
    foto: r.foto,
    faq: r.faq,
  };
}

async function main() {
  const env = loadEnv();
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('<project-ref>') || key.includes('xxxxx')) {
    console.warn('[sync-cars] ⏭  Env Supabase belum diisi. Lewati — pakai cars.json yang ada.');
    return;
  }

  const select =
    'slug,nama,nama_pendek,kategori,powertrain,tagline,varian,specs,fitur,foto,faq,sort_order';

  let rows;
  try {
    const res = await fetch(`${url}/rest/v1/cars?select=${select}&order=sort_order,slug`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      const body = await res.text();
      if (body.includes('PGRST205')) {
        console.warn(
          '[sync-cars] ⏭  Tabel public.cars belum ada (migration 0003 belum di-run).',
          '\n             Build lanjut dgn cars.json yang ada.',
        );
        return;
      }
      console.warn(`[sync-cars] ⚠  Gagal fetch (HTTP ${res.status}): ${body}\n             Build lanjut dgn cars.json yang ada.`);
      return;
    }
    rows = await res.json();
  } catch (err) {
    console.warn(`[sync-cars] ⚠  Jaringan gagal: ${err.message}\n             Build lanjut dgn cars.json yang ada.`);
    return;
  }

  if (!rows.length) {
    console.warn('[sync-cars] •  Tabel cars kosong — pertahankan cars.json.');
    return;
  }

  const json = JSON.stringify(rows.map(rowToCar), null, 2) + '\n';
  const prev = existsSync(CARS_FILE) ? readFileSync(CARS_FILE, 'utf8') : '';
  if (prev === json) {
    console.log(`[sync-cars] =  cars.json sudah sama (${rows.length} mobil).`);
  } else {
    writeFileSync(CARS_FILE, json, 'utf8');
    console.log(`[sync-cars] ✓  cars.json diperbarui dari Supabase (${rows.length} mobil).`);
  }
}

main();
