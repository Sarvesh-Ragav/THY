import type {
  AuthenticatedUser,
  AuthenticationResult,
} from '@/lib/auth-api';

const API_URL = (process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');

export class AdminApiError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
  }
}

async function request<T>(token: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new AdminApiError(body.error?.message ?? 'Admin request failed.', body.error?.code);
  }
  return body.data as T;
}

export interface AdminOverview {
  tailors: number;
  customers: number;
  orders: number;
  pendingVerifications: number;
}

export interface AdminTailor {
  id: string;
  fullName: string;
  shopName: string;
  city: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  isDirectoryActive: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  verificationDocument: string | null;
  verificationIdType?: string | null;
  reviewNotes?: string;
  documentCount: number;
  documents: Array<{ kind: 'government_id' | 'shop_proof'; fileName: string; mimeType: string }>;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  yearsOfExperience: number;
}

export interface AdminVerificationReview {
  id: string;
  shopName: string;
  fullName: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  idType: string | null;
  documentName: string | null;
  reviewNotes: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  documents: Array<{
    kind: 'government_id' | 'shop_proof';
    fileName: string;
    mimeType: string;
    dataUrl: string;
  }>;
}

export interface AdminCustomer {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  city: string;
  address: string;
  isActive: boolean;
}

export interface AdminOrder {
  id: string;
  tailorName: string;
  garmentName: string;
  amountPaise: number;
  paymentStatus: string;
  fulfillmentStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  deliveryAddress?: { addressLine?: string; city?: string };
  createdAt?: string;
}

export function getAdminOverview(token: string) {
  return request<AdminOverview>(token, '/admin/overview');
}

export function listAdminTailors(token: string) {
  return request<{ tailors: AdminTailor[] }>(token, '/admin/tailors');
}

export function verifyAdminTailor(
  token: string,
  userId: string,
  status: 'approved' | 'rejected' | 'pending',
  reviewNotes?: string
) {
  return request(token, `/admin/tailors/${encodeURIComponent(userId)}/verification`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reviewNotes }),
  });
}

export function getAdminTailorVerification(token: string, userId: string) {
  return request<AdminVerificationReview>(token, `/admin/tailors/${encodeURIComponent(userId)}/verification`);
}

export function setAdminTailorDirectory(token: string, userId: string, isDirectoryActive: boolean) {
  return request(token, `/admin/tailors/${encodeURIComponent(userId)}/directory`, {
    method: 'PATCH',
    body: JSON.stringify({ isDirectoryActive }),
  });
}

export function listAdminCustomers(token: string) {
  return request<{ customers: AdminCustomer[] }>(token, '/admin/customers');
}

export function setAdminUserActive(token: string, userId: string, isActive: boolean) {
  return request(token, `/admin/users/${encodeURIComponent(userId)}/active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export function listAdminOrders(token: string) {
  return request<{ orders: AdminOrder[] }>(token, '/admin/orders');
}

export function updateAdminOrderFulfillment(
  token: string,
  orderId: string,
  fulfillmentStatus: AdminOrder['fulfillmentStatus']
) {
  return request<{ order: AdminOrder }>(token, `/admin/orders/${encodeURIComponent(orderId)}/fulfillment`, {
    method: 'PATCH',
    body: JSON.stringify({ fulfillmentStatus }),
  });
}

export type { AuthenticatedUser, AuthenticationResult };
