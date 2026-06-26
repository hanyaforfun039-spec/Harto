-- =============================================================================
-- jaecoo-base · Migration 0004 — tabel `announcements`
-- Pola BEDA dari sites/cars: dibaca CLIENT-SIDE (instan, TANPA rebuild).
-- Sales tinggal toggle `aktif` di dashboard → banner muncul/hilang langsung di web.
-- RLS hanya ekspos baris AKTIF (draft tidak bocor ke publik).
-- Trigger set_updated_at() sudah dibuat di 0001 — dipakai ulang.
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- =============================================================================

create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  site_id     text not null,                 -- 'premium'|'hybrid'|'kredit'|'area' | 'all' (semua situs)
  aktif       boolean not null default false,
  pesan       text not null,
  tipe        text not null default 'info',  -- info | promo | sukses (untuk styling nanti)
  url         text,                          -- opsional: link CTA (mis. wa.me)
  url_label   text,
  mulai       timestamptz,                   -- opsional: jadwal mulai tampil
  selesai     timestamptz,                   -- opsional: jadwal berhenti tampil
  prioritas   int not null default 0,        -- makin besar makin diutamakan
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_announcements_site_aktif
  on public.announcements (site_id, aktif);

drop trigger if exists trg_announcements_updated_at on public.announcements;
create trigger trg_announcements_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;

-- Publik HANYA boleh baca baris aktif (draft aktif=false tetap privat).
drop policy if exists "announcements_public_read_active" on public.announcements;
create policy "announcements_public_read_active"
  on public.announcements for select
  to anon, authenticated
  using (aktif = true);

-- =============================================================================
-- Seed contoh (situs premium) — id tetap supaya idempoten.
-- Set aktif=false di dashboard kalau belum mau tampil.
-- =============================================================================
insert into public.announcements (
  id, site_id, aktif, pesan, tipe, url, url_label, prioritas
) values (
  '00000000-0000-0000-0000-000000000001',
  'premium', true,
  'Unit J8 ARDIS ready stock terbatas bulan ini — jadwalkan test drive sekarang.',
  'promo',
  'https://wa.me/628120000001', 'Chat sekarang', 10
)
on conflict (id) do nothing;
