/* =============================================================================
   jaecoo-base · GENERATOR migration 0003_cars.sql (DDL + seed)
   -----------------------------------------------------------------------------
   Membuat ulang supabase/migrations/0003_cars.sql DARI src/data/cars.json,
   supaya seed 100% cocok dengan data (tanpa transkrip manual). Idempoten.
   Jalankan: node scripts/gen-cars-migration.mjs   (lalu paste hasilnya ke SQL Editor)
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const cars = JSON.parse(readFileSync(join(ROOT, 'src/data/cars.json'), 'utf8'));

const jb = (v) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
const tx = (s) => `'${String(s).replace(/'/g, "''")}'`;

const rows = cars
  .map((c, i) => {
    return (
      `(\n` +
      `  ${tx(c.slug)}, ${tx(c.nama)}, ${tx(c.namaPendek)}, ${tx(c.kategori)}, ${tx(c.powertrain)},\n` +
      `  ${tx(c.tagline)},\n` +
      `  ${jb(c.varian)},\n` +
      `  ${jb(c.specs)},\n` +
      `  ${jb(c.fitur)},\n` +
      `  ${jb(c.foto)},\n` +
      `  ${jb(c.faq)},\n` +
      `  ${i + 1}\n` +
      `)`
    );
  })
  .join(',\n\n');

const sql = `-- =============================================================================
-- jaecoo-base · Migration 0003 — tabel \`cars\` (+ seed 5 mobil)
-- DIGENERATE dari src/data/cars.json oleh scripts/gen-cars-migration.mjs.
-- 1 baris = 1 mobil. Kolom datar utk yang sering diedit; jsonb utk array bersarang
-- (varian harga, specs, fitur, foto, faq). sort_order = urutan tampil default.
-- Trigger set_updated_at() sudah dibuat di 0001 — dipakai ulang di sini.
-- Idempoten: on conflict (slug) do nothing.
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- =============================================================================

create table if not exists public.cars (
  slug         text primary key,             -- 'j5' | 'j7' | 'j7-shs' | 'j8-ardis' | 'j8-shs-ardis'
  nama         text not null,                -- "JAECOO J8 ARDIS"
  nama_pendek  text not null,                -- "J8 ARDIS"
  kategori     text not null,
  powertrain   text not null,                -- ice | phev | ev
  tagline      text not null,
  varian       jsonb not null default '[]'::jsonb,   -- [{nama, hargaOtr, highlight?}]  <-- HARGA di sini
  specs        jsonb not null default '[]'::jsonb,   -- [{label, value, icon}]
  fitur        jsonb not null default '[]'::jsonb,   -- [string]
  foto         jsonb not null,                       -- {hero:{src,alt}, galeri:[{src,alt}]}
  faq          jsonb not null default '[]'::jsonb,   -- [{q, a}]
  sort_order   int  not null default 0,
  updated_at   timestamptz not null default now()
);

drop trigger if exists trg_cars_updated_at on public.cars;
create trigger trg_cars_updated_at
  before update on public.cars
  for each row execute function public.set_updated_at();

alter table public.cars enable row level security;

drop policy if exists "cars_public_read" on public.cars;
create policy "cars_public_read"
  on public.cars for select
  to anon, authenticated
  using (true);

-- =============================================================================
-- Seed 5 mobil (dari src/data/cars.json)
-- =============================================================================
insert into public.cars (
  slug, nama, nama_pendek, kategori, powertrain, tagline,
  varian, specs, fitur, foto, faq, sort_order
) values

${rows}

on conflict (slug) do nothing;
`;

const out = join(ROOT, 'supabase/migrations/0003_cars.sql');
writeFileSync(out, sql, 'utf8');
console.log(`✓ ${out} ditulis (${cars.length} mobil).`);
