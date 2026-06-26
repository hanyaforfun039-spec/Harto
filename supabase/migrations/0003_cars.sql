-- =============================================================================
-- jaecoo-base · Migration 0003 — tabel `cars` (+ seed 5 mobil)
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

(
  'j5', 'JAECOO J5', 'J5', 'SUV Listrik Kompak', 'ev',
  'SUV listrik kompak bergaya Eropa untuk keseharian di Semarang.',
  '[{"nama":"J5 Pure","hargaOtr":279000000},{"nama":"J5 Premium","hargaOtr":309000000,"highlight":true}]'::jsonb,
  '[{"label":"Tenaga","value":"155 kW (210 hp)","icon":"power"},{"label":"Jarak Tempuh","value":"+/- 450 km (CLTC)","icon":"range"},{"label":"Baterai","value":"60,9 kWh LFP","icon":"battery"},{"label":"Penggerak","value":"FWD","icon":"drivetrain"}]'::jsonb,
  '["Atap panoramik kaca","Layar sentuh 15,6 inci","ADAS Level 2 (asisten berkendara)","Pengisian cepat DC, 30-80% sekitar 30 menit","Kamera parkir 540 derajat"]'::jsonb,
  '{"hero":{"src":"j5/hero.jpg","alt":"JAECOO J5 Premium tampak depan tiga perempat"},"galeri":[{"src":"j5/samping.jpg","alt":"JAECOO J5 tampak samping"},{"src":"j5/interior.jpg","alt":"JAECOO J5 tampak interior dashboard"},{"src":"j5/belakang.jpg","alt":"JAECOO J5 tampak belakang"}]}'::jsonb,
  '[{"q":"Berapa harga OTR JAECOO J5 di Semarang?","a":"Harga OTR Semarang mulai dari Rp 279 juta untuk varian Pure. Hubungi via WhatsApp untuk penawaran dan ketersediaan stok terbaru."},{"q":"Berapa jarak tempuh sekali pengisian penuh?","a":"Estimasi sekitar 450 km (standar CLTC). Jarak nyata bisa berbeda tergantung gaya berkendara dan kondisi jalan."},{"q":"Apakah bisa dibeli secara kredit?","a":"Bisa. Gunakan kalkulator simulasi cicilan di halaman ini, lalu kirim hasilnya ke WhatsApp untuk diproses."}]'::jsonb,
  1
),

(
  'j7', 'JAECOO J7', 'J7', 'SUV Menengah', 'ice',
  'SUV menengah 1.6 Turbo dengan kabin senyap berasa premium.',
  '[{"nama":"J7 Lux","hargaOtr":549900000},{"nama":"J7 Premium AWD","hargaOtr":589900000,"highlight":true}]'::jsonb,
  '[{"label":"Mesin","value":"1.6L Turbo (TGDI)","icon":"engine"},{"label":"Tenaga","value":"145 kW (197 hp)","icon":"power"},{"label":"Torsi","value":"290 Nm","icon":"torque"},{"label":"Penggerak","value":"FWD / AWD","icon":"drivetrain"},{"label":"Konsumsi","value":"+/- 15,2 km/l","icon":"fuel"}]'::jsonb,
  '["Desain eksterior bergaya Eropa","Atap panoramik","Audio Sony 8 speaker","Paket ADAS lengkap","Pilihan penggerak FWD atau AWD","Kursi kulit berventilasi"]'::jsonb,
  '{"hero":{"src":"j7/hero.jpg","alt":"JAECOO J7 Premium AWD tampak depan tiga perempat"},"galeri":[{"src":"j7/samping.jpg","alt":"JAECOO J7 tampak samping"},{"src":"j7/interior.jpg","alt":"JAECOO J7 tampak interior dashboard"},{"src":"j7/belakang.jpg","alt":"JAECOO J7 tampak belakang"}]}'::jsonb,
  '[{"q":"Berapa harga OTR JAECOO J7 di Semarang?","a":"Harga OTR Semarang mulai dari Rp 549,9 juta untuk varian Lux. Hubungi via WhatsApp untuk penawaran terbaik."},{"q":"Apa beda varian Lux dan Premium AWD?","a":"Premium AWD menambah penggerak semua roda dan kelengkapan fitur di atas varian Lux. Detail lengkap dapat dikonsultasikan via WhatsApp."},{"q":"Bagaimana cara mengatur test drive?","a":"Isi formulir test drive di halaman ini. Jadwal akan kami atur di Semarang dan sekitarnya sesuai waktu Anda."},{"q":"Apakah tersedia simulasi kredit?","a":"Tersedia. Atur DP dan tenor di kalkulator, lalu kirim simulasinya ke WhatsApp untuk diproses lebih lanjut."}]'::jsonb,
  2
),

