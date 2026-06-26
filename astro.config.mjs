// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * URL produksi situs (dipakai sitemap, canonical, Open Graph).
 * MULTI-KLIEN ("template lalu copy"): cukup ganti nilai ini per folder klien,
 * atau set env SITE_URL saat build di Vercel.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://dealerjaecoosemarang.id';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [
    sitemap({
      // Halaman demo komponen internal — jangan diindeks mesin pencari.
      filter: (page) => !page.includes('/demo'),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
});
