export type UserRole = 'tailor' | 'customer';
export type VerificationStatus = 'pending';
export type RequestStatus = 'Pending Quotation' | 'Quotation Submitted';
export type OrderStatus = 'In Progress' | 'Fitting Scheduled' | 'Ready to Stitch/Deliver';

export const WORKING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type WorkingDay = (typeof WORKING_DAYS)[number];

export interface TailorProfile {
  fullName: string;
  phone: string;
  shopName: string;
  yearsOfExperience: string;
  shopAddress: string;
}

export interface TailorVerification {
  idType: string;
  idNumber: string;
  documentName: string;
  status: VerificationStatus;
}

export interface TailorAvailability {
  isAvailable: boolean;
  vacationMode: boolean;
  workingDays: Record<WorkingDay, boolean>;
}

export interface TailorQuote {
  price: string;
  estimatedDays: string;
  notes: string;
}

export interface TailorOrderRequest {
  id: string;
  customerName: string;
  garmentType: string;
  fabricProvided: string;
  measurements: string;
  requirements: string;
  status: RequestStatus;
  quote?: TailorQuote;
}

export interface TailorActiveOrder {
  id: string;
  customerName: string;
  garmentType: string;
  status: OrderStatus;
  expectedCompletion: string;
  fabricDetails: string;
  measurements: string;
}

export interface TailorSession {
  identifier: string;
  role: UserRole | null;
  isAuthenticated: boolean;
  profile: TailorProfile | null;
  verification: TailorVerification | null;
  availability: TailorAvailability;
  requests: TailorOrderRequest[];
  orders: TailorActiveOrder[];
}

export const TAILOR_SESSION_KEY = 'thy-tailor-session';

export const DEFAULT_WORKING_DAYS: Record<WorkingDay, boolean> = {
  Monday: true,
  Tuesday: true,
  Wednesday: true,
  Thursday: true,
  Friday: true,
  Saturday: true,
  Sunday: false,
};

export const DEFAULT_AVAILABILITY: TailorAvailability = {
  isAvailable: true,
  vacationMode: false,
  workingDays: DEFAULT_WORKING_DAYS,
};

export const DEFAULT_REQUESTS: TailorOrderRequest[] = [
  {
    id: 'REQ-101',
    customerName: 'Ananya Sharma',
    garmentType: 'Custom Designer Anarkali',
    fabricProvided: 'Yes (Silk & Net)',
    measurements: 'Bust: 34", Waist: 28", Length: 52"',
    requirements: 'Double inner lining, subtle gold piping on neck.',
    status: 'Pending Quotation',
  },
  {
    id: 'REQ-102',
    customerName: 'Rohan Gupta',
    garmentType: '3-Piece Slim Fit Suit',
    fabricProvided: 'No (Tailor to source Raymond Wool)',
    measurements: 'Chest: 40", Waist: 32", Shoulder: 18"',
    requirements: 'Satin lapel, double vent back, tapered trousers.',
    status: 'Pending Quotation',
  },
];

export const DEFAULT_ORDERS: TailorActiveOrder[] = [
  {
    id: 'ORD-8091',
    customerName: 'Priya Verma',
    garmentType: 'Embroidered Lehenga Choli',
    status: 'In Progress',
    expectedCompletion: '2026-09-18',
    fabricDetails: 'Velvet & Raw Silk',
    measurements: 'Standard Size M (Customized Waist)',
  },
  {
    id: 'ORD-8095',
    customerName: 'Vikram Mehta',
    garmentType: 'Tuxedo Jacket & Trousers',
    status: 'Fitting Scheduled',
    expectedCompletion: '2026-09-14',
    fabricDetails: 'Italian Wool',
    measurements: 'Custom Fitted',
  },
];

export function createDefaultSession(): TailorSession {
  return {
    identifier: '',
    role: null,
    isAuthenticated: false,
    profile: null,
    verification: null,
    availability: {
      ...DEFAULT_AVAILABILITY,
      workingDays: { ...DEFAULT_WORKING_DAYS },
    },
    requests: DEFAULT_REQUESTS.map((request) => ({ ...request })),
    orders: DEFAULT_ORDERS.map((order) => ({ ...order })),
  };
}

export function hasTailorProfile(session: TailorSession): boolean {
  return Boolean(session.profile?.fullName && session.profile.phone && session.profile.shopName);
}

export function hasSubmittedVerification(session: TailorSession): boolean {
  return Boolean(session.verification?.idNumber);
}

export function isTailorOnboardingComplete(session: TailorSession): boolean {
  return hasTailorProfile(session) && hasSubmittedVerification(session);
}

export function getPostAuthPath(session: TailorSession): string {
  if (!hasTailorProfile(session)) return '/tailor-registration';
  if (!hasSubmittedVerification(session)) return '/tailor-verification';
  return '/tailor-dashboard';
}

export function getPendingRequestCount(session: TailorSession): number {
  return session.requests.filter((request) => request.status === 'Pending Quotation').length;
}

export function isStudioReceivingOrders(session: TailorSession): boolean {
  return session.availability.isAvailable && !session.availability.vacationMode;
}

export function getTailorFirstName(session: TailorSession): string {
  const fullName = session.profile?.fullName?.trim();
  if (!fullName) return 'Tailor';
  return fullName.split(/\s+/)[0];
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function loadTailorSession(): TailorSession {
  const fallback = createDefaultSession();
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(TAILOR_SESSION_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<TailorSession>;
    return {
      ...fallback,
      ...parsed,
      availability: {
        ...fallback.availability,
        ...parsed.availability,
        workingDays: {
          ...fallback.availability.workingDays,
          ...parsed.availability?.workingDays,
        },
      },
      requests: Array.isArray(parsed.requests) ? parsed.requests : fallback.requests,
      orders: Array.isArray(parsed.orders) ? parsed.orders : fallback.orders,
      profile: parsed.profile ?? null,
      verification: parsed.verification ?? null,
    };
  } catch {
    return fallback;
  }
}

export function persistTailorSession(session: TailorSession): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(TAILOR_SESSION_KEY, JSON.stringify(session));
}
