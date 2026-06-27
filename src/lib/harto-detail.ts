/* =============================================================================
   jaecoo-base · HARTO DETAIL DATA
   Data tambahan halaman model (spesifikasi lengkap + ADAS) sebagai OVERRIDE
   non-sync (cars.json di-sync dari Supabase, jadi tak diedit di sana).
   ============================================================================ */

export interface SpecGroup {
  kategori: string;
  items: { label: string; value: string }[];
}

/* Spesifikasi lengkap per model (dikelompokkan agar rapi & mudah dibaca). */
export const specsOverride: Record<string, SpecGroup[]> = {
  j5: [
    {
      kategori: 'Motor & Performa',
      items: [
        { label: 'Tipe Motor', value: 'Permanent Magnet Synchronous Motor' },
        { label: 'Tenaga Maksimum', value: '155 kW' },
        { label: 'Torsi', value: '288 Nm' },
        { label: '0–100 km/jam', value: '7,3 detik' },
        { label: 'Kecepatan Maksimum', value: '160 km/jam' },
      ],
    },
    {
      kategori: 'Baterai & Jarak Tempuh',
      items: [
        { label: 'Kapasitas Baterai', value: '60,9 kWh (LFP)' },
        { label: 'Jarak Tempuh (NEDC)', value: '401 km' },
        { label: 'Jarak Tempuh (WLTP)', value: '350 km' },
        { label: 'Pengisian Cepat (DC)', value: '± 0,5 jam' },
        { label: 'Pengisian Normal (AC)', value: '± 8 jam' },
      ],
    },
    {
      kategori: 'Penggerak',
      items: [
        { label: 'Penggerak', value: 'FWD' },
        { label: 'Transmisi', value: 'Single-Speed Otomatis' },
        { label: 'Mode Berkendara', value: '3 Mode' },
      ],
    },
    {
      kategori: 'Dimensi',
      items: [
        { label: 'P × L × T', value: '4.358 × 1.830 × 1.650 mm' },
        { label: 'Wheelbase', value: '2.630 mm' },
        { label: 'Ground Clearance', value: '180 mm' },
        { label: 'Wading Depth', value: '450 mm' },
      ],
    },
    {
      kategori: 'Kapasitas',
      items: [
        { label: 'Tempat Duduk', value: '5 orang' },
        { label: 'Volume Bagasi', value: '420 L' },
      ],
    },
    {
      kategori: 'Keselamatan & Teknologi',
      items: [
        { label: 'Airbag', value: '6 Airbag' },
        { label: 'Rating C-NCAP', value: '5 Bintang' },
        { label: 'ADAS', value: '17 Fitur' },
        { label: 'Layar Infotainment', value: '10,25 inci' },
        { label: 'Panel Instrumen Digital', value: '10,25 inci' },
        { label: 'Wireless Charger', value: '50 W' },
        { label: 'Lainnya', value: 'Panoramic sunroof, LED headlights, AI Voice Assistant' },
      ],
    },
  ],
  'j7-shs': [
    {
      kategori: 'Powertrain',
      items: [
        { label: 'Tipe', value: '1.5T + 1DHT (Dedicated Hybrid Transmission)' },
        { label: 'Efisiensi Termal', value: '44,5%' },
        { label: 'Tenaga Motor Listrik', value: '201 hp' },
        { label: 'Tenaga Mesin', value: '140 hp' },
        { label: 'Torsi Motor', value: '310 Nm' },
        { label: 'Torsi Mesin', value: '215 Nm' },
      ],
    },
    {
      kategori: 'Performa',
      items: [
        { label: '0–100 km/jam', value: '7,3 detik' },
        { label: 'Kecepatan Maksimum', value: '180 km/jam' },
      ],
    },
    {
      kategori: 'Baterai & Jarak Tempuh',
      items: [
        { label: 'Kapasitas Baterai', value: '18,3 kWh' },
        { label: 'Mode EV Murni', value: '± 100 km' },
        { label: 'Jangkauan Total', value: '± 1.300 km' },
      ],
    },
    {
      kategori: 'Dimensi',
      items: [
        { label: 'Wheelbase', value: '2.672 mm' },
        { label: 'Ground Clearance', value: '200 mm' },
      ],
    },
    {
      kategori: 'Keselamatan & Teknologi',
      items: [
        { label: 'Airbag', value: '8 Airbag' },
        { label: 'ADAS', value: '19 Fitur' },
        { label: 'Center Display', value: '14,8 inci' },
        { label: 'Wireless Charger', value: '50 W' },
        { label: 'Audio', value: 'Sony Premium 8 Speaker' },
      ],
    },
  ],
  'j8-shs-ardis': [
    {
      kategori: 'Powertrain',
      items: [
        { label: 'Tipe', value: '1.5TGDI Plug-in Hybrid' },
        { label: 'Tenaga Sistem Gabungan', value: '530 hp' },
        { label: 'Torsi Sistem Gabungan', value: '650 Nm' },
      ],
    },
    {
      kategori: 'Performa',
      items: [{ label: '0–100 km/jam', value: '5,4 detik' }],
    },
    {
      kategori: 'Baterai & Jarak Tempuh',
      items: [
        { label: 'Kapasitas Baterai', value: '34,46 kWh' },
        { label: 'Mode EV Murni', value: '± 180 km' },
        { label: 'Jangkauan Total', value: '± 1.400 km' },
      ],
    },
    {
      kategori: 'Penggerak & Sasis',
      items: [
        { label: 'Penggerak', value: 'ARDIS All-Wheel Drive' },
        { label: 'Suspensi', value: 'CDC Magnetic Suspension' },
      ],
    },
    {
      kategori: 'Dimensi',
      items: [
        { label: 'P × L × T', value: '4.820 × 1.930 × 1.710 mm' },
        { label: 'Wheelbase', value: '2.820 mm' },
      ],
    },
    {
      kategori: 'Keselamatan',
      items: [
        { label: 'Airbag', value: '10 Airbag' },
        { label: 'ADAS', value: '19 Fitur' },
      ],
    },
  ],
  'j8-ardis': [
    {
      kategori: 'Mesin',
      items: [
        { label: 'Tipe Mesin', value: '2.0L Turbo, 4 Silinder 16 Katup DOHC' },
        { label: 'Tenaga Maksimum', value: '245 hp' },
        { label: 'Torsi Maksimum', value: '385 Nm' },
      ],
    },
    {
      kategori: 'Transmisi & Penggerak',
      items: [
        { label: 'Transmisi', value: '8-Speed Otomatis' },
        { label: 'Penggerak', value: 'ARDIS Terrain Response AWD' },
      ],
    },
    {
      kategori: 'Dimensi',
      items: [
        { label: 'P × L × T', value: '4.820 × 1.930 × 1.710 mm' },
        { label: 'Wheelbase', value: '2.820 mm' },
      ],
    },
    {
      kategori: 'Kapasitas & Roda',
      items: [
        { label: 'Volume Bagasi', value: '738 L' },
        { label: 'Tempat Duduk', value: '5 orang' },
        { label: 'Ban & Velg', value: '255/45 R21' },
      ],
    },
    {
      kategori: 'Keselamatan',
      items: [{ label: 'ADAS', value: '19 Fitur' }],
    },
  ],
};

