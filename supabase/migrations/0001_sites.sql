-- =============================================================================
-- jaecoo-base · Migration 0001 — tabel `sites`
-- Memindahkan isi src/data/sites/site-*.json ke database.
-- 1 baris = 1 site. Field datar untuk yang sering diedit admin; jsonb untuk
-- bagian bersarang (address, opening_hours, promo, testimoni, dst).
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- =============================================================================

create table if not exists public.sites (
  id              text primary key,             -- 'premium' | 'hybrid' | 'kredit' | 'area' (cocok SITE_ID)
  theme           text not null,

  -- Identitas
  brand           text not null,
  dealer_name     text not null,
  sales_name      text not null,
  sales_title     text not null,
  sales_credentials jsonb not null default '[]'::jsonb,

  -- Kontak
  whatsapp        text not null,                -- E.164 tanpa '+', mis. 628120000001
  phone_display   text not null,
  email           text,

  -- Lokasi & layanan
  address         jsonb not null,               -- { street, locality, region, postalCode, country }
  geo             jsonb,                         -- { lat, lng }
  service_areas   jsonb not null default '[]'::jsonb,
  opening_hours   jsonb not null default '[]'::jsonb,
  map_url         text,

  -- Positioning & copy
  tagline         text not null,
  subheadline     text not null,
  positioning     text not null,
  hero_variant    text not null,
  hero_car_slug   text not null,

  -- Lineup
  lineup          jsonb not null default '[]'::jsonb,
  featured_slug   text not null,

  -- Kredit, promo, trust, SEO, sosial
  kredit          jsonb not null,               -- { bungaFlatPctPerYear, dpDefaultPct, tenorDefaultYears }
  promo           jsonb not null,               -- { aktif, headline, sub, deadline? }
  testimoni       jsonb not null default '[]'::jsonb,
  seo             jsonb not null,               -- { titleSuffix, defaultDescription, ogImage, locale }
  social          jsonb,                        -- { instagram?, tiktok?, facebook? }

  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at setiap baris diubah (berguna saat admin edit).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_sites_updated_at on public.sites;
create trigger trg_sites_updated_at
  before update on public.sites
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security: publik boleh BACA, tidak boleh tulis.
-- Tulis (admin) diatur nanti via policy untuk user terautentikasi.
-- =============================================================================
alter table public.sites enable row level security;

drop policy if exists "sites_public_read" on public.sites;
create policy "sites_public_read"
  on public.sites for select
  to anon, authenticated
  using (true);

-- =============================================================================
-- Seed: site premium (Faiz) — dari src/data/sites/site-premium.json
-- =============================================================================
insert into public.sites (
  id, theme, brand, dealer_name, sales_name, sales_title, sales_credentials,
  whatsapp, phone_display, email,
  address, geo, service_areas, opening_hours, map_url,
  tagline, subheadline, positioning, hero_variant, hero_car_slug,
  lineup, featured_slug, kredit, promo, testimoni, seo, social
) values (
  'premium', 'premium', 'JAECOO Semarang', 'Dealer Resmi JAECOO Semarang',
  'Faiz', 'Sales Consultant JAECOO',
  '["Sales Consultant Resmi","Spesialis J8 Flagship","Melayani Semarang Raya"]'::jsonb,
  '628120000001', '0812-0000-0001', 'faiz@example.com',
  '{"street":"Jl. Pemuda No. 000","locality":"Semarang","region":"Jawa Tengah","postalCode":"50132","country":"ID"}'::jsonb,
  '{"lat":-6.9839,"lng":110.4093}'::jsonb,
  '["Semarang","Ungaran","Salatiga","Kudus","Demak"]'::jsonb,
  '[{"hari":"Senin - Sabtu","buka":"08:30","tutup":"17:00"},{"hari":"Minggu","buka":"09:00","tutup":"15:00"}]'::jsonb,
  'https://maps.google.com/?q=JAECOO+Semarang',
  'From Classic, Beyond Classic.',
  'Flagship JAECOO J8 ARDIS - kehadiran berkelas untuk Anda yang memimpin.',
  'Spesialis JAECOO J8 flagship di Semarang. Konsultasi premium, penawaran terbaik, layanan personal.',
  'premium-fullbleed', 'j8-ardis',
  '["j8-shs-ardis","j8-ardis","j7-shs","j7","j5"]'::jsonb,
  'j8-ardis',
  '{"bungaFlatPctPerYear":4.0,"dpDefaultPct":25,"tenorDefaultYears":5}'::jsonb,
  '{"aktif":true,"headline":"Penawaran Eksklusif Flagship Bulan Ini","sub":"Tukar tambah & paket perawatan untuk pembelian J8 ARDIS.","deadline":"2026-06-30"}'::jsonb,
  '[{"nama":"Bapak Hendra","kota":"Semarang","mobil":"J8 ARDIS","teks":"Pelayanan sangat personal, proses jelas dari awal sampai serah terima unit."},{"nama":"Ibu Sari","kota":"Ungaran","mobil":"J7","teks":"Dijelaskan detail fitur dan simulasi kredit, tidak terburu-buru. Recommended."}]'::jsonb,
  '{"titleSuffix":"JAECOO J8 Semarang","defaultDescription":"Dealer resmi JAECOO Semarang, spesialis flagship J8 ARDIS. Harga OTR, simulasi kredit, dan test drive. Konsultasi via WhatsApp.","ogImage":"/img/og/premium.jpg","locale":"id_ID"}'::jsonb,
  '{"instagram":"https://instagram.com/","tiktok":"https://tiktok.com/"}'::jsonb
)
on conflict (id) do nothing;
