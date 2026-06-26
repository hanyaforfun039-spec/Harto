/* =============================================================================
   jaecoo-base · SUPABASE CLIENT
   Satu instance client untuk dipakai di build-time (fetch data ke HTML statis)
   maupun client-side (mis. banner pengumuman yang on/off-nya instan).
   -----------------------------------------------------------------------------
   Kunci yang dipakai: PUBLISHABLE key (anon). AMAN tampil di browser —
   keamanan dijaga oleh RLS di database, bukan kerahasiaan kunci ini.
   Operasi tulis (admin) nanti lewat sesi login Supabase Auth + policy RLS.
   ============================================================================ */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    '[supabase] Env belum diset. Isi PUBLIC_SUPABASE_URL & PUBLIC_SUPABASE_ANON_KEY di .env (lihat .env.example).',
  );
}

export const supabase = createClient(url, key, {
  auth: {
    // Build statis & pembacaan publik tidak butuh sesi tersimpan.
    // Diaktifkan nanti saat admin panel pakai login.
    persistSession: false,
    autoRefreshToken: false,
  },
});
