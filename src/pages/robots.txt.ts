/* robots.txt dinamis — Sitemap mengikuti URL site aktif (per klien). */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://dealerjaecoosemarang.id');
  const sitemap = new URL('sitemap-index.xml', base).href;
  // /demo (galeri komponen internal) sudah noindex + tak masuk sitemap -> JANGAN
  // di-Disallow, supaya crawler tetap bisa membaca tag noindex-nya.
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
