/**
 * Super Admin frontend API configuration.
 *
 * Development: empty VITE_API_URL → relative `/api` via Vite proxy.
 * Production: VITE_API_URL=https://api.avichian.com (origin only; /api optional).
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

export function getApiOrigin(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (!raw || !raw.trim()) {
    if (import.meta.env.PROD) {
      console.error(
        '[AVICHIAN] VITE_API_URL is not set in this production build. ' +
          'Relative /api calls hit Netlify and return index.html (JSON parse fails). ' +
          'Set VITE_API_URL=https://your-backend-host in Netlify env, then Redeploy.',
      );
    }
    return '';
  }
  const origin = normalizeApiOrigin(raw);
  if (import.meta.env.PROD && /localhost|127\.0\.0\.1/.test(origin)) {
    console.error(
      '[AVICHIAN] VITE_API_URL points at localhost in a production build:',
      origin,
    );
  }
  return origin;
}

export function getApiBase(): string {
  const origin = getApiOrigin();
  if (origin) return `${origin}/api`;
  if (import.meta.env.PROD) {
    throw new Error(
      'VITE_API_URL is not configured in this production build. ' +
        'Set the GitHub Actions variable (or Netlify env) VITE_API_URL to your Express backend origin, then redeploy. ' +
        'Relative /api only works in local Vite dev.',
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
  if (url.startsWith('/') && origin) {
    return `${origin}${url}`;
  }
  return url;
}
