import type { CreatePaymentOrderInput, PersistedOrder, RazorpayCheckoutResponse } from '@/types/payment';

const API_URL = (process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');

export class PaymentApiError extends Error {
  constructor(message: string, public readonly code?: string) { super(message); }
}

async function request<T>(token: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) throw new PaymentApiError(body.error?.message ?? 'Payment request failed.', body.error?.code);
  return body.data as T;
}

export function createPaymentOrder(token: string, input: CreatePaymentOrderInput) { return request<{ order: PersistedOrder; checkout: { keyId: string; razorpayOrderId: string; amountPaise: number; currency: string } }>(token, '/payments/orders', { method: 'POST', body: JSON.stringify(input) }); }
export function verifyPayment(token: string, orderId: string, response: RazorpayCheckoutResponse) { return request<{ order: PersistedOrder }>(token, '/payments/verify', { method: 'POST', body: JSON.stringify({ orderId, razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature }) }); }
export function getOrder(token: string, orderId: string) { return request<{ order: PersistedOrder }>(token, `/payments/orders/${encodeURIComponent(orderId)}`); }
export function getOrders(token: string) { return request<{ orders: PersistedOrder[] }>(token, '/payments/orders'); }

export function loadRazorpayCheckout(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Razorpay Checkout is only available in a browser.'));
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    if (existing) { existing.addEventListener('load', () => resolve(), { once: true }); existing.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout.')), { once: true }); return; }
    const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.async = true; script.dataset.razorpayCheckout = 'true'; script.onload = () => resolve(); script.onerror = () => reject(new Error('Unable to load Razorpay Checkout.')); document.body.appendChild(script);
  });
}

export function formatPaise(amountPaise: number): string { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amountPaise / 100); }
export function quoteToPaise(value: string | undefined): number | null { const normalized = (value ?? '').split(String.fromCharCode(0x20b9)).join('').split(',').join('').trim(); const match = normalized.match(/^([0-9]+)(?:[.]([0-9]{1,2}))?$/); if (!match) return null; const paise = Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0')); return Number.isSafeInteger(paise) && paise > 0 ? paise : null; }

export interface RazorpayOptions { key: string; amount: number; currency: string; name: string; description: string; order_id: string; handler: (response: RazorpayCheckoutResponse) => void; modal?: { ondismiss: () => void }; prefill?: { contact?: string; email?: string; name?: string }; theme?: { color: string }; }
declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => { open: () => void }; } }
