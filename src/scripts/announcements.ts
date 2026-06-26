/* =============================================================================
   jaecoo-base · ANNOUNCEMENTS (client-side, instan)
   -----------------------------------------------------------------------------
   Tarik banner pengumuman AKTIF dari Supabase saat halaman dibuka. Tidak butuh
   rebuild: sales toggle `aktif` di dashboard -> langsung muncul/hilang.
   Pakai fetch polos (bukan supabase-js) supaya bundle tetap ramping.
   Markup statis ada di AnnouncementBar.astro; skrip ini hanya mengisi & menampilkan.
   ============================================================================ */
const SB_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SB_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const STORE_KEY = 'pengumuman-tutup'; // simpan id yang sudah ditutup user

interface Announcement {
  id: string;
  pesan: string;
  url: string | null;
  url_label: string | null;
  mulai: string | null;
  selesai: string | null;
  prioritas: number;
}

const el = document.getElementById('pengumuman');
if (el && SB_URL && SB_KEY) void init(el);

async function init(bar: HTMLElement): Promise<void> {
  const siteId = bar.dataset.site ?? '';

  let rows: Announcement[];
  try {
    const q =
      `select=id,pesan,url,url_label,mulai,selesai,prioritas` +
      `&site_id=in.(${siteId},all)&aktif=eq.true` +
      `&order=prioritas.desc,created_at.desc`;
    const res = await fetch(`${SB_URL}/rest/v1/announcements?${q}`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    });
    if (!res.ok) return;
    rows = await res.json();
  } catch {
    return; // jaringan gagal -> diam saja, halaman tetap normal
  }

  const now = Date.now();
  const a = rows.find((r) => {
    const startOk = !r.mulai || new Date(r.mulai).getTime() <= now;
    const endOk = !r.selesai || new Date(r.selesai).getTime() >= now;
    return startOk && endOk;
  });
  if (!a) return;
  if (safeGet(STORE_KEY) === a.id) return; // sudah ditutup user

  const text = bar.querySelector<HTMLElement>('.announce-text');
  if (text) text.textContent = a.pesan;

  const link = bar.querySelector<HTMLAnchorElement>('.announce-link');
  if (link && a.url) {
    link.href = a.url;
    link.textContent = a.url_label || 'Selengkapnya';
    link.hidden = false;
  }

  bar.hidden = false;

  bar.querySelector('.announce-close')?.addEventListener('click', () => {
    bar.hidden = true;
    safeSet(STORE_KEY, a.id);
  });
}

function safeGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function safeSet(k: string, v: string): void {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* localStorage diblokir -> abaikan */
  }
}
