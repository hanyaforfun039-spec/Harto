/* =============================================================================
   jaecoo-base · SITE RESOLVER
   Menentukan site config aktif.
   -----------------------------------------------------------------------------
   MULTI-KLIEN ("template lalu copy"): per folder klien, cukup ubah DEFAULT_SITE
   di bawah ini (atau set env SITE_ID saat build / di Vercel sebagai override).
   ============================================================================ */
import type { SiteConfig, SiteId } from './types';
import premium from '../data/sites/site-premium.json';
import hybrid from '../data/sites/site-hybrid.json';
import kredit from '../data/sites/site-kredit.json';
import area from '../data/sites/site-area.json';

const SITES: Record<SiteId, SiteConfig> = {
  premium: premium as SiteConfig,
  hybrid: hybrid as SiteConfig,
  kredit: kredit as SiteConfig,
  area: area as SiteConfig,
};

/** Ganti nilai ini per folder klien saat copy. (Harto = Web2 hybrid) */
const DEFAULT_SITE: SiteId = 'hybrid';

function resolveId(): SiteId {
  const fromEnv =
    typeof process !== 'undefined' && process.env ? process.env.SITE_ID : undefined;
  if (fromEnv && fromEnv in SITES) return fromEnv as SiteId;
  return DEFAULT_SITE;
}

export const activeSiteId: SiteId = resolveId();
export const site: SiteConfig = SITES[activeSiteId];
export { SITES };
