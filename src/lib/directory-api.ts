import type { DirectoryPortfolioItem, PublicDirectoryTailor } from '@/lib/directory';

export class DirectoryApiError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
  }
}

const API_URL = (process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
      ...options,
    });
  } catch {
    throw new DirectoryApiError('Unable to reach the tailor directory. Please ensure the server is running.');
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new DirectoryApiError(body.error?.message ?? 'Directory request failed.', body.error?.code);
  }
  return body.data as T;
}

let directoryCache: PublicDirectoryTailor[] | null = null;

export function cachedDirectoryTailor(id?: string | null): PublicDirectoryTailor | null {
  if (!id) return null;
  return directoryCache?.find((tailor) => tailor.id === id) ?? null;
}

export async function fetchDirectoryTailors(query?: { q?: string; city?: string }): Promise<PublicDirectoryTailor[]> {
  const params = new URLSearchParams({ limit: '50' });
  if (query?.q) params.set('q', query.q);
  if (query?.city) params.set('city', query.city);
  const data = await request<{ items: PublicDirectoryTailor[] }>(`/tailors?${params.toString()}`);
  directoryCache = data.items ?? [];
  return directoryCache;
}

export async function fetchDirectoryTailor(id: string): Promise<PublicDirectoryTailor> {
  const cached = cachedDirectoryTailor(id);
  const data = await request<{ tailor: PublicDirectoryTailor }>(`/tailors/${encodeURIComponent(id)}`);
  const tailor = data.tailor;
  if (directoryCache) {
    const index = directoryCache.findIndex((item) => item.id === tailor.id);
    if (index >= 0) directoryCache[index] = tailor;
    else directoryCache.push(tailor);
  } else if (!cached) {
    directoryCache = [tailor];
  }
  return tailor;
}

export async function saveTailorPortfolio(
  portfolio: Array<Pick<DirectoryPortfolioItem, 'id' | 'title' | 'image' | 'category'> & { isFeatured?: boolean }>,
  accessToken: string
): Promise<DirectoryPortfolioItem[]> {
  const data = await request<{ portfolio: DirectoryPortfolioItem[] }>('/tailors/me/portfolio', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ portfolio }),
  });
  return data.portfolio;
}
