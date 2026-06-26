-- =============================================================================
-- jaecoo-base · Migration 0002 — seed 3 site sisanya (hybrid, kredit, area)
-- Melengkapi 0001 (yang sudah seed 'premium'). Sumber: src/data/sites/*.json.
-- Idempoten: on conflict (id) do nothing — aman dijalankan ulang.
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- =============================================================================

insert into public.sites (
  id, theme, brand, dealer_name, sales_name, sales_title, sales_credentials,
  whatsapp, phone_display, email,
  address, geo, service_areas, opening_hours, map_url,
  tagline, subheadline, positioning, hero_variant, hero_car_slug,
  lineup, featured_slug, kredit, promo, testimoni, seo, social
) values

-- ---- hybrid (Rani) --------------------------------------------------------
(
  'hybrid', 'hybrid', 'JAECOO Hybrid Semarang', 'Dealer Resmi JAECOO Semarang',
  'Rani', 'Sales Consultant JAECOO',
  '["Sales Consultant Resmi","Spesialis Super Hybrid (PHEV)","Melayani Semarang Raya"]'::jsonb,
  '628120000002', '0812-0000-0002', 'rani@example.com',
  '{"street":"Jl. Pemuda No. 000","locality":"Semarang","region":"Jawa Tengah","postalCode":"50132","country":"ID"}'::jsonb,
  '{"lat":-6.9839,"lng":110.4093}'::jsonb,
  '["Semarang","Ungaran","Salatiga","Kendal","Demak"]'::jsonb,
  '[{"hari":"Senin - Sabtu","buka":"08:30","tutup":"17:00"},{"hari":"Minggu","buka":"09:00","tutup":"15:00"}]'::jsonb,
  'https://maps.google.com/?q=JAECOO+Semarang',
  'Irit harian, tenang jarak jauh.',
  'JAECOO Super Hybrid (SHS) - rasa mobil listrik untuk keseharian, jangkauan bensin saat dibutuhkan.',
  'Spesialis JAECOO hybrid plug-in (J7 SHS & J8 SHS ARDIS) di Semarang. Efisiensi maksimal tanpa kompromi.',
  'car-first', 'j7-shs',
  '["j7-shs","j8-shs-ardis","j5","j7","j8-ardis"]'::jsonb,
  'j7-shs',
  '{"bungaFlatPctPerYear":3.8,"dpDefaultPct":20,"tenorDefaultYears":5}'::jsonb,
  '{"aktif":true,"headline":"Promo Hybrid Hemat Bulan Ini","sub":"Paket pengisian daya & bonus aksesori untuk pembelian J7 SHS.","deadline":"2026-06-30"}'::jsonb,
  '[{"nama":"Bapak Adi","kota":"Semarang","mobil":"J7 SHS","teks":"Konsumsi bahan bakar turun drastis untuk komuter harian. Penjelasannya sangat membantu."},{"nama":"Ibu Lina","kota":"Salatiga","mobil":"J7 SHS","teks":"Dibimbing soal cara isi daya dan perawatan hybrid. Pelayanan ramah dan sabar."}]'::jsonb,
  '{"titleSuffix":"JAECOO Hybrid Semarang","defaultDescription":"Spesialis JAECOO Super Hybrid (PHEV) di Semarang. Irit harian seperti mobil listrik. Harga OTR, simulasi kredit, dan test drive via WhatsApp.","ogImage":"/img/og/hybrid.jpg","locale":"id_ID"}'::jsonb,
  '{"instagram":"https://instagram.com/","tiktok":"https://tiktok.com/"}'::jsonb
),

-- ---- kredit (Rizal) -------------------------------------------------------
(
  'kredit', 'kredit', 'Kredit JAECOO Semarang', 'Dealer Resmi JAECOO Semarang',
  'Rizal', 'Sales Consultant JAECOO',
  '["Sales Consultant Resmi","Spesialis Kredit & DP Ringan","Bantu Proses Leasing"]'::jsonb,
  '628120000003', '0812-0000-0003', 'rizal@example.com',
  '{"street":"Jl. Pemuda No. 000","locality":"Semarang","region":"Jawa Tengah","postalCode":"50132","country":"ID"}'::jsonb,
  '{"lat":-6.9839,"lng":110.4093}'::jsonb,
  '["Semarang","Ungaran","Demak","Kendal","Kudus"]'::jsonb,
  '[{"hari":"Senin - Sabtu","buka":"08:30","tutup":"17:00"},{"hari":"Minggu","buka":"09:00","tutup":"15:00"}]'::jsonb,
  'https://maps.google.com/?q=JAECOO+Semarang',
  'Punya JAECOO, DP-nya ringan.',
  'Simulasi cicilan transparan, bantu pengajuan kredit sampai approve. Mulai dari JAECOO J5.',
  'Spesialis kredit JAECOO di Semarang. DP ringan, tenor fleksibel, simulasi jelas, proses dibantu sampai selesai.',
  'calculator-first', 'j7',
  '["j5","j7","j7-shs","j8-ardis","j8-shs-ardis"]'::jsonb,
  'j7',
  '{"bungaFlatPctPerYear":3.5,"dpDefaultPct":15,"tenorDefaultYears":6}'::jsonb,
  '{"aktif":true,"headline":"Program DP Ringan Bulan Ini","sub":"Cicilan terjangkau dengan tenor sampai 7 tahun. Konsultasi gratis.","deadline":"2026-06-30"}'::jsonb,
  '[{"nama":"Bapak Yusuf","kota":"Demak","mobil":"J7","teks":"DP-nya ringan dan simulasinya jelas dari awal. Proses kredit dibantu sampai approve."},{"nama":"Ibu Wati","kota":"Semarang","mobil":"J5","teks":"Awalnya ragu soal cicilan, tapi dijelaskan rinci tanpa biaya tersembunyi. Puas."}]'::jsonb,
  '{"titleSuffix":"Kredit JAECOO Semarang","defaultDescription":"Kredit JAECOO Semarang dengan DP ringan dan tenor fleksibel. Simulasi cicilan transparan, proses dibantu sampai approve. Konsultasi via WhatsApp.","ogImage":"/img/og/kredit.jpg","locale":"id_ID"}'::jsonb,
  '{"instagram":"https://instagram.com/","tiktok":"https://tiktok.com/"}'::jsonb
),

-- ---- area (Widya) ---------------------------------------------------------
(
  'area', 'area', 'JAECOO Ungaran Kendal Demak', 'Dealer Resmi JAECOO Semarang',
  'Widya', 'Sales Consultant JAECOO',
  '["Sales Consultant Resmi","Layanan Area Satelit","Siap Antar Unit Test Drive"]'::jsonb,
  '628120000004', '0812-0000-0004', 'widya@example.com',
  '{"street":"Jl. Pemuda No. 000","locality":"Semarang","region":"Jawa Tengah","postalCode":"50132","country":"ID"}'::jsonb,
  '{"lat":-6.9839,"lng":110.4093}'::jsonb,
  '["Ungaran","Kendal","Demak","Semarang","Boja","Mranggen"]'::jsonb,
  '[{"hari":"Senin - Sabtu","buka":"08:30","tutup":"17:00"},{"hari":"Minggu","buka":"09:00","tutup":"15:00"}]'::jsonb,
  'https://maps.google.com/?q=JAECOO+Semarang',
  'JAECOO dekat dengan Anda - Ungaran, Kendal, Demak.',
  'Layanan khusus area satelit Semarang. Test drive bisa diantar ke lokasi Anda.',
  'Sales JAECOO untuk area Ungaran, Kendal, dan Demak. Layanan dekat, test drive diantar, proses mudah.',
  'car-first', 'j7',
  '["j7","j5","j7-shs","j8-ardis","j8-shs-ardis"]'::jsonb,
  'j7',
  '{"bungaFlatPctPerYear":3.8,"dpDefaultPct":20,"tenorDefaultYears":5}'::jsonb,
  '{"aktif":true,"headline":"Layanan Antar Test Drive Area Satelit","sub":"Test drive JAECOO diantar ke Ungaran, Kendal, atau Demak. Jadwalkan via WhatsApp.","deadline":"2026-06-30"}'::jsonb,
  '[{"nama":"Bapak Tono","kota":"Kendal","mobil":"J7","teks":"Test drive diantar sampai rumah, tidak perlu jauh ke kota. Sangat membantu."},{"nama":"Ibu Rina","kota":"Demak","mobil":"J5","teks":"Pelayanan dekat dan responsif via WhatsApp. Proses pembelian jadi praktis."}]'::jsonb,
  '{"titleSuffix":"JAECOO Ungaran Kendal Demak","defaultDescription":"Sales JAECOO untuk area Ungaran, Kendal, dan Demak. Test drive diantar ke lokasi Anda. Harga OTR, simulasi kredit, dan konsultasi via WhatsApp.","ogImage":"/img/og/area.jpg","locale":"id_ID"}'::jsonb,
  '{"instagram":"https://instagram.com/","tiktok":"https://tiktok.com/"}'::jsonb
)

on conflict (id) do nothing;
