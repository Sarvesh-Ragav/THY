import { API_URL } from '@/lib/api-base';
import type { StudioNotification } from '@/lib/tailor-session';

export type InboxItem = StudioNotification & {
  audience?: 'customer' | 'tailor';
  threadId?: string;
};

async function inboxFetch<T>(path: string, accessToken: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}/notifications${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message || 'Unable to load notifications.');
  }
  return body.data as T;
}

export function listInbox(accessToken: string): Promise<{ notifications: InboxItem[] }> {
  return inboxFetch('/', accessToken);
}

export function markInboxItemRead(id: string, accessToken: string): Promise<{ notification: InboxItem | null }> {
  return inboxFetch(`/${encodeURIComponent(id)}/read`, accessToken, { method: 'PATCH' });
}

export function markInboxAllRead(accessToken: string): Promise<{ updated: number }> {
  return inboxFetch('/read-all', accessToken, { method: 'PATCH' });
}
