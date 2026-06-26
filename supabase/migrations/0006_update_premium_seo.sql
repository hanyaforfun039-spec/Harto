-- =============================================================================
-- jaecoo-base · 0006_update_premium_seo
-- -----------------------------------------------------------------------------
-- Faiz (site 'premium'): geser fokus unggulan ke J5 + lapisan SEO premium.
-- Selaras dgn src/data/sites/site-premium.json. WAJIB di-run: tanpa ini,
-- `npm run sync` saat build produksi mengembalikan config lama (fokus J8).
-- Idempoten: update baris id='premium', aman dijalankan ulang.
-- =============================================================================

update public.sites set
  sales_credentials = '["Sales Consultant Resmi","Harga OTR & Simulasi Kredit","Melayani Semarang & Jawa Tengah"]'::jsonb,
  service_areas     = '["Semarang","Ungaran","Salatiga","Kudus","Demak","Kendal","Surakarta"]'::jsonb,
  subheadline       = 'Dari JAECOO J5 listrik yang irit hingga J8 ARDIS flagship — harga OTR, simulasi kredit & test drive di Semarang.',
  positioning       = 'Dealer resmi JAECOO di Semarang — dari J5 listrik sampai J8 ARDIS flagship. Konsultasi, penawaran terbaik, dan test drive untuk Semarang & Jawa Tengah.',
  hero_car_slug     = 'j5',
  lineup            = '["j5","j7","j7-shs","j8-ardis","j8-shs-ardis"]'::jsonb,
  featured_slug     = 'j5',
  promo             = '{"aktif":true,"headline":"Penawaran JAECOO Semarang Bulan Ini","sub":"Harga terbaik, tukar tambah & paket perawatan untuk JAECOO J5, J7, hingga J8 ARDIS.","deadline":"2026-06-30"}'::jsonb,
  seo               = '{"titleSuffix":"JAECOO Semarang","defaultDescription":"Dealer resmi JAECOO Semarang: JAECOO J5, J7 & J8 ARDIS. Harga OTR, simulasi kredit & test drive. Melayani Semarang, Solo & Jawa Tengah. Chat WhatsApp Faiz.","ogImage":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J5-banner.webp","locale":"id_ID"}'::jsonb
where id = 'premium';
