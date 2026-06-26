-- =============================================================================
-- jaecoo-base · 0005_update_cars_foto
-- -----------------------------------------------------------------------------
-- Arahkan kolom public.cars.foto ke URL PUBLIK Supabase Storage (bucket "Faiz").
-- Pola: hero = file *-banner, galeri = varian warna. j7-shs & j8-shs-ardis
-- memakai ulang foto warna J7/J8 (bodi sama). Idempoten: update by slug, aman
-- dijalankan ulang. Selaras dgn src/data/cars.json (cache yg ditulis ulang sync).
-- =============================================================================

update public.cars set foto = '{
  "hero": {"alt":"JAECOO J5","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J5-banner.webp"},
  "galeri": [
    {"alt":"JAECOO J5 warna Hitam","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J5%20Black.webp"},
    {"alt":"JAECOO J5 warna Putih","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J5%20White.webp"},
    {"alt":"JAECOO J5 warna Hijau","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J5%20Green.webp"}
  ]
}'::jsonb where slug = 'j5';

update public.cars set foto = '{
  "hero": {"alt":"JAECOO J7","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-banner.webp"},
  "galeri": [
    {"alt":"JAECOO J7 warna Hitam","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-Black.webp"},
    {"alt":"JAECOO J7 warna Putih","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-White.webp"},
    {"alt":"JAECOO J7 warna Silver","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-Silver.webp"},
    {"alt":"JAECOO J7 warna Stone Grey","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-Stonegrey.webp"}
  ]
}'::jsonb where slug = 'j7';

update public.cars set foto = '{
  "hero": {"alt":"JAECOO J7 SHS","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-shs-banner.webp"},
  "galeri": [
    {"alt":"JAECOO J7 SHS warna Hitam","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-Black.webp"},
    {"alt":"JAECOO J7 SHS warna Putih","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-White.webp"},
    {"alt":"JAECOO J7 SHS warna Silver","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-Silver.webp"},
    {"alt":"JAECOO J7 SHS warna Stone Grey","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J7-Stonegrey.webp"}
  ]
}'::jsonb where slug = 'j7-shs';

update public.cars set foto = '{
  "hero": {"alt":"JAECOO J8 ARDIS","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8-ardis-banner.webp"},
  "galeri": [
    {"alt":"JAECOO J8 ARDIS","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/j8%20Ardis.webp"},
    {"alt":"JAECOO J8 ARDIS warna Hitam","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20Black.webp"},
    {"alt":"JAECOO J8 ARDIS warna Putih","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20White.webp"},
    {"alt":"JAECOO J8 ARDIS warna Silver","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20Silver.webp"},
    {"alt":"JAECOO J8 ARDIS warna Hijau","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20Green.webp"}
  ]
}'::jsonb where slug = 'j8-ardis';

update public.cars set foto = '{
  "hero": {"alt":"JAECOO J8 SHS ARDIS","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8-shs-banner.webp"},
  "galeri": [
    {"alt":"JAECOO J8 SHS ARDIS warna Hitam","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20Black.webp"},
    {"alt":"JAECOO J8 SHS ARDIS warna Putih","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20White.webp"},
    {"alt":"JAECOO J8 SHS ARDIS warna Silver","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20Silver.webp"},
    {"alt":"JAECOO J8 SHS ARDIS warna Hijau","src":"https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/J8%20Green.webp"}
  ]
}'::jsonb where slug = 'j8-shs-ardis';
