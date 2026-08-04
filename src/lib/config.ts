/**
 * Super Admin API configuration — same rules as student app.
 * Runtime: public/config.json { "apiUrl": "https://your-api" }
 */

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export function normalizeApiOrigin(raw: string): string {
  let url = stripTrailingSlash(raw.trim());
  if (url.toLowerCase().endsWith('/api')) {
    url = stripTrailingSlash(url.slice(0, -4));
  }
  return url;
}

let runtimeApiOrigin = '';
let configLoaded = false;

export async function loadRuntimeConfig(): Promise<void> {
  if (configLoaded) return;
  configLoaded = true;
  try {
    const base = import.meta.env.BASE_URL || '/';
    const res = await fetch(`${base}config.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const json = (await res.json()) as { apiUrl?: string; VITE_API_URL?: string };
    const raw = json.apiUrl || json.VITE_API_URL;
    if (raw?.trim()) {
      runtimeApiOrigin = normalizeApiOrigin(raw);
      console.info('[AVICHIAN] API origin from config.json:', runtimeApiOrigin);
    }
  } catch {
    /* optional */
  }
}

function isHostedStaticFrontend(): boolean {
  if (typeof window === 'undefined') return Boolean(import.meta.env.PROD);
  const h = window.location.hostname;
  return (
    h.includes('github.io') ||
    h.includes('netlify.app') ||
    h.includes('vercel.app') ||
    h.includes('pages.dev')
  );
}

export function getApiOrigin(): string {
  if (runtimeApiOrigin) return runtimeApiOrigin;
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (raw?.trim()) return normalizeApiOrigin(raw);
  if (import.meta.env.PROD || isHostedStaticFrontend()) {
    console.error('[AVICHIAN] No API URL — set public/config.json { "apiUrl": "https://YOUR-API" }');
  }
  return '';
}

export function getApiBase(): string {
  const origin = getApiOrigin();
  if (origin) return `${origin}/api`;
  if (import.meta.env.PROD || isHostedStaticFrontend()) {
    throw new Error(
      'API URL is not configured (relative /api returns HTML on static hosts). ' +
        'Set config.json apiUrl or VITE_API_URL to your Express backend, then redeploy.',
    );
  }
  return '/api';
}

export function isCrossOriginApi(): boolean {
  return Boolean(getApiOrigin());
}

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const origin = getApiOrigin();
  if (url.startsWith('/') && origin) return `${origin}${url}`;
  return url;
}