(
  'j7-shs', 'JAECOO J7 SHS', 'J7 SHS', 'SUV Hybrid (PHEV)', 'phev',
  'Plug-in hybrid: irit harian seperti mobil listrik, tenang untuk jarak jauh.',
  '[{"nama":"J7 SHS","hargaOtr":599000000,"highlight":true}]'::jsonb,
  '[{"label":"Sistem","value":"Super Hybrid (PHEV)","icon":"engine"},{"label":"Tenaga Gabungan","value":"255 kW (347 hp)","icon":"power"},{"label":"Jarak EV","value":"+/- 106 km (NEDC)","icon":"range"},{"label":"Konsumsi","value":"+/- 1,0 L/100km (gabungan)","icon":"fuel"},{"label":"Penggerak","value":"FWD","icon":"drivetrain"}]'::jsonb,
  '["Mesin bensin + motor listrik","Bisa mode penuh listrik untuk harian","Pengisian AC dan DC","Pengereman regeneratif","ADAS Level 2"]'::jsonb,
  '{"hero":{"src":"j7-shs/hero.jpg","alt":"JAECOO J7 SHS tampak depan tiga perempat"},"galeri":[{"src":"j7-shs/samping.jpg","alt":"JAECOO J7 SHS tampak samping"},{"src":"j7-shs/interior.jpg","alt":"JAECOO J7 SHS tampak interior dashboard"},{"src":"j7-shs/belakang.jpg","alt":"JAECOO J7 SHS tampak belakang"}]}'::jsonb,
  '[{"q":"Apa itu SHS pada JAECOO J7 SHS?","a":"SHS (Super Hybrid System) adalah sistem plug-in hybrid: menggabungkan mesin bensin dan motor listrik sehingga bisa berjalan penuh listrik untuk pemakaian harian."},{"q":"Apakah baterainya perlu diisi seperti mobil listrik?","a":"Untuk hasil paling irit, baterai bisa diisi (AC/DC). Namun tetap bisa berjalan tanpa mengisi karena mesin bensin mengisi baterai."},{"q":"Berapa konsumsi bahan bakarnya?","a":"Estimasi sangat irit pada pemakaian gabungan. Angka nyata bergantung rute dan kebiasaan mengisi daya."}]'::jsonb,
  3
),

