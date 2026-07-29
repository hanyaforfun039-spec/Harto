/* =============================================================================
   jaecoo-base · PENYEGAR HARGA (client)
   -----------------------------------------------------------------------------
   Pola HIBRIDA. Harga tetap DICETAK ke HTML saat build — jadi Google, pembaca
   tanpa JavaScript, dan pengunjung di detik pertama semuanya melihat angka.
   Skrip ini lalu mengambil harga terkini dari Supabase dan HANYA memperbaiki
   yang berbeda. Efeknya: ubah harga di panel langsung terlihat pengunjung,
   tanpa menunggu rebuild, tapi keunggulan SEO tidak dikorbankan.

   Gagal apa pun (jaringan mati, tabel berubah, Supabase down) -> diam saja.
   Halaman tetap menampilkan angka hasil build, yang selalu masuk akal.

   Fungsi hitung & format diimpor dari lib yang sama dengan sisi server, jadi
   tidak ada rumus yang ditulis dua kali. Hanya ANGKA yang datang dari jaringan.
   ============================================================================ */
import { site } from '../lib/site';
import { estimasiCicilanDefault } from '../lib/credit';
import { formatRupiah, formatRupiahShort } from '../lib/format';

interface Varian {
  nama: string;
  hargaOtr: number;
}

const SB_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SB_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const adaTitik = document.querySelector(
  '[data-harga-mulai],[data-harga-cicilan],[data-harga-varian],[data-calculator]',
);
if (SB_URL && SB_KEY && adaTitik) void segarkan();

async function segarkan(): Promise<void> {
  let baris: { slug: string; varian: Varian[] }[];
  try {
    const res = await fetch(`${SB_URL}/rest/v1/cars?select=slug,varian`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    });
    if (!res.ok) return;
    baris = await res.json();
  } catch {
    return; // jaringan gagal -> biarkan angka hasil build
  }

  const peta = new Map<string, Varian[]>();
  for (const r of baris) {
    if (Array.isArray(r.varian) && r.varian.length) peta.set(r.slug, r.varian);
  }
  if (!peta.size) return;

  const mulai = (slug: string): number | null => {
    const v = peta.get(slug);
    if (!v) return null;
    const angka = v.map((x) => Number(x.hargaOtr)).filter((n) => Number.isFinite(n) && n > 0);
    return angka.length ? Math.min(...angka) : null;
  };

  /* --- "Mulai dari Rp …" (kartu, hero, lineup, kepala halaman detail) ----- */
  for (const el of document.querySelectorAll<HTMLElement>('[data-harga-mulai]')) {
    const h = mulai(el.dataset.hargaMulai!);
    if (h === null) continue;
    tulis(el, el.dataset.hargaFmt === 'short' ? formatRupiahShort(h) : formatRupiah(h));
  }

  /* --- "Estimasi cicilan Rp …/bln" --------------------------------------- */
  for (const el of document.querySelectorAll<HTMLElement>('[data-harga-cicilan]')) {
    const h = mulai(el.dataset.hargaCicilan!);
    if (h === null) continue;
    tulis(el, formatRupiah(estimasiCicilanDefault(h, site).cicilanPerBulan));
  }

  /* --- Tabel varian di halaman detail -------------------------------------
     Dicocokkan berdasarkan NAMA varian, bukan urutan — supaya menambah atau
     menghapus varian di panel tidak membuat harga tertukar antar baris.
     Varian yang namanya tak lagi ada dibiarkan apa adanya sampai rebuild. */
  for (const tabel of document.querySelectorAll<HTMLElement>('[data-harga-varian]')) {
    const v = peta.get(tabel.dataset.hargaVarian!);
    if (!v) continue;
    const harga = new Map(v.map((x) => [x.nama, Number(x.hargaOtr)]));
    for (const sel of tabel.querySelectorAll<HTMLElement>('[data-varian-nama]')) {
      const h = harga.get(sel.dataset.varianNama!);
      if (h != null && Number.isFinite(h)) tulis(sel, formatRupiah(h));
    }
  }

  /* --- Kalkulator kredit --------------------------------------------------
     Perbarui data-otr tiap <option>, lalu picu 'change' supaya calculator.ts
     menghitung ulang memakai angka baru. */
  for (const pilih of document.querySelectorAll<HTMLSelectElement>('[data-calculator] .calc-model')) {
    let berubah = false;
    for (const opt of pilih.options) {
      const h = mulai(opt.value);
      if (h === null || String(h) === opt.dataset.otr) continue;
      opt.dataset.otr = String(h);
      const label = opt.dataset.nama ? `${opt.dataset.nama} — mulai ${formatRupiahShort(h)}` : opt.textContent;
      if (label && opt.textContent !== label) opt.textContent = label;
      berubah = true;
    }
    if (berubah) pilih.dispatchEvent(new Event('change'));
  }
}

/** Hanya menyentuh DOM bila teksnya memang berbeda — hindari kerja sia-sia. */
function tulis(el: HTMLElement, teks: string): void {
  if (el.textContent !== teks) el.textContent = teks;
}
