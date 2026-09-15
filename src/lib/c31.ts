import { TAILORS } from '@/lib/customer-home-data';

const C31_KEY = 'thy-c31-commerce';

export type ChatEntry = 'profile' | 'estimate' | 'order';
export type AttachmentKind = 'measurements' | 'fabric' | 'design';
export type MessageKind = 'text' | 'voice' | 'attachment' | 'quotation' | 'system';
export type MessageStatus = 'sending' | 'uploading' | 'sent' | 'delivered' | 'read' | 'failed';
export type ThreadStatus =
  | 'new'
  | 'active'
  | 'request_sent'
  | 'needs_clarification'
  | 'price_fixed'
  | 'quotation_updated';

export interface SavedMeasurement {
  id: string;
  label: string;
  details: string;
}

export interface ChatAttachment {
  kind: AttachmentKind;
  title: string;
  preview?: string;
  href?: string;
  details?: string;
}

export interface QuotationCard {
  id: string;
  price: string;
  note: string;
  sentAt: string;
  updated?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'tailor';
  kind: MessageKind;
  text?: string;
  createdAt: string;
  status: MessageStatus;
  attachment?: ChatAttachment;
  voiceUrl?: string;
  voiceDuration?: number;
  quotation?: QuotationCard;
}

export interface OrderRequest {
  id: string;
  garment: string;
  fabric: string;
  measurements: string;
  customization: string;
  stitching: string;
  status: 'sent' | 'needs_clarification' | 'priced';
}

export interface CartItem {
  id: string;
  quotationId: string;
  threadId: string;
  tailorName: string;
  garment: string;
  price: string;
}

export interface PlacedOrder {
  id: string;
  title: string;
  status: string;
  tailorName: string;
  price?: string;
  threadId: string;
}

export interface ChatThread {
  id: string;
  tailorId: string;
  tailorName: string;
  tailorStudio: string;
  verified: boolean;
  online: boolean;
  status: ThreadStatus;
  request?: OrderRequest;
  quotation?: QuotationCard;
  messages: ChatMessage[];
}

export interface C31State {
  measurements: SavedMeasurement[];
  threads: ChatThread[];
  cart: CartItem[];
  orders: PlacedOrder[];
  checkoutAddress: string;
}

export const DEFAULT_MEASUREMENTS: SavedMeasurement[] = [
  {
    id: 'm-ananya',
    label: 'Ananya – Regular Fit',
    details: 'Last updated: 12 Aug 2026',
  },
  {
    id: 'm-profile',
    label: 'Saved profile set',
    details: 'Bust 36 in · Waist 30 in · Shoulder 14.5 in · Arm 10 in',
  },
  {
    id: 'm-blouse',
    label: 'Blouse fitting set',
    details: 'Bust 34 in · Waist 28 in · Neck depth 7 in · Shoulder 14 in',
  },
];

export function emptyC31(): C31State {
  return {
    measurements: DEFAULT_MEASUREMENTS,
    threads: [],
    cart: [],
    orders: [],
    checkoutAddress: '',
  };
}

export function loadC31(): C31State {
  if (typeof window === 'undefined') return emptyC31();
  try {
    const raw = window.localStorage.getItem(C31_KEY);
    if (!raw) return emptyC31();
    const parsed = JSON.parse(raw) as Partial<C31State>;
    return {
      measurements: Array.isArray(parsed.measurements) && parsed.measurements.length
        ? parsed.measurements
        : DEFAULT_MEASUREMENTS,
      threads: Array.isArray(parsed.threads) ? parsed.threads : [],
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      checkoutAddress: parsed.checkoutAddress || '',
    };
  } catch {
    return emptyC31();
  }
}

export function persistC31(state: C31State) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(C31_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota; in-memory state still works for this visit.
  }
}

export function tailorDirectoryEntry(tailorId?: string | null) {
  return TAILORS.find((item) => item.id === tailorId) ?? TAILORS[0];
}

export function chatHref(tailorId: string, from: ChatEntry = 'profile') {
  return `/chat?tailor=${encodeURIComponent(tailorId)}&from=${from}`;
}

export function estimateHref(threadId: string) {
  return `/estimate-details?thread=${encodeURIComponent(threadId)}`;
}

export function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ensureThread(state: C31State, tailorId?: string | null): { state: C31State; thread: ChatThread } {
  const tailor = tailorDirectoryEntry(tailorId);
  const existing = state.threads.find((thread) => thread.tailorId === tailor.id);
  if (existing) {
    return { state, thread: existing };
  }
  const thread: ChatThread = {
    id: `thread-${tailor.id}`,
    tailorId: tailor.id,
    tailorName: tailor.name,
    tailorStudio: tailor.studio,
    verified: true,
    online: true,
    status: 'new',
    messages: [
      {
        id: `sys-${Date.now()}`,
        sender: 'tailor',
        kind: 'system',
        text: `You can talk through design, fabric, measurements, customization, stitching, and price with ${tailor.name}.`,
        createdAt: nowStamp(),
        status: 'read',
      },
    ],
  };
  const next = { ...state, threads: [thread, ...state.threads] };
  return { state: next, thread };
}

export function patchThread(
  state: C31State,
  threadId: string,
  patch: (thread: ChatThread) => ChatThread,
): C31State {
  return {
    ...state,
    threads: state.threads.map((thread) => (thread.id === threadId ? patch(thread) : thread)),
  };
}

export function appendMessage(state: C31State, threadId: string, message: ChatMessage): C31State {
  return patchThread(state, threadId, (thread) => ({
    ...thread,
    status: thread.status === 'new' ? 'active' : thread.status,
    messages: [...thread.messages, message],
  }));
}

export function setMessageStatus(
  state: C31State,
  threadId: string,
  messageId: string,
  status: MessageStatus,
): C31State {
  return patchThread(state, threadId, (thread) => ({
    ...thread,
    messages: thread.messages.map((message) =>
      message.id === messageId ? { ...message, status } : message,
    ),
  }));
}

export function findThread(state: C31State, threadId?: string | null) {
  return state.threads.find((thread) => thread.id === threadId) ?? null;
}

export function findQuotationThread(state: C31State, quotationId?: string | null) {
  return state.threads.find((thread) => thread.quotation?.id === quotationId) ?? null;
}