(
  'j8-ardis', 'JAECOO J8 ARDIS', 'J8 ARDIS', 'Flagship SUV', 'ice',
  'Flagship SUV: kehadiran berkelas dengan kemampuan AWD sesungguhnya.',
  '[{"nama":"J8 ARDIS","hargaOtr":689900000},{"nama":"J8 ARDIS Inspire AWD","hargaOtr":729000000,"highlight":true}]'::jsonb,
  '[{"label":"Mesin","value":"2.0L Turbo (TGDI)","icon":"engine"},{"label":"Tenaga","value":"183 kW (248 hp)","icon":"power"},{"label":"Torsi","value":"385 Nm","icon":"torque"},{"label":"Penggerak","value":"AWD","icon":"drivetrain"},{"label":"Transmisi","value":"Otomatis 8 percepatan","icon":"transmission"}]'::jsonb,
  '["Desain flagship ARDIS","Sistem audio premium 14 speaker","Kursi nappa berventilasi dengan pijat","ADAS Level 2+","Mode berkendara off-road","Interior lapang tiga baris (opsional)"]'::jsonb,
  '{"hero":{"src":"j8-ardis/hero.jpg","alt":"JAECOO J8 ARDIS Inspire AWD tampak depan tiga perempat"},"galeri":[{"src":"j8-ardis/samping.jpg","alt":"JAECOO J8 ARDIS tampak samping"},{"src":"j8-ardis/interior.jpg","alt":"JAECOO J8 ARDIS tampak interior dashboard"},{"src":"j8-ardis/belakang.jpg","alt":"JAECOO J8 ARDIS tampak belakang"}]}'::jsonb,
  '[{"q":"Berapa harga OTR JAECOO J8 ARDIS di Semarang?","a":"Harga OTR Semarang mulai dari Rp 689,9 juta. Untuk penawaran khusus dan ketersediaan warna, hubungi via WhatsApp."},{"q":"Apakah J8 ARDIS bergerak dengan penggerak AWD?","a":"Ya, J8 ARDIS hadir dengan penggerak semua roda (AWD) untuk pengendalian lebih mantap di berbagai kondisi jalan."},{"q":"Apakah tersedia paket kredit untuk flagship ini?","a":"Tersedia. Simulasikan cicilan sesuai DP dan tenor pilihan Anda, lalu kirim ke WhatsApp untuk proses lebih lanjut."}]'::jsonb,
  4
),

(
  'j8-shs-ardis', 'JAECOO J8 SHS ARDIS', 'J8 SHS ARDIS', 'Flagship SUV Hybrid', 'phev',
  'Puncak lineup: kemewahan flagship dengan efisiensi plug-in hybrid.',
  '[{"nama":"J8 SHS ARDIS","hargaOtr":818000000,"highlight":true}]'::jsonb,
  '[{"label":"Sistem","value":"Super Hybrid (PHEV)","icon":"engine"},{"label":"Tenaga Gabungan","value":"350 kW (476 hp)","icon":"power"},{"label":"Jarak EV","value":"+/- 150 km","icon":"range"},{"label":"Penggerak","value":"AWD","icon":"drivetrain"},{"label":"Konsumsi","value":"+/- 1,2 L/100km (gabungan)","icon":"fuel"}]'::jsonb,
  '["Flagship plug-in hybrid","Akselerasi instan dua motor listrik","Kabin senyap kelas atas","Pengisian cepat DC","ADAS Level 2+","Interior nappa premium"]'::jsonb,
  '{"hero":{"src":"j8-shs-ardis/hero.jpg","alt":"JAECOO J8 SHS ARDIS tampak depan tiga perempat"},"galeri":[{"src":"j8-shs-ardis/samping.jpg","alt":"JAECOO J8 SHS ARDIS tampak samping"},{"src":"j8-shs-ardis/interior.jpg","alt":"JAECOO J8 SHS ARDIS tampak interior dashboard"},{"src":"j8-shs-ardis/belakang.jpg","alt":"JAECOO J8 SHS ARDIS tampak belakang"}]}'::jsonb,
  '[{"q":"Apa keunggulan J8 SHS ARDIS dibanding J8 ARDIS biasa?","a":"Versi SHS menambahkan sistem plug-in hybrid: tenaga gabungan lebih besar sekaligus jauh lebih irit, dengan kemampuan jalan penuh listrik untuk harian."},{"q":"Berapa harga OTR-nya di Semarang?","a":"Harga OTR Semarang di kisaran Rp 818 juta. Hubungi via WhatsApp untuk penawaran terbaik dan ketersediaan unit."},{"q":"Apakah bisa test drive flagship ini?","a":"Bisa, sesuai ketersediaan unit. Isi formulir test drive dan kami akan mengatur jadwalnya."}]'::jsonb,
  5
)

on conflict (slug) do nothing;
