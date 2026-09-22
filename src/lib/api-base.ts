/** Client API origin. Inlined at build time, so a Vercel rebuild is required after it changes. */
export const API_URL = (
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'https://thy-756r.onrender.com/api/v1'
).replace(/\/$/, '');

export const API_ROOT = (process.env.NEXT_PUBLIC_SOCKET_URL || API_URL)
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '');
