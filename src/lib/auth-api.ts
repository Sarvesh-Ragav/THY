export interface AuthenticatedUser {
  id: string;
  phoneNumber?: string | null;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  authProvider?: 'phone' | 'google' | 'both';
  role: 'customer' | 'tailor' | 'admin' | null;
  hasPassword?: boolean;
}

export interface AccountCustomerProfile {
  fullName: string;
  email: string;
  city: string;
  address: string;
  phone?: string | null;
  avatarUrl?: string | null;
  preferences?: {
    shoppingFor?: string;
    contactMethod?: string;
    services?: string[];
    garmentTypes?: string[];
  } | null;
}

export interface AccountTailorProfile {
  fullName: string;
  shopName: string;
  yearsOfExperience: string;
  shopAddress: string;
  city: string;
  phone?: string | null;
  portfolio: Array<{ id: string; title: string; image: string; category: string; isFeatured?: boolean }>;
  verification?: {
    status: 'pending' | 'approved' | 'rejected';
    idType?: string;
    documentName?: string;
    submitted: boolean;
  } | null;
}

export interface AuthenticationResult {
  accessToken: string;
  user: AuthenticatedUser;
  customerProfile?: AccountCustomerProfile | null;
  tailorProfile?: AccountTailorProfile | null;
}

export interface OtpChallenge {
  challengeId: string;
  expiresAt: string;
  mockOtp?: string;
}

export class AuthApiError extends Error {
  constructor(message: string, public readonly code?: string) { super(message); }
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
    throw new AuthApiError('Unable to reach the authentication service. Please ensure the server is running.');
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) throw new AuthApiError(body.error?.message ?? 'Authentication request failed.', body.error?.code);
  return body.data as T;
}

export function requestOtp(phoneNumber: string): Promise<OtpChallenge> {
  return request('/auth/otp/request', { method: 'POST', body: JSON.stringify({ phoneNumber }) });
}

export function resendOtp(phoneNumber: string): Promise<OtpChallenge> {
  return request('/auth/otp/resend', { method: 'POST', body: JSON.stringify({ phoneNumber }) });
}

export function verifyOtp(phoneNumber: string, challengeId: string, otp: string): Promise<AuthenticationResult> {
  return request('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phoneNumber, challengeId, otp }) });
}

export function googleAuth(credential: string): Promise<AuthenticationResult> {
  return request('/auth/google/verify', { method: 'POST', body: JSON.stringify({ credential }) });
}

export function loginWithPassword(email: string, password: string): Promise<AuthenticationResult> {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export interface RegisterCustomerPayload {
  role: 'customer';
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterTailorPayload {
  role: 'tailor';
  fullName: string;
  phone: string;
  email: string;
  shopName: string;
  yearsOfExperience: number;
  shopAddress: string;
  password: string;
  confirmPassword: string;
}

export function registerAccount(
  payload: RegisterCustomerPayload | RegisterTailorPayload
): Promise<AuthenticationResult> {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateUserRole(role: 'customer' | 'tailor', accessToken?: string): Promise<{ user: AuthenticatedUser }> {
  return request('/auth/role', {
    method: 'PATCH',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: JSON.stringify({ role }),
  });
}

export function refreshAuthentication(): Promise<AuthenticationResult> {
  return request('/auth/refresh', { method: 'POST' });
}

export function requestPasswordReset(email: string): Promise<{ sent: true; resetToken?: string }> {
  return request('/auth/password/forgot', { method: 'POST', body: JSON.stringify({ email }) });
}

export function resetPassword(payload: {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<{ reset: true }> {
  return request('/auth/password/reset', { method: 'POST', body: JSON.stringify(payload) });
}

export async function logoutAuthentication(): Promise<void> {
  try { await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch { /* Local logout remains safe if the server is unavailable. */ }
}

export function updateCustomerAccount(
  payload: { fullName?: string; email?: string; city?: string },
  accessToken: string
): Promise<{ profile: AccountCustomerProfile }> {
  return request('/me/profile', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export function saveCustomerPreferences(
  payload: {
    shoppingFor: 'Myself' | 'Family' | 'Both';
    contactMethod: 'Phone' | 'WhatsApp' | 'Email';
    services: Array<'Stitching' | 'Alterations' | 'Custom outfits'>;
    garmentTypes: Array<'Ethnic wear' | 'Western wear' | 'Formal wear' | 'Kids wear'>;
  },
  accessToken: string
): Promise<{ preferences: AccountCustomerProfile['preferences'] }> {
  return request('/me/preferences', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export function updateTailorAccount(
  payload: {
    fullName?: string;
    shopName?: string;
    yearsOfExperience?: number;
    shopAddress?: string;
    city?: string;
    availability?: {
      isAvailable?: boolean;
      vacationMode?: boolean;
      maxActiveCapacity?: number;
      schedule?: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>;
    };
  },
  accessToken: string
): Promise<{ profile: AccountTailorProfile }> {
  return request('/tailors/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export function submitTailorVerification(
  payload: {
    idType: string;
    idNumber: string;
    documentName: string;
    documents: Array<{
      kind: 'government_id' | 'shop_proof';
      fileName: string;
      mimeType: string;
      dataUrl: string;
    }>;
  },
  accessToken: string
): Promise<{
  verification: {
    status: 'pending' | 'approved' | 'rejected';
    idType?: string;
    documentName?: string;
    submitted: boolean;
  };
}> {
  return request('/tailors/me/verification', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}
