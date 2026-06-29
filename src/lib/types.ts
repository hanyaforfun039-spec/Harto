/* =============================================================================
   jaecoo-base · TYPES
   Bentuk data untuk cars.json dan site config. Satu sumber kebenaran tipe.
   ============================================================================ */

export type Powertrain = 'ice' | 'phev' | 'ev';
export type ThemeId = 'premium' | 'hybrid' | 'kredit' | 'area';
export type SiteId = ThemeId;
export type HeroVariant = 'calculator-first' | 'car-first' | 'premium-fullbleed';

export interface CarVariant {
  nama: string;
  hargaOtr: number; // angka penuh, mis. 689900000
  highlight?: boolean;
}

export interface CarSpec {
  label: string;
  value: string;
  icon: string; // key ikon SVG: engine|power|torque|drivetrain|fuel|range|battery|transmission
}

export interface CarFaq {
  q: string;
  a: string;
}

export interface CarImage {
  src: string; // path lokal relatif "j8-ardis/hero.jpg" ATAU URL absolut Supabase Storage (https://...)
  alt: string;
}

export interface Car {
  slug: string;
  nama: string; // "JAECOO J8 ARDIS"
  namaPendek: string; // "J8 ARDIS"
  kategori: string;
  powertrain: Powertrain;
  tagline: string;
  varian: CarVariant[];
  specs: CarSpec[];
  fitur: string[];
  foto: { hero: CarImage; galeri: CarImage[] };
  faq: CarFaq[];
}

export interface OpeningHour {
  hari: string; // "Senin - Sabtu"
  buka: string; // "08:30"
  tutup: string; // "17:00"
}

export interface Testimoni {
  nama: string;
  kota: string;
  mobil: string;
  teks: string;
}

export interface Promo {
  aktif: boolean;
  headline: string;
  sub: string;
  deadline?: string; // ISO date, mis. "2026-06-30"
}

export interface SiteConfig {
  id: SiteId;
  theme: ThemeId;

  /* Identitas */
  brand: string; // nama situs/dealer pendek, mis. "JAECOO Semarang"
  dealerName: string; // nama dealer lengkap (untuk schema)
  salesName: string;
  salesTitle: string;
  salesCredentials: string[];

  /* Kontak */
  whatsapp: string; // E.164 tanpa '+', mis. "628120000001"
  phoneDisplay: string;
  email?: string;

  /* Lokasi & layanan */
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string; // kode ISO, "ID"
  };
  geo?: { lat: number; lng: number };
  serviceAreas: string[];
  openingHours: OpeningHour[];
  mapUrl?: string;

  /* Positioning & copy */
  tagline: string;
  subheadline: string;
  positioning: string;
  heroVariant: HeroVariant;
  heroCarSlug: string;
  heroHeadline?: string; // override H1 hero (kalau kosong pakai tagline)
  heroStat?: { value: string; unit: string; label: string; note?: string }; // angka pamungkas hero (mis. efisiensi), ganti harga di car-first

  /* Lineup */
  lineup: string[]; // urutan slug
  featuredSlug: string;

  /* Kredit (untuk kalkulator) */
  kredit: {
    bungaFlatPctPerYear: number;
    dpDefaultPct: number;
    tenorDefaultYears: number;
  };

  /* Efisiensi (Web2 "Harto" — kalkulator hemat BBM di hero). Opsional: hanya
     site hybrid yang mengisinya. Angka = placeholder, diisi data resmi. */
  efisiensi?: {
    bbmDefault: number; // Rp/liter
    kmDefault: number; // km/bulan awal slider
    baselineDefaultKmpl: number; // konsumsi mobil lama default (km/L)
    baselinePresets: { label: string; kmpl: number }[];
    model: Record<string, { kmpl: number; rangeKm: number }>; // per slug: konsumsi efektif setara bensin + jangkauan
  };

  /* Promo & trust */
  promo: Promo;
  testimoni: Testimoni[];

  /* SEO */
  seo: {
    titleSuffix: string;
    defaultDescription: string;
    ogImage: string; // path, mis. "/img/og/premium.jpg"
    locale: string; // "id_ID"
  };

  social?: { instagram?: string; tiktok?: string; facebook?: string };

  /* Storage aset MILIK SALES INI (bucket Supabase tersendiri di project bersama):
     foto serah terima (SPK) + foto konsultan. Foto katalog mobil TIDAK di sini
     (itu dibagi). Bila kosong → komponen pakai default lama (bucket "Harto"). */
  storage?: {
    bucket: string;            // nama bucket, mis. "Harto" | "Andre"
    consultantPhoto?: string;  // nama file foto konsultan, mis. "Foto Harto.webp"
    deliveryCount?: number;    // jumlah foto SPK berurutan: SPK1..SPK{n}
    deliveryFiles?: string[];  // ATAU daftar nama file eksplisit (mengalahkan deliveryCount)
  };
}
