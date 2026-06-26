/* =============================================================================
   jaecoo-base · SCHEMA (JSON-LD)
   Builder structured data. Output objek polos -> di-serialize SEOHead.
   Properti undefined otomatis dibuang oleh JSON.stringify.
   Target valid di Google Rich Results Test.
   ============================================================================ */
import type { Car, CarFaq, SiteConfig } from './types';
import { hargaMulai, hargaTertinggi } from './cars';

function abs(path: string, base: string): string {
  try {
    return new URL(path, base).href;
  } catch {
    return path;
  }
}

/** Logo brand (SVG/webp di Supabase Storage) — sama untuk semua klien JAECOO. */
const BRAND_LOGO =
  'https://yvbpnlbwaundqhyrvdwg.supabase.co/storage/v1/object/public/Faiz/grey-logo.webp';

/** Provinsi cakupan untuk sinyal "+area" (di luar kota di serviceAreas). */
const PROVINCE = 'Jawa Tengah';

/** Daftar areaServed: tiap kota (City) + provinsi (AdministrativeArea). */
function areaServedList(site: SiteConfig) {
  return [
    ...site.serviceAreas.map((a) => ({ '@type': 'City', name: a })),
    { '@type': 'AdministrativeArea', name: PROVINCE },
  ];
}

/** AutoDealer / LocalBusiness — dipakai di semua halaman. */
export function autoDealerSchema(site: SiteConfig, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: site.dealerName,
    description: site.positioning,
    url: baseUrl,
    telephone: `+${site.whatsapp.replace(/[^0-9]/g, '')}`,
    image: abs(site.seo.ogImage, baseUrl),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: site.geo
      ? { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng }
      : undefined,
    areaServed: areaServedList(site),
    openingHoursSpecification: site.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.hari,
      opens: h.buka,
      closes: h.tutup,
    })),
    brand: { '@type': 'Brand', name: 'JAECOO' },
    sameAs: site.social ? Object.values(site.social).filter(Boolean) : undefined,
  };
}

/** Product + offers — halaman detail mobil.
   `additionalProperty` opsional (Web2 hybrid): jenis bahan bakar & jarak tempuh. */
export function productSchema(
  car: Car,
  site: SiteConfig,
  pageUrl: string,
  baseUrl: string,
  additionalProperty?: { name: string; value: string }[],
) {
  const low = hargaMulai(car);
  const high = hargaTertinggi(car);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.nama,
    description: car.tagline,
    category: car.kategori,
    brand: { '@type': 'Brand', name: 'JAECOO' },
    image: [
      /^https?:\/\//.test(car.foto.hero.src)
        ? car.foto.hero.src
        : abs(`/img/cars/${car.foto.hero.src}`, baseUrl),
    ],
    url: pageUrl,
    additionalProperty:
      additionalProperty && additionalProperty.length
        ? additionalProperty.map((p) => ({ '@type': 'PropertyValue', name: p.name, value: p.value }))
        : undefined,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: low,
      highPrice: high,
      offerCount: car.varian.length,
      availability: 'https://schema.org/InStock',
      areaServed: areaServedList(site),
      seller: { '@type': 'AutoDealer', name: site.dealerName },
    },
  };
}

/** Organization — identitas brand di beranda. */
export function organizationSchema(site: SiteConfig, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.brand,
    url: baseUrl,
    logo: BRAND_LOGO,
    sameAs: site.social ? Object.values(site.social).filter(Boolean) : undefined,
  };
}

/** WebSite — entitas situs di beranda. */
export function webSiteSchema(site: SiteConfig, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.brand,
    url: baseUrl,
    inLanguage: 'id-ID',
  };
}

/** FAQPage — halaman yang memuat FAQ. */
export function faqPageSchema(faqs: CarFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** BreadcrumbList — navigasi remah. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