/* Pesan singkat per model (hero) — dipakai carousel beranda & hero halaman model. */
export const heroPesan: Record<string, string> = {
  'j7-shs': 'Premium SUV with Hybrid Technology',
  j5: 'Urban Compact SUV with Advanced Technology',
  'j8-ardis': 'Powerful & Sophisticated Design',
  'j8-shs-ardis': 'Ultimate Performance PHEV Technology',
};

export interface AdasGroup {
  grup: string;
  items: { abbr: string; nama: string; ket: string }[];
}

/* ADAS sama untuk semua model (jumlah beda: J5 = 17, J7/J8 = 19). */
export const adasGroups: AdasGroup[] = [
  {
    grup: 'Cruise Control & Speed Assist',
    items: [
      { abbr: 'ACC', nama: 'Adaptive Cruise Control', ket: 'Atur kecepatan otomatis & jaga jarak aman dengan kendaraan depan.' },
      { abbr: 'CSA', nama: 'Curve Speed Assist', ket: 'Mengurangi kecepatan otomatis saat mendeteksi tikungan tajam.' },
      { abbr: 'TJA', nama: 'Traffic Jam Assist', ket: 'Bantu gas, rem & kemudi minor saat macet (< 60 km/jam).' },
      { abbr: 'ICA', nama: 'Integrated Cruise Assist', ket: 'Gabungan penjaga lajur tengah & cruise adaptif.' },
      { abbr: 'SLIF', nama: 'Speed Limit Information', ket: 'Membaca rambu batas kecepatan & menampilkannya.' },
      { abbr: 'SCF', nama: 'Speed Control Assist', ket: 'Membantu menyesuaikan kecepatan sesuai batas jalan.' },
    ],
  },
  {
    grup: 'Forward Collision',
    items: [
      { abbr: 'FCW', nama: 'Forward Collision Warning', ket: 'Peringatan potensi tabrakan dengan objek di depan.' },
      { abbr: 'AEB', nama: 'Autonomous Emergency Braking', ket: 'Rem darurat otomatis bila pengemudi tak merespons.' },
    ],
  },
  {
    grup: 'Keselamatan Lajur',
    items: [
      { abbr: 'LDW', nama: 'Lane Departure Warning', ket: 'Peringatan saat keluar marka tanpa sein.' },
      { abbr: 'LDP', nama: 'Lane Departure Prevention', ket: 'Koreksi setir halus untuk kembali ke lajur.' },
      { abbr: 'ELK', nama: 'Emergency Lane Keeping', ket: 'Intervensi kemudi darurat saat risiko tinggi keluar jalan.' },
      { abbr: 'LCA', nama: 'Lane Changing Assistance', ket: 'Deteksi ruang aman saat pindah lajur.' },
    ],
  },
  {
    grup: 'Belakang & Titik Buta',
    items: [
      { abbr: 'BSD', nama: 'Blind Spot Detection', ket: 'Pantau titik buta di sisi samping-belakang.' },
      { abbr: 'RCW', nama: 'Rear Collision Warning', ket: 'Peringatan & hazard saat kendaraan belakang melaju cepat.' },
      { abbr: 'RCTA', nama: 'Rear Cross Traffic Alert', ket: 'Peringatan kendaraan melintas saat mundur.' },
      { abbr: 'RCTB', nama: 'Rear Cross Traffic Braking', ket: 'Rem otomatis bila peringatan RCTA diabaikan saat mundur.' },
    ],
  },
  {
    grup: 'Monitoring & Visual',
    items: [
      { abbr: 'DMS', nama: 'Driver Monitoring System', ket: 'Deteksi kelelahan/fokus pengemudi lewat kamera.' },
      { abbr: 'DOW', nama: 'Door Opening Warning', ket: 'Peringatan sebelum membuka pintu bila ada yang mendekat.' },
      { abbr: 'AVM', nama: '540° Around View Monitor', ket: 'Pandangan 360° + transparent chassis (tembus kolong).' },
    ],
  },
];

export const adasCount: Record<string, number> = {
  j5: 17,
  'j7-shs': 19,
  'j8-ardis': 19,
  'j8-shs-ardis': 19,
};

/* Override foto hero halaman model (banner di bucket Harto). */
export const heroFotoOverride: Record<string, string> = {
  j5: 'https://fxjspvdkeybabxotniov.supabase.co/storage/v1/object/public/Harto/j5%20banner3.webp',
  'j7-shs': 'https://fxjspvdkeybabxotniov.supabase.co/storage/v1/object/public/Harto/J7%20banner3%20(1).webp',
};
