const API_URL = (process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');
const SERVER_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, '');

export interface ChatProduct {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  fabricRef?: string;
}

export interface ChatQuotation {
  id: string;
  price: string;
  notes?: string;
  sentAt?: string;
  updated?: boolean;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface ChatAttachment {
  kind: 'measurements' | 'fabric' | 'design';
  title: string;
  preview?: string | null;
  href?: string | null;
  details?: string | null;
}

export interface ChatMessage {
  _id: string;
  id?: string;
  clientId?: string;
  threadId: string;
  sender: 'customer' | 'tailor' | 'system';
  kind: 'text' | 'voice' | 'product_share' | 'measurements' | 'quotation' | 'attachment' | 'system';
  text?: string | null;
  product?: ChatProduct | null;
  measurements?: Record<string, any> | null;
  quotation?: ChatQuotation | null;
  attachment?: ChatAttachment | null;
  voiceUrl?: string | null;
  voiceDuration?: number | null;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

export interface ChatThread {
  _id: string;
  id?: string;
  threadKey: string;
  customerId: string;
  tailorId: string;
  customerName: string;
  tailorName: string;
  tailorStudio: string;
  status: 'new' | 'active' | 'request_sent' | 'needs_clarification' | 'price_fixed' | 'quotation_updated';
  lastMessage?: {
    text: string;
    sender: string;
    kind: string;
    sentAt: string;
  };
  activeQuotation?: ChatQuotation | null;
  unreadCountCustomer: number;
  unreadCountTailor: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDesign {
  _id: string;
  id?: string;
  title: string;
  category: string;
  previewImageUrl: string;
  tryOnImageUrl?: string | null;
  attributes?: Record<string, string>;
  status?: string;
}

export interface SavedCustomerMeasurement {
  _id: string;
  id?: string;
  label: string;
  category: string;
  values: Record<string, any>;
  unit: string;
  notes?: string;
  isDefault?: boolean;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  return `${SERVER_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

async function chatFetch<T>(path: string, options: RequestInit = {}, accessToken?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}/chat${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || 'Chat API request failed');
  }

  return body.data as T;
}

export async function ensureThread(tailorId: string, accessToken?: string | null): Promise<ChatThread> {
  const data = await chatFetch<{ thread: ChatThread }>(
    '/threads',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tailorId }),
    },
    accessToken
  );
  return data.thread;
}

export async function listThreads(accessToken?: string | null): Promise<ChatThread[]> {
  const data = await chatFetch<{ threads: ChatThread[] }>('/threads', { method: 'GET' }, accessToken);
  return data.threads;
}

export async function listMessages(
  threadId: string,
  accessToken?: string | null,
  before?: string
): Promise<ChatMessage[]> {
  const query = before ? `?before=${encodeURIComponent(before)}` : '';
  const data = await chatFetch<{ messages: ChatMessage[] }>(
    `/threads/${encodeURIComponent(threadId)}/messages${query}`,
    { method: 'GET' },
    accessToken
  );
  return data.messages;
}

export async function uploadChatMedia(
  file: Blob | File,
  threadId: string,
  accessToken?: string | null,
  filename?: string
): Promise<{ id: string; url: string; mimeType: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file, filename || (file instanceof File ? file.name : 'voice-note.webm'));
  formData.append('threadId', threadId);

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}/chat/upload`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || 'Media upload failed');
  }

  return body.data;
}

export async function listCustomerDesigns(accessToken?: string | null): Promise<CustomerDesign[]> {
  const data = await chatFetch<{ designs: CustomerDesign[] }>('/designs', { method: 'GET' }, accessToken);
  return data.designs;
}

export async function listCustomerMeasurements(accessToken?: string | null): Promise<SavedCustomerMeasurement[]> {
  const data = await chatFetch<{ measurements: SavedCustomerMeasurement[] }>(
    '/measurements',
    { method: 'GET' },
    accessToken
  );
  return data.measurements;
}
