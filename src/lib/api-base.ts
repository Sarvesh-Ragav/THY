const PRODUCTION_API_URL = 'https://thy-756r.onrender.com/api/v1';

/**
 * Vercel has NEXT_PUBLIC_AUTH_API_URL set to localhost, and Next inlines that
 * into the browser bundle. Production builds must call Render instead.
 */
const configured = process.env.NEXT_PUBLIC_AUTH_API_URL;
const pointsAtLocalhost =
  !configured || configured.includes('localhost') || configured.includes('127.0.0.1');

/** Client API origin. Inlined at build time, so a Vercel rebuild is required after it changes. */
export const API_URL = (
  process.env.NODE_ENV === 'production' && pointsAtLocalhost
    ? PRODUCTION_API_URL
    : configured || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

export const API_ROOT = (process.env.NEXT_PUBLIC_SOCKET_URL || API_URL)
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '');
